# Governance Notes

This playbook treats skill use as a small governance problem.

The goal is not to make tool selection complex. The goal is to stop hidden role mixing.

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
- public-scope check before upload
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

This note stays at the method layer.

It explains how I think about routing, boundaries, evidence, and reuse. The full working environment behind those decisions stays outside the repository.
