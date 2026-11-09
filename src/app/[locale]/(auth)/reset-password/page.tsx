import { Suspense } from "react";
import ResetPassword from "@/feature/auth/reset-password/resetPassword";

export default function Page() {
    return <Suspense><ResetPassword /></Suspense>;
}