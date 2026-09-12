# Ashfall County v0.7.3

Simulação observacional mobile-first de apocalipse zumbi e radioativo, sem personagem do jogador.

## v0.7.3 — desbloqueio do cérebro

- corrige definitivamente a cadeia de `buildContext` que estava usando o `this` errado e quebrava toda decisão antes do `fetch`;
- o contexto de combate agora usa `sim.combatSummary`, sem procurar esse método no `AIManager`;
- falhas durante montagem do contexto deixam de ser silenciosas e passam a alimentar `Falhas`, `lastError`, memória de erro e backoff;
- `ai.decide` possui tratamento de rejeição inesperada e sempre libera o estado `pending`;
- piso real de 650 ms por agente impede `pulseSoon` de transformar ações sem movimento em spam de decisões;
- no máximo 5 requisições OpenRouter ficam simultaneamente em voo; não existe fila global, os demais agentes continuam independentes e tentam no heartbeat seguinte;
- o backoff exponencial real é preservado mesmo que patches antigos tentem encurtar `retryAfter`;
- o contexto não envia mais `task_queue`, porque agentes de IA usam ciclo direto `decidir → executar → terminar → decidir`;
- o prompt do cérebro foi alinhado ao ciclo direto atual;
- nenhuma limitação de créditos foi adicionada e a resposta continua sem `max_tokens` artificial.

## v0.7.2

Mantém ciclo cerebral direto, seleção segura, watchdog, knockback físico, combate sistêmico, sensores, memória experiencial, veículos, crafting e mundo procedural.

## Próxima consolidação

A arquitetura ainda carrega patches históricos. A etapa estrutural seguinte é achatar essas camadas em módulos lógicos do core, reduzindo sobrescritas e tornando depuração/boot mais previsíveis.
