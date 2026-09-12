# Ashfall County v0.7.2

Simulação observacional mobile-first de apocalipse zumbi e radioativo, sem personagem do jogador.

## v0.7.2 — ciclo cerebral direto + knockback físico

- remove fila de execução dos 30 agentes de IA;
- cada agente segue `decidir → executar → terminar → decidir novamente`;
- heartbeat real acorda agentes ociosos sem depender de `nextDecision` ou do relógio simulado;
- tarefas residuais antigas são descartadas para não bloquear o próximo ciclo;
- cérebro pendurado é abortado individualmente e tenta novamente;
- movimento sem progresso é recuperado por agente, sem decisão global/fallback roteirizado;
- seleção defensiva de pessoas, construções, veículos e estruturas permanece ativa;
- knockback de hits passa a usar impulso físico curto com decaimento, ficando visível sem substituir o golpe `push`.

## v0.7

Mantém combate sistêmico com alcance, postura, equilíbrio, guarda, energia, dor, estresse, habilidades, linha de visão, recuo, quedas, agarrões, regiões corporais, desgaste de armas e pressão coletiva.

## Base

Mantém 30 agentes independentes via OpenRouter, NPCs, militares, zumbis, mundo procedural infinito, crafting, construção, veículos/gasolina, memória experiencial, sensores, relações sociais, progressão de habilidades, ranking de kills, métricas OpenRouter automáticas e explosão da usina no Dia 3.
