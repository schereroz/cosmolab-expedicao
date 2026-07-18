"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { CelestialBody, CollisionResult } from "../types";

function createBody(body: CelestialBody, radius: number) {
  const group = new THREE.Group();
  if (body.kind === "buraco-negro") {
    const horizon = new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 32), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    const disk = new THREE.Mesh(new THREE.TorusGeometry(radius * 1.8, radius * 0.22, 18, 96), new THREE.MeshBasicMaterial({ color: 0xffa54b, transparent: true, opacity: 0.84, blending: THREE.AdditiveBlending }));
    disk.rotation.x = 1.18;
    group.add(horizon, disk);
  } else if (body.kind === "minhoca") {
    const portal = new THREE.Mesh(new THREE.TorusGeometry(radius, radius * 0.3, 24, 96), new THREE.MeshStandardMaterial({ color: 0x4be1df, emissive: 0x165f77, emissiveIntensity: 3, metalness: 0.5, roughness: 0.2 }));
    portal.rotation.y = Math.PI / 2;
    group.add(portal);
  } else {
    const material = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(body.color), roughness: body.kind === "planeta" ? 0.72 : 0.48, metalness: 0.04, clearcoat: body.kind === "planeta" ? 0.08 : 0.25, emissive: new THREE.Color(body.color).multiplyScalar(body.kind === "laser" ? 0.8 : 0.04), emissiveIntensity: body.kind === "laser" ? 3 : 0.5, transparent: true });
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 32), material);
    group.add(sphere);
    if (body.atmosphere) {
      const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.045, 48, 32), new THREE.MeshBasicMaterial({ color: 0x77c9ef, transparent: true, opacity: 0.16, side: THREE.BackSide, blending: THREE.AdditiveBlending }));
      group.add(atmosphere);
    }
  }
  return group;
}

function setBodyOpacity(body: THREE.Group, opacity: number) {
  body.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => { material.transparent = true; material.opacity = Math.min(material.opacity, opacity); });
    }
  });
}

