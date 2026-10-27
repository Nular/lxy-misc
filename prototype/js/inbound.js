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
    purchaseOrder: '202607001',
    shippingNo: 'KY4001086777153',
    sourceFilePreviewMatrix: [],
    lines: [
      { purchaseOrder: '202607001', shippingNo: 'KY4001086777153', importProductName: 'Wireless Bluetooth Earbuds Pro Black', skuId: 'SKU-10001-BK', productName: 'Wireless Bluetooth Earbuds Pro', spec: 'Black; M', orderQty: 200, receiptQty: 200, warehouseCode: 'SH001', zoneCode: 'SH001STO', afterChange: { total: 1200, locked: 200, available: 1000 }, lineRemarks: '' },
      { purchaseOrder: '202607001', shippingNo: 'KY4001086777153', importProductName: 'R31 Headphones', skuId: 'SKU-10001-WH', productName: 'Wireless Bluetooth Earbuds Pro', spec: 'White; L', orderQty: 50, receiptQty: 48, warehouseCode: 'SH001', zoneCode: 'SH001STO', afterChange: { total: 548, locked: 150, available: 398 }, lineRemarks: 'Short 2 pcs' }
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
    purchaseOrder: '2026082301',
    shippingNo: 'KY4002388777140',
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
    purchaseOrder: '2026082001',
    shippingNo: 'KY4002088777120',
    lines: [
      { purchaseOrder: '2026082001', shippingNo: 'KY4002088777120', itemDesc: '2 * KT88 Smart Watch Specification - Black / With light', skuId: 'SKU-10002-42', productName: 'Smart Watch Series X', spec: '42mm Silver', orderQty: 2, receiptQty: 2, warehouseCode: 'SH001', zoneCode: 'SH001STO', afterQty: 402 }
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
    purchaseOrder: '2026082401',
    shippingNo: 'SF1088776622',
    lines: [
      { purchaseOrder: '2026082401', shippingNo: 'SF1088776622', itemDesc: '1 * XD Mini Wireless 1080P HD Security Camera', skuId: 'SKU-10003-01', productName: 'Portable Power Bank 20000mAh', spec: 'Standard', orderQty: 1, receiptQty: 1, warehouseCode: 'BJ001', zoneCode: 'BJ001STO', afterQty: 3281 }
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
    purchaseOrder: '2026082501',
    shippingNo: 'KY4002588777155',
    lines: [
      { purchaseOrder: '2026082501', shippingNo: 'KY4002588777155', itemDesc: '1 * R31 headphones - Lightning', skuId: 'SKU-10001-BK', productName: 'Wireless Bluetooth Earbuds Pro', spec: 'Black; M', orderQty: 1, receiptQty: 120, warehouseCode: 'SH001', zoneCode: 'SH001STO', afterQty: 1320 }
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
let receiptSourceFileData = { name: '', dataUrl: '' };
let receiptSourcePreviewMatrix = [];
let receiptPendingImportFile = null;

const PO_PRODUCT_ALIASES = [
  { re: /r31\s*headphones?/i, productName: 'Wireless Bluetooth Earbuds Pro' },
  { re: /kt\d+\s*smart\s*watch/i, productName: 'Smart Watch Series X' },
  { re: /smart\s*watch/i, productName: 'Smart Watch Series X' },
  { re: /20000ma|power\s*bank/i, productName: 'Portable Power Bank 20000mAh' },
  { re: /earbuds?/i, productName: 'Wireless Bluetooth Earbuds Pro' }
];

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

function normalizePoProductName(name) {
  return String(name || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function resolveCanonicalProductName(importName) {
  const norm = normalizePoProductName(importName);
  for (const rule of PO_PRODUCT_ALIASES) {
    if (rule.re.test(importName)) return rule.productName;
  }
  return null;
}

function dedupeSkuCandidates(rows) {
  const seen = new Set();
  return rows.filter(s => {
    const key = s.skuId + '|' + s.zoneCode;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function matchSkusByProductName(importName, warehouseCode) {
  const wh = normalizeWarehouseId(warehouseCode);
  const pool = listWarehouseInventorySkus(wh);
  const canonical = resolveCanonicalProductName(importName);
  const norm = normalizePoProductName(importName);
  let matches = [];
  if (canonical) {
    matches = pool.filter(s => s.productName === canonical);
  } else {
    matches = pool.filter(s => {
      const pn = normalizePoProductName(s.productName);
      if (pn === norm || pn.includes(norm) || norm.includes(pn)) return true;
      const tokens = norm.split(/\s+/).filter(w => w.length > 2);
      return tokens.some(t => pn.includes(t) || normalizePoProductName(s.spec).includes(t));
    });
  }
  return dedupeSkuCandidates(matches);
}

function findHeaderIndex(headers, candidates) {
  const row = headers.map(h => normalizePoProductName(h));
  for (const c of candidates) {
    const key = normalizePoProductName(c);
    const idx = row.findIndex(h => h === key || h.includes(key) || key.includes(h));
    if (idx >= 0) return idx;
  }
  return -1;
}

function cellToDisplay(val) {
  if (val == null || val === '') return '';
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  return String(val).trim();
}

function parsePurchaseXlsxMatrix(matrix) {
  if (!matrix || !matrix.length) return { rows: [], preview: [] };
  const headers = matrix[0].map(c => cellToDisplay(c));
  const idxPo = findHeaderIndex(headers, ['采购单号', 'purchase order']);
  const idxShip = findHeaderIndex(headers, ['物流单号', 'shipping no', 'shipping no.']);
  const idxName = findHeaderIndex(headers, ['product name', 'productname', '商品名称']);
  const idxQty = findHeaderIndex(headers, ['需求数量', 'order qty']);
  if (idxName < 0 || idxQty < 0) {
    throw new Error('Missing required columns: Product Name and 需求数量');
  }
  const rows = [];
  for (let r = 1; r < matrix.length; r++) {
    const line = matrix[r];
    if (!line || !line.some(c => c !== '' && c != null)) continue;
    const productName = cellToDisplay(line[idxName]);
    const qtyRaw = line[idxQty];
    const orderQty = parseInt(String(qtyRaw).replace(/,/g, ''), 10);
    if (!productName) continue;
    if (!orderQty || orderQty < 1) continue;
    rows.push({
      row: r + 1,
      purchaseOrder: idxPo >= 0 ? cellToDisplay(line[idxPo]) : '',
      shippingNo: idxShip >= 0 ? cellToDisplay(line[idxShip]) : '',
      importProductName: productName,
      orderQty
    });
  }
  return { rows, preview: matrix.slice(0, Math.min(matrix.length, 25)) };
}

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function parsePurchaseXlsxFile(file) {
  if (typeof XLSX === 'undefined') throw new Error('XLSX parser not loaded');
  const buf = await readFileAsArrayBuffer(file);
  const wb = XLSX.read(new Uint8Array(buf), { type: 'array', cellDates: true });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  return parsePurchaseXlsxMatrix(matrix);
}

function isManualInboundReceipt(receipt) {
  return receipt?.receiptType === 'Manual Receipt' || receipt?.entryMethod === 'manual';
}

function receiptPurchaseOrder(receipt) {
  if (!receipt || receipt.receiptType !== 'Purchase Receipt') return '';
  return receipt.purchaseOrder || receipt.purchaseOrderSummary || (receipt.lines || []).map(l => l.purchaseOrder).find(Boolean) || '';
}

/** Inbound list: Manual → empty; Purchase → PO when present */
function formatInboundListPurchaseOrder(receipt) {
  if (isManualInboundReceipt(receipt)) return '—';
  const po = receiptPurchaseOrder(receipt);
  return po || '—';
}

function summarizePurchaseOrders(receipt) {
  return formatInboundListPurchaseOrder(receipt);
}

function receiptShippingNo(receipt) {
  if (!receipt || receipt.receiptType !== 'Purchase Receipt') return '';
  if (receipt.shippingNo) return receipt.shippingNo;
  const fromLines = [...new Set((receipt.lines || []).map(l => l.shippingNo).filter(Boolean))];
  if (!fromLines.length) return '';
  if (fromLines.length <= 2) return fromLines.join(', ');
  return `${fromLines[0]} +${fromLines.length - 1}`;
}

/** Inbound list: Manual → empty; Purchase → shipping no. when present */
function formatInboundListShippingNo(receipt) {
  if (isManualInboundReceipt(receipt)) return '—';
  const ship = receiptShippingNo(receipt);
  return ship || '—';
}

function summarizeShippingNos(receipt) {
  return formatInboundListShippingNo(receipt);
}

function collectShippingNosFromLines(lines) {
  return [...new Set((lines || []).map(l => l.shippingNo).filter(Boolean))];
}

/** One upload → exactly one 物流单号 (or all blank). Multiple distinct values → reject. */
function validateSingleShippingOnImport(rows) {
  const shipSet = [...new Set(rows.map(r => r.shippingNo).filter(Boolean))];
  if (shipSet.length > 1) {
    const listed = shipSet.slice(0, 4).join('、');
    const more = shipSet.length > 4 ? ` 等共 ${shipSet.length} 个` : '';
    return {
      ok: false,
      message: `一次上传仅允许一个物流单号（Shipping No.）。当前文件包含：${listed}${more}。请按物流单号拆分 Excel 后分别创建 Inbound；同一采购单可对应多个 Inbound。`
    };
  }
  const shippingNo = shipSet[0] || '';
  const normalized = rows.map(r => ({ ...r, shippingNo: r.shippingNo || shippingNo }));
  return { ok: true, rows: normalized, shippingNo };
}

function formatInboundLineAfterChange(line) {
  const after = line.afterChange;
  if (!after) return '—';
  const mock = { type: 'Purchase Inbound', qty: '+' + (line.receiptQty || 0), after };
  if (typeof formatAfterChangeHtml === 'function') return formatAfterChangeHtml(mock);
  return `T: ${after.total} / L: ${after.locked} / A: ${after.available}`;
}

function updateReceiptSourceFileMeta() {
  const meta = document.getElementById('receipt-source-file-meta');
  const btn = document.getElementById('receipt-source-preview-btn');
  const name = receiptSourceFileData.name;
  if (meta) {
    meta.hidden = !name;
    meta.textContent = name ? `Source file: ${name} (kept in system)` : '';
  }
  if (btn) btn.hidden = !receiptSourcePreviewMatrix.length;
}

function updatePurchaseOrderSummaryField() {
  const wrap = document.getElementById('receipt-purchase-order-wrap');
  const input = document.getElementById('receipt-purchase-order-summary');
  if (!wrap || !input) return;
  if (receiptEditorSource !== 'po-import') {
    wrap.hidden = true;
    return;
  }
  wrap.hidden = false;
  const pos = [...new Set(receiptEditorLines.map(l => l.purchaseOrder).filter(Boolean))];
  input.value = pos.length === 1 ? pos[0] : (pos.length > 1 ? '(multiple — keep one PO)' : '');
}

function updateShippingNoSummaryField() {
  const wrap = document.getElementById('receipt-shipping-no-wrap');
  const input = document.getElementById('receipt-shipping-no-summary');
  if (!wrap || !input) return;
  if (receiptEditorSource !== 'po-import') {
    wrap.hidden = true;
    return;
  }
  wrap.hidden = false;
  const ships = collectShippingNosFromLines(receiptEditorLines);
  input.value = ships.length === 1 ? ships[0] : (ships.length > 1 ? '(multiple — one per upload)' : '');
}

function renderSourcePreviewTable(matrix, titleHint) {
  const wrap = document.getElementById('inbound-source-preview-table-wrap');
  const hint = document.getElementById('inbound-source-preview-hint');
  const title = document.getElementById('inbound-source-preview-title');
  if (!wrap) return;
  if (title) title.textContent = 'Source file preview';
  if (hint) hint.textContent = titleHint || '';
  if (!matrix || !matrix.length) {
    wrap.innerHTML = '<p class="hint">No preview data.</p>';
    return;
  }
  const header = matrix[0].map(c => cellToDisplay(c));
  const body = matrix.slice(1);
  wrap.innerHTML = `<table><thead><tr>${header.map(h => `<th>${h || '—'}</th>`).join('')}</tr></thead><tbody>${body.map(row =>
    `<tr>${header.map((_, i) => `<td>${cellToDisplay(row[i]) || '—'}</td>`).join('')}</tr>`
  ).join('')}</tbody></table>`;
}

function openReceiptSourcePreview() {
  renderSourcePreviewTable(
    receiptSourcePreviewMatrix,
    receiptSourceFileData.name ? `File: ${receiptSourceFileData.name}` : ''
  );
  openModal('inbound-source-preview-modal');
}

function openInboundStoredSourcePreview(receiptNo) {
  const r = inboundReceipts.find(x => x.receiptNo === receiptNo);
  if (!r || !r.sourceFilePreviewMatrix?.length) {
    showToast('Source preview not available for this receipt.', 'warning');
    return;
  }
  renderSourcePreviewTable(
    r.sourceFilePreviewMatrix,
    r.sourceFile ? `File: ${r.sourceFile} (kept in system)` : ''
  );
  openModal('inbound-source-preview-modal');
}

function downloadInboundSourceFile(receiptNo) {
  const r = inboundReceipts.find(x => x.receiptNo === receiptNo);
  if (!r || !r.sourceFile) {
    showToast('No source file on this inbound.', 'warning');
    return;
  }
  if (r.sourceFileDataUrl) {
    const a = document.createElement('a');
    a.href = r.sourceFileDataUrl;
    a.download = r.sourceFile;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast(`Downloading ${r.sourceFile}`, 'success');
    return;
  }
  if (r.sourceFilePreviewMatrix?.length && typeof XLSX !== 'undefined') {
    const ws = XLSX.utils.aoa_to_sheet(r.sourceFilePreviewMatrix);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, r.sourceFile.endsWith('.xlsx') ? r.sourceFile : `${r.sourceFile.replace(/\.\w+$/, '')}.xlsx`);
    showToast('Downloaded from stored preview data.', 'success');
    return;
  }
  showToast('Source file content not available for download in demo.', 'warning');
}

function inboundDetailSourceFileHtml(r) {
  if (!r.sourceFile) return '—';
  const previewBtn = r.sourceFilePreviewMatrix?.length
    ? `<button type="button" class="btn btn-sm" onclick="openInboundStoredSourcePreview('${r.receiptNo}')">Preview</button>`
    : '';
  const downloadBtn = `<button type="button" class="btn btn-sm" onclick="downloadInboundSourceFile('${r.receiptNo}')">Download</button>`;
  return `${r.sourceFile} <span class="hint">(kept in system)</span> ${previewBtn} ${downloadBtn}`;
}

function enrichReceiptLineCommercialFields(line, skuId) {
  const sku = skuId ? skuData.find(s => s.skuId === skuId) : null;
  if (sku) {
    if (line.purchasePrice == null || line.purchasePrice === '') line.purchasePrice = sku.purchasePrice || '';
    if (line.supplier == null || line.supplier === '') line.supplier = sku.supplier || '';
    if (line.pan == null || line.pan === '') line.pan = sku.pan && sku.pan !== '-' ? sku.pan : (sku.pan || '');
  }
}

function applyReceiptLineSku(lineIndex, skuId) {
  if (!skuId) {
    receiptEditorLines[lineIndex].skuId = '';
    receiptEditorLines[lineIndex].spec = '';
    receiptEditorLines[lineIndex].skuResolved = false;
    renderReceiptEditorLines();
    return;
  }
  const line = receiptEditorLines[lineIndex];
  const wh = line.warehouseCode || getInboundWarehouseScope();
  const inv = listWarehouseInventorySkus(wh).find(s => s.skuId === skuId);
  if (!inv) {
    showToast('SKU not found in selected warehouse.', 'error');
    return;
  }
  line.skuId = inv.skuId;
  line.productName = inv.productName;
  line.spec = inv.spec;
  line.zoneCode = inv.zoneCode || getDefaultStorageZoneCode(wh);
  line.warehouseCode = wh;
  line.skuResolved = true;
  enrichReceiptLineCommercialFields(line, inv.skuId);
  renderReceiptEditorLines();
}

function receiptSkuIdCellHtml(line, lineIndex, ro) {
  const candidates = line.skuCandidates || [];
  if (ro || !candidates.length) return line.skuId ? `<strong>${line.skuId}</strong>` : '—';
  if (candidates.length === 1 && line.skuId) return `<strong>${line.skuId}</strong>`;
  const opts = candidates.map(c =>
    `<option value="${c.skuId}" ${line.skuId === c.skuId ? 'selected' : ''}>${c.skuId} — ${c.spec || '—'}</option>`
  ).join('');
  return `<select class="${line.skuId ? '' : 'input-required'}" onchange="applyReceiptLineSku(${lineIndex}, this.value)"><option value="">Select SKU ID…</option>${opts}</select>`;
}

function renderReceiptEditorLinesHead() {
  const head = document.getElementById('receipt-editor-lines-head');
  if (!head) return;
  head.innerHTML = `<tr>
    <th>SKU ID</th><th>Product Name</th><th>SKU</th>
    <th>Warehouse</th><th>Zone</th><th>Purchase Price</th>
    <th>Order Qty</th><th>Receipt Qty</th><th>Supplier</th><th>PAN</th><th>Remarks</th>
    <th style="width:72px">Action</th>
  </tr>`;
}

function receiptLineWarehouseEditable(ro) {
  return !ro && typeof isAdminAllWarehouseScope === 'function' && isAdminAllWarehouseScope();
}

function receiptCommercialInputHtml(field, lineIndex, line, ro, inputType) {
  const val = line[field] != null ? String(line[field]) : '';
  const poMode = receiptEditorSource === 'po-import';
  const readOnlyCommercial = ro || (poMode && (field === 'purchasePrice' || field === 'supplier'));
  const readOnlyPrice = ro || field === 'purchasePrice';
  const locked = field === 'purchasePrice' ? readOnlyPrice : readOnlyCommercial;
  if (locked) return val || '—';
  const type = inputType || 'text';
  return `<input type="${type}" value="${val.replace(/"/g, '&quot;')}" onchange="receiptEditorLines[${lineIndex}].${field}=this.value">`;
}

function warehouseSelectHtml(selected, lineIndex, ro) {
  const wh = normalizeWarehouseId(selected);
  if (ro || !receiptLineWarehouseEditable(ro)) {
    const name = typeof warehouseDisplayName === 'function' ? warehouseDisplayName(wh) : wh;
    return `${formatCanonicalWarehouseCode(wh)} — ${name}`;
  }
  const list = warehouses.map(w => normalizeWarehouseId(w.id));
  return `<select onchange="receiptEditorLines[${lineIndex}].warehouseCode=this.value;renderReceiptEditorLines()">${list.map(c => `<option value="${c}" ${c === wh ? 'selected' : ''}>${formatCanonicalWarehouseCode(c)}</option>`).join('')}</select>`;
}

function zoneSelectHtml(warehouseCode, selected, lineIndex, ro) {
  const wh = normalizeWarehouseId(warehouseCode);
  const zc = selected || getDefaultStorageZoneCode(wh);
  return `${zc} <span class="hint">(Storage Zone)</span>`;
}

function receiptZoneReadonlyForSource() {
  return true;
}

function openNewInboundTask() {
  receiptUnmatched = [];
  receiptSourceFileData = { name: '', dataUrl: '' };
  receiptSourcePreviewMatrix = [];
  receiptPendingImportFile = null;
  currentReceiptEdit = null;
  receiptEditorReadonly = false;
  receiptEditorLines = [];
  receiptLockedSource = null;
  receiptEditorSource = 'po-import';
  document.getElementById('receipt-type').value = '';
  document.getElementById('receipt-type-label').value = '—';
  syncReceiptWarehouseFieldUI();
  const poSum = document.getElementById('receipt-purchase-order-summary');
  if (poSum) poSum.value = '';
  const shipSum = document.getElementById('receipt-shipping-no-summary');
  if (shipSum) shipSum.value = '';
  document.getElementById('receipt-import-file').value = '';
  document.getElementById('receipt-unmatched-panel').hidden = true;
  updateReceiptSourceFileMeta();
  updatePurchaseOrderSummaryField();
  updateShippingNoSummaryField();
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
  document.getElementById('receipt-type').value = mode === 'po-import' ? 'Purchase Receipt' : 'Manual Receipt';
  document.getElementById('receipt-type-label').value = inboundTypeLabel(document.getElementById('receipt-type').value);
  syncReceiptWarehouseFieldUI();
  document.getElementById('receipt-editor-body').hidden = false;
  const typeSel = document.getElementById('receipt-type-select');
  if (typeSel) {
    typeSel.value = mode;
    typeSel.disabled = receiptEditorLines.length > 0;
  }
  const previewNo = document.getElementById('receipt-inbound-no-preview');
  if (previewNo && !currentReceiptEdit) previewNo.value = nextInboundNo();
  setReceiptSource(mode, true);
  renderReceiptEditorLinesHead();
  renderReceiptEditorLines();
  updatePurchaseOrderSummaryField();
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

/** Warehouse for New Inbound editor (header + default for new lines). */
function getReceiptEditorWarehouseCode() {
  const scope = getWarehouseScope();
  if (scope !== 'all' || !isAdminUser()) return getInboundWarehouseScope();
  const sel = document.getElementById('receipt-warehouse-select');
  if (sel && !sel.hidden && sel.value) return normalizeWarehouseId(sel.value);
  return getInboundWarehouseScope();
}

function syncReceiptWarehouseFieldUI(forceReadonly) {
  const input = document.getElementById('receipt-warehouse');
  const select = document.getElementById('receipt-warehouse-select');
  if (!input || !select) return;
  const scope = getWarehouseScope();
  const showPick = !forceReadonly && !receiptEditorReadonly && typeof isAdminAllWarehouseScope === 'function' && isAdminAllWarehouseScope();
  const code = getReceiptEditorWarehouseCode();
  if (showPick) {
    select.innerHTML = warehouses.map(w => {
      const id = normalizeWarehouseId(w.id);
      return `<option value="${id}">${formatCanonicalWarehouseCode(id)} — ${w.name}</option>`;
    }).join('');
    const cur = normalizeWarehouseId(select.value || code);
    if ([...select.options].some(o => o.value === cur)) select.value = cur;
    else select.value = normalizeWarehouseId(code);
    select.hidden = false;
    input.hidden = true;
    input.value = select.value;
  } else {
    select.hidden = true;
    input.hidden = false;
    const wh = scope !== 'all' ? normalizeWarehouseId(scope) : code;
    input.value = `${formatCanonicalWarehouseCode(wh)} — ${typeof warehouseDisplayName === 'function' ? warehouseDisplayName(wh) : wh}`;
  }
}

function onReceiptContextWarehouseChange() {
  const input = document.getElementById('receipt-warehouse');
  const select = document.getElementById('receipt-warehouse-select');
  if (input && select && !select.hidden) input.value = select.value;
  const panel = document.getElementById('receipt-manual-suggest');
  if (panel) panel.hidden = true;
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
  const show = typeof isAdminAllWarehouseScope === 'function' ? isAdminAllWarehouseScope() : (isAdminUser() && getWarehouseScope() === 'all');
  if (wrap) {
    wrap.style.display = show ? '' : 'none';
    if (!show) {
      const sel = document.getElementById('inbound-filter-warehouse');
      if (sel) sel.value = '';
    }
  }
  const th = document.getElementById('inbound-th-warehouse');
  if (th) th.hidden = !show;
}

function inboundListWarehouseCell(warehouseCode) {
  const show = typeof isAdminAllWarehouseScope === 'function' && isAdminAllWarehouseScope();
  if (!show) return '';
  const code = normalizeWarehouseId(warehouseCode || '');
  const label = typeof warehouseDisplayName === 'function' ? warehouseDisplayName(code) : code;
  return `<td>${code}<br><span class="hint">${label}</span></td>`;
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
  const showWhCol = typeof isAdminAllWarehouseScope === 'function' && isAdminAllWarehouseScope();
  const emptyColspan = showWhCol ? 9 : 8;
  tbody.innerHTML = pageRows.map(r => `
    <tr>
      <td>${r.updatedAt}</td>
      ${inboundListWarehouseCell(r.warehouseCode)}
      <td><strong>${r.receiptNo}</strong></td>
      <td>${formatInboundListPurchaseOrder(r)}</td>
      <td>${formatInboundListShippingNo(r)}</td>
      <td>${inboundTypeLabel(r.receiptType)}</td>
      <td>${r.lines.length}</td>
      <td>${r.operator || '—'}</td>
      <td style="text-align:center">${inboundViewButton(r.receiptNo)}</td>
    </tr>
  `).join('') || `<tr><td colspan="${emptyColspan}" style="text-align:center;color:#999">No data</td></tr>`;

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
  updatePurchaseOrderSummaryField();
  updateShippingNoSummaryField();
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
  const hasShipSkip = receiptUnmatched.some(u => String(u.importProductName || '').includes('(Shipping '));
  const shipIntro = hasShipSkip
    ? `<p class="hint" style="margin:0 0 8px"><strong>Multiple tracking numbers in file.</strong> Upload one shipment at a time—rows tied to other Shipping Nos. were skipped.</p>`
    : '';
  list.innerHTML = shipIntro + receiptUnmatched.map(u => `<li>Row ${u.row}: ${u.importProductName || u.itemDesc || '—'}</li>`).join('');
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

function lineRemarksRequired(line) {
  if (receiptEditorSource === 'manual') return true;
  return lineQtyMismatch(line);
}

function renderReceiptEditorLines() {
  renderReceiptEditorLinesHead();
  const ro = receiptEditorReadonly;
  const whDefault = getReceiptEditorWarehouseCode();
  const zoneRo = ro || receiptZoneReadonlyForSource();
  const poMode = receiptEditorSource === 'po-import';
  const colSpan = 12;
  document.getElementById('receipt-editor-lines').innerHTML = receiptEditorLines.map((l, i) => {
    const wh = l.warehouseCode || whDefault;
    const zc = l.zoneCode || getDefaultStorageZoneCode(wh);
    l.warehouseCode = wh;
    l.zoneCode = zc;
    const remarksRequired = lineRemarksRequired(l);
    const remarkCell = ro
      ? (l.lineRemarks || '—')
      : `<input type="text" maxlength="200" placeholder="${remarksRequired ? 'Required' : 'Optional'}" value="${l.lineRemarks || ''}" class="${remarksRequired ? 'input-required' : ''}" oninput="receiptEditorLines[${i}].lineRemarks=this.value">`;
    const orderCell = poMode
      ? (ro ? (l.orderQty ?? '—') : (l.orderQty ?? '—'))
      : (ro ? (l.orderQty ?? '—') : `<input type="number" min="1" max="9999999" value="${l.orderQty || 1}" onchange="receiptEditorLines[${i}].orderQty=parseInt(this.value,10)||0;renderReceiptEditorLines()">`);
    const deleteCell = ro
      ? '—'
      : `<button type="button" class="btn btn-sm" onclick="deleteReceiptLine(${i})">Delete</button>`;
    const displayName = l.skuId ? (l.productName || '—') : (poMode ? (l.importProductName || '—') : (l.productName || '—'));
    const skuIdCell = receiptSkuIdCellHtml(l, i, ro);
    const skuCell = l.skuId ? (l.spec || '—') : '—';
    return `
    <tr>
      <td>${skuIdCell}</td>
      <td>${displayName}</td>
      <td>${skuCell}</td>
      <td>${warehouseSelectHtml(wh, i, ro)}</td>
      <td>${zoneSelectHtml(wh, zc, i, zoneRo)}</td>
      <td>${receiptCommercialInputHtml('purchasePrice', i, l, ro, 'number')}</td>
      <td>${orderCell}</td>
      <td>${ro ? l.receiptQty : `<input type="number" min="1" max="9999999" value="${l.receiptQty}" onchange="receiptEditorLines[${i}].receiptQty=parseInt(this.value,10)||0;renderReceiptEditorLines()">`}</td>
      <td>${receiptCommercialInputHtml('supplier', i, l, ro)}</td>
      <td>${receiptCommercialInputHtml('pan', i, l, ro)}</td>
      <td>${remarkCell}</td>
      <td>${deleteCell}</td>
    </tr>`;
  }).join('') || `<tr><td colspan="${colSpan}" style="text-align:center;color:#999">No lines — upload 采购.xlsx or search products</td></tr>`;
  const typeSel = document.getElementById('receipt-type-select');
  if (typeSel && !ro) typeSel.disabled = receiptEditorLines.length > 0;
  updatePurchaseOrderSummaryField();
  updateShippingNoSummaryField();
  updateReceiptEditorChrome();
}

function deleteReceiptLine(index) {
  if (receiptEditorReadonly) return;
  if (!window.confirm('Delete this line?')) return;
  receiptEditorLines.splice(index, 1);
  if (!receiptEditorLines.length) receiptLockedSource = null;
  renderReceiptEditorLines();
}

document.addEventListener('change', e => {
  if (e.target.id === 'receipt-import-file') {
    const file = e.target.files[0];
    document.getElementById('receipt-import-btn').disabled = !file;
    receiptPendingImportFile = file || null;
    if (file) {
      readFileAsDataUrl(file).then(url => {
        receiptSourceFileData = { name: file.name, dataUrl: url };
        updateReceiptSourceFileMeta();
      });
    } else {
      receiptSourceFileData = { name: '', dataUrl: '' };
      receiptSourcePreviewMatrix = [];
      updateReceiptSourceFileMeta();
    }
  }
});

function countActiveInboundJobs() {
  return inboundImportJobs + inboundReceipts.filter(r => r.status === 'Processing').length;
}

function buildReceiptLineFromPoRow(dr, wh) {
  const zoneCode = getDefaultStorageZoneCode(wh);
  const candidates = matchSkusByProductName(dr.importProductName, wh);
  if (!candidates.length) {
    receiptUnmatched.push({ row: dr.row, importProductName: dr.importProductName, purchaseOrder: dr.purchaseOrder });
    return;
  }
  const skuCandidates = candidates.map(c => ({ skuId: c.skuId, spec: c.spec, zoneCode: c.zoneCode }));
  const single = candidates.length === 1 ? candidates[0] : null;
  receiptEditorLines.push({
    purchaseOrder: dr.purchaseOrder,
    shippingNo: dr.shippingNo || '',
    importProductName: dr.importProductName,
    productName: single ? single.productName : dr.importProductName,
    skuId: single ? single.skuId : '',
    spec: single ? single.spec : '',
    skuCandidates,
    skuResolved: !!single,
    orderQty: dr.orderQty,
    receiptQty: dr.orderQty,
    barcode: single ? primaryBarcode(single) : '',
    warehouseCode: wh,
    zoneCode: single ? (single.zoneCode || zoneCode) : zoneCode,
    purchasePrice: '',
    supplier: '',
    pan: ''
  });
  const last = receiptEditorLines[receiptEditorLines.length - 1];
  if (last) enrichReceiptLineCommercialFields(last, last.skuId);
}

async function startPoListImport() {
  if (countActiveInboundJobs() >= MAX_IMPORT_JOBS) {
    showToast('At most 2 import jobs can run at the same time.', 'warning');
    return;
  }
  const fileInput = document.getElementById('receipt-import-file');
  const file = receiptPendingImportFile || fileInput.files[0];
  if (!file) {
    showToast('Please upload 采购.xlsx before parsing.', 'error');
    return;
  }
  inboundImportJobs++;
  receiptUnmatched = [];
  document.getElementById('receipt-import-progress').hidden = false;
  const fill = document.getElementById('receipt-import-fill');
  const label = document.getElementById('receipt-import-pct');
  fill.style.width = '15%';
  label.textContent = '15%';
  try {
    let { rows, preview } = await parsePurchaseXlsxFile(file);
    receiptSourcePreviewMatrix = preview;
    receiptSourceFileData.name = file.name;
    updateReceiptSourceFileMeta();
    fill.style.width = '55%';
    label.textContent = '55%';
    const shipCheck = validateSingleShippingOnImport(rows);
    if (!shipCheck.ok) {
      receiptEditorLines = [];
      renderReceiptEditorLines();
      renderUnmatchedPanel();
      showToast(shipCheck.message, 'error');
      return;
    }
    rows = shipCheck.rows;
    fill.style.width = '70%';
    label.textContent = '70%';
    const poSet = [...new Set(rows.map(r => r.purchaseOrder).filter(Boolean))];
    let poFilterNote = '';
    if (poSet.length > 1) {
      const keep = poSet[0];
      const dropped = rows.filter(r => r.purchaseOrder && r.purchaseOrder !== keep);
      rows = rows.filter(r => !r.purchaseOrder || r.purchaseOrder === keep);
      dropped.forEach(r => receiptUnmatched.push({ row: r.row, importProductName: `${r.importProductName} (PO ${r.purchaseOrder})` }));
      poFilterNote = ` One Inbound allows one Purchase Order; kept ${keep}.`;
    }
    const wh = getReceiptEditorWarehouseCode();
    receiptEditorLines = [];
    rows.forEach(dr => buildReceiptLineFromPoRow(dr, wh));
    receiptLockedSource = 'po-import';
    setReceiptSource('po-import', true);
    renderReceiptEditorLines();
    renderUnmatchedPanel();
    fill.style.width = '100%';
    label.textContent = '100%';
    const warn = receiptUnmatched.length || poFilterNote;
    showToast(warn
      ? `Parsed ${receiptEditorLines.length} line(s); ${receiptUnmatched.length} row(s) skipped/warn.${poFilterNote}`
      : `Parsed ${receiptEditorLines.length} line(s) from ${file.name}. Shipping No.: ${shipCheck.shippingNo || '—'}`, warn ? 'warning' : 'success');
  } catch (err) {
    console.error(err);
    showToast(err.message || 'Failed to parse purchase file.', 'error');
  } finally {
    inboundImportJobs--;
    document.getElementById('receipt-import-progress').hidden = true;
  }
}

function openInboundDetailModal(receiptNo) {
  const r = inboundReceipts.find(x => x.receiptNo === receiptNo);
  if (!r) return;
  document.getElementById('inbound-detail-title').textContent = 'Inbound Detail';
  const op = r.operator || currentOperatorName();
  const lines = r.lines || [];
  const isPurchase = r.receiptType === 'Purchase Receipt';
  const body = document.getElementById('inbound-detail-body');
  body.innerHTML = `
    <div class="record-detail-grid inbound-detail-header" style="margin-bottom:16px">
      <div class="label">Time</div><div class="value">${r.updatedAt || '—'}</div>
      <div class="label">Inbound No.</div><div class="value"><strong>${r.receiptNo}</strong></div>
      <div class="label">Purchase Order</div><div class="value">${isPurchase ? summarizePurchaseOrders(r) : '—'}</div>
      <div class="label">Shipping No.</div><div class="value">${isPurchase ? summarizeShippingNos(r) : '—'}</div>
      <div class="label">Inbound Type</div><div class="value">${inboundTypeLabel(r.receiptType)}</div>
      <div class="label">SKU Qty</div><div class="value">${lines.length}</div>
      <div class="label">Operator</div><div class="value">${op}</div>
      <div class="label">Source File</div><div class="value">${inboundDetailSourceFileHtml(r)}</div>
    </div>
    <div class="table-wrapper">
      <table>
        <thead><tr>
          <th>Product Name</th><th>SKU ID</th><th>SKU</th>
          <th>Qty Added</th><th>After Change</th><th>Remark</th>
        </tr></thead>
        <tbody>
          ${lines.map(l => `<tr>
            <td>${l.importProductName || l.productName || '—'}</td>
            <td>${l.skuId}</td>
            <td>${l.spec || '—'}</td>
            <td>+${l.receiptQty}</td>
            <td class="stock-change">${formatInboundLineAfterChange(l)}</td>
            <td>${l.lineRemarks || '—'}</td>
          </tr>`).join('') || '<tr><td colspan="6" style="text-align:center;color:#999">No lines</td></tr>'}
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
  const wh = getReceiptEditorWarehouseCode();
  for (const line of receiptEditorLines) {
    if (!line.receiptQty || line.receiptQty < 1) {
      showToast('Receipt Qty must be between 1 and 9,999,999.', 'error');
      return;
    }
    if (lineRemarksRequired(line) && !(line.lineRemarks || '').trim()) {
      showToast(receiptEditorSource === 'manual'
        ? 'Remarks is required on each manual inbound line.'
        : 'Remarks is required on each line where Order Qty ≠ Receipt Qty.', 'error');
      return;
    }
    if (receiptEditorSource === 'po-import' && !line.skuId) {
      showToast('Select SKU ID for each purchase line with multiple matches.', 'error');
      return;
    }
    if (receiptEditorSource === 'manual' && !line.skuId) {
      showToast('Select SKU for each manual line in the table.', 'error');
      return;
    }
  }
  if (receiptEditorSource === 'po-import') {
    const pos = new Set(receiptEditorLines.map(l => l.purchaseOrder).filter(Boolean));
    if (pos.size > 1) {
      showToast('One Inbound No. can only bind one Purchase Order.', 'error');
      return;
    }
    const ships = collectShippingNosFromLines(receiptEditorLines);
    if (ships.length > 1) {
      showToast('一次上传仅允许一个物流单号（Shipping No.）。请拆分文件后分别入库。', 'error');
      return;
    }
    if (!ships.length) {
      showToast('采购入库须填写物流单号（Shipping No. / 物流单号）。', 'error');
      return;
    }
  }
  for (const line of receiptEditorLines) {
    const lineWh = line.warehouseCode || wh;
    if (!findInventoryRow(line.skuId, lineWh, line.zoneCode)) {
      showToast(`Stock-in failed: ${line.skuId} is not registered in this warehouse/zone.`, 'error');
      return;
    }
  }
  persistReceipt('Stocked In', true);
}

function persistReceipt(status, writeInventory) {
  const wh = getReceiptEditorWarehouseCode();
  const zoneCode = getDefaultStorageZoneCode(wh);
  const ships = collectShippingNosFromLines(receiptEditorLines);
  const shippingNo = ships.length === 1 ? ships[0] : (document.getElementById('receipt-shipping-no-summary')?.value?.trim() || '');
  const lineRemarks = receiptEditorLines.map(l => l.lineRemarks).filter(t => (t || '').trim());
  const purchaseOrder = document.getElementById('receipt-purchase-order-summary')?.value?.trim() || '';
  const payload = {
    receiptType: document.getElementById('receipt-type').value,
    warehouseCode: wh,
    zoneCode,
    remarks: lineRemarks.join('; '),
    purchaseOrder,
    shippingNo,
    operator: currentOperatorName(),
    unmatched: receiptUnmatched.slice(),
    sourceFile: receiptSourceFileData.name || document.getElementById('receipt-import-file').files[0]?.name || (currentReceiptEdit && currentReceiptEdit.sourceFile) || '',
    sourceFileDataUrl: receiptSourceFileData.dataUrl || (currentReceiptEdit && currentReceiptEdit.sourceFileDataUrl) || '',
    sourceFilePreviewMatrix: receiptSourcePreviewMatrix.slice(),
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
  const before = { total: sku.total, locked: sku.locked, available: sku.available };
  sku.total += line.receiptQty;
  sku.available = sku.total - sku.locked;
  line.afterChange = { total: sku.total, locked: sku.locked, available: sku.available };
  line.beforeChange = before;
  const recordType = receipt.receiptType === 'Purchase Receipt' ? 'Purchase Inbound' : 'Manual Inbound';
  recordData.inbound.unshift({
    time: new Date().toISOString().slice(0, 19).replace('T', ' '),
    warehouse: lineWh,
    zone: `${line.zoneCode} (Storage Zone)`,
    sku: line.skuId,
    qty: '+' + line.receiptQty,
    after: line.afterChange,
    type: recordType,
    order: receiptNo,
    operator: receipt.operator || currentOperatorName(),
    sub: receipt.receiptType === 'Purchase Receipt' ? 'purchase' : 'manual',
    inboundNo: receiptNo,
    inboundReceiptNo: receiptNo,
    inboundType: receipt.receiptType === 'Purchase Receipt' ? 'Purchase' : 'Manual',
    inboundRemarks: line.lineRemarks || receipt.remarks || '',
    productName: line.importProductName || line.productName,
    specification: line.spec,
    purchaseOrderNo: receipt.purchaseOrder || line.purchaseOrder || null,
    shippingNo: line.shippingNo || receipt.shippingNo || null
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
  const wh = getReceiptEditorWarehouseCode();
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
  const wh = getReceiptEditorWarehouseCode();
  let added = 0;
  receiptSkuPickerSelected.forEach(key => {
    const [skuId, zoneCode] = key.split('|');
    const inv = findInventoryRow(skuId, wh, zoneCode);
    if (!inv || receiptEditorLines.some(l => l.skuId === skuId && l.zoneCode === zoneCode)) return;
    if (receiptEditorLines.length >= MAX_SKU_LINES) {
      showToast('You have already uploaded 10,000 records. Adding new data will clear all existing data.', 'warning');
      return;
    }
    const manualLine = {
      skuId: inv.skuId,
      productName: inv.productName,
      spec: inv.spec,
      orderQty: 1,
      receiptQty: 1,
      barcode: primaryBarcode(inv),
      warehouseCode: wh,
      zoneCode: inv.zoneCode,
      purchasePrice: '',
      supplier: '',
      pan: ''
    };
    enrichReceiptLineCommercialFields(manualLine, inv.skuId);
    receiptEditorLines.push(manualLine);
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
  const wh = getReceiptEditorWarehouseCode();
  const pool = listWarehouseInventorySkus(wh);
  const names = [];
  const seen = new Set();
  pool.forEach(s => {
    const pn = s.productName || '';
    if (!pn) return;
    if (!pn.toLowerCase().includes(kw)) return;
    const key = pn.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    names.push(pn);
  });
  const rows = names.slice(0, 8);
  if (!rows.length) {
    panel.hidden = true;
    return;
  }
  panel.innerHTML = rows.map(pn =>
    `<div class="manual-suggest-item" data-product="${pn.replace(/"/g, '&quot;')}">
      <strong>${pn}</strong>
    </div>`
  ).join('');
  panel.hidden = false;
  panel.onclick = e => {
    const item = e.target.closest('.manual-suggest-item');
    if (!item) return;
    const productName = item.dataset.product || '';
    const candidates = pool.filter(s => (s.productName || '') === productName)
      .map(s => ({ skuId: s.skuId, spec: s.spec || '—', zoneCode: s.zoneCode }));
    if (!candidates.length) return;
    const auto = candidates.length === 1 ? candidates[0] : null;
    const newLine = {
      productName,
      skuCandidates: candidates,
      skuId: auto ? auto.skuId : '',
      spec: auto ? auto.spec : '',
      skuResolved: !!auto,
      orderQty: 1,
      receiptQty: 1,
      warehouseCode: wh,
      zoneCode: auto ? auto.zoneCode : getDefaultStorageZoneCode(wh),
      barcode: '',
      purchasePrice: '',
      supplier: '',
      pan: ''
    };
    if (auto) enrichReceiptLineCommercialFields(newLine, auto.skuId);
    receiptEditorLines.push(newLine);
    input.value = '';
    panel.hidden = true;
    renderReceiptEditorLines();
    showToast(auto ? 'Line added.' : 'Line added — select SKU ID in table.', 'success');
  };
}

document.addEventListener('DOMContentLoaded', () => {
  populateInboundListFilters();
  syncInboundListWarehouseFilterVisibility();
  if (document.getElementById('inbound-table-body')) renderInboundReceiptList();
});
