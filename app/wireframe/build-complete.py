from pathlib import Path
import base64
p=Path(__file__).parent
s=(p/'smartmeal-record.html').read_text(encoding='utf-8')
s=s.replace('const initialState=window.openai', (p/'saved-persona.js').read_text(encoding='utf-8')+'\nconst initialState=window.openai')
s=s.replace('function show(state){',"function show(state){if(state==='settings'){personaOpen();return;}if(state.startsWith('saved')||state.startsWith('persona')||state.startsWith('diary-')){reviewExtension(state);return;}")
s=s.replace("||'record';","||'saved';")
trash='data:image/jpeg;base64,'+base64.b64encode((p/'assets/diary-swipe.jpg').read_bytes()).decode()
s+='<style>#sm-draft{--sm-trash-source:url("'+trash+'")}'+(p/'saved-persona.css').read_text(encoding='utf-8')+'</style>'
s=s.replace('Khung nét đứt / [ngoặc vuông] = placeholder. Font, sắc độ và kích thước chỉ để xem bố cục.','Khung nét đứt / [ngoặc vuông] = chờ tài sản hoặc nội dung. Dữ liệu mẫu; chưa đồng bộ Figma.')
assert len(s.encode())<1000000,len(s.encode())
(p/'smartmeal-complete.html').write_text(s,encoding='utf-8')
(p/'smartmeal-complete-preview.html').write_text('<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SmartMeal · Bản nháp tích hợp</title><body>'+s+'</body></html>',encoding='utf-8')
print('Bytes',len(s.encode()))
