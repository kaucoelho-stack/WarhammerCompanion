/* Shared, grid-aligned scenery. Both the laboratory and the playable alpha
   consume this data; visual rotation never changes world coordinates. */
const AuspexBattlefield=(()=>{
  const W=30,H=22;
  const west=[
    {x:4,y:4,w:1,h:6,z:3,type:'wall',noClimb:true},
    {x:5,y:4,w:5,h:1,z:3,type:'wall',noClimb:true},
    {x:9,y:5,w:1,h:4,z:3,type:'wall',noClimb:true},
    {x:5,y:9,w:2,h:1,z:3,type:'wall',noClimb:true},
    {x:8,y:9,w:2,h:1,z:3,type:'wall',noClimb:true},
    {x:12,y:3,w:4,h:3,z:2,type:'platform'},
    {x:4,y:17,w:3,h:3,z:2,type:'platform'},
    {x:13,y:9,w:4,h:1,z:3,type:'wall'},
    {x:17,y:4,w:1,h:3,z:3,type:'wall'},
    {x:5,y:14,w:3,h:1,z:.6,type:'cover'},
    {x:8,y:18,w:3,h:1,z:.6,type:'cover'},
    {x:9,y:12,w:1,h:2,z:.6,type:'cover'},
    {x:6,y:12,w:2,h:1,z:1,type:'crate'},
    {x:11,y:11,w:1,h:2,z:1.2,type:'crate'}
  ];
  const pieces=[...west,...west.map(p=>({...p,x:W-p.x-p.w,y:H-p.y-p.h}))]
    .map((p,i)=>({...p,id:'yard-'+i}));
  // Corner parapets share their exact volumes with shooting and rendering.
  // The middle of EVERY edge stays open: normal climbs never pass through a rail.
  for(const p of pieces.filter(p=>p.type==='platform')){
    p.roofCover=[];
    for(const side of ['n','e','s','w']){
      const horizontal=side==='n'||side==='s',length=horizontal?p.w:p.h;
      for(const offset of [0,length-1])p.roofCover.push({
        x:p.x+(horizontal?offset:side==='e'?p.w-.18:0),
        y:p.y+(!horizontal?offset:side==='s'?p.h-.18:0),
        w:horizontal?1:.18,h:horizontal?.18:1,z:p.z,height:.65,
        t:'l',type:'parapet',side,offset,parent:p.id
      });
    }
  }
  // One central floor tile, plus one objective inside each enclosed ruin.
  const objectives=[{x:14.5,y:10.5},{x:7,y:7},{x:22,y:14}];
  const terrain=pieces.map(p=>({...p,t:p.type==='cover'?'l':'h'}));
  return {W,H,pieces,terrain,objectives,name:'Pátio de ferro',version:3};
})();
if(typeof module!=='undefined')module.exports=AuspexBattlefield;
