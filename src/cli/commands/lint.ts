import { runRules } from "../../core/engine";

export async function lintCommand(path: string) {
    const findings = runRules();
    console.log(findings);
}
