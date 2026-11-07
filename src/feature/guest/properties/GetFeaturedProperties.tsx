"use client";

import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useGetPropertiesFeaturedQuery } from "@/store/slices/propertySlice";
import Loading from "@/components/ui/Loading";
import Link from "next/link";

function GetFeaturedProperties() {
    const t = useTranslations("Properties");
    const tEnums = useTranslations("Enums");
    const format = useFormatter();
    const locale = useLocale() as "ar" | "en";
    const sep = locale === "ar" ? "، " : ", ";
    const { data, isLoading, isError } = useGetPropertiesFeaturedQuery({ lang: locale });

    if (isLoading) return <Loading />;

    const properties = data?.data ?? [];
    // on the home page an empty or failed featured section should just disappear
    if (isError || properties.length === 0) return null;

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t("featuredTitle")}</h2>
                <p className="text-muted-foreground">{t("featuredSubtitle")}</p>
            </div>

            <ul className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
                {properties.map((p) => {
                    const place = [p.i18n.district, p.i18n.city].filter(Boolean).join(sep);
                    const price = format.number(p.price, {
                        style: "currency",
                        currency: p.currency,
                        maximumFractionDigits: 0,
                    });

                    return (
                        <li
                            key={p._id}
                            className="group relative aspect-3/4 w-72 shrink-0 snap-start overflow-hidden rounded-2xl bg-muted shadow-md sm:w-80"
                        >
                            {p.images[0] && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={p.images[0].url}
                                    alt={p.i18n.title}
                                    loading="lazy"
                                    className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            )}

                            {/* dark gradient so the white text stays readable on any photo */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />

                            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black backdrop-blur">
                                    {tEnums(`type.${p.type}`)}
                                </span>
                                <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                                    {tEnums(`purpose.${p.purpose}`)}
                                </span>
                            </div>

                            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 text-white">
                                <p className="text-2xl font-bold">
                                    {price}
                                    {p.purpose === "rent" && p.rentPeriod && (
                                        <span className="ms-1 text-sm font-normal text-white/75">
                                            / {tEnums(`rentPeriod.${p.rentPeriod}`)}
                                        </span>
                                    )}
                                </p>
                                <h3 className="line-clamp-2 text-lg font-semibold leading-snug">{p.i18n.title}</h3>
                                <p className="line-clamp-1 text-sm text-white/80">{place}</p>

                                <div className="mt-1 flex gap-4 border-t border-white/25 pt-3 text-sm text-white/90">
                                    <span>{t("beds", { count: p.bedrooms })}</span>
                                    <span>{t("baths", { count: p.bathrooms })}</span>
                                    <span>{p.area} {tEnums(`areaUnit.${p.areaUnit}`)}</span>
                                </div>
                                <Link
                                    href={`/properties/${p.slug}`}
                                    className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-(--radius) bg-white px-4 text-sm font-semibold text-black transition-colors hover:bg-white/90"
                                >
                                    {t("viewDetails")}
                                </Link>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

export default GetFeaturedProperties;