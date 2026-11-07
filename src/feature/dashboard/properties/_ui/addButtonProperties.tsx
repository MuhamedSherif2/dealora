"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import PropertyForm from "../_components/propertyForm";

function AddButtonProperty() {
  const t = useTranslations("PropertyActions");
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>{t("add")}</Button>
      <Modal open={open} onClose={() => setOpen(false)} title={t("addTitle")} closeLabel={t("close")}>
        <PropertyForm onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
      </Modal>
    </>
  );
}

export default AddButtonProperty;