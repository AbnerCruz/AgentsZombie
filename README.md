# Ashfall County v0.12 — Grid compacto + execução determinística

Ashfall County é uma simulação de sobrevivência 2D no navegador com agentes IA autônomos, mundo físico procedural, infectados, veículos, combate, memória, relações sociais e integração OpenRouter. A v0.12 prioriza previsibilidade arquitetural e execução contínua sem retirar os sistemas construídos nas versões anteriores.

## v0.12

- condado reduzido para **10×8 chunks (80 chunks)**;
- geração regional em **grade ortogonal**, com avenidas, ruas e conectores Manhattan;
- Ashfall, Millstone, Briar Glen e a usina reposicionados dentro do novo limite;
- 20 agentes IA iniciais e zero NPCs civis de fundo; militares permanecem como entidades especiais de eventos;
- streaming continua sob demanda: câmera e sensores não materializam o condado inteiro;
- população de infectados continua dividida entre entidades ativas e população macro latente com migração;
- passo de simulação fixo em 30 Hz reais; a velocidade 1×/4×/16×/64× altera o tempo simulado, não a quantidade arbitrária de updates causada pelo FPS do aparelho;
- timers do runtime cognitivo, social e econômico carregados pelo bundle são convertidos para cadência de **tempo simulado**;
- Utility AI local resolve necessidades triviais e urgentes sem OpenRouter: fuga imediata, curativo, água, comida, sono e busca básica;
- a LLM fica concentrada em replanejamento estratégico/ambíguo;
- `continue` e `wait` são opções válidas: o modelo não precisa inventar uma ação quando o plano atual continua correto;
- decisão da LLM passa por confirmação de execução. Ela precisa virar ação física, próxima intenção válida ou falha explícita que dispara replanejamento;
- a aba Mundo mostra intenções aceitas, ações iniciadas, decisões locais e falhas de execução;
- bundles recebem `sourceURL`, produzindo stack traces identificáveis em vez de apenas `<anonymous>`;
- diretórios históricos `patch-v05`, `patch-v06`, `patch-v061`, `patch-v07` e `patch-v073` são removidos do `main`; o histórico continua disponível pelo Git.

## Sistemas preservados

A v0.12 mantém interiores, ocupação física, A*, flow fields, colisão com substeps, veículos, crafting, combate sistêmico e knockback, sensores, memória, crenças, relações multidimensionais, cenas sociais, grupos emergentes, economia cognitiva, métricas OpenRouter/Management Key, ruído espacial, cheiro, reanimação e migração de hordas.

## Arquitetura

A release ainda usa o bundle legado das 32 partes como bootstrap porque uma migração total para ES modules numa única alteração teria risco alto de regressão. O loader agora nomeia os bundles para diagnóstico e o código morto de patches antigos sai da árvore ativa. A migração completa para `type="module"` deve ser feita depois que os subsistemas canônicos restantes forem consolidados.

## Execução da IA

O fluxo desejado é:

`mudança relevante → deliberação (quando necessária) → intenção → corpo local → ação → conclusão`

O corpo não depende de latência de rede para fome, sede, sono ou fuga imediata. Uma resposta de LLM recebida enquanto o agente já age ocupa o slot de próxima intenção quando não é urgente. Uma resposta urgente pode interromper. Se uma intenção não conseguir produzir ação, o erro fica observável e volta ao ciclo de decisão em vez de desaparecer silenciosamente.
