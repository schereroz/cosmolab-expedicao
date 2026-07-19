"use client";

import { useState } from "react";
import Image from "next/image";
import { avatars, evidenceLabels, planets } from "../data";
import type { GameProfile, PlanetRecord } from "../types";
import { ActivityGuide } from "./ActivityGuide";
import { PlanetaryFieldLab } from "./PlanetaryFieldLab";
import { SciencePassport } from "./SciencePassport";

const tools = [
  { id: "spectrometer", icon: "⌁", label: "Espectrômetro" },
  { id: "microscope", icon: "⊕", label: "Microscópio" },
  { id: "seismic", icon: "≋", label: "Sismógrafo" },
  { id: "magnetic", icon: "∩", label: "Magnetômetro" },
] as const;
type ToolId = typeof tools[number]["id"];
interface InstrumentReading { title: string; summary: string; rows: Array<{ label: string; display: string; level: number }>; method: string; }

const fieldTips: Record<ToolId, string> = {
  spectrometer: "Vamos procurar padrões de luz. Cada substância interage com comprimentos de onda de um jeito característico.",
  microscope: "Uma imagem mostra forma e textura, mas precisamos cruzá-la com outros instrumentos antes de concluir a composição.",
  seismic: "As ondas mudam ao atravessar camadas diferentes. É assim que investigamos um interior que não conseguimos ver.",
  magnetic: "Um campo magnético pode revelar materiais condutores e processos internos — mas não responde tudo sozinho.",
};

