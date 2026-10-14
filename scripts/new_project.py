"""Create a local draft; never create a repository or publish content."""
import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def create_project(root: Path, project_id: str, category: str):
    registry_path = root / 'catalog/projects.json'
    data = json.loads(registry_path.read_text(encoding='utf-8'))
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', project_id):
        raise ValueError('id must use lowercase ASCII words separated by hyphens')
    if category not in {c['id'] for c in data['categories']}:
        raise ValueError('unknown category')
    target = root / 'inbox' / project_id
    if target.exists() or any(p['id'] == project_id for p in data['projects']):
        raise ValueError('project id or draft directory already exists; nothing overwritten')
    templates = root / 'templates/project'
    material = [(f.name, f.read_text(encoding='utf-8').replace('{{project_id}}', project_id))
                for f in templates.iterdir() if f.is_file()]
    if not material:
        raise ValueError('project templates missing')
    target.mkdir(parents=True)
    for name, body in material:
        (target / name).write_text(body, encoding='utf-8')
    data['projects'].append({
        'id': project_id, 'title': project_id, 'title_en': project_id,
        'category': category, 'summary': '待完善，尚未发布', 'summary_en': 'Draft, not published',
        'state': '待完善', 'state_en': 'Draft', 'published': False,
        'repository': f"https://github.com/{data['owner']}/AIfile", 'entry': f'inbox/{project_id}/',
        'cover': '', 'featured_order': None, 'architecture': '', 'source': '', 'verification': '', 'release': None})
    registry_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return target


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--id', required=True)
    parser.add_argument('--category', required=True)
    args = parser.parse_args()
    print(f'Local draft only: {create_project(ROOT, args.id, args.category)}')
