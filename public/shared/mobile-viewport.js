(function () {
  function installMobileViewportHeight() {
    const root = document.documentElement;

    function syncViewportHeight() {
      const height = window.visualViewport?.height || window.innerHeight;
      root.style.setProperty('--page-height', `${height}px`);
    }

    syncViewportHeight();
    window.addEventListener('resize', syncViewportHeight);
    window.visualViewport?.addEventListener('resize', syncViewportHeight);
  }

  window.installMobileViewportHeight = installMobileViewportHeight;
})();
