"""Generate original, static, theme-specific portfolio banners."""
import argparse
from html import escape
from pathlib import Path


def banner(title, subtitle, tag, dark):
    bg, fg, muted, panel = ('#101e30', '#eef4fb', '#9ab3c8', '#172c42') if dark else ('#f2f6fa', '#152f43', '#526b80', '#e5edf4')
    subtitle_markup = ''.join(f'<tspan x="60" y="{190 + i * 26}">{escape(subtitle[i*32:(i+1)*32])}</tspan>' for i in range((len(subtitle) + 31) // 32))
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="340" viewBox="0 0 1280 340" role="img" aria-labelledby="title desc">
<title id="title">{escape(title)}</title><desc id="desc">{escape(subtitle)}</desc>
<rect width="1280" height="340" rx="20" fill="{bg}"/>
<path d="M900 0V340M970 0V340M1040 0V340M1110 0V340M1180 0V340M850 60H1280M850 130H1280M850 200H1280M850 270H1280" stroke="{muted}" opacity=".12"/>
<text x="60" y="62" fill="#28aaa1" font-family="system-ui,sans-serif" font-size="16" letter-spacing="3">DANIEL / AI PRODUCT &amp; AGENT ENGINEERING</text>
<text x="60" y="144" fill="{fg}" font-family="system-ui,Microsoft YaHei,sans-serif" font-size="43" font-weight="600">{escape(title)}</text>
<text fill="{muted}" font-family="system-ui,Microsoft YaHei,sans-serif" font-size="18">{subtitle_markup}</text>
<rect x="60" y="241" width="490" height="44" rx="8" fill="{panel}"/>
<text x="80" y="269" fill="{fg}" font-family="system-ui,Microsoft YaHei,sans-serif" font-size="15">{escape(tag)}</text>
<path d="M870 245L945 175L1020 218L1105 105L1200 145" stroke="#28aaa1" stroke-width="3" fill="none"/>
<circle cx="945" cy="175" r="9" fill="{bg}" stroke="#28aaa1" stroke-width="3"/>
<circle cx="1020" cy="218" r="9" fill="{bg}" stroke="#28aaa1" stroke-width="3"/>
<circle cx="1105" cy="105" r="11" fill="#eab56b"/>
<text x="884" y="303" fill="{muted}" font-family="monospace" font-size="13">PROBLEM → WORKFLOW → EVIDENCE</text>
</svg>\n'''


def generate(directory, title, subtitle, tag):
    directory.mkdir(parents=True, exist_ok=True)
    for dark in (False, True):
        name = 'cover-dark.svg' if dark else 'cover-light.svg'
        (directory / name).write_text(banner(title, subtitle, tag, dark), encoding='utf-8')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--title', required=True)
    parser.add_argument('--subtitle', required=True)
    parser.add_argument('--tag', required=True)
    args = parser.parse_args()
    generate(args.output, args.title, args.subtitle, args.tag)
