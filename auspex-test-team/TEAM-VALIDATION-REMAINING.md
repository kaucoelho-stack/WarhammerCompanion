# AoD e Kommandos — implementação não é validação integral

Conferido no código em 2026-10-15. TEAM-AUDIT, DATACARD-AUDIT e RULES-COVERAGE contêm notas históricas superadas em partes; não usar suas primeiras listas de pendências como inventário atual sem checar o código.

Decisão atual do usuário: AoD e Kommandos disponíveis normalmente; outros times bloqueados. Sem modo de testes. Disponibilidade não é certificação. Ver UPDATE-2026-10-15.md e validation-report.json: baseline dos 20 operativos, 90 testes e 12 partidas headless concluídos nesta bateria.

## Já existe

Lote de 2026-10-15: defesa humana agora escolhe quais ataques cancelar (incluindo dois normais por um crítico); defensor escolhe seu perfil de retaliação quando há mais de um. A IA mantém a escolha automática. Corrigida a composição Piercing/Piercing Crits para não reduzir Piercing maior nem reativá-lo quando ignorado. Testes novos em `test-combat-choices.cjs`. Isso fecha essas duas escolhas antes automáticas, não a sequência inteira de combate.

`auspex-rules.js` mapeia os oito ploys de AoD e os oito de Kommandos a handlers. Há Chapter Tactics, custos compartilhados de Heroic Leader, Iron Halo, equipamentos de facção e ações especiais dos Kommandos. Não é correto dizer que falta implementar todos esses ploys/habilidades. Testes dedicados existem e foram executados nesta rodada para capítulos, ploys por fase/evento, Heroic Doctrine, Iron Halo, ações especiais Kommandos e equipamento/núcleo.

## AoD: o que falta validar

- Matriz completa de loadouts/perfis e interações de Chapter Tactics, doutrinas, Heroic Leader, Iron Halo, equipamentos, Counteract e segundo Shoot/Fight. Testes pontuais existentes não equivalem a todas as combinações e janelas.
- Decisões/uso dessas ferramentas pela IA, cancelamentos, callbacks e escolhas humanas em partidas completas.
- Regressões dessas habilidades através de janelas/brechas e regras de fortificação do Volkus depois que essas regras forem integradas ao motor.

## Kommandos: o que falta validar

- Breach, Hook, Dakka Dash, Concealed Position, Get It Dun!, fumaça/atordoamento, Slasha e fila Boom em combinação com terreno/fortificação, não apenas casos isolados do Pátio.
- Reservas, Limited/Expendable, custo de escolhas Grot/Squig e kill grade, interações de Blast/Torrent e incapacitação. Parte já tem testes; falta fechar a matriz cruzada.
- IA usando habilidades, caminhos por aberturas e evitando softlocks em partidas completas do cenário.

## Bloqueadores compartilhados

- Ordem de repetições, timing de dano e modificadores: sequência completa do núcleo ainda requer auditoria, conforme RULES-COVERAGE. Alocação de defesa e escolha de retaliação já têm interface e regressões, mas ainda precisam de QA em partida.
- Equipamentos universais ainda não cobertos, posicionamento pré-batalha e ações respectivas.
- Geometria por bases e cobertura/Obscured/Charge, pois a simulação usa grade aproximada.
- Testes de jogo completos, vitória/empate/TP4 e QA real em navegador/celular. Não chamar testes de funções de partidas completas.

As duas equipes estão disponíveis normalmente por decisão do usuário. A validação integral para Volkus ainda depende das pendências do cenário em VOLKUS-VALIDATION.md. Não é uma certificação oficial nem alegação de fidelidade física de 100%.
