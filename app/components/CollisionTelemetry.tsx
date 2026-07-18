"use client";

import { useEffect, useMemo, useRef } from "react";
import { buildEncounterTelemetry, formatScientific } from "../lib/science";
import type { CelestialBody, CollisionResult } from "../types";

function formatDuration(seconds: number) {
  if (seconds < 0.001) return `${(seconds * 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} µs`;
  if (seconds < 1) return `${(seconds * 1_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} ms`;
  return `${seconds.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} s`;
}

export function CollisionTelemetry({ projectile, target, speed, angle, result }: { projectile: CelestialBody; target: CelestialBody; speed: number; angle: number; result: CollisionResult }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const telemetry = useMemo(() => buildEncounterTelemetry(projectile, target, speed, angle), [projectile, target, speed, angle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || telemetry.points.length < 2) return;
    const width = Math.max(560, canvas.clientWidth || 760);
    const height = 290;
    const density = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = width * density;
    canvas.height = height * density;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.scale(density, density);
    context.fillStyle = "#071e23";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "rgba(255,255,255,.08)";
    context.lineWidth = 1;
    for (let x = 40; x < width; x += 55) { context.beginPath(); context.moveTo(x, 18); context.lineTo(x, height - 26); context.stroke(); }
    for (let y = 24; y < height; y += 42) { context.beginPath(); context.moveTo(35, y); context.lineTo(width - 20, y); context.stroke(); }

    const points = telemetry.points;
    const minX = Math.min(...points.map((point) => point.xM));
    const maxX = Math.max(...points.map((point) => point.xM), target.radiusM * 1.4);
    const minY = Math.min(...points.map((point) => point.yM), -target.radiusM * 1.2);
    const maxY = Math.max(...points.map((point) => point.yM), target.radiusM * 1.2);
    const plotHeight = 175;
    const mapX = (value: number) => 45 + ((value - minX) / Math.max(1, maxX - minX)) * (width - 90);
    const mapY = (value: number) => 18 + (1 - (value - minY) / Math.max(1, maxY - minY)) * plotHeight;

    const targetX = mapX(0);
    const targetY = mapY(0);
    const targetPlotRadius = Math.max(8, Math.min(34, Math.abs(mapX(target.radiusM) - targetX)));
    if (target.atmosphere) { const atmosphericGlow = context.createRadialGradient(targetX, targetY, targetPlotRadius, targetX, targetY, targetPlotRadius * 1.8); atmosphericGlow.addColorStop(0, "rgba(78,160,190,.16)"); atmosphericGlow.addColorStop(1, "rgba(78,160,190,0)"); context.fillStyle = atmosphericGlow; context.beginPath(); context.arc(targetX, targetY, targetPlotRadius * 1.8, 0, Math.PI * 2); context.fill(); }
    const targetGradient = context.createRadialGradient(targetX - targetPlotRadius * 0.35, targetY - targetPlotRadius * 0.35, 1, targetX, targetY, targetPlotRadius);
    targetGradient.addColorStop(0, target.kind === "buraco-negro" ? "#ffcf70" : "#75bfd4"); targetGradient.addColorStop(target.kind === "buraco-negro" ? 0.34 : 0.72, target.kind === "buraco-negro" ? "#050505" : "#336a82"); targetGradient.addColorStop(1, "#061015");
    context.fillStyle = targetGradient; context.beginPath(); context.arc(targetX, targetY, targetPlotRadius, 0, Math.PI * 2); context.fill();

    context.strokeStyle = "rgba(241,200,74,.18)";
    context.lineWidth = 9;
    context.beginPath();
    points.forEach((point, index) => index === 0 ? context.moveTo(mapX(point.xM), mapY(point.yM)) : context.lineTo(mapX(point.xM), mapY(point.yM)));
    context.stroke();
    const trajectoryGradient = context.createLinearGradient(45, 0, width - 45, 0); trajectoryGradient.addColorStop(0, "#6fd6d1"); trajectoryGradient.addColorStop(0.7, "#f1c84a"); trajectoryGradient.addColorStop(1, "#ff7654");
    context.strokeStyle = trajectoryGradient; context.lineWidth = 2.2; context.shadowColor = "rgba(241,200,74,.65)"; context.shadowBlur = 7; context.beginPath(); points.forEach((point, index) => index === 0 ? context.moveTo(mapX(point.xM), mapY(point.yM)) : context.lineTo(mapX(point.xM), mapY(point.yM))); context.stroke(); context.shadowBlur = 0;
    const closestPoint = points.reduce((closest, point) => point.distanceM < closest.distanceM ? point : closest, points[0]);
    context.fillStyle = "#ffd36c"; context.beginPath(); context.arc(mapX(closestPoint.xM), mapY(closestPoint.yM), 3.5, 0, Math.PI * 2); context.fill();

    const maxSpeed = Math.max(...points.map((point) => point.speedMs));
    const graphTop = 218;
    const speedFill = context.createLinearGradient(0, graphTop, 0, height - 27); speedFill.addColorStop(0, "rgba(119,224,192,.32)"); speedFill.addColorStop(1, "rgba(119,224,192,0)");
    context.beginPath();
    points.forEach((point, index) => { const px = 45 + (index / Math.max(1, points.length - 1)) * (width - 70); const py = height - 28 - (point.speedMs / Math.max(1, maxSpeed)) * 42; if (index === 0) context.moveTo(px, height - 28); context.lineTo(px, py); });
    context.lineTo(width - 25, height - 28); context.closePath(); context.fillStyle = speedFill; context.fill();
    context.strokeStyle = "#77e0c0";
    context.lineWidth = 2;
    context.beginPath();
    points.forEach((point, index) => {
      const px = 45 + (index / Math.max(1, points.length - 1)) * (width - 70);
      const py = height - 28 - (point.speedMs / Math.max(1, maxSpeed)) * 42;
      if (index === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    });
    context.stroke();
    context.fillStyle = "#a9c1bc";
    context.font = "10px sans-serif";
    context.fillText("TRAJETÓRIA NO PLANO", 45, 16);
    context.fillText("VELOCIDADE RELATIVA × TEMPO", 45, graphTop);
    context.fillText("início", 45, height - 10);
    context.fillText("fim do cálculo", width - 100, height - 10);
  }, [telemetry, target.radiusM, target.atmosphere, target.kind]);

  const relativisticWarning = telemetry.peakSpeedMs > 29_979_245.8;
  return <section className="collision-telemetry" aria-labelledby="telemetry-title"><div className="telemetry-heading"><div><p className="eyebrow">Gráfico calculado</p><h2 id="telemetry-title">Telemetria do encontro</h2></div><span>{result.outcome}</span></div><canvas ref={canvasRef} aria-label={`Trajetória calculada de ${projectile.name} em direção a ${target.name}, com gráfico de velocidade relativa`} /><div className="telemetry-stats"><span><small>Maior aproximação</small><strong>{formatScientific(telemetry.closestApproachM)} m</strong></span><span><small>Velocidade máxima</small><strong>{(telemetry.peakSpeedMs / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km/s</strong></span><span><small>Tempo modelado</small><strong>{formatDuration(telemetry.durationS)}</strong></span></div><p>{telemetry.modelNote} A curva é quantitativa, mas não inclui relatividade, deformação ou dinâmica completa dos fluidos. {relativisticWarning && <strong>Velocidades relativísticas excedem a confiabilidade deste modelo newtoniano.</strong>}</p></section>;
}
