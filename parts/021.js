   else if(a.tool==='aid'){const q=this.people.find(x=>x.id===a.args.person_id&&x.alive);if(q){if(a.args.item_id)this.takeItem(p,a.args.item_id,1);const heal=3+p.attr.empathy*.6+this.skillLevel(p,'first_aid')*1.5+this.rng.range(0,5);q.health=Math.min(100,q.health+heal);q.pain=Math.max(0,q.pain-heal);q.bleeding=Math.max(0,q.bleeding-heal*.12);for(const w of q.wounds)w.bleeding*=.6;q.relations.set(p.id,AZ.clamp((q.relations.get(p.id)||0)+10,-100,100));this.practice(p,'first_aid',8);this.remember(p,'aid',`Prestou auxílio a ${q.name}.`,7,['social',q.id,'aid']);this.remember(q,'aid',`${p.name} prestou auxílio.`,7,['social',p.id,'aid'])}}
   else if(a.tool==='observe'){p.brain.novelty+=1;this.practice(p,'foraging',1)}
 }
 resolveAttack(p,id,style='balanced'){
   const t=this.entityById(id);if(!t||!t.alive)return;const w=this.weaponStats(p),skill=this.skillLevel(p,w.skill),styleAcc=style==='quick'?.1:style==='heavy'?-.12:style==='push'?.02:0,styleDmg=style==='heavy'?1.45:style==='quick'?.72:style==='push'?.35:1;
   if(w.ammo){if(!this.itemQty(p,w.ammo)){const alt=p.inventory.find(i=>i.kind==='weapon'&&!WEAPONS[i.id]?.ammo&&i.qty>0);if(alt){p.equippedWeapon=alt.id;this.remember(p,'combat',`${w.name} ficou sem munição; mudou para ${alt.name}.`,5,['combat']);return}this.remember(p,'combat',`${w.name} está sem munição.`,5,['combat']);return}this.takeItem(p,w.ammo,1)}
   const hit=AZ.clamp(.48+w.accuracy+skill*.045+p.attr.agility*.018+styleAcc-p.stress*.002-p.pain*.002, .08,.96);p.energy=AZ.clamp(p.energy-w.stamina*(style==='heavy'?1.4:1),0,100);p.stress=AZ.clamp(p.stress+2,0,100);this.practice(p,w.skill,3);this.practice(p,'melee',w.skill==='shooting'?0:1.3);
   if(!this.rng.chance(hit)){this.effects.push({type:'miss',x:t.x,y:t.y,life:10});this.remember(p,'combat',`Errou um ataque com ${w.name}.`,3,['combat']);return}
   let dmg=(w.damage+p.attr.strength*(w.skill==='shooting'?.25:1.15)+skill*1.7+this.rng.range(-3,7))*styleDmg;if(style==='push'&&t.kind==='zombie'){const dx=t.x-p.x,dy=t.y-p.y,l=Math.hypot(dx,dy)||1;t.x+=dx/l*38;t.y+=dy/l*38}
   t.health-=Math.max(1,dmg);this.effects.push({type:'blood',x:t.x,y:t.y,life:18});
   if(t.kind==='person'){t.relations.set(p.id,-100);p.relations.set(t.id,AZ.clamp((p.relations.get(t.id)||0)-35,-100,100));t.pain=AZ.clamp(t.pain+dmg*.35,0,100)}
   if(t.kind==='zombie'&&t.health<=0){t.alive=false;this.remember(p,'combat',`Derrubou ${t.name} com ${w.name}.`,8,['zombie','combat']);this.log('COMBATE',`${p.name} derrubou um infectado.`)}else if(t.kind==='person'&&t.health<=0)this.killPerson(t,`ataque de ${p.name}`)
 }
 zombieWound(z,p){
   const first=this.recordZombieSight(p,z,'attack');for(const q of this.peopleGrid.near(p.x,p.y,230))if(q.alive&&q.id!==p.id)this.recordZombieSight(q,z,'sight');
   const r=this.rng.next(),type=r<.18?'mordida':r<.5?'corte':'arranhão',infectionChance=type==='mordida'?1:type==='corte'?.75:.5,severity=type==='mordida'?this.rng.range(.55,1):type==='corte'?this.rng.range(.3,.75):this.rng.range(.12,.42),infected=this.rng.chance(infectionChance),bleeding=severity*(type==='mordida'?1.3:type==='corte'?1:.45);
