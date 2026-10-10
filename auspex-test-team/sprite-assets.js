(() => {
 const pending=new Map();
 const images=new Map();
 function bounded(start,label){
  return new Promise((resolve,reject)=>{
   let settled=false;
   const finish=(error,value)=>{if(settled)return;settled=true;clearTimeout(timer);error?reject(error):resolve(value);};
   const timer=setTimeout(()=>finish(new Error('Tempo esgotado ao carregar: '+label)),30000);
   try{start(value=>finish(null,value),error=>finish(error));}catch(error){finish(error);}
  });
 }
 const globals={'terminal-sheet':'AuspexTerminalSheet','aod-sheets':'AuspexAodSheets','captain-sheet':'AuspexCaptainSheet','eliminator-sheet':'AuspexEliminatorSheet','kommando-sheets':'AuspexKommandoSheets'};
 function sources(value){
  if(typeof value==='string')return value.startsWith('assets/pixel/')&&/\.(png|webp)$/.test(value)?[value]:[];
  return value&&typeof value==='object'?Object.values(value).flatMap(sources):[];
 }
 function preload(src){
  if(images.has(src))return images.get(src);
  const task=bounded((resolve,reject)=>{
   const img=new Image();
   img.onload=()=>{const decoded=typeof img.decode==='function'?img.decode():Promise.resolve();decoded.then(()=>resolve(img),reject);};
   img.onerror=()=>reject(new Error('Imagem indisponível: '+src));img.src=src;
  },src);
  images.set(src,task);task.catch(()=>{if(images.get(src)===task)images.delete(src);});return task;
 }
 function load(name){
  if(pending.has(name))return pending.get(name);
  const task=bounded((resolve,reject)=>{const script=document.createElement('script');script.src='assets/pixel/'+name+'-optimized.js';script.onload=resolve;script.onerror=()=>reject(new Error('Sprites indisponíveis: '+name));document.head.append(script);},name);
  pending.set(name,task);task.catch(()=>{if(pending.get(name)===task)pending.delete(name);});return task;
 }
 window.AuspexAssets={loadTeams(teams){
  const files=['terminal-sheet'];
  if(teams.includes('aod'))files.push('aod-sheets','captain-sheet','eliminator-sheet');
  if(teams.includes('kom'))files.push('kommando-sheets');
  return Promise.all(files.map(load)).then(()=>Promise.all([...new Set(files.flatMap(name=>sources(window[globals[name]])))].map(preload)));
 }};
})();
