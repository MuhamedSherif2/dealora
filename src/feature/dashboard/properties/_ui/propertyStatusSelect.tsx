"use client";

import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { parseApiError } from "@/lib/apiError";
import { useUpdatePropertyStatusMutation } from "@/store/slices/propertySlice";
import type { LocalizedProperty, PropertyStatus } from "@/types/property";

const STATUSES: PropertyStatus[] = ["available", "reserved", "sold", "rented"];

function PropertyStatusSelect({ property }: { property: LocalizedProperty }) {
    const t = useTranslations("PropertyActions");
    const tEnums = useTranslations("Enums");
    const [updateStatus, { isLoading }] = useUpdatePropertyStatusMutation();

    async function handleChange(status: PropertyStatus) {
        try {
            await updateStatus({ id: property._id, body: { status } }).unwrap();
            toast.success(t("statusUpdated"));
        } catch (err) {
            toast.error(parseApiError(err, t("statusFailed")).message);
        }
    }

    return (
        <select
            value={property.status}
            disabled={isLoading}
            onChange={(e) => handleChange(e.target.value as PropertyStatus)}
            aria-label={t("status")}
            className="h-9 cursor-pointer rounded-lg border border-input bg-card px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
            {STATUSES.map((s) => (
                <option key={s} value={s}>{tEnums(`propertyStatus.${s}`)}</option>
            ))}
        </select>
    );
}

export default PropertyStatusSelect;