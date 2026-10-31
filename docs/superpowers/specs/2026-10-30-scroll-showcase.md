# Revisão de scroll, ferramentas e logos

Solicitação: corrigir legibilidade da saudação e halo claro; projetos sequenciais de tela inteira; gráficos e tecnologias por projeto; evidências mais claras; logos com nome/zoom; ferramentas expansíveis; remover seção de contratação/investimento; rodapé e parallax conforme prompts anexados.

Implementação na stack existente (HTML estático gerado em MJS/CSS/GSAP/Lenis):
- Hero: saudação branca maior sobre véu azul discreto; todos os filtros de sombra removidos. A parede era a origem do halo. JPEG original intacto recebe máscara vetorial externa derivada da região de parede neutra conectada às bordas; camisa e rosto preservados. Sem reconstrução generativa.
- Sete projetos: cada artigo ocupa no mínimo a altura da tela no desktop. Sticky nativo organiza as sobreposições; GSAP escala/esmaece o anterior quando o próximo entra. Visores baixos, mobile e movimento reduzido usam sequência natural, sem fixação.
- Cada projeto mostra captura real, tecnologias, benefícios e diagrama funcional Necessidade → Entrega → Valor. Sem números inventados de conversão ou economia.
- Evidências: linhas Lighthouse com escala 80–100 explicitada e tabela completa. Registros independentes, sem alegação de trajetória de crescimento. CI e consistência de contas explicados separadamente.
- Logos locais Devicon para tecnologias disponíveis; GSAP, Lenis, ServiceNow e Power Automate como nomes tipográficos. Zoom e nome no hover/foco; mobile com nomes persistentes. Sem porcentagens de domínio.
- PageSpeed e Orquestrador expandem com details/summary acessíveis, capturas, explicações, métricas e links ao GitHub. Estrelas e amplitude do catálogo não são quantidade de uso: ausência de telemetria declarada.
- Seção de contratação e referências para #contratar removidas. Rodapé inspirado no anexo, com navegação real, contato e nome grande; sem formulário de newsletter não funcional ou indicador de infraestrutura sem monitoramento.
- Parallax em quatro camadas usa os deslocamentos 70/55/40/10 do prompt, com o único ticker Lenis existente, limpeza por GSAP matchMedia e respeito a movimento reduzido. Nenhum segundo Lenis ou kill global de triggers.

Pinterest fornecido não acessível pela ferramenta de leitura; o comportamento foi adaptado do código enviado e das instruções, sem alegar observação do vídeo. Inspeção visual autenticada da prévia continua indisponível. Verificação automatizada não equivale a revisão visual.

Verificação final: 36 testes aprovados, incluindo expansão inline, preservação de navegação modificada e associação/limpeza dos tweens da sequência de projetos. Logos locais e todos os links das 16 rotas conferidos pelo build/testes.

Revisão independente: corrigida a rotação de texto nas ferramentas ao restringir o seletor legado ao ícone dos details anteriores. A animação de projetos agora usa a mesma condição de altura, largura e ponteiro do sticky CSS; em janelas baixas o conteúdo não perde contraste.

## Correção do retrato
Após feedback de fundo residual e corte, removidos mask/clipPath do retrato. Novo asset transparente produzido por remoção de fundo com imagegen, preservando enquadramento completo solicitado. JPEG original mantido; o asset é um derivado, não uma máscara aplicada aos pixels originais. Exibição usa contain, centralização exata, margem interna lateral e folga inferior. Sombra única discreta em azul escuro (#050d1b38), sem halo branco. O recorte vetorial antigo deixou de ser utilizado. Inspeção visual autenticada continua pendente.
