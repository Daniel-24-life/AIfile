from dataclasses import dataclass


APPROVED = "approved"
REVIEW_NEEDED = "review_needed"
EXCLUDED = "excluded"


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

    if record.creator_id in existing_ids:
        return ReviewDecision(EXCLUDED, ("duplicate creator_id",))

    if record.profile_fit_status == "poor_fit":
        return ReviewDecision(EXCLUDED, ("profile fit failed",))

    if record.profile_fit_status != "likely_fit":
        reasons.append("profile fit needs review")

    if record.activity_status == "unknown":
        reasons.append("activity evidence missing")

    if record.contact_status == "contact_unknown":
        reasons.append("contact path unknown")

    if reasons:
        return ReviewDecision(REVIEW_NEEDED, tuple(reasons))

    return ReviewDecision(APPROVED, ("review gates passed",))
