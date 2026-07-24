# Writing Skill Boundaries

Writing workflows are where AI tools blur together most easily. I keep four roles separate.

## Drafting

Drafting tools create or restructure a piece.

They need:

- audience
- purpose
- source material
- claim boundaries
- desired voice
- forbidden inventions

They should not invent personal experience, fake data, or fake citations.

## Review

Review tools inspect a draft.

They should lead with:

- weak claims
- missing evidence
- unclear logic
- unsupported numbers
- audience mismatch
- publication risk

They should not quietly rewrite the whole piece unless asked.

## Style Cleanup

Style cleanup is an editing step, not an authoring step.

Its job is to remove:

- generic transitions
- inflated claims
- repetitive paragraph rhythm
- empty summaries
- fake confidence
- overwritten structure

It should preserve facts, intent, formatting, and the author's existing voice.

## Formatting

Formatting tools create or repair files.

They can handle:

- DOCX
- PDF
- PPTX
- Markdown
- spreadsheet structure
- visual rendering checks

They should not change the argument unless the task explicitly includes content editing.

## My Default Chain

```text
source material
  -> domain writing
  -> user judgment
  -> review
  -> style cleanup
  -> formatting
  -> final verification
```

This chain is not always necessary. For small tasks, it is too heavy. For public-facing work, it keeps the process inspectable.
