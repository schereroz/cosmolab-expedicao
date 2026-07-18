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
import { ProfileSettings } from "./ProfileSettings";
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
  streak: 3,
  lastActiveDate: "",
  badges: ["primeira-descoberta"],
};

const navItems: Array<{ id: ViewId; label: string; icon: string }> = [
  { id: "universe", label: "Explorar", icon: "✦" },
  { id: "missions", label: "Missões", icon: "◇" },
  { id: "matter", label: "Matéria", icon: "⚛" },
  { id: "cosmic", label: "Colisões", icon: "☄" },
  { id: "uap", label: "Arquivo UAP", icon: "?" },
  { id: "journal", label: "Diário", icon: "▤" },
];

function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function unlockBadges(completedCount: number, streak: number) {
  return [completedCount >= 1 && "primeira-descoberta", completedCount >= 4 && "quatro-regioes", completedCount >= 8 && "cientista-orbital", completedCount >= 16 && "mestre-cosmolab", streak >= 3 && "sequencia-3", streak >= 7 && "sequencia-7"].filter(Boolean) as string[];
}

function registerDailyVisit(profile: GameProfile): GameProfile {
  const today = localDateKey();
  if (profile.lastActiveDate === today) return { ...profile, badges: Array.from(new Set([...(profile.badges ?? []), ...unlockBadges(profile.completed.length, profile.streak ?? 1)])) };
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const streak = profile.lastActiveDate === localDateKey(yesterday) ? (profile.streak ?? 0) + 1 : 1;
  return { ...profile, streak, lastActiveDate: today, badges: Array.from(new Set([...(profile.badges ?? []), ...unlockBadges(profile.completed.length, streak)])) };
}

export function CosmoApp() {
  const [view, setView] = useState<ViewId>("universe");
  const [profile, setProfile] = useState<GameProfile>(demoProfile);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [planet, setPlanet] = useState<PlanetRecord | null>(null);
  const [showTrail, setShowTrail] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("cosmolab-profile");
    if (stored) {
      try {
        const storedProfile = JSON.parse(stored) as GameProfile;
        window.setTimeout(() => {
          setProfile(registerDailyVisit(storedProfile));
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
          setProfile(registerDailyVisit(payload.profile as GameProfile));
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
    setProfile(registerDailyVisit(nextProfile));
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
    setProfile((current) => {
      const completed = [...current.completed, id];
      return { ...current, xp: current.xp + mission.xp, completed, trail: current.trail.filter((item) => item !== id), discoveries: [...current.discoveries, `Missão “${mission.title}” concluída com evidências registradas`], badges: Array.from(new Set([...(current.badges ?? []), ...unlockBadges(completed.length, current.streak ?? 1)])) };
    });
    setToast(`Descoberta registrada: +${mission.xp} XP`);
  }

  function renderView() {
    if (view === "missions") return <MissionsView profile={profile} onToggleTrail={toggleTrail} onComplete={completeMission} />;
    if (view === "matter") return <MatterLab mode={profile.ageBand} />;
    if (view === "cosmic") return <CosmicLab mode={profile.ageBand} />;
    if (view === "uap") return <UapArchive mode={profile.ageBand} />;
    if (view === "journal") return <JournalView profile={profile} onOpenProfile={() => setShowSettings(true)} />;
    return <WorldView profile={profile} onNavigate={setView} onPlanet={setPlanet} />;
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
          <button className="help-button" onClick={() => setShowHelp(true)} aria-label="Abrir guia de como jogar">?</button>
          <button className="trail-button" onClick={() => setShowTrail((value) => !value)} aria-expanded={showTrail}><span>◇</span><b>{profile.trail.length}</b><small>Trilha</small></button>
          <div className="xp-cluster"><span>NÍVEL {level}</span><progress max={250} value={levelProgress} aria-label={`${levelProgress} de 250 XP para o próximo nível`} /><small>{levelProgress}/250 XP</small></div>
          <button className="profile-button" onClick={() => setShowSettings(true)} aria-label="Abrir perfil de aprendizagem"><span className="profile-avatar">{avatar.emoji}</span><span><strong>{profile.nickname}</strong><small>{profile.ageBand === "explorer" ? "Explorador" : "Pesquisador"} · editar</small></span></button>
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

      {planet && <div className="planet-overlay"><PlanetSurvey initialPlanet={planet} mode={profile.ageBand} avatarId={profile.avatarId} onClose={() => setPlanet(null)} /></div>}
      {showOnboarding && <Onboarding onComplete={finishOnboarding} />}
      {showSettings && <ProfileSettings profile={profile} onChange={(next) => { setProfile(next); setToast(`Modo ${next.ageBand === "explorer" ? "Explorador" : "Pesquisador"} ativado`); }} onClose={() => setShowSettings(false)} />}
      {showHelp && <div className="settings-overlay" role="dialog" aria-modal="true" aria-labelledby="help-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowHelp(false); }}><section className="settings-card help-card"><div className="drawer-heading"><div><p className="eyebrow">Central de bordo</p><h2 id="help-title">Como explorar o CosmoLab</h2></div><button onClick={() => setShowHelp(false)} aria-label="Fechar ajuda">×</button></div><div className="tour-steps compact"><article><span>1</span><div><strong>Escolha uma área</strong><p>Use o mapa ou o menu superior.</p></div></article><article><span>2</span><div><strong>Abra “Como jogar”</strong><p>Cada atividade mostra objetivo e passos.</p></div></article><article><span>3</span><div><strong>Faça uma previsão</strong><p>Ciência começa com uma pergunta testável.</p></div></article><article><span>4</span><div><strong>Compare evidências</strong><p>Confira o Passaporte Científico antes de concluir.</p></div></article></div><button className="primary-button settings-done" onClick={() => setShowHelp(false)}>Entendi, vamos explorar</button></section></div>}
      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
      <footer className="science-footer"><span><i /> Conteúdo científico versionado</span><span>Sem anúncios · sem chat · sem rastreamento infantil</span><a href="https://science.nasa.gov/" target="_blank" rel="noreferrer">Fontes e método ↗</a></footer>
    </div>
  );
}
