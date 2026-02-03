export type Severity = "high" | "medium" | "low";

export interface Finding {
    ruleId: string;
    title: string;
    severity: Severity;
    impact: string;
    recommendation: string;
}

export type Rule = (spec: any) => Finding[];

export interface LintResult {
    score: number;
    findings: Finding[];
}
