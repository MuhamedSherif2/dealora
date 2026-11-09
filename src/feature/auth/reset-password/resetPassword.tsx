"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Link, useRouter } from "@/i18n/navigation";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { parseApiError } from "@/lib/apiError";
import { useResetPasswordMutation } from "@/store/slices/authSlice";

function ResetPassword() {
    const t = useTranslations("PasswordReset.reset");
    const router = useRouter();
    const params = useSearchParams();
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const [email, setEmail] = useState(params.get("email") ?? "");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setErrorMsg("");

        if (password.length < 8) return setErrorMsg(t("passwordShort"));
        if (password !== confirm) return setErrorMsg(t("passwordMismatch"));

        try {
            await resetPassword({ email: email.trim().toLowerCase(), code, newPassword: password }).unwrap();
            toast.success(t("done"));
            router.replace("/login");
        } catch (err) {
            setErrorMsg(parseApiError(err, t("failed")).message);
        }
    }

    return (
        <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center gap-6 px-4 py-10">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
                <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
                <Input label={t("email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required dir="ltr" />

                <Input
                    label={t("code")}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    required
                    dir="ltr"
                />

                <Input label={t("password")} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
                <Input label={t("confirm")} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />

                {errorMsg && <p role="alert" className="text-sm text-destructive">{errorMsg}</p>}

                <Button type="submit" loading={isLoading} fullWidth>{t("submit")}</Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                <Link href="/forgot-password" className="font-medium text-primary hover:underline">{t("resend")}</Link>
            </p>
        </div>
    );
}

export default ResetPassword;