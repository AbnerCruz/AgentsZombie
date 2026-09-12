'use strict';
(()=>{
const AZ=window.AZ,W=AZ?.WorldV9;if(!W||!AZ.Simulation)return;const BaseSim=AZ.Simulation;
class SimulationV9 extends BaseSim{
 spawnPopulation(){return super.spawnPopulation(20,0)}
 populateExploredChunks(){/* v0.11: população não nasce ao explorar chunks; infectados usam migração macro. */}
 spawnInitialCrisis(){const candidates=[...this.people].sort(()=>this.rng.next()-.5);for(const p of candidates.slice(0,1)){p.wounds.push({type:'mordida antiga',severity:this.rng.range(.25,.55),infected:true,bleeding:.3});p.infection=this.rng.range(.08,.22);p.stress+=12;this.remember(p,'body','Uma ferida recente parece estar piorando rapidamente.',8,['illness','wound'])}for(let i=0;i<22;i++){const a=this.rng.range(0,Math.PI*2),r=this.rng.range(260,AZ.CHUNK_SIZE*2.2);this.zombies.push(this.makeZombie(Math.cos(a)*r,Math.sin(a)*r,null))}}
 findSpawnPoint(range=AZ.CHUNK_SIZE*1.7,salt=1){for(let k=0;k<42;k++){const a=this.rng.range(0,Math.PI*2),r=this.rng.range(70,range),x=Math.cos(a)*r,y=Math.sin(a)*r,q=this.world.cellAtWorld(x,y);if(!this.world.isCellBlocked(q.gx,q.gy,null,true)&&q.code!==W.OCC.WATER&&!this.world.siteAt(x,y))return{x:q.x,y:q.y}}const q=this.world.nearestWalkable(this.rng.range(-range,range),this.rng.range(-range,range));return q}
 makeZombie(x,y,source){const q=this.world?.nearestWalkable?this.world.nearestWalkable(x,y,null,9):{x,y};return super.makeZombie(q.x,q.y,source)}
 deployMilitary(count,text){const before=this.structures.length;super.deployMilitary(count,text);for(const s of this.structures.slice(before)){if(!s.kind)s.kind='structure';if(s.type==='checkpoint'){const q=this.world.nearestWalkable(s.x,s.y,null,6);s.x=q.x;s.y=q.y}}}
}
AZ.Simulation=SimulationV9;
})();
