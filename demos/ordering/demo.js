(() => {
  'use strict';
  const menu = [
    {id:'rice', name:'時蔬飯碗', category:'main', price:130, description:'米飯搭配時蔬，示範主食品項。', art:'rice'},
    {id:'soup', name:'南瓜濃湯', category:'main', price:90, description:'暖湯搭配麵包，示範套餐品項。', art:'soup'},
    {id:'salad', name:'田園沙拉', category:'side', price:80, description:'季節蔬菜組合，示範小點品項。', art:'salad'},
    {id:'potato', name:'香草烤薯', category:'side', price:65, description:'一份分享小點，示範加購品項。', art:'potato'},
    {id:'tea', name:'冷泡茶', category:'drink', price:45, description:'無糖茶飲，示範飲品品項。', art:'tea'},
    {id:'coffee', name:'燕麥拿鐵', category:'drink', price:75, description:'咖啡搭配燕麥飲，示範飲品品項。', art:'coffee'}
  ];
  const $ = selector => document.querySelector(selector);
  const money = value => 'NT$ ' + value.toLocaleString('zh-TW');
  const cart = new Map();
  let category = 'all', opener = null, submitted = false;
  const announce = message => { $('#announcement').textContent = message; };
  const localDate = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  const today = localDate(new Date());
  $('#date').min = today;
  $('#date').value = today;

  function renderMenu() {
    const term = $('#search').value.trim().toLowerCase();
    const items = menu.filter(item => (category === 'all' || item.category === category) && item.name.toLowerCase().includes(term));
    $('#menu').innerHTML = items.map(item => `<article class="menu-card"><div class="dish-art ${item.art}" aria-hidden="true"></div><div class="dish-copy"><h3>${item.name}</h3><p>${item.description}</p><div class="dish-bottom"><strong class="price">${money(item.price)}</strong><button class="add-button" data-add="${item.id}" aria-label="加入 ${item.name}">＋ 加入</button></div></div></article>`).join('');
    $('#menu-count').textContent = `${items.length} 道示範餐點`;
    $('#empty-search').hidden = items.length > 0;
  }
  function cartEntries() { return menu.filter(item => cart.has(item.id)).map(item => ({...item, quantity:cart.get(item.id)})); }
  function total() { return cartEntries().reduce((sum,item) => sum + item.price*item.quantity,0); }
  function renderCart() {
    const items = cartEntries();
    $('#empty-cart').hidden = items.length > 0;
    $('#cart').innerHTML = items.map(item => `<li><div class="cart-name"><strong>${item.name}</strong><small>${money(item.price*item.quantity)}</small></div><div class="cart-controls"><button data-change="-1" data-id="${item.id}" aria-label="減少 ${item.name} 數量">−</button><span>${item.quantity}</span><button data-change="1" data-id="${item.id}" aria-label="增加 ${item.name} 數量" ${item.quantity>=20?'disabled':''}>＋</button><button class="remove" data-remove="${item.id}" aria-label="移除 ${item.name}">移除</button></div></li>`).join('');
    $('#cart-count').textContent = `${items.reduce((sum,item) => sum + item.quantity,0)} 份`;
    $('#total').textContent = money(total());
    $('#review').disabled = !items.length;
  }
  $('#menu').addEventListener('click', event => {
    const button = event.target.closest('[data-add]');
    if (!button) return;
    const item = menu.find(item => item.id === button.dataset.add);
    const quantity = cart.get(item.id) || 0;
    if (quantity >= 20) { announce('展示版每個品項最多 20 份。'); return; }
    cart.set(item.id,quantity+1); renderCart(); announce(`已加入 ${item.name}，共 ${quantity+1} 份。`);
  });
  $('#cart').addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const id = button.dataset.id || button.dataset.remove;
    const item = menu.find(item => item.id === id);
    const quantity = button.dataset.remove ? 0 : Math.min(20,(cart.get(id) || 0) + Number(button.dataset.change));
    if (quantity <= 0) cart.delete(id); else cart.set(id,quantity);
    renderCart();
    const next = [...$('#cart').querySelectorAll('button')].find(b => b.dataset.id===id && b.dataset.change===button.dataset.change) || $('#cart button') || $('#search');
    next.focus(); announce(`${item.name}：${Math.max(quantity,0)} 份。`);
  });
  $('.filters').addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    category = button.dataset.category;
    document.querySelectorAll('[data-category]').forEach(b => b.setAttribute('aria-pressed',String(b===button)));
    renderMenu();
  });
  $('#search').addEventListener('input',renderMenu);
  $('#order-form').addEventListener('submit',event => {
    event.preventDefault();
    if (!cart.size || !$('#order-form').reportValidity()) return;
    $('#order-summary').textContent = `${$('#order-form input[name="mode"]:checked').value} · ${$('#date').value} ${$('#time').value}`;
    $('#review-items').innerHTML = cartEntries().map(item => `<li><span>${item.name} × ${item.quantity}</span><strong>${money(item.price*item.quantity)}</strong></li>`).join('');
    $('#review-total').textContent = money(total());
    $('#review-content').hidden = false; $('#success-content').hidden = true;
    $('#confirmation-title').textContent = '確認模擬訂單';
    $('#confirmation').setAttribute('aria-labelledby','confirmation-title');
    submitted = false; opener = $('#review');
    $('#confirmation').showModal(); document.body.style.overflow = 'hidden';
  });
  const close = () => $('#confirmation').close();
  $('#close-dialog').addEventListener('click',close);
  $('#back-to-edit').addEventListener('click',close);
  $('#finish').addEventListener('click',close);
  $('#simulate').addEventListener('click',() => {
    submitted = true;
    $('#review-content').hidden = true; $('#success-content').hidden = false;
    $('#success-content h2').id = 'success-title';
    $('#confirmation').setAttribute('aria-labelledby','success-title');
    $('#finish').focus();
  });
  $('#confirmation').addEventListener('close',() => {
    document.body.style.overflow = '';
    if (submitted) { cart.clear(); renderCart(); $('#search').focus(); }
    else opener?.focus();
  });
  $('#confirmation').addEventListener('keydown',event => {
    if (event.key !== 'Tab') return;
    const buttons = [...$('#confirmation').querySelectorAll('button')].filter(button => !button.closest('[hidden]'));
    const first = buttons[0], last = buttons[buttons.length-1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  $('#reset').addEventListener('click',() => {
    cart.clear(); category = 'all'; $('#search').value = ''; $('#order-form').reset(); $('#date').value = localDate(new Date());
    document.querySelectorAll('[data-category]').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.category==='all')));
    renderMenu(); renderCart(); announce('已重設展示，開始新一輪體驗。');
  });
  renderMenu(); renderCart();
})();
