import { Briefcase, Building, Building2, Bed, Crown, Home, Landmark, Layers, Store, Trees, Warehouse, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PROPERTY_TYPES } from "@/constants/property";

const icons: Record<(typeof PROPERTY_TYPES)[number], LucideIcon> = {
    apartment: Building2, villa: Home, townhouse: Landmark, penthouse: Crown, studio: Bed, duplex: Layers,
    office: Briefcase, shop: Store, warehouse: Warehouse, land: Trees, building: Building,
};

export default function PropertyTypes() {
    const t = useTranslations("Landing.types");
    const tEnums = useTranslations("Enums");

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-16">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t("title")}</h2>
                <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
            </div>

            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {PROPERTY_TYPES.map((type) => {
                    const Icon = icons[type];
                    return (
                        <li key={type}>
                            <Link
                                href={{ pathname: "/properties", query: { type } }}
                                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-all hover:-translate-y-1 hover:border-primary hover:shadow-md"
                            >
                                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                    <Icon size={24} />
                                </span>
                                <span className="text-sm font-medium text-foreground">{tEnums(`type.${type}`)}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}