/* Pixel materials on rule geometry, not oversized scenery sprites. Each face
   rotates with its footprint and sorts locally against nearby operatives. */
const AuspexTerrainArt=(()=>{
  function polygon(ctx,ps,fill,stroke){ctx.beginPath();ps.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.7;ctx.stroke();}}
  function inset(ps,f){const c={x:ps.reduce((n,p)=>n+p.x,0)/ps.length,y:ps.reduce((n,p)=>n+p.y,0)/ps.length};return ps.map(p=>({x:p.x+(c.x-p.x)*f,y:p.y+(c.y-p.y)*f}));}
  // Atlas materials are flat. All perspective comes from the playable model.
  function material(ctx,ps,atlas,index){
    if(!atlas)return;
    const [o,a,,b]=ps,size=atlas.width/2,sy=atlas.height/2;
    ctx.save();ctx.imageSmoothingEnabled=false;
    ctx.transform(a.x-o.x,a.y-o.y,b.x-o.x,b.y-o.y,o.x,o.y);
    ctx.drawImage(atlas,index%2*size,Math.floor(index/2)*sy,size,sy,0,0,1,1);ctx.restore();
  }
  function faces(t,project,depth,{cut=false,opacity=1,texture=null,materials=null,topOpacity=opacity}={}){
    const jobs=[],kind=t.type||(t.t==='l'?'cover':'wall'),baseZ=t.baseZ||0;
    const height=cut&&t.z>1?.65:t.z;
    // Rails share the depth lift of roof operatives: near rails hide their feet,
    // far rails do not. Absolute axis derivatives work in all four rotations.
    const d0=depth(t.x,t.y),lift=baseZ>0?(Math.abs(depth(t.x+1,t.y)-d0)+Math.abs(depth(t.x,t.y+1)-d0))/2+.03:0;
    for(let ox=0;ox<t.w;ox++)for(let oy=0;oy<t.h;oy++){
      const x=t.x+ox,y=t.y+oy,w=Math.min(1,t.w-ox),h=Math.min(1,t.h-oy);
      const world=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]],base=world.map(p=>project(...p,baseZ)),top=world.map(p=>project(...p,baseZ+height));
      for(let i=0;i<4;i++){
        if((i===0&&oy>0)||(i===1&&ox+w<t.w)||(i===2&&oy+h<t.h)||(i===3&&ox>0))continue;
        const j=(i+1)%4,ps=[top[i],top[j],base[j],base[i]],d=(depth(...world[i])+depth(...world[j]))/2+lift;
        const facing=depth(...world[j])-depth(...world[i]);
        jobs.push({depth:d,kind,draw(ctx){ctx.save();ctx.globalAlpha=opacity;
          polygon(ctx,ps,'#3d5562','#101e28');
          if(materials){
            material(ctx,ps,materials,kind==='crate'?2:kind==='cover'||kind==='parapet'?1:0);
            polygon(ctx,ps,facing>0?'#07172144':'#7495ae12','#101e28');
          }else polygon(ctx,inset(ps,.14),kind==='crate'?'#485957':'#476171','#182d38');
          const u=(a,b,f)=>({x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f});
          // Painted metal binding stays within the same solid volume.
          if(kind!=='parapet'){
            const strip=[u(ps[0],ps[1],.06),u(ps[0],ps[1],.14),u(ps[3],ps[2],.14),u(ps[3],ps[2],.06)];
            polygon(ctx,strip,'#273843c9','#162430');
            for(const q of [.04,.82])polygon(ctx,[u(strip[0],strip[3],q),u(strip[1],strip[2],q),u(strip[1],strip[2],q+.12),u(strip[0],strip[3],q+.12)],'#bf9956','#71572e');
          }
          ctx.strokeStyle=facing>0?'#64747e':'#a4b3b5';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(ps[0].x,ps[0].y);ctx.lineTo(ps[1].x,ps[1].y);ctx.stroke();
          ctx.restore();}});
      }
      jobs.push({depth:Math.max(...world.map(p=>depth(...p)))+.01+lift,kind,draw(ctx){ctx.save();ctx.globalAlpha=topOpacity;
        polygon(ctx,top,kind==='cover'||kind==='parapet'?'#ba9752':'#7c9099','#172b36');
        if(materials){
          material(ctx,top,materials,kind==='crate'?2:3);
          if(kind!=='platform')polygon(ctx,top,kind==='cover'||kind==='parapet'?'#cfaa5966':'#8aa6b13a','#162c36');
          else polygon(ctx,top,null,'#182d39');
        }else if(texture&&kind==='platform'){
          const [o,a,,b]=top;ctx.save();ctx.transform(a.x-o.x,a.y-o.y,b.x-o.x,b.y-o.y,o.x,o.y);
          ctx.drawImage(texture,x*texture.width/30,y*texture.height/22,w*texture.width/30,h*texture.height/22,0,0,1,1);ctx.restore();
          polygon(ctx,top,'#c2dee013','#adbec077');
        }else polygon(ctx,inset(top,.18),kind==='cover'?'#ddba69':'#536e7b','#a7b9b54d');
        ctx.restore();}});
    }
    if(!cut)for(const rail of t.roofCover||[])jobs.push(...faces({...rail,baseZ:rail.z,z:rail.height},project,depth,{materials,opacity:Math.max(opacity,.72)}));
    return jobs;
  }
  return {faces};
})();
if(typeof module!=='undefined')module.exports=AuspexTerrainArt;
