"use client";

import { useState, type FormEvent } from "react";
import { MessageCircle } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { parseApiError } from "@/lib/apiError";
import { useGetLeadsQuery, useUpdateLeadMutation } from "@/store/slices/leadSlice";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Loading from "@/components/ui/Loading";
import Modal from "@/components/ui/modal";
import Select from "@/components/ui/select";
import LeadDetails from "./LeadDetails";
import type { Bilingual } from "@/types/common";
import type { Lead, LeadStatus } from "@/types/lead";

const STATUSES: LeadStatus[] = ["new", "contacted", "viewing_scheduled", "negotiating", "won", "lost"];
const COLUMNS = ["name", "phone", "property", "status", "score", "source", "agent", "createdAt", "actions"] as const;
const cell = "whitespace-nowrap border-e border-border px-4 py-3";

function scoreStyle(score?: number) {
    if (score == null) return "bg-muted text-muted-foreground";
    if (score >= 70) return "bg-success/15 text-success";
    if (score >= 40) return "bg-secondary text-secondary-foreground";
    return "bg-destructive/15 text-destructive";
}

function LeadStatusSelect({ lead }: { lead: Lead }) {
    const t = useTranslations("Leads");
    const tEnums = useTranslations("Enums");
    const [updateLead, { isLoading }] = useUpdateLeadMutation();

    async function handleChange(status: LeadStatus) {
        try {
            await updateLead({ id: lead._id, body: { status } }).unwrap();
            toast.success(t("statusUpdated"));
        } catch (err) {
            toast.error(parseApiError(err, t("statusFailed")).message);
        }
    }

    return (
        <select
            value={lead.status}
            disabled={isLoading}
            onChange={(e) => handleChange(e.target.value as LeadStatus)}
            aria-label={t("columns.status")}
            className="h-9 cursor-pointer rounded-lg border border-input bg-card px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
            {STATUSES.map((s) => (
                <option key={s} value={s}>{tEnums(`leadStatus.${s}`)}</option>
            ))}
        </select>
    );
}

function GetLeads() {
    const t = useTranslations("Leads");
    const tCommon = useTranslations("Dashboard.common");
    const tEnums = useTranslations("Enums");
    const format = useFormatter();
    const locale = useLocale() as "ar" | "en";

    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [openId, setOpenId] = useState<string | null>(null);

    const { data, isLoading, isFetching, isError, refetch } = useGetLeadsQuery({
        page,
        limit: 20,
        ...(status && { status }),
        ...(search && { search }),
    });

    const leads = data?.data ?? [];
    const meta = data?.meta;
    const pick = (b?: Bilingual) => b?.[locale] ?? b?.en ?? b?.ar ?? "";

    function applySearch(e: FormEvent) {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput.trim());
    }

    function renderContent() {
        if (isLoading) return <Loading />;

        if (isError) {
            return (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                    <p className="text-destructive">{t("error")}</p>
                    <Button variant="outline" onClick={() => refetch()}>{t("retry")}</Button>
                </div>
            );
        }

        if (leads.length === 0) {
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
                        {leads.map((l) => {
                            const property = l.property && typeof l.property === "object" ? pick(l.property.title) : "";
                            const agent = l.assignedAgent && typeof l.assignedAgent === "object" ? l.assignedAgent.name : "";
                            const waNumber = l.phone.replace(/\D/g, "");

                            return (
                                <tr key={l._id} className="transition-colors hover:bg-muted/50">
                                    <td className={`${cell} font-medium`}>{l.name}</td>
                                    <td className={cell}>
                                        <div className="flex items-center gap-2">
                                            <span dir="ltr">{l.phone}</span>
                                            <a
                                                href={`https://wa.me/${waNumber}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={t("whatsapp")}
                                                className="inline-flex size-7 items-center justify-center rounded-full text-success transition-colors hover:bg-success/15"
                                            >
                                                <MessageCircle size={16} />
                                            </a>
                                        </div>
                                    </td>
                                    <td className={`${cell} max-w-56 truncate`} title={property}>{property || "—"}</td>
                                    <td className={cell}><LeadStatusSelect lead={l} /></td>
                                    <td className={cell}>
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${scoreStyle(l.score)}`}>
                                            {l.score ?? "—"}
                                        </span>
                                    </td>
                                    <td className={cell}>{tEnums(`leadSource.${l.source}`)}</td>
                                    <td className={cell}>{agent || t("unassigned")}</td>
                                    <td className={cell}>{format.dateTime(new Date(l.createdAt), { dateStyle: "medium", timeStyle: "short" })}</td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <Button variant="outline" size="sm" onClick={() => setOpenId(l._id)}>{t("details")}</Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
                {meta && <span className="text-sm text-muted-foreground">{t("total", { count: meta.total })}</span>}
            </div>

            <form onSubmit={applySearch} className="grid gap-3 sm:grid-cols-[1fr_14rem_auto] sm:items-end">
                <Input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                    aria-label={t("search")}
                />
                <Select
                    value={status}
                    onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                    aria-label={t("columns.status")}
                    options={[
                        { value: "", label: t("allStatuses") },
                        ...STATUSES.map((s) => ({ value: s, label: tEnums(`leadStatus.${s}`) })),
                    ]}
                />
                <Button type="submit">{t("search")}</Button>
            </form>

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

            <Modal open={openId !== null} onClose={() => setOpenId(null)} title={t("detailsTitle")} closeLabel={tCommon("close")}>
                {openId && <LeadDetails id={openId} />}
            </Modal>
        </section>
    );
}

export default GetLeads;