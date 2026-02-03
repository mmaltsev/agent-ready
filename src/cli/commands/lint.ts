import { runRules } from "../../core/engine";
import { printTextReport } from "../../report/text";
import { parseOpenApi } from "../../inputs/openapi/parser";

export async function lintCommand(path: string) {
    const spec = await parseOpenApi(path);
    const findings = runRules();
    printTextReport(findings);
}
