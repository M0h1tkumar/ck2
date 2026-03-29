const DISTRICT_PAGE_VERSION = '20260329-fire-mobile-bottom-left-1';

const DISTRICT_ASSETS = {
  fire: ['/fire/character.webp'],
  water: ['/water/character.webp'],
  earth: ['/earth/character.webp', '/earth/clubs.json'],
  air: ['/AIR/character.webp'],
  sky: ['/SKY/skycharacter.webp'],
};

function createDistrictManager({ forcedDistrictView }) {
  let districtAssetsPrefetched = false;

  function districtPageUrl(name) {
    const mobileView = forcedDistrictView === 'mobile'
      ? true
      : forcedDistrictView === 'desktop'
        ? false
        : window.innerWidth <= 900;
    const isMobileOnly = ['fire', 'water', 'earth'].includes(name);
    return `/${name}/${(mobileView && isMobileOnly) ? 'mobile.html' : 'index.html'}?v=${DISTRICT_PAGE_VERSION}`;
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

  function ensureFrameSource(frameId, name) {
    const frame = document.getElementById(frameId);
    if (!frame) return;

    const targetUrl = districtPageUrl(name);
    if (frame.src !== new URL(targetUrl, window.location.href).href) {
      frame.src = targetUrl;
    }
  }

  function clearDistrictFrames() {
    const fireFrame = document.getElementById('fire-frame');
    if (fireFrame) fireFrame.src = '';

    const waterFrame = document.getElementById('water-frame');
    if (waterFrame) waterFrame.src = '';

    const earthFrame = document.getElementById('earth-frame');
    if (earthFrame) earthFrame.src = '';

    const airFrame = document.getElementById('air-frame');
    if (airFrame) airFrame.src = '';

    const skyFrame = document.getElementById('sky-frame');
    if (skyFrame) skyFrame.src = '';
  }

  return {
    clearDistrictFrames,
    districtPageUrl,
    ensureFrameSource,
    preloadDistrictAssets,
  };
}

export { createDistrictManager };
