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

function initCheckoutSummary() {
  const totalEl = document.getElementById('grandTotal');
  if (!totalEl) return;
  const unitPrice = Number(document.body.dataset.unitPrice || 1250);
  const qty = Number(document.body.dataset.checkoutQty || 1);
  totalEl.textContent = formatBDT(unitPrice * qty);
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
    document.getElementById('orderNoTitle')?.textContent = orderNo;
    document.getElementById('orderNoBreadcrumb')?.textContent = orderNo;
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
  initCheckoutSummary();
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
      document.querySelectorAll('.sku-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
    });
  });

  const modal = document.getElementById('buyNowModal');
  document.getElementById('openBuyNow')?.addEventListener('click', () => modal?.classList.add('open'));
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => modal?.classList.remove('open'));
  });

  const modalQty = document.querySelector('#modalQtyStepper');
  const modalSubtotal = document.getElementById('modalSubtotal');
  if (modalQty && modalSubtotal) {
    initQtyStepper(modalQty, (qty) => {
      modalSubtotal.textContent = formatBDT(1250 * qty);
    });
  }
});
