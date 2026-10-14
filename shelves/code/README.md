# Code Shelf

Sanitized code examples for policy checks, review states, and synthetic workflows.

| Code package | Focus | Tests |
| --- | --- | --- |
| [Buyer Research Demo](buyer-research-demo/) | Demand evidence gates, local JSON API and SQLite demonstration queue. | unittest |
| [Logistics Workbench Demo](logistics-workbench-demo/) | Responsive static UI and shared role/action policy. | node:test |
| [Agent Governance Skeleton](agent-governance-skeleton/) | Plane routing, evidence classes, and dry-run boundaries. | pytest |
| [Creator Discovery Skeleton](creator-discovery-skeleton/) | Field validation, review gates, and duplicate exclusion. | pytest |
| [Daily Brief Skeleton](daily-brief-skeleton/) | Source classes, citation coverage, and weak-signal review. | pytest |
| [Mailbox Governance Skeleton](mailbox-governance-skeleton/) | Action policy, approval states, and recorded-ID checks. | unittest |
| [WTI Research Audit Skeleton](wti-research-audit-skeleton/) | Information timing, target leakage, and frozen-test controls. | unittest |

Run all packages from the repository root:

```powershell
python scripts/verify_public_packages.py
```
