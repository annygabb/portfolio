import {renderPage} from '../src/render.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
const build = spawnSync(process.execPath, ['scripts/build.mjs'], {encoding:'utf8'});
test('production build succeeds',()=>assert.equal(build.status,0,build.stderr));
const slugs=['help','uaiconta','pagespeed-seo-optimizer','orquestrador-de-sites','tiago-horta','ludmila-grossi','er-juridico'];
for(const lang of ['pt','en']) for(const slug of [null,...slugs]) {
 const route=(lang==='en'?'/en/':'/')+(slug?`cases/${slug}/`:'');
 test(`direct route ${route} is complete and linked correctly`,()=>{
  const path=resolve('dist','.'+route,'index.html'); assert.ok(existsSync(path),path);
  const html=readFileSync(path,'utf8');
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.ok(html.includes(`lang="${lang==='pt'?'pt-BR':'en'}"`));
  assert.match(html,/<meta name="description" content=".{40,}/);
  const alternate=(lang==='pt'?'/en/':'/')+(slug?`cases/${slug}/`:'');
  assert.ok(html.includes(`href="${alternate}"`),'equivalent language link');
  assert.match(html,/<main\b/); assert.match(html,/prefers-color-scheme|theme-init/);
  for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
   const url=m[1]; if(!url.startsWith('/') || url.startsWith('//')) continue;
   const parsed=new URL(url,'https://portfolio.example');const file=parsed.pathname,fragment=parsed.hash.slice(1);
   let target=resolve('dist','.'+(file||route));
   if(existsSync(target)&&statSync(target).isDirectory())target=join(target,'index.html');
   assert.ok(existsSync(target),`broken link ${url} in ${route}`);
   if(fragment && target.endsWith('.html')) assert.ok(readFileSync(target,'utf8').includes(`id="${fragment}"`),`missing anchor ${url}`);
  }
 });
}
test('case metadata is unique and no route depends on a client router',()=>{
 const titles=slugs.map(s=>readFileSync(`dist/cases/${s}/index.html`,'utf8').match(/<title>(.*?)<\/title>/)[1]);
 assert.equal(new Set(titles).size,7);
});
test('PageSpeed cover reserves its actual image aspect ratio',()=>{
 const html=readFileSync('dist/cases/pagespeed-seo-optimizer/index.html','utf8');
 const tag=html.match(/<img[^>]+src="\/assets\/pagespeed-100.jpeg"[^>]*>/)[0];
 assert.match(tag,/width="1053" height="605"/);
});
test('home reading order and localized direct CV downloads are preserved',()=>{
 for(const prefix of ['','en/']){
  const html=readFileSync(`dist/${prefix}index.html`,'utf8');
  const ids=['sobre','perfil','formacao','projetos','impacto','skills'].map(id=>html.indexOf(`id="${id}"`));
  assert.ok(ids.every(i=>i>=0),'all requested sections exist');
  assert.ok(ids.every((v,i)=>!i||v>ids[i-1]),'requested reading order');
  assert.match(html,/<h1[^>]*>[\s\S]*?Anny[\s\S]*?<\/h1>/);
  assert.match(html,/<img[^>]*src="\/assets\/anny-portrait-cutout.webp"[^>]*width="1254"[^>]*height="1254"/);
  assert.ok(html.includes(`href="/assets/${prefix?'Anny-Gabrielly-Resume-EN.pdf':'Anny-Gabrielly-Curriculo.pdf'}" download=`));
  assert.ok(html.includes(prefix?'>PORTFOLIO</div>':'>PORTFÓLIO</div>'));
  for(const id of ['sobre','formacao','projetos','impacto','skills','curriculo','contato'])assert.ok(html.includes(`data-nav="${id}"`));
 }
});
test('product cases explain frontend and backend contributions separately',()=>{
 for(const slug of ['help','uaiconta'])for(const prefix of ['','en/']){
  const html=readFileSync(`dist/${prefix}cases/${slug}/index.html`,'utf8');
  assert.ok(html.includes('id="fullstack"'));
  assert.match(html,/Front-end/);assert.match(html,/Back-end/);
 }
});
test('revised home preserves evidence values and removes the investment section',()=>{
 for(const prefix of ['','en/']){
  const html=readFileSync(`dist/${prefix}index.html`,'utf8');
  assert.ok(!html.includes('id="contratar"'));
  assert.ok(!html.includes('hero-profile-strip'));
  assert.equal((html.match(/class="project-card project-stage/g)||[]).length,4);
  assert.equal((html.match(/class="project-card website-slide/g)||[]).length,3);
  assert.ok(html.includes('data-parallax-layers'));
  assert.ok(html.includes('<td>94</td>'));
  for(const slug of ['pagespeed-seo-optimizer','orquestrador-de-sites'])assert.ok(html.includes(`<details class="tool-detail project-tool-detail container" id="tool-${slug}" open>`));
 }
});

test('tool evidence belongs to each project, with no duplicate method or quality sections',()=>{
 for(const prefix of ['','en/']){
  const html=readFileSync(`dist/${prefix}index.html`,'utf8');
  assert.ok(!html.includes('class="toolbox'));assert.ok(!html.includes('class="evidence-section'));
  assert.ok(!html.includes('Passe o mouse ou navegue'));assert.ok(!html.includes('Hover or use the keyboard'));
  assert.ok(!html.includes('<details class="earlier"'));
  assert.ok(html.includes('class="earlier-history"'));
  for(const slug of ['pagespeed-seo-optimizer','orquestrador-de-sites']){
   const start=html.indexOf(`aria-labelledby="project-${slug}"`),end=html.indexOf('</article>',html.indexOf('class="tool-decisions"',start));
   assert.ok(html.slice(start,end).includes(`id="tool-${slug}"`));
   assert.equal((html.match(new RegExp(`id="tool-${slug}"`,'g'))||[]).length,1);
  }
  assert.match(html,/<a[^>]*data-nav="curriculo"[^>]*>CV<\/a>/);
 }
});
test('language switch shows only the other language on every equivalent route',()=>{
 for(const prefix of ['','en/'])for(const slug of ['', 'cases/help/', 'cases/pagespeed-seo-optimizer/']){
  const html=readFileSync(`dist/${prefix}${slug}index.html`,'utf8');
  const switcher=html.match(/<nav class="locale-switch"[\s\S]*?<\/nav>/)[0];
  assert.equal((switcher.match(/<a /g)||[]).length,1);
  assert.ok(switcher.includes(`href="/${prefix?'':'en/'}${slug}"`));
  assert.match(switcher,prefix?/>PT<\/a>/:/>EN<\/a>/);
  assert.ok(!switcher.includes('aria-current'));
 }
});

test('published pages version CSS and behavior assets so browsers request updated files',()=>{
 const html=readFileSync('dist/index.html','utf8');
 for(const file of ['styles.css','app.js','motion.js','section-navigation.js'])assert.ok(new RegExp(`/${file.replaceAll('.','\\.')}\\?v=[a-f0-9]{12}`).test(html));
});

test('CV downloads the localized PDF on every route without a résumé section',()=>{
 for(const lang of ['pt','en']){
  const html=renderPage({lang});
  const filename=lang==='en'?'Anny-Gabrielly-Resume-EN.pdf':'Anny-Gabrielly-Curriculo.pdf';
  const cvs=[...html.matchAll(/<a\b[^>]*>CV(?:<svg[\s\S]*?<\/svg>)?<\/a>/g)].map(x=>x[0]);
  assert.equal(cvs.length,3);for(const cv of cvs){assert.ok(cv.includes(`href="/assets/${filename}"`));assert.ok(cv.includes(`download="${filename}"`));}
  assert.ok(!html.includes('id="curriculo"'));assert.ok(!html.includes('href="#curriculo"'));
 }
});
test('evidence dashboard retains each score without claiming a time trend',()=>{
 const html=renderPage();assert.equal((html.match(/class="quality-metric"/g)||[]).length,4);
 for(const values of ['98; registro 2, 100; registro 3, 100','100; registro 2, 100; registro 3, 94'])assert.ok(html.includes(values));
 assert.ok(html.includes('não uma série temporal'));assert.ok(html.includes('class="quality-area"'));
});
test('website carousel leaves vertical scrolling available and keeps controls beside its cover',()=>{
 const html=renderPage();assert.ok(!html.includes('data-lenis-prevent'));assert.ok(html.includes('class="carousel-viewport"'));
 const css=readFileSync('public/styles.css','utf8');assert.ok(css.includes('.website-track::-webkit-scrollbar{display:none}'));assert.ok(css.includes('touch-action:pan-x pan-y'));
});
