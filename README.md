# Ashfall County v0.5

Simulação observacional mobile-first de apocalipse zumbi e radioativo, sem personagem do jogador.

## v0.5

- correção do congelamento dos agentes de IA;
- cada cérebro continua totalmente independente, sem fila global;
- timeout individual de 18 s e watchdog de 22 s para chamadas presas;
- retry por agente em erros transitórios e reativação rápida após falhas;
- migração do modelo gratuito antigo para `openai/gpt-oss-20b`;
- `openai/gpt-oss-20b` é usado com reasoning baixo em decisões comuns e médio em situações complexas;
- nenhum teto interno de créditos: o jogo usa o saldo e as políticas da conta OpenRouter;
- Management Key opcional para consultar créditos da conta;
- aba Uso IA com saldo, custo da sessão, requests, sucessos, falhas, retries, latência, tokens e uso por modelo/agente;
- API Key e Management Key continuam armazenadas apenas no `localStorage` do dispositivo.

## Simulação

A base da v0.4 permanece: 30 agentes de IA, NPCs, zumbis, Exército, mundo procedural infinito, veículos e gasolina, armas, combate, progressão de habilidades, construção, inventário, relações positivas/negativas, memória experiencial de zumbis e explosão da usina no Dia 3.
