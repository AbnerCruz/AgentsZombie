# Ashfall County v0.9

Simulação observacional mobile-first de colapso social, mortos-vivos e desastre radiológico. Não existe personagem do jogador: o observador acompanha um mundo autônomo.

## v0.9 — mundo físico

A v0.9 implementa o substrato espacial que faltava ao simulador.

- grade de ocupação determinística de 16 px, 48×48 células por chunk;
- colisão real com paredes, portas, janelas, móveis, cercas, água e escombros;
- movimento com deslizamento e recuperação por repath, não cancelamento arbitrário;
- A* local por evento e rota grosseira por chunks/estradas para longa distância;
- evitação local entre pessoas;
- campo de fluxo compartilhado para deslocamento de hordas;
- geografia top-down: Ashfall, dois povoados, rodovia, conectores, avenidas, ruas finitas e estradas rurais;
- gradiente centro → urbano → subúrbio → rural → mata;
- lotes nascem junto à rua e as construções ficam orientadas para a via mais próxima;
- plantas baixas procedurais com cômodos, paredes internas, portas e janelas;
- portas trancadas, barricadas e destruição transformam a própria grade;
- prédios deixam de possuir um “saco de loot”: os itens ficam em recipientes dentro dos cômodos;
- recipientes podem estar trancados, exigem tempo para revista e o estoque nunca renasce;
- escassez inicial é maior perto do núcleo urbano e menor em locais remotos;
- peso e volume limitam transporte e afetam velocidade/ruído;
- comida possui perecibilidade e alimento estragado pode causar doença comum;
- som atravessa a grade e perde intensidade em paredes/portas/janelas;
- tiros, motores, passos, arrombamento, construção e busca alimentam o mesmo sistema acústico;
- noite reduz percepção; fadiga, dor e estresse também degradam sensores;
- rastros recentes formam um gradiente barato para perseguição de infectados;
- veículos privilegiam estrada e colidem com o mundo físico;
- combate herda linha de tiro/oclusão real da grade; gargalos passam a emergir fisicamente em portas e corredores;
- zumbis pressionam e danificam barreiras quando bloqueados;
- construção pode alterar a ocupação (parede, armadilha, barricada específica);
- clima diário e luz ambiente são determinísticos pela seed;
- inspeção mostra cômodos, recipientes, portas e janelas sem quebrar o loop do canvas.

## Cognição v0.8 preservada

- 30 agentes LLM individuais;
- intenção persistente e um único slot de próxima intenção;
- corpo continua agindo sem rede;
- replanejamento por evento, não heartbeat de ociosidade;
- reflexo e rotina sem tokens; plano com modelo leve; reflexão de identidade profunda;
- crenças com fonte/confiança, mapa mental, relações multidimensionais, consolidação de memória e ciclo corporal;
- OpenRouter com Management Key e métricas automáticas, sem teto interno de créditos.

## Compatibilidade

A geração v0.9 invalida semanticamente seeds antigas: a mesma seed agora produz outra geografia porque o algoritmo do mundo foi substituído. O mundo continua infinito e determinístico a partir da seed atual.
