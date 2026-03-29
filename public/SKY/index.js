// SKY / AKASH — Violet Cosmic Orb Animation
const character = document.getElementById('character');
const canvas = document.getElementById('orb-canvas');
const ctx = canvas.getContext('2d');

let cx = 0, cy = 0, radius = 0;
let startTime = performance.now();
let igniteAt = 0, loopStarted = false, sequenceStarted = false;
const isLowPower = navigator.hardwareConcurrency <= 4 || /Android|iPhone|iPad/i.test(navigator.userAgent);

const ringCount = isLowPower ? 3 : 5;
const arcCount = isLowPower ? 10 : 16;
const sparkCount = isLowPower ? 24 : 42;
const nebulaCount = isLowPower ? 6 : 10;

const sparks = Array.from({ length: sparkCount }, () => ({
    angle: Math.random() * Math.PI * 2,
    distance: 0.42 + Math.random() * 0.5,
    size: 0.8 + Math.random() * 2.8,
    speed: 0.15 + Math.random() * 0.7,
    orbit: (Math.random() < 0.5 ? -1 : 1) * (0.12 + Math.random() * 0.44),
    alpha: 0.3 + Math.random() * 0.55,
    hue: Math.random() // 0=violet, 1=blue-violet
}));

const nebulas = Array.from({ length: nebulaCount }, () => ({
    angle: Math.random() * Math.PI * 2,
    dist: 0.5 + Math.random() * 0.8,
    size: 0.12 + Math.random() * 0.2,
    speed: 0.08 + Math.random() * 0.18,
    alpha: 0.06 + Math.random() * 0.1,
    dir: Math.random() < 0.5 ? 1 : -1
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
    const outer = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 2.6);
    outer.addColorStop(0, `rgba(200, 150, 255, ${0.16 * energy})`);
    outer.addColorStop(0.28, `rgba(160, 100, 240, ${0.12 * energy})`);
    outer.addColorStop(0.58, `rgba(120, 70, 200, ${0.07 * energy})`);
    outer.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = outer;
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

function drawCore(energy, t) {
    const coreR = radius * (0.74 + Math.sin(t * 2.2) * 0.022);

    const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.58);
    aura.addColorStop(0, `rgba(235, 210, 255, ${0.94 * energy})`);
    aura.addColorStop(0.18, `rgba(200, 160, 255, ${0.88 * energy})`);
    aura.addColorStop(0.44, `rgba(160, 110, 255, ${0.44 * energy})`);
    aura.addColorStop(0.74, `rgba(120, 80, 220, ${0.14 * energy})`);
    aura.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.58, 0, Math.PI * 2);
    ctx.fill();

    const core = ctx.createRadialGradient(cx - radius * 0.09, cy - radius * 0.13, radius * 0.05, cx, cy, coreR);
    core.addColorStop(0, `rgba(255, 248, 255, ${0.99 * energy})`);
    core.addColorStop(0.16, `rgba(235, 210, 255, ${0.96 * energy})`);
    core.addColorStop(0.46, `rgba(190, 145, 255, ${0.88 * energy})`);
    core.addColorStop(0.72, `rgba(140, 90, 230, ${0.44 * energy})`);
    core.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
    ctx.fill();
}

function drawRipples(energy, t) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < ringCount; i++) {
        const phase = t * (1.4 + i * 0.18) + i * 1.5;
        const r = radius * (0.9 + i * 0.2 + Math.sin(phase) * 0.025);
        ctx.strokeStyle = `rgba(190, 140, 255, ${(0.10 - i * 0.015) * energy})`;
        ctx.lineWidth = Math.max(1, radius * (0.016 - i * 0.002));
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * (0.96 + Math.sin(phase * 0.8) * 0.035), phase * 0.08, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.restore();
}

function drawNebulas(energy, t) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < nebulaCount; i++) {
        const n = nebulas[i];
        const ang = n.angle + t * n.speed * n.dir;
        const dist = radius * n.dist;
        const x = cx + Math.cos(ang) * dist;
        const y = cy + Math.sin(ang) * dist * 0.88;
        const r = radius * n.size;
        const alpha = (Math.sin(t * n.speed * 2.2 + i) * 0.3 + 0.7) * n.alpha * energy;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
        glow.addColorStop(0, `rgba(200, 150, 255, ${alpha})`);
        glow.addColorStop(0.5, `rgba(160, 100, 240, ${alpha * 0.5})`);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.ellipse(x, y, r * 2.5, r * 1.5, ang, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

function drawArcs(energy, t) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (let i = 0; i < arcCount; i++) {
        const baseAngle = (i / arcCount) * Math.PI * 2 + t * (0.34 + (i % 3) * 0.11);
        const wobble = Math.sin(t * (2.1 + i * 0.08) + i * 0.9) * radius * 0.14;
        const inner = radius * (0.44 + (i % 4) * 0.06);
        const outer = radius * (1.02 + (i % 5) * 0.05);
        const p1 = circlePoint(baseAngle, inner);
        const p3 = circlePoint(baseAngle + 0.82, inner + wobble);
        const gradient = ctx.createLinearGradient(p1.x, p1.y, p3.x, p3.y);
        gradient.addColorStop(0, `rgba(210, 165, 255, ${0.08 * energy})`);
        gradient.addColorStop(0.45, `rgba(170, 120, 255, ${0.48 * energy})`);
        gradient.addColorStop(1, `rgba(130, 85, 230, ${0.05 * energy})`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = radius * (0.016 + (i % 3) * 0.005);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(cx + Math.cos(baseAngle + 0.41) * outer, cy + Math.sin(baseAngle + 0.41) * outer, p3.x, p3.y);
        ctx.stroke();
    }
    ctx.restore();
}

function drawSparks(energy, t) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const spark of sparks) {
        const ang = spark.angle + t * spark.orbit;
        const dist = radius * (1.14 + spark.distance + Math.sin(t * spark.speed * 3.8 + spark.angle) * 0.10);
        const x = cx + Math.cos(ang) * dist;
        const y = cy + Math.sin(ang) * dist * 0.94;
        const alpha = spark.alpha * (0.45 + 0.42 * Math.sin(t * spark.speed * 6.5 + spark.angle)) * energy;
        const r = spark.size * (0.72 + 0.28 * Math.sin(t * spark.speed * 4.8));
        const vR = Math.round(215 + spark.hue * 30);
        const vG = Math.round(175 + spark.hue * 40);
        const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 3.5);
        glow.addColorStop(0, `rgba(${vR}, ${vG}, 255, ${alpha})`);
        glow.addColorStop(0.4, `rgba(175, 120, 255, ${alpha * 0.5})`);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, r * 3.5, 0, Math.PI * 2);
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
    drawNebulas(energy, t);
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
    document.body.classList.remove('boot', 'orb-on', 'shifting', 'settled');
    document.body.classList.add('boot');
    setTimeout(() => {
        igniteAt = performance.now();
        document.body.classList.add('orb-on');
        startRenderLoop();
    }, 1100);
    setTimeout(() => document.body.classList.add('shifting'), 2100);
    setTimeout(() => document.body.classList.add('settled'), 2420);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
if (character.complete) {
    requestAnimationFrame(startSequence);
} else {
    character.addEventListener('load', startSequence, { once: true });
}
