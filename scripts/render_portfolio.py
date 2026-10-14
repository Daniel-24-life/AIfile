"""Render reviewed portfolio records into explicit README marker regions."""
from __future__ import annotations

import argparse
import json
import re
from datetime import date
from pathlib import Path
from urllib.parse import quote, urlparse
from html import escape

ROOT = Path(__file__).resolve().parents[1]
BEGIN = '<!-- portfolio:start -->'
END = '<!-- portfolio:end -->'


def load_registry(root: Path) -> dict:
    data = json.loads((root / 'catalog/projects.json').read_text(encoding='utf-8'))
    categories = {item['id'] for item in data['categories']}
    ids, orders = set(), set()
    for item in data['projects']:
        if item['id'] in ids or not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', item['id']):
            raise ValueError('duplicate or invalid project id')
        ids.add(item['id'])
        if item['category'] not in categories:
            raise ValueError('unknown category')
        for field in ('title', 'title_en', 'summary', 'summary_en', 'state', 'state_en', 'repository', 'entry'):
            if not isinstance(item.get(field), str) or not item[field].strip():
                raise ValueError(f"{item['id']}: missing {field}")
            if any(c in item[field] for c in ('\n', '|', '<', '>')):
                raise ValueError(f"{item['id']}: unsupported inline markup in {field}")
        order = item.get('featured_order')
        if order is not None:
            if type(order) is not int or order < 1 or order in orders:
                raise ValueError('featured order must be unique and positive')
            orders.add(order)
        release = item.get('release')
        if release:
            date.fromisoformat(release['date'])
        if not item.get('published', True):
            continue
        for field in ('entry', 'cover', 'architecture', 'source', 'verification'):
            value = item.get(field)
            if not isinstance(value, str) or not value:
                raise ValueError(f"{item['id']}: missing {field}")
            parsed = urlparse(value)
            if parsed.scheme:
                if parsed.scheme != 'https' or parsed.hostname != 'github.com':
                    raise ValueError('project entry URLs must use GitHub HTTPS')
            else:
                target = (root / value).resolve()
                if not target.is_relative_to(root.resolve()) or not target.exists():
                    raise ValueError(f"{item['id']}: missing or outside local asset {value}")
    return data


def link(value: str, remote: bool, owner: str, asset=False) -> str:
    if value.startswith('https://') or not remote:
        return value
    if asset:
        return f'https://raw.githubusercontent.com/{owner}/AIfile/main/{quote(value, safe="/")}'
    route = 'blob' if asset or '.' in value.rsplit('/', 1)[-1] else 'tree'
    return f'https://github.com/{owner}/AIfile/{route}/main/{quote(value, safe="/")}'


def render(data: dict, english=False, profile=False, source_ref='main') -> str:
    published = [p for p in data['projects'] if p.get('published', True)]
    featured = sorted((p for p in published if p.get('featured_order') is not None), key=lambda p: p['featured_order'])
    title, summary, state = ('title_en', 'summary_en', 'state_en') if english else ('title', 'summary', 'state')
    owner = data['owner']
    chunks = ['## Selected work' if english else '## 精选作品', '']
    chunks += ['<table>', '<tbody>']
    for i in range(0, len(featured), 2):
        chunks.append('<tr>')
        for p in featured[i:i+2]:
            url = link(p['entry'], profile, owner)
            image = link(p['cover'], profile, owner, asset=True)
            if profile:
                image = image.replace('/AIfile/main/', f'/AIfile/{source_ref}/')
            chunks += ['<td width="50%" valign="top">',
                       f'<h3><a href="{escape(url)}">{escape(p[title])}</a></h3>',
                       f'<a href="{escape(url)}"><img src="{escape(image)}" width="420" alt="{escape(p[title])}" /></a>',
                       f'<p>{escape(p[summary])}</p>', f'<p><strong>{escape(p[state])}</strong></p>',
                       f'<p><a href="{escape(url)}">{"Run / overview" if english else "体验与运行"}</a> · '
                       f'<a href="{escape(link(p["architecture"], profile, owner))}">{"Architecture" if english else "架构"}</a> · '
                       f'<a href="{escape(link(p["source"], profile, owner))}">{"Source" if english else "源码"}</a> · '
                       f'<a href="{escape(link(p["verification"], profile, owner))}">{"Verification" if english else "验证"}</a></p>', '</td>']
        chunks.append('</tr>')
    chunks += ['</tbody>', '</table>', '']
    if not profile:
        chunks += ['## Project directory' if english else '## 完整作品目录', '']
        for cat in data['categories']:
            chunks += [f"### {cat['title_en'] if english else cat['title']}", '',
                       '| Project | Focus | State |' if english else '| 项目 | 解决的问题 | 当前实现 |',
                       '| --- | --- | --- |']
            for p in published:
                if p['category'] == cat['id']:
                    chunks.append(f"| [{p[title]}]({p['entry']}) | {p[summary]} | {p[state]} |")
            chunks.append('')
    else:
        chunks += ['## Read deeper' if english else '## 深入阅读', '',
                   f"[{'All projects' if english else '全部项目与分类'}](https://github.com/{owner}/AIfile) · "
                   f"[{'Code references' if english else '代码参考'}](https://github.com/{owner}/AIfile/tree/main/shelves/code) · "
                   f"[{'Learning and methods' if english else '方法与学习'}](https://github.com/{owner}/AIfile/tree/main/shelves/understanding)", '']
    chunks += ['## Recent releases' if english else '## 近期更新', '']
    releases = sorted((p for p in published if p.get('release')), key=lambda p: (p['release']['date'], -(p.get('featured_order') or 100)), reverse=True)[:3]
    for p in releases:
        r = p['release']
        chunks.append(f"- {r['date']} · [{p[title]}]({link(p['entry'], profile, owner)}) · {r['version']} — {r['note_en'] if english else r['note']}")
    chunks += ['', '## Add the next project' if english else '## 添加下一项作品', '',
               f"[{'Publishing guide and templates' if english else '维护指南与项目模板'}](" +
               (f'https://github.com/{owner}/AIfile/blob/main/docs/ADD_PROJECT.md' if profile else 'docs/ADD_PROJECT.md') + ')', '']
    return '\n'.join(chunks).rstrip() + '\n'


