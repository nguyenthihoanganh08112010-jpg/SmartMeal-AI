// Supplied artwork can replace these references without changing layout or flow.
const homeKnowledgeAssets={rabbitNormal:null,rabbitInteraction:null,pyramid:null};
const knowledgeTiming={bounce:350,alternate:650,returning:120};
let knowledgePhase='idle',knowledgeDay=null,knowledgeRun=0;
function knowledgeAsset(key,label){const src=homeKnowledgeAssets[key];return src?'<img src="'+escapeRecord(src)+'" alt="'+label+'">':'<span>'+label+'<small>Chờ hình gốc</small></span>';}
function renderDailyKnowledge(){
 if(['bounce','alternate','returning'].includes(knowledgePhase)){knowledgePhase='idle';knowledgeRun++;}
 if(knowledgeDay!==recordToday){knowledgePhase='idle';knowledgeDay=recordToday;knowledgeRun++;}
 const lesson=q('.hp-lesson');lesson.classList.add('knowledge-layout');
 const revealed=knowledgePhase==='revealed';
 lesson.innerHTML='<button class="knowledge-rabbit" data-knowledge="rabbit" data-asset-slot="rabbit-normal" data-rabbit-state="normal" aria-label="Bạn Thỏ — chạm để xem kiến thức">'+knowledgeAsset('rabbitNormal','Bạn Thỏ')+'</button><div class="knowledge-adjacent"><button class="knowledge-pyramid" data-knowledge="pyramid" data-asset-slot="nutrition-pyramid" aria-label="Mở tháp dinh dưỡng toàn màn hình" '+(revealed?'hidden':'')+'>'+knowledgeAsset('pyramid','Tháp dinh dưỡng')+'</button><div class="knowledge-content" role="status" '+(!revealed?'hidden':'')+'>[Kiến thức ngày '+recordToday+' — chờ nội dung được duyệt]</div></div>';
}
async function interactWithRabbit(){
 if(['bounce','alternate','returning'].includes(knowledgePhase))return;
 const button=q('.knowledge-rabbit'),lesson=q('.knowledge-layout'),run=++knowledgeRun;
 const active=()=>run===knowledgeRun&&lesson.isConnected;
 button.disabled=true;knowledgePhase='bounce';button.dataset.rabbitState='bounce';
 if(!reduced())await button.animate([{transform:'translateY(0)'},{transform:'translateY(-10px)'},{transform:'translateY(0)'}],{duration:knowledgeTiming.bounce}).finished;
 if(!active())return;
 knowledgePhase='alternate';button.dataset.rabbitState='alternate';button.dataset.assetSlot='rabbit-interaction';button.innerHTML=knowledgeAsset('rabbitInteraction','Thỏ tương tác');
 await new Promise(resolve=>setTimeout(resolve,reduced()?0:knowledgeTiming.alternate));
 if(!active())return;
 knowledgePhase='returning';button.dataset.rabbitState='normal';button.dataset.assetSlot='rabbit-normal';button.innerHTML=knowledgeAsset('rabbitNormal','Bạn Thỏ');
 await new Promise(resolve=>setTimeout(resolve,reduced()?0:knowledgeTiming.returning));
 if(!active())return;
 knowledgePhase='revealed';button.disabled=false;lesson.querySelector('.knowledge-pyramid').hidden=true;lesson.querySelector('.knowledge-content').hidden=false;
}
function openPyramid(){
 const savedPosition=q('.hp-scroll').scrollTop,layer=document.createElement('section');layer.className='knowledge-fullscreen';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-label','Tháp dinh dưỡng');
 layer.innerHTML='<header><button data-knowledge="close" aria-label="Quay lại Trang chủ">'+emoji('back')+'</button><h2>Tháp dinh dưỡng</h2></header><div class="knowledge-full-art" data-asset-slot="nutrition-pyramid-detail">'+knowledgeAsset('pyramid','Tháp dinh dưỡng')+'</div>';
 q('.sm-phone').append(layer);page.inert=true;layer.querySelector('button').focus();
 layer._restore=()=>{layer.remove();page.inert=false;const scroller=q('.hp-scroll');if(scroller)scroller.scrollTop=savedPosition;q('.knowledge-pyramid')?.focus({preventScroll:true});};
}
function renderEarnedStreak(){
 const card=q('.hp-streak'),earned=authState==='member'?streakState.days:[],streakToday=AuditModel.hanoiDate(new Date().toISOString());
 card.innerHTML='<h3>Chuỗi ngày sử dụng</h3><div class="earned-streak-body"><div class="earned-streak-heading">'+emoji('fire','ms-emoji streak-fire')+'<strong>'+((authState==='member'&&streakState.count)||0)+'</strong></div><div class="earned-calendar"><div class="earned-weekdays">'+['T2','T3','T4','T5','T6','T7','CN'].map(d=>'<span>'+d+'</span>').join('')+'</div><div class="earned-streak-grid" aria-label="Ngày sử dụng trong tháng">'+AuditModel.streakCells(streakToday,earned).map(d=>d?'<span class="earned-streak-cell '+(d.earned?'earned':'')+'" data-date="'+d.date+'" aria-label="'+d.date+(d.earned?' — Đã ghi nhận':' — Chưa ghi nhận')+'">'+(d.earned?'<b aria-hidden="true">✓</b>':'')+'</span>':'<span aria-hidden="true"></span>').join('')+'</div><small>Tháng '+Number(streakToday.slice(5,7))+' · '+streakToday.slice(0,4)+'</small></div></div>';
}
root.addEventListener('click',e=>{const b=e.target.closest('[data-knowledge]');if(!b)return;e.stopImmediatePropagation();if(b.dataset.knowledge==='rabbit')interactWithRabbit();if(b.dataset.knowledge==='pyramid')openPyramid();if(b.dataset.knowledge==='close')b.closest('.knowledge-fullscreen')._restore();},true);
root.addEventListener('keydown',e=>{const layer=q('.knowledge-fullscreen');if(!layer)return;if(e.key==='Escape')layer._restore();if(e.key==='Tab'){e.preventDefault();layer.querySelector('button').focus();}});
