// Purchase Order & Inbound Receipt (aligned with foundation: codes, records, inventory)

const MAX_IMPORT_JOBS = 2;
const MAX_SKU_LINES = 10000;
let inboundImportJobs = 0;
let poImportJobs = 0;

const PO_HEAD_STATUSES = [
  'Draft', 'Processing', 'Created', 'Pending Shipment', 'Partially Shipped',
  'Shipped', 'Partially Received', 'Received', 'Partially Stocked In', 'Stocked In'
];

const PO_STATUS_TAG = {
  Draft: 'tag-disable',
  Processing: 'tag-warning',
  Created: 'tag-normal',
  'Pending Shipment': 'tag-normal',
  'Partially Shipped': 'tag-cold',
  Shipped: 'tag-normal',
  'Partially Received': 'tag-cold',
  Received: 'tag-normal',
  'Partially Stocked In': 'tag-cold',
  'Stocked In': 'tag-enable'
};

let purchaseOrders = [
  {
    orderNo: 'PO-20260820001',
    name: 'Earbuds restock Aug',
    warehouseCode: 'SH001',
    status: 'Partially Stocked In',
    creationMethod: 'Import Created',
    supplier: 'Shenzhen Acme Electronics',
    trackingNo: 'SF1234567890',
    linkedReceipts: ['IN-20260821001'],
    createdAt: '2026-08-20 10:00:00',
    lines: [
      { skuId: 'SKU-10001-BK', productName: 'Wireless Bluetooth Earbuds Pro', spec: 'Black; M', qty: 200, unitPrice: '12.50', lineStatus: 'Stocked In' },
      { skuId: 'SKU-10001-WH', productName: 'Wireless Bluetooth Earbuds Pro', spec: 'White; L', qty: 150, unitPrice: '12.50', lineStatus: 'Received' }
    ]
  },
  {
    orderNo: 'PO-20260818002',
    name: 'Power bank batch',
    warehouseCode: 'BJ001',
    status: 'Pending Shipment',
    creationMethod: 'Manual Entry',
    supplier: 'Beijing Power Co.',
    trackingNo: '',
    linkedReceipts: [],
    createdAt: '2026-08-18 14:30:00',
    lines: [
      { skuId: 'SKU-10003-01', productName: 'Portable Power Bank 20000mAh', spec: 'Standard', qty: 500, unitPrice: '8.00', lineStatus: 'Pending Shipment' }
    ]
  },
  {
    orderNo: 'PO-20260821088',
    name: 'Watch restock',
    warehouseCode: 'SH001',
    status: 'Shipped',
    creationMethod: 'Manual Entry',
    supplier: 'Acme Watch Ltd',
    trackingNo: 'YT998877',
    linkedReceipts: [],
    createdAt: '2026-08-21 08:12:00',
    lines: [
      { skuId: 'SKU-10002-42', productName: 'Smart Watch Series X', spec: '42mm Silver', qty: 150, unitPrice: '89.00', lineStatus: 'Shipped' }
    ]
  }
];

let inboundReceipts = [
  {
    receiptNo: 'IN-20260821001',
    receiptType: 'Purchase Receipt',
    status: 'Stocked In',
    warehouseCode: 'SH001',
    zoneCode: 'SH001STO',
    purchaseOrderNo: 'PO-20260820001',
    progress: 100,
    updatedAt: '2026-08-21 09:32:15',
    lines: [
      { skuId: 'SKU-10001-BK', productName: 'Wireless Bluetooth Earbuds Pro', spec: 'Black; M', orderQty: 200, receiptQty: 200, zoneCode: 'SH001STO' }
    ]
  },
  {
    receiptNo: 'IN-20260822003',
    receiptType: 'Manual Receipt',
    status: 'Draft',
    warehouseCode: 'SH001',
    zoneCode: 'SH001STO',
    purchaseOrderNo: '',
    progress: 0,
    updatedAt: '2026-08-22 11:20:00',
    lines: []
  },
  {
    receiptNo: 'IN-20260823004',
    receiptType: 'Purchase Receipt',
    status: 'Processing',
    warehouseCode: 'SH001',
    zoneCode: 'SH001STO',
    purchaseOrderNo: 'PO-20260820001',
    progress: 45,
    updatedAt: '2026-08-23 08:05:00',
    lines: [
      { skuId: 'SKU-10001-WH', productName: 'Wireless Bluetooth Earbuds Pro', spec: 'White; L', orderQty: 150, receiptQty: 80, zoneCode: 'SH001STO' }
    ]
  }
];

