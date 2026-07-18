import type {
  Avatar,
  CelestialBody,
  ElementRecord,
  Mission,
  PlanetRecord,
  UapCase,
} from "./types";

export const avatars: Avatar[] = [
  { id: "panda", name: "Panda", emoji: "🐼", role: "Químico curioso", color: "#e8f4ef" },
  { id: "gorila", name: "Gorila", emoji: "🦍", role: "Engenheiro orbital", color: "#f3e9da" },
  { id: "capivara", name: "Capivara", emoji: "🦫", role: "Exploradora calma", color: "#f4e5ca" },
  { id: "axolote", name: "Axolote", emoji: "🦎", role: "Biólogo aquático", color: "#fbe1e4" },
  { id: "coruja", name: "Coruja", emoji: "🦉", role: "Astrônoma atenta", color: "#e7e7f5" },
  { id: "polvo", name: "Polvo", emoji: "🐙", role: "Inventor versátil", color: "#e9e0f2" },
];

const missionSeeds: Array<Omit<Mission, "id">> = [
  { title: "O segredo do sal", description: "Separe íons e monte uma estrutura cristalina.", region: "Vale Elemental", domain: "Química", xp: 120, evidence: "observed", icon: "NaCl" },
  { title: "Construtor de moléculas", description: "Use valências para montar água, metano e amônia.", region: "Vale Elemental", domain: "Química", xp: 140, evidence: "calculated_model", icon: "H₂O" },
  { title: "Balança invisível", description: "Balanceie reações conservando cada tipo de átomo.", region: "Vale Elemental", domain: "Química", xp: 160, evidence: "calculated_model", icon: "⚖" },
  { title: "Três estados", description: "Controle pressão e temperatura para mudar fases.", region: "Vale Elemental", domain: "Física", xp: 180, evidence: "calculated_model", icon: "◈" },
  { title: "Órbita perfeita", description: "Ajuste velocidade e mantenha uma lua em órbita.", region: "Campo de Forças", domain: "Astronomia", xp: 150, evidence: "calculated_model", icon: "☾" },
  { title: "Queda sem peso", description: "Compare gravidade e aceleração em três mundos.", region: "Campo de Forças", domain: "Física", xp: 130, evidence: "observed", icon: "g" },
  { title: "Caçadores de calor", description: "Descubra como energia atravessa diferentes materiais.", region: "Campo de Forças", domain: "Física", xp: 150, evidence: "calculated_model", icon: "ΔT" },
  { title: "Som no vazio?", description: "Teste ondas com e sem matéria para transportá-las.", region: "Campo de Forças", domain: "Física", xp: 170, evidence: "observed", icon: "≈" },
  { title: "Cidade celular", description: "Conheça organelas e mantenha uma célula funcionando.", region: "Biosfera Viva", domain: "Biologia", xp: 130, evidence: "observed", icon: "◉" },
  { title: "Osmose em ação", description: "Equilibre água e solutos através de uma membrana.", region: "Biosfera Viva", domain: "Biologia", xp: 150, evidence: "calculated_model", icon: "H₂O" },
  { title: "Código da vida", description: "Transcreva um trecho de DNA e forme uma proteína.", region: "Biosfera Viva", domain: "Biologia", xp: 180, evidence: "observed", icon: "DNA" },
  { title: "Planeta em equilíbrio", description: "Ajuste uma cadeia alimentar sem quebrar o ecossistema.", region: "Biosfera Viva", domain: "Biologia", xp: 190, evidence: "calculated_model", icon: "∞" },
  { title: "Circuito luminoso", description: "Monte um circuito e calcule tensão, corrente e resistência.", region: "Oficina do Futuro", domain: "Tecnologia", xp: 130, evidence: "calculated_model", icon: "Ω" },
  { title: "Materiais do amanhã", description: "Escolha materiais por densidade, força e condutividade.", region: "Oficina do Futuro", domain: "Tecnologia", xp: 160, evidence: "observed", icon: "Fe" },
  { title: "Robô sensorial", description: "Combine sensores e lógica para explorar uma caverna.", region: "Oficina do Futuro", domain: "Tecnologia", xp: 180, evidence: "calculated_model", icon: "01" },
  { title: "Energia para todos", description: "Projete uma microrrede solar, eólica e de baterias.", region: "Oficina do Futuro", domain: "Tecnologia", xp: 200, evidence: "calculated_model", icon: "☀" },
];

