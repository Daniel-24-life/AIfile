# Public Code Map

The public code examples live under:

```text
shelves/code/agent-governance-skeleton/
```

## Included examples

| File | Demonstrates |
| --- | --- |
| `orchestrator/task_router.py` | Fail-closed task routing and plane policy checks. |
| `governance/evidence_classifier.py` | Evidence classes and forbidden claim checks. |
| `governance/promotion_gate.py` | Required evidence, stage order, human approval, and public status ceiling. |
| `execution/dryrun_lifecycle.py` | Dry-run intent/event/reconciliation pattern. |
| `public_demo.py` | Four synthetic scenarios and their release decisions. |
| `tests/test_governance_boundaries.py` | Tests for blocked claims and safe routing. |
| `tests/test_public_demo.py` | Tests for the public run, zero execution authority, and blocked live requests. |

## Boundary

These files are sanitized examples derived from system patterns.

They are not a drop-in copy of the private system and do not contain private strategy logic or data access code.
