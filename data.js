// ═══════════════════════════════════════════════════════
// DATA.JS — Storage, Units, Factions, Players
// ═══════════════════════════════════════════════════════

// ── DEFAULT FACTIONS ──────────────────────────────────
const DEFAULT_FACTIONS = [
  { id:'f-marines',  name:'Space Marines',   color:'#4a90d9', emoji:'🔵', sub:'Adeptus Astartes' },
  { id:'f-tyranids', name:'Tyranids',         color:'#a855f7', emoji:'🟣', sub:'Hive Fleet Leviathan' },
  { id:'f-necrons',  name:'Necrons',          color:'#22c55e', emoji:'🟢', sub:'Legião dos Mortos-Vivos' },
  { id:'f-orks',     name:'Orks',             color:'#f59e0b', emoji:'🟡', sub:'WAAAGH! Imparável' },
  { id:'f-chaos',    name:'Chaos Marines',    color:'#ef4444', emoji:'🔴', sub:'Servos dos Deuses do Caos' },
  { id:'f-tau',      name:"T'au",             color:'#06b6d4', emoji:'🔵', sub:"Império T'au — Bem Maior" },
  { id:'f-eldar',    name:'Aeldari',          color:'#ec4899', emoji:'🩷', sub:'Craftworld — Filhos das Estrelas' },
  { id:'f-guard',    name:'Astra Militarum',  color:'#d97706', emoji:'🟠', sub:'Guarda Imperial — Força em Números' },
];

