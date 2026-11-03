import type { Language, UserRole, ApiResponse, PaginatedResponse, PaginationParams } from "./common";

/* =========================
   User Entity
========================= */

export interface UserAvatar {
  url?: string;
  publicId?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string; // E.164, e.g. +971501234567

  role: UserRole;
  language: Language;

  avatar?: UserAvatar;

  // agents only
  company?: string;
  licenseNumber?: string;

  favorites: string[];

  isActive: boolean;
  lastLoginAt?: string;

  createdAt: string;
  updatedAt: string;
}

// short user shape returned inside populated fields (property.agent, lead.assignedAgent ...)
export interface AgentBrief {
  _id?: string;
  name: string;
  phone?: string;
  email?: string;
  avatar?: UserAvatar;
  company?: string;
}

/* =========================
   Update My Profile  (PATCH /auth/me)
========================= */

export interface UpdateMeRequest {
  name?: string;
  phone?: string;
  language?: Language;
  // email, role and avatar can NOT be changed here
}

export type UpdateMeResponse = ApiResponse<{ user: User }>;

/* =========================
   Admin: Users  (/admin/users)
========================= */

export interface GetUsersParams extends PaginationParams {
  role?: UserRole;
  search?: string; // name / email / phone
}
export type GetUsersResponse = PaginatedResponse<User>;

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole; // default: "agent"
  language?: Language;
  company?: string;
  licenseNumber?: string;
}
export type CreateUserResponse = ApiResponse<User>;

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
  company?: string;
  licenseNumber?: string;
}
export type UpdateUserResponse = ApiResponse<User>;
