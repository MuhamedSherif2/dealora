"use client";

import { usePathname } from "@/i18n/navigation";
import Footer from "./Footer";

const HIDDEN_ON = ["/dashboard"];

export default function UserFooter() {
    const pathname = usePathname();
    if (HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;
    return <Footer />;
}