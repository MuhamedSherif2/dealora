import { Suspense } from "react";
import Loading from "@/components/ui/Loading";
import GetSavedSearch from "@/feature/dashboard/savedSearch/_components/getSavedSearch";

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <GetSavedSearch />
        </Suspense>
    );
}