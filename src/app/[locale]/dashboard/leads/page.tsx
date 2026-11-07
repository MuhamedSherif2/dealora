import Loading from "@/components/ui/Loading"
import GetLeads from "@/feature/dashboard/leads/_component/getLeads"
import { Suspense } from "react"

function Page() {
    return(
        <Suspense fallback={<Loading />}>
            <GetLeads />
        </Suspense>
    )
}

export default Page