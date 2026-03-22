import type { BRDCR, RequestType } from "@/types";

/**
 * Generate a random 6-digit number
 */
function generateRandomNumber(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate a unique BRDCR reference number
 * Format: BRDCR-XXXXXX (where XXXXXX is a random 6-digit number)
 */
export function generateBRDCRNumber(
    requestType: RequestType,
    existingBRDCRs: BRDCR[]
): string {
    const year = new Date().getFullYear();
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
        const randomNum = generateRandomNumber();
        const refNo = `BRDCR-${randomNum}/${year}`;

        // Check if this number already exists
        const exists = existingBRDCRs.some(b => b.number === refNo);

        if (!exists) {
            return refNo;
        }

        attempts++;
    }

    // Fallback to timestamp-based if somehow we can't generate unique random
    return `BRDCR-${Date.now()}/${year}`;
}

/**
 * Validate that a parent BRDCR is valid for the given subtask type
 */
export function validateParentBRDCR(
    requestType: RequestType,
    parentNumber: string,
    existingBRDCRs: BRDCR[]
): { valid: boolean; error?: string } {
    // Only subtasks need parents
    if (!requestType.includes("subtask")) {
        return { valid: true };
    }

    if (!parentNumber) {
        return { valid: false, error: "Subtasks must have a parent BRDCR" };
    }

    // Find the parent BRDCR
    const parent = existingBRDCRs.find(b => b.number === parentNumber);

    if (!parent) {
        return { valid: false, error: "Parent BRDCR not found" };
    }

    // Parent cannot be a subtask itself
    if (parent.requestType.includes("subtask")) {
        return { valid: false, error: "Cannot link to a subtask. Please select a main BRDCR." };
    }

    // Validate type matching
    if (requestType === "project-subtask" && parent.requestType !== "project") {
        return { valid: false, error: "Project subtask must be linked to a project" };
    }

    if (requestType === "change-request-subtask" && parent.requestType !== "change-request") {
        return { valid: false, error: "CR subtask must be linked to a change request" };
    }

    return { valid: true };
}

/**
 * Get all BRDCRs that can be parents (main items only, no subtasks)
 */
export function getAvailableParents(
    requestType: RequestType,
    existingBRDCRs: BRDCR[]
): BRDCR[] {
    if (!requestType.includes("subtask")) {
        return [];
    }

    const baseType = requestType === "project-subtask" ? "project" : "change-request";

    return existingBRDCRs.filter(b =>
        b.requestType === baseType && !b.isDraft
    );
}
