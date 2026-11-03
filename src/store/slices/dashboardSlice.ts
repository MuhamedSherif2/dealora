import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../baseQuery";
import { GetStatsResponse, } from "@/types/dashboard"

export const dashboardApi = createApi({
    reducerPath: "dashboard",
    baseQuery,
    tagTypes: ["Dashboard"],
    endpoints: (builder) => ({
        getState: builder.query<GetStatsResponse, void>({
            query: () => ({ url: "dashboard/stats", method: "GET" }),
            providesTags: ["Dashboard"]
        })
    })
})

export const { useGetStateQuery } = dashboardApi