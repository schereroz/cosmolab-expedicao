"use client";

import { useState } from "react";

interface ActivityGuideProps {
  title: string;
  goal: string;
  steps: string[];
  reward: string;
}

export function ActivityGuide({ title, goal, steps, reward }: ActivityGuideProps) {
  const [open, setOpen] = useState(true);

  return (
    <section className={`activity-guide ${open ? "open" : ""}`} aria-label={`Como jogar: ${title}`}>
      <button className="activity-guide-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span className="guide-orb" aria-hidden="true">?</span>
        <span><small>PRIMEIROS PASSOS</small><strong>Como jogar: {title}</strong></span>
        <b>{open ? "Fechar" : "Abrir guia"}</b>
      </button>
      {open && (
        <div className="activity-guide-body">
          <div className="guide-goal"><small>SEU OBJETIVO</small><p>{goal}</p></div>
          <ol>{steps.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol>
          <div className="guide-reward"><span aria-hidden="true">✦</span><div><small>DESCOBERTA</small><p>{reward}</p></div></div>
        </div>
      )}
    </section>
  );
}
