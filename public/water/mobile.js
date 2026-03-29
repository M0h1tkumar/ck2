window.installMobileViewportHeight?.();

const character = document.getElementById('character');
const canvas = document.getElementById('orb-canvas');
const ctx = canvas.getContext('2d');

let cx = 0;
let cy = 0;
let radius = 0;
let startTime = performance.now();
let igniteAt = 0;
let loopStarted = false;
let sequenceStarted = false;
const isLowPower = navigator.hardwareConcurrency <= 4 || /Android|iPhone|iPad/i.test(navigator.userAgent);

const ringCount = isLowPower ? 3 : 4;
const arcCount = isLowPower ? 10 : 14;
const sparkCount = isLowPower ? 28 : 46;

const sparks = Array.from({ length: sparkCount }, () => ({
  angle: Math.random() * Math.PI * 2,
  distance: 0.45 + Math.random() * 0.42,
  size: 1 + Math.random() * 3.2,
  speed: 0.2 + Math.random() * 0.8,
  orbit: (Math.random() < 0.5 ? -1 : 1) * (0.18 + Math.random() * 0.5),
  alpha: 0.35 + Math.random() * 0.55
}));

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, isLowPower ? 1 : 1.5);
  canvas.width = Math.max(1, Math.round(rect.width * dpr));
  canvas.height = Math.max(1, Math.round(rect.height * dpr));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  const cssWidth = rect.width || 1;
  const cssHeight = rect.height || 1;
  cx = cssWidth / 2;
  cy = cssHeight / 2;
  radius = Math.min(cssWidth, cssHeight) * 0.23;
}

function circlePoint(angle, dist) {
  return { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist };
}

function drawBackgroundGlow(energy) {
  const outer = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 2.45);
  outer.addColorStop(0, `rgba(155, 244, 255, ${0.18 * energy})`);
  outer.addColorStop(0.26, `rgba(75, 210, 255, ${0.15 * energy})`);
  outer.addColorStop(0.55, `rgba(24, 132, 255, ${0.08 * energy})`);
  outer.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = outer;
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

function drawCore(energy, t) {
  const coreR = radius * (0.76 + Math.sin(t * 2.7) * 0.025);

  const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.55);
  aura.addColorStop(0, `rgba(223, 252, 255, ${0.92 * energy})`);
  aura.addColorStop(0.20, `rgba(151, 241, 255, ${0.88 * energy})`);
  aura.addColorStop(0.46, `rgba(46, 195, 255, ${0.46 * energy})`);
  aura.addColorStop(0.72, `rgba(14, 110, 255, ${0.14 * energy})`);
  aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.55, 0, Math.PI * 2);
  ctx.fill();

  const core = ctx.createRadialGradient(cx - radius * 0.10, cy - radius * 0.14, radius * 0.06, cx, cy, coreR);
  core.addColorStop(0, `rgba(255, 255, 255, ${0.98 * energy})`);
  core.addColorStop(0.18, `rgba(223, 252, 255, ${0.96 * energy})`);
  core.addColorStop(0.48, `rgba(115, 232, 255, ${0.88 * energy})`);
  core.addColorStop(0.74, `rgba(18, 159, 255, ${0.42 * energy})`);
  core.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
  ctx.fill();
}

function drawRipples(energy, t) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < ringCount; i++) {
    const phase = t * (1.7 + i * 0.2) + i * 1.3;
    const r = radius * (0.92 + i * 0.18 + Math.sin(phase) * 0.028);
    ctx.strokeStyle = `rgba(117, 232, 255, ${(0.11 - i * 0.018) * energy})`;
    ctx.lineWidth = Math.max(1, radius * (0.018 - i * 0.002));
    ctx.beginPath();
    ctx.ellipse(cx, cy, r, r * (0.95 + Math.sin(phase * 0.9) * 0.04), phase * 0.10, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawArcs(energy, t) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';
  for (let i = 0; i < arcCount; i++) {
    const baseAngle = (i / arcCount) * Math.PI * 2 + t * (0.42 + (i % 3) * 0.14);
    const wobble = Math.sin(t * (2.35 + i * 0.09) + i * 0.9) * radius * 0.15;
    const inner = radius * (0.46 + (i % 4) * 0.06);
    const outer = radius * (1.04 + (i % 5) * 0.05);
    const p1 = circlePoint(baseAngle, inner);
    const p3 = circlePoint(baseAngle + 0.86, inner + wobble);
    const gradient = ctx.createLinearGradient(p1.x, p1.y, p3.x, p3.y);
    gradient.addColorStop(0, `rgba(182, 246, 255, ${0.10 * energy})`);
    gradient.addColorStop(0.45, `rgba(50, 208, 255, ${0.54 * energy})`);
    gradient.addColorStop(1, `rgba(7, 108, 255, ${0.06 * energy})`);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = radius * (0.018 + (i % 3) * 0.006);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.quadraticCurveTo(cx + Math.cos(baseAngle + 0.43) * outer, cy + Math.sin(baseAngle + 0.43) * outer, p3.x, p3.y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSparks(energy, t) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const spark of sparks) {
    const ang = spark.angle + t * spark.orbit;
    const dist = radius * (1.16 + spark.distance + Math.sin(t * spark.speed * 4 + spark.angle) * 0.10);
    const x = cx + Math.cos(ang) * dist;
    const y = cy + Math.sin(ang) * dist * 0.94;
    const alpha = spark.alpha * (0.48 + 0.42 * Math.sin(t * spark.speed * 7 + spark.angle)) * energy;
    const r = spark.size * (0.7 + 0.3 * Math.sin(t * spark.speed * 5));
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2);
    glow.addColorStop(0, `rgba(214, 252, 255, ${alpha})`);
    glow.addColorStop(0.45, `rgba(77, 216, 255, ${alpha * 0.55})`);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, r * 3.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawOrb(now) {
  const t = (now - startTime) / 1000;
  const reveal = igniteAt ? Math.min(1, (now - igniteAt) / 900) : 0;
  const energy = 0.35 + 0.65 * reveal;
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  drawBackgroundGlow(energy);
  drawRipples(energy, t);
  drawArcs(energy, t);
  drawCore(energy, t);
  drawSparks(energy, t);
  requestAnimationFrame(drawOrb);
}

function startRenderLoop() {
  if (loopStarted) return;
  loopStarted = true;
  startTime = performance.now();
  requestAnimationFrame(drawOrb);
}

function startSequence() {
  if (sequenceStarted) return;
  sequenceStarted = true;
  document.body.classList.remove('boot', 'orb-on', 'shifting', 'settled', 'desktop-enter', 'desktop-rise');
  const isDesktop = window.innerWidth > 900;
  void character.offsetHeight;

  if (isDesktop) {
    document.body.classList.add('desktop-enter');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.add('desktop-rise');
      });
    });
    setTimeout(() => {
      igniteAt = performance.now();
      document.body.classList.add('orb-on');
      startRenderLoop();
    }, 1100);
    setTimeout(() => {
      document.body.classList.add('shifting');
    }, 2300);
    setTimeout(() => {
      document.body.classList.add('settled');
    }, 2620);
    return;
  }

  requestAnimationFrame(() => {
    setTimeout(() => {
      document.body.classList.add('boot');

      setTimeout(() => {
        igniteAt = performance.now();
        document.body.classList.add('orb-on');
        startRenderLoop();
      }, 1100);

      setTimeout(() => document.body.classList.add('shifting'), 2100);
      setTimeout(() => document.body.classList.add('settled'), 2420);
    }, 20);
  });
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

if (character.complete) {
  startSequence();
} else {
  character.addEventListener('load', startSequence, { once: true });
}
