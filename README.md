# Agent-ready
"AI-Readiness” Linter for APIs, SDKs, and CLIs.

## Rules
1. Structured Error Responses Are Missing
2. Error Responses Lack Error Codes
3. Missing Response Schemas for Success
4. No Rate-Limit Retry Guidance
5. Mutating Endpoints Without Idempotency Signals
6. No Examples for Requests or Responses
7. CLI Does Not Support Structured Output
8. Destructive Operations Not Explicitly Labeled
9. Ambiguous Enum Fields (Free-Text Instead of Enum)
10. Missing Authentication Guidance for Non-Human Use
11. Inconsistent Naming Across Endpoints
12. Side Effects Not Declared in Documentation

## Scoring

| Score  | Risk level  | Meaning                 |
| ------ | ----------- | ----------------------- |
| 80–100 | Low risk    | Likely usable by agents |
| 50–79  | Medium risk | Fragile automation      |
| 0–49   | High risk   | Unsafe for autonomy     |
