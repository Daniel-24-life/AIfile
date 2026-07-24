# Routing Principles

The first mistake in a large AI tool setup is choosing the tool before naming the task.

My default order is:

```text
task shape -> primary skill -> boundary -> evidence -> reusable note
```

## 1. Pick One Primary Skill

Most tasks should start with one primary skill.

Secondary skills are allowed only when the task has a clear second phase. For example, a document may need content drafting first and file rendering later. Those are different jobs.

## 2. Separate Creation From Judgment

I keep these jobs separate:

| Job | Output |
| --- | --- |
| Generate | draft, plan, code, document, asset |
| Review | issues, risks, missing evidence |
| Verify | tests, scans, render checks, source checks |
| Format | document, slide, sheet, PDF, repository layout |
| Publish | commit, upload, share, deploy |

When one tool tries to do all five, mistakes become harder to see.

## 3. Define The Stop Line

Every skill needs a stop line:

- what it can decide
- what it can suggest
- what needs user review
- what it must not touch

This is especially important for file edits, public publishing, deletion, browser automation, private data, and claims about real-world results.

## 4. Use Evidence, Not Fluency

A polished answer is not completion evidence.

For serious work, I expect at least one of:

- changed file path
- diff
- rendered output
- test result
- scan result
- checklist
- review note
- handoff

## 5. Convert Repeated Use Into Rules

If a task repeats, I do not want to rediscover the route each time. The outcome should become one of:

- a routing rule
- a prompt template
- a checklist
- a concept card
- a skill candidate
- a short usage note

Reuse is the point.
