// AIR / VAYU - Musical notes emerging from the guitar
const character = document.getElementById('character');
const canvas = document.getElementById('orb-canvas');
const ctx = canvas.getContext('2d');

let width = 0;
let height = 0;
let startTime = performance.now();
let igniteAt = 0;
let loopStarted = false;
let sequenceStarted = false;
let lastFrameTime = 0;
let spawnCarry = 0;

const isLowPower = navigator.hardwareConcurrency <= 4 || /Android|iPhone|iPad/i.test(navigator.userAgent);
const notes = [];
const noteGlyphs = ['♪', '♫', '♬', '♩'];
const moteCount = isLowPower ? 10 : 18;

const motes = Array.from({ length: moteCount }, () => ({
    x: 0.3 + Math.random() * 0.5,
    y: 0.18 + Math.random() * 0.55,
    drift: Math.random() * Math.PI * 2,
    speed: 0.16 + Math.random() * 0.3,
    size: 1.4 + Math.random() * 3,
    alpha: 0.05 + Math.random() * 0.12
}));

function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, isLowPower ? 1 : 1.5);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    width = rect.width || 1;
    height = rect.height || 1;
}

function pointOnQuadratic(p0, p1, p2, t) {
    const inv = 1 - t;
    return {
        x: inv * inv * p0.x + 2 * inv * t * p1.x + t * t * p2.x,
        y: inv * inv * p0.y + 2 * inv * t * p1.y + t * t * p2.y
    };
}

function tangentOnQuadratic(p0, p1, p2, t) {
    return {
        x: 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x),
        y: 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y)
    };
}

function getEmitter() {
    return {
        x: width * 0.26,
        y: height * 0.74
    };
}

function createNote(now) {
    const emitter = getEmitter();
    const lane = Math.random();
    const lift = 0.22 + Math.random() * 0.24;
    const side = (Math.random() - 0.5) * width * 0.16;
    const start = {
        x: emitter.x + (Math.random() - 0.5) * width * 0.04,
        y: emitter.y + (Math.random() - 0.5) * height * 0.03
    };
    const control = {
        x: width * (0.38 + lane * 0.16) + side * 0.35,
        y: height * (0.46 - lift * 0.12)
    };
    const end = {
        x: width * (0.44 + lane * 0.2) + side,
        y: height * (0.08 + (1 - lane) * 0.08)
    };

    notes.push({
        glyph: noteGlyphs[Math.floor(Math.random() * noteGlyphs.length)],
        bornAt: now,
        lifespan: 1800 + Math.random() * 1400,
        start,
        control,
        end,
        size: (isLowPower ? 18 : 22) + Math.random() * (isLowPower ? 10 : 16),
        alpha: 0.55 + Math.random() * 0.35,
        spin: (Math.random() - 0.5) * 0.35,
        wobble: (Math.random() - 0.5) * width * 0.018,
        hue: 190 + Math.random() * 18
    });
}

function drawBackgroundGlow(energy, t) {
    const emitter = getEmitter();
    const radius = Math.min(width, height) * 0.16 * (1 + Math.sin(t * 2.5) * 0.04);
    const glow = ctx.createRadialGradient(emitter.x, emitter.y, 0, emitter.x, emitter.y, radius * 3.4);
    glow.addColorStop(0, `rgba(244, 251, 255, ${0.18 * energy})`);
    glow.addColorStop(0.32, `rgba(188, 230, 255, ${0.14 * energy})`);
    glow.addColorStop(0.68, `rgba(122, 196, 255, ${0.06 * energy})`);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 3; i++) {
        const phase = t * (1.2 + i * 0.24) + i;
        ctx.strokeStyle = `rgba(204, 236, 255, ${(0.09 - i * 0.02) * energy})`;
        ctx.lineWidth = Math.max(1, width * 0.0045);
        ctx.beginPath();
        ctx.ellipse(
            emitter.x,
            emitter.y,
            radius * (1.15 + i * 0.34 + Math.sin(phase) * 0.03),
            radius * (0.5 + i * 0.12 + Math.cos(phase * 0.8) * 0.02),
            -0.72,
            0,
            Math.PI * 2
        );
        ctx.stroke();
    }
    ctx.restore();
}

function drawMotes(energy, t) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const mote of motes) {
        const x = width * mote.x + Math.sin(t * mote.speed * 1.9 + mote.drift) * 10;
        const y = height * mote.y - ((t * 18 * mote.speed + mote.drift * 14) % (height * 0.4));
        const alpha = mote.alpha * (0.65 + 0.35 * Math.sin(t * 2.2 + mote.drift * 2)) * energy;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, mote.size * 3.6);
        glow.addColorStop(0, `rgba(238, 248, 255, ${alpha})`);
        glow.addColorStop(0.46, `rgba(168, 221, 255, ${alpha * 0.46})`);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, mote.size * 3.6, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

