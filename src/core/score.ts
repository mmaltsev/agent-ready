import { Finding, Severity } from "./types";

const SEVERITY_PENALTY: Record<Severity, number> = {
    high: 20,
    medium: 10,
    low: 5
};

export function calculateScore(findings: Finding[]) {
    let score = 100;

    for (const finding of findings) {
        score -= SEVERITY_PENALTY[finding.severity];
    }

    score = Math.max(score, 0);

    return {
        score,
        riskLevel: riskFromScore(score),
        exitCode: exitCodeFromScore(score)
    };
}

function riskFromScore(score: number): "low" | "medium" | "high" {
    if (score >= 80) return "low";
    if (score >= 50) return "medium";
    return "high";
}

function exitCodeFromScore(score: number): number {
    if (score >= 80) return 0;
    if (score >= 50) return 1;
    return 2;
}
