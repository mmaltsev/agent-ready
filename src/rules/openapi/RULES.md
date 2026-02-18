# Agent-ready Rules

## 1. Structured Error Responses Are Missing
ID: `structured-errors`

Severity: High

Goal: Detect
* Non-2xx responses without a schema
* Error responses that are just string
* No consistent error object shape

Reason: Agents need machine-readable error codes to recover.

Impact: Agents cannot recover autonomously from failures, increasing operational risk.

## 2. Missing Parameter Description
ID: `missing-parameter-description`

Severity: Medium

Goal: Detect missing description or summary in operations, parameters, request body, and response schemas.

Reason: Agents may not understand how to provide correctly formatted input.

Impact: Increases integration friction and ambiguity.

## 3. Missing Operation Description
ID: `missing-operation-description`

Severity: Medium

Goal: Detect missing description or summary in operations, parameters, request body, and response schemas.

Reason: Agents may not understand what this operation does.

Impact: Increases integration friction and ambiguity.

## 4. Missing Property Description
ID: `missing-property-description`

Severity: Low

Goal: Detect missing description or summary in operations, parameters, request body, and response schemas.

Reason: Agents may hallucinate meaning of properties without descriptions.

Impact: Increases integration friction and ambiguity.

## 5. Error Responses Lack Error Codes
ID: `OPENAPI_ERROR_NO_CODE_FIELD`

Severity: High

Goal: Detect error schema exists but no code or similar machine-readable identifier.

Reason: Free-text error messages are not deterministic.

Impact: Failures become ambiguous and harder to automate.

## 6. Missing Response Schemas for Success
ID: `OPENAPI_MISSING_SUCCESS_SCHEMA`

Severity: Medium

Goal: Detect 2xx responses without explicit schema definitions.

Reason: Agents cannot reliably parse outputs.

Impact: Automation becomes brittle due to unclear output structure.

## 7. No Rate-Limit Retry Guidance
ID: `OPENAPI_NO_RETRY_HINT`

Severity: Medium

Goal: Detect 429 responses without:
* Retry-After
* Retry guidance in schema or headers

Reason: Agents need retry semantics to avoid cascading failure.

Impact: Agents may retry aggressively or fail permanently.

## 8. Mutating Endpoints Without Idempotency Signals
ID: `OPENAPI_NO_IDEMPOTENCY_HINT`

Severity: High

Goal: POST/PUT/PATCH endpoints have
* No idempotency key header
* No documentation hint of retry safety

Reason: Autonomous systems retry. Without idempotency, duplicates happen.

Impact: Risk of duplicated side effects (billing, provisioning, emails).

## 9. No Examples for Requests or Responses
ID: `OPENAPI_NO_EXAMPLES`
Severity: Medium

Goal: Detect missing example or examples in request/response bodies.

Reason: Agents perform better when given canonical examples.

Impact: Increases integration friction and ambiguity.

## 10. CLI Does Not Support Structured Output
ID: `CLI_NO_STRUCTURED_OUTPUT`
Severity: High

Goal: Detect no --json, --output json, etc.

Reason: Free-text CLI output is fragile.

Impact: CLI cannot be reliably used in automation loops.

## 11. Destructive Operations Not Explicitly Labeled
ID: `OPENAPI_DESTRUCTIVE_NOT_FLAGGED`

Severity: Medium

Goal: Detect DELETE endpoints without clear documentation.

Reason: Agents need clear blast-radius awareness.

Impact: Increased risk in autonomous workflows.

## 12. Ambiguous Enum Fields (Free-Text Instead of Enum)
ID: `OPENAPI_STRING_INSTEAD_OF_ENUM`

Severity: Medium

Goal: Detect fields like status, type, mode as free string instead of enum.

Reason: Agents perform worse with unconstrained strings.

Impact: Increases variability and failure rates.

## 13. Missing Authentication Guidance for Non-Human Use
ID: `DOCS_NO_SERVICE_ACCOUNT_GUIDANCE`

Severity: Medium

Goal: Detect no mention of
* API keys
* Service accounts
* Token examples

Reason: Agents are not humans.

Impact: Increased friction for automation and platform adoption.

## 14. Inconsistent Naming Across Endpoints
ID: `OPENAPI_INCONSISTENT_RESOURCE_NAMING`

Severity: Medium

Goal: Detect mix of:

project_id
projectId
id_project

Reason: Agents depend on pattern recognition.

Impact: Increases cognitive and integration complexity.

## 15. Side Effects Not Declared in Documentation
ID: `OPENAPI_UNDECLARED_SIDE_EFFECTS`

Severity: Medium

Goal: Detect endpoints that:
* Trigger async processes
* Send emails
* Trigger webhooks
But not documented clearly.

Reason: Agents can’t predict impact.

Impact: High operational risk in autonomous execution.