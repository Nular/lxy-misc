// Inbound module (Purchase Order Import via xlsx + Manual Import)

const MAX_IMPORT_JOBS = 2;
const MAX_SKU_LINES = 10000;
let inboundImportJobs = 0;

let inboundReceipts = [
  {
    receiptNo: 'IN-20260821001',
    receiptType: 'Purchase Receipt',
    status: 'Stocked In',
    warehouseCode: 'SH001',
    progress: 100,
    updatedAt: '2026-08-21 09:32:15',
    remarks: '文件数量与实收一致。',
    operator: 'Zhang Wei',
    sourceFile: '采购单文档订单列表.xlsx',
    entryMethod: 'po-import',
    lines: [
      { itemDesc: '200 * Wireless Bluetooth Earbuds Pro Black', skuId: 'SKU-10001-BK', productName: 'Wireless Bluetooth Earbuds Pro', spec: 'Black; M', orderQty: 200, receiptQty: 200, warehouseCode: 'SH001', zoneCode: 'SH001STO', afterQty: 1200 },
      { itemDesc: '50 * R31 headphones - Lightning', skuId: 'SKU-10001-WH', productName: 'Wireless Bluetooth Earbuds Pro', spec: 'White; L', orderQty: 50, receiptQty: 48, warehouseCode: 'SH001', zoneCode: 'SH001STO', afterQty: 548 }
    ]
  },
  {
    receiptNo: 'IN-20260823004',
    receiptType: 'Purchase Receipt',
    status: 'Processing',
    warehouseCode: 'SH001',
    progress: 45,
    updatedAt: '2026-08-23 08:05:00',
    operator: 'Admin',
    sourceFile: '采购单文档订单列表_0823.xlsx',
    entryMethod: 'po-import',
    lines: []
  },
  {
    receiptNo: 'IN-20260819005',
    receiptType: 'Manual Receipt',
    status: 'Stocked In',
    warehouseCode: 'BJ001',
    progress: 100,
    updatedAt: '2026-08-19 11:00:00',
    remarks: '无采购文件，门店退回补录。',
    operator: 'Admin',
    sourceFile: '',
    entryMethod: 'manual',
    lines: [
      { skuId: 'SKU-10003-01', productName: 'Portable Power Bank 20000mAh', spec: 'Standard', receiptQty: 80, warehouseCode: 'BJ001', zoneCode: 'BJ001STO', afterQty: 3280 }
    ]
  },
  {
    receiptNo: 'IN-20260820012',
    receiptType: 'Purchase Receipt',
    status: 'Stocked In',
    warehouseCode: 'SH001',
    progress: 100,
    updatedAt: '2026-08-20 16:45:00',
    remarks: 'KT88 少 2 件，已在备注说明。',
    operator: 'Li Ming',
    sourceFile: '采购单文档订单列表.xlsx',
    entryMethod: 'po-import',
    lines: [
      { itemDesc: '2 * KT88 Smart Watch Specification - Black / With light', skuId: 'SKU-10002-42', productName: 'Smart Watch Series X', spec: '42mm Silver', orderQty: 2, receiptQty: 2, warehouseCode: 'SH001', zoneCode: 'SH001STO', afterQty: 402 }
    ]
  },
  {
    receiptNo: 'IN-20260818008',
    receiptType: 'Manual Receipt',
    status: 'Stocked In',
    warehouseCode: 'SH001',
    progress: 100,
    updatedAt: '2026-08-18 14:20:00',
    remarks: '',
    operator: 'Zhang Wei',
    sourceFile: '',
    entryMethod: 'manual',
    lines: [
      { skuId: 'SKU-10001-BK', productName: 'Wireless Bluetooth Earbuds Pro', spec: 'Black; M', receiptQty: 30, warehouseCode: 'SH001', zoneCode: 'SH001STO', afterQty: 1030 }
    ]
  },
  {
    receiptNo: 'IN-20260824002',
    receiptType: 'Purchase Receipt',
    status: 'Stocked In',
    warehouseCode: 'BJ001',
    progress: 100,
    updatedAt: '2026-08-24 10:08:00',
    remarks: '含 1 条 ItemDesc 未匹配，已线下上架后补入。',
    operator: 'Warehouse Manager',
    sourceFile: '采购单文档订单列表.xlsx',
    entryMethod: 'po-import',
    lines: [
      { itemDesc: '1 * XD Mini Wireless 1080P HD Security Camera', skuId: 'SKU-10003-01', productName: 'Portable Power Bank 20000mAh', spec: 'Standard', orderQty: 1, receiptQty: 1, warehouseCode: 'BJ001', zoneCode: 'BJ001STO', afterQty: 3281 }
    ]
  },
  {
    receiptNo: 'IN-20260822007',
    receiptType: 'Manual Receipt',
    status: 'Stocked In',
    warehouseCode: 'SH001',
    progress: 100,
    updatedAt: '2026-08-22 09:15:00',
    remarks: '样品入库。',
    operator: 'Li Ming',
    sourceFile: '',
    entryMethod: 'manual',
    lines: [
      { skuId: 'SKU-10002-42', productName: 'Smart Watch Series X', spec: '42mm Silver', receiptQty: 5, warehouseCode: 'SH001', zoneCode: 'SH001STO', afterQty: 405 }
    ]
  },
  {
    receiptNo: 'IN-20260825011',
    receiptType: 'Purchase Receipt',
    status: 'Stocked In',
    warehouseCode: 'SH001',
    progress: 100,
    updatedAt: '2026-08-25 15:40:00',
    remarks: 'R31 耳机批量到货。',
    operator: 'Zhang Wei',
    sourceFile: '采购单文档订单列表_0825.xlsx',
    entryMethod: 'po-import',
    lines: [
      { itemDesc: '1 * R31 headphones - Lightning', skuId: 'SKU-10001-BK', productName: 'Wireless Bluetooth Earbuds Pro', spec: 'Black; M', orderQty: 1, receiptQty: 120, warehouseCode: 'SH001', zoneCode: 'SH001STO', afterQty: 1320 }
    ]
  },
  {
    receiptNo: 'IN-20260826003',
    receiptType: 'Manual Receipt',
    status: 'Stocked In',
    warehouseCode: 'BJ001',
    progress: 100,
    updatedAt: '2026-08-26 08:55:00',
    remarks: '',
    operator: 'Warehouse Manager',
    sourceFile: '',
    entryMethod: 'manual',
    lines: [
      { skuId: 'SKU-10002-42', productName: 'Smart Watch Series X', spec: '42mm Silver', receiptQty: 12, warehouseCode: 'BJ001', zoneCode: 'BJ001STO', afterQty: 112 }
    ]
  }
];

