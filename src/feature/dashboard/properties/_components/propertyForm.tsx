"use client";

import { useId, useState, type FormEvent, type TextareaHTMLAttributes } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import { parseApiError } from "@/lib/apiError";
import { useAddPropertyMutation, useUpdatePropertyMutation } from "@/store/slices/propertySlice";
import type { Bilingual, Currency } from "@/types/common";
import type { AreaUnit, CompletionStatus, CreatePropertyRequest, Furnishing, LocalizedProperty, PaymentMethod, PropertyType, Purpose, RentPeriod, } from "@/types/property";
import type { Country } from "@/types/common"

const TYPES: PropertyType[] = ["apartment", "villa", "townhouse", "penthouse", "studio", "duplex", "office", "shop", "warehouse", "land", "building"];
const PURPOSES: Purpose[] = ["sale", "rent"];
const CURRENCIES: Currency[] = ["AED", "SAR", "KWD", "QAR", "BHD", "OMR", "USD"];
const COUNTRIES: Country[] = ["AE", "SA", "KW", "QA", "BH", "OM"];
const RENT_PERIODS: RentPeriod[] = ["yearly", "monthly", "weekly", "daily"];
const AREA_UNITS: AreaUnit[] = ["sqm", "sqft"];
const FURNISHING: Furnishing[] = ["furnished", "semi_furnished", "unfurnished"];
const COMPLETION: CompletionStatus[] = ["ready", "off_plan"];
const PAYMENT: PaymentMethod[] = ["cash", "installments", "mortgage"];

type FormState = {
    titleAr: string; titleEn: string; descAr: string; descEn: string;
    type: PropertyType; purpose: Purpose; price: string; currency: Currency; rentPeriod: RentPeriod;
    area: string; areaUnit: AreaUnit; bedrooms: string; bathrooms: string;
    furnishing: Furnishing; completionStatus: CompletionStatus; paymentMethod: PaymentMethod[];
    country: Country; cityAr: string; cityEn: string; districtAr: string; districtEn: string;
    compoundAr: string; compoundEn: string;
    amenities: string; isFeatured: boolean;
};

function initialState(p?: LocalizedProperty): FormState {
    return {
        titleAr: p?.title?.ar ?? "", titleEn: p?.title?.en ?? "",
        descAr: p?.description?.ar ?? "", descEn: p?.description?.en ?? "",
        type: p?.type ?? "apartment", purpose: p?.purpose ?? "sale",
        price: p ? String(p.price) : "", currency: p?.currency ?? "AED", rentPeriod: p?.rentPeriod ?? "yearly",
        area: p ? String(p.area) : "", areaUnit: p?.areaUnit ?? "sqm",
        bedrooms: p ? String(p.bedrooms) : "0", bathrooms: p ? String(p.bathrooms) : "0",
        furnishing: p?.furnishing ?? "unfurnished", completionStatus: p?.completionStatus ?? "ready",
        paymentMethod: p?.paymentMethod ?? [],
        country: p?.location.country ?? "AE",
        cityAr: p?.location.city?.ar ?? "", cityEn: p?.location.city?.en ?? "",
        districtAr: p?.location.district?.ar ?? "", districtEn: p?.location.district?.en ?? "",
        compoundAr: p?.location.compound?.ar ?? "", compoundEn: p?.location.compound?.en ?? "",
        amenities: p?.amenities.join(", ") ?? "", isFeatured: p?.isFeatured ?? false,
    };
}

// { ar, en } with empty languages removed; undefined when both are empty
function bilingual(ar: string, en: string): Bilingual | undefined {
    const value: Bilingual = {};
    if (ar.trim()) value.ar = ar.trim();
    if (en.trim()) value.en = en.trim();
    return value.ar || value.en ? value : undefined;
}

function buildBody(f: FormState): CreatePropertyRequest {
    const description = bilingual(f.descAr, f.descEn);
    const district = bilingual(f.districtAr, f.districtEn);
    const compound = bilingual(f.compoundAr, f.compoundEn);

    return {
        title: bilingual(f.titleAr, f.titleEn) ?? {},
        ...(description && { description }),
        type: f.type,
        purpose: f.purpose,
        price: Number(f.price),
        currency: f.currency,
        ...(f.purpose === "rent" && { rentPeriod: f.rentPeriod }),
        area: Number(f.area),
        areaUnit: f.areaUnit,
        bedrooms: Number(f.bedrooms),
        bathrooms: Number(f.bathrooms),
        furnishing: f.furnishing,
        completionStatus: f.completionStatus,
        paymentMethod: f.paymentMethod,
        location: {
            country: f.country,
            city: bilingual(f.cityAr, f.cityEn) ?? {},
            ...(district && { district }),
            ...(compound && { compound }),
        },
        amenities: f.amenities.split(/[,،]/).map((s) => s.trim()).filter(Boolean),
        isFeatured: f.isFeatured,
    };
}

