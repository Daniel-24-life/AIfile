from __future__ import annotations

from dataclasses import dataclass


FORBIDDEN_READINESS_CLAIMS = {
    "tradable",
    "paper_ready",
    "live_ready",
    "real_execution_ready",
    "production_ready",
}

REAL_EXECUTION_CLAIMS = {
    "real_fill",
    "real_order",
    "account_continuity",
    "realized_slippage",
}


@dataclass(frozen=True)
class Evidence:
    evidence_class: str
    claims: frozenset[str]


@dataclass(frozen=True)
class EvidenceDecision:
    allowed: bool
    allowed_claims: frozenset[str]
    blocked_claims: frozenset[str]
    reasons: tuple[str, ...]


def classify_evidence(evidence: Evidence) -> EvidenceDecision:
    """Classify what an artifact is allowed to prove."""
    blocked = set()
    reasons = []

    readiness = evidence.claims.intersection(FORBIDDEN_READINESS_CLAIMS)
    if readiness:
        blocked.update(readiness)
        reasons.append("readiness claims require stronger evidence")

    if evidence.evidence_class in {"public_data", "research_replay", "dry_run"}:
        real_claims = evidence.claims.intersection(REAL_EXECUTION_CLAIMS)
        if real_claims:
            blocked.update(real_claims)
            reasons.append(f"{evidence.evidence_class} cannot prove real execution")

    allowed_claims = evidence.claims.difference(blocked)

    return EvidenceDecision(
        allowed=not blocked,
        allowed_claims=frozenset(allowed_claims),
        blocked_claims=frozenset(blocked),
        reasons=tuple(reasons or ["claims match evidence class"]),
    )

