import copy
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def module(name):
    spec = importlib.util.spec_from_file_location(name, ROOT / 'scripts' / f'{name}.py')
    obj = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(obj)
    return obj


renderer = module('render_portfolio')
scaffolder = module('new_project')


class PortfolioTests(unittest.TestCase):
    def fixture(self, mutate=None):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        root = Path(temp.name)
        (root / 'catalog').mkdir()
        data = copy.deepcopy(json.loads((ROOT / 'catalog/projects.json').read_text(encoding='utf-8')))
        for p in data['projects']:
            p['published'] = False
        if mutate:
            mutate(data)
        (root / 'catalog/projects.json').write_text(json.dumps(data), encoding='utf-8')
        return root

    def test_duplicate_id_refused(self):
        root = self.fixture(lambda d: d['projects'].append(copy.deepcopy(d['projects'][0])))
        with self.assertRaises(ValueError):
            renderer.load_registry(root)

    def test_unknown_category_refused(self):
        root = self.fixture(lambda d: d['projects'][0].update(category='unknown'))
        with self.assertRaises(ValueError):
            renderer.load_registry(root)

    def test_missing_published_asset_refused(self):
        root = self.fixture(lambda d: d['projects'][0].update(published=True))
        with self.assertRaises(ValueError):
            renderer.load_registry(root)

    def test_manual_profile_text_preserved(self):
        source = 'Manual intro\n' + renderer.BEGIN + '\nold\n' + renderer.END + '\nManual footer'
        result = renderer.replace_region(source, 'new\n')
        self.assertTrue(result.startswith('Manual intro\n'))
        self.assertTrue(result.endswith('\nManual footer'))
        self.assertNotIn('\nold\n', result)

    def test_bad_markers_refused(self):
        for original in ('no markers', renderer.END + renderer.BEGIN, renderer.BEGIN * 2 + renderer.END):
            with self.assertRaises(ValueError):
                renderer.replace_region(original, 'new')

    def test_draft_scaffold_and_no_overwrite(self):
        root = self.fixture()
        target = root / 'templates/project'
        target.mkdir(parents=True)
        (target / 'README.md').write_text('# {{project_id}}', encoding='utf-8')
        created = scaffolder.create_project(root, 'future-project', 'business-products')
        self.assertEqual((created / 'README.md').read_text(encoding='utf-8'), '# future-project')
        data = renderer.load_registry(root)
        self.assertFalse(data['projects'][-1]['published'])
        self.assertNotIn('future-project', renderer.render(data))
        before = (root / 'catalog/projects.json').read_bytes()
        with self.assertRaises(ValueError):
            scaffolder.create_project(root, 'future-project', 'business-products')
        self.assertEqual(before, (root / 'catalog/projects.json').read_bytes())

    def test_unsafe_scaffold_id_refused(self):
        root = self.fixture()
        with self.assertRaises(ValueError):
            scaffolder.create_project(root, '../outside', 'business-products')

    def test_duplicate_featured_order_refused(self):
        root = self.fixture(lambda d: d['projects'][1].update(featured_order=1))
        with self.assertRaises(ValueError):
            renderer.load_registry(root)

    def test_profile_preview_assets_pin_to_source_commit(self):
        data = renderer.load_registry(ROOT)
        sha = 'a' * 40
        rendered = renderer.render(data, profile=True, source_ref=sha)
        self.assertIn(f'/AIfile/{sha}/assets/previews/', rendered)
        self.assertNotIn('/AIfile/main/assets/previews/', rendered)

    def test_profile_featured_work_reflows_without_table(self):
        data = renderer.load_registry(ROOT)
        rendered = renderer.render(data, profile=True, source_ref='a' * 40)
        self.assertNotIn('<table>', rendered)
        self.assertNotIn('<td', rendered)
        self.assertIn('width="860"', rendered)
        expected = sum(p.get('published', True) and p.get('featured_order') is not None for p in data['projects'])
        self.assertEqual(rendered.count('\n### ['), expected)


if __name__ == '__main__':
    unittest.main()
