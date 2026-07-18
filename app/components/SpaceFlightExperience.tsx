"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import * as THREE from "three";
import { avatars, planets } from "../data";
import type { GameProfile, PlanetRecord } from "../types";
import { CockpitHUD } from "./CockpitHUD";

type FlightControl = "thrust" | "brake" | "left" | "right";
type FlightView = "cockpit" | "chase";

const planetPositions: Record<string, [number, number, number]> = {
  mars: [-22, 3, -85],
  europa: [28, -5, -120],
  jupiter: [54, 10, -168],
  kepler: [-58, 13, -220],
};

const crewTips: Record<string, string> = {
  panda: "Motores transformam energia química em movimento. Observe como o empuxo altera sua velocidade.",
  gorila: "Inércia é teimosa: sem uma força contrária, a nave continua seguindo em frente.",
  capivara: "Correções pequenas e antecipadas gastam menos combustível do que mudanças bruscas perto do destino.",
  axolote: "A nave precisa controlar calor mesmo no espaço: radiação é a principal forma de dissipá-lo no vácuo.",
  coruja: "Navegação compara estrelas, sensores e trajetória prevista. Um único sinal nunca conta a história toda.",
  polvo: "Sensores diferentes reduzem incertezas: posição, velocidade e orientação precisam ser combinadas.",
};

function createShip() {
  const ship = new THREE.Group();
  const hull = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 1.05, 4.6, 18), new THREE.MeshStandardMaterial({ color: 0xe8e4d7, metalness: 0.55, roughness: 0.28 }));
  hull.rotation.x = Math.PI / 2;
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.73, 1.8, 18), new THREE.MeshStandardMaterial({ color: 0xe1794f, metalness: 0.35, roughness: 0.32 }));
  nose.rotation.x = -Math.PI / 2;
  nose.position.z = -3.15;
  const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.72, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: 0x4b8fac, emissive: 0x102f34, emissiveIntensity: 0.6, transparent: true, opacity: 0.88, roughness: 0.08 }));
  cockpit.rotation.x = Math.PI / 2;
  cockpit.position.set(0, 0.6, -1.2);
  const wingMaterial = new THREE.MeshStandardMaterial({ color: 0x276c69, metalness: 0.5, roughness: 0.3 });
  const leftWing = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.16, 1.7), wingMaterial);
  leftWing.position.set(-1.65, 0, 0.45);
  leftWing.rotation.z = -0.12;
  const rightWing = leftWing.clone();
  rightWing.position.x = 1.65;
  rightWing.rotation.z = 0.12;
  const engineMaterial = new THREE.MeshStandardMaterial({ color: 0xf1c84a, emissive: 0xf1c84a, emissiveIntensity: 3 });
  const leftEngine = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.42, 0.8, 14), engineMaterial);
  leftEngine.rotation.x = Math.PI / 2;
  leftEngine.position.set(-0.55, 0, 2.55);
  const rightEngine = leftEngine.clone();
  rightEngine.position.x = 0.55;
  ship.add(hull, nose, cockpit, leftWing, rightWing, leftEngine, rightEngine);
  ship.scale.setScalar(0.82);
  return ship;
}

