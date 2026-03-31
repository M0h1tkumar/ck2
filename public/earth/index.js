const character = document.getElementById('character');
const canvas = document.getElementById('orb-canvas');
const ctx = canvas.getContext('2d');
let cx = 0, cy = 0, radius = 0, startTime = performance.now(), igniteAt = 0;
let sequenceStarted = false;
const isLowPower = navigator.hardwareConcurrency <= 4 || /Android|iPhone|iPad/i.test(navigator.userAgent);
const ringCount = isLowPower ? 3 : 4, shardCount = isLowPower ? 8 : 12, moteCount = isLowPower ? 26 : 40;

const motes = Array.from({ length: moteCount }, () => ({
  angle: Math.random() * Math.PI * 2,
  distance: 0.38 + Math.random() * 0.56,
  size: 1.4 + Math.random() * 3.4,
  speed: 0.18 + Math.random() * 0.5,
  orbit: (Math.random() < 0.5 ? -1 : 1) * (0.14 + Math.random() * 0.32),
  alpha: 0.28 + Math.random() * 0.42,
  rise: 0.04 + Math.random() * 0.16
}));

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, isLowPower ? 1 : 1.5);
  canvas.width = Math.max(1, Math.round(rect.width * dpr));
  canvas.height = Math.max(1, Math.round(rect.height * dpr));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  cx = rect.width / 2;
  cy = rect.height / 2;
  radius = Math.min(rect.width, rect.height) * 0.23;
}

function polarPoint(angle, dist, yScale = 1) {
  return { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist * yScale };
}

function drawEarthGlow(energy) {
  const outer = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 2.55);
  outer.addColorStop(0, `rgba(255, 205, 117, ${0.16 * energy})`);
  outer.addColorStop(0.24, `rgba(255, 118, 46, ${0.15 * energy})`);
  outer.addColorStop(0.55, `rgba(255, 49, 20, ${0.10 * energy})`);
  outer.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = outer;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCore(energy, t) {
  const coreR = radius * (0.79 + Math.sin(t * 1.8) * 0.03);
  const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.6);
  aura.addColorStop(0, `rgba(255, 250, 221, ${0.96 * energy})`);
  aura.addColorStop(0.26, `rgba(255, 203, 118, ${0.68 * energy})`);
  aura.addColorStop(0.56, `rgba(255, 111, 38, ${0.34 * energy})`);
  aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.6, 0, Math.PI * 2);
  ctx.fill();
  const core = ctx.createRadialGradient(cx - radius * 0.08, cy - radius * 0.12, radius * 0.05, cx, cy, coreR);
  core.addColorStop(0, `rgba(255, 239, 173, ${0.98 * energy})`);
  core.addColorStop(0.32, `rgba(255, 188, 132, ${0.84 * energy})`);
  core.addColorStop(0.72, `rgba(255, 72, 20, ${0.42 * energy})`);
  core.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
  ctx.fill();
}

