from brief_review.review_gate import (
    BLOCKED,
    NEEDS_REVIEW,
    READY,
    BriefItem,
    review_brief_item,
)


def test_missing_sources_are_blocked():
    item = BriefItem(
        item_id="fake_item_001",
        section="AI Infrastructure",
        claim="A fake infrastructure update may affect deployment planning.",
        source_ids=(),
        source_classes=("official",),
    )

    decision = review_brief_item(item)

    assert decision.state == BLOCKED
    assert "missing source_ids" in decision.reasons


def test_missing_identity_and_claim_are_blocked():
    item = BriefItem(
        item_id="",
        section="AI Infrastructure",
        claim="",
        source_ids=("S1",),
        source_classes=("official",),
    )

    decision = review_brief_item(item)

    assert decision.state == BLOCKED
    assert decision.reasons == ("missing item_id",)


def test_missing_claim_is_blocked():
    item = BriefItem(
        item_id="fake_item_006",
        section="AI Infrastructure",
        claim="",
        source_ids=("S1",),
        source_classes=("official",),
    )

    decision = review_brief_item(item)

    assert decision.state == BLOCKED
    assert decision.reasons == ("missing claim",)


def test_social_signal_needs_review():
    item = BriefItem(
        item_id="fake_item_002",
        section="Product Signal",
        claim="A fake feature appears to be rolling out in a limited context.",
        source_ids=("S3",),
        source_classes=("social_signal",),
    )

    decision = review_brief_item(item)

    assert decision.state == NEEDS_REVIEW
    assert "weak source class needs review" in decision.reasons


def test_source_metadata_mismatch_is_blocked():
    item = BriefItem(
        item_id="fake_item_003",
        section="Market Context",
        claim="A fake market update has source IDs but incomplete metadata.",
        source_ids=("S1", "S2"),
        source_classes=("official",),
    )

    decision = review_brief_item(item)

    assert decision.state == BLOCKED
    assert "source metadata length mismatch" in decision.reasons


def test_unknown_source_class_is_blocked():
    item = BriefItem(
        item_id="fake_item_004",
        section="Market Context",
        claim="A fake market update uses a source class outside the public schema.",
        source_ids=("S1",),
        source_classes=("private_watchlist",),
    )

    decision = review_brief_item(item)

    assert decision.state == BLOCKED
    assert "unknown source_class" in decision.reasons


def test_sourced_item_is_ready():
    item = BriefItem(
        item_id="fake_item_005",
        section="Market Context",
        claim="A fake market update has enough source coverage for a brief item.",
        source_ids=("S1", "S2"),
        source_classes=("official", "media"),
    )

    decision = review_brief_item(item)

    assert decision.state == READY
    assert decision.reasons == ("review gates passed",)
