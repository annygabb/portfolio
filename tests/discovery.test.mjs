import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {projects} from '../src/content.mjs';
import {pageSchema,pageMetadata,markdownPage,llmsGuide} from '../src/discovery.mjs';
import {renderPage} from '../src/render.mjs';
import {rippleAt,mountFooterWaves} from '../public/footer-waves.js';
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
test('white cursor ripples expand and fade, preserving reduced-motion access',()=>{
 assert.ok(rippleAt(800).radius>rippleAt(100).radius);assert.ok(rippleAt(800).alpha<rippleAt(100).alpha);assert.equal(rippleAt(2200).alpha,0);
 let queried=false;mountFooterWaves({win:{matchMedia:()=>({matches:true})},doc:{createElement(){queried=true;}},root:{}})();assert.equal(queried,false);
 const source=readFileSync('public/footer-waves.js','utf8');assert.ok(source.includes('rgba(255,255,255,'));assert.ok(source.includes("removeEventListener('pointermove'"));
});
