# Loading numérico, ondas e descoberta do portfólio

## Entrega

O loading utiliza o vídeo indicado em https://br.pinterest.com/pin/571957221449547099/, com a composição e movimento preservados e conversão da luminância para fundo #091425 e números brancos. Arquivo local MP4/H.264, sem áudio, 1276×720, 5,154 s, 368.792 bytes. O vídeo não é um indicador de progresso de download. O fim da reprodução revela o hero; erro ou bloqueio de autoplay libera a página imediatamente, e uma rede parada tem prazo de segurança de 6,5 s. O bootstrap libera em 7 s se o módulo falhar. Âncoras diretas, cases, movimento reduzido e retorno de BFCache seguem sem reproduzir o vídeo.

Ondas elípticas brancas surgem com o movimento do cursor no footer, crescem e desaparecem em 2,2 s. Canvas com pointer-events:none, entre o nome de fundo e os links. Mesma cor nos dois temas. Frames são solicitados apenas enquanto existem ondas; há limpeza de listeners, pausa fora da tela/aba oculta e respeito a movimento reduzido. O efeito de vapor e a caligrafia foram preservados.

## Aplicação da PageSpeed & SEO Optimizer

Checklist anexado aplicado ao projeto estático existente, sem introduzir React, Tailwind ou bibliotecas para substituir o que já funciona.

| Recurso | Antes | Depois | Diferença |
| --- | ---: | ---: | ---: |
| Três fontes carregadas | 152.176 bytes, WOFF | 119.584 bytes, WOFF2 | −21,4% |
| Retrato solicitado no desktop QA, DPR 1 | 1.231.204 bytes | 356.686 bytes, variante 640 | −71,0% |
| Loading | Canvas procedural, sem vídeo | MP4 de 368.792 bytes | Novo custo visual autorizado |
| Testes | 67 aprovados | 71 aprovados | Novos fluxos de mídia e descoberta |

As três famílias foram mantidas para preservar a tipografia aprovada, incluindo Pinyon Script. Licenças mantidas; WOFF originais ficam no repositório, fora do build. Retrato original transparente 1254×1254 preservado; variantes 400/640/960 em WebP lossless com srcset/sizes, dimensões explícitas e prioridade alta no hero. Em telas de maior densidade o navegador pode escolher 960 ou 1254: a redução de 71% não é universal. Capturas originais de evidência e PDFs localizados foram preservados. Fontes, imagens, JS e vídeo servidos localmente.

## SEO, AEO e GEO

- Títulos únicos até 60 caracteres e descrições de até 160; autoria, robots, canonical e hreflang PT/EN preservados.
- Open Graph/Twitter completos, imagem 1200×630, nome do site e locale por idioma. Favicon SVG existente mantido.
- Grafo JSON-LD com WebSite, Person, ProfilePage ou WebPage, autoria consistente e BreadcrumbList nos cases. Projetos com código usam SoftwareSourceCode. Formação em andamento não é apresentada como diploma concluído.
- Três perguntas e respostas diretas dentro da apresentação pessoal, em HTML nativo e localizadas, sem nova seção promocional.
- Dezesseis versões index.md, uma por página PT/EN, geradas dos mesmos dados dos cases. Descobertas com rel=alternate text/markdown; cada versão mantém canonical, fontes, papel e limitações.
- llms.txt na raiz com índice, referências, autoria e regras para interpretar evidências. Não é controle de acesso, licença nem substituto de robots.txt. Não inventa telemetria de uso, ROI, economia de horas, tráfego ou vendas.
- Sitemap e robots.txt continuam apontando ao domínio de produção configurado: https://portfolioanny.vercel.app. A prévia Sites mantém sua audiência privada; mecanismos públicos não podem rastreá-la como produção.

Referências primárias: https://developers.google.com/search/docs/appearance/ai-features?hl=pt-BR e https://llmstxt.org/. As práticas de SEO existentes continuam relevantes para recursos de IA; não existe garantia de resposta destacada, ranking ou citação por modelos. llms.txt é uma convenção emergente e não um requisito do Google.

## Verificação e limites

Build de 16 rotas; 71 testes aprovados, links e âncoras locais válidos, imagens responsivas decodificadas e URLs de fontes conferidas. npm audit --omit=dev: zero vulnerabilidades reportadas. git diff --check sem erros. QA desktop na prévia gerenciada confirmou reprodução até ended, saída do overlay, retrato 640 selecionado, fontes carregadas e ondas brancas no fundo dos dois temas. Não surgiram erros da aplicação nos logs filtrados por sua origem.

Não foi executado Lighthouse/PSI nesta entrega. Os bytes medidos não são uma pontuação de desempenho e o vídeo acrescenta custo à chegada. Não houve nova QA visual mobile. Acessibilidade, foco e reduced-motion têm testes e fallback, sem alegação de auditoria WCAG completa. Nenhuma proteção de publicação foi removida.
