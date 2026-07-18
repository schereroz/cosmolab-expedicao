"use client";

import { useState } from "react";
import { evidenceLabels, missions } from "../data";
import type { GameProfile } from "../types";

const badgeCatalog = [
  { id: "primeira-descoberta", title: "Primeira evidência", description: "Concluiu a primeira missão." },
  { id: "quatro-regioes", title: "Rota completa", description: "Concluiu quatro missões." },
  { id: "cientista-orbital", title: "Cientista orbital", description: "Concluiu oito missões." },
  { id: "mestre-cosmolab", title: "Mestre CosmoLab", description: "Concluiu as 16 missões." },
  { id: "sequencia-3", title: "Curiosidade constante", description: "Explorou em três dias seguidos." },
  { id: "sequencia-7", title: "Semana científica", description: "Explorou em sete dias seguidos." },
];

export function JournalView({ profile, onOpenProfile }: { profile: GameProfile; onOpenProfile: () => void }) {
  const completed = missions.filter((mission) => profile.completed.includes(mission.id));
  const [shareStatus, setShareStatus] = useState("");
  const unlockedBadges = badgeCatalog.filter((badge) => (profile.badges ?? []).includes(badge.id));

  async function shareProgress() {
    const text = `Completei ${completed.length} missões científicas e registrei ${profile.discoveries.length} descobertas no CosmoLab. Você consegue testar uma hipótese também?`;
    try {
      if (navigator.share) await navigator.share({ title: "Minha expedição CosmoLab", text, url: window.location.origin });
      else { await navigator.clipboard.writeText(`${text} ${window.location.origin}`); setShareStatus("Cartão copiado!"); }
    } catch { setShareStatus("Compartilhamento cancelado."); }
  }
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
        <div className="journal-section-title"><span>03</span><div><small>CONQUISTAS DA EXPEDIÇÃO</small><h2>Medalhas científicas</h2></div></div>
        <div className="badge-grid">{badgeCatalog.map((badge, index) => { const unlocked = unlockedBadges.some((item) => item.id === badge.id); return <article className={unlocked ? "unlocked" : "locked"} key={badge.id}><span>{unlocked ? String(index + 1).padStart(2,"0") : "—"}</span><div><strong>{badge.title}</strong><p>{unlocked ? badge.description : "Continue investigando para desbloquear."}</p></div></article>; })}</div>
        <section className="safe-share-card"><div><p className="eyebrow">Convide pela curiosidade</p><h2>Compartilhe sua expedição</h2><p>O cartão informa apenas totais científicos, sem nome ou dado pessoal.</p></div><button className="primary-button" onClick={shareProgress}>Compartilhar cartão</button>{shareStatus && <span role="status">{shareStatus}</span>}</section>
        <aside className="family-note"><span>♢</span><div><strong>Área familiar protegida</strong><p>Este perfil usa apenas apelido e faixa pedagógica. Não há chat, anúncios ou localização.</p></div><button onClick={onOpenProfile}>Configurar perfil</button></aside>
      </div>
    </section>
  );
}
