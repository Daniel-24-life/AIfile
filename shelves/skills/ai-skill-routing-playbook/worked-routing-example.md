# Worked Routing Example

## Task

Prepare a sanitized mailbox workflow for a public repository.

## Route

| Phase | Primary role | Allowed work | Stop condition |
| --- | --- | --- | --- |
| Inventory | Repository review | Read candidate files and map sensitive fields. | No file movement or upload. |
| Rewrite | Technical editing | Rebuild the public architecture and fake examples. | No original data, prompt chain, or transport code. |
| Boundary review | Independent review | Check claims, ambiguous states, and reproducibility risk. | Findings stay outside public artifacts. |
| Verification | Code and document checks | Run tests, scan paths, inspect the staged diff. | Block on unknown state or private identifier. |
| Publishing | Release workflow | Commit only the approved public package. | User approval required before push. |

## Decision Record

```text
primary route: repository publishing
secondary route: technical review
execution boundary: two named public directories
verification: unit tests + terminology scan + staged-file inspection
publication authority: user approval
```

## Reusable Rule

A public release task needs separate inventory, rewrite, review, verification, and publishing phases. The publishing phase does not inherit authority from the editing phase.
