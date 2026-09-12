# Ashfall County v0.3

Simulação observacional de apocalipse zumbi + radioativo, mobile-first e sem jogador controlável.

## Arquitetura atual

- 30 agentes com cérebro individual via OpenRouter.
- NPCs sistêmicos e zumbis não consomem API.
- Cada agente possui identidade, atributos, estado físico, inventário, relações, memória completa local e objetivos próprios.
- Agentes recebem sensores/contexto e escolhem uma ferramenta; o simulador resolve apenas a consequência física da tentativa.
- Não existe regra obrigatória para formar grupos, construir abrigo, procurar alguém ou cooperar.
- `google/gemma-4-26b-a4b-it:free` é o padrão para decisões leves e diálogos.
- `openai/gpt-oss-20b` é o padrão para decisões complexas acionadas por situações críticas/novas.
- Sem `max_tokens` e sem corte por caracteres nas respostas. A memória integral permanece local; apenas memórias relevantes são recuperadas para cada decisão para eficiência de contexto.
- Mundo logicamente infinito, gerado por chunks determinísticos conforme exploração.
- Sobrevivência: saúde, fome, sede, energia, humor, estresse, dor, radiação, infecção, peso carregado, itens, saque, crafting e construção.
- Mundo começa sempre no Dia 1 às 07:00 sob condições iniciais de caos; resultados não são roteirizados.
- Otimizações: spatial grid, chunks sob demanda, cache limitado, render culling, IA assíncrona com concorrência limitada e NPCs sem LLM.

## Segurança da chave

GitHub Pages é hospedagem estática. A chave OpenRouter é armazenada no `localStorage` do navegador e enviada diretamente do navegador ao OpenRouter. Não existe backend neste projeto capaz de ocultar a chave do próprio cliente.
