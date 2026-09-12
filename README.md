# Ashfall County v0.11 — Streaming de mundo + migração de hordas

A v0.11 continua a auditoria de performance da v0.10.1 sem reduzir a simulação. O foco desta versão é remover picos causados pela geração procedural e substituir spawn oportunista de infectados por uma população macro persistente que migra entre chunks. A população civil de fundo foi removida: o mundo começa com 20 agentes IA; militares continuam sendo entidades especiais ligadas aos eventos do cenário.

## Mudanças estruturais v0.11

- 20 agentes IA iniciais e zero NPCs civis de fundo;
- exploração de chunks não cria mais sobreviventes ou infectados automaticamente;
- chegadas diárias artificiais de civis foram removidas;
- câmera não força mais materialização completa de todos os chunks visíveis: chunks ausentes entram numa fila e usam uma prévia barata até serem gerados;
- geração real é processada com orçamento adaptativo, um chunk por vez, priorizando área ocupada, borda para onde alguém caminha, destino da intenção e interação explícita;
- sensores usam somente chunks já materializados e podem solicitar pré-geração sem bloquear o frame;
- `siteAt` consulta apenas o chunk físico correto — prédios v0.9 nunca atravessam a fronteira do chunk — removendo a antiga geração implícita de até 9 chunks por consulta;
- `chunkEdges` da navegação grosseira passa a ser calculado analiticamente pela função de estrada, sem gerar chunks inteiros durante A* de longa distância;
- portas/janelas têm índice por célula dentro do chunk, evitando varredura de todos os prédios durante pathfinding;
- o renderer desenha previews baratos para chunks ainda na fila e nunca precisa gerar terreno só porque a câmera passou por uma região;
- seleção de um chunk ainda não materializado solicita geração prioritária em vez de travar o canvas;
- iluminação noturna faz culling das fontes antes de criar gradientes;
- removida uma varredura global redundante de todos os infectados durante direção de veículos;
- infectados agora possuem população macro por chunk, com conservação entre estado latente e entidade ativa;
- migração redistribui hordas por pressão de ruído, presença humana, capacidade local e continuidade viária;
- infectados longe de qualquer humano voltam ao estado latente em vez de consumir CPU;
- regiões próximas a humanos materializam gradualmente a população latente, com teto de entidades ativas;
- mortes reduzem a população real; reanimações adicionam novos indivíduos ao sistema, sem respawn mágico;
- a aba Mundo mostra fila de geração, custo médio/pico de chunk, infectados ativos/latentes e migrações acumuladas.

## Regra de compatibilidade

A geografia determinística e os interiores continuam usando a seed v0.9. A v0.11 muda **quando** chunks são materializados, não **o que** uma seed gera. A migração de infectados é nova e substitui o antigo spawn por exploração, portanto a distribuição dinâmica de hordas muda a partir desta versão.

---

## Base preservada: v0.10.1 — Performance estrutural + estabilidade

A v0.10.1 é uma auditoria de fonte sobre a v0.10. Não reduz a profundidade da simulação e não substitui sistemas por atalhos visuais: remove trabalho repetido que estava sendo executado na frequência errada, corrige mutações causadas por consultas e fecha falhas de integração entre o mundo físico v0.9, sociedade v0.10 e UI.

## Causas-raiz corrigidas

- o spatial hash de pessoas e infectados não é mais apagado e reconstruído inteiro em todo frame; os buckets são atualizados incrementalmente somente quando uma entidade troca de célula;
- percepção de infectados não executa mais busca humana + todos os ruídos + raycast acústico + grade de cheiro em cada frame. O corpo continua se movendo por frame, mas a percepção é pulsada e escalonada por indivíduo;
- ruídos agora possuem índice espacial. Um infectado ou agente consulta eventos locais e só calcula transmissão física para os candidatos relevantes;
- o mapa de cheiro é realmente limitado e não varre milhares de entradas a cada depósito após atingir o limite;
- os agentes deixam de executar dois pipelines de sensores concorrentes. Há um único pulso espacial; o ciclo corporal só monitora limiares e mantém a intenção;
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
