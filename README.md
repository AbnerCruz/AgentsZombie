# Ashfall County v0.8.0 — Realismo Autônomo

Simulação observacional mobile-first de colapso social, apocalipse zumbi e desastre radioativo. Não existe personagem do jogador: o usuário observa um mundo procedural com agentes de IA, NPCs, militares e infectados.

## Mudança arquitetural da v0.8

A v0.7.x acumulava patches que sobrescreviam repetidamente os mesmos métodos (`scheduleAgentBrain`, `updatePerson`, `sense`, `executeAgentTool`, `renderSelection`). A v0.8 remove esses patches do caminho de boot. O navegador carrega as 32 partes-base e depois cinco módulos de core com responsabilidade única:

- `core/model.js`: estado persistente, crenças, mapa mental, relações multidimensionais, memória e crafting;
- `core/combat.js`: combate, equilíbrio, guarda, agarrões, zonas corporais, knockback e kills;
- `core/ai.js`: OpenRouter, métricas, contexto, plano e reflexão diária;
- runtime consolidado em `core/runtime/*.txt`: intenção persistente, reflexo, rotina, gatilhos cognitivos e ciclo corporal;
- UI consolidada em `core/ui/*.txt`: inspeção estável, sensores, ranking, métricas e segurança de seleção.

Os diretórios `patch-v*` permanecem apenas como histórico no repositório e não são carregados pela aplicação. Os arquivos `.txt` do runtime/UI são fragmentos de transporte remontados antes da execução, não patches independentes.

## Cognição em quatro escalas

### Reflexo — código local

Recuo de ameaça imediata, tentativa de escapar de agarrão e respostas corporais urgentes não fazem chamada de rede.

### Rotina — código local

A intenção do agente persiste. Caminhar, dirigir, fugir, saquear, descansar, lutar e procurar abrigo continuam em micro-passos locais. Desligar a API não paralisa o corpo.

### Plano — OpenRouter leve

O cérebro não dispara por ociosidade. Replanejamento ocorre por mudanças: nova ameaça percebida, conversa relevante, ferimento, cruzamento de limiar corporal, novidade, mudança de período do dia ou conclusão/inviabilidade de uma intenção real. Há no máximo cinco requests simultâneos, mas isso limita apenas replanejamento, nunca movimento.

A resposta é uma nova intenção. Se não for urgente e o corpo já estiver ocupado, existe somente um slot `nextIntent`. Se for urgente, pode interromper a intenção atual.

### Identidade — OpenRouter profundo

Uma reflexão profunda por dia por agente consolida o que viveu, atualiza resumo de identidade e pode revisar o objetivo de longo prazo. Ela ocorre sem bloquear o corpo.

## Corpo e tempo

- pressão de sono e ciclo noite/dia;
- busca local por abrigo quando o sono pesa;
- sono e descanso recuperam o corpo sem depender de LLM;
- privação de sono afeta estresse, energia, mobilidade e combate;
- ferimentos cicatrizam gradualmente; ferimentos graves podem deixar cicatriz e perda de mobilidade;
- doença genérica é separada da infecção zumbi;
- fome e sede continuam em escala de horas/dias;
- novos sobreviventes podem chegar em dias posteriores.

## Informação imperfeita

- sensores não entregam IDs semânticos do mundo como conhecimento narrativo;
- distância e relações são qualitativas no contexto da IA;
- observar o painel não altera o conhecimento do agente;
- cada agente possui crenças com fonte, confiança, data e persistência;
- conversa transmite crenças com confiança modulada pela confiança social;
- contradições não apagam automaticamente a crença anterior;
- cada agente possui mapa mental dos lugares que realmente viu;
- a primeira exposição a um infectado continua sendo uma experiência, não conhecimento prévio de gênero.

## Relações

O `float` legado permanece por compatibilidade, mas a cognição usa também afinidade, confiança, dívida, medo e familiaridade. A conversa atualiza esses eixos separadamente e mantém uma estimativa mínima da intenção do outro.

## Memória profunda

No fechamento de cada dia, eventos relevantes viram um resumo diário. Detalhes fracos envelhecem e são removidos; memórias importantes e resumos permanecem. Cada agente mantém um teto de memória para impedir crescimento indefinido em runs longos.

## Combate

Mantém contaminação por mordida 100%, corte 75% e arranhão 50%. O combate considera arma, alcance, habilidade, energia, dor, estresse, sono, guarda, equilíbrio e região corporal. Há agarrão, queda, recoil, ruído, dano persistente, knockback físico com decaimento e crédito de kills, inclusive por veículo.

## OpenRouter

Não existe limite interno de crédito. API Key executa os cérebros; Management Key sincroniza saldo e uso automaticamente. A aplicação não define `max_tokens` artificial. Métricas mostram requests, sucessos, falhas, tokens, custo, latência, uso por modelo e por agente.

## Performance mobile-first

Nenhum LLM roda por frame. Sensores cognitivos são amostrados em cadência limitada e escalonada, NPCs continuam sem LLM, intenção/rotina são locais e o mundo mantém spatial grid e chunks procedurais. O objetivo é que latência ou falha de rede degradem inteligência, nunca liveness.

## Próximos marcos

A base para informação imperfeita, relações multidimensionais e tempo profundo está implementada. Os próximos avanços naturais são: grupos emergentes derivados dessas relações, rotação de nível de detalhe cognitivo para centenas de habitantes, crônica regional navegável e replay determinístico completo.
