"use client";

import Image from "next/image";
import { avatars } from "../data";

interface CockpitHUDProps {
  speakerId: string;
  destinationName: string;
  message: string;
  speed: number;
  distance: number;
  fuel: number;
  alignment: number;
  autopilot: boolean;
  arrived: boolean;
  onToggleAutopilot: () => void;
  onSpeakerChange: (avatarId: string) => void;
}

export function CockpitHUD({ speakerId, destinationName, message, speed, distance, fuel, alignment, autopilot, arrived, onToggleAutopilot, onSpeakerChange }: CockpitHUDProps) {
  const speaker = avatars.find((avatar) => avatar.id === speakerId) ?? avatars[0];
  const integrity = Math.max(96, 100 - Math.round(speed / 25_000));

  return (
    <div className="cockpit-hud" aria-label="Visão interna da cabine">
      <Image className="cockpit-interior-art" src="/cosmolab-cockpit-first-person.png" alt="Interior da nave Aurora com os seis animais exploradores em seus postos científicos" fill sizes="100vw" priority unoptimized />
      <div className="cockpit-windshield" aria-hidden="true"><span className="aim-reticle" /><i className="horizon-line" /></div>

      <section className="cockpit-readouts" aria-label="Instrumentos da cabine">
        <div><small>VETOR</small><strong>{autopilot ? "AUTO" : "MANUAL"}</strong></div>
        <div><small>VELOCIDADE</small><strong>{speed.toLocaleString("pt-BR")} km/h</strong></div>
        <div><small>DISTÂNCIA</small><strong>{distance.toLocaleString("pt-BR")} km</strong></div>
        <div><small>DESTINO</small><strong>{destinationName}</strong></div>
      </section>

      <section className="cockpit-systems" aria-label="Estado dos sistemas da nave">
        <label>Combustível <meter min="0" max="100" value={fuel}>{fuel}%</meter><b>{fuel}%</b></label>
        <label>Integridade <meter min="0" max="100" value={integrity}>{integrity}%</meter><b>{integrity}%</b></label>
      </section>

      {!arrived && <section className="cockpit-route" aria-label="Assistência de navegação"><div><small>NAVEGAÇÃO</small><strong>Alinhamento com a rota</strong></div><b>{alignment}%</b><progress max="100" value={alignment}>{alignment}%</progress><p>{alignment > 86 ? `Rota alinhada com ${destinationName}. Acelere ou deixe a nave conduzir a aproximação.` : `A mira está fora da rota de ${destinationName}. A assistência fará uma correção suave.`}</p><button onClick={onToggleAutopilot} aria-pressed={autopilot}>{autopilot ? "Assumir controles" : "Iniciar rota assistida"}</button></section>}

      <aside className="cockpit-communicator" aria-live="polite">
        <small>CANAL DA TRIPULAÇÃO · {speaker.role}</small>
        <strong>{arrived ? `${speaker.name}: órbita segura` : `${speaker.name} na cabine`}</strong>
        <p>{message}</p>
        <div>{avatars.map((avatar) => <button key={avatar.id} className={speakerId === avatar.id ? "active" : ""} onClick={() => onSpeakerChange(avatar.id)} aria-label={`Ouvir ${avatar.name} na cabine`}>{avatar.name}</button>)}</div>
      </aside>
    </div>
  );
}
