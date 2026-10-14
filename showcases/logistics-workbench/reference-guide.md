# Workflow and permission reference

## Current role actions

| Role | Review suggestions | Advance tasks | View |
| --- | --- | --- | --- |
| Operations | Yes, subject to fresh evidence. | No. | Internal demo pages. |
| Dispatcher | No. | Yes. | Internal demo pages. |
| Customer service | No. | No. | Internal demo pages. |
| Manager | Yes, subject to fresh evidence. | Yes. | Internal demo pages. |
| Customer | No. | No. | Filtered shipment status. |

This table describes the implemented browser policy. It does not imply a
server identity layer, per-customer isolation or independent approval ownership.
High-risk actions require a human approver but are not manager-only in this demo.

## Task lifecycle

```text
reviewed suggestion -> todo -> doing -> verifying -> done
                         blocked -> doing
```

Approval requires a role with review authority, fresh sample data and a preset
confidence at least 60. A repeated creation for an exception already assigned a
task or closed is refused. Task actions recheck execution authority; completed
or unrecognized states cannot advance. Role changes close the old panels.

Evidence and dependency labels describe what a real operator would collect.
The buttons only simulate submission and verification. They cannot establish
that a driver, warehouse or independent reviewer confirmed a result.

## Moving beyond the demo

Use server-side checks before accepting an action, not merely before displaying
a button. Scope every response by organization and customer; remove internal
fields before data reaches a customer browser. Store versioned events and
independent evidence references. Verify dependencies before dispatch and attach
reviewer identity before closing. Measure suggestion quality with grounded cases,
not the sample confidence values. None of those integrations are claimed here.
