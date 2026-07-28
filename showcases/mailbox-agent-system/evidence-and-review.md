# Evidence and review

The workflow keeps message interpretation, draft preparation, approval, and action records as separate artifacts.

## Artifact classes

| Artifact | Public fields |
| --- | --- |
| Message reference | Synthetic ID, direction, attachment flag. |
| Classification record | Category, confidence state, review reason. |
| Draft record | Draft ID, source reference, approval state. |
| Policy decision | Action type, approval reference, decision, reason codes. |
| Action record | Synthetic action ID, final state, recorded time. |
| Audit event | Event type, pseudonymous reference, result. |

## Review gates

| Gate | Check | Result |
| --- | --- | --- |
| G1 Data boundary | The record contains no raw address, message body, or credential. | Continue or block. |
| G2 Classification | Unknown or conflicting signals remain marked for review. | Continue or review. |
| G3 Draft separation | A generated draft is not treated as a sent message. | Draft or block. |
| G4 Action boundary | External side effects have an approved state and approval reference. | Ready or review. |
| G5 Duplicate check | The action ID has not already been recorded. | Ready or block. |
| G6 Result record | The final state and reason codes are present. | Record or reject. |

## Public states

```text
ready
needs_review
blocked
recorded
```

## Quality rules

- Unknown classifications stay unknown.
- Drafts do not introduce facts that are absent from the source record.
- Every external action needs an approved state in the public skeleton.
- Duplicate action IDs are blocked.
- Raw addresses and message bodies do not enter public audit records.
- A local action record describes a decision, not inbox delivery.

The private validation suite covered message classification, attachment handling, approval states, retry limits, duplicate blocking, and a synthetic end-to-end run. The public skeleton narrows that work to the action boundary.
