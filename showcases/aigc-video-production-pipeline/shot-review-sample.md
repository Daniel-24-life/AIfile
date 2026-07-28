# Synthetic Shot Review Package

The table keeps the structure of a three-unit visual review. All names, assets, and decisions are synthetic.

## Review Table

| Unit | Narrative role | Candidate asset | Continuity | Composition | Package state |
| --- | --- | --- | --- | --- | --- |
| `scene_a_01` | establish location | `asset_demo_01` | pass | pass | selected |
| `scene_a_02` | introduce subject | `asset_demo_02` | review | pass | held |
| `scene_a_03` | close the sequence | `asset_demo_03` | pass | crop issue | revise |

## Decision Records

```text
asset_demo_01
decision: selected
reason: visual intent and package dimensions match

asset_demo_02
decision: held
reason: subject details drift from the previous unit

asset_demo_03
decision: revise
reason: export crop removes part of the focal area
```

## Package Check

| Check | Result |
| --- | --- |
| Every unit has a narrative role | pass |
| Candidate and selected states are separate | pass |
| Continuity exceptions are visible | pass |
| Export crop issue is resolved | pending |
| Package release state | held |

The record contains no original prompt, source asset, submission material, or production path.
