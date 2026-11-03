
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../baseQuery";

import type {
    GetSavedSearchesResponse,
    CreateSavedSearchRequest,
    CreateSavedSearchResponse,
    UpdateSavedSearchRequest,
    UpdateSavedSearchResponse,
} from "@/types/savedSearch";

export const savedSearchApi = createApi({
    reducerPath: "savedSearch",
    baseQuery,
    tagTypes: ["SavedSearch"],

    endpoints: (builder) => ({
        // GET /saved-searches
        getSavedSearch: builder.query<GetSavedSearchesResponse, void>({
            query: () => ({
                url: "saved-searches",
                method: "GET",
            }),
            providesTags: ["SavedSearch"],
        }),

        // POST /saved-searches
        addSavedSearch: builder.mutation<CreateSavedSearchResponse, CreateSavedSearchRequest>({
            query: (body) => ({
                url: "saved-searches",
                method: "POST",
                body,
            }),
            invalidatesTags: ["SavedSearch"],
        }),

        // PATCH /saved-searches/:id
        updateSavedSearch: builder.mutation<UpdateSavedSearchResponse, { id: string; body: UpdateSavedSearchRequest }>({
            query: ({ id, body }) => ({
                url: `saved-searches/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["SavedSearch"],
        }),

        // DELETE /saved-searches/:id
        deleteSavedSearch: builder.mutation<void, string>({
            query: (id) => ({
                url: `saved-searches/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["SavedSearch"],
        }),
    }),
});

export const {
    useGetSavedSearchQuery,
    useAddSavedSearchMutation,
    useUpdateSavedSearchMutation,
    useDeleteSavedSearchMutation,
} = savedSearchApi;
