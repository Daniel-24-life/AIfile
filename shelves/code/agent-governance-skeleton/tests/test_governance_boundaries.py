from orchestrator.task_router import Task, route_task, select_first_allowed
from governance.evidence_classifier import Evidence, classify_evidence
from execution.dryrun_lifecycle import create_intent, simulate_lifecycle


def test_router_blocks_forbidden_execution_claim():
    task = Task(
        task_id="T-001",
        plane="execution",
        action_type="dry_run",
        priority="T1",
        description="submit real order after dry-run",
    )

    decision = route_task(task)

    assert decision.decision == "refuse"
    assert "real order" in decision.reasons[0]


def test_router_requires_approval_for_sensitive_priority():
    task = Task(
        task_id="T-002",
        plane="governance",
        action_type="audit",
        priority="T3",
        description="review policy proposal",
    )

    decision = route_task(task)

    assert decision.decision == "approval_required"


def test_selector_fails_closed_when_no_safe_task_exists():
    tasks = [
        Task("T-003", "execution", "trade", "T1", "live trading workflow"),
    ]

    decision = select_first_allowed(tasks)

    assert decision.decision == "refuse"


def test_public_data_cannot_claim_real_execution():
    evidence = Evidence(
        evidence_class="public_data",
        claims=frozenset({"market_observation", "real_fill", "production_ready"}),
    )

    decision = classify_evidence(evidence)

    assert decision.allowed is False
    assert "real_fill" in decision.blocked_claims
    assert "production_ready" in decision.blocked_claims
    assert "market_observation" in decision.allowed_claims


def test_dryrun_lifecycle_never_records_real_order():
    intent = create_intent("intent-001", "observe", 0.0, "public demo")
    events, report = simulate_lifecycle(intent, risk_allowed=True)

    assert len(events) == 4
    assert report.status == "matched"
    assert report.real_order_submitted is False
    assert report.real_fill_recorded is False

