import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter, Noto_Sans_Ethiopic } from "next/font/google";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Providers from "@/components/Providers";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import SkipLink from "@/components/SkipLink";
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

export const metadata: Metadata = {
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
    locale: "en_US",
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b3d2e",
};

// Sets data-theme before first paint to avoid a flash of the wrong theme.
// Storage key and default (prefers-color-scheme) match the demo reference.
const themeInitScript = `(function () {
  try {
    var stored = window.localStorage.getItem("dq_theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();`;

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} ${notoSansEthiopic.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
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
