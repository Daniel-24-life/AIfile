# Governance Model

The governance model is built around fail-closed decisions.

If evidence is missing, ambiguous, or below the required class, the system blocks readiness claims.

## Core concepts

| Concept | Meaning |
| --- | --- |
| Plane boundary | Each subsystem has allowed and forbidden actions. |
| Evidence class | Artifacts are classified by what they can and cannot prove. |
| Promotion gate | A decision layer that blocks unsupported status escalation. |
| Research-only status | Work can continue as research without implying deployability. |
| Human approval | Protected changes require explicit review. |

## Fail-closed rule

```text
missing evidence -> blocked
ambiguous evidence -> blocked
dry-run evidence -> not real execution evidence
public data evidence -> not account execution evidence
research output -> not production readiness
```

## Forbidden silent upgrades

The system must not silently:

- promote a candidate to active use
- treat dry-run records as real execution records
- treat public data as account-level evidence
- relax validation gates
- increase risk authority
- delete failed evidence
- rewrite history to make results look cleaner

## Public promotion gate

The public evaluator uses this status order:

```text
research_only
  -> candidate
  -> paper_shadow
  -> paper_trade
  -> small_live
  -> scaled_live
```

The evaluator checks stage order, required evidence classes, required checks,
human approval, and the current promotion ceiling.

The public ceiling is fixed at `research_only`. A synthetic candidate package
can contain every required research artifact and still be blocked from
promotion. The gate returns the blocker rather than changing status.

## Constraint

The governance layer keeps every action inside an evidence boundary:

```text
The agent is useful because it is constrained
and because every action has evidence boundaries.
```
