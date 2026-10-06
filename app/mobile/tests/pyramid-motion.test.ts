import test from 'node:test';
import assert from 'node:assert/strict';
import {pyramidDrag} from '../src/pyramidMotion.ts';
test('pyramid resistance is continuous, symmetric, monotone and bounded for extreme drags',()=>{
 assert.equal(pyramidDrag(0),0);
 let previous=-101;
 for(let distance=-5000;distance<=5000;distance++){
  const value=pyramidDrag(distance);
  assert.ok(value>=-100&&value<=100);
  assert.ok(value>=previous);
  assert.ok(value-previous<1.01);
  assert.ok(Math.abs(value+pyramidDrag(-distance))<1e-10);
  previous=value;
 }
 assert.equal(pyramidDrag(Infinity),0);
 assert.equal(pyramidDrag(NaN),0);
});
