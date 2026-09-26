'use strict';
const assert=require('node:assert/strict');
const M=require('./meal-update-model.js'),A=require('./audit-model.js');
let passed=0;const test=(name,fn)=>{fn();passed++;console.log('PASS '+name);};
const main={id:'dish',kind:'main',name:'Món mẫu'},when=t=>'2026-09-26T'+t+'+07:00';
test('All approved minute boundaries use Ho Chi Minh time',()=>{
 for(const [time,slot] of [['00:00:00','Bữa sáng'],['09:30:00','Bữa sáng'],['09:31:00','Bữa sáng'],['09:59:59','Bữa sáng'],['10:00:00','Bữa trưa'],['14:59:59','Bữa trưa'],['15:00:00','Bữa tối'],['23:59:59','Bữa tối']])assert.equal(M.approvedMealSlot(when(time)),slot);
 assert.equal(M.approvedMealSlot('2026-09-26T03:00:00Z'),'Bữa trưa');
});
test('Generation A stays breakfast when confirmation B is evening',()=>{
 const original=when('08:00:00'),later=when('20:00:00'),recommendations=M.stampRecommendations([main],original,'batch-1');
 assert.throws(()=>{recommendations[0].generatedAt=later;},TypeError);
 const saved=M.save([],recommendations,'2026-09-26','save-1',{confirmedAt:later});
 assert.ok(saved.ok);assert.equal(saved.occasion.section,'Bữa sáng');assert.equal(saved.occasion.confirmedAt,later);
 assert.equal(saved.occasion.items[0].generatedAt,original);assert.equal(saved.occasion.items[0].recommendationId,'batch-1:dish');
 assert.equal(saved.occasion.items[0].classificationSource,'AI_GENERATED_AT');
});
test('Confirmation next day does not change generation slot or selected eating date',()=>{
 const rs=M.stampRecommendations([main],when('14:30:00'),'batch-2');
 const x=M.save([],rs,'2026-09-27','save-2',{confirmedAt:'2026-09-27T06:00:00+07:00'});
 assert.equal(x.occasion.section,'Bữa trưa');assert.equal(x.occasion.date,'2026-09-27');
});
test('Snack remains snack regardless of generation time',()=>{
 for(const t of ['08:00:00','12:00:00','20:00:00'])assert.equal(M.save([],M.stampRecommendations([{...main,kind:'snack'}],when(t),'snack'),'2026-09-26',t).occasion.section,'Ăn nhẹ');
});
test('Missing generation metadata or missing resolver cannot invent a main-meal category',()=>{
 assert.equal(M.save([],[main],'2026-09-26','missing').code,'UNRESOLVED_MEAL_SLOT');
 const rs=M.stampRecommendations([main],when('08:00:00'),'b');
 assert.equal(M.save([],rs,'2026-09-26','unresolved',{slotResolver:null}).ok,false);
});
test('Three same-generation dishes stay one occasion; final deletion still decrements once',()=>{
 const rs=M.stampRecommendations([main,{...main,id:'2'},{...main,id:'3'}],when('15:00:00'),'three');
 const x=M.save([],rs,'2026-09-26','three-save');assert.equal(x.occasion.section,'Bữa tối');assert.equal(M.counts(x.rows,'2026-09-26').main,1);
 const mid=M.removeDish(x.rows,x.occasion.items[1].id);assert.equal(mid[0].items.length,2);assert.equal(M.counts(mid,'2026-09-26').main,1);
 const end=mid[0].items.reduce((acc,r)=>M.removeDish(acc,r.id),mid);assert.equal(M.counts(end,'2026-09-26').main,0);
 const duplicate=M.save(x.rows,rs,'2026-09-26','three-save',{confirmedAt:when('23:00:00')});assert.ok(duplicate.duplicate);assert.deepEqual(duplicate.rows,x.rows);
});
test('Streak calendar has actual dates, never fills unearned or future squares',()=>{
 const cells=A.streakCells('2026-09-26',['2026-09-25','2026-09-26','2026-09-27','2026-08-30']);
 assert.equal(cells.length%7,0);assert.equal(cells.filter(Boolean).length,30);assert.deepEqual(cells.filter(x=>x?.earned).map(x=>x.date),['2026-09-25','2026-09-26']);
 assert.equal(A.streakCells('2026-09-26',[]).filter(x=>x?.earned).length,0);
});
test('Qualifying activity adds one checked day, duplicate entry does not add another',()=>{
 let r=A.streak({days:[],count:0},A.hanoiDate('2026-09-25T18:00:00Z'),true);
 assert.deepEqual(r.state.days,['2026-09-26']);r=A.streak(r.state,'2026-09-26',true);assert.equal(r.state.count,1);assert.equal(r.state.days.length,1);
 assert.equal(A.streakCells('2026-09-26',r.state.days).filter(x=>x?.earned).length,1);
});
console.log(passed+' approved-fix model tests passed. Browser checks are recorded separately.');
