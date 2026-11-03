import type { ApiResponse } from "./common";
import type { LocalizedProperty } from "./property";

export type GetFavoritesResponse = ApiResponse<LocalizedProperty[]>;

// POST /favorites/:propertyId
export type AddFavoriteResponse = ApiResponse<{ propertyId: string }>;

// DELETE /favorites/:propertyId -> 204 (no body)
