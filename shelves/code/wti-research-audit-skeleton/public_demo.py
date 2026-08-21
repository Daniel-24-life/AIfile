from __future__ import annotations

import json
from pathlib import Path

from research_audit import audit_payload


def build_demo() -> dict[str, object]:
    sample_path = Path(__file__).with_name("sample_input.fake.json")
    payload = json.loads(sample_path.read_text(encoding="utf-8"))
    return audit_payload(payload)


if __name__ == "__main__":
    print(json.dumps(build_demo(), indent=2, sort_keys=True))
