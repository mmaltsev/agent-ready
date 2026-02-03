#!/usr/bin/env node

import { Command } from "commander";
import { lintCommand } from "./commands/lint";

const program = new Command();

program
    .command("lint <path>")
    .description("Check AI-readiness of your API")
    .action(lintCommand);

program.parse();

