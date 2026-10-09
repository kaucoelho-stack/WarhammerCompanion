# Auditoria solicitada — andamento

Laboratório preservado em ../checkpoints/stance-lab-20261009-080432/.
Lista original: REVIEW-CLAUDE-2026-10-09.txt. Nenhum item pendente implica regra validada.

| Item | Situação |
|---|---|
| 1 — ação de objetivo | Parcial: transmissão pontua, testada; campo Tac Ops ainda precisa de revisão |
| 2 — CP e ploys | Parcial: Command Re-roll no ataque/defesa antes da resolução, incluindo ataques secundários, uso pela IA e teste de CP; ploys de equipe pendentes |
| 3 — objetivo central | Coordenadas corrigidas para 14.5,10.5; distância simétrica testada; inspeção visual pendente |
| 4 — dados dos times | Pendente: tabela com fontes por edição e operativo |
| 5 — IA em ambos os lados | Parcial: posicionamento, inimigos e recuperação parametrizados; modo espectador e partida completa pendentes |
| 6 — papéis e ações da IA | Parcial: carga, AP para luta, posição de tiro e seleção arma/alvo; Markerlight implementado para os três perfis cadastrados e considerado pela IA. Bônus, custo e propriedade das marcas testados. Partida completa pendente |
| 7 — carregamento dos sprites | Pendente |
| 8 — tamanho do pacote | Pendente |
| 9 — retratos ausentes | Cache de falhas compartilhado na seleção, painel e barra lateral; fallback na barra e teste de 100 consultas sem reutilizar URL ausente |
| 10 — leitura do canvas | Contexto de extração dos sprites usa willReadFrequently; verificação em navegador pendente |
| 11–15 — interface móvel | Ajustes implementados: placar abreviado sem largura mínima por coluna, nomes com quebra, ferramentas em linha com rolagem horizontal, barra de operativos abaixo das ferramentas, painel inferior limitado a 32dvh, dica do mapa oculta no celular e título com recorte à direita. Testes funcionais passaram; inspeção visual em 390×844 pendente porque navegador bloqueia file:// |
| 16 — enquadramento inicial | TP1 recentraliza e restaura visão geral após posicionamento; renderização Canvas conferida, página completa pendente |
| 18 — painel sobre esquadrão | Desktop reserva 310px à direita do mapa para o painel; conferência da página completa pendente |
| 19 — rótulos aglomerados | Detecta proximidade na tela e mostra rótulos aglomerados só em seleção, alvo, hover ou movimento; renderização Canvas testada |
| 20 — arma principal no recrutamento | Prioriza arma de tiro que não seja pistola; conferência visual pendente |
| 17 — girar câmera | Recentraliza no operativo selecionado ou no centro do mapa, preservando o zoom; inspeção visual pendente |
| Partida completa e capturas | Pendente: testes reais de navegador nas duas resoluções |

Missão aprovada: Hivestorm / Transmission adaptada ao Pátio de Ferro. Efeitos ambientais ainda pendentes; ver RULES-BASELINE.md.
