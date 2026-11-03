const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";
const locales = ["ar", "en"] as const;

type Locale = (typeof locales)[number];

export function getCanonicalUrl(locale: string, pathname: string = "/",): string {
    const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`
    const cleanPath = normalizedPath.replace(/\/+$/, "") || "";

    return `${siteUrl}/${locale}${cleanPath}`;
}

export function getLocaleAlternates(pathname: string = "/",): Record<string, string> {
    const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

    const cleanPath = normalizedPath.replace(/\/+$/, "") || "";

    return {
        ar: `${siteUrl}/ar${cleanPath}`,
        en: `${siteUrl}/en${cleanPath}`,
        "x-default": `${siteUrl}/en${cleanPath}`,
    };
}