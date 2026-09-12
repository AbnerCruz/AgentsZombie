     body:{health:Math.round(a.health),hunger:Math.round(a.hunger),thirst:Math.round(a.thirst),energy:Math.round(a.energy),mood:Math.round(a.mood),stress:Math.round(a.stress),radiation:+a.radiation.toFixed(2),infection:+a.infection.toFixed(2),pain:Math.round(a.pain),bleeding:+a.bleeding.toFixed(1),wounds:a.wounds.map(w=>({type:w.type,severity:+w.severity.toFixed(2),infected:w.infected})),encumbrance:+this.sim.inventoryWeight(a).toFixed(1)},
     inventory:a.inventory.map(i=>({id:i.id,name:i.name,kind:i.kind,qty:i.qty})),equipped:a.equippedWeapon||null,
     vehicle:a.vehicleId?this.sim.vehicleSummary(this.sim.entityById(a.vehicleId)):null,
     current_action:a.action?{tool:a.action.tool,args:a.action.args,progress:+(a.action.progress||0).toFixed(2)}:null,
     perceived:this.sim.sense(a),social:this.sim.socialContext(a),memories:this.memoryContext(a)
   };
 }
 async request(job){
   const a=job.agent,model=job.deep?this.deepModel:this.lightModel,context=this.buildContext(a,job.trigger);
   const sys=`Você é o cérebro individual de ${a.name}, uma pessoa vivendo um colapso social que começou hoje. Você não é narrador nem diretor do mundo e não recebe conhecimento de gênero, roteiro ou bastidores. Só conhece o que este indivíduo percebe pelos sensores, viveu, ouviu de outros e guardou em memória. Não presuma que uma criatura, doença ou fenômeno seja algo que ${a.name} ainda não compreendeu: interprete organicamente as evidências disponíveis. Outros humanos podem usar arquiteturas internas diferentes, mas isso não existe dentro do mundo. Escolha UMA ferramenta concreta. Não presuma resultados: física, combate, ferimentos, relações, itens e mundo resolvem as consequências. O campo reason deve conter um pensamento curto em primeira pessoa, adequado à personalidade e ao conhecimento real deste indivíduo. Não existe obrigação de formar grupos, cooperar, construir, lutar ou sobreviver.`;
   const body={model,messages:[{role:'system',content:sys},{role:'user',content:JSON.stringify(context)}],tools:AZ.AGENT_TOOLS,tool_choice:'required'};
   if(job.deep)body.reasoning={effort:'medium'};
   try{
     const res=await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',headers:{'Authorization':`Bearer ${this.apiKey}`,'Content-Type':'application/json','HTTP-Referer':location.origin+location.pathname,'X-Title':'Ashfall County'},body:JSON.stringify(body)});
     if(!res.ok)throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
     const data=await res.json();this.calls++;this.tokens+=(data.usage?.total_tokens||0);
     const msg=data.choices?.[0]?.message,tc=msg?.tool_calls?.[0];if(!tc?.function?.name)throw new Error('Modelo não retornou ferramenta.');
     let args={};try{args=JSON.parse(tc.function.arguments||'{}')}catch{throw new Error('Argumentos de ferramenta inválidos.');}
     a.brain.lastThought=String(args.reason||msg?.content||'').trim()||'Preciso decidir meu próximo passo.';
     this.sim.remember(a,'thought',a.brain.lastThought,5,['thought','decision']);
     this.sim.executeAgentTool(a,tc.function.name,args,{model,deep:job.deep});
