"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import PropertyImages from "../_components/propertyImages";
import type { LocalizedProperty } from "@/types/property";

function PropertyImagesButton({ property }: { property: LocalizedProperty }) {
    const t = useTranslations("PropertyActions");
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                {t("images")} ({property.images.length})
            </Button>
            <Modal open={open} onClose={() => setOpen(false)} title={t("imagesTitle")} closeLabel={t("close")}>
                <PropertyImages property={property} />
            </Modal>
        </>
    );
}

export default PropertyImagesButton;