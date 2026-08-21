"use client";

import { Send } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { useToast } from "@/components/use-toast";
import { useT } from "@/lib/i18n-client";

export default function ContributePage() {
  const { t } = useT();
  const { showToast } = useToast();

  return (
    <main className="page">
      <section className="section tight">
        <div className="container" style={{ maxWidth: 760 }}>
          <Reveal>
            <span className="kicker">{t("contribute.kicker")}</span>
            <h1>{t("contribute.title")}</h1>
            <p className="muted">{t("contribute.sub")}</p>

            <form
              className="donate-card"
              onSubmit={(event) => {
                event.preventDefault();
                // Backend endpoint lands in a later issue; stub with a toast.
                showToast(t("contribute.toast.comingSoon"));
              }}
            >
              <div className="form-group">
                <label className="form-label" htmlFor="contribute-name">
                  {t("contribute.name")}
                </label>
                <input id="contribute-name" className="form-input" type="text" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contribute-email">
                  {t("contribute.email")}
                </label>
                <input id="contribute-email" className="form-input" type="email" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contribute-title">
                  {t("contribute.titleField")}
                </label>
                <input id="contribute-title" className="form-input" type="text" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contribute-story">
                  {t("contribute.story")}
                </label>
                <textarea id="contribute-story" className="form-textarea" rows={6} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contribute-photo">
                  {t("contribute.photo")}
                </label>
                <input id="contribute-photo" className="form-input" type="file" accept="image/*" />
              </div>
              <button className="btn btn-primary" type="submit">
                <Send aria-hidden="true" />
                {t("contribute.submit")}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
