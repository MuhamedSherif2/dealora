import { Suspense } from "react";
import GetProperties from "@/feature/dashboard/properties/_components/getProperties";
import Loading from "@/components/ui/Loading";

function Page() {
    return (
        <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
            <Suspense fallback={<Loading />}>
                <GetProperties />
            </Suspense>
        </div>
    );
}

export default Page;