// ── DEFAULT UNITS (10th Edition official stats) ────────
const DEFAULT_UNITS = [

  // ════════════════════════════════
  // SPACE MARINES
  // ════════════════════════════════
  { id:'du-sm-captain', name:'Capitaine Terminator', factionId:'f-marines',
    sub:'Líder · Terminator', emoji:'⚔', M:'5', T:5, Sv:2, W:6, Ld:6, OC:1, max:1,
    abilities:`Líder: Pode ser anexado a Escouade Terminator. Rito de Batalha: Enquanto lidera, re-role um dado de acerto por ataque. Sauvegarde Invulnerable: 4+.`,
    weapons:[
      {name:'Bolter Storm',      A:2, BS:2, S:4, AP:0,  D:1},
      {name:'Arma Relíquia',     A:5, BS:2, S:5, AP:-2, D:2, melee:true},
    ]},

  { id:'du-sm-librarian', name:'Archiviste Terminator', factionId:'f-marines',
    sub:'Psyker · Líder', emoji:'📖', M:'5', T:5, Sv:2, W:5, Ld:6, OC:1, max:1,
    abilities:`Vórtex Funesto: Na fase de Tiro, teste de Liderança — se passar, 1 unidade a 18" sofre D3 feridas mortais; se passar duas vezes, sofre D6. Se falhar, esta unidade sofre D3. Sauvegarde Invulnerable: 5+.`,
    weapons:[
      {name:'Bolter Storm',      A:2, BS:3, S:4, AP:0,  D:1},
      {name:'Arma de Força',     A:3, BS:3, S:6, AP:-1, D:'d3', melee:true},
    ]},

  { id:'du-sm-terminators', name:'Escouade Terminator', factionId:'f-marines',
    sub:'Infantaria Pesada', emoji:'🛡', M:'5', T:5, Sv:2, W:3, Ld:6, OC:1, max:5,
    abilities:`Frappe en Profondeur (Deep Strike): Pode entrar a partir do turno 2 a pelo menos 9" do inimigo. Sauvegarde Invulnerable: 4+. Salvaguarda Assaltante: pode carregar após avançar.`,
    weapons:[
      {name:'Bolter Storm',      A:2, BS:3, S:4, AP:0,  D:1},
      {name:'Punho de Força',    A:3, BS:3, S:8, AP:-2, D:2, melee:true},
    ]},

  { id:'du-sm-infernus', name:'Escouade Infernus', factionId:'f-marines',
    sub:'Lança-chamas · Anti-horda', emoji:'🔥', M:'6', T:4, Sv:3, W:2, Ld:6, OC:1, max:5,
    abilities:`Torrent: Lança-chamas sempre acerta — não rola dado de Hit. Agonie da Mort: Quando destruído em CaC, em 4+ causa 1 ferida mortal no inimigo mais próximo.`,
    weapons:[
      {name:'Lança-chamas Infernus', A:'d6', BS:0, S:4, AP:-1, D:1, auto:true},
      {name:'C.a.C.',                A:2,   BS:3, S:4, AP:0,  D:1, melee:true},
    ]},

  { id:'du-sm-intercessors', name:'Intercessors', factionId:'f-marines',
    sub:'Infantaria · Versáteis', emoji:'🔫', M:'6', T:4, Sv:3, W:2, Ld:6, OC:2, max:10,
    abilities:`Bolt Rifle: Arma de tiro versátil a 30". Steady Advance: pode atirar mesmo após Avançar, mas com -1 na precisão.`,
    weapons:[
      {name:'Bolt Rifle',        A:2, BS:3, S:4, AP:-1, D:1},
      {name:'Espada Astartes',   A:3, BS:3, S:4, AP:-1, D:1, melee:true},
    ]},

  { id:'du-sm-invader', name:'Invader ATV', factionId:'f-marines',
    sub:'Veículo · Reconhecimento', emoji:'🚗', M:'12', T:5, Sv:3, W:8, Ld:6, OC:2, max:1,
    abilities:`Escolta de Outrider: Uma vez por turno, quando uma unidade montada aliada a 6" for atacada, o ATV pode atirar imediatamente de volta. Veículo: pode atirar com todas as armas.`,
    weapons:[
      {name:'Canhão Gatling',    A:8, BS:3, S:5, AP:0,  D:1,     devastating:true},
      {name:'Multi-melta',       A:2, BS:3, S:9, AP:-4, D:'d6',  melta:true},
      {name:'Twin Bolt Rifle',   A:2, BS:3, S:4, AP:-1, D:1,     twinLinked:true},
    ]},

  { id:'du-sm-dreadnought', name:'Dreadnought', factionId:'f-marines',
    sub:'Veículo · Walker', emoji:'🤖', M:'6', T:9, Sv:3, W:8, Ld:6, OC:3, max:1,
    abilities:`Guerreiro Glorioso: No começo do combate, ganha +1 ataque para cada unidade inimiga a 1". Sauvegarde Invulnerable: 4+. Veículo: pode atirar com todas as armas.`,
    weapons:[
      {name:'Canhão Assault 2',  A:4, BS:3, S:6, AP:-1, D:2},
      {name:'Multi-melta',       A:2, BS:3, S:9, AP:-4, D:'d6',  melta:true},
      {name:'Punho Dreadnought', A:5, BS:3, S:12,AP:-3, D:3,     melee:true},
    ]},

  { id:'du-sm-outriders', name:'Outriders', factionId:'f-marines',
    sub:'Montado · Rápido', emoji:'🏍', M:'14', T:5, Sv:3, W:3, Ld:6, OC:2, max:3,
    abilities:`Turbobike: pode Avançar e Carregar no mesmo turno. Twin Bolt Rifle: arma emparelhada re-rola falhas de Wound.`,
    weapons:[
      {name:'Twin Bolt Rifle',   A:2, BS:3, S:4, AP:-1, D:1, twinLinked:true},
      {name:'Golpe de Moto',     A:3, BS:3, S:6, AP:-1, D:1, melee:true},
    ]},

  // ════════════════════════════════
  // TYRANIDS
  // ════════════════════════════════
  { id:'du-ty-hivetyrant', name:'Primat Tyranide', factionId:'f-tyranids',
    sub:'Monstro · Synapse · Líder', emoji:'👾', M:'10', T:10, Sv:4, W:12, Ld:6, OC:3, max:1,
    abilities:`Synapse: Unidades Tyranid a 6" re-rolam testes de Liderança. Sombra no Warp: Inimigos a 12" têm -1 em Liderança. Sauvegarde Invulnerable: 4+. Voo: ignora terreno.`,
    weapons:[
      {name:'Garras Adunadas',   A:5, BS:4, S:14,AP:-3, D:3,  melee:true},
      {name:'Garras Raptoras',   A:5, BS:4, S:7, AP:-2, D:2,  melee:true, sustained:true},
    ]},

  { id:'du-ty-termagants', name:'Termagants', factionId:'f-tyranids',
    sub:'Enxame · Infantaria', emoji:'🦗', M:'6', T:3, Sv:5, W:1, Ld:6, OC:2, max:20,
    abilities:`Synapse: Deve estar a 6" de unidade Synapse para funcionar plenamente. Coesão: Todas as miniaturas devem terminar a 2" de pelo menos outra da unidade.`,
    weapons:[
      {name:'Fleshborer',        A:1, BS:4, S:4, AP:0,  D:1},
      {name:'Garras e Dentes',   A:1, BS:4, S:3, AP:0,  D:1, melee:true},
    ]},

  { id:'du-ty-hormagaunts', name:'Hormagaunts', factionId:'f-tyranids',
    sub:'Enxame · Melee Rápido', emoji:'🦎', M:'8', T:3, Sv:5, W:1, Ld:6, OC:1, max:20,
    abilities:`Impulso Predatório: Após uma carga bem sucedida, cada miniatura pode se mover 3" adicionais antes de lutar. Synapse: deve estar perto de unidade Synapse.`,
    weapons:[
      {name:'Lâminas Foice',     A:2, BS:4, S:4, AP:-1, D:1, melee:true},
    ]},

  { id:'du-ty-barbgaunts', name:'Barbgaunts', factionId:'f-tyranids',
    sub:'Suporte · Tiro', emoji:'🦂', M:'6', T:3, Sv:5, W:1, Ld:6, OC:2, max:10,
    abilities:`Disparo Spalpe: Unidades atingidas pelos Farpas não podem Avançar no próximo turno. Synapse: precisa de suporte Synapse.`,
    weapons:[
      {name:'Farpas',            A:3, BS:3, S:5, AP:-1, D:1},
      {name:'Garras',            A:1, BS:4, S:3, AP:0,  D:1, melee:true},
    ]},

  { id:'du-ty-bondisseurs', name:'Bondisseurs de Von Ryan', factionId:'f-tyranids',
    sub:'Infiltração · Melee · Flanco', emoji:'🦖', M:'10', T:5, Sv:4, W:3, Ld:6, OC:1, max:6,
    abilities:`Infiltração: Antes do turno 1, coloque a mais de 9" de qualquer inimigo. Saltadores: pode Avançar E Carregar no mesmo turno. Reposicionamento: Uma vez por batalha, pode se retirar e reposicionar.`,
    weapons:[
      {name:'Garras de Caça',    A:3, BS:3, S:5, AP:-2, D:1, melee:true, sustained:true},
    ]},

  { id:'du-ty-carnifex', name:'Carnifex', factionId:'f-tyranids',
    sub:'Monstro · Destruição', emoji:'🦕', M:'8', T:9, Sv:3, W:10, Ld:6, OC:3, max:2,
    abilities:`Couro Reforçado: Re-rola resultados de 1 nos saves. Monstruoso: Pode mover através de unidades inimigas ao carregar. Sauvegarde Invulnerable: 5+.`,
    weapons:[
      {name:'Bio-canhão',        A:3, BS:4, S:8, AP:-2, D:'d3'},
      {name:'Punhos Esmagadores',A:5, BS:4, S:12,AP:-2, D:3,  melee:true},
    ]},

  { id:'du-ty-warriors', name:'Tyranid Warriors', factionId:'f-tyranids',
    sub:'Synapse · Elite', emoji:'🦴', M:'6', T:5, Sv:4, W:3, Ld:6, OC:2, max:6,
    abilities:`Synapse: Fornece Synapse para unidades Tyranid a 6". Prime Instinct: Re-rola testes de Liderança quando estiver abaixo da metade da força original.`,
    weapons:[
      {name:'Devorador',         A:3, BS:3, S:5, AP:0,  D:1},
      {name:'Lâminas Tyranid',   A:4, BS:3, S:5, AP:-1, D:1, melee:true},
    ]},

  // ════════════════════════════════
  // NECRONS
  // ════════════════════════════════
  { id:'du-ne-warriors', name:'Necron Warriors', factionId:'f-necrons',
    sub:'Infantaria · Horda', emoji:'🤖', M:'5', T:4, Sv:4, W:1, Ld:7, OC:2, max:20,
    abilities:`Reanimação: No fim da Command Phase, esta unidade reganha D3 wounds. Horda: Quando reanima perto de objetivo, reganha D6 em vez de D3. Protocolo da Eterna Guarda: +1 na salvaguarda quando no objetivo.`,
    weapons:[
      {name:'Gauss Flayer',      A:1, BS:4, S:4, AP:0,  D:1, tags:'Rapid Fire, Lethal Hits'},
      {name:'Garras Necrônicas', A:1, BS:4, S:4, AP:0,  D:1, melee:true},
    ]},

  { id:'du-ne-immortals', name:'Immortals', factionId:'f-necrons',
    sub:'Infantaria Elite', emoji:'⚙', M:'5', T:4, Sv:3, W:2, Ld:7, OC:1, max:10,
    abilities:`Reanimação: Reganha D3 wounds no fim da Command Phase. Tessla Immortal: Em 6 no Hit, causa 2 hits adicionais (se usando Tesla). Unidade durável e confiável.`,
    weapons:[
      {name:'Gauss Blaster',     A:2, BS:3, S:5, AP:-2, D:1},
      {name:'Tesla Carbine',     A:2, BS:3, S:5, AP:0,  D:1, sustained:true},
      {name:'Lâminas Frias',     A:2, BS:3, S:4, AP:0,  D:1, melee:true},
    ]},

  { id:'du-ne-overlord', name:'Overlord', factionId:'f-necrons',
    sub:'Líder · Personagem', emoji:'👑', M:'5', T:5, Sv:3, W:6, Ld:7, OC:2, max:1,
    abilities:`Líder: Pode se juntar a Warriors ou Immortals. Vontade do Overlord: Enquanto lidera, unidade re-rola 1s nos Hits. Sauvegarde Invulnerable: 4+. Reanimação: Reganha D3 wounds.`,
    weapons:[
      {name:'Vara Voltaica',     A:3, BS:3, S:5, AP:-2, D:2},
      {name:'Espada Hiper-fásica',A:4,BS:2, S:6, AP:-3, D:2, melee:true},
    ]},

  { id:'du-ne-lychguard', name:'Lychguard', factionId:'f-necrons',
    sub:'Guarda Elite · CaC', emoji:'🗡', M:'5', T:5, Sv:3, W:2, Ld:7, OC:1, max:10,
    abilities:`Sauvegarde Invulnerable: 4+. Escudo Dissipador: Se equipado com escudo, qualquer 6 no save redireciona o ataque de volta ao atacante com F:3 AP:-1 D:1. Guardiões Juramentados.`,
    weapons:[
      {name:'Foice Hiper-fásica', A:3, BS:3, S:7, AP:-2, D:2, melee:true},
    ]},

  { id:'du-ne-canoptek', name:'Canoptek Scarabs', factionId:'f-necrons',
    sub:'Enxame · Rápido', emoji:'🪲', M:'10', T:3, Sv:6, W:4, Ld:7, OC:0, max:9,
    abilities:`Enxame Corrosivo: Ao morrer em CaC, causa 1 ferida mortal na unidade inimiga mais próxima. Sem Mente: Imune a testes de Liderança e efeitos de moral.`,
    weapons:[
      {name:'Mandíbulas Fóticas', A:4, BS:4, S:3, AP:0, D:1, melee:true},
    ]},

  { id:'du-ne-doomsday', name:'Doomsday Ark', factionId:'f-necrons',
    sub:'Veículo · Artillery', emoji:'🛸', M:'8', T:10, Sv:3, W:14, Ld:7, OC:3, max:1,
    abilities:`Canhão do Dia do Juízo: Se não se mover, o canhão principal dobra seus ataques. Sauvegarde Invulnerable: 5+. Propulsão Gravitônica: Voa. Veículo: múltiplas armas.`,
    weapons:[
      {name:'Canhão Dia do Juízo',A:3, BS:3, S:14,AP:-4, D:'d6'},
      {name:'Gauss Flayer (x2)', A:4, BS:3, S:4, AP:0,  D:1},
    ]},

  // ════════════════════════════════
  // ORKS
  // ════════════════════════════════
  { id:'du-or-boyz', name:'Ork Boyz', factionId:'f-orks',
    sub:'Horda · Infantaria', emoji:'💪', M:'6', T:4, Sv:6, W:1, Ld:7, OC:2, max:20,
    abilities:`Sheer Weight of Bodies: Esta unidade não precisa passar em teste de moral se ainda tiver 10+ miniaturas. WAAAGH!: Em turno de WAAAGH, ganha +1 Ataque em CaC.`,
    weapons:[
      {name:'Shoota',            A:2, BS:5, S:4, AP:0,  D:1},
      {name:'Choppa',            A:2, BS:3, S:5, AP:-1, D:1, melee:true},
    ]},

  { id:'du-or-nobz', name:'Nobz', factionId:'f-orks',
    sub:'Elite · CaC', emoji:'👊', M:'6', T:5, Sv:4, W:2, Ld:7, OC:1, max:10,
    abilities:`Brutal mas Kunnin: Re-rola 1s nos Hits em CaC. Acompanha Warboss: +1 Ataque quando perto de Warboss.`,
    weapons:[
      {name:'Big Choppa',        A:3, BS:3, S:7, AP:-1, D:2, melee:true},
      {name:'Slugga',            A:1, BS:5, S:4, AP:0,  D:1},
    ]},

  { id:'du-or-warboss', name:'Warboss', factionId:'f-orks',
    sub:'Líder · Personagem', emoji:'🏆', M:'6', T:6, Sv:3, W:7, Ld:7, OC:2, max:1,
    abilities:`WAAAGH!: Uma vez por batalha, declara WAAAGH — todas as unidades Ork a 12" ganham +1 Ataque em CaC neste turno. Lider da Waagh: Enquanto lidera, unidade re-rola 1s em Hits e Wounds.`,
    weapons:[
      {name:'Klaw de Energia',   A:4, BS:3, S:10,AP:-3, D:2, melee:true},
      {name:'Dakkagun',          A:3, BS:5, S:5, AP:-1, D:1},
    ]},

  { id:'du-or-killa-kans', name:'Killa Kans', factionId:'f-orks',
    sub:'Veículo Walker', emoji:'🦾', M:'6', T:7, Sv:3, W:5, Ld:7, OC:2, max:3,
    abilities:`Maniak Orky: Se uma miniatura morrer dentro de 3', esta pode fazer um ataque adicional de Carga. Groteskamente Divertido: Causa terror — unidades que perderem CaC contra esta devem testar Liderança.`,
    weapons:[
      {name:'Rokkit Launcha',    A:2, BS:5, S:8, AP:-2, D:'d3'},
      {name:'Klaw Killa',        A:4, BS:3, S:8, AP:-2, D:2, melee:true},
    ]},

  // ════════════════════════════════
  // CHAOS SPACE MARINES
  // ════════════════════════════════
  { id:'du-ch-csm', name:'Chaos Space Marines', factionId:'f-chaos',
    sub:'Infantaria · Tropa', emoji:'💀', M:'6', T:4, Sv:3, W:2, Ld:6, OC:1, max:10,
    abilities:`Marcha Caótica: Esta unidade pode mover-se 6" adicionais na Fase de Movimento se não atirar. Aura do Caos: Enquanto perto de um Campeão do Caos, re-rola 1s em Hits.`,
    weapons:[
      {name:'Bolter do Caos',    A:2, BS:3, S:4, AP:0,  D:1},
      {name:'Espada do Caos',    A:3, BS:3, S:4, AP:-1, D:1, melee:true},
    ]},

  { id:'du-ch-lord', name:'Chaos Lord', factionId:'f-chaos',
    sub:'Líder · Personagem', emoji:'😈', M:'6', T:5, Sv:3, W:6, Ld:6, OC:1, max:1,
    abilities:`Líder: Enquanto lidera, unidade re-rola 1s em Hits. Bênção do Caos: Uma vez por turno na Command Phase, escolha um Deus do Caos — unidade ganha bônus diferente. Sauvegarde Invulnerable: 4+.`,
    weapons:[
      {name:'Espada do Caos',    A:6, BS:2, S:5, AP:-2, D:2, melee:true},
      {name:'Pistola do Caos',   A:1, BS:2, S:4, AP:0,  D:1},
    ]},

  { id:'du-ch-obliterators', name:'Obliterators', factionId:'f-chaos',
    sub:'Elite · Mutantes', emoji:'🔱', M:'5', T:6, Sv:2, W:4, Ld:6, OC:1, max:3,
    abilities:`Fundido com as Armas: As armas dos Obliterators são parte do corpo. Deep Strike: Podem entrar em campo a partir do turno 2. Sauvegarde Invulnerable: 4+.`,
    weapons:[
      {name:'Armas Fundidas',    A:4, BS:3, S:8, AP:-2, D:'d3'},
      {name:'Punhos de Ferro',   A:3, BS:3, S:9, AP:-3, D:3, melee:true},
    ]},

  { id:'du-ch-rhino', name:'Rhino', factionId:'f-chaos',
    sub:'Veículo · Transporte', emoji:'🚌', M:'12', T:9, Sv:3, W:10, Ld:6, OC:3, max:1,
    abilities:`Transporte: Pode carregar até 10 miniaturas de Infantaria. Smoke Launchers: Uma vez por batalha, em 4+ nega acertos de tiro neste turno. Veículo: múltiplas armas.`,
    weapons:[
      {name:'Bolter Pesado',     A:3, BS:3, S:5, AP:-1, D:2},
      {name:'Aríete',            A:3, BS:3, S:8, AP:-1, D:3, melee:true},
    ]},

  // ════════════════════════════════
  // T'AU
  // ════════════════════════════════
  { id:'du-ta-firewarriors', name:"Fire Warriors", factionId:'f-tau',
    sub:'Infantaria · Tiro', emoji:'🔷', M:'6', T:3, Sv:4, W:1, Ld:6, OC:2, max:10,
    abilities:`Por Acima do Bem Maior: Re-rola 1s em Hits quando próximo de Ethereal. Protocolos de Fogo: Escolha um protocolo de combate na Command Phase — Montagem de Fuego (+1 Ataque), Retrocesso (-AP), ou Perseguição (+alcance).`,
    weapons:[
      {name:"Rifle Pulse",       A:2, BS:4, S:5, AP:-1, D:1},
      {name:'Pistola Pulse',     A:1, BS:4, S:5, AP:-1, D:1},
      {name:'Lança Carbono',     A:1, BS:4, S:4, AP:0,  D:1, melee:true},
    ]},

  { id:'du-ta-crisis', name:'Crisis Battlesuit', factionId:'f-tau',
    sub:'Traje de Batalha · Versátil', emoji:'🦾', M:'10', T:5, Sv:3, W:4, Ld:6, OC:1, max:3,
    abilities:`Thrust Move: Após atirar pode mover-se 6". Deep Strike. Suporte de Drones: Pode ter até 2 Drones como escoltas. Sauvegarde Invulnerable: 5+.`,
    weapons:[
      {name:'Canhão Fusão',      A:2, BS:4, S:9, AP:-4, D:'d6', melta:true},
      {name:'Plasma Rifle',      A:2, BS:4, S:8, AP:-3, D:2},
      {name:'Armas do Traje',    A:3, BS:4, S:5, AP:-1, D:1, melee:true},
    ]},

  { id:'du-ta-riptide', name:'Riptide Battlesuit', factionId:'f-tau',
    sub:'Monstruoso · Pesado', emoji:'🛡', M:'10', T:9, Sv:2, W:14, Ld:6, OC:5, max:1,
    abilities:`Núcleo de Nova: Uma vez por turno, ative o Núcleo. Em 2+ dobra ataques do canhão; em 1 sofre 1 ferida mortal. Deep Strike. Sauvegarde Invulnerable: 5+.`,
    weapons:[
      {name:'Canhão Ion Pesado',  A:6, BS:4, S:9, AP:-3, D:3},
      {name:'Lança-foguetes',     A:4, BS:4, S:7, AP:-1, D:'d3'},
      {name:'Punhos do Traje',    A:4, BS:4, S:8, AP:-1, D:2, melee:true},
    ]},

  // ════════════════════════════════
  // AELDARI
  // ════════════════════════════════
  { id:'du-el-guardians', name:'Defensores Guardiões', factionId:'f-eldar',
    sub:'Infantaria · Tiro', emoji:'🌟', M:'8', T:3, Sv:4, W:1, Ld:6, OC:1, max:10,
    abilities:`Agilidade Élfica: Re-rola 1s em saves quando em cover. Plataforma de Armas: Cada 10 Guardiões podem ter uma Plataforma de Armas Pesadas como suporte.`,
    weapons:[
      {name:'Catapulta Shuriken', A:2, BS:3, S:4, AP:-1, D:1},
      {name:'Lâmina Shuriken',    A:1, BS:3, S:3, AP:-1, D:1, melee:true},
    ]},

  { id:'du-el-wraithguard', name:'Wraithguard', factionId:'f-eldar',
    sub:'Construto · Elite', emoji:'👻', M:'6', T:6, Sv:3, W:3, Ld:6, OC:1, max:5,
    abilities:`Canhão Wraith: D3+3 dano em hits! Sauvegarde Invulnerable: 4+. Mente Espiritual: Imune a testes de Liderança. Construto: não pode ser alvo de efeitos de veneno.`,
    weapons:[
      {name:'Canhão Wraith',     A:1, BS:3, S:14,AP:-4, D:'d3+3'},
      {name:'Espada Espiritual',  A:2, BS:3, S:7, AP:-3, D:'d3', melee:true},
    ]},

  { id:'du-el-farseer', name:'Farseer', factionId:'f-eldar',
    sub:'Psyker · Líder', emoji:'🔮', M:'7', T:3, Sv:6, W:4, Ld:6, OC:1, max:1,
    abilities:`Guia: Uma vez por turno, uma unidade Aeldari a 12" re-rola todos os Hits neste turno. Premonição: Uma vez por turno, uma unidade aliada a 12" re-rola todos os saves. Sauvegarde Invulnerable: 4+.`,
    weapons:[
      {name:'Projéteis Shuriken', A:3, BS:2, S:4, AP:-1, D:1},
      {name:'Espada De Runas',    A:4, BS:2, S:3, AP:-3, D:1, melee:true},
    ]},

  // ════════════════════════════════
  // ASTRA MILITARUM
  // ════════════════════════════════
  { id:'du-am-infantry', name:'Infantry Squad', factionId:'f-guard',
    sub:'Infantaria · Tropa', emoji:'🪖', M:'6', T:3, Sv:5, W:1, Ld:6, OC:2, max:10,
    abilities:`Ordens: Um oficial pode emitir ordens como "Fuego a Vontade" (+1 disparo), "Firme!" (re-rola saves) ou "Avance!" (mover + atirar sem penalidade).`,
    weapons:[
      {name:'Lasgun',            A:1, BS:4, S:3, AP:0,  D:1},
      {name:'Bayoneta',          A:1, BS:4, S:3, AP:0,  D:1, melee:true},
    ]},

  { id:'du-am-leman-russ', name:'Leman Russ', factionId:'f-guard',
    sub:'Veículo · Tanque Principal', emoji:'🚀', M:'10', T:11, Sv:2, W:13, Ld:6, OC:5, max:1,
    abilities:`Guardião da Linha: Re-rola 1s em Hits e Wounds quando não se moveu. Veículo Pesado: pode atirar com todas as armas mesmo se mover. Super Pesado: não pode ser Imobilizado.`,
    weapons:[
      {name:'Canhão Leman Russ', A:1, BS:3, S:10,AP:-3, D:'d6+2'},
      {name:'Bolter Pesado',     A:3, BS:4, S:5, AP:-1, D:2},
      {name:'Bolter Pesado (co-axial)',A:3,BS:4,S:5,AP:-1,D:2},
      {name:'Aríete de Batalha', A:3, BS:3, S:9, AP:-2, D:3, melee:true},
    ]},

  { id:'du-am-commissar', name:'Commissar', factionId:'f-guard',
    sub:'Líder · Moral', emoji:'🎖', M:'6', T:3, Sv:5, W:4, Ld:6, OC:1, max:1,
    abilities:`Execução Sumária: Se a unidade que lidera falhar em um teste de Moral, o Comissário pode executar uma miniatura — o teste é automaticamente passado. Inspira a Tropa: Unidade liderada por ele re-rola testes de Liderança.`,
    weapons:[
      {name:'Pistola Plasma',    A:1, BS:3, S:8, AP:-3, D:2},
      {name:'Espada Poder',      A:4, BS:3, S:4, AP:-2, D:1, melee:true},
    ]},

  { id:'du-am-sentinels', name:'Scout Sentinels', factionId:'f-guard',
    sub:'Walker · Reconhecimento', emoji:'🦿', M:'8', T:5, Sv:4, W:5, Ld:6, OC:2, max:3,
    abilities:`Infiltração: Pode ser colocado em posição avançada antes do turno 1. Lança-fumaça: Uma vez por batalha, em 4+ nega acertos de tiro neste turno.`,
    weapons:[
      {name:'Autocanhão Scout',  A:3, BS:4, S:7, AP:-1, D:2},
      {name:'Patas Mecânicas',   A:3, BS:4, S:6, AP:0,  D:1, melee:true},
    ]},

];

