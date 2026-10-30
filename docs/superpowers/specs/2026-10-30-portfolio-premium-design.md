# Redesign do portfólio — Anny Gabrielly
Data: 30/10/2026. Estado: design aprovado pela usuária; implementação no PR #1, testes automatizados aprovados, QA visual pendente de acesso à prévia protegida.

## Intenção
Apresentar Anny como Analista de Sistemas e Desenvolvedora Full-Stack que constrói produtos e automatiza processos. Público prioritário confirmado: recrutadores de tecnologia. Tornar claras sua contribuição, decisões técnicas, capacidade de entrega e resultados com fontes.

## Escolhas confirmadas
- Página principal com cases individuais.
- Visual clean em branco e azul.
- Movimento elegante e perceptível.
- Toque caligráfico da referência Behance de Nastya Fedorchenko.
- Destaque para Help (TCC), UaiConta, PageSpeed & SEO Optimizer e Orquestrador de Sites.
- Cases de sites em produção: Tiago Horta, Dra. Ludmila Grossi e Enivaldo Rodrigues.

## Abordagens consideradas
1. Home e cases individuais: escolhida pela usuária; apresentação rápida com aprofundamento técnico e evidências em cada projeto.
2. Página única com detalhes expansíveis: menor complexidade de navegação, mas torna extensa a leitura dos cases; descartada pela escolha da usuária.

## Direção visual proposta pelo implementador
Branco #FFFFFF, grafite #142033, azul #2455D6 e azul muito claro #EFF4FC. Manrope como fonte principal e Pinyon Script em palavras curtas e grandes. Essas fontes são aproximações propostas, não identificação confirmada das fontes do Behance.
Composição editorial, títulos fortes, respiro, divisórias discretas e capturas reais dos projetos. Evitar repetição de cartões, barras subjetivas de domínio técnico e números sem evidência. Caligrafia usada em destaques, nunca em parágrafos ou controles.
Aproveitar a narrativa visual e as imagens amplas de Tiago Horta, o respiro e a hierarquia do site de Ludmila e a organização da informação do ER Jurídico. O Pinterest não foi acessível; os anexos e o Behance foram vistos.

## Página principal
1. Cabeçalho: identidade Anny Gabrielly, Projetos, Sobre, Experiência, Contato.
2. Abertura: nome, posicionamento full-stack e automação, destaque caligráfico; ações Ver projetos e Currículo. Aproveitar retrato existente se houver asset utilizável; não gerar identidade fictícia.
3. Projetos selecionados: Help e UaiConta em maior destaque; skill e Orquestrador como ferramentas autorais; sites entregues como evidência de produção.
4. Impacto documentado: cerca de 60 chamados/mês como volume de suporte; transformação do fluxo de verificação de dados; 20 estrelas da skill com data de consulta e link.
5. Método: entendimento do problema, construção, validação e acompanhamento; explicar o uso das ferramentas próprias.
6. Sobre e experiência: NTT DATA, trabalho freelancer, Engenharia de Software e certificação SFC; experiências anteriores resumidas, preservando datas absolutas do PDF e evitando duração relativa desatualizada.
7. Contato: e-mail, LinkedIn e GitHub; currículo baseado no Profile atualizado. Preservar PT/EN e alternância de tema claro/escuro existentes, com branco/azul como apresentação padrão. Usar Profile(1).pdf como currículo original baixável.

## Cases individuais
Rotas propostas /cases/help/, /cases/uaiconta/, /cases/pagespeed-seo-optimizer/, /cases/orquestrador-de-sites/, /cases/tiago-horta/, /cases/ludmila-grossi/ e /cases/er-juridico/.
Cada página deve explicar problema, contexto, participação/autoria, solução, decisões, imagens, evidências, limitações pertinentes, links de código/produção e retorno aos projetos. Ações disponíveis também por teclado e toque.
- Help: plataforma acadêmica full-stack; perfis, vagas, cursos, comunicação e autenticação. Explicar contribuição da Anny sem atribuir automaticamente a ela todo trabalho de equipe. Java/Spring, React e persistência; testes de isolamento, sessões e comunicação como exemplos concretos. Roteiro de teste não equivale a execução aprovada.
- UaiConta: produto financeiro open source; realizado x previsto, importação revisável, duplicidades e valores em centavos. Distinguir recursos implementados de pendências. SECURITY_QA V7 relata aprovação de quality/E2E e preview; apresentar como validação documentada, não nova execução nossa. Testes estáticos não provam isolamento multiusuário real.
- PageSpeed: autoria, fluxo antes/depois, otimização de imagens/fontes/código, SEO e acessibilidade. GitHub confirma 20 estrelas em 30/10/2026. Capturas registram desktop 98/100/100/100, 100/100/100/100 e 100/94/100/100 (Performance/Acessibilidade/Boas Práticas/SEO). Verificar visualmente as imagens antes de publicação. Não associar notas a clientes sem identificação na captura. Sem baseline identificado, apresentar resultado observado, não ganho percentual.
- Orquestrador: MCP App, seletor e catálogo central, referências externas, propostas via PR, proteção de envios e rotinas de revisão. Explicar padronização e reutilização sem inventar horas economizadas. Catálogo retornou 48 opções nesta sessão, incluindo skills e recursos de personalização; não chamar todas de skills. Testes de seleção, catálogo e Turnstile documentam cenários específicos.
- Sites: imagens reais, escolhas de conteúdo, navegação, experiência móvel e caminhos de contato observáveis. Não atribuir crescimento de vendas ou conversão sem analytics/comparativo.

