# Daily Brief Skeleton

This is a small public code skeleton for daily brief review.

It includes:

- fake source records
- source class validation
- weak-signal checks
- citation coverage checks
- boundary tests

Outside this public skeleton:

- real source lists
- real URLs
- generation scripts
- browser profiles
- prompt chains
- generated HTML/PDF outputs
- private watchlists

## Run tests

```powershell
python -m pytest tests -q
```

From the repository root, run `python scripts/verify_public_packages.py` to verify every package.
