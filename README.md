# AIfile

AIfile is a public portfolio library for code, skills, articles, project results, notes, and working ideas.

It is managed as a curated library, not as a raw file dump. Each public item should be selected, summarized, classified, and connected to a clear reason for why it matters.

## How To Read This Repository

Start with `showcases/` when you want to understand finished work.

Use `shelves/` when you want to inspect the reusable parts behind those works: code, skills, articles, and thinking frameworks.

Use `catalog/` when you want the index, tags, metadata, and librarian notes.

## Shelves

| Path | Use |
| --- | --- |
| `showcases/` | Main entry points for finished or presentable works. |
| `catalog/` | Indexes, tags, metadata, and librarian notes. |
| `inbox/` | Temporary landing area for unsorted items. |
| `shelves/code/` | Code, scripts, prototypes, and engineering results. |
| `shelves/skills/` | Codex skills, prompts, agent workflows, reusable procedures. |
| `shelves/articles/` | Essays, article drafts, public writing, polished notes. |
| `shelves/understanding/` | Concept maps, frameworks, reading notes, and personal knowledge structures. |

## Portfolio Rule

Do not upload everything by default. Select, summarize, classify, then publish.

Every major work should have one clear public entrance:

```text
showcases/<work-name>/README.md
```

That entrance should explain:

- what the work is
- who it is for
- what problem it addresses
- what parts are public
- what parts are intentionally withheld or sanitized
- where the supporting code, article, skill, or framework lives

## Recommended Work Layout

Use this pattern for substantial works:

```text
showcases/<work-name>/
  README.md
  architecture.md
  public-notes.md

shelves/code/<work-name-or-component>/
shelves/articles/<related-writeup>.md
shelves/skills/<related-workflow>/
shelves/understanding/<related-framework>.md
```

The showcase is the front door. The shelves hold the reusable materials.

## Item Metadata

Each meaningful item should include:

- title
- type
- source or origin
- status
- short abstract
- tags
- next action

## Current Status

The repository is initialized as a portfolio library. Content is added deliberately, one curated batch at a time.
