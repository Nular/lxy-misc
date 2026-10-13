function pageSearch() {
  return window.__spaSearch != null ? window.__spaSearch : window.location.search;
}

function goPage(url) {
  if (typeof window.__spaGo === 'function') {
    window.__spaGo(url);
    return;
  }
  window.location.href = url;
}

const CART_STORAGE_KEY = 'kb_sourcing_cart_v2';
const CHECKOUT_LINES_KEY = 'kb_sourcing_checkout_lines';
const LAST_ORDER_TOTAL_KEY = 'kb_sourcing_last_order_total';

function formatBDT(n) {
  return '৳ ' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function summarizeLines(lines) {
  const subtotal = lines.reduce((s, l) => s + (Number(l.originalPrice) || Number(l.price)) * Number(l.qty), 0);
  const sale = lines.reduce((s, l) => s + Number(l.price) * Number(l.qty), 0);
  const promotion = sale - subtotal;
  const shipping = 0;
  return { subtotal, promotion, shipping, grand: subtotal + promotion + shipping };
}

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

function copyText(text) {
  const done = () => showToast('Copied to clipboard');
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      done();
    } catch (err) {
      showToast('Copy failed');
    }
    ta.remove();
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(fallback);
    return;
  }
  fallback();
}

const SUPPORT_CONTACTS = [
  { email: 'sales@kickbazar.com', connect: 'Connect sales', purpose: 'Contact sales / Inquiry' },
  { email: 'orders@kickbazar.com', connect: 'Connect orders', purpose: 'Purchase orders' },
  { email: 'payment@kickbazar.com', connect: 'Connect payment', purpose: 'Payment issues' },
];

function supportModalMarkup() {
  const rows = SUPPORT_CONTACTS.map(item => `
    <div class="support-row">
      <div>
        <div class="support-instruction">${item.connect}: ${item.email}</div>
        <div class="support-purpose">${item.purpose}</div>
      </div>
      <button class="btn btn-secondary" type="button" data-support-copy="${item.email}">Copy</button>
    </div>`).join('');
  return `
    <div class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="supportContactTitle">
      <div class="modal-header">
        <span id="supportContactTitle">Contact support</span>
        <button class="btn btn-ghost" type="button" data-close-support aria-label="Close">✕</button>
      </div>
      <div class="modal-body">
        <p>Copy a contact and reach the right team.</p>
        <div class="support-list">${rows}</div>
      </div>
    </div>`;
}

function bindSupportContact() {
  if (window.__supportBound) return;
  window.__supportBound = true;
  document.addEventListener('click', (e) => {
    if (e.target.closest && e.target.closest('#supportContactBtn')) {
      document.getElementById('supportContactModal')?.classList.add('open');
      return;
    }
    const copyBtn = e.target.closest && e.target.closest('[data-support-copy]');
    if (copyBtn) {
      copyText(copyBtn.getAttribute('data-support-copy'));
      return;
    }
    if (e.target.closest && e.target.closest('[data-close-support]')) {
      document.getElementById('supportContactModal')?.classList.remove('open');
      return;
    }
    const overlay = document.getElementById('supportContactModal');
    if (overlay && e.target === overlay) overlay.classList.remove('open');
  });
}

function initSupportContact() {
  bindSupportContact();
  if (!document.getElementById('supportContactModal')) {
    const modal = document.createElement('div');
    modal.id = 'supportContactModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = supportModalMarkup();
    document.body.appendChild(modal);
  }
  const cart = document.querySelector('.header-tools .cart-link');
  if (!cart || document.getElementById('supportContactBtn')) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'supportContactBtn';
  btn.className = 'icon-btn';
  btn.title = 'Contact support';
  btn.setAttribute('aria-label', 'Contact support');
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="2" y="13" width="5" height="7" rx="1.5"/><rect x="17" y="13" width="5" height="7" rx="1.5"/></svg>';
  cart.before(btn);
}

function readCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(lines) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  updateCartBadges();
}

function cartLineCount(lines) {
  return lines.reduce((sum, l) => sum + (Number(l.qty) || 0), 0);
}

function cartGrandTotal(lines) {
  return lines.reduce((sum, l) => sum + Number(l.price) * Number(l.qty), 0);
}

