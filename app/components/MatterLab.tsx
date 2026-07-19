"use client";

import { useMemo, useState } from "react";
import { elements, evidenceLabels } from "../data";
import { combineElements } from "../lib/science";
import type { ElementRecord, GameProfile } from "../types";
import { ActivityGuide } from "./ActivityGuide";
import { SciencePassport } from "./SciencePassport";

const periodicRows: Array<Array<string | null>> = [
  ["H",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"He"],
  ["Li","Be",null,null,null,null,null,null,null,null,null,null,"B","C","N","O","F","Ne"],
  ["Na","Mg",null,null,null,null,null,null,null,null,null,null,"Al","Si","P","S","Cl","Ar"],
  ["K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ga","Ge","As","Se","Br","Kr"],
  ["Rb","Sr","Y","Zr","Nb","Mo","Tc","Ru","Rh","Pd","Ag","Cd","In","Sn","Sb","Te","I","Xe"],
  ["Cs","Ba","La","Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg","Tl","Pb","Bi","Po","At","Rn"],
  ["Fr","Ra","Ac","Rf","Db","Sg","Bh","Hs","Mt","Ds","Rg","Cn","Nh","Fl","Mc","Lv","Ts","Og"],
];
const seriesRows = [["La","Ce","Pr","Nd","Pm","Sm","Eu","Gd","Tb","Dy","Ho","Er","Tm","Yb","Lu"], ["Ac","Th","Pa","U","Np","Pu","Am","Cm","Bk","Cf","Es","Fm","Md","No","Lr"]];

function ElementTile({ element, active, onClick }: { element: ElementRecord; active: boolean; onClick: () => void }) {
  return <button className={`element-tile group-${element.group} ${active ? "active" : ""}`} onClick={onClick} aria-label={`Selecionar ${element.name}`}><small>{element.number}</small><strong>{element.symbol}</strong><span>{element.name}</span></button>;
}

const orbitalOrder = [[1,2],[2,2],[2,6],[3,2],[3,6],[4,2],[3,10],[4,6],[5,2],[4,10],[5,6],[6,2],[4,14],[5,10],[6,6],[7,2],[5,14],[6,10],[7,6]] as const;
function simplifiedShells(atomicNumber: number) {
  let remaining = atomicNumber;
  const shells = Array(7).fill(0) as number[];
  for (const [shell, capacity] of orbitalOrder) {
    const electrons = Math.min(remaining, capacity);
    shells[shell - 1] += electrons;
    remaining -= electrons;
    if (remaining === 0) break;
  }
  return shells.filter((count) => count > 0);
}

