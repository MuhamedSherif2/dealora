"use client";

import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import Button from "@/components/ui/button";
import { parseApiError } from "@/lib/apiError";
import { useRetryWebhooksMutation } from "@/store/slices/adminSlice";

function RetryWebHookLogs() {
    const t = useTranslations("Webhooks");
    const [retryWebhooks, { isLoading }] = useRetryWebhooksMutation();

    async function handleRetry() {
        if (!window.confirm(t("retryConfirm"))) return;
        try {
            const res = await retryWebhooks().unwrap();
            const { retried, succeeded } = res.data;

            if (retried === 0) toast(t("retryNothing"));
            else toast.success(t("retryDone", { retried, succeeded }));
        } catch (err) {
            toast.error(parseApiError(err, t("retryFailed")).message);
        }
    }

    return (
        <Button variant="outline" onClick={handleRetry} loading={isLoading}>
            {t("retry")}
        </Button>
    );
}

export default RetryWebHookLogs;