const instrumentReadings: Record<string, Record<ToolId, InstrumentReading>> = {
  mars: {
    spectrometer: { title: "Assinaturas da atmosfera", summary: "O dióxido de carbono domina a atmosfera rarefeita; argônio e nitrogênio aparecem em proporções muito menores.", rows: [{ label: "CO₂", display: "95,3%", level: 95 }, { label: "N₂", display: "2,7%", level: 3 }, { label: "Ar", display: "1,6%", level: 2 }], method: "Espectroscopia compara comprimentos de onda absorvidos ou emitidos com assinaturas de referência." },
    microscope: { title: "Grãos do regolito", summary: "A amostra virtual mostra fragmentos basálticos e óxidos de ferro; percloratos foram detectados em diferentes locais de Marte.", rows: [{ label: "Silicatos", display: "abundantes", level: 76 }, { label: "Óxidos de ferro", display: "detectados", level: 48 }, { label: "Percloratos", display: "traços locais", level: 15 }], method: "Microscopia identifica forma e textura; composição exige combinar outras técnicas." },
    seismic: { title: "Interior marciano", summary: "Dados da missão InSight indicam crosta, manto e núcleo líquido maiores e menos densos que estimativas antigas.", rows: [{ label: "Crosta", display: "~24–72 km", level: 18 }, { label: "Manto", display: "~1.560 km", level: 66 }, { label: "Núcleo", display: "~1.830 km raio", level: 82 }], method: "Ondas sísmicas mudam de velocidade e direção ao atravessar materiais distintos." },
    magnetic: { title: "Magnetismo remanente", summary: "Marte não possui hoje um campo dipolar global como a Terra, mas rochas antigas preservam magnetização regional.", rows: [{ label: "Campo global", display: "muito fraco", level: 5 }, { label: "Anomalias crustais", display: "fortes localmente", level: 62 }], method: "O magnetômetro mede intensidade e direção do campo no local da sonda." },
  },
  europa: {
    spectrometer: { title: "Gelo e moléculas superficiais", summary: "Gelo de água domina; sais e outras espécies são investigados por seus espectros. A atmosfera de O₂ é extremamente tênue.", rows: [{ label: "Gelo de H₂O", display: "dominante", level: 92 }, { label: "Sais", display: "prováveis", level: 38 }, { label: "O₂ tênue", display: "detectado", level: 8 }], method: "A superfície irradiada altera moléculas; a assinatura não revela sozinha a origem do material." },
    microscope: { title: "Textura do gelo", summary: "Fendas, blocos e terrenos caóticos sugerem renovação da crosta gelada, mas nenhuma amostra microscópica foi coletada in situ.", rows: [{ label: "Gelo cristalino", display: "observado remotamente", level: 76 }, { label: "Partículas de sal", display: "inferidas", level: 34 }], method: "Esta ampliação é um modelo baseado em sensoriamento remoto, não uma fotografia microscópica real." },
    seismic: { title: "Casca e oceano inferidos", summary: "O oceano subterrâneo é apoiado por modelos geofísicos e campo magnético induzido; sua espessura exata continua incerta.", rows: [{ label: "Casca de gelo", display: "~15–25 km (modelo)", level: 24 }, { label: "Oceano", display: "~60–150 km (modelo)", level: 72 }, { label: "Interior rochoso", display: "inferido", level: 58 }], method: "Ainda não há uma rede sísmica em Europa; os valores são estimativas de modelos." },
    magnetic: { title: "Campo induzido", summary: "A variação do campo de Júpiter induz uma resposta compatível com uma camada condutora — provavelmente um oceano salgado.", rows: [{ label: "Sinal induzido", display: "detectado", level: 74 }, { label: "Confiança no oceano", display: "alta, não direta", level: 83 }], method: "Indução magnética informa condutividade, não identifica diretamente todas as substâncias." },
  },
  jupiter: {
    spectrometer: { title: "Nuvens e atmosfera profunda", summary: "Hidrogênio e hélio dominam; metano, amônia, água e outras espécies aparecem em menores quantidades.", rows: [{ label: "H₂", display: "~89,8%", level: 90 }, { label: "He", display: "~10,2%", level: 10 }, { label: "CH₄ + NH₃", display: "traços", level: 4 }], method: "A profundidade observada depende do comprimento de onda e da opacidade das nuvens." },
    microscope: { title: "Aerossóis das nuvens", summary: "Não existe amostra de solo: a sonda examina gotículas, cristais e partículas suspensas em camadas atmosféricas.", rows: [{ label: "Cristais de amônia", display: "camadas altas", level: 68 }, { label: "Água", display: "nuvens profundas", level: 36 }], method: "É uma leitura de partículas atmosféricas; Júpiter não tem superfície sólida convencional." },
    seismic: { title: "Oscilações e interior", summary: "Sem pouso sólido, o interior é estimado por gravidade, campo magnético, ondas atmosféricas e modelos de alta pressão.", rows: [{ label: "Envelope molecular", display: "externo", level: 35 }, { label: "H metálico", display: "profundo", level: 72 }, { label: "Núcleo diluído", display: "modelo", level: 54 }], method: "O gráfico representa camadas estimadas; fronteiras reais podem ser graduais." },
    magnetic: { title: "Magnetosfera gigante", summary: "O campo de Júpiter é o mais forte entre os planetas do Sistema Solar e cria regiões de radiação extrema.", rows: [{ label: "Intensidade equatorial", display: "~4,3 gauss", level: 86 }, { label: "Radiação local", display: "extrema", level: 96 }], method: "A intensidade varia muito com posição e tempo; o valor é uma referência aproximada." },
  },
  kepler: {
    spectrometer: { title: "Atmosfera ainda desconhecida", summary: "Não há espectro atmosférico confirmado de Kepler-186f. Qualquer composição exibida como gás específico seria especulação.", rows: [{ label: "Raio planetário", display: "observado", level: 74 }, { label: "Atmosfera", display: "sem detecção", level: 0 }], method: "Trânsitos medem principalmente o tamanho relativo; espectroscopia exigiria sinal muito mais detalhado." },
    microscope: { title: "Sem amostra disponível", summary: "Nenhuma nave visitou este sistema. Superfície, minerais e possíveis oceanos permanecem desconhecidos.", rows: [{ label: "Amostra física", display: "inexistente", level: 0 }, { label: "Modelo rochoso", display: "possível", level: 28 }], method: "A tela evita transformar ilustrações de exoplanetas em dados observados." },
    seismic: { title: "Interior não medido", summary: "Massa e estrutura interna não foram medidas diretamente; modelos dependem de composição e história de formação assumidas.", rows: [{ label: "Massa", display: "não medida", level: 0 }, { label: "Estrutura", display: "hipotética", level: 12 }], method: "Sem massa e resposta sísmica, qualquer camada interna é apenas um cenário de hipótese." },
    magnetic: { title: "Campo magnético desconhecido", summary: "Não existe detecção do campo magnético de Kepler-186f nem medição direta do vento estelar no planeta.", rows: [{ label: "Campo planetário", display: "desconhecido", level: 0 }, { label: "Proteção atmosférica", display: "não determinada", level: 0 }], method: "Ausência de dado não significa campo ausente; significa que ainda não conseguimos medi-lo." },
  },
};

