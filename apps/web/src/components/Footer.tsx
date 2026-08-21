"use client";

import Link from "next/link";
import { Download, Globe, Mail, MapPin, Rss } from "lucide-react";
import { useT } from "@/lib/i18n-client";
import { useInstall } from "./install-client";

const iconSize = 15;

export default function Footer() {
  const { t } = useT();
  const { promptInstall } = useInstall();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="brand brand-footer">
              <span className="brand-mark">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="" width={34} height={34} />
              </span>
              <span className="brand-text">
                <span className="brand-title">{t("brand.title")}</span>
                <span className="brand-sub">{t("brand.sub")}</span>
              </span>
            </div>
            <p className="footer-about">{t("footer.about")}</p>
            <div className="footer-social">
              <a
                href="mailto:hello@discoverqellem.org"
                aria-label={t("footer.social.mail")}
              >
                <Mail aria-hidden="true" width={18} height={18} />
              </a>
              <a
                href="https://discoverqellem.netlify.app"
                target="_blank"
                rel="noreferrer"
                aria-label={t("footer.social.site")}
              >
                <Globe aria-hidden="true" width={18} height={18} />
              </a>
              <Link href="/news" aria-label={t("footer.social.news")}>
                <Rss aria-hidden="true" width={18} height={18} />
              </Link>
            </div>
          </div>

          <div className="footer-col">
            <h4>{t("footer.explore")}</h4>
            <Link href="/">{t("nav.home")}</Link>
            <Link href="/places">{t("nav.places")}</Link>
            <Link href="/news">{t("nav.news")}</Link>
            <Link href="/history">{t("nav.history")}</Link>
          </div>

          <div className="footer-col">
            <h4>{t("footer.resources")}</h4>
            <Link href="/support">{t("nav.support")}</Link>
            <Link href="/contribute">{t("footer.contribute")}</Link>
            <Link href="/about">{t("footer.aboutProject")}</Link>
          </div>

          <div className="footer-col">
            <h4>{t("footer.contact")}</h4>
            <div className="contact-line">
              <MapPin aria-hidden="true" width={iconSize} height={iconSize} />
              <span>{t("footer.contact.location")}</span>
            </div>
            <div className="contact-line">
              <Mail aria-hidden="true" width={iconSize} height={iconSize} />
              <a href="mailto:hello@discoverqellem.org" className="contact-mail">
                hello@discoverqellem.org
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {year} {t("brand.title")}. {t("footer.rights")}
          </p>
          <div className="footer-meta">
            <Link href="/staff" className="staff-link">
              {t("footer.staff")}
            </Link>
            <span className="dot-sep" aria-hidden="true">
              ·
            </span>
            <button
              type="button"
              className="footer-install"
              onClick={promptInstall}
            >
              <Download aria-hidden="true" width={14} height={14} />
              {t("footer.install")}
            </button>
            <span className="dot-sep" aria-hidden="true">
              ·
            </span>
            <span>{t("footer.sources")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
