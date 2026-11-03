import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../baseQuery";
import type { GetPropertiesParams, GetPropertiesResponse, GetManagedPropertiesParams, GetManagedPropertiesResponse, GetFeaturedPropertiesResponse, GetPropertyResponse, CreatePropertyPayload, CreatePropertyResponse, UpdatePropertyRequest, UpdatePropertyResponse, UpdatePropertyStatusRequest, UpdatePropertyStatusResponse, AddPropertyImagesResponse, RemovePropertyImageRequest, RemovePropertyImageResponse, } from "@/types/property";

export const propertiesApi = createApi({
    reducerPath: "properties",
    baseQuery,
    tagTypes: ["Properties"],

    endpoints: (builder) => ({
        // GET /properties
        getAllProperties: builder.query<GetPropertiesResponse, GetPropertiesParams | void>({
            query: (params) => ({ url: "properties", method: "GET", ...(params ? { params } : {}), }),
            providesTags: ["Properties"],
        }),

        // GET /properties/featured
        getPropertiesFeatured: builder.query<GetFeaturedPropertiesResponse, void>({
            query: () => ({ url: "properties/featured", method: "GET", }),
            providesTags: ["Properties"],
        }),

        // GET /properties/manage/list
        getManagedProperties: builder.query<GetManagedPropertiesResponse, GetManagedPropertiesParams | void>({
            query: (params) => ({ url: "properties/manage/list", method: "GET", ...(params ? { params } : {}), }),
            providesTags: ["Properties"],
        }),

        // GET /properties/:idOrSlug
        getProperty: builder.query<GetPropertyResponse, string>({
            query: (idOrSlug) => ({ url: `properties/${idOrSlug}`, method: "GET", }),
            providesTags: ["Properties"],
        }),

        // POST /properties
        addProperty: builder.mutation<CreatePropertyResponse, CreatePropertyPayload>({
            query: (body) => ({ url: "properties", method: "POST", body, }),
            invalidatesTags: ["Properties"],
        }),

        // POST /properties/:id/images
        addImageProperty: builder.mutation<AddPropertyImagesResponse, { id: string; body: FormData }>({
            query: ({ id, body }) => ({ url: `properties/${id}/images`, method: "POST", body, }),
            invalidatesTags: ["Properties"],
        }),

        // PATCH /properties/:id
        updateProperty: builder.mutation<UpdatePropertyResponse, { id: string; body: UpdatePropertyRequest }>({
            query: ({ id, body }) => ({ url: `properties/${id}`, method: "PATCH", body, }),
            invalidatesTags: ["Properties"],
        }),

        // PATCH /properties/:id/status
        updatePropertyStatus: builder.mutation<UpdatePropertyStatusResponse, { id: string; body: UpdatePropertyStatusRequest }>({
            query: ({ id, body }) => ({ url: `properties/${id}/status`, method: "PATCH", body, }),
            invalidatesTags: ["Properties"],
        }),

        // DELETE /properties/:id/images
        deleteImageProperty: builder.mutation<RemovePropertyImageResponse, { id: string; body: RemovePropertyImageRequest }>({
            query: ({ id, body }) => ({ url: `properties/${id}/images`, method: "DELETE", body, }),
            invalidatesTags: ["Properties"],
        }),

        // DELETE /properties/:id
        deleteProperty: builder.mutation<void, string>({
            query: (id) => ({ url: `properties/${id}`, method: "DELETE", }),
            invalidatesTags: ["Properties"],
        }),
    }),
});

export const {
    useGetAllPropertiesQuery,
    useGetPropertiesFeaturedQuery,
    useGetManagedPropertiesQuery,
    useGetPropertyQuery,
    useAddPropertyMutation,
    useAddImagePropertyMutation,
    useUpdatePropertyMutation,
    useUpdatePropertyStatusMutation,
    useDeleteImagePropertyMutation,
    useDeletePropertyMutation,
} = propertiesApi;