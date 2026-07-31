# Redaction policy

The public package was rebuilt from system behavior. Source files and generated
operating records were not copied into the repository.

## Included

- generalized system layers
- four synthetic account states
- approval, duplicate, and account-state gates
- synthetic action and decision records
- a mock-only local runner
- public tests and a reconstructed dashboard

## Kept private

- mailbox addresses, contacts, threads, subjects, bodies, and attachments
- credentials, tokens, cookies, account sessions, and browser profiles
- provider settings, protocol endpoints, and transport implementation
- account-health calculations, limits, thresholds, and retry timing
- schedules, task registration, queues, and delivery operations
- approved templates, prompts, signatures, and writing style records
- allowlists, blocklists, campaigns, source lists, and business relationships
- raw logs, state stores, audit streams, HTML outputs, and output archives
- original source paths and the complete orchestration sequence

## Public substitutions

| Private material | Public replacement |
| --- | --- |
| Mailbox account | Synthetic alias such as `acct_demo_green` |
| Message or thread | Synthetic reference such as `msg_demo_401` |
| Health calculation | Precomputed state with no threshold or metric |
| Passed external action | `mock_queue_only`: approved, but not sent |
| Operational audit | Small JSON record with IDs and reason codes |
| Dashboard output | Reconstructed SVG based on the synthetic run |

The substitutions preserve the control logic needed to inspect the package.
They do not preserve production configuration or a reproducible operating
recipe.