function updateCartBadges() {
  const n = cartLineCount(readCart());
  document.querySelectorAll('#cartBadgeTop, .cart-badge').forEach(el => {
    el.textContent = String(n);
    el.style.display = n > 0 ? '' : '';
  });
}

const CART_SKU_LIMIT = 99;
const CART_SKU_NEAR = 90;

function demoCartLines() {
  return [
    { lineId: 'KB-DJ-2026-001-M', title: 'Denim Jacket Classic Blue', subtitle: 'Blue / M · KB-DJ-2026-001-M', price: 1250, originalPrice: 1562.5, discountPct: 20, qty: 2, selected: true, status: 'valid', topicTag: 'Brand Zone' },
    { lineId: 'KB-TS-2026-002-L', title: 'Cotton T-Shirt Basic Fit', subtitle: 'White / L · KB-TS-2026-002-L', price: 450, originalPrice: 560, discountPct: 20, qty: 3, selected: true, status: 'valid', topicTag: '' },
    { lineId: 'KB-OLD-009', title: 'Discontinued Belt Classic', subtitle: 'Brown · KB-OLD-009', price: 380, originalPrice: 420, discountPct: 10, qty: 1, selected: false, status: 'invalid', invalidReason: 'Out of stock', topicTag: '' },
  ];
}

function mergeLineIntoCart(line) {
  const cart = readCart();
  const idx = cart.findIndex(l => l.lineId === line.lineId);
  if (idx >= 0) {
    cart[idx].qty = Number(cart[idx].qty) + Number(line.qty);
    cart[idx].status = cart[idx].status || 'valid';
    if (cart[idx].selected == null) cart[idx].selected = true;
  } else {
    const skuCount = cart.length;
    if (skuCount >= CART_SKU_LIMIT) {
      showToast(`Cart limit reached (${CART_SKU_LIMIT} items). Remove an item to add more.`);
      return false;
    }
    cart.push({ ...line, qty: Number(line.qty) || 1, selected: true, status: 'valid' });
  }
  writeCart(cart);
  return true;
}

function setCartLineQty(lineId, qty) {
  const cart = readCart();
  const line = cart.find(l => l.lineId === lineId);
  if (!line) return;
  line.qty = Math.max(1, Number(qty) || 1);
  writeCart(cart);
}

function removeCartLine(lineId) {
  writeCart(readCart().filter(l => l.lineId !== lineId));
}

