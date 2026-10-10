# Auditoria de datacards — parcial

## Angels of Death e Kommandos: fontes enviadas pelo usuário

AoD: https://assets.warhammer-community.com/eng_26-08_killteam_angels_of_death_online_rules-1rwlnicmkz-qjtykwlybg.pdf (14 páginas; errata August '26).

Kommandos: https://assets.warhammer-community.com/eng_17-06_kill_team_team_rules_kommandos_online_rules-ova8v1kjds-ds3ouz4k04.pdf (13 páginas; commentary June '26).

Consultados via extração web em 2026-10-09. Primeiras correções confirmadas:

| Item | Antes | Correção | Referência |
|---|---|---|---|
| AoD Heavy / Eliminator | Máximo combinado 1 | Permitir ambos, mantendo limites individuais / 6 escolhas | AoD p.4 e p.10, remoção explícita na errata |
| Alcance de pistolas AoD / Slugga / Shokka | short sem Range importado | Range 8 | AoD p.1–3 / Kom p.1–2 |
| Burna deluge / throwing knives | Sem Range importado | Range 4 / Range 6 | Kom p.2–3 |
| Boss Nob | Máximo 1 Fight | 2 Fight na ativação, sem aplicar a counteraction | Kom p.1, Krumpin' Time |
| WAAAGH! | Somente consulta | 1 CP; Balanced melee durante o TP | Kom p.5 |
| DAKKA! DAKKA! DAKKA! | Somente consulta / gancho antigo incompatível | 1 CP; Punishing ranged durante o TP | Kom p.4 |
| Skulk About | Somente consulta | 1 CP; retém um dado normal em Conceal, além da cobertura se houver | Kom p.5 |
| Eles Não Temem | Somente consulta | 1 CP; ignora penalidades de ferimento em Hit e Move | AoD p.6 |

Bug universal encontrado: rangeOf lia `Range 9` com parseFloat na string inteira, resultando em fallback 99. Corrigido para ler a parte numérica. Punishing passa a funcionar no ataque e após Command Re-roll; não confundir com o gancho antigo Mais Dakka/Ceaseless, que não foi reativado.

Atualização 2026-10-09: loadouts implementados na montagem por cópia selecionada. Assault Sergeant: 9 combinações legais (plasma apenas com chainsword); Intercessor Sergeant: 15; Intercessor Warrior/Gunner: 3 rifles com todos os perfis do rifle escolhido e armas fixas; Boss Nob: escolha de uma arma melee. Catálogo de referência completo preservado, mas roster de batalha filtrado; índices inválidos rejeitados. IA usa loadout padrão legal. Astartes agora permite repetir Shoot OU Fight, exige bolter em pelo menos um dos dois tiros e cobra 2 AP pelo segundo tiro quando ambos usam heavy bolter ou bolt sniper rifle, mesmo trocando o perfil. Custos exibidos na escolha de arma e confirmação; guarda aplicada também à seleção de tiro pela IA. Counteract limpa os contadores de sua ativação anterior e limita a uma ação. Parsing de Limited N corrigido. Texto Heroic Leader corrigido: Combat Doctrine paga CP normalmente, não é gratuito.

Limitações restantes: Chapter Tactics, habilidades específicas, equipamentos e demais ploys ainda precisam de implementação/auditoria. Nenhum dos dois times está integralmente validado. Kommandos mantém DF/GA legados no cadastro; esses campos precisam de revisão contra as regras de núcleo atuais. Stats básicos AoD/Kom consultados, mas a tabela completa por perfil ainda não foi concluída. Testes automatizados não substituem conferência visual da nova seleção de armas no navegador.

## Pathfinders: atributos básicos

Fonte: https://assets.warhammer-community.com/eng_29-10_kt_teamrules_pathfinders-gf6lgyt6w3-t70izsfkmt.pdf

Cópia local: ../tmp/mission-review/pathfinders-oct.pdf, consultada em 2026-10-09. O documento contém errata July '25; a consulta direta ao PDF falhou pelo tamanho. Não foi confirmada equivalência com a atualização de 26/08/2026 mostrada na imagem do usuário. Esta é a baseline documental usada, não uma declaração de validação completa ou de versão mais recente.

| Operativo | Campo | Antes | Baseline PDF | Página PDF |
|---|---|---|---|---|
| Shas'ui Pathfinder | Move | 3 | 6 | 1 |
| Shas'ui Pathfinder | APL / Save / Wounds | 2 / 5+ / 10 | 2 / 5+ / 8 | 1 |
| Shas'la Pathfinder (cadastro Pathfinder) | Move | 3 | 6 | 3 |
| Shas'la Pathfinder | APL / Save / Wounds | 2 / 5+ / 8 | 2 / 5+ / 7 | 3 |
| MB3 Recon Drone | Move | 4 | 6 | 4 |
| MB3 Recon Drone | APL / Save / Wounds | 2 / 5+ / 8 | 3 / 4+ / 12 | 4 |

Valores acima corrigidos em killteam_data.js e conferidos após importação pelo teste test-pathfinder-stats.cjs.

Pendências: armas dos três perfis divergem; composição registrada de 10 escolhas diverge da fonte (líder + 11 escolhas, Recon conta duas); catálogo incompleto; drone tem APL reduzido para controle e não pode executar ações de missão; Art of War e habilidades ainda não estão integralmente implementadas. Não confundir atualização dos atributos básicos com time validado.
