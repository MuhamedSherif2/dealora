import { Suspense } from "react";
import ShowPropertyBySlug from "@/feature/guest/properties/propertiesDetails/showProprtyBySlug";
import Loading from "@/components/ui/Loading";

export default function Page() {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-8">
            <Suspense fallback={<Loading />}>
                <ShowPropertyBySlug />
            </Suspense>
        </div>
    );
}