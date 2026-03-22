import { getApiBaseUrl } from "@/lib/runtime-api";

const API_BASE_URL = getApiBaseUrl();

export interface TestCase {
  id: string;
  projectId: string;
  testCaseNumber: string;
  testScenario: string;
  expectedResult: string;
  designedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestCaseRequest {
  testCaseNumber: string;
  testScenario: string;
  expectedResult: string;
  designedBy?: string;
}

export interface UpdateTestCaseRequest {
  testCaseNumber: string;
  testScenario: string;
  expectedResult: string;
  designedBy?: string;
}

/**
 * Get all test cases for a project or other entity
 */
export async function getTestCases(
  entityId: string,
  requestType?: string
): Promise<TestCase[]> {
  // Determine the endpoint based on request type
  let endpoint = `${API_BASE_URL}/projects/${entityId}/test-cases`;

  if (
    requestType === "reporting-portal" ||
    requestType === "Reporting Portal"
  ) {
    endpoint = `${API_BASE_URL}/reporting-portals/${entityId}/test-cases`;
  } else if (
    requestType === "reporting-portal-subtask" ||
    requestType === "reporting-portal-sub-task" ||
    requestType === "Reporting Portal Sub-Task"
  ) {
    endpoint = `${API_BASE_URL}/reporting-portal-subtasks/${entityId}/test-cases`;
  } else if (requestType === "project-subtask") {
    endpoint = `${API_BASE_URL}/subtasks/${entityId}/test-cases`;
  } else if (requestType === "change-request") {
    endpoint = `${API_BASE_URL}/change-requests/${entityId}/test-cases`;
  } else if (requestType === "change-request-subtask") {
    endpoint = `${API_BASE_URL}/change-request-subtasks/${entityId}/test-cases`;
  }

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch test cases: ${response.statusText}`);
  }

  const data = await response.json();
  return data || [];
}

/**
 * Create a new test case
 */
export async function createTestCase(
  entityId: string,
  testCase: CreateTestCaseRequest,
  requestType?: string
): Promise<TestCase> {
  // Determine the endpoint based on request type
  let endpoint = `${API_BASE_URL}/projects/${entityId}/test-cases`;

  if (
    requestType === "reporting-portal" ||
    requestType === "Reporting Portal"
  ) {
    endpoint = `${API_BASE_URL}/reporting-portals/${entityId}/test-cases`;
  } else if (
    requestType === "reporting-portal-subtask" ||
    requestType === "reporting-portal-sub-task" ||
    requestType === "Reporting Portal Sub-Task"
  ) {
    endpoint = `${API_BASE_URL}/reporting-portal-subtasks/${entityId}/test-cases`;
  } else if (requestType === "project-subtask") {
    endpoint = `${API_BASE_URL}/subtasks/${entityId}/test-cases`;
  } else if (requestType === "change-request") {
    endpoint = `${API_BASE_URL}/change-requests/${entityId}/test-cases`;
  } else if (requestType === "change-request-subtask") {
    endpoint = `${API_BASE_URL}/change-request-subtasks/${entityId}/test-cases`;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(testCase),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create test case");
  }

  return response.json();
}

/**
 * Update an existing test case
 */
export async function updateTestCase(
  entityId: string,
  testCaseId: string,
  testCase: UpdateTestCaseRequest,
  requestType?: string
): Promise<TestCase> {
  // Determine the endpoint based on request type
  let endpoint = `${API_BASE_URL}/projects/${entityId}/test-cases/${testCaseId}`;

  if (
    requestType === "reporting-portal" ||
    requestType === "Reporting Portal"
  ) {
    endpoint = `${API_BASE_URL}/reporting-portals/${entityId}/test-cases/${testCaseId}`;
  } else if (
    requestType === "reporting-portal-subtask" ||
    requestType === "reporting-portal-sub-task" ||
    requestType === "Reporting Portal Sub-Task"
  ) {
    endpoint = `${API_BASE_URL}/reporting-portal-subtasks/${entityId}/test-cases/${testCaseId}`;
  } else if (requestType === "project-subtask") {
    endpoint = `${API_BASE_URL}/subtasks/${entityId}/test-cases/${testCaseId}`;
  } else if (requestType === "change-request") {
    endpoint = `${API_BASE_URL}/change-requests/${entityId}/test-cases/${testCaseId}`;
  } else if (requestType === "change-request-subtask") {
    endpoint = `${API_BASE_URL}/change-request-subtasks/${entityId}/test-cases/${testCaseId}`;
  }

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(testCase),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update test case");
  }

  return response.json();
}

/**
 * Delete a test case
 */
export async function deleteTestCase(
  entityId: string,
  testCaseId: string,
  requestType?: string
): Promise<void> {
  // Determine the endpoint based on request type
  let endpoint = `${API_BASE_URL}/projects/${entityId}/test-cases/${testCaseId}`;

  if (
    requestType === "reporting-portal" ||
    requestType === "Reporting Portal"
  ) {
    endpoint = `${API_BASE_URL}/reporting-portals/${entityId}/test-cases/${testCaseId}`;
  } else if (
    requestType === "reporting-portal-subtask" ||
    requestType === "reporting-portal-sub-task" ||
    requestType === "Reporting Portal Sub-Task"
  ) {
    endpoint = `${API_BASE_URL}/reporting-portal-subtasks/${entityId}/test-cases/${testCaseId}`;
  } else if (requestType === "project-subtask") {
    endpoint = `${API_BASE_URL}/subtasks/${entityId}/test-cases/${testCaseId}`;
  } else if (requestType === "change-request") {
    endpoint = `${API_BASE_URL}/change-requests/${entityId}/test-cases/${testCaseId}`;
  } else if (requestType === "change-request-subtask") {
    endpoint = `${API_BASE_URL}/change-request-subtasks/${entityId}/test-cases/${testCaseId}`;
  }

  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete test case");
  }
}

/**
 * Batch save test cases (replace all test cases for a project)
 * This is useful when saving the entire test case list at once
 */
export async function batchSaveTestCases(
  entityId: string,
  testCases: CreateTestCaseRequest[],
  requestType?: string
): Promise<TestCase[]> {
  // Determine the endpoint based on request type
  let endpoint = `${API_BASE_URL}/projects/${entityId}/test-cases/batch`;

  if (
    requestType === "reporting-portal" ||
    requestType === "Reporting Portal"
  ) {
    endpoint = `${API_BASE_URL}/reporting-portals/${entityId}/test-cases/batch`;
  } else if (
    requestType === "reporting-portal-subtask" ||
    requestType === "reporting-portal-sub-task" ||
    requestType === "Reporting Portal Sub-Task"
  ) {
    endpoint = `${API_BASE_URL}/reporting-portal-subtasks/${entityId}/test-cases/batch`;
  } else if (requestType === "project-subtask") {
    endpoint = `${API_BASE_URL}/subtasks/${entityId}/test-cases/batch`;
  } else if (requestType === "change-request") {
    endpoint = `${API_BASE_URL}/change-requests/${entityId}/test-cases/batch`;
  } else if (requestType === "change-request-subtask") {
    endpoint = `${API_BASE_URL}/change-request-subtasks/${entityId}/test-cases/batch`;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(testCases),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to save test cases");
  }

  return response.json();
}
