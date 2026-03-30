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

const flameCount = isLowPower ? 12 : 18;
const emberCount = isLowPower ? 32 : 56;
const fumeCount = isLowPower ? 14 : 24;

const embers = Array.from({ length: emberCount }, () => ({
  angle: Math.random() * Math.PI * 2,
  distance: 0.36 + Math.random() * 0.65,
  size: 1.2 + Math.random() * 3.6,
  speed: 0.45 + Math.random() * 1.0,
  orbit: (Math.random() < 0.5 ? -1 : 1) * (0.28 + Math.random() * 0.72),
  alpha: 0.45 + Math.random() * 0.45,
  lift: 0.4 + Math.random() * 0.9
}));

const fumes = Array.from({ length: fumeCount }, () => ({
  lane: -0.9 + Math.random() * 1.8,
  sideBias: Math.random() < 0.5 ? -1 : 1,
  start: Math.random(),
  size: 0.14 + Math.random() * 0.24,
  rise: 0.75 + Math.random() * 0.9,
  sway: 0.10 + Math.random() * 0.28,
  speed: 0.45 + Math.random() * 0.7,
  alpha: 0.08 + Math.random() * 0.12,
  heat: Math.random()
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

function polarPoint(angle, dist, yScale = 1) {
  return {
    x: cx + Math.cos(angle) * dist,
    y: cy + Math.sin(angle) * dist * yScale
  };
}

function drawHeatGlow(energy) {
  const outer = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 2.55);
  outer.addColorStop(0, `rgba(242, 224, 177, ${0.10 * energy})`);
  outer.addColorStop(0.26, `rgba(195, 161, 94, ${0.14 * energy})`);
  outer.addColorStop(0.55, `rgba(120, 88, 36, ${0.12 * energy})`);
  outer.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = outer;
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

function drawCore(energy, t) {
  const coreR = radius * (0.78 + Math.sin(t * 3.2) * 0.03);

  const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.62);
  aura.addColorStop(0, `rgba(250, 241, 214, ${0.9 * energy})`);
  aura.addColorStop(0.18, `rgba(143, 109, 56, ${0.42 * energy})`);
  aura.addColorStop(0.44, `rgba(120, 88, 36, ${0.24 * energy})`);
  aura.addColorStop(0.72, `rgba(72, 52, 24, ${0.12 * energy})`);
  aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.62, 0, Math.PI * 2);
  ctx.fill();

  const core = ctx.createRadialGradient(
    cx - radius * 0.08,
    cy - radius * 0.12,
    radius * 0.05,
    cx,
    cy,
    coreR
  );
  core.addColorStop(0, `rgba(255, 248, 232, ${0.96 * energy})`);
  core.addColorStop(0.16, `rgba(228, 214, 182, ${0.9 * energy})`);
  core.addColorStop(0.40, `rgba(183, 163, 114, ${0.72 * energy})`);
  core.addColorStop(0.70, `rgba(104, 136, 94, ${0.34 * energy})`);
  core.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `rgba(216, 188, 122, ${0.20 * energy})`;
  ctx.lineWidth = radius * 0.07;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.84, 0, Math.PI * 2);
  ctx.stroke();
}

