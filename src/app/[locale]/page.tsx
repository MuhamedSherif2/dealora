"use client";

import Navbar from "@/components/feature/layout/Navbar";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <main>
      <Navbar />
      <h1>{t("hero.title")}</h1>
      <p>{t("hero.subtitle")}</p>

      <button>{t("hero.searchButton")}</button>
      <Button variant="outline"> Submit </ Button>

      <Input />
    </main>
  );
}
