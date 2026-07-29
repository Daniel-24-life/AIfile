# Agent Governance Skeleton

This is a sanitized code skeleton for a governed AI agent system.

It includes:

- plane-based task routing
- fail-closed policy checks
- evidence classification
- promotion-gate evaluation
- dry-run execution lifecycle
- a runnable four-scenario demo
- boundary tests

Outside this public skeleton:

- private strategy logic
- data access code
- credentials
- experiment results
- internal run history

## Run tests

```powershell
python -m pytest tests -q
```

## Run the public demo

```powershell
python public_demo.py
```

The demo executes four synthetic scenarios through the public router, evidence
classifier, promotion gate, and dry-run lifecycle:

```text
research_candidate       -> research_only
dry_run_lifecycle        -> research_only
promotion_request        -> blocked
live_request             -> blocked
```

Use `python public_demo.py --json` for the full JSON record.
No scenario submits an order, records a real fill, or grants execution authority.

From the repository root, run `python scripts/verify_public_packages.py` to verify every package.
