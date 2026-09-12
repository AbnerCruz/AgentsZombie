'use strict';
(()=>{if(!document.querySelector('link[data-v04]')){const css=document.createElement('link');css.rel='stylesheet';css.href='v04.css?v=110';css.dataset.v04='1';document.head.appendChild(css)}})();
(async()=>{
 const loadText=async u=>{const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error(`Falha ao carregar ${u}`);return r.text()};
 const partFiles=Array.from({length:32},(_,i)=>`parts/${String(i).padStart(3,'0')}.js?v=110`);
 const streamingFiles=Array.from({length:8},(_,i)=>`core/world/streaming/${String(i).padStart(3,'0')}.txt?v=110`);
 const [parts,worldBase,streamingParts]=await Promise.all([
  Promise.all(partFiles.map(loadText)),
  Promise.all(['core/world/00-schema.js','core/world/01-generation.js','core/world/02-navigation.js','core/world/02b-install.js'].map(u=>loadText(u+'?v=110'))),
  Promise.all(streamingFiles.map(loadText))
 ]);
 const preWorld=[worldBase[0],worldBase[1],worldBase[2],streamingParts.join(''),worldBase[3]];let base=parts.join(''),mark='AZ.Renderer=Renderer;',at=base.indexOf(mark);if(at<0)throw new Error('Ponto de instalação do mundo não encontrado no bundle base.');at+=mark.length;base=base.slice(0,at)+'\n'+preWorld.join('\n')+'\n'+base.slice(at);(0,Function)(base)();
 for(const u of ['core/model.js','core/combat.js','core/ai.js'])(0,Function)(await loadText(u+'?v=110'))();
 const runtimeFiles=Array.from({length:8},(_,i)=>`core/runtime/${String(i).padStart(3,'0')}.txt?v=110`);
 (0,Function)((await Promise.all(runtimeFiles.map(loadText))).join(''))();
 const worldRuntimeFiles=Array.from({length:8},(_,i)=>`core/world/runtime/${String(i).padStart(3,'0')}.txt?v=110`);
 (0,Function)((await Promise.all(worldRuntimeFiles.map(loadText))).join(''))();
 const socialFiles=Array.from({length:8},(_,i)=>`core/social/${String(i).padStart(3,'0')}.txt?v=110`);
 (0,Function)((await Promise.all(socialFiles.map(loadText))).join(''))();
 const economyFiles=Array.from({length:10},(_,i)=>`core/economy/${String(i).padStart(3,'0')}.txt?v=110`);
 (0,Function)((await Promise.all(economyFiles.map(loadText))).join(''))();
 const performanceFiles=Array.from({length:8},(_,i)=>`core/performance/${String(i).padStart(3,'0')}.txt?v=110`);
 (0,Function)((await Promise.all(performanceFiles.map(loadText))).join(''))();
 const migrationFiles=Array.from({length:6},(_,i)=>`core/migration/${String(i).padStart(3,'0')}.txt?v=110`);
 (0,Function)((await Promise.all(migrationFiles.map(loadText))).join(''))();
 (0,Function)(await loadText('core/world/04-render.js?v=110'))();
 const uiFiles=Array.from({length:4},(_,i)=>`core/ui/${String(i).padStart(3,'0')}.txt?v=110`);
 (0,Function)((await Promise.all(uiFiles.map(loadText))).join(''))();
 (0,Function)(await loadText('core/world/05-ui.js?v=110'))();
 (0,Function)(await loadText('core/social-ui.js?v=110'))();
 (0,Function)(await loadText('core/performance-ui.js?v=110'))();
})().catch(e=>{console.error(e);document.body.innerHTML='<pre style="padding:20px;color:#f88;background:#111;white-space:pre-wrap">Falha ao iniciar v0.11: '+String(e?.stack||e?.message||e)+'</pre>'});
