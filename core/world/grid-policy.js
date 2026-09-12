'use strict';
(()=>{
const AZ=window.AZ,W=AZ?.WorldV9;if(!AZ?.World||!W)return;
const CS=AZ.CHUNK_SIZE,C=W.CELL;
const B=Object.freeze({minCx:-5,maxCx:4,minCy:-4,maxCy:3,minX:-5*CS,maxX:5*CS,minY:-4*CS,maxY:4*CS,widthChunks:10,heightChunks:8,totalChunks:80});
W.BOUNDS=B;W.WORLD_GRID=Object.freeze({chunk:CS,cell:C,block:C*12,arterial:C*24,widthChunks:B.widthChunks,heightChunks:B.heightChunks});
const modDist=(v,s)=>Math.abs((((v+s/2)%s)+s)%s-s/2);
W.regionPlan=seed=>{
 const snap=(v,s=C*12)=>Math.round(v/s)*s;
 const settlements=[
  {id:'ashfall',name:'Ashfall',x:0,y:0,r:CS*2.35,angle:0,rank:3},
  {id:'millstone',name:'Millstone',x:snap(-2.55*CS),y:snap(1.65*CS),r:CS*1.35,angle:0,rank:2},
  {id:'briar',name:'Briar Glen',x:snap(2.45*CS),y:snap(-1.55*CS),r:CS*1.25,angle:0,rank:2}
 ];
 const plant={x:snap(3.25*CS,C*6),y:snap(-2.35*CS,C*6),r:CS*.62};
 const river={baseX:B.minX+CS*.55,amp:0,period:CS*8,phase:0};
 return{settlements,plant,river};
};
W.highwayY=()=>0;
W.riverX=world=>world.region?.river?.baseX??(B.minX+CS*.55);
W.nearestSettlement=(world,x,y)=>{let best=null,bd=Infinity;for(const s of world.region.settlements){const d=Math.hypot(x-s.x,y-s.y);if(d<bd){bd=d;best=s}}return{settlement:best,distance:bd,ratio:best?bd/best.r:Infinity}};
W.zoneAt=(world,x,y)=>{const n=W.nearestSettlement(world,x,y);if(!n.settlement)return'wilderness';const r=n.ratio;if(r<.24)return'center';if(r<.52)return'urban';if(r<1.02)return'suburb';if(r<1.75)return'rural';return'wilderness'};
W.roadInfoAt=(world,x,y)=>{
 if(x<B.minX||x>=B.maxX||y<B.minY||y>=B.maxY)return null;
 const highway=Math.abs(y);if(highway<44)return{type:'highway',width:44,cost:.64};
 if(Math.abs(x)<30)return{type:'avenue',width:30,cost:.7};
 let best=null;
 for(const s of world.region.settlements){const dx=x-s.x,dy=y-s.y,rr=Math.hypot(dx,dy);if(rr>s.r*1.05)continue;const density=rr/s.r,spacing=density<.28?C*10:density<.68?C*12:C*16,width=density<.32?27:20,dxg=modDist(dx,spacing),dyg=modDist(dy,spacing);if(dxg<width&&Math.abs(dy)<s.r){best={type:dxg<14?'avenue':'street',width,cost:.78};break}if(dyg<width&&Math.abs(dx)<s.r){best={type:dyg<14?'avenue':'street',width,cost:.78};break}
  const minX=Math.min(0,s.x)-24,maxX=Math.max(0,s.x)+24;if(Math.abs(y-s.y)<18&&x>=minX&&x<=maxX)best={type:'connector',width:18,cost:.8};
  if(Math.abs(x)<18&&y>=Math.min(0,s.y)-24&&y<=Math.max(0,s.y)+24)best={type:'connector',width:18,cost:.8};
  if(best)break;
 }
 if(best)return best;
 const cx=Math.floor(x/CS),cy=Math.floor(y/CS),zone=W.zoneAt(world,x,y);if(zone==='rural'){
  const active=AZ.rand01(world.seed,cx,cy,1911)>.58,axis=AZ.hash32(world.seed,cx,cy,1912)&1,bx=(cx+.5)*CS,by=(cy+.5)*CS;if(active){if(axis===0&&Math.abs(y-by)<14)return{type:'dirt',width:14,cost:1.03};if(axis===1&&Math.abs(x-bx)<14)return{type:'dirt',width:14,cost:1.03}}
 }
 return null;
};
W.biomeAt=(world,x,y)=>{const z=W.zoneAt(world,x,y);if(['center','urban','suburb'].includes(z))return'suburb';const river=Math.abs(x-W.riverX(world,y));if(river<150)return'marsh';const cx=Math.floor(x/(CS*2)),cy=Math.floor(y/(CS*2)),n=AZ.rand01(world.seed,cx,cy,1920);if(z==='rural')return n>.38?'farmland':'forest';return n>.74?'farmland':'forest'};
const P=AZ.World.prototype;
P.bounds=B;
P.chunkInBounds=function(cx,cy){return cx>=B.minCx&&cx<=B.maxCx&&cy>=B.minCy&&cy<=B.maxCy};
P.worldInBounds=function(x,y,margin=0){return x>=B.minX+margin&&x<B.maxX-margin&&y>=B.minY+margin&&y<B.maxY-margin};
P.clampPoint=function(x,y,margin=C*1.5){return{x:AZ.clamp(x,B.minX+margin,B.maxX-margin),y:AZ.clamp(y,B.minY+margin,B.maxY-margin)}};
P.clampCamera=function(camera,w,h){const hw=w/(2*Math.max(.18,camera.zoom)),hh=h/(2*Math.max(.18,camera.zoom)),minX=B.minX+hw,maxX=B.maxX-hw,minY=B.minY+hh,maxY=B.maxY-hh;camera.x=minX<=maxX?AZ.clamp(camera.x,minX,maxX):(B.minX+B.maxX)/2;camera.y=minY<=maxY?AZ.clamp(camera.y,minY,maxY):(B.minY+B.maxY)/2;return camera};
const oldPreview=P._preview;P._preview=function(cx,cy){if(!this.chunkInBounds(cx,cy))return null;return oldPreview.call(this,cx,cy)};
P.visibleChunks=function(camera,w,h){this.clampCamera(camera,w,h);const halfW=w/(2*camera.zoom)+CS,halfH=h/(2*camera.zoom)+CS,a=Math.max(B.minCx,AZ.chunkCoord(camera.x-halfW)),b=Math.min(B.maxCx,AZ.chunkCoord(camera.x+halfW)),c=Math.max(B.minCy,AZ.chunkCoord(camera.y-halfH)),d=Math.min(B.maxCy,AZ.chunkCoord(camera.y+halfH)),ccx=AZ.chunkCoord(camera.x),ccy=AZ.chunkCoord(camera.y),out=[];for(let cy=c;cy<=d;cy++)for(let cx=a;cx<=b;cx++){const loaded=this.peekChunk(cx,cy);if(loaded){loaded.lastUsed=performance.now();out.push(loaded);continue}const dist=Math.max(Math.abs(cx-ccx),Math.abs(cy-ccy)),detailRadius=camera.zoom<.28?1:camera.zoom<.48?2:3;if(dist<=detailRadius)this.requestChunk(cx,cy,Math.max(2,5-dist),'camera');const q=this._preview(cx,cy);if(q)out.push(q)}while(this.previewCache?.size>B.totalChunks)this.previewCache.delete(this.previewCache.keys().next().value);return out};
const oldRequest=P.requestChunk;
P.requestChunk=function(cx,cy,...rest){if(!this.chunkInBounds(cx,cy)){this.generationStats&&(this.generationStats.rejected=(this.generationStats.rejected||0)+1);return false}return oldRequest.call(this,cx,cy,...rest)};
const oldGet=P.getChunk;
P.getChunk=function(cx,cy){if(!this.chunkInBounds(cx,cy))return this._voidChunk||null;return oldGet.call(this,cx,cy)};
const BaseGridWorld=AZ.World;class WorldV12 extends BaseGridWorld{constructor(seed){super(seed);this.version=12;this.bounds=B;this.maxRenderCache=Math.min(this.maxRenderCache||48,40)}}AZ.World=WorldV12;W.World=WorldV12;
})();
