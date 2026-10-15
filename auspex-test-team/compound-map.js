/* Original grid adaptation inspired by Volkus Compound, not an exact mission
   diagram or complete rules implementation. Kept out of the live map registry. */
const AuspexCompound=(()=>{
 const terrain=[];
 const add=(id,x,y,w,h,z,type)=>terrain.push({id,x,y,w,h,z,type});
 add('stronghold-west',7,7,3,8,4,'stronghold');
 add('stronghold-east',20,7,3,8,4,'stronghold');
 add('bunker-north',13,4,4,3,2,'bunker');
 add('bunker-south',13,15,4,3,2,'bunker');
 // Inner side walls abut the strongholds; they never occupy the same volume.
 for(const [id,x,y,w,h]of [['nw',10,6,3,1],['ne',17,6,3,1],['sw',10,15,3,1],['se',17,15,3,1],['west',10,9,1,3],['east',19,10,1,3]])add('stockade-'+id,x,y,w,h,2,'stockade');
 for(const [i,x,y]of [[0,12,8],[1,18,7],[2,11,14],[3,17,13],[4,11,10],[5,18,11]])add('fire-step-'+i,x,y,1,1,2,'fire-step');
 for(const [i,x,y,w,h]of [[0,2,4,3,2],[1,25,16,3,2],[2,3,15,2,3],[3,25,3,2,3]]){
  for(let n=0;n<w;n++)add(`ruin-${i}-north-${n}`,x+n,y,1,1,[3,2.1,1.4][(i+n)%3],'ruin');
  for(let n=1;n<h;n++)add(`ruin-${i}-west-${n}`,x,y+n,1,1,[1.2,2.4,3][(i+n)%3],'ruin');
 }
 for(const [i,x,y]of [[0,4,10],[1,25,10],[2,11,2],[3,18,19]]){add('rubble-'+i,x,y,1,1,.8,'rubble');add('rubble-'+i+'-low',x+1,y,1,1,.35,'rubble');}
 for(const t of terrain.filter(t=>t.type==='stronghold')){
  t.roofCover=[];for(let i=0;i<t.h;i++)t.roofCover.push({id:t.id+'-crest-'+i,x:t.id.includes('west')?t.x:t.x+t.w-.18,y:t.y+i,w:.18,h:1,z:t.z,height:[.7,1.2,.5,.95][i%4],type:'parapet',spiked:i%2===1});
 }
 for(const t of terrain){
  if(t.type==='stockade'){t.hasDoor=['stockade-nw','stockade-se'].includes(t.id);t.open=false;const horizontal=t.w>t.h;t.breach={x:t.x+(horizontal?1:0),y:t.y+(horizontal?0:1),w:1,h:1};t.inside={x:horizontal?t.x+1.5:t.id==='stockade-west'?t.x+1.5:t.x-.5,y:horizontal?t.id.includes('n')?t.y+1.5:t.y-.5:t.y+1.5};}
  if(t.type==='bunker'){t.windows=[{x:t.x+t.w,y:t.y+1.5,z:1},{x:t.x+1.5,y:t.y+t.h,z:1}];t.entrance={x:t.x+1.5,y:t.id==='bunker-north'?t.y+t.h:t.y};}
 }
 const canOpenDoor=(t,op)=>!!t&&t.hasDoor&&!t.open&&op?.ap>=1&&(op.z||0)===0&&(t.id==='stockade-nw'?op.y>=t.y+t.h:op.y<=t.y)&&Math.hypot(op.x-t.inside.x,op.y-t.inside.y)<=1;
 const blockedAt=(x,y)=>terrain.some(t=>{if(x<t.x||x>=t.x+t.w||y<t.y||y>=t.y+t.h)return false;return !(t.type==='stockade'&&t.open&&x>=t.breach.x&&x<t.breach.x+1&&y>=t.breach.y&&y<t.breach.y+1);});
 const openDoor=(id,op)=>{const t=terrain.find(t=>t.id===id);if(!canOpenDoor(t,op))return false;t.open=true;op.ap--;return true;};
 const windowEligible=(a,b,window)=>Math.min(Math.hypot(a.x-window.x,a.y-window.y),Math.hypot(b.x-window.x,b.y-window.y))<=1;
 const segmentBox=(a,b,t)=>{
  let enter=0,exit=1;
  for(const [axis,min,max]of [['x',t.x,t.x+t.w],['y',t.y,t.y+t.h]]){const delta=b[axis]-a[axis];if(Math.abs(delta)<1e-9){if(a[axis]<min||a[axis]>max)return null;}else{let lo=(min-a[axis])/delta,hi=(max-a[axis])/delta;if(lo>hi)[lo,hi]=[hi,lo];enter=Math.max(enter,lo);exit=Math.min(exit,hi);if(enter>exit)return null;}}
  return {enter,exit};
 };
 const traceVisibility=(a,b,{fortificationsOnly=false}={})=>{
  if(![a.x,a.y,b.x,b.y].every(Number.isFinite))return {visible:false,reason:'Coordenadas inválidas'};
  for(const t of terrain){
   if(fortificationsOnly&&!['bunker','stockade'].includes(t.type))continue;
   if(['fire-step','rubble'].includes(t.type))continue;
   const hit=segmentBox(a,b,t);if(!hit||hit.exit-hit.enter<1e-6)continue;
   if(t.type==='stockade'||t.type==='bunker'){
    // Fortified Position: either base at least 2 inches above the terrain bottom.
    if(Math.max(a.z||0,b.z||0)>=(t.baseZ||0)+2)continue;
    if(t.type==='stockade'&&t.open){const breach=segmentBox(a,b,t.breach);if(breach&&breach.enter<=hit.enter+1e-6&&breach.exit>=hit.exit-1e-6)continue;}
    const inside=p=>p.x>t.x&&p.x<t.x+t.w&&p.y>t.y&&p.y<t.y+t.h;
    if(t.type==='bunker'&&inside(a)&&inside(b))continue;
    if(t.windows&&inside(a)!==inside(b)){const edge=inside(a)?hit.exit:hit.enter,p={x:a.x+(b.x-a.x)*edge,y:a.y+(b.y-a.y)*edge};if(t.entrance&&Math.abs(p.x-t.entrance.x)<.5&&Math.abs(p.y-t.entrance.y)<1e-6)continue;const window=t.windows.find(w=>Math.hypot(p.x-w.x,p.y-w.y)<=.4&&windowEligible(a,b,w));if(window)continue;}
   }else if(Math.min(a.z||0,b.z||0)>=t.z)continue;
   return {visible:false,reason:t.windows?'Bunker bloqueado: alinhe a janela e fique a até 1″ dela.':'Parede/paliçada fechada bloqueia a linha.',blocker:t.id};
  }
  return {visible:true,reason:'Linha livre no modelo geométrico do laboratório.'};
 };
 return {traceVisibility,blockedAt,canOpenDoor,openDoor,windowEligible,name:'Bastião de Volkus · estudo de cerco',width:30,height:22,terrain,objective:{x:14.5,y:10.5},
  zones:{defence:{x:10,y:7,w:10,h:8},offence:[{x:0,y:0,w:4,h:22},{x:26,y:0,w:4,h:22}]},
  source:'https://assets.warhammer-community.com/eng_kt_volkus_compound_mission_pack-oai8j5hmhd-a6ugpgdgkj.pdf',
  status:'Protótipo geométrico; layout adaptado, sem missão ou regras especiais integradas.'};
})();
if(typeof module!=='undefined')module.exports=AuspexCompound;
