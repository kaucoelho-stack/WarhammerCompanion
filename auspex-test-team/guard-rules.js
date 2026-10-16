/* Compound bunker Guard. Gallowdark action referenced by the Compound pack.
   Geometry uses the simulator's cell centres/base-radius approximation. */
(()=>{
 const bunker=op=>compoundActive()&&zOf(op)===0&&AuspexCompound.terrain.find(t=>t.type==='bunker'&&op.x+.5>t.x&&op.x+.5<t.x+t.w&&op.y+.5>t.y&&op.y+.5<t.y+t.h&&Math.min(op.x+.5-t.x,t.x+t.w-op.x-.5,op.y+.5-t.y,t.y+t.h-op.y-.5)<=1.5);
 const inside=(op,t)=>zOf(op)<t.z&&op.x+.5>t.x&&op.x+.5<t.x+t.w&&op.y+.5>t.y&&op.y+.5<t.y+t.h;
 const key=op=>`${G.tp}:${op.id}:${op.activationSerial||0}`;
 const valid=op=>op?.onGuard&&!op.dead&&op.hp>0&&op.onGuard.tp===G.tp&&op.order==='engage'&&op.x===op.onGuard.x&&op.y===op.onGuard.y&&zOf(op)===op.onGuard.z&&bunker(op)?.id===op.onGuard.bunkerId;
 const canGuard=op=>!!(op&&bunker(op)&&activationCommitted(op)&&!op._countering&&op.order==='engage'&&canAct(op,1)&&!inEnemyCR(op.x,op.y,op.pi,zOf(op))&&op.shotThis<RULES.maxAction(op,'shoot',TEAMS)&&op.templateId!=='kt-kommando-bombsquig'&&!actionUsed(op,'guard'));
 function act(){
  const op=G.sel;if(!canGuard(op))return false;
  recordAction(op,'guard');op.shotThis++;(op.shotWeapons||(op.shotWeapons=[])).push('Guard');
  op.onGuard={tp:G.tp,bunkerId:bunker(op).id,x:op.x,y:op.y,z:zOf(op)};
  log(`${op.n}: GUARD · 1 AP · aguardando ação inimiga fora do bunker`);spend(op,1);render();return true;
 }
 function options(active){
  if(!compoundActive()||active._countering||active.guardInterrupted||active.dead)return[];
  const result=[];
  for(const op of alive(1-active.pi).filter(valid)){
   const t=bunker(op);if(inside(active,t))continue;
   const engaged=inEnemyCR(op.x,op.y,op.pi,zOf(op));
   for(const target of enemiesOf(op.pi).filter(e=>!inside(e,t))){
    for(const weapon of weaponsOf(op,'m'))if(mutualControl(op,target))result.push({op,target,weapon,kind:'fight',pointBlank:false});
    for(const weapon of weaponsOf(op,'r')){
     if(RULES.limitedBlocked(op,weapon))continue;
     const pointBlank=engaged&&mutualControl(op,target);
     if(engaged&&!pointBlank||!pointBlank&&!shotTargetState(op,target,weapon).valid)continue;
     result.push({op,target,weapon,kind:'shoot',pointBlank});
    }
   }
  }
  return result;
 }
 function expireNear(active){for(const op of alive(1-active.pi))if(op.onGuard&&mutualControl(op,active))op.onGuard=null;}
 function queue(active,deferFinish=false){
  if(G.phase!=='firefight'||G.guardActor||G.guardWindow||G.breachMove||!options(active).length){if(!G.guardActor&&!G.guardWindow&&compoundActive())expireNear(active);return false;}
  G.guardWindow={active,deferFinish};schedule();return true;
 }
 function schedule(){if(G.guardWindow&&!G.guardResolving)setTimeout(()=>{if(!document.getElementById('ov').classList.contains('on'))process();},0);}
 async function process(){
  const state=G.guardWindow;if(!state||G.guardResolving||G.phase!=='firefight')return;
  G.guardResolving=true;const active=state.active;let snapshot=null,chosen=null;
  try{
   const choices=options(active);if(!choices.length)return;
   const index=isAI(1-active.pi)?choices.findIndex(c=>c.kind==='shoot'):await rulesChoice(1-active.pi,'GUARD — INTERROMPER ATIVAÇÃO',choices.map(c=>`${c.op.n} → ${c.target.n} · ${c.weapon.n}${c.pointBlank?' · À QUEIMA-ROUPA (+1 Hit)':''}`),`${active.n} concluiu uma ação fora do bunker. Escolha um ataque gratuito ou continue sem interromper. Uma interrupção por ativação inimiga.`);
   chosen=choices[index<0&&isAI(1-active.pi)?0:index];
   if(!chosen){expireNear(active);return;}
   if(!valid(chosen.op)||active.dead||G.phase!=='firefight'||!options(active).some(c=>c.op===chosen.op&&c.target===chosen.target&&c.weapon.n===chosen.weapon.n&&c.kind===chosen.kind))return;
   const op=chosen.op;active.guardInterrupted=true;op.onGuard=null;op.counteracted=true;
   if(chosen.pointBlank)op.guardNoRetaliation=key(active);
   snapshot={sel:G.sel,mode:G.mode,targets:G.targets,weapon:G.weapon,aimTarget:G.aimTarget,ap:op.ap,shotThis:op.shotThis,shotWeapons:op.shotWeapons,shotProfiles:op.shotProfiles,foughtThis:op.foughtThis,usedActs:op.usedActs,orderLocked:op.orderLocked,moved:op.moved,movedFar:op.movedFar,chargedThis:op.chargedThis};
   G.guardActor=op;G.guardPointBlank=chosen.pointBlank;G.sel=op;G.mode=chosen.kind;G.targets=[chosen.target];G.weapon=chosen.weapon;
   op.ap=3;op.shotThis=0;op.shotWeapons=[];op.shotProfiles=[];op.foughtThis=0;op.usedActs=[];op.moved=false;op.movedFar=false;op.chargedThis=false;
   log(`${op.n}: Guard interrompe ${active.n} · ${chosen.kind==='fight'?'luta':'tiro'} gratuito contra ${chosen.target.n}`);
   if(chosen.kind==='shoot')await doShoot(chosen.target,{guard:true,confirmed:true});else await doFight(chosen.target,{guard:true});
  }catch(error){log('Guard interrompido por erro: '+String(error.message||error));console.error(error);}
  finally{
   if(snapshot){const op=chosen.op;for(const field of ['ap','shotThis','shotWeapons','shotProfiles','foughtThis','usedActs','orderLocked','moved','movedFar','chargedThis'])op[field]=snapshot[field];if(op.dead)op.ap=0;G.sel=snapshot.sel;G.mode=snapshot.mode;G.targets=snapshot.targets;G.weapon=snapshot.weapon;G.aimTarget=snapshot.aimTarget;}
   G.guardActor=null;G.guardPointBlank=false;G.guardResolving=false;G.guardWindow=null;
   if(G.phase==='firefight'&&!checkElimination()){
    if(active.dead||active.ap<=0&&!state.deferFinish)finishOp(active);
    const resume=G.guardResumeAI;G.guardResumeAI=null;if(resume&&!active.dead)setTimeout(()=>continueAIAction(resume.op,resume.step),100);
    const combo=G.guardResumeCombo;G.guardResumeCombo=null;if(combo&&!active.dead)completeDakkaStep(combo);else if(active.dead&&G.dakkaCombo?.op===active)G.dakkaCombo=null;
   }
   render();
  }
 }
 window.AuspexGuard={canGuard,act,options,queue,schedule,key,valid,allowsTarget:(op,target)=>!!(bunker(op)&&!inside(target,bunker(op))),onAction(op,name){if(name!=='guard')op.onGuard=null;},suppressed:op=>!!(G.sel&&op.guardNoRetaliation===key(G.sel))};
})();
