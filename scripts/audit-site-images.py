"""构建后运行；只使用 Python 标准库，检查所有 HTML 的本地图片引用。"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
root = Path('dist').resolve()
issues = []
count = 0
class Images(HTMLParser):
    def handle_starttag(self, tag, attrs):
        global count
        if tag != 'img': return
        src = dict(attrs).get('src', '')
        parsed = urlsplit(src)
        if not src or parsed.scheme or parsed.netloc: return
        count += 1
        target = root / unquote(parsed.path).lstrip('/') if src.startswith('/') else page.parent / unquote(parsed.path)
        if not target.is_file(): issues.append((str(page.relative_to(root)), src))
pages = list(root.rglob('*.html'))
for page in pages:
    Images().feed(page.read_text())
print(f'{len(pages)} HTML pages, {count} local image references, {len(issues)} missing')
for issue in issues: print(issue)
raise SystemExit(bool(issues))
