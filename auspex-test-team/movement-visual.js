/* Visual waypoints only. The rule path retains its original inch/AP cost. */
const AuspexMovementVisual=(()=>{
  const EPS=1e-6,CLEARANCE=.18;
  const lerp=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:a.z+(b.z-a.z)*t});
  function groundedPose(p,terrain){
    const pose={x:p.x,y:p.y,z:p.z||0};
    const under=terrain.find(t=>pose.x+.5>=t.x&&pose.x+.5<t.x+t.w&&pose.y+.5>=t.y&&pose.y+.5<t.y+t.h);
    // Low barriers are vaultable, not a hole through which the sprite can walk.
    if(under&&!under.noClimb&&!under.building&&pose.z<(under.z||.6))pose.z=(under.z||.6)+.08;
    return pose;
  }
  function build(path,terrain=[]){
    if(!path.length)return[];
    const result=[],push=p=>{const last=result.at(-1);if(!last||Math.hypot(last.x-p.x,last.y-p.y,last.z-p.z)>EPS)result.push({...p});};
    let a=groundedPose(path[0],terrain);push(a);
    for(const raw of path.slice(1)){
      const b=groundedPose(raw,terrain),rise=b.z-a.z,span=Math.hypot(b.x-a.x,b.y-a.y);
      if(Math.abs(rise)>EPS&&span>EPS){
        // Reach the ledge while still outside its volume. Lift vertically there,
        // then step onto the top; descent reverses exactly the same sequence.
        const margin=Math.min(.49,CLEARANCE/Math.max(Math.abs(b.x-a.x),Math.abs(b.y-a.y))),f=rise>0?.5-margin:.5+margin;
        const edge=lerp(a,b,f);push({...edge,z:a.z});push({...edge,z:b.z});
      }
      push(b);a=b;
    }
    return result;
  }
  function measure(path){const lengths=[0];for(let i=1;i<path.length;i++)lengths.push(lengths.at(-1)+Math.hypot(path[i].x-path[i-1].x,path[i].y-path[i-1].y,path[i].z-path[i-1].z));return lengths;}
  function sample(path,lengths,distance){
    if(path.length<2)return path[0]||null;
    let i=0;while(i<path.length-2&&lengths[i+1]<distance)i++;
    return lerp(path[i],path[i+1],Math.max(0,Math.min(1,(distance-lengths[i])/Math.max(EPS,lengths[i+1]-lengths[i]))));
  }
  return {build,measure,sample};
})();
if(typeof module!=='undefined')module.exports=AuspexMovementVisual;