function readCheckoutLines() {
  try {
    const raw = sessionStorage.getItem(CHECKOUT_LINES_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCheckoutLines(lines) {
  sessionStorage.setItem(CHECKOUT_LINES_KEY, JSON.stringify(lines));
}

function syncCartFromCheckoutLines(lines) {
  const cart = readCart();
  lines.forEach(cl => {
    const row = cart.find(l => l.lineId === cl.lineId);
    if (row) row.qty = cl.qty;
  });
  writeCart(cart);
}

function getProductFromDetailPage() {
  const body = document.body;
  const selectedChips = [...document.querySelectorAll('.sku-chip.selected')];
  const color = selectedChips[0]?.textContent?.trim() || '—';
  const size = selectedChips[1]?.textContent?.trim() || 'M';
  const lineId = body.dataset.productId || 'KB-DJ-2026-001-M';
  const price = Number(body.dataset.productPrice || 1250);
  const original = Number(body.dataset.productOriginal || 0) || null;
  const discountPct = original && original > price ? Math.round((1 - price / original) * 100) : null;
  return {
    lineId,
    title: body.dataset.productTitle || 'Product',
    subtitle: `${color} / ${size} · ${lineId}`,
    price,
    originalPrice: original,
    discountPct,
    qty: 1,
  };
}

function priceCellHtml(line) {
  if (line.originalPrice && line.discountPct) {
    return `<div class="price-row">
      <span class="price-strike">${formatBDT(line.originalPrice)}</span>
      <span class="price-sale">${formatBDT(line.price)}</span>
      <span class="discount-tag">-${line.discountPct}%</span>
    </div>`;
  }
  return `<span>${formatBDT(line.price)}</span>`;
}

function initQtyStepper(container, onChange) {
  const input = container.querySelector('input');
  const minus = container.querySelector('[data-minus]');
  const plus = container.querySelector('[data-plus]');
  const min = Number(input.min || 1);
  const update = () => {
    let v = Number(input.value) || min;
    if (v < min) v = min;
    input.value = v;
    onChange?.(v);
  };
  minus?.addEventListener('click', () => { input.value = Math.max(min, Number(input.value) - 1); update(); });
  plus?.addEventListener('click', () => { input.value = Number(input.value) + 1; update(); });
  input?.addEventListener('change', update);
  return update;
}

function initCartPage() {
  const validHost = document.getElementById('validLines');
  if (!validHost) return;
  const invalidHost = document.getElementById('invalidLines');
  const invalidHeader = document.getElementById('invalidHeader');
  const card = document.getElementById('cartCard');
  const empty = document.getElementById('cartEmpty');
  const stepper = document.getElementById('checkoutStepper');
  const checkoutBtn = document.getElementById('cartCheckoutBtn');
  const editBtn = document.getElementById('editBtn') || document.getElementById('cartEditBtn');
  const banner = document.getElementById('cartLimitBanner');
  const counter = document.getElementById('skuCounter');
  let editMode = false;

  if (new URLSearchParams(pageSearch()).get('demo') === '1' && readCart().length === 0) {
    writeCart(demoCartLines());
  }

  const money = (n) => formatBDT(n);

  const renderLine = (line, host, invalid) => {
    const row = document.createElement('div');
    row.className = 'cart-line' + (invalid ? ' is-invalid' : '');
    const checked = !invalid && line.selected !== false;
    row.innerHTML = `
      <label class="cart-check"><input type="checkbox" data-select ${invalid ? 'disabled' : ''} ${checked ? 'checked' : ''} /></label>
      <div class="cart-thumb"></div>
      <div class="cart-meta">
        <div class="cart-title">${line.title}</div>
        <div class="cart-sub">${line.subtitle || ''}</div>
        ${line.topicTag ? `<span class="discovery-chip" style="position:static">${line.topicTag}</span>` : ''}
        ${invalid ? `<div class="cart-invalid-reason">${line.invalidReason || 'Unavailable'}</div>` : ''}
      </div>
      <div>${priceCellHtml(line)}</div>
      <div>${invalid ? `<span>${line.qty}</span>` : `<div class="qty-stepper"><button type="button" data-minus>−</button><input type="number" value="${line.qty}" min="1" /><button type="button" data-plus>+</button></div>`}</div>
      <div class="cart-line-sub">${money(line.price * line.qty)}</div>
      <button type="button" class="btn btn-ghost" data-remove>Remove</button>`;
    host.appendChild(row);
    row.querySelector('[data-select]')?.addEventListener('change', (e) => {
      const cart = readCart();
      const rowLine = cart.find(l => l.lineId === line.lineId);
      if (rowLine) rowLine.selected = e.target.checked;
      writeCart(cart);
      render();
    });
    row.querySelector('[data-remove]')?.addEventListener('click', () => {
      removeCartLine(line.lineId);
      render();
    });
    const stepperEl = row.querySelector('.qty-stepper');
    if (stepperEl) {
      initQtyStepper(stepperEl, (qty) => {
        setCartLineQty(line.lineId, qty);
        render();
      });
    }
  };

  const render = () => {
    const lines = readCart().map(l => ({ selected: l.selected !== false, status: l.status || 'valid', ...l }));
    const valid = lines.filter(l => l.status !== 'invalid');
    const invalid = lines.filter(l => l.status === 'invalid');
    validHost.innerHTML = '';
    invalidHost.innerHTML = '';
    if (!lines.length) {
      if (card) card.style.display = 'none';
      if (empty) empty.style.display = 'block';
      if (stepper) stepper.style.display = 'none';
      if (banner) banner.style.display = 'none';
      return;
    }
    if (card) card.style.display = 'grid';
    if (empty) empty.style.display = 'none';
    if (stepper) stepper.style.display = '';
    valid.forEach(l => renderLine(l, validHost, false));
    invalid.forEach(l => renderLine(l, invalidHost, true));
    if (invalidHeader) invalidHeader.style.display = invalid.length ? '' : 'none';

    const picked = valid.filter(l => l.selected !== false);
    const summary = summarizeLines(picked);
    const qty = picked.reduce((s, l) => s + Number(l.qty), 0);
    const subEl = document.getElementById('sumSubtotal');
    const promoEl = document.getElementById('sumPromotion');
    const shipEl = document.getElementById('sumShipping');
    const totalEl = document.getElementById('cartGrandTotal');
    if (subEl) subEl.textContent = money(summary.subtotal);
    if (promoEl) promoEl.textContent = money(summary.promotion);
    if (shipEl) shipEl.textContent = 'Free';
    if (totalEl) totalEl.textContent = money(summary.grand);
    if (checkoutBtn) {
      checkoutBtn.textContent = qty > 0 ? `Checkout (${qty})` : 'Checkout (0)';
      checkoutBtn.disabled = qty === 0;
      checkoutBtn.classList.toggle('disabled', qty === 0);
    }
    const all = document.getElementById('selectAllValid');
    if (all) all.checked = valid.length > 0 && valid.every(l => l.selected !== false);
    if (counter) counter.textContent = `${lines.length}/${CART_SKU_LIMIT} items`;
    if (banner) {
      if (lines.length >= CART_SKU_LIMIT) {
        banner.style.display = '';
        banner.textContent = `You've reached the cart limit (${CART_SKU_LIMIT} items). Remove items to add new products.`;
      } else if (lines.length >= CART_SKU_NEAR) {
        banner.style.display = '';
        banner.textContent = `Your cart is almost full (${lines.length}/${CART_SKU_LIMIT} items).`;
      } else if (invalid.length) {
        banner.style.display = '';
        banner.textContent = 'Remove unavailable items to free up space in your cart.';
      } else banner.style.display = 'none';
    }
  };

  document.getElementById('selectAllValid')?.addEventListener('change', (e) => {
    const on = e.target.checked;
    writeCart(readCart().map(l => (l.status === 'invalid' ? { ...l, selected: false } : { ...l, selected: on })));
    render();
  });

  const batchBtn = document.getElementById('openBatchDelete');
  editBtn?.addEventListener('click', () => {
    editMode = !editMode;
    editBtn.textContent = editMode ? 'Done' : 'Edit';
    if (batchBtn) batchBtn.style.display = editMode ? '' : 'none';
    if (editMode) showToast('Remove items you no longer need to free up space.');
  });
  batchBtn?.addEventListener('click', () => document.getElementById('batchDeleteModal')?.classList.add('open'));
  document.querySelectorAll('[data-close-batch]').forEach(btn => {
    btn.addEventListener('click', () => document.getElementById('batchDeleteModal')?.classList.remove('open'));
  });
  document.getElementById('confirmBatchDelete')?.addEventListener('click', () => {
    writeCart(readCart().filter(l => l.status === 'invalid' || l.selected === false));
    document.getElementById('batchDeleteModal')?.classList.remove('open');
    render();
  });

  checkoutBtn?.addEventListener('click', () => {
    const selected = readCart().filter(l => l.status !== 'invalid' && l.selected !== false);
    if (!selected.length) return;
    writeCheckoutLines(selected);
    goPage('checkout.html?from=cart');
  });

  document.getElementById('loadDemoCart')?.addEventListener('click', (e) => {
    e.preventDefault();
    writeCart(demoCartLines());
    showToast('Demo cart loaded.');
    render();
  });

  render();
}

function seedDemoCartIfRequested() {
  if (new URLSearchParams(pageSearch()).get('demo') !== '1') return;
  if (readCart().length > 0) return;
  writeCart(demoCartLines());
}

function resolveCheckoutLinesForPage() {
  seedDemoCartIfRequested();
  const params = new URLSearchParams(pageSearch());
  const from = params.get('from') || 'buynow';
  let lines = readCheckoutLines();

  if (from === 'cart') {
    const selected = readCart().filter(l => l.status !== 'invalid' && l.selected !== false);
    if (selected.length) {
      lines = selected.map(l => ({ ...l }));
      writeCheckoutLines(lines);
    }
  }

  if (!lines || !lines.length) {
    const unitPrice = Number(document.body.dataset.unitPrice || 1250);
    const qty = Number(document.body.dataset.checkoutQty || 1);
    lines = [{
      lineId: 'KB-DJ-2026-001-M',
      title: 'Denim Jacket Classic Blue',
      subtitle: 'Blue / M · KB-DJ-2026-001-M',
      price: unitPrice,
      originalPrice: 1562.5,
      discountPct: 20,
      qty,
    }];
    writeCheckoutLines(lines);
  }

  return lines;
}

function initCheckoutLines() {
  const container = document.getElementById('checkoutLines');
  const totalEl = document.getElementById('grandTotal');
  if (!container) return;

  let lines = resolveCheckoutLinesForPage();
  const from = new URLSearchParams(pageSearch()).get('from') || 'buynow';

  const recalcTotal = () => {
    const summary = summarizeLines(lines);
    const subEl = document.getElementById('checkoutSubtotal');
    const promoEl = document.getElementById('checkoutPromotion');
    const shipEl = document.getElementById('checkoutShipping');
    if (subEl) subEl.textContent = formatBDT(summary.subtotal);
    if (promoEl) promoEl.textContent = formatBDT(summary.promotion);
    if (shipEl) shipEl.textContent = 'Free';
    if (totalEl) totalEl.textContent = formatBDT(summary.grand);
    writeCheckoutLines(lines);
    if (from === 'cart') syncCartFromCheckoutLines(lines);
    sessionStorage.setItem(LAST_ORDER_TOTAL_KEY, String(summary.grand));
  };

  const hint = container.querySelector('p');
  container.innerHTML = '';
  if (hint) container.appendChild(hint);

  lines.forEach(line => {
    const row = document.createElement('div');
    row.className = 'checkout-line';
    row.innerHTML = `
      <div style="width:64px;height:64px;background:var(--surface-2);border-radius:8px;flex-shrink:0"></div>
      <div style="flex:1;min-width:0">
        <div style="font-weight:600;font-size:14px">${line.title}</div>
        <div style="font-size:12px;color:var(--text-secondary);margin:4px 0 8px">${line.subtitle}</div>
        ${priceCellHtml(line)}
      </div>
      <div style="text-align:right">
        <div style="font-size:12px;color:var(--text-secondary);margin-bottom:6px">Qty</div>
        <div class="qty-stepper" data-checkout-line="${line.lineId}">
          <button type="button" data-minus>−</button>
          <input type="number" value="${line.qty}" min="1" />
          <button type="button" data-plus>+</button>
        </div>
        <div style="font-weight:600;font-size:13px;margin-top:8px" data-line-subtotal>${formatBDT(line.price * line.qty)}</div>
      </div>`;
    container.appendChild(row);

    const stepper = row.querySelector('.qty-stepper');
    const subEl = row.querySelector('[data-line-subtotal]');
    initQtyStepper(stepper, (qty) => {
      line.qty = qty;
      if (subEl) subEl.textContent = formatBDT(line.price * qty);
      recalcTotal();
    });
  });

  recalcTotal();

  const successLink = document.querySelector('a[href="order-success.html"]');
  if (successLink) {
    if (from === 'buynow') successLink.setAttribute('href', 'order-success.html?from=buynow');
    successLink.addEventListener('click', () => {
      recalcTotal();
    });
  }
}

function initProductDetailActions() {
  const addBtn = document.getElementById('addToCartBtn');
  addBtn?.addEventListener('click', () => {
    const line = getProductFromDetailPage();
    line.qty = 1;
    if (mergeLineIntoCart(line)) showToast('Added to cart successfully');
  });

  document.getElementById('buyNowBtn')?.addEventListener('click', () => {
    const line = getProductFromDetailPage();
    line.qty = 1;
    writeCheckoutLines([line]);
    goPage('checkout.html?from=buynow');
  });
}

function initOrderSuccessTotal() {
  const el = document.getElementById('successGrandTotal');
  if (!el) return;
  const stored = sessionStorage.getItem(LAST_ORDER_TOTAL_KEY);
  if (stored) el.textContent = formatBDT(Number(stored));
}

function initPaymentMethodToggle() {
  document.querySelectorAll('[data-payment]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('[data-payment]').forEach(x => {
        x.classList.remove('selected');
        x.textContent = x.textContent.replace(/^●/, '○');
      });
      el.classList.add('selected');
      el.textContent = el.textContent.replace(/^○/, '●');
    });
  });
}

