/* Pages CMS edits plain JSON. No credentials or executable content are loaded here. */
(() => {
  'use strict';
  const contentRoot = new URL('../content/', document.currentScript.src);
  const names = ['home', 'projects', 'introductions'];

  function applyHome(home) {
    if (!home || typeof home !== 'object' || Array.isArray(home)) return;
    document.querySelectorAll('[data-copy]').forEach(element => {
      const value = element.dataset.copy.split('.').reduce((node, key) =>
        node && Object.hasOwn(node, key) ? node[key] : undefined, home);
      // Editable copy is always text, never markup. Keep the static fallback for bad values.
      if (typeof value === 'string') element.textContent = value;
    });
  }

  async function readContent(name) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      const response = await fetch(new URL(`${name}.json`, contentRoot), {
        cache: 'no-cache', signal: controller.signal, credentials: 'omit'
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const value = await response.json();
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Expected an object');
      if (name === 'home') applyHome(value);
      return [name, value];
    } catch (error) {
      console.warn(`[W AI Studio] ${name} copy unavailable; using built-in copy.`, error.message);
      return [name, null];
    } finally {
      clearTimeout(timer);
    }
  }

  // file:// previews keep the built-in copy. Use a local HTTP server to preview CMS edits.
  window.W_STUDIO_CONTENT_READY = location.protocol === 'file:'
    ? Promise.resolve({})
    : Promise.all(names.map(readContent)).then(entries => Object.fromEntries(entries));
})();
