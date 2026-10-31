# Revisão visual — 30/10/2026

Corrigido degradê inválido (#000b8) na máscara do retrato. O navegador ignorava toda a máscara, expondo o corte inferior. Máscara agora usa rgba válido; sombra direcional azul-marinho e transição inferior para o fundo, sem halo branco. Retrato desktop ampliado de 400 para 480px.

Projetos: área fixada agora cobre toda a largura. Um filho separado expande de 90% para 100% ao entrar e a imagem avança em parallax enquanto a cena permanece na tela. Removida restrição por tipo de ponteiro em telas >=768×700. Conteúdo que excede a altura disponível usa fluxo natural. Elegibilidade recalculada após resize, fontes e imagens, com limpeza dos efeitos. Movimento reduzido preservado.

Conferência via navegador no preview de desenvolvimento, 1363×936: máscara válida no computed style, sombra escura, sem overflow horizontal; UaiConta seguido de Help ocupando 1348×854 abaixo do cabeçalho de 82px; nenhum conteúdo excedendo a altura das sete cenas. Seletor EN levou a /en/, lang=en, PORTFOLIO e PDF inglês; PT retornou à raiz. Revisão encontrou e corrigiu rótulos de stack não traduzidos. Seções extras de qualidade e método ausentes; ferramentas preservadas dentro dos próprios projetos.

47 testes automatizados e build de 16 rotas. QA visual de mobile não realizada nesta revisão. Publicação privada requer login; conferência visual foi feita no preview com a mesma saída estática.

Áudios recebidos permanecem sem transcrição; seus pedidos não foram inferidos nem marcados como atendidos.
