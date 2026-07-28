from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import unquote


ROOT = Path(__file__).resolve().parents[1]
PACKAGES = (
    (
        "agent-governance-skeleton",
        ROOT / "shelves/code/agent-governance-skeleton",
        (sys.executable, "-B", "-m", "pytest", "-p", "no:cacheprovider", "tests", "-q"),
    ),
    (
        "creator-discovery-skeleton",
        ROOT / "shelves/code/creator-discovery-skeleton",
        (sys.executable, "-B", "-m", "pytest", "-p", "no:cacheprovider", "tests", "-q"),
    ),
    (
        "daily-brief-skeleton",
        ROOT / "shelves/code/daily-brief-skeleton",
        (sys.executable, "-B", "-m", "pytest", "-p", "no:cacheprovider", "tests", "-q"),
    ),
    (
        "mailbox-governance-skeleton",
        ROOT / "shelves/code/mailbox-governance-skeleton",
        (sys.executable, "-B", "-m", "unittest", "discover", "-s", "tests", "-v"),
    ),
)


def run_package(name: str, cwd: Path, command: tuple[str, ...]) -> bool:
    print(f"\n== {name} ==", flush=True)
    result = subprocess.run(command, cwd=cwd, check=False)
    return result.returncode == 0


def validate_fake_json() -> bool:
    files = sorted(
        (
            *ROOT.joinpath("showcases").rglob("*.fake.json"),
            *ROOT.joinpath("shelves").rglob("*.fake.json"),
        )
    )
    print(f"\n== synthetic JSON ({len(files)} files) ==")
    for path in files:
        with path.open(encoding="utf-8") as stream:
            json.load(stream)
        print(path.relative_to(ROOT))
    return True


def validate_markdown_links() -> bool:
    pattern = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")
    missing: list[str] = []
    files = sorted(
        (
            *ROOT.joinpath("showcases").rglob("*.md"),
            *ROOT.joinpath("shelves").rglob("*.md"),
            *ROOT.joinpath("catalog").rglob("*.md"),
            ROOT / "README.md",
        )
    )

    print(f"\n== Markdown links ({len(files)} files) ==")
    for path in files:
        text = path.read_text(encoding="utf-8")
        for target in pattern.findall(text):
            if target.startswith(("http://", "https://", "mailto:", "#")):
                continue
            relative_target = unquote(target.split("#", 1)[0]).strip("<>")
            if relative_target and not (path.parent / relative_target).exists():
                missing.append(f"{path.relative_to(ROOT)} -> {target}")

    if missing:
        for item in missing:
            print(item)
        return False

    print("all relative links resolve")
    return True


def main() -> int:
    results = [run_package(*package) for package in PACKAGES]
    passed = all(results)
    try:
        passed = validate_fake_json() and passed
        passed = validate_markdown_links() and passed
    except (OSError, json.JSONDecodeError) as error:
        print(f"artifact validation failed: {error}", file=sys.stderr)
        passed = False

    print("\nPUBLIC PACKAGE VERIFICATION:", "PASS" if passed else "FAIL")
    return 0 if passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
