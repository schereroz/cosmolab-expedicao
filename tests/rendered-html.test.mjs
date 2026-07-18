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
  assert.match(uap, /Não identificado/);
  assert.match(uap, /Nave extraterrestre/);
  assert.match(shell, /Sem anúncios · sem chat/);
});