export function CollisionScene3D({ projectile, target, speed, angle, result, runId }: { projectile: CelestialBody; target: CelestialBody; speed: number; angle: number; result: CollisionResult | null; runId: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(1.6, window.devicePixelRatio || 1));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02070d);
    scene.fog = new THREE.FogExp2(0x02070d, 0.025);
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(0, 3.2, 14);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight(0x8bcde7, 0x130c08, 1.7));
    const keyLight = new THREE.DirectionalLight(0xffd49a, 4.5); keyLight.position.set(-5, 7, 8); scene.add(keyLight);

    let seed = 73;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const starsArray = new Float32Array(900);
    for (let index = 0; index < starsArray.length; index += 3) { starsArray[index] = (random() - 0.5) * 36; starsArray[index + 1] = (random() - 0.5) * 20; starsArray[index + 2] = -random() * 35; }
    const starGeometry = new THREE.BufferGeometry(); starGeometry.setAttribute("position", new THREE.BufferAttribute(starsArray, 3));
    scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xd9efff, size: 0.06, transparent: true, opacity: 0.85 })));

    const ratio = Math.pow(Math.max(1e-12, projectile.massKg / Math.max(1, target.massKg)), 0.08);
    const projectileRadius = THREE.MathUtils.clamp(ratio, 0.38, 1.05);
    const targetRadius = target.kind === "buraco-negro" ? 1.48 : 1.65;
    const projectileBody = createBody(projectile, projectileRadius);
    const targetBody = createBody(target, targetRadius);
    targetBody.position.set(3.4, 0, 0); scene.add(projectileBody, targetBody);
    const startY = THREE.MathUtils.mapLinear(angle, 5, 85, -1.1, 2.8);
    projectileBody.position.set(-7.2, startY, 0);

    const fragmentPositions = new Float32Array(240);
    const fragmentVelocity = new Float32Array(240);
    for (let index = 0; index < fragmentPositions.length; index += 3) {
      fragmentVelocity[index] = (random() - 0.5) * 4.8; fragmentVelocity[index + 1] = (random() - 0.5) * 4.8; fragmentVelocity[index + 2] = (random() - 0.5) * 3.2;
    }
    const fragmentGeometry = new THREE.BufferGeometry(); fragmentGeometry.setAttribute("position", new THREE.BufferAttribute(fragmentPositions, 3));
    const fragments = new THREE.Points(fragmentGeometry, new THREE.PointsMaterial({ color: new THREE.Color(projectile.color), size: 0.14, transparent: true, opacity: 0, blending: THREE.AdditiveBlending })); scene.add(fragments);
    const flashMaterial = new THREE.MeshBasicMaterial({ color: 0xffd36e, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
    const flash = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 16), flashMaterial); flash.position.set(1.5, 0, 0); scene.add(flash);

    const resize = () => { const width = Math.max(1, canvas.clientWidth); const height = Math.max(1, canvas.clientHeight); renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); };
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(canvas); resize();
    const clock = new THREE.Clock();
    const duration = Math.max(1.7, 3.6 - speed / 45);
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const progress = result ? Math.min(1, elapsed / duration) : 0;
      const approach = Math.min(1, progress / 0.7);
      const eased = 1 - (1 - approach) ** 3;
      projectileBody.position.x = -7.2 + eased * 8.7;
      projectileBody.position.y = startY * (1 - eased);
      projectileBody.rotation.y += 0.008 + speed * 0.00008;
      targetBody.rotation.y += 0.004;
      if (!result) projectileBody.position.y += Math.sin(elapsed * 1.7) * 0.06;
      if (result?.visualEffect === "deflect" && progress > 0.48) projectileBody.position.y += ((progress - 0.48) / 0.52) ** 2 * 6;
      const effectProgress = THREE.MathUtils.clamp((progress - 0.66) / 0.34, 0, 1);
      if (effectProgress > 0) {
        flashMaterial.opacity = Math.max(0, Math.sin(effectProgress * Math.PI) * 0.95); flash.scale.setScalar(1 + effectProgress * 4.5);
        if (result?.visualEffect === "shatter" || result?.visualEffect === "impact") {
          const affected = result.affectedBody === "target" ? targetBody : projectileBody; affected.scale.setScalar(Math.max(result.visualEffect === "impact" ? 0.72 : 0.02, 1 - effectProgress * 1.25));
          const positions = fragmentGeometry.getAttribute("position") as THREE.BufferAttribute;
          for (let index = 0; index < positions.array.length; index += 3) { positions.array[index] = fragmentVelocity[index] * effectProgress; positions.array[index + 1] = fragmentVelocity[index + 1] * effectProgress; positions.array[index + 2] = fragmentVelocity[index + 2] * effectProgress; }
          positions.needsUpdate = true; (fragments.material as THREE.PointsMaterial).opacity = effectProgress < 0.95 ? 0.9 : 0.25; fragments.position.copy(flash.position);
        } else if (result?.visualEffect === "swallow") {
          const swallowed = result.affectedBody === "target" ? targetBody : projectileBody; swallowed.position.lerp(result.affectedBody === "target" ? projectileBody.position : targetBody.position, effectProgress * 0.16); swallowed.scale.set(1 + effectProgress * 1.8, Math.max(0.02, 1 - effectProgress), Math.max(0.02, 1 - effectProgress)); setBodyOpacity(swallowed, 1 - effectProgress);
        } else if (result?.visualEffect === "merge") {
          projectileBody.scale.setScalar(Math.max(0.02, 1 - effectProgress)); targetBody.scale.setScalar(1 + effectProgress * 0.14);
        } else if (result?.visualEffect === "portal") setBodyOpacity(projectileBody, 1 - effectProgress);
        else if (result?.visualEffect === "expel") projectileBody.position.x -= effectProgress * 7;
      }
      camera.position.x = Math.sin(elapsed * 0.18) * 0.22;
      renderer.render(scene, camera);
    };
    animate();
    return () => { cancelAnimationFrame(frame); resizeObserver.disconnect(); scene.traverse((object) => { if (object instanceof THREE.Mesh || object instanceof THREE.Points) { object.geometry.dispose(); const material = object.material; if (Array.isArray(material)) material.forEach((item) => item.dispose()); else material.dispose(); } }); renderer.dispose(); };
  }, [projectile, target, speed, angle, result, runId]);

  const blackHoleInvolved = projectile.kind === "buraco-negro" || target.kind === "buraco-negro";
  return <div className="collision-3d-stage"><canvas ref={canvasRef} aria-label={`Simulação 3D do encontro entre ${projectile.name} e ${target.name}`} /><div className="collision-3d-label label-projectile"><small>OBJETO LANÇADO</small><strong>{projectile.name}</strong></div><div className="collision-3d-label label-target"><small>ALVO</small><strong>{target.name}</strong></div><div className="collision-3d-hud"><span>v = {speed} km/s</span><span>θ = {angle}°</span><span>{result ? result.outcome : "Aguardando simulação"}</span></div><p>{blackHoleInvolved ? "Visualização aproximada: o horizonte de eventos é uma fronteira, e o disco brilhante representa matéria aquecida antes de atravessá-la." : "Geometria e tempo comprimidos. Fragmentos, deformação e aquecimento são aproximações educativas guiadas pela energia do encontro."}</p></div>;
}
