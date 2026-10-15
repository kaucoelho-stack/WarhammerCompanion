# Volkus — validação em andamento, não certificado

Prioridade do usuário em 2026-10-15: pausar arte e expansão de equipes; terminar e validar o Bastião. Equipes sem validação integral indisponíveis. Com autorização explícita, AoD/Kommandos acessíveis somente ao ativar MODO DE TESTES na seleção. Padrão de lançamento: nenhum time certificado. Dossiês preservados. IA respeita a mesma disponibilidade; confirmação de roster bloqueada se o modo for desativado.

Fonte consultada: https://assets.warhammer-community.com/eng_kt_volkus_compound_mission_pack-oai8j5hmhd-a6ugpgdgkj.pdf (14 páginas). O cenário atual é adaptação em grade, não reprodução exata de um diagrama oficial. Não retirar EXPERIMENTAL.

## Primeiro lote

- Pág. 3, Fortified Position: visibilidade por cima de bunker/paliçada depende de pelo menos uma base estar 2 polegadas acima da base do terreno, não ambas. Corrigido no módulo geométrico `compound-map.js`; testes de reciprocidade e limite 1.99/2. Este módulo ainda NÃO está ligado integralmente à geometria de tiro do motor principal; a correção isolada não resolve a regra em partida.
- Testes existentes de missão, deploy e visibilidade mantidos. Não são partidas completas em navegador nem certificado oficial.

## Bloqueadores concretos

Atualização 2026-10-15: `physicalShotBlock` agora consulta o modelo de fortificação em cada raio de silhueta; mantém a geometria de fortes, lajes e muretas. Teste integrado cobre paliçada fechada, uma base alta e brecha aberta. Cobertura/Obscured e demais efeitos abaixo ainda exigem validação. Portas agora têm ação real de 1 AP, restrita ao chão/lado interno, sem fechamento, atualizando a colisão; a IA abre uma porta elegível durante sua ativação. Teste integrado cobre AP, travas, duplicação e impossibilidade de cancelar a ativação depois da alteração. Posicionamento tático da IA para procurar portas ainda não está concluído.

1. Conectar modelo de janelas/fortificação ao motor real de tiros/cobertura, sem substituir indevidamente cobertura/Obscured.
2. Fortified Position: imunidade a Piercing quando aplicável; lado permitido para Blast/Torrent/Devastating; defensor resolve primeiro através de janela; exceção da brecha aberta; escalada vertical tratada como 4 polegadas.
3. Ataque às paliçadas: alvo de Shoot/Fight, Hit base 2+, quatro dados de defesa/Save 4+ no tiro, limiares por instância (ignorar <=3 tiro, <=5 melee), 8 Wounds e abertura permanente. Integrar humano e IA, custo/AP, repetição e cancelamento.
4. Porta integrada neste lote; falta QA visual e de rota humana/IA em partida completa, incluindo aproximação e travessia.
5. Guard em bunker conforme Gallowdark: requer a regra de núcleo correspondente; o PDF do pack apenas a referencia. Lacunas em pequenos espaços devem bloquear conforme o PDF.
6. Layout oficial escolhido, alturas, zonas e bases totalmente dentro do deploy. Defensor coloca até seis fire steps; papel e escolha do mapa ainda simplificados.
7. Revalidar começo/fim da batalha, exceções Expendable no kill grade, combate, IA atravessando aberturas e condições de vitória no quarto TP.
8. Partidas completas e inspeção real no navegador/celular; regressões de softlock e interações das duas equipes. Resolver bloqueios de núcleo listados em RULES-COVERAGE antes de alegar fidelidade integral.

## Critério de liberação

Cada regra com fonte, execução humana/IA e regressão; testes de integração no cenário real; matriz de partidas/resultado; verificação visual/uso real. Manter limites de aproximação em grade explícitos. Não considerar todas as regras prontas apenas porque os testes atuais passam.
