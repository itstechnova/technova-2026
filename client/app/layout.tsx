import type { Metadata } from "next";
import { Righteous, Josefin_Sans, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  EVENT_NAME,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";

const righteous = Righteous({
  weight: "400",
  variable: "--font-righteous",
  subsets: ["latin"],
});

const josefinSans = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${EVENT_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  alternates: { canonical: "/" },
  // The og:image / twitter:image tags come from app/opengraph-image.tsx.
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

// Structured data so search engines connect "TechNova" with the organization, its site and Waterloo.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: ["TechNova Hackathon", "TechNova Waterloo"],
      url: SITE_URL,
      logo: `${SITE_URL}/technova-logo.png`,
      description: SITE_DESCRIPTION,
      slogan: SITE_TAGLINE,
      email: "hello@itstechnova.org",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Waterloo",
        addressRegion: "ON",
        addressCountry: "CA",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: EVENT_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en-CA",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-CA"
      className={`${geist.variable} ${geistMono.variable} ${righteous.variable} ${josefinSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