function drawNoteTrails(note, progress, alpha) {
    const trailStops = [0.08, 0.22, 0.38];
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const stop of trailStops) {
        const trailT = Math.max(0, progress - stop);
        if (trailT <= 0) continue;
        const point = pointOnQuadratic(note.start, note.control, note.end, trailT);
        const glow = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, note.size * 0.8);
        glow.addColorStop(0, `rgba(220, 241, 255, ${alpha * 0.22})`);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(point.x, point.y, note.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

function drawSingleNote(note, now, energy) {
    const age = now - note.bornAt;
    const progress = Math.min(1, age / note.lifespan);
    const lifeAlpha = progress < 0.12
        ? progress / 0.12
        : progress > 0.78
            ? 1 - (progress - 0.78) / 0.22
            : 1;

    const point = pointOnQuadratic(note.start, note.control, note.end, progress);
    const tangent = tangentOnQuadratic(note.start, note.control, note.end, progress);
    const rotation = Math.atan2(tangent.y, tangent.x) * 0.28 + note.spin + Math.sin(age / 260) * 0.04;
    const driftX = Math.sin(age / 180 + note.spin * 9) * note.wobble;
    const scale = 0.8 + Math.sin(age / 210) * 0.05;
    const alpha = note.alpha * lifeAlpha * energy;
    const x = point.x + driftX;
    const y = point.y;

    drawNoteTrails(note, progress, alpha);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `700 ${note.size}px "Segoe UI Symbol", "Noto Music", serif`;
    ctx.shadowColor = `hsla(${note.hue}, 100%, 84%, ${alpha * 0.9})`;
    ctx.shadowBlur = note.size * 0.7;
    ctx.fillStyle = `hsla(${note.hue}, 100%, 92%, ${alpha})`;
    ctx.fillText(note.glyph, 0, 0);
    ctx.restore();
}

function updateNotes(now, dt, energy) {
    const spawnRate = isLowPower ? 2.4 : 3.8;
    spawnCarry += dt * spawnRate * Math.max(0.25, energy);
    while (spawnCarry >= 1) {
        createNote(now);
        spawnCarry -= 1;
    }

    for (let i = notes.length - 1; i >= 0; i--) {
        if (now - notes[i].bornAt > notes[i].lifespan) {
            notes.splice(i, 1);
        }
    }

    for (const note of notes) {
        drawSingleNote(note, now, energy);
    }
}

function drawNotesScene(now) {
    const t = (now - startTime) / 1000;
    const reveal = igniteAt ? Math.min(1, (now - igniteAt) / 800) : 0;
    const energy = 0.22 + 0.78 * reveal;
    const dt = lastFrameTime ? Math.min(0.05, (now - lastFrameTime) / 1000) : 0.016;
    lastFrameTime = now;

    ctx.clearRect(0, 0, width, height);
    drawBackgroundGlow(energy, t);
    updateNotes(now, dt, energy);
    drawMotes(energy, t);

    requestAnimationFrame(drawNotesScene);
}

function startRenderLoop() {
    if (loopStarted) return;
    loopStarted = true;
    startTime = performance.now();
    lastFrameTime = 0;
    requestAnimationFrame(drawNotesScene);
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
    }, 980);
    setTimeout(() => document.body.classList.add('shifting'), 2040);
    setTimeout(() => document.body.classList.add('settled'), 2380);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

if (character.complete) {
    requestAnimationFrame(startSequence);
} else {
    character.addEventListener('load', startSequence, { once: true });
}

function initCarousels() {
    const carousels = document.querySelectorAll('[data-carousel]');

    carousels.forEach((carousel) => {
        const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
        const dots = Array.from(carousel.querySelectorAll('[data-carousel-dot]'));
        const prevButton = carousel.querySelector('[data-carousel-prev]');
        const nextButton = carousel.querySelector('[data-carousel-next]');
        const counter = carousel.querySelector('[data-carousel-counter]');

        if (!slides.length) return;

        let currentIndex = 0;
        let autoplayId = null;

        function render(nextIndex) {
            currentIndex = (nextIndex + slides.length) % slides.length;

            slides.forEach((slide, index) => {
                slide.classList.toggle('is-active', index === currentIndex);
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle('is-active', index === currentIndex);
                dot.setAttribute('aria-pressed', index === currentIndex ? 'true' : 'false');
            });

            if (counter) {
                counter.textContent = `${currentIndex + 1} / ${slides.length}`;
            }
        }

        function stopAutoplay() {
            if (autoplayId) {
                window.clearInterval(autoplayId);
                autoplayId = null;
            }
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayId = window.setInterval(() => {
                render(currentIndex + 1);
            }, 3600);
        }

        prevButton?.addEventListener('click', () => {
            render(currentIndex - 1);
            startAutoplay();
        });

        nextButton?.addEventListener('click', () => {
            render(currentIndex + 1);
            startAutoplay();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                render(index);
                startAutoplay();
            });
        });

        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        carousel.addEventListener('focusin', stopAutoplay);
        carousel.addEventListener('focusout', startAutoplay);

        render(0);
        startAutoplay();
    });
}

initCarousels();
