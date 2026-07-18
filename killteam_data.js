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
    coreRule:{name:"Astartes",desc:"Cada operativo pode fazer 2 ações de Tiro OU 2 de Luta na mesma ativação (nunca uma de cada)."},
    ploys:{strategy:[{name:"Doutrina de Combate",desc:"Escolha uma doutrina no turno — Devastador (tiro longe), Tático (tiro perto) ou Assalto (CaC) — unidades ganham re-roll de 1 dado na situação escolhida."},{name:"Eles Não Temem",desc:"Ignora penalidades de status por estar ferido."}],firefight:[{name:"Fisiologia Transumana",desc:"Ao ser alvo de tiro, transforma um sucesso normal de defesa em crítico."},{name:"Assalto de Choque",desc:"Após uma Carga bem sucedida, o primeiro golpe em CaC causa +1 dano."}]},
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
    coreRule:{name:"Synapse",desc:"Operativos Tyranid a 6\" de um Warrior podem re-rolar 1 dado de Defesa por ativação."},
    ploys:{strategy:[{name:"Fome Insaciável",desc:"Armas corpo a corpo ganham a regra Rending (retêm 1 sucesso normal como crítico extra)."},{name:"Instinto de Enxame",desc:"Operativos a 6\" de um Warrior incapacitado ganham +1 no próximo ataque, por vingança."}],firefight:[{name:"Fúria Predatória",desc:"Após uma Carga, pode se mover +3\" antes de lutar."},{name:"Casca Reforçada",desc:"Re-rola 1s nos dados de Defesa uma vez por ativação."}]},
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
    desc:'Orks furtivos especializados em infiltração e emboscadas. Time completo com 11 tipos de especialista — do Boss Nob ao Bomb Squig suicida.',
    style:'Furtivo · Melee',
    limit: 10, // 1 Boss Nob + 9 tropas
    coreRule:{name:"Throat Slittas",desc:"Todo Kommando (exceto Bomb Squig) pode Cargar mesmo com ordem de Ocultar."},
    ploys:{strategy:[{name:"DAKKA! DAKKA! DAKKA!",desc:"Armas de tiro ganham Punishing — retém uma falha como sucesso normal se já reteve algum crítico."},{name:"Skulk About",desc:"Operativo com ordem Ocultar retém 1 sucesso de defesa sem rolar dado."},{name:"SSSSHHHH!",desc:"Operativos ocultos e fora de alcance de visão podem fazer um Dash grátis (não no 1º turno)."},{name:"WAAAGH!",desc:"Armas corpo a corpo ganham Balanced — pode re-rolar 1 dado de ataque."}],firefight:[{name:"Só um Arranhão",desc:"Ignora um dano normal recebido (exceto Bomb Squig e Grot)."},{name:"Kunnin\' Mas Brutal",desc:"Ao Cargar oculto, o primeiro golpe normal em CaC vira crítico."},{name:"Krump \'Em",desc:"No fim da Firefight Phase, um Kommando faz uma ação de Luta grátis."},{name:"Aguenta Firme",desc:"Ignora mudanças no APL até o início do próximo turno."}]},
    operatives: [
      { id:'kt-kommando-boss', name:'Boss Nob', unique:true,
        M:'6"', APL:3, GA:1, DF:4, SV:5, W:14,
        abilities:'Get it Dun (1AP): dá +1 APL a um Kommando aliado a 6". Krumpin\' Time: pode fazer 2 ações de Luta na mesma ativação. Throat Slittas: pode Cargar mesmo com ordem de Ocultar.',
        weapons:[
          { name:'Slugga',       A:4, skill:4, D:3, CD:4, range:'short' },
          { name:'Klaw de Força',A:4, skill:3, D:5, CD:7, range:'melee', tags:['Brutal','Shock'] },
        ]},
      { id:'kt-kommando-boy', name:'Kommando Boy', unique:false, count:9,
        M:'6"', APL:2, GA:2, DF:4, SV:5, W:10,
        abilities:'Tactical Wot-Notz: pode usar granada de fumaça ou atordoante 1x/turno sem gastar uso limitado. Throat Slittas: pode Cargar com ordem de Ocultar.',
        weapons:[
          { name:'Slugga', A:4, skill:4, D:3, CD:4, range:'short' },
          { name:'Choppa', A:4, skill:3, D:4, CD:5, range:'melee' },
        ]},
      { id:'kt-kommando-grot', name:'Grot', unique:true,
        M:'6"', APL:2, GA:1, DF:4, SV:5, W:5,
        abilities:'Grappling Hook (1AP): teleporta para outro ponto de terreno visível. Sneaky Zogger: não pode ter ordem Engage; em cobertura, quase impossível de ser alvo.',
        weapons:[
          { name:'Machadinha Grot', A:3, skill:5, D:1, CD:4, range:'melee' },
        ]},
      { id:'kt-kommando-slasha', name:'Slasha Boy', unique:true,
        M:'6"', APL:2, GA:1, DF:4, SV:5, W:10,
        abilities:'Dat All You Got?: após lutar sem ser incapacitado, causa 1D3 dano extra no inimigo.',
        weapons:[
          { name:'Facas de Arremesso', A:4, skill:3, D:2, CD:5, range:'short', tags:['Silent'] },
          { name:'Choppas Gêmeas',     A:4, skill:3, D:4, CD:5, range:'melee', tags:['Ceaseless','Lethal 5+'] },
        ]},
      { id:'kt-kommando-breacha', name:'Breacha Boy', unique:true,
        M:'6"', APL:2, GA:1, DF:4, SV:5, W:10,
        abilities:'Breach (1AP): abre passagem em terreno, permitindo atravessar paredes finas.',
        weapons:[
          { name:'Slugga',       A:4, skill:4, D:3, CD:4, range:'short' },
          { name:'Aríete Breacha',A:4, skill:4, D:5, CD:5, range:'melee', tags:['Brutal','Severe','Shock'] },
        ]},
      { id:'kt-kommando-snipa', name:'Kommando Snipa', unique:true,
        M:'6"', APL:2, GA:1, DF:4, SV:5, W:10,
        abilities:'Concealed Position: primeiro tiro da batalha ignora cobertura e é silencioso.',
        weapons:[
          { name:'Big Shoota com Mira', A:5, skill:3, D:3, CD:3, range:'long', tags:['Silent','Heavy'] },
          { name:'Punhos',              A:3, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-kommando-dakka', name:'Dakka Boy', unique:true,
        M:'6"', APL:2, GA:1, DF:4, SV:5, W:10,
        abilities:'Dakka Dash (1AP): faz um Dash grátis + um tiro grátis com a Dakka Shoota.',
        weapons:[
          { name:'Dakka Shoota', A:5, skill:4, D:3, CD:4, range:'short', tags:['Ceaseless'] },
          { name:'Punhos',       A:3, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-kommando-comms', name:'Comms Boy', unique:true,
        M:'6"', APL:2, GA:1, DF:4, SV:5, W:10,
        abilities:'I Got A Plan Ladz: ações de objetivo custam -1 AP. Listen In (1AP): dá +1 APL a um aliado a 6".',
        weapons:[
          { name:'Shokka',  A:6, skill:4, D:1, CD:1, range:'short', tags:['Stun','Severe'] },
          { name:'Punhos',  A:3, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-kommando-burna', name:'Burna Boy', unique:true,
        M:'6"', APL:2, GA:1, DF:4, SV:5, W:10,
        abilities:'Torrent: a Burna sempre acerta — não rola dado de Hit.',
        weapons:[
          { name:'Burna',  A:4, skill:2, D:3, CD:3, range:'short', auto:true, tags:['Saturate'] },
          { name:'Punhos', A:3, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-kommando-rokkit', name:'Rokkit Boy', unique:true,
        M:'6"', APL:2, GA:1, DF:4, SV:5, W:10,
        abilities:'Rokkit Launcha causa dano de área — ótimo contra grupos.',
        weapons:[
          { name:'Rokkit Launcha', A:6, skill:4, D:4, CD:5, range:'long', tags:['Blast','Ceaseless'] },
          { name:'Punhos',         A:3, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-kommando-bombsquig', name:'Bomb Squig', unique:true,
        M:'6"', APL:2, GA:1, DF:4, SV:5, W:5,
        abilities:'Boom!: se for incapacitado sem detonar, em 4+ explode automaticamente antes de sair de campo. Expendable: não conta para condições de vitória do inimigo.',
        weapons:[
          { name:'Explosivos', A:6, skill:4, D:4, CD:5, range:'short', tags:['Blast','Limited 1'] },
          { name:'Mordida',    A:3, skill:4, D:4, CD:5, range:'melee' },
        ]},
    ]
  },

  // ── WOLF SCOUTS (Space Wolves) ───────────────────────
  {
    id:'kt-wolfscouts', name:'Wolf Scouts', faction:'Space Marines',
    color:'#7dd3fc', emoji:'🐺',
    desc:'Os caçadores mais temidos da Great Company dos Space Wolves. Operam sozinhos e sem apoio atrás das linhas inimigas, envoltos em tempestades e névoa. Vêm com um Lobo Fenrisiano de caça.',
    style:'Infiltração · Tempestade',
    limit: 6, // 1 Lobo Fenrisiano + 5 operativos
    coreRule:{name:"Tempestade Elemental",desc:"Como ação estratégica, reposiciona um marcador de Tempestade — operativos dentro dela ganham bônus (Carga oculta, dano extra, etc)."},
    ploys:{strategy:[{name:"Encoberto pela Tempestade",desc:"Ao ser alvo dentro da Tempestade, re-rola 1 dado de defesa."},{name:"Fúria Tempestuosa",desc:"Armas corpo a corpo ganham Balanced se estiver (ou esteve) na Tempestade neste turno."},{name:"Mordida da Tempestade",desc:"Contra inimigo dentro da Tempestade em CaC, reduz o Ataque dele em 1."},{name:"Lutadores Selvagens",desc:"Ao revidar sem ser incapacitado, causa D3+1 dano extra no atacante."}],firefight:[{name:"Sentidos Aguçados",desc:"Ao atirar, ganha alcance 6\" extra e o alvo não pode ficar obscurecido."},{name:"Contra-Ataque",desc:"Após o inimigo lutar ou terminar ativação, um Wolf Scout luta de graça."},{name:"Tocado por Lokyar",desc:"Ao lutar longe de aliados (5\"+), re-rola qualquer dado de ataque."},{name:"Fisiologia Transumana",desc:"Ao ser alvo de tiro, transforma 1 sucesso normal de defesa em crítico."}]},
    operatives: [
      { id:'kt-ws-packleader', name:'Pack Leader', unique:true,
        M:'7"', APL:2, GA:1, DF:3, SV:3, W:13,
        abilities:'LÍDER. Grizzled Veteran: a primeira vez que seria incapacitado na batalha, sobrevive com 1 PV. Lupine Guile: 1x/batalha re-rola o dado de iniciativa.',
        weapons:[
          { name:'Pistola de Plasma', A:4, skill:3, D:3, CD:5, range:'short' },
          { name:'Arma de Poder',     A:5, skill:3, D:4, CD:6, range:'melee', tags:['Lethal 5+'] },
        ]},
      { id:'kt-ws-fangbearer', name:'Fangbearer', unique:true,
        M:'7"', APL:2, GA:1, DF:3, SV:3, W:13,
        abilities:'Healing Balms (1AP): cura D3+3 PV de um aliado próximo. Spiritual Chirurgy: time ignora penalidades por ferimentos.',
        weapons:[
          { name:'Pistola Bolter Absolver', A:4, skill:3, D:4, CD:5, range:'short' },
          { name:'Lâmina de Combate',       A:5, skill:3, D:4, CD:5, range:'melee' },
        ]},
      { id:'kt-ws-frosteye', name:'Frosteye', unique:true,
        M:'7"', APL:2, GA:1, DF:3, SV:3, W:13,
        abilities:'Hunter\'s Senses (1AP): melhora a carabina até a próxima ativação. Storm-Veiled Execution: dentro da Tempestade, pode Guard mesmo oculto.',
        weapons:[
          { name:'Carabina Instigator', A:4, skill:3, D:3, CD:4, range:'long', tags:['Silent'] },
          { name:'Lâmina de Combate',   A:4, skill:3, D:4, CD:5, range:'melee' },
        ]},
      { id:'kt-ws-gunner', name:'Gunner', unique:true,
        M:'7"', APL:2, GA:1, DF:3, SV:3, W:13,
        abilities:'Tempest\'s Fury: dentro da Tempestade, a plasma gun ganha regra Punishing e nunca superaquece.',
        weapons:[
          { name:'Plasma Gun',        A:4, skill:3, D:4, CD:6, range:'short' },
          { name:'Lâmina de Combate', A:4, skill:3, D:4, CD:5, range:'melee' },
        ]},
      { id:'kt-ws-hunter', name:'Hunter', unique:false, count:2,
        M:'7"', APL:2, GA:2, DF:3, SV:3, W:13,
        abilities:'Fierce Temperament: dentro da Tempestade, suas armas ganham a regra Severe.',
        weapons:[
          { name:'Pistola de Plasma', A:4, skill:3, D:3, CD:5, range:'short' },
          { name:'Lâmina de Combate', A:5, skill:3, D:4, CD:5, range:'melee' },
        ]},
      { id:'kt-ws-skjald', name:'Rune Priest Skjald', unique:true,
        M:'7"', APL:2, GA:1, DF:3, SV:3, W:13,
        abilities:'PSYKER. Call the Storm (1AP): reposiciona a Tempestade ou obscurece um aliado. Cast the Runes: sorteia bônus de CP e re-rolls antes da batalha.',
        weapons:[
          { name:'Pistola Bolter',  A:4, skill:3, D:3, CD:4, range:'short' },
          { name:'Mandíbulas do Mundo Lobo', A:5, skill:3, D:3, CD:5, range:'long', tags:['Blast','Severe'] },
          { name:'Bastão Rúnico',   A:5, skill:3, D:4, CD:6, range:'melee', tags:['Shock'] },
        ]},
      { id:'kt-ws-trapmaster', name:'Trapmaster', unique:true,
        M:'7"', APL:2, GA:1, DF:3, SV:3, W:13,
        abilities:'Proximity Mine: carrega uma mina que causa 2D3+3 dano (ou D3+6 dentro da Tempestade) e reduz APL do inimigo que pisar nela.',
        weapons:[
          { name:'Pistola de Plasma', A:4, skill:3, D:3, CD:5, range:'short' },
          { name:'Lâmina de Combate', A:5, skill:3, D:4, CD:5, range:'melee' },
        ]},
      { id:'kt-ws-wolf', name:'Lobo Fenrisiano', unique:true,
        M:'8"', APL:2, GA:1, DF:3, SV:5, W:9,
        abilities:'Instinctive Predator: só pode Cargar, Dash, Recuar, Lutar ou Guard — nada mais. Pounce: 1x/batalha faz Carga/Recuo/Reposição grátis.',
        weapons:[
          { name:'Presas', A:5, skill:3, D:4, CD:5, range:'melee', tags:['Rending'] },
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
    coreRule:{name:"Ordens da Guarda",desc:"O Watchmaster pode dar uma Ordem a todos os Krieg a 6\" — bônus temporário até o fim do turno (ex: Fogo a Vontade, Firme!, Avançar)."},
    ploys:{strategy:[{name:"Disciplina Fatalista",desc:"Ignora testes de moral e mudanças de status por estar ferido."},{name:"Barragem de Morteiro",desc:"Uma vez por batalha, ataque de área remoto contra um marcador visível."}],firefight:[{name:"Firme Sob Fogo",desc:"Ao ser alvo, retém um sucesso normal de defesa extra se não se moveu neste turno."},{name:"Baioneta Calada",desc:"Após Cargar, arma corpo a corpo ganha Lethal 5+ até o fim da ativação."}]},
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
    coreRule:{name:"Bênção do Caos",desc:"No início de cada ativação, escolha 1 bônus: +1 Ataque, re-rolar Hits, ou +1 Dano — dependendo do Deus do Caos escolhido antes da batalha."},
    ploys:{strategy:[{name:"Marca do Caos",desc:"Escolha uma Marca (Khorne, Nurgle, Slaanesh ou Tzeentch) — cada uma dá um bônus passivo diferente ao time."},{name:"Fúria Implacável",desc:"Ignora as primeiras mudanças de status por ferimento na batalha."}],firefight:[{name:"Sede de Sangue",desc:"Contra inimigo ferido em CaC, re-rola 1 dado de ataque."},{name:"Escudo Sombrio",desc:"Retém 1 defesa extra como crítico uma vez por turno."}]},
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
    coreRule:{name:"Marcar Alvo",desc:"Ação de 1 AP: alvo a até 9\" fica Marcado — todos os T'au do time re-rolam 1 dado de Hit contra ele até o fim do turno."},
    ploys:{strategy:[{name:"Protocolo de Fogo",desc:"Escolha Montagem de Fuego (+1 Ataque), Retrocesso (melhora PA) ou Perseguição (+alcance) no início do turno."},{name:"Retirada Tática",desc:"Um operativo pode recuar sem gastar AP extra uma vez por turno."}],firefight:[{name:"Disciplina de Fogo",desc:"Contra alvo Marcado, retém 1 falha como sucesso normal."},{name:"Escudo de Drone",desc:"Um Drone próximo pode \"sacrificar-se\" para anular 1 dano recebido."}]},
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

  // ── ANGELS OF DEATH (Space Marines) ─────────────────
  {
    id:'kt-angelsofdeath', name:'Angels of Death', faction:'Space Marines',
    color:'#4a7fd4', emoji:'👼',
    desc:'Esquadrão genérico de Space Marines Primaris, adaptável a qualquer capítulo. Combina tiro preciso de bolter com poder de combate corpo a corpo — flexível e resistente.',
    style:'Versátil · Tiro/Melee',
    limit: 6, // 1 líder + 5 tropas
    coreRule:{name:"Astartes",desc:"Cada operativo pode fazer 2 ações de Tiro OU 2 de Luta na mesma ativação, nunca uma de cada."},
    ploys:{strategy:[{name:"Doutrina de Combate",desc:"Escolha Devastador, Tático ou Assalto — unidades ganham re-roll de 1 dado de ataque na situação escolhida neste turno."},{name:"Eles Não Temem",desc:"Ignora mudanças de status (inclusive de armas) por estar ferido."},{name:"Táticas Adaptativas",desc:"Troca a Chapter Tactic secundária até o fim do turno."},{name:"Indomitus",desc:"Se o inimigo errar 2+ dados ao te atirar, descarta uma falha e transforma outra em sucesso."}],firefight:[{name:"Ajustar Doutrina",desc:"Muda a Doutrina de Combate escolhida antes, durante a ativação de uma unidade."},{name:"Fisiologia Transumana",desc:"Ao ser alvo de tiro, transforma 1 sucesso normal de defesa em crítico."},{name:"Assalto de Choque",desc:"Após Carga, primeiro golpe em CaC ganha Shock e +1 dano (máx 7)."},{name:"Ira da Vingança",desc:"Ao contra-atacar, faz uma ação extra de 1 AP grátis (diferente da primeira)."}]},
    operatives: [
      // Leaders — escolha apenas 1
      { id:'kt-aod-captain', name:'Space Marine Captain', unique:true,
        M:'6"', APL:2, GA:1, DF:3, SV:3, W:15,
        abilities:'LÍDER. Heroic Leader: 1x/turno usa um Firefight Ploy grátis ou ativa Combat Doctrine de graça. Iron Halo: 1x/batalha ignora um dano normal sofrido.',
        weapons:[
          { name:'Pistola de Plasma', A:4, skill:3, D:3, CD:5, range:'short' },
          { name:'Punho de Força',    A:5, skill:3, D:5, CD:7, range:'melee', tags:['Brutal'] },
        ]},
      { id:'kt-aod-asgt', name:'Assault Intercessor Sergeant', unique:true,
        M:'6"', APL:2, GA:1, DF:3, SV:3, W:15,
        abilities:'LÍDER. Astartes: 2 ações de Tiro ou 2 de Luta por ativação. Escolha um item entre Lança-chamas de mão ou Pistola Bolter Pesada, mais uma arma corpo a corpo.',
        weapons:[
          { name:'Lança-chamas de Mão', A:4, skill:2, D:3, CD:3, range:'short', tags:['Torrent'] },
          { name:'Martelo do Trovão',   A:5, skill:4, D:5, CD:6, range:'melee', tags:['Shock'] },
        ]},
      { id:'kt-aod-isgt', name:'Intercessor Sergeant', unique:true,
        M:'6"', APL:2, GA:1, DF:3, SV:3, W:15,
        abilities:'LÍDER. Astartes: 2 ações de Tiro ou 2 de Luta por ativação. Combina bolt rifle preciso com armas corpo a corpo pesadas.',
        weapons:[
          { name:'Bolt Rifle', A:4, skill:3, D:3, CD:4, range:'long' },
          { name:'Punho de Força', A:4, skill:4, D:5, CD:7, range:'melee', tags:['Brutal'] },
        ]},
      // Troopers
      { id:'kt-aod-eliminator', name:'Eliminator Sniper', unique:true,
        M:'7"', APL:2, GA:1, DF:3, SV:3, W:12,
        abilities:'Camo Cloak + Stealthy: melhora saves em cobertura. Optics (1AP): inimigos não ficam obscurecidos até a próxima ativação.',
        weapons:[
          { name:'Bolt Sniper Rifle', A:4, skill:2, D:3, CD:4, range:'long', tags:['Silent','Heavy'] },
          { name:'Pistola Bolter',    A:4, skill:3, D:3, CD:4, range:'short' },
        ]},
      { id:'kt-aod-grenadier', name:'Assault Intercessor Grenadier', unique:true,
        M:'6"', APL:2, GA:1, DF:3, SV:3, W:14,
        abilities:'Grenadier: pode usar granadas frag/krak sem gastar usos limitados, com +1 no Hit.',
        weapons:[
          { name:'Pistola Bolter Pesada', A:4, skill:3, D:3, CD:4, range:'short' },
          { name:'Espada de Força',       A:5, skill:3, D:4, CD:5, range:'melee' },
        ]},
      { id:'kt-aod-heavygunner', name:'Heavy Intercessor Gunner', unique:true,
        M:'5"', APL:2, GA:1, DF:3, SV:3, W:18,
        abilities:'O operativo mais resistente do time — 18 PV. Bolter pesado focado causa dano extra em alvos únicos.',
        weapons:[
          { name:'Bolter Pesado (Focado)', A:5, skill:3, D:4, CD:5, range:'long' },
          { name:'Pistola Bolter',         A:4, skill:3, D:3, CD:4, range:'short' },
        ]},
      { id:'kt-aod-gunner', name:'Intercessor Gunner', unique:true,
        M:'6"', APL:2, GA:1, DF:3, SV:3, W:14,
        abilities:'Carrega lançador de granadas auxiliar — versátil contra grupos e alvos blindados.',
        weapons:[
          { name:'Bolt Rifle',              A:4, skill:3, D:3, CD:4, range:'long' },
          { name:'Lançador de Granadas (Krak)', A:4, skill:3, D:4, CD:5, range:'long' },
        ]},
      { id:'kt-aod-awarrior', name:'Assault Intercessor Warrior', unique:false, count:5,
        M:'6"', APL:2, GA:2, DF:3, SV:3, W:14,
        abilities:'Astartes: 2 ações de Tiro ou 2 de Luta por ativação. Combatente corpo a corpo equilibrado.',
        weapons:[
          { name:'Pistola Bolter Pesada', A:4, skill:3, D:3, CD:4, range:'short' },
          { name:'Espada Sierra',         A:5, skill:3, D:4, CD:5, range:'melee' },
        ]},
      { id:'kt-aod-iwarrior', name:'Intercessor Warrior', unique:false, count:5,
        M:'6"', APL:2, GA:2, DF:3, SV:3, W:14,
        abilities:'Astartes: 2 ações de Tiro ou 2 de Luta por ativação. O soldado padrão, confiável a médio e longo alcance.',
        weapons:[
          { name:'Bolt Rifle', A:4, skill:3, D:3, CD:4, range:'long' },
          { name:'Punhos',     A:4, skill:3, D:3, CD:4, range:'melee' },
        ]},
    ]
  },

  // ── NEMESIS CLAW (Night Lords - Chaos Space Marines) ─
  {
    id:'kt-nemesisclaw', name:'Nemesis Claw', faction:'Chaos Space Marines',
    color:'#8b5cf6', emoji:'🦇',
    desc:'Night Lords mestres do terror — usam medo e escuridão como armas antes mesmo do combate começar. Punem operativos feridos com brutalidade extra.',
    style:'Terror · Versátil',
    limit: 6, // 1 líder + 5 tropas
    coreRule:{name:"Vestidos de Meia-Noite",desc:"Fica obscurecido ao ser alvo se estiver a mais de 8\" do inimigo E perto de terreno pesado — furtividade natural dos Night Lords."},
    ploys:{strategy:[{name:"Visão da Presa",desc:"Ao atirar, arma ganha alcance 6\" extra e ignora a regra Seek Light."},{name:"Retorno às Trevas",desc:"Um operativo recua/reposiciona grátis, terminando perto de terreno pesado."},{name:"A Caçada Negra",desc:"Contra inimigo ferido, re-rola 1 dado de ataque em qualquer ação."},{name:"Viemos Buscar Você",desc:"Se a primeira ação da ativação for Carga, causa D3 dano extra ao terminar o movimento."}],firefight:[{name:"Lutador Sujo",desc:"Ao revidar, resolve 1 sucesso antes da ordem normal."},{name:"Morte ao Falso Imperador",desc:"Contra alvo Imperium, ganha Ceaseless (ou Relentless se for Astartes) na sequência."},{name:"Propensão ao Assassinato",desc:"Após incapacitar um inimigo, faz Carga ou Dash grátis."},{name:"Grito de Vox",desc:"Rola 1D6 contra o APL do próximo inimigo a ativar — se vencer, ele não pode ativar neste turno."}]},
    operatives: [
      { id:'kt-nc-visionary', name:'Visionary', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:15,
        abilities:'LÍDER · PSYKER. In Midnight Clad: fica obscurecido se longe e perto de terreno pesado. Premonition (1AP): gasta ponto de Presciência para ganhar 1CP.',
        weapons:[
          { name:'Pistola Bolter',        A:4, skill:3, D:3, CD:4, range:'short' },
          { name:'Lâmina Nostramana',     A:5, skill:3, D:4, CD:5, range:'melee' },
          { name:'Punho de Força',        A:5, skill:4, D:5, CD:7, range:'melee', tags:['Brutal'] },
        ]},
      { id:'kt-nc-fearmonger', name:'Fearmonger', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:14,
        abilities:'Terrorchem: críticos envenenam o alvo — ele sofre 1D3 dano extra ao ser ativado. Poison Objective (1AP): envenena objetivo controlado.',
        weapons:[
          { name:'Pistola Bolter Mirada', A:4, skill:3, D:3, CD:4, range:'short', tags:['Lethal 5+'] },
          { name:'Lâmina Envenenada',     A:5, skill:3, D:3, CD:5, range:'melee' },
        ]},
      { id:'kt-nc-gunner', name:'Gunner', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:14,
        abilities:'Astartes: 2 ações de Tiro ou 2 de Luta por ativação. Especialista em armas de assalto pesadas.',
        weapons:[
          { name:'Meltagun',       A:4, skill:3, D:6, CD:3, range:'short', tags:['Melta'] },
          { name:'Pistola Bolter', A:4, skill:3, D:3, CD:4, range:'short' },
        ]},
      { id:'kt-nc-heavygunner', name:'Heavy Gunner', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:14,
        abilities:'Bolter pesado focado é devastador contra alvos únicos a longa distância.',
        weapons:[
          { name:'Bolter Pesado (Focado)', A:5, skill:3, D:4, CD:5, range:'long' },
          { name:'Pistola Bolter',         A:4, skill:3, D:3, CD:4, range:'short' },
        ]},
      { id:'kt-nc-screecher', name:'Screecher', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:14,
        abilities:'Appetite For Cruelty: contra inimigos feridos, garras relâmpago ficam ainda mais letais. Screecher: inimigos próximos não podem re-rolar dados de ataque.',
        weapons:[
          { name:'Garras Relâmpago', A:5, skill:3, D:4, CD:5, range:'melee', tags:['Ceaseless','Lethal 5+'] },
        ]},
      { id:'kt-nc-skinthief', name:'Skinthief', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:14,
        abilities:'Tyrant Of The Skinning Pits: reduz em 1 dano de ataques de 3+ contra ele em combate. Flay Them Alive: incapacita e impede objetivo inimigo próximo.',
        weapons:[
          { name:'Foice Nostramana', A:5, skill:3, D:4, CD:6, range:'melee' },
          { name:'Pistola Bolter',   A:4, skill:3, D:3, CD:4, range:'short' },
        ]},
      { id:'kt-nc-ventrilokar', name:'Ventrilokar', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:14,
        abilities:'PSYKER. Disconcerting Mimicry (1AP): reduz APL de inimigo, muda sua ordem, ou força um dash. Icon Bearer: conta como +1 APL para controlar marcadores.',
        weapons:[
          { name:'Espada Sierra',  A:5, skill:3, D:4, CD:5, range:'melee' },
          { name:'Pistola Bolter', A:4, skill:3, D:3, CD:4, range:'short' },
        ]},
      { id:'kt-nc-warrior', name:'Warrior', unique:false, count:5,
        M:'6"', APL:3, GA:2, DF:3, SV:3, W:14,
        abilities:'Cruel Tormentor: contra inimigos feridos ou frágeis (7 PV ou menos), armas ganham Lethal 5+.',
        weapons:[
          { name:'Boltgun',   A:4, skill:3, D:3, CD:4, range:'long' },
          { name:'Espada Sierra', A:5, skill:3, D:4, CD:5, range:'melee' },
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
