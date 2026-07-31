# Evidence and review

The package keeps action metadata, policy decisions, and execution states as
separate fields. This prevents a policy result from being presented as mailbox
execution or delivery.

## Evidence artifacts

| Artifact | Public fields |
| --- | --- |
| Account snapshot | Synthetic alias and precomputed state. |
| Action proposal | Synthetic IDs, action type, approval state, approval reference. |
| Policy decision | `allowed`, `needs_review`, or `blocked`, plus reason codes. |
| Execution state | Kept local, waiting for review, approved but not sent, or blocked. |
| Run controls | Network, credential, real-read, and real-send indicators. |
| Run summary | Proposal and decision counts derived from the same run. |

## Review gates

| Gate | Check | Result |
| --- | --- | --- |
| G1 Input boundary | IDs and action states are known; raw content is absent. | Blocked |
| G2 Approval | External action has an approved state and approval reference. | Needs review |
| G3 Duplicate | Action ID is absent from the recorded set. | Blocked |
| G4 Account state | External action respects the supplied account state. | Review or blocked |
| G5 Execution boundary | A passed external action is recorded but never sent. | Approved, not sent |
| G6 Record completeness | Policy state, execution state, and reason codes are present. | Reject artifact |

## Decision meanings

`allowed` means the action passed the public checks. A local action stays local.
An external action is marked `mock_queue_only`, which means approved but not
sent.

`needs_review` means the proposal is retained with a reason code. The demo does
not provide an approval interface or resume execution.

`blocked` means the proposal cannot continue in the public run.

## Claims supported by the demo

The captured artifact supports these statements:

- Seven synthetic proposals entered the policy flow.
- Three passed, one needs review, and three were blocked.
- A cautious account held an approved external action for review.
- Read-only and paused accounts blocked external actions.
- A repeated action ID was blocked.
- The run loaded no credentials, used no network, and sent no messages.

It does not support claims about provider connectivity, classification quality,
response quality, inbox placement, delivery, account reputation, operating
volume, or production readiness.

## Verification

The public tests cover the base action gate and the morning-run state matrix.
The repository verifier also parses synthetic JSON, checks relative links,
checks release metadata, and scans public text for obvious credentials and
private local paths.
