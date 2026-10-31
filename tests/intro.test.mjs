import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {mountIntro,decodeNumericMotion,numericIntroPhase} from '../public/intro.js';
const bytes=readFileSync('public/assets/numeric-motion-v1.bin');
const binary=bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);
const tick=async()=>{for(let i=0;i<5;i++)await Promise.resolve();};
function fixture(){
 const classes=new Set(['intro-active']),events=[],timers=[],frames=[],glyphs=[];
 const ctx={setTransform(){},clearRect(){},fillText(text){glyphs.push(text);}};
 const canvas={getContext:()=>ctx};
 const loader={querySelector:()=>canvas,classList:{add(){}},style:{setProperty(){}}};
 const doc={documentElement:{classList:{contains:x=>classes.has(x),remove:x=>classes.delete(x)}},querySelector:()=>loader,dispatchEvent:e=>events.push(e.type)};
 const win={innerWidth:1363,innerHeight:936,devicePixelRatio:2,AbortController,fetch:async()=>({ok:true,arrayBuffer:async()=>binary}),setTimeout(fn,ms){timers.push({fn,ms});return timers.length},clearTimeout(){},requestAnimationFrame(fn){frames.push(fn);return frames.length;},cancelAnimationFrame(){},addEventListener(){},removeEventListener(){},CustomEvent:class{constructor(type){this.type=type}}};
 return {classes,events,timers,frames,glyphs,canvas,loader,doc,win};
}
test('reference coordinates decode and malformed animation data is rejected',()=>{
 const data=decodeNumericMotion(binary);assert.equal(data.frames.length,67);assert.equal(data.width,702);assert.ok(data.frames.some(f=>f.count>400));
 assert.throws(()=>decodeNumericMotion(new ArrayBuffer(3)));assert.throws(()=>decodeNumericMotion(binary.slice(0,40)));
});
test('native numerals render at display density then expand and release the hero once',async()=>{
 const f=fixture(),cleanup=mountIntro(f);await tick();f.frames[0](0);assert.ok(f.glyphs.length>0);assert.ok(f.glyphs.every(x=>x==='0'||x==='1'));assert.equal(f.canvas.width,2726);
 f.frames[1](3200);assert.ok(Number(f.loader.style.opacity)<1);f.frames[2](3500);f.timers[0].fn();assert.deepEqual(f.events,['portfolio:intro-ready']);assert.ok(!f.classes.has('intro-active'));cleanup();
 assert.equal(numericIntroPhase(0),0);assert.equal(numericIntroPhase(3500),1);
});
test('failed or stalled motion data cannot block the page',async()=>{
 const f=fixture();f.win.fetch=()=>new Promise(()=>{});mountIntro(f);assert.equal(f.timers[0].ms,4500);f.timers[0].fn();assert.ok(!f.classes.has('intro-active'));
 const g=fixture();g.win.fetch=()=>Promise.reject(new Error('offline'));mountIntro(g);await tick();assert.ok(!g.classes.has('intro-active'));
});
test('disposal aborts loading and a late response cannot restart the effect',async()=>{
 const f=fixture();let resolve;f.win.fetch=()=>new Promise(r=>{resolve=r;});const cleanup=mountIntro(f);cleanup();resolve({ok:true,arrayBuffer:async()=>binary});await tick();assert.equal(f.frames.length,0);assert.ok(!f.classes.has('intro-active'));
});
test('missing canvas and anchor arrivals do not fetch animation data',()=>{
 const f=fixture();let calls=0;f.win.fetch=()=>{calls++;};f.classes.clear();mountIntro(f);assert.equal(calls,0);
 const g=fixture();g.loader.querySelector=()=>null;mountIntro(g);assert.ok(!g.classes.has('intro-active'));
});
