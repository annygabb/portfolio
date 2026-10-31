# Portfolio Premium Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** Entregar home e sete cases completos com evidências verificadas, PT/EN e temas claro/escuro.
**Architecture:** Gerador estático Node sem dependências, HTML por rota, CSS e JS compartilhados. O conteúdo renderiza sem JavaScript e os links de idioma preservam o case atual.
**Tech Stack:** Node 22+, HTML, CSS, JavaScript; imagens reais e fontes locais.
**Spec:** docs/superpowers/specs/2026-10-30-portfolio-premium-design.md

## Global Constraints
- Branco/azul; Manrope e Pinyon Script pontual; movimento reduzido respeitado.
- Home + sete cases; PT/EN e tema escuro preservados.
- Sem dados, resultados ou depoimentos inventados; fontes ligadas às afirmações.
- HTML pronto para Vercel; nenhum banco/autenticação adicional.

## Review Focus
- Recarga e entrada direta em cases devem funcionar em ambos idiomas.
- Sem JavaScript, conteúdo e navegação permanecem acessíveis.
- localStorage indisponível não deve quebrar menu, idioma ou conteúdo.
- Capturas, currículo e links locais precisam existir no build.
- Telas de 320 px e movimento reduzido não devem ocultar conteúdo.

### Task 1: Conteúdo e geração das rotas
**Files:** src/content.mjs, src/render.mjs, scripts/build.mjs, tests/site.test.mjs, public/assets/*, package.json, vercel.json.
**Interfaces:** content exports projects and copy; renderPage({lang, project}) returns full HTML; build emits dist with 16 pages, aliases, robots and sitemap.
- [ ] Escrever teste de build: todas as rotas PT/EN, H1 único, assets/links/âncoras locais existentes, metadados distintos e link de idioma equivalente.
- [ ] Executar `node --test`: falha por build ausente.
- [ ] Implementar conteúdo, evidências, render e build; extrair retrato original e incorporar currículo; salvar capturas reais e provas de PageSpeed.
- [ ] Executar `npm test`: todas as verificações aprovadas.
- [ ] Commit de estrutura e conteúdo.

### Task 2: Sistema visual, interações e entrega
**Files:** public/styles.css, public/app.js, public/fonts/*, docs/EVIDENCIAS.md, docs/VALIDACAO.md, README.md.
**Interfaces:** CSS shared across all pages; data attributes for menu/theme/filter; native HTML links for locales and cases.
- [ ] Implementar layout editorial, recorte de retrato, pastas interativas, cases e galeria de evidências; respeitar reduced motion e toque.
- [ ] Verificar `node --check public/app.js`, `npm test`, imagens e orçamento de peso.
- [ ] Verificar visualmente home/case, tema, idioma e menu em desktop/celular quando preview disponível.
- [ ] Registrar limitações reais, revisão independente e correções; push da branch e PR revisável.
