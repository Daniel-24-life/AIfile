# Governance Notes

I treat skill selection as a small governance problem.

I keep tool selection simple and make role changes visible.

## Common Failure Modes

| Failure Mode | What Goes Wrong |
| --- | --- |
| Tool-first routing | The tool is chosen for appeal; the task fit is unclear. |
| Role mixing | One skill drafts, reviews, formats, and publishes without checkpoints. |
| Hidden escalation | A local edit turns into upload, deletion, browser action, or broad refactor. |
| Weak evidence | The task is accepted because the AI says it is done. |
| No reuse | The same routing decision is rediscovered every time. |

## Guardrails

For important tasks, I use these guardrails:

- one primary skill at a time
- explicit scope
- visible evidence
- user checkpoint before public release
- public-scope check before release
- reusable note after completion

## When Something Becomes A Skill Candidate

A repeated workflow may deserve its own skill when:

- the task happened several times
- inputs have a stable shape
- outputs have a stable format
- failure modes are predictable
- verification is clear
- the process can be explained briefly

Until then, a checklist is usually enough.

## Public Boundary

The note covers routing, boundaries, evidence, and reuse. My task history, local configuration, and complete tool setup stay outside the repository.
