# Evidence And Review

The project used review gates to separate raw collection from usable handoff material.

## Evidence Classes

| Evidence Class | Public Meaning | Example Public Field |
| --- | --- | --- |
| Discovery trace | Where a candidate entered the pool. | `source_type` |
| Identity check | Whether the profile appears to match the target segment. | `profile_fit_status` |
| Activity check | Whether recent work supports review. | `activity_status` |
| Contactability check | Whether a public contact path is visible. | `contact_status` |
| Risk note | Why a candidate needs review or exclusion. | `risk_note` |
| Review state | How the record should be handled next. | `review_state` |

## Review Gates

| Gate | Check | Outcome |
| --- | --- | --- |
| G1 Deduplication | The candidate is new to the current batch and exclusion set. | Keep, block, or review. |
| G2 Profile Fit | The profile appears relevant to the target creator segment. | Approve, review, or exclude. |
| G3 Activity | Recent public activity supports the classification. | Approve or review. |
| G4 Contactability | A public contact route is visible or clearly absent. | Mark contact status. |
| G5 Handoff Quality | Required fields are present and uncertainty is explicit. | Ready or needs cleanup. |

## Acceptance States

```text
approved
review_needed
excluded
source_only
```

## Quality Rules

- Empty evidence stays empty.
- Unknown values are marked as unknown.
- Contact fields use fake examples in the public package.
- Exclusion hits are blocked before profile review.
- Final handoff tables separate approved records from review-needed records.
- Risk notes explain missing fields, conflicts, or uncertainty.

## Public Sample Policy

Public samples use fake names, fake links, fake contact fields, fake segment labels, and simplified status values.

No sample row is copied from a real workbook.
