import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("builds the complete CosmoLab game shell", async () => {
  const assetsRoot = new URL("../dist/client/assets/", import.meta.url);
  const files = await readdir(assetsRoot);
  const gameBundle = files.find((file) => file.startsWith("CosmoApp-") && file.endsWith(".js"));
  assert.ok(gameBundle, "CosmoApp client bundle should exist");
  const bundle = await readFile(new URL(gameBundle, assetsRoot), "utf8");
  assert.match(bundle, /Para onde vamos hoje\?/);
  assert.match(bundle, /Sandbox Cósmico/);
  assert.match(bundle, /Laboratório da Matéria/);
  assert.match(bundle, /Quem vai comandar esta expedição\?/);
  assert.match(bundle, /Pular para o conteúdo/);
  assert.match(bundle, /Seu ciclo de descoberta/);
  assert.match(bundle, /Perfil de aprendizagem/);
  assert.match(bundle, /Como explorar o CosmoLab/);
  assert.match(bundle, /118 \/ 118 elementos/);
  assert.match(bundle, /Aprenda em 60 segundos/);
  assert.match(bundle, /Sua previsão antes do teste/);
  assert.match(bundle, /Inspecione cada evidência/);
  assert.doesNotMatch(bundle, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("keeps scientific evidence and child-safety language explicit", async () => {
  const data = await readFile(new URL("../app/data.ts", import.meta.url), "utf8");
  const uap = await readFile(new URL("../app/components/UapArchive.tsx", import.meta.url), "utf8");
  const shell = await readFile(new URL("../app/components/CosmoApp.tsx", import.meta.url), "utf8");
  assert.match(data, /observed/);
  assert.match(data, /calculated_model/);
  assert.match(data, /inferred/);
  assert.match(data, /Buraco negro estelar/);
  assert.match(data, /Buraco branco/);
  assert.match(data, /Buraco de minhoca/);
  assert.match(data, /Gravastar/);
  assert.match(data, /Fuzzball/);
  assert.match(data, /sem materiais ou instruções de fabricação/);
  assert.match(data, /Oganessônio/);
  assert.match(data, /\["Ts","Tenessino",294\],\["Og","Oganessônio",294\]/);
  assert.match(uap, /Não identificado/);
  assert.match(uap, /Nave extraterrestre/);
  assert.match(uap, /Regra de ouro/);
  assert.match(shell, /Sem anúncios · sem chat/);
});

test("ships a playable investigation for every main mission", async () => {
  const data = await readFile(new URL("../app/data.ts", import.meta.url), "utf8");
  const runner = await readFile(new URL("../app/components/MissionRunner.tsx", import.meta.url), "utf8");
  for (let index = 1; index <= 16; index += 1) {
    assert.match(data, new RegExp(`"mission-${index}"\\s*:`), `mission-${index} should have a challenge`);
  }
  assert.match(runner, /Faça sua hipótese/);
  assert.match(runner, /Testar hipótese/);
  assert.match(runner, /O que os dados mostram/);
  assert.doesNotMatch(runner, /Concluir demo/);
});

test("changes scientific depth with the learning profile", async () => {
  const shell = await readFile(new URL("../app/components/CosmoApp.tsx", import.meta.url), "utf8");
  const matter = await readFile(new URL("../app/components/MatterLab.tsx", import.meta.url), "utf8");
  assert.match(shell, /<MatterLab mode=\{profile\.ageBand\}/);
  assert.match(shell, /<CosmicLab mode=\{profile\.ageBand\}/);
  assert.match(matter, /Distribuição eletrônica simplificada/);
  assert.match(matter, /MODO PESQUISADOR/);
});

test("renders quantitative collision telemetry and instrument-specific surveys", async () => {
  const telemetry = await readFile(new URL("../app/components/CollisionTelemetry.tsx", import.meta.url), "utf8");
  const science = await readFile(new URL("../app/lib/science.ts", import.meta.url), "utf8");
  const survey = await readFile(new URL("../app/components/PlanetSurvey.tsx", import.meta.url), "utf8");
  assert.match(telemetry, /Telemetria do encontro/);
  assert.match(telemetry, /formatDuration/);
  assert.match(telemetry, /Velocidades relativísticas/);
  assert.match(science, /buildEncounterTelemetry/);
  assert.match(science, /Integração newtoniana simplificada/);
  for (const tool of ["spectrometer", "microscope", "seismic", "magnetic"]) assert.match(survey, new RegExp(`${tool}:`));
  assert.match(survey, /LEITURA INSTRUMENTAL ESPECÍFICA/);
});

test("supports safe study streaks, achievements, and discovery sharing", async () => {
  const shell = await readFile(new URL("../app/components/CosmoApp.tsx", import.meta.url), "utf8");
  const world = await readFile(new URL("../app/components/WorldView.tsx", import.meta.url), "utf8");
  const journal = await readFile(new URL("../app/components/JournalView.tsx", import.meta.url), "utf8");
  assert.match(shell, /lastActiveDate/);
  assert.match(shell, /<progress max=\{250\}/);
  assert.match(world, /Expedição do dia/);
  assert.match(world, /Sequência científica/);
  assert.match(journal, /navigator\.share/);
  assert.match(journal, /sem nome ou dado pessoal/i);
  assert.match(journal, /Medalhas científicas/);
});

test("lets the selected animal pilot a 3D spacecraft between planets", async () => {
  const flight = await readFile(new URL("../app/components/SpaceFlightExperience.tsx", import.meta.url), "utf8");
  const world = await readFile(new URL("../app/components/WorldView.tsx", import.meta.url), "utf8");
  assert.match(flight, /from "three"/);
  assert.match(flight, /requestAnimationFrame/);
  assert.match(flight, /ArrowUp/);
  assert.match(flight, /Piloto automático/);
  assert.match(flight, /cosmolab-crew-cockpit\.png/);
  assert.match(flight, /aria-label="Acelerar nave"/);
  assert.match(world, /Pilotar nave/);
  assert.match(world, /SpaceFlightExperience/);
});

test("keeps the chosen animal beside the learner during planetary fieldwork", async () => {
  const survey = await readFile(new URL("../app/components/PlanetSurvey.tsx", import.meta.url), "utf8");
  const shell = await readFile(new URL("../app/components/CosmoApp.tsx", import.meta.url), "utf8");
  assert.match(survey, /avatarId/);
  assert.match(survey, /Companheiro de campo/);
  assert.match(survey, /fieldTips/);
  assert.match(survey, /cosmolab-crew-cockpit\.png/);
  assert.match(shell, /avatarId=\{profile\.avatarId\}/);
});

test("starts the flight inside an interactive first-person cockpit", async () => {
  const flight = await readFile(new URL("../app/components/SpaceFlightExperience.tsx", import.meta.url), "utf8");
  const cockpit = await readFile(new URL("../app/components/CockpitHUD.tsx", import.meta.url), "utf8");
  assert.match(flight, /useState<FlightView>\("cockpit"\)/);
  assert.match(flight, /camera\.fov/);
  assert.match(flight, /CockpitHUD/);
  assert.match(cockpit, /cosmolab-cockpit-first-person\.png/);
  assert.match(cockpit, /Visão interna da cabine/);
  assert.match(cockpit, /Combustível/);
  assert.match(cockpit, /Integridade/);
  assert.match(cockpit, /aria-label=\{`Ouvir \$\{avatar\.name\} na cabine`\}/);
});
