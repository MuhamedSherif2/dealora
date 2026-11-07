"use client";

import { Suspense } from "react";
import { usePathname } from "@/i18n/navigation";
import Navbar from "./Navbar";

const HIDDEN_ON = ["/dashboard"];

function UserNavbarContent() {
    const pathname = usePathname();

    const shouldHide = HIDDEN_ON.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`)
    );

    if (shouldHide) return null;

    return <Navbar />;
}

export default function UserNavbar() {
    return (
        <Suspense fallback={null}>
            <UserNavbarContent />
        </Suspense>
    );
}