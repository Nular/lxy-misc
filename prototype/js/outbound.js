// Outbound orders — aligned with inventory: occupy on allocate, deduct on ship.

const OB_STATUS = {
  allocated: { label: 'Allocated', cls: 'tag-sto' },
  ready_to_pick: { label: 'Ready to Pick', cls: 'tag-rcv' },
  ready_to_pack: { label: 'Ready to Pack', cls: 'tag-normal' },
  ready_to_ship: { label: 'Ready to Ship', cls: 'tag-shp' },
  shipped: { label: 'Shipped', cls: 'tag-enable' },
  on_hold: { label: 'On Hold', cls: 'tag-cold' }
};

const OB_TABS = ['all', 'allocated', 'ready_to_pick', 'ready_to_pack', 'ready_to_ship', 'shipped', 'on_hold'];

let outboundBatches = [];
let outboundLines = [];
let obSeq = { OB: 1, SHP: 1 };
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
  if (shipped === lines.length) return 'Fully Outbound';
  if (shipped > 0) return 'Partially Outbound';
  return 'Pending Outbound';
}

function batchTag(status) {
  if (status === 'Fully Outbound') return '<span class="tag tag-enable">Fully Outbound</span>';
  if (status === 'Partially Outbound') return '<span class="tag tag-cold">Partially Outbound</span>';
  return '<span class="tag tag-sto">Pending Outbound</span>';
}

function lineTag(status) {
  const meta = OB_STATUS[status] || { label: status, cls: 'tag-normal' };
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
    { orderNo: 'SO-20260821001', skuId: 'SKU-10001-BK', name: 'Wireless Bluetooth Earbuds Pro', spec: 'Black; M', qty: 2, status: 'allocated' },
    { orderNo: 'SO-20260821002', skuId: 'SKU-10001-WH', name: 'Wireless Bluetooth Earbuds Pro', spec: 'White; L', qty: 1, status: 'ready_to_pick', tracking: 'SF1029384756' },
    { orderNo: 'SO-20260821003', skuId: 'SKU-10004-01', name: 'USB-C Flash Drive', spec: '128GB', qty: 2, status: 'on_hold' }
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
      zoneCode: s.status === 'on_hold' ? '—' : 'SH001STO',
      zone: s.status === 'on_hold' ? '—' : 'Storage Zone',
      shipmentNo: '—',
      trackingNo: '—',
      status: s.status,
      holdReason: s.status === 'on_hold' ? 'Insufficient available inventory' : ''
    };
    if (s.tracking) {
      line.trackingNo = s.tracking;
      line.shipmentNo = nextDocNo('SHP', wh);
    }
    if (s.status !== 'on_hold') occupySku(wh, s.skuId, s.qty, no, s.orderNo);
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
    status: 'Allocated'
  });
  return true;
}

function deductSku(line) {
  const sku = storageSku(line.warehouseId, line.skuId);
  if (!sku || sku.locked < line.qty) return false;
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

function renderOutboundBatches() {
  const body = document.getElementById('ob-batch-body');
  if (!body) return;
  const field = document.getElementById('ob-filter-field').value;
  const keyword = (document.getElementById('ob-filter-keyword').value || '').trim().toLowerCase();
  const scope = getWarehouseScope();
  let rows = outboundBatches.filter(b => scope === 'all' || b.warehouseId === scope);
  if (keyword) {
    rows = rows.filter(b => {
      const lines = outboundLines.filter(l => l.outboundNo === b.outboundNo);
      const status = batchStatus(lines);
      const hay = field === 'status' ? status : b.outboundNo;
      return hay.toLowerCase().includes(keyword);
    });
  }
  const hint = document.getElementById('ob-import-scope-hint');
  if (hint) {
    hint.textContent = scope === 'all'
      ? 'Context is All. Choose a warehouse in the import dialog.'
      : `Import uses ${getWarehouseScopeLabel()}.`;
  }
  body.innerHTML = rows.map(b => {
    const lines = outboundLines.filter(l => l.outboundNo === b.outboundNo);
    const orders = new Set(lines.map(l => l.orderNo)).size;
    const skus = new Set(lines.map(l => l.skuId)).size;
    const units = lines.reduce((s, l) => s + l.qty, 0);
    return `<tr>
      <td>${b.outboundNo}</td>
      <td>${b.importedAt}</td>
      <td><a class="btn-link" href="#" onclick="event.preventDefault();showToast('Download ${b.sourceFile}')">${b.sourceFile}</a></td>
      <td>${b.warehouseCode}</td>
      <td>${orders}</td>
      <td>${skus}</td>
      <td>${units}</td>
      <td>${batchTag(batchStatus(lines))}</td>
      <td><a class="btn-link" onclick="openOutboundDetail('${b.outboundNo}')">View</a></td>
    </tr>`;
  }).join('') || '<tr><td colspan="9" style="text-align:center;color:#999">No outbound batches</td></tr>';
}

function searchOutboundBatches() { renderOutboundBatches(); }
function resetOutboundBatchFilters() {
  document.getElementById('ob-filter-keyword').value = '';
  renderOutboundBatches();
}

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
    const count = tab === 'all' ? lines.length : lines.filter(l => l.status === tab).length;
    const label = tab === 'all' ? 'All' : OB_STATUS[tab].label;
    return `<div class="tab ${tab === currentObTab ? 'active' : ''}" onclick="setOutboundTab('${tab}')">${label} (${count})</div>`;
  }).join('');
  const visible = currentObTab === 'all' ? lines : lines.filter(l => l.status === currentObTab);
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
  if (tab === 'allocated') {
    return `<span></span><span>
      <button class="btn" onclick="exportShippingOrder()">Export Shipping Order</button>
      <button class="btn btn-primary" onclick="openImportTracking()">Import Tracking No.</button>
    </span>`;
  }
  if (tab === 'ready_to_pick') {
    return `<span></span><span>
      <button class="btn" onclick="printPickList()">Print Pick List</button>
      <button class="btn btn-primary" onclick="askAdvance('ready_to_pick','ready_to_pack','Confirm completing picking for the selected row(s)?')">Batch Complete Picking</button>
    </span>`;
  }
  if (tab === 'ready_to_pack') return `<span></span><button class="btn btn-primary" onclick="askAdvance('ready_to_pack','ready_to_ship','Confirm completing packing for the selected row(s)?')">Batch Complete Packing</button>`;
  if (tab === 'ready_to_ship') return `<span></span><button class="btn btn-primary" onclick="askConfirmShipment()">Batch Confirm Shipment</button>`;
  if (tab === 'on_hold') return `<span></span><button class="btn btn-primary" onclick="reallocateSelected(false)">Batch Re-allocate</button>`;
  return '';
}

