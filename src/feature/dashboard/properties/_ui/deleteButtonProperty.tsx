"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { parseApiError } from "@/lib/apiError";
import { useDeletePropertyMutation } from "@/store/slices/propertySlice";

function DeleteButtonProperty({ id }: { id: string }) {
    const t = useTranslations("PropertyActions");
    const [open, setOpen] = useState(false);
    const [deleteProperty, { isLoading }] = useDeletePropertyMutation();

    async function handleDelete() {
        try {
            await deleteProperty(id).unwrap();
            toast.success(t("deleted"));
            setOpen(false);
        } catch (err) {
            toast.error(parseApiError(err, t("deleteFailed")).message);
        }
    }

    return (
        <>
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                {t("delete")}
            </Button>

            <Modal open={open} onClose={() => setOpen(false)} title={t("deleteTitle")} closeLabel={t("close")}>
                <p className="mb-6 text-muted-foreground">{t("deleteConfirm")}</p>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>{t("cancel")}</Button>
                    <Button variant="destructive" onClick={handleDelete} loading={isLoading}>{t("delete")}</Button>
                </div>
            </Modal>
        </>
    );
}

export default DeleteButtonProperty;