export const missions: Mission[] = missionSeeds.map((mission, index) => ({
  ...mission,
  id: `mission-${index + 1}`,
  locked: index > 7,
}));

export const elements: ElementRecord[] = [
  { symbol: "H", name: "Hidrogênio", number: 1, mass: 1.008, group: "nonmetal", fact: "É o elemento mais abundante do Universo." },
  { symbol: "He", name: "Hélio", number: 2, mass: 4.003, group: "noble", fact: "Quase não reage com outros elementos." },
  { symbol: "Li", name: "Lítio", number: 3, mass: 6.94, group: "metal", fact: "É usado em muitas baterias recarregáveis." },
  { symbol: "Be", name: "Berílio", number: 4, mass: 9.012, group: "metal", fact: "É leve, rígido e exige manuseio especializado." },
  { symbol: "B", name: "Boro", number: 5, mass: 10.81, group: "metalloid", fact: "Ajuda a produzir vidros resistentes ao calor." },
  { symbol: "C", name: "Carbono", number: 6, mass: 12.011, group: "nonmetal", fact: "Forma a base química da vida conhecida." },
  { symbol: "N", name: "Nitrogênio", number: 7, mass: 14.007, group: "nonmetal", fact: "Compõe cerca de 78% do ar da Terra." },
  { symbol: "O", name: "Oxigênio", number: 8, mass: 15.999, group: "nonmetal", fact: "Participa da respiração e de combustões." },
  { symbol: "F", name: "Flúor", number: 9, mass: 18.998, group: "nonmetal", fact: "É muito reativo quando está isolado." },
  { symbol: "Ne", name: "Neônio", number: 10, mass: 20.18, group: "noble", fact: "Emite luz avermelhada em tubos elétricos." },
  { symbol: "Na", name: "Sódio", number: 11, mass: 22.99, group: "metal", fact: "No sal de cozinha, aparece ligado ao cloro." },
  { symbol: "Mg", name: "Magnésio", number: 12, mass: 24.305, group: "metal", fact: "É central na molécula de clorofila." },
  { symbol: "Al", name: "Alumínio", number: 13, mass: 26.982, group: "metal", fact: "Combina baixa densidade e boa resistência." },
  { symbol: "Si", name: "Silício", number: 14, mass: 28.085, group: "metalloid", fact: "É essencial em chips e comum em rochas." },
  { symbol: "P", name: "Fósforo", number: 15, mass: 30.974, group: "nonmetal", fact: "Faz parte do DNA e do ATP." },
  { symbol: "S", name: "Enxofre", number: 16, mass: 32.06, group: "nonmetal", fact: "Ocorre em minerais e proteínas." },
  { symbol: "Cl", name: "Cloro", number: 17, mass: 35.45, group: "nonmetal", fact: "Forma cloretos quando ganha um elétron." },
  { symbol: "Ar", name: "Argônio", number: 18, mass: 39.948, group: "noble", fact: "É um gás nobre presente no ar." },
  { symbol: "K", name: "Potássio", number: 19, mass: 39.098, group: "metal", fact: "Íons de potássio ajudam células nervosas." },
  { symbol: "Ca", name: "Cálcio", number: 20, mass: 40.078, group: "metal", fact: "Está em ossos, conchas e muitos minerais." },
  { symbol: "Fe", name: "Ferro", number: 26, mass: 55.845, group: "metal", fact: "Transporta oxigênio na hemoglobina." },
  { symbol: "Cu", name: "Cobre", number: 29, mass: 63.546, group: "metal", fact: "Conduz eletricidade com eficiência." },
  { symbol: "Zn", name: "Zinco", number: 30, mass: 65.38, group: "metal", fact: "Protege o aço contra corrosão." },
  { symbol: "Ag", name: "Prata", number: 47, mass: 107.868, group: "metal", fact: "É o melhor condutor elétrico entre os metais." },
];

