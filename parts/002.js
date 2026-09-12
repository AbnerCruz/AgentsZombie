   if(['garage','shed','barn'].includes(type)){push('wood','Madeira','material',q(210,2,8),1.5);push('metal','Metal','material',q(211,1,6),1.8);push('toolkit','Ferramentas','tool',q(212,0,2),2);push('gasoline','Galão de gasolina','fuel',q(232,1,4),3);if(q(233,0,3)>1)push('crowbar','Pé-de-cabra','weapon',1,1.8)}
   if(type==='warehouse'){push('wood','Madeira','material',q(213,5,14),1.5);push('metal','Metal','material',q(214,4,12),1.8);push('food','Alimento','food',q(215,1,8),.6);if(q(234,0,3)===3)push('axe','Machado','weapon',1,2.1)}
   if(type==='gas_station'){push('gasoline','Galão de gasolina','fuel',q(235,4,12),3);push('water','Água','drink',q(236,1,5));push('food','Alimento','food',q(237,1,5),.6)}
   if(type==='police'){push('baton','Cassetete','weapon',q(238,1,3),.8);push('bandage','Curativo','medical',q(239,1,4),.2);push('pistol','Pistola','weapon',q(243,0,2),1);push('ammo_9mm','Munição 9mm','ammo',q(244,4,24),.02)}
   if(type==='power_plant'){push('antirad','Quelante','medical',q(240,3,8),.2);push('toolkit','Ferramentas','tool',q(241,2,4),2);push('gasoline','Galão de gasolina','fuel',q(242,1,4),3)}
   return a;
 }
 radiationAt(x,y,minute=this.worldMinute){
   if(minute<this.explosionMinute)return 0;
   const dx=x-this.falloutOrigin.x,dy=y-this.falloutOrigin.y,along=dx*this.wind.x+dy*this.wind.y,cross=Math.abs(dx*this.wind.y-dy*this.wind.x);
   const plume=along>-420?Math.exp(-cross/760)*Math.exp(-Math.max(0,along)/9300):0,near=Math.max(0,1-Math.hypot(dx,dy)/1500),age=Math.max(0,(minute-this.explosionMinute)/1440),decay=Math.exp(-age*.035);
   return AZ.clamp((plume*1.2+near*1.6)*decay,0,2.2);
 }
 terrainAt(x,y){const cx=AZ.chunkCoord(x),cy=AZ.chunkCoord(y),c=this.getChunk(cx,cy),lx=AZ.localCoord(x),ly=AZ.localCoord(y);if(c.roads.vertical&&Math.abs(lx-AZ.CHUNK_SIZE/2)<46)return'road';if(c.roads.horizontal&&Math.abs(ly-AZ.CHUNK_SIZE/2)<46)return'road';return c.biome}
 nearbySites(x,y,radius=500){const out=[],r2=radius*radius,ccx=AZ.chunkCoord(x),ccy=AZ.chunkCoord(y),cr=Math.ceil(radius/AZ.CHUNK_SIZE)+1;for(let cy=ccy-cr;cy<=ccy+cr;cy++)for(let cx=ccx-cr;cx<=ccx+cr;cx++){const c=this.getChunk(cx,cy);for(const s of c.sites){const px=s.x+s.w/2,py=s.y+s.h/2;if((px-x)**2+(py-y)**2<=r2)out.push(s)}}return out}
 nearbyVehicles(x,y,radius=500){const out=[],r2=radius*radius,ccx=AZ.chunkCoord(x),ccy=AZ.chunkCoord(y),cr=Math.ceil(radius/AZ.CHUNK_SIZE)+1;for(let cy=ccy-cr;cy<=ccy+cr;cy++)for(let cx=ccx-cr;cx<=ccx+cr;cx++){const c=this.getChunk(cx,cy);for(const v of c.vehicles)if((v.x-x)**2+(v.y-y)**2<=r2)out.push(v)}return out}
 siteAt(x,y){for(const s of this.nearbySites(x,y,120))if(x>=s.x&&x<=s.x+s.w&&y>=s.y&&y<=s.y+s.h)return s;return null}
 vehicleAt(x,y,r=32){let best=null,bd=r*r;for(const v of this.nearbyVehicles(x,y,r+20)){const d=(v.x-x)**2+(v.y-y)**2;if(d<bd){best=v;bd=d}}return best}
 vehicleById(id){const m=String(id||'').match(/^v:(-?\d+):(-?\d+):(\d+)$/);if(!m)return null;return this.getChunk(+m[1],+m[2]).vehicles.find(v=>v.id===id)||null}
