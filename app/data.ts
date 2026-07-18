import type {
  Avatar,
  CelestialBody,
  ElementRecord,
  Mission,
  MissionChallenge,
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

export const missionChallenges: Record<string, MissionChallenge> = {
  "mission-1": { question: "Qual proporção mantém o cristal de NaCl eletricamente neutro?", choices: ["1 Na⁺ para 1 Cl⁻", "2 Na⁺ para 1 Cl⁻", "1 Na⁺ para 2 Cl⁻"], correctChoice: 0, variable: { label: "Razão Na⁺ : Cl⁻", min: .5, max: 2, step: .5, start: 1.5, unit: ":1", idealMin: 1, idealMax: 1 }, lowResult: "Faltam cargas positivas para neutralizar os cloretos.", idealResult: "As cargas +1 e −1 se equilibram e uma rede iônica neutra pode se repetir.", highResult: "Sobram cargas positivas: a proporção não representa NaCl neutro.", explanation: "O sal sólido é uma rede de íons alternados. Sua fórmula mostra a menor razão inteira que conserva carga.", researcherNote: "A energia de rede estabiliza o cristal; não existem moléculas isoladas de NaCl no sólido comum.", source: "IUPAC Gold Book · ionic solid" },
  "mission-2": { question: "Quantos hidrogênios completam uma molécula de água com um oxigênio?", choices: ["1", "2", "3"], correctChoice: 1, variable: { label: "Átomos de H para 1 O", min: 0, max: 4, step: 1, start: 1, unit: " H", idealMin: 2, idealMax: 2 }, lowResult: "O conjunto ainda não corresponde à fórmula da água.", idealResult: "H₂O: dois H compartilham elétrons com um O em geometria angular.", highResult: "Átomos extras não cabem na estrutura neutra de uma única molécula de água.", explanation: "O oxigênio costuma formar duas ligações covalentes; cada hidrogênio forma uma.", researcherNote: "Os dois pares de elétrons não ligantes do O ajudam a produzir o ângulo H–O–H de aproximadamente 104,5°.", source: "PubChem CID 962 · Water" },
  "mission-3": { question: "O que precisa ser conservado ao balancear uma reação química?", choices: ["Cada tipo de átomo", "O número de moléculas", "O estado físico"], correctChoice: 0, variable: { label: "Coeficiente de H₂O em 2H₂ + O₂ → ?H₂O", min: 1, max: 4, step: 1, start: 1, unit: "", idealMin: 2, idealMax: 2 }, lowResult: "Há menos H e O nos produtos do que nos reagentes.", idealResult: "2H₂ + O₂ → 2H₂O conserva 4 H e 2 O nos dois lados.", highResult: "O produto agora contém mais átomos do que os reagentes fornecem.", explanation: "Balancear muda coeficientes, nunca os índices dentro das fórmulas.", researcherNote: "A conservação decorre do rearranjo de núcleos e elétrons; reações químicas comuns não criam elementos novos.", source: "IUPAC · stoichiometric number" },
  "mission-4": { question: "A 1 atm, o que acontece com água líquida ao atingir cerca de 100 °C?", choices: ["Entra em ebulição", "Congela", "Vira plasma"], correctChoice: 0, variable: { label: "Temperatura da água a 1 atm", min: -20, max: 140, step: 10, start: 40, unit: " °C", idealMin: 100, idealMax: 140 }, lowResult: "Abaixo da ebulição, a amostra permanece sólida ou líquida conforme a temperatura.", idealResult: "Bolhas de vapor se formam em todo o líquido: ocorreu ebulição.", highResult: "", explanation: "O ponto de ebulição depende da pressão: em grandes altitudes ele é menor que 100 °C.", researcherNote: "Durante a mudança de fase, energia entra como calor latente sem elevar imediatamente a temperatura.", source: "NIST Chemistry WebBook · Water phase change" },
  "mission-5": { question: "Uma órbita circular é melhor descrita como…", choices: ["Queda contínua ao redor do planeta", "Ausência de gravidade", "Movimento sem aceleração"], correctChoice: 0, variable: { label: "Velocidade orbital a ~400 km da Terra", min: 2, max: 12, step: .1, start: 5, unit: " km/s", idealMin: 7.6, idealMax: 7.9 }, lowResult: "A velocidade é pequena: a trajetória intercepta a atmosfera e cai.", idealResult: "A curvatura da queda acompanha a Terra: órbita baixa aproximadamente estável.", highResult: "A trajetória sobe para uma órbita mais alta ou pode escapar, conforme a velocidade.", explanation: "Gravidade continua agindo em órbita; astronautas flutuam porque nave e tripulação caem juntas.", researcherNote: "Para órbita circular, v≈√(GM/r). O modelo ignora arrasto e irregularidades gravitacionais.", source: "NASA · Basics of Space Flight" },
  "mission-6": { question: "Se soltarmos objetos de massas diferentes no mesmo lugar, sem ar, eles…", choices: ["Caem com a mesma aceleração", "O mais pesado cai mais rápido", "Ficam parados"], correctChoice: 0, variable: { label: "Gravidade escolhida para a Lua", min: 0, max: 4, step: .1, start: 3, unit: " m/s²", idealMin: 1.5, idealMax: 1.7 }, lowResult: "O valor está abaixo da gravidade lunar medida.", idealResult: "1,62 m/s²: a queda lunar acelera cerca de seis vezes menos que na Terra.", highResult: "O valor está alto demais para a superfície da Lua.", explanation: "Massa inercial e massa gravitacional produzem a mesma aceleração quando a resistência do ar é desprezível.", researcherNote: "A equivalência entre queda livre e ausência local de peso é central na relatividade geral.", source: "NASA Moon Fact Sheet" },
  "mission-7": { question: "Qual material reduz melhor a passagem de calor?", choices: ["Baixa condutividade térmica", "Alta condutividade térmica", "Maior brilho"], correctChoice: 0, variable: { label: "Calor que atravessa o painel", min: 0, max: 100, step: 5, start: 55, unit: "%", idealMin: 0, idealMax: 15 }, lowResult: "Pouco calor atravessa: o painel funciona como isolante.", idealResult: "Pouco calor atravessa: o painel funciona como isolante.", highResult: "Muito calor atravessa; escolha menor transferência para proteger a cabine.", explanation: "Condução, convecção e radiação transferem energia de maneiras diferentes.", researcherNote: "Na condução unidimensional, a taxa é proporcional a k·A·ΔT/L.", source: "NIST · thermal conductivity reference data" },
  "mission-8": { question: "Por que som não viaja no vácuo?", choices: ["Precisa de partículas para transmitir vibração", "É lento demais", "A gravidade bloqueia"], correctChoice: 0, variable: { label: "Densidade de partículas no tubo", min: 0, max: 100, step: 5, start: 0, unit: "%", idealMin: 35, idealMax: 100 }, lowResult: "Com quase nenhuma partícula, a vibração não encontra meio para se propagar.", idealResult: "As partículas transmitem a perturbação; o sensor detecta a onda sonora.", highResult: "", explanation: "Som é uma onda mecânica. Luz é eletromagnética e pode atravessar o vácuo.", researcherNote: "A velocidade do som depende da elasticidade e densidade do meio, não apenas da quantidade de matéria.", source: "NASA Glenn · Sound waves" },
  "mission-9": { question: "Qual organela produz a maior parte do ATP em células animais?", choices: ["Mitocôndria", "Núcleo", "Lisossomo"], correctChoice: 0, variable: { label: "Energia disponível para a célula", min: 0, max: 100, step: 5, start: 20, unit: "%", idealMin: 45, idealMax: 65 }, lowResult: "A célula reduz transporte, síntese e manutenção por falta de energia.", idealResult: "A produção atende às tarefas celulares sem excesso no modelo.", highResult: "Energia não é armazenada indefinidamente; produção e consumo precisam se regular.", explanation: "Mitocôndrias convertem energia química de nutrientes em ATP por respiração celular.", researcherNote: "A cadeia transportadora de elétrons cria um gradiente de prótons usado pela ATP sintase.", source: "OpenStax Biology 2e · Cellular respiration" },
  "mission-10": { question: "Na osmose, a água tende a atravessar a membrana em direção a…", choices: ["Maior concentração efetiva de solutos", "Menor temperatura", "Maior volume sempre"], correctChoice: 0, variable: { label: "Concentração externa de soluto", min: 0, max: 10, step: .5, start: 2, unit: "%", idealMin: 4.5, idealMax: 5.5 }, lowResult: "O meio externo é hipotônico; água entra e a célula incha.", idealResult: "As concentrações efetivas se equilibram e não há fluxo líquido de água.", highResult: "O meio externo é hipertônico; água sai e a célula encolhe.", explanation: "Moléculas de água atravessam nos dois sentidos; equilíbrio significa fluxos médios iguais.", researcherNote: "Pressão osmótica ideal pode ser aproximada por π=iMRT.", source: "OpenStax Biology 2e · Passive transport" },
  "mission-11": { question: "Qual base do RNA pareia com adenina durante a transcrição?", choices: ["Uracila", "Timina", "Guanina"], correctChoice: 0, variable: { label: "Códons completos enviados ao ribossomo", min: 0, max: 6, step: 1, start: 1, unit: "", idealMin: 3, idealMax: 3 }, lowResult: "A mensagem está incompleta e não codifica a sequência prevista.", idealResult: "Três códons formam uma mensagem legível pelo ribossomo no desafio.", highResult: "Códons extras mudariam o tamanho e possivelmente a função do peptídeo.", explanation: "Na transcrição, RNA é produzido a partir de uma fita molde de DNA.", researcherNote: "O código genético é degenerado: aminoácidos podem ser especificados por mais de um códon.", source: "NCBI Bookshelf · From DNA to RNA" },
  "mission-12": { question: "O que sustenta a entrada de energia em quase toda cadeia alimentar?", choices: ["Produtores", "Decompositores apenas", "Predadores de topo"], correctChoice: 0, variable: { label: "População de produtores", min: 0, max: 100, step: 5, start: 25, unit: "%", idealMin: 50, idealMax: 70 }, lowResult: "Pouca energia entra no sistema; consumidores diminuem.", idealResult: "Produtores sustentam consumidores e deixam matéria para decompositores.", highResult: "Excesso sem consumidores aumenta competição e pode esgotar recursos.", explanation: "Ecossistemas são redes dinâmicas; energia flui e matéria é reciclada.", researcherNote: "A transferência de energia entre níveis tróficos é ineficiente e varia muito entre ecossistemas.", source: "OpenStax Biology 2e · Ecosystems" },
  "mission-13": { question: "Em um circuito simples, aumentar a resistência com tensão fixa faz a corrente…", choices: ["Diminuir", "Aumentar", "Ficar sempre igual"], correctChoice: 0, variable: { label: "Resistor para LED em fonte de 9 V", min: 100, max: 1000, step: 50, start: 150, unit: " Ω", idealMin: 300, idealMax: 500 }, lowResult: "Resistência pequena permite corrente alta demais no modelo do LED.", idealResult: "A corrente fica em uma faixa educativa segura para o LED virtual.", highResult: "A corrente fica tão baixa que o LED virtual quase não emite luz.", explanation: "A Lei de Ohm relaciona tensão, corrente e resistência: V=RI.", researcherNote: "Para um LED, use a queda de tensão do componente: R≈(Vfonte−VLED)/I.", source: "NIST SI · electrical units; educational circuit model" },
  "mission-14": { question: "Para reduzir a massa de uma nave sem perder rigidez, buscamos…", choices: ["Alta resistência específica", "Maior densidade sempre", "Menor ponto de fusão"], correctChoice: 0, variable: { label: "Densidade do material estrutural", min: .5, max: 9, step: .5, start: 7.5, unit: " g/cm³", idealMin: 1.5, idealMax: 3 }, lowResult: "Muito leve, mas o modelo pede verificar se a rigidez é suficiente.", idealResult: "Faixa de ligas leves e compósitos; ainda é preciso comparar resistência e temperatura.", highResult: "O material pode ser forte, porém adiciona muita massa à nave.", explanation: "Engenharia escolhe materiais por várias propriedades ao mesmo tempo, não por um único ranking.", researcherNote: "Resistência específica divide resistência mecânica pela densidade e ajuda a comparar estruturas leves.", source: "NASA Materials and Processes Technical Information System" },
  "mission-15": { question: "Um robô deve reagir a ruído de sensor isolado?", choices: ["Não; deve confirmar leituras", "Sim; qualquer pico é verdade", "Sensores nunca erram"], correctChoice: 0, variable: { label: "Confiança mínima para avançar", min: 0, max: 100, step: 5, start: 20, unit: "%", idealMin: 60, idealMax: 80 }, lowResult: "O robô aceita muito ruído e toma decisões instáveis.", idealResult: "A confiança exige evidências repetidas sem tornar o robô excessivamente lento.", highResult: "O limiar extremo rejeita quase tudo e paralisa a exploração.", explanation: "Sensores têm ruído, limites e falhas; combinar leituras melhora decisões.", researcherNote: "Filtragem e fusão sensorial estimam estado com incerteza em vez de tratar medições como verdades exatas.", source: "NASA Systems Engineering Handbook · sensors and uncertainty" },
  "mission-16": { question: "Por que uma microrrede combina fontes diferentes?", choices: ["Para equilibrar variação e demanda", "Porque toda fonte produz sempre igual", "Para eliminar armazenamento"], correctChoice: 0, variable: { label: "Participação variável de solar + eólica", min: 0, max: 100, step: 5, start: 30, unit: "%", idealMin: 60, idealMax: 80 }, lowResult: "A rede usa pouca fonte renovável no cenário.", idealResult: "A mistura reduz emissões e mantém reserva para períodos sem sol ou vento.", highResult: "Sem armazenamento e fontes firmes suficientes, a rede pode faltar energia em alguns horários.", explanation: "Uma rede confiável equilibra geração, consumo, armazenamento e transmissão a cada instante.", researcherNote: "Variabilidade, fator de capacidade e despacho são diferentes; o modelo não calcula fluxo de potência completo.", source: "NREL · Microgrids and renewable integration" },
};

const elementSeeds: Array<[string, string, number]> = [
  ["H","Hidrogênio",1.008],["He","Hélio",4.003],["Li","Lítio",6.94],["Be","Berílio",9.012],["B","Boro",10.81],["C","Carbono",12.011],["N","Nitrogênio",14.007],["O","Oxigênio",15.999],["F","Flúor",18.998],["Ne","Neônio",20.180],
  ["Na","Sódio",22.990],["Mg","Magnésio",24.305],["Al","Alumínio",26.982],["Si","Silício",28.085],["P","Fósforo",30.974],["S","Enxofre",32.06],["Cl","Cloro",35.45],["Ar","Argônio",39.948],["K","Potássio",39.098],["Ca","Cálcio",40.078],
  ["Sc","Escândio",44.956],["Ti","Titânio",47.867],["V","Vanádio",50.942],["Cr","Cromo",51.996],["Mn","Manganês",54.938],["Fe","Ferro",55.845],["Co","Cobalto",58.933],["Ni","Níquel",58.693],["Cu","Cobre",63.546],["Zn","Zinco",65.38],
  ["Ga","Gálio",69.723],["Ge","Germânio",72.630],["As","Arsênio",74.922],["Se","Selênio",78.971],["Br","Bromo",79.904],["Kr","Criptônio",83.798],["Rb","Rubídio",85.468],["Sr","Estrôncio",87.62],["Y","Ítrio",88.906],["Zr","Zircônio",91.224],
  ["Nb","Nióbio",92.906],["Mo","Molibdênio",95.95],["Tc","Tecnécio",98],["Ru","Rutênio",101.07],["Rh","Ródio",102.906],["Pd","Paládio",106.42],["Ag","Prata",107.868],["Cd","Cádmio",112.414],["In","Índio",114.818],["Sn","Estanho",118.710],
  ["Sb","Antimônio",121.760],["Te","Telúrio",127.60],["I","Iodo",126.904],["Xe","Xenônio",131.293],["Cs","Césio",132.905],["Ba","Bário",137.327],["La","Lantânio",138.905],["Ce","Cério",140.116],["Pr","Praseodímio",140.908],["Nd","Neodímio",144.242],
  ["Pm","Promécio",145],["Sm","Samário",150.36],["Eu","Európio",151.964],["Gd","Gadolínio",157.25],["Tb","Térbio",158.925],["Dy","Disprósio",162.500],["Ho","Hólmio",164.930],["Er","Érbio",167.259],["Tm","Túlio",168.934],["Yb","Itérbio",173.045],
  ["Lu","Lutécio",174.967],["Hf","Háfnio",178.49],["Ta","Tântalo",180.948],["W","Tungstênio",183.84],["Re","Rênio",186.207],["Os","Ósmio",190.23],["Ir","Irídio",192.217],["Pt","Platina",195.084],["Au","Ouro",196.967],["Hg","Mercúrio",200.592],
  ["Tl","Tálio",204.38],["Pb","Chumbo",207.2],["Bi","Bismuto",208.980],["Po","Polônio",209],["At","Astato",210],["Rn","Radônio",222],["Fr","Frâncio",223],["Ra","Rádio",226],["Ac","Actínio",227],["Th","Tório",232.038],
  ["Pa","Protactínio",231.036],["U","Urânio",238.029],["Np","Netúnio",237],["Pu","Plutônio",244],["Am","Amerício",243],["Cm","Cúrio",247],["Bk","Berquélio",247],["Cf","Califórnio",251],["Es","Einstênio",252],["Fm","Férmio",257],
  ["Md","Mendelévio",258],["No","Nobélio",259],["Lr","Laurêncio",266],["Rf","Rutherfórdio",267],["Db","Dúbnio",268],["Sg","Seabórgio",269],["Bh","Bóhrio",270],["Hs","Hássio",269],["Mt","Meitnério",278],["Ds","Darmstádtio",281],
  ["Rg","Roentgênio",282],["Cn","Copernício",285],["Nh","Nihônio",286],["Fl","Fleróvio",289],["Mc","Moscóvio",290],["Lv","Livermório",293],["Ts","Tenessino",294],["Og","Oganessônio",294],
];

const nobleNumbers = new Set([2, 10, 18, 36, 54, 86, 118]);
const metalloidNumbers = new Set([5, 14, 32, 33, 51, 52, 84]);
const nonmetalNumbers = new Set([1, 6, 7, 8, 9, 15, 16, 17, 34, 35, 53, 85, 117]);
const gasNumbers = new Set([1, 2, 7, 8, 9, 10, 17, 18, 36, 54, 86]);
const liquidNumbers = new Set([35, 80]);
const factOverrides: Record<string, string> = {
  H: "É o elemento mais abundante do Universo e alimenta as estrelas.", C: "Suas ligações variadas formam a base química da vida conhecida.", N: "Compõe cerca de 78% do ar da Terra.", O: "Participa da respiração celular e de muitas combustões.", Na: "No sal de cozinha, aparece como íon ligado ao cloreto.", Mg: "Ocupa o centro da molécula de clorofila.", Si: "É comum nas rochas e essencial em chips.", P: "Faz parte do DNA, do ATP e das membranas celulares.", Fe: "Está no núcleo terrestre e ajuda a hemoglobina a transportar oxigênio.", Cu: "Conduz eletricidade com eficiência.", Nb: "O Brasil possui grandes reservas; suas ligas suportam condições extremas.", Ag: "É o melhor condutor elétrico entre os metais.", Au: "É pouco reativo e pode ser encontrado na forma metálica.", U: "Seus isótopos ajudam a estudar radioatividade e energia nuclear.", Og: "Foi produzido átomo por átomo; suas propriedades ainda são pouco conhecidas.",
};

function periodFor(number: number) {
  return number <= 2 ? 1 : number <= 10 ? 2 : number <= 18 ? 3 : number <= 36 ? 4 : number <= 54 ? 5 : number <= 86 ? 6 : 7;
}

export const elements: ElementRecord[] = elementSeeds.map(([symbol, name, mass], index) => {
  const number = index + 1;
  const group = nobleNumbers.has(number) ? "noble" : metalloidNumbers.has(number) ? "metalloid" : nonmetalNumbers.has(number) ? "nonmetal" : "metal";
  const category = number >= 57 && number <= 71 ? "Lantanídeo" : number >= 89 && number <= 103 ? "Actinídeo" : group === "noble" ? "Gás nobre" : group === "metalloid" ? "Semimetal" : group === "nonmetal" ? "Não metal" : number > 92 ? "Elemento sintético" : "Metal";
  const state = number > 108 ? "desconhecido" : gasNumbers.has(number) ? "gás" : liquidNumbers.has(number) ? "líquido" : "sólido";
  const fact = factOverrides[symbol] ?? (number > 92 ? "É produzido artificialmente e estudado em quantidades minúsculas." : group === "noble" ? "Sua camada eletrônica externa completa reduz sua reatividade." : group === "metal" ? "Seus elétrons podem se mover ou ser compartilhados em ligações metálicas." : "Pode formar ligações covalentes ao compartilhar elétrons.");
  const use = number > 92 ? "Pesquisa sobre núcleos atômicos e os limites da tabela periódica." : group === "noble" ? "Iluminação, atmosferas controladas ou pesquisa, conforme o elemento." : group === "metal" ? "Materiais, ligas, eletrônica ou processos biológicos, conforme o elemento." : "Moléculas, minerais, vida ou tecnologia, conforme suas ligações.";
  return { symbol, name, number, mass, group, fact, category, period: periodFor(number), state, use };
});

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
