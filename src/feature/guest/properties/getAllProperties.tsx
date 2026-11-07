"use client";

import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useGetAllPropertiesQuery } from "@/store/slices/propertySlice";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import { Link } from "@/i18n/navigation";
import PropertyCard from "./PropertyCard";
import FavoriteButton from "./FavoriteButton";

function GetAllProperties() {
    const t = useTranslations("Properties");
    const tEnums = useTranslations("Enums");
    const format = useFormatter();
    const locale = useLocale() as "ar" | "en";
    const searchParams = useSearchParams();
    const FILTER_KEYS = ["purpose", "type", "city", "bedrooms", "country", "district", "currency", "minPrice", "maxPrice", "furnishing"];
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
            {properties.map((p) => {
                const place = [p.i18n.district, p.i18n.city].filter(Boolean).join(locale === "ar" ? "، " : ", ");
                const price = format.number(p.price, {
                    style: "currency",
                    currency: p.currency,
                    maximumFractionDigits: 0,
                });

                return (
                    <li
                        key={p._id}
                        className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div className="relative aspect-4/3 overflow-hidden bg-muted">
                            {p.images[0] ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={p.images[0].url}
                                    alt={p.i18n.title}
                                    loading="lazy"
                                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : null}

                            <span className="absolute inset-s-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                                {tEnums(`purpose.${p.purpose}`)}
                            </span>
                            {p.isFeatured && (
                                <span className="absolute inset-e-3 top-3 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                                    ★
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 p-4">
                            <p className="text-lg font-bold text-primary">
                                {price}
                                {p.purpose === "rent" && p.rentPeriod && (
                                    <span className="ms-1 text-sm font-normal text-muted-foreground">
                                        / {tEnums(`rentPeriod.${p.rentPeriod}`)}
                                    </span>
                                )}
                            </p>

                            <h3 className="line-clamp-1 font-semibold text-foreground">{p.i18n.title}</h3>
                            <p className="line-clamp-1 text-sm text-muted-foreground">{place}</p>

                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-sm text-muted-foreground">
                                <span>{t("beds", { count: p.bedrooms })}</span>
                                <span>{t("baths", { count: p.bathrooms })}</span>
                                <span>{p.area} {tEnums(`areaUnit.${p.areaUnit}`)}</span>
                                <Link
                                    href={`/properties/${p.slug}`}
                                    className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-(--radius) bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
                                >
                                    {t("viewDetails")}
                                </Link>
                                <FavoriteButton propertyId={p._id} className="border border-border" />
                                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {properties.map((p) => <PropertyCard key={p._id} p={p} />)}
                                </ul>
                            </div>
                        </div>
                    </li>

                );
            })}
        </ul>
    );
}

export default GetAllProperties;