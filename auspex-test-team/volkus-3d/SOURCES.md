# AUSPEX — pacote 3D de Volkus

Todos os assets abaixo foram baixados do Poly Haven sob licença CC0. Eles podem ser usados, modificados e redistribuídos com o jogo. Atribuição não é obrigatória, mas estes créditos são mantidos por transparência.

## Céu e iluminação

- **Abandoned Hopper Terminal 03**, HDRI 2K (`.hdr`)
- Uso: iluminação ambiente PBR, combinada com céu de guerra, neblina, lua e partículas estilizadas.
- Fonte: https://polyhaven.com/a/abandoned_hopper_terminal_03

## Materiais do terreno

- **Asphalt 02**, PBR 1K: diffuse, normal OpenGL e ARM.
- Uso: piso principal das ruas.
- Fonte: https://polyhaven.com/a/asphalt_02

- **Gravel Stones**, PBR 1K: diffuse, normal OpenGL e ARM.
- Uso: manchas de entulho e áreas de cascalho.
- Fonte: https://polyhaven.com/a/gravel_stones

## Estruturas e props

- **Modular Factory Facade**, glTF 1K.
- Uso: fachadas industriais aplicadas aos volumes que representam terreno pesado/Vantage.
- Fonte: https://polyhaven.com/a/modular_factory_facade

- **Concrete Road Barrier**, glTF 1K.
- Uso: acabamento 3D das coberturas leves, sem alterar sua área de regras.
- Fonte: https://polyhaven.com/a/concrete_road_barrier

- **Ladder Sectioned 01**, glTF 1K.
- Uso: detalhe industrial nas escadas físicas que dão acesso aos níveis de Vantage.
- Fonte: https://polyhaven.com/a/ladder_sectioned_01

- **Old Tyre**, glTF 1K.
- Uso: prop repetível nas ruas destruídas.

## Renderer

- **Three.js r128**, build clássico + GLTFLoader + RGBELoader, mantido localmente em `../vendor/three-r128/` para compatibilidade com abertura direta por `file://`.
- Licença MIT: https://github.com/mrdoob/three.js/blob/r128/LICENSE
- Fonte: https://polyhaven.com/a/old_tyre

## Licença

- Poly Haven — CC0: https://polyhaven.com/license
- Resoluções selecionadas: 1K para materiais/modelos e 2K para o HDRI.
- Data da curadoria e download: 2026-08-30.

## Observação técnica

O renderer WebGL está em `volkus-webgl.js`. Os assets-fonte permanecem intactos; uma etapa futura poderá convertê-los para GLB/Draco e KTX2 para reduzir memória e tempo de carregamento.
