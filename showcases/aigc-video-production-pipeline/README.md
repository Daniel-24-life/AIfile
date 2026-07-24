# AIGC Video Production Pipeline

This showcase summarizes a private AIGC video production project as a public workflow case.

The project produced a short AI-generated video and a managed production package around it: shot planning, prompt tracking, visual asset review, document packaging, and submission readiness checks.

In this context, "production package" means the material needed to explain, inspect, and hand off the work. It is separate from the video file itself.

## Contents

This package covers:

- translating a creative brief into a production workflow
- tracking visual generation work across shots and assets
- turning prompts and review notes into structured artifacts
- packaging review materials into documents and spreadsheets
- using quality checks before final delivery

The scope stays at workflow design, project organization, and quality control.

## Public Model

```mermaid
flowchart LR
    A["Creative Brief"] --> B["Shot Plan"]
    B --> C["Prompt Archive"]
    C --> D["Visual Asset Set"]
    D --> E["Review Package"]
    E --> F["Submission Materials"]
    F --> G["Final Check"]
```

## My Role

My work centered on production systemization. I organized the work around the question:

```text
How do we keep story, visual assets, prompts, documents, and final checks aligned while the project keeps changing?
```

That included:

- structuring the project into repeatable stages
- maintaining prompt and shot documentation
- generating review-ready documents and workbooks
- creating QA previews for visual inspection
- separating draft materials from release-ready materials

The full creative source material and complete operating process stay outside this folder.

## Why This Matters

AIGC video work can become chaotic quickly because small changes in a scene, character, prompt, or document can break consistency elsewhere. The main challenge is keeping story, shots, prompts, visual references, review notes, and submission materials aligned.

This project records how I managed AI creative work as a production system.

## Public Files

| File | Purpose |
| --- | --- |
| `workflow.md` | High-level production workflow. |
| `quality-checks.md` | Goals and checks used before delivery. |
| `public-artifact-map.md` | Artifact categories used in the public version. |
| `public-scope.md` | Public scope and boundary. |
| `cards/` | Short concept cards distilled from the project. |

## Status

Status: `local_review_v1`

This is a public draft for review before upload.