function lineAction(l) {
  if (l.status === 'allocated' || l.status === 'shipped') return `<a class="btn-link" onclick="viewOutboundLine('${l.id}')">View</a>`;
  if (l.status === 'ready_to_pick') return `<a class="btn-link" onclick="askAdvance('ready_to_pick','ready_to_pack','Confirm completing picking for the selected row(s)?','${l.id}')">Complete Picking</a>`;
  if (l.status === 'ready_to_pack') return `<a class="btn-link" onclick="askAdvance('ready_to_pack','ready_to_ship','Confirm completing packing for the selected row(s)?','${l.id}')">Complete Packing</a>`;
  if (l.status === 'ready_to_ship') return `<a class="btn-link" onclick="askConfirmShipment('${l.id}')">Confirm Shipment</a>`;
  if (l.status === 'on_hold') return `<a class="btn-link" onclick="reallocateLine('${l.id}')">Re-allocate</a>`;
  return '';
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
  showToast(`Print pick list: ${lines.length} line(s)`, 'success');
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

function confirmShipment(id) {
  const line = outboundLines.find(l => l.id === id);
  if (!line || line.status !== 'ready_to_ship') return;
  if (!deductSku(line)) {
    showToast('Insufficient locked stock. Entire line failed.', 'error');
    return;
  }
  line.status = 'shipped';
  showToast(`${line.orderNo} / ${line.productName} moved to Shipped`, 'success');
  refreshAfterInventoryChange();
  renderOutboundDetail();
}

function askConfirmShipment(onlyId) {
  const ids = onlyId ? [onlyId] : selectedLineIds();
  if (!ids.length) {
    showToast('Select at least one line.', 'warning');
    return;
  }
  askOutboundConfirm('Confirm shipment', 'Confirm marking the selected row(s) as shipped?', () => {
    ids.forEach(confirmShipment);
  });
}

function tryAllocate(line) {
  const sku = storageSku(line.warehouseId, line.skuId);
  if (!sku || sku.available < line.qty) {
    line.status = 'on_hold';
    line.zone = '—';
    line.zoneCode = '—';
    line.holdReason = 'Insufficient available inventory';
    return false;
  }
  if (!occupySku(line.warehouseId, line.skuId, line.qty, line.outboundNo, line.orderNo)) {
    line.status = 'on_hold';
    line.holdReason = 'Insufficient available inventory';
    return false;
  }
  line.status = 'allocated';
  line.zone = 'Storage Zone';
  line.zoneCode = formatCanonicalWarehouseCode(line.warehouseId) + 'STO';
  line.holdReason = '';
  return true;
}

function showAllocateResult(rows) {
  document.getElementById('ob-result-body').innerHTML = rows.map(r => `
    <p>${r.ok ? '✓' : '!'} ${r.orderNo} / ${r.productName}<br>
    <span class="hint">${r.ok ? 'Success: Moved to Allocated.' : 'Failed: Insufficient stock; row remains On Hold.'}</span></p>
  `).join('') || '<p>No rows.</p>';
  openModal('ob-result-modal');
}

function reallocateLine(id) {
  askOutboundConfirm('Re-allocate', 'Confirm retrying allocation for the selected row(s)?', () => {
    const line = outboundLines.find(l => l.id === id);
    if (!line) return;
    const ok = tryAllocate(line);
    refreshAfterInventoryChange();
    if (document.getElementById('page-outbound-detail').classList.contains('active')) renderOutboundDetail();
    renderOnHold();
    showAllocateResult([{ ok, orderNo: line.orderNo, productName: line.productName }]);
  });
}

function reallocateSelected(fromHoldPage) {
  const ids = fromHoldPage
    ? [...document.querySelectorAll('.ob-hold-check:checked')].map(el => el.value)
    : selectedLineIds();
  if (!ids.length) {
    showToast('Select at least one line.', 'warning');
    return;
  }
  askOutboundConfirm('Re-allocate', 'Confirm retrying allocation for the selected row(s)?', () => {
    const rows = [];
    ids.forEach(id => {
      const line = outboundLines.find(l => l.id === id && l.status === 'on_hold');
      if (!line) return;
      const ok = tryAllocate(line);
      rows.push({ ok, orderNo: line.orderNo, productName: line.productName });
    });
    refreshAfterInventoryChange();
    renderOnHold();
    if (document.getElementById('page-outbound-detail').classList.contains('active')) renderOutboundDetail();
    showAllocateResult(rows);
  });
}

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
  const lines = outboundLines.filter(l => l.outboundNo === currentOutboundNo && l.status === 'allocated');
  document.getElementById('ob-export-count').textContent = `${lines.length} records.`;
  openModal('ob-export-modal');
}

