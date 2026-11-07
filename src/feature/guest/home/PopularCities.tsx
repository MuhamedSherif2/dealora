"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useGetPropertyCitiesQuery } from "@/store/slices/propertySlice";

export default function PopularCities() {
    const t = useTranslations("Landing.cities");
    const tEnums = useTranslations("Enums");
    const locale = useLocale() as "ar" | "en";
    const { data, isLoading, isError } = useGetPropertyCitiesQuery();

    const cities = data?.data ?? [];
    // hide the whole section while loading, on error, or when there are no listings yet
    if (isLoading || isError || cities.length === 0) return null;

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-16">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t("title")}</h2>
                <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
            </div>

            <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {cities.map((c) => {
                    const name = c.city[locale] ?? c.city.en ?? c.city.ar ?? "";
                    return (
                        <li key={`${c.country}-${name}`}>
                            <Link
                                href={{ pathname: "/properties", query: { city: name } }}
                                className="group relative block aspect-4/5 overflow-hidden rounded-2xl bg-linear-to-br from-primary to-[#0E1726]"
                            >
                                {c.image && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={c.image}
                                        alt={name}
                                        loading="lazy"
                                        className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                )}
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/15 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                                    <p className="text-lg font-bold">{name}</p>
                                    <p className="text-sm text-white/80">
                                        {tEnums(`country.${c.country}`)} · {t("count", { count: c.count })}
                                    </p>
                                </div>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}