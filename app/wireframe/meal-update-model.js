(function(scope){
const copy=x=>JSON.parse(JSON.stringify(x));
function removeDish(rows,id){return rows.map(r=>({...r,items:r.items.filter(d=>d.id!==id)})).filter(r=>r.items.length);}
function counts(rows,date){const distinct=[...new Map(rows.filter(r=>r.saved&&r.date===date&&r.items.length).map(r=>[r.id,r])).values()];return {total:distinct.length,main:distinct.filter(r=>r.kind==='main').length,snack:distinct.filter(r=>r.kind==='snack').length};}
// User-approved local-time ranges, including the 09:31–09:59 clarification.
function approvedMealSlot(generatedAt){
 const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Ho_Chi_Minh',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(generatedAt));
 const minute=Number(parts.find(p=>p.type==='hour').value)*60+Number(parts.find(p=>p.type==='minute').value);
 if(minute<600)return 'Bữa sáng';
 if(minute<900)return 'Bữa trưa';
 return 'Bữa tối';
}
function stampRecommendations(rows,generatedAt,batchId){
 if(!generatedAt||!Number.isFinite(Date.parse(generatedAt)))throw new Error('Invalid generation timestamp');
 return rows.map(r=>Object.freeze({...r,generatedAt,recommendationId:batchId+':'+r.id}));
}
function classifyGeneration(generatedAt,resolver=approvedMealSlot){
 if(!generatedAt||!Number.isFinite(Date.parse(generatedAt)))return {mealSlot:null,status:'MISSING_GENERATED_AT'};
 if(!resolver)return {mealSlot:null,status:'UNRESOLVED_MAPPING'};
 const mealSlot=resolver(generatedAt,'Asia/Ho_Chi_Minh');
 return ['Bữa sáng','Bữa trưa','Bữa tối'].includes(mealSlot)?{mealSlot,status:'RESOLVED'}:{mealSlot:null,status:'UNRESOLVED_MAPPING'};
}
function save(rows,selected,date,token,context={}){
 if(rows.some(r=>r.saveToken===token))return {ok:true,duplicate:true,rows};
 if(!selected.length)return {ok:false,error:'Hãy chọn món thực sự đã ăn.'};
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||(!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date))return {ok:false,error:'Hãy chọn ngày ăn hợp lệ.'};
 const unique=[...new Map(selected.map(r=>[r.id,r])).values()];
 if(unique.some(r=>!['main','snack'].includes(r.kind)))return {ok:false,error:'Cần làm rõ loại bữa trước khi lưu.'};
 if(new Set(unique.map(r=>r.kind)).size>1)return {ok:false,error:'Hãy lưu Bữa chính và Ăn nhẹ riêng. Chưa lưu món nào.'};
 const seen=new Set();for(const r of unique){for(const id of r.parts||[r.id]){if(seen.has(id))return {ok:false,error:'Combo và món thành phần bị trùng. Quy tắc xử lý chưa chốt; hãy bỏ lựa chọn trùng trước khi lưu.'};seen.add(id);}}
 const items=unique.map((r,i)=>{const classification=r.kind==='snack'?{mealSlot:'Ăn nhẹ',status:'RESOLVED'}:classifyGeneration(r.generatedAt,context.slotResolver);return {id:'eaten-'+token+'-'+i,recipeId:r.id,title:r.name,components:r.parts?copy(r.parts):undefined,recommendationId:r.recommendationId||null,generatedAt:r.generatedAt||null,classificationSource:r.kind==='snack'?'RECOMMENDATION_MEAL_TYPE':'AI_GENERATED_AT',mealSlot:classification.mealSlot,classificationStatus:classification.status};});
 if(items.some(r=>!r.mealSlot))return {ok:false,error:'Chưa có quy tắc giờ sáng/trưa/tối được duyệt hoặc thiếu thời điểm AI tạo món. Chưa lưu; lựa chọn của bạn vẫn được giữ.',code:'UNRESOLVED_MEAL_SLOT'};
 const slots=new Set(items.map(r=>r.mealSlot));
 if(slots.size!==1)return {ok:false,error:'Các món thuộc các bữa khác nhau. Hãy xác nhận từng bữa riêng.',code:'MIXED_MEAL_SLOTS'};
 const section=items[0].mealSlot;
 const occasion={id:'occasion-'+token,saveToken:token,date,time:'',confirmedAt:context.confirmedAt||null,kind:unique[0].kind,section,saved:true,items};
 return {ok:true,rows:[...rows,occasion],occasion};
}
function timeGroup(minutes,T){return minutes<=T?'valid':minutes<=T+10?'backup':'excluded';}
// Comparison values are supplied only by a verified upstream assessment. No nutrient score is inferred here.
function compare(a,b){if(!a.verifiedG||!b.verifiedG)return 'insufficient';const g=a.G-b.G,basic=a.B-b.B;if(g===0&&basic===0)return a.I===b.I?'tie':'same-group';if(g*basic<0)return 'same-group';if(g>=0&&basic>=0)return 'a';return 'b';}
function permission(){let value=false;return {get:()=>value,set:v=>value=!!v,consume:()=>{const used=value;value=false;return used;},reset:()=>value=false};}
scope.MealUpdate={removeDish,counts,save,timeGroup,compare,permission,stampRecommendations,classifyGeneration,approvedMealSlot};if(typeof module!=='undefined')module.exports=scope.MealUpdate;
})(typeof window==='undefined'?globalThis:window);
