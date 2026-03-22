import { getApiBaseUrl } from "@/lib/runtime-api";

const API_BASE_URL = getApiBaseUrl();

export interface EffectiveSystem {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const effectiveSystemService = {
  async getEffectiveSystems(): Promise<EffectiveSystem[]> {
    const response = await fetch(`${API_BASE_URL}/effective-systems`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch effective systems");
    }

    return response.json();
  },
};
