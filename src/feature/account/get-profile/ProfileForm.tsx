"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "@/i18n/navigation";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import { parseApiError } from "@/lib/apiError";
import { useUpdateProfileMutation } from "@/store/slices/authSlice";
import type { User } from "@/types/user";

export default function ProfileForm({ user, onSuccess }: { user: User; onSuccess?: () => void }) {
    const t = useTranslations("Account.profile");
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();

    const [form, setForm] = useState({ name: user.name, phone: user.phone ?? "", language: user.language });
    const [formError, setFormError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // send only what actually changed (the backend rejects an empty phone, so a blank one is never sent)
    const changes = {
        ...(form.name.trim() && form.name.trim() !== user.name && { name: form.name.trim() }),
        ...(form.phone.trim() && form.phone.trim() !== (user.phone ?? "") && { phone: form.phone.trim() }),
        ...(form.language !== user.language && { language: form.language }),
    };
    const dirty = Object.keys(changes).length > 0;

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setFormError("");
        setFieldErrors({});

        try {
            await updateProfile(changes).unwrap();
            toast.success(t("saved"));
            onSuccess?.();

            // the user chose another language: switch the site to it too
            if (changes.language && changes.language !== locale) {
                router.replace(pathname, { locale: changes.language });
            }
        } catch (err) {
            const { message, fields } = parseApiError(err, t("failed"));
            setFormError(message);
            setFieldErrors(fields);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
                <Input label={t("name")} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={fieldErrors.name} />
                <Input label={t("email")} dir="ltr" value={user.email} disabled />
                <Input
                    label={t("phone")}
                    type="tel"
                    dir="ltr"
                    placeholder="+971501234567"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    error={fieldErrors.phone}
                />
                <Select
                    label={t("language")}
                    value={form.language}
                    onChange={(e) => setForm((f) => ({ ...f, language: e.target.value as "ar" | "en" }))}
                    options={[
                        { value: "ar", label: t("languages.ar") },
                        { value: "en", label: t("languages.en") },
                    ]}
                    error={fieldErrors.language}
                />

                {user.company && <Input label={t("company")} value={user.company} disabled />}
                {user.licenseNumber && <Input label={t("license")} dir="ltr" value={user.licenseNumber} disabled />}
            </div>

            {formError && (
                <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {formError}
                </p>
            )}

            <div className="flex justify-end">
                <Button type="submit" loading={isLoading} disabled={!dirty}>{t("save")}</Button>
            </div>
        </form>
    );
}