'use strict';
(()=>{
const sim=window.sim,ai=sim?.ai;if(!ai)return;
ai.maxConcurrent=5;
const retryDelay=streak=>Math.min(10000,1200*Math.pow(1.7,Math.max(0,(streak||1)-1)));
function restoreBackoff(){const t=performance.now();for(const p of sim.people||[]){if(p?.type!=='agent'||!p.brain)continue;const b=p.brain;if((b.failStreak||0)>0&&b.lastFailureAt){const floor=b.lastFailureAt+retryDelay(b.failStreak);if((b.retryAfter||0)<floor)b.retryAfter=floor;if(t<floor&&b.pending===false)b.nextDecision=Math.max(Number.isFinite(b.nextDecision)?b.nextDecision:sim.minute,sim.minute+.25)}}}
restoreBackoff();setInterval(restoreBackoff,500);
try{const a=(sim.people||[]).find(p=>p.type==='agent'&&p.alive);if(a)ai.buildContext(a,'boot_self_test');ai.health={ok:true,version:'0.7.3',checkedAt:Date.now()}}catch(e){const msg=String(e?.message||e||'Falha no contexto de IA');ai.health={ok:false,version:'0.7.3',checkedAt:Date.now(),error:msg};ai.lastError=msg;ai.fails=(ai.fails||0)+1;console.error('AI self-test failed',e)}
})();
