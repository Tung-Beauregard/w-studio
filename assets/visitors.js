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

  // Official soxft/busuanzi hosted endpoint, published by its /js client.
  const endpoint = 'https://bsz.iirose.cn/api';
  const canonicalUrl = 'https://tung-beauregard.github.io/w-studio/';
  // Last confirmed original-provider UV on 2026-10-02 (real production response).
  // Keep history separate: identities cannot be deduplicated across providers.
  const historicalVisitors = 12;
  const cacheKey = 'w-studio:visitors:soxft:v1';
  const identityKey = 'w-studio:visitors:soxft:identity';
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

  function validCount(raw) {
    if (typeof raw !== 'number' && typeof raw !== 'string') return false;
    if (!/^\d+$/.test(String(raw))) return false;
    return Number.isSafeInteger(Number(raw)) && Number(raw) >= 0;
  }

  function readCache() {
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey));
      const age = Date.now() - cached?.updatedAt;
      if (cached && validCount(cached.count) && Number(cached.count) >= historicalVisitors && Number.isSafeInteger(cached.updatedAt) &&
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

    // CORS JSON avoids executing a cross-origin JSONP script. Always send the
    // canonical public URL, never a visitor's query string, hash or local URL.
    const controller = new AbortController();
    let active = true;
    const timer = setTimeout(() => { if (active) fail(); }, timeout);
    cancel = () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
    const headers = {'x-bsz-referer': canonicalUrl};
    try {
      const identity = localStorage.getItem(identityKey);
      if (identity && identity.length < 4096 && /^[A-Za-z0-9._~-]+$/.test(identity)) {
        headers.Authorization = `Bearer ${identity}`;
      }
    } catch { /* The provider can also estimate UV using IP and browser data. */ }

    fetch(endpoint, {method: 'POST', headers, credentials: 'omit', cache: 'no-store', signal: controller.signal})
    .then(async response => {
      if (!active) return;
      if (!response.ok) {
        if (response.status === 401) {
          try { localStorage.removeItem(identityKey); } catch { /* Optional storage. */ }
        }
        throw new Error('Counter request failed');
      }
      const result = await response.json();
      if (!active) return;
      if (result?.success !== true || !validCount(result.data?.site_uv)) {
        throw new Error('Invalid visitor count');
      }
      const count = historicalVisitors + Number(result.data.site_uv);
      if (!Number.isSafeInteger(count)) throw new Error('Visitor count out of range');
      const identity = response.headers.get('Set-Bsz-Identity');
      if (identity && identity.length < 4096 && /^[A-Za-z0-9._~-]+$/.test(identity)) {
        try { localStorage.setItem(identityKey, identity); } catch { /* Optional storage. */ }
      }
      active = false;
      clearTimeout(timer);
      previous = {count, updatedAt: Date.now()};
      try { localStorage.setItem(cacheKey, JSON.stringify(previous)); } catch { /* Optional cache. */ }
      value.textContent = format.format(count);
      unit.hidden = false;
      note.hidden = true;
      counter.dataset.state = 'live';
      counter.title = '估算訪客數（UV）：2026/10/2 切換前已確認的 12 人，加上新來源統計。切換前後、跨裝置或瀏覽器可能重複計入；不是瀏覽次數。';
      // Keep keyboard focus on the counter when a focused retry button disappears.
      if (document.activeElement === retry) {
        counter.tabIndex = -1;
        counter.focus({preventScroll: true});
      }
      retry.hidden = true;
    })
    .catch(() => {
      if (!active) return;
      active = false;
      clearTimeout(timer);
      fail();
    });
    // A timeout changes the display, but a late valid response can still recover.
    // Only a user-requested retry replaces the pending request; no retry loops.
  }

  retry.addEventListener('click', load);
  load();
})();
