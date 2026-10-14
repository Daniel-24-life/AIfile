# Architecture

```text
browser workbench
  -> loopback JSON API
  -> SQLite demo queue (FIFO / pause / cancellation / request id)
  -> fixed synthetic records
  -> evidence classifier
  -> separated classes and missing checks
  -> human review / JSON export
```

## Contracts

The queue stores only task labels and state. Processing a row is one atomic
SQLite transaction. Reused request IDs return the original task; a changed
payload under the same ID is rejected. A server restart does not run tasks.

The classifier takes a normalized record and a fixed as-of date. It does not
infer missing verification values. Publication freshness and deadline validity
are distinct checks. The UI shows the resulting class and missing fields.

## Private integration boundary

An actual research runner would provide fetched source text, verified dates,
company identity, contact evidence and budgeted execution. That runner is not
in this repository. The public queue does not launch a CLI, schedule paid work,
stop external processes or retry interrupted research.

There is no implied platform affiliation. Source domains are synthetic and
non-contactable. Browser POST calls accept same-origin JSON on loopback; this is
not a hosted multi-user access-control system.
