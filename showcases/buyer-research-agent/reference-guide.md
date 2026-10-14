# Reference contracts

## Evidence model

| Field | Meaning | Missing value |
| --- | --- | --- |
| identity_verified | A reviewer has verified the organization. | Pending. |
| product_match | The normalized demand matches the product. | Pending. |
| contact_verified | A contact route was independently verified. | Pending. |
| source_matched | The quote was checked against source content. | Pending. |
| published_on | Publication date, not the retrieval date. | Pending. |
| closes_on | Deadline when supplied by the source. | Unknown; never inferred. |
| kind | RFQ, project opportunity or another signal. | Pending. |

The public classifier trusts the first four normalized flags. A real adapter must
produce them with source snapshots and reviewer provenance. Do not let a model
set them merely because a page or contact looks plausible. The current sample
domains cannot be contacted and all flags are fixtures.

## Local API

| Method and path | Request | Effect |
| --- | --- | --- |
| GET /api/state | None. | Synthetic records and queue snapshot. |
| POST /api/enqueue | product, request_id | Save a demo label; reused IDs are idempotent. |
| POST /api/pause | Empty JSON. | Prevent next-item processing. |
| POST /api/resume | Empty JSON. | Permit manual next-item processing. |
| POST /api/next | Empty JSON. | Complete one FIFO demo row atomically. |
| POST /api/cancel | id | Cancel only a queued row. |

Rows are queued, completed, cancelled or interrupted. A preserved running row
becomes interrupted on startup. Recovery deliberately requires manual inspection;
this demo offers no paid execution, automatic retry or interrupted-task resume.

## Extension order

1. Implement source adapters and explicit publication/deadline extraction.
2. Attach checked quotes, snapshots and contact provenance to normalized records.
3. Validate against known catalogs, stale requests and misidentified companies.
4. Add a bounded worker with budgets, confirmed cancellation and recovery events.
5. Add server identity before hosting; keep sales feedback and contacts private.

Existing tests cover the public gates and queue contracts, not the private
system's research accuracy or sales outcomes.
