"use client"

import { useState, useMemo } from "react"
import {
  FileText,
  FilePlus,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusCard } from "@/components/custom/status-card"
import { ApplicationsDataTable } from "@/components/custom/applications-data-table"
import { Application, ApplicationStatus } from "@/lib/types/application"
import { DebugMenu } from "@/components/_debug/debug-menu"

type FilterStatus = ApplicationStatus | "all"

export default function EmployeePage() {
  const [applications] = useState<Application[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")
  const [statusFilters, setStatusFilters] = useState<Record<string, boolean>>({
    draft: true,
    pending: true,
    approved: true,
    rejected: true,
  })

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: applications.length,
      draft: applications.filter((a) => a.status === "draft").length,
      pending: applications.filter((a) => a.status === "pending").length,
      approved: applications.filter((a) => a.status === "approved").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
    }
  }, [applications])

  // Filter applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        searchQuery === "" ||
        app.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.employeeEmail.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatusCard =
        statusFilter === "all" || app.status === statusFilter

      const matchesStatusDropdown = statusFilters[app.status]

      return matchesSearch && matchesStatusCard && matchesStatusDropdown
    })
  }, [applications, searchQuery, statusFilter, statusFilters])

  const handleStatusCardClick = (status: FilterStatus) => {
    const nextStatus = status === statusFilter ? "all" : status
    setStatusFilter(nextStatus)

    if (nextStatus === "all") {
      setStatusFilters({
        draft: true,
        pending: true,
        approved: true,
        rejected: true,
      })
      return
    }

    setStatusFilters({
      draft: nextStatus === "draft",
      pending: nextStatus === "pending",
      approved: nextStatus === "approved",
      rejected: nextStatus === "rejected",
    })
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="mx-auto py-2">
          {/* Header */}
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Outside Activity Disclosures
              </h1>
              <p className="text-sm text-muted-foreground">
                Submit and track forms for activities you participate in outside the company
              </p>
            </div>
          </header>

          {/* Status Cards */}
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            <StatusCard
              title="Total Applications"
              count={stats.total}
              description="All applications"
              icon={FileText}
              indicatorColor="bg-blue-500"
              isActive={statusFilter === "all"}
              onClick={() => handleStatusCardClick("all")}
            />
            <StatusCard
              title="Draft"
              count={stats.draft}
              description="Draft applications"
              icon={FilePlus}
              indicatorColor="bg-gray-400"
              isActive={statusFilter === "draft"}
              onClick={() => handleStatusCardClick("draft")}
            />
            <StatusCard
              title="Pending"
              count={stats.pending}
              description="Awaiting approval"
              icon={Clock}
              indicatorColor="bg-yellow-500"
              isActive={statusFilter === "pending"}
              onClick={() => handleStatusCardClick("pending")}
            />
            <StatusCard
              title="Approved"
              count={stats.approved}
              description="Approved applications"
              icon={CheckCircle2}
              indicatorColor="bg-green-500"
              isActive={statusFilter === "approved"}
              onClick={() => handleStatusCardClick("approved")}
            />
            <StatusCard
              title="Rejected"
              count={stats.rejected}
              description="Rejected applications"
              icon={XCircle}
              indicatorColor="bg-red-500"
              isActive={statusFilter === "rejected"}
              onClick={() => handleStatusCardClick("rejected")}
            />
          </div>

          {/* Data Table */}
          <div className="mt-6">
            <ApplicationsDataTable
              data={filteredApplications}
              toolbarContent={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by reference..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter className="size-4" />
                        Filters
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        checked={statusFilters.draft}
                        onCheckedChange={(checked) =>
                          setStatusFilters((prev) => ({ ...prev, draft: checked }))
                        }
                      >
                        Draft
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={statusFilters.pending}
                        onCheckedChange={(checked) =>
                          setStatusFilters((prev) => ({ ...prev, pending: checked }))
                        }
                      >
                        Pending
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={statusFilters.approved}
                        onCheckedChange={(checked) =>
                          setStatusFilters((prev) => ({ ...prev, approved: checked }))
                        }
                      >
                        Approved
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={statusFilters.rejected}
                        onCheckedChange={(checked) =>
                          setStatusFilters((prev) => ({ ...prev, rejected: checked }))
                        }
                      >
                        Rejected
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              }
            />
          </div>
        </div>
      </div>
      <DebugMenu />
    </>
  )
}
