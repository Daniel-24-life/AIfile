# Concept Card: Prompt Archive As Production Record

In a multi-shot AIGC project, the prompt record connects intent, references, revisions, and asset roles. Without it, a selected asset becomes harder to explain or revise.

## Record Shape

Track prompts by production unit:

```text
unit -> intent -> reference role -> output candidate -> review status
```