function drawFumes(energy, t) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  for (let i = 0; i < fumeCount; i++) {
    const fume = fumes[i];
    const life = (fume.start + t * fume.speed * 0.34) % 1;
    const baseX = cx + fume.lane * radius * 0.95 + fume.sideBias * radius * 0.14;
    const x = baseX + Math.sin(t * (1.4 + fume.sway) + i * 1.7) * radius * fume.sway * life;
    const y = cy + radius * 0.55 - life * radius * (1.8 + fume.rise) + Math.cos(t * 1.2 + i) * radius * 0.04;
    const puffR = radius * (fume.size + life * 0.18);
    const alpha = Math.sin(life * Math.PI) * fume.alpha * energy;

    const puff = ctx.createRadialGradient(x, y, 0, x, y, puffR * 2.9);
    puff.addColorStop(0, `rgba(${202 + Math.round(fume.heat * 22)}, ${226 - Math.round(fume.heat * 18)}, 162, ${alpha})`);
    puff.addColorStop(0.28, `rgba(136, 170, 102, ${alpha * 0.58})`);
    puff.addColorStop(0.62, `rgba(62, 86, 48, ${alpha * 0.34})`);
    puff.addColorStop(0.86, `rgba(20, 32, 18, ${alpha * 0.18})`);
    puff.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = puff;
    ctx.beginPath();
    ctx.ellipse(
      x,
      y,
      puffR * (0.9 + life * 0.55),
      puffR * (1.15 + life * 0.95),
      Math.sin(t * 0.7 + i) * 0.18,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.restore();
}

function drawFlameTongues(energy, t) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';

  for (let i = 0; i < flameCount; i++) {
    const baseAngle = (i / flameCount) * Math.PI * 2 + t * (0.5 + (i % 3) * 0.12);
    const outward = radius * (1.02 + (i % 4) * 0.08);
    const curl = Math.sin(t * (2.8 + i * 0.11) + i * 0.7) * radius * 0.22;
    const p1 = polarPoint(baseAngle, radius * (0.34 + (i % 3) * 0.06), 0.92);
    const p2 = polarPoint(baseAngle + 0.26, outward + curl, 0.84);
    const p3 = polarPoint(baseAngle + 0.56, radius * (0.70 + (i % 5) * 0.06), 0.96);

    const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
    gradient.addColorStop(0, `rgba(246, 239, 196, ${0.16 * energy})`);
    gradient.addColorStop(0.4, `rgba(150, 196, 118, ${0.58 * energy})`);
    gradient.addColorStop(1, `rgba(82, 126, 66, ${0.08 * energy})`);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = radius * (0.022 + (i % 3) * 0.008);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.quadraticCurveTo(p2.x, p2.y, p3.x, p3.y);
    ctx.stroke();

    ctx.strokeStyle = `rgba(243, 247, 226, ${0.10 * energy})`;
    ctx.lineWidth = Math.max(1, radius * 0.007);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.quadraticCurveTo(
      (p1.x + p2.x) / 2,
      (p1.y + p2.y) / 2 - radius * 0.04,
      p3.x,
      p3.y
    );
    ctx.stroke();
  }

  ctx.restore();
}

function drawEmbers(energy, t) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  for (const ember of embers) {
    const ang = ember.angle + t * ember.orbit;
    const dist = radius * (1.10 + ember.distance + Math.sin(t * ember.speed * 3.4 + ember.angle) * 0.08);
    const x = cx + Math.cos(ang) * dist;
    const y = cy + Math.sin(ang) * dist * 0.86 - Math.abs(Math.sin(t * ember.lift + ember.angle)) * radius * 0.22;
    const alpha = ember.alpha * (0.45 + 0.55 * Math.sin(t * ember.speed * 6 + ember.angle)) * energy;
    const r = ember.size * (0.74 + 0.34 * Math.sin(t * ember.speed * 4.5));

    const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 3.4);
    glow.addColorStop(0, `rgba(248, 246, 220, ${alpha})`);
    glow.addColorStop(0.40, `rgba(176, 214, 132, ${alpha * 0.7})`);
    glow.addColorStop(0.72, `rgba(92, 144, 74, ${alpha * 0.32})`);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, r * 3.4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawOrb(now) {
  const t = (now - startTime) / 1000;
  const reveal = igniteAt ? Math.min(1, (now - igniteAt) / 850) : 0;
  const energy = 0.35 + 0.65 * reveal;

  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  drawHeatGlow(energy);
  drawFumes(energy, t);
  drawFlameTongues(energy, t);
  drawCore(energy, t);
  drawEmbers(energy, t);

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

      setTimeout(() => {
        document.body.classList.add('shifting');
      }, 2100);

      setTimeout(() => {
        document.body.classList.add('settled');
      }, 2420);
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

window.loadFireAgenda?.(document.getElementById('agenda-root'));
