
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../baseQuery";

import type { CreateLeadRequest, CreateLeadResponse, GetLeadsParams, GetLeadsResponse, GetLeadResponse, GetPublicResultsResponse, UpdateLeadRequest, UpdateLeadResponse, AddLeadNoteRequest, AddLeadNoteResponse, } from "@/types/lead";

export const leadApi = createApi({
    reducerPath: "lead",
    baseQuery,
    tagTypes: ["Lead"],

    endpoints: (builder) => ({
        // GET /leads
        getLeads: builder.query<GetLeadsResponse, GetLeadsParams | void>({
            query: (params) => ({ url: "leads", method: "GET", ...(params ? { params } : {}), }),
            providesTags: ["Lead"],
        }),

        // GET /leads/:id
        getLeadById: builder.query<GetLeadResponse, string>({
            query: (id) => ({ url: `leads/${id}`, method: "GET", }),
            providesTags: (_result, _error, id) => [{ type: "Lead", id },],
        }),

        // GET /leads/public/:token
        getPublicResults: builder.query<GetPublicResultsResponse, string>({
            query: (token) => ({ url: `leads/public/${token}`, method: "GET", }),
            providesTags: ["Lead"]
        }),

        // POST /leads
        addLead: builder.mutation<CreateLeadResponse, CreateLeadRequest>({
            query: (body) => ({ url: "leads", method: "POST", body, }),
            invalidatesTags: ["Lead"],
        }),

        // POST /leads/:id/notes
        addNotes: builder.mutation<AddLeadNoteResponse, { id: string; body: AddLeadNoteRequest }>({
            query: ({ id, body }) => ({ url: `leads/${id}/notes`, method: "POST", body, }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Lead", id }, "Lead",],
        }),

        // PATCH /leads/:id
        updateLead: builder.mutation<UpdateLeadResponse, { id: string; body: UpdateLeadRequest }>({
            query: ({ id, body }) => ({ url: `leads/${id}`, method: "PATCH", body, }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Lead", id }, "Lead",],
        }),
    }),
});

export const { useGetLeadsQuery, useGetLeadByIdQuery, useGetPublicResultsQuery, useAddLeadMutation, useAddNotesMutation, useUpdateLeadMutation, } = leadApi;
