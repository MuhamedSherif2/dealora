"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useLoginMutation } from "@/store/slices/authSlice";
import { cookieHelper, TOKEN_KEY } from "@/lib/cookies";
import { parseApiError } from "@/lib/apiError";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

function Login() {
  const t = useTranslations("Login");
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await login({ email: email.trim().toLowerCase(), password }).unwrap();
      const { token, user } = res.data;

      // the proxy reads these two cookies
      cookieHelper.set(TOKEN_KEY, token);
      cookieHelper.set("dealora_user_role", user.role);

      router.replace(user.role === "client" ? "/account" : "/dashboard");
    } catch (err) {
      setErrorMsg(parseApiError(err, t("failed")).message);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold tracking-wide text-primary">Dealora</p>
        <h1 className="text-2xl font-bold text-card-foreground sm:text-3xl">{t("title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label={t("email")}
          type="email"
          dir="ltr"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="flex flex-col gap-2">
          <Input
            label={t("password")}
            type="password"
            dir="ltr"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Link href="/forgot-password" className="self-end text-sm font-medium text-primary hover:underline">
            {t("forgot")}
          </Link>
        </div>

        {errorMsg && (
          <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMsg}
          </p>
        )}

        <Button type="submit" size="lg" loading={isLoading} fullWidth>
          {t("submit")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          {t("register")}
        </Link>
      </p>
    </div>
  );
}

export default Login;