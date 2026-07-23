from __future__ import annotations

from dataclasses import dataclass
from typing import Literal


Decision = Literal["allow", "approval_required", "refuse"]
Plane = Literal["research", "execution", "governance"]


FORBIDDEN_PATTERNS = {
    "real order",
    "api key",
    "live trading",
    "paper trading",
    "leverage",
    "production ready",
    "override governance",
}

EXECUTION_ALLOWED_TYPES = {"schema", "dry_run", "log", "audit"}


@dataclass(frozen=True)
class Task:
    task_id: str
    plane: Plane
    action_type: str
    priority: str
    description: str
    auto_allowed: bool = True


@dataclass(frozen=True)
class RouteDecision:
    decision: Decision
    task_id: str | None
    plane: str | None
    reasons: tuple[str, ...]


def route_task(task: Task) -> RouteDecision:
    """Route one task under fail-closed plane policy."""
    text = f"{task.task_id} {task.action_type} {task.description}".lower()

    for pattern in FORBIDDEN_PATTERNS:
        if pattern in text:
            return RouteDecision(
                decision="refuse",
                task_id=task.task_id,
                plane=task.plane,
                reasons=(f"forbidden boundary matched: {pattern}",),
            )

    if task.plane == "execution" and task.action_type not in EXECUTION_ALLOWED_TYPES:
        return RouteDecision(
            decision="refuse",
            task_id=task.task_id,
            plane=task.plane,
            reasons=("execution plane is limited to schema, dry_run, log, and audit work",),
        )

    if task.priority in {"T2", "T3"} or not task.auto_allowed:
        return RouteDecision(
            decision="approval_required",
            task_id=task.task_id,
            plane=task.plane,
            reasons=("task requires explicit review",),
        )

    return RouteDecision(
        decision="allow",
        task_id=task.task_id,
        plane=task.plane,
        reasons=("task satisfies public-safe plane policy",),
    )


def select_first_allowed(tasks: list[Task]) -> RouteDecision:
    """Pick the first allowed task; fail closed if none are safe."""
    approval: RouteDecision | None = None

    for task in tasks:
        decision = route_task(task)
        if decision.decision == "allow":
            return decision
        if decision.decision == "approval_required" and approval is None:
            approval = decision

    if approval is not None:
        return approval

    return RouteDecision(
        decision="refuse",
        task_id=None,
        plane=None,
        reasons=("no safe task candidate found",),
    )

