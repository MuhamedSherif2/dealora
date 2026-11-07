"use client";

import { useLayoutEffect } from "react";
import { applyTheme, readSavedTheme, systemTheme } from "@/lib/theme";

export default function ThemeSync() {
    useLayoutEffect(() => {
        const sync = () => applyTheme(readSavedTheme() ?? systemTheme());
        sync();

        const media = window.matchMedia("(prefers-color-scheme: dark)");
        media.addEventListener("change", sync);
        return () => media.removeEventListener("change", sync);
    }, []);

    return null;
}