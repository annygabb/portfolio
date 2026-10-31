# Adaptação dos componentes enviados

O projeto atual gera páginas estáticas em `src/*.mjs`, usa `public/styles.css` e inicializa GSAP/Lenis em `public/motion.js`. Não há React, TypeScript, Tailwind ou shadcn instalados. Os efeitos e a estrutura de rodapé dos prompts foram adaptados à stack existente, mantendo os assets reais, as rotas PT/EN e um único ticker Lenis.

O parallax usa `data-parallax-layers` e quatro camadas com os deslocamentos 70/55/40/10. A limpeza fica limitada ao contexto da página, em vez de apagar todos os ScrollTriggers globais. Não é necessário provider ou estado global; as ferramentas usam o estado nativo de details. O rodapé tem navegação e contatos reais; o formulário de assinatura e os links demonstrativos do template não foram publicados.

## Se for necessária uma versão React dos componentes

A migração não foi executada nesta revisão. Para uma base separada com os arquivos TSX originais:

1. Gerar uma base Vite pelo fluxo oficial de [shadcn/ui](https://ui.shadcn.com/docs/installation/vite), escolhendo TypeScript. O comando gerado pelo configurador inclui `shadcn@latest init --template vite` e o preset escolhido.
2. Instalar Tailwind e `@tailwindcss/vite`, adicionar o plugin ao Vite e importar `tailwindcss` no CSS, seguindo [Tailwind com Vite](https://tailwindcss.com/docs/installation/using-vite).
3. Configurar o alias `@` para `src`, rodar a inicialização shadcn e adicionar button/input pelo CLI.
4. Usar `src/components/ui/parallax-scrolling.tsx` e `src/components/ui/footer-01.tsx`. A pasta concentra componentes reutilizáveis e corresponde ao alias `@/components/ui` dos imports enviados; não altera o comportamento por si só.
5. Instalar GSAP e Lenis, usando uma única instância e removendo callbacks do ticker no unmount. O projeto atual já possui versões fixadas no package-lock; não há motivo para adicionar outra cópia de Lenis.
6. Substituir as imagens demonstrativas pela foto e capturas reais, remover ações sem destino e preservar movimento reduzido e os ajustes mobile.

A base React deve substituir o renderizador atual em uma migração própria, com teste das 16 rotas; não se deve copiar TSX sem runtime e afirmar que foi integrado.
