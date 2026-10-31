import test from 'node:test';
import assert from 'node:assert/strict';
import {mountIntro} from '../public/intro.js';
function fixture(){
 const classes=new Set(['intro-active']),loaderClasses=new Set(),events=[],timers=[];
 const loader={classList:{add:x=>loaderClasses.add(x)}};
 const doc={fonts:{ready:Promise.resolve()},documentElement:{classList:{contains:x=>classes.has(x),remove:x=>classes.delete(x)}},querySelector:()=>loader,dispatchEvent:e=>events.push(e.type)};
 const win={setTimeout(fn,ms){timers.push({fn,ms});return timers.length},clearTimeout(){},CustomEvent:class{constructor(type){this.type=type}}};
 return {classes,loaderClasses,events,timers,loader,doc,win};
}
test('the typographic entrance releases the hero exactly once without fetching a video',async()=>{
 const f=fixture(),cleanup=mountIntro(f);await Promise.resolve();assert.ok(f.loaderClasses.has('intro-type-ready'));assert.equal(f.timers[0].ms,1650);f.timers[0].fn();f.timers[0].fn();assert.deepEqual(f.events,['portfolio:intro-ready']);assert.ok(!f.classes.has('intro-active'));cleanup();
});
test('a font request that never settles cannot block the portfolio',()=>{
 const f=fixture();f.doc.fonts.ready=new Promise(()=>{});mountIntro(f);f.timers[0].fn();assert.ok(!f.classes.has('intro-active'));assert.equal(f.events.length,1);
});
test('teardown prevents a late font response from restarting the entrance',async()=>{
 const f=fixture();let done;f.doc.fonts.ready=new Promise(resolve=>{done=resolve;});const cleanup=mountIntro(f);cleanup();done();await Promise.resolve();assert.ok(!f.loaderClasses.has('intro-type-ready'));assert.ok(!f.classes.has('intro-active'));
});
test('missing loader and direct anchor arrivals keep content accessible',()=>{
 const f=fixture();f.doc.querySelector=()=>null;assert.doesNotThrow(()=>mountIntro(f)());assert.ok(!f.classes.has('intro-active'));
 const g=fixture();g.classes.clear();mountIntro(g);assert.equal(g.timers.length,0);
});
