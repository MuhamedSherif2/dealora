import { Suspense } from "react";
import ForgotPassword from "@/feature/auth/forgot-password/forgetPassword";

export default function Page() {
    return <Suspense><ForgotPassword /></Suspense>;
}