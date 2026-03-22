import type { BRDCR } from '@/types';

import { getApiBaseUrl } from '@/lib/runtime-api';
import { getCurrentUserID } from '@/lib/actions/auth';

const API_BASE_URL = getApiBaseUrl();

export interface Project {
  id: string;
  refNo: string;
  requestTitle: string;
  requestType: string;
  priorityITSC?: string;
  category?: string;
  projectManager?: string;
  developmentTeam?: string;
  developmentAssignedTo?: string;
  effectiveSystem?: string;
  developmentType?: string;
  canaryTesting?: boolean;
  manDays?: {
    total?: number;
    crm?: number;
    t24?: number;
    cardTeam?: number;
    erp?: number;
    reporting?: number;
    qaTeam?: number;
    dbTeam?: number;
    security?: number;
    development?: number;
    ops?: number;
    networks?: number;
    digital?: number;
  };
  introduction?: string;
  impactBenefit?: string;
  justification?: string;
  brdDocumentsAttached?: string;
  referenceDocuments?: string;
  glossary?: string;
  detailedDescription?: string;
  useCases?: string;
  existingFunctionality?: string;
  currentWorkaround?: string;
  assumptionsExclusions?: string;
  nonFunctionalRequirements?: string;
  migration?: string;
  potentialCostConsideration?: string;
  testCases?: any; // JSONB
  workflowDiagram?: string;
  brdCrApprover?: string;
  changeRequestApprovedBy?: string;
  changeRequestedBy?: string;
  approvedDate?: string;
  departmentHeadEmployeeId?: string;
  orgLevelId?: string;
  scheduledStartDate?: string;
  uatDeliveryDate?: string;
  implementationLiveDate?: string;
  dppqaImplementationDeadline?: string;
  impactScoring?: any; // JSONB
  additionalComments?: string;
  versionHistory?: any; // JSONB
  status: string;
  isDraft: boolean;
  owner?: string;
  previousStatusBeforeHold?: string;
  holdReason?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
  projectId?: string; // For subtasks - the parent project ID
  parentProject?: string; // For subtasks - parent project reference number
  parentType?: string; // For reporting portal subtasks - parent type: 'project' or 'change_request'
  parentId?: string; // For reporting portal subtasks - parent UUID
  changeRequestId?: string; // For change request subtasks - parent change request ID
  // Reporting Request Flag
  isReportingRequest?: boolean;
  // Reporting Portal fields
  reportingEndUser?: string;
  reportingPurpose?: string;
  reportFrequency?: string;
  dataOwners?: Record<string, boolean>;
  dataSecurity?: Record<string, boolean>;
  userGroupsAccess?: string[];
  dataDefinitionsRules?: string;
  requiredAttachments?: Record<string, boolean>;
  implementationIds?: string[];
}

