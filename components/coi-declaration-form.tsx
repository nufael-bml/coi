"use client"

import * as React from "react"
import {
  Check,
  Plus,
  X,
  Clock,
  FileCheck,
  User,
  Users,
  Handshake,
  ShieldCheck,
  TriangleAlert,
  ArrowLeftRight,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperTitle,
  useStepperControl,
} from "@/components/stepper"

// ═══════════════ TYPES ═══════════════

interface MaterialInterestEntry {
  relatedPersonName: string
  relationshipType: "person" | "company"
  relationship: string
  otherRelationship: string
}

interface MaterialInterestSection {
  hasInterests: boolean | null
  entries: MaterialInterestEntry[]
}

interface CoiFormData {
  lateSubmissionReason: string
  policyAcknowledged: boolean
  personalInterests: MaterialInterestSection
  familyInterests: MaterialInterestSection
  associateInterests: MaterialInterestSection
  certificationAgreed: boolean
}

const EMPTY_ENTRY: MaterialInterestEntry = {
  relatedPersonName: "",
  relationshipType: "person",
  relationship: "",
  otherRelationship: "",
}

const EMPTY_SECTION: MaterialInterestSection = {
  hasInterests: null,
  entries: [{ ...EMPTY_ENTRY }],
}

const initialFormData: CoiFormData = {
  lateSubmissionReason: "",
  policyAcknowledged: false,
  personalInterests: { ...EMPTY_SECTION, entries: [{ ...EMPTY_ENTRY }] },
  familyInterests: { ...EMPTY_SECTION, entries: [{ ...EMPTY_ENTRY }] },
  associateInterests: { ...EMPTY_SECTION, entries: [{ ...EMPTY_ENTRY }] },
  certificationAgreed: false,
}

const PERSON_RELATIONSHIPS = [
  "Spouse",
  "Parent",
  "Child",
  "Sibling",
  "Other Relative",
  "Friend",
  "Business Partner",
  "Colleague",
  "Other",
]

const COMPANY_RELATIONSHIPS = [
  "Owner",
  "Shareholder",
  "Director",
  "Employee",
  "Consultant",
  "Vendor",
  "Client",
  "Other",
]

// ═══════════════ YES/NO FIELD ═══════════════

interface YesNoFieldProps {
  id: string
  question: string
  value: boolean | null
  onChange: (value: boolean) => void
  yesLabel?: string
  noLabel?: string
}

function YesNoField({
  id,
  question,
  value,
  onChange,
  yesLabel = "Yes",
  noLabel = "No",
}: YesNoFieldProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium leading-snug">{question}</legend>
      <div role="radiogroup" aria-required="true" className="flex gap-2">
        <button
          type="button"
          role="radio"
          aria-checked={value === true}
          onClick={() => onChange(true)}
          className={cn(
            "relative flex flex-1 items-center gap-2 rounded-md border-2 px-3 py-2 text-xs font-medium transition-all duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            value === true
              ? "border-primary bg-primary/5 text-primary shadow-sm"
              : "border-border bg-background text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              value === true
                ? "border-primary bg-primary text-primary-foreground"
                : "border-muted-foreground/40 bg-background"
            )}
          >
            {value === true && <Check className="size-2.5" strokeWidth={3} />}
          </span>
          {yesLabel}
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={value === false}
          onClick={() => onChange(false)}
          className={cn(
            "relative flex flex-1 items-center gap-2 rounded-md border-2 px-3 py-2 text-xs font-medium transition-all duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            value === false
              ? "border-primary bg-primary/5 text-primary shadow-sm"
              : "border-border bg-background text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              value === false
                ? "border-primary bg-primary text-primary-foreground"
                : "border-muted-foreground/40 bg-background"
            )}
          >
            {value === false && <Check className="size-2.5" strokeWidth={3} />}
          </span>
          {noLabel}
        </button>
      </div>
    </fieldset>
  )
}

// ═══════════════ MATERIAL INTEREST ENTRIES ═══════════════

