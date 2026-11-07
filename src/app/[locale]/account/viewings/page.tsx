import { Suspense } from "react";
import Loading from "@/components/ui/Loading";
import GetMyViewings from "@/feature/account/favorites/GetMyViewings";

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <GetMyViewings />
        </Suspense>
    );
}