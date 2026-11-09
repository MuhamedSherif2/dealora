"use client";

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { useGetWebhookLogsQuery } from "@/store/slices/adminSlice";
import Button from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import Modal from "@/components/ui/modal";
import Select from "@/components/ui/select";
import RetryWebHookLogs from "../_ui/updateWebHook";
import type { WebhookLog, WebhookStatus } from "@/types/webhookLog";

const STATUSES: WebhookStatus[] = ["pending", "success", "failed", "skipped"];
const EVENTS = [
    "lead.created", "lead.status_changed", "viewing.requested", "viewing.status_changed",
    "property.created", "property.status_changed", "user.registered", "password.reset_requested",
];
const COLUMNS = ["event", "status", "attempts", "response", "error", "createdAt", "actions"] as const;
const cell = "whitespace-nowrap border-e border-border px-4 py-3";

const statusStyles: Record<WebhookStatus, string> = {
    success: "bg-success/15 text-success",
    failed: "bg-destructive/15 text-destructive",
    pending: "bg-secondary text-secondary-foreground",
    skipped: "bg-muted text-muted-foreground",
};

function GetWebHook() {
    const t = useTranslations("Webhooks");
    const tCommon = useTranslations("Dashboard.common");
    const tEnums = useTranslations("Enums");
    const format = useFormatter();

    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("");
    const [event, setEvent] = useState("");
    const [selected, setSelected] = useState<WebhookLog | null>(null);

    const { data, isLoading, isFetching, isError, refetch } = useGetWebhookLogsQuery({
        page,
        limit: 30,
        ...(status && { status }),
        ...(event && { event }),
    });

    const logs = data?.data ?? [];
    const meta = data?.meta;

    // "lead.created" -> "lead_created": next-intl keys cannot contain dots
    const eventLabel = (e: string) => {
        const key = `events.${e.replace(/\./g, "_")}`;
        return t.has(key) ? t(key) : e;
    };

    function renderContent() {
        if (isLoading) return <Loading />;

        if (isError) {
            return (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                    <p className="text-destructive">{t("error")}</p>
                    <Button variant="outline" onClick={() => refetch()}>{t("tryAgain")}</Button>
                </div>
            );
        }

        if (logs.length === 0) {
            return <p className="py-16 text-center text-muted-foreground">{t("empty")}</p>;
        }

        return (
            <div className={`w-full overflow-x-auto rounded-xl border border-border bg-card shadow-sm transition-opacity ${isFetching ? "opacity-60" : ""}`}>
                <table className="w-full min-w-max border-collapse text-start text-sm">
                    <thead className="bg-muted text-muted-foreground">
                        <tr className="border-b border-border">
                            {COLUMNS.map((c) => (
                                <th key={c} className="whitespace-nowrap border-e border-border px-4 py-4 text-start font-semibold last:border-e-0">
                                    {t(`columns.${c}`)}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {logs.map((log) => (
                            <tr key={log._id} className="transition-colors hover:bg-muted/50">
                                <td className={`${cell} font-medium`}>{eventLabel(log.event)}</td>
                                <td className={cell}>
                                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[log.status]}`}>
                                        {tEnums(`webhookStatus.${log.status}`)}
                                    </span>
                                </td>
                                <td className={cell}>{log.attempts}</td>
                                <td className={cell} dir="ltr">{log.responseStatus ?? "—"}</td>
                                <td className={`${cell} max-w-72 truncate`} title={log.lastError}>{log.lastError ?? "—"}</td>
                                <td className={cell}>{format.dateTime(new Date(log.createdAt), { dateStyle: "medium", timeStyle: "short" })}</td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <Button variant="outline" size="sm" onClick={() => setSelected(log)}>{t("details")}</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
                </div>
                <RetryWebHookLogs />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:max-w-xl">
                <Select
                    value={status}
                    onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                    aria-label={t("columns.status")}
                    options={[
                        { value: "", label: t("allStatuses") },
                        ...STATUSES.map((s) => ({ value: s, label: tEnums(`webhookStatus.${s}`) })),
                    ]}
                />
                <Select
                    value={event}
                    onChange={(e) => { setEvent(e.target.value); setPage(1); }}
                    aria-label={t("columns.event")}
                    options={[
                        { value: "", label: t("allEvents") },
                        ...EVENTS.map((e) => ({ value: e, label: eventLabel(e) })),
                    ]}
                />
            </div>

            {renderContent()}

            {meta && meta.pages > 1 && (
                <div className="flex items-center justify-center gap-4">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                        {tCommon("previous")}
                    </Button>
                    <span className="text-sm text-muted-foreground">{tCommon("page", { page: meta.page, pages: meta.pages })}</span>
                    <Button variant="outline" size="sm" disabled={page >= meta.pages} onClick={() => setPage((p) => p + 1)}>
                        {tCommon("next")}
                    </Button>
                </div>
            )}

            <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected ? eventLabel(selected.event) : ""} closeLabel={tCommon("close")}>
                {selected && (
                    <div className="flex flex-col gap-4">
                        {selected.sensitive && (
                            <p className="rounded-lg bg-secondary px-3 py-2 text-sm text-secondary-foreground">{t("sensitiveNote")}</p>
                        )}
                        {selected.lastError && (
                            <div>
                                <p className="mb-1 text-sm font-semibold">{t("columns.error")}</p>
                                <p dir="ltr" className="rounded-lg bg-destructive/10 px-3 py-2 text-start text-sm text-destructive">{selected.lastError}</p>
                            </div>
                        )}
                        <div>
                            <p className="mb-1 text-sm font-semibold">{t("payload")}</p>
                            <pre dir="ltr" className="max-h-96 overflow-auto rounded-lg bg-muted p-4 text-start text-xs">
                                {JSON.stringify(selected.payload ?? null, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    );
}

export default GetWebHook;