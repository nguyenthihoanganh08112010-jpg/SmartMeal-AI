"""Build the handoff HTML and source-derived state index without third-party packages.

Only renders the Markdown constructs used in this report. Does not execute app JS.
"""
from pathlib import Path
import re
import html
import json
from urllib.parse import quote, urlsplit, unquote
from html.parser import HTMLParser

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
APP = ROOT / 'app' / 'wireframe'

def inline(text):
    slots = []
    def hold(value):
        slots.append(value)
        return f'ZZSLOT{len(slots)-1}ZZ'
    text = re.sub(r'`([^`]+)`', lambda m: hold('<code>'+html.escape(m[1])+'</code>'), text)
    text = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', lambda m: hold('<figure><img loading="lazy" src="'+html.escape(m[2], quote=True)+'" alt="'+html.escape(m[1], quote=True)+'"><figcaption>'+html.escape(m[1])+'</figcaption></figure>'), text)
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', lambda m: hold('<a href="'+html.escape(m[2].replace('.md', '.html') if m[2] == 'STATE_INDEX.md' else m[2], quote=True)+'">'+html.escape(m[1])+'</a>'), text)
    text = html.escape(text)
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    for i, value in enumerate(slots):
        text = text.replace(f'ZZSLOT{i}ZZ', value)
    return text

def render(source):
    lines = source.splitlines()
    out, toc = [], []
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        heading = re.match(r'^(#{1,3}) (.*)$', line)
        if heading:
            level = len(heading[1]); label = heading[2]
            anchor = 'section-'+str(len(toc)+1)
            toc.append((level, label, anchor))
            out.append(f'<h{level} id="{anchor}">{inline(label)}</h{level}>')
            i += 1
        elif line.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].startswith('|'):
                cells = [x.strip() for x in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r':?-+:?', x) for x in cells):
                    rows.append(cells)
                i += 1
            table = '<div class="table-scroll" tabindex="0"><table><thead><tr>'
            table += ''.join('<th scope="col">'+inline(x)+'</th>' for x in rows[0])+'</tr></thead><tbody>'
            table += ''.join('<tr>'+''.join('<td>'+inline(x)+'</td>' for x in row)+'</tr>' for row in rows[1:])
            out.append(table+'</tbody></table></div>')
        elif re.match(r'^\d+\. ', line):
            items = []
            while i < len(lines) and re.match(r'^\d+\. ', lines[i]):
                items.append(re.sub(r'^\d+\. ', '', lines[i])); i += 1
            out.append('<ol>'+''.join('<li>'+inline(x)+'</li>' for x in items)+'</ol>')
        else:
            out.append(inline(line) if line.startswith('![') else '<p>'+inline(line)+'</p>')
            i += 1
    return '\n'.join(out), toc

CSS = '''
:root{--ink:#39452d;--green:#cfe6af;--yellow:#fff0b0;--paper:#fffcf0}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:#293522;font:16px/1.65 Arial,sans-serif}
a{color:#315e29;text-underline-offset:3px}a:focus-visible,button:focus-visible,[tabindex]:focus-visible{outline:3px solid #587a42;outline-offset:4px}
.bar{background:var(--ink);color:white;padding:12px 24px;display:flex;justify-content:space-between;align-items:center;gap:16px}.bar a{color:var(--yellow)}
.layout{display:grid;grid-template-columns:270px minmax(0,1050px);gap:32px;max-width:1420px;margin:auto;padding:30px 24px}
nav{position:sticky;top:20px;max-height:calc(100vh - 40px);overflow:auto;font-size:14px;align-self:start;padding:16px;background:#eaf1df;border-radius:16px}nav a{display:block;padding:5px 0;text-decoration:none}nav a:hover{text-decoration:underline}
main{min-width:0;background:white;padding:36px 40px;border-radius:20px;border-top:8px solid var(--green)}
h1{font-size:32px;line-height:1.25;margin:0 0 22px}h2{font-size:25px;line-height:1.35;border-top:2px solid var(--green);padding-top:26px;margin-top:42px;scroll-margin-top:24px}h3{font-size:20px;margin-top:28px;scroll-margin-top:24px}
p,li{overflow-wrap:anywhere}li{margin:8px 0}.table-scroll{overflow:auto;margin:20px 0;border:1px solid #dce4d2;border-radius:10px}table{border-collapse:collapse;width:100%;font-size:14px;line-height:1.55}th{background:#eaf1df;text-align:left;color:var(--ink)}td,th{padding:12px 14px;vertical-align:top;border-bottom:1px solid #e5eadf;overflow-wrap:anywhere}tr:last-child td{border-bottom:0}td:first-child{font-weight:600;min-width:135px}code{font:13px/1.5 Consolas,monospace;background:#f0f3e9;padding:2px 4px;border-radius:4px;overflow-wrap:anywhere}
figure{margin:26px 0;padding:20px;background:#f6f8f0;border-radius:14px;text-align:center}figure img{max-width:100%;max-height:740px;object-fit:contain}figcaption{font-size:13px;margin-top:12px;color:#55634c}button{font:inherit;background:var(--green);color:var(--ink);border:0;padding:8px 16px;border-radius:8px;cursor:pointer}.footer{font-size:13px;color:#596451;margin:36px 0 0}
@media(max-width:900px){.layout{display:block;padding:16px}nav{position:static;max-height:260px;margin-bottom:20px}main{padding:24px 18px}h1{font-size:27px}.bar{flex-wrap:wrap;padding:12px 16px}}
@media print{@page{size:A4;margin:16mm}.bar,nav{display:none}.layout{display:block;padding:0}body,main{background:white}main{padding:0;border:0}h1{font-size:25px}h2{font-size:20px;break-after:avoid}h3{font-size:16px;break-after:avoid}p,li{font-size:10pt}table{font-size:9pt}.table-scroll{overflow:visible}tr,figure{break-inside:avoid}figure img{max-height:180mm}a{color:inherit}code{font-size:8pt}}
'''

