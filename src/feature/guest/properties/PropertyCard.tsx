"use client";

import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import FavoriteButton from "./FavoriteButton";
import type { LocalizedProperty } from "@/types/property";

export default function PropertyCard({ p }: { p: LocalizedProperty }) {
    const t = useTranslations("Properties");
    const tEnums = useTranslations("Enums");
    const format = useFormatter();
    const locale = useLocale() as "ar" | "en";

    const place = [p.i18n.district, p.i18n.city].filter(Boolean).join(locale === "ar" ? "، " : ", ");
    const price = format.number(p.price, { style: "currency", currency: p.currency, maximumFractionDigits: 0 });

    return (
        <li className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
            <div className="relative aspect-4/3 overflow-hidden bg-muted">
                {p.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={p.images[0].url}
                        alt={p.i18n.title}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                )}

                <span className="absolute inset-s-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    {tEnums(`purpose.${p.purpose}`)}
                </span>
                {p.isFeatured && (
                    <span className="absolute inset-e-3 top-3 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                        ★
                    </span>
                )}
                <FavoriteButton propertyId={p._id} className="absolute inset-e-3 bottom-3" />
            </div>

            <div className="flex flex-col gap-2 p-4">
                <p className="text-lg font-bold text-primary">
                    {price}
                    {p.purpose === "rent" && p.rentPeriod && (
                        <span className="ms-1 text-sm font-normal text-muted-foreground">/ {tEnums(`rentPeriod.${p.rentPeriod}`)}</span>
                    )}
                </p>
                <h3 className="line-clamp-1 font-semibold text-foreground">{p.i18n.title}</h3>
                <p className="line-clamp-1 text-sm text-muted-foreground">{place}</p>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-sm text-muted-foreground">
                    <span>{t("beds", { count: p.bedrooms })}</span>
                    <span>{t("baths", { count: p.bathrooms })}</span>
                    <span>{p.area} {tEnums(`areaUnit.${p.areaUnit}`)}</span>
                </div>

                <Link
                    href={`/properties/${p.slug}`}
                    className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-(--radius) bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                    {t("viewDetails")}
                </Link>
            </div>
        </li>
    );
}