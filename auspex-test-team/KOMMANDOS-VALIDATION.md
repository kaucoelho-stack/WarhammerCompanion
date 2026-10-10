# Kommandos — implementação no Pátio de Ferro

Fonte consultada em 2026-10-10: https://assets.warhammer-community.com/eng_17-06_kill_team_team_rules_kommandos_online_rules-ova8v1kjds-ds3ouz4k04.pdf (inclui commentary June 2026). Granada de fumaça/atordoante: https://assets.warhammer-community.com/eng_17-06_kill_team_key_downloads_universal_equipment-prsd0j8pih-ikfmigl0za.pdf.

## Operativos

| Operativo | Efeito conectado ao jogo |
|---|---|
| Boss Nob | Dois Fight; Get It Dun! com seleção de aliado, distância/visibilidade, exclusão de Squig e duração do suporte |
| Boy | Uma Smoke e uma Stun por equipe/TP; reservas separadas do equipamento; teste de stun inclui amigos próximos |
| Bomb Squig | Explosives escolhe ele próprio como alvo principal, sem cover/Obscured; Blast em ambos os lados; Limited; Boom com 1 ou 2 dados após incapacitação; ordens/Stoopid/Expendable |
| Breacha | Breach por 1 AP; durante Charge/Reposition por 0 AP, distância restante preservada; Accessible nas paredes finas, sem abrir linha de visão; cancelamento completo |
| Burna | Perfis Standard/Deluge, alcance, Saturate/Seek e Torrent 0 |
| Comms | Listen In; desconto na ação de missão da missão atual, uma vez por ativação |
| Dakka | Dakka Dash em ambas as ordens por 1 AP; somente Dakka Shoota; ações gratuitas contam para limites |
| Grot | Conceal obrigatório, precedência de Sneaky Zogger; Hook com seleção de terreno visível e restrições de Reposition |
| Rokkit | Perfis Aimed/Mobile, alcance, Blast, Ceaseless e Heavy |
| Slasha | D3 opcional após Fight/retaliação, somente se sobrevivente |
| Snipa | Concealed Position somente no primeiro Shoot da batalha; perfis e restrições Heavy/Torrent |

Os quatro equipamentos de facção e os oito ploys têm handlers. Isso não é certificado de equivalência integral: sequência de gambits/repetições, alocação de defesa e algumas interações de núcleo seguem listadas em RULES-COVERAGE.md. As opções universais de equipamento ainda não estão todas disponíveis.

## Verificação

49 arquivos de testes locais passaram. `test-kommando-special-actions.cjs` verifica AP, reservas, cancelamento, Grot sem ranged, ambos os sentidos da ordem de Dakka Dash, Blast e fila Boom, travessia de Breach em parede real do Pátio e distância restante. Teste Canvas também passou. Esses resultados não equivalem a partidas completas nem a QA visual em navegador/celular.

Seleção de pontos de Hook/Smoke usa coordenadas do tabuleiro. Medidas, bases e cobertura seguem a aproximação geométrica existente; não declarar fidelidade física de 100%. Não há suporte a Door Fight/Hatchway Fight ou killzones não disponíveis no app.

Laboratório preservado. Publicação/cópia para checkout Git não executada nesta rodada.
