# WTI research audit skeleton

This small package reconstructs three controls from the private research
workflow with synthetic records only:

1. a feature must be available by the model's `as_of_date`;
2. a feature that mechanically contains the target is blocked;
3. a formal test run requires a frozen configuration and rejects retuning.

It does not download market data, calculate the published results, fit a model,
or contain the original feature definitions and thresholds.

## Run the demo

```powershell
python public_demo.py
```

The output is a deterministic JSON decision for the bundled fake input.

## Run tests

```powershell
python -m unittest discover -s tests -v
```

From the repository root, run `python scripts/verify_public_packages.py` to
verify every public package.

## Decision states

| State | Meaning |
| --- | --- |
| `passed` | Every timing, leakage, and frozen-test check passed. |
| `blocked` | At least one fail-closed rule rejected the run. |

## Files

| File | Contents |
| --- | --- |
| `research_audit/audit.py` | Timing, leakage, and test-freeze checks. |
| `public_demo.py` | JSON demo entry point. |
| `sample_input.fake.json` | Synthetic model-run record. |
| `tests/test_audit.py` | Boundary and deterministic-output tests. |
