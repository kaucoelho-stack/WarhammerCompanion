# Auditoria de datacards — parcial

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
