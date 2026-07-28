from dataclasses import dataclass


READY = "ready"
NEEDS_REVIEW = "needs_review"
BLOCKED = "blocked"

WEAK_SOURCE_CLASSES = {"social_signal", "discovery"}
KNOWN_SOURCE_CLASSES = {"official", "media", "social_signal", "data_reference", "discovery"}


@dataclass(frozen=True)
class BriefItem:
    item_id: str
    section: str
    claim: str
    source_ids: tuple[str, ...]
    source_classes: tuple[str, ...]


@dataclass(frozen=True)
class BriefDecision:
    state: str
    reasons: tuple[str, ...]


def review_brief_item(item: BriefItem) -> BriefDecision:
    reasons: list[str] = []

    if not item.item_id.strip():
        return BriefDecision(BLOCKED, ("missing item_id",))

    if not item.claim.strip():
        return BriefDecision(BLOCKED, ("missing claim",))

    if not item.source_ids:
        return BriefDecision(BLOCKED, ("missing source_ids",))

    if not item.source_classes:
        return BriefDecision(BLOCKED, ("missing source_classes",))

    if len(item.source_ids) != len(item.source_classes):
        return BriefDecision(BLOCKED, ("source metadata length mismatch",))

    unknown_classes = set(item.source_classes) - KNOWN_SOURCE_CLASSES
    if unknown_classes:
        return BriefDecision(BLOCKED, ("unknown source_class",))

    if not item.section.strip():
        reasons.append("missing section")

    if any(source_class in WEAK_SOURCE_CLASSES for source_class in item.source_classes):
        reasons.append("weak source class needs review")

    if len(item.claim.strip()) < 20:
        reasons.append("claim too thin")

    if reasons:
        return BriefDecision(NEEDS_REVIEW, tuple(reasons))

    return BriefDecision(READY, ("review gates passed",))
