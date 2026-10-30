import {mkdir,writeFile,cp,rm} from 'node:fs/promises';
import {renderPage} from '../src/render.mjs';
import {projects,owner} from '../src/content.mjs';
await rm('dist',{recursive:true,force:true}); await mkdir('dist',{recursive:true});
await cp('public','dist',{recursive:true});
const routes=[];
for(const lang of ['pt','en']) for(const project of [null,...projects]){
 const route=(lang==='en'?'/en/':'/')+(project?`cases/${project.slug}/`:'');
 const directory='dist'+route;await mkdir(directory,{recursive:true});
 await writeFile(directory+'index.html',renderPage({lang,project}));routes.push({route,lang,project});
}
const urls=routes.map(({route})=>`<url><loc>${owner.site}${route}</loc></url>`).join('');
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${owner.site}/sitemap.xml\n`);
await writeFile('dist/llms.txt',`# Anny Gabrielly\n\nSystems Analyst & Full-Stack Developer. React, Java/Spring and process automation.\n\n## Projects\n${projects.map(p=>`- [${p.name}](${owner.site}/cases/${p.slug}/): ${p.summary[0]}`).join('\n')}\n\nEvidence and limitations are included in each case. Metrics are recorded results, not guarantees.\n`);
await writeFile('dist/index.html.html','<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Anny Gabrielly</title><meta http-equiv="refresh" content="0;url=/"><link rel="canonical" href="'+owner.site+'/"></head><body><a href="/">Ir para o portfólio de Anny Gabrielly</a></body></html>');
await writeFile('dist/404.html','<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Página não encontrada | Anny Gabrielly</title><link rel="stylesheet" href="/styles.css"><body><main class="container section"><h1>Página não encontrada.</h1><p>O endereço pode ter mudado.</p><a class="button primary" href="/">Voltar ao portfólio</a></main></body></html>');
console.log(`Built ${routes.length} static pages, assets, sitemap and compatibility redirect.`);
