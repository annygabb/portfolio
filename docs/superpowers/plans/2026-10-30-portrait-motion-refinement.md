# Portrait and Full-Stack Motion Refinement Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans, native execution of this explicitly requested revision.

**Goal:** Aplicar foto e currículo atuais, apresentação pessoal primeiro, projetos depois, skills e download de currículo, com GSAP/Lenis e profundidade 3D.
**Architecture:** Mantém HTML estático PT/EN. GSAP 3.15.0, ScrollTrigger e Lenis 1.3.27 instalados com versões exatas e servidos localmente. Motion é melhoria progressiva com cleanup e movimento reduzido.
**Spec:** Revisão solicitada diretamente pela usuária em 30/10/2026 sobre o design já aprovado.

## Global Constraints
- Preservar branco/azul, caligrafia pontual, tema escuro e sete cases.
- Usar usar.jpg como retrato real; currículo atual fornecido substitui o PDF baixável.
- Ordem: apresentação (#sobre), projetos (#projetos), skills (#skills), download (#curriculo); experiência e método podem aprofundar a apresentação sem substituir essa sequência.
- Mostrar decisões de frontend e backend sem inventar métricas ou funcionalidades.
- GSAP + Lenis e CSS perspective/rotationX/rotationY, sem scroll forçado ou pinning longo.
- Com reduced-motion, sem carregamento obrigatório das bibliotecas; navegação e conteúdo funcionam sem JS.

## Review Focus
- Layout do retrato de 400×400 deve ser coerente em 320px e desktop.
- Filtro de projetos altera altura da página; triggers devem atualizar sem offsets antigos.
- Modal da galeria e teclado preservam rolagem nativa.
- Preferência de movimento pode mudar durante a sessão; destruir ticker/Lenis e restaurar estilos.
- Sem biblioteca/rede, o conteúdo não deve desaparecer.

### Task 1: Layout, retrato, CV e conteúdo
- [x] Testes de ordem das seções, currículo com atributo download e camada frontend/backend nos cases de produto; observar falha.
- [x] Atualizar render/content/CSS, retrato WebP400×400 e copiar currículo atual com nome estável.
- [x] Incluir formação, idioma e participação em tecnologia conforme CV; fontes documentadas.
- [x] Suite estática e assets aprovados.

### Task 2: Motion progressivo
- [x] Testes de reduced-motion, ticker único, teardown, filtro/refresh e ausência de bibliotecas.
- [x] Implementar módulo motion com GSAP/ScrollTrigger, sincronização Lenis pelo ticker, scroll3D em wrappers e cleanup.
- [x] Build copia distribuições e licenças oficiais de node_modules para dist/vendor.
- [x] Verificar sintaxe, testes, revisão independente; atualizar PR e prévia privada existente.
- [ ] QA visual ao vivo: pendente de acesso autorizado; não recriar share link sem autorização já recusada.
