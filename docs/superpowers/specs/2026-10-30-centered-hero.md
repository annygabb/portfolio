# Hero com retrato central e título sobreposto

Pedido explícito: aproximar hero dos dois primeiros recortes fornecidos. A versão anterior (texto à esquerda / foto enquadrada à direita) não correspondia à composição, apesar de compartilhar a cor de fundo.

Mudança: PORTFÓLIO em Anton condensada ocupa a largura; retrato recortado central em camada à frente das letras; saudação caligráfica e nome à esquerda; proposta e currículo à direita. Abaixo, faixa com identificação, contexto e três dados verificáveis (20 estrelas na skill em 30/10/2026, três sites de clientes publicados e dois produtos em evolução). Mantém azul profundo, identidade real, currículo e demais seções.

Foto: ferramenta imagegen usada para remover fundo, com prompt de preservação de identidade, enquadramento e roupa, sem extensão do corpo. Asset derivado em WebP com alpha; original mantido. Prompt: “Remove ONLY the light wall background and produce a clean truly transparent PNG cutout. Preserve the exact photographed identity, face, expression, pose, skin texture, curls, hair silhouette, clothing and framing. Do not beautify, regenerate facial features, recolor, add clothing or extend body.” A remoção por modelo gera um derivado; não é uma máscara pixel a pixel.

Anton hospedada localmente em WOFF, licença OFL preservada. Manrope e Pinyon permanecem. Layout mobile reorganiza o retrato acima da identificação lateral; movimento reduzido e fallback sem scripts mantidos. Camada animada do retrato não controla o posicionamento central, evitando conflito com transform de alinhamento.

Validação automatizada de rotas/links/ativos e demais comportamentos permanece. Visualização autenticada da prévia continua pendente; não declarar fidelidade visual verificada em navegador.

## Correção após feedback: menos ruído e foto original

Removidos do hero a faixa com três colunas/cards, os contadores, a segunda ação de currículo e os textos repetidos. Hero fica com masthead curto, palavra de fundo, retrato, nome/atuação, assinatura e uma chamada para projetos. Currículo continua na seção própria.

O derivado de imagegen foi substituído no HTML pelo JPEG original de 400 × 400, sem reprocessar seus pixels. A apresentação usa um clipPath vetorial de silhueta e drop-shadow no invólucro; não há reconstrução generativa do rosto. Exibição em desktop limitada à largura original de 400px, menor no mobile. Esse recorte vetorial pode simplificar fios de cabelo na borda; não constitui recuperação de resolução inexistente no arquivo de origem. Sombra suave também na transição do hero, sem cards novos.

32 testes aprovados após a correção. Inspeção visual autenticada continua pendente.