function initRemarkModal() {
  const modal = document.getElementById('remarkModal');
  if (!modal) return;
  document.getElementById('openRemark')?.addEventListener('click', () => modal.classList.add('open'));
  document.querySelectorAll('[data-close-remark]').forEach(btn => {
    btn.addEventListener('click', () => modal.classList.remove('open'));
  });
}

function matchesProductTab(filter, publish) {
  if (filter === 'all') return true;
  return publish === filter;
}

function initProductTabs() {
  const grid = document.getElementById('productGrid');
  const empty = document.getElementById('productEmpty');
  if (!grid) return;

  const cards = grid.querySelectorAll('[data-product-card]');

  const applyFilter = (filter) => {
    let visible = 0;
    cards.forEach(card => {
      const show = matchesProductTab(filter, card.dataset.publish);
      card.style.display = show ? '' : 'none';
      if (show) visible += 1;
    });
    if (empty) empty.style.display = visible === 0 ? '' : 'none';
    grid.style.display = visible === 0 ? 'none' : '';
  };

  document.querySelectorAll('[data-product-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-product-tab]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      applyFilter(tab.dataset.productTab);
    });
  });
}

function initOrderDetailPage() {
  const mode = new URLSearchParams(pageSearch()).get('status') === 'completed' ? 'completed' : 'pending';
  const cancelBtn = document.getElementById('openCancelOrder');
  const publishBtn = document.getElementById('publishBtn');
  const warning = document.getElementById('pendingWarning');
  if (!cancelBtn && !publishBtn) return;

  if (mode === 'completed') {
    const orderNo = 'PO202608280088';
    const titleEl = document.getElementById('orderNoTitle');
    const crumbEl = document.getElementById('orderNoBreadcrumb');
    if (titleEl) titleEl.textContent = orderNo;
    if (crumbEl) crumbEl.textContent = orderNo;
    const pill = document.getElementById('orderStatusPill');
    if (pill) {
      pill.textContent = 'Completed';
      pill.className = 'pill pill-published';
    }
    if (warning) warning.style.display = 'none';
    cancelBtn.style.display = 'none';
    if (publishBtn) publishBtn.style.display = '';
    const timeline = document.getElementById('statusTimeline');
    if (timeline) {
      timeline.innerHTML = `
        <div>● Order placed — 2026/08/28 09:15</div>
        <div style="margin-top:6px">● Payment confirmed — 2026/08/28 14:20</div>
        <div style="margin-top:6px">● Completed — 2026/08/30 18:45</div>`;
    }
  }
}

