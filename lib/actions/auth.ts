// lib/actions/auth.ts

'use server';

// import { api } from "@/lib/core/api";
import type { UserProfile } from '@/types/auth';
import { jwtVerify } from 'jose';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { date } from 'zod';
import { cerbos } from './cerbos';

const AUTH_APP_URL = process.env.AUTH_APP_URL || 'http://localhost:3000';

export interface User {
  userId: string;
  email: string;
  name: string;
  employeeId: string;
  phone: string;
  roles: string[];
  employeeType: string;
  jobCategoryId: string;
  jobCategoryName: string;
  designationId: string;
  designationName: string;
  orgLevelId: string;
  orgLevelName: string;
  teamId: string;
  teamName: string;
  managerEmployeeId: string;
  managerName: string;
  microsoftId: string;
  hasProfilePhoto: boolean;
  lastEnriched: string;
  profilePhoto: string | null;
}

let secret: Uint8Array | null = null;

const getSecret = () => {
  if (!secret) {
    const s = process.env.OATHKEEPER_JWT_SECRET;
    if (!s) throw new Error('OATHKEEPER_JWT_SECRET missing');
    secret = Buffer.from(s, 'base64');
  }
  return secret;
};

/**
 * Extracts JWT token from Authorization header without verification
 * Used for passing tokens to external APIs
 */
const getToken = async (): Promise<string | null> => {
  const auth = (await headers()).get('authorization');
  const token =
    auth && auth.startsWith('Bearer ')
      ? auth.slice(7)
      : process.env.NODE_ENV === 'development'
      ? process.env.DEV_JWT_TOKEN
      : null;
  if (!token) return null;
  return token;
};

const verifyJWT = async (): Promise<{
  sub: string;
  attr: Record<string, any>;
} | null> => {
  const token = await getToken();
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: process.env.OATHKEEPER_ISSUER,
      algorithms: ['HS256'],
      clockTolerance: process.env.NODE_ENV === 'development' ? 999999999 : 60,
    });
    return payload as any;
  } catch (e: any) {
    if (process.env.NODE_ENV === 'development' && e?.code === 'ERR_JWT_EXPIRED') {
      console.warn('[jwt] Ignored expired JWT in dev');
      return e?.claims as any;
    }
    console.error('[jwt] Verification failed:', e);
    return null;
  }
};

const getUser = cache(async (): Promise<User | null> => {
  const payload = await verifyJWT();
  if (!payload?.attr) return null;

  const a = payload.attr;
  const user: User = {
    userId: payload.sub, // User ID is in payload.sub
    email: a.email,
    name: a.name,
    employeeId: a.employee_id,
    phone: a.phone,
    roles: Array.isArray(a.roles) ? a.roles : [],
    employeeType: a.employee_type,
    jobCategoryId: a.job_category_id,
    jobCategoryName: a.job_category_name,
    designationId: a.designation_id,
    designationName: a.designation_name,
    orgLevelId: a.org_level_id,
    orgLevelName: a.org_level_name,
    teamId: a.team_id,
    teamName: a.team_name,
    managerEmployeeId: a.manager_employee_id,
    managerName: a.manager_name,
    microsoftId: a.microsoft_id,
    hasProfilePhoto: Boolean(a.has_profile_photo),
    lastEnriched: a.last_enriched,
    profilePhoto: null,
  };

  if (user.userId) user.profilePhoto = await fetchPhoto(user.userId);
  return user;
});

const getUserId = cache(async (): Promise<string | null> => {
  const payload = await verifyJWT();
  return payload?.sub ?? null;
});

type dataReponse = {
  success: boolean;
  data?: { thumbnail?: string };
};

const fetchPhoto = async (userId: string): Promise<string | null> => {
  // try {
  //   const res = await api("oneui-core-api").get<{
  //     success: boolean;
  //     data?: { thumbnail?: string };
  //   }>(`/user/${userId}/profile/photo`);
  //   return res?.data?.data?.thumbnail ?? null;
  // } catch (e) {
  //   console.error("[jwt] Photo fetch failed:", e);
  //   return null;
  // }

  try {
    const res = await fetch(`${process.env.ONEUI_CORE_API}/user/${userId}/profile/photo`, {
      method: 'GET',
    });

    if (!res.ok) {
      console.error('[jwt] Photo fetch failed:');
      return null;
    }

    const data: dataReponse = await res.json();
    return data?.data?.thumbnail ?? null;
  } catch (e) {
    console.error('[jwt] Photo fetch failed:', e);
    return null;
  }
};

function jwtUserToProfile(user: User): UserProfile {
  return {
    userId: user.userId,
    name: user.name,
    email: user.email,
    jobTitle: user.designationName || undefined,
    employeeId: user.employeeId || undefined,
    orgLevelId: user.orgLevelId || undefined,
    jobDepartment: user.orgLevelName || undefined,
    jobCategory: user.jobCategoryName || undefined,
    managerId: user.managerEmployeeId || undefined,
    managerName: user.managerName || undefined,
    microsoftID: user.microsoftId || undefined,
    phoneNumber: user.phone || undefined,
    userPrincipalName: user.email,
    hasProfilePhoto: user.hasProfilePhoto,
    profilePhoto: user.profilePhoto ?? undefined,
    is_active: true,
    hasManager: Boolean(user.managerEmployeeId),
    lastEnriched: user.lastEnriched || new Date().toISOString(),
    enrichment_source: 'jwt',
  };
}

