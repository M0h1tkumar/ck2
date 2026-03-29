// AIR / VAYU — White Wind Orb Animation
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
const streamCount = isLowPower ? 8 : 14;

const sparks = Array.from({ length: sparkCount }, () => ({
    angle: Math.random() * Math.PI * 2,
    distance: 0.42 + Math.random() * 0.5,
    size: 0.8 + Math.random() * 2.8,
    speed: 0.18 + Math.random() * 0.75,
    orbit: (Math.random() < 0.5 ? -1 : 1) * (0.15 + Math.random() * 0.48),
    alpha: 0.3 + Math.random() * 0.55
}));

const streams = Array.from({ length: streamCount }, () => ({
    angle: Math.random() * Math.PI * 2,
    speed: 0.4 + Math.random() * 0.8,
    length: 0.4 + Math.random() * 0.6,
    dist: 0.8 + Math.random() * 0.5,
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
    outer.addColorStop(0, `rgba(230, 248, 255, ${0.14 * energy})`);
    outer.addColorStop(0.28, `rgba(180, 230, 255, ${0.10 * energy})`);
    outer.addColorStop(0.58, `rgba(150, 210, 255, ${0.06 * energy})`);
    outer.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = outer;
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

function drawCore(energy, t) {
    const coreR = radius * (0.74 + Math.sin(t * 2.4) * 0.022);

    const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.58);
    aura.addColorStop(0, `rgba(240, 252, 255, ${0.94 * energy})`);
    aura.addColorStop(0.18, `rgba(200, 242, 255, ${0.88 * energy})`);
    aura.addColorStop(0.44, `rgba(160, 225, 255, ${0.44 * energy})`);
    aura.addColorStop(0.74, `rgba(120, 200, 255, ${0.14 * energy})`);
    aura.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.58, 0, Math.PI * 2);
    ctx.fill();

    const core = ctx.createRadialGradient(cx - radius * 0.08, cy - radius * 0.12, radius * 0.05, cx, cy, coreR);
    core.addColorStop(0, `rgba(255, 255, 255, ${0.99 * energy})`);
    core.addColorStop(0.16, `rgba(235, 250, 255, ${0.96 * energy})`);
    core.addColorStop(0.46, `rgba(195, 238, 255, ${0.88 * energy})`);
    core.addColorStop(0.72, `rgba(150, 215, 255, ${0.44 * energy})`);
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
        const phase = t * (1.5 + i * 0.22) + i * 1.4;
        const r = radius * (0.9 + i * 0.2 + Math.sin(phase) * 0.025);
        ctx.strokeStyle = `rgba(200, 238, 255, ${(0.10 - i * 0.016) * energy})`;
        ctx.lineWidth = Math.max(1, radius * (0.016 - i * 0.002));
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * (0.96 + Math.sin(phase * 0.8) * 0.035), phase * 0.08, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.restore();
}

function drawWindStreams(energy, t) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (let i = 0; i < streamCount; i++) {
        const s = streams[i];
        const ang = s.angle + t * s.speed * s.dir * 0.38;
        const dist = radius * s.dist;
        const len = radius * s.length * 0.55;
        const p1 = circlePoint(ang, dist);
        const p2 = circlePoint(ang + 0.45 * s.dir, dist + len * 0.4);
        const p3 = circlePoint(ang + 0.9 * s.dir, dist + len * 0.1);
        const alpha = Math.sin(t * s.speed + i) * 0.4 + 0.6;
        const gradient = ctx.createLinearGradient(p1.x, p1.y, p3.x, p3.y);
        gradient.addColorStop(0, `rgba(220, 245, 255, 0)`);
        gradient.addColorStop(0.5, `rgba(220, 245, 255, ${s.alpha * alpha * energy})`);
        gradient.addColorStop(1, `rgba(220, 245, 255, 0)`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = radius * 0.018;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(p2.x, p2.y, p3.x, p3.y);
        ctx.stroke();
    }
    ctx.restore();
}

function drawArcs(energy, t) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (let i = 0; i < arcCount; i++) {
        const baseAngle = (i / arcCount) * Math.PI * 2 + t * (0.38 + (i % 3) * 0.12);
        const wobble = Math.sin(t * (2.2 + i * 0.08) + i * 0.9) * radius * 0.14;
        const inner = radius * (0.44 + (i % 4) * 0.06);
        const outer = radius * (1.02 + (i % 5) * 0.05);
        const p1 = circlePoint(baseAngle, inner);
        const p3 = circlePoint(baseAngle + 0.82, inner + wobble);
        const gradient = ctx.createLinearGradient(p1.x, p1.y, p3.x, p3.y);
        gradient.addColorStop(0, `rgba(220, 248, 255, ${0.08 * energy})`);
        gradient.addColorStop(0.45, `rgba(180, 235, 255, ${0.48 * energy})`);
        gradient.addColorStop(1, `rgba(150, 218, 255, ${0.05 * energy})`);
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
        const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 3.5);
        glow.addColorStop(0, `rgba(240, 252, 255, ${alpha})`);
        glow.addColorStop(0.4, `rgba(190, 240, 255, ${alpha * 0.5})`);
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
    drawRipples(energy, t);
    drawWindStreams(energy, t);
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
