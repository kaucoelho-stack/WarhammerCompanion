(function(){
  'use strict';
  const T=window.THREE;
  if(!T){window.Volkus3D={available:false,error:'Three.js não carregou'};return;}

  const S={renderer:null,scene:null,camera:null,canvas:null,world:null,units:null,markers:null,particles:null,
    viewer:null,data:null,raf:0,clock:new T.Clock(),ready:false,loading:false,closed:true,unitMeshes:[],occluders:[],
    textureCache:{},modelCache:{},focusId:null,focusTick:0,quality:1,unitMask:null,statusTimer:0};
  const BASE='volkus-3d/';
  const texLoader=new T.TextureLoader(),gltfLoader=T.GLTFLoader?new T.GLTFLoader():null;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const setStatus=(msg,progress)=>{
    const el=document.getElementById('fp-3d-loading');if(!el)return;
    el.querySelector('b').textContent=msg;
    el.querySelector('i').style.width=`${clamp(progress||0,0,100)}%`;
    el.classList.toggle('done',progress>=100);
    clearTimeout(S.statusTimer);
    if(progress>=100)S.statusTimer=setTimeout(()=>el.classList.add('hidden'),720);
  };
  const loadTex=(url,srgb=false,repeat=null)=>new Promise(resolve=>{
    if(S.textureCache[url])return resolve(S.textureCache[url]);
    texLoader.load(url,t=>{if(srgb)t.encoding=T.sRGBEncoding;if(repeat){t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(repeat[0],repeat[1]);}
      t.anisotropy=Math.min(8,S.renderer?.capabilities.getMaxAnisotropy?.()||1);S.textureCache[url]=t;resolve(t);},undefined,()=>resolve(null));
  });
  const loadModel=url=>new Promise(resolve=>{
    if(S.modelCache[url])return resolve(S.modelCache[url]);if(!gltfLoader)return resolve(null);
    gltfLoader.load(url,g=>{S.modelCache[url]=g.scene;resolve(g.scene);},undefined,()=>resolve(null));
  });
  const addUV2=g=>{if(g.attributes.uv&&!g.attributes.uv2)g.setAttribute('uv2',new T.BufferAttribute(g.attributes.uv.array,2));return g;};
  const mat=(color,rough=.78,metal=.08)=>new T.MeshStandardMaterial({color,roughness:rough,metalness:metal});
  function box(parent,w,h,d,x,y,z,material,opts={}){
    const m=new T.Mesh(addUV2(new T.BoxGeometry(w,h,d,opts.sx||1,opts.sy||1,opts.sz||1)),material);
    m.position.set(x,y,z);m.castShadow=opts.shadow!==false;m.receiveShadow=true;m.userData.solid=opts.solid!==false;
    parent.add(m);if(m.userData.solid)S.occluders.push(m);return m;
  }
  function textSprite(text,color='#9feaff',scale=1){
    const c=document.createElement('canvas'),x=c.getContext('2d');c.width=512;c.height=96;
    x.font='700 28px Rajdhani,Arial';x.textAlign='center';x.textBaseline='middle';
    x.fillStyle='#02070ddd';x.strokeStyle=color;x.lineWidth=2;x.beginPath();x.roundRect?.(3,3,506,90,9);x.fill();x.stroke();
    x.fillStyle=color;x.shadowColor=color;x.shadowBlur=8;x.fillText(text,256,49);
    const tx=new T.CanvasTexture(c);tx.encoding=T.sRGBEncoding;const sp=new T.Sprite(new T.SpriteMaterial({map:tx,transparent:true,depthTest:true,depthWrite:false}));
    sp.scale.set(5.35*scale,1*scale,1);sp.userData.label=true;return sp;
  }
  function unitMask(){
    if(S.unitMask)return S.unitMask;const c=document.createElement('canvas'),x=c.getContext('2d');c.width=512;c.height=820;x.fillStyle='#fff';
    // Silhueta deliberadamente larga: preserva pés, capas e armas das artes 2D.
    x.beginPath();x.ellipse(256,120,92,105,0,0,Math.PI*2);x.fill();
    x.beginPath();x.moveTo(118,150);x.lineTo(394,150);x.lineTo(480,352);x.lineTo(391,526);x.lineTo(326,492);x.lineTo(302,615);x.lineTo(270,650);x.lineTo(242,650);x.lineTo(210,615);x.lineTo(186,492);x.lineTo(121,526);x.lineTo(32,352);x.closePath();x.fill();
    x.beginPath();x.moveTo(178,455);x.lineTo(257,480);x.lineTo(247,672);x.lineTo(226,818);x.lineTo(34,818);x.lineTo(154,638);x.closePath();x.fill();
    x.beginPath();x.moveTo(334,455);x.lineTo(255,480);x.lineTo(265,672);x.lineTo(286,818);x.lineTo(478,818);x.lineTo(358,638);x.closePath();x.fill();
    const tx=new T.CanvasTexture(c);S.unitMask=tx;return tx;
  }
  function setMeshShadows(root){root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.material=o.material?.clone?.()||o.material;}});}
  function fitClone(source,size,pos,rotationY=0){
    if(!source)return null;const o=source.clone(true);setMeshShadows(o);const b=new T.Box3().setFromObject(o),v=new T.Vector3();b.getSize(v);
    const sc=Math.min(size.x/(v.x||1),size.y/(v.y||1),size.z/(v.z||1));o.scale.setScalar(sc);o.rotation.y=rotationY;
    const b2=new T.Box3().setFromObject(o),center=new T.Vector3();b2.getCenter(center);o.position.set(pos.x-center.x,pos.y-b2.min.y,pos.z-center.z);S.world.add(o);return o;
  }
  function makeSky(){
    const geo=new T.SphereGeometry(150,32,18),m=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{top:{value:new T.Color('#07192b')},bottom:{value:new T.Color('#a34625')},offset:{value:8},power:{value:.75}},
      vertexShader:'varying vec3 vWorldPosition;void main(){vec4 p=modelMatrix*vec4(position,1.0);vWorldPosition=p.xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader:'uniform vec3 top;uniform vec3 bottom;uniform float offset;uniform float power;varying vec3 vWorldPosition;void main(){float h=normalize(vWorldPosition+vec3(0.,offset,0.)).y;gl_FragColor=vec4(mix(bottom,top,max(pow(max(h,0.0),power),0.0)),1.0);}'});
    S.scene.add(new T.Mesh(geo,m));
    const moon=new T.Mesh(new T.SphereGeometry(3.8,24,16),new T.MeshBasicMaterial({color:'#ffd2a1'}));moon.position.set(-32,42,-82);S.scene.add(moon);
    const glow=new T.PointLight('#ff8a4d',1.2,90);glow.position.set(-28,20,-50);S.scene.add(glow);
  }
  function makeLights(){
    S.scene.add(new T.HemisphereLight('#7ec8ec','#2b160d',1.28));
    const sun=new T.DirectionalLight('#ffe0be',2.1);sun.position.set(-18,31,-26);sun.castShadow=S.quality>0;
    sun.shadow.mapSize.set(S.quality>1?2048:1024,S.quality>1?2048:1024);sun.shadow.camera.left=-24;sun.shadow.camera.right=24;sun.shadow.camera.top=20;sun.shadow.camera.bottom=-20;sun.shadow.camera.far=80;S.scene.add(sun);
    const emergency=new T.PointLight('#ff5d29',2.4,19,2);emergency.position.set(15,2.1,11);S.scene.add(emergency);
    const auspex=new T.PointLight('#42cfff',1.3,15,2);auspex.position.set(7,1.6,6);S.scene.add(auspex);
  }
  async function makeMaterials(){
    const [ad,an,aa,gd,gn,ga]=await Promise.all([
      loadTex(BASE+'materials/asphalt_02/asphalt_02_diff_1k.jpg',true,[7.5,5.5]),loadTex(BASE+'materials/asphalt_02/asphalt_02_nor_gl_1k.jpg',false,[7.5,5.5]),loadTex(BASE+'materials/asphalt_02/asphalt_02_arm_1k.jpg',false,[7.5,5.5]),
      loadTex(BASE+'materials/gravel_stones/gravel_stones_diff_1k.jpg',true,[3,3]),loadTex(BASE+'materials/gravel_stones/gravel_stones_nor_gl_1k.jpg',false,[3,3]),loadTex(BASE+'materials/gravel_stones/gravel_stones_arm_1k.jpg',false,[3,3])]);
    const asphalt=new T.MeshStandardMaterial({color:'#80878a',map:ad,normalMap:an,roughnessMap:aa,metalnessMap:aa,roughness:.96,metalness:.02});
    const gravel=new T.MeshStandardMaterial({color:'#77706b',map:gd,normalMap:gn,roughnessMap:ga,metalnessMap:ga,roughness:1,metalness:0});
    return{asphalt,gravel,wall:mat('#45545b',.75,.14),wall2:mat('#26343b',.84,.08),roof:mat('#303e43',.9,.05),edge:mat('#7f532d',.67,.32),barrier:mat('#9b7a51',.92,.03),stair:mat('#7f512b',.58,.55),dark:mat('#111a1e',.76,.28),glass:new T.MeshStandardMaterial({color:'#153e4c',emissive:'#0f5269',emissiveIntensity:.35,metalness:.35,roughness:.24})};
  }
  function makeGround(M){
    const cityFloor=new T.Mesh(new T.PlaneGeometry(170,170),new T.MeshStandardMaterial({color:'#171a1c',roughness:1,metalness:0}));cityFloor.rotation.x=-Math.PI/2;cityFloor.position.set(15,-.085,11);cityFloor.receiveShadow=true;S.world.add(cityFloor);
    const g=new T.Mesh(addUV2(new T.PlaneGeometry(30,22,30,22)),M.asphalt);g.rotation.x=-Math.PI/2;g.position.set(15,-.035,11);g.receiveShadow=true;S.world.add(g);
    const grid=new T.GridHelper(30,30,'#275b6c','#153039');grid.position.set(15,.018,11);grid.material.transparent=true;grid.material.opacity=.22;S.world.add(grid);
    [[3.2,3.8,3.1,1.7],[17,7.1,4.2,2],[9,17.4,3.7,1.5],[24.2,15.7,3,2]].forEach(([x,z,w,d],i)=>{
      const p=new T.Mesh(new T.CircleGeometry(Math.max(w,d)*.68,28),M.gravel);p.rotation.x=-Math.PI/2;p.rotation.z=i*.8;p.scale.set(w/d,1,1);p.position.set(x,.006,z);p.receiveShadow=true;S.world.add(p);
    });
    const border=box(S.world,30.5,.16,.18,15,.07,-.14,M.dark,{solid:false});border.castShadow=false;
    box(S.world,30.5,.16,.18,15,.07,22.14,M.dark,{solid:false});box(S.world,.18,.16,22.5,-.14,.07,11,M.dark,{solid:false});box(S.world,.18,.16,22.5,30.14,.07,11,M.dark,{solid:false});
  }
  function makeHeavy(t,i,M){
    const h=t.z||2,grp=new T.Group();grp.position.set(t.x,0,t.y);S.world.add(grp);
    box(grp,t.w,h,t.h,t.w/2,h/2,t.h/2,i%2?M.wall:M.wall2);
    // Parapeito de cobertura leve: visível em primeira pessoa e considerado pelas regras no telhado.
    const rim=.16,rh=.46;box(grp,t.w+rim*2,rh,rim,t.w/2,h+rh/2,-rim/2,M.edge);box(grp,t.w+rim*2,rh,rim,t.w/2,h+rh/2,t.h+rim/2,M.edge);
    box(grp,rim,rh,t.h,rim/-2,h+rh/2,t.h/2,M.edge);box(grp,rim,rh,t.h,t.w+rim/2,h+rh/2,t.h/2,M.edge);
    // Janelas emissivas e dutos dão escala humana sem alterar colisão/regras.
    const rows=Math.max(1,Math.floor(t.w/1.4));for(let n=0;n<rows;n++){
      const ww=.44,wh=.5,x=(n+.5)*t.w/rows;const win=box(grp,ww,wh,.025,x,.72,-.016,M.glass,{solid:false,shadow:false});win.castShadow=false;
      if((n+i)%2===0)box(grp,.18,.18,.25,x,h-.36,t.h+.12,M.dark,{solid:false});
    }
    if(t.w>=4){const tank=new T.Mesh(new T.CylinderGeometry(.34,.34,.85,14),M.dark);tank.rotation.z=Math.PI/2;tank.position.set(t.w*.72,h+.4,t.h*.54);tank.castShadow=true;grp.add(tank);}
  }
  function makeLight(t,i,M){
    const h=.72,grp=new T.Group();grp.position.set(t.x,0,t.y);S.world.add(grp);
    box(grp,t.w,h,t.h,t.w/2,h/2,t.h/2,M.barrier);
    const cap=box(grp,t.w+.08,.09,t.h+.08,t.w/2,h+.045,t.h/2,M.edge);cap.userData.solid=false;
    const long=t.w>=t.h;for(let n=.42;n<(long?t.w:t.h);n+=.8){
      if(long)box(grp,.045,h+.03,t.h+.035,n,h/2,t.h/2,M.dark,{solid:false,shadow:false});
      else box(grp,t.w+.035,h+.03,.045,t.w/2,h/2,n,M.dark,{solid:false,shadow:false});
    }
  }
  function makeStair(s,M){
    const g=new T.Group(),tx=s.tx??s.x,ty=s.ty??s.y,dx=tx-s.x,dz=ty-s.y,ang=Math.atan2(dz,dx),steps=8,w=.88,len=1.15,h=s.z||2;
    g.position.set(s.x+.5,0,s.y+.5);g.rotation.y=-ang;S.world.add(g);
    for(let i=0;i<steps;i++){const sh=(i+1)/steps*h,sl=len/steps+.035;box(g,sl,sh,w,-len/2+(i+.5)*len/steps,sh/2,0,i%2?M.stair:M.edge);}
    [-1,1].forEach(side=>{
      const railH=.42,railLen=Math.hypot(len+.12,h),rail=box(g,railLen,.055,.055,0,h/2+railH,side*w*.59,M.stair,{solid:false});
      rail.rotation.z=Math.atan2(h,len+.12);
      for(let i=0;i<=4;i++){const t=i/4,base=.06+t*h;box(g,.045,railH,.045,-len/2+t*len,base+railH/2,side*w*.59,M.stair,{solid:false});}
    });
  }
  function makeObjective(o,i){
    const g=new T.Group();g.position.set(o.x,.02,o.y);S.markers.add(g);
    const ring=new T.Mesh(new T.TorusGeometry(.57,.035,10,48),new T.MeshBasicMaterial({color:'#45ffab',transparent:true,opacity:.92}));ring.rotation.x=Math.PI/2;g.add(ring);
    const beam=new T.Mesh(new T.CylinderGeometry(.018,.018,2.5,8),new T.MeshBasicMaterial({color:'#54ffba',transparent:true,opacity:.48}));beam.position.y=1.25;g.add(beam);
    const orb=new T.Mesh(new T.SphereGeometry(.1,12,8),new T.MeshBasicMaterial({color:'#afffd8'}));orb.position.y=1.35;g.add(orb);
    const l=textSprite(`OBJ ${i+1}`,'#62ffb5',.18);l.position.set(0,1.72,0);g.add(l);g.userData.objective=true;
  }
  function makeCity(M){
    const rng=n=>{const x=Math.sin(n*127.1)*43758.5453;return x-Math.floor(x)};
    for(let i=0;i<42;i++){const side=i%4,x=side<2?(-9+rng(i)*48):(side===2?-8-rng(i)*13:38+rng(i)*13),z=side<2?(side===0?-14-rng(i)*22:36+rng(i)*22):(-10+rng(i+22)*50),w=2.5+rng(i+2)*5,d=2.4+rng(i+5)*5,h=5+rng(i+9)*15;
      const b=box(S.world,w,h,d,x,h/2,z,i%3?M.wall2:M.wall,{solid:false,shadow:false});b.material=b.material.clone();b.material.color.multiplyScalar(.48+.2*rng(i+11));
      if(i%3===0){const ant=box(S.world,.08,2,.08,x,h+1,z,M.edge,{solid:false,shadow:false});ant.castShadow=false;}
    }
    for(let i=0;i<38;i++){const x=-1+(i*7.37)%32,z=-1+(i*11.81)%24;if(x>0&&x<30&&z>0&&z<22){const s=.08+(i%4)*.035;const r=box(S.world,s,.05,s*2,x,.03,z,i%2?M.edge:M.dark,{solid:false,shadow:false});r.rotation.y=i*.73;}}
  }
  function makeStreetProps(M){
    // Detalhes puramente visuais, posicionados fora das rotas centrais para não mudar as regras.
    [[1.1,4.2],[28.7,8.5],[1.4,16.8],[28.4,20.2],[6.1,21],[23.8,1]].forEach(([x,z],i)=>{
      for(let n=0;n<2+(i%2);n++){const s=.42-.05*n;const c=box(S.world,s,.34,s,x+n*.24,.17+n*.32,z+n*.15,i%2?M.edge:M.dark,{solid:false});c.rotation.y=.28*i+n*.35;}
    });
    [[2.2,10.8],[27.7,12.3],[8.2,1.1],[21.5,20.8]].forEach(([x,z],i)=>{
      for(let n=0;n<2;n++){const d=new T.Mesh(new T.CylinderGeometry(.22,.22,.58,16),i%2?M.edge:M.dark);d.position.set(x+n*.45,.3,z+n*.18);d.rotation.z=i%2?Math.PI/2:0;d.rotation.y=i*.6;d.castShadow=true;d.receiveShadow=true;d.userData.solid=false;S.world.add(d);}
    });
    [[4.2,20.6],[25.8,2.1],[29,17.2]].forEach(([x,z],i)=>{const p=new T.Mesh(new T.CylinderGeometry(.13,.13,1.35,12),M.dark);p.position.set(x,.16,z);p.rotation.z=Math.PI/2;p.rotation.y=i*.7;p.castShadow=true;p.userData.solid=false;S.world.add(p);});
  }
  function makeEmbers(){
    const n=S.quality>0?500:220,pos=new Float32Array(n*3);for(let i=0;i<n;i++){pos[i*3]=-5+Math.random()*40;pos[i*3+1]=.3+Math.random()*15;pos[i*3+2]=-4+Math.random()*30;}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));const m=new T.PointsMaterial({color:'#ff8a46',size:.035,transparent:true,opacity:.62,depthWrite:false,blending:T.AdditiveBlending});S.particles=new T.Points(g,m);S.scene.add(S.particles);
  }
  async function addHeroAssets(M){
    setStatus('CARREGANDO ARQUITETURA INDUSTRIAL',62);
    const [facade,barrier,ladder,tyre]=await Promise.all([
      loadModel(BASE+'models/modular_factory_facade/modular_factory_facade_1k.gltf'),
      loadModel(BASE+'models/concrete_road_barrier/concrete_road_barrier_1k.gltf'),
      loadModel(BASE+'models/ladder_sectioned_01/ladder_sectioned_01_1k.gltf'),
      loadModel(BASE+'models/old_tyre/old_tyre_1k.gltf')]);
    if(S.closed)return;
    const heavy=S.data.terrain.filter(t=>t.t==='h');heavy.slice(0,5).forEach((t,i)=>fitClone(facade,{x:Math.max(1,t.w*.92),y:Math.max(1.3,(t.z||2)*.92),z:.32},{x:t.x+t.w/2,y:.03,z:t.y-.05},i%2?Math.PI:0));
    S.data.terrain.filter(t=>t.t==='l').slice(0,5).forEach((t,i)=>fitClone(barrier,{x:Math.max(.7,t.w*.62),y:.62,z:Math.max(.32,t.h*.66)},{x:t.x+t.w/2,y:.02,z:t.y+t.h/2},i%2?Math.PI/2:0));
    S.data.stairs.forEach((s,i)=>fitClone(ladder,{x:.78,y:s.z||2,z:.25},{x:(s.x+(s.tx??s.x))/2+.25,y:.02,z:(s.y+(s.ty??s.y))/2+.25},Math.atan2((s.ty??s.y)-s.y,(s.tx??s.x)-s.x)+Math.PI/2));
    [[2,2,0],[27,3,.7],[11,6,1.5],[18,15,.1],[3,19,1.2],[26,19,.4],[7,1.2,.9],[22,20.7,1.6],[29,10,.25],[1,13,1.1]].forEach(([x,z,r])=>fitClone(tyre,{x:.7,y:.7,z:.35},{x,y:.02,z},r));
    setStatus('SINCRONIZANDO AUSPEX',91);
  }
  async function tryHDRI(){
    if(!T.RGBELoader)return;await new Promise(resolve=>new T.RGBELoader().setDataType(T.UnsignedByteType).load(BASE+'sky/abandoned_hopper_terminal_03_2k.hdr',hdr=>{
      if(S.closed){hdr.dispose();return resolve();}hdr.mapping=T.EquirectangularReflectionMapping;S.scene.environment=hdr;
      // O dome estilizado continua como céu; o HDRI ilumina os materiais PBR.
      resolve();},undefined,()=>resolve()));
  }
  function disposeGroup(g){if(!g)return;g.traverse(o=>{if(o.geometry)o.geometry.dispose?.();if(o.material){const a=Array.isArray(o.material)?o.material:[o.material];a.forEach(m=>{if(m.map?.isCanvasTexture)m.map.dispose();m.dispose?.();});}});g.parent?.remove(g);}
  function clearWorld(){disposeGroup(S.world);disposeGroup(S.units);disposeGroup(S.markers);disposeGroup(S.particles);S.particles=null;S.occluders=[];S.unitMeshes=[];S.world=new T.Group();S.units=new T.Group();S.markers=new T.Group();S.scene.add(S.world,S.units,S.markers);}
  async function build(data){
    S.data=data;clearWorld();setStatus('MATERIALIZANDO DISTRITO VOLKUS',18);const M=await makeMaterials();if(S.closed)return;
    makeGround(M);data.terrain.forEach((t,i)=>t.t==='l'?makeLight(t,i,M):makeHeavy(t,i,M));data.stairs.forEach(s=>makeStair(s,M));data.objectives.forEach(makeObjective);makeCity(M);makeStreetProps(M);makeEmbers();
    updateUnits(data);setStatus('ACENDENDO O CÉU DE GUERRA',46);await Promise.all([tryHDRI(),addHeroAssets(M)]);if(!S.closed){S.ready=true;setStatus('VISÃO DO OPERATIVO ONLINE',100);}
  }
  function unitPlane(o,data){
    const key=o.image||'';let tx=key?S.textureCache[key]:null;if(!tx&&o.imageElement){tx=new T.Texture(o.imageElement);tx.encoding=T.sRGBEncoding;tx.needsUpdate=true;S.textureCache[key]=tx;}
    const m=new T.MeshBasicMaterial({color:tx?'#ffffff':(o.hostile?'#ff6464':'#57ddff'),map:tx||null,alphaMap:unitMask(),transparent:true,alphaTest:.18,side:T.DoubleSide,depthTest:true,depthWrite:true});
    const mesh=new T.Mesh(new T.PlaneGeometry(1.15,1.85),m);mesh.position.set(o.x+.5,o.z+1.85/2,o.y+.5);mesh.userData.opId=o.id;mesh.userData.unit=true;mesh.renderOrder=1;S.units.add(mesh);S.unitMeshes.push(mesh);
    const label=textSprite(`${o.hostile?'HOSTIL':'ALIADO'} · ${o.name.toUpperCase()} · ${o.distance.toFixed(1)}″`,o.hostile?'#ff7771':'#6de5ff',.18);label.position.set(o.x+.5,o.z+2.1,o.y+.5);label.userData.opId=o.id;label.userData.nearHidden=o.distance<4.5;label.visible=!label.userData.nearHidden;S.units.add(label);
    if(key&&!tx)loadTex(key,true).then(t=>{if(t&&mesh.material){mesh.material.map=t;mesh.material.color.set('#ffffff');mesh.material.needsUpdate=true;}});
  }
  function updateUnits(data){
    if(!S.units)return;disposeGroup(S.units);S.units=new T.Group();S.scene.add(S.units);S.unitMeshes=[];S.viewer=data.viewer;
    data.units.filter(o=>!o.dead&&o.id!==data.viewer.id&&o.visible).forEach(o=>unitPlane(o,data));
  }
  function updateLabelsAndBillboards(){
    if(!S.camera)return;S.unitMeshes.forEach(m=>m.lookAt(S.camera.position.x,m.position.y,S.camera.position.z));
    S.units?.children.filter(o=>o.isSprite).forEach(sp=>sp.material.opacity=clamp(1-S.camera.position.distanceTo(sp.position)/70,.38,1));
  }
  function updateCamera(data){
    if(!S.camera||!data?.viewer)return;S.data=data;S.viewer=data.viewer;const v=data.viewer,rad=data.heading*Math.PI/180,pitch=-data.pitch*Math.PI/180;
    S.camera.position.set(v.x+.5,v.z+1.55,v.y+.5);S.camera.fov=data.fov;S.camera.aspect=Math.max(.1,S.canvas.clientWidth/Math.max(1,S.canvas.clientHeight));S.camera.updateProjectionMatrix();
    S.camera.lookAt(S.camera.position.x+Math.cos(rad)*Math.cos(pitch),S.camera.position.y+Math.sin(pitch),S.camera.position.z+Math.sin(rad)*Math.cos(pitch));
  }
  function focus(){
    if(!S.camera||!S.data)return;const ray=new T.Raycaster();ray.setFromCamera(new T.Vector2(0,0),S.camera);
    const hits=ray.intersectObjects([...S.occluders,...S.unitMeshes],true);let hit=null;
    for(const h of hits){let o=h.object,id=o.userData.opId;while(!id&&o.parent){o=o.parent;id=o.userData.opId;}if(id){hit={id,distance:h.distance};break;}if(h.object.userData.solid!==false)break;}
    const id=hit?.id||null;if(id!==S.focusId||hit){S.focusId=id;window.Volkus3DHandlers?.onFocus?.(id,hit?.distance||0);}
  }
  function resize(){if(!S.renderer||!S.canvas)return;const w=S.canvas.clientWidth,h=S.canvas.clientHeight,dpr=Math.min(S.quality>1?2:1.45,window.devicePixelRatio||1);S.renderer.setPixelRatio(dpr);S.renderer.setSize(w,h,false);S.camera.aspect=w/Math.max(1,h);S.camera.updateProjectionMatrix();}
  function loop(){
    if(S.closed)return;S.raf=requestAnimationFrame(loop);resize();const dt=S.clock.getDelta();if(S.particles){S.particles.rotation.y+=dt*.006;const a=S.particles.geometry.attributes.position.array;for(let i=1;i<a.length;i+=3){a[i]+=dt*(.08+(i%9)*.012);if(a[i]>15)a[i]=.2;}S.particles.geometry.attributes.position.needsUpdate=true;}
    updateLabelsAndBillboards();if(++S.focusTick%7===0)focus();S.renderer.render(S.scene,S.camera);
  }
  function ensure(canvas){
    if(S.renderer&&S.canvas===canvas)return true;try{
      S.canvas=canvas;S.renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});S.renderer.outputEncoding=T.sRGBEncoding;S.renderer.toneMapping=T.ACESFilmicToneMapping;S.renderer.toneMappingExposure=.92;S.renderer.shadowMap.enabled=true;S.renderer.shadowMap.type=T.PCFSoftShadowMap;
      S.quality=(S.renderer.capabilities.isWebGL2&&((navigator.deviceMemory||4)>=4))?2:0;S.renderer.shadowMap.enabled=S.quality>0;
      S.scene=new T.Scene();S.scene.background=new T.Color('#05090d');S.scene.fog=new T.FogExp2('#10161a',.022);S.camera=new T.PerspectiveCamera(76,1,.05,180);makeSky();makeLights();return true;
    }catch(e){console.warn('Volkus WebGL indisponível',e);return false;}
  }
  const API={
    available:true,
    open(data){const canvas=document.getElementById('fp-webgl');if(!canvas||!ensure(canvas))return false;S.closed=false;canvas.style.display='block';document.getElementById('fp-canvas').style.display='none';const loading=document.getElementById('fp-3d-loading');loading?.classList.toggle('hidden',S.ready);if(!S.ready)loading?.classList.remove('done');
      updateCamera(data);if((!S.world||!S.ready)&&!S.loading){S.loading=true;build(data).finally(()=>S.loading=false);}else{updateUnits(data);}cancelAnimationFrame(S.raf);loop();return true;},
    update(data){if(S.closed)return;updateCamera(data);if(data.refreshUnits)updateUnits(data);},
    close(){S.closed=true;cancelAnimationFrame(S.raf);clearTimeout(S.statusTimer);S.focusId=null;window.Volkus3DHandlers?.onFocus?.(null,0);document.getElementById('fp-3d-loading')?.classList.add('hidden');if(S.canvas)S.canvas.style.display='none';},
    isOpen(){return !S.closed},
    stats(){return{contacts:S.unitMeshes.length,ready:S.ready,quality:S.quality}}
  };
  window.Volkus3D=API;
})();
