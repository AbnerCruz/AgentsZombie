'use strict';
(()=>{
const sim=window.sim;if(!sim?.ai)return;const ai=sim.ai;
ai.request=async function(job){
 const a=job.agent,model=job.deep?this.deepModel:this.lightModel,context=this.buildContext(a,job.trigger);
 const sys=`Você é o cérebro individual de ${a.name}. Você controla apenas esta pessoa.
Conhecimento permitido: somente sensores atuais, memórias, falas ouvidas e experiências pessoais fornecidas no contexto.
NÃO use conhecimento de gênero, roteiro, código ou bastidores. Não chame uma figura de "zumbi", "infectado", "mutante" ou um fenômeno de "radiação" a menos que esse termo tenha sido explicitamente aprendido em uma memória ou som recebido.
Não trate ids, valores internos ou fila como fatos do mundo; são interfaces para agir.
Escolha UMA ferramenta concreta. O corpo pode já estar executando outra tarefa: nesse caso sua escolha será planejada para depois, sem interromper a ação atual.
O campo reason deve ser um pensamento curto, em português, focado apenas na próxima decisão; não reescreva todos os sensores nem repita distâncias.
Prefira agir fisicamente quando houver necessidade ou objetivo. Use wait/observe apenas quando realmente fizer sentido.`;
 const body={model,messages:[{role:'system',content:sys},{role:'user',content:JSON.stringify(context)}],tools:window.AZ.AGENT_TOOLS,tool_choice:'required',reasoning:{effort:job.deep?'medium':'low'}};
 let err=null;
 for(let attempt=0;attempt<2;attempt++){
   try{
     const data=await this.fetchCompletion(body,a.id);this.calls++;if(attempt)this.fallbacks++;this.accountUsage(data.usage,model,a);
     const msg=data.choices?.[0]?.message,tc=msg?.tool_calls?.[0];if(!tc?.function?.name)throw new Error('Modelo não retornou ferramenta.');
     let args={};try{args=JSON.parse(tc.function.arguments||'{}')}catch{throw new Error('Argumentos de ferramenta inválidos.')}
     a.brain.lastThought=String(args.reason||msg?.content||'').trim()||'Preciso escolher meu próximo passo.';
     sim.executeAgentTool(a,tc.function.name,args,{model,deep:job.deep});
     a.brain.lastModel=model;a.brain.lastDecisionAt=sim.minute;a.brain.lastError='';a.brain.failStreak=0;return;
   }catch(e){err=e;if(![408,409,429,500,502,503,504].includes(e?.status)||attempt)break;await new Promise(r=>setTimeout(r,250+Math.random()*500))}
 }
 this.fails++;a.brain.lastError=String(err?.message||err||'Falha desconhecida');a.brain.retryAfter=performance.now()+Math.min(10000,1200*Math.pow(1.7,a.brain.failStreak||0));a.brain.failStreak=(a.brain.failStreak||0)+1;a.brain.nextDecision=Math.min(a.brain.nextDecision,sim.minute+.25);sim.remember(a,'system',`O cérebro externo falhou nesta decisão: ${a.brain.lastError}`,2,['ai-error']);
};
})();
