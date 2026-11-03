"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { useRegisterMutation } from "@/store/slices/authSlice";
import { cookieHelper } from "@/lib/cookies";
import type { ApiError } from "@/types";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

function getErrorMessage(err: unknown, fallback: string) {
    const body = (err as { data?: ApiError })?.data;
    return body?.message ?? fallback;
}

function Register() {
    const t = useTranslations("Register");
    const router = useRouter();

    const [register, { isLoading }] = useRegisterMutation();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState<string | undefined>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrorMsg("");

        try {
            const res = await register({
                name,
                phone: phone ?? "",
                email,
                password,
            }).unwrap();

            const { user } = res.data;

            cookieHelper.set("dealora_user_role", user.role);

            router.replace(
                user.role === "client" ? "/account" : "/dashboard"
            );
        } catch (err) {
            setErrorMsg(getErrorMessage(err, t("failed")));
        }
    }

    return (
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="mb-8 text-center">
                <p className="mb-2 text-sm font-semibold tracking-wide text-primary">
                    Dealora
                </p>

                <h1 className="text-2xl font-bold text-card-foreground sm:text-3xl">
                    {t("title")}
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    {t("subtitle")}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <Input label={t("name")} type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                        {t("phone")}
                    </label>

                    <PhoneInput defaultCountry="EG" international countryCallingCodeEditable={false} value={phone} onChange={setPhone} placeholder={t("phonePlaceholder")} className="phone-input"/>
                </div>

                <Input label={t("email")} type="email" dir="ltr" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <Input label={t("password")} type="password" dir="ltr" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                {errorMsg && (
                    <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {errorMsg}
                    </p>
                )}

                <Button type="submit" size="lg" fullWidth disabled={isLoading}>
                    {isLoading ? t("loading") : t("submit")}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                {t("haveAccount")}{" "}
                <Link href="/login" className="font-medium text-primary hover:underline" >
                    {t("login")}
                </Link>
            </p>
        </div>
    );
}

export default Register;