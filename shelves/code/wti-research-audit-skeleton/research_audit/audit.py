from __future__ import annotations

from datetime import date
from typing import Any


REQUIRED_RECORD_FIELDS = (
    "name",
    "observation_date",
    "available_on",
    "as_of_date",
    "target_week",
    "mechanically_contains_target",
)


def parse_date(value: object) -> date:
    if not isinstance(value, str):
        raise ValueError("date must be an ISO string")
    return date.fromisoformat(value)


def audit_payload(payload: dict[str, Any]) -> dict[str, Any]:
    findings: list[str] = []
    records = payload.get("records")
    model = payload.get("model")

    if not isinstance(records, list) or not records:
        findings.append("missing_records")
        records = []
    if not isinstance(model, dict):
        findings.append("missing_model")
        model = {}

    for index, record in enumerate(records):
        if not isinstance(record, dict):
            findings.append(f"invalid_record:{index}")
            continue

        name = str(record.get("name") or index)
        missing = [field for field in REQUIRED_RECORD_FIELDS if field not in record]
        if missing:
            findings.extend(f"missing_{field}:{name}" for field in missing)
            continue

        try:
            observation_date = parse_date(record["observation_date"])
            available_on = parse_date(record["available_on"])
            as_of_date = parse_date(record["as_of_date"])
            target_week = parse_date(record["target_week"])
        except (TypeError, ValueError):
            findings.append(f"invalid_date:{name}")
            continue

        if observation_date > as_of_date:
            findings.append(f"observation_after_as_of:{name}")
        if available_on > as_of_date:
            findings.append(f"not_available_as_of_run:{name}")
        if as_of_date >= target_week:
            findings.append(f"target_not_in_future:{name}")
        if record["mechanically_contains_target"] is not False:
            findings.append(f"mechanical_target_leakage:{name}")

    split = model.get("split")
    if split not in {"train", "validation", "test"}:
        findings.append("unknown_split")
    if split == "test":
        if model.get("frozen_config") is not True:
            findings.append("test_config_not_frozen")
        if model.get("retune_requested") is not False:
            findings.append("test_retune_blocked")

    return {
        "status": "blocked" if findings else "passed",
        "findings": findings,
        "records_checked": len(records),
        "controls": {
            "network_enabled": False,
            "real_market_data_loaded": False,
            "model_fitting_enabled": False,
        },
    }
