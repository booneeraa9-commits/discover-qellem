"use client";

import { useRef, useState } from "react";
import { Send } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { CMS_MOCK, postCms } from "@/lib/cms";
import { useT } from "@/lib/i18n-client";

export interface PlaceOption {
  slug: string;
  name: string;
}

type Status = "idle" | "submitting" | "success" | "error";

const STORY_MIN_CHARS = 20;

/** Map the story textarea to the language-specific backend field. */
function storyFieldFor(lang: "en" | "om" | "am"): "story_om" | "story_en" | "story_am" {
  if (lang === "om") return "story_om";
  if (lang === "am") return "story_am";
  return "story_en";
}

/** Collapse DRF field errors into the form's field ids. */
function normalizeFieldErrors(data: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!data || typeof data !== "object") return out;
  const record = data as Record<string, unknown>;
  const aliases: Record<string, string> = {
    story_om: "story",
    story_en: "story",
    story_am: "story",
    place: "woreda",
    author_name: "name",
  };
  for (const [field, value] of Object.entries(record)) {
    const message = Array.isArray(value) ? value[0] : value;
    const id = aliases[field] ?? field;
    if (typeof message === "string") out[id] = message;
  }
  return out;
}

export default function ContributeForm({ places }: { places: PlaceOption[] }) {
  const { t, lang } = useT();

  const [name, setName] = useState("");
  const [woreda, setWoreda] = useState("");
  const [story, setStory] = useState("");
  const [rights, setRights] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot — must stay empty
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);
  const storyRef = useRef<HTMLTextAreaElement>(null);
  const rightsRef = useRef<HTMLInputElement>(null);

  const submitting = status === "submitting";

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (story.trim().length < STORY_MIN_CHARS) errs.story = t("contribute.tooShort");
    if (!rights) errs.rights = t("contribute.required");
    return errs;
  };

  const focusFirstInvalid = (errs: Record<string, string>) => {
    if (errs.story) storyRef.current?.focus();
    else if (errs.rights) rightsRef.current?.focus();
    else if (errs.name) nameRef.current?.focus();
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSummary("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      focusFirstInvalid(errs);
      return;
    }
    if (CMS_MOCK) {
      setSummary(t("contribute.mock"));
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const payload: Record<string, string> = {
        author_name: name.trim(),
        place: woreda,
        [storyFieldFor(lang)]: story.trim(),
        website,
      };
      const result = await postCms<Record<string, unknown>>("/community-stories/", payload);

      if (result.status === 201) {
        setStatus("success");
        return;
      }
      if (result.status === 400) {
        const fieldErrors = normalizeFieldErrors(result.data);
        setErrors(fieldErrors);
        setSummary(
          Object.keys(fieldErrors).length > 0 ? "" : t("contribute.failed"),
        );
        focusFirstInvalid(fieldErrors);
        setStatus("error");
        return;
      }
      if (result.status === 429) {
        setSummary(t("contribute.rateLimit"));
        setStatus("error");
        return;
      }
      setSummary(t("contribute.failed"));
      setStatus("error");
    } catch {
      setSummary(t("contribute.failed"));
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="donate-card success-card" role="status">
        <span className="kicker">{t("contribute.kicker")}</span>
        <h2>{t("contribute.success.title")}</h2>
        <p className="muted" style={{ margin: 0 }}>
          {t("contribute.success.sub")}
        </p>
      </div>
    );
  }

  return (
    <Reveal>
      <span className="kicker">{t("contribute.kicker")}</span>
      <h1>{t("contribute.title")}</h1>
      <p className="muted">{t("contribute.sub")}</p>

      {summary ? (
        <p className="form-summary" role="alert">
          {summary}
        </p>
      ) : null}

      <form className="donate-card" onSubmit={onSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="contribute-name">
            {t("contribute.name")}{" "}
            <span className="muted">({t("contribute.optional")})</span>
          </label>
          <input
            id="contribute-name"
            ref={nameRef}
            className="form-input"
            type="text"
            value={name}
            maxLength={255}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "contribute-name-error" : undefined}
          />
          {errors.name ? (
            <p id="contribute-name-error" className="field-error">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="contribute-woreda">
            {t("contribute.woreda")}{" "}
            <span className="muted">({t("contribute.optional")})</span>
          </label>
          <select
            id="contribute-woreda"
            className="form-select"
            value={woreda}
            onChange={(event) => setWoreda(event.target.value)}
            aria-invalid={errors.woreda ? true : undefined}
            aria-describedby={errors.woreda ? "contribute-woreda-error" : undefined}
          >
            <option value="">{t("contribute.optional")}</option>
            {places.map((place) => (
              <option key={place.slug} value={place.slug}>
                {place.name}
              </option>
            ))}
          </select>
          {errors.woreda ? (
            <p id="contribute-woreda-error" className="field-error">
              {errors.woreda}
            </p>
          ) : null}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="contribute-story">
            {t("contribute.story")}
          </label>
          <textarea
            id="contribute-story"
            ref={storyRef}
            className="form-textarea"
            rows={6}
            value={story}
            maxLength={10000}
            onChange={(event) => setStory(event.target.value)}
            aria-invalid={errors.story ? true : undefined}
            aria-describedby={errors.story ? "contribute-story-error" : undefined}
            aria-required="true"
          />
          {errors.story ? (
            <p id="contribute-story-error" className="field-error">
              {errors.story}
            </p>
          ) : null}
        </div>

        <div className="form-group">
          <label className="checkbox-label" htmlFor="contribute-rights">
            <input
              id="contribute-rights"
              ref={rightsRef}
              type="checkbox"
              checked={rights}
              onChange={(event) => setRights(event.target.checked)}
              aria-invalid={errors.rights ? true : undefined}
              aria-describedby={errors.rights ? "contribute-rights-error" : undefined}
              aria-required="true"
            />
            <span>{t("contribute.rights")}</span>
          </label>
          {errors.rights ? (
            <p id="contribute-rights-error" className="field-error">
              {errors.rights}
            </p>
          ) : null}
        </div>

        {/* Honeypot: bots fill this; real visitors never see it. */}
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="contribute-website">Website</label>
          <input
            id="contribute-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          <Send aria-hidden="true" />
          {t("contribute.submit")}
        </button>
      </form>
    </Reveal>
  );
}
