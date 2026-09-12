     a.brain.lastModel=model;a.brain.lastDecisionAt=this.sim.minute;a.brain.lastError='';a.brain.failStreak=0;
   }catch(err){
     this.fails++;a.brain.lastError=String(err.message||err);a.brain.retryAfter=performance.now()+Math.min(45000,3000*Math.max(1,a.brain.failStreak||1));a.brain.failStreak=(a.brain.failStreak||0)+1;
     this.sim.remember(a,'system',`O cérebro externo falhou nesta decisão: ${a.brain.lastError}`,2,['ai-error']);
   }
 }
}
AZ.AIManager=AIManager;

'use strict';
var AZ=window.AZ;

const FIRST=['Ana','Bruno','Caio','Clara','Davi','Elisa','Fábio','Giovana','Heitor','Iara','João','Lia','Marcos','Nina','Otávio','Paula','Rafael','Sara','Tiago','Vera','Alice','Bento','Cecília','Diego','Eva','Felipe','Helena','Igor','Júlia','Leandro','Maya','Noah','Olívia','Pedro','Raquel','Samuel','Tainá','Vitor','Yasmin','Augusto','Bianca','Ciro','Dora','Enzo','Flávia','Gustavo','Heloísa','Jonas','Karen','Lucas'];
const LAST=['Almeida','Barros','Costa','Dias','Esteves','Ferraz','Gomes','Haddad','Ishikawa','Jardim','Klein','Lima','Moura','Nogueira','Oliveira','Pires','Queiroz','Ramos','Silva','Torres','Uchoa','Vieira','Xavier','Yamada','Zanetti'];
const JOBS=['enfermeira','médico','professor','mecânico','caixa','policial','bombeiro','radialista','eletricista','motorista','cozinheira','fazendeiro','farmacêutica','segurança','assistente social','técnica de laboratório','carpinteiro','estudante','aposentado','desempregado'];
const TRAITS=['altruísta e protetor','pragmático e cauteloso','desconfiado e observador','corajoso e impulsivo','ansioso e leal','gregário e diplomático','solitário e metódico','curioso e teimoso','calmo e analítico','ambicioso e persuasivo','empático e avesso a conflito','resiliente e direto'];
const DIRECTIONS={N:[0,-1],NE:[.707,-.707],E:[1,0],SE:[.707,.707],S:[0,1],SW:[-.707,.707],W:[-1,0],NW:[-.707,-.707]};
const RECIPES={spear:{need:{wood:1,metal:1},out:{id:'spear',name:'Lança improvisada',kind:'weapon',qty:1,weight:1.7},minutes:28},bandage:{need:{cloth:2},out:{id:'bandage',name:'Curativo',kind:'medical',qty:1,weight:.2},minutes:12},water_filter:{need:{cloth:1,metal:1},out:{id:'water_filter',name:'Filtro de água',kind:'tool',qty:1,weight:.8},minutes:32},torch:{need:{wood:1,cloth:1},out:{id:'torch',name:'Tocha',kind:'tool',qty:1,weight:.7},minutes:10},backpack:{need:{cloth:3},out:{id:'backpack',name:'Mochila reforçada',kind:'gear',qty:1,weight:.8},minutes:36}};
const BUILD={barricade:{need:{wood:3,metal:1},minutes:55},campfire:{need:{wood:2},minutes:20},rain_collector:{need:{cloth:2,metal:2},minutes:70},cache:{need:{wood:2},minutes:30},shelter:{need:{wood:6,metal:3},minutes:150}};
const WEAPONS={
