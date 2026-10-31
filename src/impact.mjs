import {owner} from './content.mjs';
const pick=(lang,pt,en)=>lang==='en'?en:pt;
export const transformations={
 uaiconta:[['Comprovantes dispersos','Scattered receipts'],['Importação com revisão','Import with review'],['Leitura do realizado e do previsto','Understand actuals and forecasts']],
 help:[['Perfis e oportunidades separados','Disconnected profiles and opportunities'],['Plataforma com identidade e comunicação','Identity and communication platform'],['Encontrar e conversar no mesmo ambiente','Find and connect in one place']],
 'pagespeed-seo-optimizer':[['Otimizações sem roteiro','Unstructured optimization'],['Auditoria → prioridade → validação','Audit → prioritize → validate'],['Qualidade acompanhada por evidências','Evidence-based quality']],
 'orquestrador-de-sites':[['Instruções espalhadas','Scattered instructions'],['Seleção de skills por contexto','Contextual skill selection'],['Critérios de construção reutilizáveis','Reusable development criteria']],
 'tiago-horta':[['Apresentar um trabalho visual','Present visual work'],['Portfólio de fotografia publicado','Live photography portfolio'],['Explorar o trabalho e iniciar contato','Explore the work and make contact']],
 'ludmila-grossi':[['Explicar o atendimento','Explain the practice'],['Site profissional publicado','Live professional website'],['Conhecer a profissional e buscar contato','Meet the professional and get in touch']],
 'er-juridico':[['Comunicar uma atuação jurídica','Communicate legal expertise'],['Presença institucional publicada','Live institutional website'],['Entender a atuação e encontrar contato','Understand expertise and find contact']]
};
export function transformation(slug,lang){const t=transformations[slug];if(!t)return '';return `<div class="transformation" aria-label="${pick(lang,'Desafio, entrega e valor','Challenge, delivery and value')}">${t.map((x,i)=>`<div><span>${pick(lang,['Ponto de partida','O que entrego','O que isso permite'][i],['Starting point','What I deliver','What this enables'][i])}</span><p>${x[lang==='en'?1:0]}</p></div>${i<2?'<b aria-hidden="true">→</b>':''}`).join('')}</div>`;}
