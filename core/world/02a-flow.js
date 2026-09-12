'use strict';
(()=>{
const AZ=window.AZ,W=AZ?.WorldV9;if(!AZ?.World||!W)return;
const P=AZ.World.prototype,C=W.CELL,G=W.GRID,R=44,SIZE=R*2+1,MAX_FIELDS=128;
const baseSetCell=P.setCellWorld,baseGetChunk=P.getChunk;
const cacheFor=w=>w._flowFields||(w._flowFields=new Map());
const statsFor=w=>w._flowStats||(w._flowStats={hits:0,misses:0,evictions:0,invalidations:0});
function intersects(f,minGX,minGY,maxGX,maxGY){return f.ox<=maxGX&&f.oy<=maxGY&&f.ox+f.size-1>=minGX&&f.oy+f.size-1>=minGY}
function invalidateRect(w,minGX,minGY,maxGX,maxGY){const cache=w._flowFields;if(!cache?.size)return;const st=statsFor(w);for(const[key,f]of [...cache])if(intersects(f,minGX,minGY,maxGX,maxGY)){cache.delete(key);st.invalidations++}}
function blocked(w,gx,gy){const wx=(gx+.5)*C,wy=(gy+.5)*C,cx=AZ.chunkCoord(wx),cy=AZ.chunkCoord(wy);if(w.chunkInBounds&&!w.chunkInBounds(cx,cy))return true;if(w.peekChunk&&w.requestChunk&&!w.peekChunk(cx,cy)){w.requestChunk(cx,cy,7,'flow-field');return false}return w.isCellBlocked(gx,gy,null,true)}
P.getChunk=function(cx,cy){const had=this.peekChunk?.(cx,cy)||this.chunks?.get?.(`${cx},${cy}`)||this.touched?.get?.(`${cx},${cy}`),c=baseGetChunk.call(this,cx,cy);if(!had&&c&&!c.preview)invalidateRect(this,cx*G,cy*G,cx*G+G-1,cy*G+G-1);return c};
P.setCellWorld=function(x,y,code){const before=this.cellAtWorld(x,y),old=before.code,r=baseSetCell.call(this,x,y,code);if(old!==code)invalidateRect(this,before.gx,before.gy,before.gx,before.gy);return r};
P.openingAtCell=function(q){const c=q?.chunk;if(!c||c.preview||c.void)return null;if(!c._openingIndex){const idx=new Map();for(const s of c.sites||[])for(const o of [...(s.doors||[]),...(s.windows||[])]){const lx=Math.floor((o.x-c.cx*AZ.CHUNK_SIZE)/C),ly=Math.floor((o.y-c.cy*AZ.CHUNK_SIZE)/C);idx.set(`${lx},${ly}`,o)}c._openingIndex=idx}return c._openingIndex.get(`${q.lx},${q.ly}`)||null};
P.flowDirection=function(x,y,tx,ty){
 const tgx=Math.floor(tx/C),tgy=Math.floor(ty/C),key=`${Math.floor(tgx/8)},${Math.floor(tgy/8)}`,cache=cacheFor(this),st=statsFor(this);let f=cache.get(key);
 if(f){st.hits++;cache.delete(key);cache.set(key,f)}else{
  st.misses++;const dist=new Int16Array(SIZE*SIZE);dist.fill(-1);const ox=tgx-R,oy=tgy-R,qx=new Int16Array(SIZE*SIZE),qy=new Int16Array(SIZE*SIZE);let head=0,tail=0;dist[R*SIZE+R]=0;qx[tail]=tgx;qy[tail++]=tgy;
  while(head<tail){const gx=qx[head],gy=qy[head++],base=dist[(gy-oy)*SIZE+(gx-ox)];for(const[dX,dY]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=gx+dX,ny=gy+dY,ix=nx-ox,iy=ny-oy;if(ix<0||iy<0||ix>=SIZE||iy>=SIZE||dist[iy*SIZE+ix]>=0||blocked(this,nx,ny))continue;dist[iy*SIZE+ix]=base+1;qx[tail]=nx;qy[tail++]=ny}}
  f={ox,oy,size:SIZE,dist};cache.set(key,f);while(cache.size>MAX_FIELDS){cache.delete(cache.keys().next().value);st.evictions++}
 }
 const gx=Math.floor(x/C),gy=Math.floor(y/C),ix=gx-f.ox,iy=gy-f.oy;if(ix<0||iy<0||ix>=f.size||iy>=f.size)return{x:tx-x,y:ty-y};const cur=f.dist[iy*f.size+ix];let best={d:cur,x:0,y:0};for(const[dX,dY]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){const nx=ix+dX,ny=iy+dY;if(nx<0||ny<0||nx>=f.size||ny>=f.size)continue;const d=f.dist[ny*f.size+nx];if(d>=0&&(best.d<0||d<best.d))best={d,x:dX,y:dY}}return{x:best.x,y:best.y}
};
})();
