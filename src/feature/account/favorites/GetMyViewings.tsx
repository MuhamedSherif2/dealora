"use client";

import { useState } from "react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Link } from "@/i18n/navigation";
import { parseApiError } from "@/lib/apiError";
import { useGetViewingQuery, useUpdateViewingMutation } from "@/store/slices/viewingSlice";
import Button from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import type { Bilingual } from "@/types/common";
import type { ViewingStatus } from "@/types/viewing";

// the backend populates these fields on the viewing's property
type ViewingProperty = {
    _id: string; slug: string; title: Bilingual; price: number; currency: string;
    location?: { city?: Bilingual; district?: Bilingual }; images?: { url: string }[];
};

const statusStyles: Record<ViewingStatus, string> = {
    pending: "bg-secondary text-secondary-foreground",
    confirmed: "bg-primary/15 text-primary",
    completed: "bg-success/15 text-success",
    cancelled: "bg-destructive/15 text-destructive",
    no_show: "bg-muted text-muted-foreground",
};

export default function GetMyViewings() {
    const t = useTranslations("Account.viewings");
    const tEnums = useTranslations("Enums");
    const format = useFormatter();
    const locale = useLocale() as "ar" | "en";

    const [tab, setTab] = useState<"upcoming" | "all">("upcoming");
    const { data, isLoading, isError, refetch } = useGetViewingQuery(tab === "upcoming" ? { upcoming: "true" } : undefined);
    const [updateViewing, { isLoading: updating }] = useUpdateViewingMutation();

    const pick = (b?: Bilingual) => b?.[locale] ?? b?.en ?? b?.ar ?? "";
    const viewings = data?.data ?? [];

    async function cancel(id: string) {
        if (!window.confirm(t("cancelConfirm"))) return;
        try {
            await updateViewing({ id, body: { status: "cancelled" } }).unwrap();
            toast.success(t("cancelled"));
        } catch (err) {
            toast.error(parseApiError(err, t("failed")).message);
        }
    }

    function renderList() {
        if (isLoading) return <Loading />;

        if (isError) {
            return (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                    <p className="text-destructive">{t("error")}</p>
                    <Button variant="outline" onClick={() => refetch()}>{t("retry")}</Button>
                </div>
            );
        }

        if (viewings.length === 0) {
            return (
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-16 text-center">
                    <p className="text-muted-foreground">{t("empty")}</p>
                    <Link href="/properties" className="text-primary underline">{t("browse")}</Link>
                </div>
            );
        }

        return (
            <ul className="flex flex-col gap-4">
                {viewings.map((v) => {
                    const p = typeof v.property === "object" ? (v.property as unknown as ViewingProperty) : null;
                    const canCancel = v.status === "pending" || v.status === "confirmed";

                    return (
                        <li key={v._id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row">
                            <div className="h-32 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-44">
                                {p?.images?.[0] && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={p.images[0].url} alt="" className="size-full object-cover" />
                                )}
                            </div>

                            <div className="flex flex-1 flex-col gap-2">
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    <h2 className="font-bold text-foreground">{p ? pick(p.title) : t("propertyUnavailable")}</h2>
                                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[v.status]}`}>
                                        {tEnums(`viewingStatus.${v.status}`)}
                                    </span>
                                </div>

                                {p && (
                                    <p className="text-sm text-muted-foreground">
                                        {[pick(p.location?.district), pick(p.location?.city)].filter(Boolean).join(locale === "ar" ? "، " : ", ")}
                                    </p>
                                )}

                                <p className="text-sm font-medium text-foreground">
                                    {format.dateTime(new Date(v.scheduledAt), { dateStyle: "full", timeStyle: "short" })}
                                </p>

                                {v.notes && <p className="text-sm text-muted-foreground">{t("notes")}: {v.notes}</p>}

                                <div className="mt-auto flex flex-wrap justify-end gap-3 pt-2">
                                    {p && (
                                        <Link href={`/properties/${p.slug}`} className="inline-flex h-9 items-center rounded-(--radius) border border-border px-4 text-sm font-medium transition-colors hover:bg-muted">
                                            {t("viewProperty")}
                                        </Link>
                                    )}
                                    {canCancel && (
                                        <Button variant="destructive" size="sm" disabled={updating} onClick={() => cancel(v._id)}>
                                            {t("cancel")}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    }

    return (
        <section className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
                <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
            </div>

            <div role="tablist" className="inline-flex self-start rounded-xl bg-muted p-1">
                {(["upcoming", "all"] as const).map((key) => (
                    <button
                        key={key}
                        type="button"
                        role="tab"
                        aria-selected={tab === key}
                        onClick={() => setTab(key)}
                        className={`cursor-pointer rounded-lg px-5 py-2 text-sm font-medium transition-colors ${tab === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {t(`tabs.${key}`)}
                    </button>
                ))}
            </div>

            {renderList()}
        </section>
    );
}