"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LogoutButton from "../auth/logout/LogoutButton";

const items = [
    { href: "/account", key: "profile", exact: true },
    { href: "/account/favorites", key: "favorites" },
    { href: "/account/saved-searches", key: "savedSearches" },
    { href: "/account/viewings", key: "viewings" },
] as const;

export default function AccountNav() {
    const t = useTranslations("Account.nav");
    const pathname = usePathname();

    return (
        <nav aria-label={t("label")} className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {items.map(({ href, key, ...rest }) => {
                const exact = "exact" in rest;
                const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
                return (
                    <Link
                        key={href}
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                    >
                        {t(key)}
                    </Link>
                );
            })}

            <div className="mt-2 border-t border-border pt-2">
                <LogoutButton className="w-full" />
            </div>
        </nav>
    );
}