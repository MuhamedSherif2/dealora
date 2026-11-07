"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import { parseApiError } from "@/lib/apiError";
import { useAddSavedSearchMutation } from "@/store/slices/savesSearchSlice";

const PURPOSES = ["sale", "rent"] as const;
const TYPES = ["apartment", "villa", "townhouse", "penthouse", "studio", "duplex", "office", "shop", "warehouse", "land", "building"] as const;
const COUNTRIES = ["AE", "SA", "KW", "QA", "BH", "OM"] as const;
const CURRENCIES = ["AED", "SAR", "KWD", "QAR", "BHD", "OMR", "USD"] as const;
const FURNISHING = ["furnished", "semi_furnished", "unfurnished"] as const;
const CHANNELS = ["whatsapp", "email"] as const;

const initial = {
    name: "", purpose: "", type: "", country: "", city: "", district: "",
    currency: "", minPrice: "", maxPrice: "", minBedrooms: "", furnishing: "",
    notifyVia: ["email"] as string[],
};

function AddSearch({ onSuccess }: { onSuccess?: () => void }) {
    const t = useTranslations("SavedSearch");
    const tEnums = useTranslations("Enums");
    const [addSearch, { isLoading }] = useAddSavedSearchMutation();

    const [form, setForm] = useState(initial);
    const [formError, setFormError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const set = (key: keyof typeof initial, value: string) => setForm((f) => ({ ...f, [key]: value }));
    // "" = no condition, shown first in every select
    const options = (values: readonly string[], ns: string) => [
        { value: "", label: t("any") },
        ...values.map((v) => ({ value: v, label: tEnums(`${ns}.${v}`) })),
    ];

    function toggleChannel(channel: string) {
        setForm((f) => ({
            ...f,
            notifyVia: f.notifyVia.includes(channel)
                ? f.notifyVia.filter((c) => c !== channel)
                : [...f.notifyVia, channel],
        }));
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setFormError("");
        setFieldErrors({});

        // only send the conditions the user actually filled
        const criteria = {
            ...(form.purpose && { purpose: form.purpose }),
            ...(form.type && { types: [form.type] }),
            ...(form.country && { country: form.country }),
            ...(form.city.trim() && { city: form.city.trim() }),
            ...(form.district.trim() && { district: form.district.trim() }),
            ...(form.currency && { currency: form.currency }),
            ...(form.minPrice && { minPrice: Number(form.minPrice) }),
            ...(form.maxPrice && { maxPrice: Number(form.maxPrice) }),
            ...(form.minBedrooms && { minBedrooms: Number(form.minBedrooms) }),
            ...(form.furnishing && { furnishing: form.furnishing }),
        };

        if (Object.keys(criteria).length === 0) {
            setFormError(t("needOne"));
            return;
        }

        try {
            await addSearch({
                ...(form.name.trim() && { name: form.name.trim() }),
                criteria,
                notifyVia: form.notifyVia,
            } as never).unwrap();
            toast.success(t("saved"));
            setForm(initial);
            onSuccess?.();
        } catch (err) {
            const { message, fields } = parseApiError(err, t("failed"));
            setFormError(message);
            setFieldErrors(fields);
        }
    }

    const fe = (path: string) => fieldErrors[`criteria.${path}`] ?? fieldErrors[path];
    const grid = "grid gap-4 sm:grid-cols-2";

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div>
                <h2 className="text-xl font-bold text-foreground">{t("title")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>

            <Input label={t("name")} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder={t("namePlaceholder")} error={fe("name")} />

            <div className={grid}>
                <Select label={t("purpose")} value={form.purpose} onChange={(e) => set("purpose", e.target.value)} options={options(PURPOSES, "purpose")} error={fe("purpose")} />
                <Select label={t("type")} value={form.type} onChange={(e) => set("type", e.target.value)} options={options(TYPES, "type")} error={fe("types")} />
                <Select label={t("country")} value={form.country} onChange={(e) => set("country", e.target.value)} options={options(COUNTRIES, "country")} error={fe("country")} />
                <Input label={t("city")} value={form.city} onChange={(e) => set("city", e.target.value)} error={fe("city")} />
                <Input label={t("district")} value={form.district} onChange={(e) => set("district", e.target.value)} error={fe("district")} />
                <Select
                    label={t("currency")}
                    value={form.currency}
                    onChange={(e) => set("currency", e.target.value)}
                    options={[{ value: "", label: t("any") }, ...CURRENCIES.map((c) => ({ value: c, label: c }))]}
                />
                <Input label={t("minPrice")} type="number" min={0} dir="ltr" value={form.minPrice} onChange={(e) => set("minPrice", e.target.value)} error={fe("minPrice")} />
                <Input label={t("maxPrice")} type="number" min={0} dir="ltr" value={form.maxPrice} onChange={(e) => set("maxPrice", e.target.value)} error={fe("maxPrice")} />
                <Input label={t("minBedrooms")} type="number" min={0} dir="ltr" value={form.minBedrooms} onChange={(e) => set("minBedrooms", e.target.value)} error={fe("minBedrooms")} />
                <Select label={t("furnishing")} value={form.furnishing} onChange={(e) => set("furnishing", e.target.value)} options={options(FURNISHING, "furnishing")} error={fe("furnishing")} />
            </div>

            <div>
                <p className="mb-2 text-sm font-medium">{t("notifyVia")}</p>
                <div className="flex flex-wrap gap-4">
                    {CHANNELS.map((c) => (
                        <label key={c} className="flex cursor-pointer items-center gap-2 text-sm">
                            <input type="checkbox" className="size-4 accent-primary" checked={form.notifyVia.includes(c)} onChange={() => toggleChannel(c)} />
                            {t(`channels.${c}`)}
                        </label>
                    ))}
                </div>
                {fe("notifyVia") && <p role="alert" className="mt-1 text-sm text-destructive">{fe("notifyVia")}</p>}
            </div>

            {formError && (
                <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {formError}
                </p>
            )}

            <div className="flex justify-end">
                <Button type="submit" loading={isLoading}>{t("save")}</Button>
            </div>
        </form>
    );
}

export default AddSearch;