def page(markdown, title, filename):
    body, toc = render(markdown)
    links = ''.join('<a href="#'+anchor+'">'+html.escape(label)+'</a>' for level,label,anchor in toc if level == 2)
    return '<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+html.escape(title)+'</title><style>'+CSS+'</style></head><body><div class="bar"><strong>SmartMeal AI · Bàn giao UX/UI 1.0</strong><a href="'+filename+'">Bản Markdown để chỉnh sửa</a><button onclick="window.print()">In / Lưu PDF</button></div><div class="layout"><nav aria-label="Mục lục"><strong>MỤC LỤC</strong>'+links+'</nav><main>'+body+'<p class="footer">Tạo từ nguồn Markdown bằng build-report.py · Không chỉnh trực tiếp bản HTML sinh ra.</p></main></div></body></html>'

groups = [
 ('Home, tài khoản và rà soát mới', 'audit-ui.js', 'auditStates'),
 ('Nhật ký và AI cập nhật', 'chat-diary-update.js', 'updateStates'),
 ('Sổ tay, chi tiết và Hồ sơ AI', 'saved-persona.js', 'savedStates'),
 ('Ghi lại', 'record-view.js', 'recordReviewStates'),
]
state_md = '# SmartMeal — Phụ lục trạng thái xem trước\n\nSinh từ các bảng trạng thái trong mã nguồn; không chạy JavaScript để tạo danh mục. Các trạng thái này sử dụng dữ liệu mẫu, một số cố ý tái hiện lỗi cũ. **Không dùng trạng thái “trước sửa” làm thiết kế chuẩn.**\n\nBuild ứng dụng bằng `python app/wireframe/build-update.py`, rồi phục vụ thư mục repository bằng máy chủ HTTP nội bộ. Liên kết dưới đây mở đúng bản preview trong cùng repository. Các URL có thể reset fixture; đây không phải dữ liệu tài khoản thật.\n\n[Báo cáo chính](SMARTMEAL_UX_UI_HANDOFF.html)\n\n'
count = 0
for title, filename, variable in groups:
    source = (APP/filename).read_text(encoding='utf-8')
    block = re.search(r'const '+variable+r'=\{(.*?)\};', source, re.S)
    assert block, variable
    pairs = re.findall(r"(?:'([^']+)'|([\w-]+))\s*:\s*'([^']+)'", block[1])
    state_md += '## '+title+'\n\nNguồn: `app/wireframe/'+filename+'` · `'+variable+'`.\n\n| Trạng thái | Mở xem trước | Ghi chú |\n| --- | --- | --- |\n'
    for quoted, unquoted, label in pairs:
        key = quoted or unquoted
        warning = 'Tái hiện trước sửa, không phải bản chuẩn' if key in ('diary-before','update-before') else 'Dữ liệu/kịch bản mẫu'
        state_md += '| `'+key+'` | ['+label+'](../../app/wireframe/smartmeal-update-preview.html?screen='+quote(key)+'&panel=1) | '+warning+' |\n'
        count += 1
    state_md += '\n'
state_md += '## Trạng thái mở qua thao tác\n\nCác luồng Đăng nhập/Đăng ký/khôi phục tài khoản, chọn ngày ăn, xác nhận điều kiện, giọng nói, chi tiết thành phần combo và tháp toàn màn hình mở qua nút trong ứng dụng. Bảng trên là danh mục URL nguồn có sẵn, không phải danh sách đầy đủ mọi biến thể tương tác. Hướng dẫn từng thao tác nằm trong báo cáo chính.\n'
(HERE/'STATE_INDEX.md').write_text(state_md, encoding='utf-8')
for stem in ('SMARTMEAL_UX_UI_HANDOFF','STATE_INDEX'):
    md = (HERE/(stem+'.md')).read_text(encoding='utf-8')
    (HERE/(stem+'.html')).write_text(page(md, 'SmartMeal · '+('Báo cáo UX/UI' if stem.startswith('SMART') else 'Danh mục trạng thái'), stem+'.md'), encoding='utf-8')

class AuditParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=[]; self.urls=[]; self.images=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if 'href' in a:self.urls.append(a['href'])
        if tag=='img':self.images.append(a);self.urls.append(a['src'])

results=[]
for stem in ('SMARTMEAL_UX_UI_HANDOFF','STATE_INDEX'):
    path=HERE/(stem+'.html'); source=path.read_text(encoding='utf-8'); parser=AuditParser();parser.feed(source)
    assert len(parser.ids)==len(set(parser.ids)), 'Duplicate anchors'
    assert 'ZZSLOT' not in source and '\ufffd' not in source
    for url in parser.urls:
        if url.startswith('#'):assert url[1:] in parser.ids,url
        elif not urlsplit(url).scheme:assert (HERE/unquote(urlsplit(url).path)).exists(),url
    assert all(x.get('alt') for x in parser.images)
    results.append({'file':path.name,'anchors':len(parser.ids),'links_and_images':len(parser.urls),'images':len(parser.images),'result':'PASS'})
print(json.dumps({'state_links':count,'documents':results,'scope':'Document links, source-derived state inventory, anchors, UTF-8 and image alt text; not new application acceptance tests'},ensure_ascii=False,indent=2))
