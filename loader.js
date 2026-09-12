'use strict';
(()=>{if(!document.querySelector('link[data-v04]')){const css=document.createElement('link');css.rel='stylesheet';css.href='v04.css?v=120';css.dataset.v04='1';document.head.appendChild(css)}})();
(async()=>{
 const loadText=async u=>{const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error(`Falha ao carregar ${u}`);return r.text()};
 window.__azSimTimers=[];
 const evalCode=(code,name,simTimers=false)=>{const prefix=simTimers?`const setInterval=(fn,ms)=>{const period=Math.max(.25,Number(ms||0)/400),s=window.sim,t={fn,period,next:(s?.minute||0)+period,name:${JSON.stringify(name)}};(window.__azSimTimers||(window.__azSimTimers=[])).push(t);return window.__azSimTimers.length;};const clearInterval=()=>{};\n`:'';return(0,Function)(prefix+code+`\n//# sourceURL=${name}`)()};
 window.__azRunSimTimers=()=>{const s=window.sim;if(!s||s.paused)return;for(const t of window.__azSimTimers||[]){if(s.minute+1e-9<t.next)continue;t.next=s.minute+t.period;try{t.fn()}catch(e){console.error(`Timer simulado ${t.name}`,e)}}};
 const partFiles=Array.from({length:32},(_,i)=>`parts/${String(i).padStart(3,'0')}.js?v=120`);
 const streamingFiles=Array.from({length:7},(_,i)=>`core/world/streaming/${String(i).padStart(3,'0')}.txt?v=120`);
 const [parts,worldBase,streamingParts,gridPolicy]=await Promise.all([
  Promise.all(partFiles.map(loadText)),
  Promise.all(['core/world/00-schema.js','core/world/01-generation.js','core/world/02-navigation.js','core/world/02a-flow.js','core/world/02b-install.js'].map(u=>loadText(u+'?v=120'))),
  Promise.all(streamingFiles.map(loadText)),
  loadText('core/world/grid-policy.js?v=120')
 ]);
 const preWorld=[worldBase[0],worldBase[1],worldBase[2],streamingParts.join(''),gridPolicy,worldBase[3],worldBase[4]];let base=parts.join(''),mark='AZ.Renderer=Renderer;',at=base.indexOf(mark);if(at<0)throw new Error('Ponto de instalação do mundo não encontrado no bundle base.');at+=mark.length;base=base.slice(0,at)+'\n'+preWorld.join('\n')+'\n'+base.slice(at);evalCode(base,'bundle/base-v012.js');
 const bootPaused=window.sim.paused;window.sim.paused=true;
 for(const u of ['core/model.js','core/combat.js','core/ai.js'])evalCode(await loadText(u+'?v=120'),u);
 const runtimeFiles=Array.from({length:8},(_,i)=>`core/runtime/${String(i).padStart(3,'0')}.txt?v=120`);evalCode((await Promise.all(runtimeFiles.map(loadText))).join(''),'bundle/runtime-v012.js',true);
 const worldRuntimeFiles=Array.from({length:8},(_,i)=>`core/world/runtime/${String(i).padStart(3,'0')}.txt?v=120`);evalCode((await Promise.all(worldRuntimeFiles.map(loadText))).join(''),'bundle/world-runtime-v012.js');
 const socialFiles=Array.from({length:8},(_,i)=>`core/social/${String(i).padStart(3,'0')}.txt?v=120`);evalCode((await Promise.all(socialFiles.map(loadText))).join(''),'bundle/social-v012.js',true);
 const economyFiles=Array.from({length:10},(_,i)=>`core/economy/${String(i).padStart(3,'0')}.txt?v=120`);evalCode((await Promise.all(economyFiles.map(loadText))).join(''),'bundle/economy-v012.js',true);
 const performanceFiles=Array.from({length:8},(_,i)=>`core/performance/${String(i).padStart(3,'0')}.txt?v=120`);evalCode((await Promise.all(performanceFiles.map(loadText))).join(''),'bundle/performance-v012.js');
 for(const u of ['core/migration.js','core/zombie-runtime.js','core/agent-policy.js','core/world/04-render.js'])evalCode(await loadText(u+'?v=120'),u);
 const uiFiles=Array.from({length:4},(_,i)=>`core/ui/${String(i).padStart(3,'0')}.txt?v=120`);evalCode((await Promise.all(uiFiles.map(loadText))).join(''),'bundle/ui-v012.js');
 for(const u of ['core/world/05-ui.js','core/social-ui.js','core/performance-ui.js'])evalCode(await loadText(u+'?v=120'),u);
 window.sim.paused=bootPaused;
})().catch(e=>{console.error(e);document.body.innerHTML='<pre style="padding:20px;color:#f88;background:#111;white-space:pre-wrap">Falha ao iniciar v0.12: '+String(e?.stack||e?.message||e)+'</pre>'});
