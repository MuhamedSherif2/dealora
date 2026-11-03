import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../baseQuery";
// types
import type {
    GetUsersParams, GetUsersResponse,
    CreateUserRequest, CreateUserResponse,
    UpdateUserRequest, UpdateUserResponse,
    GetWebhookLogsParams, GetWebhookLogsResponse,
    RetryWebhooksResponse,
} from "@/types";

export const adminApi = createApi({
    reducerPath: "admin",
    baseQuery,
    tagTypes: ["Admin", "WebhookLogs"],

    endpoints: (builder) => ({
        getUsers: builder.query<GetUsersResponse, GetUsersParams | void>({
            query: (params) => ({
                url: "admin/users",
                method: "GET",
                params: params ?? undefined,
            }),
            providesTags: ["Admin"],
        }),

        createUser: builder.mutation<CreateUserResponse, CreateUserRequest>({
            query: (body) => ({ url: "admin/users", method: "POST", body }),
            invalidatesTags: ["Admin"],
        }),

        updateUser: builder.mutation<UpdateUserResponse, { id: string; body: UpdateUserRequest }>({
            query: ({ id, body }) => ({ url: `admin/users/${id}`, method: "PATCH", body }),
            invalidatesTags: ["Admin"],
        }),

        getWebhookLogs: builder.query<GetWebhookLogsResponse, GetWebhookLogsParams | void>({
            query: (params) => ({ url: "admin/webhook-logs", method: "GET", params: params ?? undefined }),
            providesTags: ["WebhookLogs"],
        }),

        retryWebhooks: builder.mutation<RetryWebhooksResponse, void>({
            query: () => ({ url: "admin/webhook-logs/retry", method: "POST" }),
            invalidatesTags: ["WebhookLogs"],
        }),

    }),
});

export const { useGetUsersQuery, useCreateUserMutation, useUpdateUserMutation, useGetWebhookLogsQuery, useRetryWebhooksMutation, } = adminApi;