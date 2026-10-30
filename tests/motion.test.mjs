import test from 'node:test';
import assert from 'node:assert/strict';
import {mountMotion} from '../public/motion.js';
function fixture({reduce=false,desktop=true}={}){
 const classes=new Set(),listeners=new Map(),ticks=new Set(),state={created:0,destroyed:0,frames:[],refresh:0,reverted:0,resets:0,stops:0,starts:0};
 const root={classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)}};
 const doc={documentElement:root,querySelector:()=>null,querySelectorAll:()=>[],addEventListener:(k,v)=>listeners.set(k,v),removeEventListener:(k)=>listeners.delete(k)};
 const win={location:{href:'https://portfolio.example/'},matchMedia:q=>({matches:q.includes('reduced-motion')?reduce:desktop}),addEventListener(){},removeEventListener(){}};
 const ScrollTrigger={update(){},refresh(){state.refresh++}};
 const gsap={registerPlugin(){},ticker:{add:f=>ticks.add(f),remove:f=>ticks.delete(f),lagSmoothing(){}},matchMedia(){return {add(q,fn){this.cleanup=fn({conditions:{desktop,motion:!reduce},add:(name,fn)=>fn()})},revert(){state.reverted++;this.cleanup?.()}}},from(){return {revert(){}}},fromTo(){return {revert(){}}},to(){return {revert(){}}}};
 class Lenis{constructor(options){state.created++;state.options=options}on(){}off(){}raf(t){state.frames.push(t)}stop(){state.stops++}start(){state.starts++}reset(){state.resets++}destroy(){state.destroyed++}}
 return {win,doc,gsap,ScrollTrigger,Lenis,ticks,listeners,state,classes};
}
test('reduced motion skips smooth scrolling and ticker registration',()=>{
 const f=fixture({reduce:true});const cleanup=mountMotion(f);
 assert.equal(f.state.created,0);assert.equal(f.ticks.size,0);cleanup();
});
test('Lenis uses one GSAP ticker, converts seconds to ms and cleans up',()=>{
 const f=fixture();const cleanup=mountMotion(f);assert.equal(f.state.created,1);assert.equal(f.ticks.size,1);
 assert.equal(f.state.options.autoRaf,false);assert.equal(f.state.options.syncTouch,false);
 for(const tick of f.ticks)tick(1.25);assert.deepEqual(f.state.frames,[1250]);
 cleanup();cleanup();assert.equal(f.ticks.size,0);assert.equal(f.state.destroyed,1);assert.equal(f.listeners.has('portfolio:layout'),false);
});
test('touch/mobile uses native scrolling while GSAP can enhance content',()=>{
 const f=fixture({desktop:false});const cleanup=mountMotion(f);assert.equal(f.state.created,0);assert.equal(f.ticks.size,0);cleanup();
});
test('filter layout changes refresh scroll measurements',()=>{
 const f=fixture();const cleanup=mountMotion(f);const before=f.state.refresh;
 f.listeners.get('portfolio:layout')();assert.ok(f.state.refresh>before);cleanup();
});
test('missing optional libraries leaves the document usable',()=>{
 const f=fixture();assert.doesNotThrow(()=>mountMotion({...f,gsap:undefined})());assert.equal(f.state.created,0);
});
test('native anchor links reset wheel inertia before browser navigation',()=>{
 const f=fixture();const cleanup=mountMotion(f);
 const link={href:'https://portfolio.example/#skills',target:'',hasAttribute:()=>false};
 const event={button:0,target:{closest:()=>link}};
 f.listeners.get('click')?.(event);
 assert.equal(f.state.resets,1,'a native hash jump must reset pending smooth animation');
 cleanup();assert.equal(f.listeners.has('click'),false);
});

test('opening a proof dialog stops background scrolling and closing resumes it',()=>{
 const f=fixture();const cleanup=mountMotion(f);
 f.listeners.get('portfolio:dialog')?.({detail:{open:true}});
 assert.equal(f.state.stops,1);
 f.listeners.get('portfolio:dialog')?.({detail:{open:false}});
 assert.equal(f.state.starts,1);
 cleanup();assert.equal(f.listeners.has('portfolio:dialog'),false);
});
