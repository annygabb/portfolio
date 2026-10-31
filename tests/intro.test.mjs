import test from 'node:test';
import assert from 'node:assert/strict';
import {mountIntro} from '../public/intro.js';
test('the entry fails open after its deadline when a font or image never resolves',async()=>{
 const classes=new Set(['intro-active']),events=[],timers=[];
 const loader={classList:{add:x=>classes.add(x)}},doc={documentElement:{classList:{contains:x=>classes.has(x),remove:x=>classes.delete(x)}},querySelector:q=>q==='.site-intro'?loader:null,fonts:{ready:new Promise(()=>{})},dispatchEvent:e=>events.push(e.type)};
 const win={setTimeout(fn,ms){timers.push({fn,ms});return timers.length},clearTimeout(){},sessionStorage:{setItem(){}},CustomEvent:class{constructor(type){this.type=type}}};
 const cleanup=mountIntro({win,doc});assert.equal(timers[0].ms,850);timers[0].fn();await Promise.resolve();await Promise.resolve();
 assert.ok(classes.has('intro-leaving'));assert.equal(timers[1].ms,220);timers[1].fn();assert.ok(!classes.has('intro-active'));assert.deepEqual(events,['portfolio:intro-ready']);cleanup();
});
test('missing loader does not block case content',()=>{
 const classes=new Set(['intro-active']);const doc={documentElement:{classList:{remove:x=>classes.delete(x)}},querySelector:()=>null,dispatchEvent(){}};
 const win={sessionStorage:{setItem(){}},CustomEvent:class{},clearTimeout(){}};
 assert.doesNotThrow(()=>mountIntro({win,doc})());assert.ok(!classes.has('intro-active'));
});
