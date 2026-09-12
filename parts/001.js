       const i=attempts++,salt=100+i*7,type=types[Math.floor(AZ.rand01(this.seed,cx,cy,salt)*types.length)];
       let w=type==='warehouse'?136:type==='school'?150:type==='farm'?126:type==='gas_station'?118:82,h=type==='warehouse'?100:type==='school'?108:type==='farm'?84:type==='gas_station'?76:66;
       let lx=38+AZ.rand01(this.seed,cx,cy,salt+1)*(AZ.CHUNK_SIZE-w-76),ly=38+AZ.rand01(this.seed,cx,cy,salt+2)*(AZ.CHUNK_SIZE-h-76);
       const rect={x:lx,y:ly,w,h};if(this.roadConflict(rect,roads)||sites.some(s=>this.intersects(rect,{x:s.x-baseX,y:s.y-baseY,w:s.w,h:s.h},24)))continue;
       sites.push({kind:'site',id:`${cx}:${cy}:${sites.length}`,name:SITE_NAMES[type]||type,type,x:baseX+lx,y:baseY+ly,w,h,loot:this.defaultLoot(type,cx,cy,sites.length),integrity:100,barricade:0,claimedBy:null,fire:0,dirty:false});
     }
   }
   if(roads.vertical||roads.horizontal){
     const n=1+(AZ.hash32(this.seed,cx,cy,700)%4);for(let i=0;i<n;i++)vehicles.push(this.makeVehicle(cx,cy,i,roads,baseX,baseY));
   }
   return{cx,cy,biome,roads,sites,vehicles,lastUsed:performance.now()};
 }
 makeVehicle(cx,cy,i,roads,bx,by){
   const types=['sedan','hatch','pickup','van'];const type=types[AZ.hash32(this.seed,cx,cy,730+i)%types.length],vertical=roads.vertical&&(!roads.horizontal||AZ.rand01(this.seed,cx,cy,740+i)>.5);
   let x,y,angle;if(vertical){x=bx+AZ.CHUNK_SIZE/2+(AZ.rand01(this.seed,cx,cy,750+i)-.5)*54;y=by+90+AZ.rand01(this.seed,cx,cy,760+i)*(AZ.CHUNK_SIZE-180);angle=Math.PI/2}else{x=bx+90+AZ.rand01(this.seed,cx,cy,750+i)*(AZ.CHUNK_SIZE-180);y=by+AZ.CHUNK_SIZE/2+(AZ.rand01(this.seed,cx,cy,760+i)-.5)*54;angle=0}
   return{kind:'vehicle',id:`v:${cx}:${cy}:${i}`,name:{sedan:'Sedã',hatch:'Hatch',pickup:'Picape',van:'Van'}[type],type,x,y,angle,fuel:Math.round(5+AZ.rand01(this.seed,cx,cy,770+i)*55),maxFuel:type==='pickup'?75:55,condition:Math.round(38+AZ.rand01(this.seed,cx,cy,780+i)*62),occupant:null,locked:AZ.rand01(this.seed,cx,cy,790+i)<.18,dirty:false,trunk:this.vehicleLoot(cx,cy,i)}
 }
 vehicleLoot(cx,cy,i){const a=[];if(AZ.rand01(this.seed,cx,cy,800+i)>.55)a.push({id:'gasoline',name:'Gasolina',kind:'fuel',qty:1,weight:3});if(AZ.rand01(this.seed,cx,cy,810+i)>.7)a.push({id:'tire_iron',name:'Chave de roda',kind:'weapon',qty:1,weight:2.2});return a}
 defaultLoot(type,cx,cy,i){
   const q=(salt,min,max)=>min+Math.floor(AZ.rand01(this.seed,cx,cy,salt+i*13)*(max-min+1)),a=[],push=(id,name,kind,qty,weight=1)=>{if(qty>0)a.push({id,name,kind,qty,weight})};
   if(['house','cabin','farm'].includes(type)){push('water','Água','drink',q(201,1,5),1);push('food','Alimento','food',q(202,1,5),.6);push('cloth','Tecido','material',q(203,0,3),.3);if(q(230,0,4)===4)push('kitchen_knife','Faca de cozinha','weapon',1,.45)}
   if(type==='store'){push('water','Água','drink',q(204,5,14));push('food','Alimento','food',q(205,6,18),.6);push('battery','Bateria','utility',q(206,1,5),.2);push('gasoline','Galão de gasolina','fuel',q(231,0,2),3)}
   if(type==='clinic'){push('bandage','Curativo','medical',q(207,3,8),.2);push('antirad','Quelante','medical',q(208,1,4),.2);push('painkiller','Analgésico','medical',q(209,1,5),.1)}
