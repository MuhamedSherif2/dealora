import Loading from "@/components/ui/Loading"
import GetProfile from "@/feature/account/get-profile/GetProfile"
import { Suspense } from "react"

function Page(){
    return(
        <Suspense fallback={<Loading />}>
            <GetProfile />
        </Suspense>
    )
}
export default Page