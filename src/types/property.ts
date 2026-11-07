import type {
  ApiResponse, Bilingual, Country, Currency, Language, PaginatedResponse, PaginationParams,
} from "./common";
import type { AgentBrief } from "./user";

/* =========================
   Property Enums
========================= */

export type PropertyType = "apartment" | "villa" | "townhouse" | "penthouse" | "studio" | "duplex" | "office" | "shop" | "warehouse" | "land" | "building";
export type Purpose = "sale" | "rent";
export type RentPeriod = "yearly" | "monthly" | "weekly" | "daily";
export type AreaUnit = "sqm" | "sqft";
export type Furnishing = "furnished" | "semi_furnished" | "unfurnished";
export type CompletionStatus = "ready" | "off_plan";
export type PropertyStatus = "available" | "reserved" | "sold" | "rented";
export type PaymentMethod = "cash" | "installments" | "mortgage";
export type PropertySort = "newest" | "oldest" | "price_asc" | "price_desc" | "area_desc" | "popular";

/* =========================
   Property Entity
========================= */

export interface PropertyImage {
  url: string;
  publicId: string;
}

export interface PropertyLocation {
  country: Country;
  city?: Bilingual;
  district?: Bilingual;
  compound?: Bilingual;
  address?: Bilingual;
  geo?: { type: "Point"; coordinates: [number, number] }; // [lng, lat]
}

export interface Property {
  _id: string;
  title: Bilingual;
  description?: Bilingual;
  slug: string;

  type: PropertyType;
  purpose: Purpose;

  price: number;
  currency: Currency;
  rentPeriod?: RentPeriod;

  area: number;
  areaUnit: AreaUnit;
  bedrooms: number;
  bathrooms: number;
  floor?: number;
  furnishing: Furnishing;

  completionStatus: CompletionStatus;
  developer?: string;
  handoverDate?: string;
  paymentPlan?: string;
  paymentMethod: PaymentMethod[];
  permitNumber?: string;

  location: PropertyLocation;
  amenities: string[];
  images: PropertyImage[];
  lang?: Language;
  status: PropertyStatus;
  agent: string | AgentBrief;
  isFeatured: boolean;
  isActive: boolean;
  views: number;

  createdAt: string;
  updatedAt: string;
}

// what the API returns: the property + an `i18n` block already in the requested language
export interface LocalizedProperty extends Property {
  i18n: {
    lang: Language;
    title: string;
    description: string;
    city: string;
    district: string;
    compound: string;
    address: string;
    coordinates: { lat: number; lng: number } | null;
  };
}

/* =========================
   List / Search  (GET /properties, /properties/manage/list)
========================= */

export interface GetPropertiesParams extends PaginationParams {
  country?: Country;
  city?: string;
  district?: string;
  compound?: string;
  type?: string;            // "villa" or "villa,apartment"
  purpose?: Purpose;
  currency?: Currency;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: string;        // "3" | "1,2,3" | "4+"
  minBathrooms?: number;
  minArea?: number;
  maxArea?: number;
  furnishing?: string;      // comma separated
  paymentMethod?: string;   // comma separated, any match
  completionStatus?: string;
  amenities?: string;       // comma separated, all must match
  isFeatured?: "true";
  page?: number;
  limit?: number;
  search?: string;
  lat?: number;
  lng?: number;
  lang?: Language;
  radius?: number;          // km
  sort?: PropertySort;
}
export type GetPropertiesResponse = PaginatedResponse<LocalizedProperty>;

// staff list: extra filters
export interface GetManagedPropertiesParams extends GetPropertiesParams {
  status?: string;          // comma separated, or "all"
  agent?: string;           // admin only
}
export type GetManagedPropertiesResponse = PaginatedResponse<LocalizedProperty>;

export type GetFeaturedPropertiesResponse = ApiResponse<LocalizedProperty[]>;

/* =========================
   Single Property  (GET /properties/:idOrSlug)
========================= */

export type GetPropertyResponse = ApiResponse<LocalizedProperty>;

/* =========================
   Create / Update  (staff)
========================= */

export interface PropertyLocationInput {
  country: Country;
  city: Bilingual;
  district?: Bilingual;
  compound?: Bilingual;
  address?: Bilingual;
  coordinates?: { lat: number; lng: number };
}

export interface CreatePropertyRequest {
  title: Bilingual;
  description?: Bilingual;
  type: PropertyType;
  purpose: Purpose;
  price: number;
  currency?: Currency;
  rentPeriod?: RentPeriod;
  area: number;
  areaUnit?: AreaUnit;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  furnishing?: Furnishing;
  completionStatus?: CompletionStatus;
  developer?: string;
  handoverDate?: string;
  paymentPlan?: string;
  paymentMethod?: PaymentMethod[];
  permitNumber?: string;
  location: PropertyLocationInput;
  amenities?: string[];
  status?: PropertyStatus;
  isFeatured?: boolean;
  isActive?: boolean;
  agent?: string; // admin only
}

// POST /properties : send JSON, OR FormData with
//   data   = JSON.stringify(CreatePropertyRequest)
//   images = the image files (repeat the field)
export type CreatePropertyPayload = CreatePropertyRequest | FormData;
export type CreatePropertyResponse = ApiResponse<LocalizedProperty>;

export type UpdatePropertyRequest = Partial<Omit<CreatePropertyRequest, "location">> & {
  location?: Partial<PropertyLocationInput>;
};
export type UpdatePropertyResponse = ApiResponse<LocalizedProperty>;

export interface UpdatePropertyStatusRequest {
  status: PropertyStatus;
}
export type UpdatePropertyStatusResponse = ApiResponse<LocalizedProperty>;

/* =========================
   Images  (/properties/:id/images)
========================= */

// POST: FormData, field name "images"
export type AddPropertyImagesResponse = ApiResponse<{ images: PropertyImage[] }>;

export interface RemovePropertyImageRequest {
  publicId: string;
}
export type RemovePropertyImageResponse = ApiResponse<{ images: PropertyImage[] }>;

// DELETE /properties/:id -> 204 (no body)


// types/property.ts
export interface CityStat {
  country: Country;
  city: { ar?: string; en?: string };
  count: number;
  image: string | null;
}
export type GetPropertyCitiesResponse = ApiResponse<CityStat[]>;