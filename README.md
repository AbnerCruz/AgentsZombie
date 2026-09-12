# Ashfall County v0.6

Simulação observacional mobile-first de apocalipse zumbi e radioativo, sem personagem do jogador.

## v0.6

- ranking de kills clicável, com redirecionamento para a inspeção e câmera do personagem;
- sensores separados de visão, audição e ruído próprio;
- campo de visão direcional e oclusão simplificada por construções;
- sistema de ruído que afeta percepção e também pode atrair infectados;
- redução forte de meta-informação: o cérebro não recebe uma coleção chamada `zombies`, percentuais internos de infecção/radiação ou relações numéricas;
- pensamento atual deixa de ser salvo como memória duplicada;
- cérebro pode planejar a próxima tarefa enquanto o corpo continua executando a atual;
- fila de tarefas por agente, mostrada na inspeção;
- crafting conhecido por personagem com materiais, duração, prática de habilidade e fila;
- novos itens improvisados e armas simples;
- feedback de hit com flash, impacto, sangue e dano;
- contagem de kills em combate e por veículo;
- métricas OpenRouter sincronizadas automaticamente, sem botão de atualização;
- Management Key e API Key continuam armazenadas apenas no dispositivo.

A base da v0.5 permanece: 30 agentes independentes via OpenRouter, NPCs, militares, zumbis, mundo procedural infinito, veículos, gasolina, construção, relações sociais, habilidades por prática, memória experiencial e explosão da usina no Dia 3.