// the backend reads the fields from "data" (JSON text) and the pictures from "images"
function toFormData(body: CreatePropertyRequest, files: File[]) {
    const fd = new FormData();
    fd.append("data", JSON.stringify(body));
    files.forEach((file) => fd.append("images", file));
    return fd;
}

function Textarea({ label, error, ...props }: { label: string; error?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
    const id = useId();
    return (
        <div className="flex w-full flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
            <textarea
                id={id}
                rows={4}
                aria-invalid={!!error}
                className={`w-full rounded-(--radius) border bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 ${error ? "border-destructive focus-visible:ring-destructive" : "border-input focus-visible:ring-ring"
                    }`}
                {...props}
            />
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

type Props = {
    property?: LocalizedProperty; // given = edit mode, missing = create mode
    onSuccess?: () => void;
    onCancel?: () => void;
};

function PropertyForm({ property, onSuccess, onCancel }: Props) {
    const t = useTranslations("PropertyForm");
    const tEnums = useTranslations("Enums");
    const isEdit = Boolean(property);

    const [addProperty, { isLoading: adding }] = useAddPropertyMutation();
    const [updateProperty, { isLoading: updating }] = useUpdatePropertyMutation();
    const isLoading = adding || updating;

    const [form, setForm] = useState<FormState>(() => initialState(property));
    const [files, setFiles] = useState<File[]>([]);
    const [formError, setFormError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
        setForm((f) => ({ ...f, [key]: value }));
    const fe = (...paths: string[]) => paths.map((p) => fieldErrors[p]).find(Boolean);
    const options = (values: readonly string[], ns: string) =>
        values.map((v) => ({ value: v, label: tEnums(`${ns}.${v}`) }));

    function togglePayment(method: PaymentMethod) {
        set("paymentMethod", form.paymentMethod.includes(method)
            ? form.paymentMethod.filter((m) => m !== method)
            : [...form.paymentMethod, method]);
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setFormError("");
        setFieldErrors({});
        const body = buildBody(form);

        try {
            if (property) {
                await updateProperty({ id: property._id, body }).unwrap();
            } else {
                await addProperty(files.length ? toFormData(body, files) : body).unwrap();
            }
            toast.success(isEdit ? t("updated") : t("created"));
            onSuccess?.();
        } catch (err) {
            const { message, fields } = parseApiError(err, t("failed"));
            setFormError(message);
            setFieldErrors(fields);
        }
    }

    const sectionTitle = "mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground";
    const grid = "grid gap-4 sm:grid-cols-2";

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <section>
                <h3 className={sectionTitle}>{t("sections.basic")}</h3>
                <div className={grid}>
                    <Input label={t("titleAr")} dir="rtl" value={form.titleAr} onChange={(e) => set("titleAr", e.target.value)} error={fe("title.ar", "title")} />
                    <Input label={t("titleEn")} dir="ltr" value={form.titleEn} onChange={(e) => set("titleEn", e.target.value)} error={fe("title.en")} />
                    <Textarea label={t("descAr")} dir="rtl" value={form.descAr} onChange={(e) => set("descAr", e.target.value)} error={fe("description.ar", "description")} />
                    <Textarea label={t("descEn")} dir="ltr" value={form.descEn} onChange={(e) => set("descEn", e.target.value)} error={fe("description.en")} />
                </div>
            </section>

            <section>
                <h3 className={sectionTitle}>{t("sections.details")}</h3>
                <div className={grid}>
                    <Select label={t("type")} value={form.type} onChange={(e) => set("type", e.target.value as PropertyType)} options={options(TYPES, "type")} error={fe("type")} />
                    <Select label={t("purpose")} value={form.purpose} onChange={(e) => set("purpose", e.target.value as Purpose)} options={options(PURPOSES, "purpose")} error={fe("purpose")} />
                    <Input label={t("price")} type="number" min={0} dir="ltr" value={form.price} onChange={(e) => set("price", e.target.value)} error={fe("price")} />
                    <Select label={t("currency")} value={form.currency} onChange={(e) => set("currency", e.target.value as Currency)} options={CURRENCIES.map((c) => ({ value: c, label: c }))} />
                    {form.purpose === "rent" && (
                        <Select label={t("rentPeriod")} value={form.rentPeriod} onChange={(e) => set("rentPeriod", e.target.value as RentPeriod)} options={options(RENT_PERIODS, "rentPeriod")} />
                    )}
                    <Input label={t("area")} type="number" min={0} dir="ltr" value={form.area} onChange={(e) => set("area", e.target.value)} error={fe("area")} />
                    <Select label={t("areaUnit")} value={form.areaUnit} onChange={(e) => set("areaUnit", e.target.value as AreaUnit)} options={options(AREA_UNITS, "areaUnit")} />
                    <Input label={t("bedrooms")} type="number" min={0} dir="ltr" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} error={fe("bedrooms")} />
                    <Input label={t("bathrooms")} type="number" min={0} dir="ltr" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} error={fe("bathrooms")} />
                    <Select label={t("furnishing")} value={form.furnishing} onChange={(e) => set("furnishing", e.target.value as Furnishing)} options={options(FURNISHING, "furnishing")} />
                    <Select label={t("completion")} value={form.completionStatus} onChange={(e) => set("completionStatus", e.target.value as CompletionStatus)} options={options(COMPLETION, "completion")} />
                </div>

                <div className="mt-4">
                    <p className="mb-2 text-sm font-medium">{t("paymentMethod")}</p>
                    <div className="flex flex-wrap gap-4">
                        {PAYMENT.map((m) => (
                            <label key={m} className="flex cursor-pointer items-center gap-2 text-sm">
                                <input type="checkbox" className="size-4 accent-primary" checked={form.paymentMethod.includes(m)} onChange={() => togglePayment(m)} />
                                {tEnums(`paymentMethod.${m}`)}
                            </label>
                        ))}
                    </div>
                </div>
            </section>

            <section>
                <h3 className={sectionTitle}>{t("sections.location")}</h3>
                <div className={grid}>
                    <Select label={t("country")} value={form.country} onChange={(e) => set("country", e.target.value as Country)} options={options(COUNTRIES, "country")} error={fe("location.country")} />
                    <div className="hidden sm:block" />
                    <Input label={t("cityAr")} dir="rtl" value={form.cityAr} onChange={(e) => set("cityAr", e.target.value)} error={fe("location.city.ar", "location.city")} />
                    <Input label={t("cityEn")} dir="ltr" value={form.cityEn} onChange={(e) => set("cityEn", e.target.value)} error={fe("location.city.en")} />
                    <Input label={t("districtAr")} dir="rtl" value={form.districtAr} onChange={(e) => set("districtAr", e.target.value)} />
                    <Input label={t("districtEn")} dir="ltr" value={form.districtEn} onChange={(e) => set("districtEn", e.target.value)} />
                    <Input label={t("compoundAr")} dir="rtl" value={form.compoundAr} onChange={(e) => set("compoundAr", e.target.value)} />
                    <Input label={t("compoundEn")} dir="ltr" value={form.compoundEn} onChange={(e) => set("compoundEn", e.target.value)} />
                </div>
            </section>

            <section>
                <h3 className={sectionTitle}>{t("sections.extras")}</h3>
                <div className="flex flex-col gap-4">
                    <Input label={t("amenities")} value={form.amenities} onChange={(e) => set("amenities", e.target.value)} placeholder={t("amenitiesHint")} />

                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <input type="checkbox" className="size-4 accent-primary" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} />
                        {t("featured")}
                    </label>

                    {!isEdit && (
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="property-images" className="text-sm font-medium">{t("images")}</label>
                            <input
                                id="property-images"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                                className="text-sm file:me-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-secondary-foreground"
                            />
                            <p className="text-sm text-muted-foreground">{t("imagesHint")}</p>
                        </div>
                    )}
                </div>
            </section>

            {formError && (
                <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {formError}
                </p>
            )}

            <div className="flex justify-end gap-3">
                {onCancel && <Button variant="outline" onClick={onCancel} disabled={isLoading}>{t("cancel")}</Button>}
                <Button type="submit" loading={isLoading}>{isEdit ? t("save") : t("create")}</Button>
            </div>
        </form>
    );
}

export default PropertyForm;