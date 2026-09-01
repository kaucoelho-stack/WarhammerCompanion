# Miniaturas por operativo

Coloque aqui imagens PNG com fundo transparente. O jogo procura automaticamente o arquivo usando:

`assets/miniatures/<teamId>/<unitId>.png`

Exemplo para o Capitão dos Angels of Death:

`assets/miniatures/aod/cap.png`

Recomendações:

- fundo totalmente transparente;
- personagem inteiro, incluindo base e pés;
- proporção vertical, de preferência 1024×1536 px;
- sem margens transparentes grandes;
- nome do arquivo exatamente igual ao `unitId`, em letras minúsculas;
- mantenha cada arquivo abaixo de 1 MB para preservar o desempenho no celular.

Não é necessário alterar o HTML. Ao encontrar uma imagem específica, o simulador a usa no card e na visão em primeira pessoa. Quando ela não existe, usa a arte geral do time ou a silhueta de segurança.

As pastas de todos os times já estão criadas. Dentro de cada uma, o arquivo
`nomes-dos-arquivos.txt` mostra os nomes exatos dos PNGs aceitos. O arquivo
`catalogo-de-ids.txt`, nesta pasta, reúne a lista completa.

Não crie imagens vazias como marcadores: basta copiar a arte final para a pasta
correta e renomeá-la conforme a lista. Atualize a página para o jogo carregá-la.
