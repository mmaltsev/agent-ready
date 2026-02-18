import { Finding, Rule } from "../../core/types";

export const errorNoCodeField: Rule = (spec: any): Finding[] => {
    const findings: Finding[] = [];

    if (!spec.paths) {
        return findings;
    }

    const errorIdentifierFields = ['code', 'error_code', 'type', 'status', 'id'];

    for (const [pathKey, pathItem] of Object.entries(spec.paths)) {
        if (!pathItem) continue;

        const methods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];
        for (const method of methods) {
            const operation = (pathItem as any)[method];
            if (!operation || !operation.responses) continue;

            for (const [statusCode, response] of Object.entries(operation.responses)) {
                // Check for non-2xx responses (4xx, 5xx)
                if (statusCode.startsWith('2')) continue;

                // Skip 3xx as well, usually redirects
                if (statusCode.startsWith('3')) continue;

                const resp = response as any;

                // If it's a ref, we skip for now ( MVP limitation mentioned in other rules)
                // In a real full impl we'd resolve refs. 
                // Here we check inline content.

                if (!resp.content) continue;

                const content = resp.content;
                // Check 'application/json' or default to first one if json not found?
                // Usually errors are JSON.
                const jsonContent = content['application/json'];
                if (!jsonContent || !jsonContent.schema) continue;

                const schema = jsonContent.schema;
                const properties = schema.properties || {};

                // Check if any of the identifier fields exist in properties
                const hasIdentifier = errorIdentifierFields.some(field => Object.keys(properties).includes(field));

                if (!hasIdentifier) {
                    findings.push({
                        ruleId: "error-no-code-field",
                        title: "Error response lacks machine-readable code",
                        severity: "high",
                        impact: "Agents cannot reliably handle errors without a deterministic error code.",
                        recommendation: `Add a 'code', 'error_code', 'type', or 'status' field to the error schema in ${statusCode} response for ${method.toUpperCase()} ${pathKey}`
                    });
                }
            }
        }
    }

    return findings;
};
