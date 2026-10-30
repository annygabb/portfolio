import test from 'node:test';
import assert from 'node:assert/strict';
import {mountMotion} from '../public/motion.js';
function fixture({reduce=false,desktop=true,shortViewport=false}={}){
 const classes=new Set(),listeners=new Map(),ticks=new Set(),state={created:0,destroyed:0,frames:[],refresh:0,reverted:0,resets:0,stops:0,starts:0};
 const root={classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)}};
 const doc={documentElement:root,querySelector:()=>null,querySelectorAll:()=>[],addEventListener:(k,v)=>listeners.set(k,v),removeEventListener:(k)=>listeners.delete(k)};
 const win={location:{href:'https://portfolio.example/'},matchMedia:q=>({matches:q.includes('reduced-motion')?reduce:desktop}),addEventListener(){},removeEventListener(){},clearTimeout(){},setTimeout:fn=>{fn();return 1}};
 const ScrollTrigger={update(){},refresh(){state.refresh++}};
 const gsap={registerPlugin(){},ticker:{add:f=>ticks.add(f),remove:f=>ticks.delete(f),lagSmoothing(){}},matchMedia(){return {add(q,fn){const context={conditions:{desktop,staged:!shortViewport,motion:!reduce}};context.add=(name,method)=>{context[name]=method};this.cleanup=fn(context)},revert(){state.reverted++;this.cleanup?.()}}},from(){return {revert(){}}},fromTo(){return {revert(){}}},to(){return {revert(){}}}};
 class Lenis{constructor(options){state.created++;state.options=options}on(){}off(){}raf(t){state.frames.push(t)}stop(){state.stops++}start(){state.starts++}scrollTo(y){state.restoredY=y}reset(){state.resets++}destroy(){state.destroyed++}}
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

test('project screens overlap in perspective while the fixed container itself is never transformed',()=>{
 const f=fixture(),screen={},visual={},scene={},stage={querySelector:q=>q==='.project-screen'?screen:q==='.project-scene'?scene:q==='.stage-visual'?visual:null};
 const original=f.doc.querySelectorAll;f.doc.querySelectorAll=q=>q==='.project-stage:not([hidden])'?[stage,stage]:original(q);
 const recorded=[];let reverted=0;f.gsap.fromTo=(target,from,to)=>{recorded.push({target,from,to});return {revert(){reverted++}}};
 const cleanup=mountMotion(f);
 const entries=recorded.filter(x=>x.target===scene&&x.from.z<0),pins=recorded.filter(x=>x.to.scrollTrigger.pin);
 assert.equal(entries.length,2);assert.ok(entries.every(x=>x.from.rotationX>0&&x.from.rotationY!==0&&x.to.z===0));
 assert.ok(recorded.every(x=>x.target!==screen));assert.equal(pins[0].to.scrollTrigger.pin,screen);assert.equal(pins[0].to.scrollTrigger.pinSpacing,false);assert.equal(pins[1].to.scrollTrigger.pinSpacing,true);
 assert.ok(pins[0].to.z<0&&pins[0].to.rotationX<0);cleanup();assert.equal(reverted,recorded.length);
});

test('short desktop windows keep project content fully visible in natural scrolling',()=>{
 const f=fixture({shortViewport:true}),a={querySelector:()=>({})},b={querySelector:()=>({})};
 const original=f.doc.querySelectorAll;f.doc.querySelectorAll=q=>q==='.project-stage:not([hidden])'?[a,b]:original(q);
 let transitions=0;f.gsap.fromTo=()=>{transitions++;return {revert(){}}};
 const cleanup=mountMotion(f);assert.equal(transitions,0);assert.equal(f.state.created,1);cleanup();
});

