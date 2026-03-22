import type {
  WorkflowConfig,
  WorkflowStep,
  RequestType,
} from "@/app/(dashboard)/admin/settings/configuration/types";

import { getApiBaseUrl } from "@/lib/runtime-api";

const API_BASE_URL = getApiBaseUrl();

export interface WorkflowTransition {
  id: string;
  entityType: string;
  fromStatus: string;
  toStatusApprove?: string;
  toStatusReject?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getWorkflowTransitionsFromDB(
  entityType: string = "project"
): Promise<WorkflowTransition[]> {
  // Map frontend entity types to database entity types
  const entityTypeMap: Record<string, string> = {
    project: "project",
    "project-subtask": "subtask",
    "change-request": "change_request",
    "change-request-subtask": "change_request_sub_task",
    "reporting-portal": "reporting_portal",
    "reporting-portal-subtask": "reporting_portal_subtask",
    "reporting-portal-sub-task": "reporting_portal_subtask",
  };

  const dbEntityType = entityTypeMap[entityType] || entityType;

  const response = await fetch(
    `${API_BASE_URL}/workflows?type=${dbEntityType}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch workflow transitions");
  }

  return response.json();
}

export async function getWorkflowForRequestType(
  requestType: RequestType
): Promise<WorkflowStep[]> {
  try {
    const response = await fetch("/api/workflows");
    if (response.ok) {
      const workflows: WorkflowConfig | null = await response.json();
      if (workflows && workflows[requestType]) {
        return workflows[requestType];
      }
    }
  } catch (error) {
    console.error("Error fetching workflow:", error);
  }

  // Return default first step if workflow not found
  return [
    {
      id: "1",
      status: "Pending Approval by Business Team",
      approve: "Pending Approval by Product Owner",
      reject: "Cancelled",
      pageApprove: "Pending",
      pageReject: "Cancelled",
    },
  ];
}

export function getInitialStatus(workflow: WorkflowStep[]): string {
  return workflow.length > 0 ? workflow[0].status : "Pending Approval";
}

export function getNextStatus(
  currentStatus: string,
  action: "approve" | "reject",
  workflow: WorkflowStep[]
): { status: string; page: string } | null {
  const currentStep = workflow.find((step) => step.status === currentStatus);

  if (!currentStep) return null;

  if (action === "approve") {
    return {
      status: currentStep.approve,
      page: currentStep.pageApprove,
    };
  } else {
    return {
      status: currentStep.reject,
      page: currentStep.pageReject,
    };
  }
}

export function getCurrentStepNumber(
  currentStatus: string,
  workflow: WorkflowStep[]
): number {
  const index = workflow.findIndex((step) => step.status === currentStatus);
  return index !== -1 ? index + 1 : 1;
}

export function getTotalSteps(workflow: WorkflowStep[]): number {
  return workflow.length;
}
