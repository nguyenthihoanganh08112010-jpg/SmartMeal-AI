const AuditModel=(()=>{
 const day=s=>Math.floor(Date.parse(s+'T00:00:00Z')/86400000);
 const iso=n=>new Date(n*86400000).toISOString().slice(0,10);
 const hanoiDate=t=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(t));
 function streak(state,date,complete){const next={...state,days:[...(state.days||[])]};if(!complete)return {state:next,show:false};if(next.last!==date){next.count=day(date)-day(next.last)===1?(next.count||0)+1:1;next.last=date;if(!next.days.includes(date))next.days.push(date);}const show=next.shown!==date;next.shown=date;return {state:next,show};}
 const has=(r,k)=>r[k]!==undefined&&r[k]!==null&&r[k]!==''&&(k!=='duration'||Number(r[k])>0);
 function windowStats(rs,start,end){const rows=[...new Map(rs.filter(r=>day(r.date)>=start&&day(r.date)<=end).map(r=>[r.id,r])).values()];const dates=[...new Set(rows.map(r=>day(r.date)))].sort((a,b)=>a-b);const gap=dates.slice(1).some((d,i)=>d-dates[i]>4);return {rows,days:dates.length,gap,eligible:rows.length>=7&&dates.length>=3&&!gap};}
 function a8(rs,today,firstUse){const end=day(today),current=windowStats(rs,end-6,end),previous=windowStats(rs,end-13,end-7),age=end-day(firstUse),fields={};for(const key of ['shape','color','duration','feeling','amount','adhesion']){const a=current.rows.filter(r=>has(r,key)),b=previous.rows.filter(r=>has(r,key));fields[key]={current:a,previous:b,missing:current.rows.length-a.length,compare:age>=13&&current.eligible&&previous.eligible&&a.length>=5&&b.length>=5};}return {current,previous,age,statistics:age>=7&&current.rows.length>=3,fields,start:iso(end-6),end:today};}
 const durationGroup=n=>n<5?'<5':n<=10?'5–10':n<=15?'>10–15':'>15';
 const shapeGroup={'Cục nhỏ cứng':'Cứng (1–2)','Thỏi dài lồi lõm':'Cứng (1–2)','Thỏi dài nứt nẻ':'Thành khuôn (3–4)','Thỏi dài mịn':'Thành khuôn (3–4)','Hạt mềm':'Mềm (5)','Dạng bùn':'Lỏng (6–7)','Dạng nước':'Lỏng (6–7)'};
 const groupCounts=(rows,key)=>rows.reduce((m,r)=>{const v=key==='duration'?durationGroup(Number(r[key])):key==='shape'?shapeGroup[r[key]]||r[key]:r[key];m[v]=(m[v]||0)+1;return m;},{});
 const saveRecipe=(rows,r)=>rows.some(x=>x.id===r.id)?{rows,status:'Đã lưu'}:{rows:[...rows,{...r}],status:'Đã lưu vào Sổ tay'};
 const updateRecipe=(rows,next,yes,appearanceChanged)=>!yes?rows:rows.map(r=>r.id===next.id?{...next,imageId:appearanceChanged?next.imageId:r.imageId}:r);
 const changeGoal=(log,old,next,date)=>old===next?log:[...log,{date,from:old,to:next}];
 return {day,iso,hanoiDate,streak,a8,durationGroup,groupCounts,saveRecipe,updateRecipe,changeGoal};
})();
if(typeof module!=='undefined')module.exports=AuditModel;
