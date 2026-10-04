(async () => {
  'use strict';
  const defaults = window.SITE_DATA;
  if (!defaults) return;
  let loadedContent;
  try { loadedContent = await window.W_STUDIO_CONTENT_READY; } catch { /* Keep the bundled copy if content cannot load. */ }
  const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const content = isRecord(loadedContent) ? loadedContent : {};
  const contentText = (value, fallback) => typeof value === 'string' && value.trim() ? value : fallback;
  const stringList = (value, fallback, length) => Array.isArray(value) && value.length > 0 &&
    (length === undefined || value.length === length) && value.every(item => typeof item === 'string' && item.trim())
      ? value.slice() : fallback;
  function mergeText(base, edited, fields) {
    const result = {...base};
    if (isRecord(edited)) fields.forEach(key => { result[key] = contentText(edited[key], base[key]); });
    return result;
  }
  // Editable JSON supplies copy, visibility and order. Project identity and technical settings stay in code.
  const projectCopyFields = ['title', 'name', 'eyebrow', 'description', 'note', 'status', 'brand', 'position', 'linkLabel', 'lineId'];
  const data = {...defaults, projects: defaults.projects.map(project => {
    const edited = isRecord(content.projects) && Object.hasOwn(content.projects, project.id) ? content.projects[project.id] : null;
    if (!isRecord(edited)) return project;
    const result = mergeText(project, edited, projectCopyFields);
    result.tags = stringList(edited.tags, project.tags);
    if (isRecord(project.details) && isRecord(edited.details)) {
      const detail = edited.details;
      result.details = mergeText(project.details, detail, ['why', 'feedback', 'naming', 'vision', 'progress']);
      result.details.workflow = stringList(detail.workflow, project.details.workflow);
      result.details.growth = Array.isArray(detail.growth) && detail.growth.length > 0 &&
        detail.growth.every(item => isRecord(item) && contentText(item.name, null) && contentText(item.meaning, null))
          ? detail.growth.map(item => [item.name, item.meaning]) : project.details.growth;
    }
    return result;
  })};
  // Keep the complete project data for dialogs and restoration; select cards separately.
  // CMS omits empty arrays, so the marker distinguishes clearing all cards from legacy data.
  const homeConfig = isRecord(content.home) ? content.home : null;
  const projectOrder = homeConfig?.projectOrder;
  let visibleProjects = homeConfig && homeConfig.projectSelectionConfigured !== true ? data.projects : [];
  if (Array.isArray(projectOrder)) {
    const remaining = new Map(data.projects.map(project => [project.id, project]));
    const ordered = [];
    projectOrder.forEach(item => {
      if (!isRecord(item) || !remaining.has(item.id)) return;
      ordered.push(remaining.get(item.id));
      remaining.delete(item.id);
    });
    visibleProjects = ordered;
  }
  const $ = (s, parent = document) => parent.querySelector(s);
  const $$ = (s, parent = document) => [...parent.querySelectorAll(s)];
  const escape = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = (value) => { try { const u = new URL(value); return ['http:', 'https:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };
  const paths = {
    leaf: '<path d="M20 3C7 3 3 10 5 16c6 2 13-2 15-13ZM4 21 16 9"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5Z"/>',
    people: '<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 4a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 4v3"/>',

    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    github: '<path d="M9 19c-4.3 1.3-4.3-2.5-6-3m12 6v-3.8c0-1 .1-1.6-.5-2.2 3-.3 6.1-1.5 6.1-6.8a5.3 5.3 0 0 0-1.4-3.7A5 5 0 0 0 19 1.9s-1.1-.4-3.8 1.4a13 13 0 0 0-6.8 0C5.7 1.5 4.6 1.9 4.6 1.9a5 5 0 0 0-.2 3.6A5.3 5.3 0 0 0 3 9.2c0 5.3 3.2 6.5 6.2 6.8-.5.5-.7 1.2-.7 2.2V22"/>',
    flask: '<path d="M9 3h6m-5 0v7l-5.6 8.5A2 2 0 0 0 6 22h12a2 2 0 0 0 1.6-3.5L14 10V3M7 16h10"/><path d="m9 19 .01 0m5-1 .01 0"/>',
    language: '<path d="M3 5h12M9 3v2M5 5c0 6 4 10 8 12M13 5c0 6-4 10-9 12m10 4 4-11 4 11m-7-3h6"/>',
    chat: '<path d="M5 3h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-8l-6 4v-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M7 8h10M7 12h7"/>',
    code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    play: '<path d="m8 4 12 8-12 8Z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
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
  // Presentation assets stay separate from CMS copy and technical project identity.
  const atlasAssets = {
    'agent-hub': 'mycelint', astral: 'astral', 'instrument-principles': 'instrument',
    'ordering-demo': 'ordering', language: 'language', 'lab-demo': 'lab'
  };
  const artwork = (id, loading = 'lazy') => `<img class="atlas-cover" src="./assets/atlas/${atlasAssets[id]}.webp" width="1536" height="1024" alt="" loading="${loading}" decoding="async">`;
  const artLabel = (name) => `<div class="atlas-art-label"><span>視覺概念</span><strong>${escape(name)}</strong></div>`;
  const translationVisual = (trilingual) => `<div class="atlas-translation ${trilingual ? 'atlas-trilingual' : ''}" aria-hidden="true"><svg viewBox="0 0 480 320" fill="none"><path d="${trilingual ? 'M240 70Q350 100 365 237Q240 300 114 237Q124 107 240 70Z' : 'M107 158C120 60 355 60 373 158S129 283 107 158Z'}"/><path class="translation-arrow" d="${trilingual ? 'm344 206 21 31-32-2m-207-24-12 26 29-3M263 80l-23-10 6 27' : 'M202 151h78m-9-6 9 6-9 6M280 175h-78m9-6-9 6 9 6'}"/></svg><span class="language-orb orb-chinese" lang="zh-Hant">中</span>${trilingual ? '<span class="language-orb orb-english" lang="en">EN</span><span class="language-orb orb-korean" lang="ko">한</span>' : '<span class="language-orb orb-thai" lang="th">ก</span><span class="translation-greeting greeting-chinese">你好！</span><span class="translation-greeting greeting-thai" lang="th">สวัสดีครับ</span>'}</div>${artLabel(trilingual ? 'CHINESE × ENGLISH × KOREAN' : 'CHINESE × THAI')}`;
  const projectVisuals = Object.fromEntries(Object.keys(atlasAssets).map(id => [id,
    artwork(id) + artLabel(id === 'agent-hub' ? 'MYCELINT' : id === 'astral' ? 'ASTRAL NOTES' : data.projects.find(p => p.id === id)?.eyebrow || '')
  ]));
  projectVisuals['line-zh-th'] = translationVisual(false);
  projectVisuals['line-zh-en-ko'] = translationVisual(true);
  projectVisuals.language = artwork('language') + '<div class="atlas-notebook-copy" aria-hidden="true"><span lang="th">สวัสดี</span><small>你好</small></div>' + artLabel('LANGUAGE & EXPLORATION');
  projectVisuals['ordering-demo'] = artwork('ordering-demo') + '<span class="atlas-menu-title" aria-hidden="true">MENU</span>' + artLabel('ORDERING SYSTEM / DEMO');
  // Hidden projects keep no named feature in the decorative atlas.
  $$('[data-atlas-name]').forEach(label => {
    const project = visibleProjects.find(p => p.id === label.dataset.atlasName);
    if (project) label.textContent = project.name;
  });
  $$('[data-atlas-state]').forEach(label => {
    const project = visibleProjects.find(p => p.id === label.dataset.atlasState);
    label.textContent = project?.status || '';
  });
  $('#project-grid').innerHTML = visibleProjects.map(p => {
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
    return `<article class="project-card project-card-wide" data-project="${escape(p.id)}" data-category="${escape(p.category)}"><div class="project-visual atlas-visual ${escape(p.id)}">${projectVisuals[p.id] || ''}</div><div class="project-content"><div class="project-meta"><span>${escape(p.eyebrow)}</span><span class="project-number">PROJECT / ${escape(p.number)}</span>${status}</div><h3>${escape(p.title)}</h3><p class="project-name">${escape(p.name)}${brand}</p><p class="project-description">${escape(p.description)}</p><div class="tags">${p.tags.map(t => `<span>${escape(t)}</span>`).join('')}</div><div class="project-actions">${entrance}${qrButton}${introduction}${sourceLink}</div><p class="project-access">${escape(p.note)}</p></div></article>`;
  }).join('');
  function renderTools() {
    const tools = Array.isArray(data.tools) ? data.tools : [];
    if (!tools.length) {
      const emptyCopy = isRecord(content.home) && isRecord(content.home.tools) ? content.home.tools : {};
      const emptyText = (key, fallback) => escape(contentText(emptyCopy[key], fallback));
      $('#tools-list').innerHTML = `<div class="tools-empty"><span class="tools-empty-icon">${icon('folder')}</span><div><span class="eyebrow">${emptyText('emptyEyebrow', 'A FEW USEFUL THINGS, COMING SOON.')}</span><h3>${emptyText('emptyTitle', '小工具，準備中。')}</h3><p>${emptyText('emptyDescriptionLine1', '正在整理一些讓日常更省力的本機工具。')}<br>${emptyText('emptyDescriptionLine2', '正式上架後，這裡會提供介紹、支援系統與下載。')}</p></div><span class="outline-label">${emptyText('emptyBadge', '敬請期待')}</span></div>`;
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
  $('.filter-button[data-filter="all"] span').textContent = String(visibleProjects.length).padStart(2,'0');
  function updateProjectEmptyState(filter = 'all') {
    const emptyState = $('#project-empty');
    emptyState.hidden = visibleProjects.some(project => filter === 'all' || project.category === filter);
    emptyState.textContent = !homeConfig ? '專案清單暫時無法載入，請重新整理頁面。'
      : filter === 'all' ? '目前沒有公開展示的專案。' : '這個分類目前沒有展示的專案。';
  }
  updateProjectEmptyState();
  $$('.filter-button').forEach(button => button.addEventListener('click', () => {
    $$('.filter-button').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', b === button ? 'true' : 'false'); });
    $$('.project-card').forEach(card => card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter);
    updateProjectEmptyState(button.dataset.filter);
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

  $$('dialog').forEach(dialog => { $$('.close-dialog',dialog).forEach(b => b.addEventListener('click',()=>dialog.close())); dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}}); });
  const projectDetailDialog = $('#project-detail-dialog');
  let projectDetailOpener = null, previousBodyOverflow = '';
  $$('[data-project-detail]').forEach(button => button.addEventListener('click', () => {
    const project = data.projects.find(p => p.id === button.dataset.projectDetail);
    if (!project?.details || !projectDetailDialog) return;
    const detail = project.details;
    $('#project-detail-body').innerHTML = `
      <div class="project-detail-intro"><div class="project-detail-art">${artwork(project.id)}</div><div class="project-detail-intro-copy"><span class="project-status">${escape(project.note)}</span><h2 id="project-detail-title" tabindex="-1">${escape(project.name)} <small>${escape(project.brand)}</small></h2><p id="project-detail-position">${escape(project.position)}</p><p class="project-detail-tagline">${escape(project.title)}</p></div></div>
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
  // The walkthroughs are illustrative storyboards, not recordings of the apps.
  const demos = {
    'instrument-principles': {"title":"儀器原理互動教室","description":"用 3D 動畫與互動操作理解分析儀器，從構造、樣品路徑走到訊號。","visitLabel":"探索儀器 ↗","steps":[["選擇儀器","從你想弄懂的儀器開始。","離子阱質譜、GC-MS 與 UV-Vis 分光光度計教材已開放。","flask",["離子阱質譜 / GC-MS","UV-Vis 分光光度計"]],["跟著導覽","沿著樣品的路徑走一趟。","用分章動畫或導覽認識部件，理解分離、離子導引與偵測的過程。","globe",["3D 儀器構造","繁體中文解說"]],["親手操作","調整參數，觀察圖譜變化。","試著調整射頻振幅、升溫速率或光譜頻寬，把畫面變化與分析原理連起來。","check",["射頻振幅與離子排出","升溫速率、光譜頻寬與圖譜"]]],"url":"https://tung-beauregard.github.io/instrument-principles/"},
    'ordering-demo': {title:'點餐系統 Demo',description:'用虛構菜單體驗選餐與確認流程。沒有付款、店家通知或真實訂單。',url:data.projects.find(p=>p.id==='ordering-demo')?.url,visitLabel:'開啟 Demo ↗',steps:[['挑選餐點','看看菜單，加入想試的餐點。','依主食、小點和飲品篩選，也能直接搜尋名稱。','book',['菜單分類與搜尋','示範餐點與價格']],['調整內容','調整份數，選擇預約時段。','購物車會更新合計金額；可選內用或外帶，指定日期和時段。','check',['購物車增減與合計','用餐方式與預約時段']],['確認結果','確認內容，試試模擬送出。','檢查餐點與預約資訊，再查看完成畫面。整個流程只在目前頁面執行。','globe',['不需姓名、電話或付款資料','不成立訂單，也不保留名額']]]},

    'lab-demo': {title:'實驗室管理 Demo',description:'使用虛構資料體驗管理功能。修改只保存在目前瀏覽器，可隨時重設。',url:data.projects.find(p=>p.id==='lab-demo')?.url,visitLabel:'開啟 Demo ↗',steps:[['查庫存','查詢物品，再試試登記領用。','搜尋藥品、試材與樣品，篩選低庫存項目，查看模擬領用紀錄。','flask',['物品搜尋與低庫存篩選','模擬領用與紀錄']],['排預約','選一台儀器，安排使用時段。','新增或取消展示預約，重疊時段會提醒衝突；圖書也能模擬借還。','book',['儀器預約與時段檢查','圖書借閱與歸還']],['管待辦','把待辦和值週項目逐一完成。','勾選待辦、更新值週清單，也能查看採買與報修進度。','check',['待辦、值週與採買報修','可重設全部展示資料']]]},

    overview: {title:'W AI Studio 專案與工具',description:'這裡整理我的開發專案、使用連結與本機小工具。',url:data.profile.github,steps:[['查看專案','看看我做了哪些東西。','依分類瀏覽儀器原理、語言學習、LINE 翻譯、星語、系統 Demo 與研發中的 Mycelint。','code',['專案介紹與使用連結','研發中的專案會標示狀態']],['找到工具','需要的小工具，在這裡下載。','本機小工具正在整理中，正式發布後會提供使用說明與檔案下載。','download',['本機小工具','介紹與使用說明']],['查看 GitHub','專案文件和程式碼，放在 GitHub。','點選 GitHub 連結，查看我公開的儲存庫與開發紀錄。','github',['公開儲存庫','專案文件與開發紀錄']] ]},
    astral: {title:'Astral Notes 星語',description:'西洋占星、紫微斗數與生辰八字，從自己的命盤到兩個人的連結。命理解讀供自我探索參考。',url:data.projects.find(p=>p.id==='astral')?.url,steps:[['建立命盤','從你的出生時刻開始。','選擇出生日期、時間與城市，展開三套本命盤。','spark',['西洋占星 / 紫微斗數 / 八字','出生資料在裝置上計算']],['讀懂星圖','把星象，讀成白話。','從星體位置與命盤解讀，找到自我探索的另一個角度。','book',['白話命盤解讀','每月星象']],['探索連結','看看彼此，如何交會。','切換雙人合盤，探索兩個命盤之間的相位與連結。','globe',['雙人合盤','計算規則可查看']] ]},
    language: {title:'泰語 × 繁體中文學習',description:'選擇你的學習方向，從字母和漢字開始，練習寫、打、說。資源載入與口說功能需要網路。',url:data.projects.find(p=>p.id==='language')?.url,steps:[['選擇方向','สวัสดี，也可以是你好。','用繁體中文學泰語，或用泰語學繁體中文。','language',['中文 → 泰語','泰語 → 繁體中文']],['動手練習','讓學習，留下筆跡。','跟著課程練習字母或漢字，也能試試手寫評分與打字。','pencil',['字母與漢字課程','手寫與打字練習']],['帶進日常','下一句，就用得上。','從旅遊、聊天短語到測驗，累積自己的語言能力。','book',['旅遊與聊天短語','測驗與瀏覽器進度保存']] ]},
    'line-zh-th': {title:'中泰翻譯 LINE 機器人',description:'支援中文和泰文翻譯。以下是使用步驟示意，實際操作請看聊天室內的說明。',url:data.projects.find(p=>p.id==='line-zh-th')?.url,visitLabel:'加入 LINE ↗',steps:[['加入好友','掃碼或點連結，加入機器人。','用手機掃描 QR Code，或點選「加入 LINE」。','chat',['LINE ID：@441rouxg','中文 × 泰文']],['查看說明','使用方式在聊天室裡。','加入好友後，開啟機器人聊天室，查看翻譯功能的操作說明。','language',['中文 / ไทย','依聊天室內的說明操作']],['開始使用','需要翻譯時，打開 LINE。','從 LINE 好友列表找到機器人，就能再次開啟聊天室。','globe',['支援中文、泰文翻譯','W AI Studio 翻譯系列']] ]},
    'line-zh-en-ko': {title:'中英韓翻譯 LINE 機器人',description:'支援中文、英文和韓文翻譯。以下是使用步驟示意，實際操作請看聊天室內的說明。',url:data.projects.find(p=>p.id==='line-zh-en-ko')?.url,visitLabel:'加入 LINE ↗',steps:[['加入好友','掃碼或點連結，加入機器人。','用手機掃描 QR Code，或點選「加入 LINE」。','chat',['LINE ID：@492xqnyt','中文 × English × 한국어']],['查看說明','使用方式在聊天室裡。','加入好友後，開啟機器人聊天室，查看翻譯功能的操作說明。','language',['中文 / 英文 / 韓文','依聊天室內的說明操作']],['開始使用','需要翻譯時，打開 LINE。','從 LINE 好友列表找到機器人，就能再次開啟聊天室。','globe',['支援中文、英文、韓文翻譯','W AI Studio 翻譯系列']] ]},
  };
  Object.entries(demos).forEach(([id, demo]) => {
    const edited = isRecord(content.introductions) && Object.hasOwn(content.introductions, id) ? content.introductions[id] : null;
    if (!isRecord(edited)) return;
    const result = mergeText(demo, edited, ['title', 'description', 'visitLabel']);
    // Each existing storyboard has exactly three steps and two bullet points per step.
    if (Array.isArray(edited.steps) && edited.steps.length === 3 && edited.steps.every(isRecord)) {
      result.steps = demo.steps.map((step, index) => {
        const copy = edited.steps[index];
        return [contentText(copy.label, step[0]), contentText(copy.title, step[1]),
          contentText(copy.description, step[2]), step[3], stringList(copy.bullets, step[4], 2)];
      });
    }
    demos[id] = result;
  });
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
