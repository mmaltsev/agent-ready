import { Finding } from "./types";

export function runRules(): Finding[] {
    return [
        {
            ruleId: "DEMO_RULE",
            title: "Example finding",
            severity: "high",
            impact: "Agents cannot reliably use this API",
            recommendation: "Add structured error responses"
        }
    ];
}
