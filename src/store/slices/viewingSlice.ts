
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../baseQuery";

import type {
    Viewing,
    RequestViewingRequest,
    RequestViewingResponse,
    GetViewingsParams,
    GetViewingsResponse,
    UpdateViewingRequest,
    UpdateViewingResponse,
} from "@/types/viewing";

export const viewingApi = createApi({
    reducerPath: "viewing",
    baseQuery,
    tagTypes: ["Viewing"],

    endpoints: (builder) => ({
        // GET /viewings
        getViewing: builder.query<GetViewingsResponse, GetViewingsParams | void>({
            query: (params) => ({
                url: "viewings",
                method: "GET",
                ...(params ? { params } : {}),
            }),
            providesTags: ["Viewing"],
        }),

        // POST /viewings
        addViewing: builder.mutation<RequestViewingResponse, RequestViewingRequest>({
            query: (body) => ({
                url: "viewings",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Viewing"],
        }),

        // PATCH /viewings/:id
        updateViewing: builder.mutation<UpdateViewingResponse, { id: string; body: UpdateViewingRequest }>({
            query: ({ id, body }) => ({
                url: `viewings/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Viewing"],
        }),
    }),
});

export const {
    useGetViewingQuery,
    useAddViewingMutation,
    useUpdateViewingMutation,
} = viewingApi;
