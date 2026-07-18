import type { CelestialBody, CollisionResult, ElementRecord } from "../types";

const G = 6.6743e-11;

export function simulateCollision(
  projectile: CelestialBody,
  target: CelestialBody,
  speedKmS: number,
  angleDegrees: number,
): CollisionResult {
  const velocityMs = speedKmS * 1000;
  const reducedMass = (projectile.massKg * target.massKg) / (projectile.massKg + target.massKg);
  const energyJoules = projectile.energyOverrideJ ?? 0.5 * projectile.massKg * velocityMs ** 2;
  const momentum = projectile.kind === "laser" ? energyJoules / 299_792_458 : projectile.massKg * velocityMs;
  const escapeVelocity = Math.sqrt(
    (2 * G * (projectile.massKg + target.massKg)) /
      (projectile.radiusM + target.radiusM),
  );
  const speedRatio = velocityMs / escapeVelocity;
  const angleFactor = Math.sin((Math.max(1, angleDegrees) * Math.PI) / 180);
  const specificEnergy = (0.5 * reducedMass * velocityMs ** 2) / target.massKg;

  let outcome: CollisionResult["outcome"];
  let summary: string;

  if ([projectile.kind, target.kind].some((kind) => ["buraco-branco", "minhoca", "gravastar", "fuzzball"].includes(kind))) {
    outcome = "Interação hipotética";
    summary = `Não existe evidência suficiente para prever esta interação com ${target.name}. O resultado é uma exploração teórica, não uma previsão.`;
  } else if (projectile.kind === "laser") {
    outcome = "Impacto";
    summary = "O pulso deposita energia na camada externa do alvo. O dispositivo e sua potência são inteiramente ficcionais.";
  } else if (projectile.kind === "bomba-virtual") {
    outcome = "Fragmentação";
    summary = "A carga virtual transfere a energia definida pelo cenário. Nenhum material, mecanismo ou instrução real é modelado.";
  } else if (target.kind === "buraco-negro") {
    outcome = angleDegrees > 68 && speedRatio > 1 ? "Desvio" : "Captura orbital";
    summary = outcome === "Desvio" ? "O objeto passa em uma trajetória rasante no modelo newtoniano simplificado." : "O objeto cruza a região de captura representada pelo modelo; efeitos relativísticos detalhados não são calculados.";
  } else if (angleDegrees > 72 && speedRatio > 1.15) {
    outcome = "Desvio";
    summary = "O encontro é rasante: os corpos trocam energia e seguem trajetórias diferentes.";
  } else if (speedRatio < 0.72) {
    outcome = "Captura orbital";
    summary = "A velocidade relativa é baixa o bastante para uma captura aproximada pelo modelo.";
  } else if (specificEnergy > 4e7 && angleFactor > 0.45) {
    outcome = "Fragmentação";
    summary = "A energia específica supera o limite educativo de fragmentação do corpo-alvo.";
  } else if (speedRatio < 1.2) {
    outcome = "Fusão parcial";
    summary = "Parte do material pode se unir; outra parte é aquecida e ejetada.";
  } else {
    outcome = "Impacto";
    summary = "O projétil atinge a superfície e transfere energia para calor, deformação e ejeção.";
  }

  return {
    outcome,
    energyJoules,
    momentum,
    velocityMs,
    uncertainty: Math.round(12 + Math.min(28, speedRatio * 6)),
    summary,
  };
}

const moleculeRecipes: Record<string, { formula: string; name: string; fact: string }> = {
  "H-H-O": { formula: "H₂O", name: "Água", fact: "Uma molécula polar essencial para a vida conhecida." },
  "Cl-Na": { formula: "NaCl", name: "Cloreto de sódio", fact: "Forma uma rede iônica sólida, não moléculas isoladas comuns." },
  "C-O-O": { formula: "CO₂", name: "Dióxido de carbono", fact: "Molécula linear que absorve radiação infravermelha." },
  "C-H-H-H-H": { formula: "CH₄", name: "Metano", fact: "Molécula tetraédrica e um gás de efeito estufa." },
  "H-H-H-N": { formula: "NH₃", name: "Amônia", fact: "Tem geometria piramidal e participa do ciclo do nitrogênio." },
  "O-O": { formula: "O₂", name: "Oxigênio molecular", fact: "Forma diatômica presente na atmosfera terrestre." },
};

export function combineElements(selected: ElementRecord[]) {
  const key = selected.map((item) => item.symbol).sort().join("-");
  const known = moleculeRecipes[key];
  const mass = selected.reduce((sum, item) => sum + item.mass, 0);
  if (known) return { ...known, mass, evidence: "observed" as const };
  return {
    formula: selected.map((item) => item.symbol).join(""),
    name: "Combinação em estudo",
    fact: "Estes símbolos não definem sozinhos uma substância estável. Ligações, carga e condições também importam.",
    mass,
    evidence: "hypothesis" as const,
  };
}

export function formatScientific(value: number) {
  if (!Number.isFinite(value)) return "—";
  return value.toExponential(2).replace("e+", " × 10^").replace("e-", " × 10^−");
}
