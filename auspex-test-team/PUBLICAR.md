# Pátio de ferro — candidato para publicação

Pacote estático independente. O único mapa selecionável é o Pátio de ferro, de 30 × 22 casas, com três objetivos: um no corredor central e um dentro de cada ruína. Nenhum envio ao Git ou substituição do jogo publicado é feito pela preparação deste pacote.

## Testar

Abra `index.html` na pasta deste pacote. Para testar todas as nossas miniaturas, escolha Angels of Death nos dois lados, em partida local ou contra IA.

As quatro plataformas têm muretas baixas de 0,65″ nos cantos, sobre pisos de 2″. As muretas dão cobertura leve apenas quando interceptam a linha junto ao alvo. O meio das laterais fica aberto para escalada. Subir por uma dessas aberturas custa 2″ de altura + 1″ de deslocamento. Não é possível atravessar a mureta pelo canto: a rota usa a abertura. Recorte e transparência não mudam as regras.

Antes de substituir a versão estável, faça uma partida completa e confira:

- Subir e descer por uma abertura nas quatro vistas, confirmar e desfazer.
- Mirar num operativo atrás da mureta com Engage e Conceal; depois movê-lo para a abertura e testar novamente.
- Alternar as quatro vistas, observar HP, caminho, interiores e pés junto às muretas.
- Terminar ativações e uma partida contra IA; repetir um combate com golpe letal.
- Conferir câmera, rolagem e seleção de destinos em um celular real.

## Publicar depois da aprovação

Copie o conteúdo desta pasta para a pasta servida pelo site escolhido. `index.html` precisa permanecer ao lado de `battlefield.js`, `terrain-painter.js`, `modular-floor.png` e da pasta `assets`. Todos os caminhos necessários são relativos; não há servidor de aplicação, chave ou dependência de pasta pai. `.nojekyll` acompanha o pacote para hospedagem estática no GitHub Pages.

Não envie os laboratórios, o Véspera, testes ou pastas de trabalho. O pacote já contém somente os arquivos usados nesta versão e documentação. `release-manifest.json` registra os arquivos e seus hashes para conferência.

## Escopo da validação

Regressões automáticas locais cobrem inicialização com rosters reais, deploy, ativação, AP/desfazer, subida/descida, colisão, cobertura, Conceal/Engage/Seek Light, morte no combate, recuperação da IA, carregamento das artes e quatro vistas. As imagens de revisão são renderizadas com Canvas local, não capturas de uma partida no navegador. Uma partida completa manual e aparelhos reais ainda precisam do teste acima.

Nem todas as habilidades de Kill Team são automáticas: veja `RULES-COVERAGE.md`. Equipes sem sprites específicos usam substitutos; ainda não há poses exclusivas de salto/escalada. Não é uma implementação oficial nem uma validação competitiva do cenário.
