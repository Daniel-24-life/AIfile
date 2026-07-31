# Public sample

All records below are synthetic.

## Account snapshots

| Account alias | State | External-action boundary |
| --- | --- | --- |
| `acct_demo_green` | `healthy` | Checks pass, but nothing is sent |
| `acct_demo_amber` | `cautious` | Needs review |
| `acct_demo_blue` | `read_only` | Blocked |
| `acct_demo_gray` | `paused` | Blocked |

## Selected decisions

| Action ID | Account state | Action | Policy | Execution | Reason |
| --- | --- | --- | --- | --- | --- |
| `act_demo_401` | `read_only` | `classify` | `allowed` | `local_artifact_only` | none |
| `act_demo_403` | `healthy` | `send_reply` | `allowed` | `mock_queue_only` | none |
| `act_demo_404` | `cautious` | `send_reply` | `needs_review` | `review_queue` | `account_cautious` |
| `act_demo_405` | `read_only` | `send_reply` | `blocked` | `blocked` | `account_read_only` |
| `act_demo_406` | `healthy` | `move_message` | `blocked` | `blocked` | `duplicate_action` |

`mock_queue_only` means the reply passed the checks. The demo records that
result and stops. It does not send the reply.

## Run controls

```json
{
  "network_enabled": false,
  "credentials_loaded": false,
  "real_messages_read": 0,
  "real_messages_sent": 0
}
```

The sample has no real mailbox, person, company, message, or delivery result.