export const planets: PlanetRecord[] = [
  {
    id: "mars", name: "Marte", subtitle: "O planeta vermelho", type: "rochoso",
    gravity: "3,71 m/s²", temperature: "−63 °C (média)", pressure: "0,6% da Terra", radiation: "Alta na superfície",
    atmosphere: [{ label: "CO₂", value: 95.3 }, { label: "N₂", value: 2.7 }, { label: "Ar", value: 1.6 }],
    materials: ["Basalto", "Óxidos de ferro", "Gelo de água", "Percloratos"], evidence: "observed", color: "#c96d45", landingMode: "pouso", source: "NASA Planetary Fact Sheet",
  },
  {
    id: "europa", name: "Europa", subtitle: "Lua oceânica de Júpiter", type: "lua",
    gravity: "1,31 m/s²", temperature: "−160 °C", pressure: "Quase vácuo", radiation: "Muito alta",
    atmosphere: [{ label: "O₂", value: 99 }, { label: "Outros", value: 1 }],
    materials: ["Gelo de água", "Sais", "Rocha silicatada", "Oceano inferido"], evidence: "inferred", color: "#d9c9a4", landingMode: "pouso", source: "NASA Europa Clipper",
  },
  {
    id: "jupiter", name: "Júpiter", subtitle: "Gigante de gás", type: "gigante gasoso",
    gravity: "24,79 m/s²", temperature: "−110 °C nas nuvens", pressure: "Cresce com a profundidade", radiation: "Extrema",
    atmosphere: [{ label: "H₂", value: 89.8 }, { label: "He", value: 10.2 }],
    materials: ["Hidrogênio", "Hélio", "Amônia", "Metano"], evidence: "observed", color: "#d9a97b", landingMode: "sonda", source: "NASA Jupiter Fact Sheet",
  },
  {
    id: "kepler", name: "Kepler-186f", subtitle: "Exoplaneta distante", type: "exoplaneta",
    gravity: "Não medida diretamente", temperature: "Modelo dependente da atmosfera", pressure: "Desconhecida", radiation: "Estimada",
    atmosphere: [{ label: "Composição", value: 100 }],
    materials: ["Raio observado", "Órbita observada", "Superfície desconhecida", "Atmosfera desconhecida"], evidence: "inferred", color: "#5b8f81", landingMode: "pouso", source: "NASA Exoplanet Archive",
  },
];

