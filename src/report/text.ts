import { Finding } from "../core/types";

export function printTextReport(findings: Finding[]) {
    for (const f of findings) {
        console.log(`❌ [${f.severity.toUpperCase()}] ${f.title}`);
        console.log(`   Impact: ${f.impact}`);
        console.log(`   Recommendation: ${f.recommendation}\n`);
    }
}
