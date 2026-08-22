"use client";

import { useEffect, useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { useToast } from "@/components/use-toast";
import { useT } from "@/lib/i18n-client";

interface StaffSession {
  username: string;
  display_name?: string;
  role?: string;
}

const ADMIN_ORIGIN = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:8000";

async function readCsrfToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/cms/auth/csrf", {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { csrfToken?: string; csrf_token?: string };
    return data.csrfToken ?? data.csrf_token ?? null;
  } catch {
    return null;
  }
}

export default function StaffView() {
  const { t } = useT();
  const { showToast } = useToast();

  const [session, setSession] = useState<StaffSession | null>(null);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Check for an existing session on mount.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/cms/auth/session", {
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then(async (res) => {
        if (!res.ok) return null;
        return (await res.json()) as StaffSession;
      })
      .catch(() => null)
      .then((data) => {
        if (!cancelled) {
          setSession(data && (data.username || data.display_name) ? data : null);
          setChecking(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const csrf = await readCsrfToken();
      const res = await fetch("/api/cms/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(csrf ? { "X-CSRFToken": csrf } : {}),
        },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setError(t("staff.loginError"));
        return;
      }
      const data = (await res.json()) as StaffSession;
      setSession(data);
    } catch {
      setError(t("staff.unavailable"));
    } finally {
      setSubmitting(false);
    }
  };

  const onLogout = async () => {
    try {
      await fetch("/api/cms/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
    } catch {
      // best-effort logout
    }
    setSession(null);
    showToast(t("staff.loggedOut"));
  };

  const adminHref = `${ADMIN_ORIGIN.replace(/\/+$/, "")}/admin/`;

  if (checking) return null;

  if (session) {
    return (
      <main className="page" id="main-content">
        <section className="auth-wrap">
          <Reveal className="auth-card">
            <span className="kicker">{t("staff.kicker")}</span>
            <h2>
              {t("staff.welcome")}, {session.display_name ?? session.username}
            </h2>
            {session.role ? <span className="chip">{session.role}</span> : null}
            <div className="staff-links">
              <a
                href={adminHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                {t("staff.admin")}
              </a>
              <a
                href={`${ADMIN_ORIGIN.replace(/\/+$/, "")}/admin/account/`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                {t("staff.profile")}
              </a>
              <button type="button" className="btn btn-ghost" onClick={onLogout}>
                <LogOut aria-hidden="true" />
                {t("staff.logout")}
              </button>
            </div>
          </Reveal>
        </section>
      </main>
    );
  }

  return (
    <main className="page" id="main-content">
      <section className="auth-wrap">
        <Reveal className="auth-card">
          <span className="kicker">{t("staff.kicker")}</span>
          <h2>{t("staff.title")}</h2>
          <p className="sub muted">{t("staff.sub")}</p>

          <form onSubmit={onSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="staff-username">
                {t("staff.username")}
              </label>
              <input
                id="staff-username"
                className="form-input"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="staff-password">
                {t("staff.password")}
              </label>
              <input
                id="staff-password"
                className="form-input"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {error ? (
              <p className="field-error" role="alert">
                {error}
              </p>
            ) : null}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={submitting}
              style={{ width: "100%", justifyContent: "center" }}
            >
              <LogIn aria-hidden="true" />
              {submitting ? t("staff.signingIn") : t("staff.signIn")}
            </button>
          </form>
        </Reveal>
      </section>
    </main>
  );
}