function confirmExportShippingOrder() {
  const ext = document.getElementById('ob-export-format').value;
  const batch = outboundBatches.find(b => b.outboundNo === currentOutboundNo);
  closeModal('ob-export-modal');
  showToast(`Export successful. ShippingOrder_${batch ? batch.warehouseCode : 'WH'}_${ymd()}.${ext}`, 'success');
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
  let held = 0;
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
      status: 'on_hold',
      holdReason: ''
    };
    if (line.qty <= 0) return;
    if (tryAllocate(line)) allocated += 1;
    else held += 1;
    outboundLines.push(line);
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
      `Processing ${pct}% · Allocated ${allocated} · On Hold ${held} · Ignore ${ignored}`;
    if (pct < 100) return;
    clearInterval(timer);
    document.getElementById('ob-import-progress-title').textContent = 'Import successful';
    document.getElementById('ob-import-btn').disabled = false;
    document.getElementById('ob-import-btn').textContent = 'Confirm';
    document.getElementById('ob-import-btn').onclick = () => {
      closeModal('ob-import-modal');
      document.getElementById('ob-import-btn').onclick = runImportOrders;
      refreshAfterInventoryChange();
      renderOutboundBatches();
      openOutboundDetail(outboundNo);
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
  const lines = outboundLines.filter(l => l.outboundNo === currentOutboundNo && l.status === 'allocated');
  obTrackCsv = 'Order No,SKU ID,Tracking No\n' + lines.map((l, i) => `${l.orderNo},${l.skuId},TRK${ymd()}${String(i + 1).padStart(4, '0')}`).join('\n');
  document.getElementById('ob-track-preview').textContent = obTrackCsv || 'No allocated lines';
  document.getElementById('ob-track-btn').disabled = !lines.length;
}

function runImportTracking() {
  const rows = parseCsv(obTrackCsv);
  let matched = 0;
  let failed = 0;
  const shipmentByTracking = {};
  rows.forEach(r => {
    const line = outboundLines.find(l => l.outboundNo === currentOutboundNo && l.orderNo === r['Order No'] && l.skuId === r['SKU ID'] && l.status === 'allocated');
    if (!line) {
      failed += 1;
      return;
    }
    const tracking = r['Tracking No'];
    if (!shipmentByTracking[tracking]) shipmentByTracking[tracking] = nextDocNo('SHP', line.warehouseId);
    line.trackingNo = tracking;
    line.shipmentNo = shipmentByTracking[tracking];
    line.status = 'ready_to_pick';
    matched += 1;
  });
  closeModal('ob-track-modal');
  showToast(failed ? `Matched ${matched}. Failed ${failed}: data mismatch` : `Matched ${matched}. Moved to Ready to Pick`, failed ? 'warning' : 'success');
  currentObTab = 'ready_to_pick';
  renderOutboundDetail();
}

seedOutbound();

document.addEventListener('DOMContentLoaded', () => {
  const orig = navigateTo;
  navigateTo = function (pageId) {
    orig(pageId);
    if (pageId === 'outbound-orders') renderOutboundBatches();
    if (pageId === 'outbound-onhold') renderOnHold();
    if (pageId === 'outbound-detail') renderOutboundDetail();
  };
});
