"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useGetUsersQuery } from "@/store/slices/adminSlice";
import Button from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import CreateUser from "../_ui/createUser";
import UpdateUser from "../_ui/updateUser";

const roleStyles = {
    admin: "bg-primary/15 text-primary",
    agent: "bg-secondary text-secondary-foreground",
    client: "bg-muted text-muted-foreground",
} as const;

const cell = "whitespace-nowrap border-e border-border px-4 py-3";
const columns = ["name", "email", "phone", "role", "company", "language", "status", "lastLogin", "createdAt", "actions"] as const;

function GetUsers() {
    const t = useTranslations("Users");
    const tEnums = useTranslations("Enums");
    const format = useFormatter();
    const { data, isLoading, isError, refetch } = useGetUsersQuery();

    const users = data?.data ?? [];

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

        if (users.length === 0) {
            return <p className="py-16 text-center text-muted-foreground">{t("empty")}</p>;
        }

        return (
            <div className="w-full overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 mx-5 my-3">
                    <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
                    <div className="flex items-center gap-4">
                        {!isLoading && !isError && (
                            <span className="text-sm text-muted-foreground">{t("total", { count: users.length })}</span>
                        )}
                        <CreateUser />
                    </div>
                </div>
                <table className="w-full min-w-max border-collapse text-start text-sm">
                    <thead className="bg-muted text-muted-foreground">
                        <tr className="border-b border-border">
                            {columns.map((c) => (
                                <th
                                    key={c}
                                    className="whitespace-nowrap border-e border-border px-4 py-4 text-start font-semibold last:border-e-0"
                                >
                                    {t(`columns.${c}`)}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {users.map((u) => (
                            <tr key={u._id} className="transition-colors hover:bg-muted/50">
                                <td className={cell}>
                                    <div className="flex items-center gap-3">
                                        {u.avatar?.url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={u.avatar.url} alt="" className="size-8 rounded-full object-cover" />
                                        ) : (
                                            <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                                                {u.name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                        <span className="font-medium">{u.name}</span>
                                    </div>
                                </td>
                                <td className={cell} dir="ltr">{u.email}</td>
                                <td className={cell} dir="ltr">{u.phone ?? "—"}</td>
                                <td className={cell}>
                                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${roleStyles[u.role]}`}>
                                        {tEnums(`role.${u.role}`)}
                                    </span>
                                </td>
                                <td className={cell}>{u.company ?? "—"}</td>
                                <td className={cell}>{t(`languages.${u.language}`)}</td>
                                <td className={cell}>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${u.isActive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                                            }`}
                                    >
                                        {u.isActive ? t("active") : t("inactive")}
                                    </span>
                                </td>
                                <td className={cell}>
                                    {u.lastLoginAt
                                        ? format.dateTime(new Date(u.lastLoginAt), { dateStyle: "medium", timeStyle: "short" })
                                        : t("never")}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    {format.dateTime(new Date(u.createdAt), { dateStyle: "medium" })}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <UpdateUser user={u} />
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
                <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
                {!isLoading && !isError && (
                    <span className="text-sm text-muted-foreground">{t("total", { count: users.length })}</span>
                )}
            </div>
            {renderContent()}
        </section>
    );
}

export default GetUsers;