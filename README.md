# AIfile

AIfile is where I keep the parts of my AI work that can be shown in public.

I do not upload the original workspaces. Each project is rebuilt around four things I can disclose safely: the system shape, the rules I used, a synthetic evidence record, and a small piece of code when the code can stand on its own.

## Project Map

| Project | Operating loop | Evidence artifact | Supporting material |
| --- | --- | --- | --- |
| [Quant Agent System](showcases/quant-agent-system/) | Research task -> governed evidence decision. | [Synthetic governance record](showcases/quant-agent-system/evidence-sample.fake.json) | [Agent governance skeleton](shelves/code/agent-governance-skeleton/) |
| [AIGC Video Production Pipeline](showcases/aigc-video-production-pipeline/) | Creative brief -> review-ready production package. | [Synthetic shot review](showcases/aigc-video-production-pipeline/shot-review-sample.md) | [Workflow and QA](showcases/aigc-video-production-pipeline/workflow.md) |
| [Creator Discovery Pipeline](showcases/creator-discovery-pipeline/) | Public signals -> reviewed handoff table. | [Synthetic review record](showcases/creator-discovery-pipeline/review-sample.fake.json) | [Creator review skeleton](shelves/code/creator-discovery-skeleton/) |
| [Daily Brief Agent](showcases/daily-brief-agent/) | Source pool -> citation-reviewed brief. | [Synthetic brief review](showcases/daily-brief-agent/brief-review-sample.fake.json) | [Daily brief skeleton](shelves/code/daily-brief-skeleton/) |
| [Mailbox Governance Agent](showcases/mailbox-agent-system/) | Proposed mailbox action -> policy decision record. | [Synthetic decision record](showcases/mailbox-agent-system/decision-sample.fake.json) | [Mailbox governance skeleton](shelves/code/mailbox-governance-skeleton/) |
| [AI Skill Routing Playbook](shelves/skills/ai-skill-routing-playbook/) | Task intent -> bounded and verified route. | [Worked routing example](shelves/skills/ai-skill-routing-playbook/worked-routing-example.md) | Method playbook |
| [AI Workflow Learning System](shelves/understanding/ai-workflow-learning-system/) | Reading insight -> tested workflow rule. | [Application record](shelves/understanding/ai-workflow-learning-system/application-record.md) | [Chinese handbook](shelves/understanding/ai-workflow-learning-system/AI使用手册.md) / [English handbook](shelves/understanding/ai-workflow-learning-system/AI-Usage-Handbook.md) |

## Operating Pattern

```text
problem definition
  -> system model
  -> bounded execution
  -> evidence artifact
  -> human review
  -> release decision
  -> reusable rule
```

The public code concentrates on boundaries and review gates. It is intentionally smaller than the private systems and uses synthetic inputs.

## Verification

Install the test dependency and run every public code package from the repository root:

```powershell
python -m pip install -r requirements-dev.txt
python scripts/verify_public_packages.py
```

The verification entry runs each package in its own working directory and validates every `*.fake.json` artifact. GitHub Actions runs the same command on pushes and pull requests.

## Repository Layout

| Path | Contents |
| --- | --- |
| [showcases/](showcases/) | Project narratives, architecture, boundaries, and evidence samples. |
| [shelves/code/](shelves/code/) | Sanitized code skeletons and tests. |
| [shelves/skills/](shelves/skills/) | AI routing and workflow playbooks. |
| [shelves/understanding/](shelves/understanding/) | Handbooks, application records, and concept cards. |
| [catalog/](catalog/) | Portfolio inventory and classification. |

## Publication Boundary

Public packages may include system structure, generalized rules, synthetic records, tests, and reconstructed examples.

They exclude credentials, accounts, real contacts, private source lists, strategy formulas, production prompts, raw logs, real transaction or campaign data, complete automation chains, and private business relationships.
