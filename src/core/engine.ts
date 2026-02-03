import { Finding } from "./types";

import { structuredErrors } from "../rules/openapi/structured-errors";
import { missingDescriptions } from "../rules/openapi/missing-descriptions";

export function runRules(spec: any): Finding[] {
    const rules = [
        structuredErrors,
        missingDescriptions
    ];

    return rules.flatMap(rule => rule(spec));
}
