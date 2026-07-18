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
  let visualEffect: CollisionResult["visualEffect"] = "impact";
  let affectedBody: CollisionResult["affectedBody"] = "both";
  const smallerBody = projectile.massKg <= target.massKg ? projectile : target;
  const smallerSide = projectile.massKg <= target.massKg ? "projectile" : "target";
  const massRatio = Math.max(projectile.massKg, target.massKg) / Math.max(1, Math.min(projectile.massKg, target.massKg));

  if (projectile.kind === "buraco-negro" || target.kind === "buraco-negro") {
    const blackHole = projectile.kind === "buraco-negro" ? projectile : target;
    const capturedBody = projectile.kind === "buraco-negro" ? target : projectile;
    if (angleDegrees > 76 && speedRatio > 1.2) {
      outcome = "Desvio";
      visualEffect = "deflect";
      affectedBody = "projectile";
      summary = "A trajetória rasante é curvada pela gravidade extrema e o objeto escapa no modelo. Perto de um buraco negro real, seria necessário calcular relatividade geral.";
    } else {
      outcome = "Captura orbital";
      visualEffect = "swallow";
      affectedBody = projectile.kind === "buraco-negro" ? "target" : "projectile";
      summary = `${capturedBody.name} cruza o horizonte de eventos de ${blackHole.name} e deixa de conseguir retornar. Para quem observa de longe, sua luz enfraqueceria e ficaria mais avermelhada.`;
    }
  } else if (target.kind === "buraco-branco") {
    outcome = "Interação hipotética";
    visualEffect = "expel";
    affectedBody = "projectile";
    summary = "No conceito matemático de buraco branco, matéria não entraria e seria expelida. Nenhum buraco branco foi observado: esta animação é uma hipótese visual.";
  } else if (target.kind === "minhoca") {
    outcome = "Interação hipotética";
    visualEffect = "portal";
    affectedBody = "projectile";
    summary = "O objeto atravessa o portal apenas na narrativa. Buracos de minhoca atravessáveis não foram observados e talvez nem sejam fisicamente estáveis.";
  } else if ([projectile.kind, target.kind].some((kind) => ["gravastar", "fuzzball"].includes(kind))) {
    outcome = "Interação hipotética";
    visualEffect = "unknown";
    summary = `Não existe evidência suficiente para prever esta interação com ${target.name}. O brilho instável indica incerteza do modelo, não um resultado observado.`;
  } else if (projectile.kind === "laser") {
    outcome = "Impacto";
    visualEffect = "beam";
    affectedBody = "target";
    summary = "O pulso deposita energia na camada externa do alvo. O dispositivo e sua potência são inteiramente ficcionais.";
  } else if (projectile.kind === "bomba-virtual") {
    outcome = "Fragmentação";
    visualEffect = "shatter";
    affectedBody = "target";
    summary = "A carga virtual transfere a energia definida pelo cenário. Nenhum material, mecanismo ou instrução real é modelado.";
  } else if (angleDegrees > 72 && speedRatio > 1.15) {
    outcome = "Desvio";
    visualEffect = "deflect";
    affectedBody = "both";
    summary = "O encontro é rasante: os corpos trocam energia e seguem trajetórias diferentes.";
  } else if (speedRatio < 0.72) {
    outcome = "Captura orbital";
    visualEffect = "merge";
    summary = "A velocidade relativa é baixa o bastante para uma captura aproximada pelo modelo.";
  } else if ((specificEnergy > 4e7 || massRatio > 20) && angleFactor > 0.35) {
    outcome = "Fragmentação";
    visualEffect = "shatter";
    affectedBody = smallerSide;
    summary = `${smallerBody.name}, o corpo de menor massa, é fragmentado e parte do material é aquecida ou ejetada. A quantidade real de fragmentos dependeria da composição e estrutura internas.`;
  } else if (speedRatio < 1.2) {
    outcome = "Fusão parcial";
    visualEffect = "merge";
    summary = "Parte do material pode se unir; outra parte é aquecida e ejetada.";
  } else {
    outcome = "Impacto";
    visualEffect = "impact";
    summary = "O projétil atinge a superfície e transfere energia para calor, deformação e ejeção.";
  }

  return {
    outcome,
    energyJoules,
    momentum,
    velocityMs,
    uncertainty: Math.round(12 + Math.min(28, speedRatio * 6)),
    summary,
    visualEffect,
    affectedBody,
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
