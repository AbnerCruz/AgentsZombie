'use strict';
(()=>{
const sim=window.sim,AZ=window.AZ;if(!sim?.ai||!AZ)return;
const MOVING=new Set(['move','go_to','flee','npc_seek','npc_wander','npc_flee','reflex_flee','npc_startled_retreat','npc_cautious_approach','enter_vehicle','refuel_vehicle','drive_vehicle']);
const ensure=p=>{p.brain.taskQueue=p.brain.taskQueue||[];p.brain.liveness=p.brain.liveness||{x:p.x,y:p.y,minute:sim.minute,lastProgress:sim.minute,lastWake:sim.minute,recoveries:0};return p.brain.liveness};
for(const p of sim.people)if(p.type==='agent')ensure(p);
const oldUpdatePerson=sim.updatePerson.bind(sim),oldAdvance=sim.advanceAction.bind(sim);
function usefulAction(p){const a=p.action;if(!a)return false;if(MOVING.has(a.tool)||a.args?._phase==='approach')return true;return ['attack','craft_v06','craft','build','aid','rest','wait','observe','unlock_vehicle_v061'].includes(a.tool)}
function expectedMotion(p){const a=p.action;if(!a)return false;if(a.tool==='drive_vehicle')return !!p.vehicleId;if(a.args?._phase==='approach')return true;return MOVING.has(a.tool)&&!['enter_vehicle','refuel_vehicle'].includes(a.tool)}
function dropCurrentDuplicate(p){const a=p.action;if(!a||!sim.taskSignature)return;const sig=sim.taskSignature(a.tool,a.args||{});p.brain.taskQueue=(p.brain.taskQueue||[]).filter(t=>sim.taskSignature(t.tool,t.args||{})!==sig)}
sim.recoverAgentLiveness=function(p,why='estado travado'){
 const l=ensure(p);if(p.brain.pending&&p.brain.pendingSince&&performance.now()-p.brain.pendingSince>20000){this.ai.controllers?.get(p.id)?.abort();p.brain.pending=false;p.brain.pendingSince=0}
 dropCurrentDuplicate(p);p.action=null;p.target=null;p.brain.taskQueue=(p.brain.taskQueue||[]).filter(t=>!this.taskStillUseful||this.taskStillUseful(p,t.tool,t.args||{}));p.brain.nextDecision=Math.min(Number.isFinite(p.brain.nextDecision)?p.brain.nextDecision:this.minute,this.minute+.05);p.brain.retryAfter=Math.min(p.brain.retryAfter||0,performance.now()+250);p.brain.novelty=Math.max(1,p.brain.novelty||0);l.x=p.x;l.y=p.y;l.minute=this.minute;l.lastProgress=this.minute;l.lastWake=this.minute;l.recoveries++;p.brain.lastRecovery=why;
};
sim.advanceAction=function(p,dt){
 const l=p.type==='agent'?ensure(p):null,ox=p.x,oy=p.y,ov=p.vehicleId&&this.world.vehicleById(p.vehicleId),ovx=ov?.x,ovy=ov?.y,a=p.action;
 oldAdvance(p,dt);
 if(!l)return;
 const nv=p.vehicleId&&this.world.vehicleById(p.vehicleId),moved=Math.hypot(p.x-ox,p.y-oy)>0.04||(nv&&ov&&Math.hypot(nv.x-(ovx??nv.x),nv.y-(ovy??nv.y))>0.04);
 if(moved){l.x=p.x;l.y=p.y;l.lastProgress=this.minute;return}
 if(a&&expectedMotion(p)&&this.minute-l.lastProgress>1.25){this.recoverAgentLiveness(p,`sem progresso em ${a.tool}`)}
};
sim.dispatchNextTask=function(p){
 p.brain.taskQueue=p.brain.taskQueue||[];
 while(!p.action&&p.brain.taskQueue.length){const t=p.brain.taskQueue.shift();if(this.taskStillUseful&&!this.taskStillUseful(p,t.tool,t.args||{}))continue;this.executeAgentTool(p,t.tool,t.args,{model:t.model,fromQueue:true});if(p.action||p.vehicleId||t.tool==='consume'||t.tool==='equip'||t.tool==='set_goal')return true}
 return false
};
sim.scheduleAgentBrain=function(p){
 if(!p.alive)return;const l=ensure(p),now=performance.now();
 if(!this.ai.enabled||!this.ai.apiKey){this.reflexFallback(p);return}
 if(p.brain.pending){if(p.brain.pendingSince&&now-p.brain.pendingSince>20000)this.ai.controllers?.get(p.id)?.abort();return}
 if(now<(p.brain.retryAfter||0))return;
 if(!p.action&&p.brain.taskQueue.length){if(this.dispatchNextTask(p)){l.lastWake=this.minute;return}}
 if(!p.action&&!p.brain.taskQueue.length&&this.minute-l.lastWake>2.2)p.brain.nextDecision=Math.min(p.brain.nextDecision||this.minute,this.minute+.05);
 if(this.minute<(p.brain.nextDecision||0))return;
 const a=p.action;
 if(a&&p.brain.taskQueue.length>=1)return;
 if(a){const elapsed=this.minute-(a.started||this.minute),ratio=elapsed/Math.max(.5,a.duration||5);if(ratio<.65)return}
 const severe=p.health<45||p.infection>.35||p.radiation>.55||p.stress>82||(p.brain.novelty||0)>5||p.wounds.some(w=>w.infected),deep=severe&&this.minute>(p.brain.complexCooldown||0);
 if(this.ai.decide(p,deep,a?'plan_ahead':'independent_cycle')){p.brain.nextDecision=this.minute+this.rng.range(4,9);l.lastWake=this.minute;if(deep)p.brain.complexCooldown=this.minute+180;p.brain.novelty=Math.max(0,(p.brain.novelty||0)-3)}
};
sim.updatePerson=function(p,dt){
 oldUpdatePerson(p,dt);if(p.type!=='agent'||!p.alive)return;const l=ensure(p);
 if(!usefulAction(p)&&!p.brain.pending&&!(p.brain.taskQueue||[]).length&&this.minute-l.lastWake>3.5){p.brain.nextDecision=Math.min(p.brain.nextDecision||this.minute,this.minute+.05);l.lastWake=this.minute-.5}
};
})();
