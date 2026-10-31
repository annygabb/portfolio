import test from 'node:test';
import assert from 'node:assert/strict';
import {mountIntro} from '../public/intro.js';
function fixture(){
 const classes=new Set(['intro-active']),events=[],timers=[],listeners=new Map();let paused=0,played=0;
 const video={pause(){paused++;},play(){played++;return Promise.resolve();},addEventListener:(type,fn)=>listeners.set(type,fn),removeEventListener:type=>listeners.delete(type)};
 const loader={querySelector:()=>video,classList:{add(){}}};
 const doc={documentElement:{classList:{contains:x=>classes.has(x),remove:x=>classes.delete(x)}},querySelector:()=>loader,dispatchEvent:e=>events.push(e.type)};
 const win={setTimeout(fn,ms){timers.push({fn,ms});return timers.length},clearTimeout(){},CustomEvent:class{constructor(type){this.type=type}}};
 return {classes,events,timers,listeners,loader,doc,win,video,get paused(){return paused;},get played(){return played;}};
}
test('the reference video releases the hero once on playback completion',()=>{
 const f=fixture(),cleanup=mountIntro(f);assert.equal(f.played,1);f.listeners.get('ended')();f.timers[0].fn();assert.equal(f.paused,1);assert.deepEqual(f.events,['portfolio:intro-ready']);assert.ok(!f.classes.has('intro-active'));cleanup();assert.equal(f.listeners.size,0);
});
test('a stalled video never blocks the portfolio indefinitely',()=>{
 const f=fixture();mountIntro(f);assert.equal(f.timers[0].ms,6500);f.timers[0].fn();assert.ok(!f.classes.has('intro-active'));assert.equal(f.events.length,1);
});
test('media errors and autoplay rejection open the content',async()=>{
 const f=fixture();mountIntro(f);f.listeners.get('error')();assert.ok(!f.classes.has('intro-active'));
 const blocked=fixture();blocked.video.play=()=>Promise.reject(new Error('autoplay blocked'));mountIntro(blocked);await Promise.resolve();assert.ok(!blocked.classes.has('intro-active'));assert.equal(blocked.events.length,1);
});
test('direct anchor arrivals do not download or play the loading video',()=>{
 const f=fixture();f.classes.clear();mountIntro(f);assert.equal(f.played,0);
});
test('missing loader and missing media leave content accessible',()=>{
 const f=fixture();f.doc.querySelector=()=>null;assert.doesNotThrow(()=>mountIntro(f)());assert.ok(!f.classes.has('intro-active'));
 const g=fixture();g.loader.querySelector=()=>null;mountIntro(g);assert.ok(!g.classes.has('intro-active'));
});
