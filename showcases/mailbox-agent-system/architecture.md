# Architecture

The public architecture covers message handling and action control. Mailbox connections, provider settings, account policies, and delivery operations remain private.

## Layers

```text
mailbox intake
  -> receives normalized message references from an upstream private connector

message normalization
  -> converts incoming records into a stable internal shape

classification
  -> assigns a category, confidence state, and review flag

draft queue
  -> prepares a response candidate without sending it

action policy
  -> separates local analysis from external side effects

approval gate
  -> holds outbound or mailbox-changing actions for review

policy decision record
  -> records the decision without storing message bodies or contact details
```

## Control points

| Control point | Function |
| --- | --- |
| Read boundary | Keeps message intake separate from sending and mailbox changes. |
| Classification state | Preserves `unknown` when the available evidence is weak. |
| Draft boundary | Treats generated text as a candidate, not an approved reply. |
| Approval gate | Requires an approved state and reference before an external action can pass policy review. |
| Duplicate check | Refuses an action identifier that has already been recorded. |
| Audit minimization | Stores decision metadata without raw message content. |

## Public system model

```text
synthetic message reference
  -> normalized record
  -> classification result
  -> optional draft
  -> action review
  -> policy decision record
```

## Boundary

This architecture does not contain mailbox credentials, protocol endpoints, provider configurations, contact records, message bodies, writing templates, operating schedules, account limits, delivery logic, or a complete execution chain. The public gate does not establish mailbox connectivity or execute an action.
