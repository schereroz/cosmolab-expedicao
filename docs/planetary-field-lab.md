# Spec: Laboratório Planetário Interativo

## Objetivo

Transformar a análise após o pouso em uma experiência jogável para estudantes de 9–15 anos. O jogador entra em um terreno planetário, seleciona um objeto, escolhe uma substância virtual, prevê o resultado e compara leituras antes/depois sem confundir aproximações com fatos observados.

## Stack e comandos

- React 19 + TypeScript + vinext; gráficos desenhados em Canvas 2D para manter desempenho em tablet e celular.
- Validar com `npm run lint`, `npm run build` e `node --test tests/rendered-html.test.mjs`.

## Estrutura

- `app/lib/planetaryLab.ts`: catálogo e motor determinístico de interações.
- `app/components/PlanetaryFieldLab.tsx`: terreno, objetos, substâncias, hipótese, gráficos e descobertas.
- `app/components/PlanetSurvey.tsx`: alternância entre painel científico e laboratório de campo.
- `app/globals.css`: visual imersivo, animações e responsividade.

## Estilo de código

```ts
const result = simulatePlanetaryInteraction({ planetId, targetId, substanceId });
// O mesmo estado inicial sempre produz o mesmo resultado e nível de evidência.
```

## Estratégia de testes

- Testes unitários para resultados, evidência e limites científicos.
- Teste de integração textual para garantir que o laboratório esteja acessível no fluxo de pouso.
- Verificação no navegador em Marte, Júpiter e Kepler-186f.

## Limites

- Sempre: rotular dados observados, modelos e hipóteses; manter experiências perigosas apenas virtuais; explicar ausência de reação.
- Perguntar antes: novas dependências, persistência adicional ou mudanças de conta.
- Nunca: apresentar a superfície de Júpiter ou de Kepler-186f como observada; fornecer instruções reproduzíveis para experiências perigosas.

## Critérios de sucesso

- Alternância clara entre “Painel científico” e “Laboratório de campo”.
- Quatro ambientes, três alvos por ambiente e pelo menos cinco substâncias virtuais.
- Previsão antes do teste, animação de aplicação, comparação antes/depois, gráfico temporal e nível de evidência.
- Júpiter usa sonda atmosférica; Kepler-186f permanece marcado como Modo Hipótese.
- Funciona por teclado, toque e em telas de 320 px.

