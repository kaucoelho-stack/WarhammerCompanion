/* Default isometric presentation; actions are resolved by the existing engine. */
(() => {
  'use strict';
  const style=document.createElement('style');
  style.textContent=`#maptools{display:none!important}#boardwrap{position:relative}
  #iso-stage{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 35%,#354052,#111925 70%);overflow:hidden;z-index:22}
  #iso-stage canvas{width:100%;height:100%;display:block;touch-action:none;image-rendering:pixelated}
  #iso-tools{position:absolute;left:8px;right:8px;top:8px;display:flex;gap:5px;flex-wrap:wrap;pointer-events:none}
  #iso-tools button{pointer-events:auto;background:#172333ed;color:#ffdf9c;border:1px solid #718294;padding:8px;min-width:44px;min-height:44px;border-radius:6px;font:700 12px monospace}
  #iso-info{position:absolute;bottom:7px;left:8px;right:8px;color:#e9ddbb;background:#111b2bea;padding:7px;font:12px monospace;pointer-events:none;text-align:center}
  #boardwrap.iso-active{display:block;overflow:hidden;padding:0;perspective:none;min-height:220px}
  #boardwrap.iso-active>#board,#boardwrap.iso-active>.maplegend,#boardwrap.iso-active>#kzname{display:none}
  @media(max-width:600px),(max-height:540px) and (orientation:landscape){#iso-tools{left:4px;right:4px;top:4px;flex-wrap:nowrap;overflow-x:auto;overscroll-behavior:contain;pointer-events:auto;gap:4px;padding-bottom:4px;scrollbar-width:thin}#iso-tools>*{flex-shrink:0}#iso-tools button{font-size:10px;padding:7px;white-space:nowrap}#iso-info{display:none}#boardwrap.iso-active{min-height:200px}}
  @media(max-height:540px) and (orientation:landscape){#boardwrap.iso-active{min-height:0!important}}`;
  document.head.append(style);
  const stage=document.createElement('div');stage.id='iso-stage';
  stage.innerHTML='<canvas aria-label="Tabuleiro isométrico: toque para selecionar, arraste para mover a câmera"></canvas><div id="iso-tools"><button data-action="rotate-left">↶ GIRAR</button><button data-action="rotate" aria-label="Girar mapa">↻ GIRAR</button><button data-action="cut" aria-pressed="false">RECORTE: OFF</button><button data-action="fit" aria-label="Ver mapa inteiro">VER MAPA</button><button data-action="minus" aria-label="Diminuir zoom">−</button><button data-action="plus" aria-label="Aumentar zoom">+</button></div><div id="iso-info"></div>';
  bw.append(stage);
  const skinButton=document.createElement('button');skinButton.textContent='METROPOLE: ON';skinButton.title='Arte de Starlight Furnace · teste visual da Volkus';skinButton.setAttribute('aria-pressed','true');stage.querySelector('#iso-tools').append(skinButton);
  const canvas=stage.querySelector('canvas'),ctx=canvas.getContext('2d'),info=stage.querySelector('#iso-info');
  const active=true;
  let angle=0,cut=false,scale=1,panX=0,panY=0,unit=18,hits=[],cw=1,ch=1,queued=false;
  let walking=null,hoverCell=null,hoverOperative=null,grid=true,battleFramed=false,mobileFocus=null;
  const mobileView=()=>window.innerWidth<=900;
  const mobileStyle=document.createElement('style');mobileStyle.textContent=`@media(max-width:900px){#iso-tools{left:auto!important;right:8px!important;top:72px!important;bottom:auto;flex-direction:column;overflow:visible!important;width:44px;padding:0;gap:8px;pointer-events:none}#iso-tools>*{display:none!important}#iso-tools button[data-action="rotate"],#iso-tools button[data-action="plus"],#iso-tools button[data-action="minus"]{display:block!important;width:44px;height:44px;min-height:44px;padding:0;border-radius:50%;font-size:18px;pointer-events:auto}#iso-tools button[data-action="rotate"]{font-size:0}#iso-tools button[data-action="rotate"]::after{content:'↻';font-size:22px}#iso-tools button[data-action="fit"]{display:block!important;position:absolute;right:0;top:-64px;width:80px;height:50px;font-size:12px;border-radius:4px}}`;document.head.append(mobileStyle);
  let crowdedOperatives=new Set();
  let metropole=true;
  const useMetropole=()=>metropole&&TERRAIN.some(t=>t.kind==='stronghold')&&!!window.MetropoleSkin;
  skinButton.style.display='none';
  const gridButton=document.createElement('button');gridButton.textContent='GRADE: ON';gridButton.dataset.action='grid';gridButton.setAttribute('aria-pressed','true');stage.querySelector('#iso-tools').append(gridButton);
  const settingsButton=document.createElement('button');settingsButton.textContent='⚙';settingsButton.title='Configurações de áudio';settingsButton.setAttribute('aria-label','Configurações de áudio');settingsButton.setAttribute('aria-haspopup','dialog');settingsButton.onclick=()=>window.AuspexMusic?.settings();stage.querySelector('#iso-tools').append(settingsButton);
  const zoomReadout=document.createElement('span');zoomReadout.style.cssText='padding:10px;color:#e8f6ff;background:#172333ed;font:700 13px monospace';zoomReadout.setAttribute('aria-label','Zoom do mapa');stage.querySelector('#iso-tools').append(zoomReadout);
  const levelControls=document.createElement('div');levelControls.style.cssText='display:none;gap:5px;flex-wrap:wrap;pointer-events:auto';stage.querySelector('#iso-tools').append(levelControls);
  levelControls.onclick=e=>{const level=e.target.dataset.level;if(level===undefined||humanInputLocked())return;hoverCell=null;if(level==='all')showAllMoveLevels();else setMoveLevel(Number(level));schedule();};
  const visibleDestination=c=>G.showAllMoveLevels||(c.z||0)===G.moveLevel;
  const motionPath=path=>typeof AuspexMovementVisual!=='undefined'?AuspexMovementVisual.build(path,TERRAIN):path;
  const floorTexture=new Image();let floorReady=false;floorTexture.onload=()=>{floorReady=true;schedule();};floorTexture.src='modular-floor.png';
  const materials=new Image();let materialsReady=false;materials.onload=()=>{materialsReady=true;schedule();};materials.src='assets/pixel/industrial-materials-v1.png';
  const facings=new Map();let eliminatorFrames=null,captainFrames=null;
  const aodFrames=Object.create(null);let terminalFrames=null;
  const kommandoFrames=Object.create(null);
  const operativeAtlas=o=>{
    const id=o.templateId||o.unitId;
    if(id==='kt-kommando-boy'){
      // Roster order, including incapacitated models, keeps variants stable while moving.
      const boys=G.ops.filter(v=>v.pi===o.pi&&(v.templateId||v.unitId)===id);
      return kommandoFrames['boy'+(Math.max(0,boys.findIndex(v=>v.id===o.id))%2+1)]||null;
    }
    return aodFrames[o.templateId]||aodFrames[o.unitId]||kommandoFrames[id?.replace(/^kt-kommando-/,'')]||null;
  };
  const isCaptain=o=>o.templateId==='kt-aod-captain'||o.unitId==='kt-aod-captain'||(o.teamId==='aod'&&([o.templateId,o.unitId].includes('cap')||/^space marine captain$/i.test(o.n||'')));
  const isEliminator=o=>o.templateId==='kt-aod-eliminator'||/eliminator/i.test(o.n||'')||(o.teamId==='aod'&&[o.templateId,o.unitId].includes('snp'));
  // Rows: southeast, southwest, northwest, northeast in screen space.
  function spriteRow(o){let [dx,dy]=facings.get(o.id)||[o.pi===0?1:-1,0];if(G.sel?.id===o.id&&G.aimTarget){dx=G.aimTarget.x-o.x;dy=G.aimTarget.y-o.y;}
    const origin=rotate(0,0),end=rotate(dx,dy),a=end[0]-origin[0],b=end[1]-origin[1];return a+b>=0?(a-b>=0?0:1):(a-b<0?2:3);
  }
  const loadedSheetSources=new Set();
  function loadEliminator(src=window.AuspexEliminatorSheet,columns=5,onLoaded=atlas=>{eliminatorFrames=atlas;},rows=4){if(!src||loadedSheetSources.has(src))return;loadedSheetSources.add(src);const img=new Image();
    img.onload=()=>{try{const frames=[];let maxHeight=1;
      for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
        const x=Math.round(col*img.width/columns),y=Math.round(row*img.height/rows),w=Math.round((col+1)*img.width/columns)-x,h=Math.round((row+1)*img.height/rows)-y;
        const cv=document.createElement('canvas');cv.width=w;cv.height=h;const cx=cv.getContext('2d',{willReadFrequently:true});cx.drawImage(img,x,y,w,h,0,0,w,h);
        const pixels=cx.getImageData(0,0,w,h),d=pixels.data,seen=new Uint8Array(w*h),queue=new Int32Array(w*h);let head=0,tail=0;
        const visit=i=>{if(i<0||i>=w*h||seen[i])return;seen[i]=1;const p=i*4,mn=Math.min(d[p],d[p+1],d[p+2]),mx=Math.max(d[p],d[p+1],d[p+2]);if(d[p+3]===0||(mn>=185&&mx-mn<=24)){d[p+3]=0;queue[tail++]=i;}};
        for(let px=0;px<w;px++){visit(px);visit((h-1)*w+px);}for(let py=0;py<h;py++){visit(py*w);visit(py*w+w-1);}
        while(head<tail){const i=queue[head++];if(i%w)visit(i-1);if(i%w<w-1)visit(i+1);visit(i-w);visit(i+w);}
        // Uneven source spacing can leave a few pixels from the next cell.
        // Keep the largest connected silhouette, not those edge fragments.
        const groups=new Int32Array(w*h);let group=0,bestGroup=0,bestCount=0;
        for(let seed=0;seed<w*h;seed++){if(groups[seed]||d[seed*4+3]===0)continue;group++;head=0;tail=1;queue[0]=seed;groups[seed]=group;
          while(head<tail){const i=queue[head++],px=i%w,py=Math.floor(i/w);for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++){const nx=px+ox,ny=py+oy;if(nx<0||nx>=w||ny<0||ny>=h)continue;const k=ny*w+nx;if(!groups[k]&&d[k*4+3]){groups[k]=group;queue[tail++]=k;}}}
          if(tail>bestCount){bestCount=tail;bestGroup=group;}
        }
        for(let i=0;i<w*h;i++)if(groups[i]!==bestGroup)d[i*4+3]=0;
        cx.putImageData(pixels,0,0);let left=w,right=0,top=h,bottom=0;
        for(let py=0;py<h;py++)for(let px=0;px<w;px++)if(d[(py*w+px)*4+3]>128){left=Math.min(left,px);right=Math.max(right,px);top=Math.min(top,py);bottom=Math.max(bottom,py);}
        let footLeft=w,footRight=0;for(let py=Math.max(top,bottom-12);py<=bottom;py++)for(let px=left;px<=right;px++)if(d[(py*w+px)*4+3]>128){footLeft=Math.min(footLeft,px);footRight=Math.max(footRight,px);}
        maxHeight=Math.max(maxHeight,bottom-top+1);frames.push({canvas:cv,left,top,width:right-left+1,height:bottom-top+1,pivot:(footLeft+footRight)/2,bottom:bottom+1});
      }
      onLoaded({frames,maxHeight,columns});schedule();
    }catch(error){console.warn('Spritesheet: usando sprite de reserva',error);}};
    img.onerror=()=>console.warn('Não foi possível carregar a spritesheet');img.src=src;
  }
  function visualOperative(o){
    const pending=G.pendingReposition?.op===o?G.pendingReposition.cell:null;
    if(walking?.id===o.id){const elapsed=performance.now()-walking.start,t=Math.min(1,elapsed/walking.duration),distance=(t*t*(3-2*t))*walking.distance;
      let i=0;while(i<walking.path.length-2&&walking.lengths[i+1]<distance)i++;
      const a=walking.path[i],b=walking.path[i+1],f=Math.min(1,(distance-walking.lengths[i])/Math.max(.001,walking.lengths[i+1]-walking.lengths[i]));
      if(b.x!==a.x||b.y!==a.y)facings.set(o.id,[b.x-a.x,b.y-a.y]);
      if(t<1){schedule();return{...o,x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f,z:a.z+(b.z-a.z)*f,stride:Math.sin(elapsed/160*Math.PI/2),walkFrame:1+Math.floor(elapsed/160)%4,walkTick:Math.floor(elapsed/160)};}walking=null;
    }
    return pending?{...o,x:pending.x,y:pending.y,z:pending.z||0}:o;
  }
  const rotate=(x,y)=>angle===0?[x,y]:angle===1?[H-y,x]:angle===2?[W-x,H-y]:[y,W-x];
  function project(x,y,z=0){const [a,b]=rotate(x,y),[ca,cb]=rotate(W/2,H/2);return{x:cw/2+panX+(a-b-ca+cb)*unit,y:ch*.48+panY+(a+b-ca-cb)*unit*.5-z*unit*.85};}
  function poly(points,fill,stroke='#26303f'){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}}
  function tile(x,y,z,fill,stroke){const pts=[[x,y],[x+1,y],[x+1,y+1],[x,y+1]].map(p=>project(...p,z));poly(pts,fill,stroke);return pts;}
  function box(x,y,w,h,z,height,palette){const p=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(v=>project(...v,z)),q=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(v=>project(...v,z+height));
    [0,1,2,3].sort((a,b)=>p[a].y+p[(a+1)%4].y-p[b].y-p[(b+1)%4].y).forEach(i=>{
      const j=(i+1)%4;poly([p[i],p[j],q[j],q[i]],i%2?palette[1]:palette[2]);
      if(height>1&&useMetropole())window.MetropoleSkin.wall(ctx,[q[i],q[j],p[j],p[i]]);
      if(height>1){const rows=Math.ceil(height*2);ctx.strokeStyle='#1c273747';ctx.lineWidth=1;
        for(let row=1;row<rows;row++){const f=row/rows,a={x:p[i].x,y:p[i].y-height*unit*.85*f},b={x:p[j].x,y:p[j].y-height*unit*.85*f};ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
        // Stone relief on the wall face, following the same isometric projection.
        for(let row=0;row<rows;row++){const f=(row+.5)/rows,k=row%2?.3:.65,px=p[i].x+(p[j].x-p[i].x)*k,py=p[i].y+(p[j].y-p[i].y)*k-height*unit*.85*f;ctx.fillStyle=row%3?'#c0ccd022':'#19213133';ctx.fillRect(Math.round(px),Math.round(py),Math.max(1,unit*.12),2);}
      }
    });poly(q,palette[0]);
    if(w>2&&h>2){ctx.strokeStyle='#58697d';for(let tx=x+1;tx<x+w;tx++){const a=project(tx,y,z+height),b=project(tx,y+h,z+height);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}for(let ty=y+1;ty<y+h;ty++){const a=project(x,ty,z+height),b=project(x+w,ty,z+height);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}
    if(w>2&&h>2&&useMetropole())window.MetropoleSkin.roof(ctx,q);
  }
  function label(text,p,color='#fff1c9'){ctx.font='bold '+Math.max(9,Math.min(13,unit*.48))+'px monospace';ctx.textAlign='center';const w=ctx.measureText(text).width;ctx.fillStyle='#101925e8';ctx.fillRect(p.x-w/2-3,p.y-11,w+6,14);ctx.fillStyle=color;ctx.fillText(text,p.x,p.y);}
  function sprite(o){const p=project(o.x+.5,o.y+.5,zOf(o)),s=Math.max(.65,unit/13),palette=o.pi===0?['#20376b','#5388bd','#a3c8e0']:['#384726','#829653','#c5cf89'];
    ctx.save();if(G.pendingReposition?.op.id===o.id)ctx.globalAlpha=.55;ctx.translate(Math.round(p.x),Math.round(p.y));ctx.scale(s,s);ctx.fillStyle='#080d18aa';ctx.beginPath();ctx.ellipse(0,0,8,3,0,0,Math.PI*2);ctx.fill();
    const atlas=operativeAtlas(o)||(isCaptain(o)?captainFrames:(isEliminator(o)?eliminatorFrames:null));
    if(atlas){const row=spriteRow(o),frame=o.walkTick===undefined?(atlas.idleFrames?.[row]||0):1+o.walkTick%(atlas.columns-1),f=atlas.frames[row*atlas.columns+frame],k=(atlas.renderHeight||31)/atlas.maxHeight;
      ctx.drawImage(f.canvas,f.left,f.top,f.width,f.height,(f.left-f.pivot)*k,(f.top-f.bottom)*k,f.width*k,f.height*k);
    }else{
    const rect=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
    const stride=Math.round((o.stride||0)*2),leader=/captain|capit|sergeant|sarg|champion/i.test(o.n);
    if(leader){rect(-8,-19,5,17,'#72353c');rect(-7,-17,2,13,'#aa5950');}
    rect(-6,-9+stride,5,8,palette[0]);rect(2,-9-stride,5,8,palette[0]);rect(-7,-2+stride,6,3,'#141b27');rect(2,-2-stride,6,3,'#141b27');rect(-6,-7+stride,4,3,palette[2]);rect(3,-7-stride,4,3,palette[1]);
    rect(-7,-20,14,12,palette[1]);rect(-10,-20,5,6,palette[2]);rect(6,-20,5,6,palette[2]);rect(-9,-18,3,2,palette[0]);rect(7,-18,3,2,palette[0]);rect(-4,-27,8,8,palette[0]);rect(-3,-26,6,3,palette[2]);rect(-3,-22,2,2,'#ff9b5d');rect(1,-22,2,2,'#ff9b5d');rect(-1,-25,2,6,palette[1]);rect(-4,-17,8,3,'#cfac67');rect(-2,-15,4,4,palette[0]);rect(-7,-10,14,2,'#322d30');rect(-1,-10,3,2,'#e6ba6b');
    const melee=/assault|butcher|duell|fighter|lutador/i.test(o.n),sniper=/sniper|rail|marks/i.test(o.n);
    if(melee){rect(9,-30,2,18,'#e1e4ce');rect(7,-14,6,2,'#ad8256');}else{rect(0,-13,sniper?18:13,4,'#20202a');rect(10,-13,sniper?10:6,2,'#a7acb1');}
    if(/captain|capit|sergeant|sarg|champion/i.test(o.n))rect(-2,-31,4,4,'#f8d774');}
    ctx.restore();
    if(G.sel?.id===o.id||G.aimTarget?.id===o.id){ctx.strokeStyle=G.aimTarget?.id===o.id?'#ff746b':'#ffe08a';ctx.lineWidth=2;ctx.strokeRect(p.x-12*s,p.y-33*s,25*s,37*s);}
    hits.push({type:'op',op:G.ops.find(v=>v.id===o.id)||o,rect:{x:p.x-13*s,y:p.y-33*s,w:26*s,h:38*s}});
  }
  const healthSeen=new WeakMap();let feedback=[];
  function drawFeedback(){
    const now=performance.now(),reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    for(const op of G.ops){
      const previous=healthSeen.get(op);healthSeen.set(op,op.hp);
      if(previous!==undefined&&previous!==op.hp){
        const delta=op.hp-previous;
        feedback.push({op,x:op.x+.5,y:op.y+.5,z:zOf(op),start:now,text:op.hp<=0?'INCAPACITADO':delta>0?`+${delta} PV`:`−${Math.abs(delta)} PV`,color:delta>0?'#94ffd1':'#ffaaa0'});
      }
    }
    feedback=feedback.filter(f=>now-f.start<1100&&G.ops.includes(f.op));
    for(const f of feedback){
      const age=(now-f.start)/1100,p=project(f.x,f.y,f.z);
      ctx.save();ctx.globalAlpha=reduced?1:Math.min(1,(1-age)*3);
      label(f.text,{x:p.x,y:p.y-46-(reduced?0:age*22)},f.color);ctx.restore();
    }
    if(feedback.length)schedule();
  }
  function vitals(o){
    if(crowdedOperatives.has(o.id)&&G.sel?.id!==o.id&&G.aimTarget?.id!==o.id&&hoverOperative!==o.id&&walking?.id!==o.id)return;
    const p=project(o.x+.5,o.y+.5,zOf(o)),s=Math.max(.65,unit/13),w=Math.max(28,25*s),y=p.y-((operativeAtlas(o)?.renderHeight||31)+5)*s;
    const hp=Math.max(0,o.hp),max=Math.max(1,o.maxhp||hp),ratio=Math.min(1,hp/max);
    ctx.fillStyle='#0c1825';ctx.fillRect(p.x-w/2-1,y-1,w+2,7);
    ctx.fillStyle=ratio<=.3?'#ff7772':o.pi===0?'#7be0b2':'#87cfff';ctx.fillRect(p.x-w/2,y,w*ratio,5);
    if(!mobileView())label(`${o.ico||''} ${hp}/${max} · ${o.order==='conceal'?'C':'E'}${o.activated?' ✓':''}`,{x:p.x,y:y-5},o.pi===0?'#ffda89':'#a2ddfa');
    if(walking?.id===o.id){const start=walking.path[0],end=walking.path.at(-1);label(end.z>start.z?'SUBINDO':end.z<start.z?'DESCENDO':'MOVENDO',{x:p.x,y:y-21},'#baffea');}
  }
  function previewPath(){
    if(walking)return {path:walking.path,cost:null};
    const cell=G.pendingReposition?.cell||(hoverCell&&G.moveCells.includes(hoverCell)&&visibleDestination(hoverCell)?hoverCell:null);
    if(!cell||!G.sel)return null;
    const path=movementPath(cell);
    if(path.length===0||path[0].x!==G.sel.x||path[0].y!==G.sel.y||path[0].z!==zOf(G.sel))path.unshift({x:G.sel.x,y:G.sel.y,z:zOf(G.sel)});
    return {path:motionPath(path),cost:cell.d};
  }
  function drawPath(){const preview=previewPath();if(!preview||preview.path.length<2)return;
    const ps=preview.path.map(p=>project(p.x+.5,p.y+.5,p.z||0));ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
    for(const [color,width]of [['#071c2ddd',5],['#9aeed7',2.5]]){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(mobileView()&&!walking?[6,5]:[]);ctx.beginPath();ps.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();}ctx.setLineDash([]);
    ctx.fillStyle='#d0ffe8';for(const p of ps.slice(1)){ctx.beginPath();ctx.arc(p.x,p.y,2.5,0,Math.PI*2);ctx.fill();}
    const end=ps.at(-1);ctx.strokeStyle='#cffff0';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(end.x,end.y,unit*.38,unit*.19,0,0,Math.PI*2);ctx.stroke();
    if(G.pendingReposition){label('ORIGEM',{x:ps[0].x,y:ps[0].y+20},'#c5d4e1');label('PRÉVIA · CONFIRME',{x:end.x,y:end.y+40},'#ffe08a');}
    if(Number.isFinite(preview.cost))label(`${Number(preview.cost.toFixed(1))}″${mobileView()&&G.pendingReposition?' · 1 AP':''}`,{x:end.x,y:end.y+22},'#baffe4');ctx.restore();
  }
  function draw(){if(!active||['killzone','select'].includes(G.phase)||document.body?.classList.contains('setup-screen'))return;cw=Math.max(1,stage.clientWidth);ch=Math.max(1,stage.clientHeight);canvas.width=cw;canvas.height=ch;ctx.imageSmoothingEnabled=false;
    if(!battleFramed&&G.tp===1&&['strategy','firefight'].includes(G.phase)){scale=mobileView()?1.65:1;panX=0;panY=0;battleFramed=true;}
    zoomReadout.textContent=Math.round(scale*100)+'%';
    unit=boardUnit(cw,ch,scale);hits=[];ctx.clearRect(0,0,cw,ch);const jobs=[];
    if(mobileView()&&G.sel&&G.sel.id!==mobileFocus){mobileFocus=G.sel.id;const [a,b]=rotate(G.sel.x+.5,G.sel.y+.5),[ca,cb]=rotate(W/2,H/2);panX=-(a-b-ca+cb)*unit;panY=-(a+b-ca-cb)*unit*.5;}
    if(!G.sel)mobileFocus=null;
    if(mobileView()){
      const overview=stage.querySelector('[data-action="fit"]');
      if(overview){
        let mini='';for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(terrAt(x,y)==='h'||terrAt(x,y)==='l')mini+=`<rect x="${x}" y="${y}" width="1" height="1" fill="#776b5d"/>`;
        mini+=OBJS.map(o=>`<circle cx="${o.x+.5}" cy="${o.y+.5}" r=".7" fill="#d4b07b"/>`).join('');
        mini+=G.ops.filter(o=>!o.dead&&o.x>=0).map(o=>`<circle cx="${o.x+.5}" cy="${o.y+.5}" r="${G.sel===o ? .9 : .55}" fill="${o.pi===0?'#d4b07b':'#df7777'}"/>`).join('');
        overview.innerHTML=`<svg viewBox="0 0 ${W} ${H}" width="68" height="38" aria-hidden="true">${mini}</svg>`;
      }
    }
    const destinationCells=G.pendingReposition?[G.pendingReposition.cell]:G.moveCells;
    const choosingDestination=!!G.pendingReposition||(['reposition','dash','charge','fallback'].includes(G.mode)&&G.moveCells.length>0);
    const chosenHeight=G.pendingReposition?(G.pendingReposition.cell.z||0):(G.moveLevel||0);
    const allHeights=!G.pendingReposition&&G.showAllMoveLevels;
    levelControls.style.display=choosingDestination&&!G.pendingReposition?'flex':'none';
    const levels=[...new Set(G.moveCells.map(c=>c.z||0))].sort((a,b)=>a-b),levelMarkup='<button data-level="all" aria-pressed="'+!!allHeights+'">TODOS OS PISOS</button>'+levels.map(z=>`<button data-level="${z}" aria-pressed="${!allHeights&&chosenHeight===z}">${z?`SUBIR / TOPO ${z}″`:'CHÃO'}</button>`).join('');
    if(levelControls.innerHTML!==levelMarkup)levelControls.innerHTML=levelMarkup;
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const n=(x*17+y*31)%9,deploy=G.phase==='deploy'&&G.deploymentState?.stage==='placing'&&((G.dropZones?.[G.cur]||(G.cur===0?'left':'right'))==='left'?x<4:x>=W-4),road=x>=10&&x<=19,pts=tile(x,y,0,deploy?'#586f4c':road?(n<4?'#424b59':'#4b5663'):n<2?'#535a64':n<5?'#616875':'#687080','#444c5b');
      if(floorReady&&!deploy){const [o,a,,b]=pts;ctx.save();ctx.transform(a.x-o.x,a.y-o.y,b.x-o.x,b.y-o.y,o.x,o.y);ctx.drawImage(floorTexture,x*floorTexture.width/W,y*floorTexture.height/H,floorTexture.width/W,floorTexture.height/H,0,0,1,1);ctx.restore();}
      if(grid)poly(pts,'#ffffff00','#bfccd13d');
      if((x*19+y*11)%13===0){const a=project(x+.25,y+.3),b=project(x+.6,y+.5),c=project(x+.45,y+.8);ctx.strokeStyle='#242e3c';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.stroke();ctx.fillStyle='#aaa598';ctx.fillRect(Math.round(a.x)+2,Math.round(a.y),2,1);}
      if(deploy&&terrAt(x,y)!=='h'&&!occupied(x,y))hits.push({type:'deploy',x,y,points:pts});}
    TERRAIN.forEach(t=>{const pal=t.t==='l'?['#b5a082','#776953','#8d7c62']:['#9ca6b0','#505d6b','#697987'];
      if(useMetropole()&&['heavy-rubble','light-rubble'].includes(t.kind)){jobs.push({depth:project(t.x+t.w/2,t.y+t.h/2).y,draw:()=>{ctx.save();ctx.globalAlpha=choosingDestination?.3:1;if(!window.MetropoleSkin.rubble(ctx,t,project))box(t.x,t.y,t.w,t.h,0,t.z||.7,pal);ctx.restore();}});return;}
      const add=(x,y,w,h,z,height,opacity=1)=>jobs.push({depth:project(x+w/2,y+h/2).y,draw:()=>{ctx.save();ctx.globalAlpha=opacity;box(x,y,w,h,z,height,pal);ctx.restore();}});
      if(t.building){const step=t.floorStep||t.z;
        if(typeof roofRuins==='function'&&!cut)for(const r of roofRuins(t)){
          const depth=Math.max(...[[t.x,t.y],[t.x+t.w,t.y],[t.x,t.y+t.h],[t.x+t.w,t.y+t.h]].map(p=>project(...p).y))+.2;
          jobs.push({depth,draw:()=>{ctx.save();ctx.globalAlpha=choosingDestination?.12:1;box(r.x,r.y,r.w,r.h,r.z,r.height,r.t==='l'?['#b9b0a0','#777568','#949080']:pal);ctx.restore();}});
        }
        const hasDestination=choosingDestination&&destinationCells.some(c=>(c.z||0)===chosenHeight&&c.x>=t.x&&c.x<t.x+t.w&&c.y>=t.y&&c.y<t.y+t.h);
        if(!cut||choosingDestination){for(let z=step;z<=t.z+.001;z+=step){
          const selected=hasDestination&&Math.abs(z-chosenHeight)<.001;
          add(t.x,t.y,t.w,t.h,z-.12,.12,choosingDestination?(selected?.9:.07):1);
        }}
        for(const side of ['n','s','e','w']){if((t.openSides||[]).includes(side))continue;const length=['n','s'].includes(side)?t.w:t.h;
          for(let i=0;i<length;i++){const door=(t.doors||[]).some(d=>d.side===side&&d.offset===i);if(cut&&door)continue;
            const x=t.x+(side==='e'?t.w-.18:['n','s'].includes(side)?i:0),y=t.y+(side==='s'?t.h-.18:['e','w'].includes(side)?i:0);
            add(x,y,['n','s'].includes(side)?1:.18,['e','w'].includes(side)?1:.18,door?1.9:0,(cut?.6:t.z)-(door?1.9:0),choosingDestination?.18:1);}
        }
        if(cut&&!choosingDestination){for(let z=step;z<=t.z+.001;z+=step){const pts=[[t.x,t.y],[t.x+t.w,t.y],[t.x+t.w,t.y+t.h],[t.x,t.y+t.h]].map(p=>project(...p,z));ctx.save();ctx.setLineDash([3,3]);poly(pts,'#8bbadc0b','#c3d7e066');ctx.restore();}}
        if(!choosingDestination||hasDestination){const z=choosingDestination?chosenHeight:t.z,p=project(t.x+t.w/2,t.y+t.h/2,z);jobs.push({depth:1e5,draw:()=>label(choosingDestination?`DESTINO ${z}″`:`${z}″`,p,choosingDestination?'#b8ffd7':'#fff1c9')});}
      }else{
        const showTop=choosingDestination&&t.t==='h'&&!t.noClimb&&(allHeights||Math.abs(chosenHeight-t.z)<.001)&&destinationCells.some(c=>Math.abs((c.z||0)-t.z)<.001&&c.x>=t.x&&c.x<t.x+t.w&&c.y>=t.y&&c.y<t.y+t.h);
        if(typeof AuspexTerrainArt!=='undefined')for(const face of AuspexTerrainArt.faces(t,project,(x,y)=>project(x,y).y,{cut:cut&&!showTop,opacity:choosingDestination&&t.t==='h'?.2:1,topOpacity:showTop?.92:choosingDestination&&t.t==='h'?.2:1,texture:floorReady?floorTexture:null,materials:materialsReady?materials:null}))jobs.push({depth:face.depth,terrain:t,kind:face.kind,draw:()=>face.draw(ctx)});
        else add(t.x,t.y,t.w,t.h,0,cut&&t.t==='h'?.65:t.z||.7,choosingDestination&&t.t==='h'?.2:1);
        if(showTop&&typeof AuspexTerrainArt==='undefined')add(t.x,t.y,t.w,t.h,t.z-.12,.12,.9);
      }
    });
    const visibleOps=G.ops.filter(o=>o.x>=0&&!o.dead).map(visualOperative);
    crowdedOperatives=new Set();
    const heads=visibleOps.map(o=>{const p=project(o.x+.5,o.y+.5,zOf(o)),s=Math.max(.65,unit/13);return{id:o.id,x:p.x,y:p.y-((operativeAtlas(o)?.renderHeight||31)+5)*s};});
    for(let i=0;i<heads.length;i++)for(let j=i+1;j<heads.length;j++)if(Math.abs(heads[i].x-heads[j].x)<85&&Math.abs(heads[i].y-heads[j].y)<28){crowdedOperatives.add(heads[i].id);crowdedOperatives.add(heads[j].id);}
    visibleOps.forEach(o=>{const support=TERRAIN.find(t=>zOf(o)>0&&zOf(o)>=t.z-.001&&o.x+.5>=t.x&&o.x+.5<t.x+t.w&&o.y+.5>=t.y&&o.y+.5<t.y+t.h);let depth=project(o.x+.5,o.y+.5).y+.5;
      if(support){
        depth=project(o.x+.5,o.y+.5).y+unit*.5+.1;
        // Supporting solid is below the feet, but its rails retain their local
        // depth: near rails obscure feet; far rails stay behind the operative.
        for(const job of jobs)if(job.terrain===support&&job.kind!=='parapet')job.depth=Math.min(job.depth,depth-.02);
      }
      jobs.push({depth,draw:()=>sprite(o)});});
    OBJS.forEach((o,i)=>jobs.push({depth:project(o.x+.5,o.y+.5).y+.6,draw:()=>{
      const p=project(o.x+.5,o.y+.5),scores=typeof objectiveControl==='function'?objectiveControl(o):[0,0],disputed=scores[0]>0&&scores[0]===scores[1],color=disputed?'#ff776d':scores[0]>scores[1]?'#ffd17a':scores[1]>scores[0]?'#83dfff':'#d6ba68';
      ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y));const s=Math.max(.65,unit/15);ctx.scale(s,s);
      const rect=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
      if(terminalFrames){const f=terminalFrames.frames[angle],k=27/terminalFrames.maxHeight;ctx.drawImage(f.canvas,f.left,f.top,f.width,f.height,(f.left-f.pivot)*k,(f.top-f.bottom)*k,f.width*k,f.height*k);rect(-7,1,14,2,color);}
      else{rect(-10,-3,20,6,'#101927');rect(-8,-5,16,5,'#77808c');rect(-6,-14,12,10,'#344658');rect(-6,-16,12,3,'#9ba8ad');rect(-4,-13,8,5,color);rect(-3,-12,5,1,'#ecffe1');rect(-3,-5,6,2,'#c6aa68');rect(7,-24,2,20,'#919aa7');rect(6,-25,4,3,color);}
      if(disputed){rect(-1,-23,2,4,color);rect(-1,-18,2,1,color);}ctx.restore();
      if(G.sel){ctx.strokeStyle=color+'70';ctx.lineWidth=1;ctx.setLineDash([3,4]);ctx.beginPath();ctx.ellipse(p.x,p.y,unit*3,unit*1.5,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
      label('OBJ '+(i+1)+' · '+scores.join(':'),{x:p.x,y:p.y+20},color);
    }}));
    for(const breach of G.breaches||[])jobs.push({depth:project(breach.x+.5,breach.y+.5).y+1,draw:()=>{const p=project(breach.x+.5,breach.y+.5);ctx.fillStyle='#db956d';ctx.fillRect(p.x-4,p.y-10,8,8);label('BREACH',{x:p.x,y:p.y+8},'#ffd0a0');}});
    for(const smoke of G.smoke||[])jobs.push({depth:project(smoke.x+.5,smoke.y+.5,smoke.z).y+1,draw:()=>{
      const p=project(smoke.x+.5,smoke.y+.5,smoke.z);ctx.save();ctx.globalAlpha=.42;ctx.fillStyle='#b8b7ad';
      for(const [x,y,w,h]of[[-20,-12,40,16],[-12,-23,25,20],[-25,-4,48,10]])ctx.fillRect(p.x+x*unit/15,p.y+y*unit/15,w*unit/15,h*unit/15);
      ctx.restore();label('SMOKE',{x:p.x,y:p.y+12},'#dedbd1');
    }});
    jobs.sort((a,b)=>a.depth-b.depth).forEach(j=>j.draw());
    const destinations=G.moveCells.filter(visibleDestination).sort((a,b)=>project(a.x+.5,a.y+.5).y-project(b.x+.5,b.y+.5).y||(a.z||0)-(b.z||0));
    destinations.forEach(c=>{const pts=tile(c.x,c.y,c.z||0,c.z>0?'#56dce18a':'#77dca85a',c.z>0?'#bdffff':'#b8ffd7');hits.push({type:'move',cell:c,points:pts});});
    if(choosingDestination)TERRAIN.filter(t=>t.t==='h'&&!t.noClimb&&destinations.some(c=>c.z===t.z&&c.x>=t.x&&c.x<t.x+t.w&&c.y>=t.y&&c.y<t.y+t.h)).forEach(t=>label(`TOPO ${t.z}″`,project(t.x+t.w/2,t.y+t.h/2,t.z), '#baffe4'));
    drawPath();visibleOps.forEach(vitals);drawFeedback();
    if(G.sel&&G.mode==='shoot'){(G.aimTarget?[G.aimTarget]:G.targets).forEach(o=>{const a=project(G.sel.x+.5,G.sel.y+.5,zOf(G.sel)+1),b=project(o.x+.5,o.y+.5,zOf(o)+1);ctx.strokeStyle='#ffd37c';ctx.lineWidth=2;ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.setLineDash([]);});}
    info.textContent=choosingDestination?`DESTINO: ${allHeights?'CHÃO + TOPOS':chosenHeight===0?'CHÃO / INTERIOR':chosenHeight+'″'} · Suba pelas aberturas entre as muretas · Prévia mostra o custo total`:`PÁTIO DE FERRO · 30 × 22 | ${cut?'Recorte apenas visual':'28 estruturas · 4 topos com cobertura · 3 objetivos'} | Arraste / pinça · C: Conceal · E: Engage`;
    if(G.ops.some(o=>o.teamId==='kom'))info.textContent+=` | Artes Kommandos: ${Object.keys(kommandoFrames).length}/12${!window.AuspexKommandoSheets?' — arquivo não carregado; atualize a página':''}`;
  }
  function boardUnit(width,height,zoom){
    // Keep the usual framing, but permit smaller tiles when browser chrome and
    // the host header leave less than 220px for the actual canvas.
    const minimum=height<220?1:5;
    return Math.max(minimum,Math.min((width-36)/(W+H),(height-100)/((W+H)*.5+7)))*zoom;
  }
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;draw();});}
  function fit(){scale=1;panX=0;panY=0;if(mobileView())mobileFocus=G.sel?.id||null;schedule();}
  stage.querySelector('#iso-tools').onclick=e=>{const a=e.target.dataset.action;if(a==='rotate'||a==='rotate-left'){angle=(angle+(a==='rotate'?1:3))%4;hoverCell=null;api.center(G.sel?.x??(W-1)/2,G.sel?.y??(H-1)/2);}if(a==='cut'){cut=!cut;e.target.textContent='RECORTE: '+(cut?'ON':'OFF');e.target.setAttribute('aria-pressed',String(cut));schedule();}if(a==='grid'){grid=!grid;gridButton.textContent='GRADE: '+(grid?'ON':'OFF');gridButton.setAttribute('aria-pressed',String(grid));schedule();}if(a==='fit')fit();if(a==='plus')api.zoom(1.2);if(a==='minus')api.zoom(1/1.2);};
  function contains(p,points){let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)inside=!inside;}return inside;}
  function click(x,y){if(humanInputLocked())return;const hit=[...hits].reverse().find(h=>h.rect?x>=h.rect.x&&x<=h.rect.x+h.rect.w&&y>=h.rect.y&&y<=h.rect.y+h.rect.h:contains({x,y},h.points));if(!hit)return;
    if(hit.type==='deploy')deployAt(hit.x,hit.y);if(hit.type==='move')doMove(hit.cell.x,hit.cell.y,hit.cell.z||0);
    if(hit.type==='op'){const o=hit.op;if(G.mode==='fight'&&G.targets.includes(o))doFight(o);else selectOp(o);}
  }
  const pointers=new Map();let gesture=null;
  canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});gesture={x:e.clientX,y:e.clientY,moved:pointers.size>1};});
  canvas.addEventListener('pointermove',e=>{
    const old=pointers.get(e.pointerId);
    if(!old||!gesture){const rect=canvas.getBoundingClientRect(),p={x:e.clientX-rect.left,y:e.clientY-rect.top};const next=humanInputLocked()?null:[...hits].reverse().find(h=>h.type==='move'&&contains(p,h.points))?.cell||null;if(next!==hoverCell){hoverCell=next;schedule();}return;}
    hoverCell=null;
    const other=[...pointers.entries()].find(([id])=>id!==e.pointerId)?.[1];
    if(other){
      const before=Math.hypot(old.x-other.x,old.y-other.y),after=Math.hypot(e.clientX-other.x,e.clientY-other.y);
      if(before>10)scale=Math.max(.7,Math.min(5,scale*after/before));
      if(mobileView()&&before>20&&after>20){
        let delta=Math.atan2(e.clientY-other.y,e.clientX-other.x)-Math.atan2(old.y-other.y,old.x-other.x);
        if(delta>Math.PI)delta-=Math.PI*2;if(delta<-Math.PI)delta+=Math.PI*2;
        gesture.rotation=(gesture.rotation||0)+delta;
        if(Math.abs(gesture.rotation)>Math.PI/3){angle=(angle+(gesture.rotation>0?1:3))%4;gesture.rotation=0;api.center(G.sel?.x??(W-1)/2,G.sel?.y??(H-1)/2);}
      }
      gesture.moved=true;
    }else{
      const crossed=Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>(mobileView()?8:6);
      if(!mobileView()||gesture.moved||crossed){panX+=e.clientX-(!mobileView()||gesture.moved?old.x:gesture.x);panY+=e.clientY-(!mobileView()||gesture.moved?old.y:gesture.y);}
      if(crossed)gesture.moved=true;
    }
    pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});schedule();
  });
  canvas.addEventListener('pointerleave',()=>{hoverCell=null;hoverOperative=null;schedule();});
  canvas.addEventListener('pointermove',e=>{if(pointers.size)return;const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;const next=[...hits].reverse().find(h=>h.type==='op'&&h.rect&&x>=h.rect.x&&x<=h.rect.x+h.rect.w&&y>=h.rect.y&&y<=h.rect.y+h.rect.h)?.op.id||null;if(next!==hoverOperative){hoverOperative=next;schedule();}});
  let lastMobileTap=null;
  canvas.addEventListener('pointerup',e=>{
    pointers.delete(e.pointerId);
    if(gesture&&!gesture.moved){
      const now=performance.now(),previous=lastMobileTap;
      const canFit=mobileView()&&!G.mode&&!G.pendingReposition&&!humanInputLocked();
      if(canFit&&previous&&now-previous.time<300&&Math.hypot(e.clientX-previous.x,e.clientY-previous.y)<24){lastMobileTap=null;fit();}
      else{lastMobileTap=canFit?{time:now,x:e.clientX,y:e.clientY}:null;const r=canvas.getBoundingClientRect();click(e.clientX-r.left,e.clientY-r.top);}
    }else lastMobileTap=null;
    if(!pointers.size)gesture=null;
  });
  canvas.addEventListener('pointercancel',()=>{pointers.clear();gesture=null;lastMobileTap=null;hoverCell=null;schedule();});
  canvas.addEventListener('lostpointercapture',e=>{if(pointers.has(e.pointerId)){pointers.clear();gesture=null;lastMobileTap=null;}});
  let previousLandscape=(window.innerWidth||stage.clientWidth)>(window.innerHeight||stage.clientHeight);
  function resizeBoard(){
    const landscape=(window.innerWidth||stage.clientWidth)>(window.innerHeight||stage.clientHeight);
    if(landscape!==previousLandscape){
      scale=1;panX=0;panY=0;hoverCell=null;if(typeof mobileFocus!=='undefined')mobileFocus=null;
      if(window.innerWidth<=900){pointers.clear();gesture=null;lastMobileTap=null;}
      previousLandscape=landscape;
    }
    schedule();
  }
  canvas.addEventListener('wheel',e=>{e.preventDefault();api.zoom(e.deltaY<0?1.1:1/1.1);},{passive:false});new ResizeObserver(resizeBoard).observe(bw);
  const api=window.IsoTactics={get active(){return active;},render:draw,zoom(f){scale=Math.max(.7,Math.min(5,scale*f));schedule();},center(x,y){const [a,b]=rotate(x+.5,y+.5),[ca,cb]=rotate(W/2,H/2);panX=-(a-b-ca+cb)*unit;panY=-(a+b-ca-cb)*unit*.5;schedule();}};
  api.fit=fit;
  api.toggleGrid=()=>{grid=!grid;gridButton.textContent='GRADE: '+(grid?'ON':'OFF');gridButton.setAttribute('aria-pressed',String(grid));schedule();};
  api.toggleCut=()=>{cut=!cut;const button=stage.querySelector('[data-action="cut"]');if(button){button.textContent='RECORTE: '+(cut?'ON':'OFF');button.setAttribute('aria-pressed',String(cut));}schedule();};
  api.walk=(op,path)=>{if(path.length<2)path=[{x:op.x,y:op.y,z:op.z||0},...path];path=motionPath(path);if(path.length<2)return;const lengths=[0];for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i];lengths.push(lengths[i-1]+Math.hypot(b.x-a.x,b.y-a.y,b.z-a.z));}const distance=lengths.at(-1);walking={id:op.id,path,lengths,distance,start:performance.now(),duration:Math.min(6500,Math.max(900,distance*450))};schedule();};
  api.walkRemaining=()=>walking?Math.max(0,walking.duration-(performance.now()-walking.start)):0;
  api.stopWalk=()=>{walking=null;schedule();};
  bw.classList.toggle('iso-active',true);fit();
  api.loadSprites=()=>{
  loadEliminator();if(window.AuspexCaptainSheet)loadEliminator(window.AuspexCaptainSheet,6,atlas=>{captainFrames=atlas;});
  for(const [id,src]of Object.entries(window.AuspexAodSheets||{}))loadEliminator(src,6,atlas=>{aodFrames['kt-aod-'+id]=atlas;});
  for(const [id,sheet]of Object.entries(window.AuspexKommandoSheets||{}))loadEliminator(sheet.src,sheet.columns,atlas=>{
    // Find the planted stance separately in each directional row; source columns
    // are not a guaranteed idle/walk convention. Ignore isolated outline pixels.
    const idleFrames=[];
    for(let row=0;row<4;row++){
      let best=-1;
      for(let col=0;col<atlas.columns;col++){
        const f=atlas.frames[row*atlas.columns+col],w=f.canvas.width,d=f.canvas.getContext('2d').getImageData(0,0,w,f.canvas.height).data;
        let contact=f.bottom-1;
        for(;contact>f.top;contact--){let count=0;for(let x=f.left;x<f.left+f.width;x++)if(d[(contact*w+x)*4+3]>128)count++;if(count>=f.width*.08)break;}
        f.bottom=contact+1;
        let left=w,right=0,count=0;
        for(let y=Math.max(f.top,contact-7);y<=contact;y++)for(let x=f.left;x<f.left+f.width;x++)if(d[(y*w+x)*4+3]>128){left=Math.min(left,x);right=Math.max(right,x);count++;}
        f.pivot=(left+right)/2;
        const score=(right-left)*Math.min(1,count/Math.max(1,(right-left)*4));
        if(score>best){best=score;idleFrames[row]=col;}
      }
    }
    kommandoFrames[id]={...atlas,idleFrames,renderHeight:sheet.renderHeight};
  });
  if(window.AuspexTerminalSheet)loadEliminator(window.AuspexTerminalSheet,4,atlas=>{terminalFrames=atlas;},1);
  };
  api.loadSprites();
})();
