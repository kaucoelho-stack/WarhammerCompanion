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
    limit: 10,
    coreRule: {name:"Throat Slittas", desc:"Todo Kommando (exceto Bomb Squig) pode Cargar mesmo com ordem de Ocultar."},
    ploys: {
      strategy: [
        {name:"DAKKA! DAKKA! DAKKA!", desc:"Armas de tiro ganham Punishing — retém uma falha como sucesso normal se já reteve algum crítico."},
        {name:"Skulk About", desc:"Operativo com ordem Ocultar retém 1 sucesso de defesa sem rolar dado."},
        {name:"SSSSHHHH!", desc:"Operativos ocultos e fora de alcance de visão podem fazer um Dash grátis (não no 1º turno)."},
        {name:"WAAAGH!", desc:"Armas corpo a corpo ganham Balanced — pode re-rolar 1 dado de ataque."},
      ],
      firefight: [
        {name:"Só um Arranhão", desc:"Ignora um dano normal recebido (exceto Bomb Squig e Grot)."},
        {name:"Kunnin' Mas Brutal", desc:"Ao Cargar oculto, o primeiro golpe normal em CaC vira crítico."},
        {name:"Krump 'Em", desc:"No fim da Firefight Phase, um Kommando faz uma ação de Luta grátis."},
        {name:"Aguenta Firme", desc:"Ignora mudanças no APL até o início do próximo turno."},
      ],
    },
    operatives: [
      { id:'kt-kommando-boss', name:'Boss Nob', unique:true,
        M:'6"', APL:3, GA:1, DF:4, SV:5, W:14,
        abilities:[
          {name:'LÍDER', desc:'Este operativo é o líder do time.'},
          {name:"Krumpin' Time", desc:'Pode fazer 2 ações de Luta na mesma ativação.'},
          {name:'Get It Dun!', ap:'1AP', desc:'Apoio: escolha outro Kommando aliado visível a até 6" (exceto Bomb Squig). Até o fim da próxima ativação dele, +1 no APL. Não pode ser feito perto de inimigo ou contra-atacando.'},
        ],
        weapons:[
          { name:'Slugga',       A:4, skill:4, D:3, CD:4, range:'short' },
          { name:'Big Choppa',   A:5, skill:3, D:5, CD:6, range:'melee' },
          { name:'Klaw de Força',A:4, skill:3, D:5, CD:7, range:'melee', tags:['Brutal','Shock'] },
        ]},
      { id:'kt-kommando-boy', name:'Kommando Boy', unique:false, count:9,
        M:'6"', APL:2, GA:2, DF:4, SV:5, W:10,
        abilities:[
          {name:'Taktical Wot-notz', desc:'1x por turno: um Kommando Boy pode fazer a ação Granada de Fumaça. 1x por turno: um Kommando Boy pode fazer a ação Granada Atordoante. Nenhuma das duas conta para o limite de uso desses itens de equipamento.'},
        ],
        weapons:[
          { name:'Slugga', A:4, skill:4, D:3, CD:4, range:'short' },
          { name:'Choppa', A:4, skill:3, D:4, CD:5, range:'melee' },
        ]},
      { id:'kt-kommando-bombsquig', name:'Bomb Squig', unique:true,
        M:'6"', APL:2, GA:1, DF:4, SV:5, W:5,
        abilities:[
          {name:'Explosive', desc:'Pode fazer a ação Atirar mesmo dentro do alcance de controle de um inimigo. Nesse caso não escolhe alvo — este operativo é sempre o alvo principal e nunca conta como em cobertura.'},
          {name:'Boom!', desc:'Se for incapacitado numa batalha em que não usou os explosivos, role 1D6 (ou 2D6 se quiser): em 4+, faz um Tiro grátis com os explosivos antes de sair de campo.'},
          {name:'Stoopid', desc:'Não pode escolher ordem Conceal. Só pode fazer as ações Charge, Dash, Fight, Reposition e Shoot, e só com as armas da própria ficha.'},
          {name:'Expendable', desc:'Ignorado para as condições de vitória do oponente e para a contagem inicial de operativos, inclusive se for incapacitado.'},
        ],
        weapons:[
          { name:'Explosivos', A:6, skill:4, D:4, CD:5, range:'short', tags:['Blast 1"','Limited 1'] },
          { name:'Mordida',    A:3, skill:4, D:4, CD:5, range:'melee' },
        ]},
      { id:'kt-kommando-breacha', name:'Breacha Boy', unique:true,
        M:'6"', APL:2, GA:1, DF:4, SV:5, W:10,
        abilities:[
          {name:'Breach', ap:'1AP', desc:'Coloca um marcador de Arrombamento o mais perto possível de um terreno dentro do alcance de controle. Terreno de até 1" de espessura dentro de 1" do marcador vira terreno Acessível. Pode fazer essa ação durante Charge ou Reposition por 1 AP a menos. Não pode ser feito perto de inimigo ou sem terreno no alcance de controle.'},
        ],
        weapons:[
          { name:'Slugga',        A:4, skill:4, D:3, CD:4, range:'short' },
          { name:'Aríete Breacha',A:4, skill:4, D:5, CD:5, range:'melee', tags:['Brutal','Severe','Shock'] },
        ]},
      { id:'kt-kommando-burna', name:'Burna Boy', unique:true,
        M:'6"', APL:2, GA:1, DF:4, SV:5, W:10,
        abilities:[
          {name:'Duas Configurações', desc:'A Burna tem modo Padrão (alcance maior, mais alvos secundários) ou Dilúvio (alcance curto, ignora cobertura via Seek, sem alvos secundários mas mantém a regra Torrent para outros efeitos).'},
        ],
        weapons:[
          { name:'Burna (Padrão)', A:4, skill:2, D:3, CD:3, range:'short', tags:['Saturate','Torrent 2"'] },
          { name:'Burna (Dilúvio)',A:4, skill:2, D:3, CD:3, range:'short', tags:['Saturate','Seek','Torrent 0"'] },
          { name:'Punhos',         A:3, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-kommando-comms', name:'Comms Boy', unique:true,
        M:'6"', APL:2, GA:1, DF:4, SV:5, W:10,
        abilities:[
          {name:'I Got a Plan, Ladz', desc:'1x em cada ativação deste operativo, as ações Pegar Marcador, Colocar Marcador ou uma ação de missão custam 1 AP a menos.'},
          {name:'Listen In', ap:'1AP', desc:'Apoio: escolha outro Kommando aliado visível a até 6". Até o fim da próxima ativação dele, +1 no APL. Não pode ser feito perto de inimigo.'},
        ],
        weapons:[
          { name:'Pistola Shokka', A:6, skill:4, D:1, CD:0, range:'short', tags:['Devastating 2','Severe','Stun'] },
          { name:'Punhos',         A:3, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-kommando-dakka', name:'Dakka Boy', unique:true,
        M:'6"', APL:2, GA:1, DF:4, SV:5, W:10,
        abilities:[
          {name:'Dakka Dash', ap:'1AP', desc:'Faz uma ação Dash grátis e uma ação Atirar grátis nesta ordem, mas o Tiro só pode ser com a Dakka Shoota. Não pode ser feito com ordem Conceal nem perto de inimigo.'},
        ],
        weapons:[
          { name:'Dakka Shoota (Curto)', A:5, skill:4, D:3, CD:4, range:'short', tags:['Range 9"','Ceaseless'] },
          { name:'Dakka Shoota (Longo)', A:5, skill:4, D:3, CD:4, range:'long' },
          { name:'Punhos',               A:3, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-kommando-grot', name:'Grot', unique:true,
        M:'6"', APL:2, GA:1, DF:4, SV:5, W:5,
        abilities:[
          {name:'Sneaky Zogger', desc:'Não pode ter ordem Engage. Enquanto em cobertura, nunca é um alvo válido — isso vale mesmo contra Seek ou terreno Vantage — exceto se o atacante estiver a até 2".'},
          {name:'Grappling Hook', ap:'1AP', desc:'Escolhe um ponto visível de terreno, remove este operativo do campo e recoloca a até 1" horizontal daquele ponto, fora do alcance de controle inimigo. Conta como ação Reposition. Não pode ser feito perto de inimigo, nem na mesma ativação de Charge/Fall Back.'},
        ],
        weapons:[
          { name:'Machadinha Grot', A:3, skill:5, D:1, CD:4, range:'melee' },
        ]},
      { id:'kt-kommando-rokkit', name:'Rokkit Boy', unique:true,
        M:'6"', APL:2, GA:1, DF:4, SV:5, W:10,
        abilities:'Duas configurações: mirada (fixo, mais confiável) ou móvel (pode se mover antes).',
        weapons:[
          { name:'Rokkit Launcha (Mirada)', A:6, skill:4, D:4, CD:5, range:'long', tags:['Blast 1"','Ceaseless','Heavy (Dash only)'] },
          { name:'Rokkit Launcha (Móvel)',  A:6, skill:4, D:4, CD:5, range:'long', tags:['Blast 1"'] },
          { name:'Punhos',                  A:3, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-kommando-slasha', name:'Slasha Boy', unique:true,
        M:'6"', APL:2, GA:1, DF:4, SV:5, W:10,
        abilities:[
          {name:'Dat All You Got?', desc:'Depois deste operativo lutar ou revidar, se não foi incapacitado, pode causar D3 de dano extra no inimigo daquela sequência.'},
        ],
        weapons:[
          { name:'Facas de Arremesso', A:4, skill:3, D:2, CD:5, range:'short', tags:['Silent'] },
          { name:'Choppas Gêmeas',     A:4, skill:3, D:4, CD:5, range:'melee', tags:['Ceaseless','Lethal 5+'] },
        ]},
      { id:'kt-kommando-snipa', name:'Kommando Snipa', unique:true,
        M:'6"', APL:2, GA:1, DF:4, SV:5, W:10,
        abilities:[
          {name:'Três Configurações', desc:'A Big Shoota com Mira tem modo Oculta (só pode ser usado na primeira vez que este operativo Atirar na batalha), Estacionária, ou Varredura.'},
        ],
        weapons:[
          { name:'Big Shoota c/ Mira (Oculta)',      A:5, skill:3, D:3, CD:3, range:'long', tags:['Devastating 2','Heavy','Silent'] },
          { name:'Big Shoota c/ Mira (Estacionária)',A:5, skill:3, D:3, CD:3, range:'long', tags:['Devastating 2','Heavy'] },
          { name:'Big Shoota c/ Mira (Varredura)',   A:5, skill:3, D:3, CD:4, range:'long', tags:['Heavy (Dash only)','Torrent 1"'] },
          { name:'Punhos',                           A:3, skill:3, D:3, CD:4, range:'melee' },
        ]},
    ]
  },
  // ── WOLF SCOUTS (Space Wolves) ───────────────────────
  {
    id:'kt-wolfscouts', name:'Wolf Scouts', faction:'Space Marines',
    color:'#7dd3fc', emoji:'🐺',
    desc:'Os caçadores mais temidos da Great Company dos Space Wolves. Operam sozinhos e sem apoio atrás das linhas inimigas, envoltos em tempestades e névoa. Vêm com um Lobo Fenrisiano de caça.',
    style:'Infiltração · Tempestade',
    limit: 6,
    coreRule: {name:"Tempestade Elemental", desc:"Como Strategic Gambit, reposiciona o marcador de Tempestade — operativos dentro dela ganham bônus conforme cada um (ver habilidades)."},
    ploys: {
      strategy: [
        {name:"Encoberto pela Tempestade", desc:"Ao ser alvo dentro da Tempestade, re-rola 1 dado de defesa."},
        {name:"Fúria Tempestuosa", desc:"Armas corpo a corpo ganham Balanced se esteve na Tempestade neste turno."},
        {name:"Mordida da Tempestade", desc:"Contra inimigo dentro da Tempestade em CaC, reduz o Ataque dele em 1."},
        {name:"Lutadores Selvagens", desc:"Ao revidar sem ser incapacitado, causa D3+1 dano extra no atacante."},
      ],
      firefight: [
        {name:"Sentidos Aguçados", desc:"Ao atirar, ganha alcance 6\" extra e o alvo não pode ficar obscurecido."},
        {name:"Contra-Ataque", desc:"Após o inimigo lutar ou terminar ativação, um Wolf Scout luta de graça."},
        {name:"Tocado por Lokyar", desc:"Ao lutar longe de aliados (5\"+), re-rola qualquer dado de ataque."},
        {name:"Fisiologia Transumana", desc:"Ao ser alvo de tiro, transforma 1 sucesso normal de defesa em crítico."},
      ],
    },
    operatives: [
      { id:'kt-ws-packleader', name:'Pack Leader', unique:true,
        M:'7"', APL:3, GA:1, DF:3, SV:3, W:13,
        abilities:[
          {name:'LÍDER', desc:'Este operativo é o líder do time.'},
          {name:'Lupine Guile', desc:'1x por batalha, depois de rolar pra decidir iniciativa, se este operativo estiver em campo, pode re-rolar seu dado.'},
          {name:'Grizzled Veteran', desc:'A primeira vez que seria incapacitado na batalha, não é: fica com 1 PV e não pode ser incapacitado pelo resto daquela ação. Todos os dados de ataque restantes são descartados (inclusive os seus, se estava lutando/revidando). Não pode usar o Ploy Counterattack nem causar dano de Savage Fighters no fim daquela ação.'},
        ],
        weapons:[
          { name:'Pistola de Plasma', range:'short', profiles:[
            { name:'Padrão',     A:4, skill:3, D:3, CD:5, tags:['Piercing 1'] },
            { name:'Sobrecarga', A:4, skill:3, D:4, CD:5, tags:['Piercing 1','Hot','Lethal 5+'] },
          ]},
          { name:'Arma de Poder', A:5, skill:3, D:4, CD:6, range:'melee', tags:['Lethal 5+'] },
        ]},
      { id:'kt-ws-fangbearer', name:'Fangbearer', unique:true,
        M:'7"', APL:3, GA:1, DF:3, SV:3, W:13,
        abilities:[
          {name:'Spiritual Chirurgy', desc:'Ignora mudanças de status por ferimento em operativos Wolf Scout (exceto o Lobo Fenrisiano) — vale pro time todo desde que este operativo tenha sido selecionado pra batalha, mesmo se for incapacitado depois.'},
          {name:'Healing Balms', ap:'1AP', desc:'Escolhe um Wolf Scout aliado no alcance de controle pra recuperar até D3+3 PV perdidos. Não pode ser feito perto de inimigo.'},
        ],
        weapons:[
          { name:'Pistola Bolter Absolver', A:4, skill:3, D:4, CD:5, range:'short', tags:['Range 9"','Piercing Crits 1'] },
          { name:'Lâmina de Combate',       A:5, skill:3, D:4, CD:5, range:'melee' },
        ]},
      { id:'kt-ws-frosteye', name:'Frosteye', unique:true,
        M:'7"', APL:3, GA:1, DF:3, SV:3, W:13,
        abilities:[
          {name:'Storm-Veiled Execution', desc:'Dentro da Tempestade: pode usar Guard independente do tipo de zona de jogo, e pode usar Guard mesmo com ordem Conceal.'},
          {name:"Hunter's Senses", ap:'1AP', desc:'Escolhe Severe OU Saturate (e nesse caso inimigos não ficam obscurecidos ao ser alvo) pra Carabina Instigator, até a próxima ativação. Não pode ser feito perto de inimigo.'},
        ],
        weapons:[
          { name:'Carabina Instigator', A:4, skill:3, D:3, CD:4, range:'long', tags:['Piercing Crits 1','Silent'] },
          { name:'Lâmina de Combate',   A:4, skill:3, D:4, CD:5, range:'melee' },
        ]},
      { id:'kt-ws-gunner', name:'Gunner', unique:true,
        M:'7"', APL:3, GA:1, DF:3, SV:3, W:13,
        abilities:[
          {name:"Tempest's Fury", desc:'Dentro da Tempestade: todos os modos da Plasma Gun ganham Punishing. O modo Sobrecarga perde a regra Hot (sem risco de dano próprio).'},
        ],
        weapons:[
          { name:'Plasma Gun', range:'short', profiles:[
            { name:'Padrão',     A:4, skill:3, D:4, CD:6, tags:['Piercing 1'] },
            { name:'Sobrecarga', A:4, skill:3, D:5, CD:6, tags:['Piercing 1','Hot','Lethal 5+'] },
          ]},
          { name:'Lâmina de Combate', A:4, skill:3, D:4, CD:5, range:'melee' },
        ]},
      { id:'kt-ws-hunter', name:'Hunter', unique:false, count:2,
        M:'7"', APL:3, GA:2, DF:3, SV:3, W:13,
        abilities:[
          {name:'Fierce Temperament', desc:'Dentro da Tempestade, todas as armas deste operativo ganham a regra Severe.'},
        ],
        weapons:[
          { name:'Pistola de Plasma', range:'short', profiles:[
            { name:'Padrão',     A:4, skill:3, D:3, CD:5, tags:['Piercing 1'] },
            { name:'Sobrecarga', A:4, skill:3, D:4, CD:5, tags:['Piercing 1','Hot','Lethal 5+'] },
          ]},
          { name:'Lâmina de Combate', A:5, skill:3, D:4, CD:5, range:'melee' },
        ]},
      { id:'kt-ws-skjald', name:'Rune Priest Skjald', unique:true,
        M:'7"', APL:3, GA:1, DF:3, SV:3, W:13,
        abilities:[
          {name:'PSYKER', desc:'Este operativo tem palavra-chave Psyker.'},
          {name:'Cast the Runes', desc:'Depois de escolher este operativo, antes da batalha, role 3D6 e separe-os. Cada resultado 1-4 dá um uso grátis do Ploy Command Re-roll no turno correspondente. Cada resultado 5-6 dá +1CP.'},
          {name:'Call the Storm', ap:'1AP', desc:'Psychic. Remove o marcador de Tempestade do campo (se houver) e recoloca em outro lugar. Alternativamente, escolhe um Wolf Scout aliado — até a próxima ativação dele, sempre que estiver na Tempestade e a mais de 3" do operativo ativo, fica obscurecido. Não pode ser feito perto de inimigo.'},
        ],
        weapons:[
          { name:'Pistola Bolter',  A:4, skill:3, D:3, CD:4, range:'short' },
          { name:'Mandíbulas do Mundo Lobo', A:5, skill:3, D:3, CD:5, range:'long', tags:['Blast 2"','Severe'] },
          { name:'Thunderclap',     A:5, skill:2, D:2, CD:2, range:'short', tags:['Range 6"','Saturate','Seek Light','Stun','Torrent 2"'] },
          { name:'Bastão Rúnico',   A:5, skill:3, D:4, CD:6, range:'melee', tags:['Shock'] },
        ]},
      { id:'kt-ws-trapmaster', name:'Trapmaster', unique:true,
        M:'7"', APL:3, GA:1, DF:3, SV:3, W:13,
        abilities:[
          {name:'Haywire Mine', desc:'Carrega o marcador de Mina Haywire e pode fazer a ação Pegar Marcador nele — mas o marcador não pode ser colocado no alcance de controle de outro operativo. Se este operativo for incapacitado carregando a mina e ela não puder ser colocada, ela é removida junto.'},
          {name:'Proximity Mine', desc:'A primeira vez que a Mina Haywire entrar no alcance de controle de outro operativo, remove o marcador, reduz o APL dele em 1 até o fim da próxima ativação, e causa 2D3+3 de dano (ou D3+6 se a mina estiver a até 6" horizontal da Tempestade). Se não for incapacitado, a ação dele termina ali mesmo.'},
        ],
        weapons:[
          { name:'Pistola de Plasma', range:'short', profiles:[
            { name:'Padrão',     A:4, skill:3, D:3, CD:5, tags:['Piercing 1'] },
            { name:'Sobrecarga', A:4, skill:3, D:4, CD:5, tags:['Piercing 1','Hot','Lethal 5+'] },
          ]},
          { name:'Lâmina de Combate', A:5, skill:3, D:4, CD:5, range:'melee' },
        ]},
      { id:'kt-ws-wolf', name:'Lobo Fenrisiano', unique:true,
        M:'8"', APL:2, GA:1, DF:3, SV:5, W:9,
        abilities:[
          {name:'Instinctive Predator', desc:'Só pode fazer as ações Charge, Dash, Fall Back, Fight, Guard e Reposition, e só com as armas da própria ficha. Pode Cargar mesmo com ordem Conceal.'},
          {name:'Pounce', desc:'Strategic Gambit, 1x por batalha. Se o APL deste operativo for 2 ou mais, faz uma ação grátis de Charge, Fall Back ou Reposition. Se fizer isso, -1 no APL até o fim da próxima ativação e não pode repetir nenhuma dessas ações nesse período.'},
        ],
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
    limit: 6,
    coreRule: {name:"Astartes", desc:"Cada operativo pode fazer 2 ações de Tiro ou 2 de Luta na mesma ativação. Se forem 2 de Tiro, uma arma bolter deve ser usada em pelo menos uma; se for bolt sniper rifle ou heavy bolter, a segunda ação custa +1 AP. Pode contra-atacar independente da ordem."},
    ploys: {
      strategy: [
        {name:"Doutrina de Combate", desc:"Escolha Devastador, Tático ou Assalto — unidades ganham re-roll de 1 dado de ataque na situação escolhida neste turno."},
        {name:"Eles Não Temem", desc:"Ignora mudanças de status (inclusive de armas) por estar ferido."},
        {name:"Táticas Adaptativas", desc:"Troca a Chapter Tactic secundária até o fim do turno."},
        {name:"Indomitus", desc:"Se o inimigo errar 2+ dados ao te atirar, descarta uma falha e transforma outra em sucesso."},
      ],
      firefight: [
        {name:"Ajustar Doutrina", desc:"Muda a Doutrina de Combate escolhida antes, durante a ativação de uma unidade."},
        {name:"Fisiologia Transumana", desc:"Ao ser alvo de tiro, transforma 1 sucesso normal de defesa em crítico."},
        {name:"Assalto de Choque", desc:"Após Carga, primeiro golpe em CaC ganha Shock e +1 dano (máx 7)."},
        {name:"Ira da Vingança", desc:"Ao contra-atacar, faz uma ação extra de 1 AP grátis (diferente da primeira)."},
      ],
    },
    operatives: [
      { id:'kt-aod-captain', name:'Space Marine Captain', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:15,
        abilities:[
          {name:'LÍDER', desc:'Este operativo é o líder do time.'},
          {name:'Heroic Leader', desc:'1x por turno, pode fazer um dos três: usar um Firefight Ploy de graça (exceto Command Re-roll) se for o operativo específico; usar o Ploy Doutrina de Combate de graça se estiver em campo e longe de inimigos (não pode repetir se já usou esse ploy no turno); usar o Ploy Ajustar Doutrina de graça na mesma condição.'},
          {name:'Iron Halo', desc:'1x por batalha, quando um dado de ataque causar dano Normal neste operativo, pode ignorar aquele dano.'},
        ],
        weapons:[
          { name:'Pistola de Plasma', range:'short', profiles:[
            { name:'Padrão',     A:4, skill:3, D:3, CD:5, tags:['Piercing 1'] },
            { name:'Sobrecarga', A:4, skill:3, D:4, CD:5, tags:['Piercing 1','Hot','Lethal 5+'] },
          ]},
          { name:'Punho de Força', A:5, skill:3, D:5, CD:7, range:'melee', tags:['Brutal'] },
        ]},
      { id:'kt-aod-asgt', name:'Assault Intercessor Sergeant', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:15,
        abilities:[
          {name:'LÍDER', desc:'Este operativo é o líder do time.'},
          {name:'Doctrine Warfare', desc:'1x por batalha cada: ao usar o Ploy Doutrina de Combate e escolher Assalto, custa 0CP se este operativo estiver em campo; o mesmo vale pra escolher Tático.'},
          {name:'Chapter Veteran', desc:'No fim da etapa de seleção de operativos, se este for escolhido pra batalha, ganha uma Chapter Tactic adicional (não precisa ser a mesma em toda campanha/torneio).'},
        ],
        weapons:[
          { name:'Lança-chamas de Mão', A:4, skill:2, D:3, CD:3, range:'short', tags:['Range 6"','Saturate','Torrent 1"'] },
          { name:'Pistola Bolter Pesada', A:4, skill:3, D:3, CD:4, range:'short', tags:['Piercing Crits 1'] },
          { name:'Pistola de Plasma', range:'short', profiles:[
            { name:'Padrão',     A:4, skill:3, D:3, CD:5, tags:['Piercing 1'] },
            { name:'Sobrecarga', A:4, skill:3, D:4, CD:5, tags:['Piercing 1','Hot','Lethal 5+'] },
          ]},
          { name:'Espada Sierra',     A:5, skill:3, D:4, CD:5, range:'melee' },
          { name:'Punho de Força',    A:5, skill:4, D:5, CD:7, range:'melee', tags:['Brutal'] },
          { name:'Arma de Poder',     A:5, skill:3, D:4, CD:6, range:'melee', tags:['Lethal 5+'] },
          { name:'Martelo do Trovão', A:5, skill:4, D:5, CD:6, range:'melee', tags:['Shock','Stun'] },
        ]},
      { id:'kt-aod-isgt', name:'Intercessor Sergeant', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:15,
        abilities:[
          {name:'LÍDER', desc:'Este operativo é o líder do time.'},
          {name:'Doctrine Warfare', desc:'1x por batalha cada: ao usar o Ploy Doutrina de Combate e escolher Devastador, custa 0CP se este operativo estiver em campo; o mesmo vale pra escolher Tático.'},
          {name:'Chapter Veteran', desc:'No fim da etapa de seleção de operativos, se este for escolhido pra batalha, ganha uma Chapter Tactic adicional.'},
        ],
        weapons:[
          { name:'Bolter Automático', A:4, skill:3, D:3, CD:4, range:'long', tags:['Torrent 1"'] },
          { name:'Bolt Rifle',        A:4, skill:3, D:3, CD:4, range:'long', tags:['Piercing Crits 1'] },
          { name:'Rifle Bolter Stalker', range:'long', profiles:[
            { name:'Pesado', A:4, skill:3, D:3, CD:5, tags:['Heavy (Dash only)','Lethal 5+','Piercing Crits 1'] },
            { name:'Móvel',  A:4, skill:3, D:3, CD:4, tags:[] },
          ]},
          { name:'Espada Sierra',     A:4, skill:3, D:4, CD:5, range:'melee' },
          { name:'Punhos',            A:4, skill:3, D:3, CD:4, range:'melee' },
          { name:'Punho de Força',    A:4, skill:4, D:5, CD:7, range:'melee', tags:['Brutal'] },
          { name:'Arma de Poder',     A:4, skill:3, D:4, CD:6, range:'melee', tags:['Lethal 5+'] },
          { name:'Martelo do Trovão', A:4, skill:4, D:5, CD:6, range:'melee', tags:['Shock','Stun'] },
        ]},
      { id:'kt-aod-grenadier', name:'Assault Intercessor Grenadier', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:14,
        abilities:[
          {name:'Grenadier', desc:'Pode usar granadas frag e krak (equipamento universal) sem contar pro limite de usos (mesmo se outro operativo também as escolheu). Ao usar, o Hit dessa arma melhora em 1.'},
        ],
        weapons:[
          { name:'Pistola Bolter Pesada', A:4, skill:3, D:3, CD:4, range:'short', tags:['Piercing Crits 1'] },
          { name:'Espada Sierra',         A:5, skill:3, D:4, CD:5, range:'melee' },
        ]},
      { id:'kt-aod-awarrior', name:'Assault Intercessor Warrior', unique:false, count:5,
        M:'6"', APL:3, GA:2, DF:3, SV:3, W:14,
        abilities:[
          {name:'Astartes', desc:'Em cada ativação, pode fazer 2 ações de Tiro ou 2 de Luta (não uma de cada).'},
        ],
        weapons:[
          { name:'Pistola Bolter Pesada', A:4, skill:3, D:3, CD:4, range:'short', tags:['Piercing Crits 1'] },
          { name:'Espada Sierra',         A:5, skill:3, D:4, CD:5, range:'melee' },
        ]},
      { id:'kt-aod-heavygunner', name:'Heavy Intercessor Gunner', unique:true,
        M:'5"', APL:3, GA:1, DF:3, SV:3, W:18,
        abilities:[
          {name:'Resistência Pesada', desc:'Com 18 PV, é o operativo mais resistente do time.'},
        ],
        weapons:[
          { name:'Pistola Bolter',    A:4, skill:3, D:3, CD:4, range:'short' },
          { name:'Bolter Pesado',     range:'long', profiles:[
            { name:'Focado',    A:5, skill:3, D:4, CD:5, tags:['Piercing Crits 1'] },
            { name:'Varredura', A:4, skill:3, D:4, CD:5, tags:['Piercing Crits 1','Torrent 1"'] },
          ]},
          { name:'Punhos', A:4, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-aod-gunner', name:'Intercessor Gunner', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:14,
        abilities:[
          {name:'Lançador de Granadas Auxiliar', desc:'Carrega granadas frag (área) e krak (perfurante) — versátil contra grupos e alvos blindados.'},
        ],
        weapons:[
          { name:'Bolter Automático', A:4, skill:3, D:3, CD:4, range:'long', tags:['Torrent 1"'] },
          { name:'Lançador de Granadas Auxiliar', range:'long', profiles:[
            { name:'Frag', A:4, skill:3, D:2, CD:4, tags:['Blast 2"'] },
            { name:'Krak', A:4, skill:3, D:4, CD:5, tags:['Piercing 1'] },
          ]},
          { name:'Bolt Rifle', A:4, skill:3, D:3, CD:4, range:'long', tags:['Piercing Crits 1'] },
          { name:'Rifle Bolter Stalker', range:'long', profiles:[
            { name:'Pesado', A:4, skill:3, D:3, CD:5, tags:['Heavy (Dash only)','Lethal 5+','Piercing Crits 1'] },
            { name:'Móvel',  A:4, skill:3, D:3, CD:4, tags:[] },
          ]},
          { name:'Punhos', A:4, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-aod-iwarrior', name:'Intercessor Warrior', unique:false, count:5,
        M:'6"', APL:3, GA:2, DF:3, SV:3, W:14,
        abilities:[
          {name:'Astartes', desc:'Em cada ativação, pode fazer 2 ações de Tiro ou 2 de Luta (não uma de cada).'},
        ],
        weapons:[
          { name:'Bolter Automático', A:4, skill:3, D:3, CD:4, range:'long', tags:['Torrent 1"'] },
          { name:'Bolt Rifle',        A:4, skill:3, D:3, CD:4, range:'long', tags:['Piercing Crits 1'] },
          { name:'Rifle Bolter Stalker', range:'long', profiles:[
            { name:'Pesado', A:4, skill:3, D:3, CD:5, tags:['Heavy (Dash only)','Lethal 5+','Piercing Crits 1'] },
            { name:'Móvel',  A:4, skill:3, D:3, CD:4, tags:[] },
          ]},
          { name:'Punhos', A:4, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-aod-eliminator', name:'Eliminator Sniper', unique:true,
        M:'7"', APL:3, GA:1, DF:3, SV:3, W:12,
        abilities:[
          {name:'Camo Cloak', desc:'Ao ser alvo de tiro, ignora a regra Saturate. Este operativo tem a Chapter Tactic Stealthy; se você a escolheu, pode usar as duas opções dela ao mesmo tempo (retém 2 saves de cobertura — 1 normal e 1 crítico).'},
          {name:'Optics', ap:'1AP', desc:'Até o início da próxima ativação deste operativo, sempre que ele estiver atirando, inimigos não podem ficar obscurecidos. Não pode ser feito perto de inimigo.'},
        ],
        weapons:[
          { name:'Pistola Bolter', A:4, skill:3, D:3, CD:4, range:'short' },
          { name:'Bolt Sniper Rifle', range:'long', profiles:[
            { name:'Executioner', A:4, skill:2, D:3, CD:4, tags:['Heavy (Dash only)','Saturate','Seek Light','Silent'] },
            { name:'Hyperfrag',   A:4, skill:2, D:2, CD:4, tags:['Blast 1"','Heavy (Dash only)','Silent'] },
            { name:'Mortis',      A:4, skill:2, D:3, CD:3, tags:['Devastating 3','Heavy (Dash only)','Piercing 1','Silent'] },
          ]},
          { name:'Punhos', A:4, skill:3, D:3, CD:4, range:'melee' },
        ]},
    ]
  },
  // ── NEMESIS CLAW (Night Lords - Chaos Space Marines) ─
  {
    id:'kt-nemesisclaw', name:'Nemesis Claw', faction:'Chaos Space Marines',
    color:'#8b5cf6', emoji:'🦇',
    desc:'Night Lords mestres do terror — usam medo e escuridão como armas antes mesmo do combate começar. Punem operativos feridos com brutalidade extra.',
    style:'Terror · Versátil',
    limit: 6,
    coreRule: {name:"Vestidos de Meia-Noite", desc:"Fica obscurecido ao ser alvo se estiver a mais de 8\" do inimigo E perto de terreno pesado — furtividade natural dos Night Lords."},
    ploys: {
      strategy: [
        {name:"Visão da Presa", desc:"Ao atirar, arma ganha alcance 6\" extra e ignora a regra Seek Light."},
        {name:"Retorno às Trevas", desc:"Um operativo recua/reposiciona grátis, terminando perto de terreno pesado."},
        {name:"A Caçada Negra", desc:"Contra inimigo ferido, re-rola 1 dado de ataque em qualquer ação."},
        {name:"Viemos Buscar Você", desc:"Se a primeira ação da ativação for Carga, causa D3 dano extra ao terminar o movimento."},
      ],
      firefight: [
        {name:"Lutador Sujo", desc:"Ao revidar, resolve 1 sucesso antes da ordem normal."},
        {name:"Morte ao Falso Imperador", desc:"Contra alvo Imperium, ganha Ceaseless (ou Relentless se for Astartes) na sequência."},
        {name:"Propensão ao Assassinato", desc:"Após incapacitar um inimigo, faz Carga ou Dash grátis."},
        {name:"Grito de Vox", desc:"Rola 1D6 contra o APL do próximo inimigo a ativar — se vencer, ele não pode ativar neste turno."},
      ],
    },
    operatives: [
      { id:'kt-nc-visionary', name:'Visionary', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:15,
        abilities:[
          {name:'LÍDER · PSYKER', desc:'Este operativo é o líder do time e tem palavra-chave Psyker.'},
          {name:'Prescience', desc:'No início de cada Strategy Phase, ganha D3 pontos de Presciência (descartados no fim do turno). Foreboding: gasta 1 ponto pra pular a ativação de um operativo inimigo. Portent: gasta 1 ponto pra ignorar um dano Normal recebido. Cada regra só pode ser usada 1x por turno, e nenhuma funciona se este operativo estiver incapacitado.'},
          {name:'Premonition', ap:'1AP', desc:'Psychic. Gasta 1 ponto de Presciência pra ganhar 1CP. Não pode ser feito perto de inimigo, nem mais de 1x por turno.'},
        ],
        weapons:[
          { name:'Pistola Bolter', A:4, skill:3, D:3, CD:4, range:'short' },
          { name:'Pistola de Plasma', range:'short', profiles:[
            { name:'Padrão',     A:4, skill:3, D:3, CD:5, tags:['Piercing 1'] },
            { name:'Sobrecarga', A:4, skill:3, D:4, CD:5, tags:['Piercing 1','Hot','Lethal 5+'] },
          ]},
          { name:'Lâmina Nostramana', A:5, skill:3, D:4, CD:5, range:'melee', tags:['Rending'] },
          { name:'Punho de Força',    A:5, skill:4, D:5, CD:7, range:'melee', tags:['Brutal'] },
          { name:'Malho de Poder',    A:5, skill:3, D:4, CD:6, range:'melee', tags:['Shock'] },
          { name:'Arma de Poder',     A:5, skill:3, D:4, CD:6, range:'melee', tags:['Lethal 5+'] },
        ]},
      { id:'kt-nc-fearmonger', name:'Fearmonger', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:14,
        abilities:[
          {name:'Terrorchem', desc:'Se causar dano com algum sucesso crítico (inclusive via Devastating), o alvo ganha um marcador de Terrorchem (se ainda não tiver um).'},
          {name:'Terrorchem Poison', desc:'Sempre que um operativo marcado com Terrorchem for ativado, sofre D3 de dano.'},
          {name:'Poison Objective', ap:'1AP', desc:'Escolhe um marcador de objetivo que este operativo controla pra ganhar um marcador de Terrorchem. Não pode ser um objetivo no alcance de controle inimigo, nem um que já tenha o marcador. A primeira vez que um inimigo sem Terrorchem disputar aquele objetivo, ele ganha o marcador e sofre 2D3 de dano. Não pode ser feito perto de inimigo.'},
        ],
        weapons:[
          { name:'Pistola Bolter Mirada', range:'short', profiles:[
            { name:'Curto Alcance', A:4, skill:3, D:3, CD:4, tags:['Range 8"','Lethal 5+'] },
            { name:'Longo Alcance', A:4, skill:3, D:3, CD:4, tags:[] },
          ]},
          { name:'Vial de Terrorchem', A:5, skill:3, D:2, CD:0, range:'short', tags:['Range 6"','Blast 2"','Devastating 3','Limited 1','Saturate','Terrorchem'] },
          { name:'Lâmina Contaminada', A:5, skill:3, D:3, CD:5, range:'melee', tags:['Terrorchem'] },
        ]},
      { id:'kt-nc-gunner', name:'Gunner', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:14,
        abilities:[
          {name:'Astartes', desc:'Em cada ativação, pode fazer 2 ações de Tiro ou 2 de Luta (não uma de cada). Especialista em armas de assalto pesadas.'},
        ],
        weapons:[
          { name:'Pistola Bolter', A:4, skill:3, D:3, CD:4, range:'short' },
          { name:'Lança-chamas',   A:4, skill:2, D:3, CD:3, range:'short', tags:['Range 8"','Saturate','Torrent 2"'] },
          { name:'Meltagun',       A:4, skill:3, D:6, CD:3, range:'short', tags:['Range 6"','Devastating 4','Piercing 2'] },
          { name:'Plasma Gun', range:'short', profiles:[
            { name:'Padrão',     A:4, skill:3, D:4, CD:6, tags:['Piercing 1'] },
            { name:'Sobrecarga', A:4, skill:3, D:5, CD:6, tags:['Piercing 1','Hot','Lethal 5+'] },
          ]},
          { name:'Punhos', A:4, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-nc-heavygunner', name:'Heavy Gunner', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:14,
        abilities:[
          {name:'Armamento Pesado', desc:'Bolter pesado e lançador de mísseis — devastador contra alvos únicos ou grupos a longa distância.'},
        ],
        weapons:[
          { name:'Pistola Bolter', A:4, skill:3, D:3, CD:4, range:'short' },
          { name:'Bolter Pesado', range:'long', profiles:[
            { name:'Focado',    A:5, skill:3, D:4, CD:5, tags:['Heavy (Reposition only)','Piercing Crits 1'] },
            { name:'Varredura', A:4, skill:3, D:4, CD:5, tags:['Heavy (Reposition only)','Piercing Crits 1','Torrent 1"'] },
          ]},
          { name:'Lançador de Mísseis', range:'long', profiles:[
            { name:'Frag', A:4, skill:3, D:3, CD:5, tags:['Blast 2"','Heavy (Reposition only)'] },
            { name:'Krak', A:4, skill:3, D:5, CD:7, tags:['Heavy (Reposition only)','Piercing 1'] },
          ]},
          { name:'Punhos', A:4, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-nc-screecher', name:'Screecher', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:14,
        abilities:[
          {name:'Screecher', desc:'Sempre que um operativo inimigo a até 3" deste estiver atirando, lutando ou revidando, o oponente não pode re-rolar seus dados de ataque.'},
          {name:'Appetite for Cruelty', desc:'Ao lutar contra um inimigo ferido, as garras relâmpago ganham a regra Lethal 4+.'},
        ],
        weapons:[
          { name:'Garras Relâmpago', A:5, skill:3, D:4, CD:5, range:'melee', tags:['Ceaseless','Lethal 5+'] },
        ]},
      { id:'kt-nc-skinthief', name:'Skinthief', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:14,
        abilities:[
          {name:'Flay Them Alive', desc:'1x por turno, ao incapacitar um inimigo no alcance de controle, escolhe outro inimigo visível a até 6" — até o início do próximo turno, ele não pode controlar marcadores nem fazer as ações Pegar Marcador ou de missão.'},
          {name:'Tyrant of the Skinning Pits', desc:'Ao lutar ou revidar, dano Normal ou Crítico de 3+ recebido é reduzido em 1.'},
        ],
        weapons:[
          { name:'Pistola Bolter',     A:4, skill:3, D:3, CD:4, range:'short' },
          { name:'Foice Nostramana',   A:5, skill:3, D:4, CD:6, range:'melee', tags:['Rending'] },
        ]},
      { id:'kt-nc-ventrilokar', name:'Ventrilokar', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:14,
        abilities:[
          {name:'PSYKER', desc:'Este operativo tem palavra-chave Psyker.'},
          {name:'Icon Bearer', desc:'Ao determinar controle de marcador, o APL deste operativo é tratado como 1 a mais (cumulativo com outras mudanças).'},
          {name:'Disconcerting Mimicry', ap:'1AP', desc:'Psychic. Escolhe um inimigo a até 6": -1 no APL dele até o fim da próxima ativação; OU troca a ordem dele; OU faz um Dash grátis com ele (você escolhe o destino). Cada opção só 1x por batalha. Não pode ser feito perto de inimigo.'},
        ],
        weapons:[
          { name:'Pistola Bolter', A:4, skill:3, D:3, CD:4, range:'short' },
          { name:'Espada Sierra',  A:5, skill:3, D:4, CD:5, range:'melee' },
        ]},
      { id:'kt-nc-warrior', name:'Warrior', unique:false, count:5,
        M:'6"', APL:3, GA:2, DF:3, SV:3, W:14,
        abilities:[
          {name:'Cruel Tormenter', desc:'Ao atirar, lutar ou revidar contra um inimigo ferido, ou com PV total de 7 ou menos, as armas deste operativo ganham Lethal 5+.'},
        ],
        weapons:[
          { name:'Pistola Bolter', A:4, skill:3, D:3, CD:4, range:'short' },
          { name:'Boltgun',        A:4, skill:3, D:3, CD:4, range:'long' },
          { name:'Espada Sierra',  A:5, skill:3, D:4, CD:5, range:'melee' },
          { name:'Punhos',         A:4, skill:3, D:3, CD:4, range:'melee' },
        ]},
    ]
  },
  // ── DEATHWATCH (Space Marines) ──────────────────────
  {
    id:'kt-deathwatch', name:'Deathwatch', faction:'Space Marines',
    color:'#166534', emoji:'🦅',
    desc:'Elite de caçadores de xenos reunidos de vários Capítulos. Armas altamente especializadas e adaptáveis para qualquer inimigo alienígena.',
    style:'Elite · Versátil',
    limit: 5,
    coreRule: {name:"Veteran Astartes", desc:"Cada operativo pode fazer 2 ações de Tiro ou 2 de Luta na mesma ativação. Pode contra-atacar independente da ordem."},
    ploys: {
      strategy: [
        {name:"Táticas de Missão", desc:"Escolha Conceal ou Engage — suas armas ganham Balanced contra inimigos com essa ordem."},
        {name:"Vigília Eterna", desc:"Ao ser alvo dentro do seu território, re-rola 1 dado de defesa."},
        {name:"Escudo que Mata", desc:"No território inimigo, dano normal de 4+ recebido é reduzido em 1."},
        {name:"Eles Não Temem", desc:"Ignora mudanças de status por estar ferido."},
      ],
      firefight: [
        {name:"Não Sofra o Alienígena", desc:"Contra inimigo sem palavra-chave Chaos/Imperium, re-rola qualquer dado de ataque."},
        {name:"Rastreamento Auspicador", desc:"Ao contra-atacar, pode trocar a ordem antes de agir."},
        {name:"Varredura Avançada", desc:"Ao atirar, arma ganha Saturate e inimigos não ficam obscurecidos até o fim da ação."},
        {name:"Fisiologia Transumana", desc:"Ao ser alvo, transforma 1 sucesso normal de defesa em crítico."},
      ],
    },
    operatives: [
      { id:'kt-dw-sergeant', name:'Watch Sergeant', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:15,
        abilities:[
          {name:'LÍDER', desc:'Este operativo é o líder do time.'},
          {name:'Adaptable Armoury', desc:'Pode escolher 1 opção adicional de equipamento.'},
          {name:'Strategic Command', desc:'1x por batalha cada, se este operativo estiver em campo: usa um Strategy Ploy Deathwatch de graça; usa um Firefight Ploy Deathwatch de graça.'},
        ],
        weapons:[
          { name:'Pistola de Plasma', range:'short', profiles:[
            { name:'Padrão',     A:4, skill:3, D:3, CD:5, tags:['Piercing 1'] },
            { name:'Sobrecarga', A:4, skill:3, D:4, CD:5, tags:['Piercing 1','Hot','Lethal 5+'] },
          ]},
          { name:'Arma de Poder', A:5, skill:3, D:4, CD:6, range:'melee', tags:['Lethal 5+'] },
        ]},
      { id:'kt-dw-aegis', name:'Aegis Veteran', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:2, W:15,
        abilities:[
          {name:'Shield', desc:'Ao lutar ou revidar com o Malho + Escudo Tempestade, cada bloqueio pode ser usado pra bloquear 2 sucessos não resolvidos (em vez de 1).'},
          {name:'Storm Shield', desc:'Ao ser alvo de tiro, piora o valor X da regra Piercing em 1 (então Piercing 1 é totalmente ignorado).'},
        ],
        weapons:[
          { name:'Pistola Bolter',            A:4, skill:3, D:3, CD:4, range:'short' },
          { name:'Malho + Escudo Tempestade',  A:5, skill:3, D:4, CD:6, range:'melee', tags:['Shock'] },
        ]},
      { id:'kt-dw-blademaster', name:'Blademaster Veteran', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:15,
        abilities:[
          {name:'Adaptive Swordsmanship', desc:'Ignora mudanças no Hit da Lâmina Xenófase. Ao lutar ou revidar, pode resolver um dos seus sucessos antes da ordem normal — mas nesse caso ele deve ser usado pra Bloquear.'},
          {name:'Phase Sweep', desc:'Ao lutar com o perfil Varredura de Fase, se não for incapacitado, pode fazer outra ação de Luta grátis logo em seguida — mas só contra cada inimigo no alcance de controle 1x por ativação ou contra-ataque com esse perfil. Continua fazendo ações grátis até ser incapacitado ou ter lutado contra todos os inimigos no alcance.'},
        ],
        weapons:[
          { name:'Pistola Bolter Especial', A:4, skill:3, D:3, CD:4, range:'short', tags:['Piercing 1'] },
          { name:'Lâmina Xenófase', range:'melee', profiles:[
            { name:'Duelo',        A:5, skill:3, D:4, CD:6, tags:['Brutal','Lethal 5+'] },
            { name:'Varredura de Fase', A:4, skill:3, D:4, CD:6, tags:['Brutal','Lethal 5+'] },
          ]},
        ]},
      { id:'kt-dw-bombard', name:'Bombard Veteran', unique:true,
        M:'5"', APL:3, GA:1, DF:3, SV:3, W:18,
        abilities:[
          {name:'GRAVIS', desc:'Armadura pesada Gravis — máximo 1 operativo Gravis por time. Com 18 PV, é um dos mais resistentes do time.'},
        ],
        weapons:[
          { name:'Pistola Bolter', A:4, skill:3, D:3, CD:4, range:'short' },
          { name:'Canhão de Estilhaço', range:'short', profiles:[
            { name:'Concha',    A:4, skill:3, D:5, CD:7, tags:['Piercing 1'] },
            { name:'Estilhaço', A:5, skill:3, D:4, CD:5, tags:['Torrent 2"'] },
          ]},
          { name:'Punhos', A:4, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-dw-breacher', name:'Breacher Veteran', unique:true,
        M:'5"', APL:3, GA:1, DF:3, SV:3, W:18,
        abilities:[
          {name:'GRAVIS', desc:'Armadura pesada Gravis — máximo 1 operativo Gravis por time.'},
          {name:'Especialista em Arrombamento', desc:'Carrega granadas auxiliares e uma bomba de melta devastadora contra alvos blindados.'},
        ],
        weapons:[
          { name:'Lançador de Granadas Auxiliar', range:'long', profiles:[
            { name:'Frag', A:4, skill:3, D:2, CD:4, tags:['Blast 2"'] },
            { name:'Krak', A:4, skill:3, D:4, CD:5, tags:['Piercing 1'] },
          ]},
          { name:'Rifle Bolter Hellstorm', A:4, skill:3, D:4, CD:5, range:'long', tags:['Torrent 1"'] },
          { name:'Bomba de Melta', A:4, skill:3, D:5, CD:3, range:'short', tags:['Range 3"','Devastating 3','Heavy (Reposition only)','Limited 1','Piercing 2'] },
          { name:'Punhos', A:4, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-dw-demolisher', name:'Demolisher Veteran', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:15,
        abilities:[
          {name:'Brutal Assault', desc:'Ao lutar, o Martelo Pesado do Trovão ganha a regra Brutal. Ao fazer a ação Charge, ganha a regra Ceaseless até o fim da ativação/contra-ataque.'},
          {name:'Aggressive Force', desc:'Ao lutar ou revidar, dano Normal ou Crítico de 3+ recebido é reduzido em 1. Não acumula com o Ploy Shield That Slays.'},
        ],
        weapons:[
          { name:'Pistola Bolter',       A:4, skill:3, D:3, CD:4, range:'short' },
          { name:'Martelo Pesado do Trovão', A:5, skill:4, D:6, CD:7, range:'melee', tags:['Shock','Stun'] },
        ]},
      { id:'kt-dw-disruptor', name:'Disruptor Veteran', unique:true,
        M:'7"', APL:3, GA:1, DF:3, SV:3, W:13,
        abilities:[
          {name:'Advanced Omni-Scrambler', desc:'Strategic Gambit. Escolhe um inimigo visível ou a até 6" e rola 1D6. Na Firefight Phase deste turno, aquele inimigo não pode ativar nem agir até que X inimigos tenham sido ativados (X = resultado do dado) ou até ser o último a ativar.'},
          {name:'Auspex Triangulation', desc:'O Ploy Advanced Auspex Scan custa 0CP quando este operativo não está no alcance de controle de inimigo E o alvo do Tiro é visível a ele.'},
        ],
        weapons:[
          { name:'Carabina Marksman', A:4, skill:3, D:3, CD:4, range:'long', tags:['Lethal 5+'] },
          { name:'Punhos',            A:4, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-dw-gunner', name:'Gunner Veteran', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:15,
        abilities:[
          {name:'Especialista em Plasma', desc:'Carrega o Incinerador de Plasma Pesado, com modo padrão e sobrecarga.'},
        ],
        weapons:[
          { name:'Pistola Bolter', A:4, skill:3, D:3, CD:4, range:'short' },
          { name:'Incinerador de Plasma Pesado', range:'long', profiles:[
            { name:'Padrão',     A:5, skill:3, D:4, CD:6, tags:['Piercing 1'] },
            { name:'Sobrecarga', A:5, skill:3, D:5, CD:6, tags:['Hot','Lethal 5+','Piercing 1'] },
          ]},
          { name:'Punhos', A:4, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-dw-headtaker', name:'Headtaker Veteran', unique:true,
        M:'7"', APL:3, GA:1, DF:3, SV:3, W:13,
        abilities:[
          {name:'Grav-chute e Lançador de Grapnel', desc:'Ao escalar, a distância vertical é sempre tratada como 2" (não importa a altura real). Ao cair, ignora a distância vertical.'},
          {name:'Clandestine Headtaker', desc:'Pode fazer a ação Charge mesmo com ordem Conceal. Ao lutar contra um inimigo que não via no início da ativação/contra-ataque, na primeira vez que golpear naquela sequência, pode resolver outro dos seus sucessos como golpe imediatamente (antes do oponente agir).'},
        ],
        weapons:[
          { name:'Pistola Bolter Especial', A:4, skill:3, D:3, CD:4, range:'short', tags:['Piercing 1'] },
          { name:'Facas de Combate',        A:5, skill:3, D:4, CD:5, range:'melee' },
        ]},
      { id:'kt-dw-hordeslayer', name:'Horde-Slayer Veteran', unique:true,
        M:'5"', APL:3, GA:1, DF:3, SV:3, W:18,
        abilities:[
          {name:'GRAVIS', desc:'Armadura pesada Gravis — máximo 1 operativo Gravis por time. Com 18 PV, é um dos mais resistentes do time.'},
          {name:'Bolter Pesado Infernal', desc:'Três modos de disparo — devastador contra grupos ou alvos únicos, a curta ou longa distância.'},
        ],
        weapons:[
          { name:'Pistola Bolter', A:4, skill:3, D:3, CD:4, range:'short' },
          { name:'Bolter Pesado Infernal', range:'long', profiles:[
            { name:'Chama',           A:5, skill:2, D:3, CD:3, tags:['Range 8"','Saturate','Torrent 2"'] },
            { name:'Bolt Focado',     A:5, skill:3, D:4, CD:5, tags:['Piercing Crits 1'] },
            { name:'Bolt Varredura',  A:4, skill:3, D:4, CD:5, tags:['Piercing Crits 1','Torrent 1"'] },
          ]},
          { name:'Punhos', A:4, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-dw-marksman', name:'Marksman Veteran', unique:true,
        M:'6"', APL:3, GA:1, DF:3, SV:3, W:15,
        abilities:[
          {name:'Vigilant Marksman', desc:'Pode fazer a ação Guard durante sua ativação independente do tipo de zona de jogo (ver regras de combate próximo).'},
          {name:'Guard Extra', desc:'Usando regras de combate próximo, 1x por turno, depois que este operativo fizer um Tiro grátis via Guard, pode imediatamente fazer outra ação Guard grátis — mas nesse caso não pode contra-atacar naquele turno (nem fazer Guard duas vezes se for contra-atacado).'},
        ],
        weapons:[
          { name:'Rifle Bolter Stalker', range:'long', profiles:[
            { name:'Móvel',  A:4, skill:3, D:3, CD:4, tags:[] },
            { name:'Pesado', A:4, skill:2, D:3, CD:5, tags:['Heavy (Dash only)','Lethal 5+','Piercing Crits 1'] },
          ]},
          { name:'Punhos', A:4, skill:3, D:3, CD:4, range:'melee' },
        ]},
    ]
  },
  // ── PLAGUE MARINES (Chaos - Death Guard) ────────────
  {
    id:'kt-plaguemarines', name:'Plague Marines', faction:'Chaos Space Marines',
    color:'#4d7c0f', emoji:'🦠',
    desc:'Filhos corrompidos de Mortarion, inchados de podridão e doença. Lentos mas horrivelmente resistentes, espalham contágio por onde passam.',
    style:'Resistente · Veneno',
    limit: 6,
    coreRule: {name:"Disgustingly Resilient", desc:"Sempre que um dado de ataque causar 3+ de dano num Plague Marine, role 1D6: em 4+, reduz 1 do dano. Astartes: cada operativo pode fazer 2 ações de Tiro ou 2 de Luta; se forem 2 de Tiro, pelo menos uma deve usar pistola bolter, boltgun ou arma Psíquica. Pode contra-atacar independente da ordem. Poison: armas com essa regra aplicam um marcador no alvo atingido — operativo marcado sofre 1 dano ao ser ativado."},
    ploys: {
      strategy: [
        {name:"Contágio", desc:"Inimigo no alcance de controle de Plague Marines, ou visível e a até 3\" de um Icon Bearer, ou marcado com Poison e perto do time: -2\" de Move e piora o Hit em 1 (não acumula com ferimento)."},
        {name:"Morte Lenta", desc:"Se não se moveu mais de 3\" na ativação (ou ao revidar), suas armas ganham Ceaseless."},
        {name:"Nuvem de Moscas", desc:"Cria um marcador — Plague Marine totalmente dentro de 3\" dele fica obscurecido contra tiros de mais de 3\". Remove no próximo turno."},
        {name:"Nurglings", desc:"Reduz o APL de um inimigo próximo (ou marcado com Poison a até 7\") em 1 até o fim da próxima ativação dele."},
      ],
      firefight: [
        {name:"Veneno Virulento", desc:"Antes ou depois de uma ação, aplica marcador de Poison num inimigo a até 3\"; ou rola 2D6 (7+) pra aplicar num inimigo a até 7\"."},
        {name:"Morte Venenosa", desc:"Ao ser incapacitado, inimigos visíveis a até 3\" ganham marcador de Poison (ou sofrem 1 dano se já tinham)."},
        {name:"Resiliência Nauseante", desc:"Ao sofrer dano, garante -1 no dano daquela sequência (mínimo 2) sem precisar rolar o D6 do Disgustingly Resilient."},
        {name:"Maldição da Podridão", desc:"Contra inimigo próximo (3\", ou 7\" se marcado com Poison), cada resultado 3 que ele rolar em ataque/defesa vira falha e causa 1 dano nele, sem re-roll."},
      ],
    },
    operatives: [
      { id:'kt-pm-champion', name:'Champion', unique:true,
        M:'5"', APL:3, GA:1, DF:3, SV:3, W:15,
        abilities:[
          {name:'LÍDER', desc:'Este operativo é o líder do time.'},
          {name:"Grandfather's Blessing", desc:'Sempre que um inimigo marcado com Poison perder PV a até 7" deste operativo, ele recupera 1 PV perdido (máx 3 por turno, e só se não estiver incapacitado).'},
          {name:'Toxic', desc:'A Espada da Peste: contra inimigo marcado com Poison, +1 em ambos os valores de Dano.'},
        ],
        weapons:[
          { name:'Pistola de Plasma', range:'short', profiles:[
            { name:'Padrão',     A:4, skill:3, D:3, CD:5, tags:['Piercing 1'] },
            { name:'Sobrecarga', A:4, skill:3, D:4, CD:5, tags:['Piercing 1','Hot','Lethal 5+'] },
          ]},
          { name:'Espada da Peste', A:5, skill:3, D:4, CD:5, range:'melee', tags:['Severe','Poison','Toxic'] },
        ]},
      { id:'kt-pm-plaguecaster', name:'Malignant Plaguecaster', unique:true,
        M:'5"', APL:3, GA:1, DF:3, SV:3, W:14,
        abilities:[
          {name:'PSYKER', desc:'Este operativo tem palavra-chave Psyker.'},
          {name:'Miasma Venenoso', ap:'1AP', desc:'Psychic. Escolhe um inimigo visível a até 7" (ou alvo válido). Ele ganha um marcador de Poison; se já tinha um, sofre 3 dano em vez disso. Não pode ser feito perto de inimigo.'},
          {name:'Vitalidade Pútrida', ap:'1AP', desc:'Psychic. Escolhe um aliado visível a até 3". Rola 2D6: se der 7, recupera 7 PV perdidos; senão, recupera PV igual ao maior D6. Não pode ser feito perto de inimigo.'},
        ],
        weapons:[
          { name:'Entropia',          A:4, skill:3, D:3, CD:7, range:'long', tags:['Range 7"','Saturate','Severe','Poison'] },
          { name:'Vento da Peste',    A:6, skill:3, D:2, CD:3, range:'short', tags:['Saturate','Severe','Torrent 1"','Poison'] },
          { name:'Cajado Corrompido', A:4, skill:3, D:3, CD:4, range:'melee', tags:['Severe','Shock','Stun','Poison'] },
        ]},
      { id:'kt-pm-bombardier', name:'Bombardier', unique:true,
        M:'5"', APL:3, GA:1, DF:3, SV:3, W:14,
        abilities:[
          {name:'Grenadier', desc:'Pode usar granadas de peste (blight) e krak sem contar pro limite de usos. Ao usar, o Hit dessa arma melhora em 1, e as granadas de peste ganham a regra Toxic.'},
        ],
        weapons:[
          { name:'Boltgun', A:4, skill:3, D:3, CD:4, range:'long' },
          { name:'Punhos',  A:4, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-pm-fighter', name:'Fighter', unique:true,
        M:'5"', APL:3, GA:1, DF:3, SV:3, W:14,
        abilities:[
          {name:'Mangual', ap:'1AP', desc:'Causa D3+2 dano em cada operativo visível e a até 2" deste (role separado pra cada). Se for inimigo, em resultado 3 também ganha marcador de Poison. Não pode ser feito com Conceal, nem numa ativação com mais de 1 ação de Luta — e essa ação impede outra ação de Luta na mesma ativação.'},
        ],
        weapons:[
          { name:'Mangual da Corrupção', A:5, skill:3, D:4, CD:5, range:'melee', tags:['Brutal','Severe','Shock','Poison'] },
        ]},
      { id:'kt-pm-heavygunner', name:'Heavy Gunner', unique:true,
        M:'5"', APL:3, GA:1, DF:3, SV:3, W:14,
        abilities:[
          {name:'Cuspidor de Peste', desc:'Arma de área que envenena tudo ao redor do alvo.'},
        ],
        weapons:[
          { name:'Cuspidor de Peste', A:5, skill:2, D:3, CD:3, range:'short', tags:['Range 7"','Saturate','Severe','Torrent 2"','Poison'] },
          { name:'Punhos',            A:4, skill:3, D:3, CD:4, range:'melee' },
        ]},
      { id:'kt-pm-iconbearer', name:'Icon Bearer', unique:true,
        M:'5"', APL:3, GA:1, DF:3, SV:3, W:14,
        abilities:[
          {name:'Icon Bearer', desc:'Ao determinar controle de marcador, o APL deste operativo é tratado como 1 a mais (cumulativo com outras mudanças).'},
          {name:'Icon of Contagion', desc:'Enquanto este operativo estiver em campo, o Ploy Contágio custa 0CP.'},
        ],
        weapons:[
          { name:'Pistola Bolter', A:4, skill:3, D:3, CD:4, range:'short' },
          { name:'Faca da Peste',  A:5, skill:3, D:3, CD:4, range:'melee', tags:['Severe','Poison'] },
        ]},
      { id:'kt-pm-warrior', name:'Warrior', unique:true,
        M:'5"', APL:3, GA:1, DF:3, SV:3, W:14,
        abilities:[
          {name:'Repulsive Fortitude', desc:'Ao ser alvo de tiro, dados de defesa com resultado 5+ são sucessos críticos.'},
          {name:'Toxic', desc:'O Boltgun: contra inimigo marcado com Poison, +1 em ambos os valores de Dano.'},
        ],
        weapons:[
          { name:'Boltgun',       A:4, skill:3, D:3, CD:4, range:'long', tags:['Toxic'] },
          { name:'Faca da Peste', A:4, skill:3, D:3, CD:4, range:'melee', tags:['Severe','Poison'] },
        ]},
    ]
  },
  // ── BLOODED (Chaos - Traitor Guard) ─────────────────
  {
    id:'kt-blooded', name:'Blooded', faction:'Chaos',
    color:'#991b1b', emoji:'🩸',
    desc:'Guardas Imperiais renegados que se entregaram ao Caos. Buscam a atenção dos Deuses Sombrios matando os inimigos mais fortes — até seus próprios aliados são sacrificáveis.',
    style:'Horda · Sacrifício',
    limit: 14,
    coreRule: {name:"Marcadores Blooded", desc:"Ganha 1 marcador Blooded: no início de cada turno; na 1ª vez que um inimigo for incapacitado no turno; na 1ª vez que um aliado for incapacitado a até 6\" de inimigo no turno. Como Strategic Gambit, atribui marcadores livres a operativos Blooded (máx 1 cada). Se 4+ operativos em campo tiverem marcador, escolha 1 pra ficar sob o OLHAR DOS DEUSES até o fim do turno. Operativo com marcador: armas ganham Accurate 1 (e se estiver sob o Olhar, pode reter esse sucesso como crítico)."},
    ploys: {
      strategy: [
        {name:"Glory Kill", desc:"Escolhe um inimigo visível — até o fim do turno, Blooded que atirar/lutar/revidar contra ele ganha Ceaseless (ou Relentless se tiver marcador)."},
        {name:"Reckless Aspirant", desc:"Blooded sem marcador totalmente no território inimigo ganha Accurate 1 ao atirar/lutar. Com marcador, ganha Punishing em vez disso."},
        {name:"Malevolent Grit", desc:"Ao ser alvo de tiro, se tiver marcador ou estiver no território inimigo, re-rola 1 dado de defesa."},
        {name:"Bitter Demise", desc:"Ao ser incapacitado, rola 1D3: em 3 (ou 2+ com marcador), causa esse tanto de dano num inimigo visível a até 2\"."},
      ],
      firefight: [
        {name:"Callous Disregard", desc:"Ao escolher alvo pra Atirar, ignora a proteção de aliados Blooded no alcance de controle do inimigo — mas cada falha descartada causa dano num aliado seu perto do alvo."},
        {name:"Moment of Repute", desc:"Durante a ativação de um Blooded sob o Olhar dos Deuses, +1 no APL até o fim da ativação."},
        {name:"Reward Earned", desc:"Ao incapacitar um inimigo com um Blooded marcado a até 2\", ganha 1 marcador Blooded."},
        {name:"Dark Favour", desc:"Se um Blooded marcado for escolhido como alvo, troca por outro Blooded aliado visível a até 3\" (não funciona contra Blast/Torrent)."},
      ],
    },
    operatives: [
      { id:'kt-bl-chieftain', name:'Traitor Chieftain', unique:true,
        M:'6"', APL:2, GA:1, DF:3, SV:5, W:8,
        abilities:[
          {name:'LÍDER', desc:'Este operativo é o líder do time.'},
          {name:'Blooded Icon', desc:'1x por turno, quando um Blooded aliado marcado for incapacitado a até 6" deste operativo, pode recuperar aquele marcador.'},
          {name:'Lead With Strength', desc:'Enquanto tiver marcador Blooded e estiver totalmente no território inimigo, é tratado como se estivesse sob o Olhar dos Deuses.'},
        ],
        weapons:[
          { name:'Autopistola',   A:4, skill:3, D:2, CD:3, range:'short' },
          { name:'Pistola Laser', A:4, skill:3, D:2, CD:3, range:'short' },
          { name:'Pistola Bolter',A:4, skill:3, D:3, CD:4, range:'short' },
          { name:'Boltgun',       A:4, skill:3, D:3, CD:4, range:'long' },
          { name:'Pistola de Plasma', range:'short', profiles:[
            { name:'Padrão',     A:4, skill:3, D:3, CD:5, tags:['Piercing 1'] },
            { name:'Sobrecarga', A:4, skill:3, D:4, CD:5, tags:['Piercing 1','Hot','Lethal 5+'] },
          ]},
          { name:'Baioneta',        A:3, skill:3, D:2, CD:3, range:'melee' },
          { name:'Espada Sierra',   A:4, skill:3, D:4, CD:5, range:'melee' },
          { name:'Lâmina Improvisada', A:4, skill:3, D:2, CD:3, range:'melee' },
          { name:'Arma de Poder',   A:4, skill:3, D:4, CD:6, range:'melee', tags:['Lethal 5+'] },
        ]},
      { id:'kt-bl-grenadier', name:'Brimstone Grenadier', unique:true,
        M:'6"', APL:2, GA:1, DF:3, SV:5, W:7,
        abilities:[
          {name:'Grenadier', desc:'Pode usar granadas frag/krak sem contar pro limite de usos. Ao usar, o Hit dessa arma melhora em 1.'},
          {name:'Explosive Demise', desc:'Se for incapacitado, pode rolar 2D6 (ou 1D6 se estiver no alcance de controle inimigo): em 4+, causa D3+2 dano em todos visíveis e a até 2". Se ainda não usou a bomba diabolyk na batalha, causa D6+2 em vez disso.'},
        ],
        weapons:[
          { name:'Bomba Diabolyk', A:4, skill:3, D:4, CD:3, range:'short', tags:['Range 6"','Blast 2"','Devastating 2','Limited 1','Heavy (Reposition only)','Piercing 1','Saturate'] },
          { name:'Lasgun',   A:4, skill:4, D:2, CD:3, range:'long' },
          { name:'Baioneta', A:3, skill:4, D:2, CD:3, range:'melee' },
        ]},
      { id:'kt-bl-butcher', name:'Butcher', unique:true,
        M:'6"', APL:2, GA:1, DF:3, SV:5, W:8,
        abilities:[
          {name:'Unholy Sustenance', desc:'Ao lutar ou revidar, se incapacitar o inimigo naquela sequência, recupera até D3 PV perdidos.'},
          {name:'Blood Offering', desc:'Ao lutar ou revidar com a arma, na primeira vez que golpear com crítico naquela sequência, ganha 1 marcador Blooded.'},
        ],
        weapons:[
          { name:'Arma de Poder e Facão', A:4, skill:3, D:4, CD:6, range:'melee', tags:['Ceaseless','Lethal 5+'] },
        ]},
      { id:'kt-bl-commsman', name:'Commsman', unique:true,
        M:'6"', APL:2, GA:1, DF:3, SV:5, W:7,
        abilities:[
          {name:'Signal', ap:'1AP', desc:'Apoio: escolhe outro Blooded aliado visível a até 6" (exceto Ogryn). Até o fim da próxima ativação dele, +1 no APL. Não pode ser feito perto de inimigo.'},
          {name:'Sacrilegious Actuation', ap:'1AP', desc:'Ganha 1 marcador Blooded. Não pode ser feito perto de inimigo, nem sem ter um marcador Blooded.'},
        ],
        weapons:[
          { name:'Lasgun',   A:4, skill:4, D:2, CD:3, range:'long' },
          { name:'Baioneta', A:3, skill:4, D:2, CD:3, range:'melee' },
        ]},
      { id:'kt-bl-corpseman', name:'Corpseman', unique:true,
        M:'6"', APL:2, GA:1, DF:3, SV:5, W:7,
        abilities:[
          {name:'Regular Dosage', desc:'No fim da seleção de operativos, se escolhido pra batalha, pode dar a outro Blooded aliado uma regra STIMM pra batalha (exceto Rejuvenado).'},
          {name:'Stimms', ap:'1AP', desc:'Escolhe um Blooded aliado no alcance de controle: Rejuvenado (recupera 2D3 PV) ou outra regra STIMM (Enraivecido: armas CaC ganham Relentless; Fortificado: dano de 3+ recebido, em 5+ no D6, reduz 1). Cada regra só 1x por operativo por batalha. Não pode ser feito perto de inimigo.'},
        ],
        weapons:[
          { name:'Lasgun',        A:4, skill:4, D:2, CD:3, range:'long' },
          { name:'Baioneta',      A:3, skill:4, D:2, CD:3, range:'melee' },
          { name:'Agulha Stimm',  A:3, skill:5, D:1, CD:4, range:'melee', tags:['Lethal 5+'] },
        ]},
      { id:'kt-bl-enforcer', name:'Enforcer', unique:true,
        M:'6"', APL:2, GA:1, DF:3, SV:4, W:9,
        abilities:[
          {name:'Conta como 2 seleções', desc:'Ocupa 2 vagas do grupo de suporte na composição do time.'},
          {name:'Gruelling Disciplinarian', desc:'Blooded aliados a até 6" ignoram mudanças de status por ferimento (inclusive das armas).'},
          {name:'Enforce', ap:'1AP', desc:'Escolhe outro Blooded aliado visível a até 3": ele faz uma ação de 1AP grátis na hora (máx 2" de movimento). Se for um Commsman, não pode usar Sacrilegious Actuation nem Signal nessa ação. Não pode ser feito perto de inimigo.'},
        ],
        weapons:[
          { name:'Pistola Bolter', A:4, skill:3, D:3, CD:4, range:'short' },
          { name:'Punho de Força', A:4, skill:4, D:5, CD:7, range:'melee', tags:['Brutal'] },
        ]},
      { id:'kt-bl-flenser', name:'Flenser', unique:true,
        M:'6"', APL:2, GA:1, DF:3, SV:5, W:7,
        abilities:[
          {name:'Stalk', desc:'Ao lutar ou revidar com as lâminas, se houver terreno Leve ou Pesado no alcance de controle, a arma ganha Lethal 5+.'},
          {name:'Wretched', desc:'Pode Cargar mesmo com ordem Conceal. Se for incapacitado durante uma ação de Luta, pode golpear o inimigo daquela sequência com um sucesso não resolvido antes de sair de campo.'},
        ],
        weapons:[
          { name:'Lâminas de Esfola', A:4, skill:3, D:3, CD:4, range:'melee', tags:['Ceaseless'] },
        ]},
      { id:'kt-bl-gunner', name:'Gunner', unique:true,
        M:'6"', APL:2, GA:1, DF:3, SV:5, W:7,
        abilities:[
          {name:'Arsenal Roubado', desc:'Carrega uma arma pesada roubada de vítimas — lança-chamas, lançador de granadas, meltagun ou plasma gun (escolha 1 pra batalha; só 1 operativo do time pode ter arma de plasma).'},
        ],
        weapons:[
          { name:'Lança-chamas', A:4, skill:2, D:3, CD:3, range:'short', tags:['Range 8"','Saturate','Torrent 2"'] },
          { name:'Lançador de Granadas', range:'short', profiles:[
            { name:'Frag', A:4, skill:4, D:2, CD:4, tags:['Blast 2"'] },
            { name:'Krak', A:4, skill:4, D:4, CD:5, tags:['Piercing 1'] },
          ]},
          { name:'Meltagun', A:4, skill:4, D:6, CD:3, range:'short', tags:['Range 6"','Devastating 4','Piercing 2'] },
          { name:'Plasma Gun', range:'short', profiles:[
            { name:'Padrão',     A:4, skill:4, D:4, CD:6, tags:['Piercing 1'] },
            { name:'Sobrecarga', A:4, skill:4, D:5, CD:6, tags:['Piercing 1','Hot','Lethal 5+'] },
          ]},
          { name:'Baioneta', A:3, skill:4, D:2, CD:3, range:'melee' },
        ]},
      { id:'kt-bl-ogryn', name:'Ogryn', unique:true,
        M:'6"', APL:2, GA:1, DF:3, SV:5, W:16,
        abilities:[
          {name:'Conta como 2 seleções', desc:'Ocupa 2 vagas do grupo de suporte na composição do time. Com 16 PV, é o mais resistente do time.'},
          {name:'Avalanche of Muscle', desc:'Ao terminar o movimento de uma Carga, pode causar D3 dano num inimigo no alcance de controle.'},
          {name:'Chem-enhanced', desc:'Ignora mudanças no APL; não é afetado pelas regras Shock e Stun de armas inimigas.'},
          {name:'Brute', desc:'Se estiver com ordem Conceal, não pode usar terreno Leve como cobertura ao ser escolhido como alvo (mas mantém o save de cobertura se tiver outro).'},
          {name:'Slow-witted', desc:'Gasta 1 AP a mais nas ações Pegar Marcador e ações de missão (exceto Operar Escotilha).'},
        ],
        weapons:[
          { name:'Malho de Poder e Garra Mutante', A:4, skill:3, D:5, CD:6, range:'melee', tags:['Rending','Shock'] },
        ]},
      { id:'kt-bl-sharpshooter', name:'Sharpshooter', unique:true,
        M:'6"', APL:2, GA:1, DF:3, SV:5, W:7,
        abilities:[
          {name:'Camo Cloak', desc:'Ao ser alvo de tiro, se puder reter save de cobertura, pode reter um adicional (não acumula com terreno Vantage).'},
          {name:'A Name Whispered In Blood', desc:'Strategic Gambit no 1º turno: escolhe um inimigo — sempre que atirar nele, este operativo é tratado como se tivesse marcador Blooded e estivesse sob o Olhar dos Deuses.'},
        ],
        weapons:[
          { name:'Long-las', range:'long', profiles:[
            { name:'Móvel',       A:4, skill:3, D:3, CD:4, tags:[] },
            { name:'Estacionária',A:4, skill:2, D:3, CD:3, tags:['Devastating 1','Heavy (Dash only)','Silent'] },
          ]},
          { name:'Baioneta', A:3, skill:4, D:2, CD:3, range:'melee' },
        ]},
      { id:'kt-bl-thug', name:'Thug', unique:true,
        M:'6"', APL:2, GA:1, DF:3, SV:4, W:7,
        abilities:[
          {name:'Tough', desc:'Ao lutar, revidar, ou ser alvo de tiro, dano Normal de 3+ recebido é reduzido em 1.'},
        ],
        weapons:[
          { name:'Cassetete Pesado', A:4, skill:3, D:4, CD:4, range:'melee', tags:['Brutal'] },
        ]},
      { id:'kt-bl-trenchsweeper', name:'Trench Sweeper', unique:true,
        M:'6"', APL:2, GA:1, DF:3, SV:4, W:9,
        abilities:[
          {name:'Shield', desc:'Ao lutar ou revidar com baioneta e escudo, cada bloqueio pode bloquear 2 sucessos não resolvidos.'},
          {name:'Shielding', desc:'Ao ser ativado, pode escolher: até a próxima ativação, -2" no Move, mas re-rola qualquer dado de defesa ao ser alvo de tiro.'},
        ],
        weapons:[
          { name:'Shotgun',            A:4, skill:3, D:3, CD:3, range:'short', tags:['Range 6"'] },
          { name:'Baioneta e Escudo',  A:3, skill:3, D:2, CD:3, range:'melee', tags:['Shield'] },
        ]},
      { id:'kt-bl-trooper', name:'Trooper', unique:false, count:9,
        M:'6"', APL:2, GA:2, DF:3, SV:5, W:7,
        abilities:[
          {name:'Group Activation', desc:'Sempre que este operativo terminar sua ativação, você deve ativar outro Trooper Blooded pronto em seguida (se houver), antes do oponente ativar. Ao terminar aquele segundo, o oponente ativa normalmente (não pode encadear mais de 2).'},
        ],
        weapons:[
          { name:'Lasgun',   A:4, skill:4, D:2, CD:3, range:'long' },
          { name:'Baioneta', A:3, skill:4, D:2, CD:3, range:'melee' },
        ]},
    ]
  },
];
