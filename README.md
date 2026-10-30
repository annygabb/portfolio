# Anny Gabrielly — portfólio

Home e sete cases individuais, em português e inglês, com tema claro/escuro. HTML gerado por rota: o conteúdo e a navegação não dependem de um roteador JavaScript.

## Executar

Requer Node.js 22 ou superior. Não há dependências de runtime nem instalação obrigatória.

```sh
npm test
npm run build
npm run dev
```

A prévia local usa a porta 4173. O build gera `dist/`; a Vercel lê a configuração versionada em `vercel.json`. A URL antiga `/index.html.html` redireciona para `/`.

## Alterar conteúdo

- `src/content.mjs`: dados, textos PT/EN, projetos e fontes das evidências.
- `src/render.mjs`: estrutura compartilhada, home e cases.
- `public/styles.css`: tokens, tipografia, layout responsivo e movimento reduzido.
- `public/app.js`: filtro, tema, menu acessível, cópia de e-mail e galeria.
- `public/assets/`: currículo original, retrato e capturas reais.
- `public/fonts/`: Manrope e Pinyon Script em WOFF, com respectivas licenças OFL.

Cada novo case precisa de textos nas duas línguas, imagem real e fontes que sustentem suas afirmações. Capturas de PageSpeed são resultados históricos registrados; não representam uma auditoria atual do portfólio ou dos clientes.

Consulte `docs/EVIDENCIAS.md` e `docs/VALIDACAO.md` para fontes e verificação da entrega.
