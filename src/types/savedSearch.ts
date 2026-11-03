import type { ApiResponse, Country, Currency } from "./common";
import type { Furnishing, PropertyType, Purpose } from "./property";

export type NotifyChannel = "whatsapp" | "email";

export interface SavedSearchCriteria {
  country?: Country;
  city?: string;
  district?: string;
  purpose?: Purpose;
  types?: PropertyType[];
  currency?: Currency;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  furnishing?: Furnishing;
}

export interface SavedSearch {
  _id: string;
  user: string;
  name?: string;
  criteria: SavedSearchCriteria;
  notifyVia: NotifyChannel[];
  isActive: boolean;
  lastNotifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type GetSavedSearchesResponse = ApiResponse<SavedSearch[]>;

export interface CreateSavedSearchRequest {
  name?: string;
  criteria: SavedSearchCriteria; // at least one field
  notifyVia?: NotifyChannel[];   // default ["whatsapp"]
}
export type CreateSavedSearchResponse = ApiResponse<SavedSearch>;

export interface UpdateSavedSearchRequest {
  name?: string;
  criteria?: SavedSearchCriteria;
  notifyVia?: NotifyChannel[];
  isActive?: boolean;
}
export type UpdateSavedSearchResponse = ApiResponse<SavedSearch>;

// DELETE /saved-searches/:id -> 204 (no body)
