# Ashfall County v0.7

Simulação observacional mobile-first de apocalipse zumbi e radioativo, sem personagem do jogador.

## v0.7 — liveness + combate sistêmico

- substitui o agendamento frágil dos 30 agentes por um ciclo independente com watchdog por agente;
- detecta ação de movimento sem progresso, fila travada, cérebro pendurado e estado ocioso inválido;
- recupera somente o agente afetado, sem fila global e sem decidir por ele;
- elimina tarefas duplicadas/obsoletas antes de executá-las;
- mantém no máximo uma próxima tarefa planejada enquanto a atual acontece;
- combate passa a considerar alcance, postura, equilíbrio, guarda, energia, dor, estresse, habilidade, linha de visão, distância e recuo;
- estilos quick, balanced, heavy, push, aimed, defensive e stomp;
- postura de combate escolhida pelos agentes: agressiva, equilibrada, defensiva ou manutenção de distância;
- ferimentos humanos agora possuem região corporal, tipo de trauma, severidade, dor e sangramento;
- ataques podem derrubar, desequilibrar, agarrar e exigir luta para escapar;
- pressão de vários infectados reduz capacidade defensiva e aumenta risco de agarrão/queda;
- disparos têm recuo, precisão dependente de estado físico, linha de tiro e possibilidade de atingir terceiros;
- armas sofrem desgaste e podem quebrar;
- ferimentos nas pernas, dor e quedas reduzem mobilidade;
- armas de fogo e combate corpo a corpo produzem níveis diferentes de ruído;
- NPCs e militares usam o mesmo motor físico de combate, com decisões sistêmicas próprias;
- mordida continua com 100% de contaminação, corte 75% e arranhão 50%;
- inspeção mostra equilíbrio, guarda, postura, energia, dor, recuo, queda e agarrão.

## v0.6.1

Mantém correções mobile de seleção/câmera, veículos, destinos já alcançados, contexto espacial e limpeza de memórias antigas de pensamento.

## Base

Mantém 30 agentes independentes via OpenRouter, NPCs, militares, zumbis, mundo procedural infinito, crafting, construção, veículos/gasolina, memória experiencial, sensores, relações sociais, progressão de habilidades, ranking de kills, métricas OpenRouter automáticas e explosão da usina no Dia 3.
