'use client'

import { useEffect, useRef } from 'react';

type NavStage = 'overview' | 'center' | 'panel';

type NavEntry = {
  stage: NavStage;
  section: string | null;
};

const FRAME_SOURCE = 'genesis-3d';
const HOST_SOURCE = 'genesis-home';
const NAV_HISTORY_KEY = '__genesis3d_nav';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeNavEntry(value: unknown): NavEntry | null {
  if (!isRecord(value)) return null;

  const stage = value.stage;
  if (stage !== 'overview' && stage !== 'center' && stage !== 'panel') {
    return null;
  }

  const section = typeof value.section === 'string' ? value.section : null;
  return { stage, section };
}

function getNavEntry(stateObject: unknown): NavEntry | null {
  if (!isRecord(stateObject)) return null;
  return normalizeNavEntry(stateObject[NAV_HISTORY_KEY]);
}

export function ThreeDShowcase() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function buildHistoryState(stage: NavStage, section: string | null) {
      const baseState = isRecord(window.history.state) ? { ...window.history.state } : {};
      return {
        ...baseState,
        [NAV_HISTORY_KEY]: { stage, section },
      };
    }

    function replaceHistory(stage: NavStage, section: string | null) {
      window.history.replaceState(buildHistoryState(stage, section), '', window.location.href);
    }

    function pushHistory(stage: NavStage, section: string | null) {
      const currentEntry = getNavEntry(window.history.state);
      if (currentEntry?.stage === stage && currentEntry.section === section) return;
      window.history.pushState(buildHistoryState(stage, section), '', window.location.href);
    }

    function postNavApply(entry: NavEntry | null) {
      iframeRef.current?.contentWindow?.postMessage(
        {
          source: HOST_SOURCE,
          type: 'nav-apply',
          stage: entry?.stage ?? 'overview',
          section: entry?.section ?? null,
        },
        window.location.origin,
      );
    }

    function syncIframeWithHistory(stateObject: unknown) {
      postNavApply(getNavEntry(stateObject));
    }

    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin || !isRecord(event.data)) return;
      if (event.data.source !== FRAME_SOURCE || typeof event.data.type !== 'string') return;

      const entry = normalizeNavEntry({
        stage: event.data.stage,
        section: event.data.section,
      });

      switch (event.data.type) {
        case 'nav-ready':
          syncIframeWithHistory(window.history.state);
          break;
        case 'nav-push':
          if (entry) pushHistory(entry.stage, entry.section);
          break;
        case 'nav-replace':
          if (entry) replaceHistory(entry.stage, entry.section);
          break;
        case 'nav-back-intent': {
          const currentEntry = getNavEntry(window.history.state);
          if (currentEntry && currentEntry.stage !== 'overview') {
            window.history.back();
          } else {
            postNavApply({ stage: 'overview', section: null });
          }
          break;
        }
        default:
          break;
      }
    }

    function handlePopState(event: PopStateEvent) {
      syncIframeWithHistory(event.state);
    }

    function handleLoad() {
      syncIframeWithHistory(window.history.state);
    }

    if (!getNavEntry(window.history.state)) {
      replaceHistory('overview', null);
    }

    const iframe = iframeRef.current;
    window.addEventListener('message', handleMessage);
    window.addEventListener('popstate', handlePopState);
    iframe?.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('popstate', handlePopState);
      iframe?.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <section className="relative h-full w-full overflow-hidden bg-black">
      <iframe
        ref={iframeRef}
        src="/3d/index.html?embedded=1"
        title="Chakravyuh 3D experience"
        className="block h-full w-full border-0"
        allow="fullscreen"
      />
    </section>
  );
}
