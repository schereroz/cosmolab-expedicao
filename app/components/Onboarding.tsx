"use client";

import { useState } from "react";
import { avatars } from "../data";
import type { GameProfile } from "../types";

function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function Onboarding({ onComplete }: { onComplete: (profile: GameProfile) => void }) {
  const [step, setStep] = useState<"profile" | "tour">("profile");
  const [nickname, setNickname] = useState("Luna");
  const [avatarId, setAvatarId] = useState("panda");
  const [ageBand, setAgeBand] = useState<GameProfile["ageBand"]>("explorer");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (step === "profile") {
      setStep("tour");
      return;
    }
    onComplete({
      nickname: nickname.trim().slice(0, 18) || "Explorador",
      avatarId,
      ageBand,
      xp: 280,
      completed: ["mission-1", "mission-5"],
      trail: ["mission-2", "mission-6"],
      discoveries: ["A água é polar", "Órbitas são quedas contínuas"],
      streak: 1,
      lastActiveDate: localDateKey(),
      badges: ["primeira-descoberta"],
    });
  }

  return (
    <div className="onboarding-overlay" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      <form className="onboarding-card" onSubmit={submit}>
        <div className="onboarding-brand"><span aria-hidden="true">✦</span> COSMOLAB</div>
        <div className="onboarding-progress" aria-label="Etapas do início"><span className="active">1 · Perfil</span><i /><span className={step === "tour" ? "active" : ""}>2 · Como jogar</span></div>
        {step === "profile" ? <>
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

        <button className="primary-button onboarding-submit" type="submit">Ver como jogar <span aria-hidden="true">→</span></button>
        </> : <>
          <p className="eyebrow">Treinamento de 30 segundos</p>
          <h1 id="onboarding-title">Seu ciclo de descoberta</h1>
          <p className="intro-copy">Em todas as atividades você seguirá o mesmo método de cientistas reais.</p>
          <div className="tour-steps">
            <article><span>1</span><div><strong>Observe</strong><p>Leia a missão e procure pistas nos dados.</p></div></article>
            <article><span>2</span><div><strong>Imagine</strong><p>Faça uma previsão antes de apertar o botão.</p></div></article>
            <article><span>3</span><div><strong>Experimente</strong><p>Mude uma variável por vez e compare.</p></div></article>
            <article><span>4</span><div><strong>Explique</strong><p>Confira evidências, incertezas e fontes no Passaporte Científico.</p></div></article>
          </div>
          <div className="tour-tip"><span>?</span><p>Procure o botão <strong>Como jogar</strong> em cada laboratório. Você também pode reabrir este tour pelo botão de ajuda no topo.</p></div>
          <div className="tour-actions"><button className="secondary-button" type="button" onClick={() => setStep("profile")}>← Voltar</button><button className="primary-button" type="submit">Começar a expedição <span aria-hidden="true">→</span></button></div>
        </>}
        <p className="privacy-note">Perfil infantil sem e-mail, nome real, anúncios ou chat.</p>
      </form>
    </div>
  );
}
