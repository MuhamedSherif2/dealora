import { siteUrl } from "@/config/site";

// "/" becomes "", "/properties/" becomes "/properties"
const cleanPath = (pathname: string) =>
  (pathname.startsWith("/") ? pathname : `/${pathname}`).replace(/\/+$/, "");

export function getCanonicalUrl(locale: string, pathname = "/"): string {
  return `${siteUrl}/${locale}${cleanPath(pathname)}`;
}

export function getLocaleAlternates(pathname = "/"): Record<string, string> {
  const path = cleanPath(pathname);
  return {
    ar: `${siteUrl}/ar${path}`,
    en: `${siteUrl}/en${path}`,
    "x-default": `${siteUrl}/en${path}`,
  };
}