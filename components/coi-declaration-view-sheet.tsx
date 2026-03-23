"use client"

import {
  User,
  Users,
  Handshake,
  FileCheck,
  ShieldCheck,
  BadgeCheck,
  BadgeX,
  Clock,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// ─── dummy data ───────────────────────────────────────────────────────────────

const DUMMY_DECLARATION = {
  reference: "COI-2026-000142",
  submittedDate: "23 Mar 2026",
  submittedTime: "10:38 PM",
  status: "pending" as const,
  employeeName: "Ahmad Faisal",
  employeeUID: "EMP-10042",
  jobTitle: "Senior Business Analyst",
  division: "Retail Banking",

  lateSubmissionReason: null as string | null,

  policyAcknowledged: true,

  personalInterests: {
    hasInterests: true,
    entries: [
      {
        relatedPersonName: "Ahmad Faisal",
        relationshipType: "company" as const,
        relationship: "Shareholder",
        otherRelationship: "",
      },
      {
        relatedPersonName: "Faisal Trading Co.",
        relationshipType: "company" as const,
        relationship: "Director",
        otherRelationship: "",
      },
    ],
  },

  familyInterests: {
    hasInterests: true,
    entries: [
      {
        relatedPersonName: "Mariam Faisal (Spouse)",
        relationshipType: "person" as const,
        relationship: "Spouse",
        otherRelationship: "",
      },
    ],
  },

  associateInterests: {
    hasInterests: false,
    entries: [],
  },

  certificationAgreed: true,
}

// ─── helpers ──────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  approved: "bg-green-500/20 text-green-400 border-green-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
}

// ─── sub-components ───────────────────────────────────────────────────────────

function SectionHeading({
  icon: Icon,
  title,
}: {
  icon: React.ElementType
  title: string
}) {
  return (
    <div className="flex items-center gap-2 pb-1">
      <Icon className="size-4 text-muted-foreground" />
      <h3 className="text-sm font-semibold">{title}</h3>
    </div>
  )
}

function DataRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-x-4 py-1.5">
      <span className="text-xs text-muted-foreground leading-5">{label}</span>
      <span className="text-sm leading-5 wrap-break-word">{value ?? "—"}</span>
    </div>
  )
}

function YesNoBadge({ value }: { value: boolean | null }) {
  if (value === null) return <span className="text-sm text-muted-foreground">—</span>
  return value ? (
    <span className="inline-flex items-center gap-1 text-sm text-green-500">
      <BadgeCheck className="size-4" /> Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
      <BadgeX className="size-4" /> No
    </span>
  )
}

// ─── section components ───────────────────────────────────────────────────────

function LateSubmissionSection({ reason }: { reason: string }) {
  return (
    <div className="space-y-1">
      <SectionHeading icon={Clock} title="Late Submission" />
      <Separator className="mb-2" />
      <div className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
        {reason}
      </div>
    </div>
  )
}

function PolicySection({ acknowledged }: { acknowledged: boolean }) {
  return (
    <div className="space-y-1">
      <SectionHeading icon={FileCheck} title="Policy Acknowledgement" />
      <Separator className="mb-2" />
      <DataRow
        label="Acknowledged"
        value={<YesNoBadge value={acknowledged} />}
      />
    </div>
  )
}

interface InterestEntry {
  relatedPersonName: string
  relationshipType: "person" | "company"
  relationship: string
  otherRelationship: string
}

interface InterestSection {
  hasInterests: boolean | null
  entries: InterestEntry[]
}

function InterestsSection({
  icon,
  title,
  section,
}: {
  icon: React.ElementType
  title: string
  section: InterestSection
}) {
  return (
    <div className="space-y-1">
      <SectionHeading icon={icon} title={title} />
      <Separator className="mb-2" />
      <DataRow
        label="Has Interests"
        value={<YesNoBadge value={section.hasInterests} />}
      />
      {section.hasInterests && section.entries.length > 0 && (
        <div className="mt-2 space-y-2">
          {section.entries.map((entry, i) => (
            <div
              key={i}
              className="rounded-lg border bg-muted/30 p-3 text-sm space-y-1"
            >
              <p className="font-medium">{entry.relatedPersonName || "—"}</p>
              <p className="text-xs text-muted-foreground">
                {entry.relationshipType === "company" ? "Company" : "Staff"} ·{" "}
                {entry.relationship === "Other"
                  ? entry.otherRelationship || "Other"
                  : entry.relationship || "—"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CertificationSection({ agreed }: { agreed: boolean }) {
  return (
    <div className="space-y-1">
      <SectionHeading icon={ShieldCheck} title="Certification" />
      <Separator className="mb-2" />
      <DataRow
        label="Certified"
        value={<YesNoBadge value={agreed} />}
      />
    </div>
  )
}

// ─── main sheet ───────────────────────────────────────────────────────────────

interface CoiDeclarationViewSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CoiDeclarationViewSheet({
  open,
  onOpenChange,
}: CoiDeclarationViewSheetProps) {
  const d = DUMMY_DECLARATION

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full min-w-xl sm:max-w-lg flex flex-col p-0"
      >
        {/* ── Header ── */}
        <SheetHeader className="shrink-0 px-6 pt-6 pb-4 border-b">
          <div className="flex items-start justify-between gap-3 pr-6">
            <div className="space-y-1 min-w-0">
              <SheetTitle className="text-base leading-snug">
                {d.reference}
              </SheetTitle>
              <SheetDescription className="text-xs">
                Submitted {d.submittedDate}, {d.submittedTime} · {d.employeeName}
              </SheetDescription>
            </div>
            <Badge
              variant="outline"
              className={`capitalize shrink-0 mt-0.5 ${STATUS_STYLES[d.status]}`}
            >
              {d.status}
            </Badge>
          </div>
        </SheetHeader>

        {/* ── Scrollable content ── */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-6 py-5 space-y-6">

            {/* Employee info */}
            <div className="space-y-1">
              <SectionHeading icon={User} title="Employee Information" />
              <Separator className="mb-2" />
              <DataRow label="Full Name" value={d.employeeName} />
              <DataRow label="Employee UID" value={d.employeeUID} />
              <DataRow label="Job Title" value={d.jobTitle} />
              <DataRow label="Division / Dept." value={d.division} />
            </div>

            {/* Late submission — only if present */}
            {d.lateSubmissionReason && (
              <LateSubmissionSection reason={d.lateSubmissionReason} />
            )}

            <PolicySection acknowledged={d.policyAcknowledged} />

            <InterestsSection
              icon={User}
              title="Personal Material Interests"
              section={d.personalInterests}
            />

            <InterestsSection
              icon={Users}
              title="Family Member Interests"
              section={d.familyInterests}
            />

            <InterestsSection
              icon={Handshake}
              title="Close Associate Interests"
              section={d.associateInterests}
            />

            <CertificationSection agreed={d.certificationAgreed} />

          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
