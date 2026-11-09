import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../baseQuery";
import { RegisterRequest, RegisterResponse, LoginResponse, LoginRequest, ForgotPasswordResponse, ForgotPasswordRequest, ResetPasswordResponse, ResetPasswordRequest, MeResponse, ChangePasswordResponse, ChangePasswordRequest } from "@/types/auth"

export const authApi = createApi({
    reducerPath: "auth",
    baseQuery,
    tagTypes: ["Auth"],

    endpoints: (builder) => ({
        register: builder.mutation<RegisterResponse, RegisterRequest>({
            query: (body) => ({ url: "auth/register", method: "POST", body }),
            invalidatesTags: ["Auth"],
        }),

        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (body) => ({ url: "auth/login", method: "POST", body }),
            invalidatesTags: ["Auth"],
        }),

        forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
            query: (body) => ({ url: "auth/forgot-password", method: "POST", body }),
            invalidatesTags: ["Auth"],
        }),

        resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
            query: (body) => ({ url: "auth/reset-password", method: "POST", body, }),
            invalidatesTags: ["Auth"],
        }),

        getProfile: builder.query<MeResponse, void>({
            query: () => ({ url: "auth/me", method: "GET" }),
            providesTags: ["Auth"]
        }),

        updateProfile: builder.mutation<MeResponse, { name?: string; phone?: string; language?: "ar" | "en" }>({
            query: (body) => ({ url: "auth/me", method: "PATCH", body }),
            invalidatesTags: ["Auth"],
        }),

        changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
            query: (body) => ({ url: "auth/password", method: "PATCH", body }),
            invalidatesTags: ["Auth"],
        }),

    })
})

export const { useRegisterMutation, useLoginMutation, useForgotPasswordMutation, useResetPasswordMutation, useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } = authApi