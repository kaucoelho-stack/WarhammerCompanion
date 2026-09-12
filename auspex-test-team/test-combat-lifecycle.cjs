const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(match[1]);
const section=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));
const players=[{n:'one'},{n:'two'}];let rolls=[];
const env={console,G:{ploys:[[],[]]},TEAMS:{},P:i=>players[i],mods:()=>({}),rollAtk:()=>rolls.shift(),hasTag:(w,t)=>w.tags.includes(t),RULES:{engine:op=>({resilient:op.resilient}),hasAbility:()=>false},d6:()=>6,log:()=>{},render:()=>{},isAI:()=>true};
vm.createContext(env);vm.runInContext(section('async function resolveFight','function checkElimination'),env);
vm.runInContext(section('function canAct','function actionUsed'),env);
const op=(pi,hp)=>({pi,hp,ap:3,n:'operative',dead:false});const w={a:2,d:4,c:6,tags:[]};
(async()=>{
 let a=op(0,10),d=op(1,4);rolls=[[{k:'suc'}],[{k:'crit'},{k:'crit'}]];
 let r=await env.resolveFight(a,d,w,w);assert(d.dead);assert.equal(a.hp,10);assert.equal(r.dmgD,0);assert.equal(d.ap,0);assert(!env.canAct(d,1));
 env.isAI=()=>false;env.openOv=()=>queueMicrotask(()=>env.G.fightChoice(0));
 a=op(0,4);d=op(1,10);rolls=[[{k:'suc'},{k:'crit'}],[{k:'crit'}]];
 r=await env.resolveFight(a,d,w,w);assert(a.dead);assert.equal(d.hp,6);assert.equal(r.dmgA,4);
 a=op(0,10);d=op(1,4);d.resilient=true;rolls=[[{k:'suc'}],[{k:'suc'}]];
 r=await env.resolveFight(a,d,w,w);assert.equal(d.hp,1);assert.equal(a.hp,6);assert(!d.dead);
 // Human defender chooses a block, cancelling the remaining attack die.
 env.isAI=pi=>pi===0;env.openOv=()=>queueMicrotask(()=>env.G.fightChoice(1));
 a=op(0,10);d=op(1,10);rolls=[[{k:'suc'},{k:'suc'}],[{k:'suc'}]];
 r=await env.resolveFight(a,d,w,w);assert.equal(d.hp,6);assert.equal(a.hp,10);assert.equal(env.G.fightResolving,false);
 console.log('PASS: lethal first strike, lethal retaliation, per-strike resilience, human block, dead action guard, script syntax');
})().catch(e=>{console.error(e);process.exitCode=1;});
