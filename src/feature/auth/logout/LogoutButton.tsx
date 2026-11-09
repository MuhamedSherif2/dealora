"use client";

import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLogout } from "@/hooks/useLogout";
import Button from "@/components/ui/button";

function LogoutButton({ className = "" }: { className?: string }) {
    const t = useTranslations("Account.nav");
    const logout = useLogout();

    return (
        <Button variant="danger" onClick={logout} fullWidth className={className}>
            <LogOut className="size-4 rtl:-scale-x-100" aria-hidden />
            {t("logout")}
        </Button>
    );
}

export default LogoutButton;