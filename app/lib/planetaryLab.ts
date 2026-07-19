import type { EvidenceLevel } from "../types";

export type PlanetaryLabId = "mars" | "europa" | "jupiter" | "kepler";
export type ChangeType = "Sem mudança visível" | "Mudança física" | "Reação química" | "Resultado desconhecido";

export interface PlanetaryTarget {
  id: string;
  name: string;
  icon: string;
  description: string;
  evidence: EvidenceLevel;
}

export interface PlanetarySubstance {
  id: string;
  name: string;
  formula: string;
  phase: string;
  color: string;
}

export interface InteractionTimelinePoint {
  time: number;
  temperature: number;
  pressure: number;
  spectralSignal: number;
  progress: number;
}

export interface PlanetaryInteractionResult {
  title: string;
  changeType: ChangeType;
  evidence: EvidenceLevel;
  uncertainty: number;
  visualEffect: "frost" | "dissolve" | "dust" | "cloud" | "inert" | "unknown";
  explanation: string;
  observation: string;
  before: string;
  after: string;
  source: string;
  timeline: InteractionTimelinePoint[];
}

export const planetaryTargets: Record<PlanetaryLabId, PlanetaryTarget[]> = {
  mars: [
    { id: "iron-rock", name: "Rocha rica em ferro", icon: "◆", description: "Rocha oxidada que ajuda a dar a Marte sua cor avermelhada.", evidence: "observed" },
    { id: "basalt-slab", name: "Laje basáltica", icon: "⬢", description: "Material vulcânico escuro comum em muitas regiões marcianas.", evidence: "observed" },
    { id: "ice-pocket", name: "Bolsa de gelo", icon: "❄", description: "Gelo de água modelado logo abaixo do regolito frio.", evidence: "inferred" },
  ],
  europa: [
    { id: "ice-ridge", name: "Crista de gelo", icon: "△", description: "Gelo de água atravessado por fraturas jovens.", evidence: "observed" },
    { id: "salt-deposit", name: "Depósito salino", icon: "✦", description: "Sais prováveis misturados ao gelo, identificados por sensoriamento remoto.", evidence: "inferred" },
    { id: "dark-material", name: "Material avermelhado", icon: "◈", description: "Mistura ainda incerta, possivelmente com sais e compostos de enxofre alterados por radiação.", evidence: "inferred" },
  ],
  jupiter: [
    { id: "ammonia-cloud", name: "Nuvem de amônia", icon: "☁", description: "Parcela virtual da camada superior de cristais de amônia.", evidence: "inferred" },
    { id: "water-cloud", name: "Nuvem profunda de água", icon: "≋", description: "Camada mais profunda inferida por modelos e observações em micro-ondas.", evidence: "inferred" },
    { id: "hydrogen-stream", name: "Corrente de hidrogênio", icon: "↝", description: "Fluxo atmosférico dominado por hidrogênio e hélio.", evidence: "observed" },
  ],
  kepler: [
    { id: "dark-rock", name: "Rocha escura simulada", icon: "◆", description: "Superfície inventada para testar hipóteses; nenhuma rocha foi observada.", evidence: "hypothesis" },
    { id: "ice-shadow", name: "Gelo na sombra", icon: "❄", description: "Cenário hipotético dependente de uma atmosfera e temperatura desconhecidas.", evidence: "hypothesis" },
    { id: "dust-basin", name: "Bacia de poeira", icon: "◌", description: "Terreno narrativo sem imagem ou amostra real.", evidence: "hypothesis" },
  ],
};

export const planetarySubstances: PlanetarySubstance[] = [
  { id: "water", name: "Água", formula: "H₂O", phase: "líquido virtual", color: "#69c6e6" },
  { id: "oxygen", name: "Oxigênio", formula: "O₂", phase: "gás virtual", color: "#9bd9ff" },
  { id: "carbon-dioxide", name: "Dióxido de carbono", formula: "CO₂", phase: "gás virtual", color: "#d8e0df" },
  { id: "sodium-bicarbonate", name: "Bicarbonato de sódio", formula: "NaHCO₃", phase: "sólido virtual", color: "#f5f1dc" },
  { id: "nitrogen", name: "Nitrogênio", formula: "N₂", phase: "gás virtual", color: "#b7c5e8" },
  { id: "methane", name: "Metano", formula: "CH₄", phase: "gás virtual", color: "#8dd8ba" },
];

