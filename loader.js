'use strict';
(()=>{if(!document.querySelector('link[data-v04]')){const css=document.createElement('link');css.rel='stylesheet';css.href='v04.css?v=080';css.dataset.v04='1';document.head.appendChild(css)}})();
(async()=>{
 const parts=Array.from({length:32},(_,i)=>`parts/${String(i).padStart(3,'0')}.js?v=080`);
 const src=await Promise.all(parts.map((u,i)=>fetch(u,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`Falha no módulo base ${i}`);return r.text()})));
 (0,Function)(src.join(''))();
 for(const u of ['core/model.js','core/combat.js','core/ai.js']){const r=await fetch(u+'?v=080',{cache:'no-store'});if(!r.ok)throw new Error(`Falha ao carregar ${u}`);(0,Function)(await r.text())();}
 const runtimeFiles=Array.from({length:8},(_,i)=>`core/runtime/${String(i).padStart(3,'0')}.txt?v=080`);
 const runtime=await Promise.all(runtimeFiles.map(u=>fetch(u,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`Falha ao carregar ${u}`);return r.text()})));
 (0,Function)(runtime.join(''))();
 const uiFiles=Array.from({length:4},(_,i)=>`core/ui/${String(i).padStart(3,'0')}.txt?v=080`);
 const ui=await Promise.all(uiFiles.map(u=>fetch(u,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`Falha ao carregar ${u}`);return r.text()})));
 (0,Function)(ui.join(''))();
})().catch(e=>{console.error(e);document.body.innerHTML='<pre style="padding:20px;color:#f88;background:#111;white-space:pre-wrap">Falha ao iniciar v0.8: '+String(e?.stack||e?.message||e)+'</pre>'});
