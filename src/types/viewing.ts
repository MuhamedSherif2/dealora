import type { ApiResponse, Language, PaginatedResponse, PaginationParams } from "./common";
import type { AgentBrief } from "./user";
import type { Lead } from "./lead";
import type { Property } from "./property";

export type ViewingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";

// allowed status changes
export const VIEWING_TRANSITIONS: Record<ViewingStatus, ViewingStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled", "no_show"],
  completed: [],
  cancelled: [],
  no_show: [],
};

export interface Viewing {
  _id: string;
  property: string | Pick<Property, "_id" | "title" | "slug">;
  lead: string | Pick<Lead, "_id" | "name" | "phone" | "language">;
  user?: string;
  agent?: string | AgentBrief;
  scheduledAt: string;
  status: ViewingStatus;
  notes?: string;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
}

/* =========================
   Request a Viewing  (POST /viewings, guest or logged in)
========================= */

export interface RequestViewingRequest {
  propertyId: string;
  scheduledAt: string; // ISO date
  name?: string;       // required for guests
  phone?: string;      // required for guests
  email?: string;
  language?: Language;
  notes?: string;
}
export type RequestViewingResponse = ApiResponse<{ viewing: Viewing }>;

/* =========================
   List / Update  (logged in)
========================= */

export interface GetViewingsParams extends PaginationParams {
  status?: string; // comma separated
}
export type GetViewingsResponse = PaginatedResponse<Viewing>;

export interface UpdateViewingRequest {
  status?: ViewingStatus;
  scheduledAt?: string;
  notes?: string;
}
export type UpdateViewingResponse = ApiResponse<Viewing>;
