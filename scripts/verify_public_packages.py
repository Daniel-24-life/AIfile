from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import unquote


ROOT = Path(__file__).resolve().parents[1]
CURRENT_RELEASE = "v2.2"
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
    (
        "wti-research-audit-skeleton",
        ROOT / "shelves/code/wti-research-audit-skeleton",
        (sys.executable, "-B", "-m", "unittest", "discover", "-s", "tests", "-v"),
    ),
)


def public_text_files(suffixes: tuple[str, ...]) -> list[Path]:
    candidates = (
        *ROOT.glob("*.md"),
        *ROOT.joinpath("showcases").rglob("*"),
        *ROOT.joinpath("shelves").rglob("*"),
        *ROOT.joinpath("catalog").rglob("*"),
    )
    return sorted(
        path
        for path in candidates
        if path.is_file() and path.suffix.lower() in suffixes
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
    files = public_text_files((".md",))

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


def validate_release_metadata() -> bool:
    files = public_text_files((".md",))
    legacy_pattern = re.compile(
        r"\b(?:review_ready|approved_for_public)_v\d+(?:\.\d+)*\b",
        re.IGNORECASE,
    )
    repository_release_pattern = re.compile(
        r"\|\s*Repository release\s*\|\s*`(?P<release>v\d+(?:\.\d+)*)`\s*\|",
        re.IGNORECASE,
    )
    problems: list[str] = []

    for path in files:
        text = path.read_text(encoding="utf-8")
        if legacy_pattern.search(text):
            problems.append(f"{path.relative_to(ROOT)} -> legacy versioned lifecycle")
        for match in repository_release_pattern.finditer(text):
            release = match.group("release")
            if release != CURRENT_RELEASE:
                problems.append(
                    f"{path.relative_to(ROOT)} -> repository release "
                    f"{release} does not match {CURRENT_RELEASE}"
                )

    required_files = (
        ROOT / "README.md",
        ROOT / "CHANGELOG.md",
        ROOT / "catalog/inventory.md",
    )
    for path in required_files:
        if CURRENT_RELEASE not in path.read_text(encoding="utf-8"):
            problems.append(
                f"{path.relative_to(ROOT)} -> missing {CURRENT_RELEASE} release marker"
            )

    print(f"\n== release metadata ({CURRENT_RELEASE}) ==")
    if problems:
        for item in problems:
            print(item)
        return False

    print("release markers and lifecycle fields are consistent")
    return True


def validate_public_text_boundary() -> bool:
    patterns = (
        (
            "OpenAI-style token",
            re.compile(r"\bsk-[A-Za-z0-9_-]{20,}\b"),
        ),
        (
            "GitHub token",
            re.compile(r"\b(?:ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b"),
        ),
        (
            "AWS access key",
            re.compile(r"\bAKIA[A-Z0-9]{16}\b"),
        ),
        (
            "private Windows path",
            re.compile(
                r"\b[A-Za-z]:\\(?:Users|Quant|AIfile(?:-library)?|AI文件)\\",
                re.IGNORECASE,
            ),
        ),
    )
    files = public_text_files(
        (".md", ".json", ".py", ".toml", ".svg", ".yml", ".yaml")
    )
    matches: list[str] = []

    for path in files:
        text = path.read_text(encoding="utf-8")
        for label, pattern in patterns:
            if pattern.search(text):
                matches.append(f"{path.relative_to(ROOT)} -> {label}")

    print(f"\n== public text boundary ({len(files)} files) ==")
    if matches:
        for item in matches:
            print(item)
        return False

    print("no obvious credentials or private local paths found")
    return True


def main() -> int:
    results = [run_package(*package) for package in PACKAGES]
    passed = all(results)
    try:
        passed = validate_fake_json() and passed
        passed = validate_markdown_links() and passed
        passed = validate_release_metadata() and passed
        passed = validate_public_text_boundary() and passed
    except (OSError, json.JSONDecodeError) as error:
        print(f"artifact validation failed: {error}", file=sys.stderr)
        passed = False

    print("\nPUBLIC PACKAGE VERIFICATION:", "PASS" if passed else "FAIL")
    return 0 if passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
