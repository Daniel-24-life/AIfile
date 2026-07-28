from creator_review.review_gate import (
    APPROVED,
    BLOCKED,
    EXCLUDED,
    REVIEW_NEEDED,
    CreatorRecord,
    review_creator,
)


def test_duplicate_record_is_excluded():
    record = CreatorRecord(
        creator_id="fake_creator_001",
        source_type="seed_network",
        profile_fit_status="likely_fit",
        activity_status="recent_activity",
        contact_status="public_email_visible",
    )

    decision = review_creator(record, existing_ids={"fake_creator_001"})

    assert decision.state == EXCLUDED
    assert "duplicate creator_id" in decision.reasons


def test_missing_evidence_needs_review():
    record = CreatorRecord(
        creator_id="fake_creator_002",
        source_type="search_result",
        profile_fit_status="possible_fit",
        activity_status="unknown",
        contact_status="contact_unknown",
    )

    decision = review_creator(record, existing_ids=set())

    assert decision.state == REVIEW_NEEDED
    assert "profile fit needs review" in decision.reasons
    assert "activity needs review" in decision.reasons
    assert "contact path needs review" in decision.reasons


def test_clean_record_is_approved():
    record = CreatorRecord(
        creator_id="fake_creator_003",
        source_type="seed_network",
        profile_fit_status="likely_fit",
        activity_status="recent_activity",
        contact_status="public_email_visible",
    )

    decision = review_creator(record, existing_ids=set())

    assert decision.state == APPROVED
    assert decision.reasons == ("review gates passed",)


def test_unknown_fields_are_blocked():
    record = CreatorRecord(
        creator_id="",
        source_type="unknown_source",
        profile_fit_status="unknown_fit",
        activity_status="stale",
        contact_status="private_channel",
    )

    decision = review_creator(record, existing_ids=set())

    assert decision.state == BLOCKED
    assert "missing creator_id" in decision.reasons
    assert "unknown source_type" in decision.reasons
    assert "unknown profile_fit_status" in decision.reasons
    assert "unknown activity_status" in decision.reasons
    assert "unknown contact_status" in decision.reasons