function initCancelOrderModal() {
  const modal = document.getElementById('cancelOrderModal');
  if (!modal) return;

  document.getElementById('openCancelOrder')?.addEventListener('click', () => modal.classList.add('open'));
  document.querySelectorAll('[data-close-cancel-modal]').forEach(btn => {
    btn.addEventListener('click', () => modal.classList.remove('open'));
  });

  document.getElementById('confirmCancelBtn')?.addEventListener('click', () => {
    modal.classList.remove('open');
    showToast('Order cancelled successfully.');
  });
}

function stepperMarkup(labels, activeIndex, opts = {}) {
  const lock = opts === true || opts.lock;
  const cartHref = opts && opts.cartHref;
  const parts = [];
  labels.forEach((label, i) => {
    let cls = 'step';
    const done = lock || i < activeIndex;
    if (done) cls += ' done';
    else if (i === activeIndex) cls += ' active';
    const canBack = !lock && cartHref && i === 0 && done;
    const inner = `<span class="step-num">${i + 1}</span><span>${label}</span>`;
    parts.push(canBack
      ? `<a class="${cls}" href="${cartHref}">${inner}</a>`
      : `<div class="${cls}">${inner}</div>`);
    if (i < labels.length - 1) parts.push('<div class="step-line" aria-hidden="true"></div>');
  });
  const extra = labels.length === 2 ? ' steps-2' : '';
  return `<div class="checkout-stepper${extra}">${parts.join('')}</div>`;
}

