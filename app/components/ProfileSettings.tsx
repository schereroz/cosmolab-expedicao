"use client";

import { avatars } from "../data";
import type { GameProfile } from "../types";

export function ProfileSettings({ profile, onChange, onClose }: { profile: GameProfile; onChange: (profile: GameProfile) => void; onClose: () => void }) {
  return (
    <div className="settings-overlay" role="dialog" aria-modal="true" aria-labelledby="settings-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="settings-card">
        <div className="drawer-heading"><div><p className="eyebrow">Configuração da tripulação</p><h2 id="settings-title">Perfil de aprendizagem</h2></div><button onClick={onClose} aria-label="Fechar configurações">×</button></div>
        <p>Você pode trocar de modo a qualquer momento. Seu XP, trilha e descobertas continuam salvos.</p>
        <div className="settings-avatar-row">
          {avatars.map((avatar) => <button key={avatar.id} className={profile.avatarId === avatar.id ? "active" : ""} onClick={() => onChange({ ...profile, avatarId: avatar.id })}><span>{avatar.emoji}</span><small>{avatar.name}</small></button>)}
        </div>
        <div className="mode-choice-grid">
          <button className={profile.ageBand === "explorer" ? "active" : ""} onClick={() => onChange({ ...profile, ageBand: "explorer" })}>
            <span>🧭</span><strong>Explorador</strong><small>9–11 anos</small><p>Mais pistas visuais, comparações concretas e fórmulas opcionais.</p>
          </button>
          <button className={profile.ageBand === "researcher" ? "active" : ""} onClick={() => onChange({ ...profile, ageBand: "researcher" })}>
            <span>🔬</span><strong>Pesquisador</strong><small>12–15 anos</small><p>Termos técnicos, unidades, gráficos e cálculos mais detalhados.</p>
          </button>
        </div>
        <button className="primary-button settings-done" onClick={onClose}>Salvar e continuar</button>
      </section>
    </div>
  );
}
