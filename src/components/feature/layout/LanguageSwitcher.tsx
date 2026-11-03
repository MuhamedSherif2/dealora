"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";
import { GlobeIcon } from "@/components/ui/icons";

// each language is always written in its own language
const LABELS: Record<Locale, string> = { ar: "العربية", en: "English" };

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
            aria-label={t("switchLanguage")}
            onClick={() => startTransition(() => router.replace(pathname, { locale: nextLocale }))}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[var(--radius)] border border-border bg-card px-3 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
            <GlobeIcon className="size-4" />
            <span lang={nextLocale}>{LABELS[nextLocale]}</span>
        </button>
    );
}