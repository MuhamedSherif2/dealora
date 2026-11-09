import { Suspense } from "react";
import Loading from "@/components/ui/Loading";
import GetWebHook from "@/feature/dashboard/webhook/_components/getWebHook";

function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <GetWebHook />
        </Suspense>
    );
}
export default Page;