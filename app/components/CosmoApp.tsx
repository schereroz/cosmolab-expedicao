"use client";

import { useEffect, useMemo, useState } from "react";
import { avatars, missions } from "../data";
import type { GameProfile, PlanetRecord, ViewId } from "../types";
import { CosmicLab } from "./CosmicLab";
import { JournalView } from "./JournalView";
import { MatterLab } from "./MatterLab";
import { MissionsView } from "./MissionsView";
import { Onboarding } from "./Onboarding";
import { PlanetSurvey } from "./PlanetSurvey";
import { UapArchive } from "./UapArchive";
import { WorldView } from "./WorldView";

const demoProfile: GameProfile = {
  nickname: "Luna",
  avatarId: "panda",
  ageBand: "explorer",
  xp: 280,
  completed: ["mission-1", "mission-5"],
  trail: ["mission-2", "mission-6"],
  discoveries: ["A água é polar", "Órbitas são quedas contínuas"],
};

const navItems: Array<{ id: ViewId; label: string; icon: string }> = [
  { id: "universe", label: "Explorar", icon: "✦" },
  { id: "missions", label: "Missões", icon: "◇" },
  { id: "matter", label: "Matéria", icon: "⚛" },
  { id: "cosmic", label: "Colisões", icon: "☄" },
  { id: "uap", label: "Arquivo UAP", icon: "?" },
  { id: "journal", label: "Diário", icon: "▤" },
];

export function CosmoApp() {
  const [view, setView] = useState<ViewId>("universe");
  const [profile, setProfile] = useState<GameProfile>(demoProfile);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [planet, setPlanet] = useState<PlanetRecord | null>(null);
  const [showTrail, setShowTrail] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("cosmolab-profile");
    if (stored) {
      try {
        const storedProfile = JSON.parse(stored) as GameProfile;
        window.setTimeout(() => {
          setProfile(storedProfile);
          setShowOnboarding(false);
        }, 0);
      } catch {
        window.localStorage.removeItem("cosmolab-profile");
      }
    }

    let familyId = window.localStorage.getItem("cosmolab-family-id");
    if (!familyId) {
      familyId = window.crypto.randomUUID();
      window.localStorage.setItem("cosmolab-family-id", familyId);
    }
    fetch("/api/progress", { headers: { "x-cosmolab-family": familyId } })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (payload?.profile && !stored) {
          setProfile(payload.profile as GameProfile);
          setShowOnboarding(false);
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (showOnboarding) return;
    window.localStorage.setItem("cosmolab-profile", JSON.stringify(profile));
    const familyId = window.localStorage.getItem("cosmolab-family-id");
    if (!familyId) return;
    const timer = window.setTimeout(() => {
      fetch("/api/progress", {
        method: "POST",
        headers: { "content-type": "application/json", "x-cosmolab-family": familyId },
        body: JSON.stringify({ profile }),
      }).catch(() => undefined);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [profile, showOnboarding]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const avatar = avatars.find((item) => item.id === profile.avatarId) ?? avatars[0];
  const level = Math.max(1, Math.floor(profile.xp / 250) + 1);
  const levelProgress = profile.xp % 250;
  const trailMissions = useMemo(() => missions.filter((mission) => profile.trail.includes(mission.id)), [profile.trail]);

  function finishOnboarding(nextProfile: GameProfile) {
    setProfile(nextProfile);
    setShowOnboarding(false);
    setToast(`Bem-vindo à tripulação, ${nextProfile.nickname}!`);
  }

  function toggleTrail(id: string) {
    setProfile((current) => {
      const exists = current.trail.includes(id);
      if (!exists && current.trail.length >= 8) {
        setToast("Sua trilha já tem oito missões.");
        return current;
      }
      return { ...current, trail: exists ? current.trail.filter((item) => item !== id) : [...current.trail, id] };
    });
  }

  function completeMission(id: string) {
    const mission = missions.find((item) => item.id === id);
    if (!mission || profile.completed.includes(id)) return;
    setProfile((current) => ({
      ...current,
      xp: current.xp + mission.xp,
      completed: [...current.completed, id],
      trail: current.trail.filter((item) => item !== id),
      discoveries: [...current.discoveries, `Missão “${mission.title}” concluída com evidências registradas`],
    }));
    setToast(`Descoberta registrada: +${mission.xp} XP`);
  }

  function renderView() {
    if (view === "missions") return <MissionsView profile={profile} onToggleTrail={toggleTrail} onComplete={completeMission} />;
    if (view === "matter") return <MatterLab />;
    if (view === "cosmic") return <CosmicLab />;
    if (view === "uap") return <UapArchive />;
    if (view === "journal") return <JournalView profile={profile} />;
    return <WorldView onNavigate={setView} onPlanet={setPlanet} />;
  }

  return (
    <div className="cosmolab-app">
      <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
      <header className="app-header">
        <button className="brand" onClick={() => setView("universe")} aria-label="CosmoLab, ir ao mapa"><span>✦</span><strong>COSMO<span>LAB</span></strong><small>CIÊNCIA EM EXPEDIÇÃO</small></button>
        <nav aria-label="Navegação principal">
          {navItems.map((item) => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => setView(item.id)}><span aria-hidden="true">{item.icon}</span>{item.label}</button>)}
        </nav>
        <div className="profile-cluster">
          <button className="trail-button" onClick={() => setShowTrail((value) => !value)} aria-expanded={showTrail}><span>◇</span><b>{profile.trail.length}</b><small>Trilha</small></button>
          <div className="xp-cluster"><span>NÍVEL {level}</span><div><i className="xp-fill" /></div><small>{levelProgress}/250 XP</small></div>
          <button className="profile-button" onClick={() => setView("journal")}><span className="profile-avatar">{avatar.emoji}</span><span><strong>{profile.nickname}</strong><small>{profile.ageBand === "explorer" ? "Explorador" : "Pesquisador"}</small></span></button>
        </div>
      </header>

      <main id="main-content">{renderView()}</main>

      {showTrail && (
        <aside className="trail-drawer" aria-label="Sua trilha de missões">
          <div className="drawer-heading"><div><p className="eyebrow">Rota personalizada</p><h2>Sua trilha</h2></div><button onClick={() => setShowTrail(false)} aria-label="Fechar trilha">×</button></div>
          {trailMissions.length === 0 ? <div className="drawer-empty"><span>◇</span><p>Adicione missões para montar sua próxima expedição.</p></div> : (
            <ol>{trailMissions.map((mission, index) => <li key={mission.id}><span>{index + 1}</span><div><small>{mission.region}</small><strong>{mission.title}</strong></div><button onClick={() => toggleTrail(mission.id)} aria-label={`Remover ${mission.title}`}>×</button></li>)}</ol>
          )}
          <button className="primary-button" onClick={() => { setView("missions"); setShowTrail(false); }}>Editar trilha</button>
        </aside>
      )}

      {planet && <div className="planet-overlay"><PlanetSurvey initialPlanet={planet} onClose={() => setPlanet(null)} /></div>}
      {showOnboarding && <Onboarding onComplete={finishOnboarding} />}
      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
      <footer className="science-footer"><span><i /> Conteúdo científico versionado</span><span>Sem anúncios · sem chat · sem rastreamento infantil</span><a href="https://science.nasa.gov/" target="_blank" rel="noreferrer">Fontes e método ↗</a></footer>
    </div>
  );
}
