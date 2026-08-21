# Architecture

The research separates data lineage, information timing, explanation, and
prediction. This keeps a same-week statistical relationship from being
presented as a usable next-week forecast.

## Research flow

```text
official public series
  -> immutable source register
  -> weekly cleaning and quality flags
  -> availability-aware feature table
  -> same-week OLS-HAC attribution
  -> frozen train / validation / test models
  -> chart and claim review
```

## Layers

| Layer | Responsibility | Main check |
| --- | --- | --- |
| Source register | Records institution, series, frequency, unit, coverage, and download date. | Every input has an official source page. |
| Cleaning | Converts daily and weekly series to a common Friday label without interpolation. | Dates, units, missing values, and duplicate keys are checked. |
| Availability | Stores observation and assumed availability dates separately. | A predictive feature cannot be used before its availability date. |
| Feature table | Builds returns, changes, levels, lags, and next-week targets. | One row per week; no infinite values or target leakage. |
| Attribution | Estimates same-week relationships with OLS and HAC standard errors. | Mechanically contaminated features stay out of the regression. |
| Prediction | Tunes on 2019-2021 and opens the 2022-2026 test period once. | Models are compared with simple baselines on the same rows. |
| Review | Checks charts and prose against frozen result tables. | Association, causality, forecast skill, and trading utility remain distinct claims. |

## Information-time rule

Daily market series use the last available observation in each labelled week.
The EIA inventory and production files do not provide a complete vintage release
history, so the study uses `week_date + 7 days` as a conservative availability
proxy and lags those features for prediction.

This proxy prevents an obvious look-ahead error, but it does not replace a true
point-in-time database. The limitation remains visible in every public result.

## Leakage rule

The weekly change in the Brent-WTI spread equals the Brent change minus the WTI
change. Because the target is the WTI change, including spread change in a
same-week explanatory regression would mechanically insert part of the target
into a feature. The public method excludes it from that model.

## Public boundary

The diagram describes the research shape. It omits the original database,
private directory structure, exact implementation chain, internal QA logs, and
commissioning context.
