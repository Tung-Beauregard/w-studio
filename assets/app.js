(() => {
  'use strict';
  const data = window.SITE_DATA;
  if (!data) return;
  const $ = (s, parent = document) => parent.querySelector(s);
  const $$ = (s, parent = document) => [...parent.querySelectorAll(s)];
  const escape = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = (value) => { try { const u = new URL(value); return ['http:', 'https:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };
  const paths = {
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    github: '<path d="M9 19c-4.3 1.3-4.3-2.5-6-3m12 6v-3.8c0-1 .1-1.6-.5-2.2 3-.3 6.1-1.5 6.1-6.8a5.3 5.3 0 0 0-1.4-3.7A5 5 0 0 0 19 1.9s-1.1-.4-3.8 1.4a13 13 0 0 0-6.8 0C5.7 1.5 4.6 1.9 4.6 1.9a5 5 0 0 0-.2 3.6A5.3 5.3 0 0 0 3 9.2c0 5.3 3.2 6.5 6.2 6.8-.5.5-.7 1.2-.7 2.2V22"/>',
    flask: '<path d="M9 3h6m-5 0v7l-5.6 8.5A2 2 0 0 0 6 22h12a2 2 0 0 0 1.6-3.5L14 10V3M7 16h10"/><path d="m9 19 .01 0m5-1 .01 0"/>',
    language: '<path d="M3 5h12M9 3v2M5 5c0 6 4 10 8 12M13 5c0 6-4 10-9 12m10 4 4-11 4 11m-7-3h6"/>',
    chat: '<path d="M5 3h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-8l-6 4v-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M7 8h10M7 12h7"/>',
    code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    play: '<path d="m8 4 12 8-12 8Z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    plus: '<path d="M12 4v16M4 12h16"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    folder: '<path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
    spark: '<path d="m12 2 2.7 7.3L22 12l-7.3 2.7L12 22l-2.7-7.3L2 12l7.3-2.7ZM20 2v4m-2-2h4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    chart: '<path d="M3 3v18h18M6 15l4-5 4 3 6-8"/>',
    book: '<path d="M12 5v16M3 3h5a4 4 0 0 1 4 2 4 4 0 0 1 4-2h5v16h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3Z"/>',
    pencil: '<path d="m15 4 5 5M3 21l5-1L21 7a2 2 0 0 0 0-3l-1-1a2 2 0 0 0-3 0L4 16Z"/>',
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.globe}</svg>`;
  function fillIcons(parent = document) { $$('[data-icon]', parent).forEach(el => el.innerHTML = icon(el.dataset.icon)); }
  fillIcons();
  const languageVisual = `<div class="visual-label"><i></i> A NEW LANGUAGE. A NEW WORLD.</div><span class="visual-note">功能概念示意</span><div class="language-cards" aria-hidden="true"><div class="flash-card"><small>01 / THAI</small><strong lang="th">ก</strong><span lang="th">สวัสดี</span><em>從字母開始，一點一點進步</em></div><div class="language-exchange">⇄</div><div class="flash-card"><small>02 / CHINESE</small><strong>你</strong><span>你好</span><em>從一句問候，認識另一種文化</em></div></div><div class="mini-float">${icon('language')} 兩種語言，更多可能。</div>`;
  const astralVisual = `<div class="visual-label"><i></i> YOUR PERSONAL COSMOS.</div><span class="visual-note">功能概念示意</span><div class="astral-chart" aria-hidden="true"><svg viewBox="0 0 260 260" fill="none"><circle cx="130" cy="130" r="112"/><circle cx="130" cy="130" r="88"/><circle cx="130" cy="130" r="49"/><path class="astral-rays" d="M130 18v24M130 218v24M18 130h24M218 130h24M74 33l12 21M174 206l12 21M33 74l21 12M206 174l21 12M33 186l21-12M206 86l21-12M74 227l12-21M174 54l12-21"/><g class="astral-constellation"><path d="m80 56 128 93-149 32 71-137 65 151-115-139"/><circle cx="80" cy="56" r="4"/><circle cx="208" cy="149" r="4"/><circle cx="59" cy="181" r="4"/><circle cx="130" cy="44" r="4"/><circle cx="195" cy="195" r="4"/></g><path class="astral-center" d="m130 112 5 13 13 5-13 5-5 13-5-13-13-5 13-5Z"/></svg><span class="astral-sign sign-one">✦</span><span class="astral-sign sign-two">✧</span></div><div class="astral-caption" aria-hidden="true"><strong>星語</strong><span>ASTRAL NOTES</span><small>本命盤 / 雙人合盤 / 白話解讀</small></div>`;
  const botVisual = (id, languages, greeting, translation) => `<div class="visual-label"><i></i> W STUDIO / TRANSLATE</div><span class="visual-note">品牌頭像 · 對話示意</span><div class="line-bot-art"><img class="line-bot-avatar" src="./assets/${id}-avatar.png?v=dialogue-1" alt="W Studio ${escape(languages)}翻譯機器人品牌頭像" loading="lazy" width="1024" height="1024"><div class="line-chat-preview" aria-hidden="true"><span class="line-chat-message outgoing">${escape(greeting)}</span><span class="line-chat-message incoming">${escape(translation)}</span></div></div><div class="line-bot-caption">${icon('chat')} <span>${escape(languages)}</span></div>`;
  const mycelintVisual = `<div class="visual-label">MYCELINT / by W Studio</div><span class="visual-note">概念示意</span>
    <svg class="mycelint-network" viewBox="0 0 460 320" fill="none" role="img" aria-label="菌絲意象：從一個開發核心分枝連接，長出不同工具節點">
      <g class="mycelint-branches" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <path pathLength="1" d="M225 168C182 168 180 109 140 109S104 84 90 74"/>
        <path pathLength="1" d="M225 168C256 165 251 108 286 108S315 77 330 64"/>
        <path pathLength="1" d="M225 168C289 168 285 204 333 204S375 180 388 180"/>
        <path pathLength="1" d="M225 168C190 179 215 230 172 230S133 252 118 266"/>
        <path class="mycelint-twig" pathLength="1" d="M171 137Q161 156 137 153M277 110Q283 139 311 138M301 194Q306 169 321 159M190 227Q216 246 231 248"/>
      </g>
      <g class="mycelint-core"><circle cx="225" cy="168" r="41" stroke="currentColor" stroke-opacity=".16"/><circle cx="225" cy="168" r="29" fill="#19392d" stroke="currentColor"/><path d="m205 155 8 27 12-20 12 20 8-27" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/></g>
      <g class="mycelint-nodes" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <g><rect x="69" y="53" width="42" height="42" rx="12"/><path d="m84 67-7 7 7 7m12-14 7 7-7 7m-5-16-3 18"/></g>
        <g><rect x="309" y="43" width="42" height="42" rx="12"/><rect x="319" y="54" width="22" height="20" rx="2"/><path d="M319 60h22m-14 0v14"/></g>
        <g><rect x="367" y="159" width="42" height="42" rx="12"/><path d="M378 173h20m-20 7h14m-14 7h18"/></g>
        <g><rect x="97" y="245" width="42" height="42" rx="12"/><path d="M108 273v-13l10-6 10 6v13l-10 6Zm0-13 10 6 10-6m-10 6v13"/></g>
      </g>
    </svg><div class="mycelint-caption"><strong>Mycelint</strong><span>AI 協作開發工作臺</span><small>從一個核心，長出更多可能。</small></div>`;
  const projectVisuals = { language: languageVisual, astral: astralVisual, 'line-zh-th': botVisual('line-zh-th','中文 × ไทย','你好','สวัสดี'), 'line-zh-en-ko': botVisual('line-zh-en-ko','中文 × English × 한국어','你好','Hello · 안녕하세요'), 'agent-hub': mycelintVisual };
  $('#project-grid').innerHTML = data.projects.map(p => {
    const repo = safeUrl(p.repo);
    const qrButton = p.qr ? `<button class="demo-link qr-link" data-qr="${escape(p.id)}" aria-label="掃碼加入 ${escape(p.name)}">⊞ 掃碼加入</button>` : '';
    const sourceLink = repo ? `<a href="${escape(repo)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(p.name)} GitHub 原始碼">${icon('github')} 原始碼</a>` : '';
    const url = safeUrl(p.url);
    const entrance = url ? `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(p.linkLabel || '開啟')} ${escape(p.name)}">${escape(p.linkLabel || '開啟專案')} <span>↗</span></a>` : '';
    const introduction = p.details
      ? `<button class="project-detail-link" data-project-detail="${escape(p.id)}" aria-haspopup="dialog" aria-controls="project-detail-dialog" aria-label="了解專案 ${escape(p.name)}">了解專案 <span aria-hidden="true">↗</span></button>`
      : `<button class="demo-link" data-demo="${escape(p.id)}">▷ 功能介紹</button>`;
    const status = p.status ? `<span class="project-status">${escape(p.status)}</span>` : '';
    const brand = p.brand ? ` <span class="project-brand">${escape(p.brand)}</span>` : '';
    return `<article class="project-card project-card-wide" data-project="${escape(p.id)}" data-category="${escape(p.category)}"><div class="project-visual ${escape(p.id)}">${projectVisuals[p.id] || ''}</div><div class="project-content"><div class="project-meta"><span>${escape(p.eyebrow)}</span><span>PROJECT / ${escape(p.number)}</span></div>${status}<h3>${escape(p.title)}</h3><p class="project-name">${escape(p.name)}${brand}</p><p class="project-description">${escape(p.description)}</p><div class="tags">${p.tags.map(t => `<span>${escape(t)}</span>`).join('')}</div><div class="project-actions">${entrance}${qrButton}${introduction}${sourceLink}</div><p class="project-access">${escape(p.note)}</p></div></article>`;
  }).join('');
  function renderTools() {
    const tools = Array.isArray(data.tools) ? data.tools : [];
    if (!tools.length) {
      $('#tools-list').innerHTML = `<div class="tools-empty"><span class="tools-empty-icon">${icon('folder')}</span><div><span class="eyebrow">A FEW USEFUL THINGS, COMING SOON.</span><h3>小工具，準備中。</h3><p>正在整理一些讓日常更省力的本機工具。<br>正式上架後，這裡會提供介紹、支援系統與下載。</p></div><span class="outline-label">敬請期待</span></div>`;
      return;
    }
    $('#tools-list').innerHTML = tools.map(t => {
      const file = window.W_STUDIO_DOWNLOADS.resolveDownload(t);
      const demoId = t.demoId || t.id;
      const intro = Object.hasOwn(demos, demoId) ? `<button class="demo-link" data-demo="${escape(demoId)}">${icon('play')} 看介紹</button>` : '';
      const action = file ? `<a class="button button-outline" href="${escape(file.href)}"${file.local ? ` download="${escape(file.fileName)}"` : ' target="_blank" rel="noopener noreferrer"'} aria-label="下載 ${escape(t.title)}：${escape(file.fileName)}">${icon('download')} 下載檔案</a>` : '<span class="download-pending">尚未開放下載</span>';
      return `<article class="tool-row"><span class="tool-icon">${icon(t.icon)}</span><div class="tool-copy"><div class="tool-title-line"><h3>${escape(t.title)}</h3>${t.type ? `<span class="tool-type">${escape(t.type)}</span>` : ''}</div><p>${escape(t.description || '')}</p>${t.requirements ? `<p class="requirements">${escape(t.requirements)}</p>` : ''}${file ? `<p class="tool-file">${escape(file.fileName)}</p>` : ''}</div><div class="tool-actions">${intro}${action}</div></article>`;
    }).join('');
  }
  $('.filter-button[data-filter="all"] span').textContent = String(data.projects.length).padStart(2,'0');
  $$('.filter-button').forEach(button => button.addEventListener('click', () => {
    $$('.filter-button').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', b === button ? 'true' : 'false'); });
    $$('.project-card').forEach(card => card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter);
  }));
  const menu = $('.menu-button');
  function closeMenu() { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', '開啟選單'); $('#mobile-nav').hidden = true; }
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? '關閉選單' : '開啟選單'); $('#mobile-nav').hidden = !open; });
  $$('#mobile-nav a').forEach(a => a.addEventListener('click', closeMenu));
  window.matchMedia('(min-width: 701px)').addEventListener('change', e => { if(e.matches) closeMenu(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });
  const sectionObserver = new IntersectionObserver(entries => { entries.forEach(entry => { if(entry.isIntersecting) $$('.main-nav a').forEach(a => a.classList.toggle('active', a.hash === '#' + entry.target.id)); }); }, {rootMargin:'-10% 0px -65% 0px',threshold:0});
  $$('main section[id]').forEach(s => sectionObserver.observe(s));
  $('#year').textContent = new Date().getFullYear();

  // Custom shortcuts live only on this browser. No backend or external requests.
  const storageKey = 'tung-studio-shortcuts-v1';
  const cloneDefaults = () => data.shortcuts.map(s => ({...s}));
  let shortcuts = cloneDefaults();
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey));
    const legacy = Array.isArray(raw);
    const stored = legacy ? raw : [2,3].includes(raw?.version) && Array.isArray(raw.items) ? raw.items : null;
    if (stored) {
      shortcuts = stored.filter(s => s && s.id !== 'lab' && typeof s.name === 'string' && typeof s.id === 'string' && safeUrl(s.url)).map(s => ({...s, url:safeUrl(s.url)}));
      // Add the new launch entry once, while preserving saved links and removals.
      if (legacy) {
        const astral = data.shortcuts.find(s => s.id === 'astral');
        if (astral && !shortcuts.some(s => s.id === astral.id || s.url === safeUrl(astral.url))) shortcuts.push({...astral});
      }
      // Introduce the two requested LINE entries once; keep removals on later visits.
      if (legacy || raw.version === 2) {
        data.shortcuts.filter(s => ['line-zh-th','line-zh-en-ko'].includes(s.id)).forEach(entry => {
          if (!shortcuts.some(s => s.id === entry.id || s.url === safeUrl(entry.url))) shortcuts.push({...entry});
        });
      }
      // Retired default entries also disappear from previously saved lists.
      if (legacy || raw.version === 2 || shortcuts.length !== stored.length) {
        localStorage.setItem(storageKey, JSON.stringify({version:3, items:shortcuts}));
      }
    }
  } catch { /* Defaults or loaded links remain usable if storage is unavailable. */ }
  let toastTimer;
  function toast(message) { const t=$('#toast'); t.textContent=message; t.classList.add('visible'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('visible'),3500); }
  function saveShortcuts() { try { localStorage.setItem(storageKey,JSON.stringify({version:3, items:shortcuts})); return true; } catch { toast('瀏覽器無法儲存，這次變更僅在目前頁面有效。'); return false; } }
  function renderShortcuts() {
    const term = $('#shortcut-search').value.trim().toLocaleLowerCase();
    const shown = shortcuts.filter(s => [s.name,s.description || '',s.url].join(' ').toLocaleLowerCase().includes(term));
    $('#shortcuts-grid').innerHTML = shown.map(s => `<article class="shortcut"><a href="${escape(safeUrl(s.url))}" target="_blank" rel="noopener noreferrer"><span class="shortcut-icon ${['mint','blue','purple','amber'].includes(s.color)?s.color:'mint'}">${icon(s.icon)}</span><div class="shortcut-text"><h3>${escape(s.name)}</h3><p>${escape(s.description || new URL(s.url).hostname)}</p></div><span class="shortcut-arrow">↗</span></a><button class="remove-shortcut" data-remove="${escape(s.id)}" aria-label="移除 ${escape(s.name)}">${icon('close')}</button></article>`).join('');
    $('#links-empty').hidden = shown.length !== 0;
    $('#links-empty').textContent = shortcuts.length ? '找不到符合的網站，試試其他關鍵字。' : '還沒有網站，點選「新增網站」建立第一個入口。';
    $$('.remove-shortcut').forEach(button => button.addEventListener('click', () => {
      const removed = shortcuts.find(s => s.id === button.dataset.remove); shortcuts = shortcuts.filter(s => s.id !== button.dataset.remove);
      const saved = saveShortcuts(); renderShortcuts(); $('#add-shortcut').focus(); if(saved) toast(`已移除「${removed.name}」`);
    }));
  }
  renderShortcuts();
  $('#shortcut-search').addEventListener('input', renderShortcuts);
  document.addEventListener('keydown', e => { if(e.key === '/' && !e.ctrlKey && !e.metaKey && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName) && !document.activeElement.isContentEditable && !document.querySelector('dialog[open]')) { e.preventDefault(); $('#links').scrollIntoView(); $('#shortcut-search').focus({preventScroll:true}); } });
  $$('dialog').forEach(dialog => { $$('.close-dialog',dialog).forEach(b => b.addEventListener('click',()=>dialog.close())); dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}}); });
  const projectDetailDialog = $('#project-detail-dialog');
  let projectDetailOpener = null, previousBodyOverflow = '';
  $$('[data-project-detail]').forEach(button => button.addEventListener('click', () => {
    const project = data.projects.find(p => p.id === button.dataset.projectDetail);
    if (!project?.details || !projectDetailDialog) return;
    const detail = project.details;
    $('#project-detail-body').innerHTML = `
      <div class="project-detail-intro"><span class="project-status">${escape(project.note)}</span><h2 id="project-detail-title" tabindex="-1">${escape(project.name)} <small>${escape(project.brand)}</small></h2><p id="project-detail-position">${escape(project.position)}</p><p class="project-detail-tagline">${escape(project.title)}</p></div>
      <section class="project-detail-section"><h3>為什麼做這個專案</h3><p>${escape(detail.why)}</p></section>
      <section class="project-detail-section"><h3>希望如何運作</h3><p class="workflow-label">預期工作流程</p><p class="workflow-disclaimer">以下是設計方向，尚未全面實現。</p><ol class="project-workflow">${detail.workflow.map((step,i)=>`<li><span class="workflow-number" aria-hidden="true">0${i+1}</span><span>${escape(step)}</span></li>`).join('')}</ol><p class="workflow-return"><span aria-hidden="true">↶</span> 測試或審查發現問題 → 回到執行修改</p><p>${escape(detail.feedback)}</p></section>
      <section class="project-detail-section"><h3>名稱與生長意象</h3><p>${escape(detail.naming)}</p><dl class="project-growth">${detail.growth.map(([name,meaning])=>`<div><dt>${escape(name)}</dt><dd>${escape(meaning)}</dd></div>`).join('')}</dl><p>${escape(detail.vision)}</p></section>
      <section class="project-detail-section project-progress"><h3>目前進度</h3><p>${escape(detail.progress)}</p></section>`;
    projectDetailOpener = button;
    previousBodyOverflow = document.body.style.overflow;
    projectDetailDialog.showModal();
    document.body.style.overflow = 'hidden';
    projectDetailDialog.scrollTop = 0;
    $('#project-detail-title').focus({preventScroll:true});
  }));
  projectDetailDialog?.addEventListener('close', () => {
    document.body.style.overflow = previousBodyOverflow;
    projectDetailOpener?.focus({preventScroll:true});
    projectDetailOpener = null;
  });
  projectDetailDialog?.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const buttons = $$('button:not([disabled])', projectDetailDialog);
    const first = buttons[0], last = buttons[buttons.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === $('#project-detail-title'))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  $$('[data-qr]').forEach(button => button.addEventListener('click', () => {
    const project = data.projects.find(p => p.id === button.dataset.qr && p.qr);
    if (!project) return;
    $('#line-qr-title').textContent = project.name;
    $('#line-qr-id').textContent = project.lineId;
    $('#line-qr-image').src = project.qr;
    $('#line-qr-image').alt = `${project.name} ${project.lineId} LINE 官方加入好友 QR Code`;
    $('#line-qr-visit').href = safeUrl(project.url);
    $('#line-qr-dialog').showModal();
  }));
  $('#add-shortcut').addEventListener('click',()=>{ $('#shortcut-form').reset(); $('#form-error').textContent=''; $('#shortcut-dialog').showModal(); });
  $('#shortcut-form').addEventListener('submit',e=>{
    e.preventDefault();
    const name=$('#shortcut-name').value.trim(); const url=safeUrl($('#shortcut-url').value.trim());
    if(!name || !url) { $('#form-error').textContent='請填寫網站名稱，並使用 http:// 或 https:// 網址。'; return; }
    if(shortcuts.some(s=>s.url===url)) { $('#form-error').textContent='這個網址已經在你的入口清單裡。'; return; }
    shortcuts.push({id:'custom-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),name,url,description:new URL(url).hostname,icon:'globe',color:'mint'});
    const saved=saveShortcuts(); $('#shortcut-search').value=''; renderShortcuts(); $('#shortcut-dialog').close(); if(saved)toast('已新增網站，下次打開也會保留。');
  });
  $('#reset-shortcuts').addEventListener('click',()=>$('#confirm-dialog').showModal());
  $('#confirm-reset').addEventListener('click',()=>{shortcuts=cloneDefaults();const saved=saveShortcuts();$('#shortcut-search').value='';renderShortcuts();$('#confirm-dialog').close();if(saved)toast('已還原預設網站。');});

  // The walkthroughs are illustrative storyboards, not recordings of the apps.
  const demos = {
    overview: {title:'一個入口，探索我的數位世界。',description:'從作品認識我，再把好用的工具和網站帶進你的日常。',url:data.profile.github,steps:[['探索作品','從需求，走到作品。','從語言學習、LINE 翻譯到星語命盤探索，讓好奇心成為作品。','code',['語言學習與 LINE 翻譯','Astral Notes 星語']],['找到工具','替日常，多省一點力。','本機小工具正在整理中，正式發布後會提供使用說明與檔案下載。','download',['本機小工具','介紹與使用說明']],['建立日常入口','把常用網站放在一起。','新增你常去的網址，用搜尋快速找到下個目的地。','globe',['新增個人常用網站','在此瀏覽器保存']] ]},
    astral: {title:'Astral Notes 星語',description:'西洋占星、紫微斗數與生辰八字，從自己的命盤到兩個人的連結。命理解讀供自我探索參考。',url:data.projects.find(p=>p.id==='astral')?.url,steps:[['建立命盤','從你的出生時刻開始。','選擇出生日期、時間與城市，展開三套本命盤。','spark',['西洋占星 / 紫微斗數 / 八字','出生資料在裝置上計算']],['讀懂星圖','把星象，讀成白話。','從星體位置與命盤解讀，找到自我探索的另一個角度。','book',['白話命盤解讀','每月星象']],['探索連結','看看彼此，如何交會。','切換雙人合盤，探索兩個命盤之間的相位與連結。','globe',['雙人合盤','計算規則可查看']] ]},
    language: {title:'泰語 × 繁體中文學習',description:'選擇你的學習方向，從字母和漢字開始，練習寫、打、說。資源載入與口說功能需要網路。',url:data.projects.find(p=>p.id==='language')?.url,steps:[['選擇方向','สวัสดี，也可以是你好。','用繁體中文學泰語，或用泰語學繁體中文。','language',['中文 → 泰語','泰語 → 繁體中文']],['動手練習','讓學習，留下筆跡。','跟著課程練習字母或漢字，也能試試手寫評分與打字。','pencil',['字母與漢字課程','手寫與打字練習']],['帶進日常','下一句，就用得上。','從旅遊、聊天短語到測驗，累積自己的語言能力。','book',['旅遊與聊天短語','測驗與瀏覽器進度保存']] ]},
    'line-zh-th': {title:'中泰翻譯 LINE 機器人',description:'支援中文和泰文翻譯。以下是使用步驟示意，實際操作請看聊天室內的說明。',url:data.projects.find(p=>p.id==='line-zh-th')?.url,visitLabel:'加入 LINE ↗',steps:[['加入好友','掃碼或點連結，加入機器人。','用手機掃描 QR Code，或點選「加入 LINE」。','chat',['LINE ID：@441rouxg','中文 × 泰文']],['查看說明','使用方式在聊天室裡。','加入好友後，開啟機器人聊天室，查看翻譯功能的操作說明。','language',['中文 / ไทย','依聊天室內的說明操作']],['開始使用','需要翻譯時，打開 LINE。','從 LINE 好友列表找到機器人，就能再次開啟聊天室。','globe',['支援中文、泰文翻譯','W Studio 翻譯系列']] ]},
    'line-zh-en-ko': {title:'中英韓翻譯 LINE 機器人',description:'支援中文、英文和韓文翻譯。以下是使用步驟示意，實際操作請看聊天室內的說明。',url:data.projects.find(p=>p.id==='line-zh-en-ko')?.url,visitLabel:'加入 LINE ↗',steps:[['加入好友','掃碼或點連結，加入機器人。','用手機掃描 QR Code，或點選「加入 LINE」。','chat',['LINE ID：@492xqnyt','中文 × English × 한국어']],['查看說明','使用方式在聊天室裡。','加入好友後，開啟機器人聊天室，查看翻譯功能的操作說明。','language',['中文 / 英文 / 韓文','依聊天室內的說明操作']],['開始使用','需要翻譯時，打開 LINE。','從 LINE 好友列表找到機器人，就能再次開啟聊天室。','globe',['支援中文、英文、韓文翻譯','W Studio 翻譯系列']] ]},
  };
  renderTools();
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionPaused = motionPreference.matches;
  try { const saved = localStorage.getItem('tung-studio-motion'); if(saved !== null) motionPaused = saved === 'paused' || motionPreference.matches; } catch {}
  let demoTimer=null, activeDemo=null, stepIndex=0, demoPlaying=false;
  const demoDialog=$('#demo-dialog');
  function syncMotion() { document.documentElement.classList.toggle('motion-paused',motionPaused); $('#motion-toggle').setAttribute('aria-pressed',String(motionPaused)); $('#motion-toggle').innerHTML=icon(motionPaused?'play':'pause')+(motionPaused?'播放動畫':'暫停動畫'); }
  function stopDemoTimer(){clearInterval(demoTimer);demoTimer=null;}
  function syncDemoControls(){demoDialog.classList.toggle('demo-paused',!demoPlaying);$('#demo-play').innerHTML=icon(demoPlaying?'pause':'play')+(demoPlaying?'暫停':'播放');}
  function showScene(index){
    stepIndex=index;
    const s=activeDemo.steps[index];
    $('#demo-stage').innerHTML=`<div class="scene-board scene-enter"><div class="scene-label">STEP 0${index+1} / 03</div><div class="scene-icon">${icon(s[3])}</div><h3>${escape(s[1])}</h3><p>${escape(s[2])}</p><div class="scene-lines">${s[4].map(line=>`<span>${escape(line)}</span>`).join('')}</div><div class="scene-progress"><i></i></div></div><div class="scene-caption" aria-hidden="true">SMALL STEPS. REAL POSSIBILITIES.</div>`;
    $$('.demo-step').forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-current',i===index?'step':'false');});
  }
  function startDemoTimer(){stopDemoTimer();if(demoPlaying && !document.hidden)demoTimer=setInterval(()=>showScene((stepIndex+1)%3),4000);}
  function openDemo(id){
    activeDemo=demos[id]; if(!activeDemo)return;
    $('#demo-title').textContent=activeDemo.title;$('#demo-description').textContent=activeDemo.description;
    $('#demo-visit').href=safeUrl(activeDemo.url);$('#demo-visit').textContent=activeDemo.visitLabel || (id==='overview'?'看看我的 GitHub ↗':'前往網站 ↗');
    $('#demo-steps').innerHTML=activeDemo.steps.map((s,i)=>`<li><button class="demo-step" data-step="${i}"><span>0${i+1}</span>${escape(s[0])}</button></li>`).join('');
    $$('.demo-step').forEach(b=>b.addEventListener('click',()=>{showScene(Number(b.dataset.step));startDemoTimer();}));
    demoPlaying=!motionPaused;syncDemoControls();showScene(0);demoDialog.showModal();document.body.style.overflow='hidden';startDemoTimer();
  }
  $$('[data-demo]').forEach(b=>b.addEventListener('click',()=>openDemo(b.dataset.demo)));
  $('#demo-play').addEventListener('click',()=>{demoPlaying=!demoPlaying;syncDemoControls();if(demoPlaying){showScene(stepIndex);startDemoTimer();}else stopDemoTimer();});
  demoDialog.addEventListener('close',()=>{stopDemoTimer();demoPlaying=false;document.body.style.overflow='';});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopDemoTimer();else if(demoDialog.open)startDemoTimer();});
  $('#motion-toggle').addEventListener('click',()=>{motionPaused=!motionPaused;try{localStorage.setItem('tung-studio-motion',motionPaused?'paused':'playing');}catch{}syncMotion();});
  motionPreference.addEventListener('change',e=>{motionPaused=e.matches;syncMotion();if(motionPaused&&demoDialog.open){demoPlaying=false;syncDemoControls();stopDemoTimer();}});
  syncMotion();
})();
