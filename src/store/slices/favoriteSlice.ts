import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../baseQuery";
import { GetFavoritesResponse, AddFavoriteResponse } from "@/types/favorite"

export const favoriteApi = createApi({
    reducerPath: "favorite",
    baseQuery,
    tagTypes: ["Favorite"],
    endpoints: (builder) => ({
        listFavorite: builder.query<GetFavoritesResponse, { lang?: "ar" | "en" } | void>({
            query: (params) => ({ url: "favorites", method: "GET", params: params ?? undefined }),
            providesTags: ["Favorite"]
        }),

        addToFavorite: builder.mutation<AddFavoriteResponse, string>({
            query: (propertyId) => ({ url: `favorites/${propertyId}`, method: "POST" }),
            invalidatesTags: ["Favorite"]
        }),

        daleteFavorit: builder.mutation<void, string>({
            query: (propertyId) => ({ url: `favorites/${propertyId}`, method: "DELETE" }),
            invalidatesTags: ["Favorite"],
        })
    })
})
export const { useAddToFavoriteMutation, useListFavoriteQuery, useDaleteFavoritMutation } = favoriteApi