function drawStoneRings(energy, t) {
  for (let i = 0; i < ringCount; i++) {
    const phase = t * (0.8 + i * 0.12) + i * 1.4;
    const r = radius * (0.94 + i * 0.16 + Math.sin(phase) * 0.02);
    ctx.strokeStyle = `rgba(255, 220, 150, ${(0.14 - i * 0.02) * energy})`;
    ctx.lineWidth = Math.max(1, radius * (0.022 - i * 0.003));
    ctx.beginPath();
    ctx.ellipse(cx, cy, r, r * 0.86, phase * 0.08, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawShards(energy, t) {
  for (let i = 0; i < shardCount; i++) {
    const baseAngle = (i / shardCount) * Math.PI * 2 + t * (0.16 + (i % 3) * 0.05);
    const inner = polarPoint(baseAngle, radius * 0.4);
    const outer = polarPoint(baseAngle + 0.08, radius * 1.02);
    ctx.strokeStyle = `rgba(255, 137, 48, ${0.46 * energy})`;
    ctx.lineWidth = radius * 0.024;
    ctx.beginPath();
    ctx.moveTo(inner.x, inner.y);
    ctx.lineTo(outer.x, outer.y);
    ctx.stroke();
  }
}

function drawMotes(energy, t) {
  for (const mote of motes) {
    const ang = mote.angle + t * mote.orbit, dist = radius * (1.02 + mote.distance);
    const x = cx + Math.cos(ang) * dist, y = cy + Math.sin(ang) * dist * 0.84;
    ctx.fillStyle = `rgba(255, 188, 132, ${mote.alpha * energy})`;
    ctx.beginPath();
    ctx.arc(x, y, mote.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawOrb(now) {
  const t = (now - startTime) / 1000;
  const reveal = igniteAt ? Math.min(1, (now - igniteAt) / 850) : 0;
  const energy = 0.35 + 0.65 * reveal;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawEarthGlow(energy);
  drawStoneRings(energy, t);
  drawShards(energy, t);
  drawCore(energy, t);
  drawMotes(energy, t);
  requestAnimationFrame(drawOrb);
}

const clubsGrid = document.getElementById('clubs-grid');
const clubFocusOverlay = document.getElementById('club-focus-overlay');
const clubPopupRoot = document.getElementById('club-popup-root');
const eventData = new Map();
let activePopup = null;
let clearActiveCards = () => {};

function getEventKey(club, event) {
  return event.id || `${club.id || club.name}::${event.name}`;
}

function sortClubsAlphabetically(clubs) {
  const sortedClubs = [...clubs].sort((left, right) => left.name.localeCompare(right.name, undefined, { sensitivity: 'base' }));
  
  // Position 4 (Index 3): SOA Literary Club
  const slcIndex = sortedClubs.findIndex((club) => club.id === 'slc');
  if (slcIndex !== -1) {
    const [slc] = sortedClubs.splice(slcIndex, 1);
    sortedClubs.splice(3, 0, slc);
  }

  // Position 5 (Index 4): Vogue
  const vogueIndex = sortedClubs.findIndex((club) => club.id === 'vogue');
  if (vogueIndex !== -1) {
    const [vogue] = sortedClubs.splice(vogueIndex, 1);
    sortedClubs.splice(4, 0, vogue);
  }

  // Position 11 (Index 10): Jaago (Start of 3rd Row)
  const jaagoIndex = sortedClubs.findIndex((club) => club.id === 'jaago');
  if (jaagoIndex !== -1) {
    const [jaago] = sortedClubs.splice(jaagoIndex, 1);
    sortedClubs.splice(10, 0, jaago);
  }

  // Swap GDGoC with VirtualShowreel (VS) bubble positions
  const gdgocIndex = sortedClubs.findIndex((club) => club.id === 'gdgoc');
  const vsIndex = sortedClubs.findIndex((club) => club.id === 'vs');
  if (gdgocIndex !== -1 && vsIndex !== -1) {
    [sortedClubs[gdgocIndex], sortedClubs[vsIndex]] = [sortedClubs[vsIndex], sortedClubs[gdgocIndex]];
  }

  return sortedClubs;
}

function normalizeClubs(data) {
  if (Array.isArray(data.sections)) {
    return sortClubsAlphabetically(data.sections.flatMap((section) => section.clubs || []));
  }

  if (!Array.isArray(data.clubs)) return [];
  return sortClubsAlphabetically(data.clubs);
}

function renderClub(club) {
  const card = document.createElement('div');
  card.className = 'club-card';
  card.innerHTML = `
    <button class="club-logo" type="button" aria-label="Open ${club.name} events"><img src="${club.logo}" alt="${club.name}" loading="lazy" decoding="async"></button>
    <div class="club-info"><div class="club-name">${club.name}</div></div>
    <div class="club-events-pop">
      <button class="club-pop-close" type="button" aria-label="Close">&times;</button>
      <div class="club-pop-top">
        <div class="club-pop-logo"><img src="${club.logo}" alt="${club.name}" loading="lazy" decoding="async"></div>
        <div class="pop-title">${club.type}</div>
        <div class="club-pop-name">${club.name}</div>
      </div>
      <div class="club-pop-list">
        ${club.events.map((event) => `<button class="ev-item" type="button" data-event-key="${getEventKey(club, event)}">${event.name}</button>`).join('')}
      </div>
    </div>
  `;
  return card;
}

async function loadClubData() {
  const response = await fetch('/earth/clubs.json');
  if (!response.ok) throw new Error('Failed to load club data');
  const data = await response.json();
  const clubs = normalizeClubs(data);
  clubsGrid.innerHTML = '';
  eventData.clear();
  clubs.forEach((club) => {
    club.events.forEach((event) => eventData.set(getEventKey(club, event), event));
    clubsGrid.appendChild(renderClub(club));
  });
  bindClubInteractions();
}

const modal = document.getElementById('ev-modal');
const closeModal = document.getElementById('modal-close');

function setModalValueLines(elementId, lines) {
  const field = document.getElementById(elementId);
  if (!field) return;
  const normalizedLines = (Array.isArray(lines) ? lines : [lines])
    .map((line) => `${line ?? ''}`.trim())
    .filter(Boolean);
  const values = normalizedLines.length ? normalizedLines : ['-'];
  field.replaceChildren(...values.map((value) => {
    const line = document.createElement('span');
    line.textContent = value;
    return line;
  }));
}

function splitContactEntries(contactText) {
  const value = `${contactText ?? ''}`.trim();
  if (!value) return ['-'];
  if (/^not provided$/i.test(value)) return ['Not provided'];

  const entries = [];
  let currentEntry = '';
  let bracketDepth = 0;

  for (const character of value) {
    if (character === '(') bracketDepth += 1;
    if (character === ')') bracketDepth = Math.max(0, bracketDepth - 1);

    if (character === ',' && bracketDepth === 0) {
      if (currentEntry.trim()) entries.push(currentEntry.trim());
      currentEntry = '';
      continue;
    }

    currentEntry += character;
  }

  if (currentEntry.trim()) entries.push(currentEntry.trim());
  return entries.length ? entries : [value];
}

function openEventDetail(eventKey) {
  const data = eventData.get(eventKey);
  if (!data) return;
  document.getElementById('m-title').textContent = data.name;
  setModalValueLines('m-date', [data.date, data.time]);
  setModalValueLines('m-loc', data.location);
  setModalValueLines('m-prize', data.prize);
  setModalValueLines('m-contact', splitContactEntries(data.contact));
  setModalValueLines('m-desc', data.description);
  const regBtn = document.getElementById('m-link');
  if (!data.link || data.link.includes('Chakravyuh2K26Registration')) {
    regBtn.textContent = 'Registration Updating Shortly';
    regBtn.href = 'javascript:void(0)';
    regBtn.style.opacity = '0.6';
    regBtn.style.pointerEvents = 'none';
  } else {
    regBtn.textContent = 'Register Now';
    regBtn.href = data.link;
    regBtn.style.opacity = '1';
    regBtn.style.pointerEvents = 'auto';
  }
  modal.classList.add('open');
}

closeModal.onclick = () => modal.classList.remove('open');
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('open');
});
const modalContent = modal.querySelector('.modal-content');
modalContent?.addEventListener('click', (e) => e.stopPropagation());

function attachPopupInteractions(popup) {
  popup.addEventListener('click', (e) => e.stopPropagation());
  popup.querySelector('.club-pop-close')?.addEventListener('click', (e) => {
    e.stopPropagation();
    clearActiveCards();
  });
  popup.querySelectorAll('.ev-item').forEach((button) => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      openEventDetail(button.dataset.eventKey);
    });
  });
}

function bindClubInteractions() {
  clearActiveCards = () => {
    document.querySelectorAll('.club-card.active').forEach((active) => active.classList.remove('active'));
    if (activePopup) {
      activePopup.remove();
      activePopup = null;
    }
    clubsGrid.classList.remove('focus-mode');
    document.body.classList.remove('club-focus');
  };

  document.querySelectorAll('.club-logo').forEach((logo) => {
    logo.onclick = (e) => {
      e.stopPropagation();
      const card = logo.closest('.club-card');
      const popup = card.querySelector('.club-events-pop');
      const shouldOpen = !card.classList.contains('active');
      clearActiveCards();
      if (shouldOpen) {
        card.classList.add('active');
        if (popup) {
          activePopup = popup.cloneNode(true);
          clubPopupRoot.appendChild(activePopup);
          attachPopupInteractions(activePopup);
          requestAnimationFrame(() => activePopup?.classList.add('open'));
        }
        clubsGrid.classList.add('focus-mode');
        document.body.classList.add('club-focus');
      }
    };
  });

  clubsGrid.addEventListener('click', (e) => e.stopPropagation());
  clubFocusOverlay.addEventListener('click', clearActiveCards);
  clubPopupRoot.addEventListener('click', (e) => e.stopPropagation());
  closeModal.addEventListener('click', clearActiveCards);
  modal.addEventListener('transitionend', () => {
    if (!modal.classList.contains('open')) clearActiveCards();
  });
}

document.addEventListener('click', () => {
  document.querySelectorAll('.club-card.active').forEach((active) => active.classList.remove('active'));
  if (activePopup) {
    activePopup.remove();
    activePopup = null;
  }
  clubsGrid.classList.remove('focus-mode');
  document.body.classList.remove('club-focus');
});

function startSequence() {
  if (sequenceStarted) return;
  sequenceStarted = true;
  document.body.classList.remove('boot', 'orb-on', 'shifting', 'settled');
  document.body.classList.add('boot');
  setTimeout(() => {
    igniteAt = performance.now();
    document.body.classList.add('orb-on');
    requestAnimationFrame(drawOrb);
  }, 900);
  setTimeout(() => document.body.classList.add('shifting'), 2250);
  setTimeout(() => document.body.classList.add('settled'), 2650);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
loadClubData().catch((error) => {
  console.error(error);
  clubsGrid.innerHTML = '<p style="text-align:center;color:rgba(239,250,241,0.72);">Club data failed to load.</p>';
});
if (character.complete) {
  startSequence();
} else {
  character.addEventListener('load', startSequence, { once: true });
}
