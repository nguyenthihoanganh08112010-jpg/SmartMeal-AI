// Pure validation shared by the server and tests. A model cannot bypass these gates.
type Payload={kind:string;minutes:number;ingredients:string[];mealTypes?:string[];tastes?:string[];components?:string[];parallelPreparation?:{verified:boolean;source:string}};
export type CatalogRow={id:string;approved:boolean;payload:Payload};
export function validCandidate(row:CatalogRow,catalog:CatalogRow[],ingredients:string[],conditions:{time:string|number;mealType:string;taste:string}){
 const p=row.payload,t=Number(conditions.time),available=new Set(ingredients.map(i=>i.trim().toLocaleLowerCase('vi')));
 const ingredientsFit=(value:Payload)=>Array.isArray(value.ingredients)&&value.ingredients.length>0&&value.ingredients.every(i=>typeof i==='string'&&available.has(i.trim().toLocaleLowerCase('vi')));
 if(!row.approved||!Number.isFinite(t)||t<=0||!Number.isFinite(p.minutes)||p.minutes<=0||p.minutes>t+10||!ingredientsFit(p)||!p.mealTypes?.includes(conditions.mealType)||!p.tastes?.includes(conditions.taste))return false;
 if(p.kind==='dish')return true;
 if(p.kind!=='combo'||!p.components?.length||p.components.length>6||new Set(p.components).size!==p.components.length)return false;
 const children=p.components.map(id=>catalog.find(c=>c.id===id));
 if(children.some(c=>!c?.approved||c.payload.kind!=='dish'||!ingredientsFit(c.payload)||!Number.isFinite(c.payload.minutes)||c.payload.minutes<=0))return false;
 const sequential=children.reduce((n,c)=>n+c!.payload.minutes,0);
 return p.minutes>=sequential||(p.parallelPreparation?.verified===true&&!!p.parallelPreparation.source);
}
