import type { ApiResponse, PaginatedResponse, PaginationParams } from "./common";

export type WebhookStatus = "pending" | "success" | "failed" | "skipped";

export interface WebhookLog {
  _id: string;
  event: string;
  payload?: unknown;
  status: WebhookStatus;
  sensitive: boolean;
  attempts: number;
  responseStatus?: number;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetWebhookLogsParams extends PaginationParams {
  status?: WebhookStatus;
  event?: string;
}
export type GetWebhookLogsResponse = PaginatedResponse<WebhookLog>;

// POST /admin/webhook-logs/retry
export type RetryWebhooksResponse = ApiResponse<{ retried: number; succeeded: number }>;
