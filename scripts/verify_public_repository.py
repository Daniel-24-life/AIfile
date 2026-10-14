"""Read-only Markdown, asset and obvious private-text checks for public repositories."""
import argparse
import re
from pathlib import Path
from urllib.parse import unquote
import xml.etree.ElementTree as ET


def verify(root: Path):
    issues = []
    markdown_count = 0
    text_count = 0
    patterns = [r'\bsk-[A-Za-z0-9_-]{20,}\b', r'\b(?:ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b', r'\b[A-Za-z]:[\\/]']
    ignored = {'.git', 'node_modules', '.runtime', '.venv', '__pycache__', '.pytest_cache', 'tmp', 'inbox'}
    for path in root.rglob('*'):
        if not path.is_file() or ignored.intersection(path.relative_to(root).parts):
            continue
        if path.suffix.lower() not in {'.md', '.json', '.py', '.js', '.cjs', '.mjs', '.html', '.css', '.yml', '.yaml', '.svg', '.toml'}:
            continue
        text = path.read_text(encoding='utf-8')
        text_count += 1
        # Literal synthetic Windows paths may exist in archived tests; only enforce
        # this newly authored public corpus, not external historical repositories.
        for pattern in patterns:
            if re.search(pattern, text):
                issues.append(f'{path.relative_to(root)}: private-text pattern')
        if path.suffix == '.svg':
            ET.fromstring(text)
        if path.suffix != '.md':
            continue
        markdown_count += 1
        targets = re.findall(r'!?\[[^\]]*\]\(([^)]+)\)', text)
        targets += re.findall(r'(?:src|href|srcset)="([^"]+)"', text)
        for target in targets:
            if target.startswith(('https://', 'http://', '#', 'mailto:', 'data:')):
                continue
            local = unquote(target.split('#', 1)[0]).strip('<>')
            if local and not (path.parent / local).exists():
                issues.append(f'{path.relative_to(root)} -> {target}')
    if issues:
        raise ValueError('\n'.join(issues))
    return markdown_count, text_count


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, required=True)
    args = parser.parse_args()
    counts = verify(args.root.resolve())
    print(f'PASS: {counts[0]} Markdown files, {counts[1]} public text files; relative links and SVG XML')
