"""Tests for the session-auth endpoints backing /staff (#38)."""

from unittest import mock

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.cache import cache
from django.test import TestCase
from rest_framework.throttling import SimpleRateThrottle

WHOAMI_URL = "/api/v2/whoami/"
CSRF_URL = "/api/v2/auth/csrf/"
LOGIN_URL = "/api/v2/auth/login/"
LOGOUT_URL = "/api/v2/auth/logout/"


@mock.patch.dict(
    SimpleRateThrottle.THROTTLE_RATES, {"auth_login": "100/min"}
)
class AuthEndpointTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.editor = get_user_model().objects.create_user(
            username="staff-editor",
            password="a-strong-test-password",
            first_name="Staff",
            last_name="Editor",
            is_staff=True,
        )
        group, _ = Group.objects.get_or_create(name="Editors")
        cls.editor.groups.add(group)

    def setUp(self):
        cache.clear()  # reset throttle counters

    def login(self, username="staff-editor", password="a-strong-test-password"):
        return self.client.post(
            LOGIN_URL,
            {"username": username, "password": password},
            content_type="application/json",
        )

    # -- whoami -------------------------------------------------------

    def test_anonymous_whoami_reports_unauthenticated(self):
        response = self.client.get(WHOAMI_URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"authenticated": False})

    def test_authenticated_whoami_reports_identity_and_roles(self):
        self.client.force_login(self.editor)
        payload = self.client.get(WHOAMI_URL).json()
        self.assertTrue(payload["authenticated"])
        self.assertEqual(payload["username"], "staff-editor")
        self.assertEqual(payload["display_name"], "Staff Editor")
        self.assertTrue(payload["is_staff"])
        self.assertEqual(payload["roles"], ["Editors"])

    def test_superuser_gets_superuser_role(self):
        admin = get_user_model().objects.create_superuser(
            username="root", email="root@example.invalid", password="pw-x-1"
        )
        self.client.force_login(admin)
        payload = self.client.get(WHOAMI_URL).json()
        self.assertIn("superuser", payload["roles"])

    # -- login --------------------------------------------------------

    def test_login_with_good_credentials_returns_whoami_and_sets_session(self):
        response = self.login()
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertTrue(payload["authenticated"])
        self.assertEqual(payload["username"], "staff-editor")
        self.assertIn("sessionid", response.cookies)
        # The session is genuinely established for follow-up requests.
        self.assertTrue(self.client.get(WHOAMI_URL).json()["authenticated"])

    def test_login_with_bad_credentials_returns_401(self):
        response = self.login(password="wrong-password")
        self.assertEqual(response.status_code, 401)
        self.assertFalse(self.client.get(WHOAMI_URL).json()["authenticated"])

    def test_login_with_missing_fields_returns_401(self):
        response = self.client.post(
            LOGIN_URL, {}, content_type="application/json"
        )
        self.assertEqual(response.status_code, 401)

    def test_inactive_user_cannot_log_in(self):
        get_user_model().objects.filter(pk=self.editor.pk).update(
            is_active=False
        )
        self.assertEqual(self.login().status_code, 401)

    # -- logout -------------------------------------------------------

    def test_logout_clears_the_session(self):
        self.login()
        response = self.client.post(LOGOUT_URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"authenticated": False})
        self.assertFalse(self.client.get(WHOAMI_URL).json()["authenticated"])

    def test_logout_get_is_not_allowed(self):
        self.assertEqual(self.client.get(LOGOUT_URL).status_code, 405)

    # -- csrf ---------------------------------------------------------

    def test_csrf_endpoint_sets_cookie_and_returns_token(self):
        response = self.client.get(CSRF_URL)
        self.assertEqual(response.status_code, 200)
        self.assertIn("csrftoken", response.cookies)
        token = response.json()["csrfToken"]
        self.assertTrue(token)


@mock.patch.dict(SimpleRateThrottle.THROTTLE_RATES, {"auth_login": "3/hour"})
class LoginThrottleTests(TestCase):
    def setUp(self):
        cache.clear()

    def test_fourth_attempt_in_window_is_throttled(self):
        for _ in range(3):
            response = self.client.post(
                LOGIN_URL,
                {"username": "nobody", "password": "nope"},
                content_type="application/json",
            )
            self.assertEqual(response.status_code, 401)
        response = self.client.post(
            LOGIN_URL,
            {"username": "nobody", "password": "nope"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 429)
