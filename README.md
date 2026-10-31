# Anny Gabrielly — portfólio

Home e sete cases individuais, em português e inglês, com tema claro/escuro. HTML gerado por rota: o conteúdo e a navegação não dependem de um roteador JavaScript.

## Executar

Requer Node.js 22 ou superior. GSAP 3.15.0 e Lenis 1.3.27 estão fixados no lockfile. O build copia as distribuições locais para dist/vendor; o site não depende de CDN.

```sh
npm ci
npm test
npm run build
npm run dev
```

A prévia local usa a porta 4173. O build gera `dist/`; a Vercel lê a configuração versionada em `vercel.json`. A URL antiga `/index.html.html` redireciona para `/`.

## Alterar conteúdo

- `src/content.mjs`: dados, textos PT/EN, projetos e fontes das evidências.
- `src/render.mjs`: estrutura compartilhada e cases.
- `src/home.mjs`: abertura com retrato, projetos, skills, experiência e currículo.
- `public/styles.css`: tokens, tipografia, layout responsivo e movimento reduzido.
- `public/app.js`: filtro, tema, menu acessível, cópia de e-mail e galeria.
- `public/motion.js`: GSAP/ScrollTrigger, Lenis e scroll 3D progressivo, com cleanup e movimento reduzido.
- `public/assets/`: currículo original, retrato e capturas reais.
- `public/fonts/`: Manrope e Pinyon Script em WOFF, com respectivas licenças OFL.

Cada novo case precisa de textos nas duas línguas, imagem real e fontes que sustentem suas afirmações. Capturas de PageSpeed são resultados históricos registrados; não representam uma auditoria atual do portfólio ou dos clientes.

Consulte `docs/EVIDENCIAS.md` e `docs/VALIDACAO.md` para fontes e verificação da entrega.
