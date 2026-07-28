from __future__ import annotations

from dataclasses import dataclass


LOCAL_ACTIONS = {"read", "classify", "draft_reply"}
EXTERNAL_ACTIONS = {"send_reply", "move_message", "delete_message", "bulk_action"}
KNOWN_ACTIONS = LOCAL_ACTIONS | EXTERNAL_ACTIONS
KNOWN_APPROVAL_STATES = {"not_required", "pending", "approved", "rejected"}


@dataclass(frozen=True)
class MailAction:
    action_id: str
    action_type: str
    approval_state: str
    approval_ref: str = ""
    duplicate: bool = False
    contains_raw_content: bool = False


@dataclass(frozen=True)
class ReviewDecision:
    state: str
    reason_codes: tuple[str, ...]


def review_action(action: MailAction) -> ReviewDecision:
    reasons: list[str] = []

    if not action.action_id.strip():
        reasons.append("missing_action_id")
    if action.action_type not in KNOWN_ACTIONS:
        reasons.append("unknown_action_type")
    if action.approval_state not in KNOWN_APPROVAL_STATES:
        reasons.append("unknown_approval_state")
    if action.contains_raw_content:
        reasons.append("raw_content_not_allowed")
    if action.duplicate:
        reasons.append("duplicate_action")

    if reasons:
        return ReviewDecision("blocked", tuple(reasons))

    if action.approval_state == "rejected":
        return ReviewDecision("blocked", ("action_rejected",))

    if action.action_type in EXTERNAL_ACTIONS:
        if action.approval_state != "approved":
            return ReviewDecision(
                "needs_review",
                ("external_action_requires_approval",),
            )
        if not action.approval_ref.strip():
            return ReviewDecision(
                "needs_review",
                ("missing_approval_reference",),
            )

    return ReviewDecision("ready", ())
