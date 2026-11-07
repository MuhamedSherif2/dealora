"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { cookieHelper } from "@/lib/cookies";

type Role = "client" | "agent" | "admin";

const primaryBtn =
    "inline-flex h-10 items-center justify-center rounded-(--radius) bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover";
const ghostBtn =
    "inline-flex h-10 items-center justify-center rounded-(--radius) border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted";

export default function Navbar() {
    const t = useTranslations("Navbar");
    const pathname = usePathname();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState<Role | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!cookieHelper.get("dealora_token"));
        setRole((cookieHelper.get("dealora_user_role") as Role) ?? null);
    }, []);

    // close the mobile menu after navigating
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    // Escape closes it too
    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [menuOpen]);

    // admin and agent work from the dashboard, clients from their account page
    const isStaff = role === "admin" || role === "agent";
    const accountHref = isStaff ? "/dashboard" : "/account";
    const accountLabel = isStaff ? t("dashboard") : t("account");

    const links = [
        { href: "/", label: t("home") },
        { href: "/properties", label: t("properties") },
    ];

    const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-bold text-primary">
                        Dealora
                    </Link>

                    <ul className="hidden items-center gap-6 md:flex">
                        {links.map((l) => (
                            <li key={l.href}>
                                <Link
                                    href={l.href}
                                    aria-current={isActive(l.href) ? "page" : undefined}
                                    className={`text-sm font-medium transition-colors hover:text-foreground ${isActive(l.href) ? "text-foreground" : "text-muted-foreground"
                                        }`}
                                >
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeToggle />

                    {/* desktop auth buttons */}
                    <div className="hidden items-center gap-2 md:flex">
                        {isLoggedIn ? (
                            <Link href={accountHref} className={primaryBtn}>{accountLabel}</Link>
                        ) : (
                            <>
                                <Link href="/login" className="inline-flex h-10 items-center rounded-(--radius) px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                                    {t("login")}
                                </Link>
                                <Link href="/register" className={primaryBtn}>{t("register")}</Link>
                            </>
                        )}
                    </div>

                    {/* mobile menu button */}
                    <button
                        type="button"
                        onClick={() => setMenuOpen((o) => !o)}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
                        className="inline-flex size-10 cursor-pointer items-center justify-center rounded-(--radius) border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
                    >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {/* mobile menu panel */}
            {menuOpen && (
                <div id="mobile-menu" className="border-t border-border bg-card shadow-lg md:hidden">
                    <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
                        {links.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                aria-current={isActive(l.href) ? "page" : undefined}
                                className={`rounded-lg px-3 py-3 text-base font-medium transition-colors ${isActive(l.href) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                                    }`}
                            >
                                {l.label}
                            </Link>
                        ))}

                        <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
                            {isLoggedIn ? (
                                <Link href={accountHref} className={primaryBtn}>{accountLabel}</Link>
                            ) : (
                                <>
                                    <Link href="/login" className={ghostBtn}>{t("login")}</Link>
                                    <Link href="/register" className={primaryBtn}>{t("register")}</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}