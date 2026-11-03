"use client"

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
    const t = useTranslations("Navbar");

    const links = [
        { href: "/", label: t("home") },
        { href: "/properties", label: t("properties") },
    ];

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-bold text-primary">
                        Dealora
                    </Link>

                    <ul className="hidden items-center gap-6 md:flex">
                        {links.map((l) => (
                            <li key={l.href}>
                                <Link href={l.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeToggle />

                    <Link
                        href="/login"
                        className="hidden h-10 items-center rounded-(--radius) px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:inline-flex"
                    >
                        {t("login")}
                    </Link>
                    <Link
                        href="/register"
                        className="hidden h-10 items-center rounded-(--radius) bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover sm:inline-flex"
                    >
                        {t("register")}
                    </Link>
                </div>
            </nav>
        </header>
    );
}