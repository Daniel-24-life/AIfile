"""Create English-only explanatory SVG assets; never fabricate UI screenshots."""
import argparse
import json
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPECS = {
    'cosmopilot-v4': ('#6d28d9', 'Consumer service with evidence and human review.',
        [('Conversation', 'Six synthetic cases', 'Five service types'),
         ('Evidence', 'Message-time filtering', 'Facts, reports, inferences'),
         ('Human review', 'Protected reply drafts', 'Local SQLite feedback')],
        'Offline reference. No model calls or external service actions.'),
    'logistics-workbench': ('#12685f', 'Turn shipment exceptions into reviewed dispatch tasks.',
        [('Exception queue', 'Synthetic shipments', 'Facts and missing evidence'),
         ('Human approval', 'Five role views', 'Freshness and policy checks'),
         ('Task lifecycle', 'Assign, execute, verify', 'In-memory demo state')],
        'Offline product demo. No carrier connection or real dispatch.'),
    'buyer-research-agent': ('#235e89', 'Review demand evidence before deciding the next step.',
        [('Demand signals', 'Fixed synthetic records', 'Quotes and dates'),
         ('Evidence review', 'Explicit / opportunity / pending', 'Unknowns stay visible'),
         ('Local queue', 'Pause, resume, cancel', 'SQLite persistence')],
        'Offline reference. No live buyer search or outreach.'),
    'btc-agent-governance': ('#946018', 'Keep task routing, evidence claims and release gates separate.',
        [('Task routing', 'Four synthetic scenarios', 'Allow, review or refuse'),
         ('Evidence', 'Research and dry-run', 'Bounded claims'),
         ('Release gate', 'Research only or blocked', 'No execution authority')],
        'Recorded synthetic scenarios. No exchange connection or trading.'),
    'agentplatform-case-study': ('#645773', 'A controlled task kernel and a discontinued product.',
        [('Intended product', 'Goal to plan to delivery', 'Multi-agent coordination'),
         ('Verified scope', 'Controlled single-task path', 'Platform tests and gates'),
         ('Pilot stopped', 'Before agent dispatch', 'Product delivery not run')],
        'Read-only case study. Discontinued; development has not resumed.'),
}


def banner(profile, dark):
    bg, fg, muted, panel = ('#101e30','#eef4fb','#b8cad9','#1c3348') if dark else ('#f2f6fa','#152f43','#526b80','#e5edf4')
    title = 'Daniel' if profile else 'AIfile'
    sub = 'AI Product & Agent Engineering' if profile else 'Product & Agent Engineering Portfolio'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="340" viewBox="0 0 1280 340" role="img" aria-labelledby="title desc">
<title id="title">{title} - {escape(sub)}</title><desc id="desc">Runnable workflows, system architecture, code and verification.</desc>
<rect width="1280" height="340" rx="20" fill="{bg}"/>
<g font-family="Segoe UI,Arial,sans-serif">
<text x="60" y="62" fill="{muted}" font-size="17">PRODUCT THINKING / AGENT SYSTEMS / ENGINEERING</text>
<text x="60" y="140" fill="{fg}" font-size="54" font-weight="700">{title}</text>
<text x="60" y="188" fill="{fg}" font-size="31" font-weight="600">{escape(sub)}</text>
<text x="60" y="230" fill="{muted}" font-size="22">From business problems to runnable workflows.</text>
<rect x="60" y="264" width="605" height="40" rx="8" fill="{panel}"/>
<text x="78" y="291" fill="{fg}" font-size="19">PRODUCT / ARCHITECTURE / CODE / VERIFICATION</text>
<path d="M910 245L980 166L1055 201L1130 100L1210 138" fill="none" stroke="#29a89e" stroke-width="4"/>
<g fill="{bg}" stroke="#29a89e" stroke-width="4"><circle cx="980" cy="166" r="8"/><circle cx="1055" cy="201" r="8"/></g>
<circle cx="1130" cy="100" r="11" fill="#eab56b"/>
</g></svg>\n'''


def overview(project):
    accent, subtitle, nodes, boundary = SPECS[project['id']]
    markup=[]
    for index,(title,line1,line2) in enumerate(nodes):
        x=56+index*400
        markup.append(f'<rect x="{x}" y="208" width="368" height="174" rx="12" fill="#ffffff" stroke="#b8c8d5"/>')
        markup.append(f'<rect x="{x}" y="208" width="368" height="5" rx="2" fill="{accent}"/>')
        for offset,size,weight,text in [(40,19,'700',f'0{index+1}'),(79,27,'700',title),(117,22,'400',line1),(149,22,'400',line2)]:
            color=accent if offset==40 else '#152f43' if weight=='700' else '#435c70'
            markup.append(f'<text x="{x+22}" y="{208+offset}" fill="{color}" font-size="{size}" font-weight="{weight}">{escape(text)}</text>')
        if index<2:
            markup.append(f'<path d="M{x+377} 295h13m-6-6 6 6-6 6" fill="none" stroke="{accent}" stroke-width="2"/>')
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="490" viewBox="0 0 1280 490" role="img" aria-labelledby="title desc">
<title id="title">{escape(project['title_en'])} - system overview</title><desc id="desc">{escape(subtitle)} {escape(boundary)}</desc>
<rect width="1280" height="490" rx="16" fill="#f2f6fa"/>
<g font-family="Segoe UI,Arial,sans-serif">
<text x="56" y="45" fill="{accent}" font-size="18" font-weight="700">SYSTEM OVERVIEW</text>
<text x="56" y="104" fill="#152f43" font-size="43" font-weight="700">{escape(project['title_en'])}</text>
<text x="56" y="146" fill="#435c70" font-size="23">{escape(subtitle)}</text>
{''.join(markup)}
<text x="56" y="427" fill="#435c70" font-size="21">{escape(boundary)}</text>
<text x="56" y="463" fill="#526b80" font-size="17">Explanatory illustration, not a product UI screenshot.</text>
</g></svg>\n'''


def update(path, content, check):
    if check:
        if not path.exists() or path.read_text(encoding='utf-8')!=content:
            raise ValueError(f'English asset missing or changed: {path.name}')
    else:
        path.parent.mkdir(parents=True,exist_ok=True)
        path.write_text(content,encoding='utf-8')


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check',action='store_true')
    parser.add_argument('--profile-dir',type=Path)
    args=parser.parse_args()
    data=json.loads((ROOT/'catalog/projects.json').read_text(encoding='utf-8'))
    for project in data['projects']:
        if project.get('featured_order') is not None:
            update(ROOT/project['cover_en'],overview(project),args.check)
    for dark in (False,True):
        name=f'cover-en-{"dark" if dark else "light"}.svg'
        update(ROOT/'assets'/name,banner(False,dark),args.check)
        if args.profile_dir:
            update(args.profile_dir/'assets'/name,banner(True,dark),args.check)
    print('English explanatory assets: PASS')


if __name__=='__main__':
    main()
