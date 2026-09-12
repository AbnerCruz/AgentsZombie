# Ashfall County v0.7.4

Simulação observacional mobile-first de apocalipse zumbi e radioativo, sem personagem do jogador.

## v0.7.4 — intenção persistente + cérebro por evento

- cada um dos 30 agentes mantém uma intenção física persistente;
- o corpo continua executando localmente sem depender de uma nova resposta da OpenRouter;
- replanejamento acontece por mudança relevante: ameaça nova percebida, intenção concluída ou bloqueada, mudança corporal importante, novo ferimento, novidade acumulada e conversa;
- a resposta da IA é uma nova intenção; se não for urgente durante uma ação, ocupa um único slot de próxima intenção; se for urgente, pode interromper;
- o limite de 5 requisições simultâneas afeta somente replanejamento e nunca paralisa movimento;
- a fila antiga permanece desativada para agentes de IA;
- a inspeção do observador usa sensores de forma passiva e não concede conhecimento ao agente;
- visão, audição, ruído e intenções ficam em um painel permanente separado do card principal, evitando o efeito de aparecer/desaparecer durante atualizações da inspeção.

## v0.7.3

Mantém correções de contexto da IA, backoff real, falhas visíveis, Management Key, métricas automáticas e concorrência máxima de 5 replanejamentos.