function initCheckoutStepper() {
  const mount = document.getElementById('checkoutStepper');
  if (!mount) return;
  const page = mount.dataset.stepPage || 'checkout';
  const from = new URLSearchParams(pageSearch()).get('from') || 'cart';
  const buyNow = from === 'buynow';

  if (page === 'cart') {
    mount.innerHTML = stepperMarkup(['Cart', 'Checkout', 'Order Complete'], 0);
    return;
  }
  if (page === 'checkout') {
    mount.innerHTML = buyNow
      ? stepperMarkup(['Checkout', 'Order Complete'], 0)
      : stepperMarkup(['Cart', 'Checkout', 'Order Complete'], 1, { cartHref: 'cart.html' });
    return;
  }
  if (page === 'success') {
    mount.innerHTML = buyNow
      ? stepperMarkup(['Checkout', 'Order Complete'], 1, { lock: true })
      : stepperMarkup(['Cart', 'Checkout', 'Order Complete'], 2, { lock: true });
  }
}

function initOrderTabs() {
  document.querySelectorAll('[data-po-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-po-tab]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.poTab;
      document.querySelectorAll('[data-po-row]').forEach(row => {
        const status = row.dataset.publish;
        row.style.display = filter === 'all' || status === filter ? '' : 'none';
      });
    });
  });
}

