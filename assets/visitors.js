(() => {
  'use strict';

  const counter = document.getElementById('visitor-counter');
  const value = document.getElementById('visitor-count-value');
  const unit = document.getElementById('visitor-count-unit');
  if (!counter || !value || !unit) return;

  // Local previews must never contribute to the public count.
  const published = location.protocol === 'https:' &&
    location.hostname === 'tung-beauregard.github.io' &&
    /^\/w-studio\/(?:index\.html)?$/.test(location.pathname);
  if (!published) {
    value.textContent = '預覽';
    counter.title = '本機預覽不計入到站人數。';
    return;
  }

  counter.title = '載入訪客統計中。';
  const source = document.createElement('span');
  source.id = 'busuanzi_value_site_uv';
  source.hidden = true;
  counter.appendChild(source);

  let settled = false;
  let timer;
  const observer = new MutationObserver(() => {
    const raw = source.textContent.trim();
    if (!/^\d+$/.test(raw)) return;
    const count = Number(raw);
    if (!Number.isSafeInteger(count) || count < 0) return;
    finish(count);
  });

  function finish(count) {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    observer.disconnect();
    if (count === undefined) {
      value.textContent = '暫時無法載入';
      counter.title = '計數服務暫時無法連線，重新整理頁面可再試一次。';
      return;
    }
    value.textContent = new Intl.NumberFormat('zh-TW').format(count);
    unit.hidden = false;
    counter.title = '啟用後由不蒜子統計的估算訪客數（UV），不是瀏覽次數；跨裝置或瀏覽器可能重複計入。';
  }

  observer.observe(source, {childList: true, characterData: true, subtree: true});
  timer = setTimeout(() => finish(), 10000);
  const script = document.createElement('script');
  script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
  script.async = true;
  script.onerror = () => finish();
  document.head.appendChild(script);
})();
