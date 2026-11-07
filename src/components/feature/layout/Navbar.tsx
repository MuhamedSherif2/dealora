"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { cookieHelper } from "@/lib/cookies";

type Role = "client" | "agent" | "admin";
export default function Navbar() {
    const t = useTranslations("Navbar");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState<Role | null>(null);

    useEffect(() => {
        setIsLoggedIn(!!cookieHelper.get("dealora_token"));
        setRole((cookieHelper.get("dealora_user_role") as Role) ?? null);
    }, []);

    // admin and agent work from the dashboard, clients from their account page
    const isStaff = role === "admin" || role === "agent";
    const accountHref = isStaff ? "/dashboard" : "/account";
    const accountLabel = isStaff ? t("dashboard") : t("account");

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

                    {isLoggedIn ? (
                        <Link href={accountHref} className="inline-flex h-10 items-center rounded-(--radius) bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover">
                            {accountLabel}
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="hidden h-10 items-center rounded-(--radius) px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:inline-flex">
                                {t("login")}
                            </Link>

                            <Link href="/register" className="hidden h-10 items-center rounded-(--radius) bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover sm:inline-flex">
                                {t("register")}
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}