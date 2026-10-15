/* Rich materials on exact terrain geometry, no rule or collision changes. */
window.AuspexCompoundArt=(()=>{
 let atlas=null;
 const setAtlas=image=>{atlas=image;};
 if(typeof Image!=='undefined'){const image=new Image();image.onload=()=>{setAtlas(image);window.IsoTactics?.render();window.renderCompoundLab?.();};image.src='assets/pixel/compound-materials-v2.png';}
 const mix=(a,b,f)=>({x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f});
 const at=(ps,u,v)=>mix(mix(ps[0],ps[1],u),mix(ps[3],ps[2],u),v);
 const area=(ps,u,v,w,h)=>[at(ps,u,v),at(ps,u+w,v),at(ps,u+w,v+h),at(ps,u,v+h)];
 function poly(ctx,ps,fill,stroke){ctx.beginPath();ps.forEach((p,i)=>i?ctx.lineTo(Math.round(p.x),Math.round(p.y)):ctx.moveTo(Math.round(p.x),Math.round(p.y)));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.7;ctx.stroke();}}
 function texture(ctx,ps,index,region={u:0,v:0,w:1,h:1}){if(!atlas)return;const [o,a,,b]=ps,size=atlas.width/2,sy=atlas.height/2;ctx.save();ctx.imageSmoothingEnabled=false;ctx.transform(a.x-o.x,a.y-o.y,b.x-o.x,b.y-o.y,o.x,o.y);ctx.drawImage(atlas,(index%2+region.u)*size,(Math.floor(index/2)+region.v)*sy,region.w*size,region.h*sy,0,0,1,1);ctx.restore();}
 function wall(ctx,ps,t,index,shade,segment){
  poly(ctx,ps,index===1?'#47352f':'#55594c','#11191c');texture(ctx,ps,index,{u:Math.abs(Math.floor(segment.x+segment.y))%3/3,v:0,w:1/3,h:1});poly(ctx,ps,shade?'#070e1b38':'#dedab908');
  // Height and material families remain legible even without the small labels.
  if(t.type==='bunker')poly(ctx,ps,'#d0bd8c38');
  if(t.type==='fire-step')poly(ctx,ps,'#a2b1b341');
  if(t.type==='stronghold'&&(t.baseZ||0)===0){
   poly(ctx,area(ps,0,.49,1,.03),'#17272b','#889591');
   for(const v of [.12,.35,.62,.85])poly(ctx,area(ps,.93,v,.035,.018),'#c8d5c2');
  }
  for(const u of [.015,.925]){poly(ctx,area(ps,u,.01,.055,.98),'#283030','#10171b');poly(ctx,area(ps,u,.02,.012,.95),'#8d8e78');for(const v of [.06,.49,.9])poly(ctx,area(ps,u+.014,v,.025,.016),'#b4a477','#333b36');}
  poly(ctx,area(ps,.06,.945,.87,.045),'#222d31','#12191b');poly(ctx,area(ps,.06,.94,.87,.008),'#c2b78b');
  if(t.hasDoor&&!t.open&&t.breach&&Math.hypot(segment.x-(t.breach.x+.5),segment.y-(t.breach.y+.5))<=.51){poly(ctx,area(ps,.14,.1,.72,.89),'#8c805d','#171f22');poly(ctx,area(ps,.2,.16,.6,.81),'#303b3a','#bab18b');poly(ctx,area(ps,.49,.16,.025,.8),'#111b21');for(let i=0;i<6;i++)poly(ctx,area(ps,.21+i*.095,.89,.06,.035),i%2?'#11191b':'#c39e51');poly(ctx,area(ps,.43,.53,.14,.065),'#adbb95','#152026');}
  if(t.type==='stockade'&&Math.floor(segment.x+segment.y)%2===0)for(let i=0;i<5;i++)poly(ctx,area(ps,.2+i*.12,.84,.055,.025),i%2?'#151c1f':'#bd9949');
  if((t.baseZ||0)===0&&(t.windows||[]).some(w=>Math.hypot(w.x-segment.x,w.y-segment.y)<.65)){
   poly(ctx,area(ps,.22,.32,.56,.2),'#a4a187','#12191b');poly(ctx,area(ps,.27,.35,.46,.13),'#070d11');poly(ctx,area(ps,.28,.46,.44,.018),'#c4b997');poly(ctx,area(ps,.3,.37,.025,.06),'#729498');
  }
 }
 function roof(ctx,ps,t,x,y){
  poly(ctx,ps,'#58605b','#142029');texture(ctx,ps,2,{u:(Math.floor(x)%2)/2,v:(Math.floor(y)%2)/2,w:.5,h:.5});
  const tint=t.type==='stronghold'?'#83b9bf4d':t.type==='bunker'?'#e2c28a66':t.type==='stockade'?'#ab675948':t.type==='fire-step'?'#c6b58480':null;
  poly(ctx,ps,tint);
  // Deck tiles are quiet; the continuous outside rim defines the structure.
  poly(ctx,area(ps,.02,.02,.96,.96),null,t.type==='stronghold'?'#79989b':'#989980');
  const edge=t.type==='stronghold'?'#bbd7cf':t.type==='bunker'?'#f0d297':'#bba786';
  if(x===t.x)poly(ctx,area(ps,0,0,.045,1),edge,'#26353a');
  if(y===t.y)poly(ctx,area(ps,0,0,1,.045),edge,'#26353a');
  if(x+1>=t.x+t.w)poly(ctx,area(ps,.955,0,.045,1),edge,'#26353a');
  if(y+1>=t.y+t.h)poly(ctx,area(ps,0,.955,1,.045),edge,'#26353a');
  for(const [u,v]of [[.1,.1],[.88,.1],[.1,.88],[.88,.88]])poly(ctx,area(ps,u,v,.015,.015),'#c3b887');
  if(t.type==='fire-step'){for(let n=0;n<5;n++)poly(ctx,area(ps,.13,.15+n*.13,.73,.035),'#293032','#e3cd95');for(let n=0;n<6;n++)poly(ctx,area(ps,.1+n*.13,.85,.07,.07),n%2?'#293032':'#ead081');}
 }
 function ground(ctx,ps,x,y){poly(ctx,ps,'#62604d','#30362e');texture(ctx,ps,3,{u:(x%8)/8,v:(y%8)/8,w:1/8,h:1/8});const tint=(x*17+y*13)%7;poly(ctx,ps,tint<2?'#39241415':tint===3?'#bcac7109':null);}
 function rubble(t,project,depth,opacity){
  const jobs=[];for(let i=0;i<7;i++){
   const cx=t.x+.15+(i*37%71)/100,cy=t.y+.14+(i*29%73)/100,rx=.12+(i%3)*.055,ry=.1+(i%2)*.07,z=t.z*(.3+(i%4)*.18);
   const ring=[[cx-rx,cy],[cx-rx*.6,cy-ry],[cx+rx*.7,cy-ry*.7],[cx+rx,cy+ry*.15],[cx+rx*.3,cy+ry],[cx-rx*.8,cy+ry*.65]].map(p=>[Math.max(t.x+.02,Math.min(t.x+t.w-.02,p[0])),Math.max(t.y+.02,Math.min(t.y+t.h-.02,p[1]))]);
   const base=ring.map(p=>project(...p,0)),top=ring.map((p,n)=>project(...p,z*(n%2?.85:1)));
   jobs.push({depth:depth(cx,cy),kind:'rubble',draw(ctx){ctx.save();ctx.globalAlpha=opacity;for(let n=0;n<6;n++){const j=(n+1)%6,face=[top[n],top[j],base[j],base[n]];poly(ctx,face,n%2?'#50554d':'#696b59','#2b322e');texture(ctx,face,3,{u:(i%4)/4,v:(n%4)/4,w:.25,h:.25});poly(ctx,face,n%2?'#10171540':'#eeedbf12');}poly(ctx,top,['#9b9a81','#797d71','#aaa48a'][i%3],'#51594e');ctx.save();poly(ctx,top);ctx.clip();texture(ctx,[top[0],top[2],top[3],top[5]],3,{u:(i%4)/4,v:0,w:.25,h:.25});ctx.restore();const p=project(cx,cy,z);ctx.fillStyle='#d0c5a0';ctx.fillRect(Math.round(p.x),Math.round(p.y),2,1);ctx.restore();}});
  }return jobs;
 }
 function faces(t,project,depth=(x,y)=>project(x,y).y,{opacity=1,topOpacity=opacity}={}){
  if(t.type==='rubble')return rubble(t,project,depth,opacity);
  const jobs=[],baseZ=t.baseZ||0,height=t.z??.6,index=t.type==='stockade'?1:0,lift=baseZ>0?(Math.abs(depth(t.x+1,t.y)-depth(t.x,t.y))+Math.abs(depth(t.x,t.y+1)-depth(t.x,t.y)))/2+.03:0;
  // A raised rail is one occluder: its cap must never sort through its sides.
  const railDepth=t.type==='parapet'?depth(t.x+t.w/2,t.y+t.h/2)+lift:null;
  const deckDepth=null; // Deck ordering is constrained against its own walls below.
  for(let ox=0;ox<t.w;ox++)for(let oy=0;oy<t.h;oy++){
   const x=t.x+ox,y=t.y+oy,w=Math.min(1,t.w-ox),h=Math.min(1,t.h-oy),world=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]],base=world.map(p=>project(...p,baseZ)),top=world.map(p=>project(...p,baseZ+height));
   const dx=depth(x+1,y)-depth(x,y),dy=depth(x,y+1)-depth(x,y);
   for(let i=0;i<4;i++){
    if((i===0&&oy>0)||(i===1&&ox+w<t.w)||(i===2&&oy+h<t.h)||(i===3&&ox>0)||[-dy,dx,dy,-dx][i]<=0)continue;
    const j=(i+1)%4,ps=[top[i],top[j],base[j],base[i]],segment={x:(world[i][0]+world[j][0])/2,y:(world[i][1]+world[j][1])/2};
    jobs.push({depth:deckDepth??railDepth??((depth(...world[i])+depth(...world[j]))/2+lift),kind:t.roofDeck?'deck':t.type==='parapet'?'parapet':'wall',draw(ctx){ctx.save();ctx.globalAlpha=opacity;const mask=t.spiked?[mix(ps[0],ps[3],.25),mix(ps[0],ps[1],.5),mix(ps[1],ps[2],.25),ps[2],ps[3]]:null;if(mask){poly(ctx,mask);ctx.clip();}wall(ctx,ps,t,index,depth(...world[j])>depth(...world[i]),segment);ctx.restore();if(mask)poly(ctx,mask,null,'#9c9872');}});
   }
   if(!t.spiked)jobs.push({depth:deckDepth??railDepth??(Math.max(...world.map(p=>depth(...p)))+.01+lift),kind:t.roofDeck?'deck':t.type==='parapet'?'parapet':'top',draw(ctx){ctx.save();ctx.globalAlpha=topOpacity;roof(ctx,top,t,x,y);ctx.restore();}});
  }
  if(baseZ===0)for(const rail of t.roofCover||[])jobs.push(...faces({...rail,baseZ:rail.z,z:rail.height},project,depth,{opacity,topOpacity}));
  return jobs;
 }
 function sortJobs(jobs){
  const sorted=[...jobs].sort((a,b)=>a.depth-b.depth),groups=new Map();
  sorted.forEach((job,i)=>{if(!job.terrain?.building)return;let g=groups.get(job.terrain);if(!g)groups.set(job.terrain,g={body:[],deck:[],rail:[]});g[job.kind==='deck'?'deck':job.kind==='parapet'?'rail':'body'].push(i);});
  // Painter dependencies for hollow buildings: walls -> deck -> parapets.
  // Without these, distant walls cover the deck, or near deck tiles slice
  // through far parapets. Other scenery keeps its usual camera-depth priority.
  const pending=new Uint32Array(sorted.length),edges=Array.from({length:sorted.length},()=>[]);
  for(const g of groups.values())if(g.deck.length){for(const a of g.body)for(const b of g.deck){edges[a].push(b);pending[b]++;}for(const a of g.deck)for(const b of g.rail){edges[a].push(b);pending[b]++;}}
  const ready=[];pending.forEach((n,i)=>{if(!n)ready.push(i);});const out=[];
  while(ready.length){const i=ready.shift();out.push(sorted[i]);for(const j of edges[i])if(!--pending[j]){let lo=0,hi=ready.length;while(lo<hi){const mid=(lo+hi)>>1;if(ready[mid]<j)lo=mid+1;else hi=mid;}ready.splice(lo,0,j);}}
  if(out.length!==sorted.length)throw new Error('Cyclic building painter dependencies');
  return out;
 }
 return {faces,ground,setAtlas,sortJobs};
})();
