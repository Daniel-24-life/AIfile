from __future__ import annotations

import json

from mailbox_review.morning_run import build_demo_run


def main() -> None:
    print(json.dumps(build_demo_run(), indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
