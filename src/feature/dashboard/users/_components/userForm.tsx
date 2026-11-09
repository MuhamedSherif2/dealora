"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { parseApiError } from "@/lib/apiError";
import { useCreateUserMutation, useUpdateUserMutation } from "@/store/slices/adminSlice";
import type { User } from "@/types/user";

const ROLES = ["agent", "client", "admin"] as const;
const LANGUAGES = ["ar", "en"] as const;

type Props = {
    user?: User;        // given = edit mode, missing = create mode
    isSelf?: boolean;   // the admin editing his own account (the backend blocks changing his role or disabling him)
    onSuccess?: () => void;
    onCancel?: () => void;
};

export default function UserForm({ user, isSelf = false, onSuccess, onCancel }: Props) {
    const t = useTranslations("Users");
    const tEnums = useTranslations("Enums");
    const isEdit = Boolean(user);

    const [createUser, { isLoading: creating }] = useCreateUserMutation();
    const [updateUser, { isLoading: updating }] = useUpdateUserMutation();
    const isLoading = creating || updating;

    const [form, setForm] = useState({
        name: user?.name ?? "",
        email: user?.email ?? "",
        password: "",
        phone: user?.phone ?? "",
        role: user?.role ?? "agent",
        language: user?.language ?? "ar",
        company: user?.company ?? "",
        licenseNumber: user?.licenseNumber ?? "",
        isActive: user?.isActive ?? true,
    });
    const [formError, setFormError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
        setForm((f) => ({ ...f, [key]: value }));

    // edit mode: send only what changed (an empty phone is never sent, the backend rejects it)
    function changesFor(u: User) {
        return {
            ...(form.name.trim() !== u.name && { name: form.name.trim() }),
            ...(form.phone.trim() && form.phone.trim() !== (u.phone ?? "") && { phone: form.phone.trim() }),
            ...(!isSelf && form.role !== u.role && { role: form.role }),
            ...(!isSelf && form.isActive !== u.isActive && { isActive: form.isActive }),
            ...(form.company.trim() !== (u.company ?? "") && { company: form.company.trim() }),
            ...(form.licenseNumber.trim() !== (u.licenseNumber ?? "") && { licenseNumber: form.licenseNumber.trim() }),
        };
    }
    const editChanges = user ? changesFor(user) : {};
    const dirty = isEdit ? Object.keys(editChanges).length > 0 : true;

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setFormError("");
        setFieldErrors({});

        try {
            if (user) {
                await updateUser({ id: user._id, body: editChanges } as never).unwrap();
            } else {
                await createUser({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    password: form.password,
                    role: form.role,
                    language: form.language,
                    ...(form.phone.trim() && { phone: form.phone.trim() }),
                    ...(form.company.trim() && { company: form.company.trim() }),
                    ...(form.licenseNumber.trim() && { licenseNumber: form.licenseNumber.trim() }),
                } as never).unwrap();
            }
            toast.success(isEdit ? t("form.updated") : t("form.created"));
            onSuccess?.();
        } catch (err) {
            const { message, fields } = parseApiError(err, t("form.failed"));
            setFormError(message);
            setFieldErrors(fields);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
                <Input label={t("form.name")} value={form.name} onChange={(e) => set("name", e.target.value)} error={fieldErrors.name} />

                <Input
                    label={t("form.email")}
                    type="email"
                    dir="ltr"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    disabled={isEdit}
                    error={fieldErrors.email}
                />

                {!isEdit && (
                    <Input
                        label={t("form.password")}
                        type="password"
                        dir="ltr"
                        autoComplete="new-password"
                        value={form.password}
                        onChange={(e) => set("password", e.target.value)}
                        error={fieldErrors.password}
                    />
                )}

                <Input
                    label={t("form.phone")}
                    type="tel"
                    dir="ltr"
                    placeholder="+971501234567"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    error={fieldErrors.phone}
                />

                <Select
                    label={t("form.role")}
                    value={form.role}
                    onChange={(e) => set("role", e.target.value as User["role"])}
                    disabled={isSelf}
                    options={ROLES.map((r) => ({ value: r, label: tEnums(`role.${r}`) }))}
                    error={fieldErrors.role}
                />

                {!isEdit && (
                    <Select
                        label={t("form.language")}
                        value={form.language}
                        onChange={(e) => set("language", e.target.value as User["language"])}
                        options={LANGUAGES.map((l) => ({ value: l, label: t(`languages.${l}`) }))}
                    />
                )}

                {form.role === "agent" && (
                    <>
                        <Input label={t("form.company")} value={form.company} onChange={(e) => set("company", e.target.value)} error={fieldErrors.company} />
                        <Input label={t("form.license")} dir="ltr" value={form.licenseNumber} onChange={(e) => set("licenseNumber", e.target.value)} error={fieldErrors.licenseNumber} />
                    </>
                )}
            </div>

            {isEdit && (
                <label className={`flex items-center gap-2 text-sm ${isSelf ? "opacity-60" : "cursor-pointer"}`}>
                    <input
                        type="checkbox"
                        className="size-4 accent-primary"
                        checked={form.isActive}
                        disabled={isSelf}
                        onChange={(e) => set("isActive", e.target.checked)}
                    />
                    {t("form.isActive")}
                </label>
            )}

            {isSelf && <p className="text-sm text-muted-foreground">{t("form.selfHint")}</p>}

            {formError && (
                <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {formError}
                </p>
            )}

            <div className="flex justify-end gap-3">
                {onCancel && <Button variant="outline" onClick={onCancel} disabled={isLoading}>{t("form.cancel")}</Button>}
                <Button type="submit" loading={isLoading} disabled={!dirty}>
                    {isEdit ? t("form.save") : t("form.create")}
                </Button>
            </div>
        </form>
    );
}