export function PlanetSurvey({ initialPlanet, mode, avatarId, onClose }: { initialPlanet: PlanetRecord; mode: GameProfile["ageBand"]; avatarId: string; onClose: () => void }) {
  const [planet, setPlanet] = useState(initialPlanet);
  const [activeTool, setActiveTool] = useState<ToolId>("spectrometer");
  const [expeditionMode, setExpeditionMode] = useState<"survey" | "field">("survey");
  const evidence = evidenceLabels[planet.evidence];
  const instrumentReading = instrumentReadings[planet.id][activeTool];
  const fieldCompanion = avatars.find((avatar) => avatar.id === avatarId) ?? avatars[0];

  return (
    <section className="planet-survey" aria-labelledby="planet-title">
      <div className="planet-hero">
        <div className="planet-stars" aria-hidden="true" />
        <button className="close-button" onClick={onClose} aria-label="Fechar análise planetária">×</button>
        <div className={`planet-sphere planet-${planet.id}`} aria-hidden="true"><span /></div>
        <div className="planet-identity">
          <p className="eyebrow">Expedição planetária · {planet.landingMode === "pouso" ? "pouso autorizado" : "descida de sonda"}</p>
          <h1 id="planet-title">{planet.name}</h1>
          <p>{planet.subtitle}</p>
          <span className={`evidence-chip evidence-${planet.evidence}`}><b>{evidence.icon}</b>{evidence.label}</span>
        </div>
        <div className="planet-switcher">
          {planets.map((item) => <button key={item.id} className={item.id === planet.id ? "active" : ""} onClick={() => setPlanet(item)}>{item.name}</button>)}
        </div>
      </div>

      <div className="planet-guide">{expeditionMode === "survey" ? <ActivityGuide title="Análise planetária" goal="Usar instrumentos para separar o que foi medido, inferido ou ainda é desconhecido." steps={["Escolha um mundo", "Ative um instrumento", "Compare ambiente e materiais", "Confira as fontes"]} reward="Explique se o ambiente poderia sustentar vida conhecida sem afirmar além dos dados." /> : <ActivityGuide title="Laboratório de campo" goal="Alterar uma variável virtual e comparar a sua hipótese com o modelo." steps={["Escolha uma amostra", "Adicione uma substância", "Registre sua hipótese", "Execute e compare"]} reward="Descubra uma transformação e explique o nível de evidência sem confundir modelo com fato." />}</div>

      <nav className="planet-experience-tabs" aria-label="Modo da expedição">
        <button className={expeditionMode === "survey" ? "active" : ""} onClick={() => setExpeditionMode("survey")} aria-pressed={expeditionMode === "survey"}><span>01</span><div><strong>Painel científico</strong><small>Meça composição e ambiente</small></div></button>
        <button className={expeditionMode === "field" ? "active" : ""} onClick={() => setExpeditionMode("field")} aria-pressed={expeditionMode === "field"}><span>02</span><div><strong>{planet.landingMode === "sonda" ? "Laboratório da sonda" : "Laboratório de campo"}</strong><small>Interaja com objetos e substâncias</small></div></button>
      </nav>

      {expeditionMode === "field" ? <PlanetaryFieldLab key={planet.id} planet={planet} companionName={fieldCompanion.name} /> : <div className="survey-body">
        <aside className="instrument-panel">
          <h2>Instrumentos</h2>
          <p>Selecione uma ferramenta para examinar este mundo.</p>
          {tools.map((tool) => (
            <button key={tool.id} className={activeTool === tool.id ? "active" : ""} onClick={() => setActiveTool(tool.id)}>
              <span aria-hidden="true">{tool.icon}</span>{tool.label}<b aria-hidden="true">→</b>
            </button>
          ))}
          <div className="avatar-on-planet"><Image src="/cosmolab-crew-cockpit.png" alt="Tripulação animal da CosmoLab na cabine" width={1672} height={941} /><div><small>Companheiro de campo</small><strong>{fieldCompanion.name}</strong><span>{fieldCompanion.role}</span></div></div>
        </aside>

        <div className="survey-content">
          <aside className="field-companion-tip" aria-live="polite"><strong>{fieldCompanion.name} observou:</strong><p>{fieldTips[activeTool]}</p></aside>
          <div className="survey-heading"><div><p className="eyebrow">Leitura do {tools.find((tool) => tool.id === activeTool)?.label}</p><h2>Composição e ambiente</h2></div><span className="live-reading"><i /> leitura concluída</span></div>
          <section className="instrument-reading-card" key={`${planet.id}-${activeTool}`} aria-labelledby="instrument-reading-title"><div className="instrument-reading-head"><div><small>LEITURA INSTRUMENTAL ESPECÍFICA</small><h3 id="instrument-reading-title">{instrumentReading.title}</h3></div><span>{tools.find((tool) => tool.id === activeTool)?.icon}</span></div><p>{instrumentReading.summary}</p><div className="instrument-bars">{instrumentReading.rows.map((row) => <div key={row.label}><span><b>{row.label}</b><small>{row.display}</small></span><meter min="0" max="100" value={row.level}>{row.level}%</meter></div>)}</div><div className="instrument-method"><strong>Como o instrumento sabe?</strong><p>{instrumentReading.method}</p></div></section>
          <div className="environment-grid">
            <article><span>g</span><small>Gravidade</small><strong>{planet.gravity}</strong></article>
            <article><span>°</span><small>Temperatura</small><strong>{planet.temperature}</strong></article>
            <article><span>P</span><small>Pressão</small><strong>{planet.pressure}</strong></article>
            <article><span>☢</span><small>Radiação</small><strong>{planet.radiation}</strong></article>
          </div>

          <div className="analysis-grid">
            <article className="atmosphere-card">
              <h3>Atmosfera</h3>
              {planet.atmosphere.map((item) => (
                <div className="composition-row" key={item.label}>
                  <span><b>{item.label}</b><small>{item.value}%</small></span>
                  <div><i className={`composition-fill composition-${item.label.toLowerCase().replace("₂", "2")}`} /></div>
                </div>
              ))}
              {planet.type === "exoplaneta" && <p className="unknown-note">A barra indica “informação ainda desconhecida”, não uma composição de 100%.</p>}
            </article>
            <article className="materials-card">
              <h3>Materiais detectados ou inferidos</h3>
              <div className="material-list">
                {planet.materials.map((material, index) => <span key={material}><i>{index + 1}</i>{material}</span>)}
              </div>
            </article>
          </div>

          <div className="habitability-card">
            <div className="habitability-icon">⌂</div>
            <div><small>CONDIÇÕES PARA VIDA CONHECIDA</small><h3>{planet.id === "europa" ? "Interessante, mas não confirmada" : planet.id === "kepler" ? "Dados insuficientes" : "Ambiente muito hostil"}</h3><p>Habitabilidade não significa que exista vida. Água, energia e química adequada são apenas parte da investigação.</p></div>
          </div>
          <SciencePassport evidence={planet.evidence} source={planet.source} assumptions={["Valores médios e arredondados", "Condições locais podem variar", "Ilustração fora de escala"]} />
          {mode === "researcher" && <div className="researcher-rubric"><small>MODO PESQUISADOR</small><p>Compare unidade, precisão e nível de evidência de cada leitura antes de combinar os resultados em uma conclusão.</p></div>}
        </div>
      </div>}
    </section>
  );
}
