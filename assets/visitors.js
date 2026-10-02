(() => {
  'use strict';

  const counter = document.getElementById('visitor-counter');
  const value = document.getElementById('visitor-count-value');
  const unit = document.getElementById('visitor-count-unit');
  if (!counter || !value || !unit) return;

  // Never send preview visits to the public counter.
  const published = location.protocol === 'https:' &&
    location.hostname === 'tung-beauregard.github.io' &&
    /^\/w-studio\/(?:index\.html)?$/.test(location.pathname);
  if (!published) {
    value.textContent = '預覽';
    counter.title = '本機預覽不計入到站人數。';
    return;
  }

  const cacheKey = 'w-studio:busuanzi:site-uv:v1';
  const cacheMaxAge = 24 * 60 * 60 * 1000;
  const timeout = 12000;
  const format = new Intl.NumberFormat('zh-TW');
  const note = document.createElement('span');
  note.className = 'visitor-count-note';
  note.hidden = true;
  counter.appendChild(note);
  const retry = document.createElement('button');
  retry.type = 'button';
  retry.className = 'visitor-retry';
  retry.textContent = '重試';
  retry.setAttribute('aria-label', '重新載入訪客統計');
  retry.hidden = true;
  counter.appendChild(retry);

  let previous = readCache();
  let cancel = () => {};
  let attempt = 0;

  function validCount(raw) {
    if (typeof raw !== 'number' && typeof raw !== 'string') return false;
    if (!/^\d+$/.test(String(raw))) return false;
    return Number.isSafeInteger(Number(raw)) && Number(raw) >= 0;
  }

  function readCache() {
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey));
      const age = Date.now() - cached?.updatedAt;
      if (cached && validCount(cached.count) && Number.isSafeInteger(cached.updatedAt) &&
          age >= 0 && age < cacheMaxAge) return cached;
    } catch { /* Storage may be unavailable; the live request still works. */ }
    return null;
  }

  function showPrevious() {
    // Expire cached data even if this page stays open for a long time.
    if (!previous || Date.now() - previous.updatedAt >= cacheMaxAge) return false;
    value.textContent = format.format(previous.count);
    unit.hidden = false;
    note.textContent = '（上次）';
    note.hidden = false;
    counter.dataset.state = 'cached';
    counter.title = `上次成功統計：${new Date(previous.updatedAt).toLocaleString('zh-TW')}。目前尚未取得最新資料；此數字不是即時統計。`;
    return true;
  }

  function fail() {
    if (!showPrevious()) {
      value.textContent = '暫時無法載入';
      unit.hidden = true;
      note.hidden = true;
      counter.dataset.state = 'unavailable';
      counter.title = '目前無法取得外部計數服務的資料，可以按「重試」。';
    }
    retry.hidden = false;
    retry.disabled = false;
  }

  function load() {
    cancel();
    retry.disabled = true;
    if (!showPrevious()) {
      value.textContent = '載入中';
      unit.hidden = true;
      note.hidden = true;
      counter.dataset.state = 'loading';
      counter.title = '載入訪客統計中。';
    }

    // Use the original service's JSONP endpoint and site_uv metric directly.
    // This avoids a second script download and handles API errors as well.
    const callback = `WStudioVisitors_${Date.now()}_${++attempt}`;
    const script = document.createElement('script');
    let active = true;
    let timer;
    const cleanup = () => {
      active = false;
      clearTimeout(timer);
      script.remove();
      delete window[callback];
    };
    cancel = cleanup;

    window[callback] = data => {
      if (!active) return;
      if (!data || !validCount(data.site_uv)) {
        cleanup();
        fail();
        return;
      }
      const count = Number(data.site_uv);
      cleanup();
      previous = {count, updatedAt: Date.now()};
      try { localStorage.setItem(cacheKey, JSON.stringify(previous)); } catch { /* Optional cache. */ }
      value.textContent = format.format(count);
      unit.hidden = false;
      note.hidden = true;
      counter.dataset.state = 'live';
      counter.title = '啟用後由不蒜子統計的估算訪客數（UV），不是瀏覽次數；跨裝置或瀏覽器可能重複計入。';
      // Keep keyboard focus on the counter when a focused retry button disappears.
      if (document.activeElement === retry) {
        counter.tabIndex = -1;
        counter.focus({preventScroll: true});
      }
      retry.hidden = true;
    };
    script.src = `https://busuanzi.ibruce.info/busuanzi?jsonpCallback=${callback}`;
    script.async = true;
    script.referrerPolicy = 'no-referrer-when-downgrade';
    script.onerror = () => {
      if (!active) return;
      cleanup();
      fail();
    };
    // A timeout changes the display, but a late valid response can still recover.
    // Only a user-requested retry replaces the pending request; no retry loops.
    timer = setTimeout(() => { if (active) fail(); }, timeout);
    document.head.appendChild(script);
  }

  retry.addEventListener('click', load);
  load();
})();
