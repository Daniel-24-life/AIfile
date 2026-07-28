# Evidence and review

The workflow keeps message interpretation, draft preparation, approval, and action records as separate artifacts.

## Artifact classes

| Artifact | Public fields |
| --- | --- |
| Message reference | Synthetic ID, direction, attachment flag. |
| Classification record | Category, confidence state, review reason. |
| Draft record | Draft ID, source reference, approval state. |
| Policy decision | Action type, approval reference, decision, reason codes. |
| Decision record | Synthetic action ID, review state, recorded time. |
| Audit event | Event type, pseudonymous reference, result. |

## Review gates

| Gate | Check | Result |
| --- | --- | --- |
| G1 Data boundary | Normalized action metadata carries no raw address, message body, or credential. | Continue or block. |
| G2 Classification | Unknown or conflicting signals remain marked for review. | Continue or review. |
| G3 Draft separation | A generated draft is not treated as a sent message. | Draft or block. |
| G4 Action boundary | External side effects have an approved state and approval reference. | Allow or review. |
| G5 Duplicate check | The action ID has not already been recorded. | Allow or block. |
| G6 Decision record | The review decision and reason codes are present. | Record or reject. |

## Review decisions

```text
allowed
needs_review
blocked
```

The decision record is a separate artifact. Its presence does not indicate that an action ran or a message was delivered.

## Quality rules

- Unknown classifications stay unknown.
- Drafts do not introduce facts that are absent from the source record.
- Every external action needs an approved state and approval reference in the public skeleton.
- Duplicate action IDs are blocked.
- Raw addresses and message bodies do not enter public audit records.
- A policy decision record describes the review result, not inbox delivery.

The public gate checks an explicit raw-content flag. Content detection and normalization happen upstream and are outside this package. It checks that an approval reference is present; approval authenticity belongs to the private approval system.

The public tests cover approval states, explicit raw-content flags, recorded action IDs, unknown actions, and inconsistent local approval states. The skeleton remains limited to the action boundary.
