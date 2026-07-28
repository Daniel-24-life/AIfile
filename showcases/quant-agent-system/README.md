# BTC Quant Agent System

![BTC quantitative research system overview](assets/system-overview.png)

The overview is a presentation graphic. The workspace counts describe one private snapshot; they are not trading results.

I built the private system for BTC quantitative research. This folder keeps the engineering structure and removes strategy logic, data, results, and execution access.

The system separates research, execution simulation, orchestration, and governance. No single agent receives authority over the whole chain.

## Work Included

- plane-based task routing
- separate research and execution authority
- machine-readable policy checks
- evidence classes for public data, dry runs, and audited work
- manifests, checkpoints, and decision records
- human approval for protected changes

## Public Scope

This folder focuses on the engineering framework:

- architecture
- governance model
- evidence lifecycle
- dry-run execution pattern
- sanitized code skeleton

Strategy logic, data, results, and private operating details stay outside this public package.

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

## Engineering Question

The system has to answer three questions before an action moves forward:

```text
Can the agent know what it is allowed to do,
record what it did,
and fail closed when evidence is insufficient?
```

## Supporting Materials

| File | Purpose |
| --- | --- |
| [Architecture](architecture.md) | System layers and responsibilities. |
| [Governance Model](governance-model.md) | Fail-closed governance and promotion boundaries. |
| [Evidence Lifecycle](evidence-lifecycle.md) | How artifacts become evidence. |
| [Synthetic Evidence Record](evidence-sample.fake.json) | A fake route and claim-classification result. |
| [Public Code Map](public-code-map.md) | Where the sanitized code examples live. |
| [Redaction Policy](redaction-policy.md) | What stays out of the public folder. |

## Current Status

Status: `approved_for_public_v1`
