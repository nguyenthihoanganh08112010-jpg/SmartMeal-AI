const recordToday='2026-09-20';
const recordFields={shape:['Hình dạng',['Cục nhỏ cứng','Thỏi dài lồi lõm','Thỏi dài nứt nẻ','Thỏi dài mịn','Hạt mềm','Dạng bùn','Dạng nước']],color:['Màu sắc',['Trắng hoặc xám','Vàng','Nâu nhạt','Nâu','Nâu đậm','Xanh lá','Đen','Rất đậm','Đỏ','Đỏ sẫm']],amount:['Lượng phân',['Ít','Bình thường','Nhiều']],feeling:['Cảm giác khi đi ngoài',['Trơn tru','Bình thường','Khó','Chưa hết']],adhesion:['Độ dính',['Rất sạch','Dính nhẹ','Bám vào bồn cầu']]};
const recordFixtures=()=>[{id:'r1',date:recordToday,time:'14:45',duration:4,shape:'Thỏi dài mịn',color:'Nâu',amount:'Bình thường',feeling:'Trơn tru',adhesion:'Rất sạch'},{id:'r2',date:recordToday,time:'06:45',duration:8,shape:'Thỏi dài nứt nẻ',color:'Vàng'},{id:'r3',date:'2026-09-19',time:'20:25',duration:5,shape:'Thỏi dài mịn'},{id:'r4',date:'2026-08-22',time:'11:14',duration:null,shape:'Thỏi dài lồi lõm'}];
let digestiveRecords=recordFixtures(), recordDraft={},recordScreen='entry',recordFormOrigin='entry',recordAnalysisOrigin='entry',recordSelected=null,recordHistoryScroll=0,recordError='',recordDeleteId=null,recordSequence=10,recordFirstUse='2026-09-18';
const escapeRecord=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const recordToilet=(state=0)=>'<div class="record-toilet toilet-'+state+'" role="img" aria-label="Bồn cầu bo tròn — mẫu nháp"><div class="toilet-tank"></div><div class="toilet-seat"><i></i><b></b></div></div>';
const recordArt=(label='Ảnh gốc để chờ')=>label.includes('Bồn cầu')?recordToilet():'<div class="record-art">['+label+']</div>';
const recordNewDraft=()=>({date:recordToday,time:'12:10',duration:''});
function recordHeader(title,right=''){return '<header class="record-head"><button data-record="back" aria-label="Quay lại">'+emoji('back')+'</button><h2>'+title+'</h2>'+right+'</header>';}
function recordOpen(state='entry'){page.hidden=false;overlay.hidden=true;recordScreen=state;renderRecord();q('#sm-caption').textContent='Ghi lại · DRAFT / UNAPPROVED · Dữ liệu mẫu. Hình gốc để chờ. Thời lượng bắt buộc; các đặc điểm khác có thể bỏ trống. Mười màu theo bổ sung mới nhất.';}
function recordNew(origin){recordFormOrigin=origin;recordDraft=recordNewDraft();recordError='';recordOpen('form');}
function recordNav(){const tmp=document.createElement('div');tmp.innerHTML=document.getElementById('sm-home-template').innerHTML;const nav=tmp.querySelector('.hp-nav');nav.querySelectorAll('[aria-current]').forEach(e=>e.removeAttribute('aria-current'));nav.querySelector('[data-name="Ghi lại"]').setAttribute('aria-current','page');return nav.outerHTML;}
function renderRecord(){
 let h='';
 if(recordScreen==='entry')h='<header class="record-head"><div class="record-top-icons"><button data-record="history" aria-label="Lịch sử">[Icon]<br>Lịch sử</button><button data-record="seven" aria-label="Phân tích nhật ký">[Icon]<br>Phân tích</button></div></header><main class="record-main"><div class="record-entry"><div class="record-mascot">[Bạn Dài gốc<br>Chờ xác nhận đúng tài sản]</div><button class="record-start" data-record="start">Bắt đầu</button></div></main>'+recordNav();
 if(recordScreen==='form'){
  h=recordHeader('Phân')+'<main class="record-main"><div class="record-field"><label for="record-duration">Thời lượng đi tiêu *</label><input id="record-duration" data-record-field="duration" inputmode="decimal" type="number" min="0" step="any" value="'+escapeRecord(recordDraft.duration)+'" aria-describedby="record-duration-help" aria-invalid="'+(recordError==='duration')+'"><span>phút</span></div><div id="record-duration-help">'+(recordError==='duration'?'<p class="record-error" role="alert">Nhập thời lượng lớn hơn 0, đơn vị phút.</p>':'')+'</div><div class="record-field"><label for="record-date">Ngày ghi nhận</label><input id="record-date" data-record-field="date" type="date" value="'+escapeRecord(recordDraft.date)+'"></div><div class="record-field"><label for="record-time">Giờ ghi nhận</label><input id="record-time" data-record-field="time" type="time" value="'+escapeRecord(recordDraft.time)+'"></div>'+(recordError==='date'?'<p class="record-error" role="alert">Chọn ngày và giờ ghi nhận.</p>':'');
  for(const [key,[label,values]] of Object.entries(recordFields)){const illustrated=['shape','color','adhesion'].includes(key);h+='<section><h3>'+label+'</h3><div class="record-choice-row '+(!illustrated?'record-plain':'')+'">'+values.map((v,i)=>'<button class="record-choice" data-record-choice="'+key+'" data-value="'+escapeRecord(v)+'" aria-pressed="'+(recordDraft[key]===v)+'" '+(v.startsWith('[')?'disabled':'')+'>'+(illustrated?(key==='adhesion'?recordToilet(i):recordArt('Minh họa gốc')):'')+'<span class="record-choice-label">'+v+'</span></button>').join('')+'</div></section>';}
  h+='<p class="record-note">Các đặc điểm có thể bỏ trống. Không tự chọn giá trị thay bạn.</p></main><footer class="record-actions"><button data-record="clear">Xóa</button><button data-record="save">Lưu</button></footer>';
 }
 if(recordScreen==='analysis'){
  const r=recordSelected;h=recordHeader('Phân tích')+'<main class="record-main"><section class="record-summary"><time>'+escapeRecord(r.date)+' · '+escapeRecord(r.time)+'</time><h3>Thông tin đã ghi nhận</h3><p>Thời lượng: '+(r.duration==null?'Chưa có dữ liệu':r.duration+' phút')+'</p><p>Hình dạng: '+escapeRecord(r.shape||'Chưa có dữ liệu')+'</p><p>Cảm giác: '+escapeRecord(r.feeling||'Chưa có dữ liệu')+'</p>'+recordArt('Trang trí gốc')+'</section>';
  const fields=[['shape','Hình dạng'],['color','Màu sắc'],['duration','Thời lượng đi tiêu'],['adhesion','Độ dính'],['amount','Lượng phân'],['feeling','Cảm giác khi đi ngoài']];
  h+=fields.map(([k,label])=>'<section class="record-observation">'+recordArt(k==='adhesion'?'Bồn cầu':'Minh họa gốc')+'<div><h3>'+label+'</h3><p>'+escapeRecord(r[k]==null||r[k]===''?'Chưa có dữ liệu':r[k]+(k==='duration'?' phút':''))+'</p>'+(r[k]!=null?'<p class="record-note">[Diễn giải thận trọng — chờ nội dung được kiểm chứng]</p>':'')+'</div></section>').join('')+'</main><footer class="record-actions"><button data-record="understood">Đã hiểu</button></footer>';
 }
 if(recordScreen==='history'){
  h=recordHeader('Lịch sử','<button data-record="add" aria-label="Thêm bản ghi">+</button>')+'<main class="record-main record-history">';
  const rows=DigestModel.distinct(digestiveRecords).sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time));let group='';
  if(!rows.length)h+='<div class="record-empty">Chưa có bản ghi</div>';
  for(const r of rows){if(group!==r.date){group=r.date;h+='<h3>'+({'2026-09-20':'Hôm nay','2026-09-19':'Hôm qua'}[group]||group.split('-').reverse().join('/'))+'</h3>';}
   h+='<div class="record-history-row" data-id="'+r.id+'"><button class="record-delete" data-record="delete" data-id="'+r.id+'" aria-label="Xóa bản ghi"><span>[Icon gốc]</span>Xóa</button><button class="record-history-open" data-record="open" data-id="'+r.id+'">'+recordArt('Hình gốc')+'<span><strong>'+escapeRecord(r.shape||'Chưa có dữ liệu')+'</strong><small>'+r.time+'</small></span><span class="record-duration">'+(r.duration==null?'Chưa ghi nhận':r.duration+' phút')+'</span></button></div>';
  }h+='</main>';
 }
 if(recordScreen==='seven'){
  const result=DigestModel.eligibility(digestiveRecords,recordToday,recordFirstUse,false);
  h=recordHeader('Phân tích nhật ký')+'<main class="record-main"><h3>14/09 – 20/09/2026</h3><p>'+result.records.length+' bản ghi chi tiết trong bảy ngày</p><p>'+result.age+' ngày đã qua từ lần đầu sử dụng</p>';
  if(!result.ageOK||!result.countOK)h+='<h3>Chưa đủ dữ liệu để nhận xét xu hướng</h3><p>Cần ít nhất bảy ngày kể từ lần đầu sử dụng và ba bản ghi trong khoảng đang xem.</p>';
  else h+='<h3>Đủ số ngày và số bản ghi</h3><p>[Chờ kiểm tra bằng chứng cho từng nhận xét xu hướng]</p><section><h3>Các quan sát đã lưu</h3><p>[Tổng hợp dữ kiện được hỗ trợ]</p></section>';
  h+='<p>Ngày không có bản ghi: chưa có thông tin.</p><p class="record-note">[Chưa thiết kế biểu đồ thống kê. Nội dung diễn giải đang chờ duyệt.]</p></main>';
 }
 page.innerHTML='<div class="record-shell"><div class="record-badge">NHÁP / CHƯA PHÊ DUYỆT · DỮ LIỆU MẪU</div>'+h+'</div>';enhanceIcons();
 if(recordScreen==='history'){q('.record-history').scrollTop=recordHistoryScroll;recordWireSwipes();}
}
function recordReturn(){if(recordScreen==='analysis')recordOpen(recordAnalysisOrigin);else if(recordScreen==='form'){recordDraft={};recordOpen(recordFormOrigin);}else recordOpen('entry');}
root.addEventListener('keydown',e=>{const modal=q('.record-modal');if(!modal)return;if(e.key==='Tab'){const buttons=[...modal.querySelectorAll('button')];e.preventDefault();const i=buttons.indexOf(document.activeElement);buttons[(i+(e.shiftKey?-1:1)+buttons.length)%buttons.length].focus();}if(e.key==='Escape'){e.preventDefault();q('[data-record="cancel-delete"]').click();}});
function recordWireSwipes(){page.querySelectorAll('.record-history-row').forEach(row=>{let start=null,moved=false;row.onpointerdown=e=>{start=e.clientX;moved=false;};row.onpointerup=e=>{if(start!==null&&start-e.clientX>35){row.classList.add('swiped');moved=true;}else if(start!==null&&e.clientX-start>35){row.classList.remove('swiped');moved=true;}start=null;};row.addEventListener('click',e=>{if(moved){e.stopPropagation();moved=false;}},true);row.onkeydown=e=>{if(e.key==='ArrowLeft'){row.classList.add('swiped');row.querySelector('.record-delete').focus();}};});}
root.addEventListener('input',e=>{if(e.target.dataset.recordField)recordDraft[e.target.dataset.recordField]=e.target.value;});
root.addEventListener('click',e=>{
 const choice=e.target.closest('[data-record-choice]');if(choice){recordDraft[choice.dataset.recordChoice]=choice.dataset.value;choice.parentElement.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b===choice));return;}
 const b=e.target.closest('[data-record]');if(!b)return;const a=b.dataset.record;
 if(a==='start')recordNew('entry');if(a==='add'){recordHistoryScroll=q('.record-history').scrollTop;recordNew('history');}
 if(a==='back'||a==='understood')recordReturn();if(a==='history')recordOpen('history');if(a==='seven')recordOpen('seven');
 if(a==='clear'){recordDraft=recordNewDraft();recordError='';renderRecord();}
 if(a==='save'){
  if(!DigestModel.duration(recordDraft.duration)){recordError='duration';renderRecord();q('#record-duration').focus();return;}
  if(!recordDraft.date)recordDraft.date=recordToday;if(!recordDraft.time)recordDraft.time='12:10';
  const r={...recordDraft,id:recordDraft.id||'r'+recordSequence++};digestiveRecords=DigestModel.save(digestiveRecords,r);recordSelected=digestiveRecords.find(x=>x.id===r.id);recordAnalysisOrigin='entry';recordDraft={};recordOpen('analysis');
 }
 if(a==='open'){recordHistoryScroll=q('.record-history').scrollTop;recordSelected=digestiveRecords.find(r=>r.id===b.dataset.id);recordAnalysisOrigin='history';recordOpen('analysis');}
 if(a==='delete'){recordHistoryScroll=q('.record-history').scrollTop;recordDeleteId=b.dataset.id;q('.record-shell').insertAdjacentHTML('beforeend','<div class="record-modal-backdrop"><section class="record-modal" role="dialog" aria-modal="true" aria-label="Xóa bản ghi"><h3>Xóa bản ghi này?</h3><p>Bản ghi sẽ được xóa khỏi lịch sử và số lần ghi nhận sẽ được cập nhật.</p><button data-record="cancel-delete">Hủy</button><button data-record="confirm-delete">Xóa</button></section></div>');q('[data-record="cancel-delete"]').focus();}
 if(a==='cancel-delete'){q('.record-modal-backdrop').remove();recordDeleteId=null;}
 if(a==='confirm-delete'){digestiveRecords=DigestModel.remove(digestiveRecords,recordDeleteId);recordDeleteId=null;recordOpen('history');}
});
const recordReviewStates={record:'Ghi lại · Màn bắt đầu','record-empty':'Biểu mẫu trống','record-partial':'Biểu mẫu đang nhập','record-error':'Lỗi thời lượng','record-valid':'Biểu mẫu sẵn sàng lưu','record-saved':'Phân tích sau lưu','record-missing':'Phân tích thiếu dữ liệu','record-history':'Lịch sử','record-nohistory':'Lịch sử trống','record-swipe':'Vuốt để xóa','record-delete':'Xác nhận xóa','record-reopened':'Phân tích từ lịch sử','record-seven':'Bảy ngày · Chưa đủ dữ liệu','record-eligible':'Bảy ngày · Đủ số lượng, chờ bằng chứng'};
Object.entries(recordReviewStates).forEach(([value,label])=>q('#sm-state').append(new Option(label,value)));
function recordReview(state){
 digestiveRecords=recordFixtures();recordFirstUse=state==='record-eligible'?'2026-09-01':'2026-09-18';recordHistoryScroll=0;recordError='';
 if(state==='record'){recordOpen('entry');return;}
 if(['record-empty','record-partial','record-error','record-valid'].includes(state)){recordNew('entry');if(state!=='record-empty')recordDraft={date:recordToday,time:'16:20',duration:'',shape:'Thỏi dài mịn'};if(state==='record-error'){recordDraft.duration='0';recordError='duration';}if(state==='record-valid')recordDraft={...recordFixtures()[0],id:undefined,time:'16:20'};renderRecord();return;}
 if(['record-saved','record-missing','record-reopened'].includes(state)){recordSelected=digestiveRecords[state==='record-missing'?1:0];recordAnalysisOrigin=state==='record-reopened'?'history':'entry';recordOpen('analysis');return;}
 if(state==='record-seven'||state==='record-eligible'){recordOpen('seven');return;}
 if(state==='record-nohistory')digestiveRecords=[];recordOpen('history');if(state==='record-swipe'||state==='record-delete')q('.record-history-row').classList.add('swiped');if(state==='record-delete')q('.record-delete').click();
}
// Navigation interception extends the existing five-tab component without replacing it.
root.addEventListener('click',e=>{const b=e.target.closest('[data-name="Ghi lại"]');if(b){e.stopImmediatePropagation();recordOpen('entry');}},true);
window.addEventListener('message',e=>{if(e.source===q('.diary-frame')?.contentWindow&&e.data?.type==='smartmeal-nav'&&e.data.name==='Ghi lại')recordOpen('entry');});