// ══════════════════════════════════════════════════════
// STORAGE API
// ══════════════════════════════════════════════════════
const DB = {
  getFactions() {
    try {
      const custom = JSON.parse(localStorage.getItem('wh40k_factions') || '[]');
      const map = {};
      DEFAULT_FACTIONS.forEach(f => map[f.id] = f);
      custom.forEach(f => map[f.id] = f);
      return Object.values(map);
    } catch(e) { return [...DEFAULT_FACTIONS]; }
  },
  getFaction(id) { return this.getFactions().find(f => f.id === id); },
  saveFaction(faction) {
    let list = JSON.parse(localStorage.getItem('wh40k_factions') || '[]');
    const idx = list.findIndex(f => f.id === faction.id);
    if (idx >= 0) list[idx] = faction; else list.push(faction);
    localStorage.setItem('wh40k_factions', JSON.stringify(list));
  },
  deleteFaction(id) {
    let list = JSON.parse(localStorage.getItem('wh40k_factions') || '[]');
    localStorage.setItem('wh40k_factions', JSON.stringify(list.filter(f => f.id !== id)));
  },

  getUnits(factionId) {
    try {
      const custom = JSON.parse(localStorage.getItem('wh40k_units') || '[]');
      const map = {};
      DEFAULT_UNITS.forEach(u => map[u.id] = u);
      custom.forEach(u => map[u.id] = u);
      const all = Object.values(map);
      return factionId ? all.filter(u => u.factionId === factionId) : all;
    } catch(e) { return factionId ? DEFAULT_UNITS.filter(u => u.factionId === factionId) : [...DEFAULT_UNITS]; }
  },
  getUnit(id) { return this.getUnits().find(u => u.id === id); },
  saveUnit(unit) {
    let list = JSON.parse(localStorage.getItem('wh40k_units') || '[]');
    const idx = list.findIndex(u => u.id === unit.id);
    if (idx >= 0) list[idx] = unit; else list.push(unit);
    localStorage.setItem('wh40k_units', JSON.stringify(list));
  },
  deleteUnit(id) {
    // Only allow deleting custom units
    if (id.startsWith('du-')) {
      // For defaults, mark as hidden instead
      let hidden = JSON.parse(localStorage.getItem('wh40k_hidden') || '[]');
      if (!hidden.includes(id)) hidden.push(id);
      localStorage.setItem('wh40k_hidden', JSON.stringify(hidden));
      return;
    }
    let list = JSON.parse(localStorage.getItem('wh40k_units') || '[]');
    localStorage.setItem('wh40k_units', JSON.stringify(list.filter(u => u.id !== id)));
  },
  isHidden(id) {
    try {
      const hidden = JSON.parse(localStorage.getItem('wh40k_hidden') || '[]');
      return hidden.includes(id);
    } catch(e) { return false; }
  },
  getUnitsVisible(factionId) {
    return this.getUnits(factionId).filter(u => !this.isHidden(u.id));
  },
  restoreDefault(id) {
    let hidden = JSON.parse(localStorage.getItem('wh40k_hidden') || '[]');
    localStorage.setItem('wh40k_hidden', JSON.stringify(hidden.filter(h => h !== id)));
  },
  duplicateUnit(id) {
    const u = this.getUnit(id);
    if (!u) return null;
    const copy = { ...u, id: 'custom-' + Date.now(), name: u.name + ' (Cópia)',
      weapons: u.weapons.map(w => ({...w})) };
    this.saveUnit(copy);
    return copy;
  },

  exportLibrary() {
    const factions = JSON.parse(localStorage.getItem('wh40k_factions') || '[]');
    const units    = JSON.parse(localStorage.getItem('wh40k_units')    || '[]');
    const hidden   = JSON.parse(localStorage.getItem('wh40k_hidden')   || '[]');
    return JSON.stringify({ version: 3, factions, units, hidden, exportedAt: new Date().toISOString() }, null, 2);
  },
  importLibrary(jsonStr) {
    const data = JSON.parse(jsonStr);
    if (!data.version) throw new Error('Arquivo inválido');
    if (data.factions) localStorage.setItem('wh40k_factions', JSON.stringify(data.factions));
    if (data.units)    localStorage.setItem('wh40k_units',    JSON.stringify(data.units));
    if (data.hidden)   localStorage.setItem('wh40k_hidden',   JSON.stringify(data.hidden));
    return { factions: (data.factions||[]).length, units: (data.units||[]).length };
  },
};

// ══════════════════════════════════════════════════════
// GAME SESSION
// ══════════════════════════════════════════════════════
const SESSION = {
  players: [],
  init(players) { this.players = players.map((p, i) => ({ ...p, id: `p${i}` })); },
  getPlayer(id) { return this.players.find(p => p.id === id); },
  getPlayerUnits(playerId) {
    const p = this.getPlayer(playerId);
    if (!p) return [];
    return Object.entries(p.units).map(([unitId, qty]) => {
      const u = DB.getUnit(unitId);
      return u ? { ...u, qty } : null;
    }).filter(Boolean);
  },
};
