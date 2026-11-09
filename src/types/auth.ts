import type { Language, ApiResponse, MessageResponse } from "./common";
import type { User } from "./user";

/* =========================
   Auth Requests
========================= */

export interface RegisterRequest {
  name: string;
  email: string;
  password: string; // min 8
  phone?: string;
  language?: Language;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string; // 6 digits sent on WhatsApp
  newPassword: string;
}

/* =========================
   Auth Responses
========================= */

// register does NOT return a token: log in next
export type RegisterResponse = ApiResponse<{ user: User }>;

export type LoginResponse = ApiResponse<{ token: string; user: User }>;

export type MeResponse = ApiResponse<{ user: User }>;

export type ForgotPasswordResponse = MessageResponse;

export type ResetPasswordResponse = MessageResponse;


// types/auth.ts
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  status: "success";
  message?: string;
  data: { token: string };
}