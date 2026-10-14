# Logistics Workbench Demo

Hangxu is an offline reconstruction of a cross-border logistics operations desk.
All shipment records, identities, fees, integration health and AI suggestions
are invented. The interface runs locally without a model or external API.

## Run

Requires Python 3.11+ for the static server. From this directory:

```powershell
python -m http.server 4181 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4181. Node.js 22+ runs the dependency-free core tests:

```powershell
node --test tests/policy.test.cjs
```

## Walkthrough

1. Open EX-1042 and review facts, missing information and the fixed AI suggestion.
2. Approve the suggestion as the operations role and create a dispatch task.
3. Switch to dispatcher; advance the new task to execution, evidence and closure.
4. Switch to customer and inspect the filtered status view.
5. Open stale EX-1039 as an operator: direct approval remains unavailable.
6. Inspect simulated data integration, field mappings and terminal adaptations.
7. Use the demo reset action in system adaptation to restore initial data.

## Code map

| File | Role |
| --- | --- |
| [dist/index.html](dist/index.html) | Shell, role selection and detail panels. |
| [dist/styles.css](dist/styles.css) | Responsive operations UI. |
| [dist/app.js](dist/app.js) | Synthetic data, exception/task flow, filtered customer view and audit display. |
| [dist/policy.js](dist/policy.js) | Shared approval and task-action checks, used by UI and tests. |
| [tests/policy.test.cjs](tests/policy.test.cjs) | Approval authority, stale/weak evidence and terminal task states. |

## Reference boundary

Role switching is a product interaction demonstration, not authentication or
secure tenant isolation. Every static record is accessible in browser source.
Task evidence submission and verification are simulated button transitions;
there is no actual document upload, independent verification or persistent audit
store. Reloading resets in-memory business state. Confidence and fee figures are
fixture values, not measured model quality or commercial results.

The public copy adds action-level checks and closes stale panels on role changes.
It retains the original product layout. Production integration requires
server-side permissions, scoped identities, verifiable evidence and durable
state; the [architecture notes](../../../showcases/logistics-workbench/architecture.md)
separate those requirements from current behavior.
