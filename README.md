# Ashfall County v0.6.1

Simulação observacional mobile-first de apocalipse zumbi e radioativo, sem personagem do jogador.

## v0.6.1

- corrige congelamento do canvas ao tocar no chão depois de seguir uma pessoa selecionada;
- cancela follow ao iniciar interação manual e recupera ponteiros presos no Android;
- impede o renderer de seguir uma seleção nula;
- elimina loops de `go_to` quando o agente já chegou ao destino;
- adiciona estado espacial explícito de local atual ao cérebro;
- deduplica a fila de tarefas e descarta tarefas que perderam a utilidade;
- limita planejamento antecipado a uma próxima tarefa válida, reduzindo chamadas inúteis;
- restaura contexto explícito de veículo ocupado para o cérebro;
- aproxima automaticamente o agente ao tentar entrar ou abastecer um veículo percebido;
- veículos trancados passam por tentativa física de entrada/partida influenciada por Mecânica e Intelecto;
- `move` e `go_to` enquanto o agente ocupa um veículo podem ser executados como deslocamento veicular;
- remove memórias legadas do tipo `thought` já existentes na sessão.

## v0.6

Mantém ranking de kills clicável, sensores de visão/audição/ruído, crafting, fila de tarefas, combate aprimorado, memória epistemológica, métricas OpenRouter automáticas, 30 agentes independentes, NPCs, militares, zumbis, mundo procedural infinito, veículos, gasolina, construção, habilidades por prática e explosão da usina no Dia 3.
