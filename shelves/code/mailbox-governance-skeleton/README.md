# Mailbox governance skeleton

This folder contains a local policy example extracted from a larger private
mailbox agent. It has two layers:

1. the action gate checks action type, approval state, raw-content flags, and
   duplicate IDs;
2. the morning-run gate applies a precomputed account state and assigns an
   execution state.

The demo has no mailbox connection, credentials, provider configuration,
message parser, health calculator, scheduler, contact list, or transport.

## Run the demo

```powershell
python public_demo.py
```

The output is JSON. It contains four synthetic account snapshots, seven action
decisions, and explicit zero values for real reads and sends.

## Run tests

```powershell
python -m unittest discover -s tests -v
```

From the repository root, run `python scripts/verify_public_packages.py` to
verify every public package.

## Decision and execution states

| Field | Values |
| --- | --- |
| Policy state | `allowed`, `needs_review`, `blocked` |
| Execution state | `local_artifact_only`, `review_queue`, `mock_queue_only`, `blocked` |

`mock_queue_only` means the action passed the checks, but nothing is sent. No
code in this folder can send or modify a message.

## Files

| File | Contents |
| --- | --- |
| `mailbox_review/review_gate.py` | Approval, raw-content, and duplicate checks. |
| `mailbox_review/morning_run.py` | Account-state gate and deterministic demo run. |
| `public_demo.py` | JSON output entry point. |
| `tests/test_review_gate.py` | Base action-gate tests. |
| `tests/test_morning_run.py` | Account-state and execution-boundary tests. |
| `sample_action.fake.json` | Small synthetic action input. |
