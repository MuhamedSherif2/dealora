/* =========================
   Shared Enums
========================= */

export type Language = "ar" | "en";
export type UserRole = "admin" | "agent" | "client";
export type Country = "AE" | "SA" | "KW" | "QA" | "BH" | "OM";
export type Currency = "AED" | "SAR" | "KWD" | "QAR" | "BHD" | "OMR" | "USD";

/* =========================
   Generic API Shapes
========================= */

export interface Bilingual {
  ar?: string;
  en?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number; // NOTE: the backend calls it "pages"
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  status: "success";
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// responses that carry no data (forgot/reset password). DELETE endpoints return 204 with NO body.
export interface MessageResponse {
  status: "success";
  message?: string;
  data: null;
}

export interface ApiErrorDetail {
  path: string;
  message: string;
}

export interface ApiError {
  status: "fail" | "error";
  message: string;
  errors?: ApiErrorDetail[];   // not "details"
}