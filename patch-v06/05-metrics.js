'use strict';
(()=>{
const sim=window.sim,$=id=>document.getElementById(id);if(!sim?.ai)return;const ai=sim.ai;
const btn=$('refreshAiMetrics');if(btn){const row=btn.parentElement;btn.remove();if(row)row.style.gridTemplateColumns='1fr'}
const status=$('aiMetricsStatus');if(status)status.textContent='sincronização automática';
let busy=false;async function sync(){if(busy||(!ai.apiKey&&!ai.managementKey))return;busy=true;if(status)status.textContent='sincronizando automaticamente...';try{const r=await ai.refreshAccountMetrics();if(status)status.textContent=r.error?`erro de sincronização: ${r.error}`:`automático · ${new Date(r.lastSync).toLocaleTimeString()}`}finally{busy=false}}
setTimeout(sync,1800);setInterval(sync,45000);document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()-(ai.account?.lastSync||0)>30000)sync()});
const oldSave=$('saveKey')?.onclick;if($('saveKey'))$('saveKey').onclick=async e=>{if(oldSave)await oldSave.call($('saveKey'),e);setTimeout(sync,50)};
})();
