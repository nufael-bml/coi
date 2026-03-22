import { getApiBaseUrl } from "@/lib/runtime-api";

const API_BASE_URL = getApiBaseUrl();

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  actionType: "create" | "update" | "status_change" | "delete";
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  changedBy?: string;
  changeDescription?: string;
  createdAt: string;
}

export const auditLogService = {
  async getAuditLogs(
    entityType: string,
    entityId: string
  ): Promise<AuditLog[]> {
    // Map entity types to proper endpoint format
    const entityTypeMap: Record<string, string> = {
      project: "projects",
      sub_task: "subtasks",
      subtask: "subtasks",
      change_request: "change-requests",
      change_request_sub_task: "change-request-subtasks",
      reporting_portal: "reporting-portals",
      reporting_portal_subtask: "reporting-portal-subtasks",
    };

    const endpoint = entityTypeMap[entityType] || entityType;

    const response = await fetch(
      `${API_BASE_URL}/${endpoint}/${entityId}/audit-logs`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch audit logs");
    }

    return response.json();
  },

  async createAuditLog(
    log: Omit<AuditLog, "id" | "createdAt">
  ): Promise<AuditLog> {
    const response = await fetch(`${API_BASE_URL}/audit-logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(log),
    });

    if (!response.ok) {
      throw new Error("Failed to create audit log");
    }

    return response.json();
  },
};
