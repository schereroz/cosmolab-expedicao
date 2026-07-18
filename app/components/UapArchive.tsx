"use client";

import { useState } from "react";
import { uapCases } from "../data";
import { SciencePassport } from "./SciencePassport";

const possibleAnswers = ["Satélites", "Meteoro", "Fenômeno atmosférico", "Artefato do sensor", "Dados insuficientes", "Nave extraterrestre"];

export function UapArchive() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const current = uapCases[caseIndex];
  const correct = answer === current.answer;

  return (
    <section className="module-view uap-view" aria-labelledby="uap-title">
      <div className="uap-header">
        <div className="uap-mark">UAP <span>?</span></div>
        <div><p className="eyebrow">Arquivo de fenômenos anômalos</p><h1 id="uap-title">Investigue antes de concluir</h1><p>“Não identificado” significa que faltam dados — não que sabemos que é extraterrestre.</p></div>
        <span className="evidence-chip inferred"><b>◇</b> Investigação aberta</span>
      </div>

      <div className="case-tabs" role="tablist" aria-label="Casos UAP">
        {uapCases.map((item, index) => <button role="tab" aria-selected={index === caseIndex} className={index === caseIndex ? "active" : ""} key={item.id} onClick={() => { setCaseIndex(index); setAnswer(null); }}><span>CASO 0{index + 1}</span>{item.title}</button>)}
      </div>

      <div className="uap-case-grid">
        <div className="signal-viewer">
          <div className="signal-sky"><i className="signal-object one" /><i className="signal-object two" /><i className="signal-object three" /><div className="sensor-reticle" /><span>REC ● &nbsp; SENSOR A-17</span></div>
          <div className="signal-caption"><small>LOCAL DA DETECÇÃO</small><strong>{current.place}</strong><p>{current.signal}</p></div>
        </div>
        <div className="evidence-board">
          <h2>Caderno de evidências</h2>
          <p>Observe os dados disponíveis. Qual explicação precisa de menos suposições?</p>
          <div className="evidence-notes">{current.evidence.map((item, index) => <span key={item}><i>{index + 1}</i>{item}</span>)}</div>
          <fieldset>
            <legend>Sua conclusão provisória</legend>
            <div className="answer-grid">{possibleAnswers.map((item) => <button type="button" key={item} className={answer === item ? "selected" : ""} onClick={() => setAnswer(item)}>{item === "Nave extraterrestre" ? "✦ " : ""}{item}</button>)}</div>
          </fieldset>
          {answer && (
            <div className={`case-feedback ${correct ? "correct" : "try-again"}`} role="status">
              <strong>{correct ? "Boa investigação!" : answer === "Nave extraterrestre" ? "Essa conclusão vai além dos dados." : "Ainda há uma explicação mais compatível."}</strong>
              <p>{correct ? current.explanation : "Releia as evidências e procure uma hipótese testável com menos suposições."}</p>
            </div>
          )}
          <SciencePassport evidence="inferred" source="Método científico para análise de observações e qualidade de dados (NASA UAP)" assumptions={["O caso é uma dramatização educativa", "Nenhuma origem extraterrestre foi estabelecida"]} />
        </div>
      </div>
    </section>
  );
}
