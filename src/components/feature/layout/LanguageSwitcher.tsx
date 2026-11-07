"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";
import { GlobeIcon } from "@/components/ui/icons";

// each language is always written in its own language
const LABELS: Record<Locale, string> = { ar: "العربية", en: "English" };
// short form used on small screens
const SHORT: Record<Locale, string> = { ar: "ع", en: "EN" };

export default function LanguageSwitcher() {
    const t = useTranslations("Navbar");
    const locale = useLocale() as Locale;
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const nextLocale: Locale = locale === "ar" ? "en" : "ar";

    return (
        <button
            type="button"
            disabled={isPending}
            aria-label={`${t("switchLanguage")}: ${LABELS[nextLocale]}`}
            onClick={() => startTransition(() => router.replace(pathname, { locale: nextLocale }))}
            className="inline-flex h-10 min-w-10 cursor-pointer items-center justify-center gap-1.5 rounded-(--radius) border border-border bg-card px-2.5 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 sm:gap-2 sm:px-3"
        >
            <GlobeIcon className="size-4 shrink-0" />

            {/* phones: short code only. 640px and up: the full language name */}
            <span lang={nextLocale} className="font-medium sm:hidden">{SHORT[nextLocale]}</span>
            <span lang={nextLocale} className="hidden sm:inline">{LABELS[nextLocale]}</span>
        </button>
    );
}