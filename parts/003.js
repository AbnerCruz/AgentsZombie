 randomPointNear(x,y,range,seedSalt){const a=AZ.rand01(this.seed,Math.floor(x),Math.floor(y),seedSalt)*Math.PI*2,r=.25*range+AZ.rand01(this.seed,Math.floor(y),Math.floor(x),seedSalt+1)*.75*range;return{x:x+Math.cos(a)*r,y:y+Math.sin(a)*r}}
 visibleChunks(camera,w,h){const halfW=w/(2*camera.zoom)+AZ.CHUNK_SIZE,halfH=h/(2*camera.zoom)+AZ.CHUNK_SIZE,a=AZ.chunkCoord(camera.x-halfW),b=AZ.chunkCoord(camera.x+halfW),c=AZ.chunkCoord(camera.y-halfH),d=AZ.chunkCoord(camera.y+halfH),out=[];for(let cy=c;cy<=d;cy++)for(let cx=a;cx<=b;cx++)out.push(this.getChunk(cx,cy));return out}
 prune(){if(this.chunks.size<=this.maxRenderCache)return;const arr=[...this.chunks.entries()].sort((a,b)=>a[1].lastUsed-b[1].lastUsed);for(const[k,c]of arr.slice(0,this.chunks.size-this.maxRenderCache)){if(c.sites.some(s=>s.dirty||s.integrity<100||s.barricade>0||s.claimedBy||s.fire>0)||c.vehicles.some(v=>v.dirty||v.occupant))this.touched.set(k,c);this.chunks.delete(k)}}
}
AZ.World=World;

'use strict';
var AZ=window.AZ;

const REASON={type:'string',description:'Pensamento curto em primeira pessoa explicando por que esta ação faz sentido agora.'};
AZ.AGENT_TOOLS=[
 {type:'function',function:{name:'move',description:'Deslocar-se a pé em uma direção escolhida.',parameters:{type:'object',properties:{direction:{type:'string',enum:['N','NE','E','SE','S','SW','W','NW']},distance:{type:'number',minimum:20,maximum:1200},reason:REASON},required:['direction','distance','reason'],additionalProperties:false}}},
 {type:'function',function:{name:'go_to',description:'Ir até uma pessoa, construção, veículo ou ameaça conhecida pelo id.',parameters:{type:'object',properties:{target_id:{type:'string'},reason:REASON},required:['target_id','reason'],additionalProperties:false}}},
 {type:'function',function:{name:'scavenge',description:'Vasculhar uma construção próxima em busca de itens.',parameters:{type:'object',properties:{site_id:{type:'string'},wanted:{type:'string'},reason:REASON},required:['site_id','wanted','reason'],additionalProperties:false}}},
 {type:'function',function:{name:'loot_vehicle',description:'Vasculhar o porta-malas de um veículo próximo.',parameters:{type:'object',properties:{vehicle_id:{type:'string'},wanted:{type:'string'},reason:REASON},required:['vehicle_id','wanted','reason'],additionalProperties:false}}},
 {type:'function',function:{name:'consume',description:'Consumir ou usar um item do próprio inventário.',parameters:{type:'object',properties:{item_id:{type:'string'},reason:REASON},required:['item_id','reason'],additionalProperties:false}}},
 {type:'function',function:{name:'equip',description:'Equipar uma arma carregada no inventário.',parameters:{type:'object',properties:{item_id:{type:'string'},reason:REASON},required:['item_id','reason'],additionalProperties:false}}},
 {type:'function',function:{name:'craft',description:'Tentar fabricar algo usando materiais e ferramentas disponíveis.',parameters:{type:'object',properties:{recipe:{type:'string',enum:['spear','bandage','water_filter','torch','backpack']},reason:REASON},required:['recipe','reason'],additionalProperties:false}}},
