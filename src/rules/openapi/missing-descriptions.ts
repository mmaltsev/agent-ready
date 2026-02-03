import { Finding, Rule } from "../../core/types";

export const missingDescriptions: Rule = (spec: any): Finding[] => {
    const findings: Finding[] = [];

    if (!spec.paths) return findings;

    for (const [pathKey, pathItem] of Object.entries(spec.paths)) {
        if (!pathItem) continue;

        const methods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];
        for (const method of methods) {
            const operation = (pathItem as any)[method];
            if (!operation) continue;

            // Check operation description
            if (!operation.description && !operation.summary) {
                findings.push({
                    ruleId: "missing-operation-description",
                    title: "Missing operation description",
                    severity: "medium",
                    impact: "Agents may not understand what this operation does.",
                    recommendation: `Add a description or summary to ${method.toUpperCase()} ${pathKey}`
                });
            }

            // Check parameters
            if (operation.parameters && Array.isArray(operation.parameters)) {
                operation.parameters.forEach((param: any, index: number) => {
                    // Start simple: just check if description exists and is non-empty string
                    if (!param.description) {
                        findings.push({
                            ruleId: "missing-parameter-description",
                            title: "Missing parameter description",
                            severity: "medium",
                            impact: "Agents may not understand how to provide correctly formatted input.",
                            recommendation: `Add a description to parameter '${param.name || index}' in ${method.toUpperCase()} ${pathKey}`
                        });
                    }
                });
            }

            // Check request body
            if (operation.requestBody && operation.requestBody.content) {
                for (const [mediaType, mediaContent] of Object.entries(operation.requestBody.content)) {
                    const schema = (mediaContent as any).schema;
                    if (schema) {
                        checkSchema(schema, `requestBody (${mediaType})`, method.toUpperCase(), pathKey, findings);
                    }
                }
            }

            // Check responses
            if (operation.responses) {
                for (const [statusCode, response] of Object.entries(operation.responses)) {
                    const resp = response as any;
                    if (resp.content) {
                        for (const [mediaType, mediaContent] of Object.entries(resp.content)) {
                            const schema = (mediaContent as any).schema;
                            if (schema) {
                                checkSchema(schema, `response ${statusCode} (${mediaType})`, method.toUpperCase(), pathKey, findings);
                            }
                        }
                    }
                }
            }
        }
    }

    return findings;
};

function checkSchema(schema: any, location: string, method: string, path: string, findings: Finding[]) {
    // Basic check for object properties descriptions
    // We could recurse, but let's stick to top-level properties for MVP or shallow recursion.

    if (schema.properties) {
        for (const [propName, propSchema] of Object.entries(schema.properties)) {
            const prop = propSchema as any;
            if (!prop.description) {
                findings.push({
                    ruleId: "missing-property-description",
                    title: "Missing property description",
                    severity: "low",
                    impact: "Agents may hallucinate meaning of properties without descriptions.",
                    recommendation: `Add a description to property '${propName}' in ${location} of ${method} ${path}`
                });
            }
        }
    }
}
