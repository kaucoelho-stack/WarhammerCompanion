// ═══════════════════════════════════════════════════════
// KILL TEAM DATA — Operatives, Teams, Rules
// ═══════════════════════════════════════════════════════

// Kill Team stat block is different from 40K:
// M (Movement), APL (Action Points), GA (Group Activation),
// DF (Defense dice), SV (Save), W (Wounds)
// Weapons: A (Attacks), BS/WS (Skill), D (Damage normal), CD (Critical Damage)
// Critical Hit special rules per weapon

const KT_TEAMS = [
  // ── INTERCESSION SQUAD (Space Marines) ──────────────
  {
    id:'kt-intercession', name:'Intercession Squad', faction:'Space Marines',
    color:'#4a90d9', emoji:'🔵',
    desc:'Intercessors do Primaris — versáteis, resistentes e adaptáveis. Bom para iniciantes.',
    style:'Tiro · Versátil',
    limit: 6, // max operatives
    operatives: [
      { id:'kt-intercessor-sgt', name:'Sargento Intercessor', unique:true,
        M:'3"', APL:2, GA:1, DF:3, SV:3, W:14,
        abilities:'Líder: Uma vez por turno, pode usar 1 APL para dar 1 APL a um aliado a 6".',
        weapons:[
          { name:'Bolt Rifle',     A:4, skill:3, D:4, CD:5, range:'long', tags:['Relentless'] },
          { name:'Espada Astartes',A:4, skill:3, D:4, CD:5, range:'melee', tags:['Lethal 5+'] },
        ]},
      { id:'kt-intercessor', name:'Guerreiro Intercessor', unique:false, count:5,
        M:'3"', APL:2, GA:1, DF:3, SV:3, W:12,
        abilities:'Determinado: Ignora penalidades de movimento ao atirar.',
        weapons:[
          { name:'Bolt Rifle',     A:4, skill:3, D:4, CD:5, range:'long', tags:['Relentless'] },
          { name:'Espada Astartes',A:3, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-intercessor-heavy', name:'Guerreiro com Arma Pesada', unique:false, count:1,
        M:'3"', APL:2, GA:1, DF:3, SV:3, W:12,
        abilities:'Arma Pesada: Após atirar, esta figurine fica Engajada.',
        weapons:[
          { name:'Auto Bolt Rifle',A:5, skill:3, D:3, CD:5, range:'long', tags:['Ceaseless'] },
          { name:'Espada Astartes',A:3, skill:3, D:3, CD:4, range:'melee' },
        ]},
    ]
  },

  // ── TYRANID WARRIORS (Tyranids) ─────────────────────
  {
    id:'kt-warriors', name:'Tyranid Warriors', faction:'Tyranids',
    color:'#a855f7', emoji:'🟣',
    desc:'Seres híbridos entre comandante e soldado. Synapse psíquica controla o enxame.',
    style:'Melee · Synapse',
    limit: 5,
    operatives: [
      { id:'kt-warrior-prime', name:'Warrior Prime', unique:true,
        M:'3"', APL:2, GA:1, DF:3, SV:4, W:18,
        abilities:'Synapse: Operativos Tyranid a 6" podem re-rolar 1 dado de Defesa por ativação.',
        weapons:[
          { name:'Deathspitter',   A:4, skill:3, D:4, CD:6, range:'long' },
          { name:'Lâminas Tyranid',A:5, skill:3, D:5, CD:7, range:'melee', tags:['Rending'] },
        ]},
      { id:'kt-warrior', name:'Warrior', unique:false, count:4,
        M:'3"', APL:2, GA:1, DF:3, SV:4, W:16,
        abilities:'Predatório: Re-rola 1 dado de ataque ao carregar (Fight action).',
        weapons:[
          { name:'Devourer',       A:5, skill:4, D:3, CD:5, range:'long', tags:['Ceaseless'] },
          { name:'Lâminas Tyranid',A:4, skill:3, D:4, CD:6, range:'melee', tags:['Rending'] },
        ]},
    ]
  },

  // ── KOMMANDOS (Orks) ────────────────────────────────
  {
    id:'kt-kommandos', name:'Kommandos', faction:'Orks',
    color:'#f59e0b', emoji:'🟡',
    desc:'Orks furtivos especializados em infiltração e emboscadas. Caóticos mas devastadores.',
    style:'Furtivo · Melee',
    limit: 10,
    operatives: [
      { id:'kt-kommando-boss', name:'Boss Kommando', unique:true,
        M:'3"', APL:2, GA:1, DF:4, SV:5, W:16,
        abilities:'WAAAGH!: Uma vez por fase de combate, pode usar Charge como ação bônus gratuita.',
        weapons:[
          { name:'Slugga',         A:4, skill:5, D:3, CD:4, range:'short' },
          { name:'Choppa',         A:4, skill:3, D:4, CD:6, range:'melee', tags:['Rending'] },
        ]},
      { id:'kt-kommando', name:'Kommando', unique:false, count:9,
        M:'3"', APL:2, GA:2, DF:4, SV:5, W:10,
        abilities:'Furtivo: Quando se mover para Cover, não recebe penalidade de visibilidade.',
        weapons:[
          { name:'Slugga',         A:3, skill:5, D:3, CD:4, range:'short' },
          { name:'Choppa',         A:3, skill:4, D:3, CD:5, range:'melee' },
        ]},
      { id:'kt-kommando-snipa', name:'Kommando Snipa', unique:true,
        M:'3"', APL:2, GA:1, DF:4, SV:5, W:10,
        abilities:'Snipa: Pode atacar alvos em Heavy Cover sem penalidade.',
        weapons:[
          { name:'Snipa Rifle',    A:3, skill:4, D:5, CD:6, range:'long', tags:['Silent','Severe'] },
          { name:'Faca Ork',       A:3, skill:4, D:3, CD:4, range:'melee' },
        ]},
    ]
  },

  // ── DEATH KORPS OF KRIEG (Astra Militarum) ──────────
  {
    id:'kt-krieg', name:'Death Korps of Krieg', faction:'Astra Militarum',
    color:'#d97706', emoji:'🟠',
    desc:'Soldados fanáticos da Guarda Imperial sem medo da morte. Força em números e determinação.',
    style:'Tiro · Horda',
    limit: 14,
    operatives: [
      { id:'kt-krieg-watchmaster', name:'Watchmaster', unique:true,
        M:'3"', APL:2, GA:1, DF:3, SV:5, W:10,
        abilities:'Ordens: Uma vez por ativação, dá +1 APL a um Guardsman aliado a 6".',
        weapons:[
          { name:'Laspistol',      A:4, skill:3, D:3, CD:4, range:'short' },
          { name:'Espada de Poder',A:4, skill:3, D:4, CD:6, range:'melee', tags:['Lethal 5+'] },
        ]},
      { id:'kt-krieg-gunner', name:'Krieg Guardsman', unique:false, count:11,
        M:'3"', APL:1, GA:2, DF:3, SV:5, W:8,
        abilities:'Fanático: Ignora modificadores de moral. Nunca faz Fall Back.',
        weapons:[
          { name:'Lasgun',         A:4, skill:4, D:3, CD:4, range:'long', tags:['Relentless'] },
          { name:'Baioneta',       A:3, skill:4, D:2, CD:3, range:'melee' },
        ]},
      { id:'kt-krieg-melta', name:'Gunner com Meltagun', unique:true,
        M:'3"', APL:1, GA:2, DF:3, SV:5, W:8,
        abilities:'Melta: Critical hits com esta arma causam +2 de dano adicional.',
        weapons:[
          { name:'Meltagun',       A:4, skill:4, D:5, CD:6, range:'short', tags:['Melta'] },
          { name:'Baioneta',       A:3, skill:4, D:2, CD:3, range:'melee' },
        ]},
      { id:'kt-krieg-grenadier', name:'Grenadier', unique:true,
        M:'3"', APL:1, GA:2, DF:3, SV:5, W:8,
        abilities:'Granadas: Uma vez por batalha, pode lançar Granada Krak (D:5, CD:6, Blast).',
        weapons:[
          { name:'Lasgun',         A:4, skill:4, D:3, CD:4, range:'long', tags:['Relentless'] },
          { name:'Baioneta',       A:3, skill:4, D:2, CD:3, range:'melee' },
        ]},
    ]
  },

  // ── CHAOS SPACE MARINES (Traitor Astartes) ──────────
  {
    id:'kt-legionaries', name:'Legionaries', faction:'Chaos Space Marines',
    color:'#ef4444', emoji:'🔴',
    desc:'Ex-Space Marines corrompidos pelo Caos. Versáteis e implacáveis, com bênçãos sombrias.',
    style:'Melee · Versátil',
    limit: 6,
    operatives: [
      { id:'kt-legionary-aspiring', name:'Aspiring Champion', unique:true,
        M:'3"', APL:2, GA:1, DF:3, SV:3, W:16,
        abilities:'Bênção do Caos: No início da ativação, escolha um bônus: +1 Ataque, re-rolar Hits, ou +1 Dano.',
        weapons:[
          { name:'Bolter do Caos', A:4, skill:3, D:4, CD:5, range:'long' },
          { name:'Espada do Caos', A:5, skill:3, D:5, CD:7, range:'melee', tags:['Lethal 5+'] },
        ]},
      { id:'kt-legionary', name:'Legionary', unique:false, count:5,
        M:'3"', APL:2, GA:1, DF:3, SV:3, W:13,
        abilities:'Aura do Caos: Re-rola 1 dado de ataque por ativação.',
        weapons:[
          { name:'Bolter do Caos', A:4, skill:3, D:4, CD:5, range:'long' },
          { name:'Punho do Caos',  A:4, skill:3, D:4, CD:6, range:'melee' },
        ]},
    ]
  },

  // ── TAU PATHFINDERS ─────────────────────────────────
  {
    id:'kt-pathfinders', name:"T'au Pathfinders", faction:"T'au Empire",
    color:'#06b6d4', emoji:'🔵',
    desc:"Batedores T'au com tecnologia avançada de reconhecimento. Marcar alvos para aliados.",
    style:'Tiro · Suporte',
    limit: 10,
    operatives: [
      { id:'kt-pathfinder-shas', name:"Shas'ui Pathfinder", unique:true,
        M:'3"', APL:2, GA:1, DF:3, SV:5, W:10,
        abilities:"Liderança T'au: Pode usar Marcar Alvo como ação de 0 APL uma vez por ativação.",
        weapons:[
          { name:'Pulse Rifle',    A:4, skill:3, D:4, CD:6, range:'long', tags:['Assault'] },
          { name:'Lança Carbono',  A:3, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-pathfinder', name:'Pathfinder', unique:false, count:9,
        M:'3"', APL:2, GA:2, DF:3, SV:5, W:8,
        abilities:"Marcar Alvo: Ação (1 APL): alvo a até 9\" fica Marcado — todos os T'au ganham re-rolar 1 Hit contra ele.",
        weapons:[
          { name:'Pulse Carbine',  A:4, skill:4, D:3, CD:5, range:'short', tags:['Assault'] },
          { name:'Lança Carbono',  A:3, skill:4, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-pathfinder-drone', name:'Recon Drone', unique:true,
        M:'4"', APL:2, GA:1, DF:3, SV:5, W:8,
        abilities:'Voo: Ignora terreno ao mover. Sensor: Inimigos a 9" não podem ficar Hidden.',
        weapons:[
          { name:'Pulse Carbine',  A:4, skill:4, D:3, CD:5, range:'short', tags:['Assault'] },
          { name:'Colisão',        A:3, skill:4, D:3, CD:3, range:'melee' },
        ]},
    ]
  },
];

// ── KILL TEAM ACTIONS ────────────────────────────────
const KT_ACTIONS = [
  { name:'Mover',      apl:1, desc:'Move até M" em qualquer direção.' },
  { name:'Avançar',    apl:1, desc:'Move até M" adicional mas não pode atacar nesta ativação.' },
  { name:'Atacar',     apl:1, desc:'Faz um ataque com uma arma.' },
  { name:'Recarregar', apl:1, desc:'Remove o token de Recarregamento da arma.' },
  { name:'Esconder',   apl:1, desc:'Fica Hidden se estiver em cobertura.' },
  { name:'Lutar',      apl:1, desc:'Engaja em combate corpo a corpo.' },
  { name:'Misericórdia',apl:2,desc:'Elimina um operativo aliado ferido (conta como morto mas não Cortado).' },
];

// ── KILL TEAM DB ─────────────────────────────────────
const KT_DB = {
  getTeams()   { return KT_TEAMS; },
  getTeam(id)  { return KT_TEAMS.find(t => t.id === id); },
  getActions() { return KT_ACTIONS; },
};

// ── KILL TEAM SESSION ────────────────────────────────
const KT_SESSION = {
  teams:      [],   // [{playerId, playerName, teamId, color, operatives:[...with curW, dead, activated]}]
  turn:       1,
  phase:      'strategy', // strategy → firefight → morale
  activeIdx:  0,   // whose turn to activate
  turnOrder:  [],  // [playerId, playerId, ...] alternating
  log:        [],

  init(players) {
    this.teams = players.map((p, i) => {
      const team = KT_DB.getTeam(p.teamId);
      // Build full operative roster
      const operatives = [];
      (team?.operatives || []).forEach(op => {
        const count = p.selectedOps[op.id] || 0;
        for (let j = 0; j < count; j++) {
          operatives.push({
            ...op,
            instanceId: `${op.id}-${j}`,
            displayName: count > 1 ? `${op.name} ${j+1}` : op.name,
            curW: op.W,
            dead: false,
            activated: false,
            hidden: false,
            tokens: [], // Engaged, Reloading, etc.
          });
        }
      });
      return { playerId: `p${i}`, playerName: p.name, teamId: p.teamId,
               color: team?.color || '#888', operatives, cp: 2, score: 0 };
    });
    this.turn = 1;
    this.phase = 'strategy';
    this.activeIdx = 0;
    this.log = [];
    this.resetActivations();
  },

  getTeamByPlayer(playerId) { return this.teams.find(t => t.playerId === playerId); },

  resetActivations() {
    this.teams.forEach(t => t.operatives.forEach(op => op.activated = false));
    // Randomize who goes first each turn
    this.activeIdx = Math.floor(Math.random() * this.teams.length);
  },

  nextActivation() {
    // Alternate between teams
    this.activeIdx = (this.activeIdx + 1) % this.teams.length;
    // Check if all activated
    const anyLeft = this.teams.some(t => t.operatives.some(op => !op.dead && !op.activated));
    if (!anyLeft) this.endTurn();
  },

  endTurn() {
    this.turn++;
    this.resetActivations();
  },

  getActiveTeam() { return this.teams[this.activeIdx]; },

  applyDamage(playerId, instanceId, dmg) {
    const team = this.getTeamByPlayer(playerId);
    if (!team) return 0;
    const op = team.operatives.find(o => o.instanceId === instanceId);
    if (!op || op.dead) return 0;
    op.curW = Math.max(0, op.curW - dmg);
    if (op.curW === 0) op.dead = true;
    return op.dead ? 1 : 0;
  },
};