interface OutcomeTemplate extends Omit<PlanetaryInteractionResult, "timeline"> {
  temperatureDelta: number;
  pressureDelta: number;
  spectralDelta: number;
  progressMax: number;
}

const planetBaselines: Record<PlanetaryLabId, { temperature: number; pressure: number; spectral: number; source: string }> = {
  mars: { temperature: -63, pressure: 0.6, spectral: 18, source: "NASA Mars Facts · superfície, atmosfera e água" },
  europa: { temperature: -160, pressure: 0.000001, spectral: 24, source: "NASA Europa Facts · gelo, sais e radiação" },
  jupiter: { temperature: -110, pressure: 100, spectral: 32, source: "NASA Jupiter Facts · camadas de nuvens e ausência de superfície sólida" },
  kepler: { temperature: -20, pressure: 100, spectral: 10, source: "NASA Exoplanet Catalog · somente parâmetros orbitais e raio; superfície desconhecida" },
};

const specificOutcomes: Record<string, Partial<OutcomeTemplate>> = {
  "mars:iron-rock:water": {
    title: "Película instável de gelo e vapor",
    changeType: "Mudança física",
    visualEffect: "frost",
    explanation: "Na pressão atmosférica muito baixa de Marte, água líquida exposta não permaneceria estável por muito tempo: parte congelaria e parte passaria rapidamente para vapor. A rocha apenas escurece enquanto está molhada.",
    observation: "A câmera registra brilho de gelo e uma pluma tênue; o espectro continua mostrando água, sem nova substância confirmada.",
    before: "Rocha seca a −63 °C",
    after: "Gelo temporário + vapor de H₂O",
    temperatureDelta: -7,
    pressureDelta: 0.12,
    spectralDelta: 54,
    progressMax: 78,
  },
  "mars:basalt-slab:water": {
    title: "Escurecimento e congelamento superficial",
    changeType: "Mudança física",
    visualEffect: "frost",
    explanation: "A água preenche poros do basalto e congela ou evapora rapidamente na atmosfera rarefeita. Alterar textura e estado físico não prova uma reação química.",
    observation: "Albedo menor por alguns instantes, seguido por cristais claros.",
    before: "Basalto poroso e seco",
    after: "Poros úmidos + gelo temporário",
    temperatureDelta: -5,
    pressureDelta: 0.08,
    spectralDelta: 46,
    progressMax: 66,
  },
  "mars:ice-pocket:carbon-dioxide": {
    title: "Deposição fria no gelo",
    changeType: "Mudança física",
    visualEffect: "frost",
    explanation: "Em um cenário suficientemente frio, parte do CO₂ pode se depositar como gelo seco sobre o gelo de água. O resultado depende fortemente da temperatura e pressão locais.",
    observation: "Uma camada esbranquiçada aparece no modelo e o sinal de CO₂ aumenta.",
    before: "Gelo de água sob regolito",
    after: "Gelo de H₂O + depósito modelado de CO₂",
    temperatureDelta: -9,
    pressureDelta: -0.04,
    spectralDelta: 61,
    progressMax: 72,
  },
  "europa:salt-deposit:water": {
    title: "Dissolução breve e recongelamento",
    changeType: "Mudança física",
    visualEffect: "dissolve",
    explanation: "A água líquida virtual dissolve parte dos íons do depósito, mas na superfície extremamente fria de Europa a mistura recongela rapidamente. Isso não demonstra que exista líquido exposto ali.",
    observation: "O cristal perde arestas antes de ficar preso em uma película de gelo.",
    before: "Sal provável misturado ao gelo",
    after: "Salmoura transitória + gelo recongelado",
    temperatureDelta: 4,
    pressureDelta: 0,
    spectralDelta: 48,
    progressMax: 70,
  },
  "europa:ice-ridge:water": {
    title: "Recongelamento quase imediato",
    changeType: "Mudança física",
    visualEffect: "frost",
    explanation: "Água adicionada à superfície gelada perde energia e recongela. A pressão quase nula também favorece sublimação de moléculas expostas.",
    observation: "A fissura recebe uma camada azulada que logo fica opaca.",
    before: "Crista de gelo irradiado",
    after: "Nova camada de gelo modelada",
    temperatureDelta: 3,
    pressureDelta: 0.000002,
    spectralDelta: 38,
    progressMax: 82,
  },
  "jupiter:ammonia-cloud:water": {
    title: "Gotículas de amônia e água",
    changeType: "Mudança física",
    visualEffect: "cloud",
    explanation: "A sonda mistura água virtual a cristais de amônia. Em algumas altitudes, modelos de Júpiter permitem gotículas de amônia e água; pressão, temperatura e dinâmica das nuvens controlam o resultado.",
    observation: "A parcela de nuvem engrossa e o sinal de micro-ondas muda.",
    before: "Cristais frios de NH₃",
    after: "Aerossol modelado de NH₃–H₂O",
    temperatureDelta: 6,
    pressureDelta: 8,
    spectralDelta: 58,
    progressMax: 74,
  },
};

