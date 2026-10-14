# Buyer Research Demo

Offline reference implementation of demand classification and a local task queue.
The UI uses four fixed synthetic lighting records. Changing the product input
changes the queue label, not the evidence or research result.

## Run

Requires Python 3.11 or later; no package installation, credentials, or model.
From this directory:

```powershell
python server.py
```

Open http://127.0.0.1:4182 in a browser. Optional: `python server.py --port 4184`.
The server binds to loopback. SQLite data stays in ignored `.runtime/`.

## Try it

1. Add two demo tasks, pause the queue, and confirm that processing is disabled.
2. Resume and complete one task at a time; the first queued task finishes first.
3. Cancel an unprocessed task. Restart the server and inspect persisted states.
4. Filter demand classes and open a record's quote, dates, and missing evidence.
5. Export synthetic JSON. All source domains end in `.invalid`.

## Code map

| File | Role |
| --- | --- |
| [core.py](core.py) | Evidence gates, fixed-date classification, SQLite queue and idempotency. |
| [server.py](server.py) | Loopback-only JSON API and an explicit static-file allowlist. |
| [sample.fake.json](sample.fake.json) | Four invented records; verification flags are preset, not fetched. |
| [dist/app.js](dist/app.js) | Filters, queue actions, evidence detail and JSON export. |
| [tests/test_core.py](tests/test_core.py) | Missing/future/expired evidence, FIFO, pause, cancellation and restart. |

```powershell
python -B -m unittest discover -s tests -v
```

## Limits

An explicit request requires identity, product, contact, matched quote, a recent
publication date and an unexpired deadline. A project signal stays an opportunity.
Missing checks and product catalogs stay pending. Procurement authority remains
unknown and no outreach is sent.

This smaller classifier accepts normalized verification flags. It does not fetch
or authenticate evidence, evaluate product compliance, discover real buyers, run
CLI research, produce real Excel reports, or reproduce private scoring rules.
Queue processing completes a local demonstration row in one transaction; it is
not a background worker. Interrupted rows are preserved for inspection and are
not automatically retried. Add authenticated server-side permissions, source
verification and a bounded worker before considering a production adaptation.

See the [case study](../../../showcases/buyer-research-agent/).
