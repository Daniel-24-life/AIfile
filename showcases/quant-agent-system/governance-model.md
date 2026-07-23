# Governance Model

The governance model is built around fail-closed decisions.

If evidence is missing, ambiguous, or below the required class, the system blocks readiness claims instead of upgrading them.

## Core Concepts

| Concept | Meaning |
| --- | --- |
| Plane boundary | Each subsystem has allowed and forbidden actions. |
| Evidence class | Artifacts are classified by what they can and cannot prove. |
| Promotion gate | A decision layer that blocks unsupported status escalation. |
| Research-only status | Work can continue as research without implying deployability. |
| Human approval | Protected changes require explicit review. |

## Fail-Closed Rule

```text
missing evidence -> blocked
ambiguous evidence -> blocked
dry-run evidence -> not real execution evidence
public data evidence -> not account execution evidence
research output -> not production readiness
```

## Forbidden Silent Upgrades

The system must not silently:

- promote a candidate to active use
- treat dry-run records as real execution records
- treat public data as account-level evidence
- relax validation gates
- increase risk authority
- delete failed evidence
- rewrite history to make results look cleaner

## Public Takeaway

The governance layer is the part I want readers to notice:

```text
The agent is useful because it is constrained,
not because it is allowed to do everything.
```