export function SpaceFlightExperience({ profile, initialDestination, onClose, onArrive }: { profile: GameProfile; initialDestination?: PlanetRecord; onClose: () => void; onArrive: (planet: PlanetRecord) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<Record<FlightControl, boolean>>({ thrust: false, brake: false, left: false, right: false });
  const destinationRef = useRef(initialDestination?.id ?? "mars");
  const autopilotRef = useRef(false);
  const pausedRef = useRef(false);
  const arrivedRef = useRef(false);
  const viewModeRef = useRef<FlightView>("cockpit");
  const [destinationId, setDestinationId] = useState(initialDestination?.id ?? "mars");
  const [autopilot, setAutopilot] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [arrived, setArrived] = useState(false);
  const [speakerId, setSpeakerId] = useState(profile.avatarId);
  const [viewMode, setViewMode] = useState<FlightView>("cockpit");
  const destination = useMemo(() => planets.find((planet) => planet.id === destinationId) ?? planets[0], [destinationId]);
  const speaker = avatars.find((avatar) => avatar.id === speakerId) ?? avatars[0];

  useEffect(() => { destinationRef.current = destinationId; }, [destinationId]);
  useEffect(() => { autopilotRef.current = autopilot; }, [autopilot]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { viewModeRef.current = viewMode; }, [viewMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(1.75, window.devicePixelRatio || 1));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    const scene = new THREE.Scene();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scene.background = new THREE.Color(0x030b16);
    scene.fog = new THREE.FogExp2(0x07131d, 0.0055);
    const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 900);
    camera.position.set(0, 5, 18);

    scene.add(new THREE.HemisphereLight(0xa7d9ff, 0x101016, 2.1));
    const sun = new THREE.DirectionalLight(0xffe1a1, 4.2);
    sun.position.set(-35, 30, 20);
    scene.add(sun);

    let seed = 24681357;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const starPositions = new Float32Array(3600);
    for (let index = 0; index < starPositions.length; index += 3) {
      starPositions[index] = (random() - 0.5) * 440;
      starPositions[index + 1] = (random() - 0.5) * 260;
      starPositions[index + 2] = -random() * 500 + 50;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xe7f5ff, size: 0.42, sizeAttenuation: true, transparent: true, opacity: 0.92 }));
    scene.add(stars);

    const planetMeshes = new Map<string, THREE.Mesh>();
    const destinationRings = new Map<string, THREE.Mesh>();
    planets.forEach((planet) => {
      const size = planet.id === "jupiter" ? 8 : planet.id === "kepler" ? 4.6 : 3.2;
      const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(planet.color), roughness: 0.72, metalness: 0.05, emissive: new THREE.Color(planet.color).multiplyScalar(0.07) });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(size, 48, 32), material);
      mesh.position.fromArray(planetPositions[planet.id]);
      mesh.userData.radius = size;
      scene.add(mesh);
      planetMeshes.set(planet.id, mesh);
      const destinationRing = new THREE.Mesh(new THREE.TorusGeometry(size + 1.7, 0.08, 12, 72), new THREE.MeshBasicMaterial({ color: 0x76d5d0, transparent: true, opacity: 0.72 }));
      destinationRing.position.copy(mesh.position);
      destinationRing.rotation.x = Math.PI / 2;
      scene.add(destinationRing);
      destinationRings.set(planet.id, destinationRing);
      if (planet.id === "jupiter") {
        const ring = new THREE.Mesh(new THREE.RingGeometry(10, 12.2, 64), new THREE.MeshBasicMaterial({ color: 0xd9c18c, transparent: true, opacity: 0.38, side: THREE.DoubleSide }));
        ring.position.copy(mesh.position);
        ring.rotation.x = Math.PI / 2.35;
        scene.add(ring);
      }
    });

    const ship = createShip();
    ship.position.set(0, 0, 12);
    const exhaustPositions = new Float32Array(270);
    for (let index = 0; index < exhaustPositions.length; index += 3) {
      exhaustPositions[index] = (random() - 0.5) * 1.1;
      exhaustPositions[index + 1] = (random() - 0.5) * 0.45;
      exhaustPositions[index + 2] = 2.8 + random() * 12;
    }
    const exhaustGeometry = new THREE.BufferGeometry();
    exhaustGeometry.setAttribute("position", new THREE.BufferAttribute(exhaustPositions, 3));
    const exhaustMaterial = new THREE.PointsMaterial({ color: 0x79d8ec, size: 0.24, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false });
    const exhaust = new THREE.Points(exhaustGeometry, exhaustMaterial);
    ship.add(exhaust);
    scene.add(ship);
    const velocity = new THREE.Vector3(0, 0, -0.035);
    const forward = new THREE.Vector3(0, 0, -1);
    const targetDirection = new THREE.Vector3();
    const cameraTarget = new THREE.Vector3();
    const clock = new THREE.Clock();
    let animationFrame = 0;
    let telemetryElapsed = 0;

    const keyState = (active: boolean) => (event: KeyboardEvent) => {
      const map: Partial<Record<string, FlightControl>> = { ArrowUp: "thrust", KeyW: "thrust", ArrowDown: "brake", KeyS: "brake", ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right" };
      const control = map[event.code];
      if (control) { event.preventDefault(); controlsRef.current[control] = active; }
    };
    const keyDown = keyState(true);
    const keyUp = keyState(false);
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    const resize = () => {
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const animate = () => {
      animationFrame = window.requestAnimationFrame(animate);
      const delta = Math.min(0.034, clock.getDelta());
      if (pausedRef.current) { renderer.render(scene, camera); return; }
      const target = planetMeshes.get(destinationRef.current);
      if (!target) return;
      destinationRings.forEach((ring, planetId) => { ring.visible = planetId === destinationRef.current; });
      targetDirection.copy(target.position).sub(ship.position);
      const currentDistance = targetDirection.length();
      targetDirection.normalize();
      if (autopilotRef.current && !arrivedRef.current) {
        forward.lerp(targetDirection, Math.min(1, delta * 2.4)).normalize();
        ship.lookAt(ship.position.clone().sub(forward));
        velocity.lerp(forward.clone().multiplyScalar(0.32), Math.min(1, delta * 1.2));
      } else {
        if (controlsRef.current.left) ship.rotateY(delta * 1.45);
        if (controlsRef.current.right) ship.rotateY(-delta * 1.45);
        forward.set(0, 0, -1).applyQuaternion(ship.quaternion).normalize();
        if (controlsRef.current.thrust) velocity.addScaledVector(forward, delta * 0.31);
        if (controlsRef.current.brake) velocity.multiplyScalar(Math.max(0.88, 1 - delta * 2.8));
        velocity.clampLength(0, 0.46);
      }
      if (!arrivedRef.current) ship.position.addScaledVector(velocity, delta * 60);
      const exhaustAttribute = exhaustGeometry.getAttribute("position") as THREE.BufferAttribute;
      const exhaustBoost = autopilotRef.current || controlsRef.current.thrust ? 1 : Math.min(0.6, velocity.length() * 2.5);
      exhaustMaterial.opacity = arrivedRef.current ? 0.04 : 0.18 + exhaustBoost * 0.68;
      for (let index = 2; index < exhaustAttribute.array.length; index += 3) {
        exhaustAttribute.array[index] = Number(exhaustAttribute.array[index]) + delta * (8 + exhaustBoost * 24);
        if (Number(exhaustAttribute.array[index]) > 15) exhaustAttribute.array[index] = 2.8 + random() * 1.5;
      }
      exhaustAttribute.needsUpdate = true;
      const arrivalRadius = Number(target.userData.radius) + 5.2;
      if (currentDistance <= arrivalRadius && !arrivedRef.current) {
        arrivedRef.current = true;
        setArrived(true);
        setAutopilot(false);
        velocity.set(0, 0, 0);
      }
      stars.position.z += delta * velocity.length() * 4;
      if (!reduceMotion) target.rotation.y += delta * 0.08;
      const targetRing = destinationRings.get(destinationRef.current);
      if (targetRing) { targetRing.rotation.z += delta * 0.35; targetRing.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2) * 0.04); }
      const inCockpit = viewModeRef.current === "cockpit";
      const cameraOffset = inCockpit ? new THREE.Vector3(0, 0.62, -0.42) : new THREE.Vector3(0, 5.2, 14);
      cameraTarget.copy(ship.position).add(cameraOffset.applyQuaternion(ship.quaternion));
      camera.position.lerp(cameraTarget, Math.min(1, delta * (inCockpit ? 7.5 : 3.4)));
      if (inCockpit && !reduceMotion && (controlsRef.current.thrust || autopilotRef.current)) camera.position.y += Math.sin(clock.elapsedTime * 42) * 0.018;
      const desiredFov = inCockpit ? 61 + velocity.length() * 12 : 58;
      camera.fov += (desiredFov - camera.fov) * Math.min(1, delta * 3);
      camera.updateProjectionMatrix();
      camera.lookAt(ship.position.clone().add(forward.clone().multiplyScalar(12)));
      telemetryElapsed += delta;
      if (telemetryElapsed > 0.12) {
        telemetryElapsed = 0;
        setSpeed(Math.round(velocity.length() * 83_000));
        setDistance(Math.max(0, Math.round(currentDistance * 82_000)));
      }
      renderer.render(scene, camera);
    };
    animate();
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      resizeObserver.disconnect();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose()); else material.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  function setControl(control: FlightControl, active: boolean) { controlsRef.current[control] = active; }

  return (
    <div className="flight-overlay" role="dialog" aria-modal="true" aria-labelledby="flight-title">
      <canvas ref={canvasRef} className="flight-canvas" aria-label={`Simulação 3D da nave viajando para ${destination.name}`} />
      <header className="flight-topbar">
        <div><p className="eyebrow">Simulador de voo 3D · modelo educativo</p><h1 id="flight-title">Comande a nave Aurora</h1></div>
        <label>Destino<select value={destinationId} onChange={(event) => { destinationRef.current = event.target.value; arrivedRef.current = false; setArrived(false); setDestinationId(event.target.value); setAutopilot(false); }} disabled={arrived}>{planets.map((planet) => <option key={planet.id} value={planet.id}>{planet.name} · {planet.landingMode === "pouso" ? "pouso" : "sonda"}</option>)}</select></label>
        <div className="flight-view-toggle" aria-label="Escolher câmera"><button className={viewMode === "cockpit" ? "active" : ""} onClick={() => setViewMode("cockpit")} aria-label="Usar visão interna da cabine" aria-pressed={viewMode === "cockpit"}>Cabine</button><button className={viewMode === "chase" ? "active" : ""} onClick={() => setViewMode("chase")} aria-label="Usar visão externa da nave" aria-pressed={viewMode === "chase"}>Externa</button></div>
        <button onClick={() => setPaused((value) => !value)} aria-pressed={paused}>{paused ? "Continuar" : "Pausar"}</button>
        <button className="flight-close" onClick={onClose} aria-label="Fechar simulador de voo">×</button>
      </header>

      {viewMode === "cockpit" ? <CockpitHUD speakerId={speakerId} destinationName={destination.name} message={arrived ? `Chegamos à zona segura de ${destination.name}. Agora vamos observar antes de pousar.` : crewTips[speaker.id]} speed={speed} distance={distance} fuel={Math.max(18, 100 - Math.round(speed / 1_800))} autopilot={autopilot} arrived={arrived} onSpeakerChange={setSpeakerId} /> : <aside className="flight-crew-panel" aria-label="Comunicador da tripulação">
        <Image src="/cosmolab-crew-cockpit.png" alt="Panda, gorila, capivara, axolote, coruja e polvo astronautas dentro da nave" width={1672} height={941} priority />
        <div className="crew-message"><small>COMUNICADOR · {speaker.role}</small><strong>{speaker.name} na escuta</strong><p>{arrived ? `Chegamos à zona segura de ${destination.name}. Agora vamos observar antes de pousar.` : crewTips[speaker.id]}</p></div>
        <div className="crew-switcher" aria-label="Falar com a tripulação">{avatars.map((avatar) => <button key={avatar.id} className={speakerId === avatar.id ? "active" : ""} onClick={() => setSpeakerId(avatar.id)} aria-label={`Ouvir ${avatar.name}`}>{avatar.name}</button>)}</div>
      </aside>}

      {viewMode === "chase" && <section className="flight-telemetry" aria-label="Telemetria da nave">
        <span><small>VELOCIDADE</small><strong>{speed.toLocaleString("pt-BR")} km/h</strong></span>
        <span><small>DISTÂNCIA ATÉ {destination.name.toUpperCase()}</small><strong>{distance.toLocaleString("pt-BR")} km</strong></span>
        <span><small>MODO</small><strong>{arrived ? "Em órbita segura" : autopilot ? "Piloto automático" : "Pilotagem manual"}</strong></span>
      </section>}

      <div className="flight-controls" aria-label="Controles da nave">
        <button onPointerDown={() => setControl("left", true)} onPointerUp={() => setControl("left", false)} onPointerLeave={() => setControl("left", false)} aria-label="Virar nave à esquerda">←<small>ESQUERDA</small></button>
        <button className="thrust-control" onPointerDown={() => setControl("thrust", true)} onPointerUp={() => setControl("thrust", false)} onPointerLeave={() => setControl("thrust", false)} aria-label="Acelerar nave">↑<small>ACELERAR</small></button>
        <button onPointerDown={() => setControl("brake", true)} onPointerUp={() => setControl("brake", false)} onPointerLeave={() => setControl("brake", false)} aria-label="Frear nave">↓<small>FREAR</small></button>
        <button onPointerDown={() => setControl("right", true)} onPointerUp={() => setControl("right", false)} onPointerLeave={() => setControl("right", false)} aria-label="Virar nave à direita">→<small>DIREITA</small></button>
      </div>

      <div className="flight-actions-panel">
        <p><kbd>W</kbd>/<kbd>↑</kbd> acelerar · <kbd>A</kbd>/<kbd>D</kbd> virar · <kbd>S</kbd>/<kbd>↓</kbd> frear</p>
        {!arrived ? <button className="autopilot-button" onClick={() => setAutopilot((value) => !value)} aria-pressed={autopilot}>{autopilot ? "Desligar piloto automático" : "Piloto automático"}</button> : <button className="arrival-button" onClick={() => onArrive(destination)}>{destination.landingMode === "pouso" ? `Pousar em ${destination.name}` : `Lançar sonda em ${destination.name}`}</button>}
      </div>
      <p className="flight-model-note">Escalas, velocidades e distâncias foram comprimidas para o jogo. A pilotagem demonstra inércia, aceleração e correção de trajetória; não reproduz uma missão real.</p>
    </div>
  );
}
