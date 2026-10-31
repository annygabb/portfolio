# Apresentação, formação, navegação e currículo por idioma

Pedido: sombra coerente e menos atenção à borda do braço; apresentar pessoa/formação antes de projetos, impactos e skills; menu persistente com seção ativa; PORTFOLIO e currículo em inglês na versão inglesa.

Implementação:
- Foto transparente preservada; a figura recebe fade de alpha gradual apenas no terço inferior, integrando braço e roupa ao azul do fundo. Sombra única azul escura, discreta; imagem continua em contain e sem corte geométrico novo.
- Ordem: hero, apresentação pessoal, formação visível (graduação, certificação, cursos e idiomas), projetos, evidências/experiência e automação, skills, ferramentas, currículo e contato. Formação não fica escondida em details.
- Cabeçalho sticky em todas as páginas. Sobre, Formação, Projetos, Impactos, Skills, Currículo e Contato recebem aria-current="location" conforme a leitura. Perfil é agrupado em Sobre, experiência em Impactos e ferramentas em Skills. Script independente de GSAP/Lenis funciona também com movimento reduzido e scroll nativo; agenda um update por frame e limpa listeners na saída.
- Projetos sticky e ponto final das transições respeitam altura do cabeçalho para evitar ocultar conteúdo.
- Título de fundo PT: PORTFÓLIO; EN: PORTFOLIO.
- Currículo PT original mantido byte a byte. Inglês traduzido a partir do PDF atual enviado, sem adicionar qualificações, e publicado como Anny-Gabrielly-Resume-EN.pdf. Duas páginas renderizadas e inspecionadas, sem clipping; idioma PDF en-US. Script reproduzível em scripts/build-resume-en.py. O link de download depende do idioma da página, sem conversão remota em tempo de execução.

Validação: 40 testes aprovados, incluindo ordem das seções, idioma do título/download, scroll tracking e cancelamento de frames. Texto/idioma do PDF inglês verificados; SHA-256 do português preservado. Inspeção visual autenticada do site continua pendente; PDF foi inspecionado visualmente localmente.

Revisão independente: menu compacto ampliado para 900px, TOC dos cases deslocado abaixo do cabeçalho e regra explícita de fim do documento para marcar Contato mesmo com rodapé curto.
