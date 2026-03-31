const DISTRICT_PAGE_VERSION = '20260330-air-sky-mobile-split-1';
const BLANK_FRAME_URL = 'about:blank';

// The district page routing below reflects the currently approved shipped experience.
// If files are reorganized later, preserve the visible output exactly unless product
// direction changes explicitly.
const DISTRICT_ASSETS = {
  fire: ['/fire/character.webp'],
  water: ['/water/character.webp'],
  earth: ['/earth/character.webp', '/earth/clubs.json'],
  air: ['/AIR/character.webp'],
  sky: ['/SKY/skycharacter.webp'],
};

function createDistrictManager({ forcedDistrictView }) {
  let districtAssetsPrefetched = false;

  function districtPageUrl(name, options = {}) {
    const { hash = '' } = options;
    const mobileView = forcedDistrictView === 'mobile'
      ? true
      : forcedDistrictView === 'desktop'
        ? false
        : window.innerWidth <= 900;
    const isMobileOnly = ['fire', 'water', 'earth', 'air', 'sky'].includes(name);
    const folderName = name === 'air' ? 'AIR' : name === 'sky' ? 'SKY' : name;
    return `/${folderName}/${(mobileView && isMobileOnly) ? 'mobile.html' : 'index.html'}?v=${DISTRICT_PAGE_VERSION}${hash}`;
  }

  function preloadDistrictAssets() {
    if (districtAssetsPrefetched) return;
    districtAssetsPrefetched = true;

    ['fire', 'water', 'earth', 'air', 'sky'].forEach((name) => {
      fetch(districtPageUrl(name), { priority: 'low' }).catch(() => {});
      DISTRICT_ASSETS[name].forEach((asset) => {
        if (asset.endsWith('.webp') || asset.endsWith('.png') || asset.endsWith('.jpg') || asset.endsWith('.jpeg') || asset.endsWith('.gif')) {
          const img = new Image();
          img.decoding = 'async';
          img.src = asset;
          return;
        }

        fetch(asset, { priority: 'low' }).catch(() => {});
      });
    });
  }

  function ensureFrameSource(frameId, name, options = {}) {
    const frame = document.getElementById(frameId);
    if (!frame) return;

    const targetUrl = districtPageUrl(name, options);
    const absoluteTargetUrl = new URL(targetUrl, window.location.href).href;
    if (frame.dataset.currentUrl === absoluteTargetUrl) return;

    try {
      if (frame.contentWindow?.location) {
        frame.contentWindow.location.replace(absoluteTargetUrl);
      } else {
        frame.src = absoluteTargetUrl;
      }
    } catch {
      frame.src = absoluteTargetUrl;
    }

    frame.dataset.currentUrl = absoluteTargetUrl;
  }

  function clearFrame(frameId) {
    const frame = document.getElementById(frameId);
    if (!frame || !frame.dataset.currentUrl) return;

    try {
      if (frame.contentWindow?.location) {
        frame.contentWindow.location.replace(BLANK_FRAME_URL);
      } else {
        frame.src = BLANK_FRAME_URL;
      }
    } catch {
      frame.src = BLANK_FRAME_URL;
    }

    frame.dataset.currentUrl = '';
  }

  function clearDistrictFrames() {
    clearFrame('fire-frame');
    clearFrame('water-frame');
    clearFrame('earth-frame');
    clearFrame('air-frame');
    clearFrame('sky-frame');
  }

  return {
    clearDistrictFrames,
    districtPageUrl,
    ensureFrameSource,
    preloadDistrictAssets,
  };
}

export { createDistrictManager };
