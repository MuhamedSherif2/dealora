"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Link, useRouter } from "@/i18n/navigation";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { parseApiError } from "@/lib/apiError";
import { useForgotPasswordMutation } from "@/store/slices/authSlice";

function ForgotPassword() {
    const t = useTranslations("PasswordReset.forgot");
    const router = useRouter();
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const [email, setEmail] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setErrorMsg("");

        try {
            await forgotPassword({ email: email.trim().toLowerCase() }).unwrap();
            toast.success(t("sent"));
            router.push(`/reset-password?email=${encodeURIComponent(email.trim().toLowerCase())}`);
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
                <Input
                    label={t("email")}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    dir="ltr"
                />

                {errorMsg && <p role="alert" className="text-sm text-destructive">{errorMsg}</p>}

                <Button type="submit" loading={isLoading} fullWidth>{t("submit")}</Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                <Link href="/login" className="font-medium text-primary hover:underline">{t("backToLogin")}</Link>
            </p>
        </div>
    );
}

export default ForgotPassword;