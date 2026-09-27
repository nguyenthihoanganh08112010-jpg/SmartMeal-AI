from pathlib import Path
import re,subprocess,os,shutil
p=Path(__file__).parent
for f in ['build-latest.py','build-record.py','build-complete.py']:
 subprocess.run([__import__('sys').executable,str(p/f)],check=True)
s=(p/'smartmeal-complete.html').read_text(encoding='utf-8')
js=(p/'diary-model.js').read_text(encoding='utf-8')+'\n'+(p/'meal-update-model.js').read_text(encoding='utf-8')+'\n'+(p/'chat-diary-update.js').read_text(encoding='utf-8')+'\n'+(p/'audit-model.js').read_text(encoding='utf-8')+'\n'+(p/'audit-ui.js').read_text(encoding='utf-8')
s=s.replace('const initialState=window.openai',js+'\n'+(p/'home-knowledge.js').read_text(encoding='utf-8')+'\nconst initialState=window.openai')
s=s.replace('function show(state){',"function show(state){if(state!=='audit-offline')auditOffline=false;if(state.startsWith('audit-')){auditReview(state);return;}if(state==='confirm'){openGenerationSheet();return;}if(state.startsWith('update-')){updateReview(state);return;}")
s=s.replace("||'saved';","||'audit-home';")
s=s.replace("let source=diarySource.replace('RICE_ASSET_TOKEN',riceAsset);","let source=diarySourceNow();")
s=s.replace('Mục xóa vẫn là một đợt ăn.','Mục xóa là một bản ghi món đã ăn.')
s=s.replace('id:"long-"+i}', 'id:"long-"+i,items:SmartMealDiary.records("current")[0].items.map(d=>({...d,id:d.id+"-long-"+i}))}')
s=s.replace("if(before)source=source.replace('z-index:100;isolation:isolate;','z-index:auto;');", "if(before){source=source.replace('z-index:100;isolation:isolate;','z-index:auto;').replace('.modal-layer .modal{position:relative;z-index:1}','.modal-layer .modal{position:static;z-index:auto}');}")
s=s.replace('const ds=document.querySelector(".scroll");if(', 'const ds=document.querySelector(".scroll");ds.scrollTop=400;if(')
# Add only the transition updates for this change; keep earlier modules untouched.
s=s.replace('<summary>Sơ đồ chuyển màn · Nháp</summary>', '<summary>Sơ đồ chuyển màn · Nháp</summary><p>Nhật ký → Vuốt một món → Xác nhận phía trên danh sách → Chỉ xóa món đó → Nếu đợt rỗng, giảm một đợt.</p><p>Nhật ký / AI / Sổ tay → Chi tiết combo dùng chung → Chi tiết món → Quay lại combo → Quay lại đúng ngữ cảnh.</p><p>AI → Xác nhận điều kiện và quyền nhật ký → Nhiều kết quả → Chọn món cùng loại + ngày ăn → Đã ăn → Một đợt trong Nhật ký.</p>')
s=s.replace('dữ liệu mẫu; định lượng chờ xác minh','dữ liệu mẫu; chờ công thức xác minh')
s+='<style>'+(p/'chat-diary-update.css').read_text(encoding='utf-8')+(p/'audit-ui.css').read_text(encoding='utf-8')+(p/'approved-fixes.css').read_text(encoding='utf-8')+'</style>'
styles=re.findall(r'<style>[\s\S]*?</style>',s)
s=''.join(styles)+re.sub(r'<style>[\s\S]*?</style>','',s)
assert len(s.encode())<1000000,len(s.encode())
(p/'smartmeal-update.html').write_text(s,encoding='utf-8')
preview=s.replace("const initialState=window.openai?.widgetState?.privateContent?.screen||'audit-home';","const initialState=new URLSearchParams(location.search).get('screen')||window.openai?.widgetState?.privateContent?.screen||'audit-home';")
panel='<script>if(new URLSearchParams(location.search).has("panel")){document.querySelector(".sm-review").hidden=true;document.querySelector("#sm-caption").hidden=true;document.body.style.margin="0";document.querySelector(".sm-phone").style.margin="0";}</script>'
(p/'smartmeal-update-preview.html').write_text('<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SmartMeal · Bản rà soát · Chưa phê duyệt</title><body>'+preview+panel+'</body></html>',encoding='utf-8')
# Check every script independently; source is read, never executed by the syntax checker.
scripts=re.findall(r'<script[^>]*>([\s\S]*?)</script>',s)
for i,code in enumerate(scripts):
 (p/f'check-update-{i}.js').write_text(code,encoding='utf-8')
 subprocess.run([os.environ.get('NODE_BINARY') or shutil.which('node') or 'node','--check',str(p/f'check-update-{i}.js')],check=True)
print('Updated fragment',len(s.encode()),'bytes')
