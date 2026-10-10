# Pacote para revisão — 2026-10-09

Revisar a pasta completa, não somente index.html. Laboratório preservado; auditoria dos demais times deixada para depois por orientação do usuário. AoD e Kommandos são prioridade.

## Sprites

22 imagens externalizadas: 56.076.902 bytes antes, 36.936.156 bytes depois (-34,1%). Compressão WebP lossless com comparação de tamanho e bytes RGBA após decodificação. Originais PNG e base64 mantidos na fonte; publicação usa os arquivos menores via metadados *-optimized.js. assets/pixel/compression-report.json contém antes/depois por arquivo. A compressão não reduz dimensões nem memória decodificada, somente transferência/armazenamento.

## Celular

Barra lateral recolhível, lista inferior sem foco em uma linha rolável, ferramentas em uma linha e mapa com touch-action:none. Cancelamento/perda da captura limpa os ponteiros, evitando estado de arraste preso. Teste Canvas cobre pinça sem escolha acidental de destino e cancelamento; teste funcional cobre abrir/fechar barra. NÃO substitui screenshots em 390x844 ou testes de gestos em aparelho real; inspeção do navegador bloqueada neste ambiente.

## IA / AP

IA tenta Reposition e Dash legais e só se move quando melhora a avaliação tática. Segundo tiro com AP restante e limite de equipe é coberto por teste. Não há nova medição de percentual de AP ocioso, vitória ou balanceamento; partida IA x IA completa ficou com Claude por orientação do usuário. Nem sempre gastar todo AP é útil/legal.

## Pedido de review

1. Partidas completas AoD x Kommandos em ambos os lados: erros, travamentos, AP restante com/sem ação útil, segundo tiro.
2. Capturas 390x844 e 1280x800: mapa, ferramentas, barra recolhível, painel inferior e rotação.
3. Pinça, arraste, cancelamento de toque e zoom da página fora do canvas.
4. Primeira carga e cache; simular falha de metadados e imagem, timeout e retry.
5. Verificar requisições *-optimized.js/WebP e ausência de JS base64 no carregamento inicial.

Regras ainda parciais: não considerar todos os times validados. Ver AUDIT-PROGRESS.md, DATACARD-AUDIT.md e RULES-BASELINE.md.

## Atualização mobile — 2026-10-10

Regras AoD adicionadas no mesmo candidato: Combat Doctrine na estratégia com escolha e escopo por alcance (6″ inclusive para Tactical) e melee, Doctrine Warfare por doutrina uma vez por batalha, Ajustar Doutrina durante a ativação, custo de CP e opção gratuita de Heroic Leader do Captain uma vez por TP quando elegível. Revisar cancelamento sem gasto, atualização do bônus para toda a equipe, e ausência de repetição no TP. Não inferir Heroic Leader completo: uso de Combat Doctrine ao ativar e demais firefight gratuitos ainda pendentes. IA não automatiza Ajustar Doutrina. Ver DATACARD-AUDIT.md; testes novos test-combat-doctrine.cjs e test-adjust-doctrine.cjs.

Até 900px, HUD dedicado com resumo TP/VP/CP, retratos circulares, painel expansível, confirmação de movimento de 56px e overlays de combate no rodapé. Toque duplo enquadra o mapa fora da confirmação; pinça permite zoom e rotação discreta; deslocamento de até 8px não move a câmera. Resolver avisos/resultados da IA automaticamente é opt-in no menu do celular; não pula Command Re-roll nem escolhas humanas da luta.

Paisagem usa grid real com equipe de 64px à esquerda, tabuleiro central e comandos de 168px à direita. Topo mantém 44px por acessibilidade, em vez dos 36px do wireframe. Laterais rolam quando necessário; em altura até 320px as ferramentas ficam em uma linha e Ver mapa continua no menu. Retrato apenas sugere girar o aparelho, sem bloquear o jogo. Acima de 900px o redesenho não se aplica.

Pedir screenshots 390x844 e 844x390 (início de firefight, seleção, movimento e combate), teste real de orientação com barras do navegador/safe-area, acesso ao botão Terminar no painel lateral e uma partida completa com automático desligado e ligado. Os 40 testes locais e o Canvas nativo não confirmam layout de navegador, três toques por ação nem uma partida IA x IA completa. Host precisa ser testado junto com iframe; laboratório permanece intacto.
