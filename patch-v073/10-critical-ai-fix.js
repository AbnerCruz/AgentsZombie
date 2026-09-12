'use strict';
(()=>{
const sim=window.sim,AZ=window.AZ;if(!sim?.ai||!AZ)return;const ai=sim.ai;
const decisionFloor=650;
ai.maxConcurrent=5;
ai._decisionStarted=ai._decisionStarted||new Map();
const badBand=v=>v>82?'crítico':v>62?'alto':v>38?'moderado':v>18?'baixo':'muito baixo';
const stat=v=>v>=8?'excelente':v>=6?'forte':v>=4?'mediano':'fraco';
const healthBand=v=>v>82?'boa':v>62?'razoável':v>38?'comprometida':v>18?'grave':'crítica';
const fuelBand=v=>v<=0?'vazio':v<.18?'reserva':v<.42?'baixo':v<.68?'aproximadamente meio tanque':v<.88?'alto':'quase cheio';
const condBand=v=>v>75?'bom estado':v>45?'estado razoável':v>20?'bem danificado':'quase inutilizável';
function failureDelay(streak){return Math.min(10000,1200*Math.pow(1.7,Math.max(0,(streak||1)-1)))}
function registerFailure(a,err){
 const t=performance.now(),msg=String(err?.message||err||'Falha desconhecida');
 ai.fails=(ai.fails||0)+1;ai.lastError=msg;
 a.brain.lastError=msg;a.brain.failStreak=(a.brain.failStreak||0)+1;a.brain.lastFailureAt=t;
 const delay=failureDelay(a.brain.failStreak);a.brain.retryAfter=t+delay;a.brain.nextDecision=Math.min(Number.isFinite(a.brain.nextDecision)?a.brain.nextDecision:sim.minute,sim.minute+.25);
 try{sim.remember(a,'system',`O cérebro externo falhou nesta decisão: ${msg}`,2,['ai-error'])}catch{}
}
function clearFailure(a){a.brain.lastError='';a.brain.failStreak=0;a.brain.lastFailureAt=0;a.brain.retryAfter=0;ai.lastError=''}

ai.buildContext=function(a,trigger){
 const wounds=(a.wounds||[]).map(w=>({type:w.type,severity:w.severity>.65?'grave':w.severity>.3?'moderada':'leve',bleeding:w.bleeding>.7?'forte':w.bleeding>.25?'moderado':'baixo'}));
 const site=sim.currentSite?.(a)||sim.world.siteAt(a.x,a.y)||null;
 let currentVehicle=null;if(a.vehicleId){const v=sim.world.vehicleById(a.vehicleId);if(v)currentVehicle={id:v.id,name:v.name,status:'ocupando e controlando este veículo',fuel:fuelBand(v.fuel/Math.max(1,v.maxFuel)),condition:condBand(v.condition)}}
 const context={
  identity:{name:a.name,age:a.age,profession:a.profession,personality:a.personality,abilities:Object.fromEntries(Object.entries(a.attr||{}).map(([k,v])=>[k,stat(v)])),goal:a.brain.goal||null},
  time:sim.timeLabel(),trigger,
  location:site?{status:'no local',site:{id:site.id,name:site.name,type:site.type}}:{status:'fora de uma construção'},
  body:{health:healthBand(a.health),hunger:badBand(a.hunger),thirst:badBand(a.thirst),fatigue:badBand(100-a.energy),stress:badBand(a.stress),pain:badBand(a.pain),bleeding:badBand(Math.min(100,a.bleeding*18)),wounds},
  inventory:(a.inventory||[]).map(i=>({id:i.id,name:i.name,kind:i.kind,qty:i.qty})),equipped:a.equippedWeapon||null,current_vehicle:currentVehicle,
  current_action:a.action?{tool:a.action.tool,reason:a.action.args?.reason||'',progress:a.action.duration?Math.min(1,(sim.minute-a.action.started)/a.action.duration):null}:null,
  sensors:sim.sense(a),social:sim.socialContext(a),crafting:{recipes:sim.knownCraftingRecipes(a)},memories:this.memoryContext(a)
 };
 if(typeof sim.combatSummary==='function')context.combat=sim.combatSummary(a,true);
 return context;
};

ai.request=async function(job){
 const a=job.agent,model=job.deep?this.deepModel:this.lightModel;
 const sys=`Você é o cérebro individual de ${a.name}. Você controla apenas esta pessoa.\nConhecimento permitido: somente sensores atuais, memórias, falas ouvidas e experiências pessoais fornecidas no contexto.\nNÃO use conhecimento de gênero, roteiro, código ou bastidores. Não chame uma figura de "zumbi", "infectado", "mutante" ou um fenômeno de "radiação" a menos que esse termo tenha sido explicitamente aprendido.\nEscolha UMA ferramenta que represente sua nova intenção. O corpo executa a intenção atual localmente e pode continuar agindo enquanto você reavalia uma mudança relevante. Se a nova intenção não for urgente, ela pode esperar em um único slot para ser executada depois; se for urgente, pode substituir a intenção atual. Não descreva micro-passos: escolha destino, alvo ou objetivo local e deixe a física e os sistemas do mundo resolverem a execução.\nO campo reason deve ser um pensamento curto, em português, focado apenas no motivo da nova intenção. Não repita sensores nem invente fatos.`;
 let err=null;
 for(let attempt=0;attempt<2;attempt++){
  try{
   const context=this.buildContext(a,job.trigger);
   const body={model,messages:[{role:'system',content:sys},{role:'user',content:JSON.stringify(context)}],tools:window.AZ.AGENT_TOOLS,tool_choice:'required',reasoning:{effort:job.deep?'medium':'low'}};
   const data=await this.fetchCompletion(body,a.id);this.calls=(this.calls||0)+1;if(attempt)this.fallbacks=(this.fallbacks||0)+1;this.accountUsage(data.usage,model,a);
   const msg=data.choices?.[0]?.message,tc=msg?.tool_calls?.[0];if(!tc?.function?.name)throw new Error('Modelo não retornou ferramenta.');
   let args={};try{args=JSON.parse(tc.function.arguments||'{}')}catch{throw new Error('Argumentos de ferramenta inválidos.')}
   a.brain.lastThought=String(args.reason||msg?.content||'').trim()||'Preciso escolher minha próxima intenção.';
   sim.executeAgentTool(a,tc.function.name,args,{model,deep:job.deep});
   a.brain.lastModel=model;a.brain.lastDecisionAt=sim.minute;clearFailure(a);return true;
  }catch(e){err=e;if(![408,409,429,500,502,503,504].includes(e?.status)||attempt)break;await new Promise(r=>setTimeout(r,250+Math.random()*500))}
 }
 registerFailure(a,err);return false;
};

ai.decide=function(agent,deep=false,trigger='routine'){
 if(!this.enabled||!this.apiKey||!agent.alive||agent.brain.pending)return false;
 const t=performance.now(),last=this._decisionStarted.get(agent.id)||0;if(t-last<decisionFloor)return false;
 if((this.activeBrains?.size||0)>=(this.maxConcurrent||5))return false;
 if(agent.brain.failStreak>0&&agent.brain.lastFailureAt){const minRetry=agent.brain.lastFailureAt+failureDelay(agent.brain.failStreak);if((agent.brain.retryAfter||0)<minRetry)agent.brain.retryAfter=minRetry;if(t<minRetry)return false}
 if(t<(agent.brain.retryAfter||0))return false;
 agent.brain.pending=true;agent.brain.pendingSince=t;this._decisionStarted.set(agent.id,t);this.activeBrains.add(agent.id);
 Promise.resolve().then(()=>this.request({agent,deep,trigger})).catch(e=>{registerFailure(agent,e)}).finally(()=>{agent.brain.pending=false;agent.brain.pendingSince=0;this.activeBrains.delete(agent.id);this.controllers?.delete(agent.id)});
 return true;
};

for(const p of sim.people){if(p.type!=='agent')continue;p.brain.taskQueue=[];p.brain.pending=false;p.brain.pendingSince=0;if(p.brain.failStreak&&!p.brain.lastFailureAt)p.brain.lastFailureAt=performance.now()}
setTimeout(()=>{const v=document.querySelector('.drawerHead small');if(v&&!sim._v074Ready)v.textContent='v0.7.3 · cérebro corrigido + concorrência segura'},0);
})();