## Fontes e evidências
- Profile(1).pdf enviado nesta conversa: posicionamento, datas, formação, contatos e descrição de automação.
- Anexo image(20261030-113555).png: 20 estrelas; API GitHub também confirmou stargazers_count=20.
- https://github.com/annygabb/pagespeed-seo-optimizer/blob/main/references/resultados-observados.md
- https://github.com/annygabb/pagespeed-seo-optimizer/blob/main/README.md
- https://github.com/annygabb/UaiConta/blob/main/SECURITY_QA.md
- https://github.com/annygabb/UaiConta/blob/main/IMPLEMENTATION_REPORT.md (V4 anterior ao QA V7; não usar como estado atual isoladamente).
- https://github.com/annygabb/Help---TCC/blob/main/Help/docs/TESTE_SOCIAL_PONTA_A_PONTA.md
- Testes encontrados nas árvores atuais dos quatro repositórios; status de CI deve ser conferido antes de alegar execução atual.
- https://github.com/annygabb/Orquestrador-de-Sites/blob/main/README.md
- Sites públicos visitados no navegador: https://www.tiagohortafotografo.com.br/, https://draludmilagrossi.vercel.app/, https://www.erjuridico.com.br/.
- Behance: https://www.behance.net/gallery/239103229/PORTFOLIO-2025-web-design-social-media-design

## Interação, acessibilidade e desempenho
Entradas suaves ao rolar, transições em links, previews dos projetos e profundidade discreta nas imagens em desktop. Usar movimentos curtos, prefers-reduced-motion, conteúdo acessível sem animação, foco visível e áreas de toque confortáveis. Evitar travar rolagem, cursor substituto ou efeitos que impeçam leitura.
Imagens responsivas com dimensões, fontes otimizadas, scripts enxutos, sem carregamento de todos os sites via iframe. SEO por case, metadados verdadeiros, links externos protegidos e sem métricas prometidas.
Validar 320, 375, 414, 768 e desktop; navegação direta e recarga de cases; links, menu e acessibilidade por teclado.

## Base técnica e escopo
O repositório atual contém um único index.html.html de cerca de 430 KB, Tailwind via CDN, Space Grotesk e Plus Jakarta Sans, temas claro/escuro e conteúdo PT/EN. Manter a simplicidade de hospedagem estática como proposta do implementador, separando CSS, JS, conteúdo e assets; escolher ferramenta de build somente se necessária. Não exige banco ou autenticação no portfólio. Corrigir entrada para index.html com compatibilidade da URL antiga se necessário.
Trabalho em branch separada, verificação e PR revisável. Integração/publicação será tratada após versão concreta e verificável; não declarar o site atualizado enquanto só existir este documento.
O seletor do Orquestrador foi aberto, mas nenhuma confirmação de seleção foi recebida. Não alegar skills confirmadas por ele. As skills locais pertinentes podem ser usadas independentemente.

## Critérios de aceite
Home e sete cases completos; apresentação profissional atualizada; tipografia caligráfica pontual; capturas reais otimizadas; evidências rastreáveis e contextualizadas; contato/currículo funcionais; responsividade e movimento reduzido; verificações documentadas. Nenhum depoimento, percentual de economia, faturamento ou taxa de conversão inventado.

## Revisão de implementação
Builder check concluído: desenho implementável, sem escolha material pendente. Incorporados os seguintes critérios:
- Registrar mapa de evidências com fonte, commit, data e dispositivo quando disponíveis, além da afirmação sustentada.
- Buscar baselines em arquivos e histórico dos repositórios antes de publicar comparações. Não tratar a simples existência de um fluxo antes/depois na skill como evidência de um comparativo real de cliente.
- Se retrato ou captura não estiver disponível, usar composição editorial com assets reais e texto; não bloquear o projeto nem fabricar telas.
- Fontes adicionais verificadas via GitHub Actions: Help Validar HELP com sucesso na main no commit d984ba0b04823ed6f2b2ddb74d200148b48273f8 (run 40787778202); UaiConta V4 CI com sucesso na main no commit 16f6be99c9d2252bef15f1195773dda9774bcebe (run 38304583725). Conferir escopo dos jobs antes de detalhar testes aprovados.
- Runs recentes do Orquestrador consultados são da branch feat/skill-discovery-orchestration; não atribuir automaticamente seus resultados à main.
