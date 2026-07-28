# Mailbox governance skeleton

This folder contains a small policy example extracted from a larger private mailbox agent.

It reviews proposed actions and returns one of three decisions:

```text
ready
needs_review
blocked
```

The skeleton has no mailbox connection, transport, provider configuration, message parser, scheduler, template engine, contact list, or delivery logic.

Inputs are normalized action metadata. The example does not inspect message bodies or validate a private approval system.

## Run tests

```powershell
python -m unittest discover -s tests -v
```

## Files

| File | Contents |
| --- | --- |
| `mailbox_review/review_gate.py` | Action boundary and duplicate checks. |
| `tests/test_review_gate.py` | Public behavior tests. |
| `sample_action.fake.json` | Synthetic action input. |

Status: `approved_for_public_v1`
