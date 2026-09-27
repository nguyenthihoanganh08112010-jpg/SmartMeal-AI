from pathlib import Path
import re,json,base64,html
root=Path(__file__).parent
rice='data:image/png;base64,'+base64.b64encode((root/'assets/rice-pixel-transparent.png').read_bytes()).decode()
d=(root/'diary.html').read_text(encoding='utf-8-sig')
d=re.sub(r'<script src="https://mcp.figma.com[^>]*></script>','',d)
d=d.replace('<script src="meal-update-model.js"></script>','<script>'+(root/'meal-update-model.js').read_text(encoding='utf-8')+'</script>')
d=d.replace('<script src="diary-model.js"></script>','<script>'+(root/'diary-model.js').read_text(encoding='utf-8')+'</script>')
d=d.replace('<img class="rabbit" src="assets/rabbit.png" alt="Bạn Thỏ đã duyệt">','<div class="rabbit-slot" aria-label="Vị trí thỏ để thêm hình sau">[Vị trí thỏ]</div>')
d=d.replace('function wireSwipes(){','function wireSwipes(){decorateDiary();')
d=d.replace("const app=document.getElementById('app');", "const diaryTrash='TRASH_ASSET_TOKEN';const diaryRice='RICE_ASSET_TOKEN';\n"+(root/'latest-diary.js').read_text(encoding='utf-8')+"\nconst app=document.getElementById('app');")
d=d.replace("window.parent.postMessage({type:'smartmeal-nav',name:b.dataset.name},location.origin)","window.parent.postMessage({type:'smartmeal-nav',name:b.dataset.name},'*')")
d=d.replace('</head>','<style>'+(root/'latest-diary.css').read_text(encoding='utf-8')+'</style></head>')
# Inline fragment reuses the existing shell; remove only stand-alone wrapper and stale status.
s=(root/'smartmeal-review.html').read_text(encoding='utf-8-sig')
s=s[s.index('<div id="sm-draft">'):s.rindex('</body>')]
s=re.sub(r'<script>if\(new URLSearchParams\(location.search\)\.has\("panel"\)\)[\s\S]*?</script>','',s)
s=s.replace('body{margin:0;padding:20px 12px;background:#fff;color:#36302b;color-scheme:light;font-family:Arial,sans-serif}','')
s=re.sub(r'data:image/[^;]+;base64,[A-Za-z0-9+/=]+','',s)
s=s.replace('<img class="sm-mascot" src="assets/rabbit.png" alt="Bạn Thỏ đã duyệt">','<div class="sm-mascot" aria-label="Vị trí thỏ để thêm hình sau">[Vị trí thỏ]</div>')
s=s.replace('drawWeek();drawGuide();','drawWeek();drawGuide();enhanceHome();')
# The original generic renderer is replaced by the scoped current implementation.
s=re.sub(r"function renderDiary\(\)\{page.hidden=false;page.innerHTML=.*?\}\n",'',s)
s=s.replace("'Hồ sơ · CHƯA PHÊ DUYỆT. Bốn icon trong nhóm trắng chờ tài sản gốc / duyệt; icon AI và lửa lấy từ ảnh mẫu. Lịch và số liệu là vùng giữ chỗ, không phải dữ liệu người dùng.'", "'Hồ sơ · Chưa phê duyệt. Hình thỏ để trống; bấm vị trí thỏ để xem tương tác. Lịch, ghi chú và số liệu minh họa.'")
s=s.replace("'Nhật ký · Dữ liệu mẫu. 1 lần lưu thành công = 1 đợt. Nội dung ảnh món, nhóm chất và icon chưa có giữ chỗ.'", "'Nhật ký · Dữ liệu mẫu. Một lần lưu thành công = một đợt; ảnh món và nhóm chất giữ chỗ.'")
inlineDiary=json.dumps(d,ensure_ascii=False).replace('<','\\u003c')
extra="const riceAsset="+json.dumps(rice)+";\nconst diarySource="+inlineDiary+";\n"+(root/'latest-shell.js').read_text(encoding='utf-8')
s=s.replace("const initialState=new URLSearchParams(location.search).get('screen')||'home';",extra+"\nconst initialState=window.openai?.widgetState?.privateContent?.screen||'home';")
s=s.replace("if(initialState==='active')requestAnimationFrame", "root.addEventListener('change',e=>{if(e.target.id==='sm-state')window.openai?.setWidgetState?.({privateContent:{screen:e.target.value},modelContent:{screen:e.target.value}})?.catch(()=>{});});\nif(initialState==='active')requestAnimationFrame")
s+='<style>\n'+(root/'latest-shell.css').read_text(encoding='utf-8')+'\n</style>\n'
assert 'const riceAsset=' in s and 'const diarySource=' in s
assert len(s.encode())<1000000,len(s.encode())
(root/'smartmeal-latest.html').write_text(s,encoding='utf-8')
(root/'smartmeal-latest-preview.html').write_text('<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SmartMeal — Bản nháp cập nhật</title></head><body>'+s+'</body></html>',encoding='utf-8')
print('Fragment bytes',len(s.encode()))
