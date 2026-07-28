# Mailbox governance skeleton

This folder contains a small policy example extracted from a larger private mailbox agent.

It reviews proposed actions and returns one of three decisions:

```text
allowed
needs_review
blocked
```

`allowed` means the metadata passed this policy gate. It does not mean the action ran or a message was delivered.

The skeleton has no mailbox connection, transport, provider configuration, message parser, scheduler, template engine, contact list, or delivery logic.

Inputs are normalized action metadata. The example checks an explicit raw-content flag and the presence of an approval reference. It does not inspect message bodies or validate approval authenticity.

## Run tests

```powershell
python -m unittest discover -s tests -v
```

From the repository root, run `python scripts/verify_public_packages.py` to verify every package.

## Files

| File | Contents |
| --- | --- |
| `mailbox_review/review_gate.py` | Action boundary and duplicate checks. |
| `tests/test_review_gate.py` | Public behavior tests. |
| `sample_action.fake.json` | Synthetic action input. |

Status: `approved_for_public_v1`
