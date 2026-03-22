export type RequestType =
  | 'project'
  | 'project-subtask'
  | 'change-request'
  | 'change-request-subtask'
  | 'reporting-portal'
  | 'reporting-portal-subtask'
  | 'reporting-portal-sub-task';

export type BRDCR = {
  id: string;
  number: string;
  title: string;
  owner: string;
  status: string; // Dynamic status based on workflow
  requestType: RequestType;
  isDraft: boolean;
  createdAt?: string;
  updatedAt?: string;
  parentBRDCR?: string; // Parent BRDCR number if this is a sub-BRDCR
  subBRDCRs?: BRDCR[]; // Array of sub-BRDCRs (populated at runtime)
  hasBlocker?: boolean; // Whether this BRDCR has active blockers

  // Reporting Portal Fields (top-level for easier access)
  isReportingRequest?: boolean;
  reportingEndUser?: string;
  reportingPurpose?: string;
  reportFrequency?: string;
  dataOwners?: Record<string, boolean>;
  dataSecurity?: Record<string, boolean>;
  userGroupsAccess?: string[];
  dataDefinitionsRules?: string;
  requiredAttachments?: Record<string, boolean>;
  implementationIds?: string[];

  // Form data - all fields from the form
  formData?: {
    // General
    refNo?: string;
    requestType?: string;
    parentProject?: string; // Parent project number for sub-tasks
    parentType?: string; // Parent type for reporting portal subtasks: "project" or "change_request"
    parentId?: string; // Parent ID for reporting portal subtasks
    requestTitle?: string;
    priorityITSC?: string;
    category?: string; // Ad-hoc or Strategy
    projectManager?: string; // Employee ID for project manager (Project requests only)
    developmentTeam?: string[]; // Array of employee IDs
    developmentAssignedTo?: string;
    effectiveSystem?: string; // New field
    developmentType?: string; // New field
    canaryTesting?: boolean; // New field
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

    // Business Requirement
    introduction?: string;
    impactBenefit?: string;
    justification?: string;
    brdDocumentsAttached?: string;
    referenceDocuments?: string;
    glossary?: string;

    // Requirement Details
    detailedDescription?: string;
    useCases?: string;
    existingFunctionality?: string;
    currentWorkaround?: string;
    assumptionsExclusions?: string;

    // Technical / Non-Functional
    nonFunctionalRequirements?: string;
    migration?: string;
    potentialCostConsideration?: string;

    // Test Cases
    testCases?: string;

    // Workflow
    workflowDiagram?: string;

    // Approvals
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

    // Additional Info
    impactScoring?: {
      regulatoryNeed?: string;
      costSaving?: string;
      customerImprovement?: string;
      infrastructureEnhancement?: string;
      strategyAlignment?: string;
    };
    additionalComments?: string;

    // Version History
    versionHistory?: Array<{
      versionNumber: string;
      user: string;
      changesMade: string;
      date: string;
    }>;

    // Reporting Portal Fields
    reportingEndUser?: string;
    reportingPurpose?: string;
    reportFrequency?: string;
    dataOwners?: Record<string, boolean>;
    dataSecurity?: Record<string, boolean>;
    userGroupsAccess?: string[];
    dataDefinitionsRules?: string;
    requiredAttachments?: Record<string, boolean>;

    // Reporting Request Flag
    isReportingRequest?: boolean;

    // Legacy fields for backward compatibility
    priority?: string;
    relatedProject?: string;
    impactDescription?: string;
    workaround?: string;
    justificationForChange?: string;
    systemsAffected?: string;
    technicalRequirements?: string;
    securityConsiderations?: string;
    integrationPoints?: string;
    analysisEstimate?: string;
    developmentEstimate?: string;
    testingEstimate?: string;
    deploymentEstimate?: string;
    totalEstimate?: string;
    uatPlan?: string;
    uatResponsible?: string;
    uatTimeline?: string;
    acceptanceCriteria?: string;
    businessJustification?: string;
    risksAndMitigation?: string;
    dependencies?: string;
    successMetrics?: string;
    businessImpactAssessment?: string;
    weeklyActionNotes?: string;
    latestUpdate?: string;
    internalNotes?: string;
    externalNotes?: string;
    attachments?: string;
  };
};