test('project scenes also pin with a coarse pointer when the viewport fits',()=>{
 const f=fixture({desktop:false}),screen={},visual={},scene={},stage={querySelector:q=>q==='.project-screen'?screen:q==='.project-scene'?scene:q==='.stage-visual'?visual:null};
 const original=f.doc.querySelectorAll;f.doc.querySelectorAll=q=>q==='.project-stage:not([hidden])'?[stage]:original(q);
 const recorded=[];f.gsap.fromTo=(target,from,to)=>{recorded.push({target,from,to});return {revert(){}}};
 const cleanup=mountMotion(f);assert.ok(recorded.some(x=>x.to.scrollTrigger.pin===screen));assert.ok(recorded.some(x=>x.target===scene&&x.from.scale<.95&&x.to.scale===1));assert.equal(f.state.created,0);cleanup();
});

test('project content taller than the available viewport never gets pinned or clipped by motion',()=>{
 const f=fixture(),screen={},visual={},scene={scrollHeight:900},stage={querySelector:q=>q==='.project-screen'?screen:q==='.project-scene'?scene:q==='.stage-visual'?visual:null};f.win.innerHeight=700;
 const original=f.doc.querySelectorAll;f.doc.querySelectorAll=q=>q==='.project-stage:not([hidden])'?[stage]:original(q);
 let transitions=0;f.gsap.fromTo=()=>{transitions++;return {revert(){}}};const cleanup=mountMotion(f);assert.equal(transitions,0);cleanup();
});

test('resize reevaluates whether a project still fits before rebuilding its pin',()=>{
 const f=fixture(),screen={},visual={},scene={scrollHeight:800},stage={querySelector:q=>q==='.project-screen'?screen:q==='.project-scene'?scene:q==='.stage-visual'?visual:null};f.win.innerHeight=936;
 const callbacks=new Map();f.win.addEventListener=(name,fn)=>callbacks.set(name,fn);f.win.removeEventListener=name=>callbacks.delete(name);
 const original=f.doc.querySelectorAll;f.doc.querySelectorAll=q=>q==='.project-stage:not([hidden])'?[stage]:original(q);
 let pins=0,reverts=0;f.gsap.fromTo=(target,from,to)=>{if(to.scrollTrigger.pin)pins++;return {revert(){reverts++}}};
 const cleanup=mountMotion(f);assert.equal(pins,1);f.win.innerHeight=700;callbacks.get('resize')();assert.equal(pins,1);assert.equal(reverts,3);f.win.innerHeight=936;callbacks.get('resize')();assert.equal(pins,2);cleanup();assert.equal(callbacks.has('resize'),false);
});

test('rebuilding project pins preserves the current scroll destination',()=>{
 const f=fixture();f.win.scrollY=12000;const cleanup=mountMotion(f);assert.equal(f.state.restoredY,12000);f.state.restoredY=undefined;f.listeners.get('portfolio:layout')();assert.equal(f.state.restoredY,12000);cleanup();
});


test('closed or short tool details never receive overlapping 3D entry and exit effects',()=>{
 const f=fixture();f.win.innerHeight=936;const screen={},scene={scrollHeight:854},visual={},detail={open:false},panel={offsetHeight:100},depth={};
 const stage={querySelector:q=>({'.project-screen':screen,'.project-scene':scene,'.stage-visual':visual,'.project-tool-detail':detail,'.tool-transition':panel,'.tool-detail-depth':depth}[q]||null)},original=f.doc.querySelectorAll;f.doc.querySelectorAll=q=>q==='.project-stage:not([hidden])'?[stage]:original(q);
 const calls=[];f.gsap.fromTo=(target,from,to)=>{calls.push({target,to});return {revert(){}}};const cleanup=mountMotion(f);assert.equal(calls.filter(x=>x.target===depth).length,0);
 detail.open=true;panel.offsetHeight=1500;f.listeners.get('portfolio:layout')();assert.equal(calls.filter(x=>x.target===depth).length,2);
 const before=calls.length;panel.offsetHeight=200;f.listeners.get('portfolio:layout')();assert.equal(calls.slice(before).filter(x=>x.target===depth).length,0);cleanup();
});
