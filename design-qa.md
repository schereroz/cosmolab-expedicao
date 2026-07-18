# Design QA — cabine da nave Aurora

## Evidências

- Referência fornecida: `/Users/felipescherer/Documents/New project/cosmolab/qa/cockpit-source.jpg`
- Implementação, início da rota: `/Users/felipescherer/Documents/New project/cosmolab/qa/cockpit-clear-start.png`
- Implementação, chegada assistida: `/Users/felipescherer/Documents/New project/cosmolab/qa/cockpit-assisted-arrival.png`
- Comparação lado a lado: `/Users/felipescherer/Documents/New project/cosmolab/qa/cockpit-comparison.jpg`
- Viewport: 2048 × 1159 px
- Estado validado: cabine interna, destino Marte, rota inicialmente manual e depois assistência automática até a zona de pouso.

## Comparação e achados

1. A referência mostrava o casco 3D da Aurora atravessando o para-brisa e cobrindo a área de navegação. Na implementação, o casco é ocultado exclusivamente na câmera interna; planetas, estrelas, mira e arte da cabine permanecem visíveis. Resolvido.
2. A rota manual não explicava o alinhamento nem oferecia uma forma clara de chegar. A implementação exibe alinhamento percentual, orientação contextual e o CTA **Iniciar rota assistida**. Resolvido.
3. A primeira validação revelou um toro de seleção que parecia um anel físico em Marte. O marcador foi removido; a mira da cabine e o painel de alinhamento passaram a cumprir essa função sem distorcer a aparência do planeta. Resolvido.
4. A rota assistida foi acionada no navegador e alcançou a zona segura em aproximadamente seis segundos, exibindo **Pousar em Marte**. Resolvido.
5. Cabeçalho, telemetria, tripulação, controles e CTA permanecem dentro do viewport. Nenhum bloqueio visual P0, P1 ou P2 foi encontrado na comparação final.

## Histórico

- Rodada 1: casco removido da câmera interna; assistência de navegação adicionada.
- Rodada 2: erro local de otimização da imagem da cabine eliminado com carregamento direto do asset.
- Rodada 3: marcador em forma de anel removido após comparação visual; nova captura confirmou Marte sem anel artificial.

## Resultado final

**passed**
