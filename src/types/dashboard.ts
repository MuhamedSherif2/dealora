import type { ApiResponse } from "./common";
import type { PropertyStatus } from "./property";
import type { LeadStatus } from "./lead";

export interface DashboardStats {
  properties: Partial<Record<PropertyStatus, number>>;
  leads: Partial<Record<LeadStatus, number>>;
  totalLeads: number;
  conversionRate: number; // percent (won / total)
  leadsLast30Days: { date: string; count: number }[]; // date = YYYY-MM-DD
  upcomingViewings: number;
  totalViews: number;
}

// GET /dashboard/stats  (agent: own numbers, admin: everything)
export type GetStatsResponse = ApiResponse<DashboardStats>;
