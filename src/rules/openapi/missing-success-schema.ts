import { Finding, Rule } from "../../core/types";

export const missingSuccessSchema: Rule = (spec: any): Finding[] => {
    const findings: Finding[] = [];

    if (!spec.paths) {
        return findings;
    }

    for (const [pathKey, pathItem] of Object.entries(spec.paths)) {
        if (!pathItem) continue;

        const methods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];
        for (const method of methods) {
            const operation = (pathItem as any)[method];
            if (!operation || !operation.responses) continue;

            for (const [statusCode, response] of Object.entries(operation.responses)) {
                // Check if it is a success response (2xx)
                if (!statusCode.startsWith('2')) continue;

                // 204 No Content legitimately has no body/schema
                if (statusCode === '204') continue;

                const resp = response as any;

                // If content is missing or empty, checking if it's expected?
                // For 201/200 usually we expect content.
                // If 'content' key is missing, that's a finding for 200/201 in this rule context (machine readable output)

                if (!resp.content || Object.keys(resp.content).length === 0) {
                    findings.push({
                        ruleId: "missing-success-schema",
                        title: "Missing success response schema",
                        severity: "medium",
                        impact: "Agents cannot reliably parse outputs if no schema is defined.",
                        recommendation: `Define a schema for the ${statusCode} response in ${method.toUpperCase()} ${pathKey}`
                    });
                    continue;
                }

                // If content exists, check if any media type has a schema
                // We ideally want application/json, but any structured schema is better than none.
                // Loop through content types and check for schema
                let hasSchema = false;
                for (const [mediaType, mediaValue] of Object.entries(resp.content)) {
                    if ((mediaValue as any).schema) {
                        hasSchema = true;
                        break;
                    }
                }

                if (!hasSchema) {
                    findings.push({
                        ruleId: "missing-success-schema",
                        title: "Missing success response schema",
                        severity: "medium",
                        impact: "Agents cannot reliably parse outputs if no schema is defined.",
                        recommendation: `Define a schema for the ${statusCode} response in ${method.toUpperCase()} ${pathKey}`
                    });
                }
            }
        }
    }

    return findings;
};
