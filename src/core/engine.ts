import { Finding } from "./types";
import { structuredErrors } from "../rules/openapi/structured-errors";
import { missingDescriptions } from "../rules/openapi/missing-descriptions";
import { errorNoCodeField } from "../rules/openapi/error-no-code-field";
import { missingSuccessSchema } from "../rules/openapi/missing-success-schema";
import { noRetryHint } from "../rules/openapi/no-retry-hint";
import { calculateScore } from "./score";

export function runRules(spec: any): { findings: Finding[], score: { score: number, riskLevel: "low" | "medium" | "high", exitCode: number } } {
    const rules = [
        structuredErrors,
        missingDescriptions,
        errorNoCodeField,
        missingSuccessSchema,
        noRetryHint
    ];

    const allFindings = rules.flatMap(rule => rule(spec));

    return {
        findings: allFindings,
        score: calculateScore(allFindings)
    }
}
