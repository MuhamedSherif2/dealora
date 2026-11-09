"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { parseApiError } from "@/lib/apiError";
import { cookieHelper } from "@/lib/cookies";
import { useChangePasswordMutation } from "@/store/slices/authSlice";

function ChangePassword({ onSuccess }: { onSuccess?: () => void }) {
    const t = useTranslations("Account.password");
    const [changePassword, { isLoading }] = useChangePasswordMutation();
    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [confirm, setConfirm] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setErrorMsg("");

        if (next.length < 8) return setErrorMsg(t("tooShort"));
        if (next !== confirm) return setErrorMsg(t("mismatch"));

        try {
            const res = await changePassword({ currentPassword: current, newPassword: next }).unwrap();
            // the old token stops working after a password change, so keep the fresh one
            cookieHelper.set("dealora_token", res.data.token, 3);
            toast.success(t("done"));
            onSuccess?.();
        } catch (err) {
            setErrorMsg(parseApiError(err, t("failed")).message);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label={t("current")} type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
            <Input label={t("new")} type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" required />
            <Input label={t("confirm")} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />

            {errorMsg && (
                <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {errorMsg}
                </p>
            )}

            <Button type="submit" loading={isLoading} fullWidth>{t("submit")}</Button>
        </form>
    );
}

export default ChangePassword;