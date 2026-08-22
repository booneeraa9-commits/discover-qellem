"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { LangList, LangMenu } from "@/components/LanguageSwitcher";
import { useT } from "@/lib/i18n-client";
import { useTheme } from "@/lib/theme-client";

interface NavLink {
  href: string;
  key: string;
}

const NAV_LINKS: NavLink[] = [
  { href: "/", key: "nav.home" },
  { href: "/places", key: "nav.places" },
  { href: "/news", key: "nav.news" },
  { href: "/history", key: "nav.history" },
  { href: "/support", key: "nav.support" },
];

export default function Nav() {
  const { t } = useT();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    menuBtnRef.current?.focus();
  }, []);

  // Lock scroll and handle Escape while the drawer is open; focus the close
  // control when it opens.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [drawerOpen, closeDrawer]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const ThemeIcon = theme === "dark" ? Sun : Moon;

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="container nav-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" width={42} height={42} />
          </span>
          <span className="brand-text">
            <span className="brand-title">{t("brand.title")}</span>
            <span className="brand-sub">{t("brand.sub")}</span>
          </span>
        </Link>

        <nav className="nav-links" aria-label={t("nav.main")}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? "active" : undefined}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <LangMenu />
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            title={t("theme.toggle")}
            aria-label={t("theme.toggle")}
          >
            <ThemeIcon aria-hidden="true" width={18} height={18} />
          </button>
          <button
            type="button"
            className="icon-btn menu-btn"
            ref={menuBtnRef}
            onClick={() => setDrawerOpen(true)}
            aria-label={t("nav.openMenu")}
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
          >
            <Menu aria-hidden="true" width={20} height={20} />
          </button>
        </div>
      </div>

      {/* Mobile drawer — slides in from the right over a translucent backdrop. */}
      <div
        className={`drawer-backdrop${drawerOpen ? " open" : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <div
        id="mobile-drawer"
        className={`drawer${drawerOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={t("nav.main")}
        aria-hidden={drawerOpen ? undefined : "true"}
        inert={!drawerOpen || undefined}
      >
        <div className="drawer-head">
          <span className="brand-text">
            <span className="brand-title">{t("brand.title")}</span>
            <span className="brand-sub">{t("brand.sub")}</span>
          </span>
          <button
            type="button"
            className="icon-btn"
            ref={closeBtnRef}
            onClick={closeDrawer}
            aria-label={t("nav.closeMenu")}
          >
            <X aria-hidden="true" width={20} height={20} />
          </button>
        </div>
        <nav aria-label={t("nav.main")}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? "active" : undefined}
              onClick={closeDrawer}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="drawer-lang">
          <span className="drawer-lang-title">{t("lang.menu")}</span>
          <LangList onSelect={closeDrawer} />
        </div>
      </div>
    </header>
  );
}
