"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import PropertyForm from "../_components/propertyForm";
import type { LocalizedProperty } from "@/types/property";

function UpdateButtonProperty({ property }: { property: LocalizedProperty }) {
  const t = useTranslations("PropertyActions");
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>{t("update")}</Button>
      <Modal open={open} onClose={() => setOpen(false)} title={t("editTitle")} closeLabel={t("close")}>
        <PropertyForm property={property} onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
      </Modal>
    </>
  );
}

export default UpdateButtonProperty;