const emojiRoot='https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@1ffb34c752ecf5d402f04cfb4b392c77f57c54bc/assets/';
const emojiNames={fire:['Fire','fire'],books:['Books','books'],bmi:['Balance scale','balance_scale'],goal:['Bullseye','bullseye'],poo:['Pile of poo','pile_of_poo'],breakfast:['Croissant','croissant'],lunch:['Bowl with spoon','bowl_with_spoon'],dinner:['Pot of food','pot_of_food'],snack:['Red apple','red_apple'],mic:['Microphone','microphone'],keyboard:['Keyboard','keyboard'],profile:['Bust in silhouette','bust_in_silhouette'],diary:['Fork and knife with plate','fork_and_knife_with_plate'],notebook:['Bookmark tabs','bookmark_tabs'],record:['Memo','memo'],gear:['Gear','gear'],trash:['Wastebasket','wastebasket'],back:['Left arrow','left_arrow'],next:['Right arrow','right_arrow']};
function emoji(key,cl='ms-emoji'){const a=emojiNames[key];return '<img class="'+cl+'" alt="" aria-hidden="true" src="'+emojiRoot+encodeURIComponent(a[0])+'/Color/'+a[1]+'_color.svg">';}
let selectedHomeDate='2026-09-20',rabbitAnimating=false;
function enhanceHome(){
 const lesson=q('.hp-lesson');if(lesson&&!lesson.querySelector('.hp-rabbit')){const slot=document.createElement('button');slot.className='hp-rabbit rabbit-empty';slot.dataset.home='rabbit';slot.setAttribute('aria-label','Vị trí thỏ — nhấp để xem tương tác');slot.innerHTML='<span>[Vị trí thỏ]</span>';lesson.prepend(slot);}
 const knowledge=q('.hp-knowledge h3');if(knowledge)knowledge.insertAdjacentHTML('beforeend',emoji('books'));
 const tiles=q('.hp-grid')?.children;if(tiles){tiles[0].querySelector('h3').insertAdjacentHTML('beforeend',emoji('bmi'));tiles[2].querySelector('h3').insertAdjacentHTML('beforeend',emoji('goal'));tiles[3].querySelector('h3').insertAdjacentHTML('beforeend',emoji('poo'));tiles[3].querySelector('small').textContent='Chỉ hiển thị dữ liệu';const prominent=tiles[1].querySelector('.hp-streak-row strong');prominent.innerHTML=emoji('fire','ms-emoji streak-fire');prominent.setAttribute('aria-label','Chuỗi ngày sử dụng');tiles[1].querySelector('.hp-streak-row small').hidden=true;}
 q('.hp-digest h3')?.insertAdjacentHTML('beforeend','<img class="ms-emoji" alt="" src="'+emojiRoot+'Spiral%20calendar/Color/spiral_calendar_color.svg">');
 q('.hp-guide h3')?.insertAdjacentHTML('beforeend',emoji('books'));
 enhanceIcons();
}
function enhanceIcons(){
 root.querySelectorAll('.hp-flame-image').forEach(e=>{if(!e.querySelector('img'))e.innerHTML=emoji('fire');});
 root.querySelectorAll('.hp-icon-pending').forEach((e,i)=>{if(!e.querySelector('img'))e.innerHTML=emoji(['profile','diary','notebook','record'][i%4]);});
 root.querySelectorAll('.hp-ai-image').forEach(e=>{if(!e.querySelector('img')){const im=document.createElement('img');im.className='rice-icon';im.alt='Hạt gạo pixel';im.src=riceAsset;e.append(im);}});
 const mic=q('#sm-mic');if(mic&&!mic.querySelector('img')){const key=mic.textContent==='Chữ'?'keyboard':'mic';mic.innerHTML=emoji(key);mic.setAttribute('aria-label',key==='mic'?'Chuyển sang giọng nói':'Chuyển sang nhập chữ');}
 root.querySelectorAll('[data-act="settings"]').forEach(e=>{if(!e.querySelector('img'))e.innerHTML=emoji('gear');});
 root.querySelectorAll('[data-act="home"], [data-act="return"]').forEach(e=>{if(e.textContent.trim()==='←')e.innerHTML=emoji('back');});
}
function drawWeek(){
 q('.hp-week-label').textContent=weekOffset===0?'Hôm nay':'[Tuần đang xem]';
 q('.hp-days').setAttribute('aria-label','Chọn ngày xem dữ liệu tiêu hóa');
 q('.hp-days').innerHTML=['T2','T3','T4','T5','T6','T7','CN'].map((day,i)=>{const d=new Date(Date.UTC(2026,8,14+i+7*weekOffset));const iso=d.toISOString().slice(0,10);const today=iso==='2026-09-20';const entry=q('#hp-fixture')?.value==='entry'&&weekOffset===0&&i===2;return '<div class="hp-day '+(today?'current ':'')+(selectedHomeDate===iso?'selected':'')+'"><button class="hp-date-button" data-home="date" data-date="'+iso+'" aria-pressed="'+(selectedHomeDate===iso)+'"><span>'+day+'</span><span class="date">'+(today?'Nay':d.getUTCDate())+'</span></button>'+(entry?'<button class="hp-sticker" data-home="note" data-date="'+iso+'" aria-label="Xem ghi chú ngày '+d.getUTCDate()+' tháng 9">'+emoji('poo')+'</button>':'<span class="marker"></span>')+'</div>';}).join('');
 const existing=q('.hp-digest>.hp-placeholder');if(existing){existing.classList.add('digest-note');existing.hidden=true;existing.setAttribute('aria-live','polite');}
}
function drawGuide(){q('.hp-slide').innerHTML='<div class="hp-placeholder hp-guide-image">[Ảnh hướng dẫn '+(guideIndex+1)+']</div>';q('.hp-dots').querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-current',i===guideIndex?'true':'false'));}
root.addEventListener('click',async e=>{const b=e.target.closest('[data-home]');if(!b)return;const a=b.dataset.home;
 if(a==='date'){selectedHomeDate=b.dataset.date;drawWeek();}
 if(a==='note'){selectedHomeDate=b.dataset.date;drawWeek();const note=q('.digest-note');note.hidden=false;note.textContent='[Ghi chú của ngày '+b.dataset.date+' — dữ liệu mẫu, nội dung chưa cung cấp]';}
 if(a==='rabbit'&&!rabbitAnimating){rabbitAnimating=true;b.disabled=true;const label=b.querySelector('span');if(!reduced())await b.animate([{transform:'translateY(0)'},{transform:'translateY(-12px)'},{transform:'translateY(0)'}],{duration:350}).finished;label.textContent='[Tư thế / biểu cảm]';await new Promise(r=>setTimeout(r,650));label.textContent='[Vị trí thỏ]';q('.hp-content').textContent='[Nội dung ngày hiện tại — đổi tuần tự mỗi ngày; chưa chốt nội dung]';b.disabled=false;rabbitAnimating=false;}
});
const iconObserver=new MutationObserver(enhanceIcons);iconObserver.observe(root,{childList:true,subtree:true});
// Restore the approved bottom-sheet interaction; discarding never commits temporary data.
const sheet=q('.sm-dialog');const grip=document.createElement('button');grip.className='sm-grip';grip.setAttribute('aria-label','Kéo xuống để ẩn và hủy thay đổi tạm');grip.innerHTML='<span></span>';sheet.prepend(grip);
let dragStart=null,dragDistance=0;
function dismissSheet(){overlay.hidden=true;sheet.style.transform='';q('#sm-state').value=started?'active':'welcome';q('#sm-caption').textContent='Đã ẩn bảng và hủy thay đổi tạm. Mở lại dùng dữ liệu trước lần sửa.';}
grip.onpointerdown=e=>{dragStart=e.clientY;dragDistance=0;grip.setPointerCapture(e.pointerId);};
grip.onpointermove=e=>{if(dragStart===null)return;dragDistance=Math.max(0,e.clientY-dragStart);sheet.style.transform='translateY('+dragDistance+'px)';};
grip.onpointerup=()=>{if(dragStart===null)return;dragStart=null;if(dragDistance>45)dismissSheet();else sheet.style.transform='';};
grip.onpointercancel=()=>{dragStart=null;sheet.style.transform='';};grip.onclick=e=>{if(e.detail===0)dismissSheet();};
new MutationObserver(()=>{if(!overlay.hidden){sheet.style.transform='';if(!reduced())sheet.animate([{transform:'translateY(100%)'},{transform:'translateY(0)'}],{duration:220,easing:'ease-out'});}}).observe(overlay,{attributes:true,attributeFilter:['hidden']});
captions.confirm='Bảng trượt từ dưới lên, chiếm 2/3 phía dưới màn hình. Kéo thanh trên cùng xuống để ẩn và hủy thay đổi tạm; mở lại dùng dữ liệu trước lần sửa.';
function renderDiary(){page.hidden=false;const iframe=document.createElement('iframe');iframe.className='diary-frame';iframe.title='Nhật ký — dữ liệu mẫu';iframe.srcdoc=diarySource.replace('RICE_ASSET_TOKEN',riceAsset);page.replaceChildren(iframe);q('#sm-caption').textContent='Nhật ký · Một lần lưu thành công là một đợt ăn. Dữ liệu minh họa.';}
enhanceIcons();
