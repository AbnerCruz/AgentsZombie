# Ashfall County v0.2

Simulação observacional autônoma de colapso zumbi e radioativo, feita para rodar inteiramente no navegador e ser hospedada no GitHub Pages.

## Premissa

Toda simulação começa obrigatoriamente no **Dia 1, 07:00**, no início do grande caos social. O observador não controla nenhum personagem: apenas acompanha o mundo, acelera o tempo, muda a câmera e inspeciona pessoas, infectados, grupos e locais.

## População

A versão v0.2 inicia com **280 pessoas**. Internamente há **100 agentes cognitivos completos** e **180 civis sistêmicos (NPCs)** para aumentar densidade e organicidade. Essa diferença é exclusivamente técnica: nenhum habitante tem acesso a essa informação e todas as relações sociais tratam qualquer indivíduo como uma pessoa do mesmo mundo.

Os 100 agentes mantêm memória mais longa e maior profundidade de decisão. Os NPCs usam uma camada de decisão mais econômica, mas continuam tendo identidade, família, profissão, necessidades, relações, crenças, contágio, radiação, inventário básico, grupos e possibilidade de liderança.

## Sistemas atuais

- início variável a partir das mesmas condições de Dia 1;
- 100 agentes + 180 NPCs;
- famílias e relações de confiança;
- informações e rumores propagados pessoa a pessoa;
- rádio KACR difundindo conhecimento de forma parcial;
- liderança emergente e abrigos espontâneos;
- fome, sede, cansaço, estresse, saúde e inventário básico;
- infecção, transformação, combate e cadáveres persistentes;
- pluma radioativa dinâmica e mutação de infectados;
- incêndios e colapso de infraestrutura;
- comportamento coletivo simples de hordas;
- spatial hash para manter a população maior viável em dispositivos móveis;
- camadas de radiação, grupos e rotas;
- arquivo cronológico do colapso.

## GitHub Pages

Os arquivos do site ficam na raiz e não exigem build, backend ou dependências externas.
