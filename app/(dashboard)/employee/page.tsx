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
  TriangleAlert,
  FilePen,
  Eye,
  Pencil,
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
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusCard } from "@/components/custom/status-card"
import { ApplicationsDataTable } from "@/components/custom/applications-data-table"
import { AlertCircle } from "lucide-react"
import { Application, ApplicationStatus } from "@/lib/types/application"
import { DebugMenu } from "@/components/_debug/debug-menu"
import { CoiDeclarationSheet } from "@/components/coi-declaration-sheet"
import { CoiDeclarationViewSheet } from "@/components/coi-declaration-view-sheet"

type FilterStatus = ApplicationStatus | "all"

export default function EmployeePage() {
  const [applications] = useState<Application[]>([])
  const [deadlinePassed, setDeadlinePassed] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [hasDraft, setHasDraft] = useState(false)
  const [hasAmendment, setHasAmendment] = useState(false)
  const [useDestructiveDeadlineCard, setUseDestructiveDeadlineCard] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")
  const [statusFilters, setStatusFilters] = useState<Record<string, boolean>>({
    draft: true,
    pending: true,
    approved: true,
    rejected: true,
  })

  const handleFormSubmittedChange = (value: boolean) => {
    setFormSubmitted(value)
    if (value) {
      setHasDraft(false)
      setHasAmendment(false)
    }
  }

  const handleHasDraftChange = (value: boolean) => {
    setHasDraft(value)
    if (value) {
      setFormSubmitted(false)
      setHasAmendment(false)
    }
  }

  const handleHasAmendmentChange = (value: boolean) => {
    setHasAmendment(value)
    if (value) {
      setFormSubmitted(false)
      setHasDraft(false)
    }
  }

  const handleSubmitDeclaration = () => {
    setFormSubmitted(true)
    setHasDraft(false)
    setHasAmendment(false)
  }

  const handleSaveDraftDeclaration = () => {
    setHasDraft(true)
    setFormSubmitted(false)
    setHasAmendment(false)
  }

  const handleRequestAmendment = () => {
    setHasAmendment(true)
    setFormSubmitted(false)
    setHasDraft(false)
  }

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
                Conflict of Interest Disclosures
              </h1>
              <p className="text-sm text-muted-foreground">
                Submit and track conflict of interest declaration forms
              </p>
            </div>
          </header>

          {deadlinePassed && !formSubmitted && useDestructiveDeadlineCard ? (
            <Card className="mt-6 border-destructive/50 bg-destructive/5">
              <CardHeader className="py-3">
                <div className="flex items-start gap-3">
                  <TriangleAlert className="size-5 shrink-0 text-destructive mt-0.5" />
                  <div>
                    <CardTitle className="text-base text-destructive">
                      Financial Year 2026 Deadline Passed
                    </CardTitle>
                    <p className="text-sm text-destructive mt-1">
                      The submission deadline for Financial Year 2026 was{" "}
                      <span className="font-semibold">15 Jan 2026</span>. You can still
                      submit your declaration, but you will need to provide a reason for
                      the late submission.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ) : (
            <Card className="mt-6 bg-background">
              <CardHeader className="py-3">
                <CardTitle className="text-base text-foreground">
                  Financial Year 2026 Deadline
                </CardTitle>
                <div className="flex items-center gap-2">
                  {deadlinePassed && !formSubmitted && (
                    <TriangleAlert className="size-4 shrink-0 text-red-500" />
                  )}
                  <p className={deadlinePassed && !formSubmitted ? "text-sm text-red-500" : "text-sm text-muted-foreground"}>
                    {deadlinePassed
                      ? "The deadline has passed on "
                      : "The deadline for the current financial year is "}
                    <span className={deadlinePassed && !formSubmitted ? "font-semibold" : "font-semibold text-foreground"}>
                      {deadlinePassed ? "15 Jan 2026" : "Jan 15, 2026"}
                    </span>.
                  </p>
                </div>
              </CardHeader>
            </Card>
          )}

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

          {/* Declaration CTA */}
          <Card className="mt-6 bg-background">
            <CardHeader className="py-3">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base text-foreground">
                    {hasAmendment
                      ? "Amendment Request Pending"
                      : formSubmitted
                      ? "Declaration Submitted"
                      : hasDraft
                        ? "Continue Your Draft"
                        : "Start your 2026 Declaration"}
                  </CardTitle>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {hasAmendment
                      ? "Your amendment request for the 2026 declaration is pending admin approval. You will be able to edit your declaration once approved."
                      : formSubmitted
                      ? "Your COI declaration for 2026 was submitted on 23 Mar 2026, 10:38 PM"
                      : hasDraft
                        ? "You have a draft declaration for 2026. Continue where you left off and submit before the deadline."
                        : "You haven't submitted a COI declaration for the current financial year. Click the button to start your declaration now."}
                  </p>
                </div>

                {hasAmendment ? (
                  <div className="flex shrink-0 gap-2">
                    <Button className="gap-2" onClick={() => setViewOpen(true)}>
                      <Eye className="size-4" />
                      View Declaration
                    </Button>
                  </div>
                ) : formSubmitted ? (
                  <div className="flex shrink-0 gap-2">
                    <Button className="gap-2" onClick={() => setViewOpen(true)}>
                      <Eye className="size-4" />
                      View Declaration
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={handleRequestAmendment}
                    >
                      <Pencil className="size-4" />
                      Request Ammendment
                    </Button>
                  </div>
                ) : (
                  <CoiDeclarationSheet
                    deadlinePassed={deadlinePassed}
                    onSubmit={handleSubmitDeclaration}
                    onSaveDraft={handleSaveDraftDeclaration}
                    trigger={
                      <Button className="shrink-0 gap-2">
                        <FilePen className="size-4" />
                        {hasDraft ? "Continue Draft" : "Start Declaration"}
                      </Button>
                    }
                  />
                )}
              </div>
            </CardHeader>
          </Card>

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
      <DebugMenu
        deadlinePassed={deadlinePassed}
        onDeadlinePassedChange={setDeadlinePassed}
        formSubmitted={formSubmitted}
        onFormSubmittedChange={handleFormSubmittedChange}
        hasDraft={hasDraft}
        onHasDraftChange={handleHasDraftChange}
        hasAmendment={hasAmendment}
        onHasAmendmentChange={handleHasAmendmentChange}
        useDestructiveDeadlineCard={useDestructiveDeadlineCard}
        onUseDestructiveDeadlineCardChange={setUseDestructiveDeadlineCard}
      />
      <CoiDeclarationViewSheet open={viewOpen} onOpenChange={setViewOpen} />
    </>
  )
}
