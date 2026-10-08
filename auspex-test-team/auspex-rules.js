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
    return profiles.map((p,i)=>{
      const range=p.range??w.range,tags=Array.isArray(p.tags)?tagsOf(p):tagsOf(w);
      if(range!=='melee'&&/^\d/.test(String(range))&&!tags.some(t=>t.startsWith('Range ')))tags.push('Range '+number(range));
      return {
      n:profiles.length>1?`${w.name} \u00b7 ${p.name||`Perfil ${i+1}`}`:(w.name||p.name||'Arma'),
      t:(p.range??w.range)==='melee'?'m':'r',a:number(p.A??w.A)||4,h:number(p.skill??w.skill)||4,
      d:number(p.D??w.D),c:number(p.CD??w.CD),tags
    };});
  }
  function abilitiesOf(op){
    const src=Array.isArray(op.abilities)?op.abilities:(op.abilities?[{name:'Habilidade',desc:op.abilities}]:[]);
    return src.map(a=>({n:a.name||a.n||'Habilidade',d:a.desc||a.d||String(a),
      fly:/\b(voo|flight|fly|flying)\b/i.test(`${a.name||''} ${a.desc||''}`),
      oc:/porta.?\u00edcone|icon bearer/i.test(`${a.name||''} ${a.desc||''}`)?1:0,
      expendable:/expendable|descart\u00e1vel/i.test(`${a.name||''} ${a.desc||''}`)}));
  }
  function operativeFrom(op,key,team){
      const weapons=(op.weapons||[]).flatMap(weaponProfiles);
      // Missing weapon types are intentional (e.g. the Fenrisian Wolf).
      const ab=abilitiesOf(op);
      if(key==='vsp'&&!/drone/i.test(op.name||''))ab.push({n:'Fly',d:'Pode atravessar terreno durante ações de movimento.',fly:1});
      return{id:safeId(op.id),sourceId:op.id,n:op.name,ico:(op.name||'?').trim()[0].toUpperCase(),
          apl:number(op.APL)||2,ga:key==='aod'?1:(number(op.GA)||1),df:number(op.DF)||3,mv:number(op.M)||6,sv:number(op.SV)||5,w:number(op.W)||7,
        wpn:weapons,abl:ab,expendable:ab.some(a=>a.expendable),engine:{sourceTeam:team.id}}
  }
  function leaderIds(team){
    if(team.id==='kt-angelsofdeath')return new Set(['kt-aod-captain','kt-aod-asgt','kt-aod-isgt']);
    const ids={'kt-intercession':'kt-intercessor-sgt','kt-warriors':'kt-warrior-prime','kt-kommandos':'kt-kommando-boss','kt-wolfscouts':'kt-ws-packleader','kt-krieg':'kt-krieg-watchmaster','kt-legionaries':'kt-legionary-aspiring','kt-pathfinders':'kt-pathfinder-shas','kt-nemesisclaw':'kt-nc-visionary','kt-deathwatch':'kt-dw-sergeant','kt-plaguemarines':'kt-pm-champion','kt-blooded':'kt-bl-chieftain','kt-mandrakes':'kt-mand-nightfiend','kt-vespid':'kt-vesp-strainleader','kt-hota':'kt-hota-archsybarite'};
    return new Set(ids[team.id]?[ids[team.id]]:[]);
  }
  function catalogFor(team,key){
    const leaders=leaderIds(team);
    return(team.operatives||[]).map((op,i)=>({...operativeFrom(op,key,team),catalogIndex:i,
      min:team.id==='kt-wolfscouts'&&op.id==='kt-ws-wolf'?1:0,
      selectionCost:team.id==='kt-kommandos'&&['kt-kommando-grot','kt-kommando-bombsquig'].includes(op.id)?.5:1,
      max:team.id==='kt-wolfscouts'&&op.id==='kt-ws-hunter'?5:op.unique===false?Math.max(1,number(op.count)||team.limit):1,unique:op.unique!==false,
      leader:leaders.has(op.id),leaderGroup:leaders.has(op.id)?'leader':null}));
  }
  function compositionFor(source){
    return {size:source.limit,leaderMin:source.id==='kt-wolfscouts'?0:1,leaderMax:1,
      groups:source.id==='kt-angelsofdeath'?[{ids:['kt-aod-heavygunner','kt-aod-eliminator'],max:1,label:'Heavy Intercessor Gunner / Eliminator: no máximo um no total'}]:[]};
  }
  function groupAllows(team,counts,op){return (team.composition?.groups||[]).every(g=>!g.ids.includes(op.sourceId)||team.catalog.filter(o=>g.ids.includes(o.sourceId)).reduce((n,o)=>n+(counts[o.id]||0),0)<g.max);}
  function defaultSelection(team){
    const counts={},cat=team.catalog||[];let left=team.limit||0;
    for(const o of cat)if(o.min){counts[o.id]=o.min;left-=o.min*(o.selectionCost||1);}
    const leader=cat.find(o=>o.leader);if(leader&&left&&!counts[leader.id]){counts[leader.id]=1;left--;}
    const ordered=[...cat.filter(o=>!o.leader&&o.unique),...cat.filter(o=>!o.leader&&!o.unique)];
    for(const o of ordered){const cost=o.selectionCost||1;while((counts[o.id]||0)<o.max&&left>=cost&&groupAllows(team,counts,o)){counts[o.id]=(counts[o.id]||0)+1;left-=cost;}if(!left)break;}
    return counts;
  }
  function validateRoster(team,counts={}){
    const cat=team.catalog||[],errors=[];let total=0,selections=0,leaders=0;
    for(const o of cat){const n=Object.prototype.hasOwnProperty.call(counts,o.id)?counts[o.id]:0;if(typeof n!=='number'||!Number.isInteger(n)||n<0){errors.push(`${o.n}: quantidade inválida`);continue;}total+=n;selections+=n*(o.selectionCost||1);if(o.leader)leaders+=n;if(n>o.max)errors.push(`${o.n}: máximo ${o.max}`);if(n<(o.min||0))errors.push(`${o.n}: obrigatório (${o.min})`);}
    for(const id of Object.keys(counts))if(!cat.some(o=>o.id===id))errors.push(`Operativo desconhecido: ${id}`);
    if(selections!==(team.limit||0))errors.push(`Selecione exatamente ${team.limit} escolhas (${selections}/${team.limit})`);
    for(const g of team.composition?.groups||[])if(cat.filter(o=>g.ids.includes(o.sourceId)).reduce((n,o)=>n+(counts[o.id]||0),0)>g.max)errors.push(g.label);
    const min=team.composition?.leaderMin??(team.sourceId==='kt-wolfscouts'?0:1);
    if(cat.some(o=>o.leader)&&(leaders<min||leaders>1))errors.push(`Selecione ${min?'exatamente 1':'no máximo 1'} líder (${leaders}/1)`);
    return{valid:errors.length===0,errors,total,selections,leaders,size:team.limit||0};
  }
  function buildRoster(team,counts={}){
    const check=validateRoster(team,counts);if(!check.valid)return[];const out=[];
    for(const o of team.catalog||[])for(let copy=0;copy<(counts[o.id]||0);copy++)out.push({...o,
      id:`${o.id}-${copy}`,n:o.n+(copy?` ${copy+1}`:''),catalogId:o.id});
    return out;
  }
  function rosterFor(team,key){
    const meta={limit:team.limit,sourceId:team.id,composition:compositionFor(team),catalog:catalogFor(team,key)};return buildRoster(meta,defaultSelection(meta));
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
      const d=p.desc||p.d||'';
      out.push({id:`${key}_${ty}_${i}`,n:p.name||p.n,d,cp:p.cp??1,ty,fx:{reference:true}});
    }return out;
  }
  function importTeams(target,source){
    if(!target||!Array.isArray(source))return 0;
    for(const t of source){
      const key=TEAM_KEYS[t.id]||safeId(t.id).slice(0,5),catalog=catalogFor(t,key);
      if(target[key]){
        const current=target[key];current.limit=t.limit;current.catalog=catalog;current.composition=compositionFor(t);current.sourceId=t.id;
        // Prefer the app's actual reference cards over legacy prototype ploys.
        current.ploys=ploysFor(t,key);
        current.ops=buildRoster(current,defaultSelection(current));continue;
      }
      target[key]={name:t.name,fac:t.faction,ico:TEAM_ICONS[key]||t.emoji||'\u25C9',col:t.color||'#7bd6e8',limit:t.limit,
        rule:{n:t.coreRule?.name||'Regra de fac\u00e7\u00e3o',d:String(t.coreRule?.desc||'').replace(/<[^>]+>/g,' ')},
        ploys:ploysFor(t,key),catalog,composition:compositionFor(t),engine:inferEngine(t,key),sourceId:t.id};
      target[key].ops=buildRoster(target[key],defaultSelection(target[key]));
    }
    Object.entries(target).forEach(([key,t])=>{t.engine={...inferEngine({coreRule:{desc:t.rule?.d||''}},key),...(t.engine||{})};
      (t.ops||[]).forEach(o=>{o.df=o.df||3;o.ga=o.ga||1;o.expendable=o.expendable||o.abl?.some(a=>a.expendable);});});
    return Object.keys(target).length;
  }
  const team=(op,teams)=>op&&teams?.[op.teamId];
  const engine=(op,teams)=>team(op,teams)?.engine||{};
  const canCounter=(op,teams)=>op.order==='engage'||engine(op,teams).counterAnyOrder;
  const canChargeConcealed=(op,teams)=>op.templateId==='kt-ws-wolf'||(!!engine(op,teams).concealCharge&&op.templateId!=='kt-kommando-bombsquig');
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
    hasAbility,objectiveAPL,countsForElimination,rangeOf,defaultSelection,validateRoster,buildRoster,version:'2.2'};
})();
