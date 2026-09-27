const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8').replace(/\r\n/g, '\n');
const app = read('assets/app.js');
const publishedProjects = JSON.parse(read('content/projects.json'));
const publishedIntroductions = JSON.parse(read('content/introductions.json'));
const plain = value => JSON.parse(JSON.stringify(value));

function section(start, end) {
  const from = app.indexOf(start);
  const to = app.indexOf(end, from);
  assert.ok(from >= 0 && to > from, `Application test boundary is missing: ${start}`);
  return app.slice(from, to);
}

// Run the actual merge code and HTML renderers without a browser or a second
// implementation. Omit the unrelated menu, dialog and animation event wiring.
const program = section('(async () => {', "  $('.filter-button[data-filter=\"all\"] span')") +
  section('  const demos = ', '  const motionPreference = ') +
  'let stepIndex = 0; let activeDemo = demos.overview;\n' +
  section('  function showScene(index)', '  function startDemoTimer()') +
  'showScene(0); return {data, demos};\n})();';

async function render(content, {reject = false} = {}) {
  const elements = new Map();
  const document = {
    querySelector(selector) {
      if (!elements.has(selector)) elements.set(selector, {innerHTML: ''});
      return elements.get(selector);
    },
    querySelectorAll() { return []; }
  };
  const context = vm.createContext({document, URL, window: {}});
  vm.runInContext(read('assets/site-data.js'), context);
  const defaults = plain(context.window.SITE_DATA);
  context.window.W_STUDIO_CONTENT_READY = reject ? Promise.reject(new Error('Offline')) : Promise.resolve(content);
  const result = await vm.runInContext(program, context);
  return {
    ...plain(result), defaults,
    projectsHTML: elements.get('#project-grid').innerHTML,
    toolsHTML: elements.get('#tools-list').innerHTML,
    sceneHTML: elements.get('#demo-stage').innerHTML
  };
}

test('initial published copy preserves all seven projects and three-step introductions', async () => {
  const baseline = await render();
  const actual = await render({projects: publishedProjects, introductions: publishedIntroductions});
  assert.deepEqual(actual.data, actual.defaults);
  assert.equal(Object.keys(publishedProjects).length, 7);
  assert.equal(Object.keys(publishedIntroductions).length, 7);
  for (const [id, demo] of Object.entries(actual.demos)) {
    assert.equal(demo.steps.length, 3);
    assert.deepEqual(demo.steps, baseline.demos[id].steps);
    assert.equal(demo.title, baseline.demos[id].title);
    assert.equal(demo.description, baseline.demos[id].description);
    assert.equal(demo.url, baseline.demos[id].url);
  }
});

test('editable JSON cannot replace project IDs, categories, links or other technical settings', async () => {
  const injected = Object.fromEntries(['id', 'category', 'number', 'url', 'repo', 'qr', 'icon'].map(key => [key, 'replaced']));
  const actual = await render({projects: {
    language: {...injected, title: 'Edited title', details: {why: 'Unexpected detail dialog'}},
    unexpected: {name: 'Unexpected project'}
  }});
  const project = actual.data.projects[0];
  assert.equal(project.title, 'Edited title');
  for (const key of Object.keys(injected)) assert.equal(project[key], actual.defaults.projects[0][key], key);
  assert.equal(project.details, undefined);
  assert.equal(actual.data.projects.length, 7);
});

test('project copy, tool empty states and introduction steps render HTML as text', async () => {
  const text = '<script>alert("copy")</script>';
  const escaped = '&lt;script&gt;alert(&quot;copy&quot;)&lt;/script&gt;';
  const actual = await render({
    projects: {language: {title: text, name: text, description: text, tags: [text]}},
    home: {tools: {emptyEyebrow: text, emptyTitle: text, emptyDescriptionLine1: text, emptyDescriptionLine2: text, emptyBadge: text}},
    introductions: {overview: {steps: [
      {label: text, title: text, description: text, bullets: [text, text]}, {}, {}
    ]}}
  });
  for (const html of [actual.projectsHTML, actual.toolsHTML, actual.sceneHTML]) {
    assert.ok(html.includes(escaped));
    assert.ok(!html.includes('<script>'));
  }
});

test('missing content, rejected loading and malformed records keep the bundled copy', async () => {
  const baseline = await render();
  for (const content of [undefined, null, [], {projects: [], introductions: 'invalid'}, {projects: {language: 9}}]) {
    const actual = await render(content);
    assert.deepEqual(actual.data, baseline.data);
    assert.deepEqual(actual.demos, baseline.demos);
  }
  const offline = await render(undefined, {reject: true});
  assert.deepEqual(offline.data, baseline.data);
  assert.deepEqual(offline.demos, baseline.demos);
});

test('wrong text types and malformed list entries fall back without breaking renderers', async () => {
  const baseline = await render();
  const actual = await render({
    projects: {
      language: {title: {html: 'bad'}, tags: [false]},
      'agent-hub': {details: {why: 42, workflow: 'bad', growth: [{name: 'name', meaning: 3}]}}
    },
    introductions: {
      language: {steps: [{title: 'Only one'}]},
      overview: {steps: [{}, null, {}]},
      astral: {steps: [{title: 55, description: [], bullets: ['Only one']}, {}, {}]}
    },
    home: {tools: {emptyTitle: {html: 'bad'}}}
  });
  assert.deepEqual(actual.data, baseline.data);
  assert.deepEqual(actual.demos, baseline.demos);
  assert.equal(actual.toolsHTML, baseline.toolsHTML);
});

test('valid detail and introduction edits keep the three-step flow, URLs and icons', async () => {
  const baseline = await render();
  const actual = await render({
    projects: {'agent-hub': {details: {
      growth: [{name: 'Core', meaning: 'Reusable foundation'}],
      workflow: ['Plan', 'Build', 'Review']
    }}},
    introductions: {overview: {
      url: 'https://unexpected.example/',
      title: 'Edited introduction',
      steps: [
        {label: 'First', title: 'Updated step', description: 'Updated description', icon: 'unexpected', bullets: ['One', 'Two']},
        {title: 'Second step'},
        {title: 'Third step'}
      ]
    }}
  });
  const details = actual.data.projects.find(project => project.id === 'agent-hub').details;
  assert.deepEqual(details.growth, [['Core', 'Reusable foundation']]);
  assert.deepEqual(details.workflow, ['Plan', 'Build', 'Review']);
  const demo = actual.demos.overview;
  assert.equal(demo.title, 'Edited introduction');
  assert.equal(demo.url, baseline.demos.overview.url);
  assert.equal(demo.steps.length, 3);
  assert.deepEqual(demo.steps.map(step => step[3]), baseline.demos.overview.steps.map(step => step[3]));
  assert.deepEqual(demo.steps[0].slice(0, 3), ['First', 'Updated step', 'Updated description']);
  assert.deepEqual(demo.steps[0][4], ['One', 'Two']);
});
