"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useGetAllPropertiesQuery } from "@/store/slices/propertySlice";
import Button from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import PropertyCard from "./PropertyCard";

// the filters the page reads from the URL (/properties?type=villa&city=Dubai)
const FILTER_KEYS = ["purpose", "type", "city", "bedrooms", "country", "district", "currency", "minPrice", "maxPrice", "furnishing"];

function GetAllProperties() {
    const t = useTranslations("Properties");
    const locale = useLocale() as "ar" | "en";
    const searchParams = useSearchParams();

    const filters = Object.fromEntries(
        FILTER_KEYS.map((k) => [k, searchParams.get(k)] as const).filter(([, v]) => v),
    );

    const { data, isLoading, isError, refetch } = useGetAllPropertiesQuery({ lang: locale, ...filters });

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
    if (properties.length === 0) {
        return <p className="py-16 text-center text-muted-foreground">{t("empty")}</p>;
    }

    return (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
                <PropertyCard key={p._id} p={p} />
            ))}
        </ul>
    );
}

export default GetAllProperties;