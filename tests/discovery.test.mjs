import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {projects} from '../src/content.mjs';
import {pageSchema,pageMetadata,markdownPage,llmsGuide} from '../src/discovery.mjs';
import {renderPage} from '../src/render.mjs';
import {trailSegments,mountFooterTrail} from '../public/footer-trail.js';
test('PT/EN pages expose matching canonical Markdown and author graph',()=>{
 for(const lang of ['pt','en'])for(const p of [null,...projects]){
  const html=renderPage({lang,project:p}),meta=pageMetadata(lang,p),schema=pageSchema(lang,p),md=markdownPage(lang,p);
  assert.ok(meta.title.length<=60);assert.ok(meta.description.length>80&&meta.description.length<240);
  assert.match(html,/name="author" content="Anny Gabrielly"/);assert.match(html,/rel="alternate" type="text\/markdown"/);
  assert.ok(md.includes(schema['@graph'][2].url));assert.equal(schema['@graph'][1]['@type'],'Person');
  assert.ok(md.includes('mailto:annygabbyoficial@gmail.com'));
  if(p){assert.equal(schema['@graph'].at(-1)['@type'],'BreadcrumbList');assert.ok(md.includes(p.evidence[0].url));assert.ok(md.includes(p.note[lang==='en'?1:0]));}
 }
});
test('LLM discovery preserves sources and distinguishes stars, catalogue size and usage',()=>{
 const txt=llmsGuide();assert.match(txt,/20 GitHub stars/);assert.match(txt,/48 catalogue options/);assert.match(txt,/No public usage telemetry/);assert.match(txt,/not an access-control policy/);
 for(const p of projects)assert.ok(txt.includes(`/cases/${p.slug}/index.md`));
 assert.ok(existsSync('dist/en/cases/help/index.md'));assert.equal(readFileSync('dist/llms.txt','utf8'),txt);
});
test('the cursor trace stays under 44 pixels, fades quickly and respects reduced motion',()=>{
 const points=[{x:0,y:0,time:0},{x:100,y:0,time:10},{x:200,y:0,time:20}];
 const segments=trailSegments(points,20);assert.ok(segments.length>0);
 assert.ok(segments.reduce((sum,s)=>sum+Math.hypot(s.x-s.toX,s.y-s.toY),0)<=44.001);
 assert.equal(trailSegments(points,220).length,0);
 let queried=false;mountFooterTrail({win:{matchMedia:()=>({matches:true})},doc:{createElement(){queried=true;}},root:{}})();assert.equal(queried,false);
});
test('footer has only gradient and small pointer trace, with no animated name or decorative video',()=>{
 for(const lang of ['pt','en']){
  const html=renderPage({lang});assert.ok(!html.includes('vapour-signature'));assert.ok(!html.includes('vapour.js'));assert.ok(!html.includes('loading-numbers.mp4'));assert.ok(html.includes('/footer-trail.js'));assert.ok(html.includes('intro-brand-lockup'));
 }
 assert.ok(!existsSync('dist/assets/loading-numbers.mp4'));
});
test('the footer draws thin white strokes only after pointer movement and cleans up',()=>{
 const handlers=new Map(),frames=[],strokes=[];let now=0,removed=false;
 const ctx={setTransform(){},clearRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){strokes.push({color:this.strokeStyle,width:this.lineWidth});}};
 const canvas={getContext:()=>ctx,setAttribute(){},remove(){removed=true;}};
 const root={clientWidth:1200,clientHeight:850,prepend(){},getBoundingClientRect:()=>({left:0,top:0}),addEventListener:(n,fn)=>handlers.set(n,fn),removeEventListener:n=>handlers.delete(n)};
 const win={matchMedia:()=>({matches:false}),performance:{now:()=>now},requestAnimationFrame(fn){frames.push(fn);return frames.length},cancelAnimationFrame(){},addEventListener(){},removeEventListener(){}};
 const doc={createElement:()=>canvas,addEventListener(){},removeEventListener(){},hidden:false};
 const cleanup=mountFooterTrail({win,doc,root});assert.equal(frames.length,0);
 handlers.get('pointermove')({clientX:100,clientY:100,pointerType:'mouse'});now=10;handlers.get('pointermove')({clientX:130,clientY:100,pointerType:'mouse'});frames[0](10);
 assert.ok(strokes.length>0);assert.ok(strokes.every(s=>s.width<=2&&s.color.startsWith('rgba(255,255,255,')));
 cleanup();assert.equal(handlers.size,0);assert.ok(removed);
});
