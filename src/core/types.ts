export type Severity = "high" | "medium" | "low";

export interface Finding {
    ruleId: string;
    title: string;
    severity: Severity;
    impact: string;
    recommendation: string;
}

export interface LintResult {
    score: number;
    findings: Finding[];
}
