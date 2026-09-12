'use strict';
(()=>{const css=document.createElement('link');css.rel='stylesheet';css.href='v04.css';document.head.appendChild(css)})();
(async()=>{const n=32;const files=Array.from({length:n},(_,i)=>`parts/${String(i).padStart(3,'0')}.js`);const p=await Promise.all(files.map((u,i)=>fetch(u,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`Falha no módulo ${i}`);return r.text()})));(0,Function)(p.join(''))();})().catch(e=>{console.error(e);document.body.innerHTML='<pre style="padding:20px;color:#f88;background:#111">Falha ao iniciar: '+String(e.message||e)+'</pre>'});
