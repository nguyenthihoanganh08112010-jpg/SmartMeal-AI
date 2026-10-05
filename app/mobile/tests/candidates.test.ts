import test from 'node:test';import assert from 'node:assert/strict';
import {validCandidate,type CatalogRow} from '../supabase/functions/_shared/candidates.ts';
const dish:CatalogRow={id:'one',approved:true,payload:{kind:'dish',minutes:15,ingredients:['test ingredient'],mealTypes:['Bữa chính'],tastes:['Trung tính']}};
const second={...dish,id:'two'};const conditions={time:20,mealType:'Bữa chính',taste:'Trung tính'};
test('candidate uses only supplied main ingredients and explicitly approved constraints',()=>{
 assert.equal(validCandidate(dish,[dish],['test ingredient'],conditions),true);
 assert.equal(validCandidate(dish,[dish],['other'],conditions),false);
 assert.equal(validCandidate({...dish,approved:false},[dish],['test ingredient'],conditions),false);
 assert.equal(validCandidate(dish,[dish],['test ingredient'],{...conditions,taste:'Đậm đà'}),false);
});
test('unverified simultaneous cooking is rejected; sequential and supported parallel plans differ',()=>{
 const combo:CatalogRow={id:'combo',approved:true,payload:{...dish.payload,kind:'combo',minutes:20,components:['one','two']}};
 const catalog=[dish,second,combo];
 assert.equal(validCandidate(combo,catalog,['test ingredient'],conditions),false);
 assert.equal(validCandidate({...combo,payload:{...combo.payload,minutes:30}},catalog,['test ingredient'],conditions),true);
 assert.equal(validCandidate({...combo,payload:{...combo.payload,parallelPreparation:{verified:true,source:'test-reviewed-plan'}}},catalog,['test ingredient'],conditions),true);
});
test('T+10 is inclusive and missing or duplicated combo children cannot pass',()=>{
 assert.equal(validCandidate({...dish,payload:{...dish.payload,minutes:30}},[dish],['test ingredient'],conditions),true);
 assert.equal(validCandidate({...dish,payload:{...dish.payload,minutes:31}},[dish],['test ingredient'],conditions),false);
 for(const components of [['missing'],['one','one']])assert.equal(validCandidate({...dish,payload:{...dish.payload,kind:'combo',components}},[dish],['test ingredient'],conditions),false);
});
