# Projetos em cenas de scroll e consolidação de conteúdo

Pedido: sombra visível coerente; efeito de tela cheia nos projetos; remover Qualidade em duas camadas; histórico anterior visível; nova cor para skills sem instrução de hover; detalhes de ferramentas nos projetos; PT/EN explícitos e CV em ambos os idiomas.

Mudanças:
- Sombra do retrato reforçada em azul escuro (#020a17a6), com deslocamento lateral/inferior, mantendo transparência e fade da borda do braço.
- Projetos: GSAP fixa a área de leitura abaixo do cabeçalho durante 85% de uma altura de viewport, enquanto a imagem avança em parallax/zoom. Anima somente o filho visual; área fixada não recebe a transformação. Removida concorrência com sticky e perspective dos ancestrais. Mobile, janela baixa, ponteiro coarse e movimento reduzido mantêm leitura natural.
- PageSpeed e Orquestrador mantêm todos os conteúdos, capturas, gráficos, limitações e GitHub dentro dos respectivos artigos de projeto. Details abertos por padrão. Não existe seção de método extra.
- Seção Qualidade em duas camadas removida; medições Lighthouse permanecem apenas junto ao projeto PageSpeed, sem duplicação. Experiência/automação ocupa o destino #impacto do menu.
- Antes da tecnologia apresenta três empregos e suas atividades, sempre visíveis, sem accordion.
- Skills em azul petróleo com contraste claro, logos preservados e logotipos pretos invertidos onde necessário. Frase de instrução de hover removida.
- Seletor de idiomas mostra PT e EN simultaneamente, com idioma atual marcado por aria-current=page e URLs equivalentes explícitas. Código anterior já emitia os destinos corretos; não foi possível reproduzir um erro de servidor no navegador privado. PORTFÓLIO em PT e PORTFOLIO em EN testados. CV no menu, título e chamadas dos dois idiomas; arquivos de download seguem o idioma.

Verificação: 44 testes de build/rotas/idioma/estrutura/interações/motion aprovados. Incluem associação do pin ao contêiner e da transformação ao filho, limpeza, fallback, unicidade e associação dos detalhes de ferramentas, seletor PT/EN e CV. Revisão visual autenticada permanece pendente.

Revisão independente: links de ferramentas agora removem um filtro que tenha ocultado o artigo, sincronizam botões e atualizam medidas antes do salto nativo ao fragmento. Teste de regressão cobre esse fluxo.

CSS e scripts recebem query de versão derivada do conteúdo em cada build, para solicitar a revisão atual em vez de reutilizar assets antigos do navegador. Isso não comprova que cache tenha sido a causa do relato de idioma; os destinos e marcação de idioma foram verificados nos arquivos gerados.
