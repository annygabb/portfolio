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
   const [file,fragment]=url.split('#');
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
test('home introduces Anny before work, skills and résumé in both languages',()=>{
 for(const prefix of ['','en/']){
  const html=readFileSync(`dist/${prefix}index.html`,'utf8');
  const ids=['sobre','perfil','formacao','projetos','impacto','skills','curriculo'].map(id=>html.indexOf(`id="${id}"`));
  assert.ok(ids.every(i=>i>=0),'all requested sections exist');
  assert.ok(ids.every((v,i)=>!i||v>ids[i-1]),'requested reading order');
  assert.match(html,/<h1[^>]*>[\s\S]*?Anny[\s\S]*?<\/h1>/);
  assert.match(html,/<img[^>]*src="\/assets\/anny-transparent-v2.webp"[^>]*width="900"[^>]*height="900"/);
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
  assert.equal((html.match(/class="project-card project-stage/g)||[]).length,7);
  assert.ok(html.includes('data-parallax-layers'));
  assert.ok(html.includes('<td>94</td>'));
  for(const slug of ['pagespeed-seo-optimizer','orquestrador-de-sites'])assert.ok(html.includes(`<details class="tool-detail" id="tool-${slug}">`));
 }
});
