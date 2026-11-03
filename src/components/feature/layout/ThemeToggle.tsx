"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { MoonIcon, SunIcon } from "@/components/ui/icons";

export default function ThemeToggle() {
    const t = useTranslations("Navbar");
    const { resolvedTheme, setTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label={t("toggleTheme")}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-(--radius) border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
            {/* CSS decides which icon shows, so there is no hydration flicker */}
            <SunIcon className="hidden size-5 dark:block" />
            <MoonIcon className="block size-5 dark:hidden" />
        </button>
    );
}