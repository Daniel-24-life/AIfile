from dataclasses import dataclass


APPROVED = "approved"
REVIEW_NEEDED = "review_needed"
EXCLUDED = "excluded"
BLOCKED = "blocked"

KNOWN_SOURCE_TYPES = {"seed_network", "search_result", "external_reference"}
KNOWN_PROFILE_FIT_STATES = {"likely_fit", "possible_fit", "poor_fit"}
KNOWN_ACTIVITY_STATES = {"recent_activity", "activity_unclear", "unknown"}
KNOWN_CONTACT_STATES = {
    "public_email_visible",
    "public_contact_page",
    "dm_visible",
    "contact_unknown",
    "contact_absent",
}


@dataclass(frozen=True)
class CreatorRecord:
    creator_id: str
    source_type: str
    profile_fit_status: str
    activity_status: str
    contact_status: str
    risk_note: str = ""


@dataclass(frozen=True)
class ReviewDecision:
    state: str
    reasons: tuple[str, ...]


def review_creator(record: CreatorRecord, existing_ids: set[str]) -> ReviewDecision:
    reasons: list[str] = []

    if not record.creator_id.strip():
        reasons.append("missing creator_id")
    if record.source_type not in KNOWN_SOURCE_TYPES:
        reasons.append("unknown source_type")
    if record.profile_fit_status not in KNOWN_PROFILE_FIT_STATES:
        reasons.append("unknown profile_fit_status")
    if record.activity_status not in KNOWN_ACTIVITY_STATES:
        reasons.append("unknown activity_status")
    if record.contact_status not in KNOWN_CONTACT_STATES:
        reasons.append("unknown contact_status")
    if reasons:
        return ReviewDecision(BLOCKED, tuple(reasons))

    if record.creator_id in existing_ids:
        return ReviewDecision(EXCLUDED, ("duplicate creator_id",))

    if record.profile_fit_status == "poor_fit":
        return ReviewDecision(EXCLUDED, ("profile fit failed",))

    if record.profile_fit_status != "likely_fit":
        reasons.append("profile fit needs review")

    if record.activity_status != "recent_activity":
        reasons.append("activity needs review")

    if record.contact_status in {"contact_unknown", "contact_absent"}:
        reasons.append("contact path needs review")

    if record.risk_note.strip() and record.risk_note.strip().lower() != "none":
        reasons.append("risk note present")

    if reasons:
        return ReviewDecision(REVIEW_NEEDED, tuple(reasons))

    return ReviewDecision(APPROVED, ("review gates passed",))
