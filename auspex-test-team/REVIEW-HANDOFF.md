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
