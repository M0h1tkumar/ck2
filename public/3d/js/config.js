const embedded = new URLSearchParams(window.location.search).get('embedded') === '1';
const forcedDistrictView = new URLSearchParams(window.location.search).get('districtView');
const root = document.documentElement;

if (embedded) {
  root.classList.add('embedded');
}

function getViewport() {
  const vv = window.visualViewport;
  return { width: vv?.width || window.innerWidth, height: vv?.height || window.innerHeight };
}

function syncViewport() {
  const { width, height } = getViewport();
  root.style.setProperty('--app-width', width + 'px');
  root.style.setProperty('--app-height', height + 'px');
}

const deviceMemory = navigator.deviceMemory || 4;
const isLow = navigator.hardwareConcurrency <= 4 || /Android|iPhone|iPad/i.test(navigator.userAgent);
const isMid = !isLow && (navigator.hardwareConcurrency <= 8 || deviceMemory <= 8);
const Q = isLow
  ? { pxr: 1, shd: 512, seg: 48, par: 180, tSeg: 34, wM: 0.45, decorEvery: 3, particleEvery: 4 }
  : isMid
    ? { pxr: Math.min(devicePixelRatio, 1.25), shd: 1024, seg: 64, par: 300, tSeg: 48, wM: 0.8, decorEvery: 2, particleEvery: 3 }
    : { pxr: Math.min(devicePixelRatio, 1.5), shd: 1024, seg: 72, par: 400, tSeg: 56, wM: 1, decorEvery: 2, particleEvery: 2 };

const ST = { OV: 'ov', ZM: 'zm', CTR: 'ctr', FLY: 'fly', PNL: 'pnl', INTRO: 'intro' };

export { embedded, forcedDistrictView, getViewport, Q, root, ST, syncViewport, isLow };
