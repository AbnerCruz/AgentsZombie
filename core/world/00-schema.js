'use strict';
(()=>{
const AZ=window.AZ;if(!AZ)return;
const W=AZ.WorldV9=AZ.WorldV9||{};
W.VERSION=9;W.CELL=16;W.GRID=AZ.CHUNK_SIZE/W.CELL;
W.OCC=Object.freeze({FREE:0,WALL:1,DOOR_CLOSED:2,DOOR_OPEN:3,WINDOW:4,FURNITURE:5,VEHICLE:6,WATER:7,DENSE:8,ROAD:9,RUBBLE:10,FENCE:11});
W.SOLID=new Set([W.OCC.WALL,W.OCC.DOOR_CLOSED,W.OCC.WINDOW,W.OCC.FURNITURE,W.OCC.VEHICLE,W.OCC.FENCE]);
W.OPAQUE=new Set([W.OCC.WALL,W.OCC.FURNITURE,W.OCC.FENCE]);
W.clamp=AZ.clamp;
W.key=(x,y)=>`${x},${y}`;
W.floorCell=v=>Math.floor(v/W.CELL);
W.cellCenter=c=>(c+.5)*W.CELL;
W.distPointSeg=(px,py,x1,y1,x2,y2)=>{const vx=x2-x1,vy=y2-y1,l2=vx*vx+vy*vy;if(!l2)return Math.hypot(px-x1,py-y1);const t=W.clamp(((px-x1)*vx+(py-y1)*vy)/l2,0,1),x=x1+vx*t,y=y1+vy*t;return Math.hypot(px-x,py-y)};
W.rotate=(x,y,a)=>({x:x*Math.cos(a)+y*Math.sin(a),y:-x*Math.sin(a)+y*Math.cos(a)});
W.seedAngle=(seed,salt)=>((AZ.hash32(seed,salt,17,901)%6283)/1000)-Math.PI;
W.regionPlan=seed=>{
 const CS=AZ.CHUNK_SIZE,j=(salt,span)=>(AZ.rand01(seed,salt,33,1701)-.5)*span;
 const settlements=[
  {id:'ashfall',name:'Ashfall',x:0,y:0,r:CS*4.35,angle:W.seedAngle(seed,11)*.16,rank:3},
  {id:'millstone',name:'Millstone',x:(-7+j(21,1.4))*CS,y:(4+j(22,1.2))*CS,r:CS*2.15,angle:W.seedAngle(seed,12)*.28,rank:2},
  {id:'briar',name:'Briar Glen',x:(6+j(31,1.5))*CS,y:(-5+j(32,1.3))*CS,r:CS*2.0,angle:W.seedAngle(seed,13)*.28,rank:2}
 ];
 const plant={x:(7+j(41,.8))*CS,y:(-4+j(42,.7))*CS,r:CS*.7};
 const river={baseX:(-5.5+j(51,1.5))*CS,amp:CS*.72,period:CS*9.5,phase:AZ.rand01(seed,52,4,1702)*Math.PI*2};
 return{settlements,plant,river};
};
W.highwayY=(world,x)=>{const CS=AZ.CHUNK_SIZE,s=world.seed;return Math.sin(x/(CS*6.8)+AZ.rand01(s,7,9,1801)*3)*CS*.42+Math.sin(x/(CS*15.5)+1.2)*CS*.26};
W.riverX=(world,y)=>{const r=world.region.river;return r.baseX+Math.sin(y/r.period+r.phase)*r.amp+Math.sin(y/(r.period*.43)+r.phase*.7)*r.amp*.18};
W.nearestSettlement=(world,x,y)=>{let best=null,bd=Infinity;for(const s of world.region.settlements){const d=Math.hypot(x-s.x,y-s.y);if(d<bd){bd=d;best=s}}return{settlement:best,distance:bd,ratio:best?bd/best.r:Infinity}};
W.zoneAt=(world,x,y)=>{const n=W.nearestSettlement(world,x,y);if(!n.settlement)return'wilderness';const r=n.ratio;if(r<.22)return'center';if(r<.48)return'urban';if(r<1.02)return'suburb';if(r<2.2)return'rural';return'wilderness'};
W.roadInfoAt=(world,x,y)=>{
 const CS=AZ.CHUNK_SIZE,hy=W.highwayY(world,x),hd=Math.abs(y-hy);if(hd<46)return{type:'highway',width:46,cost:.65};
 let best=null;
 for(const s of world.region.settlements){const dx=x-s.x,dy=y-s.y,rr=Math.hypot(dx,dy);if(rr>s.r*1.18)continue;const q=W.rotate(dx,dy,s.angle),density=rr/s.r,spacing=density<.32?176:density<.72?224:286,width=density<.33?27:20;
  if(Math.abs(q.x)<30||Math.abs(q.y)<30){const d=Math.min(Math.abs(q.x),Math.abs(q.y));if(!best||d<best.d)best={d,type:'avenue',width:30,cost:.72}}
  const ix=Math.round(q.x/spacing),iy=Math.round(q.y/spacing),dxl=Math.abs(q.x-ix*spacing),dyl=Math.abs(q.y-iy*spacing);
  const spanX=s.r*(.48+.46*AZ.rand01(world.seed,ix,iy,1901)),spanY=s.r*(.48+.46*AZ.rand01(world.seed,iy,ix,1902));
  if(dxl<width&&Math.abs(q.y)<spanY){if(!best||dxl<best.d)best={d:dxl,type:'street',width,cost:.85}}
  if(dyl<width&&Math.abs(q.x)<spanX){if(!best||dyl<best.d)best={d:dyl,type:'street',width,cost:.85}}
  const ring=s.r*(s.rank===3?.58:.52),ringD=Math.abs(rr-ring);if(ringD<22){if(!best||ringD<best.d)best={d:ringD,type:'avenue',width:22,cost:.78}}
  const hx=s.x,hy2=W.highwayY(world,hx),conn=W.distPointSeg(x,y,s.x,s.y,hx,hy2);if(conn<18&&rr<s.r*1.3){if(!best||conn<best.d)best={d:conn,type:'connector',width:18,cost:.82}}
 }
 if(best)return best;
 // Estradas rurais curtas ligando células agrícolas a uma via maior; nunca formam uma grade infinita.
 const cx=Math.floor(x/CS),cy=Math.floor(y/CS),zone=W.zoneAt(world,x,y);if(zone==='rural'){
  const active=AZ.rand01(world.seed,cx,cy,1911)>.62;if(active){const bx=(cx+.5)*CS,by=(cy+.5)*CS,ang=(AZ.hash32(world.seed,cx,cy,1912)%8)*(Math.PI/4),len=CS*.62,d=W.distPointSeg(x,y,bx-Math.cos(ang)*len,by-Math.sin(ang)*len,bx+Math.cos(ang)*len,by+Math.sin(ang)*len);if(d<14)return{type:'dirt',width:14,cost:1.05}}
 }
 return null;
};
W.biomeAt=(world,x,y)=>{const z=W.zoneAt(world,x,y);if(['center','urban','suburb'].includes(z))return'suburb';const river=Math.abs(x-W.riverX(world,y));if(river<180)return'marsh';const cx=Math.floor(x/(AZ.CHUNK_SIZE*2)),cy=Math.floor(y/(AZ.CHUNK_SIZE*2)),n=AZ.rand01(world.seed,cx,cy,1920);if(z==='rural')return n>.34?'farmland':'forest';return n>.72?'farmland':'forest'};
W.terrainCost=(code,biome='suburb')=>{if(code===W.OCC.ROAD)return.72;if(code===W.OCC.DENSE)return 2.4;if(code===W.OCC.RUBBLE)return 2.8;if(code===W.OCC.WATER)return 5.5;if(biome==='marsh')return 2.5;if(biome==='forest')return 1.45;if(biome==='farmland')return 1.15;return 1};
W.itemVolume=i=>i.volume??({drink:1,food:.7,material:1.4,weapon:1.2,medical:.25,fuel:3,ammo:.06,tool:1.5,utility:.8,gear:1.2}[i.kind]??.7);
})();