export interface ProjectFormData {
  refNo: string;
  requestTitle: string;
  requestType: string;
  parentProject?: string; // Parent project number for sub-tasks
  parentType?: string; // For reporting portal subtasks: "project" or "change_request"
  parentId?: string; // For reporting portal subtasks: UUID of parent
  priorityITSC?: string;
  category?: string;
  projectManager?: string;
  developmentTeam?: Array<{
    employeeId: string;
    employeeName: string;
    employeeEmail?: string;
  }>; // Changed to array of employee objects
  developmentAssignedTo?: string[]; // Array of team IDs
  effectiveSystem?: string;
  developmentType?: string;
  canaryTesting?: boolean;
  manDays?: {
    total?: number;
    crm?: number;
    t24?: number;
    cardTeam?: number;
    erp?: number;
    reporting?: number;
    qaTeam?: number;
    dbTeam?: number;
    security?: number;
    development?: number;
    ops?: number;
    networks?: number;
    digital?: number;
  };
  introduction?: string;
  impactBenefit?: string;
  justification?: string;
  brdDocumentsAttached?: string;
  referenceDocuments?: string;
  glossary?: string;
  detailedDescription?: string;
  useCases?: string;
  existingFunctionality?: string;
  currentWorkaround?: string;
  assumptionsExclusions?: string;
  nonFunctionalRequirements?: string;
  migration?: string;
  potentialCostConsideration?: string;
  testCases?: Array<{
    testCaseNumber: string;
    testScenario: string;
    expectedResult: string;
    designedBy: string;
  }>;
  workflowDiagram?: string;
  brdCrApprover?: string;
  changeRequestApprovedBy?: string;
  changeRequestedBy?: string;
  approvedDate?: string;
  departmentHeadEmployeeId?: string;
  scheduledStartDate?: string;
  uatDeliveryDate?: string;
  implementationLiveDate?: string;
  impactScoring?: {
    regulatoryNeed?: string;
    costSaving?: string;
    customerImprovement?: string;
    infrastructureEnhancement?: string;
    strategyAlignment?: string;
  };
  additionalComments?: string;
  versionHistory?: Array<{
    versionNumber: string;
    user: string;
    changesMade: string;
    date: string;
  }>;
  isDraft: boolean;
  owner?: string;
  // Reporting Request Flag
  isReportingRequest?: boolean;
  // Reporting Portal fields
  reportingEndUser?: string;
  reportingPurpose?: string;
  reportFrequency?: string;
  dataOwners?: Record<string, boolean>;
  dataSecurity?: Record<string, boolean>;
  userGroupsAccess?: string[];
  dataDefinitionsRules?: string;
  requiredAttachments?: Record<string, boolean>;
}

