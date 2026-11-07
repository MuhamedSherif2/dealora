"use client";

import { useFormatter, useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Link } from "@/i18n/navigation";
import { parseApiError } from "@/lib/apiError";
import Button from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import {
    useDeleteSavedSearchMutation, useGetSavedSearchQuery, useUpdateSavedSearchMutation,
} from "@/store/slices/savesSearchSlice";
import type { SavedSearch, SavedSearchCriteria } from "@/types/savedSearch";

// the same criteria expressed as /properties filters
function criteriaToQuery(c: SavedSearchCriteria) {
    return {
        ...(c.purpose ? { purpose: c.purpose } : {}),
        ...(c.types?.length ? { type: c.types.join(",") } : {}),
        ...(c.country ? { country: c.country } : {}),
        ...(c.city ? { city: c.city } : {}),
        ...(c.district ? { district: c.district } : {}),
        ...(c.currency ? { currency: c.currency } : {}),
        ...(c.minPrice != null ? { minPrice: String(c.minPrice) } : {}),
        ...(c.maxPrice != null ? { maxPrice: String(c.maxPrice) } : {}),
        ...(c.minBedrooms != null ? { bedrooms: `${c.minBedrooms}+` } : {}),
        ...(c.furnishing ? { furnishing: c.furnishing } : {}),
    };
}

function GetSavedSearch() {
    const t = useTranslations("Account.savedSearches");
    const tEnums = useTranslations("Enums");
    const format = useFormatter();
    const { data, isLoading, isError, refetch } = useGetSavedSearchQuery();
    const [updateSearch, { isLoading: updating }] = useUpdateSavedSearchMutation();
    const [deleteSearch] = useDeleteSavedSearchMutation();

    if (isLoading) return <Loading />;

    if (isError) {
        return (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
                <p className="text-destructive">{t("error")}</p>
                <Button variant="outline" onClick={() => refetch()}>{t("retry")}</Button>
            </div>
        );
    }

    const searches = data?.data ?? [];

    function chips(c: SavedSearchCriteria) {
        const money = (n: number) =>
            format.number(n, { style: "currency", currency: c.currency ?? "USD", maximumFractionDigits: 0 });
        const price =
            c.minPrice != null && c.maxPrice != null ? t("priceBetween", { min: money(c.minPrice), max: money(c.maxPrice) })
            : c.minPrice != null ? t("priceFrom", { value: money(c.minPrice) })
            : c.maxPrice != null ? t("priceUpTo", { value: money(c.maxPrice) })
            : null;

        return [
            c.purpose && tEnums(`purpose.${c.purpose}`),
            ...(c.types ?? []).map((v) => tEnums(`type.${v}`)),
            c.country && tEnums(`country.${c.country}`),
            c.city,
            c.district,
            price,
            c.minBedrooms != null && t("minBeds", { count: c.minBedrooms }),
            c.furnishing && tEnums(`furnishing.${c.furnishing}`),
        ].filter(Boolean) as string[];
    }

    async function toggle(s: SavedSearch) {
        try {
            await updateSearch({ id: s._id, body: { isActive: !s.isActive } }).unwrap();
            toast.success(t("updated"));
        } catch (err) {
            toast.error(parseApiError(err, t("failed")).message);
        }
    }

    async function remove(id: string) {
        if (!window.confirm(t("deleteConfirm"))) return;
        try {
            await deleteSearch(id).unwrap();
            toast.success(t("deleted"));
        } catch (err) {
            toast.error(parseApiError(err, t("failed")).message);
        }
    }

    return (
        <section className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
                <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
            </div>

            {searches.length === 0 ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-16 text-center">
                    <p className="text-muted-foreground">{t("empty")}</p>
                    <Link href="/" className="text-primary underline">{t("emptyCta")}</Link>
                </div>
            ) : (
                <ul className="flex flex-col gap-4">
                    {searches.map((s) => (
                        <li key={s._id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h2 className="font-bold text-foreground">{s.name || t("unnamed")}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {t("notifyVia")}: {s.notifyVia.map((c) => t(`channels.${c}`)).join(" · ")}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={s.isActive}
                                    disabled={updating}
                                    onClick={() => toggle(s)}
                                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-60 ${
                                        s.isActive ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                                    }`}
                                >
                                    <span className={`size-2 rounded-full ${s.isActive ? "bg-success" : "bg-muted-foreground"}`} />
                                    {s.isActive ? t("active") : t("paused")}
                                </button>
                            </div>

                            <ul className="flex flex-wrap gap-2">
                                {chips(s.criteria).map((label) => (
                                    <li key={label} className="rounded-full border border-border bg-background px-3 py-1 text-sm">{label}</li>
                                ))}
                            </ul>

                            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-4">
                                <Button variant="outline" size="sm" onClick={() => remove(s._id)}>{t("delete")}</Button>
                                <Link
                                    href={{ pathname: "/properties", query: criteriaToQuery(s.criteria) }}
                                    className="inline-flex h-9 items-center rounded-(--radius) bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
                                >
                                    {t("run")}
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default GetSavedSearch;