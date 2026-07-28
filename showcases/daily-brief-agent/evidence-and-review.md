# Evidence and Review

The workflow used evidence labels to keep a daily brief from becoming a pile of unsupported summaries.

## Evidence Classes

| Evidence Class | Public Meaning | Example Public Field |
| --- | --- | --- |
| Official source | Primary announcement, filing, schedule, or institutional page. | `official` |
| Mainstream report | Report from a major media outlet or wire service. | `media` |
| Social signal | Post or social update that needs extra caution. | `social_signal` |
| Market or data reference | Market close, calendar, index, or statistical source. | `data_reference` |
| Discovery source | Lead source used to find an item, not enough by itself. | `discovery` |

## Review Gates

| Gate | Check | Outcome |
| --- | --- | --- |
| G1 Source Class | Every item has a source class. | Keep or review. |
| G2 Citation Coverage | Every claim references at least one source ID. | Keep or block. |
| G3 Weak Signal Flag | Social or discovery-only items are marked. | Keep with warning or review. |
| G4 Section Fit | Items are placed under a stable brief section. | Keep or move. |
| G5 Output Check | Rendered artifacts exist and are not empty. | Accept locally or rerun. |

## Acceptance States

```text
ready
needs_review
blocked
```

## Quality Rules

- A discovery source is not treated as final evidence by itself.
- Social signals carry a warning label unless confirmed elsewhere.
- Missing citations block the brief.
- Source categories stay visible in the source table.
- Output success is checked before the result is accepted.
- Personal interpretation stays separate from source-backed facts.
- The public package avoids real source names, real links, and continuous date history.

## Synthetic Records

Public samples use fake source IDs, fake titles, fake URLs, and simplified categories.

No sample brief item is copied from a real daily output.
