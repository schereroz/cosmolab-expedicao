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

test("keeps the ship hull outside the cockpit and assists planetary approach", async () => {
  const flight = await readFile(new URL("../app/components/SpaceFlightExperience.tsx", import.meta.url), "utf8");
  const cockpit = await readFile(new URL("../app/components/CockpitHUD.tsx", import.meta.url), "utf8");
  assert.match(flight, /ship\.visible = !inCockpit/);
  assert.match(flight, /navigationAssistRef/);
  assert.match(flight, /arrivalRadius.*\+ 8/);
  assert.match(flight, /Frenagem de aproximação/);
  assert.match(cockpit, /Alinhamento com a rota/);
  assert.match(cockpit, /Iniciar rota assistida/);
});

test("turns missions and the matter lab into repeatable experiments", async () => {
  const runner = await readFile(new URL("../app/components/MissionRunner.tsx", import.meta.url), "utf8");
  const matter = await readFile(new URL("../app/components/MatterLab.tsx", import.meta.url), "utf8");
  const science = await readFile(new URL("../app/lib/science.ts", import.meta.url), "utf8");
  assert.match(runner, /Registro de ensaios/);
  assert.match(runner, /experimentalRuns/);
  assert.match(runner, /Qualidade do resultado/);
  assert.match(matter, /Temperatura da bancada/);
  assert.match(matter, /Estado previsto a 1 atm/);
  assert.match(matter, /Tipo de ligação/);
  assert.match(science, /phaseAtTemperature/);
});

test("renders collisions as a physical 3D event instead of flat CSS bodies", async () => {
  const scene = await readFile(new URL("../app/components/CollisionScene3D.tsx", import.meta.url), "utf8");
  const cosmic = await readFile(new URL("../app/components/CosmicLab.tsx", import.meta.url), "utf8");
  assert.match(scene, /from "three"/);
  assert.match(scene, /requestAnimationFrame/);
  assert.match(scene, /AdditiveBlending/);
  assert.match(scene, /TorusGeometry/);
  assert.match(scene, /fragmentVelocity/);
  assert.match(scene, /horizonte de eventos/i);
  assert.match(cosmic, /CollisionScene3D/);
  assert.doesNotMatch(cosmic, /projectile-body/);
});

test("pulls an astro through a black-hole horizon instead of repelling it", async () => {
  const { blackHoleAbsorptionFrame, simulateCollision } = await import("../app/lib/science.ts");
  const scene = await readFile(new URL("../app/components/CollisionScene3D.tsx", import.meta.url), "utf8");
  const blackHole = { id: "black-hole-test", name: "Buraco negro", kind: "buraco-negro", massKg: 1.989e31, radiusM: 2.95e4, color: "#000000", atmosphere: false, evidence: "observed", description: "Teste" };
  const planet = { id: "planet-test", name: "Planeta", kind: "planeta", massKg: 5.972e24, radiusM: 6.371e6, color: "#4b8fac", atmosphere: true, evidence: "observed", description: "Teste" };

  const collision = simulateCollision(planet, blackHole, 80, 85);
  assert.equal(collision.visualEffect, "swallow");
  assert.equal(collision.affectedBody, "projectile");
  const reverseCollision = simulateCollision(blackHole, planet, 80, 85);
  assert.equal(reverseCollision.visualEffect, "swallow");
  assert.equal(reverseCollision.affectedBody, "target");

  const start = { x: 1.5, y: 0.4, z: 0 };
  const center = { x: 3.4, y: 0, z: 0 };
  const middle = blackHoleAbsorptionFrame(start, center, 0.5);
  const end = blackHoleAbsorptionFrame(start, center, 1);
  assert.ok(middle.x > start.x && middle.x < center.x, "the body should move inward during absorption");
  assert.deepEqual({ x: end.x, y: end.y, z: end.z }, center);
  assert.equal(end.opacity, 0);
  assert.ok(end.scale <= 0.02);
  assert.match(scene, /blackHoleAbsorptionFrame/);
});

test("adds evidence-aware neutron and Planck stars with distinct collision physics", async () => {
  const { celestialBodies } = await import("../app/data.ts");
  const { simulateCollision } = await import("../app/lib/science.ts");
  const scene = await readFile(new URL("../app/components/CollisionScene3D.tsx", import.meta.url), "utf8");
  const neutronStar = celestialBodies.find((body) => body.id === "neutron-star");
  const planckStar = celestialBodies.find((body) => body.id === "planck-star");
  const earth = celestialBodies.find((body) => body.id === "earth");

  assert.equal(neutronStar?.kind, "estrela-neutrons");
  assert.equal(neutronStar?.evidence, "observed");
  assert.ok(neutronStar.massKg > earth.massKg * 100_000);
  assert.equal(planckStar?.kind, "estrela-planck");
  assert.equal(planckStar?.evidence, "hypothesis");

  const tidalEncounter = simulateCollision(earth, neutronStar, 45, 35);
  assert.equal(tidalEncounter.visualEffect, "tidal-disruption");
  assert.equal(tidalEncounter.affectedBody, "projectile");
  assert.ok(tidalEncounter.uncertainty >= 45);
  assert.match(tidalEncounter.summary, /forças de maré/i);

  const quantumEncounter = simulateCollision(earth, planckStar, 45, 35);
  assert.equal(quantumEncounter.outcome, "Interação hipotética");
  assert.equal(quantumEncounter.visualEffect, "quantum-bounce");
  assert.ok(quantumEncounter.uncertainty >= 90);
  assert.match(quantumEncounter.summary, /não foi observada|não confirmado/i);
  assert.match(scene, /estrela-neutrons/);
  assert.match(scene, /estrela-planck/);
  assert.match(scene, /new THREE\.Timer/);
  assert.doesNotMatch(scene, /new THREE\.Clock/);
});

test("keeps the complete exploration loop usable on phone screens", async () => {
  const app = await readFile(new URL("../app/components/CosmoApp.tsx", import.meta.url), "utf8");
  const world = await readFile(new URL("../app/components/WorldView.tsx", import.meta.url), "utf8");
  const matter = await readFile(new URL("../app/components/MatterLab.tsx", import.meta.url), "utf8");
  const cosmic = await readFile(new URL("../app/components/CosmicLab.tsx", import.meta.url), "utf8");
  const flight = await readFile(new URL("../app/components/SpaceFlightExperience.tsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(app, /aria-label="Navegação principal"/);
  assert.match(world, /mobile-flight-launcher/);
  assert.match(world, /Destinos rápidos/);
  assert.match(matter, /periodic-swipe-hint/);
  assert.match(cosmic, /mobile-section-nav/);
  assert.match(cosmic, /id="cosmic-parameters"/);
  assert.match(cosmic, /id="cosmic-simulation"/);
  assert.match(flight, /mobile-flight-tip/);
  assert.match(styles, /grid-template-columns:\s*repeat\(6,\s*1fr\)/);
  assert.match(styles, /min-height:\s*44px/);
  assert.match(styles, /\.element-tile\s*\{[^}]*width:\s*44px/s);
  assert.match(styles, /min-width:\s*621px[^}]*max-width:\s*900px[^}]*orientation:\s*landscape/s);
  assert.match(flight, /window\.innerWidth <= 620 \? 1\.25 : 1\.75/);
  assert.match(flight, /new THREE\.Timer\(\)/);
  assert.doesNotMatch(flight, /new THREE\.Clock\(\)/);
  assert.doesNotMatch(styles, /\.app-header nav button\s*\{\s*font-size:\s*0/);
});
