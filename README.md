# Ashfall County v0.10.1 — Performance estrutural + estabilidade

A v0.10.1 é uma auditoria de fonte sobre a v0.10. Não reduz a profundidade da simulação e não substitui sistemas por atalhos visuais: remove trabalho repetido que estava sendo executado na frequência errada, corrige mutações causadas por consultas e fecha falhas de integração entre o mundo físico v0.9, sociedade v0.10 e UI.

## Causas-raiz corrigidas

- o spatial hash de pessoas e infectados não é mais apagado e reconstruído inteiro em todo frame; os buckets são atualizados incrementalmente somente quando uma entidade troca de célula;
- percepção de infectados não executa mais busca humana + todos os ruídos + raycast acústico + grade de cheiro em cada frame. O corpo continua se movendo por frame, mas a percepção é pulsada e escalonada por indivíduo;
- ruídos agora possuem índice espacial. Um infectado ou agente consulta eventos locais e só calcula transmissão física para os candidatos relevantes;
- o mapa de cheiro é realmente limitado e não varre milhares de entradas a cada depósito após atingir o limite;
- os 30 agentes deixam de executar dois pipelines de sensores concorrentes. Há um único pulso espacial; o ciclo corporal só monitora limiares e mantém a intenção;
- sensores reutilizam uma amostra curta e calculam local/luz/clima uma única vez por percepção; a mesma lista visível de construções serve para percepção e aprendizado;
- leitura de contexto social é pura: abrir contexto/sensor não cria uma relação entre duas pessoas que nunca interagiram;
- o hash de deduplicação cognitiva usa percepção passiva e não pode mais ensinar algo ao agente apenas por medir se a situação mudou;
- cenas sociais têm trava `running` e um único slot seguinte por par; uma chamada lenta não pode ser reenviada a cada ciclo de manutenção;
- manutenção social, promessas e inferência de grupos têm cadências próprias e param quando a simulação está pausada/aba oculta;
- observação social processa cada par apenas uma vez e deixa de criar relações por mera proximidade externa;
- `entityById` ganhou índice estável e `currentSite` cache por célula física;
- campos de fluxo deixam de expirar pelo relógio simulado e são invalidados por mudança real de topologia;
- movimento físico usa subpassos, impedindo atravessar paredes/portas em velocidades altas e em 16×/64×;
- cadáveres reanimados são removidos da coleção e a fila de reanimação não é reordenada sem necessidade;
- culling não faz `getBoundingClientRect()` para cada entidade em cada frame; estruturas e cadáveres também são recortados pelo viewport;
- UI deixa de reconstruir o inspetor grande a cada 300 ms quando o painel não está sendo visto;
- sensores/telemetria/mundo só atualizam seus painéis quando a aba correspondente está visível;
- recipientes e portas/janelas agora são tipos válidos de seleção no core, evitando que sejam tratados como pessoas e matem o frame;
- a recuperação do renderer pula somente o frame defeituoso; não executa novamente a mesma função que acabou de lançar a exceção.

## Diagnóstico observável

A aba Mundo recebe contadores leves do novo núcleo: construções de sensor, pulsos perceptivos de infectados, ruídos ativos, células de cheiro, cadáveres pendentes e tamanho do índice de entidades. Eles são atualizados apenas quando a aba Mundo está aberta.

## Teste de stress local

Um harness sintético com 150 pessoas e 240 infectados validou índice incremental, limite de 160 ruídos, limite de 2.200 células de cheiro, colisão substep, manutenção de intenção e fila de cadáveres. Em 72.300 atualizações corporais de infectados, ocorreram 1.719 pulsos perceptivos (2,38%), em vez de uma percepção completa por update. É um teste estrutural de CPU, não um benchmark de FPS de um aparelho específico.

## Sistemas preservados

A v0.10.1 mantém o mundo físico e interiores da v0.9, intenção persistente e cérebro por evento da v0.8, combate, veículos, crafting, memória, crenças, cenas sociais, seis eixos de relacionamento, boatos, grupos emergentes, economia cognitiva, Management Key e métricas OpenRouter. A proteção de gasto continua opcional e desligada por padrão.
