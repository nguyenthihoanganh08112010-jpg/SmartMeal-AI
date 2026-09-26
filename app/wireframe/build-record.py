from pathlib import Path
import re
p=Path(__file__).parent
s=(p/'smartmeal-latest.html').read_text(encoding='utf-8')
js=(p/'record-model.js').read_text(encoding='utf-8')+'\n'+(p/'record-view.js').read_text(encoding='utf-8')
s=s.replace("const initialState=window.openai",js+"\nconst initialState=window.openai")
s=s.replace("||'home';","||'record';")
s=s.replace("function show(state){","function show(state){if(state.startsWith('record')){q('#sm-state').value=state;recordReview(state);return;}")
s=s.replace('Chờ xác nhận đúng tài sản','Vị trí chờ hình gốc')
s=s.replace('Minh họa gốc, ba màu cuối','Minh họa gốc, ba màu cuối')
s=s.replace("homeScroll=q('.hp-scroll').scrollTop;show('diary');","homeScroll=q('.hp-scroll')?.scrollTop||homeScroll;show('diary');")
s=s.replace("const initialState=window.openai", "q('#hp-fixture').closest('label').hidden=true;\nconst initialState=window.openai")
# A saved record drives Home count and calendar markers. Unrelated Home geometry stays intact.
s=s.replace("const entry=q('#hp-fixture')?.value==='entry'&&weekOffset===0&&i===2;","const entry=DigestModel.count(digestiveRecords,iso)>0;")
s=s.replace("tiles[3].querySelector('small').textContent='Chỉ hiển thị dữ liệu';", "tiles[3].querySelector('small').textContent='Tự động từ bản ghi chi tiết';const c=DigestModel.count(digestiveRecords,recordToday);tiles[3].querySelector('.hp-absence').textContent=c?c+' lần':'Chưa ghi nhận';tiles[3].querySelector('h3').innerHTML='Hôm nay đi tiêu'+emoji('poo');")
s=s.replace("note.textContent='[Ghi chú của ngày '+b.dataset.date+' — dữ liệu mẫu, nội dung chưa cung cấp]';", "const rs=digestiveRecords.filter(r=>r.date===b.dataset.date);note.textContent=rs.map(r=>r.time+' · '+(r.shape||'Chưa có dữ liệu')+' · '+(r.duration==null?'Chưa ghi nhận thời lượng':r.duration+' phút')).join(' / ');")
s=s.replace("q('.hp-days').setAttribute", "const fixture=q('#hp-fixture');if(fixture)fixture.closest('label').hidden=true;q('.hp-days').setAttribute")
s+='<style>'+ (p/'record-view.css').read_text(encoding='utf-8')+'</style>'
# Flow description is an optional review aid outside the mobile product.
flow='''<details class="record-flow"><summary>Sơ đồ chuyển màn · Nháp</summary><p>Ghi lại → Bạn Dài → Bắt đầu → Phân → Lưu hợp lệ → Phân tích bản ghi → Đã hiểu → Bạn Dài</p><p>Bạn Dài → Lịch sử → Bản ghi → Phân tích → Quay lại → Lịch sử (giữ vị trí cuộn)</p><p>Lịch sử → Dấu cộng → Phân → Lưu → Phân tích → Đã hiểu → Bạn Dài</p><p>Lịch sử → Vuốt trái → Xóa → Xác nhận → Lịch sử cập nhật</p><p>Bạn Dài → Phân tích nhật ký → Kiểm tra 7 ngày / 3 bản ghi / bằng chứng → Thiếu dữ liệu hoặc bố cục phân tích tạm → Quay lại → Bạn Dài</p></details>'''
# Keep the review aid in the existing root.
s=s.replace('<div class="sm-review">','<div class="sm-review">',1)
s=s.replace('<label>Trạng thái xem trước',flow+'<label>Trạng thái xem trước',1)
assert len(s.encode())<1000000
(p/'smartmeal-record.html').write_text(s,encoding='utf-8')
(p/'smartmeal-record-preview.html').write_text('<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SmartMeal — Ghi lại — Nháp</title><body>'+s+'</body></html>',encoding='utf-8')
print('Preview bytes:',len(s.encode()))
