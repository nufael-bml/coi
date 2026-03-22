export interface Employee {
  id: string;
  name: string;
  email: string;
  employee_id: string;
  line_manager_id: string;
  line_manager_name: string;
  org_level_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  job_category_id: string;
  job_category_name: string;
  designation_id: string;
  designation_name: string;
  org_level_name: string;
  org_level_path: string;
  org_level_readable_path: string;
  reporting_chain: Array<{
    id: string;
    name: string;
    email: string;
    employee_id: string;
  }>;
}

import { getApiBaseUrl } from '@/lib/runtime-api';

const API_BASE_URL = getApiBaseUrl();

export const employeeService = {
  // Get all employees
  async getEmployees(): Promise<Employee[]> {
    // Debug log removed: fetching employees endpoint suppressed
    const response = await fetch(`${API_BASE_URL}/employees`);

    // Debug log removed: employee API response status suppressed

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Employee API error:', errorText);
      throw new Error('Failed to fetch employees');
    }
    const data = await response.json();

    // Debug logs removed: employee API response content suppressed

    // Handle different response structures
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.data)) {
      return data.data;
    } else if (data && Array.isArray(data.employees)) {
      return data.employees;
    } else {
      console.warn('Unexpected API response structure:', data);
      return [];
    }
  },

  // Fetch user data from OneUI Core API with reporting chain
  async getUserWithReportingChain(userId: string): Promise<{
    employee_id: string;
    reporting_chain: Array<{
      id: string;
      name: string;
      email: string;
      employee_id: string;
      job_category_id: string;
      job_category_name: string;
    }>;
  } | null> {
    try {
      // Use local API route to avoid CORS issues
      const response = await fetch(`/api/users/${userId}`);

      if (!response.ok) {
        console.error('Failed to fetch user data:', response.status);
        return null;
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Error fetching user with reporting chain:', error);
      return null;
    }
  },

  // Extract department head employee ID from user data
  getDepartmentHeadEmployeeId(
    userData: {
      reporting_chain: Array<{
        employee_id: string;
        job_category_id: string;
      }>;
    } | null
  ): string | null {
    if (!userData || !userData.reporting_chain) {
      return null;
    }

    // Department head job category ID
    const DEPARTMENT_HEAD_JOB_CATEGORY_ID = '5091d0aa-68fa-467e-b305-bdb99ad09e6d';

    const departmentHead = userData.reporting_chain.find(
      (member) => member.job_category_id === DEPARTMENT_HEAD_JOB_CATEGORY_ID
    );

    return departmentHead ? departmentHead.employee_id : null;
  },
};
