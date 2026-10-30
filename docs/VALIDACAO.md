# Validação da entrega

## Build e comportamento estático

- Node 24.22.1 neste ambiente; projeto declara Node >=22.
- `npm test`: 31 verificações aprovadas, incluindo build, 16 rotas PT/EN, links/âncoras/arquivos locais, títulos únicos, dimensões da capa PageSpeed e interações de menu/tema.
- `node --check public/app.js` e `node --check src/render.mjs`: aprovados.
- GSAP 3.15.0 e Lenis 1.3.27 fixados no package-lock; distribuições copiadas localmente pelo build. Não há CDN necessária para fontes, CSS, JS e imagens.
- Sem JavaScript, o conteúdo e os links continuam presentes; controles que dependem de JS ficam ocultos.
- Testes de interação executam o código real com um adaptador mínimo de DOM; não substituem verificação em navegador.

## Revisão independente

Revisor independente verificou fonte, build, ativos e requisitos. Identificou foco incorreto ao abrir menu mobile. Um teste reproduziu o problema antes da correção; o menu agora foca o primeiro link e Escape retorna ao botão. Também foram corrigidas as dimensões das imagens para reservar proporções corretas. O currículo foi decodificado e as capturas originais verificadas.

## Peso verificável

HTML original monolítico: 429.636 bytes. Nova home PT: aproximadamente 24 KB, com CSS, JS, imagens e fontes em arquivos separados. Isso mede redução do HTML inicial, não redução equivalente do tráfego total, nem uma pontuação Lighthouse.

As seis capturas de sites foram convertidas para WebP; carregamento adiado fora do conteúdo inicial. Fontes locais em WOFF com subconjunto latino e licenças preservadas. `prefers-reduced-motion` desativa transições e animações.

## Hospedagem e limite atual

- GitHub CLI/HTTPS não possui credencial de escrita neste ambiente; sincronização usa o plugin GitHub autorizado.
- A conexão Vercel lista o projeto portfolioanny, mas consulta detalhada retorna 404 e listagem de deployments retorna 403. Não foi alterada configuração de acesso para contornar isso.
- O navegador remoto não alcança localhost do executor. URLs file: são bloqueadas; não serão usadas para QA.
- Prévia privada pelo Sites preparada para revisão visual. Registrar abaixo o resultado real antes de finalizar.

## QA visual

Prévia privada publicada com sucesso em https://anny-portfolio-premium-review.suportesistemahelp.chatgpt.site. O navegador remoto chegou ao login, sem sessão autenticada.\n\nA Vercel também confirmou deploy READY no comentário do PR #1 e status de sucesso do commit c57c0e1164346d840e0ff1906c74fdd9297ea0d9. Prévia automática: https://portfolioanny-git-redesi-10594a-annygabbyoficial-5107s-projects.vercel.app. Ela exige Vercel Authentication.\n\nA revisão automática de permissões rejeitou a criação/reutilização de um link temporário por ampliar acesso sem autorização explícita. Nenhuma proteção foi desativada; QA visual em desktop/mobile, interações ao vivo e console permanecem pendentes. Os testes automatizados e a revisão de código não substituem essa etapa.

Não foi executado Lighthouse remoto/local nesta etapa. Não alegar nota 95+ para o novo portfólio sem medição.

## Revisão do retrato e camadas full-stack

- Foto fornecida de 400×400 substituída e validada; documento baixável tem o mesmo SHA-256 do currículo atual enviado.
- Testes novos verificam apresentação → projetos → skills → currículo em PT/EN, nome no H1 e contribuições frontend/backend nos cases de produto.
- Motion: testes de reduced-motion, ausência das bibliotecas, ticker único com conversão de segundos para milissegundos, rolagem nativa no mobile, teardown e refresh após filtro. Esses testes usam adaptadores e não comprovam suavidade/fidelidade visual em um browser real.
- A autorização de link temporário continua pendente. Não foi repetida a ação rejeitada de compartilhamento; nenhuma proteção de acesso foi alterada.

Revisão independente da integração GSAP/Lenis: identificou conflito entre inércia e navegação por fragmentos. Corrigido reset antes do hash nativo, com teste RED→GREEN. Diálogo de provas pausa e retoma Lenis e bloqueia scroll de fundo; teste RED→GREEN. Fonte da confirmação: implementação Lenis 1.3.27 consultada, não inferência do nome de uma opção.
