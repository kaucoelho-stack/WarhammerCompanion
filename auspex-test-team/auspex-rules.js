(function(){
  'use strict';

  const TEAM_KEYS={
    'kt-angelsofdeath':'aod','kt-plaguemarines':'pmr','kt-kommandos':'kom','kt-pathfinders':'pth',
    'kt-intercession':'int','kt-warriors':'tyr','kt-wolfscouts':'wlf','kt-krieg':'krg',
    'kt-legionaries':'leg','kt-nemesisclaw':'nmc','kt-deathwatch':'dwt','kt-blooded':'bld',
    'kt-mandrakes':'mnd','kt-vespid':'vsp','kt-hota':'hoa'
  };
  const TEAM_ICONS={int:'\u2739',tyr:'\u262c',wlf:'\u16C9',krg:'\u2691',leg:'\u2720',nmc:'\u263E',dwt:'\u25C8',bld:'\u2620',mnd:'\u25D0',vsp:'\u2726',hoa:'\u2666'};
  const EXISTING=new Set(['aod','pmr','kom','pth']);

  const text=v=>Array.isArray(v)?v.map(a=>typeof a==='string'?a:(a.name||a.n||'')+': '+(a.desc||a.d||'')).join(' '):(v||'');
  const number=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:0;};
  const safeId=v=>String(v||'op').toLowerCase().replace(/^kt-/,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const tagsOf=w=>(w.tags||[]).map(t=>String(t).replace(/^Piercing Crits/i,'PiercingCrits').trim());
  function weaponProfiles(w){
    const profiles=Array.isArray(w.profiles)&&w.profiles.length?w.profiles:[w];
    return profiles.map((p,i)=>({
      n:profiles.length>1?`${w.name} \u00b7 ${p.name||`Perfil ${i+1}`}`:(w.name||p.name||'Arma'),
      t:(p.range??w.range)==='melee'?'m':'r',a:number(p.A??w.A)||4,h:number(p.skill??w.skill)||4,
      d:number(p.D??w.D),c:number(p.CD??w.CD),tags:tagsOf(p).length?tagsOf(p):tagsOf(w)
    }));
  }
  function abilitiesOf(op){
    const src=Array.isArray(op.abilities)?op.abilities:(op.abilities?[{name:'Habilidade',desc:op.abilities}]:[]);
    return src.map(a=>({n:a.name||a.n||'Habilidade',d:a.desc||a.d||String(a),
      fly:/\b(voo|flight|fly|flying)\b/i.test(`${a.name||''} ${a.desc||''}`),
      oc:/porta.?\u00edcone|icon bearer/i.test(`${a.name||''} ${a.desc||''}`)?1:0,
      expendable:/expendable|descart\u00e1vel/i.test(`${a.name||''} ${a.desc||''}`)}));
  }
  function rosterFor(team,key){
    const chosen=[],templates=team.operatives||[];
    const push=(op,n)=>{for(let i=0;i<n&&chosen.length<team.limit;i++)chosen.push({op,copy:i});};
    templates.filter(o=>o.unique!==false).forEach(o=>push(o,1));
    templates.filter(o=>o.unique===false).forEach(o=>push(o,Math.min(o.count||team.limit,team.limit-chosen.length)));
    if(chosen.length<team.limit&&templates.length){let i=0;while(chosen.length<team.limit&&i<team.limit*3){const o=templates[i%templates.length];if(o.unique===false)push(o,1);i++;}}
    return chosen.slice(0,team.limit).map(({op,copy},i)=>{
      const weapons=(op.weapons||[]).flatMap(weaponProfiles);
      if(!weapons.some(w=>w.t==='m'))weapons.push({n:'Combate desarmado',t:'m',a:3,h:4,d:2,c:3,tags:[]});
      if(!weapons.some(w=>w.t==='r'))weapons.push({n:'Arma de curto alcance',t:'r',a:3,h:4,d:2,c:3,tags:['Range 6']});
      const ab=abilitiesOf(op);
      if(key==='vsp'&&!/drone/i.test(op.name||''))ab.push({n:'Fly',d:'Pode atravessar terreno durante ações de movimento.',fly:1});
      return{id:`${safeId(op.id)}-${i}`,sourceId:op.id,n:op.name+(copy?` ${copy+1}`:''),ico:(op.name||'?').trim()[0].toUpperCase(),
        apl:number(op.APL)||2,ga:number(op.GA)||1,df:number(op.DF)||3,mv:number(op.M)||6,sv:number(op.SV)||5,w:number(op.W)||7,
        wpn:weapons,abl:ab,expendable:ab.some(a=>a.expendable),engine:{sourceTeam:team.id}}
    });
  }
  function inferEngine(team,key){
    const core=text(team.coreRule?.desc||team.coreRule?.d).toLowerCase();
    return{
      doubleShootFight:['aod','pmr','dwt','int'].includes(key)||/2 a\u00e7\u00f5es de tiro|2 de tiro|duas a\u00e7\u00f5es shoot|duas a\u00e7\u00f5es de tiro/.test(core),
      counterAnyOrder:['aod','pmr','dwt'].includes(key)||/contra-atac/.test(core),concealCharge:key==='kom'||/cargar.*conceal|charge.*conceal|ordem de ocultar/.test(core),
      resilient:key==='pmr',synapse:key==='tyr',soulstrike:key==='mnd',ignorePiercing:key==='mnd',
      shadowSave:key==='mnd',midnight:key==='nmc',blooded:key==='bld',poison:key==='pmr',markerlight:key==='pth'
    };
  }
  function ploysFor(team,key){
    const out=[];for(const [kind,ty] of [['strategy','s'],['firefight','f']])for(const [i,p] of (team.ploys?.[kind]||[]).entries()){
      const d=p.desc||p.d||'',automated=/balanced|ceaseless|relentless|saturate|re-rol|rerrol|accurate|save|defesa|dano|move|charge|carga|conceal|ocult/i.test(d);
      out.push({id:`${key}_${ty}_${i}`,n:p.name||p.n,d,cp:1,ty,fx:{semantic:automated,reference:!automated}});
    }return out;
  }
  function importTeams(target,source){
    if(!target||!Array.isArray(source))return 0;
    for(const t of source){
      const key=TEAM_KEYS[t.id]||safeId(t.id).slice(0,5);if(EXISTING.has(key)||target[key])continue;
      target[key]={name:t.name,fac:t.faction,ico:TEAM_ICONS[key]||t.emoji||'\u25C9',col:t.color||'#7bd6e8',limit:t.limit,
        rule:{n:t.coreRule?.name||'Regra de fac\u00e7\u00e3o',d:String(t.coreRule?.desc||'').replace(/<[^>]+>/g,' ')},
        ploys:ploysFor(t,key),ops:rosterFor(t,key),engine:inferEngine(t,key),sourceId:t.id};
    }
    Object.entries(target).forEach(([key,t])=>{t.engine={...inferEngine({coreRule:{desc:t.rule?.d||''}},key),...(t.engine||{})};
      (t.ops||[]).forEach(o=>{o.df=o.df||3;o.ga=o.ga||1;o.expendable=o.expendable||o.abl?.some(a=>a.expendable);});});
    return Object.keys(target).length;
  }
  const team=(op,teams)=>op&&teams?.[op.teamId];
  const engine=(op,teams)=>team(op,teams)?.engine||{};
  const canCounter=(op,teams)=>op.order==='engage'||engine(op,teams).counterAnyOrder;
  const canChargeConcealed=(op,teams)=>!!engine(op,teams).concealCharge;
  const maxAction=(op,kind,teams)=>engine(op,teams).doubleShootFight&&(kind==='shoot'||kind==='fight')?2:1;
  const heavyBlocked=(op,w)=>{
    const tag=(w.tags||[]).find(t=>String(t).startsWith('Heavy'));if(!tag||!op.moved)return false;
    if(/Dash only/i.test(tag))return (op.usedActs||[]).some(a=>['reposition','charge','fallback'].includes(a));
    if(/Reposition only/i.test(tag))return (op.usedActs||[]).some(a=>['dash','charge','fallback'].includes(a));
    return true;
  };
  const limitedBlocked=(op,w)=>{const m=String((w.tags||[]).find(t=>String(t).startsWith('Limited'))||'');if(!m)return false;const n=number(m)||1;return (op.weaponUses?.[w.n]||0)>=n;};
  const useWeapon=(op,w)=>{op.weaponUses=op.weaponUses||{};op.weaponUses[w.n]=(op.weaponUses[w.n]||0)+1;};
  const hasAbility=(op,re)=>text(op.abl).match(re);
  const objectiveAPL=op=>op.apl+(op.abl?.some(a=>a.oc)?1:0);
  const countsForElimination=op=>!op.expendable;
  const rangeOf=w=>{const t=(w.tags||[]).find(x=>String(x).startsWith('Range '));return t?(number(t)||99):99;};

  window.AuspexRules={importTeams,team,engine,canCounter,canChargeConcealed,maxAction,heavyBlocked,limitedBlocked,useWeapon,
    hasAbility,objectiveAPL,countsForElimination,rangeOf,version:'2.0'};
})();