export function MatterLab({ mode }: { mode: GameProfile["ageBand"] }) {
  const [selected, setSelected] = useState<ElementRecord[]>([elements[0], elements[0], elements[7]]);
  const [activeElement, setActiveElement] = useState<ElementRecord>(elements[7]);
  const [query, setQuery] = useState("");
  const [lesson, setLesson] = useState<"atom" | "bonds" | "trends">("atom");
  const [temperature, setTemperature] = useState(25);
  const result = useMemo(() => combineElements(selected, temperature), [selected, temperature]);
  const shells = useMemo(() => simplifiedShells(activeElement.number), [activeElement.number]);
  const elementBySymbol = useMemo(() => new Map(elements.map((element) => [element.symbol, element])), []);
  const matches = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    if (!normalized) return [];
    return elements.filter((element) => element.name.toLocaleLowerCase("pt-BR").includes(normalized) || element.symbol.toLocaleLowerCase("pt-BR") === normalized || String(element.number) === normalized);
  }, [query]);

  function chooseElement(element: ElementRecord) {
    setActiveElement(element);
    setSelected((items) => items.length >= 8 ? [element] : [...items, element]);
  }

  return (
    <section className="module-view matter-lab" aria-labelledby="matter-title">
      <div className="module-header"><div><p className="eyebrow">Ambiente livre · química</p><h1 id="matter-title">Laboratório da Matéria</h1><p>Explore os 118 elementos, descubra padrões e investigue o que seus átomos podem formar.</p></div><button className="secondary-button" onClick={() => setSelected([])}>Limpar bancada</button></div>
      <ActivityGuide title="Lab da Matéria" goal="Descobrir como a estrutura de um átomo influencia suas propriedades e ligações." steps={["Busque um elemento", "Leia sua ficha", "Adicione até 8 átomos", "Compare a combinação"]} reward="Encontre uma molécula conhecida ou explique por que a combinação continua sendo uma hipótese." />

      <div className="matter-layout">
        <div className="periodic-panel">
          <div className="panel-title-row"><h2>Tabela periódica completa</h2><span>118 / 118 elementos</span></div>
          <label className="element-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busque por nome, símbolo ou número" aria-label="Buscar elemento" /></label>
          <div className="periodic-legend"><span className="legend-metal">Metal</span><span className="legend-nonmetal">Não metal</span><span className="legend-metalloid">Semimetal</span><span className="legend-noble">Gás nobre</span></div>
          {!query && <p className="periodic-swipe-hint">Arraste para os lados para explorar todos os 118 elementos →</p>}
          {query ? <div className="element-search-results">{matches.length ? matches.map((element) => <ElementTile key={element.symbol} element={element} active={activeElement.symbol === element.symbol} onClick={() => chooseElement(element)} />) : <p>Nenhum elemento encontrado. Tente “Fe”, “ferro” ou “26”.</p>}</div> : <>
            <div className="periodic-table" aria-label="Tabela periódica com 118 elementos">{periodicRows.flatMap((row, rowIndex) => row.map((symbol, columnIndex) => symbol ? <ElementTile key={`${rowIndex}-${symbol}`} element={elementBySymbol.get(symbol)!} active={activeElement.symbol === symbol} onClick={() => chooseElement(elementBySymbol.get(symbol)!)} /> : <span className="element-gap" key={`${rowIndex}-${columnIndex}`} />))}</div>
            <div className="series-table" aria-label="Lantanídeos e actinídeos">{seriesRows.map((row, index) => <div key={index}><b>{index === 0 ? "La–Lu" : "Ac–Lr"}</b>{row.map((symbol) => <ElementTile key={`${index}-${symbol}`} element={elementBySymbol.get(symbol)!} active={activeElement.symbol === symbol} onClick={() => chooseElement(elementBySymbol.get(symbol)!)} />)}</div>)}</div>
          </>}

          <article className="element-detail">
            <div className={`element-big group-${activeElement.group}`}><small>{activeElement.number}</small><strong>{activeElement.symbol}</strong><span>{activeElement.mass}</span></div>
            <div className="element-story"><p className="eyebrow">Elemento selecionado</p><h3>{activeElement.name}</h3><p>{activeElement.fact}</p><div className="element-facts"><span><small>Prótons</small><strong>{activeElement.number}</strong></span><span><small>Elétrons*</small><strong>{activeElement.number}</strong></span><span><small>Período</small><strong>{activeElement.period}</strong></span><span><small>Estado a 25 °C</small><strong>{activeElement.state}</strong></span></div><small className="neutral-note">*Em um átomo eletricamente neutro.</small></div>
          </article>

          <section className="micro-lesson">
            <div className="panel-title-row"><div><p className="eyebrow">Aprenda em 60 segundos</p><h2>Por que {activeElement.name} se comporta assim?</h2></div><span>{activeElement.category}</span></div>
            <div className="lesson-tabs"> <button className={lesson === "atom" ? "active" : ""} onClick={() => setLesson("atom")}>Dentro do átomo</button><button className={lesson === "bonds" ? "active" : ""} onClick={() => setLesson("bonds")}>Ligações</button><button className={lesson === "trends" ? "active" : ""} onClick={() => setLesson("trends")}>Padrões da tabela</button></div>
            {lesson === "atom" && <div className="lesson-copy"><span className="lesson-visual">{activeElement.number}<small>cargas + no núcleo</small></span><p>O <strong>número atômico {activeElement.number}</strong> identifica este elemento: todo átomo de {activeElement.name} possui {activeElement.number} prótons. Se mudar o número de prótons, vira outro elemento. A massa {activeElement.mass} u é uma média dos isótopos naturais ou do isótopo de referência.</p></div>}
            {lesson === "bonds" && <div className="lesson-copy"><span className="lesson-visual">⇄<small>elétrons em jogo</small></span><p>{activeElement.group === "noble" ? "Gases nobres já têm uma camada externa muito estável e costumam reagir pouco." : activeElement.group === "metal" ? "Metais tendem a formar cátions ou compartilhar muitos elétrons em uma estrutura metálica." : "Não metais frequentemente compartilham ou recebem elétrons, formando ligações covalentes ou íons."} Ligações dependem também de energia, carga e condições do ambiente.</p></div>}
            {lesson === "trends" && <div className="lesson-copy"><span className="lesson-visual">↗<small>posição revela pistas</small></span><p>O período {activeElement.period} indica quantas camadas eletrônicas principais são ocupadas. Elementos na mesma coluna costumam apresentar comportamentos parecidos porque têm configurações externas semelhantes. Posição é uma pista — não uma regra sem exceções.</p></div>}
            <div className="where-used"><strong>Onde investigar:</strong> {activeElement.use}</div>
          </section>
          {mode === "researcher" ? <section className="mode-depth researcher-depth"><div className="mode-depth-title"><span>Σ</span><div><small>MODO PESQUISADOR</small><h2>Distribuição eletrônica simplificada</h2></div></div><div className="shell-distribution">{shells.map((count, index) => <span key={index}><small>Camada {index + 1}</small><strong>{count} e⁻</strong><meter min="0" max="32" value={count}>{count} de 32</meter></span>)}</div><p>Modelo de preenchimento por subníveis: {shells.join("–")}. Configurações reais podem apresentar exceções de menor energia; consulte uma tabela espectroscópica para alta precisão.</p></section> : <section className="mode-depth explorer-depth"><div className="mode-depth-title"><span>🧭</span><div><small>MODO EXPLORADOR</small><h2>Pista visual</h2></div></div><p>{activeElement.name} tem <strong>{shells.length} camada(s) ocupada(s)</strong>. A camada mais externa ajuda a explicar como o átomo encontra parceiros para formar materiais.</p></section>}
        </div>

        <div className="molecule-panel">
          <div className="panel-title-row"><h2>Bancada molecular</h2><span>{selected.length} / 8 átomos</span></div>
          <section className="lab-conditions" aria-label="Condições da bancada"><div><small>CONDIÇÃO CONTROLADA</small><strong>Temperatura da bancada</strong></div><output>{temperature} °C</output><input aria-label="Temperatura da bancada" type="range" min="-250" max="1000" step="5" value={temperature} onChange={(event) => setTemperature(Number(event.target.value))} /><p>Pressão mantida em <strong>1 atm</strong>. Alterar a temperatura ajuda a prever mudanças de estado, mas não cria uma substância nova.</p></section>
          <div className="molecule-stage" aria-label={`Representação de ${result.name}`}><div className="molecule-orbit" aria-hidden="true" />{selected.length === 0 ? <div className="molecule-empty"><span>⚛</span><p>Escolha elementos na tabela para começar.</p></div> : selected.map((element, index) => <div className={`atom atom-${index + 1} atom-${element.symbol.toLowerCase()}`} key={`${element.symbol}-${index}`}><strong>{element.symbol}</strong></div>)}</div>
          <div className="selected-atoms">{selected.map((element, index) => <button key={`${element.symbol}-${index}`} onClick={() => setSelected((items) => items.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remover ${element.name}`}>{element.symbol}<span>×</span></button>)}</div>
          {selected.length > 0 && <><div className={`molecule-result ${result.evidence === "hypothesis" ? "hypothesis-result" : ""}`}><span className="formula">{result.formula}</span><div><small>{evidenceLabels[result.evidence].label}</small><h2>{result.name}</h2><p>{result.fact}</p></div><div className="mass-pill"><small>Massa aproximada</small><strong>{result.mass.toFixed(3)} u</strong></div></div><div className="substance-readings"><span><small>Estado previsto a 1 atm</small><strong>{result.phase}</strong></span><span><small>Tipo de ligação</small><strong>{result.bondType}</strong></span><span><small>Transições aproximadas</small><strong>{result.decomposesC !== null ? `decompõe a partir de ~${result.decomposesC} °C` : result.meltingC === null ? "dados insuficientes" : result.meltingC === result.boilingC ? `${result.meltingC} °C · sublima` : `${result.meltingC} / ${result.boilingC} °C`}</strong></span></div></>}
          <div className="lab-challenge"><span>DESAFIO RÁPIDO</span><strong>Consegue montar água?</strong><p>Adicione 2 átomos de hidrogênio e 1 de oxigênio. Depois compare a fórmula e a massa.</p></div>
          <SciencePassport evidence={result.evidence} source={result.evidence === "observed" ? "PubChem e massas atômicas padrão" : "Combinação livre do usuário; estabilidade não determinada"} assumptions={["Massas atômicas padrão arredondadas", "Geometria visual não representa escala real", "Símbolos sozinhos não garantem estabilidade química"]} />
        </div>
      </div>
    </section>
  );
}
