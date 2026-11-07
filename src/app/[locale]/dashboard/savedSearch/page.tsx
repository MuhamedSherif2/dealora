import Loading from "@/components/ui/Loading"
import GetSavedSearch from "@/feature/dashboard/savedSearch/_components/getSavedSearch"
import { Suspense } from "react"

function Page() {
    return(
        <Suspense fallback={<Loading />}>
            <GetSavedSearch />
        </Suspense>
    )
}

export default Page