# AUSPEX Test Team — cobertura do motor de regras

## Estado atual de fidelidade — 2026-10-10

**Não é 100% fiel ao jogo de mesa.** A lista histórica de efeitos abaixo descreve implementação básica, não validação integral de ordem, escolhas, geometria e exceções. O laboratório visual permanece preservado.

Nesta rodada há seleção e efeitos dos quatro equipamentos de facção de Angels of Death e dos quatro de Kommandos, além de Explosive Grenades. Há testes específicos de reservas compartilhadas, repetição humana, timing de Tilting Shields e Obscured. Optics, Get It Dun!, Listen In, Concealed Position e Slasha têm handlers básicos; isso não significa que todas as habilidades estejam concluídas.

Pendências impeditivas de equivalência integral:

- As ações especiais de Kommandos receberam handlers nesta rodada; continuam necessárias conferências de interação com as lacunas gerais abaixo e QA externo. Breach/Hook/Smoke usam a geometria aproximada do tabuleiro, não medidas físicas exatas pelas bases.
- Equipamentos universais de terreno e utilidade, posicionamento e ações correspondentes.
- Iniciativa aleatória pré-deploy, escolha de zona e posicionamento em grupos de um terço (arredondado para cima) implementados. A fase de estratégia permite escolha pelo vencedor, empate decidido por quem não tinha a iniciativa, CP após a decisão e gambits alternados até dois passes consecutivos. Setup ainda usa zonas de quatro colunas do Pátio e coordenadas de grade, não testes físicos das bases inteiramente dentro da zona; equipamentos universais pré-batalha seguem pendentes.
- Alternância de repetições entre jogadores no combate; escolha da arma de retaliação e alocação humana de defesas; escolhas de Torrent/ordem de ataques secundários.
- Consolidação de alterações de APL e duração de Stun; timing de dano de Devastating e mudanças de estatística durante ações.
- Medidas por bordas das bases, seleção de cobertura/Obscured e trajetórias de Charge conforme o Core Book. O tabuleiro usa aproximações de grade/visibilidade.
- Setup e missão oficiais completos/Tac Ops. A missão Transmission atual é uma adaptação documentada.
- Aceite visual e partidas completas em navegador/aparelho real. Testes locais não substituem isso.

Fonte de dados: `killteam_data.js`. O simulador importa 15 equipes. Os testes de composição conferem o cadastro local, não equivalência integral às regras oficiais. Há fichas resumidas e efeitos por interpretação de texto; consultar `TEAM-AUDIT.md` para as lacunas conhecidas.

## Automatizado

- fases, iniciativa, CP, alternância, Group Activation e quatro Turning Points;
- posicionamento, ocupação, controle, movimento diagonal, Dash, Charge, Fall Back, Fly, escalada e Vantage;
- linha de visão, terreno pesado, cobertura leve/pesada, Conceal, Engage, Obscured, Seek/Seek Light e alcance;
- escolha de arma e perfil, limite de ações, armas Limited e restrições Heavy;
- rolagens, defesa por DF/SV, ferido, críticos, bloqueios, dano e incapacitação;
- Balanced, Ceaseless, Relentless, Lethal, Severe, Rending, Piercing, Piercing Crits, Devastating, Saturate, Blast, Torrent, Brutal, Silent, Hot e Melta;
- Poison, Toxic, Soulstrike, Shock, Stun, Shield, Tangle, Terrorchem, Stinger e Flay/Pain básico;
- Astartes, Resiliência dos Plague Marines, Markerlights, Synapse, Midnight Clad, Umbral/Shadow Save, Blooded básico e Communion/Neutron Charge dos Vespid;
- pontuação, empate, eliminação total e operativos Expendable.

## Assistido pelo jogador

Ploys e habilidades que exigem escolher dados individuais, colocar marcadores especiais, teletransportar, interromper a ativação adversária ou selecionar equipamentos antes da batalha aparecem como **GUIADO**. O jogo registra o gasto de CP e mostra a regra, mas não finge que tomou uma decisão que pertence ao jogador.

Essa distinção é intencional: uma regra só é anunciada como automática quando o motor realmente valida e aplica o efeito.
