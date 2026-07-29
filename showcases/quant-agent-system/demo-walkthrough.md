# Public demo walkthrough

The demo sends four synthetic tasks through the public router, dry-run
lifecycle, evidence classifier, and promotion gate:

```text
task router
  -> bounded plane decision
  -> optional dry-run lifecycle
  -> evidence classification
  -> release decision
```

It does not connect to an exchange, load market data, submit orders, or reproduce
private strategy research.

## Run it

From `shelves/code/agent-governance-skeleton/`:

```powershell
python public_demo.py
```

Expected decision summary:

```text
BTC QUANT AGENT SYSTEM - PUBLIC GOVERNANCE DEMO

SCENARIO                 ROUTE              RELEASE          AUTHORITY
research_candidate       allow              research_only    none
dry_run_lifecycle        allow              research_only    none
promotion_request        approval_required  blocked          none
live_request             refuse             blocked          none

real_orders_submitted=0
real_fills_recorded=0
system_status=research_only
```

Print the full decision record with:

```powershell
python public_demo.py --json
```

The repository also includes a [captured JSON run](demo-run.fake.json).

## What each scenario does

| Scenario | Route | Evidence result | Release | Reason |
| --- | --- | --- | --- | --- |
| `research_candidate` | `allow` | Research-direction claim matches a research artifact. | `research_only` | Research can continue without deployment authority. |
| `dry_run_lifecycle` | `allow` | Lifecycle and reconciliation claims match dry-run evidence. | `research_only` | The schema path completes while real order and fill flags remain false. |
| `promotion_request` | `approval_required` | The package has the required research evidence and checks. | `blocked` | The public promotion ceiling remains `research_only`. |
| `live_request` | `refuse` | No lifecycle or evidence step runs. | `blocked` | Live trading is outside the public plane policy. |

## Route and evidence decisions

The route decision answers whether a task may enter a plane.

The evidence decision answers what the resulting artifact may support.

An allowed task does not automatically create a production claim. A completed
dry-run does not become real execution evidence. Both decisions remain visible
in the output record.

## What was reconstructed

This demonstration is reconstructed from the private system's governance
patterns. Task IDs, descriptions, timestamps, and records are synthetic.

The reconstruction keeps six rules from the private system:

- tasks are routed under an explicit plane policy
- forbidden requests stop before lifecycle work
- dry-run events reconcile without real execution flags
- evidence classes limit downstream claims
- complete research evidence cannot override the public promotion ceiling
- every public scenario ends without execution authority
