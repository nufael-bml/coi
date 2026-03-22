import { getApiBaseUrl } from "@/lib/runtime-api";

const API_BASE_URL = getApiBaseUrl();

export interface DecisionFromAPI {
  id: string;
  brdcrNo: string;
  brdcrTitle: string;
  commentText: string;
  statusFrom: string;
  statusTo: string;
  actionType: string;
  createdBy?: string;
  createdAt: string;
  entityType: string;
  impactScoring?: {
    regulatoryNeed?: string;
    costSaving?: string;
    customerImprovement?: string;
    infrastructureEnhancement?: string;
    strategyAlignment?: string;
  };
}

export async function getDecisions(): Promise<DecisionFromAPI[]> {
  const response = await fetch(`${API_BASE_URL}/decisions`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch decisions: ${response.statusText}`);
  }

  return response.json();
}

export const decisionService = {
  getDecisions,
};
