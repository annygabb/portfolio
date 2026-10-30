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

function projectFixture(f,{detail=false,height=1600}={}){
 const screen={},scene={scrollHeight:800},visual={},panel={offsetHeight:height},details={open:detail};
 const stage={querySelector:q=>({'.project-screen':screen,'.project-scene':scene,'.stage-visual':visual,'.project-tool-detail':detail?details:null,'.tool-transition':detail?panel:null}[q]||null)};
 return {stage,screen,scene,visual,panel,details};
}
function recordMotion(f){
 const calls=[];let reverted=0;
 f.gsap.to=(target,to)=>{calls.push({target,to});return {revert(){reverted++}}};
 f.gsap.fromTo=(target,from,to)=>{calls.push({target,from,to});return {revert(){reverted++}}};
 return {calls,get reverted(){return reverted}};
}
test('the next project covers a full-size held screen without recession or spacer gaps',()=>{
 const f=fixture();f.win.innerHeight=936;
 const a=projectFixture(f),b=projectFixture(f),carousel={};
 f.doc.querySelectorAll=q=>q==='.project-stage:not([hidden])'?[a.stage,b.stage]:[];
 f.doc.querySelector=q=>q==='.website-carousel:not([hidden])'?carousel:null;
 const r=recordMotion(f),cleanup=mountMotion(f),pins=r.calls.filter(x=>x.to.scrollTrigger?.pin);
 assert.equal(pins.length,2);assert.equal(pins[0].to.scrollTrigger.pin,a.screen);
 assert.equal(pins[0].to.scrollTrigger.endTrigger,b.screen);assert.equal(pins[1].to.scrollTrigger.endTrigger,carousel);
 assert.ok(pins.every(x=>x.to.scrollTrigger.pinSpacing===false));
 assert.ok(r.calls.every(x=>x.target!==a.scene&&x.target!==b.scene));
 assert.ok(r.calls.every(x=>!('z' in x.to)&&!('rotationX' in x.to)));
 cleanup();assert.equal(r.reverted,r.calls.length);
});

test('short desktop windows keep project content fully visible in natural scrolling',()=>{
 const f=fixture({shortViewport:true}),a={querySelector:()=>({})},b={querySelector:()=>({})};
 const original=f.doc.querySelectorAll;f.doc.querySelectorAll=q=>q==='.project-stage:not([hidden])'?[a,b]:original(q);
 let transitions=0;f.gsap.fromTo=()=>{transitions++;return {revert(){}}};
 const cleanup=mountMotion(f);assert.equal(transitions,0);assert.equal(f.state.created,1);cleanup();
});

test('foreground screens also work with a coarse pointer when content fits',()=>{
 const f=fixture({desktop:false});f.win.innerHeight=936;
 const a=projectFixture(f),b=projectFixture(f);
 f.doc.querySelectorAll=q=>q==='.project-stage:not([hidden])'?[a.stage,b.stage]:[];
 const r=recordMotion(f),cleanup=mountMotion(f);
 assert.ok(r.calls.some(x=>x.to.scrollTrigger.pin===a.screen));
 assert.equal(f.state.created,0);cleanup();
});

test('project content taller than the available viewport never gets pinned or clipped by motion',()=>{
 const f=fixture(),screen={},visual={},scene={scrollHeight:900},stage={querySelector:q=>q==='.project-screen'?screen:q==='.project-scene'?scene:q==='.stage-visual'?visual:null};f.win.innerHeight=700;
 const original=f.doc.querySelectorAll;f.doc.querySelectorAll=q=>q==='.project-stage:not([hidden])'?[stage]:original(q);
 let transitions=0;f.gsap.fromTo=()=>{transitions++;return {revert(){}}};const cleanup=mountMotion(f);assert.equal(transitions,0);cleanup();
});

test('resize reevaluates content fit and reverts every previous hold',()=>{
 const f=fixture();f.win.innerHeight=936;const a=projectFixture(f),b=projectFixture(f);
 const callbacks=new Map();f.win.addEventListener=(name,fn)=>callbacks.set(name,fn);f.win.removeEventListener=name=>callbacks.delete(name);
 f.doc.querySelectorAll=q=>q==='.project-stage:not([hidden])'?[a.stage,b.stage]:[];
 const r=recordMotion(f),cleanup=mountMotion(f);
 assert.equal(r.calls.filter(x=>x.to.scrollTrigger.pin).length,1);
 const before=r.calls.length;f.win.innerHeight=700;callbacks.get('resize')();assert.equal(r.reverted,before);
 assert.equal(r.calls.filter(x=>x.to.scrollTrigger.pin).length,1);
 f.win.innerHeight=936;callbacks.get('resize')();assert.equal(r.calls.filter(x=>x.to.scrollTrigger.pin).length,2);
 cleanup();assert.equal(callbacks.has('resize'),false);
});

test('rebuilding project pins preserves the current scroll destination',()=>{
 const f=fixture();f.win.scrollY=12000;const cleanup=mountMotion(f);assert.equal(f.state.restoredY,12000);f.state.restoredY=undefined;f.listeners.get('portfolio:layout')();assert.equal(f.state.restoredY,12000);cleanup();
});


test('tool preview and tall evidence use the same foreground handoff and preserve all detail content',()=>{
 const f=fixture();f.win.innerHeight=936;const a=projectFixture(f,{detail:true}),b=projectFixture(f);
 f.doc.querySelectorAll=q=>q==='.project-stage:not([hidden])'?[a.stage,b.stage]:[];
 const r=recordMotion(f),cleanup=mountMotion(f),pins=r.calls.filter(x=>x.to.scrollTrigger.pin);
 assert.equal(pins.length,2);
 assert.equal(pins[0].to.scrollTrigger.endTrigger,a.panel);
 assert.equal(pins[1].to.scrollTrigger.pin,a.panel);
 assert.equal(pins[1].to.scrollTrigger.start,'bottom bottom');
 assert.equal(pins[1].to.scrollTrigger.endTrigger,b.screen);
 a.details.open=false;const before=r.calls.length;f.listeners.get('portfolio:layout')();
 assert.ok(!r.calls.slice(before).some(x=>x.to.scrollTrigger.pin===a.panel));cleanup();
});
