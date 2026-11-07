"use client";

import { useTranslations } from "next-intl";
import { MoonIcon, SunIcon } from "@/components/ui/icons";
import { cookieHelper } from "@/lib/cookies";
import { THEME_COOKIE, applyTheme, type Theme } from "@/lib/theme";

export default function ThemeToggle() {
    const t = useTranslations("Navbar");

    function toggle() {
        const next: Theme = document.documentElement.classList.contains("dark") ? "light" : "dark";
        cookieHelper.set(THEME_COOKIE, next, 365);
        applyTheme(next);
    }

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={t("toggleTheme")}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-(--radius) border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
            {/* CSS decides which icon shows, so there is no hydration flicker */}
            <SunIcon className="hidden size-5 dark:block" />
            <MoonIcon className="block size-5 dark:hidden" />
        </button>
    );
}