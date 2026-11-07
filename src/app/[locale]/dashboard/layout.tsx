import type { ReactNode } from "react";
import DashboardShell from "@/components/feature/dashboard/DashboardShell";

export default function layout({ children }: { children: ReactNode }) {
    return <DashboardShell>{children}</DashboardShell>;
}