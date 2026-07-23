# AI Usage Handbook

Subtitle: Turning AI reading into reusable working capability

### 1. Why I Wrote This Handbook

This handbook records how I now use AI after reading and processing materials about AI engineering, agents, harness design, loop engineering, and AI-native coding.

The practical question behind it is:

```text
After reading these AI materials, what will I do differently in my next real task?
```

My current answer: I need to place AI inside a clearer working system. That system includes goals, boundaries, context, tools, state, acceptance, and reflection. The AI output is only one part of the chain. The quality depends on the whole workflow.

### 2. Core Formula

```text
Agent = Model + Harness
```

The model reasons and generates. The harness makes the model usable in real work:

- context
- tools
- permissions
- file-based state
- checklists
- acceptance evidence
- reflection and knowledge reuse

Before asking AI to produce something important, I first design the working environment.

### 3. Task Start Template

For important tasks, I use this minimum brief:

```markdown
Goal:

Background:

Input materials:
- 

Success criteria:
- 

Allowed scope:
- 

Forbidden scope:
- 

Verification:
- 

Reusable output:
- rule / template / checklist / Skill candidate / reflection
```

For complex tasks, I ask AI to restate the goal, boundaries, and verification method before execution.

### 4. Task Levels

Different tasks need different levels of harness.

| Task Type | Example | Mode |
| --- | --- | --- |
| Simple Q&A | Explanation, translation, short rewrite | Ask directly |
| Material digestion | Articles, PDFs, reports | Structure first, then turn into actions |
| Work output | Article, plan, deck outline, portfolio note | Define audience and success criteria first |
| Code/file change | Bug fix, project cleanup, tool generation | Map repo, define scope, edit, verify |
| Long task | Multi-file, multi-round, multi-day work | Persist state, verify by stage, write handoff |
| Risk task | Deletion, batch edit, publishing, networked action | Human confirmation, path check, rollback plan |

My trigger rule:

```text
Irreversible, multi-file, externally visible, or multi-round task = stronger harness.
```

### 5. AI-Native Coding

The main lesson I kept from AI-native coding is:

```text
Code generation gets cheaper. Goals, boundaries, evidence, risk, and acceptance stay expensive.
```

My coding workflow:

1. Map the repo: understand structure, relevant files, and test entry points.
2. Cut the task: make it small enough to inspect and large enough for autonomy.
3. Write the spec: externalize goals, boundaries, and acceptance criteria.
4. Let AI execute: allow reading, editing, testing, and fixing.
5. Review at checkpoints: release, question, constrain, reroute, retry, or stop.
6. Check evidence: diff, tests, build, logs, output paths.
7. Restart when needed: use spec + handoff when the chat becomes overloaded.

### 6. Loop Engineering

Loop engineering helps me separate two questions:

```text
Harness: how should this task be done once?
Loop: how should this task keep running?
```

I do not automate too early. A task deserves a loop only when it passes four checks:

```text
1. Will this task repeat?
2. Can verification be automated or semi-automated?
3. Is the cost per run acceptable?
4. Does AI have enough tools and permissions to close the loop?
```

If not, I use:

```text
semi-automated co-working + human checkpoints
```

When mature, I consider connectors, automations, skills, worktrees, sub-agents, and state files.

### 7. Evidence Chain

Fluent output is not enough. I need evidence.

My acceptance ladder:

| Level | Evidence |
| --- | --- |
| L1 | AI explains what it did |
| L2 | Files exist at clear paths |
| L3 | Tests, build, lint, render, or scan passed |
| L4 | Independent review or second perspective |
| L5 | Real usage, monitoring, staged rollout, rollback, or user feedback |

Most ordinary tasks need L2/L3. Online, data, permission, or safety-sensitive tasks need L4/L5.

### 8. State Outside Chat

Long tasks need external state.

I move these into files:

- task spec
- current status
- decision record
- handoff
- verification report
- reusable template
- next action

This reduces stale assumptions and context pollution in long conversations.

### 9. K/S/T Knowledge System

To turn reading into capability, I split knowledge into three layers:

| Layer | Meaning | Asset |
| --- | --- | --- |
| K: Knowledge | Facts, concepts, source understanding | summaries, concept maps, knowledge cards |
| S: Standards | Roles, boundaries, delivery contracts | checklists, forbidden actions, quality gates |
| T: Tactics | Workflow, checkpoints, review loops | SOPs, task templates, handoffs |

When I read, I ask:

```text
Should this lesson become K, S, or T?
```

This helps reading flow into future work.

### 10. What Changed After This Reading Cycle

| Reading Theme | Capability Shift |
| --- | --- |
| AI-native coding | I focus more on goals, boundaries, checkpoints, and evidence. |
| Loop engineering | I now judge which tasks deserve continuous loops. |
| Harness / scaffolding | I pay more attention to context, tools, state, permissions, and acceptance. |
| Multi-agent harness | I value role separation, independent review, and recovery. |
| Model interpretability | I rely less on model self-report and more on behavior and tests. |
| Super individual / super organization | I organize personal experience into K/S/T assets. |
| Long-horizon AI development | I value proposal, review, execution, and verification as separate roles. |

### 11. My AI Capability Metrics

| Metric | Good Sign |
| --- | --- |
| Task expression | I can state goal, success criteria, and boundaries clearly. |
| Context control | I give AI less material, but more relevant material. |
| Acceptance skill | I know whether an output is usable. |
| Reflection skill | Failures become reusable rules. |
| System thinking | Repeated tasks gradually gain templates, checklists, state files, and Skill candidates. |

### 12. Next Step

This handbook should be tested in real tasks.

I will use it on:

1. Material digestion: turn a long article into framework, insight, and action.
2. Work output: turn a topic into an article, plan, or portfolio note.
3. Codex operation: run bounded file cleanup, code changes, or GitHub publishing.

After each task, I ask:

```text
Did this produce a reusable rule, template, checklist, or Skill candidate?
```

