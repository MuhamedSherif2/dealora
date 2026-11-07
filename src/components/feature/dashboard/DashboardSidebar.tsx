"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cookieHelper } from "@/lib/cookies";

type Item = { href: string; key: string; exact?: boolean };

const MAIN: Item[] = [
    { href: "/dashboard", key: "overview", exact: true },
    { href: "/dashboard/properties", key: "properties" },
    { href: "/dashboard/leads", key: "leads" },
    { href: "/dashboard/viewings", key: "viewings" },
];

const ADMIN: Item[] = [
    { href: "/dashboard/users", key: "users" },
    { href: "/dashboard/webhook-logs", key: "webhookLogs" },
];

export default function DashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {
    const t = useTranslations("Dashboard");
    const pathname = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsAdmin(cookieHelper.get("dealora_user_role") === "admin");
    }, []);

    const renderItem = ({ href, key, exact }: Item) => {
        const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        return (
            <li key={href}>
                <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`flex h-10 items-center rounded-lg px-3 text-sm font-medium transition-colors ${active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                >
                    {t(`nav.${key}`)}
                </Link>
            </li>
        );
    };

    return (
        <div className="flex h-full flex-col gap-6 overflow-y-auto p-4">
            <Link href="/dashboard" className="px-3 text-xl font-bold text-primary">
                {t("brand")}
            </Link>

            <nav className="flex flex-1 flex-col gap-6">
                <div>
                    <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {t("nav.sections.main")}
                    </p>
                    <ul className="flex flex-col gap-1">{MAIN.map(renderItem)}</ul>
                </div>

                {isAdmin && (
                    <div>
                        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {t("nav.sections.admin")}
                        </p>
                        <ul className="flex flex-col gap-1">{ADMIN.map(renderItem)}</ul>
                    </div>
                )}
            </nav>

            <Link
                href="/"
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
                {t("nav.backToSite")}
            </Link>
        </div>
    );
}