function MaterialInterestEntries({
  entries,
  onChange,
}: {
  entries: MaterialInterestEntry[]
  onChange: (entries: MaterialInterestEntry[]) => void
}) {
  const updateEntry = (index: number, patch: Partial<MaterialInterestEntry>) => {
    const updated = entries.map((entry, i) =>
      i === index ? { ...entry, ...patch } : entry
    )
    onChange(updated)
  }

  const addEntry = () => {
    onChange([...entries, { ...EMPTY_ENTRY }])
  }

  const removeEntry = (index: number) => {
    if (entries.length <= 1) return
    onChange(entries.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      {entries.map((entry, index) => {
        const relationships =
          entry.relationshipType === "person"
            ? PERSON_RELATIONSHIPS
            : COMPANY_RELATIONSHIPS

        return (
          <div
            key={index}
            className="rounded-lg border bg-muted/30 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Entry {index + 1}
              </span>
              {entries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEntry(index)}
                  aria-label={`Remove entry ${index + 1}`}
                  className="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div>
              <label
                htmlFor={`entry-name-${index}`}
                className="text-sm font-medium select-text cursor-text"
              >
                {entry.relationshipType === "person" ? "Related Person Name" : "Related Company Name"}
              </label>
              <Input
                id={`entry-name-${index}`}
                value={entry.relatedPersonName}
                onChange={(e) =>
                  updateEntry(index, { relatedPersonName: e.target.value })
                }
                placeholder={entry.relationshipType === "person" ? "Enter name" : "Enter company name"}
                className="mt-1"
              />
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor={`entry-rel-${index}`}
                    className="text-sm font-medium select-text cursor-text"
                  >
                    {entry.relationshipType === "person"
                      ? "Relationship with Staff"
                      : "Relationship with Company"}
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      updateEntry(index, {
                        relationshipType:
                          entry.relationshipType === "person"
                            ? "company"
                            : "person",
                        relationship: "",
                        otherRelationship: "",
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground hover:border-input transition-colors cursor-pointer"
                    aria-label={`Switch to ${entry.relationshipType === "person" ? "company" : "staff"} relationship`}
                  >
                    <ArrowLeftRight className="size-3" />
                    Switch to {entry.relationshipType === "person" ? "Company" : "Staff"}
                  </button>
                </div>
                <Select
                  value={entry.relationship}
                  onValueChange={(value) =>
                    updateEntry(index, {
                      relationship: value,
                      otherRelationship:
                        value === "Other" ? entry.otherRelationship : "",
                    })
                  }
                >
                  <SelectTrigger id={`entry-rel-${index}`}>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationships.map((rel) => (
                      <SelectItem key={rel} value={rel}>
                        {rel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {entry.relationship === "Other" && (
              <div>
                <label
                  htmlFor={`entry-other-${index}`}
                  className="text-sm font-medium select-text cursor-text"
                >
                  Please specify relationship
                </label>
                <Input
                  id={`entry-other-${index}`}
                  value={entry.otherRelationship}
                  onChange={(e) =>
                    updateEntry(index, { otherRelationship: e.target.value })
                  }
                  placeholder="Please specify relationship"
                  className="mt-1"
                />
              </div>
            )}
          </div>
        )
      })}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addEntry}
        className="gap-1.5"
      >
        <Plus className="size-3" />
        Add Entry
      </Button>
    </div>
  )
}

// ═══════════════ STEP: LATE SUBMISSION ═══════════════

function LateSubmissionStep({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-4">
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="flex items-start gap-3 py-3">
          <TriangleAlert className="size-5 shrink-0 text-destructive mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-destructive mb-1">Deadline Passed</p>
            <p className="text-sm text-destructive">
              The submission deadline for Financial Year 2026 was{" "}
              <span className="font-semibold">15 Jan 2026</span>. You can still
              submit your declaration, but you will need to provide a reason for
              the late submission.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-muted/50 p-4">
        <p className="text-sm text-foreground">
          Since the submission deadline has passed, please provide a reason for
          your late submission. This will be recorded for audit purposes.
        </p>
      </div>

      <div>
        <label htmlFor="late-reason" className="text-sm font-medium select-text cursor-text">
          Reason for Late Submission
        </label>
        <Textarea
          id="late-reason"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Please explain why you were unable to submit before the deadline..."
          rows={5}
          className="mt-1"
        />
      </div>
    </div>
  )
}

// ═══════════════ STEP: POLICY ACKNOWLEDGEMENT ═══════════════

function PolicyAcknowledgementStep({
  agreed,
  onChange,
}: {
  agreed: boolean
  onChange: (agreed: boolean) => void
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border bg-muted/50 p-4 space-y-4">
        <div>
          <p className="text-sm text-foreground">
            I am aware of my responsibilities under the Conflict of Interest
            Policy and Procedure of the Bank and its related policies and
            procedures to:
          </p>
          <ul className="mt-2 ml-4 list-disc text-sm text-foreground space-y-1">
            <li>
              Take reasonable steps to avoid any actual, perceived or potential
              conflict of interest, and disclose details of any material personal
              interest in connection with Bank employment
            </li>
            <li>
              Not make improper use of inside information, or my duties, status,
              power or authority
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm text-foreground">
            I have read and understood my obligations under the following
            Policies of the Bank:
          </p>
          <ul className="mt-2 ml-4 list-disc text-sm text-foreground space-y-1">
            <li>Conflict of Interest Policy</li>
            <li>Employee Handbook</li>
            <li>Fraud Risk Management Policy and Procedure</li>
            <li>ABC Policy</li>
            <li>Technology Code of Conduct</li>
            <li>Related Party Procedure</li>
            <li>Procurement Policy</li>
            <li>Whistle blower policy</li>
          </ul>
        </div>

        <p className="text-sm text-foreground">
          The attached list at Part 2, 3 &amp; 4 of material personal interests
          has been prepared on the basis of my roles and responsibilities at the
          Bank.
        </p>

        <p className="text-sm text-foreground">
          I undertake to immediately inform my line manager of any changes to my
          circumstances that could affect the contents of this declaration and to
          provide an amended declaration&apos;s using this form.
        </p>

        <p className="text-sm text-foreground">
          I undertake to declare any material personal interests of myself, my
          family member &amp; my close associates that I am aware of, should
          circumstances arise in which I consider that they could influence, or
          could reasonably be seen to influence, the decisions I take or the
          advice I give.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Checkbox
          id="policy-agree"
          checked={agreed}
          onCheckedChange={(checked) => onChange(checked === true)}
        />
        <label
          htmlFor="policy-agree"
          className="text-sm font-medium leading-none cursor-pointer"
        >
          I agree to the above statements
        </label>
      </div>
    </div>
  )
}

// ═══════════════ STEP: MATERIAL INTERESTS (SHARED) ═══════════════

function MaterialInterestsStep({
  title,
  description,
  secondaryDescription,
  yesLabel,
  noLabel,
  section,
  onChange,
}: {
  title: string
  description: string
  secondaryDescription: string
  yesLabel: string
  noLabel: string
  section: MaterialInterestSection
  onChange: (section: MaterialInterestSection) => void
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
        <p className="text-sm text-foreground">{description}</p>
        <p className="text-sm text-foreground">{secondaryDescription}</p>
      </div>

      <YesNoField
        id={`interests-${title}`}
        question={`Do you have any ${title.toLowerCase()}?`}
        value={section.hasInterests}
        onChange={(val) =>
          onChange({
            ...section,
            hasInterests: val,
            entries: val ? section.entries : [{ ...EMPTY_ENTRY }],
          })
        }
        yesLabel={yesLabel}
        noLabel={noLabel}
      />

      {section.hasInterests === true && (
        <MaterialInterestEntries
          entries={section.entries}
          onChange={(entries) => onChange({ ...section, entries })}
        />
      )}
    </div>
  )
}

// ═══════════════ STEP: FINAL CERTIFICATION ═══════════════

function FinalCertificationStep({
  agreed,
  onChange,
}: {
  agreed: boolean
  onChange: (agreed: boolean) => void
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border bg-muted/50 p-4">
        <p className="text-sm text-foreground mb-3">
          By submitting this form, I:
        </p>
        <ul className="ml-4 list-disc text-sm text-foreground space-y-2">
          <li>
            Certify that I have read and understand the policies/Procedures
            referred to in this document and hereby subscribe and agree to be
            bound by the said Policies/Procedures.
          </li>
          <li>
            Certify that the information I have provided on this form is complete
            and accurate to the best of my knowledge.
          </li>
          <li>
            Acknowledge my continuing obligation to complete and submit a new
            Annual Disclosure and Certification Form at any time during the year
            if any changes occur in personal circumstances and/or a change in
            work responsibilities that appear that I have or acquire additional
            interests that should be made known to the Bank.
          </li>
          <li>
            Am aware of the purpose for which the information has been collected,
            the policy requirements authorizing the collection and the third
            parties to whom the information may be disclosed.
          </li>
        </ul>
      </div>

      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="flex items-start gap-3 py-3">
          <TriangleAlert className="size-5 shrink-0 text-destructive mt-0.5" />
          <p className="text-sm text-destructive">
            <span className="font-semibold">Important:</span> Any violation,
            including failure to complete this form, is considered a gross
            misconduct and may result in disciplinary action up to and including
            employment termination.
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Checkbox
          id="certification-agree"
          checked={agreed}
          onCheckedChange={(checked) => onChange(checked === true)}
        />
        <label
          htmlFor="certification-agree"
          className="text-sm font-medium leading-none cursor-pointer"
        >
          I agree to the above certification
        </label>
      </div>
    </div>
  )
}

// ═══════════════ MAIN HOOK ═══════════════

export interface CoiDeclarationFormHandle {
  StepperHeader: React.ReactNode
  NavFooter: React.ReactNode
  StepContent: React.ReactNode
}

export function useCoiDeclarationForm(
  deadlinePassed: boolean,
  onSubmit?: (data: CoiFormData) => void,
  onSaveDraft?: (data: CoiFormData) => void
): CoiDeclarationFormHandle {
  const [formData, setFormData] = React.useState<CoiFormData>(initialFormData)

  const totalSteps = deadlinePassed ? 6 : 5
  const stepper = useStepperControl(totalSteps)

  // Map logical step index to content based on whether late submission step exists
  const stepOffset = deadlinePassed ? 0 : -1

  const allSteps = React.useMemo(() => {
    const base = [
      ...(deadlinePassed
        ? [{ step: 1, title: "Late Submission", icon: Clock }]
        : []),
      {
        step: deadlinePassed ? 2 : 1,
        title: "Policy",
        icon: FileCheck,
      },
      {
        step: deadlinePassed ? 3 : 2,
        title: "Personal",
        icon: User,
      },
      {
        step: deadlinePassed ? 4 : 3,
        title: "Family",
        icon: Users,
      },
      {
        step: deadlinePassed ? 5 : 4,
        title: "Associates",
        icon: Handshake,
      },
      {
        step: deadlinePassed ? 6 : 5,
        title: "Certification",
        icon: ShieldCheck,
      },
    ]
    return base
  }, [deadlinePassed])

  const StepperHeader = (
    <Stepper currentStep={stepper.currentStep} linear>
      {allSteps.map((item) => (
        <StepperItem key={item.step} step={item.step} label={item.title}>
          <StepperSeparator />
          <StepperTrigger>
            <StepperIndicator showIcon={false}>
              <item.icon className="size-4" />
            </StepperIndicator>
          </StepperTrigger>
          <div className="mt-3 flex flex-col items-center text-center">
            <StepperTitle className="hidden sm:block text-xs">
              {item.title}
            </StepperTitle>
          </div>
        </StepperItem>
      ))}
    </Stepper>
  )

  const canSubmit = formData.certificationAgreed

  const NavFooter = (
    <div className="flex items-center justify-between gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={stepper.goToPreviousStep}
        disabled={!stepper.canGoPrevious}
        className={cn(!stepper.canGoPrevious && "invisible")}
      >
        Back
      </Button>
      {stepper.isLastStep ? (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSaveDraft?.(formData)}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            onClick={() => onSubmit?.(formData)}
            disabled={!canSubmit}
          >
            Submit
          </Button>
        </div>
      ) : (
        <Button type="button" onClick={stepper.goToNextStep}>
          Next
        </Button>
      )}
    </div>
  )

  // Determine which content to show at each step number
  const lateStep = deadlinePassed ? 1 : -1
  const policyStep = deadlinePassed ? 2 : 1
  const personalStep = deadlinePassed ? 3 : 2
  const familyStep = deadlinePassed ? 4 : 3
  const associateStep = deadlinePassed ? 5 : 4
  const certStep = deadlinePassed ? 6 : 5

  const StepContent = (
    <>
      {stepper.currentStep === lateStep && (
        <LateSubmissionStep
          value={formData.lateSubmissionReason}
          onChange={(lateSubmissionReason) =>
            setFormData((prev) => ({ ...prev, lateSubmissionReason }))
          }
        />
      )}
      {stepper.currentStep === policyStep && (
        <PolicyAcknowledgementStep
          agreed={formData.policyAcknowledged}
          onChange={(policyAcknowledged) =>
            setFormData((prev) => ({ ...prev, policyAcknowledged }))
          }
        />
      )}
      {stepper.currentStep === personalStep && (
        <MaterialInterestsStep
          title="material personal interests"
          description="Please list any material personal interests which could influence, or could reasonably be seen to influence, the decisions you take."
          secondaryDescription="Please disclose your Non-BML activities, if you are a signatory authority or if you have any near relatives working at the Bank or have any social or personal relationships or any relationship with any Politically Exposed Persons that could or could be seen to impact upon your responsibilities."
          yesLabel="Yes, my material personal interests are listed below"
          noLabel="No material personal interests"
          section={formData.personalInterests}
          onChange={(personalInterests) =>
            setFormData((prev) => ({ ...prev, personalInterests }))
          }
        />
      )}
      {stepper.currentStep === familyStep && (
        <MaterialInterestsStep
          title="family member with material interests"
          description="Please list any material personal interests of your family member that you are aware of, should circumstances arise in which you consider that they could influence, or could reasonably be seen to influence, the decisions you take or the advice you give."
          secondaryDescription="Please disclose any of your family members' activities or companies, that you are aware of, that may have any relationship to or have been registered as vendor with the Bank or provide any services to the Bank that may have any relation, oversight or impact in your roles and responsibilities as the Bank."
          yesLabel="Yes, family members listed below"
          noLabel="No family members that can influence"
          section={formData.familyInterests}
          onChange={(familyInterests) =>
            setFormData((prev) => ({ ...prev, familyInterests }))
          }
        />
      )}
      {stepper.currentStep === associateStep && (
        <MaterialInterestsStep
          title="close associates with material interests"
          description="Please list any material personal interests of your close associates that you are aware of, should circumstances arise in which you consider that they could influence, or could reasonably be seen to influence, the decisions you take or the advice you give."
          secondaryDescription="Please disclose any of your close associates' activities or companies, that you are aware of, that may have any relationship to or have been registered as vendor with the Bank or provide any services to the Bank that may have any relation, oversight or impact in your roles and responsibilities as the Bank."
          yesLabel="Yes, close associates listed below"
          noLabel="No close associates that can influence"
          section={formData.associateInterests}
          onChange={(associateInterests) =>
            setFormData((prev) => ({ ...prev, associateInterests }))
          }
        />
      )}
      {stepper.currentStep === certStep && (
        <FinalCertificationStep
          agreed={formData.certificationAgreed}
          onChange={(certificationAgreed) =>
            setFormData((prev) => ({ ...prev, certificationAgreed }))
          }
        />
      )}
    </>
  )

  return { StepperHeader, NavFooter, StepContent }
}