function initRecommendations() {
  document.querySelectorAll('.recommend-scroll').forEach(sc => {
    const heading = sc.previousElementSibling;
    if (heading && /^H[1-3]$/.test(heading.tagName)) heading.textContent = 'Recommended';
    const kids = [...sc.children];
    for (let i = kids.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [kids[i], kids[j]] = [kids[j], kids[i]];
    }
    kids.forEach(node => sc.appendChild(node));
  });
}

function initApp() {
  updateCartBadges();
  initSupportContact();
  initCartPage();
  initCheckoutLines();
  initProductDetailActions();
  initOrderSuccessTotal();
  initPaymentMethodToggle();
  initRemarkModal();
  initProductTabs();
  initCheckoutStepper();
  initRecommendations();
  initOrderDetailPage();
  initCancelOrderModal();
  initOrderTabs();

  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => copyText(btn.dataset.copy));
  });

  document.querySelectorAll('.sku-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const parent = chip.parentElement;
      if (!parent) return;
      parent.querySelectorAll('.sku-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
    });
  });
}

function parseSpaUrl(url) {
  let raw = String(url || 'index.html').trim().replace(/^#/, '');
  if (raw.startsWith('./')) raw = raw.slice(2);
  const hash = raw.indexOf('#');
  if (hash >= 0) raw = raw.slice(0, hash);
  const q = raw.indexOf('?');
  const file = (q >= 0 ? raw.slice(0, q) : raw) || 'index.html';
  const search = q >= 0 ? raw.slice(q) : '';
  return { file, search };
}

function renderSpaPage(file) {
  const root = document.getElementById('app-root');
  if (!root) return false;
  const tpl = document.getElementById('tpl-' + file.replace(/\.html$/i, ''));
  [...document.body.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-')) document.body.removeAttribute(attr.name);
  });
  if (!tpl) {
    document.title = 'Product Sourcing';
    root.innerHTML = '<main class="content"><h1 class="page-title">Page not found</h1><p><a href="index.html">Back to Product Discovery</a></p></main>';
    return true;
  }
  [...tpl.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-') && attr.name !== 'data-title') {
      document.body.setAttribute(attr.name, attr.value);
    }
  });
  const title = tpl.getAttribute('data-title');
  if (title) document.title = title;
  root.replaceChildren(tpl.content.cloneNode(true));
  return true;
}

function installSinglePageApp() {
  if (!document.getElementById('app-root') || window.__spaInstalled) return false;
  window.__spaInstalled = true;

  window.__spaGo = function (url, opts) {
    const { file, search } = parseSpaUrl(url);
    window.__spaSearch = search;
    renderSpaPage(file);
    const next = '#' + file + search;
    let current = '';
    try { current = decodeURIComponent(location.hash || ''); } catch (err) { current = location.hash || ''; }
    if (current !== next) {
      if (opts && opts.replace) history.replaceState({ spa: next }, '', next);
      else history.pushState({ spa: next }, '', next);
    }
    window.scrollTo(0, 0);
    initApp();
  };

  document.addEventListener('click', (e) => {
    if (!window.__spaGo) return;
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || /^(mailto:|https?:|tel:)/i.test(href)) return;
    if (!/(^|\/)[^/?#]+\.html(\?|#|$)/.test(href)) return;
    e.preventDefault();
    window.__spaGo(href);
  });

  window.addEventListener('popstate', () => {
    const current = (location.hash || '').replace(/^#/, '') || 'index.html';
    window.__spaGo(current, { replace: true });
  });

  const initial = (location.hash || '').replace(/^#/, '') || 'index.html';
  window.__spaGo(initial, { replace: true });
  return true;
}

document.addEventListener('DOMContentLoaded', () => {
  if (installSinglePageApp()) return;
  initApp();
});
