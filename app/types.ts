export type ViewId =
  | "universe"
  | "missions"
  | "matter"
  | "cosmic"
  | "uap"
  | "journal";

export type EvidenceLevel =
  | "observed"
  | "calculated_model"
  | "inferred"
  | "hypothesis"
  | "fiction";

export type Domain =
  | "Química"
  | "Física"
  | "Biologia"
  | "Astronomia"
  | "Tecnologia";

export interface Mission {
  id: string;
  title: string;
  description: string;
  region: string;
  domain: Domain;
  xp: number;
  evidence: EvidenceLevel;
  icon: string;
  locked?: boolean;
}

export interface Avatar {
  id: string;
  name: string;
  emoji: string;
  role: string;
  color: string;
}

export interface ElementRecord {
  symbol: string;
  name: string;
  number: number;
  mass: number;
  group: "nonmetal" | "metal" | "noble" | "metalloid";
  fact: string;
  category: string;
  period: number;
  state: "sólido" | "líquido" | "gás" | "desconhecido";
  use: string;
}

export interface PlanetRecord {
  id: string;
  name: string;
  subtitle: string;
  type: "rochoso" | "lua" | "gigante gasoso" | "exoplaneta";
  gravity: string;
  temperature: string;
  pressure: string;
  radiation: string;
  atmosphere: Array<{ label: string; value: number }>;
  materials: string[];
  evidence: EvidenceLevel;
  color: string;
  landingMode: "pouso" | "sonda";
  source: string;
}

export interface CelestialBody {
  id: string;
  name: string;
  kind:
    | "planeta"
    | "lua"
    | "asteroide"
    | "cometa"
    | "buraco-negro"
    | "buraco-branco"
    | "minhoca"
    | "gravastar"
    | "fuzzball"
    | "laser"
    | "bomba-virtual"
    | "ovni";
  massKg: number;
  radiusM: number;
  color: string;
  atmosphere: boolean;
  evidence: EvidenceLevel;
  description: string;
  energyOverrideJ?: number;
}

export interface CollisionResult {
  outcome: "Desvio" | "Captura orbital" | "Impacto" | "Fusão parcial" | "Fragmentação" | "Interação hipotética";
  energyJoules: number;
  momentum: number;
  velocityMs: number;
  uncertainty: number;
  summary: string;
  visualEffect: "impact" | "shatter" | "swallow" | "deflect" | "merge" | "beam" | "expel" | "portal" | "unknown";
  affectedBody?: "projectile" | "target" | "both";
}

export interface GameProfile {
  nickname: string;
  avatarId: string;
  ageBand: "explorer" | "researcher";
  xp: number;
  completed: string[];
  trail: string[];
  discoveries: string[];
}

export interface UapCase {
  id: string;
  title: string;
  place: string;
  signal: string;
  evidence: string[];
  answer: string;
  explanation: string;
}
