"use client";

import { useState } from "react";
import { avatars } from "../data";
import type { GameProfile } from "../types";

export function Onboarding({ onComplete }: { onComplete: (profile: GameProfile) => void }) {
  const [nickname, setNickname] = useState("Luna");
  const [avatarId, setAvatarId] = useState("panda");
  const [ageBand, setAgeBand] = useState<GameProfile["ageBand"]>("explorer");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    onComplete({
      nickname: nickname.trim().slice(0, 18) || "Explorador",
      avatarId,
      ageBand,
      xp: 280,
      completed: ["mission-1", "mission-5"],
      trail: ["mission-2", "mission-6"],
      discoveries: ["A água é polar", "Órbitas são quedas contínuas"],
    });
  }

  return (
    <div className="onboarding-overlay" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      <form className="onboarding-card" onSubmit={submit}>
        <div className="onboarding-brand"><span aria-hidden="true">✦</span> COSMOLAB</div>
        <p className="eyebrow">Tripulação científica · piloto familiar</p>
        <h1 id="onboarding-title">Quem vai comandar esta expedição?</h1>
        <p className="intro-copy">Escolha um explorador. Nenhum animal tem vantagem: a melhor ferramenta é a curiosidade.</p>

        <label className="field-label" htmlFor="nickname">Apelido do explorador</label>
        <input id="nickname" value={nickname} onChange={(event) => setNickname(event.target.value)} maxLength={18} autoFocus />

        <fieldset>
          <legend>Escolha seu personagem</legend>
          <div className="avatar-grid">
            {avatars.map((avatar) => (
              <label className={`avatar-option ${avatarId === avatar.id ? "selected" : ""}`} key={avatar.id}>
                <input type="radio" name="avatar" value={avatar.id} checked={avatarId === avatar.id} onChange={() => setAvatarId(avatar.id)} />
                <span className={`avatar-face avatar-${avatar.id}`} aria-hidden="true">{avatar.emoji}</span>
                <strong>{avatar.name}</strong>
                <small>{avatar.role}</small>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Modo de aprendizagem</legend>
          <div className="age-band-grid">
            <label className={ageBand === "explorer" ? "selected" : ""}>
              <input type="radio" name="age" checked={ageBand === "explorer"} onChange={() => setAgeBand("explorer")} />
              <span><strong>Explorador</strong><small>9–11 anos · mais pistas visuais</small></span>
            </label>
            <label className={ageBand === "researcher" ? "selected" : ""}>
              <input type="radio" name="age" checked={ageBand === "researcher"} onChange={() => setAgeBand("researcher")} />
              <span><strong>Pesquisador</strong><small>12–15 anos · cálculos detalhados</small></span>
            </label>
          </div>
        </fieldset>

        <button className="primary-button onboarding-submit" type="submit">Entrar na nave <span aria-hidden="true">→</span></button>
        <p className="privacy-note">Perfil infantil sem e-mail, nome real, anúncios ou chat.</p>
      </form>
    </div>
  );
}
