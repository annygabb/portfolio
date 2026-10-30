import {createHash} from 'node:crypto';
import {mkdir,writeFile,cp,rm,readFile} from 'node:fs/promises';
import {renderPage} from '../src/render.mjs';
import {projects,owner} from '../src/content.mjs';
await rm('dist',{recursive:true,force:true}); await mkdir('dist',{recursive:true});
await cp('public','dist',{recursive:true});
await mkdir('dist/vendor',{recursive:true});
for(const [source,target] of [
 ['node_modules/gsap/dist/gsap.min.js','gsap.min.js'],
 ['node_modules/gsap/dist/ScrollTrigger.min.js','ScrollTrigger.min.js'],
 ['node_modules/lenis/dist/lenis.min.js','lenis.min.js'],
 ['node_modules/lenis/dist/lenis.css','lenis.css'],
 ['node_modules/lenis/LICENSE','Lenis-LICENSE.txt']
]){
 const content=await readFile(source,'utf8');
 await writeFile('dist/vendor/'+target,content.replace(/\/\/# sourceMappingURL=.*$/gm,''));
}
await writeFile('dist/vendor/THIRD-PARTY.txt','GSAP 3.15.0 and ScrollTrigger: Copyright GreenSock. Standard license https://gsap.com/standard-license. Original copyright headers preserved.\nLenis 1.3.27: MIT, darkroom.engineering. See Lenis-LICENSE.txt.\n');
const assetRevisions=await Promise.all(['styles.css','app.js','theme-init.js','motion.js','section-navigation.js'].map(async file=>[file,createHash('sha256').update(await readFile('public/'+file)).digest('hex').slice(0,12)]));
const routes=[];
for(const lang of ['pt','en']) for(const project of [null,...projects]){
 const route=(lang==='en'?'/en/':'/')+(project?`cases/${project.slug}/`:'');
 const directory='dist'+route;await mkdir(directory,{recursive:true});
 let html=renderPage({lang,project});for(const [file,revision] of assetRevisions)html=html.replaceAll(`"/${file}"`,`"/${file}?v=${revision}"`);
 await writeFile(directory+'index.html',html);routes.push({route,lang,project});
}
const urls=routes.map(({route})=>`<url><loc>${owner.site}${route}</loc></url>`).join('');
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${owner.site}/sitemap.xml\n`);
await writeFile('dist/llms.txt',`# Anny Gabrielly\n\nSystems Analyst & Full-Stack Developer. React, Java/Spring and process automation.\n\n## Projects\n${projects.map(p=>`- [${p.name}](${owner.site}/cases/${p.slug}/): ${p.summary[0]}`).join('\n')}\n\nEvidence and limitations are included in each case. Metrics are recorded results, not guarantees.\n`);
await writeFile('dist/index.html.html','<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Anny Gabrielly</title><meta http-equiv="refresh" content="0;url=/"><link rel="canonical" href="'+owner.site+'/"></head><body><a href="/">Ir para o portfólio de Anny Gabrielly</a></body></html>');
await writeFile('dist/404.html','<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Página não encontrada | Anny Gabrielly</title><link rel="stylesheet" href="/styles.css"><body><main class="container section"><h1>Página não encontrada.</h1><p>O endereço pode ter mudado.</p><a class="button primary" href="/">Voltar ao portfólio</a></main></body></html>');
console.log(`Built ${routes.length} static pages, assets, sitemap and compatibility redirect.`);
