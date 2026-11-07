"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useListFavoriteQuery } from "@/store/slices/favoriteSlice";
import Button from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import PropertyCard from "@/feature/guest/properties/PropertyCard";

export default function GetFavorites() {
    const t = useTranslations("Account.favorites");
    const locale = useLocale() as "ar" | "en";
    const { data, isLoading, isError, refetch } = useListFavoriteQuery({ lang: locale });

    if (isLoading) return <Loading />;

    if (isError) {
        return (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
                <p className="text-destructive">{t("error")}</p>
                <Button variant="outline" onClick={() => refetch()}>{t("retry")}</Button>
            </div>
        );
    }

    const properties = data?.data ?? [];

    return (
        <section className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
                <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
            </div>

            {properties.length === 0 ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-16 text-center">
                    <p className="text-muted-foreground">{t("empty")}</p>
                    <Link href="/properties" className="text-primary underline">{t("browse")}</Link>
                </div>
            ) : (
                <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {properties.map((p) => <PropertyCard key={p._id} p={p} />)}
                </ul>
            )}
        </section>
    );
}