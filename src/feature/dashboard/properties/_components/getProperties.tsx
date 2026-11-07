"use client";

import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useGetManagedPropertiesQuery } from "@/store/slices/propertySlice";
import Button from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import AddButtonProperty from "../_ui/addButtonProperties";
import UpdateButtonProperty from "../_ui/updateButtonProperty";
import DeleteButtonProperty from "../_ui/deleteButtonProperty";
import PropertyImagesButton from "../_ui/propertyImagesButton";
import PropertyStatusSelect from "../_ui/propertyStatusSelect";

const columns = [
    "title", "location", "country", "type", "purpose", "price", "bedrooms", "bathrooms",
    "area", "furnishing", "paymentMethod", "completionStatus", "amenities", "featured",
    "status", "agent", "images", "actions",
] as const;

const cell = "whitespace-nowrap border-e border-border px-4 py-3";

function GetProperties() {
    const t = useTranslations("Properties");
    const tEnums = useTranslations("Enums");
    const format = useFormatter();
    const locale = useLocale() as "ar" | "en";
    const sep = locale === "ar" ? "، " : ", ";
    const { data, isLoading, isError, refetch } = useGetManagedPropertiesQuery({ lang: locale, status: "all" });

    const properties = data?.data ?? [];

    function renderContent() {
        if (isLoading) return <Loading />;

        if (isError) {
            return (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                    <p className="text-destructive">{t("error")}</p>
                    <Button variant="outline" onClick={() => refetch()}>{t("retry")}</Button>
                </div>
            );
        }

        if (properties.length === 0) {
            return <p className="py-16 text-center text-muted-foreground">{t("empty")}</p>;
        }

        return (
            <div className="w-full overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                <table className="w-full min-w-max border-collapse text-start text-sm">
                    <thead className="bg-muted text-muted-foreground">
                        <tr className="border-b border-border">
                            {columns.map((c) => (
                                <th
                                    key={c}
                                    className="whitespace-nowrap border-e border-border px-4 py-4 text-start font-semibold last:border-e-0"
                                >
                                    {t(`columns.${c}`)}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {properties.map((p) => (
                            <tr key={p._id} className="transition-colors hover:bg-muted/50">
                                <td className={`${cell} font-medium`}>{p.i18n.title}</td>
                                <td className={cell}>
                                    {[p.i18n.compound, p.i18n.district, p.i18n.city].filter(Boolean).join(sep)}
                                </td>
                                <td className={cell}>{tEnums(`country.${p.location.country}`)}</td>
                                <td className={cell}>{tEnums(`type.${p.type}`)}</td>
                                <td className={cell}>{tEnums(`purpose.${p.purpose}`)}</td>
                                <td className={cell}>
                                    {format.number(p.price, {
                                        style: "currency",
                                        currency: p.currency,
                                        maximumFractionDigits: 0,
                                    })}
                                </td>
                                <td className={cell}>{p.bedrooms}</td>
                                <td className={cell}>{p.bathrooms}</td>
                                <td className={cell}>{p.area} {tEnums(`areaUnit.${p.areaUnit}`)}</td>
                                <td className={cell}>{tEnums(`furnishing.${p.furnishing}`)}</td>
                                <td className={cell}>
                                    {p.paymentMethod?.map((m) => tEnums(`paymentMethod.${m}`)).join(sep)}
                                </td>
                                <td className={cell}>{tEnums(`completion.${p.completionStatus}`)}</td>
                                <td className={`${cell} max-w-56 truncate`} title={p.amenities.join(sep)}>
                                    {p.amenities.join(sep)}
                                </td>
                                <td className={cell}>{p.isFeatured ? t("yes") : t("no")}</td>
                                <td className={cell}><PropertyStatusSelect property={p} /></td>
                                <td className={cell}>{typeof p.agent === "string" ? "—" : p.agent.name}</td>
                                <td className={cell}><PropertyImagesButton property={p} /></td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <UpdateButtonProperty property={p} />
                                        <DeleteButtonProperty id={p._id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
                <AddButtonProperty />
            </div>
            {renderContent()}
        </section>
    );
}

export default GetProperties;