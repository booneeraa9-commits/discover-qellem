"""Language-aware response shaping for the public API (issue #84).

Multilingual content lives in ``*_om`` / ``*_en`` / ``*_am`` companion
fields. This module adds a ``?lang=om|en|am`` query parameter to the
API viewsets that serve that content:

- ``?lang=<code>``: every companion group is resolved to a single value
  under its generic base key (``title``, ``body``, ...), preferring the
  requested language and falling back to Afaan Oromoo, then English.
  The suffixed keys are removed from the response.
- no ``lang`` parameter: the response keeps every suffixed key
  unchanged (backwards compatible) and additionally exposes a
  ``translations`` object mapping each base key to its three
  language-keyed values, which the frontend (#29) consumes.
"""

from wagtail.api.v2.utils import BadRequestError

LANGUAGE_CODES = ("om", "en", "am")
FALLBACK_ORDER = ("om", "en")
_SUFFIXES = tuple(f"_{code}" for code in LANGUAGE_CODES)


def _companion_bases(data):
    """Return base names that carry at least two language companions."""

    bases = set()
    for key in data:
        for suffix in _SUFFIXES:
            if key.endswith(suffix):
                base = key[: -len(suffix)]
                siblings = sum(
                    1 for code in LANGUAGE_CODES if f"{base}_{code}" in data
                )
                if base and siblings >= 2:
                    bases.add(base)
    return bases


def _resolve(data, base, lang):
    """Pick the requested language with OM-then-EN fallback."""

    for code in (lang, *FALLBACK_ORDER):
        value = data.get(f"{base}_{code}")
        if value not in (None, ""):
            return value
    return data.get(f"{base}_om", "")


def _transform(data, lang):
    if isinstance(data, list):
        for item in data:
            _transform(item, lang)
        return data
    if not isinstance(data, dict):
        return data

    for value in data.values():
        _transform(value, lang)

    bases = _companion_bases(data)
    if not bases:
        return data

    if lang:
        for base in sorted(bases):
            data[base] = _resolve(data, base, lang)
            for code in LANGUAGE_CODES:
                data.pop(f"{base}_{code}", None)
    else:
        data["translations"] = {
            base: {
                code: data.get(f"{base}_{code}", "")
                for code in LANGUAGE_CODES
            }
            for base in sorted(bases)
        }
    return data


class LanguageAwareAPIViewSetMixin:
    """Add ``?lang=`` handling to a Wagtail API v2 viewset."""

    def _requested_language(self):
        lang = self.request.GET.get("lang", "").strip()
        if not lang:
            return None
        if lang not in LANGUAGE_CODES:
            raise BadRequestError(
                "lang must be one of: " + ", ".join(LANGUAGE_CODES)
            )
        return lang

    def listing_view(self, request):
        response = super().listing_view(request)
        _transform(response.data, self._requested_language())
        return response

    def detail_view(self, request, pk):
        response = super().detail_view(request, pk)
        _transform(response.data, self._requested_language())
        return response
