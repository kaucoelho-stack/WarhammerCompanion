/* Music only. Future effects must use a separate audio channel. */
(()=>{
 const tracks={menu:new Audio('assets/music/menu-loop.ogg'),battle:new Audio('assets/music/battle-loop.ogg')};
 let volume=.25,muted=false,unlocked=false,current='menu';
 try{const s=JSON.parse(localStorage.getItem('auspex-music')||'null');if(s){volume=Number.isFinite(s.volume)?Math.max(0,Math.min(1,s.volume)):.25;muted=!!s.muted;}}catch{}
 const levels={menu:0,battle:0};
 for(const a of Object.values(tracks)){a.loop=true;a.preload='metadata';a.volume=0;}
 function save(){try{localStorage.setItem('auspex-music',JSON.stringify({volume,muted}));}catch{}}
 function play(){if(!unlocked||muted||document.hidden||!volume)return;tracks[current].play().catch(()=>{unlocked=false;});}
 function sync(){
  const button=document.getElementById('music-toggle'),slider=document.getElementById('music-volume');
  if(button){button.textContent=muted?'MÚSICA: OFF':'MÚSICA: ON';button.setAttribute('aria-pressed',String(muted));}
  if(slider)slider.value=Math.round(volume*100);
 }
 window.AuspexMusic={
  scene(name){if(!tracks[name]||name===current)return;current=name;play();},
  toggle(){muted=!muted;unlocked=true;save();sync();play();},
  volume(value){volume=Math.max(0,Math.min(1,Number(value)/100));save();sync();play();}
 };
 for(const event of ['pointerdown','keydown'])document.addEventListener(event,()=>{if(!unlocked){unlocked=true;play();}},{capture:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)Object.values(tracks).forEach(a=>a.pause());else play();});
 setInterval(()=>{
  for(const [key,a]of Object.entries(tracks)){
   const target=key===current&&!muted&&!document.hidden&&unlocked?volume:0;
   levels[key]+=Math.max(-.0125,Math.min(.0125,target-levels[key]));
   a.volume=levels[key];
   if(levels[key]===0&&target===0&&!a.paused)a.pause();
  }
 },50);
 sync();
})();
