const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../assets/content.js'), 'utf8');

function run(fetch, protocol = 'https:', timers = {}) {
  const elements = [
    {dataset: {copy: 'hero.titleLine1'}, textContent: 'Original title'},
    {dataset: {copy: 'hero.tags.0'}, textContent: 'Original tag'},
    {dataset: {copy: 'hero.descriptionLine1'}, textContent: 'Original description'}
  ];
  const warnings = [];
  const context = {
    window: {}, location: {protocol}, URL, AbortController, fetch,
    document: {
      currentScript: {src: 'https://example.test/w-studio/assets/content.js?v=cms-1'},
      querySelectorAll: () => elements
    },
    setTimeout, clearTimeout, console: {warn: (...args) => warnings.push(args)}, ...timers
  };
  vm.runInNewContext(source, context);
  return {ready: context.window.W_STUDIO_CONTENT_READY, elements, warnings};
}

test('loads copy relative to the project root and treats markup as literal text', async () => {
  const requests = [];
  const result = run(async (url, options) => {
    requests.push({url: String(url), options});
    return {ok: true, json: async () => url.pathname.endsWith('/home.json')
      ? {hero: {titleLine1: '<img src=x onerror=alert(1)>', tags: ['Edited tag'], descriptionLine1: 42}}
      : {example: {title: 'Edited'}}};
  });
  await result.ready;
  assert.equal(requests.length, 3);
  assert.ok(requests.every(({url, options}) => url.startsWith('https://example.test/w-studio/content/') && options.credentials === 'omit'));
  assert.equal(result.elements[0].textContent, '<img src=x onerror=alert(1)>');
  assert.equal(result.elements[1].textContent, 'Edited tag');
  assert.equal(result.elements[2].textContent, 'Original description');
  assert.ok(result.elements.every(element => !Object.hasOwn(element, 'innerHTML')));
});

test('a missing or malformed file does not prevent valid content from loading', async () => {
  const result = run(async url => {
    if (url.pathname.endsWith('/projects.json')) return {ok: false, status: 404};
    if (url.pathname.endsWith('/introductions.json')) return {ok: true, json: async () => []};
    return {ok: true, json: async () => ({hero: {titleLine1: 'Updated home'}})};
  });
  const data = await result.ready;
  assert.equal(result.elements[0].textContent, 'Updated home');
  assert.equal(data.projects, null);
  assert.equal(data.introductions, null);
  assert.equal(result.warnings.length, 2);
});

test('network and JSON parse errors resolve to fallback instead of rejecting app startup', async () => {
  let count = 0;
  const result = run(async () => {
    if (count++ === 0) throw new Error('Network unavailable');
    return {ok: true, json: async () => { throw new Error('Invalid JSON'); }};
  });
  const data = await result.ready;
  assert.ok(Object.values(data).every(value => value === null));
  assert.equal(result.elements[0].textContent, 'Original title');
});

test('slow content requests time out and do not hang app startup', async () => {
  const callbacks = [];
  const result = run((url, {signal}) => new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(new Error('Aborted')));
  }), 'https:', {setTimeout: fn => {callbacks.push(fn); return callbacks.length;}, clearTimeout: () => {}});
  callbacks.forEach(fn => fn());
  const data = await result.ready;
  assert.ok(Object.values(data).every(value => value === null));
});

test('direct file previews keep bundled copy without attempting fetch', async () => {
  let fetched = false;
  const result = run(() => {fetched = true;}, 'file:');
  await result.ready;
  assert.equal(fetched, false);
  assert.equal(result.elements[0].textContent, 'Original title');
});