export const celestialBodies: CelestialBody[] = [
  { id: "earth", name: "Terra", kind: "planeta", massKg: 5.972e24, radiusM: 6.371e6, color: "#4c9ac7", atmosphere: true, evidence: "observed", description: "Planeta rochoso observado e medido." },
  { id: "moon", name: "Lua", kind: "lua", massKg: 7.342e22, radiusM: 1.737e6, color: "#d5d2c8", atmosphere: false, evidence: "observed", description: "Satélite natural da Terra." },
  { id: "mars", name: "Marte", kind: "planeta", massKg: 6.417e23, radiusM: 3.39e6, color: "#c96d45", atmosphere: true, evidence: "observed", description: "Planeta rochoso com atmosfera rarefeita." },
  { id: "ceres", name: "Ceres", kind: "asteroide", massKg: 9.383e20, radiusM: 4.73e5, color: "#a9a399", atmosphere: false, evidence: "observed", description: "Planeta anão do cinturão de asteroides." },
  { id: "halley", name: "Cometa Halley", kind: "cometa", massKg: 2.2e14, radiusM: 5.5e3, color: "#d8edf0", atmosphere: false, evidence: "observed", description: "Núcleo de gelo e poeira em órbita periódica." },
  { id: "theia", name: "Theia", kind: "planeta", massKg: 6.4e23, radiusM: 3.2e6, color: "#d8a56d", atmosphere: false, evidence: "hypothesis", description: "Protoplaneta proposto na hipótese do grande impacto." },
  { id: "black-hole", name: "Buraco negro estelar", kind: "buraco-negro", massKg: 1.989e31, radiusM: 2.95e4, color: "#050808", atmosphere: false, evidence: "observed", description: "Objeto compacto previsto pela relatividade e apoiado por múltiplas observações." },
  { id: "white-hole", name: "Buraco branco", kind: "buraco-branco", massKg: 1.989e31, radiusM: 2.95e4, color: "#f4f0d8", atmosphere: false, evidence: "hypothesis", description: "Solução matemática idealizada sem evidência observacional confirmada." },
  { id: "wormhole", name: "Buraco de minhoca", kind: "minhoca", massKg: 1e30, radiusM: 1e5, color: "#67b9a6", atmosphere: false, evidence: "hypothesis", description: "Atalho hipotético no espaço-tempo; estabilidade exigiria condições não demonstradas." },
  { id: "gravastar", name: "Gravastar", kind: "gravastar", massKg: 1.989e31, radiusM: 3.2e4, color: "#d09f45", atmosphere: false, evidence: "hypothesis", description: "Modelo especulativo de objeto compacto alternativo a um buraco negro." },
  { id: "fuzzball", name: "Fuzzball", kind: "fuzzball", massKg: 1.989e31, radiusM: 3e4, color: "#b76d53", atmosphere: false, evidence: "hypothesis", description: "Proposta da teoria das cordas para descrever microestados de buracos negros." },
  { id: "laser", name: "Pulso laser orbital", kind: "laser", massKg: 1, radiusM: 1, color: "#77e0c0", atmosphere: false, evidence: "fiction", energyOverrideJ: 1e22, description: "Artefato virtual de energia; não representa um dispositivo construível." },
  { id: "energy-bomb", name: "Bomba de energia virtual", kind: "bomba-virtual", massKg: 1e4, radiusM: 3, color: "#e2763e", atmosphere: false, evidence: "fiction", energyOverrideJ: 4e23, description: "Objeto inteiramente ficcional, sem materiais ou instruções de fabricação." },
  { id: "ufo", name: "OVNI simulado", kind: "ovni", massKg: 2e5, radiusM: 12, color: "#b9d6cf", atmosphere: false, evidence: "fiction", description: "Veículo narrativo inventado; OVNI significa apenas objeto não identificado." },
];

export const uapCases: UapCase[] = [
  { id: "uap-1", title: "Luzes em formação", place: "Órbita baixa da Terra", signal: "Pontos luminosos atravessam o céu em linha.", evidence: ["Movimento constante", "Sem mudança brusca", "Horário conhecido"], answer: "Satélites", explanation: "Uma sequência de satélites pode refletir luz solar e parecer uma formação misteriosa." },
  { id: "uap-2", title: "Clarão esverdeado", place: "Atmosfera de Marte", signal: "Um sensor registra um risco verde por 0,8 segundo.", evidence: ["Registro em uma câmera", "Traço alongado", "Alta velocidade aparente"], answer: "Meteoro", explanation: "A forma, a duração e a velocidade são compatíveis com material aquecido ao atravessar a atmosfera." },
  { id: "uap-3", title: "Pulso impossível?", place: "Sistema Kepler-186", signal: "Três pulsos de rádio aparecem, mas não se repetem.", evidence: ["Sinal fraco", "Uma única antena", "Sem repetição independente"], answer: "Dados insuficientes", explanation: "Sem repetição ou confirmação por outro instrumento, não existe evidência suficiente para identificar a origem." },
];

export const evidenceLabels: Record<string, { label: string; icon: string }> = {
  observed: { label: "Dado observado", icon: "●" },
  calculated_model: { label: "Modelo calculado", icon: "∑" },
  inferred: { label: "Inferência científica", icon: "◇" },
  hypothesis: { label: "Hipótese", icon: "?" },
  fiction: { label: "Ficção", icon: "✦" },
};
