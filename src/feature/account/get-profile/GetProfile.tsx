"use client";

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { useGetProfileQuery } from "@/store/slices/authSlice";
import Button from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import Modal from "@/components/ui/modal";
import ProfileForm from "./ProfileForm";
import ChangePassword from "./ChangePassword";

type OpenModal = "profile" | "password" | null;

function GetProfile() {
    const t = useTranslations("Account.profile");
    const tPassword = useTranslations("Account.password");
    const tEnums = useTranslations("Enums");
    const tCommon = useTranslations("Dashboard.common");
    const format = useFormatter();
    const { data, isLoading, isError, refetch } = useGetProfileQuery();
    const [open, setOpen] = useState<OpenModal>(null);

    if (isLoading) return <Loading />;

    const user = data?.data.user;
    if (isError || !user) {
        return (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
                <p className="text-destructive">{t("error")}</p>
                <Button variant="outline" onClick={() => refetch()}>{t("retry")}</Button>
            </div>
        );
    }

    const details = [
        { label: t("name"), value: user.name },
        { label: t("email"), value: user.email, ltr: true },
        { label: t("phone"), value: user.phone, ltr: true },
        { label: t("language"), value: user.language === "ar" ? "العربية" : "English" },
    ];

    return (
        <div className="flex flex-col gap-6">
            <header className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
                {user.avatar?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar.url} alt="" className="size-20 shrink-0 rounded-full object-cover" />
                ) : (
                    <span className="inline-flex size-20 shrink-0 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                        {user.name.charAt(0).toUpperCase()}
                    </span>
                )}

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <h1 className="truncate text-2xl font-bold text-foreground">{user.name}</h1>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-full bg-primary/15 px-3 py-1 font-medium text-primary">
                            {tEnums(`role.${user.role}`)}
                        </span>
                        <span className={`rounded-full px-3 py-1 font-medium ${user.isActive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                            {user.isActive ? t("active") : t("inactive")}
                        </span>
                        <span className="text-muted-foreground">
                            {t("memberSince", { date: format.dateTime(new Date(user.createdAt), { dateStyle: "long" }) })}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button onClick={() => setOpen("profile")}>{t("editProfile")}</Button>
                    <Button variant="outline" onClick={() => setOpen("password")}>{t("changePassword")}</Button>
                </div>
            </header>

            <dl className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-sm sm:grid-cols-2">
                {details.map((d) => (
                    <div key={d.label} className="bg-card p-5">
                        <dt className="text-xs font-medium text-muted-foreground">{d.label}</dt>
                        <dd dir={d.ltr ? "ltr" : undefined} className="mt-1 truncate text-start font-medium text-foreground">
                            {d.value || "—"}
                        </dd>
                    </div>
                ))}
            </dl>

            <Modal open={open === "profile"} onClose={() => setOpen(null)} title={t("editProfile")} closeLabel={tCommon("close")}>
                <ProfileForm user={user} onSuccess={() => setOpen(null)} />
            </Modal>

            <Modal open={open === "password"} onClose={() => setOpen(null)} title={tPassword("title")} closeLabel={tCommon("close")}>
                <ChangePassword onSuccess={() => setOpen(null)} />
            </Modal>
        </div>
    );
}

export default GetProfile;