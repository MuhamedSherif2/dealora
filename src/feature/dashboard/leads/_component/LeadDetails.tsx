"use client";

import { useState, type FormEvent } from "react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { parseApiError } from "@/lib/apiError";
import { useAddNotesMutation, useGetLeadByIdQuery } from "@/store/slices/leadSlice";
import Button from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import type { Bilingual } from "@/types/common";

type Brief = { _id: string; slug: string; title: Bilingual };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
            {children}
        </section>
    );
}

export default function LeadDetails({ id }: { id: string }) {
    const t = useTranslations("Leads.detail");
    const tEnums = useTranslations("Enums");
    const tc = useTranslations("Leads.channels");
    const format = useFormatter();
    const locale = useLocale() as "ar" | "en";

    const { data, isLoading, isError } = useGetLeadByIdQuery(id);
    const [addNote, { isLoading: adding }] = useAddNotesMutation();
    const [text, setText] = useState("");

    const pick = (b?: Bilingual) => b?.[locale] ?? b?.en ?? b?.ar ?? "";
    const when = (iso: string) => format.dateTime(new Date(iso), { dateStyle: "medium", timeStyle: "short" });

    if (isLoading) return <Loading />;

    const lead = data?.data;
    if (isError || !lead) return <p className="py-8 text-center text-destructive">{t("error")}</p>;

    const property = typeof lead.property === "object" ? (lead.property as unknown as Brief) : null;

    async function handleAddNote(e: FormEvent) {
        e.preventDefault();
        if (!text.trim()) return;
        try {
            await addNote({ id, body: { text: text.trim() } }).unwrap();
            toast.success(t("noteAdded"));
            setText("");
        } catch (err) {
            toast.error(parseApiError(err, t("noteFailed")).message);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold">{lead.name}</h2>
                <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                    {tEnums(`leadStatus.${lead.status}`)}
                </span>
                <span className="text-xs text-muted-foreground">{tEnums(`leadSource.${lead.source}`)}</span>
            </div>

            <Section title={t("contact")}>
                <dl className="grid gap-2 text-sm sm:grid-cols-2">
                    <div><dt className="text-muted-foreground">{t("phone")}</dt><dd dir="ltr" className="text-start">{lead.phone}</dd></div>
                    <div><dt className="text-muted-foreground">{t("email")}</dt><dd dir="ltr" className="text-start">{lead.email ?? "—"}</dd></div>
                    <div><dt className="text-muted-foreground">{t("language")}</dt><dd>{lead.language.toUpperCase()}</dd></div>
                    {lead.lastContactedAt && (
                        <div><dt className="text-muted-foreground">{t("lastContacted")}</dt><dd>{when(lead.lastContactedAt)}</dd></div>
                    )}
                </dl>
            </Section>

            <Section title={t("message")}>
                <p className="whitespace-pre-line text-sm">{lead.message || <span className="text-muted-foreground">{t("noMessage")}</span>}</p>
            </Section>

            <Section title={t("property")}>
                <p className="text-sm">{property ? pick(property.title) : <span className="text-muted-foreground">{t("noProperty")}</span>}</p>
            </Section>

            <Section title={t("score")}>
                {lead.score == null ? (
                    <p className="text-sm text-muted-foreground">{t("noScore")}</p>
                ) : (
                    <p className="text-sm"><strong>{lead.score}</strong>/100{lead.scoreReason ? ` · ${lead.scoreReason}` : ""}</p>
                )}
            </Section>

            <Section title={t("matches")}>
                {lead.matchingStatus === "pending" && lead.matches.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("matchingPending")}</p>
                ) : lead.matches.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("noMatches")}</p>
                ) : (
                    <ul className="flex flex-col gap-2">
                        {lead.matches.map((m, i) => {
                            const p = typeof m.property === "object" ? (m.property as unknown as Brief) : null;
                            return (
                                <li key={p?._id ?? i} className="rounded-lg border border-border p-3 text-sm">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-medium">{p ? pick(p.title) : "—"}</span>
                                        {m.score != null && <span className="text-xs text-muted-foreground">{m.score}/100</span>}
                                    </div>
                                    {m.reason && <p className="mt-1 text-muted-foreground">{m.reason}</p>}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </Section>

            <Section title={t("communications")}>
                {lead.communications.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("noCommunications")}</p>
                ) : (
                    <ul className="flex flex-col gap-1 text-sm">
                        {lead.communications.map((c, i) => (
                            <li key={i}>
                                {tc(c.channel)}{c.label ? ` · ${c.label}` : ""} · <span className="text-muted-foreground">{when(c.sentAt)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </Section>

            <Section title={t("notes")}>
                {lead.notes.length === 0 ? (
                    <p className="mb-3 text-sm text-muted-foreground">{t("noNotes")}</p>
                ) : (
                    <ul className="mb-3 flex flex-col gap-2">
                        {lead.notes.map((n) => (
                            <li key={n._id} className="rounded-lg bg-muted px-3 py-2 text-sm">
                                <p className="whitespace-pre-line">{n.text}</p>
                                <p className="mt-1 text-xs text-muted-foreground">{n.authorName} · {when(n.createdAt)}</p>
                            </li>
                        ))}
                    </ul>
                )}

                <form onSubmit={handleAddNote} className="flex flex-col gap-2">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={3}
                        maxLength={2000}
                        placeholder={t("notePlaceholder")}
                        className="w-full rounded-(--radius) border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <div className="flex justify-end">
                        <Button type="submit" size="sm" loading={adding} disabled={!text.trim()}>{t("addNote")}</Button>
                    </div>
                </form>
            </Section>
        </div>
    );
}