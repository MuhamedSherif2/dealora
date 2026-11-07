import Loading from "@/components/ui/Loading";
import GetViewing from "@/feature/dashboard/viewing/_components/getViewing";
import { Suspense } from "react";

function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <GetViewing />
        </Suspense>
    )
}

export default Page;