import { Finding, Rule } from "../../core/types";

export const noRetryHint: Rule = (spec: any): Finding[] => {
    const findings: Finding[] = [];

    if (!spec.paths) {
        return findings;
    }

    const methods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

    for (const [pathKey, pathItem] of Object.entries(spec.paths)) {
        if (!pathItem) continue;

        for (const method of methods) {
            const operation = (pathItem as any)[method];
            if (!operation || !operation.responses) continue;

            // Check if there's a 429 response
            const rateLimitResponse = operation.responses['429'];
            if (!rateLimitResponse) continue;

            // Check headers for Retry-After
            let hasRetryAfter = false;
            if (rateLimitResponse.headers) {
                const headerKeys = Object.keys(rateLimitResponse.headers).map(k => k.toLowerCase());
                if (headerKeys.includes('retry-after')) {
                    hasRetryAfter = true;
                }
            }

            // Check schema properties for retry semantics if no header is found
            let hasSchemaGuidance = false;
            if (!hasRetryAfter && rateLimitResponse.content) {
                for (const mediaValue of Object.values(rateLimitResponse.content)) {
                    const schema = (mediaValue as any).schema;
                    if (schema && schema.properties) {
                        const propKeys = Object.keys(schema.properties).map(k => k.toLowerCase());
                        if (propKeys.some(k => k.includes('retry'))) {
                            hasSchemaGuidance = true;
                            break;
                        }
                    }
                }
            }

            if (!hasRetryAfter && !hasSchemaGuidance) {
                findings.push({
                    ruleId: "no-retry-hint",
                    title: "No Rate-Limit Retry Guidance",
                    severity: "medium",
                    impact: "Agents may retry aggressively or fail permanently.",
                    recommendation: `Add a 'Retry-After' header or retry guidance to the 429 response in ${method.toUpperCase()} ${pathKey}`
                });
            }
        }
    }

    return findings;
};
