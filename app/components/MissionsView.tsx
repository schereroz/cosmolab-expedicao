"use client";

import { evidenceLabels, missions } from "../data";
import type { GameProfile } from "../types";

interface MissionsViewProps {
  profile: GameProfile;
  onToggleTrail: (id: string) => void;
  onComplete: (id: string) => void;
}

export function MissionsView({ profile, onToggleTrail, onComplete }: MissionsViewProps) {
  return (
    <section className="module-view missions-view" aria-labelledby="missions-title">
      <div className="module-header">
        <div><p className="eyebrow">16 missões principais · trilha personalizada</p><h1 id="missions-title">Painel de missões</h1><p>Escolha até oito desafios. Missões concluídas continuam disponíveis para repetir.</p></div>
        <div className="trail-counter"><strong>{profile.trail.length}</strong><span>/ 8 na trilha</span></div>
      </div>
      <div className="mission-regions">
        {["Vale Elemental", "Campo de Forças", "Biosfera Viva", "Oficina do Futuro"].map((region, regionIndex) => (
          <section className={`mission-region region-tone-${regionIndex + 1}`} key={region}>
            <div className="mission-region-title"><span>{regionIndex + 1}</span><div><small>REGIÃO {regionIndex + 1}</small><h2>{region}</h2></div><b>{missions.filter((mission) => mission.region === region).length} missões</b></div>
            <div className="mission-list">
              {missions.filter((mission) => mission.region === region).map((mission) => {
                const completed = profile.completed.includes(mission.id);
                const inTrail = profile.trail.includes(mission.id);
                return (
                  <article className={`mission-row ${completed ? "completed" : ""}`} key={mission.id}>
                    <span className="mission-icon">{mission.icon}</span>
                    <div className="mission-copy"><span className="mission-meta">{mission.domain} · {evidenceLabels[mission.evidence].label}</span><h3>{mission.title}</h3><p>{mission.description}</p></div>
                    <span className="xp-badge">+{mission.xp} XP</span>
                    {completed ? <span className="completed-badge">✓ Concluída</span> : (
                      <div className="mission-actions">
                        <button className={inTrail ? "in-trail" : ""} onClick={() => onToggleTrail(mission.id)}>{inTrail ? "✓ Na trilha" : "+ Trilha"}</button>
                        <button className="start-mission" onClick={() => onComplete(mission.id)}>Concluir demo</button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
