import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import ThemeSync from "@/components/feature/layout/ThemeSync";
import { themeInitScript } from "@/lib/theme";

import "@/styles/globals.css";
import ReduxProvider from "@/providers/ReduxProvider";

import { routing } from "@/i18n/routing";
import { siteUrl } from "@/config/site";
import { getCanonicalUrl, getLocaleAlternates } from "@/lib/seo";
import UserNavbar from "@/components/feature/layout/userNav";
import UserFooter from "@/components/feature/layout/UserFooter";
import { Suspense } from "react";
import Loading from "@/components/ui/Loading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  const title = isArabic
    ? "ديالورا | اكتشف عقارك القادم في مصر"
    : "Dealora | Discover Your Next Property in Egypt";

  const description = isArabic
    ? "ديالورا منصتك العقارية لاكتشاف العقارات في مصر. تصفح الشقق والفيلات والوحدات التجارية والأراضي للبيع والإيجار، وتواصل مع الوكلاء العقاريين واطلب معاينة عقارك بسهولة."
    : "Discover properties across Egypt with Dealora. Explore apartments, villas, townhouses, commercial properties, and land for sale or rent. Connect with real estate agents and request property viewings.";

  // Check icons existence
  const faviconExists = existsSync(
    join(process.cwd(), "public", "favicon.ico"),
  );

  const appleTouchIconExists = existsSync(
    join(process.cwd(), "public", "apple-touch-icon.png"),
  );

  const icons: Metadata["icons"] = {};

  if (faviconExists) {
    icons.icon = [
      { url: "/favicon.ico", type: "image/x-icon" },
    ];

    icons.shortcut = [{ url: "/favicon.ico" }];
  }

  if (appleTouchIconExists) {
    icons.apple = [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ];
  }

  // SEO Keywords
  const keywords = isArabic
    ? [
      "ديالورا",
      "عقارات مصر",
      "عقارات للبيع في مصر",
      "عقارات للإيجار في مصر",
      "شقق للبيع",
      "شقق للإيجار",
      "فلل للبيع",
      "فلل للإيجار",
      "عقارات القاهرة",
      "عقارات الجيزة",
      "عقارات الإسكندرية",
      "منصة عقارية",
      "وسيط عقاري",
      "شركات عقارات",
      "طلب معاينة عقار",
      "عقارات سكنية",
      "عقارات تجارية",
      "أراضي للبيع",
      "بحث عن عقار",
    ]
    : [
      "Dealora",
      "real estate Egypt",
      "properties in Egypt",
      "properties for sale in Egypt",
      "properties for rent in Egypt",
      "apartments for sale",
      "apartments for rent",
      "villas for sale",
      "villas for rent",
      "real estate Cairo",
      "real estate Giza",
      "Alexandria properties",
      "Egypt property marketplace",
      "real estate agents Egypt",
      "property listings Egypt",
      "commercial properties Egypt",
      "residential properties Egypt",
      "land for sale Egypt",
      "property viewing",
      "find properties in Egypt",
    ];

  const canonicalUrl = getCanonicalUrl(locale, "/");

  return {
    metadataBase: new URL(siteUrl),

    title: {
      default: title,
      template: isArabic
        ? "%s | ديالورا"
        : "%s | Dealora",
    },

    description,

    applicationName: "Dealora",

    authors: [{ name: "Dealora" }],
    creator: "Dealora",
    publisher: "Dealora",

    category: "Real Estate",

    keywords,

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    appleWebApp: {
      capable: true,
      title: "Dealora",
      statusBarStyle: "black-translucent",
    },

    alternates: {
      canonical: canonicalUrl,
      languages: getLocaleAlternates("/"),
    },

    openGraph: {
      type: "website",
      siteName: "Dealora",
      title,
      description,
      url: canonicalUrl,
      locale: isArabic ? "ar_EG" : "en_US",
      alternateLocale: isArabic ? ["en_US"] : ["ar_EG"],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },

    icons,
  };
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {process.env.NODE_ENV === "production" && (
          <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        )}
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <ThemeSync />
          <ReduxProvider>
            <Suspense fallback={<Loading />}>
              <UserNavbar />
              <Toaster position={locale === "ar" ? "top-left" : "top-right"} reverseOrder={false} gutter={8} toastOptions={{ duration: 4000, style: { fontFamily: "var(--font-geist-sans)", borderRadius: "12px", fontSize: "14px", padding: "12px 16px" }, success: { duration: 3000 }, error: { duration: 4000 }, }} />
              {children}
              <UserFooter />
            </Suspense>
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}