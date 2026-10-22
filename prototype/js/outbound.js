// Outbound — Regular (occupy → pack/tracking → deduct) + Special (direct deduct). PRD: KickBazar-WMS-Outbound-PRD.md

const OB_STATUS = {
  pending_allocation: { label: 'Pending Allocation', cls: 'tag-cold' },
  pending_picking: { label: 'Pending Picking', cls: 'tag-sto' },
  shipped: { label: 'Shipped', cls: 'tag-enable' }
};

const OB_LIST_TABS = [
  { key: 'pending_allocation', label: 'Pending Allocation' },
  { key: 'pending_picking', label: 'Pending Picking' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'all', label: 'All' }
];

const OB_TABS = ['all', 'pending_allocation', 'pending_picking', 'shipped'];
let outboundListTab = 'pending_allocation';

let outboundBatches = [];
let outboundLines = [];
let obSeq = { OB: 1, SHP: 1, SX: 1 };
let currentOutboundNo = null;
let currentObTab = 'all';
let obOrderCsv = '';
let obTrackCsv = '';

function ymd(date) {
  const d = date || new Date();
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

function nextDocNo(prefix, warehouseId) {
  const code = formatCanonicalWarehouseCode(warehouseId);
  const n = String(obSeq[prefix]++).padStart(4, '0');
  return `${prefix}${code}${ymd()}${n}`;
}

function storageSku(warehouseId, skuId) {
  const code = formatCanonicalWarehouseCode(warehouseId);
  return skuData.find(s => formatCanonicalWarehouseCode(skuWarehouseId(s)) === code && /STO|Storage/i.test(s.zone + s.zoneCode));
}

function batchStatus(lines) {
  if (!lines.length) return 'Pending Outbound';
  const shipped = lines.filter(l => l.status === 'shipped').length;
  const open = lines.filter(l => normalizeObStatus(l.status) !== 'shipped').length;
  if (shipped === lines.length) return 'Fully Outbound';
  if (shipped > 0 && open > 0) return 'Partially Outbound';
  return 'Pending Outbound';
}

function pickListBarcode(skuId) {
  const s = skuData.find(x => x.skuId === skuId);
  const list = (s && s.barcodes) || [];
  const ean = list.find(x => String(x).startsWith('EAN'));
  if (ean) return ean;
  const upc = list.find(x => String(x).startsWith('UPC'));
  if (upc) return upc;
  return '—';
}

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function batchTag(status) {
  if (status === 'Fully Outbound') return '<span class="tag tag-enable">Fully Outbound</span>';
  if (status === 'Partially Outbound') return '<span class="tag tag-cold">Partially Outbound</span>';
  return '<span class="tag tag-sto">Pending Outbound</span>';
}

function lineTag(status) {
  const key = normalizeObStatus(status);
  const meta = OB_STATUS[key] || OB_STATUS[status] || { label: status, cls: 'tag-normal' };
  return `<span class="tag ${meta.cls}">${meta.label}</span>`;
}

function seedOutbound() {
  const wh = 'SH-001';
  const no = nextDocNo('OB', wh);
  outboundBatches.push({
    outboundNo: no,
    importedAt: '2026-08-21 09:10:00',
    sourceFile: 'pending-orders-0821.csv',
    warehouseId: wh,
    warehouseCode: formatCanonicalWarehouseCode(wh)
  });
  const samples = [
    { orderNo: 'SO-20260821001', skuId: 'SKU-10001-BK', name: 'Wireless Bluetooth Earbuds Pro', spec: 'Black; M', qty: 2, status: 'pending_allocation' },
    { orderNo: 'SO-20260821002', skuId: 'SKU-10001-WH', name: 'Wireless Bluetooth Earbuds Pro', spec: 'White; L', qty: 1, status: 'pending_picking', preOccupy: true },
    { orderNo: 'SO-20260821003', skuId: 'SKU-10004-01', name: 'USB-C Flash Drive', spec: '128GB', qty: 2, status: 'pending_allocation', holdReason: 'Awaiting allocation (0 available in STO)' }
  ];
  samples.forEach(s => {
    const line = {
      id: 'L' + (outboundLines.length + 1),
      outboundNo: no,
      orderNo: s.orderNo,
      orderTime: '2026-08-21 08:40:00',
      skuId: s.skuId,
      productName: s.name,
      spec: s.spec,
      qty: s.qty,
      warehouseId: wh,
      zoneCode: '—',
      zone: '—',
      shipmentNo: '—',
      trackingNo: '—',
      status: s.status,
      holdReason: s.holdReason || ''
    };
    if (s.preOccupy) {
      line.zoneCode = 'SH001STO';
      line.zone = 'Storage Zone';
      occupySku(wh, s.skuId, s.qty, no, s.orderNo);
    }
    outboundLines.push(line);
  });
}

function occupySku(warehouseId, skuId, qty, outboundNo, orderNo) {
  const sku = storageSku(warehouseId, skuId);
  if (!sku || sku.available < qty) return false;
  sku.locked += qty;
  sku.available = sku.total - sku.locked;
  recordData.occupy.unshift({
    time: new Date().toISOString().slice(0, 19).replace('T', ' '),
    warehouse: formatCanonicalWarehouseCode(warehouseId),
    zone: `${formatCanonicalWarehouseCode(warehouseId)}STO (Storage)`,
    sku: skuId,
    qty: String(qty),
    after: { total: sku.total, locked: sku.locked, available: sku.available },
    type: 'Outbound Occupy',
    order: outboundNo,
    operator: 'System',
    outboundNo,
    relatedOrderNo: orderNo,
    shipmentNo: '—',
    status: 'Pending Picking'
  });
  return true;
}

function deductSku(line) {
  const sku = storageSku(line.warehouseId, line.skuId);
  if (!sku) return false;
  if (line.outboundType === 'special') {
    if (sku.available < line.qty) return false;
    sku.total -= line.qty;
    sku.available = sku.total - sku.locked;
    recordData.deduct.unshift({
      time: new Date().toISOString().slice(0, 19).replace('T', ' '),
      warehouse: formatCanonicalWarehouseCode(line.warehouseId),
      zone: `${line.zoneCode} (${line.zone})`,
      sku: line.skuId,
      qty: '-' + line.qty,
      after: { total: sku.total, locked: sku.locked, available: sku.available },
      type: 'Outbound Deduct',
      order: line.outboundNo,
      operator: 'Warehouse',
      outboundNo: line.outboundNo,
      relatedOrderNo: '—',
      shipmentNo: '—',
      status: 'Special',
      specialReason: line.specialReason || ''
    });
    return true;
  }
  if (sku.locked < line.qty) return false;
  sku.locked -= line.qty;
  sku.total -= line.qty;
  sku.available = sku.total - sku.locked;
  recordData.deduct.unshift({
    time: new Date().toISOString().slice(0, 19).replace('T', ' '),
    warehouse: formatCanonicalWarehouseCode(line.warehouseId),
    zone: `${line.zoneCode} (${line.zone})`,
    sku: line.skuId,
    qty: '-' + line.qty,
    after: { total: sku.total, locked: sku.locked, available: sku.available },
    type: 'Outbound Deduct',
    order: line.outboundNo,
    operator: 'Warehouse',
    outboundNo: line.outboundNo,
    relatedOrderNo: line.orderNo,
    shipmentNo: line.shipmentNo,
    status: 'Shipped'
  });
  return true;
}

function refreshAfterInventoryChange() {
  renderSkuTable();
  renderRecords();
  if (document.getElementById('page-home').classList.contains('active')) renderHome();
}

function normalizeObStatus(status) {
  if (status === 'allocated' || status === 'ready_to_pick' || status === 'ready_to_pack' || status === 'ready_to_ship') return 'pending_picking';
  if (status === 'on_hold') return 'pending_allocation';
  return status;
}

function scopedOutboundLines() {
  const scope = getWarehouseScope();
  return outboundLines.filter(l => scope === 'all' || l.warehouseId === scope);
}

function countLinesByTab(tab) {
  const lines = scopedOutboundLines();
  if (tab === 'all') return lines.length;
  return lines.filter(l => normalizeObStatus(l.status) === tab).length;
}

function renderOutboundOrderList() {
  const tabsEl = document.getElementById('ob-list-tabs');
  const body = document.getElementById('ob-order-list-body');
  if (!tabsEl || !body) return;
  tabsEl.innerHTML = OB_LIST_TABS.map(t => {
    const n = countLinesByTab(t.key);
    const active = outboundListTab === t.key ? 'active' : '';
    return `<button type="button" class="ob-status-tab ${active}" role="tab" onclick="setOutboundListTab('${t.key}')">${t.label} (${n})</button>`;
  }).join('');
  const hint = document.getElementById('ob-import-scope-hint');
  const scope = getWarehouseScope();
  if (hint) {
    hint.textContent = scope === 'all'
      ? 'Warehouse context: All. Import dialog will ask for a warehouse.'
      : `Warehouse context: ${getWarehouseScopeLabel()}.`;
  }
  const allocBtn = document.getElementById('ob-btn-allocate');
  if (allocBtn) allocBtn.style.display = outboundListTab === 'pending_allocation' ? '' : 'none';
  const orderKw = (document.getElementById('ob-filter-order')?.value || '').trim().toLowerCase();
  const skuKw = (document.getElementById('ob-filter-sku')?.value || '').trim().toLowerCase();
  const trackKw = (document.getElementById('ob-filter-tracking')?.value || '').trim().toLowerCase();
  let lines = scopedOutboundLines();
  if (outboundListTab !== 'all') lines = lines.filter(l => normalizeObStatus(l.status) === outboundListTab);
  if (orderKw) lines = lines.filter(l => l.orderNo.toLowerCase().includes(orderKw));
  if (skuKw) lines = lines.filter(l => l.skuId.toLowerCase().includes(skuKw));
  if (trackKw) lines = lines.filter(l => (l.trackingNo || '').toLowerCase().includes(trackKw));
  body.innerHTML = lines.map(l => {
    const st = normalizeObStatus(l.status);
    const productCell = `<div class="ob-product-cell"><strong>${l.productName}</strong><span class="hint">${l.skuId} · ${l.spec} · Qty ${l.qty}</span>${l.holdReason ? `<span class="ob-hold-hint">${l.holdReason}</span>` : ''}</div>`;
    return `<tr>
      <td><input type="checkbox" class="ob-line-check" value="${l.id}"></td>
      <td>${productCell}</td>
      <td><a class="btn-link" onclick="openOutboundDetail('${l.outboundNo}')">${l.orderNo}</a><div class="hint">${l.outboundNo}</div></td>
      <td>${formatCanonicalWarehouseCode(l.warehouseId)}</td>
      <td>${l.trackingNo === '—' ? '—' : l.trackingNo}</td>
      <td>${l.orderTime || '—'}</td>
      <td>${lineTag(l.status)}</td>
      <td>${listRowAction(l, st)}</td>
    </tr>`;
  }).join('') || '<tr><td colspan="8" class="ob-empty">No orders in this status.</td></tr>';
}

function setOutboundListTab(tab) {
  outboundListTab = tab;
  renderOutboundOrderList();
}

function resetOutboundListFilters() {
  ['ob-filter-order', 'ob-filter-sku', 'ob-filter-tracking'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  renderOutboundOrderList();
}

function toggleOutboundListChecks(on) {
  document.querySelectorAll('#ob-order-list-body .ob-line-check').forEach(el => { el.checked = on; });
}

function listRowAction(l, st) {
  if (st === 'pending_allocation') {
    return `<a class="btn-link" onclick="confirmAllocationLine('${l.id}')">Allocate</a>`;
  }
  if (st === 'pending_picking') {
    return `<a class="btn-link" onclick="openPackTrackingModal('${l.id}')">Pack &amp; Ship</a>`;
  }
  return `<a class="btn-link" onclick="viewOutboundLine('${l.id}')">View</a>`;
}

function renderOutboundBatches() { renderOutboundOrderList(); }
function searchOutboundBatches() { renderOutboundOrderList(); }
function resetOutboundBatchFilters() { resetOutboundListFilters(); }

function openOutboundDetail(no) {
  currentOutboundNo = no;
  currentObTab = 'all';
  navigateTo('outbound-detail');
  renderOutboundDetail();
}

function renderOutboundDetail() {
  const batch = outboundBatches.find(b => b.outboundNo === currentOutboundNo);
  const lines = outboundLines.filter(l => l.outboundNo === currentOutboundNo);
  document.getElementById('ob-detail-title').textContent = currentOutboundNo || 'Outbound Detail';
  document.getElementById('ob-detail-sub').textContent = batch
    ? `${batch.warehouseCode} · ${batchStatus(lines)} · ${lines.length} lines`
    : '';
  document.getElementById('ob-line-tabs').innerHTML = OB_TABS.map(tab => {
    const count = tab === 'all' ? lines.length : lines.filter(l => normalizeObStatus(l.status) === tab).length;
    const label = tab === 'all' ? 'All' : OB_STATUS[tab].label;
    return `<div class="tab ${tab === currentObTab ? 'active' : ''}" onclick="setOutboundTab('${tab}')">${label} (${count})</div>`;
  }).join('');
  const visible = currentObTab === 'all'
    ? lines
    : lines.filter(l => normalizeObStatus(l.status) === currentObTab);
  document.getElementById('ob-detail-actions').innerHTML = detailActions(currentObTab);
  document.getElementById('ob-line-body').innerHTML = visible.map(l => `
    <tr>
      <td><input type="checkbox" class="ob-line-check" value="${l.id}"></td>
      <td>${l.outboundNo}</td>
      <td>${l.orderNo}</td>
      <td>${l.orderTime}</td>
      <td title="${l.skuId}">${l.productName}</td>
      <td>${l.spec}</td>
      <td>${l.qty}</td>
      <td>${l.zoneCode}</td>
      <td>${l.shipmentNo}</td>
      <td>${l.trackingNo}</td>
      <td>${lineTag(l.status)}</td>
      <td>${lineAction(l)}</td>
    </tr>
  `).join('') || '<tr><td colspan="12" style="text-align:center;color:#999">No lines in this tab</td></tr>';
}

function setOutboundTab(tab) {
  currentObTab = tab;
  renderOutboundDetail();
}

function detailActions(tab) {
  if (tab === 'pending_allocation') {
    return `<span class="hint">Select lines and confirm allocation to lock stock (Outbound Occupy).</span><button class="btn btn-primary" onclick="confirmAllocationBatch()">Confirm Allocation</button>`;
  }
  if (tab === 'pending_picking') {
    return `<span class="hint">Pack and enter tracking to ship (Outbound Deduct).</span><button class="btn btn-primary" onclick="openPackTrackingModal()">Pack &amp; Ship</button>`;
  }
  return '';
}

function lineAction(l) {
  const st = normalizeObStatus(l.status);
  if (st === 'pending_allocation') return `<a class="btn-link" onclick="confirmAllocationLine('${l.id}')">Allocate</a>`;
  if (st === 'pending_picking') return `<a class="btn-link" onclick="openPackTrackingModal('${l.id}')">Pack &amp; Ship</a>`;
  if (st === 'shipped') return `<a class="btn-link" onclick="viewOutboundLine('${l.id}')">View</a>`;
  return `<a class="btn-link" onclick="viewOutboundLine('${l.id}')">View</a>`;
}

function selectedLineIds() {
  return [...document.querySelectorAll('.ob-line-check:checked, .ob-hold-check:checked')].map(el => el.value);
}

function toggleOutboundChecks(on) {
  document.querySelectorAll('.ob-line-check').forEach(el => { el.checked = on; });
}
function toggleHoldChecks(on) {
  document.querySelectorAll('.ob-hold-check').forEach(el => { el.checked = on; });
}

let outboundConfirmAction = null;

function askOutboundConfirm(title, message, action) {
  outboundConfirmAction = action;
  document.getElementById('ob-confirm-title').textContent = title;
  document.getElementById('ob-confirm-msg').textContent = message;
  openModal('ob-confirm-modal');
}

function runOutboundConfirm() {
  const action = outboundConfirmAction;
  outboundConfirmAction = null;
  closeModal('ob-confirm-modal');
  if (action) action();
}

function askAdvance(from, to, message, onlyId) {
  const ids = onlyId ? [onlyId] : selectedLineIds();
  if (!ids.length) {
    showToast('Select at least one line.', 'warning');
    return;
  }
  askOutboundConfirm('Confirm', message, () => {
    const moved = [];
    outboundLines.filter(l => ids.includes(l.id) && l.status === from).forEach(l => {
      l.status = to;
      moved.push(l);
    });
    const label = OB_STATUS[to].label;
    showToast(moved.length === 1
      ? `${moved[0].orderNo} / ${moved[0].productName} moved to ${label}`
      : `The data has been moved to ${label}`, 'success');
    currentObTab = to;
    renderOutboundDetail();
  });
}

function printPickList() {
  const ids = selectedLineIds();
  const lines = outboundLines.filter(l => l.outboundNo === currentOutboundNo && l.status === 'ready_to_pick' && (!ids.length || ids.includes(l.id)));
  if (!lines.length) {
    showToast('No Ready to Pick lines to print.', 'warning');
    return;
  }
  const batch = outboundBatches.find(b => b.outboundNo === currentOutboundNo);
  document.getElementById('ob-picklist-body').innerHTML = `
    <div class="ob-picklist" id="ob-picklist-print">
      <p><strong>Pick List</strong> · ${currentOutboundNo} · ${batch ? batch.warehouseCode : ''}</p>
      <p class="hint">Barcode on the pick list: EAN, then UPC, otherwise —. PAN is not shown here. Save or print as PDF from the browser dialog.</p>
      <table>
        <thead><tr><th>Order No.</th><th>SKU</th><th>Product</th><th>Qty</th><th>Zone</th><th>Barcode</th></tr></thead>
        <tbody>${lines.map(l => `<tr>
          <td>${l.orderNo}</td><td>${l.skuId}</td><td>${l.productName}</td>
          <td>${l.qty}</td><td>${l.zoneCode}</td><td>${pickListBarcode(l.skuId)}</td>
        </tr>`).join('')}</tbody>
      </table>
    </div>`;
  openModal('ob-picklist-modal');
}

function printPickListWindow() {
  const html = document.getElementById('ob-picklist-print').innerHTML;
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>Pick List</title>
    <style>body{font-family:Arial,sans-serif;padding:24px} table{width:100%;border-collapse:collapse} th,td{border:1px solid #ddd;padding:8px;text-align:left}</style>
    </head><body>${html}</body></html>`);
  w.document.close();
  w.focus();
  w.print();
}

function advanceSelected(from, to, label) {
  const ids = selectedLineIds();
  if (!ids.length) {
    showToast('Select at least one line.', 'warning');
    return;
  }
  outboundLines.filter(l => ids.includes(l.id) && l.status === from).forEach(l => { l.status = to; });
  showToast(`Selected lines moved to ${label}`, 'success');
  renderOutboundDetail();
}

function tryAllocate(line) {
  if (normalizeObStatus(line.status) !== 'pending_allocation') return false;
  const sku = storageSku(line.warehouseId, line.skuId);
  if (!sku || sku.available < line.qty) {
    line.holdReason = 'Insufficient available inventory';
    return false;
  }
  if (!occupySku(line.warehouseId, line.skuId, line.qty, line.outboundNo, line.orderNo)) {
    line.holdReason = 'Insufficient available inventory';
    return false;
  }
  line.status = 'pending_picking';
  line.zone = 'Storage Zone';
  line.zoneCode = formatCanonicalWarehouseCode(line.warehouseId) + 'STO';
  line.holdReason = '';
  return true;
}

function confirmAllocationLine(id) {
  const line = outboundLines.find(l => l.id === id);
  if (!line) return;
  askOutboundConfirm('Confirm allocation', `Allocate stock for ${line.orderNo}? Available will move to locked (Outbound Occupy).`, () => {
    const ok = tryAllocate(line);
    refreshAfterInventoryChange();
    renderOutboundOrderList();
    if (document.getElementById('page-outbound-detail')?.classList.contains('active')) renderOutboundDetail();
    showAllocateResult([{ ok, orderNo: line.orderNo, productName: line.productName }]);
  });
}

function confirmAllocationBatch() {
  const ids = selectedLineIds();
  if (!ids.length) {
    showToast('Select at least one order line.', 'warning');
    return;
  }
  askOutboundConfirm('Confirm allocation', 'Allocate selected lines? Stock will be locked (Outbound Occupy) and status becomes Pending Picking.', () => {
    const rows = [];
    ids.forEach(id => {
      const line = outboundLines.find(l => l.id === id && normalizeObStatus(l.status) === 'pending_allocation');
      if (!line) return;
      rows.push({ ok: tryAllocate(line), orderNo: line.orderNo, productName: line.productName });
    });
    refreshAfterInventoryChange();
    renderOutboundOrderList();
    if (document.getElementById('page-outbound-detail')?.classList.contains('active')) renderOutboundDetail();
    showAllocateResult(rows);
  });
}

function showAllocateResult(rows) {
  document.getElementById('ob-result-body').innerHTML = rows.map(r => `
    <p>${r.ok ? '✓' : '!'} ${r.orderNo} / ${r.productName}<br>
    <span class="hint">${r.ok ? 'Pending Picking · Outbound Occupy recorded.' : 'Still Pending Allocation · insufficient available.'}</span></p>
  `).join('') || '<p>No rows.</p>';
  openModal('ob-result-modal');
}

function reallocateLine(id) { confirmAllocationLine(id); }
function reallocateSelected() { confirmAllocationBatch(); }

function viewOutboundLine(id) {
  const l = outboundLines.find(x => x.id === id);
  if (!l) return;
  document.getElementById('ob-line-detail').innerHTML = `
    <div class="record-detail-grid">
      <div class="label">SKU</div><div class="value">${l.skuId}</div>
      <div class="label">Product</div><div class="value">${l.productName}</div>
      <div class="label">Qty</div><div class="value">${l.qty}</div>
      <div class="label">Warehouse</div><div class="value">${formatCanonicalWarehouseCode(l.warehouseId)}</div>
      <div class="label">Zone</div><div class="value">${l.zoneCode} ${l.zone}</div>
      <div class="label">Outbound No.</div><div class="value">${l.outboundNo}</div>
      <div class="label">Order No.</div><div class="value">${l.orderNo}</div>
      <div class="label">Shipment No.</div><div class="value">${l.shipmentNo}</div>
      <div class="label">Tracking No.</div><div class="value">${l.trackingNo}</div>
    </div>`;
  openModal('ob-line-modal');
}

function exportShippingOrder() {
  const lines = outboundLines.filter(l => l.outboundNo === currentOutboundNo && normalizeObStatus(l.status) === 'pending_picking');
  document.getElementById('ob-export-count').textContent = `${lines.length} records.`;
  openModal('ob-export-modal');
}

function confirmExportShippingOrder() {
  const ext = document.getElementById('ob-export-format').value;
  const batch = outboundBatches.find(b => b.outboundNo === currentOutboundNo);
  const lines = outboundLines.filter(l => l.outboundNo === currentOutboundNo && normalizeObStatus(l.status) === 'pending_picking');
  const header = 'Outbound No,Order No,SKU ID,Product Name,Qty,Warehouse,Zone,Tracking No';
  const csv = [header].concat(lines.map(l =>
    [l.outboundNo, l.orderNo, l.skuId, l.productName, l.qty, formatCanonicalWarehouseCode(l.warehouseId), l.zoneCode, ''].join(',')
  )).join('\n');
  const name = `ShippingOrder_${batch ? batch.warehouseCode : 'WH'}_${ymd()}.${ext === 'csv' ? 'csv' : 'csv'}`;
  downloadTextFile(name, csv);
  closeModal('ob-export-modal');
  showToast(`Export successful. Fill Tracking No. and import it on Allocated. File: ${name}`, 'success');
}

function renderOnHold() {
  const body = document.getElementById('ob-hold-body');
  if (!body) return;
  const scope = getWarehouseScope();
  const rows = outboundLines.filter(l => l.status === 'on_hold' && (scope === 'all' || l.warehouseId === scope));
  body.innerHTML = rows.map(l => `
    <tr>
      <td><input type="checkbox" class="ob-hold-check" value="${l.id}"></td>
      <td><a class="btn-link" onclick="openOutboundDetail('${l.outboundNo}')">${l.outboundNo}</a></td>
      <td>${l.orderNo}</td>
      <td>${l.skuId}</td>
      <td>${l.productName}</td>
      <td>${l.qty}</td>
      <td>${formatCanonicalWarehouseCode(l.warehouseId)}</td>
      <td>${l.holdReason}</td>
      <td><a class="btn-link" onclick="reallocateLine('${l.id}')">Re-allocate</a></td>
    </tr>
  `).join('') || '<tr><td colspan="9" style="text-align:center;color:#999">No on-hold lines</td></tr>';
}

function openImportOrders() {
  const select = document.getElementById('ob-import-wh');
  const scope = getWarehouseScope();
  const list = scope === 'all' ? warehouses : warehouses.filter(w => w.id === scope);
  select.innerHTML = list.map(w => `<option value="${w.id}">${formatCanonicalWarehouseCode(w.id)} — ${w.name}</option>`).join('');
  document.getElementById('ob-import-wh-wrap').style.display = scope === 'all' ? '' : 'none';
  obOrderCsv = '';
  document.getElementById('ob-import-step-upload').hidden = false;
  document.getElementById('ob-import-step-progress').hidden = true;
  document.getElementById('ob-import-preview').hidden = true;
  document.getElementById('ob-import-file-msg').textContent = '';
  document.getElementById('ob-import-btn').disabled = true;
  document.getElementById('ob-import-btn').textContent = 'Import';
  document.getElementById('ob-import-btn').onclick = runImportOrders;
  document.getElementById('ob-import-cancel').disabled = false;
  openModal('ob-import-modal');
}

function fillSampleOrderCsv() {
  obOrderCsv = [
    'Order No,Order Time,Product ID,SKU ID,Product Name,Specification,Qty',
    'SO-NEW-01,2026-08-21 10:00:00,PRD-10001,SKU-10001-BK,Wireless Bluetooth Earbuds Pro,Black; M,1',
    'SO-NEW-02,2026-08-21 10:01:00,PRD-10004,SKU-10004-01,USB-C Flash Drive,128GB,3'
  ].join('\n');
  document.getElementById('ob-import-preview').hidden = false;
  document.getElementById('ob-import-preview').textContent = obOrderCsv;
  document.getElementById('ob-import-file-msg').textContent = 'Upload successful. 2 orders found. Ready to import.';
  document.getElementById('ob-import-btn').disabled = false;
}

function onOutboundFilePicked(input, kind) {
  const file = input.files && input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    if (kind === 'orders') {
      obOrderCsv = String(reader.result || '');
      document.getElementById('ob-import-preview').hidden = false;
      document.getElementById('ob-import-preview').textContent = obOrderCsv.slice(0, 800);
      const ok = obOrderCsv.includes('SKU ID');
      document.getElementById('ob-import-btn').disabled = !ok;
      document.getElementById('ob-import-file-msg').textContent = ok
        ? 'Upload successful. Ready to import.'
        : 'The imported file contains invalid fields. Please re-upload.';
    } else {
      obTrackCsv = String(reader.result || '');
      document.getElementById('ob-track-preview').textContent = obTrackCsv.slice(0, 800);
      document.getElementById('ob-track-btn').disabled = !obTrackCsv.includes('Tracking');
    }
  };
  reader.readAsText(file);
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(row => {
    const cols = row.split(',');
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (cols[i] || '').trim(); });
    return obj;
  });
}

function runImportOrders() {
  const rows = parseCsv(obOrderCsv);
  if (!rows.length) {
    showToast('No data rows.', 'error');
    return;
  }
  document.getElementById('ob-import-step-upload').hidden = true;
  document.getElementById('ob-import-preview').hidden = true;
  document.getElementById('ob-import-step-progress').hidden = false;
  document.getElementById('ob-import-btn').disabled = true;
  document.getElementById('ob-import-btn').textContent = 'Importing';
  document.getElementById('ob-import-cancel').disabled = true;
  const wh = document.getElementById('ob-import-wh').value;
  const outboundNo = nextDocNo('OB', wh);
  let allocated = 0;
  let ignored = 0;
  const seen = new Set();
  rows.forEach(r => {
    const key = `${r['Order No']}|${r['SKU ID']}`;
    if (seen.has(key)) {
      ignored += 1;
      return;
    }
    seen.add(key);
    const line = {
      id: 'L' + Date.now() + Math.random().toString(16).slice(2, 6),
      outboundNo,
      orderNo: r['Order No'],
      orderTime: r['Order Time'] || '',
      skuId: r['SKU ID'],
      productName: r['Product Name'] || r['SKU ID'],
      spec: r.Specification || '—',
      qty: parseInt(r.Qty, 10) || 0,
      warehouseId: wh,
      zone: '—',
      zoneCode: '—',
      shipmentNo: '—',
      trackingNo: '—',
      status: 'pending_allocation',
      holdReason: ''
    };
    if (line.qty <= 0) return;
    outboundLines.push(line);
    allocated += 1;
  });
  outboundBatches.unshift({
    outboundNo,
    importedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    sourceFile: 'import.csv',
    warehouseId: wh,
    warehouseCode: formatCanonicalWarehouseCode(wh)
  });
  let pct = 0;
  const timer = setInterval(() => {
    pct = Math.min(100, pct + 25);
    document.getElementById('ob-import-bar').style.width = pct + '%';
    document.getElementById('ob-import-progress-text').textContent =
      `Processing ${pct}% · Imported ${allocated} · Ignore ${ignored}`;
    if (pct < 100) return;
    clearInterval(timer);
    document.getElementById('ob-import-progress-title').textContent = 'Import successful';
    document.getElementById('ob-import-btn').disabled = false;
    document.getElementById('ob-import-btn').textContent = 'Confirm';
    document.getElementById('ob-import-btn').onclick = () => {
      closeModal('ob-import-modal');
      document.getElementById('ob-import-btn').onclick = runImportOrders;
      outboundListTab = 'pending_allocation';
      refreshAfterInventoryChange();
      renderOutboundOrderList();
      navigateTo('outbound-orders');
    };
  }, 250);
}

function openImportTracking() {
  obTrackCsv = '';
  document.getElementById('ob-track-preview').textContent = '';
  document.getElementById('ob-track-btn').disabled = true;
  openModal('ob-track-modal');
}

function fillSampleTrackCsv() {
  const lines = outboundLines.filter(l => l.outboundNo === currentOutboundNo && normalizeObStatus(l.status) === 'pending_picking');
  obTrackCsv = 'Outbound No,Order No,SKU ID,Tracking No\n' + lines.map((l, i) => `${l.outboundNo},${l.orderNo},${l.skuId},TRK${ymd()}${String(i + 1).padStart(4, '0')}`).join('\n');
  document.getElementById('ob-track-preview').textContent = obTrackCsv || 'No allocated lines';
  document.getElementById('ob-track-btn').disabled = !lines.length;
}

function runImportTracking() {
  const rows = parseCsv(obTrackCsv);
  let matched = 0;
  let failed = 0;
  const shipmentByTracking = {};
  rows.forEach(r => {
    const line = outboundLines.find(l =>
      normalizeObStatus(l.status) === 'pending_picking' &&
      l.orderNo === r['Order No'] &&
      l.skuId === r['SKU ID'] &&
      (!r['Outbound No'] || l.outboundNo === r['Outbound No']) &&
      (!currentOutboundNo || l.outboundNo === currentOutboundNo)
    );
    if (!line) {
      failed += 1;
      return;
    }
    const tracking = r['Tracking No'];
    if (!shipmentByTracking[tracking]) shipmentByTracking[tracking] = nextDocNo('SHP', line.warehouseId);
    line.trackingNo = tracking;
    line.shipmentNo = shipmentByTracking[tracking];
    if (!deductSku(line)) {
      failed += 1;
      return;
    }
    line.status = 'shipped';
    matched += 1;
  });
  closeModal('ob-track-modal');
  refreshAfterInventoryChange();
  renderOutboundOrderList();
  showToast(failed ? `Shipped ${matched}, failed ${failed}.` : `Shipped ${matched} line(s).`, failed ? 'warning' : 'success');
  currentObTab = 'shipped';
  renderOutboundDetail();
}

function openPackTrackingModal(onlyId) {
  document.getElementById('ob-pack-line-id').value = onlyId || '';
  document.getElementById('ob-pack-tracking').value = '';
  openModal('ob-pack-modal');
}

function submitPackAndShip() {
  const onlyId = document.getElementById('ob-pack-line-id').value;
  const tracking = (document.getElementById('ob-pack-tracking').value || '').trim();
  if (!tracking) {
    showToast('Tracking No. is required.', 'warning');
    return;
  }
  const ids = onlyId ? [onlyId] : selectedLineIds();
  let targets = outboundLines.filter(l => normalizeObStatus(l.status) === 'pending_picking' && (!ids.length || ids.includes(l.id)));
  if (currentOutboundNo && document.getElementById('page-outbound-detail')?.classList.contains('active')) {
    targets = targets.filter(l => l.outboundNo === currentOutboundNo);
  }
  if (!targets.length) {
    showToast('No Pending Picking lines selected.', 'warning');
    return;
  }
  let ok = 0;
  let fail = 0;
  targets.forEach(l => {
    l.trackingNo = tracking;
    l.shipmentNo = nextDocNo('SHP', l.warehouseId);
    if (!deductSku(l)) {
      fail += 1;
      return;
    }
    l.status = 'shipped';
    ok += 1;
  });
  closeModal('ob-pack-modal');
  refreshAfterInventoryChange();
  renderOutboundOrderList();
  if (document.getElementById('page-outbound-detail')?.classList.contains('active')) {
    currentObTab = 'shipped';
    renderOutboundDetail();
  }
  showToast(fail ? `Shipped ${ok}, failed ${fail} (locked stock).` : `Shipped ${ok} line(s). Outbound Deduct recorded.`, fail ? 'warning' : 'success');
}

const SPECIAL_REASONS = [
  { code: 'SAMPLE', label: 'Sample' },
  { code: 'DAMAGE', label: 'Damage / write-off' },
  { code: 'INTERNAL', label: 'Internal use' },
  { code: 'OTHER', label: 'Other (note required)' }
];

function renderSpecialOutboundForm() {
  const scope = getWarehouseScope();
  const whSelect = document.getElementById('sx-wh');
  const list = scope === 'all' ? warehouses : warehouses.filter(w => w.id === scope);
  whSelect.innerHTML = list.map(w => `<option value="${w.id}">${formatCanonicalWarehouseCode(w.id)} — ${w.name}</option>`).join('');
  whSelect.disabled = scope !== 'all';
  const reason = document.getElementById('sx-reason');
  reason.innerHTML = SPECIAL_REASONS.map(r => `<option value="${r.code}">${r.label}</option>`).join('');
  refreshSpecialSkuOptions();
}

function refreshSpecialSkuOptions() {
  const wh = document.getElementById('sx-wh').value;
  const select = document.getElementById('sx-sku');
  const code = formatCanonicalWarehouseCode(wh);
  const rows = skuData.filter(s => formatCanonicalWarehouseCode(skuWarehouseId(s)) === code && /STO|Storage/i.test((s.zoneCode || '') + s.zone));
  select.innerHTML = rows.map(s =>
    `<option value="${s.skuId}">${s.skuId} · avail ${s.available} · ${s.productName || ''}</option>`
  ).join('') || '<option value="">No SKU rows in this warehouse</option>';
}

function submitSpecialOutbound() {
  const wh = document.getElementById('sx-wh').value;
  const skuId = document.getElementById('sx-sku').value;
  const qty = parseInt(document.getElementById('sx-qty').value, 10);
  const reasonCode = document.getElementById('sx-reason').value;
  const note = (document.getElementById('sx-note').value || '').trim();
  if (!skuId || !qty || qty < 1) {
    showToast('Select SKU and enter a valid quantity.', 'warning');
    return;
  }
  if (reasonCode === 'OTHER' && !note) {
    showToast('Reason note is required for Other.', 'warning');
    return;
  }
  const sku = storageSku(wh, skuId);
  if (!sku || sku.available < qty) {
    showToast('Insufficient available inventory.', 'error');
    return;
  }
  const outboundNo = nextDocNo('SX', wh);
  const reasonLabel = SPECIAL_REASONS.find(r => r.code === reasonCode)?.label || reasonCode;
  const line = {
    id: 'SX' + Date.now(),
    outboundNo,
    outboundType: 'special',
    orderNo: '—',
    skuId,
    productName: sku.productName || skuId,
    qty,
    warehouseId: wh,
    zone: 'Storage Zone',
    zoneCode: formatCanonicalWarehouseCode(wh) + 'STO',
    shipmentNo: '—',
    trackingNo: '—',
    status: 'shipped',
    specialReason: `${reasonLabel}${note ? ': ' + note : ''}`
  };
  if (!deductSku(line)) {
    showToast('Deduction failed.', 'error');
    return;
  }
  document.getElementById('sx-qty').value = '1';
  document.getElementById('sx-note').value = '';
  showToast(`Special outbound ${outboundNo} recorded.`, 'success');
  refreshAfterInventoryChange();
}

seedOutbound();

document.addEventListener('DOMContentLoaded', () => {
  const orig = navigateTo;
  navigateTo = function (pageId) {
    orig(pageId);
    if (pageId === 'outbound-orders') renderOutboundOrderList();
    if (pageId === 'outbound-detail') renderOutboundDetail();
    if (pageId === 'outbound-special') renderSpecialOutboundForm();
  };
});
