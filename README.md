# CosmoLab — Ciência em Expedição

Jogo científico de exploração espacial para estudantes de 9 a 15 anos. O CosmoLab combina química, física, biologia, astronomia e tecnologia em missões, experimentos e simulações interativas.

## Acesse o jogo

[Abrir o CosmoLab](https://cosmolab-expedicao.clear-mole-7987.chatgpt.site/)

O site é público e pode ser acessado sem conta do ChatGPT.

## Experiências disponíveis

- Cabine 3D com animais exploradores, pilotagem manual e rota assistida.
- Laboratório da Matéria com os 118 elementos da tabela periódica.
- Missões de química, física, biologia, astronomia e tecnologia.
- Sandbox Cósmico com órbitas, colisões e objetos hipotéticos.
- Pousos e análises físico-químicas de planetas e luas.
- Arquivo UAP baseado em evidências, hipóteses testáveis e dados insuficientes.
- Perfis Explorador e Pesquisador com diferentes níveis de profundidade.

Conteúdos especulativos são identificados como hipótese ou ficção. Simulações educativas apresentam suas aproximações e limitações.

## Tecnologias

- TypeScript, React e Next.js
- Three.js para cenas e simulações 3D
- Vinext e Cloudflare Workers
- D1 e Drizzle para persistência
- Node.js 22 ou mais recente

## Executar localmente

```bash
npm install
npm run dev
```

O servidor informa o endereço local disponível no terminal.

## Verificação

```bash
npm run lint
npm run build
node --test tests/rendered-html.test.mjs
```

## Estrutura principal

- `app/components/`: experiências, laboratórios e interfaces do jogo.
- `app/data.ts`: missões, personagens, planetas e conteúdo científico inicial.
- `app/lib/science.ts`: modelos e cálculos científicos.
- `db/` e `drizzle/`: esquema e migrações de persistência.
- `public/`: imagens e materiais visuais.
- `tests/`: verificações automatizadas das experiências principais.

## Privacidade infantil

O piloto não inclui anúncios, chat público, geolocalização ou rastreamento de terceiros. Perfis infantis utilizam apelido, faixa pedagógica e avatar.