def replace_region(original: str, generated: str) -> str:
    if original.count(BEGIN) != 1 or original.count(END) != 1 or original.index(BEGIN) > original.index(END):
        raise ValueError('exactly one ordered portfolio marker pair required')
    before, rest = original.split(BEGIN)
    _, after = rest.split(END)
    return before + BEGIN + '\n\n' + generated + '\n' + END + after


def update(path: Path, generated: str, check: bool):
    original = path.read_text(encoding='utf-8')
    expected = replace_region(original, generated)
    if check and original != expected:
        raise ValueError(f'generated region drift: {path.name}')
    if not check:
        path.write_text(expected, encoding='utf-8')


def inventory(data, prefix='', code=False):
    rows = ['| 项目 | 分类 | 当前实现 | 主入口 |', '| --- | --- | --- |']
    categories = {c['id']: c['title'] for c in data['categories']}
    for p in data['projects']:
        if not p.get('published', True) or (code and not p.get('runnable', False)):
            continue
        value = p['source'] if code else p['entry']
        target = value if value.startswith('https://') else prefix + value
        rows.append(f"| {p['title']} | {categories[p['category']]} | {p['state']} | [查看]({target}) |")
    return '\n'.join(rows) + '\n'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--profile-dir', type=Path)
    parser.add_argument('--source-commit')
    args = parser.parse_args()
    data = load_registry(ROOT)
    if args.profile_dir:
        meta_path = args.profile_dir / 'catalog-source.json'
        if args.check:
            meta = json.loads(meta_path.read_text(encoding='utf-8'))
            sha = args.source_commit or meta['source_commit']
            if sha != meta['source_commit'] or meta['source_repository'] != f"{data['owner']}/AIfile":
                raise ValueError('profile source pin mismatch')
        else:
            sha = args.source_commit
        if not sha or not re.fullmatch('[0-9a-f]{40}', sha):
            raise ValueError('profile generation requires a full source commit SHA')
        for english, name in ((False, 'README.md'), (True, 'README.en.md')):
            update(args.profile_dir / name, render(data, english, True, sha), args.check)
        if not args.check:
            meta_path.write_text(json.dumps({'source_repository': f"{data['owner']}/AIfile", 'source_commit': sha}, indent=2) + '\n', encoding='utf-8')
    else:
        for english, name in ((False, 'README.md'), (True, 'README.en.md')):
            update(ROOT / name, render(data, english), args.check)
        for name, prefix, code in [('catalog/inventory.md', '../', False), ('showcases/README.md', '../', False), ('shelves/code/README.md', '../../', True)]:
            update(ROOT / name, inventory(data, prefix, code), args.check)
    print('Portfolio registry and generated regions: PASS')


if __name__ == '__main__':
    main()
