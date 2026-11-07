import { Suspense } from "react";
import Loading from "@/components/ui/Loading";
import GetFavorites from "@/feature/account/favorites/GetFavorites";

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <GetFavorites />
        </Suspense>
    );
}