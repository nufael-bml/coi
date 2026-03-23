export type ApplicationStatus = "draft" | "pending" | "approved" | "rejected"

export interface Application {
  id: string
  reference: string
  employeeName: string
  employeeEmail: string
  department: string
  submittedDate: string
  status: ApplicationStatus
}
