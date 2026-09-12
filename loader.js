'use strict';
(async()=>{
  try{
    const parts=[];
    for(let i=0;i<11;i++){
      const r=await fetch(`chunks/${String(i).padStart(2,'0')}.txt`,{cache:'no-store'});
      if(!r.ok)throw new Error(`Falha ao carregar núcleo ${i}: ${r.status}`);
      parts.push(await r.text());
    }
    new Function(parts.join(''))();
  }catch(err){
    console.error(err);
    document.body.innerHTML='<div style="padding:24px;color:#fff;background:#111;height:100vh;font-family:system-ui"><h2>Falha ao iniciar Ashfall</h2><pre style="white-space:pre-wrap">'+String(err.message||err).replace(/[&<>]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[s]))+'</pre></div>';
  }
})();
