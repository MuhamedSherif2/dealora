"use client";

import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Menu } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import Button from "@/components/ui/button";
import LanguageSwitcher from "../layout/LanguageSwitcher";
import ThemeToggle from "../layout/ThemeToggle";

function clearCookie(name: string) {
    document.cookie = `${name}=; path=/; max-age=0`;
}

export default function DashboardTopbar({ onMenuClick }: { onMenuClick: () => void }) {
    const t = useTranslations("Dashboard");
    const router = useRouter();

    function handleLogout() {
        clearCookie("dealora_token");
        clearCookie("dealora_user_role");

        toast.success(t("topbar.loggedOut"));

        router.replace("/login");
        router.refresh();
    }

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-card/90 px-4 backdrop-blur">
            <Button onClick={onMenuClick} aria-label={t("topbar.openMenu")}>
                <Menu size={22} />
            </Button>

            <div className="ms-auto flex items-center gap-2">
                <LanguageSwitcher />
                <ThemeToggle />

                <Button variant="outline" size="sm" onClick={handleLogout}>
                    {t("topbar.logout")}
                </Button>
            </div>
        </header>
    );
}