(function () {
  const DATA_URL = '/earth/clubs.json';
  const FALLBACK_LINK = 'club is cooking';
  const MONTHS = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12
  };
  const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function flattenClubs(data) {
    if (Array.isArray(data.sections)) {
      return data.sections.flatMap((section) => section.clubs || []);
    }
    return Array.isArray(data.clubs) ? data.clubs : [];
  }

  function splitDateParts(dateText) {
    return String(dateText || '')
      .split(/\s*&\s*|\s+and\s+/i)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function parseDatePart(datePart) {
    const namedMonthMatch = datePart.match(
      /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b[\s,]+(\d{1,2})/i
    );
    if (namedMonthMatch) {
      return {
        month: MONTHS[namedMonthMatch[1].toLowerCase()],
        day: Number(namedMonthMatch[2])
      };
    }

    const slashMatch = datePart.match(/(\d{1,2})\s*\/\s*(\d{1,2})(?:\s*\/\s*(\d{2,4}))?/);
    if (slashMatch) {
      return {
        day: Number(slashMatch[1]),
        month: Number(slashMatch[2])
      };
    }

    return null;
  }

  function formatShortDate(month, day) {
    return `${MONTH_SHORT[month - 1] || 'Date'} ${day}`;
  }

  function extractDateEntries(dateText) {
    const seen = new Set();
    const days = [];

    splitDateParts(dateText).forEach((part) => {
      const parsed = parseDatePart(part);
      if (!parsed) return;
      const key = `${parsed.month}-${parsed.day}`;
      if (seen.has(key)) return;
      seen.add(key);
      days.push({
        month: parsed.month,
        day: parsed.day,
        sortKey: parsed.month * 100 + parsed.day,
        shortDate: formatShortDate(parsed.month, parsed.day)
      });
    });

    return days;
  }

  function buildDayDefs(data) {
    const unique = new Map();

    flattenClubs(data).forEach((club) => {
      (club.events || []).forEach((event) => {
        extractDateEntries(event.date).forEach((entry) => {
          const key = `${entry.month}-${entry.day}`;
          if (!unique.has(key)) unique.set(key, entry);
        });
      });
    });

    return Array.from(unique.values())
      .sort((left, right) => left.sortKey - right.sortKey)
      .map((entry, index) => ({
        key: `day-${index + 1}`,
        label: `Day ${index + 1}`,
        shortDate: entry.shortDate,
        month: entry.month,
        day: entry.day,
        sortKey: entry.sortKey
      }));
  }

  function resolveFestivalDays(dateText, dayDefs) {
    const dateEntries = extractDateEntries(dateText);
    return dateEntries
      .map((entry) => dayDefs.find((day) => day.month === entry.month && day.day === entry.day))
      .filter(Boolean);
  }

  function getTimeInfo(timeText) {
    const source = String(timeText || '').trim();
    if (!source || /not provided|to be announced/i.test(source)) {
      return { label: 'Time To Be Announced', sortMinutes: Number.POSITIVE_INFINITY };
    }

    const match = source.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
    if (!match) {
      return { label: source, sortMinutes: Number.POSITIVE_INFINITY - 1 };
    }

    const hour = Number(match[1]);
    const minute = Number(match[2] || '0');
    const period = match[3].toUpperCase();
    const twelveHour = ((hour - 1) % 12) + 1;
    const label = `${twelveHour}:${String(minute).padStart(2, '0')} ${period}`;
    const normalizedHour = (period === 'PM' ? (hour % 12) + 12 : hour % 12);
    return { label, sortMinutes: normalizedHour * 60 + minute };
  }

  function sanitizeLink(link) {
    const normalized = String(link || '').trim();
    if (!normalized || normalized.includes('Chakravyuh2K26Registration') || /not provided/i.test(normalized)) {
      return FALLBACK_LINK;
    }
    return normalized;
  }

  function buildAgenda(data) {
    const dayDefs = buildDayDefs(data);
    const days = dayDefs.map((definition) => ({
      ...definition,
      events: []
    }));

    flattenClubs(data).forEach((club) => {
      (club.events || []).forEach((event) => {
        const eventDays = resolveFestivalDays(event.date, dayDefs);
        if (!eventDays.length) return;

        const timeInfo = getTimeInfo(event.time);
        eventDays.forEach((day) => {
          const bucket = days.find((entry) => entry.key === day.key);
          if (!bucket) return;
          bucket.events.push({
            clubName: club.name,
            eventName: event.name,
            description: event.description || '',
            venue: event.location || 'Venue updating shortly',
            timeLabel: timeInfo.label,
            sortMinutes: timeInfo.sortMinutes,
            link: sanitizeLink(event.link)
          });
        });
      });
    });

    days.forEach((day) => {
      day.events.sort((left, right) => {
        if (left.sortMinutes !== right.sortMinutes) return left.sortMinutes - right.sortMinutes;
        return left.eventName.localeCompare(right.eventName, undefined, { sensitivity: 'base' });
      });
    });

    return days.filter((day) => day.events.length);
  }

  function groupByTime(events) {
    const groups = [];
    const index = new Map();

    events.forEach((event) => {
      const key = `${event.sortMinutes}::${event.timeLabel}`;
      if (!index.has(key)) {
        const group = {
          label: event.timeLabel,
          sortMinutes: event.sortMinutes,
          events: []
        };
        index.set(key, group);
        groups.push(group);
      }
      index.get(key).events.push(event);
    });

    return groups;
  }

  function renderAgenda(container, days) {
    if (!days.length) {
      container.innerHTML = '<div class="agenda-empty">No agenda events are available in the club data yet.</div>';
      return;
    }

    const tabsMarkup = days
      .map(
        (day, index) => `
          <button class="tab-btn${index === 0 ? ' active' : ''}" type="button" data-day-target="${escapeHtml(day.key)}">
            ${escapeHtml(day.label)}
            <span>${escapeHtml(day.shortDate)}</span>
          </button>
        `
      )
      .join('');

    const bucketsMarkup = days
      .map((day, index) => {
        const groups = groupByTime(day.events);
        const groupsMarkup = groups
          .map(
            (group) => `
              <div class="time-header">${escapeHtml(group.label)}</div>
              ${group.events
                .map(
                  (event) => `
                    <article class="event-card${event.link === FALLBACK_LINK ? ' is-disabled' : ''}" data-url="${escapeHtml(event.link)}">
                      <div class="ev-info">
                        <div class="club-name">${escapeHtml(event.clubName)}</div>
                        <h3 class="event-title">${escapeHtml(event.eventName)}</h3>
                        <div class="event-desc">${escapeHtml(event.description)}</div>
                      </div>
                      <div class="ev-venue">${escapeHtml(event.venue)}</div>
                    </article>
                  `
                )
                .join('')}
            `
          )
          .join('');

        let extraBlob = '';
        if (day.key === 'day-3') {
          extraBlob = `
            <div style="
                margin-bottom: 24px;
                padding: 12px 18px;
                background: rgba(255, 156, 96, 0.1);
                border: 1px solid rgba(255, 156, 96, 0.25);
                border-radius: 12px;
                text-align: center;
                color: #ffd9b0;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: 0.5px;
            ">🎬 Dress Code for Day 3: <span style="font-weight: 800; color: #ffb27a;">Bollywood Inspired</span></div>
          `;
        }

        return `
          <section class="day-bucket${index === 0 ? ' active' : ''}" id="${escapeHtml(day.key)}">
            ${extraBlob}
            ${groupsMarkup}
          </section>
        `;
      })
      .join('');

    container.innerHTML = `
      <div class="day-tabs">${tabsMarkup}</div>
      <div class="agenda-days">${bucketsMarkup}</div>
    `;

    const tabs = container.querySelectorAll('.tab-btn');
    const buckets = container.querySelectorAll('.day-bucket');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-day-target');
        tabs.forEach((item) => item.classList.remove('active'));
        buckets.forEach((bucket) => bucket.classList.remove('active'));
        tab.classList.add('active');
        container.querySelector(`#${target}`)?.classList.add('active');
        container.closest('.scroll-body')?.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    container.querySelectorAll('.event-card').forEach((card) => {
      card.addEventListener('click', () => {
        const url = card.getAttribute('data-url');
        if (!url || url === FALLBACK_LINK) {
          window.alert('club is cooking');
          return;
        }
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    });
  }

  async function loadFireAgenda(container) {
    if (!container) return;
    container.innerHTML = '<div class="agenda-loading">Loading agenda from club data...</div>';

    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) throw new Error('Agenda data could not be loaded');
      const data = await response.json();
      renderAgenda(container, buildAgenda(data));
    } catch (error) {
      console.error(error);
      container.innerHTML =
        '<div class="agenda-empty">Agenda failed to load from the club data. Please verify the clubs JSON structure.</div>';
    }
  }

  window.loadFireAgenda = loadFireAgenda;
})();
