"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import UserForm from "../_components/userForm";

function CreateUser() {
    const t = useTranslations("Users");
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>{t("add")}</Button>
            <Modal open={open} onClose={() => setOpen(false)} title={t("addTitle")} closeLabel={t("form.close")}>
                <UserForm onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
            </Modal>
        </>
    );
}

export default CreateUser;