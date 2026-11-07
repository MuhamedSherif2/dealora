import { Suspense } from "react";
import GetUsers from "@/feature/dashboard/users/_components/getUsers";
import Loading from "@/components/ui/Loading";

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <GetUsers />
        </Suspense>
    );
}