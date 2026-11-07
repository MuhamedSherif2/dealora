"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useGetPropertyQuery } from "@/store/slices/propertySlice";
import Button from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import AddViewingUser from "@/feature/guest/viewing/appViewingUser";

function ShowPropertyBySlug() {
    const t = useTranslations("PropertyDetails");
    const tp = useTranslations("Properties");
    const tEnums = useTranslations("Enums");
    const format = useFormatter();
    const locale = useLocale() as "ar" | "en";
    const sep = locale === "ar" ? "، " : ", ";

    const { slug } = useParams<{ slug: string }>();
    const { data, isLoading, isError, error, refetch } = useGetPropertyQuery({
        idOrSlug: decodeURIComponent(slug),
        lang: locale,
    });

    const [active, setActive] = useState(0);

    if (isLoading) return <Loading />;

    if (isError) {
        const notFound = (error as { status?: number })?.status === 404;
        return (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
                <p className={notFound ? "text-foreground" : "text-destructive"}>
                    {notFound ? t("notFound") : t("error")}
                </p>
                {notFound ? (
                    <Link href="/properties" className="text-primary underline">{t("backToList")}</Link>
                ) : (
                    <Button variant="outline" onClick={() => refetch()}>{t("retry")}</Button>
                )}
            </div>
        );
    }

    const p = data?.data;
    if (!p) return null;

    const place = [p.i18n.compound, p.i18n.district, p.i18n.city].filter(Boolean).join(sep);
    const price = format.number(p.price, { style: "currency", currency: p.currency, maximumFractionDigits: 0 });
    const agent = typeof p.agent === "object" ? p.agent : null;

    const specs: { label: string; value: string }[] = [
        { label: t("specs.type"), value: tEnums(`type.${p.type}`) },
        { label: t("specs.purpose"), value: tEnums(`purpose.${p.purpose}`) },
        { label: t("specs.status"), value: tEnums(`propertyStatus.${p.status}`) },
        { label: t("specs.bedrooms"), value: tp("beds", { count: p.bedrooms }) },
        { label: t("specs.bathrooms"), value: tp("baths", { count: p.bathrooms }) },
        { label: t("specs.area"), value: `${p.area} ${tEnums(`areaUnit.${p.areaUnit}`)}` },
        { label: t("specs.furnishing"), value: tEnums(`furnishing.${p.furnishing}`) },
        { label: t("specs.completion"), value: tEnums(`completion.${p.completionStatus}`) },
        ...(p.floor != null ? [{ label: t("specs.floor"), value: String(p.floor) }] : []),
        ...(p.developer ? [{ label: t("specs.developer"), value: p.developer }] : []),
        ...(p.handoverDate
            ? [{ label: t("specs.handover"), value: format.dateTime(new Date(p.handoverDate), { year: "numeric", month: "long" }) }]
            : []),
        ...(p.permitNumber ? [{ label: t("specs.permit"), value: p.permitNumber }] : []),
        ...(p.paymentMethod?.length
            ? [{ label: t("specs.payment"), value: p.paymentMethod.map((m) => tEnums(`paymentMethod.${m}`)).join(sep) }]
            : []),
    ];

    return (
        <article className="flex flex-col gap-6">
            <Link href="/properties" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                ← {t("backToList")}
            </Link>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* left column: gallery + info */}
                <div className="flex flex-col gap-8 lg:col-span-2">
                    <div className="flex flex-col gap-3">
                        <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted">
                            {p.images[active] && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={p.images[active].url} alt={p.i18n.title} className="size-full object-cover" />
                            )}
                            <span className="absolute inset-s-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                                {tEnums(`purpose.${p.purpose}`)}
                            </span>
                            {p.isFeatured && (
                                <span className="absolute inset-e-4 top-4 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                                    ★ {t("featured")}
                                </span>
                            )}
                        </div>

                        {p.images.length > 1 && (
                            <ul className="flex gap-2 overflow-x-auto pb-1">
                                {p.images.map((img, i) => (
                                    <li key={img.publicId} className="shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setActive(i)}
                                            aria-label={`${t("image")} ${i + 1}`}
                                            className={`block h-16 w-24 cursor-pointer overflow-hidden rounded-lg border-2 transition-colors ${i === active ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                                                }`}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={img.url} alt="" className="size-full object-cover" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <header className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{p.i18n.title}</h1>
                        <p className="text-muted-foreground">{[place, p.i18n.address].filter(Boolean).join(sep)}</p>
                    </header>

                    {p.i18n.description && (
                        <section>
                            <h2 className="mb-3 text-lg font-bold">{t("description")}</h2>
                            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{p.i18n.description}</p>
                        </section>
                    )}

                    <section>
                        <h2 className="mb-3 text-lg font-bold">{t("specsTitle")}</h2>
                        <dl className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
                            {specs.map((s) => (
                                <div key={s.label} className="flex items-center justify-between gap-4 bg-card px-4 py-3">
                                    <dt className="text-sm text-muted-foreground">{s.label}</dt>
                                    <dd className="text-sm font-medium text-foreground">{s.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>

                    {p.amenities.length > 0 && (
                        <section>
                            <h2 className="mb-3 text-lg font-bold">{t("amenities")}</h2>
                            <ul className="flex flex-wrap gap-2">
                                {p.amenities.map((a) => (
                                    <li key={a} className="rounded-full border border-border bg-card px-3 py-1 text-sm">{a}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

                {/* right column: price + booking + agent */}
                <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <p className="text-3xl font-bold text-primary">
                            {price}
                            {p.purpose === "rent" && p.rentPeriod && (
                                <span className="ms-1 text-base font-normal text-muted-foreground">
                                    / {tEnums(`rentPeriod.${p.rentPeriod}`)}
                                </span>
                            )}
                        </p>
                    </div>

                    <AddViewingUser propertyId={p._id} />

                    {agent && (
                        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("agent")}</p>
                            <p className="font-semibold">{agent.name}</p>
                            {agent.company && <p className="text-sm text-muted-foreground">{agent.company}</p>}
                            {agent.phone && (
                                <a href={`tel:${agent.phone}`} dir="ltr" className="mt-2 block text-sm text-primary hover:underline">
                                    {agent.phone}
                                </a>
                            )}
                        </div>
                    )}
                </aside>
            </div>
        </article>
    );
}

export default ShowPropertyBySlug;