"""Session-auth endpoints for the frontend editor dashboard (issue #38).

The Next.js ``/staff`` page needs to establish and inspect a real
Wagtail admin session from another origin during local dev:

- ``GET  /api/v2/auth/csrf/``   — sets the ``csrftoken`` cookie and
  returns the token as JSON (the standard Django SPA pattern);
- ``POST /api/v2/auth/login/``  — JSON ``{username, password}`` against
  Django auth; on success the session cookie is set and the whoami
  payload returned; bad credentials get 401;
- ``POST /api/v2/auth/logout/`` — clears the session;
- ``GET  /api/v2/whoami/``      — ``{"authenticated": false}`` for
  anonymous callers, else the user's identity and roles.

Login is rate-limited (scope ``auth_login``) to slow down credential
stuffing. Roles are the user's Django group names, plus ``superuser``
when applicable, so the FE can gate dashboard sections.
"""

from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView


def whoami_payload(user):
    if not user.is_authenticated:
        return {"authenticated": False}
    roles = sorted(user.groups.values_list("name", flat=True))
    if user.is_superuser:
        roles.append("superuser")
    return {
        "authenticated": True,
        "username": user.get_username(),
        "display_name": user.get_full_name() or user.get_username(),
        "is_staff": user.is_staff,
        "roles": roles,
    }


class WhoAmIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(whoami_payload(request.user))


class CSRFTokenView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        return Response({"csrfToken": get_token(request)})


class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_login"

    def post(self, request):
        data = request.data if isinstance(request.data, dict) else {}
        username = str(data.get("username") or "")
        password = str(data.get("password") or "")
        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response(
                {"detail": "Invalid username or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        login(request, user)
        return Response(whoami_payload(user))


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logout(request)
        return Response({"authenticated": False})
