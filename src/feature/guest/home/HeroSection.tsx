"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { PROPERTY_TYPES } from "@/constants/property";

const BEDROOMS = ["1", "2", "3", "4+"];

export default function HeroSection() {
    const t = useTranslations("Landing.hero");
    const tEnums = useTranslations("Enums");
    const router = useRouter();

    const [purpose, setPurpose] = useState<"sale" | "rent">("sale");
    const [type, setType] = useState("");
    const [city, setCity] = useState("");
    const [bedrooms, setBedrooms] = useState("");

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        router.push({
            pathname: "/properties",
            query: {
                purpose,
                ...(type && { type }),
                ...(city.trim() && { city: city.trim() }),
                ...(bedrooms && { bedrooms }),
            },
        });
    }

    return (
        <section className="relative bg-primary bg-[url('/images/hero.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-linear-to-b from-[#0E1726]/80 via-primary/55 to-[#0E1726]/90" />

            <div className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center gap-10 px-4 py-20">
                <div className="max-w-2xl">
                    <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">{t("title")}</h1>
                    <p className="mt-4 text-lg text-white/85">{t("subtitle")}</p>
                </div>

                <form onSubmit={handleSubmit} className="rounded-2xl bg-card p-4 shadow-xl sm:p-6">
                    <div role="tablist" className="mb-4 inline-flex rounded-xl bg-muted p-1">
                        {(["sale", "rent"] as const).map((p) => (
                            <button
                                key={p}
                                type="button"
                                role="tab"
                                aria-selected={purpose === p}
                                onClick={() => setPurpose(p)}
                                className={`cursor-pointer rounded-lg px-5 py-2 text-sm font-medium transition-colors ${purpose === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {tEnums(`purpose.${p}`)}
                            </button>
                        ))}
                    </div>

                    <div className="grid gap-3 md:grid-cols-[repeat(3,1fr)_10rem_auto] md:items-end">
                        <Select
                            label={t("type")}
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            options={[
                                { value: "", label: t("anyType") },
                                ...PROPERTY_TYPES.map((v) => ({ value: v, label: tEnums(`type.${v}`) })),
                            ]}
                        />
                        <Input label={t("city")} placeholder={t("cityPlaceholder")} value={city} onChange={(e) => setCity(e.target.value)} />
                        <Select
                            label={t("bedrooms")}
                            value={bedrooms}
                            onChange={(e) => setBedrooms(e.target.value)}
                            options={[{ value: "", label: t("any") }, ...BEDROOMS.map((b) => ({ value: b, label: b }))]}
                        />
                        <div className="hidden md:block" />
                        <Button type="submit" size="lg">{t("search")}</Button>
                    </div>
                </form>
            </div>
        </section>
    );
}