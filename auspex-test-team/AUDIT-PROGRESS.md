# Auditoria solicitada — andamento

Laboratório preservado em ../checkpoints/stance-lab-20261009-080432/.
Lista original: REVIEW-CLAUDE-2026-10-09.txt. Nenhum item pendente implica regra validada.

| Item | Situação |
|---|---|
| 1 — ação de objetivo | Transmissão pontua e está testada. Tac Ops continuam não implementadas: placar usa travessão com explicação e resultado final informa a indisponibilidade, em vez de apresentar um zero enganoso. Teste test-score-availability.cjs passou |
| 2 — CP e ploys | Parcial: Command Re-roll no ataque/defesa antes da resolução, incluindo ataques secundários, uso pela IA e teste de CP; ploys de equipe pendentes |
| 3 — objetivo central | Coordenadas corrigidas para 14.5,10.5; distância simétrica testada; inspeção visual pendente |
| 4 — dados dos times | Pendente: tabela com fontes por edição e operativo |
| 5 — IA em ambos os lados | Parcial: posicionamento, inimigos e recuperação parametrizados; modo espectador e partida completa pendentes |
| 6 — papéis e ações da IA | Parcial: carga, AP para luta, posição de tiro e seleção arma/alvo; Markerlight implementado para os três perfis cadastrados e considerado pela IA. Bônus, custo e propriedade das marcas testados. Partida completa pendente |
| 7 — carregamento dos sprites | PNGs externalizados preservando bytes e metadados; carregamento por time na entrada do posicionamento, com cache. Teste de equivalência/carregamento passou; medição real de título abaixo de 2s pendente |
| 8 — tamanho do pacote | PNGs externos e 82 retratos WebP de até 640px; retratos passaram de 214.6MB para 6.6MB (97% menos), originais preservados. Pacote 111.3MB ante 343MB. Título antigo e primeira arte do laboratório excluídos da publicação; ruins/metropole e JS base64 não são empacotados. Laboratório atual preservado. Seleção/fallback/publicação testados |
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

Modo espectador e simulação autônoma completa ficam com o Claude, conforme orientação do usuário. Isso não resolve por si só as pendências de dados, ploys ou inspeção visual.

Command Re-roll da IA: reserva 1 CP nos TP1–3 e limita a uma repetição paga por conjunto de dados; no TP4 permite gastar a reserva. Testes cobrem reserva, limite e último turno. Ploys de equipe continuam pendentes.

Datacard Raveners fornecida pelo usuário: https://assets.warhammer-community.com/eng_raveners_online_rules-8vfeyxgbks-nf6lxfcbfw.pdf . Não corresponde ao cadastro atual Tyranid Warriors (Warrior Prime/Warrior). Não houve substituição ou alteração de atributos com base nesse PDF; Raveners exigem cadastro próprio e mecânicas de Tunnel/Burrow/Poison.

Por solicitação explícita do usuário, Tyranid Warriors foi retirado do registro de times jogáveis e da escolha aleatória da IA. O cadastro antigo permanece somente no arquivo-fonte para rastreabilidade, mas importTeams o ignora e remove qualquer entrada tyr previamente registrada. Teste test-retired-teams.cjs passou, assim como recuperação da IA e combate. Raveners não foi adicionado automaticamente. A imagem do usuário não constitui auditoria integral dos demais times.

Nova revisão Claude lida em 2026-10-09: attachment 2bfb875b-62bf-4fc0-a861-29c2226e50b2. Além das pendências já registradas, aponta falha de carregamento sem mensagem/retry, possível troca de time sem nova carga, peso dos PNGs e barra lateral móvel recolhível. Objetivo central e fixture de recuperação citados no relatório já estão corrigidos na fonte local; não reverter esses ajustes.

Carregamento (itens 10–11 da nova revisão): startDeploy agora bloqueia a entrada no posicionamento se os scripts de artes falharem, preserva a formação e mostra modal com TENTAR DE NOVO. Cargas concorrentes bloqueadas; chave dos dois times substitui a flag assetsReady, permitindo carregar novas equipes sem recarregar a página. Testes de falha/retry/troca de time e remoção de falha do cache passaram. Limitação: o carregador ainda confirma os scripts de metadados, não a decodificação de cada PNG; falhas individuais de imagens e verificação visual no navegador continuam pendentes.

Atualização: o carregador agora também aguarda carga e decodificação dos PNGs apontados pelos metadados dos times selecionados. Falha de imagem aciona o mesmo modal de retry; imagem com falha sai do cache, scripts bem-sucedidos são reutilizados. test-sprite-image-recovery.cjs cobre falha individual, retry, decodificação e cache. Isso substitui a limitação anterior de confirmar somente metadados; inspeção real de navegador permanece pendente.

Celular (item 8 da nova revisão): barra de operativos começa recolhida em até 600px, com botão EQUIPES de 44px para abrir/fechar; preferência preservada nas renderizações. Lista inferior sem operativo focado passa a uma linha com rolagem horizontal. Desktop mantém a barra anterior. Testes de toggle, seleção, recuperação e combate passaram; verificação visual em aparelho/navegador continua pendente.

AP restante da IA: movimento agora tenta Reposition e depois Dash quando legais, sem encerrar apenas porque a primeira opção não tem destino. Limpa destinos antigos e exige G.mode correto; só executa destino com melhora na avaliação tática em relação à posição atual. Respeita incompatibilidade com Charge/Fall Back. Testes de opções legais, papéis, recuperação e combate passaram. Não há medição nova de partidas completas; redução de AP ocioso ainda precisa ser quantificada pelo review externo.

Datacards: iniciada tabela DATACARD-AUDIT.md. Corrigidos Move/APL/Save/Wounds dos três perfis Pathfinders existentes com base no PDF salvo (errata July '25; não confirmado como atualização mais recente). Testes dos atributos importados, Markerlight, recuperação e combate passaram. Armas, composição, habilidades e demais times continuam pendentes; não há validação integral.

Carregamento: adicionada expiração de 30 segundos para scripts e imagens, incluindo decodificação, evitando espera infinita. Falhas/expiração retiradas do cache para retry; retornos tardios não alteram a Promise já encerrada. Teste de timeout simulado/retry e testes de sprites, recuperação e combate passaram. Solicitado PDF atualizado de Pathfinders ao usuário para continuar auditoria de regras sem assumir atualidade da baseline antiga.

Prioridades alteradas pelo usuário: demais times por último; foco em AoD e Kommandos. Compressão lossless de 22 sprites reduz bytes de 56.1MB para 36.9MB com RGBA idêntico; publicação usa metadados optimized e arquivos menores, originais preservados. Testes Canvas de pinça/cancelamento e teste de segundo tiro com AP restante passaram. Handoff REVIEW-HANDOFF.md contém limites e verificações externas necessárias; não há nova conferência visual de navegador ou métrica de AP em partidas completas.
