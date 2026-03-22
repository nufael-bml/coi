// Blocker Service - API client for blocker operations

import { getApiBaseUrl } from "@/lib/runtime-api";

const API_BASE_URL = getApiBaseUrl();

export interface Blocker {
  blocker_id: string;
  title: string;
  description: string;
  level: "low" | "medium" | "high" | "critical";
  status: "active" | "in_progress" | "resolved";
  created_at: string;
  in_progress_at?: string | null;
  in_progress_by?: string | null;
  resolved_at: string | null;
  blocked_type:
    | "project"
    | "subtask"
    | "change-request"
    | "change-request-subtask";
  blocked_id: string;
}

export interface BlockerWithEntity extends Blocker {
  entityRefNo: string;
  entityTitle: string;
}

export interface CreateBlockerRequest {
  title: string;
  description: string;
  level: "low" | "medium" | "high" | "critical";
}

/**
 * Convert entity type to API endpoint format
 */
function getEntityEndpoint(entityType: string): string {
  switch (entityType) {
    case "project":
      return "projects";
    case "subtask":
      return "subtasks";
    case "change-request":
      return "change-requests";
    case "change-request-subtask":
      return "change-request-subtasks";
    case "reporting-portal":
      return "reporting-portals";
    case "reporting-portal-subtask":
      return "reporting-portal-subtasks";
    default:
      return entityType;
  }
}

/**
 * Get all blockers across all entities
 */
export async function getAllBlockers(): Promise<BlockerWithEntity[]> {
  const response = await fetch(`${API_BASE_URL}/blockers`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch all blockers: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get all blockers for an entity
 */
export async function getBlockers(
  entityType: string,
  entityId: string
): Promise<Blocker[]> {
  const endpoint = getEntityEndpoint(entityType);
  const response = await fetch(
    `${API_BASE_URL}/${endpoint}/${entityId}/blockers`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch blockers: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Create a new blocker
 */
export async function createBlocker(
  entityType: string,
  entityId: string,
  blocker: CreateBlockerRequest
): Promise<Blocker> {
  const endpoint = getEntityEndpoint(entityType);
  const response = await fetch(
    `${API_BASE_URL}/${endpoint}/${entityId}/blockers`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blocker),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to create blocker: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Start progress on a blocker (set status = in_progress)
 */
export async function startBlocker(
  blockerId: string,
  by: string
): Promise<Blocker> {
  const response = await fetch(
    `${API_BASE_URL}/blockers/${blockerId}/in-progress`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ in_progress_by: by }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to start blocker: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Resolve a blocker
 */
export async function resolveBlocker(blockerId: string): Promise<Blocker> {
  const response = await fetch(
    `${API_BASE_URL}/blockers/${blockerId}/resolve`,
    {
      method: "PATCH",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to resolve blocker: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Delete a blocker
 */
export async function deleteBlocker(blockerId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/blockers/${blockerId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete blocker: ${response.statusText}`);
  }
}

export const blockerService = {
  getAllBlockers,
  getBlockers,
  createBlocker,
  startBlocker,
  resolveBlocker,
  deleteBlocker,
};
