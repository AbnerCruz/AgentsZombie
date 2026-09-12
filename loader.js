'use strict';
(()=>{if(!document.querySelector('link[data-v04]')){const css=document.createElement('link');css.rel='stylesheet';css.href='v04.css?v=061';css.dataset.v04='1';document.head.appendChild(css)}})();
(async()=>{
 const files=Array.from({length:32},(_,i)=>`parts/${String(i).padStart(3,'0')}.js?v=061`);
 const src=await Promise.all(files.map((u,i)=>fetch(u,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`Falha no módulo ${i}`);return r.text()})));
 (0,Function)(src.join(''))();
 for(const u of ['patch-v05/patch0.js','patch-v05/patch1.js','patch-v05/patch2.js','patch-v06/00-core.js','patch-v06/01-sensors.js','patch-v06/02-combat.js','patch-v06/03-ranking.js','patch-v06/04-inspector.js','patch-v06/05-metrics.js','patch-v06/06-ai.js','patch-v061/07-hotfix.js']){
   const r=await fetch(u+'?v=061',{cache:'no-store'});if(!r.ok)throw new Error(`Falha ao carregar ${u}`);(0,Function)(await r.text())();
 }
})().catch(e=>{console.error(e);document.body.innerHTML='<pre style="padding:20px;color:#f88;background:#111">Falha ao iniciar: '+String(e.message||e)+'</pre>'});
