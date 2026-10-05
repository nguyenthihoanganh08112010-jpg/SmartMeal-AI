import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyData,goalReviewDue,reviewGoal,normalizeEatenSelection,saveEaten,analyze,recipeUpdate,updateSavedRecipe,verifiedNutrients,mergeGenerationChange,type Recipe,type Recommendation} from '../src/domain.ts';
const recipe=(id:string):Recipe=>({id,name:id,description:'fixture',category:'Rau',image:id,kind:'dish',ingredients:[],seasonings:[],steps:[],nutrients:[],minutes:10});
const dishes=Array.from({length:7},(_,i)=>recipe(String(i)));
const rec=(id:string):Recommendation=>({id,recipeId:id,generatedAt:'2026-10-05T08:00:00+07:00',mealType:'Bữa chính',imageReady:true});
test('six component combo is accepted, seven is rejected',()=>{
 for(const count of [6,7]){const recipes=[...dishes,{...recipe('combo'),kind:'combo' as const,components:dishes.slice(0,count).map(r=>r.id)}];
  if(count===6)assert.equal(normalizeEatenSelection([rec('combo')],recipes).length,1);
  else assert.throws(()=>normalizeEatenSelection([rec('combo')],recipes),/6/);
 }
});
test('combo priority is independent of selection order and preserves unrelated dish',()=>{
 const recipes=[...dishes,{...recipe('combo'),kind:'combo' as const,components:['0','1']}];
 for(const input of [[rec('0'),rec('combo'),rec('6')],[rec('combo'),rec('6'),rec('0')]]){
  assert.deepEqual(new Set(normalizeEatenSelection(input,recipes).map(r=>r.recipeId)),new Set(['combo','6']));
  assert.equal(saveEaten([],input,recipes,'2026-10-06','op')[0].dishes.length,2);
 }
});
test('combo normalization never hides a mixed snack/main selection',()=>{
 const recipes=[...dishes,{...recipe('combo'),kind:'combo' as const,components:['0','1']}];
 assert.throws(()=>saveEaten([],[rec('combo'),{...rec('0'),mealType:'Ăn nhẹ'}],recipes,'2026-10-05','op'),/riêng/);
});
test('two overlapping combos remain explicitly unresolved, never double counted',()=>{
 const recipes=[...dishes,...['a','b'].map(id=>({...recipe(id),kind:'combo' as const,components:['0','1']}))];
 assert.throws(()=>normalizeEatenSelection([rec('a'),rec('b')],recipes),/Hai combo/);
});
test('goal review is due after seven days only for completed profile',()=>{
 const data={...emptyData(),firstUse:'2026-09-28',profile:{name:'',goal:'fixture',taste:'Thanh đạm'}};
 assert.equal(goalReviewDue(data,'2026-10-04'),false);assert.equal(goalReviewDue(data,'2026-10-05'),true);
 assert.equal(goalReviewDue({...data,profile:{...data.profile,taste:''}},'2026-10-05'),false);
});
test('keeping and skipping keep goal history intact and postpone by seven days',()=>{
 const data={...emptyData(),firstUse:'2026-09-28',profile:{name:'',goal:'fixture',taste:'Thanh đạm'}};
 const next=reviewGoal(data,'2026-10-05');assert.equal(next.profile.goal,'fixture');assert.deepEqual(next.goalHistory,[]);
 assert.equal(goalReviewDue(next,'2026-10-11'),false);assert.equal(goalReviewDue(next,'2026-10-12'),true);
 assert.equal(reviewGoal(next,'2026-10-06','fixture').goalHistory.length,0);
 assert.equal(reviewGoal(next,'2026-10-06','other').goalHistory.length,1);
});
test('legacy missing duration is excluded from average, never converted to zero',()=>{
 const data=analyze([{id:'a',date:'2026-10-05',time:'08:00',duration:NaN},{id:'b',date:'2026-10-05',time:'09:00',duration:6}],'2026-10-05','2026-09-01');
 assert.equal(data.average,6);assert.equal(data.duration[0].percent,100);
});
test('version update applies only to saved reference, deduplicates, and requires a newer explicit version',()=>{
 const old={...recipe('old'),version:1};const next={...recipe('new'),version:2,supersedesId:'old'};
 assert.equal(recipeUpdate(old,[old,next])?.id,'new');assert.equal(recipeUpdate({...old,version:undefined},[next]),undefined);
 const saved=['old','new'];assert.deepEqual(updateSavedRecipe(saved,'old','new'),['new']);assert.deepEqual(saved,['old','new']);
});
test('a source string alone is not verified evidence; unsupported nutrient claims stay hidden',()=>{
 const r={...recipe('a'),nutrients:['test-supported','test-unsupported'],evidence:['unreviewed-url']};
 assert.deepEqual(verifiedNutrients(r),[]);
 assert.deepEqual(verifiedNutrients({...r,nutritionEvidence:[{source:'fixture',sourceId:'test',status:'verified',supports:['test-supported']}]}),['test-supported']);
 assert.deepEqual(verifiedNutrients({...r,nutritionEvidence:[{source:'fixture',sourceId:'test',status:'unverified',supports:['test-supported']}]}),[]);
});
test('a clear time modification preserves original ingredients, goal and temporary meal type',()=>{
 const context={ingredients:'fixture ingredient',goal:'fixture goal',taste:'Trung tính',mealType:'Ăn nhẹ',time:'30'};
 assert.deepEqual(mergeGenerationChange(context,{time:10,ingredients:null,goal:null,taste:null,mealType:null}),{...context,time:'10'});
 assert.equal(context.time,'30');
});
