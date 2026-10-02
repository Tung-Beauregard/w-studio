const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../assets/visitors.js'), 'utf8');
const cacheKey = 'w-studio:visitors:soxft:v1';
const identityKey = 'w-studio:visitors:soxft:identity';
const now = 1790928000000;
const flush = () => new Promise(setImmediate);

function page({url = 'https://tung-beauregard.github.io/w-studio/', cache, storageBlocked = false, identity} = {}) {
  let document;
  class Element {
    constructor(tag) { this.tag = tag; this.children = []; this.dataset = {}; this.hidden = false; this.textContent = ''; this.listeners = {}; }
    appendChild(child) { this.children.push(child); }
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
  if (identity) storage.set(identityKey, identity);
  const requests = [];
  let clock = now, timerId = 0;
  class Clock extends Date { static now() { return clock; } }
  const context = {document, location: new URL(url), Intl, Date: Clock, AbortController,
    localStorage: {
      getItem(key) { if (storageBlocked) throw Error('disabled'); return storage.get(key) ?? null; },
      setItem(key, value) { if (storageBlocked) throw Error('disabled'); storage.set(key, value); },
      removeItem(key) { if (storageBlocked) throw Error('disabled'); storage.delete(key); }
    },
    fetch(url, options) {
      return new Promise((resolve, reject) => requests.push({url, options,
        async respond(data, {status = 200, identity = null} = {}) {
          resolve({ok: status === 200, status, headers: {get: name => name === 'Set-Bsz-Identity' ? identity : null}, json: async () => data});
          await flush();
        },
        async fail() { reject(new TypeError('Network error')); await flush(); }
      }));
    },
    setTimeout(callback, ms) { const id = ++timerId; timers.set(id, {callback, at: clock + ms}); return id; },
    clearTimeout(id) { timers.delete(id); }
  };
  vm.runInNewContext(source, context);
  return {
    counter, value, unit, document, storage, requests,
    get note() { return counter.children.find(c => c.className === 'visitor-count-note'); },
    get retry() { return counter.children.find(c => c.className === 'visitor-retry'); },
    request() { return requests.at(-1); },
    advance(ms) { clock += ms; for (const [id, timer] of [...timers]) if (timer.at <= clock) { timers.delete(id); timer.callback(); } }
  };
}
const countData = site_uv => ({success: true, data: {site_uv, site_pv: 999999}});

test('preview and other sites never contact or display a cached public counter', () => {
  for (const url of ['http://127.0.0.1:8606/', 'http://tung-beauregard.github.io/w-studio/', 'https://example.com/w-studio/', 'https://tung-beauregard.github.io/another-project/']) {
    const p = page({url, cache: {count: 900, updatedAt: now}});
    assert.equal(p.value.textContent, '預覽'); assert.equal(p.requests.length, 0); assert.equal(p.retry, undefined);
  }
});

test('both public URLs use CORS JSON with canonical reference and preserve verified historical UV', async () => {
  for (const [url, count, expected] of [
    ['https://tung-beauregard.github.io/w-studio/?private=do-not-send', 12345, '12,357'],
    ['https://tung-beauregard.github.io/w-studio/index.html#projects', 0, '12']
  ]) {
    const p = page({url}), request = p.request();
    assert.equal(p.requests.length, 1);
    assert.equal(request.url, 'https://bsz.iirose.cn/api');
    assert.equal(request.options.method, 'POST'); assert.equal(request.options.credentials, 'omit');
    assert.equal(request.options.headers['x-bsz-referer'], 'https://tung-beauregard.github.io/w-studio/');
    assert.equal(p.document.head.children.length, 0, 'no third-party script execution');
    await request.respond(countData(count));
    assert.equal(p.value.textContent, expected); assert.equal(p.unit.hidden, false);
    assert.equal(p.counter.dataset.state, 'live');
    assert.match(p.counter.title, /切換前/); assert.match(p.counter.title, /重複計入/);
    assert.equal(JSON.parse(p.storage.get(cacheKey)).count, count + 12);
  }
});

test('late response recovers after timeout without a second counting request', async () => {
  const p = page(), request = p.request();
  p.advance(12000);
  assert.equal(p.value.textContent, '暫時無法載入'); assert.equal(p.retry.hidden, false);
  assert.equal(p.requests.length, 1);
  await request.respond(countData('25'));
  assert.equal(p.value.textContent, '37'); assert.equal(p.retry.hidden, true);
});

test('retry aborts old request, ignores its late reply and preserves keyboard focus', async () => {
  const p = page(), old = p.request();
  p.advance(12000); p.retry.focus(); p.retry.click();
  const next = p.request();
  assert.equal(old.options.signal.aborted, true);
  assert.equal(p.requests.length, 2); assert.notEqual(next, old);
  p.retry.click(); assert.equal(p.requests.length, 2);
  await next.respond(countData(17)); await old.respond(countData(8));
  assert.equal(p.value.textContent, '29'); assert.equal(p.document.activeElement, p.counter);
});

test('API error offers retry and does not invent totals or loop automatically', async () => {
  const p = page(); await p.request().fail(); p.advance(60000);
  assert.equal(p.value.textContent, '暫時無法載入'); assert.equal(p.unit.hidden, true);
  assert.equal(p.requests.length, 1); assert.equal(p.storage.size, 0);
  p.retry.click(); await p.request().respond(countData(7));
  assert.equal(p.value.textContent, '19');
});

test('fresh cache is marked previous and replaced by a live total, without adding history twice', async () => {
  const p = page({cache: {count: 31, updatedAt: now - 1000}});
  assert.equal(p.value.textContent, '31'); assert.equal(p.note.hidden, false);
  assert.equal(p.note.textContent, '（上次）'); assert.match(p.counter.title, /不是即時統計/);
  p.advance(12000); assert.equal(p.counter.dataset.state, 'cached');
  await p.request().respond(countData(20));
  assert.equal(p.note.hidden, true); assert.equal(p.value.textContent, '32');
});

test('invalid, future and expired cache cannot become a displayed visitor count', async () => {
  for (const cache of ['bad json', null, {count: 9, updatedAt: now + 1}, {count: 9, updatedAt: now - 86400000}, {count: '<b>9</b>', updatedAt: now}]) {
    const p = page({cache}); await p.request().fail();
    assert.equal(p.value.textContent, '暫時無法載入'); assert.equal(p.unit.hidden, true);
  }
  const p = page({cache: {count: 9, updatedAt: now - 86400000 + 1}});
  p.advance(12000); assert.equal(p.value.textContent, '暫時無法載入');
});

test('unavailable localStorage does not break valid live statistics', async () => {
  const p = page({storageBlocked: true}); await p.request().respond(countData(55), {identity: 'anonymous.id'});
  assert.equal(p.value.textContent, '67'); assert.equal(p.counter.dataset.state, 'live');
});

test('malformed or unsuccessful responses and overflowing totals are rejected', async () => {
  for (const site_uv of [null, undefined, false, {}, [], '', -1, 1.5, Infinity, Number.MAX_SAFE_INTEGER, 'NaN', '<img>', '10people']) {
    const p = page(); await p.request().respond(countData(site_uv));
    assert.equal(p.value.textContent, '暫時無法載入'); assert.equal(p.storage.size, 0);
  }
  for (const data of [null, {}, {success: false, data: {site_uv: 10}}]) {
    const p = page(); await p.request().respond(data);
    assert.equal(p.counter.dataset.state, 'unavailable');
  }
});

test('provider identity is reused for deduplication, rotated safely and cleared on 401', async () => {
  const p = page({identity: 'anonymous.old'});
  assert.equal(p.request().options.headers.Authorization, 'Bearer anonymous.old');
  await p.request().respond(countData(1), {identity: 'anonymous.new'});
  assert.equal(p.storage.get(identityKey), 'anonymous.new');
  const denied = page({identity: 'expired.identity'});
  await denied.request().respond({}, {status: 401});
  assert.equal(denied.storage.has(identityKey), false);
  denied.retry.click(); assert.equal(denied.request().options.headers.Authorization, undefined);
  const unsafe = page({identity: 'bad\r\nheader'});
  assert.equal(unsafe.request().options.headers.Authorization, undefined);
});

test('HTTP service errors do not present a numeric success response as live', async () => {
  const p = page(); await p.request().respond(countData(10), {status: 503});
  assert.equal(p.counter.dataset.state, 'unavailable'); assert.equal(p.storage.size, 0);
});
