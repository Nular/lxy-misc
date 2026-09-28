const CART_STORAGE_KEY = 'kb_sourcing_cart_v2';
const CHECKOUT_LINES_KEY = 'kb_sourcing_checkout_lines';
const LAST_ORDER_TOTAL_KEY = 'kb_sourcing_last_order_total';

function formatBDT(n) {
  return '৳ ' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
  navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard'));
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

function mergeLineIntoCart(line) {
  const cart = readCart();
  const idx = cart.findIndex(l => l.lineId === line.lineId);
  if (idx >= 0) {
    cart[idx].qty = Number(cart[idx].qty) + Number(line.qty);
  } else {
    cart.push({ ...line, qty: Number(line.qty) || 1 });
  }
  writeCart(cart);
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
  const tbody = document.getElementById('cartTableBody');
  if (!tbody) return;

  const card = document.getElementById('cartCard');
  const empty = document.getElementById('cartEmpty');
  const totalEl = document.getElementById('cartGrandTotal');
  const checkoutBtn = document.getElementById('cartCheckoutBtn');

  const render = () => {
    const lines = readCart();
    tbody.innerHTML = '';
    if (lines.length === 0) {
      if (card) card.style.display = 'none';
      if (empty) empty.style.display = 'block';
      if (checkoutBtn) checkoutBtn.classList.add('disabled');
      return;
    }
    if (card) card.style.display = 'block';
    if (empty) empty.style.display = 'none';
    if (checkoutBtn) checkoutBtn.classList.remove('disabled');

    lines.forEach(line => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="font-weight:600;font-size:13px">${line.title}</div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:4px">${line.subtitle}</div>
        </td>
        <td>${priceCellHtml(line)}</td>
        <td>
          <div class="qty-stepper" data-line-id="${line.lineId}">
            <button type="button" data-minus>−</button>
            <input type="number" value="${line.qty}" min="1" />
            <button type="button" data-plus>+</button>
          </div>
        </td>
        <td data-subtotal>${formatBDT(line.price * line.qty)}</td>
        <td><button type="button" class="btn btn-ghost" data-remove-line style="height:auto;padding:4px 8px">Remove</button></td>`;
      tbody.appendChild(tr);

      const stepper = tr.querySelector('.qty-stepper');
      const subtotalEl = tr.querySelector('[data-subtotal]');
      initQtyStepper(stepper, (qty) => {
        setCartLineQty(line.lineId, qty);
        const updated = readCart().find(l => l.lineId === line.lineId);
        if (updated) subtotalEl.textContent = formatBDT(updated.price * updated.qty);
        if (totalEl) totalEl.textContent = formatBDT(cartGrandTotal(readCart()));
      });

      tr.querySelector('[data-remove-line]')?.addEventListener('click', () => {
        removeCartLine(line.lineId);
        render();
      });
    });

    if (totalEl) totalEl.textContent = formatBDT(cartGrandTotal(lines));
  };

  document.getElementById('loadDemoCart')?.addEventListener('click', (e) => {
    e.preventDefault();
    writeCart([
      {
        lineId: 'KB-DJ-2026-001-M',
        title: 'Denim Jacket Classic Blue',
        subtitle: 'Blue / M · KB-DJ-2026-001-M',
        price: 1250,
        originalPrice: 1562.5,
        discountPct: 20,
        qty: 2,
      },
      {
        lineId: 'KB-TS-2026-002-L',
        title: 'Cotton T-Shirt Basic Fit',
        subtitle: 'White / L · KB-TS-2026-002-L',
        price: 450,
        originalPrice: null,
        discountPct: null,
        qty: 3,
      },
    ]);
    showToast('Demo cart loaded (2 SKUs).');
    render();
  });

  render();
}

function resolveCheckoutLinesForPage() {
  const params = new URLSearchParams(window.location.search);
  const from = params.get('from') || 'buynow';
  let lines = readCheckoutLines();

  if (from === 'cart') {
    const cart = readCart();
    if (cart.length) {
      lines = cart.map(l => ({ ...l }));
      writeCheckoutLines(lines);
    }
  }

  if (!lines || !lines.length) {
    const unitPrice = Number(document.body.dataset.unitPrice || 1250);
    const qty = Number(document.body.dataset.checkoutQty || 2);
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

  const recalcTotal = () => {
    const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
    if (totalEl) totalEl.textContent = formatBDT(total);
    writeCheckoutLines(lines);
    syncCartFromCheckoutLines(lines);
    sessionStorage.setItem(LAST_ORDER_TOTAL_KEY, String(total));
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

  document.querySelector('a[href="order-success.html"]')?.addEventListener('click', () => {
    recalcTotal();
  });
}

function initProductDetailActions() {
  const addBtn = document.getElementById('addToCartBtn');
  addBtn?.addEventListener('click', () => {
    const line = getProductFromDetailPage();
    line.qty = 1;
    mergeLineIntoCart(line);
    showToast('Added to cart.');
  });

  const modal = document.getElementById('buyNowModal');
  const modalQty = document.querySelector('#modalQtyStepper');
  const modalSubtotal = document.getElementById('modalSubtotal');
  const unitPrice = Number(document.body.dataset.productPrice || 1250);

  if (modalQty && modalSubtotal) {
    initQtyStepper(modalQty, (qty) => {
      modalSubtotal.textContent = formatBDT(unitPrice * qty);
    });
  }

  document.getElementById('openBuyNow')?.addEventListener('click', () => modal?.classList.add('open'));
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => modal?.classList.remove('open'));
  });

  const confirm = document.getElementById('buyNowConfirm');
  confirm?.addEventListener('click', (e) => {
    e.preventDefault();
    const input = modalQty?.querySelector('input');
    const qty = Math.max(1, Number(input?.value) || 1);
    const line = getProductFromDetailPage();
    line.qty = qty;
    writeCheckoutLines([line]);
    modal?.classList.remove('open');
    window.location.href = 'checkout.html?from=buynow';
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
  const mode = new URLSearchParams(window.location.search).get('status') === 'completed' ? 'completed' : 'pending';
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

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadges();
  initCartPage();
  initCheckoutLines();
  initProductDetailActions();
  initOrderSuccessTotal();
  initPaymentMethodToggle();
  initRemarkModal();
  initProductTabs();
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
});