export const getCurrentUser = cache(async (): Promise<UserProfile | null> => {
  const user = await getUser();
  if (!user) return null;
  return jwtUserToProfile(user);
});

export const requireAuth = cache(async (): Promise<UserProfile> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Authentication required');
  return user;
});

export const getCurrentUserID = cache(async (): Promise<string | null> => {
  return await getUserId();
});

export async function getUserById(userId: string): Promise<UserProfile | null> {
  try {
    const response = await fetch(`${process.env.ONEUI_CORE_API}/user/${userId}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`[getUserById] Failed to fetch user ${userId}`);
      return null;
    }

    const data = await response.json();
    if (!data?.data) return null;

    const userData = data.data;
    return {
      userId: userData.user_id || userId,
      name: userData.name || '',
      email: userData.email || '',
      jobTitle: userData.designation_name,
      employeeId: userData.employee_id,
      jobDepartment: userData.org_level_name,
      managerId: userData.manager_employee_id,
      managerName: userData.manager_name,
      microsoftID: userData.microsoft_id,
      phoneNumber: userData.phone,
      userPrincipalName: userData.email,
      hasProfilePhoto: Boolean(userData.has_profile_photo),
      profilePhoto: userData.profile_photo,
      is_active: userData.is_active !== false,
      hasManager: Boolean(userData.manager_employee_id),
      lastEnriched: userData.last_enriched || new Date().toISOString(),
      enrichment_source: 'api',
    };
  } catch (error) {
    console.error(`[getUserById] Error fetching user ${userId}:`, error);
    return null;
  }
}

export const logout = async (): Promise<void> => {
  redirect(`${AUTH_APP_URL}/api/auth/logout`);
};

export async function checkPermission(userAction: string) {
  const user = await getUser();
  if (!user) {
    return false;
  }
  const token = await getToken();
  if (!token) {
    return false;
  }

  const roles = [...user.roles];
  if (user.jobCategoryName) {
    roles.push(user.jobCategoryName);
  }

  return await cerbos.isAllowed({
    principal: {
      id: user.userId,
      roles: roles,
    },
    resource: {
      kind: 'brd_cr_tracker',
      id: 'brd_cr_tracker_001',
    },
    auxData: { jwt: { token: token } },
    action: userAction,
  });
}

export async function checkProjectApprovalPermission(
  userAction: string,
  projectData: {
    status: string;
    departmentHeadEmployeeId?: string;
    approverIds?: string[];
    orgLevelId?: string;
    ccmIds?: string[];
    implementationIds?: string[];
    dataOwners?: Record<string, boolean>;
  }
) {
  const user = await getUser();
  console.log(user);
  if (!user) {
    console.error('[DEBUG] checkProjectApprovalPermission: No user found');
    return false;
  }
  const token = await getToken();
  if (!token) {
    console.error('[DEBUG] checkProjectApprovalPermission: No token found');
    return false;
  }

  console.error('[DEBUG] checkProjectApprovalPermission:', {
    action: userAction,
    userEmployeeId: user.employeeId,
    projectStatus: projectData.status,
    projectDepartmentHeadId: projectData.departmentHeadEmployeeId,
    userRoles: user.roles,
  });

  try {
    const roles = [...user.roles];
    if (user.jobCategoryName) {
      roles.push(user.jobCategoryName);
    }

    const cerbosRequest = {
      principal: {
        id: user.employeeId,
        roles: roles,
      },
      resource: {
        kind: 'brd_cr_tracker',
        id: 'brd_cr_tracker',
        attr: {
          status: projectData.status,
          ...(projectData.departmentHeadEmployeeId && {
            department_head_employee_id: projectData.departmentHeadEmployeeId,
          }),
          ...(projectData.orgLevelId && {
            org_level_id: projectData.orgLevelId,
          }),
          ...(projectData.approverIds && {
            approver_ids: projectData.approverIds,
          }),
          ...(projectData.ccmIds && {
            ccm_ids: projectData.ccmIds,
          }),
          ...(projectData.implementationIds && {
            implementation_ids: projectData.implementationIds,
          }),
          ...(projectData.dataOwners && {
            dataOwner_approvers: Object.keys(projectData.dataOwners).filter(
              (key) => projectData.dataOwners![key]
            ),
          }),
        },
      },
      auxData: {
        jwt: {
          token: token,
        },
      },
      actions: [userAction],
    };

    console.error('[DEBUG] Full Cerbos request:', JSON.stringify(cerbosRequest, null, 2));

    const result = await cerbos.checkResource(cerbosRequest);

    console.error('[DEBUG] checkProjectApprovalPermission result:', result);

    // Check if the specific action is allowed
    const isAllowedResult = result.isAllowed(userAction);
    console.error('[DEBUG] isAllowed result:', isAllowedResult);

    return isAllowedResult;
  } catch (error) {
    console.error('[DEBUG] checkProjectApprovalPermission error:', error);
    return false;
  }
}
