import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter, Noto_Sans_Ethiopic } from "next/font/google";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Providers from "@/components/Providers";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import SkipLink from "@/components/SkipLink";
import { langToLocale, resolveRequestLang } from "@/lib/lang-server";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  weight: "variable",
  axes: ["opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

// Amharic script font. Loaded without preloading (it is large and only used
// once <html lang="am"> is set, via the :lang(am) font stacks in globals.css).
const notoSansEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  display: "swap",
  variable: "--font-noto-ethiopic",
  weight: ["400", "500", "600", "700"],
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b3d2e",
};

// Root metadata is generated dynamically so og:locale and hreflang can match
// the request language (the `dq_lang` cookie). hreflang alternates point at
// the same URL — language is cookie-negotiated until /om|/en|/am path routing.
export async function generateMetadata(): Promise<Metadata> {
  const lang = await resolveRequestLang();
  return {
    metadataBase: new URL(SITE_URL),
    title: "Discover Qellem — Kellem Wollega · Oromia",
    description: SITE_DESCRIPTION,
    icons: {
      icon: [
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "Discover Qellem",
    },
    alternates: {
      canonical: "/",
      languages: {
        "x-default": "/",
        "om-ET": "/",
        en: "/",
        am: "/",
      },
    },
    openGraph: {
      title: "Discover Qellem — Kellem Wollega · Oromia",
      description: SITE_DESCRIPTION,
      url: "/",
      siteName: SITE_NAME,
      locale: langToLocale(lang),
      type: "website",
      images: [{ url: "/hero.jpg", alt: "Discover Qellem" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Discover Qellem — Kellem Wollega · Oromia",
      description: SITE_DESCRIPTION,
      images: ["/hero.jpg"],
    },
  };
}

// Sets data-theme AND lang before first paint. Order: localStorage, then the
// dq_lang cookie, then "om" — mirroring the client store's readStoredLang()
// and the server's resolveRequestLang() so a fresh visitor's first paint is OM
// (no flash of EN) and a returning visitor keeps their chosen language.
const prePaintInitScript = `(function () {
  function readLang() {
    var stored = null;
    try { stored = window.localStorage.getItem("dq_lang"); } catch (e) {}
    if (stored === "om" || stored === "en" || stored === "am") return stored;
    try {
      var match = document.cookie.match(/(?:^|;\\s*)dq_lang=([^;]+)/);
      var fromCookie = match ? match[1] : "";
      if (fromCookie === "om" || fromCookie === "en" || fromCookie === "am") return fromCookie;
    } catch (e) {}
    return "om";
  }
  try {
    var storedTheme = window.localStorage.getItem("dq_theme");
    var theme = storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("lang", readLang());
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.setAttribute("lang", "om");
  }
})();`;

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const lang = await resolveRequestLang();

  return (
    <html
      lang={lang}
      data-theme="light"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} ${notoSansEthiopic.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: prePaintInitScript }} />
      </head>
      <body>
        <Providers>
          <SkipLink />
          <Nav />
          {children}
          <Footer />
        </Providers>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
