import { Finding, Rule } from "../../core/types";

export const noIdempotencyHint: Rule = (spec: any): Finding[] => {
    const findings: Finding[] = [];

    if (!spec.paths) {
        return findings;
    }

    const mutatingMethods = ['post', 'put', 'patch'];

    for (const [pathKey, pathItem] of Object.entries(spec.paths)) {
        if (!pathItem) continue;

        for (const method of mutatingMethods) {
            const operation = (pathItem as any)[method];
            if (!operation) continue;

            let hasIdempotencyHeader = false;
            let hasIdempotencyHint = false;

            // Check parameters for idempotency key header
            if (Array.isArray(operation.parameters)) {
                for (const param of operation.parameters) {
                    if (param.in === 'header' && param.name) {
                        const nameLower = param.name.toLowerCase();
                        if (nameLower.includes('idempotenc') || nameLower.includes('retry')) {
                            hasIdempotencyHeader = true;
                            break;
                        }
                    }
                }
            }

            // Check description and summary for documentation hint
            const summary = operation.summary ? operation.summary.toLowerCase() : '';
            const description = operation.description ? operation.description.toLowerCase() : '';

            if (
                summary.includes('idempotent') || summary.includes('idempotency') || summary.includes('retry safe') ||
                description.includes('idempotent') || description.includes('idempotency') || description.includes('retry safe')
            ) {
                hasIdempotencyHint = true;
            }

            if (!hasIdempotencyHeader && !hasIdempotencyHint) {
                findings.push({
                    ruleId: "no-idempotency-hint",
                    title: "Mutating Endpoint Without Idempotency Signals",
                    severity: "high",
                    impact: "Risk of duplicated side effects (billing, provisioning, emails).",
                    recommendation: `Add an idempotency key header or note retry safety in the documentation for ${method.toUpperCase()} ${pathKey}`
                });
            }
        }
    }

    return findings;
};
