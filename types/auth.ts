// ===================================
// Fixed Types - types/auth.ts
// ===================================

import type {
  Identity as KratosIdentity,
  IdentityStateEnum,
  Session,
} from "@ory/kratos-client";

export interface UserTraits {
  name: string;
  email: string;
  jobTitle?: string | null;
  employeeId?: string | null;
  jobDepartment?: string | null;
  managerId?: string | null;
  managerName?: string | null;
  microsoftID?: string | null;
  phoneNumber?: string | null;
  managerEmail?: string | null;
  userPrincipalName?: string | null;
  hasProfilePhoto?: boolean | null;
  profilePhoto?: string | null;
  is_active?: boolean | null;
  hasManager?: boolean | null;
  lastEnriched?: string | null;
  enrichment_source?: string | null;
  [key: string]: unknown;
}

export interface SecureSession extends Omit<Session, "identity"> {
  identity: Omit<KratosIdentity, "traits" | "state"> & {
    traits: UserTraits;
    state?: IdentityStateEnum;
  };
  authenticated: boolean;
}

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  jobTitle?: string;
  employeeId?: string;
  orgLevelId?: string;
  jobDepartment?: string;
  jobCategory?: string;
  managerId?: string;
  managerName?: string;
  microsoftID?: string;
  phoneNumber?: string;
  managerEmail?: string;
  userPrincipalName?: string;
  hasProfilePhoto?: boolean;
  profilePhoto?: string;
  is_active?: boolean;
  hasManager?: boolean;
  lastEnriched?: string;
  enrichment_source?: string;
}

// Simplified AuthError - remove timestamp and retryable if not using them
export type AuthError = {
  code:
    | "no_session"
    | "invalid_session"
    | "service_unavailable"
    | "timeout"
    | "network_error";
  message: string;
};

export type AuthResult<T> =
  | { success: true; data: T }
  | { success: false; error: AuthError };
