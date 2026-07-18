"use client";

import { evidenceLabels, missions } from "../data";
import type { GameProfile } from "../types";

export function JournalView({ profile }: { profile: GameProfile }) {
  const completed = missions.filter((mission) => profile.completed.includes(mission.id));
  return (
    <section className="module-view journal-view" aria-labelledby="journal-title">
      <div className="journal-cover">
        <p className="eyebrow">Caderno de bordo · perfil familiar</p>
        <h1 id="journal-title">Diário científico de {profile.nickname}</h1>
        <p>Uma descoberta vale mais quando conseguimos explicar como chegamos até ela.</p>
        <div className="journal-stats"><span><strong>{profile.xp}</strong><small>XP total</small></span><span><strong>{completed.length}</strong><small>Missões</small></span><span><strong>{profile.discoveries.length}</strong><small>Descobertas</small></span></div>
      </div>
      <div className="journal-paper">
        <div className="journal-section-title"><span>01</span><div><small>REGISTROS VERIFICÁVEIS</small><h2>Missões concluídas</h2></div></div>
        <div className="completed-grid">
          {completed.map((mission) => <article key={mission.id}><span className="journal-icon">{mission.icon}</span><small>{mission.region}</small><h3>{mission.title}</h3><p>{mission.description}</p><div><span>{evidenceLabels[mission.evidence].icon} {evidenceLabels[mission.evidence].label}</span><b>+{mission.xp} XP</b></div></article>)}
        </div>
        <div className="journal-section-title"><span>02</span><div><small>IDEIAS QUE FICARAM</small><h2>Minhas descobertas</h2></div></div>
        <ol className="discovery-list">{profile.discoveries.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p><small>Registrado no CosmoLab</small></li>)}</ol>
        <aside className="family-note"><span>♢</span><div><strong>Área familiar protegida</strong><p>Este perfil usa apenas apelido e faixa pedagógica. Não há chat, anúncios ou localização.</p></div><button>Ver painel do responsável</button></aside>
      </div>
    </section>
  );
}