export const projectService = {
  // Create a new project or subtask
  async createProject(data: ProjectFormData): Promise<Project> {
    const userId = await getCurrentUserID();
    console.log('Project service - Creating project with data:', data);
    console.log('Project service - Request type:', data.requestType);
    console.log('Project service - Parent project:', data.parentProject);
    console.log('Project service - Development team:', data.developmentTeam);

    // Determine the entity type
    const isReportingPortal = data.requestType === 'Reporting Portal';

    const isReportingPortalSubtask =
      data.requestType === 'Reporting Portal Sub-Task' ||
      data.requestType === 'reporting-portal-subtask' ||
      data.requestType === 'reporting-portal-sub-task' ||
      (!!data.parentType && !!data.parentId); // Also detect by presence of parentType and parentId

    const isSubtask =
      data.requestType === 'Project Subtask' ||
      (!!data.parentProject &&
        data.requestType !== 'Change Request' &&
        data.requestType !== 'Change Request Subtask' &&
        data.requestType !== 'Reporting Portal' &&
        data.requestType !== 'Reporting Portal Sub-Task' &&
        !isReportingPortalSubtask); // Exclude reporting portal subtasks

    const isChangeRequest = data.requestType === 'Change Request';

    const isChangeRequestSubtask = data.requestType === 'Change Request Subtask';

    console.log('Project service - Is reporting portal:', isReportingPortal);
    console.log('Project service - Is reporting portal subtask:', isReportingPortalSubtask);
    console.log('Project service - Parent type:', data.parentType);
    console.log('Project service - Parent ID:', data.parentId);
    console.log('Project service - Is subtask:', isSubtask);
    console.log('Project service - Is change request:', isChangeRequest);
    console.log('Project service - Is change request subtask:', isChangeRequestSubtask);

    let endpoint = `${API_BASE_URL}/projects`;
    let payload: any = { ...data };

    if (isReportingPortal) {
      // For reporting portals, route to reporting-portals endpoint
      endpoint = `${API_BASE_URL}/reporting-portals`;
    } else if (isReportingPortalSubtask) {
      // For reporting portal subtasks, route to reporting-portal-subtasks endpoint
      endpoint = `${API_BASE_URL}/reporting-portal-subtasks`;
      // Ensure parentType and parentId are included in payload
      console.log(
        'Creating reporting portal subtask with parentType:',
        data.parentType,
        'parentId:',
        data.parentId
      );
    } else if (isSubtask) {
      // For subtasks, we need to convert parentProject to projectId
      endpoint = `${API_BASE_URL}/subtasks`;

      // If parentProject is provided, we need to fetch the project to get its ID
      if (data.parentProject) {
        // Fetch all projects to find the one with matching refNo
        const projects = await this.getProjects();
        const parentProject = projects.find((p) => p.refNo === data.parentProject);

        if (!parentProject) {
          throw new Error(`Parent project ${data.parentProject} not found`);
        }

        // Replace parentProject with projectId in the payload
        payload = {
          ...data,
          projectId: parentProject.id,
        };
        delete payload.parentProject;
      }
    } else if (isChangeRequest) {
      // For change requests, route to change-requests endpoint
      endpoint = `${API_BASE_URL}/change-requests`;

      // If parentProject is provided, we need to convert it to projectId
      if (data.parentProject) {
        const projects = await this.getProjects();
        const parentProject = projects.find((p) => p.refNo === data.parentProject);

        if (parentProject) {
          payload = {
            ...data,
            projectId: parentProject.id,
          };
          delete payload.parentProject;
        }
      }
    } else if (isChangeRequestSubtask) {
      // For change request subtasks, route to change-request-subtasks endpoint
      endpoint = `${API_BASE_URL}/change-request-subtasks`;

      // Parent is required for change request subtasks
      if (data.parentProject) {
        const projects = await this.getProjects();
        const parentChangeRequest = projects.find((p) => p.refNo === data.parentProject);

        if (!parentChangeRequest) {
          throw new Error(`Parent change request ${data.parentProject} not found`);
        }

        // Replace parentProject with changeRequestId in the payload
        payload = {
          ...data,
          changeRequestId: parentChangeRequest.id,
        };
        delete payload.parentProject;
      }
    }

    console.log('Project service - Final endpoint:', endpoint);
    console.log('Project service - Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...payload, changedBy: userId || '' }),
    });

    console.log('Project service - Response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to create ${isSubtask ? 'subtask' : 'project'}`);
    }

    return response.json();
  },

  // Get all projects, subtasks, and change requests
  async getProjects(orgLevelId?: string): Promise<Project[]> {
    // Build query params
    const queryParams = orgLevelId ? `?org_level_id=${encodeURIComponent(orgLevelId)}` : '';

    // Fetch projects, subtasks, change requests, change request subtasks, reporting portals, and reporting portal subtasks in parallel
    const [
      projectsResponse,
      subtasksResponse,
      changeRequestsResponse,
      changeRequestSubtasksResponse,
      reportingPortalsResponse,
      reportingPortalSubtasksResponse,
    ] = await Promise.all([
      fetch(`${API_BASE_URL}/projects${queryParams}`),
      fetch(`${API_BASE_URL}/subtasks${queryParams}`),
      fetch(`${API_BASE_URL}/change-requests${queryParams}`),
      fetch(`${API_BASE_URL}/change-request-subtasks${queryParams}`),
      fetch(`${API_BASE_URL}/reporting-portals${queryParams}`),
      fetch(`${API_BASE_URL}/reporting-portal-subtasks${queryParams}`),
    ]);

    if (!projectsResponse.ok) {
      const error = await projectsResponse.json();
      throw new Error(error.error || 'Failed to fetch projects');
    }

    if (!subtasksResponse.ok) {
      const error = await subtasksResponse.json();
      throw new Error(error.error || 'Failed to fetch subtasks');
    }

    if (!changeRequestsResponse.ok) {
      const error = await changeRequestsResponse.json();
      throw new Error(error.error || 'Failed to fetch change requests');
    }

    if (!changeRequestSubtasksResponse.ok) {
      const error = await changeRequestSubtasksResponse.json();
      throw new Error(error.error || 'Failed to fetch change request subtasks');
    }

    if (!reportingPortalsResponse.ok) {
      const error = await reportingPortalsResponse.json();
      throw new Error(error.error || 'Failed to fetch reporting portals');
    }

    if (!reportingPortalSubtasksResponse.ok) {
      const error = await reportingPortalSubtasksResponse.json();
      throw new Error(error.error || 'Failed to fetch reporting portal subtasks');
    }

    const projects = await projectsResponse.json();
    const subtasks = await subtasksResponse.json();
    const changeRequests = await changeRequestsResponse.json();
    const changeRequestSubtasks = await changeRequestSubtasksResponse.json();
    const reportingPortals = await reportingPortalsResponse.json();
    const reportingPortalSubtasks = await reportingPortalSubtasksResponse.json();

    // Combine all six arrays (ensure each is an array)
    return [
      ...(Array.isArray(projects) ? projects : []),
      ...(Array.isArray(subtasks) ? subtasks : []),
      ...(Array.isArray(changeRequests) ? changeRequests : []),
      ...(Array.isArray(changeRequestSubtasks) ? changeRequestSubtasks : []),
      ...(Array.isArray(reportingPortals) ? reportingPortals : []),
      ...(Array.isArray(reportingPortalSubtasks) ? reportingPortalSubtasks : []),
    ];
  },

  // Get a single project, subtask, or change request by ID
  async getProject(id: string): Promise<Project> {
    // Try to fetch as project first
    let response = await fetch(`${API_BASE_URL}/projects/${id}`);

    if (!response.ok) {
      // If not found as project, try as subtask
      response = await fetch(`${API_BASE_URL}/subtasks/${id}`);

      if (!response.ok) {
        // If not found as subtask, try as change request
        response = await fetch(`${API_BASE_URL}/change-requests/${id}`);

        if (!response.ok) {
          // If not found as change request, try as change request subtask
          response = await fetch(`${API_BASE_URL}/change-request-subtasks/${id}`);

          if (!response.ok) {
            // If not found as change request subtask, try as reporting portal
            response = await fetch(`${API_BASE_URL}/reporting-portals/${id}`);

            if (!response.ok) {
              // If not found as reporting portal, try as reporting portal subtask
              response = await fetch(`${API_BASE_URL}/reporting-portal-subtasks/${id}`);

              if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch project');
              }
            }
          }
        }
      }
    }

    const project = await response.json();
    // Debug log removed: API response suppressed to avoid leaking data to console
    return project;
  },

  // Update a project, subtask, or change request
  async updateProject(id: string, data: ProjectFormData, requestType?: string): Promise<void> {
    const userId = await getCurrentUserID();
    // Determine the entity type
    const isReportingPortal =
      requestType === 'reporting-portal' ||
      data.requestType === 'Reporting Portal' ||
      data.requestType === 'reporting-portal';

    const isReportingPortalSubtask =
      requestType === 'reporting-portal-subtask' ||
      data.requestType === 'Reporting Portal Sub-Task' ||
      data.requestType === 'reporting-portal-subtask';

    const isSubtask =
      requestType === 'project-subtask' ||
      data.requestType === 'Project Subtask' ||
      data.requestType === 'project-subtask' ||
      (!!data.parentProject &&
        data.requestType !== 'Change Request' &&
        data.requestType !== 'Change Request Subtask' &&
        data.requestType !== 'Reporting Portal');

    const isChangeRequest =
      requestType === 'change-request' ||
      data.requestType === 'Change Request' ||
      data.requestType === 'change-request';

    const isChangeRequestSubtask =
      requestType === 'change-request-subtask' ||
      data.requestType === 'Change Request Subtask' ||
      data.requestType === 'change-request-subtask';

    let endpoint = `${API_BASE_URL}/projects/${id}`;
    let payload: any = { ...data };

    if (isChangeRequestSubtask) {
      endpoint = `${API_BASE_URL}/change-request-subtasks/${id}`;

      // If parentProject is provided, we need to convert it to changeRequestId
      if (data.parentProject) {
        const projects = await this.getProjects();
        const parentChangeRequest = projects.find((p) => p.refNo === data.parentProject);

        if (!parentChangeRequest) {
          throw new Error(`Parent change request ${data.parentProject} not found`);
        }

        payload = {
          ...data,
          changeRequestId: parentChangeRequest.id,
        };
        delete payload.parentProject;
      }
    } else if (isSubtask) {
      endpoint = `${API_BASE_URL}/subtasks/${id}`;

      // If parentProject is provided, we need to convert it to projectId
      if (data.parentProject) {
        const projects = await this.getProjects();
        const parentProject = projects.find((p) => p.refNo === data.parentProject);

        if (!parentProject) {
          throw new Error(`Parent project ${data.parentProject} not found`);
        }

        payload = {
          ...data,
          projectId: parentProject.id,
        };
        delete payload.parentProject;
      }
    } else if (isChangeRequest) {
      endpoint = `${API_BASE_URL}/change-requests/${id}`;

      // If parentProject is provided, we need to convert it to projectId
      if (data.parentProject) {
        const projects = await this.getProjects();
        const parentProject = projects.find((p) => p.refNo === data.parentProject);

        if (parentProject) {
          payload = {
            ...data,
            projectId: parentProject.id,
          };
          delete payload.parentProject;
        }
      }
    } else if (isReportingPortal) {
      endpoint = `${API_BASE_URL}/reporting-portals/${id}`;
    } else if (isReportingPortalSubtask) {
      endpoint = `${API_BASE_URL}/reporting-portal-subtasks/${id}`;
    }

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...payload, changedBy: userId || '' }),
    });

    if (!response.ok) {
      const error = await response.json();
      const entityType = isReportingPortal
        ? 'reporting portal'
        : isReportingPortalSubtask
        ? 'reporting portal subtask'
        : isChangeRequestSubtask
        ? 'change request subtask'
        : isChangeRequest
        ? 'change request'
        : isSubtask
        ? 'subtask'
        : 'project';
      throw new Error(error.error || `Failed to update ${entityType}`);
    }
  },

  // Update project, subtask, or change request status
  async updateStatus(
    id: string,
    status: string,
    requestType?: string,
    approvedBy?: string
  ): Promise<{ status: string; message: string }> {
    const userId = await getCurrentUserID();
    // Determine the entity type
    const isReportingPortal =
      requestType === 'reporting-portal' || requestType === 'Reporting Portal';
    const isReportingPortalSubtask =
      requestType === 'reporting-portal-subtask' ||
      requestType === 'reporting-portal-sub-task' ||
      requestType === 'Reporting Portal Sub-Task';
    const isSubtask = requestType === 'project-subtask' || requestType === 'Project Subtask';
    const isChangeRequest = requestType === 'change-request' || requestType === 'Change Request';
    const isChangeRequestSubtask =
      requestType === 'change-request-subtask' || requestType === 'Change Request Subtask';

    const endpoint = isReportingPortal
      ? `${API_BASE_URL}/reporting-portals/${id}/status`
      : isReportingPortalSubtask
      ? `${API_BASE_URL}/reporting-portal-subtasks/${id}/status`
      : isChangeRequest
      ? `${API_BASE_URL}/change-requests/${id}/status`
      : isChangeRequestSubtask
      ? `${API_BASE_URL}/change-request-subtasks/${id}/status`
      : isSubtask
      ? `${API_BASE_URL}/subtasks/${id}/status`
      : `${API_BASE_URL}/projects/${id}/status`;

    const body: any = { status, changedBy: userId || '' };
    if (approvedBy) {
      // Use camelCase for reporting portal and reporting portal subtask, snake_case for others
      if (isReportingPortal || isReportingPortalSubtask) {
        body.approvedBy = approvedBy;
      } else {
        body.approved_by = approvedBy;
      }
    }

    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error ||
          `Failed to update ${
            isChangeRequestSubtask ? 'change request subtask' : isSubtask ? 'subtask' : 'project'
          } status`
      );
    }

    const result = await response.json();
    return result;
  },

  // Request to hold a project (requires approval)
  async requestHold(id: string, reason: string, requestType?: string): Promise<void> {
    const userId = await getCurrentUserID();
    // Determine endpoint based on request type
    let endpoint = `${API_BASE_URL}/projects/${id}/hold`;
    if (requestType === 'reporting-portal' || requestType === 'Reporting Portal') {
      endpoint = `${API_BASE_URL}/reporting-portals/${id}/hold`;
    } else if (
      requestType === 'reporting-portal-subtask' ||
      requestType === 'reporting-portal-sub-task' ||
      requestType === 'Reporting Portal Sub-Task'
    ) {
      endpoint = `${API_BASE_URL}/reporting-portal-subtasks/${id}/hold`;
    } else if (requestType === 'project-subtask' || requestType === 'Project Subtask') {
      endpoint = `${API_BASE_URL}/subtasks/${id}/hold`;
    } else if (
      requestType === 'change-request-subtask' ||
      requestType === 'Change Request Subtask'
    ) {
      endpoint = `${API_BASE_URL}/change-request-subtasks/${id}/hold`;
    } else if (requestType === 'change-request' || requestType === 'Change Request') {
      endpoint = `${API_BASE_URL}/change-requests/${id}/hold`;
    }

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason, changedBy: userId || '' }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to request project hold');
    }
  },

  // Approve a hold request
  async approveHold(id: string, requestType?: string): Promise<void> {
    const userId = await getCurrentUserID();
    // Determine endpoint based on request type
    let endpoint = `${API_BASE_URL}/projects/${id}/hold/approve`;
    if (requestType === 'reporting-portal' || requestType === 'Reporting Portal') {
      endpoint = `${API_BASE_URL}/reporting-portals/${id}/hold/approve`;
    } else if (
      requestType === 'reporting-portal-subtask' ||
      requestType === 'reporting-portal-sub-task' ||
      requestType === 'Reporting Portal Sub-Task'
    ) {
      endpoint = `${API_BASE_URL}/reporting-portal-subtasks/${id}/hold/approve`;
    } else if (requestType === 'project-subtask' || requestType === 'Project Subtask') {
      endpoint = `${API_BASE_URL}/subtasks/${id}/hold/approve`;
    } else if (
      requestType === 'change-request-subtask' ||
      requestType === 'Change Request Subtask'
    ) {
      endpoint = `${API_BASE_URL}/change-request-subtasks/${id}/hold/approve`;
    } else if (requestType === 'change-request' || requestType === 'Change Request') {
      endpoint = `${API_BASE_URL}/change-requests/${id}/hold/approve`;
    }

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ changedBy: userId || '' }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to approve hold request');
    }
  },

  // Resume a project from hold
  async resumeProject(id: string, requestType?: string): Promise<void> {
    const userId = await getCurrentUserID();
    // Determine endpoint based on request type
    let endpoint = `${API_BASE_URL}/projects/${id}/resume`;
    if (requestType === 'reporting-portal' || requestType === 'Reporting Portal') {
      endpoint = `${API_BASE_URL}/reporting-portals/${id}/resume`;
    } else if (
      requestType === 'reporting-portal-subtask' ||
      requestType === 'reporting-portal-sub-task' ||
      requestType === 'Reporting Portal Sub-Task'
    ) {
      endpoint = `${API_BASE_URL}/reporting-portal-subtasks/${id}/resume`;
    } else if (requestType === 'project-subtask' || requestType === 'Project Subtask') {
      endpoint = `${API_BASE_URL}/subtasks/${id}/resume`;
    } else if (
      requestType === 'change-request-subtask' ||
      requestType === 'Change Request Subtask'
    ) {
      endpoint = `${API_BASE_URL}/change-request-subtasks/${id}/resume`;
    } else if (requestType === 'change-request' || requestType === 'Change Request') {
      endpoint = `${API_BASE_URL}/change-requests/${id}/resume`;
    }

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ changedBy: userId || '' }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to resume project');
    }
  },

  // Reject a pending hold or cancellation request
  async rejectPendingRequest(id: string, requestType?: string): Promise<void> {
    const userId = await getCurrentUserID();
    // Determine endpoint based on request type
    let endpoint = `${API_BASE_URL}/projects/${id}/reject`;
    if (requestType === 'reporting-portal' || requestType === 'Reporting Portal') {
      endpoint = `${API_BASE_URL}/reporting-portals/${id}/reject`;
    } else if (
      requestType === 'reporting-portal-subtask' ||
      requestType === 'reporting-portal-sub-task' ||
      requestType === 'Reporting Portal Sub-Task'
    ) {
      endpoint = `${API_BASE_URL}/reporting-portal-subtasks/${id}/reject`;
    } else if (requestType === 'project-subtask' || requestType === 'Project Subtask') {
      endpoint = `${API_BASE_URL}/subtasks/${id}/reject`;
    } else if (
      requestType === 'change-request-subtask' ||
      requestType === 'Change Request Subtask'
    ) {
      endpoint = `${API_BASE_URL}/change-request-subtasks/${id}/reject`;
    } else if (requestType === 'change-request' || requestType === 'Change Request') {
      endpoint = `${API_BASE_URL}/change-requests/${id}/reject`;
    }

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ changedBy: userId || '' }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reject request');
    }
  },

  // Request to cancel a project (requires approval)
  async requestCancel(id: string, reason: string, requestType?: string): Promise<void> {
    const userId = await getCurrentUserID();
    // Determine endpoint based on request type
    let endpoint = `${API_BASE_URL}/projects/${id}/cancel`;
    if (requestType === 'reporting-portal' || requestType === 'Reporting Portal') {
      endpoint = `${API_BASE_URL}/reporting-portals/${id}/cancel`;
    } else if (
      requestType === 'reporting-portal-subtask' ||
      requestType === 'reporting-portal-sub-task' ||
      requestType === 'Reporting Portal Sub-Task'
    ) {
      endpoint = `${API_BASE_URL}/reporting-portal-subtasks/${id}/cancel`;
    } else if (requestType === 'project-subtask' || requestType === 'Project Subtask') {
      endpoint = `${API_BASE_URL}/subtasks/${id}/cancel`;
    } else if (
      requestType === 'change-request-subtask' ||
      requestType === 'Change Request Subtask'
    ) {
      endpoint = `${API_BASE_URL}/change-request-subtasks/${id}/cancel`;
    } else if (requestType === 'change-request' || requestType === 'Change Request') {
      endpoint = `${API_BASE_URL}/change-requests/${id}/cancel`;
    }

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason, changedBy: userId || '' }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to request cancellation');
    }
  },

  // Approve a cancellation request
  async approveCancel(id: string, requestType?: string): Promise<void> {
    const userId = await getCurrentUserID();
    // Determine endpoint based on request type
    let endpoint = `${API_BASE_URL}/projects/${id}/cancel/approve`;
    if (requestType === 'reporting-portal' || requestType === 'Reporting Portal') {
      endpoint = `${API_BASE_URL}/reporting-portals/${id}/cancel/approve`;
    } else if (
      requestType === 'reporting-portal-subtask' ||
      requestType === 'reporting-portal-sub-task' ||
      requestType === 'Reporting Portal Sub-Task'
    ) {
      endpoint = `${API_BASE_URL}/reporting-portal-subtasks/${id}/cancel/approve`;
    } else if (requestType === 'project-subtask' || requestType === 'Project Subtask') {
      endpoint = `${API_BASE_URL}/subtasks/${id}/cancel/approve`;
    } else if (
      requestType === 'change-request-subtask' ||
      requestType === 'Change Request Subtask'
    ) {
      endpoint = `${API_BASE_URL}/change-request-subtasks/${id}/cancel/approve`;
    } else if (requestType === 'change-request' || requestType === 'Change Request') {
      endpoint = `${API_BASE_URL}/change-requests/${id}/cancel/approve`;
    }

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ changedBy: userId || '' }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to approve cancellation');
    }
  },

  // Delete a project
  async deleteProject(id: string): Promise<void> {
    // Try to delete as project first
    let response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      // If not found as project, try as subtask
      response = await fetch(`${API_BASE_URL}/subtasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // If not found as subtask, try as change request
        response = await fetch(`${API_BASE_URL}/change-requests/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          // If not found as change request, try as change request subtask
          response = await fetch(`${API_BASE_URL}/change-request-subtasks/${id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            // If not found as change request subtask, try as reporting portal
            response = await fetch(`${API_BASE_URL}/reporting-portals/${id}`, {
              method: 'DELETE',
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || 'Failed to delete project');
            }
          }
        }
      }
    }
  },
};
