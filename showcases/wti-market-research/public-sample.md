# Public Sample

The rows below are synthetic. They show how the research kept observation time,
availability time, model use, and review status in separate fields.

| series_role | observation_week | assumed_available_on | same_week_use | next_week_use | review_note |
| --- | --- | --- | --- | --- | --- |
| market price | 2030-01-04 | 2030-01-04 | allowed | allowed | Last valid observation in the labelled week. |
| inventory | 2030-01-04 | 2030-01-11 | descriptive only | lag required | Availability date is a conservative public proxy. |
| production | 2030-01-04 | 2030-01-11 | descriptive only | lag required | Vintage release history is not available in the package. |
| spread change | 2030-01-04 | 2030-01-04 | blocked | review required | Same-week value mechanically contains part of the target change. |

## Example review record

```json
{
  "record_type": "synthetic_research_gate",
  "target_week": "2030-01-11",
  "feature_week": "2030-01-04",
  "timing_check": "passed",
  "leakage_check": "passed",
  "split": "test",
  "allowed_action": "evaluate_frozen_model",
  "blocked_action": "retune_on_test_result"
}
```

No row is copied from the original research database.
