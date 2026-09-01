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
  const subtotalEl = document.getElementById('subtotal');
  const shippingEl = document.getElementById('shippingFee');
  const codEl = document.getElementById('codFee');
  const totalEl = document.getElementById('grandTotal');
  const unitPrice = Number(document.body.dataset.unitPrice || 1250);
  const qtyInput = document.getElementById('checkoutQty');
  if (!subtotalEl) return;

  const shippingRates = { standard: 50, air_express: 120, air_priority: 200 };
  const codRates = { standard: 10, air_express: 15, air_priority: 20 };
  let method = 'standard';

  const recalc = () => {
    const qty = Number(qtyInput?.value || 1);
    const sub = unitPrice * qty;
    const ship = shippingRates[method];
    const cod = codRates[method];
    const total = sub + ship + cod;
    subtotalEl.textContent = formatBDT(sub);
    shippingEl.textContent = formatBDT(ship);
    codEl.textContent = formatBDT(cod);
    totalEl.textContent = formatBDT(total);
    document.querySelectorAll('.line-subtotal').forEach(el => { el.textContent = formatBDT(sub); });
  };

  document.querySelectorAll('[data-shipping]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('[data-shipping]').forEach(x => x.classList.remove('selected'));
      el.classList.add('selected');
      method = el.dataset.shipping;
      recalc();
    });
  });

  const stepper = document.querySelector('#checkoutQtyStepper');
  if (stepper) initQtyStepper(stepper, recalc);
  recalc();
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
