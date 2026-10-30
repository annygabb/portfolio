# Animações reversíveis e carrossel

Pedidos: gráfico Lighthouse crescendo até os dados ao entrar; transição 3D dos previews de ferramentas para os detalhes; três sites em carrossel; contador de aproximadamente60 visível e repetível; blocos surgindo novamente quando voltam à tela; escrita dos títulos e marca-texto.

Manter stack HTML/MJS, GSAP, ScrollTrigger e Lenis. Usar visibilidade real para reiniciar efeitos e contadores, evitando disparos prematuros ao recalcular pins. O gráfico interpola coordenadas da base80 até os valores originais, sem inventar uma série de crescimento. A tabela e os nomes acessíveis continuam estáticos e verdadeiros.

Carrossel: uma região com três slides de sites, setas, indicadores e navegação por teclado/toque, sem autoplay. Filtros continuam considerando sete projetos. Os quatro produtos/ferramentas preservam cenas em profundidade. Detalhes das ferramentas recebem a mesma linguagem de entrada/saída, sem prender conteúdo longo.

Escrita: revelar palavras com passos por letra, preservando ligação caligráfica e quebra natural de linhas. Nomes acessíveis completos; marca-texto em palavras de destaque, animado depois da escrita. Conteúdo visível sem JavaScript e com movimento reduzido.

Validar: dados finais98/100/94 inalterados; carrossel setas/indicadores/filtros; repetição do contador0→60 e gráfico; bloco de detalhes na transição3D; escrita e destaques; limpeza de observers/tweens; links do menu permanecem no destino depois de imagens carregarem.

## Verificação

56 testes aprovados; build de16 rotas. No preview1363×936: contador observado em60, depois0 fora da seção, depois10 ao retornar; gráfico observado na base y210 e no destino exato66/50/98; carrossel avançou para Ludmila com2/3, scrollLeft1348 e sem overflow horizontal. Escrita concluída com clip aberto, marca-texto em escala1 e nomes acessíveis completos, incluindo espaços nas quebras de linha. Detalhes com perspectiva1600; ao recolher, transform:none e230px de altura.

Revisão independente encontrou entrada/saída sobrepostas em detalhes curtos e medições incorretas do carrossel oculto: transições são desativadas em painéis recolhidos/curtos; filtros notificam o carrossel e medições ocultas são ignoradas. O resumo focado volta ao enquadramento quando necessário após abrir/recolher.

A animação Lighthouse parte do limite inferior80 do eixo até as notas preservadas, sem sugerir um antes/depois histórico. Conteúdo continua legível sem JS e com movimento reduzido; CV e idioma preservados. QA visual de mobile não realizada nesta rodada.
