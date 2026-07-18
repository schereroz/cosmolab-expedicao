"use client";

import { useEffect, useMemo, useRef } from "react";
import { buildEncounterTelemetry, formatScientific } from "../lib/science";
import type { CelestialBody, CollisionResult } from "../types";

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

    context.strokeStyle = "#f1c84a";
    context.lineWidth = 2;
    context.beginPath();
    points.forEach((point, index) => index === 0 ? context.moveTo(mapX(point.xM), mapY(point.yM)) : context.lineTo(mapX(point.xM), mapY(point.yM)));
    context.stroke();
    context.fillStyle = "#4b8fac";
    context.beginPath(); context.arc(mapX(0), mapY(0), 8, 0, Math.PI * 2); context.fill();
    context.strokeStyle = "rgba(75,143,172,.55)";
    context.beginPath(); context.arc(mapX(0), mapY(0), 15, 0, Math.PI * 2); context.stroke();

    const maxSpeed = Math.max(...points.map((point) => point.speedMs));
    const graphTop = 218;
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
  }, [telemetry, target.radiusM]);

  return <section className="collision-telemetry" aria-labelledby="telemetry-title"><div className="telemetry-heading"><div><p className="eyebrow">Gráfico calculado</p><h2 id="telemetry-title">Telemetria do encontro</h2></div><span>{result.outcome}</span></div><canvas ref={canvasRef} aria-label={`Trajetória calculada de ${projectile.name} em direção a ${target.name}, com gráfico de velocidade relativa`} /><div className="telemetry-stats"><span><small>Maior aproximação</small><strong>{formatScientific(telemetry.closestApproachM)} m</strong></span><span><small>Velocidade máxima</small><strong>{(telemetry.peakSpeedMs / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km/s</strong></span><span><small>Tempo modelado</small><strong>{telemetry.durationS.toLocaleString("pt-BR", { maximumFractionDigits: 0 })} s</strong></span></div><p>{telemetry.modelNote} A curva é quantitativa, mas não inclui relatividade, deformação ou dinâmica completa dos fluidos.</p></section>;
}
