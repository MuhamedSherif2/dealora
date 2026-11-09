"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useGetProfileQuery } from "@/store/slices/authSlice";
import UserForm from "../_components/userForm";
import type { User } from "@/types/user";

function UpdateUser({ user }: { user: User }) {
    const t = useTranslations("Users");
    const [open, setOpen] = useState(false);

    // the backend does not let an admin change his own role or disable himself
    const { data: me } = useGetProfileQuery();
    const isSelf = me?.data.user._id === user._id;

    return (
        <>
            <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>{t("edit")}</Button>
            <Modal open={open} onClose={() => setOpen(false)} title={t("editTitle", { name: user.name })} closeLabel={t("form.close")}>
                <UserForm user={user} isSelf={isSelf} onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
            </Modal>
        </>
    );
}

export default UpdateUser;