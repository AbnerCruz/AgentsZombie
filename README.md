# Ashfall County v0.4

Simulação observacional mobile-first de apocalipse zumbi e, a partir do Dia 3, radioativo. Não existe personagem do jogador.

## Núcleo

- 30 agentes com cérebros individuais via OpenRouter, sem fila global de decisões.
- NPCs, militares e zumbis usam simulação sistêmica local e não consomem API.
- Cada agente possui pensamento atual inspecionável, memória persistente, objetivo, relações positivas e negativas, atributos, habilidades treináveis, ferimentos, inventário e estado físico/mental.
- Agentes recebem sensores e ferramentas; o simulador resolve consequências, não escolhe estratégia por eles.
- Mundo logicamente infinito e procedural por chunks determinísticos, com geração de construções sem sobreposição.
- Construções e veículos podem ser inspecionados no mapa.

## Sobrevivência e combate

- saúde, fome, sede, energia, humor, estresse, dor, sangramento, infecção e radiação;
- mordida = 100% de contaminação, corte = 75%, arranhão = 50%;
- cadáveres humanos reanimam; NPCs mortos alimentam a população zumbi;
- armas brancas, facas, armas de fogo, munição, precisão, alcance, stamina e estilos de ataque;
- habilidades evoluem por prática: combate, lâminas, contundentes, lanças, tiro, carpintaria, mecânica, primeiros socorros, furtividade, coleta, direção, corrida e social;
- saque, crafting, construção, barricadas, veículos, combustível e atropelamentos.

## Linha do mundo

A simulação sempre começa no Dia 1 às 07:00 durante o grande caos social. O Exército entra na região nas primeiras horas, cria bloqueios e tenta conter o surto. No Dia 3 ocorre a explosão da usina nuclear procedural do mapa; antes desse evento, a radiação ambiental é zero. Depois da explosão, vento e distância passam a determinar a pluma radioativa.

## OpenRouter

- Modelo leve padrão: `google/gemma-4-26b-a4b-it:free`
- Modelo complexo padrão: `openai/gpt-oss-20b`
- Sem `max_tokens` artificial e sem truncamento deliberado de input/output.
- A chave fica no `localStorage` do próprio dispositivo e é enviada diretamente ao OpenRouter. GitHub Pages não possui backend para escondê-la do navegador.

- Conhecimento experiencial de zumbis: cada humano começa sem ter testemunhado um; NPCs não usam respostas específicas até uma primeira exposição inequívoca, enquanto agentes de IA interpretam o primeiro contato organicamente a partir de sensores e memória.
