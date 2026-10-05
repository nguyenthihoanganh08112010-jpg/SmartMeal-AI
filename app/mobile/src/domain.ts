// Business rules from PRD 1.1. No network, UI or fabricated nutrition evidence.
export type MealSlot = 'Bữa sáng'|'Bữa trưa'|'Bữa tối'|'Ăn nhẹ';
export type GenerationContext={ingredients:string;goal:string;taste:string;mealType:string;time:string};
export function mergeGenerationChange(current:GenerationContext,change:{ingredients?:string|null;goal?:string|null;taste?:string|null;mealType?:string|null;time?:number|null}):GenerationContext {
 return {...current,ingredients:change.ingredients??current.ingredients,goal:change.goal??current.goal,taste:change.taste??current.taste,mealType:change.mealType??current.mealType,time:change.time!=null?String(change.time):current.time};
}
export type NutritionEvidence={source:string;sourceId:string;url?:string;version?:string;checkedAt?:string;foodForm?:string;unitBasis?:string;status:'verified'|'unverified';supports:string[]};
export type Recipe = {id:string; name:string; description:string; category:string; image:string; imageId?:string; kind:'dish'|'combo'; ingredients:string[]; seasonings:string[]; steps:string[]; nutrients:string[]; evidence?:string[]; nutritionEvidence?:NutritionEvidence[]; components?:string[]; minutes:number; version?:number; supersedesId?:string; seasoningSubstitutions?:string[]; mealType?:string};
export function verifiedNutrients(recipe:Recipe){return recipe.nutrients.filter(n=>recipe.nutritionEvidence?.some(e=>e.status==='verified'&&!!e.source&&!!e.sourceId&&e.supports.includes(n)));}
export type Recommendation = {id:string; recipeId:string; generatedAt:string; mealType:'Bữa chính'|'Ăn nhẹ'; imageReady:boolean; goal?:number; basic?:number; ingredientUse?:number};
export type EatenDish = {id:string; recipeId:string; recommendationId:string; generatedAt:string};
export type Occasion = {id:string; operationId:string; date:string; slot:MealSlot; dishes:EatenDish[]};
export type DigestiveRecord = {id:string; date:string; time:string; duration:number; shape?:number; color?:string; amount?:string; feeling?:string; stickiness?:string};
export type Profile = {name:string; goal:string; taste:string; height?:number; weight?:number; age?:number; gender?:string; cookingTime?:number; defaultMealType?:'Bữa chính'|'Ăn nhẹ'; desiredBenefit?:string};
export type AppData = {profile:Profile; occasions:Occasion[]; records:DigestiveRecord[]; saved:string[]; persona:string; firstUse:string; streakDays:string[]; goalReviewedAt?:string; goalHistory:{date:string;from:string;to:string}[]};
export function goalReviewDue(data:AppData,today=dayAt()){return !!data.profile.goal&&!!data.profile.taste&&shiftDay(data.goalReviewedAt||data.goalHistory.at(-1)?.date||data.firstUse,7)<=today;}
export function reviewGoal(data:AppData,date:string,newGoal?:string):AppData {
 const goal=newGoal?.trim()||data.profile.goal;
 return {...data,goalReviewedAt:date,profile:{...data.profile,goal},goalHistory:goal!==data.profile.goal?[...data.goalHistory,{date,from:data.profile.goal,to:goal}]:data.goalHistory};
}
export const COLORS = ['Trắng/xám','Vàng','Nâu nhạt','Nâu','Nâu đậm','Đen','Rất đậm'];
export const SHAPES = ['Cục nhỏ cứng','Thỏi dài lồi lõm','Thỏi dài nứt nẻ','Thỏi dài mịn','Hạt mềm','Dạng bùn','Dạng nước'];
export const MAX_COMBO_COMPONENTS=6;
export function normalizeEatenSelection(selected:Recommendation[],recipes:Recipe[]):Recommendation[] {
 const unique=[...new Map(selected.map(r=>[r.id,r])).values()];
 const combos=unique.filter(r=>recipes.find(p=>p.id===r.recipeId)?.kind==='combo');
 const covered=new Set<string>();
 for(const r of combos){const p=recipes.find(p=>p.id===r.recipeId)!;
  if(!p.components?.length||p.components.length>MAX_COMBO_COMPONENTS)throw new Error('Combo cần từ 1 đến 6 món thành phần.');
  for(const id of p.components){if(covered.has(id))throw new Error('Hai combo có món trùng nhau. Hãy xác nhận riêng từng combo.');covered.add(id);}
 }
 return unique.filter(r=>recipes.find(p=>p.id===r.recipeId)?.kind==='combo'||!covered.has(r.recipeId));
}
export function dayAt(date:Date = new Date()):string {return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);}
export function shiftDay(day:string,offset:number):string {const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+offset);return d.toISOString().slice(0,10);}
export function validDate(value:string){return /^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;}
export function classify(generatedAt:string,mealType:string):MealSlot {
  if(mealType==='Ăn nhẹ') return 'Ăn nhẹ';
  const d=new Date(generatedAt); if(!Number.isFinite(d.valueOf()))throw new Error('Thiếu thời điểm AI tạo món.');
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Ho_Chi_Minh',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(d);
  const value=(type:string)=>Number(parts.find(p=>p.type===type)?.value);
  const m=value('hour')*60+value('minute');
  return m>=150&&m<600?'Bữa sáng':m>=600&&m<930?'Bữa trưa':'Bữa tối';
}
export function saveEaten(old:Occasion[], selected:Recommendation[], recipes:Recipe[], date:string, operationId:string):Occasion[] {
  if(old.some(o=>o.operationId===operationId))return old;
  if(!selected.length)throw new Error('Hãy chọn món bạn đã ăn.');
  if(!validDate(date))throw new Error('Ngày ăn không hợp lệ.');
  if(new Set(selected.map(r=>r.mealType)).size>1)throw new Error('Hãy lưu riêng Bữa chính và Ăn nhẹ.');
  const unique=normalizeEatenSelection(selected,recipes);
  if(unique.some(r=>!r.imageReady))throw new Error('Kết quả chưa hoàn tất.');
  const slots=new Set(unique.map(r=>classify(r.generatedAt,r.mealType)));
  if(slots.size!==1)throw new Error('Hãy lưu riêng các bữa khác nhau và Ăn nhẹ.');
  const covered=new Set<string>();
  for(const r of unique){const recipe=recipes.find(x=>x.id===r.recipeId);if(!recipe)throw new Error('Không tìm thấy món.');
    for(const id of recipe.kind==='combo'?(recipe.components||[]):[recipe.id]){if(covered.has(id))throw new Error('Combo trùng món đã chọn. Hãy chọn riêng để tránh đếm trùng.');covered.add(id);}}
  return [...old,{id:operationId,operationId,date,slot:[...slots][0],dishes:unique.map(r=>({id:operationId+':'+r.id,recipeId:r.recipeId,recommendationId:r.id,generatedAt:r.generatedAt}))}];
}
export function deleteEaten(old:Occasion[],dishId:string):Occasion[]{return old.map(o=>({...o,dishes:o.dishes.filter(d=>d.id!==dishId)})).filter(o=>o.dishes.length>0);}
export function validateRecord(record:DigestiveRecord):string|undefined {
  if(!Number.isFinite(record.duration)||record.duration<=0)return 'Nhập thời lượng lớn hơn 0 phút.';
  if(!validDate(record.date))return 'Ngày không hợp lệ.';
  if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(record.time))return 'Giờ không hợp lệ (HH:mm).';
  if(record.shape!=null&&(!Number.isInteger(record.shape)||record.shape<1||record.shape>7))return 'Hình dạng không hợp lệ.';
  if(record.color&&!COLORS.includes(record.color))return 'Màu không hợp lệ.';
}
export function upsertRecord(old:DigestiveRecord[],record:DigestiveRecord):DigestiveRecord[]{const error=validateRecord(record);if(error)throw new Error(error);return [...old.filter(r=>r.id!==record.id),record];}
export function dailyCount(records:DigestiveRecord[],day:string):number|null {const n=new Set(records.filter(r=>r.date===day).map(r=>r.id)).size;return n||null;}
export function distribution<T>(records:T[],value:(r:T)=>string|undefined){const counts:Record<string,number>={};for(const r of records){const key=value(r);if(key)counts[key]=(counts[key]||0)+1;}const total=Object.values(counts).reduce((a,b)=>a+b,0);return Object.entries(counts).map(([label,count])=>({label,count,percent:count/total*100}));}
export function analyze(records:DigestiveRecord[],today:string,firstUse:string){
  const unique=[...new Map(records.map(r=>[r.id,r])).values()];
  const current=unique.filter(r=>r.date>=shiftDay(today,-6)&&r.date<=today);
  const previous=unique.filter(r=>r.date>=shiftDay(today,-13)&&r.date<=shiftDay(today,-7));
  const coverage=(rs:DigestiveRecord[])=>{const days=[...new Set(rs.map(r=>r.date))].sort();return rs.length>=7&&days.length>=3&&days.every((d,i)=>i===0||(Date.parse(d)-Date.parse(days[i-1]))/86400000<=4);};
  const eligible=firstUse<=shiftDay(today,-7)&&current.length>=3;
  const fieldEligible=(field:keyof DigestiveRecord)=>eligible&&coverage(current)&&coverage(previous)&&[current,previous].every(rs=>rs.filter(r=>r[field]!=null&&r[field]!=='').length>=5);
  const durations=current.filter(r=>Number.isFinite(r.duration)&&r.duration>0);
  return {current,previous,eligible,fieldEligible,shape:distribution(current,r=>r.shape? r.shape<=2?'Cứng (1–2)':r.shape<=4?'Thành khuôn (3–4)':r.shape===5?'Mềm (5)':'Lỏng (6–7)':undefined),color:distribution(current,r=>r.color),duration:distribution(durations,r=>r.duration<5?'<5':r.duration<=10?'5–10':r.duration<=15?'>10–15':'>15'),average:durations.length?durations.reduce((n,r)=>n+r.duration,0)/durations.length:null};
}
export function streak(days:string[],today:string){const set=new Set(days);let n=0,d=set.has(today)?today:shiftDay(today,-1);while(set.has(d)){n++;d=shiftDay(d,-1);}return n;}
export function rank(recs:Recommendation[],recipes:Recipe[],time:number){
  const available=recs.filter(r=>r.imageReady).map(r=>({r,recipe:recipes.find(p=>p.id===r.recipeId)})).filter(x=>x.recipe&&x.recipe.minutes<=time+10);
  // Pareto layers on verified G/B. Conflicts and ties stay together; I alone never breaks an unapproved tie.
  const layers=new Map<string,number>();let rest=available.filter(x=>x.recipe!.minutes<=time&&x.r.goal!=null&&x.r.basic!=null).map(x=>x.r),level=1;
  while(rest.length){const front=rest.filter(a=>!rest.some(b=>b.id!==a.id&&b.goal!>=a.goal!&&b.basic!>=a.basic!&&(b.goal!>a.goal!||b.basic!>a.basic!)));front.forEach(r=>layers.set(r.id,level));rest=rest.filter(r=>!layers.has(r.id));level++;}
  return available.map(({r,recipe})=>({...r,group:recipe!.minutes>time?'Dự phòng':r.goal==null?'Chưa đủ dữ liệu để đánh giá mục tiêu này':r.basic==null?'Chưa đủ dữ liệu điều kiện để so sánh':`Nhóm lựa chọn ${layers.get(r.id)||1}`,exceeded:Math.max(0,recipe!.minutes-time)}));
}
export function emptyData():AppData{return {profile:{name:'',goal:'',taste:''},occasions:[],records:[],saved:[],persona:'hin',firstUse:dayAt(),streakDays:[],goalHistory:[]};}
export function recipeUpdate(current:Recipe,catalog:Recipe[]){return catalog.filter(r=>r.supersedesId===current.id&&r.version!=null&&current.version!=null&&r.version>current.version&&r.kind===current.kind).sort((a,b)=>b.version!-a.version!)[0];}
export function updateSavedRecipe(saved:string[],oldId:string,nextId:string){return [...new Set(saved.map(id=>id===oldId?nextId:id))];}
