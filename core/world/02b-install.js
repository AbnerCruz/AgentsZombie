'use strict';
(()=>{
const AZ=window.AZ,W=AZ?.WorldV9;if(!W||!AZ.Simulation)return;const BaseSim=AZ.Simulation;
class SimulationV9 extends BaseSim{
 findSpawnPoint(range=AZ.CHUNK_SIZE*1.7,salt=1){for(let k=0;k<42;k++){const a=this.rng.range(0,Math.PI*2),r=this.rng.range(70,range),x=Math.cos(a)*r,y=Math.sin(a)*r,q=this.world.cellAtWorld(x,y);if(!this.world.isCellBlocked(q.gx,q.gy,null,true)&&q.code!==W.OCC.WATER&&!this.world.siteAt(x,y))return{x:q.x,y:q.y}}const q=this.world.nearestWalkable(this.rng.range(-range,range),this.rng.range(-range,range));return q}
 makeZombie(x,y,source){const q=this.world?.nearestWalkable?this.world.nearestWalkable(x,y,null,9):{x,y};return super.makeZombie(q.x,q.y,source)}
 deployMilitary(count,text){const before=this.structures.length;super.deployMilitary(count,text);for(const s of this.structures.slice(before)){if(!s.kind)s.kind='structure';if(s.type==='checkpoint'){const q=this.world.nearestWalkable(s.x,s.y,null,6);s.x=q.x;s.y=q.y}}}
}
AZ.Simulation=SimulationV9;
})();
