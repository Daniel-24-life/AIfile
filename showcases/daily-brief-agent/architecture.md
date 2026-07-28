# Architecture

The diagram stops at the local review record. Source lists, generated briefs, links, scripts, and schedules are omitted.

## Layers

```text
source pool
  -> stores broad source categories and citation IDs

signal selection
  -> selects items worth summarizing for the current brief

topic grouping
  -> places selected signals into recurring sections

claim drafting
  -> turns selected facts into concise brief items

evidence review
  -> checks source class, uncertainty, and missing citations

brief assembly
  -> renders a readable brief artifact

output check
  -> verifies artifact presence and citation coverage

local review record
  -> keeps private run records outside the public repository
```

## Control Points

| Control Point | Purpose |
| --- | --- |
| Source category | Keeps official sources, media reports, social signals, and data references distinct. |
| Citation ID | Makes each brief item traceable without exposing the full source list. |
| Weak-signal flag | Marks items that rely on thin or single-source evidence. |
| Section structure | Keeps the brief readable across repeated runs. |
| Citation coverage check | Blocks briefs with missing references. |
| Output check | Confirms that generated artifacts exist before local review records are updated. |

## Public System Shape

```text
source categories
  -> selected signals
  -> topic sections
  -> cited brief items
  -> reviewed brief artifact
  -> local review record
```

## Boundary

Outside this architecture:

- real source lists and source URLs
- daily scripts and generated briefs
- personal watchlists and private judgments
- browser profiles
- recurring output history
- public news feeds, market recommendation processes, and reproducible collection workflows
