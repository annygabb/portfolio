import test from 'node:test';
import assert from 'node:assert/strict';
import {observeVisibility,risingPoints,mountContentMotion} from '../public/content-motion.js';
test('visibility replay ignores skipped sections and restarts after leaving and returning',()=>{
 let callback,disconnected=false;const element={},events=[];
 const win={IntersectionObserver:class{constructor(fn){callback=fn}observe(){}disconnect(){disconnected=true}}};
 const cleanup=observeVisibility(win,[element],()=>events.push('enter'),()=>events.push('leave'));
 callback([{target:element,isIntersecting:false,intersectionRatio:0}]);assert.deepEqual(events,[]);
 callback([{target:element,isIntersecting:true,intersectionRatio:.2}]);callback([{target:element,isIntersecting:true,intersectionRatio:.8}]);assert.deepEqual(events,['enter']);
 callback([{target:element,isIntersecting:false,intersectionRatio:0}]);callback([{target:element,isIntersecting:true,intersectionRatio:.2}]);assert.deepEqual(events,['enter','leave','enter']);cleanup();assert.equal(disconnected,true);
});
test('Lighthouse rises from the declared 80 baseline to exactly the recorded coordinates',()=>{
 const points='65,66 230,50 395,50 560,50';
 assert.equal(risingPoints(points,0),'65,210 230,210 395,210 560,210');
 assert.equal(risingPoints(points,.5),'65,138 230,130 395,130 560,130');
 assert.equal(risingPoints(points,1),points);assert.equal(risingPoints('65,50 230,98',1),'65,50 230,98');
});
test('count begins only on real visibility, reaches 60 and can replay',()=>{
 let callback;const number={textContent:'60',getAttribute:()=> '60',closest:()=>null};
 const win={IntersectionObserver:class{constructor(fn){callback=fn}observe(){}disconnect(){}}};
 const doc={querySelectorAll:q=>q==='[data-count-to]'?[number]:[]},calls=[];
 const gsap={to(state,vars){const tween={state,vars,killed:false,kill(){this.killed=true}};calls.push(tween);return tween;}};
 const cleanup=mountContentMotion({win,doc,gsap});assert.equal(number.textContent,'0');assert.equal(calls.length,0);
 callback([{target:number,isIntersecting:false,intersectionRatio:0}]);assert.equal(calls.length,0);
 callback([{target:number,isIntersecting:true,intersectionRatio:.4}]);assert.equal(calls.length,1);calls[0].state.value=31.8;calls[0].vars.onUpdate();assert.equal(number.textContent,'32');calls[0].state.value=60;calls[0].vars.onUpdate();assert.equal(number.textContent,'60');
 callback([{target:number,isIntersecting:false,intersectionRatio:0}]);assert.equal(number.textContent,'0');assert.equal(calls[0].killed,true);
 callback([{target:number,isIntersecting:true,intersectionRatio:.4}]);assert.equal(calls.length,2);cleanup();assert.equal(number.textContent,'60');assert.equal(calls[1].killed,true);
});
test('without visibility support the real number remains readable',()=>{const number={textContent:'60'},cleanup=mountContentMotion({win:{},doc:{},gsap:{}});cleanup();assert.equal(number.textContent,'60');});
