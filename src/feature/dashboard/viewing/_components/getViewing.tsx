"use client";

import Button from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import { useGetViewingQuery } from "@/store/slices/viewingSlice";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import type { Viewing, ViewingStatus } from "@/types/viewing";

const columns = [
    "property",
    "lead",
    "phone",
    "agent",
    "scheduledAt",
    "status",
    "notes",
    "reminderSent",
    "createdAt",
] as const;

const statusStyles: Record<ViewingStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    no_show: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

function GetViewing() {
    const locale = useLocale() as "ar" | "en";
    const t = useTranslations("Viewing");
    const format = useFormatter();

    const cell =
        "whitespace-nowrap border-e border-border px-4 py-3 last:border-e-0";

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetViewingQuery({
        lang: locale,
    });

    const viewings: Viewing[] = data?.data ?? [];

    function getPropertyName(viewing: Viewing) {
        if (typeof viewing.property === "string") return "—";
        const title = viewing.property?.title;
        if (!title) return "—";
        return typeof title === "string" ? title : title[locale] || title.en || title.ar || "—";
    }

    function getLeadName(viewing: Viewing) {
        if (typeof viewing.lead === "string") return "—";
        return viewing.lead?.name || "—";
    }

    function getLeadPhone(viewing: Viewing) {
        if (typeof viewing.lead === "string") return "—";
        return viewing.lead?.phone || "—";
    }

    function getAgentName(viewing: Viewing) {
        if (!viewing.agent || typeof viewing.agent === "string") return "—";
        return viewing.agent.name || "—";
    }

    function formatDate(date: string) {
        return format.dateTime(new Date(date), {
            dateStyle: "medium",
            timeStyle: "short",
        });
    }

    function renderContent() {
        if (isLoading) return <Loading />;

        if (isError) {
            return (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                    <p className="text-destructive">{t("error")}</p>

                    <Button variant="outline" onClick={() => refetch()}>
                        {t("retry")}
                    </Button>
                </div>
            );
        }

        if (viewings.length === 0) {
            return (
                <p className="py-16 text-center text-muted-foreground">
                    {t("empty")}
                </p>
            );
        }

        return (
            <div className="w-full overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                <table className="w-full min-w-max border-collapse text-start text-sm">
                    <thead className="bg-muted text-muted-foreground">
                        <tr className="border-b border-border">
                            {columns.map((column) => (
                                <th key={column} className="whitespace-nowrap border-e border-border px-4 py-4 text-start font-semibold last:border-e-0">
                                    {t(`columns.${column}`)}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {viewings.map((viewing: Viewing) => (
                            <tr key={viewing._id} className="transition-colors hover:bg-muted/50" >
                                {/* Property */}
                                <td className={`${cell} font-medium`}> {getPropertyName(viewing)}</td>

                                {/* Lead */}
                                <td className={cell}> {getLeadName(viewing)}</td>

                                {/* Phone */}
                                <td className={cell} dir="ltr"> {getLeadPhone(viewing)}</td>

                                {/* Agent */}
                                <td className={cell}> {getAgentName(viewing)}</td>

                                {/* Scheduled date */}
                                <td className={cell}> {formatDate(viewing.scheduledAt)}</td>

                                {/* Status */}
                                <td className={cell}>
                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[viewing.status]}`}>
                                        {t(`statuses.${viewing.status}`)}
                                    </span>
                                </td>

                                {/* Notes */}
                                <td className={`${cell} max-w-56 truncate`} title={viewing.notes || ""}>
                                    {viewing.notes || "—"}
                                </td>

                                {/* Reminder */}
                                <td className={cell}>
                                    {viewing.reminderSent ? (
                                        <span className="text-green-600 dark:text-green-400">
                                            {t("yes")}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground">
                                            {t("no")}
                                        </span>
                                    )}
                                </td>

                                {/* Created at */}
                                <td className={cell}> {formatDate(viewing.createdAt)}</td>
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
                    <h1 className="text-2xl font-bold text-foreground">
                        {t("title")}
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {t("tableSubtitle")}
                    </p>
                </div>
            </div>

            {renderContent()}
        </section>
    );
}

export default GetViewing;