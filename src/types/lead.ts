import type {
  ApiResponse, Language, PaginatedResponse, PaginationParams,
} from "./common";
import type { AgentBrief } from "./user";
import type { Property, LocalizedProperty } from "./property";

/* =========================
   Lead Enums
========================= */

export type LeadStatus = "new" | "contacted" | "viewing_scheduled" | "negotiating" | "won" | "lost";
export type LeadSource = "website" | "whatsapp" | "facebook" | "instagram" | "chatbot" | "phone" | "other";
export type MatchingStatus = "pending" | "ready";
export type CommunicationChannel = "whatsapp" | "email";

/* =========================
   Lead Entity
========================= */

export interface LeadNote {
  _id: string;
  text: string;
  authorName: string;
  createdAt: string;
}

export interface LeadMatch {
  property: string | Property; // populated on GET /leads/:id
  score?: number;              // 0-100
  reason?: string;
}

export interface LeadCommunication {
  channel: CommunicationChannel;
  label?: string;
  sentAt: string;
}

export interface Lead {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  language: Language;

  property?: string | Pick<Property, "_id" | "title" | "slug">;
  user?: string;
  assignedAgent?: string | AgentBrief;

  source: LeadSource;
  status: LeadStatus;
  score?: number;        // internal, staff only
  scoreReason?: string;

  matches: LeadMatch[];
  matchingStatus: MatchingStatus;
  matchedAt?: string;

  communications: LeadCommunication[];
  notes: LeadNote[];
  lastContactedAt?: string;

  createdAt: string;
  updatedAt: string;
}

/* =========================
   Customer: Send a Request  (POST /leads, public)
========================= */

export interface CreateLeadRequest {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  propertyId?: string;
  language?: Language;
}

export type CreateLeadResponse = ApiResponse<{
  lead: { id: string; status: LeadStatus };
  duplicate: boolean;
  publicToken?: string; // ONLY for a brand-new lead, returned once: keep it for the results page
}>;

/* =========================
   Customer: Results Page  (GET /leads/public/:token)
========================= */

export interface PublicMatch {
  score: number | null;
  reason: string | null;
  property: LocalizedProperty;
}

export type GetPublicResultsResponse = ApiResponse<{
  matchingStatus: MatchingStatus; // poll until "ready"
  matchedAt: string | null;
  matches: PublicMatch[];
}>;

/* =========================
   Staff: List / Details  (agent + admin)
========================= */

export interface GetLeadsParams extends PaginationParams {
  status?: string; // comma separated: "new,contacted"
  source?: LeadSource;
  property?: string;
  agent?: string;  // admin only
  minScore?: number;
  search?: string; // name / phone / email
}
export type GetLeadsResponse = PaginatedResponse<Lead>;

export type GetLeadResponse = ApiResponse<Lead>;

export interface UpdateLeadRequest {
  status?: LeadStatus;
  assignedAgent?: string;
  score?: number;
  scoreReason?: string;
}
export type UpdateLeadResponse = ApiResponse<Lead>;

export interface AddLeadNoteRequest {
  text: string;
}
export type AddLeadNoteResponse = ApiResponse<LeadNote[]>;