function seededNoise(seed: string, index: number) {
  let hash = 2166136261;
  for (const character of `${seed}:${index}`) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return ((hash >>> 0) % 1000) / 1000 - 0.5;
}

export function simulatePlanetaryInteraction({ planetId, targetId, substanceId }: { planetId: PlanetaryLabId; targetId: string; substanceId: string }): PlanetaryInteractionResult {
  const planetTargets = planetaryTargets[planetId];
  const target = planetTargets.find((item) => item.id === targetId) ?? planetTargets[0];
  const substance = planetarySubstances.find((item) => item.id === substanceId) ?? planetarySubstances[0];
  const baseline = planetBaselines[planetId];
  const key = `${planetId}:${target.id}:${substance.id}`;
  const specific = specificOutcomes[key];
  const isExoplanet = planetId === "kepler";
  const defaultTemplate: OutcomeTemplate = {
    title: isExoplanet ? "Resultado impossível de confirmar" : "Nenhuma mudança rápida detectada",
    changeType: isExoplanet ? "Resultado desconhecido" : "Sem mudança visível",
    evidence: isExoplanet ? "hypothesis" : "calculated_model",
    uncertainty: isExoplanet ? 92 : planetId === "jupiter" ? 58 : 35,
    visualEffect: isExoplanet ? "unknown" : substance.id === "sodium-bicarbonate" ? "dust" : "inert",
    explanation: isExoplanet
      ? `A superfície de Kepler-186f não foi observada e sua atmosfera é desconhecida. A interação entre ${substance.name} e ${target.name.toLowerCase()} é apenas um cenário imaginativo, não uma previsão.`
      : `Adicionar ${substance.name} a ${target.name.toLowerCase()} não produz uma reação rápida no modelo. Ausência de efeito visível não prova ausência de processos lentos ou microscópicos.`,
    observation: isExoplanet ? "Os sensores exibem apenas uma faixa de possibilidades." : "Os sensores permanecem próximos da linha de base.",
    before: target.description,
    after: isExoplanet ? "Estado desconhecido" : `${substance.formula} permanece detectável sem produto novo confirmado`,
    source: baseline.source,
    temperatureDelta: isExoplanet ? 8 : 1,
    pressureDelta: isExoplanet ? 18 : 0.02,
    spectralDelta: isExoplanet ? 22 : 12,
    progressMax: isExoplanet ? 25 : 12,
  };
  const template = { ...defaultTemplate, ...specific, evidence: isExoplanet ? "hypothesis" as const : specific?.evidence ?? defaultTemplate.evidence, uncertainty: isExoplanet ? 92 : specific?.uncertainty ?? defaultTemplate.uncertainty, source: specific?.source ?? baseline.source };
  const timeline = Array.from({ length: 12 }, (_, index) => {
    const ratio = index / 11;
    const response = 1 - Math.exp(-4 * ratio);
    const noise = seededNoise(key, index);
    return {
      time: index * 2,
      temperature: Number((baseline.temperature + template.temperatureDelta * response + noise * 0.8).toFixed(2)),
      pressure: Number(Math.max(0, baseline.pressure + template.pressureDelta * response + noise * Math.max(0.000001, baseline.pressure * 0.004)).toFixed(6)),
      spectralSignal: Number(Math.max(0, Math.min(100, baseline.spectral + template.spectralDelta * response + noise * 2)).toFixed(2)),
      progress: Number(Math.max(0, Math.min(100, template.progressMax * response)).toFixed(2)),
    };
  });
  return {
    title: template.title,
    changeType: template.changeType,
    evidence: template.evidence,
    uncertainty: template.uncertainty,
    visualEffect: template.visualEffect,
    explanation: template.explanation,
    observation: template.observation,
    before: template.before,
    after: template.after,
    source: template.source,
    timeline,
  };
}
