const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../assets/visitors.js'), 'utf8');
const cacheKey = 'w-studio:busuanzi:site-uv:v1';
const now = 1790928000000;

function page({url = 'https://tung-beauregard.github.io/w-studio/', cache, storageBlocked = false} = {}) {
  let document;
  class Element {
    constructor(tag) { this.tag = tag; this.children = []; this.dataset = {}; this.hidden = false; this.textContent = ''; this.listeners = {}; }
    appendChild(child) { child.parent = this; this.children.push(child); }
    remove() { if (this.parent) this.parent.children = this.parent.children.filter(c => c !== this); }
    setAttribute(name, value) { this[name] = value; }
    addEventListener(name, callback) { this.listeners[name] = callback; }
    focus() { document.activeElement = this; }
    click() { if (!this.disabled) this.listeners.click?.(); }
  }
  const counter = new Element('span'), value = new Element('strong'), unit = new Element('span');
  value.textContent = '—'; unit.hidden = true;
  const elements = {'visitor-counter': counter, 'visitor-count-value': value, 'visitor-count-unit': unit};
  document = {head: new Element('head'), activeElement: null, createElement: tag => new Element(tag), getElementById: id => elements[id]};
  const timers = new Map(), storage = new Map(cache === undefined ? [] : [[cacheKey, typeof cache === 'string' ? cache : JSON.stringify(cache)]]);
  let clock = now, timerId = 0;
  class Clock extends Date { static now() { return clock; } }
  const context = {document, location: new URL(url), Intl, Date: Clock, window: {},
    localStorage: {
      getItem(key) { if (storageBlocked) throw Error('disabled'); return storage.get(key) ?? null; },
      setItem(key, value) { if (storageBlocked) throw Error('disabled'); storage.set(key, value); }
    },
    setTimeout(callback, ms) { const id = ++timerId; timers.set(id, {callback, at: clock + ms}); return id; },
    clearTimeout(id) { timers.delete(id); }
  };
  vm.runInNewContext(source, context);
  return {
    counter, value, unit, document, storage,
    get note() { return counter.children.find(c => c.className === 'visitor-count-note'); },
    get retry() { return counter.children.find(c => c.className === 'visitor-retry'); },
    get scripts() { return document.head.children; },
    request() {
      const script = document.head.children.at(-1);
      const callback = new URL(script.src).searchParams.get('jsonpCallback');
      return {script, respond: context.window[callback]};
    },
    advance(ms) { clock += ms; for (const [id, timer] of [...timers]) if (timer.at <= clock) { timers.delete(id); timer.callback(); } }
  };
}

test('preview and other sites never contact or display a cached public counter', () => {
  for (const url of ['http://127.0.0.1:8606/', 'http://tung-beauregard.github.io/w-studio/', 'https://example.com/w-studio/', 'https://tung-beauregard.github.io/another-project/']) {
    const p = page({url, cache: {count: 900, updatedAt: now}});
    assert.equal(p.value.textContent, '預覽'); assert.equal(p.scripts.length, 0); assert.equal(p.retry, undefined);
  }
});

test('both public URLs request the original service once and render site_uv, including zero', () => {
  for (const [url, count, expected] of [
    ['https://tung-beauregard.github.io/w-studio/', 12345, '12,345'],
    ['https://tung-beauregard.github.io/w-studio/index.html#projects', 0, '0']
  ]) {
    const p = page({url});
    assert.equal(p.scripts.length, 1);
    const {script, respond} = p.request();
    assert.equal(new URL(script.src).origin, 'https://busuanzi.ibruce.info');
    assert.equal(new URL(script.src).pathname, '/busuanzi');
    assert.equal(script.referrerPolicy, 'no-referrer-when-downgrade');
    respond({site_uv: count, site_pv: 999999});
    assert.equal(p.value.textContent, expected); assert.equal(p.unit.hidden, false);
    assert.equal(p.counter.dataset.state, 'live'); assert.equal(p.scripts.length, 0);
    assert.equal(JSON.parse(p.storage.get(cacheKey)).count, count);
  }
});

test('late response recovers after timeout without a second counting request', () => {
  const p = page(), request = p.request();
  p.advance(12000);
  assert.equal(p.value.textContent, '暫時無法載入'); assert.equal(p.retry.hidden, false);
  assert.equal(p.scripts.length, 1);
  request.respond({site_uv: '25'});
  assert.equal(p.value.textContent, '25'); assert.equal(p.retry.hidden, true);
});

test('retry cancels old request, ignores its late reply and preserves keyboard focus', () => {
  const p = page(), old = p.request();
  p.advance(12000); p.retry.focus(); p.retry.click();
  const next = p.request();
  assert.equal(p.scripts.length, 1); assert.notEqual(next.script.src, old.script.src);
  p.retry.click(); assert.equal(p.scripts.length, 1);
  next.respond({site_uv: 17}); old.respond({site_uv: 8});
  assert.equal(p.value.textContent, '17'); assert.equal(p.document.activeElement, p.counter);
});

test('API error offers retry and does not create a fake zero or automatic request loop', () => {
  const p = page(); p.request().script.onerror(); p.advance(60000);
  assert.equal(p.value.textContent, '暫時無法載入'); assert.equal(p.unit.hidden, true);
  assert.equal(p.scripts.length, 0); assert.equal(p.storage.size, 0);
  p.retry.click(); p.request().respond({site_uv: 7});
  assert.equal(p.value.textContent, '7');
});

test('fresh cache is visibly marked as previous data and replaced by a live reply', () => {
  const p = page({cache: {count: 31, updatedAt: now - 1000}});
  assert.equal(p.value.textContent, '31'); assert.equal(p.note.hidden, false);
  assert.equal(p.note.textContent, '（上次）'); assert.match(p.counter.title, /不是即時統計/);
  p.advance(12000); assert.equal(p.counter.dataset.state, 'cached');
  p.request().respond({site_uv: 32});
  assert.equal(p.note.hidden, true); assert.equal(p.value.textContent, '32');
});

test('invalid, future and expired cache cannot become a displayed visitor count', () => {
  for (const cache of ['bad json', null, {count: 9, updatedAt: now + 1}, {count: 9, updatedAt: now - 86400000}, {count: '<b>9</b>', updatedAt: now}]) {
    const p = page({cache}); p.request().script.onerror();
    assert.equal(p.value.textContent, '暫時無法載入'); assert.equal(p.unit.hidden, true);
  }
  const p = page({cache: {count: 9, updatedAt: now - 86400000 + 1}});
  p.advance(12000); assert.equal(p.value.textContent, '暫時無法載入');
});

test('unavailable localStorage does not break valid live statistics', () => {
  const p = page({storageBlocked: true}); p.request().respond({site_uv: 55});
  assert.equal(p.value.textContent, '55'); assert.equal(p.counter.dataset.state, 'live');
});

test('malformed service responses are rejected rather than shown as counts', () => {
  for (const site_uv of [null, undefined, false, {}, [], '', -1, 1.5, Infinity, Number.MAX_SAFE_INTEGER + 1, 'NaN', '<img>', '10people']) {
    const p = page(); p.request().respond({site_uv});
    assert.equal(p.value.textContent, '暫時無法載入'); assert.equal(p.storage.size, 0);
  }
});
