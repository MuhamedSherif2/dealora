"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import toast from "react-hot-toast";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { cookieHelper } from "@/lib/cookies";
import { parseApiError } from "@/lib/apiError";
import { useAddViewingMutation } from "@/store/slices/viewingSlice";

type Props = {
    propertyId: string;
    onSuccess?: () => void;
};

const initial = { scheduledAt: "", notes: "", name: "", phone: "", email: "" };

function AddViewingUser({ propertyId, onSuccess }: Props) {
    const t = useTranslations("Viewing");
    const locale = useLocale() as "ar" | "en";
    const [addViewing, { isLoading }] = useAddViewingMutation();

    // null until the cookie is read, so the guest fields don't flash for logged-in users
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    // the earliest time the user can pick; set after mount (calling new Date() during render breaks prerender)
    const [minDate, setMinDate] = useState("");

    const [form, setForm] = useState(initial);
    const [formError, setFormError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setIsLoggedIn(!!cookieHelper.get("dealora_token"));

        // datetime-local wants "YYYY-MM-DDTHH:mm" in the user's own timezone
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        setMinDate(now.toISOString().slice(0, 16));
    }, []);

    const set = (key: keyof typeof initial, value: string) => setForm((f) => ({ ...f, [key]: value }));

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setFormError("");
        setFieldErrors({});

        const date = new Date(form.scheduledAt);
        if (!form.scheduledAt || Number.isNaN(date.getTime())) {
            setFieldErrors({ scheduledAt: t("dateRequired") });
            return;
        }
        if (date.getTime() <= Date.now()) {
            setFieldErrors({ scheduledAt: t("datePast") });
            return;
        }
        if (!isLoggedIn && (!form.name.trim() || !form.phone.trim())) {
            setFormError(t("contactRequired"));
            return;
        }

        // logged in: the backend takes name/email/language from the token. Guest: send them.
        const body = {
            propertyId,
            scheduledAt: date.toISOString(),
            ...(form.notes.trim() && { notes: form.notes.trim() }),
            ...(form.phone.trim() && { phone: form.phone.trim() }),
            ...(!isLoggedIn && {
                name: form.name.trim(),
                ...(form.email.trim() && { email: form.email.trim() }),
                language: locale,
            }),
        };

        try {
            await addViewing(body as never).unwrap();
            toast.success(t("success"));
            setForm(initial);
            onSuccess?.();
        } catch (err) {
            if ((err as { status?: number })?.status === 429) {
                setFormError(t("tooMany"));
                return;
            }
            const { message, fields } = parseApiError(err, t("failed"));
            setFormError(message);
            setFieldErrors(fields);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div>
                <h3 className="text-lg font-bold text-foreground">{t("title")}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>

            <Input
                label={t("date")}
                type="datetime-local"
                dir="ltr"
                min={minDate}
                value={form.scheduledAt}
                onChange={(e) => set("scheduledAt", e.target.value)}
                error={fieldErrors.scheduledAt}
            />

            {isLoggedIn === false && (
                <>
                    <Input label={t("name")} value={form.name} onChange={(e) => set("name", e.target.value)} error={fieldErrors.name} />
                    <Input label={t("phone")} type="tel" dir="ltr" placeholder="+971501234567" value={form.phone} onChange={(e) => set("phone", e.target.value)} error={fieldErrors.phone} />
                    <Input label={t("email")} type="email" dir="ltr" value={form.email} onChange={(e) => set("email", e.target.value)} error={fieldErrors.email} />
                </>
            )}

            {isLoggedIn && (
                <Input
                    label={t("phone")}
                    type="tel"
                    dir="ltr"
                    placeholder="+971501234567"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    error={fieldErrors.phone}
                />
            )}

            <Input label={t("notes")} value={form.notes} onChange={(e) => set("notes", e.target.value)} error={fieldErrors.notes} placeholder={t("optional")} />

            {formError && (
                <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {formError}
                </p>
            )}

            <Button type="submit" fullWidth loading={isLoading} disabled={isLoggedIn === null}>
                {t("submit")}
            </Button>
        </form>
    );
}

export default AddViewingUser;