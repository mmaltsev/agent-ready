import { Finding, Rule } from "../../core/types";

export const noExamples: Rule = (spec: any): Finding[] => {
    const findings: Finding[] = [];

    if (!spec.paths) {
        return findings;
    }

    const methods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

    for (const [pathKey, pathItem] of Object.entries(spec.paths)) {
        if (!pathItem) continue;

        for (const method of methods) {
            const operation = (pathItem as any)[method];
            if (!operation) continue;

            // Check requestBody
            if (operation.requestBody && operation.requestBody.content) {
                for (const [mediaTypeKey, mediaValue] of Object.entries(operation.requestBody.content)) {
                    const contentObj = mediaValue as any;

                    let hasExample = false;
                    if (contentObj.example !== undefined || contentObj.examples !== undefined) {
                        hasExample = true;
                    } else if (contentObj.schema && contentObj.schema.example !== undefined) {
                        hasExample = true;
                    }

                    if (!hasExample) {
                        findings.push({
                            ruleId: "no-examples",
                            title: "No Examples for Request Body",
                            severity: "medium",
                            impact: "Increases integration friction and ambiguity.",
                            recommendation: `Add an 'example' or 'examples' field to the ${mediaTypeKey} request body in ${method.toUpperCase()} ${pathKey}`
                        });
                    }
                }
            }

            // Check responses
            if (operation.responses) {
                for (const [statusCode, response] of Object.entries(operation.responses)) {
                    const respObj = response as any;
                    if (respObj.content) {
                        for (const [mediaTypeKey, mediaValue] of Object.entries(respObj.content)) {
                            const contentObj = mediaValue as any;

                            let hasExample = false;
                            if (contentObj.example !== undefined || contentObj.examples !== undefined) {
                                hasExample = true;
                            } else if (contentObj.schema && contentObj.schema.example !== undefined) {
                                hasExample = true;
                            }

                            if (!hasExample) {
                                findings.push({
                                    ruleId: "no-examples",
                                    title: "No Examples for Response Body",
                                    severity: "medium",
                                    impact: "Increases integration friction and ambiguity.",
                                    recommendation: `Add an 'example' or 'examples' field to the ${mediaTypeKey} response for status ${statusCode} in ${method.toUpperCase()} ${pathKey}`
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    return findings;
};
