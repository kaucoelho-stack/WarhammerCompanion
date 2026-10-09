(() => {
 const pending=new Map();
 function load(name){
  if(pending.has(name))return pending.get(name);
  const task=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='assets/pixel/'+name+'-external.js';script.onload=resolve;script.onerror=()=>{pending.delete(name);reject(new Error('Sprites indisponíveis: '+name));};document.head.append(script);});
  pending.set(name,task);return task;
 }
 window.AuspexAssets={loadTeams(teams){
  const files=['terminal-sheet'];
  if(teams.includes('aod'))files.push('aod-sheets','captain-sheet','eliminator-sheet');
  if(teams.includes('kom'))files.push('kommando-sheets');
  return Promise.all(files.map(load));
 }};
})();
