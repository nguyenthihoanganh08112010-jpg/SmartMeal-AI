(function(scope){
const copy=x=>JSON.parse(JSON.stringify(x));
function removeDish(rows,id){return rows.map(r=>({...r,items:r.items.filter(d=>d.id!==id)})).filter(r=>r.items.length);}
function counts(rows,date){const distinct=[...new Map(rows.filter(r=>r.saved&&r.date===date&&r.items.length).map(r=>[r.id,r])).values()];return {total:distinct.length,main:distinct.filter(r=>r.kind==='main').length,snack:distinct.filter(r=>r.kind==='snack').length};}
function save(rows,selected,date,token){
 if(rows.some(r=>r.saveToken===token))return {ok:true,duplicate:true,rows};
 if(!selected.length)return {ok:false,error:'Hãy chọn món thực sự đã ăn.'};
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||(!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date))return {ok:false,error:'Hãy chọn ngày ăn hợp lệ.'};
 const unique=[...new Map(selected.map(r=>[r.id,r])).values()];
 if(unique.some(r=>!['main','snack'].includes(r.kind)))return {ok:false,error:'Cần làm rõ loại bữa trước khi lưu.'};
 if(new Set(unique.map(r=>r.kind)).size>1)return {ok:false,error:'Hãy lưu Bữa chính và Ăn nhẹ riêng. Chưa lưu món nào.'};
 const seen=new Set();for(const r of unique){for(const id of r.parts||[r.id]){if(seen.has(id))return {ok:false,error:'Combo và món thành phần bị trùng. Quy tắc xử lý chưa chốt; hãy bỏ lựa chọn trùng trước khi lưu.'};seen.add(id);}}
 const occasion={id:'occasion-'+token,saveToken:token,date,time:'',kind:unique[0].kind,section:unique[0].kind==='main'?'Bữa chính':'Ăn nhẹ',saved:true,items:unique.map((r,i)=>({id:'eaten-'+token+'-'+i,recipeId:r.id,title:r.name,components:r.parts?copy(r.parts):undefined}))};
 return {ok:true,rows:[...rows,occasion],occasion};
}
function timeGroup(minutes,T){return minutes<=T?'valid':minutes<=T+10?'backup':'excluded';}
// Comparison values are supplied only by a verified upstream assessment. No nutrient score is inferred here.
function compare(a,b){if(!a.verifiedG||!b.verifiedG)return 'insufficient';const g=a.G-b.G,basic=a.B-b.B;if(g===0&&basic===0)return a.I===b.I?'tie':'same-group';if(g*basic<0)return 'same-group';if(g>=0&&basic>=0)return 'a';return 'b';}
function permission(){let value=false;return {get:()=>value,set:v=>value=!!v,consume:()=>{const used=value;value=false;return used;},reset:()=>value=false};}
scope.MealUpdate={removeDish,counts,save,timeGroup,compare,permission};if(typeof module!=='undefined')module.exports=scope.MealUpdate;
})(typeof window==='undefined'?globalThis:window);
