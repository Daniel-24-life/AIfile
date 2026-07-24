# Architecture

The public architecture keeps the pipeline shape visible while leaving real accounts, data sources, search terms, thresholds, and scripts out.

## Layers

```text
task intake
  -> defines target segment, output format, exclusions, and review standard

seed management
  -> keeps source ideas separate from reviewed candidates

candidate discovery
  -> collects possible accounts through controlled discovery paths

normalization
  -> standardizes handles, links, fields, and status values

deduplication
  -> blocks existing, repeated, invalid, or excluded accounts

profile review
  -> checks fit, activity, contactability, region confidence, and risk notes

handoff packaging
  -> separates approved, review-needed, excluded, and source-trace tables
```

## Control Points

| Control Point | Purpose |
| --- | --- |
| Intake brief | Fixes the target, scope, and output shape before collection begins. |
| Exclusion load | Stops repeated collection and protects existing relationship lists. |
| Candidate normalization | Converts noisy profile links into stable review keys. |
| Evidence gate | Prevents uncertain fields from becoming claims. |
| Human review | Keeps final decisions separate from automated discovery. |
| Handoff packaging | Turns the working pool into a clean, reviewable artifact. |

## Public System Shape

```text
brief
  -> seeds
  -> candidate pool
  -> normalized profile records
  -> deduplicated review queue
  -> reviewed lead table
  -> handoff workbook
```

## Boundary

This architecture does not include platform selectors, browser profiles, account sessions, exact queries, real handles, real contact fields, private thresholds, or workbook exports.
