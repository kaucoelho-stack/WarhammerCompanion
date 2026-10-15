/* Compound Siege mission adapter. No Transmission VP: final control wins.
   Physical base measurements and complete deployment remain separate work. */
const AuspexCompoundMission=(()=>{
 const thresholds={5:[1,2,3,4,5],6:[1,2,4,5,6],7:[1,3,4,6,7],8:[2,3,5,6,8],9:[2,4,5,7,9],10:[2,4,6,8,10],11:[2,4,7,9,11],12:[2,5,7,10,12],13:[3,5,8,10,13],14:[3,6,8,11,14]};
 function killGrade(starting,casualties){const row=thresholds[starting];if(!row)throw new RangeError('Kill grade disponível para esquadrões de 5 a 14 operativos.');return row.reduce((grade,n,i)=>casualties>=n?i+1:grade,0);}
 function control(ops,objective){const totals=[0,0];for(const op of ops){if(op.dead||op.hp<=0||![0,1].includes(op.pi))continue;if(Math.hypot(op.x-objective.x,op.y-objective.y)<=1)totals[op.pi]+=Math.max(0,op.apl+(op.aplModifier||0));}return totals;}
 function result(ops,objective,tp){const rosters=[0,1].map(pi=>ops.filter(op=>op.pi===pi)),alive=rosters.map(team=>team.filter(op=>!op.dead&&op.hp>0).length);
  if(!rosters[0].length||!rosters[1].length)throw new Error('As duas equipes precisam de operativos.');
  if(!alive[0]||!alive[1])return {over:true,winner:alive[0]?0:alive[1]?1:null,reason:'incapacitation'};
  if(tp<4)return {over:false,winner:null,reason:'ongoing'};
  const c=control(ops,objective);if(c[0]!==c[1])return {over:true,winner:c[0]>c[1]?0:1,reason:'central-control',control:c};
  const grades=[killGrade(rosters[1].length,rosters[1].filter(op=>(op.dead||op.hp<=0)&&op.countsForElimination!==false).length),killGrade(rosters[0].length,rosters[0].filter(op=>(op.dead||op.hp<=0)&&op.countsForElimination!==false).length)];
  return {over:true,winner:grades[0]===grades[1]?null:grades[0]>grades[1]?0:1,reason:'kill-grade',grades};
 }
 return {killGrade,control,result,deployFirst:defender=>defender,firstInitiativeChooser:attacker=>attacker};
})();
if(typeof module!=='undefined')module.exports=AuspexCompoundMission;