let currentReceiptEdit = null;
let receiptEditorSource = 'po-import';
let receiptLockedSource = null;
let receiptEditorLines = [];
let inboundListFiltersApplied = {};
let inboundListPage = 1;
let receiptSkuPickerSelected = new Set();
let receiptEditorReadonly = false;
let receiptUnmatched = [];

const INBOUND_VIEW_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5c-5 0-9.3 3.1-10.7 7.5C2.7 16.9 7 20 12 20s9.3-3.1 10.7-7.5C21.3 8.1 17 5 12 5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/></svg>`;

function inboundTypeLabel(receiptType) {
  return receiptType === 'Purchase Receipt' ? 'Purchase Inbound' : 'Manual Inbound';
}

function inboundViewButton(receiptNo) {
  return `<button type="button" class="record-view-btn" title="View detail" aria-label="View detail" onclick="openInboundDetailModal('${receiptNo}')">${INBOUND_VIEW_ICON}</button>`;
}

function onReceiptTypeSelectChange(mode) {
  if (!mode) {
    document.getElementById('receipt-editor-body').hidden = true;
    return;
  }
  pickInboundEditorType(mode);
}

function currentOperatorName() {
  return isAdminUser() ? 'Admin' : 'Warehouse Manager';
}

function parseItemDescQty(desc) {
  const m = String(desc || '').match(/^(\d+)\s*\*\s*(.+)$/);
  if (m) return { qty: parseInt(m[1], 10), text: m[2].trim() };
  return { qty: 1, text: String(desc || '').trim() };
}

function matchSkuByItemDesc(desc, warehouseCode) {
  const { text } = parseItemDescQty(desc);
  const norm = text.toLowerCase();
  const wh = normalizeWarehouseId(warehouseCode);
  const rules = [
    { kw: 'r31 headphones', skuId: 'SKU-10001-BK' },
    { kw: 'kt88 smart watch', skuId: 'SKU-10002-42' },
    { kw: 'xd mini wireless', skuId: 'SKU-10003-01' },
    { kw: 'earbuds', skuId: 'SKU-10001-WH' }
  ];
  for (const r of rules) {
    if (norm.includes(r.kw)) {
      const inv = skuData.find(s => s.skuId === r.skuId && normalizeWarehouseId(s.warehouseCode) === wh);
      if (inv) return inv;
    }
  }
  const candidates = listWarehouseInventorySkus(wh).filter(s => {
    const blob = `${s.productName} ${s.spec}`.toLowerCase();
    return norm.split(/\s+/).filter(w => w.length > 2).some(w => blob.includes(w));
  });
  return candidates.length === 1 ? candidates[0] : (candidates[0] || null);
}

function warehouseSelectHtml(selected, lineIndex, ro) {
  const scope = getWarehouseScope();
  let list = warehouses.map(w => normalizeWarehouseId(w.id));
  if (scope !== 'all') list = list.filter(id => id === normalizeWarehouseId(scope));
  if (ro) return selected;
  return `<select onchange="receiptEditorLines[${lineIndex}].warehouseCode=this.value;renderReceiptEditorLines()">${list.map(c => `<option value="${c}" ${c === selected ? 'selected' : ''}>${c}</option>`).join('')}</select>`;
}

function zoneSelectHtml(warehouseCode, selected, lineIndex, ro) {
  const wh = normalizeWarehouseId(warehouseCode);
  const zc = selected || getDefaultStorageZoneCode(wh);
  if (ro) return `${zc} <span class="hint">(Storage Zone)</span>`;
  const opts = zones.filter(z => normalizeWarehouseId(z.whId) === wh && z.type === 'Storage Zone');
  const codes = opts.map(z => {
    const code = normalizeWarehouseId(z.code.replace(/STO$/i, '')) + 'STO';
    return code;
  });
  if (!codes.length) codes.push(getDefaultStorageZoneCode(wh));
  return `<select onchange="receiptEditorLines[${lineIndex}].zoneCode=this.value;renderReceiptEditorLines()">${codes.map(c => `<option value="${c}" ${c === zc ? 'selected' : ''}>${c}</option>`).join('')}</select>`;
}

function receiptZoneReadonlyForSource() {
  return true;
}

function openNewInboundTask() {
  receiptUnmatched = [];
  currentReceiptEdit = null;
  receiptEditorReadonly = false;
  receiptEditorLines = [];
  receiptLockedSource = null;
  receiptEditorSource = 'po-import';
  document.getElementById('receipt-type').value = '';
  document.getElementById('receipt-type-label').value = '—';
  document.getElementById('receipt-warehouse').value = getInboundWarehouseScope();
  document.getElementById('receipt-remarks').value = '';
  document.getElementById('receipt-import-file').value = '';
  document.getElementById('receipt-unmatched-panel').hidden = true;
  const manualSearch = document.getElementById('receipt-manual-search');
  if (manualSearch) manualSearch.value = '';
  document.getElementById('receipt-editor-title').textContent = 'New Inbound';
  document.getElementById('receipt-editor-body').hidden = true;
  document.getElementById('receipt-type-hint').hidden = false;
  const typeSel = document.getElementById('receipt-type-select');
  if (typeSel) {
    typeSel.value = '';
    typeSel.disabled = false;
  }
  const previewNo = document.getElementById('receipt-inbound-no-preview');
  if (previewNo) previewNo.value = nextInboundNo();
  document.getElementById('receipt-source-po-import').hidden = true;
  document.getElementById('receipt-source-manual').hidden = true;
  renderReceiptEditorLines();
  updateReceiptEditorChrome();
  openModal('receipt-editor-modal');
}

function pickInboundEditorType(mode) {
  if (receiptLockedSource && receiptLockedSource !== mode && receiptEditorLines.length) return;
  receiptLockedSource = mode;
  receiptEditorSource = mode;
  const wh = getInboundWarehouseScope();
  document.getElementById('receipt-type').value = mode === 'po-import' ? 'Purchase Receipt' : 'Manual Receipt';
  document.getElementById('receipt-type-label').value = inboundTypeLabel(document.getElementById('receipt-type').value);
  document.getElementById('receipt-warehouse').value = wh;
  document.getElementById('receipt-editor-body').hidden = false;
  const typeSel = document.getElementById('receipt-type-select');
  if (typeSel) {
    typeSel.value = mode;
    typeSel.disabled = receiptEditorLines.length > 0;
  }
  const previewNo = document.getElementById('receipt-inbound-no-preview');
  if (previewNo && !currentReceiptEdit) previewNo.value = nextInboundNo();
  setReceiptSource(mode, true);
  renderReceiptEditorLines();
}

function nextInboundNo() {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  let max = 0;
  const re = new RegExp('^IN-' + d + '(\d{3})$');
  inboundReceipts.forEach(x => {
    const m = String(x.receiptNo).match(re);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  return `IN-${d}${String(max + 1).padStart(3, '0')}`;
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

function findInventoryRow(skuId, warehouseCode, zoneCode) {
  const wh = normalizeWarehouseId(warehouseCode);
  const zc = zoneCode || getDefaultStorageZoneCode(wh);
  return skuData.find(s =>
    s.skuId === skuId &&
    normalizeWarehouseId(s.warehouseCode) === wh &&
    s.zoneCode === zc
  );
}

function listWarehouseInventorySkus(warehouseCode) {
  const wh = normalizeWarehouseId(warehouseCode);
  return skuData.filter(s => normalizeWarehouseId(s.warehouseCode) === wh);
}

function primaryBarcode(s) {
  if (!s) return '—';
  if (s.barcode && s.barcode !== '-') return s.barcode;
  const b = (s.barcodes || []).find(x => String(x).startsWith('EAN:'));
  return b || (s.barcodes && s.barcodes[0]) || '—';
}

function toggleMultiSelect(wrapId) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  const panel = wrap.querySelector('.multi-select-panel');
  document.querySelectorAll('.multi-select-panel').forEach(p => {
    if (p !== panel) p.hidden = true;
  });
  panel.hidden = !panel.hidden;
}

function getInboundFilterCheckboxValues(wrapId) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return [];
  return [...wrap.querySelectorAll('input[type=checkbox]:checked')].map(c => c.value);
}

function readInboundListFiltersFromForm() {
  return {
    inboundNo: (document.getElementById('inbound-filter-no')?.value || '').trim(),
    operator: (document.getElementById('inbound-filter-operator')?.value || '').trim(),
    dateFrom: document.getElementById('inbound-filter-date-from')?.value || '',
    dateTo: document.getElementById('inbound-filter-date-to')?.value || '',
    receiptType: document.getElementById('inbound-filter-type')?.value || '',
    warehouse: document.getElementById('inbound-filter-warehouse')?.value || ''
  };
}

function populateInboundListFilters() {
  const whSel = document.getElementById('inbound-filter-warehouse');
  if (whSel) {
    whSel.innerHTML = '<option value="">All</option>' +
      warehouses.map(w => `<option value="${normalizeWarehouseId(w.id)}">${w.id} - ${w.name}</option>`).join('');
  }
  const ops = [...new Set(inboundReceipts.map(r => r.operator).filter(Boolean))];
  const dl = document.getElementById('inbound-operator-list');
  if (dl) dl.innerHTML = ops.map(o => `<option value="${o}">`).join('');
}

function syncInboundListWarehouseFilterVisibility() {
  const wrap = document.getElementById('inbound-filter-warehouse-wrap');
  if (!wrap) return;
  const show = isAdminUser() && getWarehouseScope() === 'all';
  wrap.style.display = show ? '' : 'none';
  if (!show) {
    const sel = document.getElementById('inbound-filter-warehouse');
    if (sel) sel.value = '';
  }
}

function receiptDateKey(updatedAt) {
  return String(updatedAt || '').slice(0, 10);
}

function inboundPassesListFilters(r, f) {
  if (f.inboundNo && !r.receiptNo.toLowerCase().includes(f.inboundNo.toLowerCase())) return false;
  if (f.operator && !(r.operator || '').toLowerCase().includes(f.operator.toLowerCase())) return false;
  if (f.receiptType && r.receiptType !== f.receiptType) return false;
  if (f.warehouse && normalizeWarehouseId(r.warehouseCode) !== normalizeWarehouseId(f.warehouse)) return false;
  const d = receiptDateKey(r.updatedAt);
  if (f.dateFrom && d && d < f.dateFrom) return false;
  if (f.dateTo && d && d > f.dateTo) return false;
  return true;
}

document.addEventListener('click', e => {
  if (!e.target.closest('.multi-select')) {
    document.querySelectorAll('.multi-select-panel').forEach(p => { p.hidden = true; });
  }
});

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
    searchInboundReceipts();
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.suggest-wrap')) panel.hidden = true;
  });
}

function renderInboundReceiptList() {
  const tbody = document.getElementById('inbound-table-body');
  if (!tbody) return;
  syncInboundListWarehouseFilterVisibility();
  const f = inboundListFiltersApplied;
  const pageSize = parseInt(document.getElementById('inbound-page-size').value, 10) || 20;

  let rows = inboundReceipts.filter(receiptMatchesScope).filter(r => inboundPassesListFilters(r, f));
  rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const total = rows.length;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  if (inboundListPage > maxPage) inboundListPage = maxPage;
  const start = (inboundListPage - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  document.getElementById('inbound-list-total').textContent = total;
  tbody.innerHTML = pageRows.map(r => `
    <tr>
      <td>${r.updatedAt}</td>
      <td><strong>${r.receiptNo}</strong></td>
      <td>${inboundTypeLabel(r.receiptType)}</td>
      <td>${r.lines.length}</td>
      <td>${r.operator || '—'}</td>
      <td style="text-align:center">${inboundViewButton(r.receiptNo)}</td>
    </tr>
  `).join('') || '<tr><td colspan="6" style="text-align:center;color:#999">No data</td></tr>';

  const pagBar = document.getElementById('inbound-pagination-info');
  if (pagBar) {
    pagBar.textContent = total ? `Page ${inboundListPage} / ${maxPage}` : 'Page 1 / 1';
  }
}

function searchInboundReceipts() {
  inboundListFiltersApplied = readInboundListFiltersFromForm();
  inboundListPage = 1;
  renderInboundReceiptList();
  showToast('Search applied', 'success');
}

function resetInboundFilters() {
  ['inbound-filter-no', 'inbound-filter-operator', 'inbound-filter-date-from', 'inbound-filter-date-to'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const ty = document.getElementById('inbound-filter-type');
  if (ty) ty.value = '';
  const wh = document.getElementById('inbound-filter-warehouse');
  if (wh) wh.value = '';
  inboundListFiltersApplied = {};
  inboundListPage = 1;
  renderInboundReceiptList();
}

function inboundPrevPage() {
  if (inboundListPage > 1) {
    inboundListPage--;
    renderInboundReceiptList();
  }
}

function inboundNextPage() {
  inboundListPage++;
  renderInboundReceiptList();
}

function inferReceiptSource(receipt) {
  if (!receipt) return 'po-import';
  if (receipt.entryMethod === 'po-import' || receipt.entryMethod === 'manual') return receipt.entryMethod;
  if (receipt.receiptType === 'Manual Receipt') return 'manual';
  return 'po-import';
}

function updateReceiptEditorChrome() {
  const ro = receiptEditorReadonly;
  const proc = currentReceiptEdit && currentReceiptEdit.status === 'Processing';
  document.getElementById('receipt-remarks').disabled = ro || proc;
  const stockBtn = document.getElementById('receipt-stock-in-btn');
  if (stockBtn) stockBtn.hidden = ro || proc;
  const printBtn = document.getElementById('receipt-print-btn');
  if (printBtn) printBtn.hidden = !(ro || (receiptEditorLines.length && !proc));
  const delAllBtn = document.getElementById('receipt-delete-all-btn');
  if (delAllBtn) delAllBtn.hidden = ro || proc || receiptEditorLines.length === 0;
  const fileEl = document.getElementById('receipt-import-file');
  document.getElementById('receipt-import-btn').disabled = ro || proc || !(fileEl && fileEl.files.length);
}

function setReceiptSource(source, silent) {
  if (receiptLockedSource && receiptLockedSource !== source && receiptEditorLines.length) return;
  receiptEditorSource = source;
  document.getElementById('receipt-source-po-import').hidden = source !== 'po-import';
  document.getElementById('receipt-source-manual').hidden = source !== 'manual';
  if (!silent && !receiptEditorReadonly) {
    document.getElementById('receipt-type').value = source === 'po-import' ? 'Purchase Receipt' : 'Manual Receipt';
    document.getElementById('receipt-type-label').value = inboundTypeLabel(document.getElementById('receipt-type').value);
  }
  if (receiptEditorLines.length && !receiptLockedSource) receiptLockedSource = source;
  updateReceiptEditorChrome();
}

function renderUnmatchedPanel() {
  const panel = document.getElementById('receipt-unmatched-panel');
  const list = document.getElementById('receipt-unmatched-list');
  if (!panel || !list) return;
  if (!receiptUnmatched.length) {
    panel.hidden = true;
    return;
  }
  panel.hidden = false;
  list.innerHTML = receiptUnmatched.map(u => `<li>Row ${u.row}: ${u.itemDesc}</li>`).join('');
}

function reconVariance(line) {
  const o = Number(line.orderQty) || 0;
  const r = Number(line.receiptQty) || 0;
  if (!o && !r) return '—';
  return String(r - o);
}

function lineQtyMismatch(line) {
  if (receiptEditorSource !== 'po-import') return false;
  const o = Number(line.orderQty) || 0;
  const r = Number(line.receiptQty) || 0;
  return o !== r;
}

function renderReceiptEditorLines() {
  const ro = receiptEditorReadonly;
  const whDefault = getInboundWarehouseScope();
  const zoneRo = ro || receiptZoneReadonlyForSource();
  document.getElementById('receipt-editor-lines').innerHTML = receiptEditorLines.map((l, i) => {
    const wh = l.warehouseCode || whDefault;
    const zc = l.zoneCode || getDefaultStorageZoneCode(wh);
    l.warehouseCode = wh;
    l.zoneCode = zc;
    const mismatch = lineQtyMismatch(l);
    const remarkCell = ro
      ? (l.lineRemarks || '—')
      : `<input type="text" maxlength="200" placeholder="${mismatch ? 'Required' : 'Optional'}" value="${l.lineRemarks || ''}" class="${mismatch ? 'input-required' : ''}" oninput="receiptEditorLines[${i}].lineRemarks=this.value">`;
    const orderCell = receiptEditorSource === 'po-import'
      ? `<span class="readonly-qty">${l.orderQty ?? '—'}</span>`
      : '—';
    const deleteCell = ro
      ? '—'
      : `<button type="button" class="btn btn-sm" onclick="deleteReceiptLine(${i})">Delete</button>`;
    return `
    <tr>
      <td>${l.skuId}</td><td>${l.productName}</td><td>${l.spec}</td>
      <td>${warehouseSelectHtml(wh, i, ro)}</td>
      <td>${zoneSelectHtml(wh, zc, i, zoneRo)}</td>
      <td>${orderCell}</td>
      <td>${ro ? l.receiptQty : `<input type="number" min="1" max="9999999" value="${l.receiptQty}" onchange="receiptEditorLines[${i}].receiptQty=parseInt(this.value,10)||0;renderReceiptEditorLines()">`}</td>
      <td>${remarkCell}</td>
      <td>${deleteCell}</td>
    </tr>`;
  }).join('') || '<tr><td colspan="9" style="text-align:center;color:#999">No lines — upload PO file or search products</td></tr>';
  const typeSel = document.getElementById('receipt-type-select');
  if (typeSel && !ro) typeSel.disabled = receiptEditorLines.length > 0;
  updateReceiptEditorChrome();
}

function deleteReceiptLine(index) {
  if (receiptEditorReadonly) return;
  receiptEditorLines.splice(index, 1);
  if (!receiptEditorLines.length) receiptLockedSource = null;
  renderReceiptEditorLines();
}

document.addEventListener('change', e => {
  if (e.target.id === 'receipt-import-file') {
    document.getElementById('receipt-import-btn').disabled = !e.target.files.length;
  }
});

function countActiveInboundJobs() {
  return inboundImportJobs + inboundReceipts.filter(r => r.status === 'Processing').length;
}

function startPoListImport() {
  if (countActiveInboundJobs() >= MAX_IMPORT_JOBS) {
    showToast('At most 2 import jobs can run at the same time.', 'warning');
    return;
  }
  const file = document.getElementById('receipt-import-file');
  if (!file.files.length) {
    showToast('The imported file contains invalid fields. Please re-upload.', 'error');
    return;
  }
  inboundImportJobs++;
  receiptUnmatched = [];
  document.getElementById('receipt-import-progress').hidden = false;
  let pct = 0;
  const fill = document.getElementById('receipt-import-fill');
  const label = document.getElementById('receipt-import-pct');
  const demoRows = [
    { row: 2, itemDesc: '1 * R31 headphones - Lightning', qty: 1 },
    { row: 4, itemDesc: '2 * KT88 Smart Watch Specification - Black / With light', qty: 2 },
    { row: 5, itemDesc: '1 * XD Mini Wireless 1080P HD Security Camera', qty: 1 },
    { row: 99, itemDesc: '1 * Unknown Gadget XYZ-404', qty: 1 }
  ];
  const timer = setInterval(() => {
    pct += 20;
    if (pct > 100) pct = 100;
    fill.style.width = pct + '%';
    label.textContent = pct + '%';
    if (pct >= 100) {
      clearInterval(timer);
      inboundImportJobs--;
      const wh = getInboundWarehouseScope();
      const zoneCode = getDefaultStorageZoneCode(wh);
      receiptEditorLines = [];
      demoRows.forEach(dr => {
        const inv = matchSkuByItemDesc(dr.itemDesc, wh);
        if (!inv) {
          receiptUnmatched.push({ row: dr.row, itemDesc: dr.itemDesc });
          return;
        }
        const parsed = parseItemDescQty(dr.itemDesc);
        receiptEditorLines.push({
          itemDesc: dr.itemDesc,
          skuId: inv.skuId,
          productName: inv.productName,
          spec: inv.spec,
          orderQty: parsed.qty,
          receiptQty: parsed.qty,
          barcode: primaryBarcode(inv),
          warehouseCode: wh,
          zoneCode: inv.zoneCode || zoneCode
        });
      });
      receiptLockedSource = 'po-import';
      setReceiptSource('po-import', true);
      renderReceiptEditorLines();
      renderUnmatchedPanel();
      showToast(receiptUnmatched.length
        ? `Parsed with ${receiptUnmatched.length} unmatched ItemDesc row(s).`
        : 'PO list parsed (demo).', receiptUnmatched.length ? 'warning' : 'success');
      document.getElementById('receipt-import-progress').hidden = true;
    }
  }, 350);
}

function openInboundDetailModal(receiptNo) {
  const r = inboundReceipts.find(x => x.receiptNo === receiptNo);
  if (!r) return;
  document.getElementById('inbound-detail-title').textContent = `Inbound ${r.receiptNo}`;
  const op = r.operator || currentOperatorName();
  const lines = r.lines || [];
  const body = document.getElementById('inbound-detail-body');
  body.innerHTML = `
    <div class="record-detail-grid" style="margin-bottom:16px">
      <div class="label">Inbound Type</div><div class="value">${inboundTypeLabel(r.receiptType)}</div>
      <div class="label">Status</div><div class="value">${r.status}</div>
      <div class="label">Remarks</div><div class="value">${r.remarks || '—'}</div>
      <div class="label">Operator</div><div class="value">${op}</div>
      <div class="label">Source file</div><div class="value">${r.sourceFile ? `${r.sourceFile} <span class="hint">(kept in system)</span>` : '—'}</div>
      ${(r.unmatched && r.unmatched.length) ? `<div class="label">Unmatched warn</div><div class="value">${r.unmatched.map(u => `Row ${u.row}: ${u.itemDesc}`).join('<br>')}</div>` : ''}
    </div>
    <div class="table-wrapper">
      <table>
        <thead><tr>
          <th>ItemDesc</th><th>SKU ID</th><th>Product Name</th><th>SKU / Spec</th>
          <th>Qty Added</th><th>After Qty</th><th>Type</th><th>Remarks</th><th>Operator</th>
        </tr></thead>
        <tbody>
          ${lines.map(l => `<tr>
            <td>${l.itemDesc || '—'}</td>
            <td>${l.skuId}</td>
            <td>${l.productName}</td>
            <td>${l.spec}</td>
            <td>+${l.receiptQty}</td>
            <td>${l.afterQty != null ? l.afterQty : '—'}</td>
            <td>${inboundTypeLabel(r.receiptType)}</td>
            <td>${l.lineRemarks || '—'}</td>
            <td>${op}</td>
          </tr>`).join('') || '<tr><td colspan="9" style="text-align:center;color:#999">No lines</td></tr>'}
        </tbody>
      </table>
    </div>`;
  openModal('inbound-detail-modal');
}

function confirmReceiptStockIn() {
  if (receiptEditorLines.length === 0) {
    showToast('Add at least one SKU line before stock-in.', 'error');
    return;
  }
  const wh = getInboundWarehouseScope();
  for (const line of receiptEditorLines) {
    if (!line.receiptQty || line.receiptQty < 1) {
      showToast('Receipt Qty must be between 1 and 9,999,999.', 'error');
      return;
    }
    if (lineQtyMismatch(line) && !(line.lineRemarks || '').trim()) {
      showToast('Remark is required on each line where Order Qty ≠ Receipt Qty.', 'error');
      return;
    }
    const lineWh = line.warehouseCode || wh;
    if (!findInventoryRow(line.skuId, lineWh, line.zoneCode)) {
      showToast(`Stock-in failed: ${line.skuId} is not registered in this warehouse/zone.`, 'error');
      return;
    }
  }
  persistReceipt('Stocked In', true);
}

function persistReceipt(status, writeInventory) {
  const wh = getInboundWarehouseScope();
  const zoneCode = getDefaultStorageZoneCode(wh);
  const payload = {
    receiptType: document.getElementById('receipt-type').value,
    warehouseCode: wh,
    zoneCode,
    remarks: document.getElementById('receipt-remarks').value.trim(),
    operator: currentOperatorName(),
    unmatched: receiptUnmatched.slice(),
    sourceFile: document.getElementById('receipt-import-file').files[0]?.name || (currentReceiptEdit && currentReceiptEdit.sourceFile) || '',
    entryMethod: receiptLockedSource || receiptEditorSource,
    progress: status === 'Processing' ? 45 : status === 'Stocked In' ? 100 : 0,
    updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    lines: receiptEditorLines.map(l => ({ ...l }))
  };

  let receiptNo;
  if (currentReceiptEdit) {
    Object.assign(currentReceiptEdit, payload, { status });
    receiptNo = currentReceiptEdit.receiptNo;
  } else {
    receiptNo = nextInboundNo();
    inboundReceipts.unshift({ receiptNo, status, ...payload });
  }

  if (writeInventory && status === 'Stocked In') {
    try {
      payload.lines.forEach(line => {
        writeInboundInventoryAndRecord(receiptNo, payload, line);
      });
    } catch (err) {
      showToast('Stock-in failed: inventory row missing. Whole receipt rolled back (demo).', 'error');
      if (currentReceiptEdit) currentReceiptEdit.status = 'Processing';
      else inboundReceipts.shift();
      return;
    }
  }

  closeModal('receipt-editor-modal');
  renderInboundReceiptList();
    renderHome();
  showToast('入库成功，库存 Available 已增加。', 'success');
}

function writeInboundInventoryAndRecord(receiptNo, receipt, line) {
  const lineWh = line.warehouseCode || receipt.warehouseCode;
  const sku = findInventoryRow(line.skuId, lineWh, line.zoneCode);
  if (!sku) {
    throw new Error('missing inventory row');
  }
  sku.total += line.receiptQty;
  sku.available = sku.total - sku.locked;
  line.afterQty = sku.total;
  const recordType = receipt.receiptType === 'Purchase Receipt' ? 'Purchase Inbound' : 'Manual Inbound';
  recordData.inbound.unshift({
    time: new Date().toISOString().slice(0, 19).replace('T', ' '),
    warehouse: lineWh,
    zone: `${line.zoneCode} (Storage Zone)`,
    sku: line.skuId,
    qty: '+' + line.receiptQty,
    after: { total: sku.total, locked: sku.locked, available: sku.available },
    type: recordType,
    order: receiptNo,
    operator: receipt.operator || currentOperatorName(),
    sub: receipt.receiptType === 'Purchase Receipt' ? 'purchase' : 'manual',
    inboundNo: receiptNo,
    inboundType: receipt.receiptType === 'Purchase Receipt' ? 'Purchase' : 'Manual',
    inboundRemarks: receipt.remarks || '',
    itemDesc: line.itemDesc || '',
    productName: line.productName,
    specification: line.spec
  });
}

function showReceiptProgress(receiptNo) {
  const r = inboundReceipts.find(x => x.receiptNo === receiptNo);
  if (!r) return;
  document.getElementById('receipt-progress-label').textContent = `Import in progress — ${receiptNo}`;
  document.getElementById('receipt-progress-detail').textContent = `${r.lines.length} line(s) loaded; warehouse ${r.warehouseCode}.`;
  document.getElementById('receipt-progress-modal-fill').style.width = (r.progress || 0) + '%';
  openModal('receipt-progress-modal');
}

function deleteAllReceiptLines() {
  if (receiptEditorReadonly || !receiptEditorLines.length) return;
  if (!confirm('Are you sure you want to delete all SKU data?')) return;
  receiptEditorLines = [];
  receiptLockedSource = null;
  const typeSel = document.getElementById('receipt-type-select');
  if (typeSel) typeSel.disabled = false;
  setReceiptSource(receiptEditorSource, true);
  renderReceiptEditorLines();
}

function printReceipt() {
  window.print();
}

function openReceiptSkuPicker() {
  if (receiptEditorReadonly) return;
  receiptSkuPickerSelected = new Set();
  document.getElementById('receipt-sku-picker-search').value = '';
  renderReceiptSkuPickerList();
  openModal('receipt-sku-picker-modal');
}

function renderReceiptSkuPickerList() {
  const tbody = document.getElementById('receipt-sku-picker-body');
  if (!tbody) return;
  const wh = getInboundWarehouseScope();
  const kw = (document.getElementById('receipt-sku-picker-search').value || '').trim().toLowerCase();
  let rows = listWarehouseInventorySkus(wh);
  if (kw) {
    rows = rows.filter(s =>
      s.skuId.toLowerCase().includes(kw) ||
      (s.productName || '').toLowerCase().includes(kw)
    );
  }
  const existing = new Set(receiptEditorLines.map(l => l.skuId + '|' + l.zoneCode));
  tbody.innerHTML = rows.map(s => {
    const key = s.skuId + '|' + s.zoneCode;
    const disabled = existing.has(key);
    const checked = receiptSkuPickerSelected.has(key);
    return `<tr>
      <td><input type="checkbox" ${disabled ? 'disabled' : ''} ${checked ? 'checked' : ''} onchange="toggleReceiptSkuPick('${key}', this.checked)"></td>
      <td>${s.skuId}</td><td>${s.productName}</td><td>${s.spec}</td><td>${s.zoneCode}</td><td>${s.total}</td>
    </tr>`;
  }).join('') || '<tr><td colspan="6" style="text-align:center;color:#999">No SKUs in this warehouse</td></tr>';
}

function toggleReceiptSkuPick(key, on) {
  if (on) receiptSkuPickerSelected.add(key);
  else receiptSkuPickerSelected.delete(key);
}

function confirmReceiptSkuPicker() {
  const wh = getInboundWarehouseScope();
  let added = 0;
  receiptSkuPickerSelected.forEach(key => {
    const [skuId, zoneCode] = key.split('|');
    const inv = findInventoryRow(skuId, wh, zoneCode);
    if (!inv || receiptEditorLines.some(l => l.skuId === skuId && l.zoneCode === zoneCode)) return;
    if (receiptEditorLines.length >= MAX_SKU_LINES) {
      showToast('You have already uploaded 10,000 records. Adding new data will clear all existing data.', 'warning');
      return;
    }
    receiptEditorLines.push({
      skuId: inv.skuId,
      productName: inv.productName,
      spec: inv.spec,
      orderQty: 0,
      receiptQty: 1,
      barcode: primaryBarcode(inv),
      warehouseCode: wh,
      zoneCode: inv.zoneCode
    });
    added++;
  });
  if (added) {
    receiptLockedSource = 'manual';
    setReceiptSource('manual', true);
    renderReceiptEditorLines();
  }
  closeModal('receipt-sku-picker-modal');
}

function renderReceiptManualSearch() {
  const panel = document.getElementById('receipt-manual-suggest');
  const input = document.getElementById('receipt-manual-search');
  if (!panel || !input) return;
  const kw = (input.value || '').trim().toLowerCase();
  if (!kw) {
    panel.hidden = true;
    return;
  }
  const wh = getInboundWarehouseScope();
  let rows = listWarehouseInventorySkus(wh).filter(s =>
    s.skuId.toLowerCase().includes(kw) || (s.productName || '').toLowerCase().includes(kw)
  ).slice(0, 8);
  if (!rows.length) {
    panel.hidden = true;
    return;
  }
  panel.innerHTML = rows.map(s =>
    `<div class="manual-suggest-item" data-sku="${s.skuId}" data-zone="${s.zoneCode}">
      <strong>${s.productName}</strong>
      <span>SKU ID: ${s.skuId} · SKU: ${s.spec}</span>
    </div>`
  ).join('');
  panel.hidden = false;
  panel.onclick = e => {
    const item = e.target.closest('.manual-suggest-item');
    if (!item) return;
    const inv = findInventoryRow(item.dataset.sku, wh, item.dataset.zone);
    if (!inv || receiptEditorLines.some(l => l.skuId === inv.skuId && l.zoneCode === inv.zoneCode)) return;
    receiptEditorLines.push({
      skuId: inv.skuId,
      productName: inv.productName,
      spec: inv.spec,
      orderQty: 0,
      receiptQty: 1,
      warehouseCode: wh,
      zoneCode: inv.zoneCode,
      barcode: primaryBarcode(inv)
    });
    input.value = '';
    panel.hidden = true;
    renderReceiptEditorLines();
    showToast('SKU line added.', 'success');
  };
}

document.addEventListener('DOMContentLoaded', () => {
  populateInboundListFilters();
  syncInboundListWarehouseFilterVisibility();
  if (document.getElementById('inbound-table-body')) renderInboundReceiptList();
});
