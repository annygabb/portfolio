# Profundidade, dados e navegação — revisão de 30/10/2026

Pedidos: seletor único de idioma alternando EN/PT no mesmo lugar e rota equivalente; projetos em tela cheia passando em 3D; gráficos Lighthouse e catálogo desenhados ao entrar na tela; contagem até aproximadamente 60; Freelance e histórico anterior aparecendo/desaparecendo pela rolagem; linha azul do hero acompanhando a página; retrato com mais definição.

Implementação escolhida: manter HTML estático e GSAP/ScrollTrigger/Lenis existentes. Cada tela usa perspectiva real, entrada em rotateX/rotateY/translateZ e saída recuando, com sobreposição da tela seguinte. Não animar o contêiner fixado; animar apenas o filho. Detalhes das ferramentas continuam inline e legíveis no fluxo. Em viewport sem espaço ou movimento reduzido, preservar conteúdo completo em fluxo natural.

Lighthouse: desenhar linhas e apresentar pontos/rótulos progressivamente, sem alterar valores ou sugerir série temporal. Catálogo: régua de 0 a 48 com marcador móvel e contagem visual. Contagem de chamados termina em 60 e mantém descrição aproximada. Números verdadeiros permanecem no HTML e acessíveis sem JS. Linha de progresso lateral em #b9c9e2, não intercepta cliques.

Retrato: edição a partir do original e cutout atual, preservando identidade, pose, roupa e transparência; ativo novo, original preservado. Conferir no navegador hero, transição de ao menos dois projetos, gráficos, contador, histórico, idioma e erros de console.

## Verificação e correções encontradas

51 testes aprovados e build de 16 rotas. Preview de desenvolvimento conferido em 1363×936: apenas EN em PT e PT em EN; perspectiva de 1600px, rotação e translateZ nas cenas; Lighthouse com offsets fracionários (.5036, .7382, .8983) e revelação progressiva dos 12 rótulos; marcador do catálogo em movimento; contador de chamados observado em 0, 5 e 60; histórico visível com opacity1 e oculto fora da tela por IntersectionObserver. Histórico alto normaliza opacidade pela área máxima visível, inclusive em zoom.

A inspeção descobriu perda de 1196px de rolagem por espaçador durante reconstruções disparadas por lazy loading. A reconstrução agora preserva a posição numérica e callbacks de imagens/fontes apenas atualizam medidas quando a elegibilidade dos pins não mudou. Menu Impactos validado com topo109.7px, sem retorno aos projetos. Revisão independente pediu contraste dos rótulos: valores usam tinta do tema, mantendo cores nas linhas.

Retrato final: public/assets/anny-portrait-hd.webp, 1254×1254 com alpha, 356KiB. Gerado com a ferramenta integrada e convertido para WebP sem redimensionamento, a partir do original e recorte anterior. Fontes originais preservadas. QA visual de mobile não realizada; fallback sem pins para viewport pequena e redução de movimento mantidos.

## Prompt da restauração do retrato

Edit identity-preserving photo restoration for a professional portfolio hero. Image 1 is the ORIGINAL identity reference and exact pose/expression/skin tone/face shape to preserve. Image 2 is the current transparent cutout edit target and framing reference. Produce a higher-definition natural photographic cutout of the SAME woman, SAME expression, SAME face proportions and distinct facial features, SAME curls, hoop earrings, black blazer and white ribbed top. Remove compression softness and stair-stepping in hair edges; recover believable fine hair detail, clear natural eyes and fabric texture. Do NOT beautify, smooth skin to plastic, change age, alter facial proportions, invent makeup, change hairstyle, or change camera view. Preserve natural skin texture and subtle original lighting. Keep complete visible hair and shoulders with small transparent margins; no tighter cropping than reference, no invented body/arms. Actual fully transparent background, no wall, no checkerboard baked in, no outline, no white halo, no glow, no shadow baked into the cutout. High-resolution output ideally 1536x1536. Image for sharp rendering at 480 CSS pixels on high-density displays. No text.
