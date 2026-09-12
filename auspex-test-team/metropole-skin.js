/* Samples the supplied artwork onto existing geometry; no collision changes. */
(() => {
 const images={};
 for(const [key,src] of Object.entries(window.MetropoleImages||{})){const img=new Image();img.onload=()=>{images[key]=img;window.IsoTactics?.render();};img.src=src;}
 function face(ctx,dest,source,key='building'){const img=images[key];if(!img)return;
   const [p,q,,s]=source,[a,b,,d]=dest,ux=q[0]-p[0],uy=q[1]-p[1],vx=s[0]-p[0],vy=s[1]-p[1],det=ux*vy-uy*vx;
   if(Math.abs(det)<.001)return;
   const dx=b.x-a.x,dy=b.y-a.y,ex=d.x-a.x,ey=d.y-a.y,A=(dx*vy-ex*uy)/det,B=(dy*vy-ey*uy)/det,C=(ex*ux-dx*vx)/det,D=(ey*ux-dy*vx)/det;
   ctx.save();ctx.beginPath();dest.forEach((v,i)=>i?ctx.lineTo(v.x,v.y):ctx.moveTo(v.x,v.y));ctx.closePath();ctx.clip();ctx.transform(A,B,C,D,a.x-A*p[0]-C*p[1],a.y-B*p[0]-D*p[1]);ctx.drawImage(img,0,0);ctx.restore();
 }
 window.MetropoleSkin={
  ground(ctx,points,x,y){const img=images.ground;if(!img)return;const size=Math.min(96,img.width,img.height),sx=(x*size)%Math.max(size,img.width-size),sy=(y*size)%Math.max(size,img.height-size);face(ctx,points,[[sx,sy],[sx+size,sy],[sx+size,sy+size],[sx,sy+size]],'ground');},
  wall(ctx,points){face(ctx,points,[[215,127],[241,142],[241,263],[215,248]]);},
  roof(ctx,points){face(ctx,points,[[325,26],[460,103],[325,180],[190,103]]);},
  rubble(ctx,t,project){const img=images[t.t==='h'?'heavy':'rubble'];if(!img)return false;
    const corners=[[t.x,t.y],[t.x+t.w,t.y],[t.x+t.w,t.y+t.h],[t.x,t.y+t.h]].map(p=>project(...p));
    const left=Math.min(...corners.map(p=>p.x)),right=Math.max(...corners.map(p=>p.x)),bottom=Math.max(...corners.map(p=>p.y)),width=right-left,height=width*img.height/img.width;
    ctx.drawImage(img,left,bottom-height,width,height);return true;
  }
 };
})();
