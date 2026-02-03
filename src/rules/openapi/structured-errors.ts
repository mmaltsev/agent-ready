import { Finding, Rule } from "../../core/types";

export const structuredErrors: Rule = (spec: any): Finding[] => {
    const findings: Finding[] = [];

    // Basic validation that we have paths
    if (!spec.paths) {
        return findings;
    }

    for (const [pathKey, pathItem] of Object.entries(spec.paths)) {
        if (!pathItem) continue;

        // Iterate over standard HTTP methods
        const methods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];
        for (const method of methods) {
            const operation = (pathItem as any)[method];
            if (!operation || !operation.responses) continue;

            for (const [statusCode, response] of Object.entries(operation.responses)) {
                // Check for non-2xx responses (3xx, 4xx, 5xx) or default
                // "default" covers errors too.
                // Status codes can be strings like "200", "404", "5xx" (uncommon in strict OpenAPI but possible in wild)
                // We mainly care about 4xx, 5xx and default.

                const isSuccess = statusCode.startsWith('2');
                if (isSuccess) continue;

                // For error responses, we expect structured content
                const resp = response as any;

                // If response is a ref, we might skip or try to resolve. 
                // For this MVP, we assume resolved or check only if content block exists locally.
                // We'll check if 'content' exists and has 'application/json' (or similar).

                if (!resp.content || Object.keys(resp.content).length === 0) {
                    findings.push({
                        ruleId: "structured-errors",
                        title: "Missing structured error response",
                        severity: "high",
                        impact: "Agents cannot understand why an operation failed if no structured error data is returned.",
                        recommendation: `Add a schema to the ${statusCode} response in ${method.toUpperCase()} ${pathKey}`
                    });
                }
            }
        }
    }

    return findings;
};
