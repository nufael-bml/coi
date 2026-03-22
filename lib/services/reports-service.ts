export interface ProjectReport {
  id: string;
  number: string;
  title: string;
  status: string;
  team: string;
  developmentTeam: string;
  developmentLead?: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  approvedDate?: string;
  complianceApprovedDate?: string;
  effectiveSystem?: string;
  isDraft: boolean;
  uatDeliveryDate?: string;
  implementationLiveDate?: string;
  implementationDate?: string;
  manDays?: {
    total: number;
    [key: string]: number;
  };
  statusChangedAt?: string;
  developmentStartDate?: string;
  uatDeliveredOn?: string;
  implementedOn?: string;
  impactScoring?: {
    regulatoryNeed: number;
    costSaving: number;
    customerImprovement: number;
    infrastructureEnhancement: number;
    strategyAlignment: number;
  };
}

interface TeamProductivityMetric {
  team: string;
  total: number;
  completed: number;
  productivity: number;
}

interface ImpactAverage {
  average: number;
  count: number;
}

export interface ReportsData {
  projects: ProjectReport[];
  totalProjects: number;
  completedProjects: number;
  pendingApproval: number;
  pendingSIT: number;
  pendingUAT: number;
  statusDistribution: Record<string, number>;
  averageApprovalTimeDays: number;
  teamProductivity: TeamProductivityMetric[];
  impactHeatmap: Record<string, ImpactAverage>;
}

import { getApiBaseUrl } from "@/lib/runtime-api";

const API_BASE_URL = getApiBaseUrl();

export async function getReportsData(): Promise<ReportsData> {
  const response = await fetch(`${API_BASE_URL}/reports`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch reports: ${response.status}`);
  }

  return response.json();
}
