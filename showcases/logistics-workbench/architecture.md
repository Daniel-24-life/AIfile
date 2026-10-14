# Architecture and reference limits

| Layer | Public implementation | Production work still required |
| --- | --- | --- |
| Input | Fixed shipment and source fixtures in JavaScript. | Authenticated adapters, source timestamps and conflict resolution. |
| Review | Facts, missing information and preset suggestions. | Grounded model output, source citations and independent evaluation. |
| Role policy | Shared browser action checks; five selectable roles. | Server-enforced identity, tenant and field scopes. |
| Tasks | In-memory transitions from pending to closed. | Durable transactions, dependencies and independent evidence checks. |
| Audit | On-page synthetic and local interaction entries. | Durable, access-controlled append-only records. |
| Customer view | Rendered external status fields. | Server-side data filtering; no internal records in customer responses. |

The shared policy checks current role, data freshness, confidence and permitted
task states. Creation also blocks duplicate tasks for an already processed
exception. Confidence is preset demonstration data, not a calibrated score.

The static demo is useful for interaction and product architecture review.
It should not be reused as an authentication or secure logistics backend.