let currentPoEdit = null;
let currentReceiptEdit = null;
let receiptEditorSource = 'po';
let poEditorLines = [];
let receiptEditorLines = [];

function nextDocNo(prefix) {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const list = prefix === 'PO' ? purchaseOrders : inboundReceipts;
  const key = prefix === 'PO' ? 'orderNo' : 'receiptNo';
  const re = new RegExp('^' + prefix + '-' + d + '(\\d{3})$');
  let max = 0;
  list.forEach(x => {
    const m = String(x[key]).match(re);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  return `${prefix}-${d}${String(max + 1).padStart(3, '0')}`;
}

function getInboundWarehouseScope() {
  const scope = getWarehouseScope();
  if (scope === 'all') return warehouses[0] ? normalizeWarehouseId(warehouses[0].id) : 'SH001';
  return normalizeWarehouseId(scope);
}

function getDefaultStorageZoneCode(whCode) {
  const code = normalizeWarehouseId(whCode);
  const z = zones.find(zn => normalizeWarehouseId(zn.whId) === code && zn.type === 'Storage Zone');
  if (z) return normalizeWarehouseId(z.code.replace(/STO$/i, '')) + 'STO';
  return code + 'STO';
}

function poMatchesScope(po) {
  const scope = getWarehouseScope();
  if (scope === 'all') return true;
  return normalizeWarehouseId(po.warehouseCode) === normalizeWarehouseId(scope);
}

function receiptMatchesScope(r) {
  const scope = getWarehouseScope();
  if (scope === 'all') return true;
  return normalizeWarehouseId(r.warehouseCode) === normalizeWarehouseId(scope);
}

function bindSearchSuggest(inputId, panelId, getValues) {
  const input = document.getElementById(inputId);
  const panel = document.getElementById(panelId);
  if (!input || !panel) return;
  const render = () => {
    const kw = (input.value || '').trim().toLowerCase();
    let vals = getValues();
    if (kw) vals = vals.filter(v => v.toLowerCase().includes(kw));
    vals = vals.slice(0, 20);
    if (!vals.length) {
      panel.hidden = true;
      return;
    }
    panel.innerHTML = vals.map(v => `<div class="suggest-item" data-v="${v}">${v}</div>`).join('');
    panel.hidden = false;
  };
  input.addEventListener('focus', render);
  input.addEventListener('input', render);
  panel.addEventListener('mousedown', e => {
    const item = e.target.closest('.suggest-item');
    if (!item) return;
    input.value = item.dataset.v;
    panel.hidden = true;
    if (inputId === 'po-search-keyword') searchPurchaseOrders();
    else searchInboundReceipts();
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.suggest-wrap')) panel.hidden = true;
  });
}

function initPoInboundSuggest() {
  bindSearchSuggest('po-search-keyword', 'po-search-suggest', () => {
    const field = document.getElementById('po-search-field').value;
    const rows = purchaseOrders.filter(poMatchesScope);
    if (field === 'linkedReceipt') return [...new Set(rows.flatMap(p => p.linkedReceipts))];
    return rows.map(p => p.orderNo);
  });
  bindSearchSuggest('inbound-search-keyword', 'inbound-search-suggest', () => {
    const field = document.getElementById('inbound-search-field').value;
    const rows = inboundReceipts.filter(receiptMatchesScope);
    if (field === 'purchaseOrder') return [...new Set(rows.map(r => r.purchaseOrderNo).filter(Boolean))];
    return rows.map(r => r.receiptNo);
  });
}

function rankByKeyword(rows, kw, getVal) {
  const k = kw.toLowerCase();
  return rows.sort((a, b) => {
    const va = getVal(a).toLowerCase();
    const vb = getVal(b).toLowerCase();
    const ea = va === k;
    const eb = vb === k;
    if (ea && !eb) return -1;
    if (!ea && eb) return 1;
    return 0;
  });
}

function renderPurchaseOrderList() {
  const tbody = document.getElementById('po-table-body');
  if (!tbody) return;
  const field = document.getElementById('po-search-field').value;
  const kw = (document.getElementById('po-search-keyword').value || '').trim().toLowerCase();
  const method = document.getElementById('po-filter-method').value;
  const status = document.getElementById('po-filter-status').value;

  let rows = purchaseOrders.filter(poMatchesScope);
  if (kw) {
    rows = rows.filter(po => {
      if (field === 'orderNo') return po.orderNo.toLowerCase().includes(kw);
      return po.linkedReceipts.some(r => r.toLowerCase().includes(kw));
    });
    rankByKeyword(rows, kw, po => (field === 'orderNo' ? po.orderNo : po.linkedReceipts.join(',')));
  }
  rows.sort((a, b) => {
    if (kw) return 0;
    return b.createdAt.localeCompare(a.createdAt);
  });
  if (method) rows = rows.filter(po => po.creationMethod === method);
  if (status) rows = rows.filter(po => po.status === status);

  document.getElementById('po-list-total').textContent = rows.length;
  tbody.innerHTML = rows.map(po => {
    const processing = po.status === 'Processing';
    const locked = processing || po.status === 'Stocked In';
    return `
    <tr>
      <td><strong>${po.orderNo}</strong></td>
      <td>${po.name}</td>
      <td>${po.warehouseCode}</td>
      <td><span class="tag ${PO_STATUS_TAG[po.status] || 'tag-normal'}">${po.status}</span></td>
      <td>${po.creationMethod}</td>
      <td>${po.linkedReceipts.length ? po.linkedReceipts.join(', ') : '—'}</td>
      <td>${po.supplier}</td>
      <td>${po.createdAt}</td>
      <td>
        <div class="action-links">
          ${processing ? `<a onclick="showPoProgress('${po.orderNo}')">View Progress</a>` : `<a onclick="openPurchaseOrderEditor('${po.orderNo}')">${locked ? 'View' : 'Edit'}</a>`}
          <a class="danger ${locked || po.linkedReceipts.length ? 'disabled' : ''}" onclick="deletePurchaseOrder('${po.orderNo}')">Delete</a>
        </div>
      </td>
    </tr>`;
  }).join('') || '<tr><td colspan="9" style="text-align:center;color:#999">No data</td></tr>';
}

function renderInboundReceiptList() {
  const tbody = document.getElementById('inbound-table-body');
  if (!tbody) return;
  const field = document.getElementById('inbound-search-field').value;
  const kw = (document.getElementById('inbound-search-keyword').value || '').trim().toLowerCase();
  const status = document.getElementById('inbound-filter-status').value;
  const type = document.getElementById('inbound-filter-type').value;

  let rows = inboundReceipts.filter(receiptMatchesScope);
  if (kw) {
    rows = rows.filter(r => {
      if (field === 'receiptNo') return r.receiptNo.toLowerCase().includes(kw);
      return (r.purchaseOrderNo || '').toLowerCase().includes(kw);
    });
    rankByKeyword(rows, kw, r => (field === 'receiptNo' ? r.receiptNo : (r.purchaseOrderNo || '')));
  } else {
    rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  if (status) rows = rows.filter(r => r.status === status);
  if (type) rows = rows.filter(r => r.receiptType === type);

  document.getElementById('inbound-list-total').textContent = rows.length;
  tbody.innerHTML = rows.map(r => `
    <tr>
      <td><strong>${r.receiptNo}</strong></td>
      <td>${r.receiptType}</td>
      <td><span class="tag ${r.status === 'Stocked In' ? 'tag-enable' : r.status === 'Processing' ? 'tag-warning' : 'tag-disable'}">${r.status}</span></td>
      <td>${r.warehouseCode}</td>
      <td>${r.purchaseOrderNo || '—'}</td>
      <td>${r.lines.length}</td>
      <td>${r.status === 'Processing' ? `<div class="mini-progress"><div style="width:${r.progress}%"></div></div> ${r.progress}%` : r.status === 'Stocked In' ? '100%' : '—'}</td>
      <td>${r.updatedAt}</td>
      <td>
        <div class="action-links">
          ${r.status === 'Processing' ? `<a onclick="showReceiptProgress('${r.receiptNo}')">View Progress</a>` : `<a onclick="openReceiptEditor('${r.receiptNo}')">${r.status === 'Stocked In' ? 'View' : 'Edit'}</a>`}
          <a class="danger ${r.status !== 'Draft' ? 'disabled' : ''}" onclick="deleteInboundReceipt('${r.receiptNo}')">Delete</a>
        </div>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="9" style="text-align:center;color:#999">No data</td></tr>';
}

function searchPurchaseOrders() {
  renderPurchaseOrderList();
  showToast('Purchase order search applied', 'success');
}

function resetPurchaseOrderFilters() {
  document.getElementById('po-search-keyword').value = '';
  document.getElementById('po-filter-method').value = '';
  document.getElementById('po-filter-status').value = '';
  renderPurchaseOrderList();
}

function searchInboundReceipts() {
  renderInboundReceiptList();
  showToast('Inbound receipt search applied', 'success');
}

function resetInboundFilters() {
  document.getElementById('inbound-search-keyword').value = '';
  document.getElementById('inbound-filter-status').value = '';
  document.getElementById('inbound-filter-type').value = '';
  renderInboundReceiptList();
}

function openPurchaseOrderEditor(orderNo) {
  const wh = getInboundWarehouseScope();
  currentPoEdit = orderNo ? purchaseOrders.find(p => p.orderNo === orderNo) : null;
  document.getElementById('po-editor-title').textContent = currentPoEdit ? 'Edit Purchase Order' : 'Create Purchase Order';
  document.getElementById('po-warehouse').value = wh;
  if (currentPoEdit) {
    document.getElementById('po-name').value = currentPoEdit.name;
    document.getElementById('po-supplier').value = currentPoEdit.supplier;
    document.getElementById('po-tracking').value = currentPoEdit.trackingNo || '';
    poEditorLines = currentPoEdit.lines.map(l => ({ ...l }));
  } else {
    document.getElementById('po-name').value = localStorage.getItem('po_draft_name') || '';
    document.getElementById('po-supplier').value = localStorage.getItem('po_draft_supplier') || '';
    document.getElementById('po-tracking').value = '';
    poEditorLines = [];
  }
  renderPoEditorLines();
  openModal('po-editor-modal');
}

function viewPurchaseOrder(orderNo) {
  openPurchaseOrderEditor(orderNo);
}

function poAddSampleLine() {
  if (poEditorLines.length >= MAX_SKU_LINES) {
    showToast('You have already uploaded 10,000 records. Adding new data will clear all existing data.', 'warning');
    return;
  }
  poEditorLines.push({
    skuId: 'SKU-10002-42',
    productName: 'Smart Watch Series X',
    spec: '42mm Silver',
    qty: 100,
    unitPrice: '89.00',
    lineStatus: 'Pending Shipment'
  });
  renderPoEditorLines();
}

function renderPoEditorLines() {
  document.getElementById('po-editor-lines').innerHTML = poEditorLines.map(l => `
    <tr><td>${l.skuId}</td><td>${l.productName}</td><td>${l.spec}</td><td>${l.qty}</td><td>${l.unitPrice}</td><td>${l.lineStatus}</td></tr>
  `).join('') || '<tr><td colspan="6" style="text-align:center;color:#999">No SKU lines — use Add Products or Import</td></tr>';
}

function countActiveJobs(kind) {
  if (kind === 'po') return poImportJobs + purchaseOrders.filter(p => p.status === 'Processing').length;
  return inboundImportJobs + inboundReceipts.filter(r => r.status === 'Processing').length;
}

function startPoImport() {
  if (countActiveJobs('po') >= MAX_IMPORT_JOBS) {
    showToast('At most 2 import jobs can run at the same time.', 'warning');
    return;
  }
  poImportJobs++;
  const bar = document.getElementById('po-import-progress');
  const fill = document.getElementById('po-import-fill');
  const label = document.getElementById('po-import-pct');
  bar.hidden = false;
  let pct = 0;
  const timer = setInterval(() => {
    pct += 20;
    if (pct > 100) pct = 100;
    fill.style.width = pct + '%';
    label.textContent = pct + '%';
    if (pct >= 100) {
      clearInterval(timer);
      poImportJobs--;
      poAddSampleLine();
      bar.hidden = true;
      showToast('PO import completed (demo)', 'success');
    }
  }, 350);
}

function showPoProgress(orderNo) {
  showToast(`Import in progress for ${orderNo}`, 'info');
  openPurchaseOrderEditor(orderNo);
}

function savePurchaseOrderDraft() {
  persistPoFromForm('Draft');
}

function savePurchaseOrderCreated() {
  persistPoFromForm('Created');
}

function persistPoFromForm(status) {
  const supplier = document.getElementById('po-supplier').value.trim();
  if (!supplier) {
    showToast('Please enter supplier.', 'error');
    return;
  }
  const payload = {
    name: document.getElementById('po-name').value.trim() || 'Untitled PO',
    warehouseCode: getInboundWarehouseScope(),
    supplier,
    trackingNo: document.getElementById('po-tracking').value.trim(),
    creationMethod: 'Manual Entry',
    linkedReceipts: currentPoEdit ? currentPoEdit.linkedReceipts : [],
    lines: poEditorLines,
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
  };
  localStorage.setItem('po_draft_name', payload.name);
  localStorage.setItem('po_draft_supplier', payload.supplier);

  if (currentPoEdit) {
    Object.assign(currentPoEdit, payload, { status });
  } else {
    purchaseOrders.unshift({
      orderNo: nextDocNo('PO'),
      status,
      ...payload
    });
  }
  closeModal('po-editor-modal');
  renderPurchaseOrderList();
  showToast('Purchase order saved.', 'success');
}

function deletePurchaseOrder(orderNo) {
  const po = purchaseOrders.find(p => p.orderNo === orderNo);
  if (!po || po.status === 'Processing' || po.status === 'Stocked In' || po.linkedReceipts.length) return;
  purchaseOrders = purchaseOrders.filter(p => p.orderNo !== orderNo);
  renderPurchaseOrderList();
  showToast('Deleted successfully.', 'success');
}

function populateReceiptPoSelect() {
  const sel = document.getElementById('receipt-po-select');
  const eligible = purchaseOrders.filter(p => poMatchesScope(p) && !['Draft', 'Processing', 'Stocked In'].includes(p.status));
  sel.innerHTML = '<option value="">— None —</option>' +
    eligible.map(p => `<option value="${p.orderNo}">${p.orderNo} — ${p.name}</option>`).join('');
}

function openReceiptEditor(receiptNo) {
  const wh = getInboundWarehouseScope();
  const zone = getDefaultStorageZoneCode(wh);
  currentReceiptEdit = receiptNo ? inboundReceipts.find(r => r.receiptNo === receiptNo) : null;
  document.getElementById('receipt-editor-title').textContent = currentReceiptEdit ? (currentReceiptEdit.status === 'Stocked In' ? 'View Receipt' : 'Edit Receipt') : 'Create Receipt';
  document.getElementById('receipt-warehouse').value = wh;
  document.getElementById('receipt-zone').value = zone + ' (Storage Zone)';
  populateReceiptPoSelect();

  if (currentReceiptEdit) {
    document.getElementById('receipt-type').value = currentReceiptEdit.receiptType;
    document.getElementById('receipt-po-select').value = currentReceiptEdit.purchaseOrderNo || '';
    receiptEditorLines = currentReceiptEdit.lines.map(l => ({ ...l, orderQty: l.orderQty || l.receiptQty || 0 }));
  } else {
    const draft = localStorage.getItem('receipt_draft_type');
    document.getElementById('receipt-type').value = draft || 'Purchase Receipt';
    receiptEditorLines = [];
  }
  renderReceiptEditorLines();
  setReceiptSource('po');
  openModal('receipt-editor-modal');
}

function setReceiptSource(source) {
  receiptEditorSource = source;
  document.querySelectorAll('.receipt-source-tabs .source-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.source === source);
  });
  document.getElementById('receipt-po-group').style.display = source === 'po' ? '' : 'none';
  document.getElementById('receipt-source-import').hidden = source !== 'import';
  if (source === 'po') document.getElementById('receipt-type').value = 'Purchase Receipt';
  if (source === 'products' || source === 'import') document.getElementById('receipt-type').value = 'Manual Receipt';
}

function reconVariance(line) {
  const o = Number(line.orderQty) || 0;
  const r = Number(line.receiptQty) || 0;
  if (!o && !r) return '—';
  return String(r - o);
}

function renderReceiptEditorLines() {
  document.getElementById('receipt-editor-lines').innerHTML = receiptEditorLines.map((l, i) => `
    <tr>
      <td>${l.skuId}</td><td>${l.productName}</td><td>${l.spec}</td>
      <td>${l.orderQty ?? '—'}</td>
      <td><input type="number" min="1" max="9999999" value="${l.receiptQty}" onchange="receiptEditorLines[${i}].receiptQty=parseInt(this.value,10)||0;renderReceiptEditorLines()"></td>
      <td>${reconVariance(l)}</td>
      <td>${l.zoneCode}</td>
    </tr>
  `).join('') || '<tr><td colspan="7" style="text-align:center;color:#999">No lines — link PO, add products, or import</td></tr>';
}

document.addEventListener('change', e => {
  if (e.target.id === 'receipt-po-select') {
    const po = purchaseOrders.find(p => p.orderNo === e.target.value);
    if (!po) return;
    receiptEditorLines = po.lines
      .filter(l => l.lineStatus !== 'Stocked In')
      .map(l => ({
        skuId: l.skuId,
        productName: l.productName,
        spec: l.spec,
        orderQty: l.qty,
        receiptQty: l.qty,
        zoneCode: getDefaultStorageZoneCode(po.warehouseCode)
      }));
    renderReceiptEditorLines();
  }
  if (e.target.id === 'receipt-import-file') {
    document.getElementById('receipt-import-btn').disabled = !e.target.files.length;
  }
});

function startReceiptImport() {
  if (countActiveJobs('in') >= MAX_IMPORT_JOBS) {
    showToast('At most 2 import jobs can run at the same time.', 'warning');
    return;
  }
  const file = document.getElementById('receipt-import-file');
  if (!file.files.length) {
    showToast('The imported file contains invalid fields. Please re-upload.', 'error');
    return;
  }
  inboundImportJobs++;
  document.getElementById('receipt-import-progress').hidden = false;
  let pct = 0;
  const fill = document.getElementById('receipt-import-fill');
  const label = document.getElementById('receipt-import-pct');
  const timer = setInterval(() => {
    pct += 15;
    if (pct > 100) pct = 100;
    fill.style.width = pct + '%';
    label.textContent = pct + '%';
    if (pct >= 100) {
      clearInterval(timer);
      inboundImportJobs--;
      receiptEditorLines.push({
        skuId: 'SKU-10001-WH',
        productName: 'Wireless Bluetooth Earbuds Pro',
        spec: 'White; L',
        orderQty: 0,
        receiptQty: 50,
        zoneCode: getDefaultStorageZoneCode(getInboundWarehouseScope())
      });
      renderReceiptEditorLines();
      showToast('Import completed (demo)', 'success');
      document.getElementById('receipt-import-progress').hidden = true;
    }
  }, 400);
}

function saveReceiptDraft() {
  persistReceipt('Draft');
}

function confirmReceiptStockIn() {
  if (receiptEditorLines.length === 0) {
    showToast('Add at least one SKU line before stock-in.', 'error');
    return;
  }
  persistReceipt('Stocked In', true);
}

function persistReceipt(status, writeInventory) {
  const wh = getInboundWarehouseScope();
  const zoneCode = getDefaultStorageZoneCode(wh);
  const poNo = document.getElementById('receipt-po-select').value;
  const payload = {
    receiptType: document.getElementById('receipt-type').value,
    warehouseCode: wh,
    zoneCode,
    purchaseOrderNo: poNo,
    progress: status === 'Processing' ? 45 : status === 'Stocked In' ? 100 : 0,
    updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    lines: receiptEditorLines
  };
  localStorage.setItem('receipt_draft_type', payload.receiptType);

  let receiptNo;
  if (currentReceiptEdit) {
    Object.assign(currentReceiptEdit, payload, { status });
    receiptNo = currentReceiptEdit.receiptNo;
  } else {
    receiptNo = nextDocNo('IN');
    inboundReceipts.unshift({ receiptNo, status, ...payload });
  }

  if (poNo) {
    const po = purchaseOrders.find(p => p.orderNo === poNo);
    if (po && !po.linkedReceipts.includes(receiptNo)) po.linkedReceipts.push(receiptNo);
  }
  if (writeInventory && status === 'Stocked In') {
    payload.lines.forEach(line => {
      writeInboundInventoryAndRecord(receiptNo, payload, line);
    });
    if (poNo) updatePoAfterStockIn(poNo, payload.lines);
  }

  closeModal('receipt-editor-modal');
  renderInboundReceiptList();
  renderPurchaseOrderList();
  renderHome();
  showToast(writeInventory ? 'Stocked in. Inventory & inbound records updated.' : 'Receipt saved.', 'success');
}

function writeInboundInventoryAndRecord(receiptNo, receipt, line) {
  let sku = skuData.find(s => s.skuId === line.skuId && normalizeWarehouseId(s.warehouseCode) === receipt.warehouseCode);
  if (!sku) sku = skuData.find(s => s.skuId === line.skuId);
  if (sku) {
    sku.total += line.receiptQty;
    sku.available = sku.total - sku.locked;
  }
  const recordType = receipt.receiptType === 'Purchase Receipt' ? 'Purchase Inbound' : 'Manual Inbound';
  recordData.inbound.unshift({
    time: new Date().toISOString().slice(0, 19).replace('T', ' '),
    warehouse: receipt.warehouseCode,
    zone: `${line.zoneCode} (Storage Zone)`,
    sku: line.skuId,
    qty: '+' + line.receiptQty,
    after: sku ? { total: sku.total, locked: sku.locked, available: sku.available } : { total: line.receiptQty, locked: 0, available: line.receiptQty },
    type: recordType,
    order: receiptNo,
    operator: isAdminUser() ? 'Admin' : 'Warehouse Manager',
    sub: receipt.receiptType === 'Purchase Receipt' ? 'purchase' : 'manual',
    inboundNo: receiptNo,
    inboundType: receipt.receiptType === 'Purchase Receipt' ? 'Purchase' : 'Manual',
    purchaseOrderNo: receipt.purchaseOrderNo || null
  });
}

function rollupPoStatus(po) {
  const ranks = {
    'Stocked In': 4, Received: 3, Shipped: 2, 'Pending Shipment': 1, Created: 0, Draft: 0
  };
  const statuses = po.lines.map(l => l.lineStatus);
  const unique = [...new Set(statuses)];
  if (unique.length === 1 && PO_HEAD_STATUSES.includes(unique[0])) return unique[0];
  if (statuses.some(s => s === 'Stocked In') && statuses.some(s => s !== 'Stocked In')) return 'Partially Stocked In';
  if (statuses.some(s => s === 'Received') && statuses.some(s => s !== 'Received' && s !== 'Stocked In')) return 'Partially Received';
  if (statuses.some(s => s === 'Shipped') && statuses.some(s => s === 'Pending Shipment')) return 'Partially Shipped';
  const top = statuses.sort((a, b) => (ranks[b] || 0) - (ranks[a] || 0))[0];
  return top || po.status;
}

function updatePoAfterStockIn(poNo, lines) {
  const po = purchaseOrders.find(p => p.orderNo === poNo);
  if (!po) return;
  lines.forEach(line => {
    const pl = po.lines.find(l => l.skuId === line.skuId);
    if (pl) pl.lineStatus = 'Stocked In';
  });
  po.status = rollupPoStatus(po);
}

function deleteInboundReceipt(receiptNo) {
  const r = inboundReceipts.find(x => x.receiptNo === receiptNo);
  if (!r || r.status !== 'Draft') return;
  inboundReceipts = inboundReceipts.filter(x => x.receiptNo !== receiptNo);
  renderInboundReceiptList();
  showToast('Deleted successfully.', 'success');
}

function showReceiptProgress(receiptNo) {
  showToast(`Import in progress for ${receiptNo}`, 'info');
  openReceiptEditor(receiptNo);
}

document.addEventListener('DOMContentLoaded', () => {
  initPoInboundSuggest();
  if (document.getElementById('po-table-body')) renderPurchaseOrderList();
});
