const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const s=fs.readFileSync(__dirname+'/index.html','utf8');let ended=0,overlay='';
const env={G:{phase:'firefight',cur:1,ai:1,aiBusy:true},console:{error:()=>{}},log:()=>{},openOv:(title,body)=>overlay=body,checkElimination:()=>false,finishOp:()=>ended++};
vm.createContext(env);vm.runInContext(s.slice(s.indexOf('function aiTurn(){'),s.indexOf('function afterAICombat')),env);
env.aiAct({dead:true,hp:0},0);assert.equal(ended,1);assert.equal(env.G.aiBusy,false);
env.G.aiBusy=true;env.aiAct({dead:false,hp:10,ap:2},0); // Missing dependency intentionally throws inside planner.
assert.equal(env.G.aiBusy,false);assert(overlay.includes('TENTAR NOVAMENTE'));assert(overlay.includes('ENCERRAR ATIVAÇÃO'));
console.log('PASS: dead AI advances, planner exception releases busy flag and offers recovery');
