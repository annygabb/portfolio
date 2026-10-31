import test from 'node:test';
import assert from 'node:assert/strict';
import {vaporPosition,mountVapour} from '../public/vapour.js';
test('vapour particles return to their exact text positions at rest',()=>{
 const point={x:120,y:180,seed:.5};assert.deepEqual(vaporPosition(point,0,12),{x:120,y:180,alpha:1});
 const moving=vaporPosition(point,1,12);assert.ok(moving.y<point.y);assert.ok(moving.alpha>0&&moving.alpha<1);
});
test('reduced motion keeps the original footer text and skips canvas initialization',()=>{
 let queried=false;const root={querySelector(){queried=true}};
 const dispose=mountVapour({win:{IntersectionObserver:class{},matchMedia:()=>({matches:true})},doc:{},root});
 assert.equal(queried,false);assert.doesNotThrow(dispose);
});
