export const THEME_COOKIE = "dealora_theme";
export type Theme = "light" | "dark";

export function readSavedTheme(): Theme | null {
    const m = document.cookie.match(new RegExp(`(?:^|; )${THEME_COOKIE}=(light|dark)`));
    return m ? (m[1] as Theme) : null;
}

export function systemTheme(): Theme {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
}

// inlined in <head> so the right theme is set before the first paint (no flash)
export const themeInitScript = `(function(){try{
var m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=(light|dark)/);
var dark=m?m[1]==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;
var r=document.documentElement;
r.classList.toggle("dark",dark);
r.style.colorScheme=dark?"dark":"light";
}catch(e){}})();`;