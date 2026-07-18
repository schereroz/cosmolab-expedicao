"use client";

import { evidenceLabels } from "../data";
import type { EvidenceLevel } from "../types";

interface SciencePassportProps {
  evidence: EvidenceLevel;
  source: string;
  assumptions?: string[];
  uncertainty?: number;
}

export function SciencePassport({
  evidence,
  source,
  assumptions = [],
  uncertainty,
}: SciencePassportProps) {
  const item = evidenceLabels[evidence];
  return (
    <details className={`science-passport evidence-${evidence}`}>
      <summary>
        <span className="passport-icon" aria-hidden="true">{item.icon}</span>
        <span>
          <strong>Passaporte científico</strong>
          <small>{item.label}</small>
        </span>
        <span className="passport-open">Ver dados</span>
      </summary>
      <div className="passport-body">
        <p><strong>Base:</strong> {source}</p>
        {typeof uncertainty === "number" && (
          <p><strong>Incerteza didática:</strong> ±{uncertainty}%</p>
        )}
        {assumptions.length > 0 && (
          <div>
            <strong>O modelo considera:</strong>
            <ul>{assumptions.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        )}
        {(evidence === "hypothesis" || evidence === "fiction") && (
          <p className="hypothesis-warning">Este cenário não representa uma descoberta comprovada.</p>
        )}
      </div>
    </details>
  );
}
