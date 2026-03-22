import { getApiBaseUrl } from "@/lib/runtime-api";

const API_BASE_URL = getApiBaseUrl();

export interface Status {
  id: string;
  name: string;
  description?: string;
  category?: string;
  workflowOrder?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const statusService = {
  async getStatuses(): Promise<Status[]> {
    const response = await fetch(`${API_BASE_URL}/statuses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch statuses");
    }

    return response.json();
  },
};
