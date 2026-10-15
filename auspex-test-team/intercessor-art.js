/* Reuse approved pilot assets. Left views are only runtime horizontal flips. */
(()=>{const W=window,recipes={shot:['marine-bolter-v1',W.AuspexBolterAtlas],walk:['marine-walk-v2',W.AuspexWalkAtlas],hit:['marine-impact-v2',W.AuspexImpactAtlas],rear:['marine-rear-v1',W.AuspexRearAtlas],crouch:['marine-rear-conceal-v1',W.AuspexRearConcealAtlas],rearwalk:['marine-rear-walk-v1',W.AuspexRearWalkAtlas],leftstep:['marine-rear-left-steps-v2',W.AuspexRearLeftStepsAtlas],rearshot:['marine-rear-bolter-v1',W.AuspexRearBolterAtlas],rearhit:['marine-rear-impact-v1',W.AuspexRearImpactAtlas],fists:['intercessor-fists-v1',W.AuspexAssaultDirections?.fists],stance:['marine-stance-v2',null]},images={};let failed=false,notify=()=>{};
const ready=()=>!failed&&Object.keys(recipes).every(id=>images[id]?.loaded&&(id==='stance'||recipes[id][1]?.frames?.length));
function pose(view,kind,index=0){const rear=view==='ne'||view==='nw',mirror=view==='sw'||view==='nw';let id=rear?'rear':'shot',frame=0;
 if(kind==='conceal'){id=rear?'crouch':'stance';frame=rear?0:2;}else if(kind==='walk'){if(rear){const map=[[0,0],[0,1],[0,2],[1,0],[1,1],[0,3]],part=map[index%6];id=part[0]?'leftstep':'rearwalk';frame=part[1];}else{id='walk';frame=index%6;}}
 else if(kind==='shoot'){frame=index%6;id=rear?'rearshot':'shot';if(rear&&(frame===0||frame===5)){id='rear';frame=0;}}
 else if(kind==='hit'){frame=index%6;id=rear?'rearhit':'hit';if(frame===0||frame===5){id=rear?'rear':'shot';frame=0;}}
 else if(kind==='fight'){id='fists';frame=(rear?3:0)+index%3;}
 let atlas=recipes[id][1];if(id==='stance'){const im=images.stance,cell=im.width/3;atlas={referenceHeight:655,frames:[0,1,2].map(i=>({sx:i*cell,sy:0,w:cell,h:im.height,pivotX:cell/2,footY:694}))};}
 return {image:images[id],atlas,frame:atlas?.frames?.[frame],index:frame,id,mirror};}
W.AuspexIntercessorArt={ready,pose,setScheduler(fn){notify=fn;}};
for(const [id,[name,atlas]]of Object.entries(recipes)){const im=new Image();images[id]=im;im.onload=()=>{im.loaded=true;notify();};im.onerror=()=>{failed=true;notify();};im.src='assets/'+name+'.png';}
})();
