"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { cookieHelper } from "@/lib/cookies";
import AddSearch from "../search/addSearch";

export default function SaveSearchBand() {
    const t = useTranslations("Landing.saveBand");
    const [open, setOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        setLoggedIn(!!cookieHelper.get("dealora_token"));
    }, []);

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-8">
            <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-primary px-8 py-10 text-primary-foreground md:flex-row md:items-center">
                <div className="max-w-xl">
                    <h2 className="text-2xl font-bold sm:text-3xl">{t("title")}</h2>
                    <p className="mt-2 text-primary-foreground/85">{t("subtitle")}</p>
                </div>

                <div className="min-h-12">
                    {loggedIn === true && (
                        <Button variant="secondary" size="lg" onClick={() => setOpen(true)}>{t("cta")}</Button>
                    )}
                    {loggedIn === false && (
                        <Link
                            href="/login"
                            className="inline-flex h-12 items-center rounded-(--radius) bg-white px-6 text-sm font-semibold text-black transition-colors hover:bg-white/90"
                        >
                            {t("loginCta")}
                        </Link>
                    )}
                </div>
            </div>

            <Modal open={open} onClose={() => setOpen(false)} title={t("modalTitle")}>
                <AddSearch onSuccess={() => setOpen(false)} />
            </Modal>
        </section>
    );
}