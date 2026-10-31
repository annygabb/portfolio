import test from 'node:test';
import assert from 'node:assert/strict';
import {mountIntro,introPhase,projectIntroPoint} from '../public/intro.js';
function fixture(){
 const classes=new Set(['intro-active']),events=[],timers=[],frames=[];
 const ctx={setTransform(){},clearRect(){},fillRect(){}},canvas={getContext:()=>ctx};
 const loader={querySelector:()=>canvas,style:{setProperty(){}}};
 const doc={documentElement:{classList:{contains:x=>classes.has(x),remove:x=>classes.delete(x)}},querySelector:()=>loader,dispatchEvent:e=>events.push(e.type)};
 const win={innerWidth:1363,innerHeight:936,requestAnimationFrame:fn=>{frames.push(fn);return frames.length},cancelAnimationFrame(){},setTimeout(fn,ms){timers.push({fn,ms});return timers.length},clearTimeout(){},addEventListener(){},removeEventListener(){},CustomEvent:class{constructor(type){this.type=type}}};
 return {classes,events,timers,frames,loader,doc,win};
}
test('the 3D loader opens the page even if animation frames never arrive',()=>{
 const f=fixture(),cleanup=mountIntro(f);assert.equal(f.timers[0].ms,3000);f.timers[0].fn();assert.ok(!f.classes.has('intro-active'));assert.deepEqual(f.events,['portfolio:intro-ready']);cleanup();
});
test('sphere expansion reveals the full viewport and signals the hero once',()=>{
 const f=fixture(),cleanup=mountIntro(f);f.frames[0](0);f.frames[1](1800);assert.ok(f.loader.style.maskImage.includes('radial-gradient'));f.frames[2](2400);assert.ok(!f.classes.has('intro-active'));assert.deepEqual(f.events,['portfolio:intro-ready']);f.timers[0].fn();assert.equal(f.events.length,1);cleanup();
});
test('particle perspective changes with depth and expansion reaches its full extent',()=>{
 const near=projectIntroPoint({x:.5,y:0,z:.8},0,100,1000,800),far=projectIntroPoint({x:.5,y:0,z:-.8},0,100,1000,800);
 assert.ok(near.scale>far.scale);assert.ok(near.x>far.x);assert.equal(introPhase(0),0);assert.equal(introPhase(1050),0);assert.equal(introPhase(2300),1);
});
test('missing loader does not block case content',()=>{
 const f=fixture();f.doc.querySelector=()=>null;assert.doesNotThrow(()=>mountIntro(f)());assert.ok(!f.classes.has('intro-active'));
});
