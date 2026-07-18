"use client";

import { useMemo, useState } from "react";
import { elements, evidenceLabels } from "../data";
import { combineElements } from "../lib/science";
import type { ElementRecord } from "../types";
import { SciencePassport } from "./SciencePassport";

export function MatterLab() {
  const [selected, setSelected] = useState<ElementRecord[]>([elements[0], elements[0], elements[7]]);
  const [activeElement, setActiveElement] = useState<ElementRecord>(elements[7]);
  const result = useMemo(() => combineElements(selected), [selected]);

  function toggleElement(element: ElementRecord) {
    setActiveElement(element);
    if (selected.length >= 5) setSelected([element]);
    else setSelected((items) => [...items, element]);
  }

  return (
    <section className="module-view matter-lab" aria-labelledby="matter-title">
      <div className="module-header">
        <div>
          <p className="eyebrow">Ambiente livre · química</p>
          <h1 id="matter-title">Laboratório da Matéria</h1>
          <p>Selecione átomos, compare propriedades e investigue o que eles podem formar.</p>
        </div>
        <button className="secondary-button" onClick={() => setSelected([])}>Limpar bancada</button>
      </div>

      <div className="matter-layout">
        <div className="periodic-panel">
          <div className="panel-title-row"><h2>Elementos em foco</h2><span>24 / 118 aprofundados</span></div>
          <div className="periodic-grid" aria-label="Tabela periódica reduzida">
            {elements.map((element) => (
              <button className={`element-tile group-${element.group} ${activeElement.symbol === element.symbol ? "active" : ""}`} key={element.symbol} onClick={() => toggleElement(element)} aria-label={`Adicionar ${element.name}`}>
                <small>{element.number}</small><strong>{element.symbol}</strong><span>{element.name}</span>
              </button>
            ))}
          </div>
          <div className="element-detail">
            <div className={`element-big group-${activeElement.group}`}><small>{activeElement.number}</small><strong>{activeElement.symbol}</strong><span>{activeElement.mass}</span></div>
            <div><p className="eyebrow">Elemento selecionado</p><h3>{activeElement.name}</h3><p>{activeElement.fact}</p></div>
          </div>
        </div>

        <div className="molecule-panel">
          <div className="panel-title-row"><h2>Bancada molecular</h2><span>até 5 átomos</span></div>
          <div className="molecule-stage" aria-label={`Representação de ${result.name}`}>
            <div className="molecule-orbit" aria-hidden="true" />
            {selected.length === 0 ? (
              <div className="molecule-empty"><span>⚛</span><p>Escolha elementos na tabela para começar.</p></div>
            ) : selected.map((element, index) => (
              <div className={`atom atom-${index + 1} atom-${element.symbol.toLowerCase()}`} key={`${element.symbol}-${index}`}><strong>{element.symbol}</strong></div>
            ))}
          </div>
          <div className="selected-atoms">
            {selected.map((element, index) => <button key={`${element.symbol}-${index}`} onClick={() => setSelected((items) => items.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remover ${element.name}`}>{element.symbol}<span>×</span></button>)}
          </div>
          {selected.length > 0 && (
            <div className={`molecule-result ${result.evidence === "hypothesis" ? "hypothesis-result" : ""}`}>
              <span className="formula">{result.formula}</span>
              <div><small>{evidenceLabels[result.evidence].label}</small><h2>{result.name}</h2><p>{result.fact}</p></div>
              <div className="mass-pill"><small>Massa aproximada</small><strong>{result.mass.toFixed(3)} u</strong></div>
            </div>
          )}
          <SciencePassport
            evidence={result.evidence}
            source={result.evidence === "observed" ? "PubChem e massas atômicas padrão" : "Combinação livre do usuário; estabilidade não determinada"}
            assumptions={["Massa calculada pela soma dos átomos selecionados", "Geometria visual não representa escala real"]}
          />
        </div>
      </div>
    </section>
  );
}
