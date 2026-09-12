# Ashfall County v0.7.1

Simulação observacional mobile-first de apocalipse zumbi e radioativo, sem personagem do jogador.

## v0.7.1 — liveness real-time + seleção segura

- watchdog em tempo real independente do relógio da simulação para os 30 agentes de IA;
- agentes ociosos, com cérebro pendurado ou movimento sem progresso são recuperados individualmente;
- o cérebro não planeja por cima de uma ação física em execução;
- seleção passa a aceitar apenas entidades inspecionáveis conhecidas;
- checkpoints e estruturas sem `kind` são normalizados como `structure`;
- corrige o travamento total do `requestAnimationFrame` ao inspecionar determinadas construções;
- o renderer limpa seleções inválidas e tenta se recuperar sem matar o mundo;
- hits bem-sucedidos agora aplicam knockback físico leve; `push` continua sendo o golpe dedicado a criar distância.

## v0.7

Mantém o combate sistêmico com alcance, postura, equilíbrio, guarda, energia, dor, estresse, habilidades, linha de visão, recuo, quedas, agarrões, regiões corporais, desgaste de armas e pressão coletiva.

## Base

Mantém 30 agentes independentes via OpenRouter, NPCs, militares, zumbis, mundo procedural infinito, crafting, construção, veículos/gasolina, memória experiencial, sensores, relações sociais, progressão de habilidades, ranking de kills, métricas OpenRouter automáticas e explosão da usina no Dia 3.
