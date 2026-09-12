'use strict';
var AZ=window.AZ=window.AZ||{};
AZ.TILE=32;AZ.CHUNK_TILES=24;AZ.CHUNK_SIZE=AZ.TILE*AZ.CHUNK_TILES;
AZ.hash32=function(seed,x,y,salt=0){let h=(seed^Math.imul(x,374761393)^Math.imul(y,668265263)^Math.imul(salt,2246822519))>>>0;h=Math.imul(h^(h>>>13),1274126177)>>>0;h^=h>>>16;return h>>>0};
AZ.rand01=(seed,x,y,salt=0)=>AZ.hash32(seed,x,y,salt)/4294967295;AZ.clamp=(v,a,b)=>Math.max(a,Math.min(b,v));AZ.lerp=(a,b,t)=>a+(b-a)*t;AZ.dist2=(a,b)=>{const x=a.x-b.x,y=a.y-b.y;return x*x+y*y};AZ.chunkCoord=v=>Math.floor(v/AZ.CHUNK_SIZE);AZ.localCoord=v=>((v%AZ.CHUNK_SIZE)+AZ.CHUNK_SIZE)%AZ.CHUNK_SIZE;

const SITE_NAMES={house:'Casa',store:'Mercado',clinic:'Clínica',garage:'Oficina',warehouse:'Armazém',farm:'Fazenda',barn:'Celeiro',cabin:'Cabana',shed:'Galpão',tower:'Torre',gas_station:'Posto de gasolina',police:'Delegacia',school:'Escola',power_plant:'Usina nuclear'};
class World{
 constructor(seed){
   this.seed=seed>>>0;this.chunks=new Map();this.touched=new Map();this.maxRenderCache=90;this.worldMinute=420;this.explosionMinute=3600;
   const pcx=5+(AZ.hash32(seed,1,1,880)%4),pcy=-4+(AZ.hash32(seed,2,2,881)%3);this.plantChunk={cx:pcx,cy:pcy};this.falloutOrigin={x:(pcx+.5)*AZ.CHUNK_SIZE,y:(pcy+.5)*AZ.CHUNK_SIZE};this.wind={x:.83,y:.31};
 }
 key(cx,cy){return `${cx},${cy}`}
 biomeAtChunk(cx,cy){const n=AZ.rand01(this.seed,Math.floor(cx/2),Math.floor(cy/2),11),wet=AZ.rand01(this.seed,Math.floor(cx/3),Math.floor(cy/3),19);if(wet<.08)return'marsh';if(n<.28)return'forest';if(n>.82)return'farmland';return'suburb'}
 roadMask(cx,cy){const vertical=(Math.abs(cx)%4===0)||(AZ.rand01(this.seed,cx,0,31)<.09),horizontal=(Math.abs(cy)%4===0)||(AZ.rand01(this.seed,0,cy,37)<.09);return{vertical,horizontal}}
 getChunk(cx,cy){const k=this.key(cx,cy);let c=this.chunks.get(k);if(c){c.lastUsed=performance.now();return c}c=this.touched.get(k);if(c){c.lastUsed=performance.now();this.chunks.set(k,c);this.touched.delete(k);return c}c=this.generateChunk(cx,cy);this.chunks.set(k,c);this.prune();return c}
 intersects(a,b,pad=18){return a.x-pad<b.x+b.w&&a.x+a.w+pad>b.x&&a.y-pad<b.y+b.h&&a.y+a.h+pad>b.y}
 roadConflict(rect,roads){const cs=AZ.CHUNK_SIZE,cx=rect.x+rect.w/2,cy=rect.y+rect.h/2;if(roads.vertical&&Math.abs(cx-cs/2)<82+rect.w/2)return true;if(roads.horizontal&&Math.abs(cy-cs/2)<82+rect.h/2)return true;return false}
 generateChunk(cx,cy){
   const biome=this.biomeAtChunk(cx,cy),roads=this.roadMask(cx,cy),sites=[],vehicles=[],baseX=cx*AZ.CHUNK_SIZE,baseY=cy*AZ.CHUNK_SIZE;
   if(cx===this.plantChunk.cx&&cy===this.plantChunk.cy){
     sites.push({kind:'site',id:`${cx}:${cy}:plant`,name:'Usina Nuclear Ashfall',type:'power_plant',x:baseX+165,y:baseY+135,w:430,h:360,loot:this.defaultLoot('power_plant',cx,cy,0),integrity:100,barricade:0,claimedBy:null,fire:0,dirty:false});
   }else{
     const desired=biome==='suburb'?8:biome==='farmland'?5:biome==='forest'?3:2;
     const types=biome==='suburb'?['house','house','house','store','clinic','garage','warehouse','school','police','gas_station']:biome==='farmland'?['farm','barn','house','shed','gas_station']:['cabin','shed','tower'];
     let attempts=0;
     while(sites.length<desired&&attempts<80){
