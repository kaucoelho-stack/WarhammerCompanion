# Auditoria de equipes — parcial

Esta revisão compara as 15 equipes importadas com `killteam_data.js`. Não certifica equivalência integral às regras oficiais: o cadastro é parcial e o motor ainda interpreta alguns efeitos por texto.

## Corrigido
- Wolf Scouts: exatamente um Fenrisian Wolf obrigatório; cinco scouts; Pack Leader opcional; até cinco Hunters. Fonte: imagem enviada pelo usuário e composição publicada pela Warhammer Community.
- Importação não fabrica armas de tiro ou melee ausentes da ficha.
- Líderes identificados explicitamente, não pela posição na lista.
- Rejeição de quantidades negativas, fracionárias, infinitas, excedentes e ausência de obrigatório.
- Fenrisian Wolf pode carregar em Conceal, não recebe arma de tiro e não executa a ação de missão do simulador.
- Exceção de Bomb Squig à carga em Conceal da equipe.
- Cargas autorizadas em Conceal preservam a ordem ao concluir o movimento.
- Angels of Death: limite compartilhado de um Heavy Intercessor Gunner ou Eliminator.
- Kommandos: Grot e Bomb Squig custam meia escolha cada; tamanho físico e escolhas são exibidos separadamente.
- Ploys usam as fichas do app, sem efeitos adivinhados pelo texto. Os ainda não implementados ficam somente para consulta, não ativam nem consomem CP. Isso limita a jogabilidade e não equivale a implementar essas regras.
- Perfis com lista vazia de características não herdam características do perfil pai; alcances numéricos são preservados.

## Checagem automatizada das 15 equipes
Angels of Death (9 tipos), Plague Marines (7), Kommandos (11), Pathfinders (3), Intercession (3), Tyranid Warriors (2), Wolf Scouts (8), Krieg (4), Legionaries (2), Nemesis Claw (8), Deathwatch (11), Blooded (13), Mandrakes (6), Vespid (7), Hand of the Archon (9).

Para cada equipe: formação padrão válida segundo as restrições cadastradas, quantidade máxima por ficha, entradas inválidas e preservação do número de armas/perfis. Esses testes não demonstram que o cadastro está completo ou atualizado.

## Bloqueadores da validação integral
1. Catálogos resumidos, especialmente Legionaries, Krieg, Pathfinders, Intercession e Tyranid Warriors; conferir edição, composição oficial, substituições e alternativas de equipamento.
2. Limites de grupos e substituições precisam de auditoria por equipe; o grupo Heavy/Eliminator já é modelado.
3. Ploys estão somente para consulta; habilidades ainda interpretadas por palavras-chave não comprovam condições, alcance, momento, alvos, frequência nem exclusões.
4. Tempestade Elemental, Pounce e outras ações especiais precisam de implementação e testes específicos, não apenas descrição.
5. Cobertura anterior do documento RULES-COVERAGE é uma lista de recursos gerais, não uma certificação por equipe.

Não publicar ou apresentar todas as equipes como integralmente validadas com base nesta revisão.
