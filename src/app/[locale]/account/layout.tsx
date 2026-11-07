import type { ReactNode } from "react";
import AccountNav from "@/feature/account/AccountNav";

export default function AccountLayout({ children }: { children: ReactNode }) {
    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
            <div className="grid gap-8 lg:grid-cols-[14rem_1fr]">
                <AccountNav />
                <div className="min-w-0">{children}</div>
            </div>
        </div>
    );
}