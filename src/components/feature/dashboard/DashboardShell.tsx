"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";

const DESKTOP_QUERY = "(min-width: 1024px)";

export default function DashboardShell({ children }: { children: ReactNode }) {
    const t = useTranslations("Dashboard");
    const pathname = usePathname();

    const [mobileOpen, setMobileOpen] = useState(false); // drawer on small screens
    const [collapsed, setCollapsed] = useState(false);   // sidebar hidden on desktop

    // close the mobile drawer after navigating
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Escape closes the mobile drawer
    useEffect(() => {
        if (!mobileOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMobileOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [mobileOpen]);

    // the menu button toggles the desktop sidebar on large screens and the drawer on small ones
    function toggleSidebar() {
        if (window.matchMedia(DESKTOP_QUERY).matches) setCollapsed((c) => !c);
        else setMobileOpen((o) => !o);
    }

    const asideClasses = [
        "fixed inset-y-0 inset-s-0 z-50 h-screen w-64 border-e border-border bg-card",
        "transition-transform duration-300 ease-in-out",
        !mobileOpen && "max-lg:ltr:-translate-x-full max-lg:rtl:translate-x-full",
        collapsed && "lg:ltr:-translate-x-full lg:rtl:translate-x-full",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className="min-h-screen bg-background">
            {/* Backdrop - mobile only */}
            {mobileOpen && (
                <button
                    type="button"
                    aria-label={t("topbar.closeMenu")}
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                />
            )}

            <aside className={asideClasses}>
                <DashboardSidebar onNavigate={() => setMobileOpen(false)} />
            </aside>

            <div className={`min-h-screen transition-[padding] duration-300 ${collapsed ? "lg:ps-0" : "lg:ps-64"}`}>
                <DashboardTopbar onMenuClick={toggleSidebar} />

                <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}