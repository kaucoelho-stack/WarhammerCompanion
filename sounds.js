const SFX = (() => {
  let ctx = null;
  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(freq1, freq2, dur, vol, type='sawtooth', decay=0.8) {
    try {
      const c=getCtx(), osc=c.createOscillator(), g=c.createGain(), now=c.currentTime;
      osc.type=type; osc.frequency.setValueAtTime(freq1,now); osc.frequency.exponentialRampToValueAtTime(freq2,now+dur);
      g.gain.setValueAtTime(vol,now); g.gain.exponentialRampToValueAtTime(0.001,now+dur*decay);
      osc.connect(g); g.connect(c.destination); osc.start(now); osc.stop(now+dur);
    } catch(e){}
  }
  function noise(dur, vol=0.4) {
    try {
      const c=getCtx(), now=c.currentTime;
      const buf=c.createBuffer(1,c.sampleRate*dur,c.sampleRate);
      const d=buf.getChannelData(0);
      for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.exp(-i/(c.sampleRate*dur*0.3));
      const src=c.createBufferSource(), g=c.createGain();
      src.buffer=buf; g.gain.setValueAtTime(vol,now); g.gain.exponentialRampToValueAtTime(0.001,now+dur);
      src.connect(g); g.connect(c.destination); src.start(now);
    } catch(e){}
  }
  return {
    click()    { tone(800,400,.05,.15,'square',.5); },
    roll()     { for(let i=0;i<6;i++) setTimeout(()=>noise(.04,.5),i*70); },
    hit()      { tone(280,120,.12,.5,'square'); tone(600,200,.08,.3,'sawtooth'); },
    miss()     { tone(100,60,.15,.3,'sine'); },
    wound()    { tone(150,60,.18,.6,'square'); tone(80,40,.2,.5,'sine'); },
    mortal()   { tone(200,30,.35,.8,'sawtooth'); tone(800,100,.2,.5,'square'); noise(.15,.7); },
    save()     { tone(900,600,.15,.4,'triangle'); tone(600,400,.2,.3,'sine'); },
    death()    { tone(180,20,.5,.9,'sawtooth'); tone(80,15,.6,.8,'sine'); noise(.2,.6); },
    cp()       { tone(1200,800,.08,.3,'square'); tone(2000,1500,.06,.2,'triangle'); },
    objective(){ [523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,f*.95,.2,.35,'triangle'),i*80)); },
    victory()  { [[523,0],[659,120],[784,240],[1047,360],[784,500],[1047,620],[1319,740]].forEach(([f,t])=>setTimeout(()=>{tone(f,f*.98,.3,.4,'triangle');tone(f*2,f*1.9,.2,.2,'sine');},t)); },
    turn()     { tone(440,550,.15,.3,'triangle'); tone(660,770,.15,.2,'sine'); },
  };
})();
