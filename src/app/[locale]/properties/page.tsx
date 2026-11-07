import { Suspense } from "react";
import Loading from "@/components/ui/Loading";
import GetAllProperties from "@/feature/guest/properties/getAllProperties";

function Page() {
    return (
        <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
            <Suspense fallback={<Loading />}>
                <GetAllProperties />
            </Suspense>
        </div>
    );
}

export default Page;