# AI Agent Research Governance System

This project is a sanitized public showcase of a private AI agent research system.

The core work is not a single script or model. It is a governed agent system that separates research, execution simulation, orchestration, and governance into explicit operating layers.

## What This Demonstrates

- Designing AI agents with hard operating boundaries.
- Separating research output from execution authority.
- Building fail-closed task routing instead of unrestricted automation.
- Using machine-readable policies to validate system behavior.
- Capturing evidence with manifests, checkpoints, and audit reports.
- Treating dry-run execution, public data, and real execution evidence as different classes.
- Building a research system that can improve its process without silently promoting itself.

## Audience

This showcase is written for:

- technical interviewers
- investors
- potential collaborators
- AI engineering peers

## Public Scope

This public package focuses on the engineering framework:

- architecture
- governance model
- evidence lifecycle
- dry-run execution pattern
- sanitized code skeleton

It intentionally does not disclose strategy logic, data, results, or private operating details.

## System Shape

```text
research plane
  -> proposes and evaluates ideas

execution plane
  -> models dry-run lifecycle and runtime safety

governance plane
  -> classifies evidence, blocks unsafe claims, and controls promotion

orchestrator
  -> routes one authorized task at a time under plane policy
```

## Why This Matters

Many AI agent demos show autonomy. This system emphasizes constrained autonomy.

The important engineering question is not "can the agent act?" but:

```text
Can the agent know what it is allowed to do,
prove what it did,
and fail closed when evidence is insufficient?
```

## Supporting Materials

| File | Purpose |
| --- | --- |
| `architecture.md` | System layers and responsibilities. |
| `governance-model.md` | Fail-closed governance and promotion boundaries. |
| `evidence-lifecycle.md` | How artifacts become evidence. |
| `redaction-policy.md` | What was withheld from the public version. |
| `public-code-map.md` | Where the sanitized code examples live. |

## Current Status

Status: `approved_for_public_v1`

This is a public-facing adaptation, not the original private repository.
