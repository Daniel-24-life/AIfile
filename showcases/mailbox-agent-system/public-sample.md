# Public sample

All records below are synthetic.

## Message review table

| Message ref | Direction | Category | Draft state | Next action |
| --- | --- | --- | --- | --- |
| `msg_demo_101` | inbound | scheduling | drafted | needs review |
| `msg_demo_102` | inbound | informational | not needed | none |
| `msg_demo_103` | inbound | financial | held | needs review |

## Action review table

| Action ID | Action type | Approval state | Approval ref | Duplicate | Decision |
| --- | --- | --- | --- | --- | --- |
| `act_demo_201` | `draft_reply` | `not_required` | none | false | `allowed` |
| `act_demo_202` | `send_reply` | `pending` | none | false | `needs_review` |
| `act_demo_203` | `move_message` | `approved` | `approval_demo_2` | true | `blocked` |

## Synthetic audit event

```json
{
  "event_type": "action_review",
  "action_id": "act_demo_202",
  "message_ref": "msg_demo_101",
  "decision": "needs_review",
  "reason_codes": [
    "external_action_requires_approval"
  ]
}
```

The sample does not represent a real mailbox, person, company, thread, or delivery result.
