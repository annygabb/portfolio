import {showcaseCard, techLogos, toolsSection, evidenceSection} from './showcase.mjs';
import {owner,projects,copy,choose} from './content.mjs';

export function renderHome(lang,{card,tags,arrow,down,ext,path}){
 const c=copy[lang],en=lang==='en',t=(pt,eng)=>en?eng:pt;
 return `<main id="main">
<div class="hero-canvas centered-hero"><section class="identity-hero container" id="sobre" aria-labelledby="hero-title">
 <div class="hero-masthead"><p>${t('Desenvolvedora full-stack','Full-stack developer')}</p><p>${t('Silvânia, GO · Brasil','Silvânia, GO · Brazil')}</p></div>
 <div class="hero-artboard" data-parallax-layers>
  <div class="hero-watermark" data-parallax-layer="1" aria-hidden="true">${t('PORTFÓLIO','PORTFOLIO')}</div>
  <div class="portrait-stage"><div class="portrait-depth" data-parallax-layer="2"><figure class="portrait-frame"><img src="/assets/anny-original.jpg" alt="Anny Gabrielly" width="400" height="400" fetchpriority="high" decoding="async"></figure></div></div>
  <div class="hero-copy" data-parallax-layer="3">
   <p class="hero-greeting">${t('Olá, eu sou','Hello, I’m')}</p>
   <h1 id="hero-title">Anny<br>Gabrielly<span class="name-period">.</span></h1>
   <p class="hero-role">${t('Desenvolvedora<br>Full-stack','Full-stack<br>Developer')}</p>
   <div class="hero-actions"><a class="text-link" href="#projetos">${c.view}${arrow}</a></div>
  </div>
  <div class="hero-aside" data-parallax-layer="4"><p class="identity-signature">${t('Do código ao','From code to')}<br><em>${t('impacto.','impact.')}</em></p></div>
 </div>

</section></div>
<section class="work section" id="projetos">
 <div class="section-heading container"><div><p class="section-label">${t('Projetos selecionados','Selected work')}</p><h2>${c.workTitle}</h2></div><p>${c.workIntro}</p></div>
 <div class="filters container js-control" hidden role="group" aria-label="${c.filterLabel}">${c.filters.map((f,i)=>`<button type="button" data-filter="${['all','product','tool','website'][i]}" aria-pressed="${i===0}">${f}${i===0?'<span>07</span>':''}</button>`).join('')}</div>
 <div class="project-grid">${projects.map((p,i)=>showcaseCard(p,lang,i)).join('')}</div><p class="filter-status sr-only" role="status" aria-live="polite"></p>
</section>
${evidenceSection(lang)}
<section class="skills-section section" id="skills"><div class="container">
 <div class="section-heading"><div><p class="section-label">${t('Skills & capacidades','Skills & capabilities')}</p><h2>${t('As ferramentas.<br>A <em>aplicação.</em>','The tools.<br>The <em>application.</em>')}</h2></div><p>${t('Passe o mouse ou navegue pelo teclado para explorar a stack. No celular, os nomes ficam visíveis. Cada ferramenta entra para resolver uma parte do produto.','Hover or use the keyboard to explore my stack. Names stay visible on mobile. Each tool solves a specific part of the product.')}</p></div>
 ${techLogos(lang)}
 <div class="repertoire"><div><h3>${t('Ferramentas de trabalho','Working tools')}</h3>${tags(['Git · GitHub','Vite','Docker','Azure','Vercel','Postman'])}</div><div><h3>${t('Formação & desenvolvimento','Education & development')}</h3><p>${c.education}<small>${t('Conclusão prevista: dezembro de 2026','Expected graduation: December 2026')}</small></p><details class="learning"><summary>${t('Cursos, certificações e experiências','Courses, certifications and experiences')}<span aria-hidden="true">+</span></summary><ul><li>Scrum Fundamentals Certified (SFC)</li><li>${t('NTT DATA · Java e IA para Iniciantes, 48h · 2025','NTT DATA · Java and AI for Beginners, 48h · 2025')}</li><li>${t('Trilhas Java, DevOps & Cloud · DIO · 2025','Java, DevOps & Cloud learning paths · DIO · 2025')}</li><li>${t('Introdução à Cibersegurança · Santander/DIO · 2025','Introduction to Cybersecurity · Santander/DIO · 2025')}</li><li>${t('RoboCode · 4º lugar em equipe · 2025','RoboCode · 4th place as a team · 2025')}</li><li>Campus Party · Goiânia · 2025</li></ul></details><p class="language-note">${t('Português nativo · Inglês intermediário','Native Portuguese · Intermediate English')}</p></div></div>
</div></section>
${toolsSection(lang)}
<section class="experience section" id="experiencia"><div class="container"><div class="section-heading"><div><p class="section-label">${t('Experiência profissional','Professional experience')}</p><h2>${c.experienceTitle}</h2></div><a class="text-link" href="#curriculo">${c.cv}${arrow}</a></div><article class="experience-row"><div class="experience-company"><h3>NTT DATA</h3><p>Europe & Latam</p><small>${c.expDate}</small></div><div><h3>${c.expRole}</h3><p>${c.expText}</p></div><div class="calls-proof"><strong>~60</strong><p>${c.calls}</p><small>${c.callsNote}</small></div></article><div class="automation"><h3>${c.automationTitle}</h3><div class="process-comparison"><div><span>${c.before}</span><p>${c.beforeText}</p></div><div><span>${c.after}</span><p>${c.afterText}</p></div></div><p class="evidence-note">${c.automationNote}</p></div><article class="experience-row freelance"><div class="experience-company"><h3>Freelance</h3><small>${c.freelanceDate}</small></div><div><h3>${c.freelanceRole}</h3><p>${c.freelanceText}</p></div></article><details class="earlier"><summary>${c.earlier}<span aria-hidden="true">+</span></summary><p>${t('Instituto Auxiliadora · administrativo, digitalização e suporte técnico (jan. 2025–jan. 2026). Papelutti · produção gráfica (mai.–dez. 2024). TRE-GO · estágio administrativo (mai.–dez. 2022). Experiências que conectam comunicação, organização e execução.','Instituto Auxiliadora · administration, digitization and technical support (Jan. 2025–Jan. 2026). Papelutti · graphic production (May–Dec. 2024). TRE-GO · administrative internship (May–Dec. 2022). Experience connecting communication, organization and execution.')}</p></details></div></section>
<section class="resume-section section container" id="curriculo"><div><p class="section-label">${t('Meu percurso em detalhe','My background in detail')}</p><h2>${t('Leve meu <em>currículo.</em>','Take my <em>résumé.</em>')}</h2><p>${t('Experiência, formação e competências reunidas no documento profissional atualizado.','Experience, education and skills brought together in my current professional document.')}</p></div><a class="button primary" href="${owner.resume}" download="Anny-Gabrielly-Curriculo.pdf">${t('Baixar currículo em PDF','Download résumé PDF')}${down}</a></section>
</main>`;
}
