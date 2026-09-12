 {type:'function',function:{name:'drive_vehicle',description:'Dirigir o veículo ocupado até uma direção por determinada distância.',parameters:{type:'object',properties:{direction:{type:'string',enum:['N','NE','E','SE','S','SW','W','NW']},distance:{type:'number',minimum:80,maximum:5000},reason:REASON},required:['direction','distance','reason'],additionalProperties:false}}},
 {type:'function',function:{name:'exit_vehicle',description:'Sair do veículo ocupado.',parameters:{type:'object',properties:{reason:REASON},required:['reason'],additionalProperties:false}}},
 {type:'function',function:{name:'refuel_vehicle',description:'Usar gasolina carregada para abastecer um veículo próximo.',parameters:{type:'object',properties:{vehicle_id:{type:'string'},units:{type:'integer',minimum:1,maximum:10},reason:REASON},required:['vehicle_id','units','reason'],additionalProperties:false}}},
 {type:'function',function:{name:'set_goal',description:'Definir ou revisar um objetivo próprio de médio prazo.',parameters:{type:'object',properties:{goal:{type:'string'},reason:REASON},required:['goal','reason'],additionalProperties:false}}},
 {type:'function',function:{name:'wait',description:'Aguardar deliberadamente por algum tempo.',parameters:{type:'object',properties:{minutes:{type:'number',minimum:1,maximum:180},reason:REASON},required:['minutes','reason'],additionalProperties:false}}}
];

class AIManager{
 constructor(sim){
   this.sim=sim;this.calls=0;this.fails=0;this.tokens=0;this.activeBrains=new Set();
   this.apiKey=localStorage.getItem('az_openrouter_key')||'';
   this.lightModel=localStorage.getItem('az_light_model')||'google/gemma-4-26b-a4b-it:free';
   this.deepModel=localStorage.getItem('az_deep_model')||'openai/gpt-oss-20b';
   this.enabled=localStorage.getItem('az_ai_enabled')!=='0';
 }
 saveSettings(key,light,deep,enabled){
   this.apiKey=(key||'').trim();this.lightModel=(light||'google/gemma-4-26b-a4b-it:free').trim();this.deepModel=(deep||'openai/gpt-oss-20b').trim();this.enabled=!!enabled;
   if(this.apiKey)localStorage.setItem('az_openrouter_key',this.apiKey);else localStorage.removeItem('az_openrouter_key');
   localStorage.setItem('az_light_model',this.lightModel);localStorage.setItem('az_deep_model',this.deepModel);localStorage.setItem('az_ai_enabled',this.enabled?'1':'0');
 }
 decide(agent,deep=false,trigger='routine'){
   if(!this.enabled||!this.apiKey||!agent.alive||agent.brain.pending)return false;
   agent.brain.pending=true;this.activeBrains.add(agent.id);
   this.request({agent,deep,trigger}).finally(()=>{agent.brain.pending=false;this.activeBrains.delete(agent.id)});
   return true;
 }
 memoryContext(a){
   const relevant=a.memory.retrieve({now:this.sim.minute,tags:this.sim.currentMemoryTags(a),limit:16});
   return relevant.map(m=>({when:this.sim.formatMinute(m.minute),kind:m.kind,text:m.text,importance:m.importance}));
 }
 buildContext(a,trigger){
   return {
     identity:{id:a.id,name:a.name,age:a.age,profession:a.profession,personality:a.personality,attributes:a.attr,skills:a.skills,personal_goal:a.brain.goal||null},
     time:this.sim.timeLabel(),trigger,
