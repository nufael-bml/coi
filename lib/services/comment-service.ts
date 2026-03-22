import { getApiBaseUrl } from "@/lib/runtime-api";

const API_BASE_URL = getApiBaseUrl();

export interface ProjectComment {
  id: string;
  project_id: string;
  comment_text: string;
  status_from: string;
  status_to: string;
  action_type: "approve" | "reject";
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentRequest {
  comment_text: string;
  status_from: string;
  status_to: string;
  action_type: "approve" | "reject";
  created_by?: string;
}

export const commentService = {
  /**
   * Create a new comment for a project or subtask
   */
  async createComment(
    projectId: string,
    data: CreateCommentRequest,
    requestType?: string
  ): Promise<ProjectComment> {
    console.log("[commentService.createComment] requestType:", requestType);

    // Determine endpoint based on request type
    const isSubtask =
      requestType === "project-subtask" || requestType === "Project Subtask";
    const isChangeRequestSubtask =
      requestType === "change-request-subtask" ||
      requestType === "Change Request Sub-Task";
    const isChangeRequest =
      requestType === "change-request" || requestType === "Change Request";
    const isReportingPortalSubtask =
      requestType === "reporting-portal-subtask" ||
      requestType === "reporting-portal-sub-task" ||
      requestType === "Reporting Portal Sub-Task";
    const isReportingPortal =
      requestType === "reporting-portal" || requestType === "Reporting Portal";

    const endpoint = isSubtask
      ? `${API_BASE_URL}/subtasks/${projectId}/comments`
      : isChangeRequestSubtask
      ? `${API_BASE_URL}/change-request-subtasks/${projectId}/comments`
      : isChangeRequest
      ? `${API_BASE_URL}/change-requests/${projectId}/comments`
      : isReportingPortalSubtask
      ? `${API_BASE_URL}/reporting-portal-subtasks/${projectId}/comments`
      : isReportingPortal
      ? `${API_BASE_URL}/reporting-portals/${projectId}/comments`
      : `${API_BASE_URL}/projects/${projectId}/comments`;

    console.log("[commentService.createComment] endpoint:", endpoint);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create comment: ${errorText}`);
    }

    return response.json();
  },

  /**
   * Get all comments for a project or subtask
   */
  async getComments(
    projectId: string,
    requestType?: string
  ): Promise<ProjectComment[]> {
    // Determine endpoint based on request type
    const isSubtask =
      requestType === "project-subtask" || requestType === "Project Subtask";
    const isChangeRequestSubtask =
      requestType === "change-request-subtask" ||
      requestType === "Change Request Sub-Task";
    const isChangeRequest =
      requestType === "change-request" || requestType === "Change Request";
    const isReportingPortalSubtask =
      requestType === "reporting-portal-subtask" ||
      requestType === "reporting-portal-sub-task" ||
      requestType === "Reporting Portal Sub-Task";
    const isReportingPortal =
      requestType === "reporting-portal" || requestType === "Reporting Portal";

    const endpoint = isSubtask
      ? `${API_BASE_URL}/subtasks/${projectId}/comments`
      : isChangeRequestSubtask
      ? `${API_BASE_URL}/change-request-subtasks/${projectId}/comments`
      : isChangeRequest
      ? `${API_BASE_URL}/change-requests/${projectId}/comments`
      : isReportingPortalSubtask
      ? `${API_BASE_URL}/reporting-portal-subtasks/${projectId}/comments`
      : isReportingPortal
      ? `${API_BASE_URL}/reporting-portals/${projectId}/comments`
      : `${API_BASE_URL}/projects/${projectId}/comments`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch comments: ${errorText}`);
    }

    return response.json();
  },
};
