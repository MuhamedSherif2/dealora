import { useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import { adminApi } from "./slices/adminSlice"
import { authApi } from "./slices/authSlice"
import { dashboardApi } from "./slices/dashboardSlice"
import { favoriteApi } from "./slices/favoriteSlice"
import { leadApi } from "./slices/leadSlice"
import { propertiesApi } from "./slices/propertySlice"
import { savedSearchApi } from "./slices/savesSearchSlice"
import { viewingApi } from "./slices/viewingSlice"

export const Store = configureStore({
    reducer: {
        [adminApi.reducerPath]: adminApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [favoriteApi.reducerPath]: favoriteApi.reducer,
        [leadApi.reducerPath]: leadApi.reducer,
        [propertiesApi.reducerPath]: propertiesApi.reducer,
        [savedSearchApi.reducerPath]: savedSearchApi.reducer,
        [viewingApi.reducerPath]: viewingApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([
            adminApi.middleware,
            authApi.middleware,
            dashboardApi.middleware,
            favoriteApi.middleware,
            leadApi.middleware,
            propertiesApi.middleware,
            savedSearchApi.middleware,
            viewingApi.middleware,
        ])
});

// Export hooks for dispatch and selector
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

// All API slices
export const apiSlices = [
    adminApi,
    authApi,
    dashboardApi,
    favoriteApi,
    leadApi,
    propertiesApi,
    savedSearchApi,
    viewingApi,
] as const;

// Reset all API cache
export function resetAllApiState(dispatch: AppDispatch) {
    for (const api of apiSlices) {
        dispatch(api.util.resetApiState());
    }
}

// Typed hooks
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();