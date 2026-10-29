// Outbound — Import / Manual outbound (occupy → pack/ship → deduct). PRD: KickBazar-WMS-Outbound-PRD.md

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
let currentOutboundNo = null;
let currentObTab = 'all';
let obOrderCsv = '';
let obOrderImportRows = null;
let obTrackCsv = '';

function lineShippingNo(line) {
  return line.shippingNo || '—';
}

function outboundOperatorName() {
  if (typeof currentOperatorName === 'function') return currentOperatorName();
  return typeof isAdminUser === 'function' && isAdminUser() ? 'Admin' : 'Warehouse Manager';
}

function lineDisplayTime(line) {
  return line.shippedAt || line.allocatedAt || line.importedAt || line.orderTime || '—';
}

function formatObListTimeCell(line) {
  const raw = lineDisplayTime(line);
  if (!raw || raw === '—') return '—';
  const parts = String(raw).trim().split(/\s+/);
  if (parts.length < 2) return `<span class="ob-time-cell"><span class="ob-time-date">${raw}</span></span>`;
  return `<span class="ob-time-cell"><span class="ob-time-date">${parts[0]}</span><span class="ob-time-clock">${parts.slice(1).join(' ')}</span></span>`;
}

function lineOutboundTypeDisplay(line) {
  if (line.outboundType === 'manual') return 'Manual outbound';
  const st = normalizeObStatus(line.status);
  if (st === 'shipped') return 'Outbound deduct';
  if (st === 'pending_picking') return 'Outbound occupy';
  return '—';
}

function lineStoreDisplay(line) {
  if (line.outboundType === 'manual') return '—';
  const shop = (line.shop || '').trim();
  return shop || '—';
}

function linePan(line) {
  if (line.pan && /^\d{8}$/.test(line.pan)) return line.pan;
  const row = storageSku(line.warehouseId, line.skuId) || skuData.find(s => s.skuId === line.skuId);
  if (!row) return '—';
  const digits = String(row.pan || row.barcode || '').replace(/\D/g, '');
  if (digits.length >= 8) return digits.slice(-8);
  if (digits.length > 0) return digits.padStart(8, '0').slice(-8);
  return '—';
}

function lineMatchesObTimeFilter(line, filterVal) {
  if (!filterVal) return true;
  const raw = lineDisplayTime(line);
  if (!raw || raw === '—') return false;
  const lineIso = raw.replace(' ', 'T');
  const lineMs = Date.parse(lineIso);
  const filterMs = Date.parse(filterVal);
  if (Number.isNaN(lineMs) || Number.isNaN(filterMs)) {
    return raw.startsWith(filterVal.slice(0, 10));
  }
  return lineMs >= filterMs;
}

function nextOutboundInboundLinkNo() {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const prefix = `IN-${d}`;
  let max = 0;
  outboundLines.forEach(l => {
    if (!l.inboundNo || !String(l.inboundNo).startsWith(prefix)) return;
    const tail = String(l.inboundNo).slice(prefix.length);
    const n = parseInt(tail, 10);
    if (!Number.isNaN(n)) max = Math.max(max, n);
  });
  return `${prefix}${String(max + 1).padStart(3, '0')}`;
}

/** 订单列表.xlsx：ItemDesc 形如 qty*Product Name-SKU */
function parseOutboundItemDesc(itemDesc, itemQuantity) {
  const qtyCol = parseInt(String(itemQuantity).replace(/,/g, ''), 10);
  let desc = String(itemDesc || '').trim().replace(/【/g, '').replace(/】/g, '');
  const m = desc.match(/^(\d+)\s*\*\s*(.+)$/);
  const rest = m ? m[2].trim() : desc;
  const qtyFromDesc = m ? parseInt(m[1], 10) : 0;
  const qty = qtyCol > 0 ? qtyCol : (qtyFromDesc || 1);
  const skuMatch = rest.match(/-(SKU[\w-]+)$/i);
  if (skuMatch) {
    const skuId = skuMatch[1];
    const productName = rest.slice(0, -skuMatch[0].length).trim();
    return { qty, productName, skuId };
  }
  return { qty, productName: rest, skuId: '' };
}

function resolveOutboundSkuByPan(warehouseId, pan) {
  const whCode = formatCanonicalWarehouseCode(warehouseId);
  const key = String(pan || '').trim();
  if (!key) return { skuId: '—', productName: '—', spec: '—', pan: '', ok: false, error: 'Missing PAN' };
  const stoRows = listStoSkusForWarehouse(warehouseId);
  const row = stoRows.find(s => {
    const p = String(s.pan || '').trim();
    if (p && p === key) return true;
    return (s.barcodes || []).some(b => String(b).replace(/^PAN:\s*/i, '').trim() === key);
  });
  if (!row) {
    return { skuId: '—', productName: '—', spec: '—', pan: key, ok: false, error: 'PAN not found in warehouse STO' };
  }
  return {
    skuId: row.skuId,
    productName: row.productName,
    spec: row.spec || '—',
    pan: row.pan || key,
    ok: true
  };
}

function resolveOutboundSku(warehouseId, skuId, productName) {
  const whCode = formatCanonicalWarehouseCode(warehouseId);
  if (skuId) {
    const row = skuData.find(s =>
      s.skuId === skuId && formatCanonicalWarehouseCode(skuWarehouseId(s)) === whCode
    );
    if (row) return { skuId: row.skuId, productName: row.productName, spec: row.spec || '—', pan: row.pan || '', ok: !!storageSku(warehouseId, skuId) };
    const sto = storageSku(warehouseId, skuId);
    if (sto) return { skuId: sto.skuId, productName: sto.productName || productName, spec: sto.spec || '—', pan: sto.pan || '', ok: true };
    return { skuId, productName: productName || skuId, spec: '—', ok: false, error: 'No Storage Zone row for this SKU in warehouse' };
  }
  if (typeof matchSkusByProductName === 'function') {
    const matches = matchSkusByProductName(productName, whCode).filter(s => storageSku(warehouseId, s.skuId));
    if (matches.length === 1) {
      return { skuId: matches[0].skuId, productName: matches[0].productName, spec: matches[0].spec || '—', ok: true };
    }
    if (matches.length > 1) {
      return { skuId: '—', productName, spec: '—', ok: false, error: `Ambiguous product name (${matches.length} SKUs)` };
    }
  }
  return { skuId: skuId || '—', productName: productName || '—', spec: '—', ok: false, error: 'SKU not matched' };
}

function listStoSkusForWarehouse(warehouseId) {
  const code = formatCanonicalWarehouseCode(warehouseId);
  return skuData.filter(s =>
    formatCanonicalWarehouseCode(skuWarehouseId(s)) === code && /STO|Storage/i.test((s.zoneCode || '') + s.zone)
  );
}

function outboundImportWarehouseId() {
  const scope = getWarehouseScope();
  if (scope !== 'all') return scope;
  const el = document.getElementById('ob-import-wh');
  return el ? el.value : (warehouses[0] && warehouses[0].id);
}

let obImportValidatedRows = null;

function validateAndResolveOutboundRows(warehouseId, rawRows) {
  const normalized = normalizeImportRows(rawRows);
  const errors = [];
  const validRows = [];
  normalized.forEach((r, i) => {
    const rowNum = i + 2;
    if (!r['Order No']) {
      errors.push({ row: rowNum, order: '—', msg: 'Missing MerchantOrderID' });
      return;
    }
    if (!r['SKU ID']) {
      errors.push({ row: rowNum, order: r['Order No'], msg: 'Missing SKU ID' });
      return;
    }
    const pan = String(r.PAN || r.pan || '').trim();
    const qty = parseInt(r.Qty, 10) || 0;
    if (qty <= 0) {
      errors.push({ row: rowNum, order: r['Order No'], msg: 'ItemQuantity must be positive' });
      return;
    }
    const resolved = resolveOutboundSku(warehouseId, r['SKU ID'], '');
    if (!resolved.ok) {
      errors.push({ row: rowNum, order: r['Order No'], msg: resolved.error || 'SKU ID not found in warehouse STO' });
      return;
    }
    if (pan) {
      const byPan = resolveOutboundSkuByPan(warehouseId, pan);
      if (byPan.ok && byPan.skuId !== resolved.skuId) {
        errors.push({ row: rowNum, order: r['Order No'], msg: 'SKU ID does not match PAN' });
        return;
      }
    }
    validRows.push({
      'Order No': r['Order No'],
      PAN: pan || resolved.pan || '',
      Qty: qty,
      'Product Name': resolved.productName,
      'SKU ID': resolved.skuId,
      Specification: resolved.spec,
      'Order Time': r['Order Time'] || '',
      shop: (r.shop || r.Shop || '').trim()
    });
  });
  return { errors, validRows, ok: errors.length === 0 && validRows.length > 0 };
}

function renderOutboundImportValidation(result) {
  const panel = document.getElementById('ob-import-validate-panel');
  const summary = document.getElementById('ob-import-validate-summary');
  const wrap = document.getElementById('ob-import-validate-table-wrap');
  if (!panel || !summary || !wrap) return;
  if (!result || (!result.validRows.length && !result.errors.length)) {
    panel.hidden = true;
    return;
  }
  panel.hidden = false;
  if (result.errors.length) {
    panel.classList.add('inbound-alert-warn');
    summary.textContent = `${result.errors.length} row(s) failed validation. Fix the file or warehouse before import.`;
  } else {
    panel.classList.remove('inbound-alert-warn');
    summary.textContent = `All ${result.validRows.length} row(s) matched warehouse SKU rows. Ready to import.`;
  }
  const rows = result.validRows.map(v => `
    <tr><td>${v['Order No']}</td><td>${v['SKU ID']}</td><td>${v['Product Name']}</td><td>${v.Specification}</td><td>${v.PAN || '—'}</td><td>${v.Qty}</td><td class="tag tag-enable">OK</td></tr>
  `).concat(result.errors.map(e => `
    <tr><td>${e.order}</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td class="ob-hold-hint">Row ${e.row}: ${e.msg}</td></tr>
  `));
  wrap.innerHTML = `<table><thead><tr><th>Order No.</th><th>SKU ID</th><th>Product Name</th><th>SKU</th><th>PAN</th><th>Qty</th><th>Check</th></tr></thead><tbody>${rows.join('')}</tbody></table>`;
}

function applyOutboundImportPreview(rawRows) {
  const wh = outboundImportWarehouseId();
  if (!wh) {
    document.getElementById('ob-import-btn').disabled = true;
    document.getElementById('ob-import-file-msg').textContent = 'Select a warehouse.';
    return;
  }
  const result = validateAndResolveOutboundRows(wh, rawRows);
  obImportValidatedRows = result.ok ? result.validRows : null;
  renderOutboundImportValidation(result);
  const btn = document.getElementById('ob-import-btn');
  if (btn) btn.disabled = !result.ok;
  const msg = document.getElementById('ob-import-file-msg');
  if (msg) {
    if (result.ok) msg.textContent = `${result.validRows.length} row(s) validated for ${formatCanonicalWarehouseCode(wh)}.`;
    else if (result.errors.length) msg.textContent = 'Validation failed. See details below.';
    else msg.textContent = 'No importable rows.';
  }
}

function revalidateOutboundImportPreview() {
  if (obOrderImportRows && obOrderImportRows.length) applyOutboundImportPreview(obOrderImportRows);
  else if (obOrderCsv) applyOutboundImportPreview(parseCsv(obOrderCsv));
}

function parseOrderListMatrix(matrix) {
  if (!matrix || !matrix.length) return [];
  const headers = matrix[0].map(c => (typeof cellToDisplay === 'function' ? cellToDisplay(c) : String(c || '').trim()));
  const idxSku = typeof findHeaderIndex === 'function'
    ? findHeaderIndex(headers, ['sku id', 'skuid'])
    : headers.findIndex(h => /^sku\s*id$/i.test(h));
  const idxPan = typeof findHeaderIndex === 'function'
    ? findHeaderIndex(headers, ['pan'])
    : headers.findIndex(h => /^pan$/i.test(h));
  const idxOrder = typeof findHeaderIndex === 'function'
    ? findHeaderIndex(headers, ['merchantorderid', 'merchant order id', 'order no'])
    : headers.findIndex(h => /merchantorderid/i.test(h));
  const idxQty = typeof findHeaderIndex === 'function'
    ? findHeaderIndex(headers, ['itemquantity', 'item quantity', 'qty'])
    : headers.findIndex(h => /itemquantity/i.test(h));
  const idxDesc = typeof findHeaderIndex === 'function'
    ? findHeaderIndex(headers, ['itemdesc', 'item desc'])
    : headers.findIndex(h => /itemdesc/i.test(h));
  const idxShop = typeof findHeaderIndex === 'function'
    ? findHeaderIndex(headers, ['shop', 'store'])
    : headers.findIndex(h => /^shop$/i.test(h) || /^store$/i.test(h));
  if (idxOrder < 0 || idxQty < 0 || idxSku < 0) {
    throw new Error('Required columns: SKU ID, MerchantOrderID, ItemQuantity');
  }
  if (idxPan < 0 && idxDesc < 0) {
    /* PAN / ItemDesc optional when SKU ID present */
  }
  const rows = [];
  for (let r = 1; r < matrix.length; r++) {
    const line = matrix[r];
    if (!line || !line.some(c => c !== '' && c != null)) continue;
    const orderNo = (typeof cellToDisplay === 'function' ? cellToDisplay(line[idxOrder]) : String(line[idxOrder] || '').trim());
    const itemQty = line[idxQty];
    const pan = idxPan >= 0
      ? (typeof cellToDisplay === 'function' ? cellToDisplay(line[idxPan]) : String(line[idxPan] || '').trim())
      : '';
    const skuIdCol = idxSku >= 0
      ? (typeof cellToDisplay === 'function' ? cellToDisplay(line[idxSku]) : String(line[idxSku] || '').trim())
      : '';
    const itemDesc = idxDesc >= 0
      ? (typeof cellToDisplay === 'function' ? cellToDisplay(line[idxDesc]) : String(line[idxDesc] || '').trim())
      : '';
    if (!orderNo || !skuIdCol) continue;
    const qty = parseInt(String(itemQty).replace(/,/g, ''), 10) || 0;
    const shop = idxShop >= 0
      ? (typeof cellToDisplay === 'function' ? cellToDisplay(line[idxShop]) : String(line[idxShop] || '').trim())
      : '';
    rows.push({
      'MerchantOrderID': orderNo,
      'Order No': orderNo,
      'ItemQuantity': qty,
      'Qty': qty,
      'ItemDesc': itemDesc,
      PAN: pan,
      pan,
      'SKU ID': skuIdCol,
      'Product Name': '',
      shop
    });
  }
  return rows;
}

function readOrderListXlsx(file) {
  return new Promise((resolve, reject) => {
    if (typeof XLSX === 'undefined') {
      reject(new Error('XLSX parser not loaded'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const wb = XLSX.read(new Uint8Array(reader.result), { type: 'array', cellDates: true });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        resolve(parseOrderListMatrix(matrix));
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

function ymd(date) {
  const d = date || new Date();
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

/** Outbound No.: OB + yyyyMMdd + 3-digit seq (import & manual). */
function nextOutboundNo() {
  const d = ymd();
  const prefix = `OB${d}`;
  let max = 0;
  const bump = no => {
    if (!no || !String(no).startsWith(prefix)) return;
    const tail = String(no).slice(prefix.length);
    const n = parseInt(tail, 10);
    if (!Number.isNaN(n)) max = Math.max(max, n);
  };
  outboundLines.forEach(l => bump(l.outboundNo));
  outboundBatches.forEach(b => bump(b.outboundNo));
  return `${prefix}${String(max + 1).padStart(3, '0')}`;
}

function storageSku(warehouseId, skuId) {
  const code = formatCanonicalWarehouseCode(warehouseId);
  return skuData.find(s =>
    s.skuId === skuId &&
    formatCanonicalWarehouseCode(skuWarehouseId(s)) === code &&
    /STO|Storage/i.test((s.zoneCode || '') + s.zone)
  );
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
  const wh = 'SH001';
  const no = nextOutboundNo();
  outboundBatches.push({
    outboundNo: no,
    importedAt: '2026-08-21 09:10:00',
    sourceFile: 'pending-orders-0821.csv',
    warehouseId: wh,
    warehouseCode: formatCanonicalWarehouseCode(wh)
  });
  const samples = [
    { orderNo: 'SO-20260821001', skuId: 'SKU-10001-BK', name: 'Wireless Bluetooth Earbuds Pro', spec: 'Black; M', qty: 2, status: 'pending_allocation', shop: 'KickBazar Official Store' },
    { orderNo: 'SO-20260821002', skuId: 'SKU-10001-WH', name: 'Wireless Bluetooth Earbuds Pro', spec: 'White; L', qty: 1, status: 'pending_picking', preOccupy: true, shop: 'Tmall Global' },
    { orderNo: 'SO-20260821003', skuId: 'SKU-10004-01', name: 'USB-C Flash Drive', spec: '128GB', qty: 2, status: 'pending_allocation', holdReason: 'Awaiting allocation (0 available in STO)', shop: 'KickBazar Official Store' }
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
      shippingNo: '—',
      inboundNo: '—',
      importedAt: '2026-08-21 09:10:00',
      allocatedAt: '',
      shippedAt: '',
      operator: 'System',
      status: s.status,
      holdReason: s.holdReason || '',
      shop: s.shop || ''
    };
    if (s.preOccupy) {
      line.zoneCode = 'SH001STO';
      line.zone = 'Storage Zone';
      occupySku(wh, s.skuId, s.qty, no, s.orderNo, s.shop);
      line.inboundNo = nextOutboundInboundLinkNo();
      line.allocatedAt = '2026-08-21 09:15:00';
      line.operator = 'Warehouse Manager';
    }
    outboundLines.push(line);
  });
}

function occupySku(warehouseId, skuId, qty, outboundNo, orderNo, shop) {
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
    shippingNo: '—',
    status: 'Pending Picking',
    shop: (shop || '').trim()
  });
  return true;
}

function deductSku(line) {
  const sku = storageSku(line.warehouseId, line.skuId);
  if (!sku) return false;
  if (sku.locked < line.qty) return false;
  sku.locked -= line.qty;
  sku.total -= line.qty;
  sku.available = sku.total - sku.locked;
  const isManual = line.outboundType === 'manual';
  recordData.deduct.unshift({
    time: new Date().toISOString().slice(0, 19).replace('T', ' '),
    warehouse: formatCanonicalWarehouseCode(line.warehouseId),
    zone: `${line.zoneCode} (${line.zone})`,
    sku: line.skuId,
    productName: line.productName,
    specification: line.spec || '—',
    pan: linePan(line),
    qty: '-' + line.qty,
    after: { total: sku.total, locked: sku.locked, available: sku.available },
    type: isManual ? 'Manual outbound' : 'Outbound Deduct',
    order: line.outboundNo,
    operator: outboundOperatorName(),
    outboundNo: line.outboundNo,
    relatedOrderNo: line.orderNo,
    shippingNo: lineShippingNo(line),
    status: 'Shipped',
    manualReason: isManual ? (line.manualReason || '—') : undefined,
    manualRemarks: isManual ? (line.manualRemarks || '—') : undefined,
    shop: isManual ? '' : ((line.shop || '').trim())
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

function syncOutboundListWarehouseFilterVisibility() {
  const show = typeof isAdminAllWarehouseScope === 'function' ? isAdminAllWarehouseScope() : (isAdminUser() && getWarehouseScope() === 'all');
  const wrap = document.getElementById('ob-filter-warehouse-wrap');
  if (wrap) {
    wrap.style.display = show ? '' : 'none';
    if (!show) {
      const sel = document.getElementById('ob-filter-warehouse');
      if (sel) sel.value = '';
    }
  }
  const th = document.getElementById('outbound-th-warehouse');
  if (th) th.hidden = !show;
}

/** Same SKU in other warehouses (STO); sums available per warehouse (prototype “backend” lookup). */
function findAlternateWarehouseStockSameSku(line) {
  const skuId = line.skuId;
  if (!skuId) return [];
  const current = normalizeWarehouseId(line.warehouseId);
  const byWh = new Map();
  skuData.forEach(s => {
    if (s.skuId !== skuId) return;
    const wh = normalizeWarehouseId(skuWarehouseId(s));
    if (wh === current) return;
    if (!/STO|Storage/i.test((s.zoneCode || '') + s.zone)) return;
    const av = Number(s.available) || 0;
    if (av <= 0) return;
    byWh.set(wh, (byWh.get(wh) || 0) + av);
  });
  return [...byWh.entries()].map(([wh, available]) => ({
    warehouseCode: wh,
    warehouseName: typeof warehouseDisplayName === 'function' ? warehouseDisplayName(wh) : wh,
    available
  }));
}

function formatAlternateWarehouseHint(line) {
  const alts = findAlternateWarehouseStockSameSku(line);
  if (!alts.length) return '';
  const list = alts.map(a => `${a.warehouseName} ${a.available}`).join(', ');
  return `<span class="ob-alt-wh-hint">Other warehouses: ${list}</span>`;
}

function outboundListWarehouseCell(warehouseId) {
  const show = typeof isAdminAllWarehouseScope === 'function' && isAdminAllWarehouseScope();
  if (!show) return '';
  const code = formatCanonicalWarehouseCode(warehouseId);
  const label = typeof warehouseDisplayName === 'function' ? warehouseDisplayName(code) : code;
  return `<td>${code}<br><span class="hint">${label}</span></td>`;
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
  syncOutboundListWarehouseFilterVisibility();
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
  const showManualImport = outboundListTab === 'pending_allocation';
  const manualBtn = document.getElementById('ob-btn-manual-outbound');
  const importBtn = document.getElementById('ob-btn-import-export');
  if (manualBtn) manualBtn.style.display = showManualImport ? '' : 'none';
  if (importBtn) importBtn.style.display = showManualImport ? '' : 'none';
  const orderKw = (document.getElementById('ob-filter-order')?.value || '').trim().toLowerCase();
  const skuKw = (document.getElementById('ob-filter-sku')?.value || '').trim().toLowerCase();
  const panKw = (document.getElementById('ob-filter-pan')?.value || '').trim();
  const timeKw = (document.getElementById('ob-filter-time')?.value || '').trim();
  let lines = scopedOutboundLines();
  if (outboundListTab !== 'all') lines = lines.filter(l => normalizeObStatus(l.status) === outboundListTab);
  if (orderKw) lines = lines.filter(l => l.orderNo.toLowerCase().includes(orderKw));
  if (skuKw) lines = lines.filter(l => l.skuId.toLowerCase().includes(skuKw));
  if (panKw) lines = lines.filter(l => linePan(l).includes(panKw));
  if (timeKw) lines = lines.filter(l => lineMatchesObTimeFilter(l, timeKw));
  const whFilter = document.getElementById('ob-filter-warehouse')?.value || '';
  if (whFilter) lines = lines.filter(l => normalizeWarehouseId(l.warehouseId) === normalizeWarehouseId(whFilter));
  const showWhCol = typeof isAdminAllWarehouseScope === 'function' && isAdminAllWarehouseScope();
  const colSpan = showWhCol ? 15 : 14;
  body.innerHTML = lines.map(l => {
    const st = normalizeObStatus(l.status);
    const holdHint = l.holdReason && l.outboundType !== 'manual' ? `<div class="ob-hold-hint">${l.holdReason}</div>` : '';
    const specDisplay = l.outboundType === 'manual' && l.singleSkuProduct ? '—' : (l.spec || '—');
    return `<tr>
      <td><input type="checkbox" class="ob-line-check" value="${l.id}"></td>
      <td>${formatObListTimeCell(l)}</td>
      ${outboundListWarehouseCell(l.warehouseId)}
      <td><a class="btn-link" onclick="openOutboundDetail('${l.outboundNo}')">${l.outboundNo}</a></td>
      <td>${l.skuId}</td>
      <td class="ob-wrap">${l.productName}${holdHint}</td>
      <td class="ob-wrap">${specDisplay}</td>
      <td>${l.qty}</td>
      <td>${linePan(l)}</td>
      <td>${l.orderNo}</td>
      <td class="ob-wrap">${lineStoreDisplay(l)}</td>
      <td>${lineOutboundTypeDisplay(l)}</td>
      <td>${l.operator || '—'}</td>
      <td>${lineTag(l.status)}</td>
      <td>${listRowAction(l, st)}</td>
    </tr>`;
  }).join('') || `<tr><td colspan="${colSpan}" class="ob-empty">No orders in this status.</td></tr>`;
}

function setOutboundListTab(tab) {
  outboundListTab = tab;
  renderOutboundOrderList();
}

function resetOutboundListFilters() {
  ['ob-filter-order', 'ob-filter-sku', 'ob-filter-pan', 'ob-filter-time', 'ob-filter-warehouse'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  renderOutboundOrderList();
}

function toggleOutboundListChecks(on) {
  document.querySelectorAll('#ob-order-list-body .ob-line-check').forEach(el => { el.checked = on; });
}

function deleteOutboundLine(id) {
  const line = outboundLines.find(l => l.id === id);
  if (!line) return;
  if (normalizeObStatus(line.status) !== 'pending_allocation') {
    showToast('Only Pending Allocation lines can be deleted.', 'warning');
    return;
  }
  askOutboundConfirm('Delete order line', `Remove ${line.orderNo} / ${line.skuId} from outbound queue?`, () => {
    outboundLines = outboundLines.filter(l => l.id !== id);
    const still = outboundLines.some(l => l.outboundNo === line.outboundNo);
    if (!still) outboundBatches = outboundBatches.filter(b => b.outboundNo !== line.outboundNo);
    refreshAfterInventoryChange();
    renderOutboundOrderList();
    showToast('Order line deleted.', 'success');
  });
}

function listRowAction(l, st) {
  if (st === 'pending_allocation') {
    return `<a class="btn-link" onclick="confirmAllocationLine('${l.id}')">Allocate</a>
      <a class="btn-link danger" onclick="deleteOutboundLine('${l.id}')">Delete</a>`;
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
      <td>${lineShippingNo(l)}</td>
      <td>${lineTag(l.status)}</td>
      <td>${lineAction(l)}</td>
    </tr>
  `).join('') || '<tr><td colspan="11" style="text-align:center;color:#999">No lines in this tab</td></tr>';
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
    return `<span class="hint">Pack and enter Shipping No. to ship (Outbound Deduct).</span><button class="btn btn-primary" onclick="openPackTrackingModal()">Pack &amp; Ship</button>`;
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
  if (!occupySku(line.warehouseId, line.skuId, line.qty, line.outboundNo, line.orderNo, line.shop)) {
    line.holdReason = 'Insufficient available inventory';
    return false;
  }
  line.status = 'pending_picking';
  line.zone = 'Storage Zone';
  line.zoneCode = formatCanonicalWarehouseCode(line.warehouseId) + 'STO';
  line.holdReason = '';
  line.inboundNo = nextOutboundInboundLinkNo();
  line.allocatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  line.operator = outboundOperatorName();
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
    showAllocateResult([{ ok, orderNo: line.orderNo, productName: line.productName, line }]);
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
      rows.push({ ok: tryAllocate(line), orderNo: line.orderNo, productName: line.productName, line });
    });
    refreshAfterInventoryChange();
    renderOutboundOrderList();
    if (document.getElementById('page-outbound-detail')?.classList.contains('active')) renderOutboundDetail();
    showAllocateResult(rows);
  });
}

function showAllocateResult(rows) {
  document.getElementById('ob-result-body').innerHTML = rows.map(r => {
    if (r.ok) {
      return `<p>✓ ${r.orderNo} / ${r.productName}<br><span class="hint">Pending Picking · Outbound Occupy recorded.</span></p>`;
    }
    const alt = r.line ? formatAlternateWarehouseHint(r.line) : '';
    return `<p>! ${r.orderNo} / ${r.productName}<br><span class="hint">Insufficient available in this warehouse.${alt ? ` ${alt}` : ''}</span></p>`;
  }).join('') || '<p>No rows.</p>';
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
      <div class="label">Store</div><div class="value">${lineStoreDisplay(l)}</div>
      <div class="label">Shipping No.</div><div class="value">${lineShippingNo(l)}</div>
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
  const header = 'Outbound No,Order No,SKU ID,Product Name,Qty,Warehouse,Zone,Shipping No';
  const csv = [header].concat(lines.map(l =>
    [l.outboundNo, l.orderNo, l.skuId, l.productName, l.qty, formatCanonicalWarehouseCode(l.warehouseId), l.zoneCode, ''].join(',')
  )).join('\n');
  const name = `ShippingOrder_${batch ? batch.warehouseCode : 'WH'}_${ymd()}.${ext === 'csv' ? 'csv' : 'csv'}`;
  downloadTextFile(name, csv);
  closeModal('ob-export-modal');
  showToast(`Export successful. Fill Shipping No. and import via Import Shipping No. File: ${name}`, 'success');
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

function ensureOutboundImportWarehouseOptions() {
  const select = document.getElementById('ob-import-wh');
  if (!select) return;
  if (select.options.length) return;
  const scope = getWarehouseScope();
  const list = scope === 'all' ? warehouses : warehouses.filter(w => w.id === scope);
  select.innerHTML = list.map(w => `<option value="${w.id}">${formatCanonicalWarehouseCode(w.id)} — ${w.name}</option>`).join('');
}

function buildOutboundSampleCsv(warehouseId) {
  const matrix = outboundSampleMatrixForWarehouse(warehouseId);
  if (!matrix) return null;
  return matrix.map(row => row.join(',')).join('\n');
}

function outboundSampleMatrixForWarehouse(warehouseId) {
  const orderId = 'MO-DEMO-2026';
  const pick = listStoSkusForWarehouse(warehouseId).filter(s => (s.available ?? 0) > 0 || (s.total ?? 0) > 0).slice(0, 2);
  if (!pick.length) return null;
  return [['SKU ID', 'PAN', 'MerchantOrderID', 'ItemQuantity', 'Shop']].concat(
    pick.map(s => [s.skuId, s.pan || '', orderId, 1, 'KickBazar Official Store'])
  );
}

function downloadOutboundOrderSampleFile() {
  ensureOutboundImportWarehouseOptions();
  const wh = outboundImportWarehouseId() || 'SH001';
  const matrix = outboundSampleMatrixForWarehouse(wh) || outboundSampleMatrixForWarehouse('SH001');
  if (!matrix) {
    showToast('No demo STO SKUs for sample file.', 'error');
    return;
  }
  if (typeof XLSX !== 'undefined') {
    const ws = XLSX.utils.aoa_to_sheet(matrix);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, '订单列表-demo.xlsx');
    showToast('Downloaded 订单列表-demo.xlsx — upload or click Use sample file.', 'success');
    return;
  }
  const csv = matrix.map(row => row.join(',')).join('\n');
  downloadTextFile('订单列表-demo.csv', csv);
  showToast('Downloaded 订单列表-demo.csv', 'success');
}

function openImportOrders() {
  const select = document.getElementById('ob-import-wh');
  const scope = getWarehouseScope();
  const list = scope === 'all' ? warehouses : warehouses.filter(w => w.id === scope);
  select.innerHTML = list.map(w => `<option value="${w.id}">${formatCanonicalWarehouseCode(w.id)} — ${w.name}</option>`).join('');
  const showWhPick = scope === 'all' && isAdminUser();
  document.getElementById('ob-import-wh-wrap').style.display = showWhPick ? '' : 'none';
  obOrderCsv = '';
  obOrderImportRows = null;
  obImportValidatedRows = null;
  document.getElementById('ob-import-step-upload').hidden = false;
  document.getElementById('ob-import-step-progress').hidden = true;
  document.getElementById('ob-import-preview').hidden = true;
  const validatePanel = document.getElementById('ob-import-validate-panel');
  if (validatePanel) validatePanel.hidden = true;
  document.getElementById('ob-import-file-msg').textContent = '';
  document.getElementById('ob-import-btn').disabled = true;
  document.getElementById('ob-import-btn').textContent = 'Import';
  document.getElementById('ob-import-btn').onclick = runImportOrders;
  document.getElementById('ob-import-cancel').disabled = false;
  openModal('ob-import-modal');
}

function fillSampleOrderCsv() {
  try {
    ensureOutboundImportWarehouseOptions();
    const whSelect = document.getElementById('ob-import-wh');
    const scope = getWarehouseScope();
    if (whSelect && scope === 'all' && [...whSelect.options].some(o => o.value === 'SH001')) {
      whSelect.value = 'SH001';
    }
    const wh = outboundImportWarehouseId();
    if (!wh) {
      showToast('Select a warehouse before using the sample.', 'warning');
      return;
    }
    obOrderImportRows = null;
    obOrderCsv = buildOutboundSampleCsv(wh);
    if (!obOrderCsv) {
      showToast(`Sample needs STO inventory in ${formatCanonicalWarehouseCode(wh)}. Switch sidebar warehouse to SH001 or BJ001.`, 'error');
      return;
    }
    const preview = document.getElementById('ob-import-preview');
    const msg = document.getElementById('ob-import-file-msg');
    if (preview) {
      preview.hidden = false;
      preview.textContent = obOrderCsv;
    }
    if (msg) {
      msg.textContent = `Sample 订单列表 (MO-DEMO-2026) for ${formatCanonicalWarehouseCode(wh)}: ${parseCsv(obOrderCsv).length} line(s). Allocate → Pack & Ship.`;
    }
    applyOutboundImportPreview(parseCsv(obOrderCsv));
  } catch (err) {
    console.error(err);
    showToast(err.message || 'Sample file failed to load.', 'error');
  }
}

function onOutboundFilePicked(input, kind) {
  const file = input.files && input.files[0];
  if (!file) return;
  const name = (file.name || '').toLowerCase();
  if (kind === 'orders' && (name.endsWith('.xlsx') || name.endsWith('.xls'))) {
    readOrderListXlsx(file).then(rows => {
      obOrderImportRows = rows;
      obOrderCsv = '';
      document.getElementById('ob-import-preview').hidden = false;
      document.getElementById('ob-import-preview').textContent = JSON.stringify(rows.slice(0, 5), null, 2);
      if (!rows.length) {
        obImportValidatedRows = null;
        document.getElementById('ob-import-btn').disabled = true;
        document.getElementById('ob-import-file-msg').textContent = 'No valid rows.';
        renderOutboundImportValidation({ errors: [], validRows: [] });
        return;
      }
      document.getElementById('ob-import-file-msg').textContent = `Parsed ${rows.length} line(s) from ${file.name}. Validating…`;
      applyOutboundImportPreview(rows);
    }).catch(err => {
      obOrderImportRows = null;
      document.getElementById('ob-import-btn').disabled = true;
      document.getElementById('ob-import-file-msg').textContent = err.message || 'Parse failed.';
      showToast(err.message || 'Failed to parse xlsx.', 'error');
    });
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    if (kind === 'orders') {
      obOrderCsv = String(reader.result || '');
      obOrderImportRows = null;
      document.getElementById('ob-import-preview').hidden = false;
      document.getElementById('ob-import-preview').textContent = obOrderCsv.slice(0, 800);
      const ok = /merchantorderid/i.test(obOrderCsv) || obOrderCsv.includes('SKU ID');
      if (!ok) {
        obImportValidatedRows = null;
        document.getElementById('ob-import-btn').disabled = true;
        document.getElementById('ob-import-file-msg').textContent = 'Required: SKU ID, MerchantOrderID, ItemQuantity (legacy ItemDesc-only templates need a SKU ID column).';
        renderOutboundImportValidation({ errors: [], validRows: [] });
        return;
      }
      document.getElementById('ob-import-file-msg').textContent = 'Upload successful. Validating…';
      applyOutboundImportPreview(parseCsv(obOrderCsv));
    } else {
      obTrackCsv = String(reader.result || '');
      document.getElementById('ob-track-preview').textContent = obTrackCsv.slice(0, 800);
      document.getElementById('ob-track-btn').disabled = !/shipping\s*no/i.test(obTrackCsv);
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

function normalizeImportRows(raw) {
  return raw.map(r => {
    const orderNo = r['MerchantOrderID'] || r['Order No'];
    const pan = String(r.PAN || r.pan || '').trim();
    let skuId = String(r['SKU ID'] || '').trim();
    let productName = r['Product Name'] || '';
    let qty = parseInt(String(r.Qty || r.ItemQuantity || '').replace(/,/g, ''), 10) || 0;
    if (!skuId && r.ItemDesc) {
      const parsed = parseOutboundItemDesc(r.ItemDesc, r.ItemQuantity || r.Qty);
      skuId = parsed.skuId;
      productName = parsed.productName;
      if (!qty && parsed.qty) qty = parsed.qty;
    }
    return {
      'Order No': orderNo,
      PAN: pan,
      pan,
      Qty: qty,
      'Product Name': productName,
      'SKU ID': skuId,
      'Order Time': r['Order Time'] || '',
      Specification: r.Specification || '—',
      shop: (r.shop || r.Shop || '').trim()
    };
  });
}

function runImportOrders() {
  if (!obImportValidatedRows || !obImportValidatedRows.length) {
    showToast('Fix validation errors or upload a valid file before import.', 'error');
    return;
  }
  const rows = obImportValidatedRows.map(r => ({ ...r }));
  document.getElementById('ob-import-step-upload').hidden = true;
  document.getElementById('ob-import-preview').hidden = true;
  document.getElementById('ob-import-step-progress').hidden = false;
  document.getElementById('ob-import-btn').disabled = true;
  document.getElementById('ob-import-btn').textContent = 'Importing';
  document.getElementById('ob-import-cancel').disabled = true;
  const scope = getWarehouseScope();
  const wh = scope === 'all' ? document.getElementById('ob-import-wh').value : scope;
  const outboundNo = nextOutboundNo();
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
      productName: r['Product Name'],
      spec: r.Specification || '—',
      qty: parseInt(r.Qty, 10) || 0,
      warehouseId: wh,
      zone: '—',
      zoneCode: '—',
      shippingNo: '—',
      inboundNo: '—',
      importedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      allocatedAt: '',
      shippedAt: '',
      operator: 'System',
      status: 'pending_allocation',
      holdReason: '',
      shop: (r.shop || '').trim()
    };
    line.pan = linePan(line);
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
      obOrderImportRows = null;
      obImportValidatedRows = null;
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
  obTrackCsv = 'Outbound No,Order No,SKU ID,Shipping No\n' + lines.map((l, i) => `${l.outboundNo},${l.orderNo},${l.skuId},SF${ymd()}${String(i + 1).padStart(4, '0')}`).join('\n');
  document.getElementById('ob-track-preview').textContent = obTrackCsv || 'No allocated lines';
  document.getElementById('ob-track-btn').disabled = !lines.length;
}

function runImportTracking() {
  const rows = parseCsv(obTrackCsv);
  let matched = 0;
  let failed = 0;
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
    const shippingNo = (r['Shipping No'] || '').trim();
    if (!shippingNo) {
      failed += 1;
      return;
    }
    line.shippingNo = shippingNo;
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
  document.getElementById('ob-pack-shipping').value = '';
  const ids = onlyId ? [onlyId] : selectedLineIds();
  let targets = outboundLines.filter(l => normalizeObStatus(l.status) === 'pending_picking' && (!ids.length || ids.includes(l.id)));
  if (currentOutboundNo && document.getElementById('page-outbound-detail')?.classList.contains('active')) {
    targets = targets.filter(l => l.outboundNo === currentOutboundNo);
  }
  const wrap = document.getElementById('ob-pack-table-wrap');
  if (wrap) {
    wrap.innerHTML = `<table><thead><tr><th>SKU ID</th><th>Product Name</th><th>SKU</th><th>QTY</th></tr></thead><tbody>${
      targets.map(l => `<tr><td>${l.skuId}</td><td>${l.productName}</td><td>${l.singleSkuProduct ? '—' : (l.spec || '—')}</td><td>${l.qty}</td></tr>`).join('')
    }</tbody></table>`;
  }
  const hint = document.getElementById('ob-pack-hint');
  if (hint) {
    hint.textContent = targets.some(l => l.outboundType !== 'manual')
      ? 'Confirm packed lines below. Shipping No. is required for imported orders; optional for Manual outbound only.'
      : 'Confirm packed lines below. Shipping No. is optional for Manual outbound.';
  }
  openModal('ob-pack-modal');
}

function submitPackAndShip() {
  const onlyId = document.getElementById('ob-pack-line-id').value;
  const shippingNo = (document.getElementById('ob-pack-shipping').value || '').trim();
  const ids = onlyId ? [onlyId] : selectedLineIds();
  let targets = outboundLines.filter(l => normalizeObStatus(l.status) === 'pending_picking' && (!ids.length || ids.includes(l.id)));
  if (currentOutboundNo && document.getElementById('page-outbound-detail')?.classList.contains('active')) {
    targets = targets.filter(l => l.outboundNo === currentOutboundNo);
  }
  if (!targets.length) {
    showToast('No Pending Picking lines selected.', 'warning');
    return;
  }
  const needsShipping = targets.some(l => l.outboundType !== 'manual');
  if (needsShipping && !shippingNo) {
    showToast('Shipping No. is required for imported order lines.', 'warning');
    return;
  }
  let ok = 0;
  let fail = 0;
  targets.forEach(l => {
    l.shippingNo = shippingNo;
    if (!deductSku(l)) {
      fail += 1;
      return;
    }
    l.status = 'shipped';
    l.shippedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    l.operator = outboundOperatorName();
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

const MANUAL_OUTBOUND_REASONS = [
  { code: 'SAMPLE', label: 'Sample' },
  { code: 'DAMAGE', label: 'Damage / write-off' },
  { code: 'INTERNAL', label: 'Internal use' },
  { code: 'OTHER', label: 'Other (note required)' }
];

function openManualOutboundModal() {
  renderManualOutboundForm();
  openModal('ob-special-modal');
}

function openSpecialOutboundModal() {
  openManualOutboundModal();
}

function specialOutboundWarehouseId() {
  const scope = getWarehouseScope();
  if (scope !== 'all') return scope;
  const showWh = isAdminUser();
  if (!showWh) return MANAGER_ASSIGNED_WH;
  const el = document.getElementById('sx-wh');
  return el ? el.value : (warehouses[0] && warehouses[0].id);
}

function renderManualOutboundForm() {
  const scope = getWarehouseScope();
  const showWhPick = scope === 'all' && isAdminUser();
  const whWrap = document.getElementById('sx-wh-wrap');
  if (whWrap) whWrap.style.display = showWhPick ? '' : 'none';
  const whSelect = document.getElementById('sx-wh');
  const list = scope === 'all' ? warehouses : warehouses.filter(w => w.id === scope);
  whSelect.innerHTML = list.map(w => `<option value="${w.id}">${formatCanonicalWarehouseCode(w.id)} — ${w.name}</option>`).join('');
  if (!showWhPick && scope !== 'all') whSelect.value = scope;
  const reason = document.getElementById('sx-reason');
  reason.innerHTML = MANUAL_OUTBOUND_REASONS.map(r => `<option value="${r.code}">${r.label}</option>`).join('');
  document.getElementById('sx-product').value = '';
  const skuDisp = document.getElementById('sx-sku-id-display');
  if (skuDisp) skuDisp.value = '';
  document.getElementById('sx-remarks').value = '';
  onSxWarehouseChange();
}

function onSxWarehouseChange() {
  onSxProductInput();
  const skuSelect = document.getElementById('sx-sku-id');
  if (skuSelect) skuSelect.innerHTML = '<option value="">Select product first</option>';
  const skuDisp = document.getElementById('sx-sku-id-display');
  if (skuDisp) skuDisp.value = '';
}

function onSxProductInput() {
  const wh = specialOutboundWarehouseId();
  const kw = (document.getElementById('sx-product').value || '').trim().toLowerCase();
  const rows = listStoSkusForWarehouse(wh);
  const names = new Set();
  rows.forEach(s => {
    const pn = (s.productName || '').toLowerCase();
    if (!kw || pn.includes(kw)) names.add(s.productName || s.skuId);
  });
  const list = document.getElementById('sx-product-list');
  list.innerHTML = [...names].sort().slice(0, 40).map(n => `<option value="${n.replace(/"/g, '&quot;')}">`).join('');
}

function onSxProductPick() {
  const wh = specialOutboundWarehouseId();
  const name = (document.getElementById('sx-product').value || '').trim();
  const skuSelect = document.getElementById('sx-sku-id');
  if (!name) {
    skuSelect.innerHTML = '<option value="">Select product first</option>';
    const skuDisp = document.getElementById('sx-sku-id-display');
    if (skuDisp) skuDisp.value = '';
    return;
  }
  const rows = listStoSkusForWarehouse(wh).filter(s =>
    (s.productName || '').toLowerCase() === name.toLowerCase() ||
    (typeof matchSkusByProductName === 'function' && matchSkusByProductName(name, wh).some(m => m.skuId === s.skuId))
  );
  const uniq = [];
  const seen = new Set();
  rows.forEach(s => {
    if (seen.has(s.skuId)) return;
    seen.add(s.skuId);
    uniq.push(s);
  });
  skuSelect.innerHTML = uniq.length
    ? uniq.map(s => `<option value="${s.skuId}">${s.spec || s.skuId}</option>`).join('')
    : '<option value="">No STO row for this product</option>';
  if (uniq.length) {
    if (uniq.length === 1 || !uniq.some(s => s.skuId === skuSelect.value)) {
      skuSelect.value = uniq[0].skuId;
    }
    onSxSkuPick();
  } else {
    const skuDisp = document.getElementById('sx-sku-id-display');
    if (skuDisp) skuDisp.value = '';
  }
}

function onSxSkuPick() {
  const wh = specialOutboundWarehouseId();
  const skuId = document.getElementById('sx-sku-id').value;
  const skuDisp = document.getElementById('sx-sku-id-display');
  if (skuDisp) skuDisp.value = skuId || '';
}

function submitManualOutbound() {
  const wh = specialOutboundWarehouseId();
  const productName = (document.getElementById('sx-product').value || '').trim();
  const skuId = document.getElementById('sx-sku-id').value;
  const qty = parseInt(document.getElementById('sx-qty').value, 10);
  const reasonCode = document.getElementById('sx-reason').value;
  const note = (document.getElementById('sx-remarks').value || '').trim();
  if (!productName) {
    showToast('Product Name is required.', 'warning');
    return;
  }
  if (!skuId || !qty || qty < 1) {
    showToast('Select SKU and enter a valid QTY.', 'warning');
    return;
  }
  if (!reasonCode) {
    showToast('Reason is required.', 'warning');
    return;
  }
  if (reasonCode === 'OTHER' && !note) {
    showToast('Remarks are required when Reason is Other.', 'warning');
    return;
  }
  const sku = storageSku(wh, skuId);
  if (!sku) {
    showToast('SKU not found in warehouse STO.', 'error');
    return;
  }
  const outboundNo = nextOutboundNo();
  const reasonLabel = MANUAL_OUTBOUND_REASONS.find(r => r.code === reasonCode)?.label || reasonCode;
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const pan = linePan({ warehouseId: wh, skuId, pan: null });
  outboundLines.unshift({
    id: 'MO' + Date.now(),
    outboundNo,
    outboundType: 'manual',
    orderNo: '(Manual)',
    orderTime: now,
    skuId,
    productName: sku.productName || productName,
    spec: sku.spec || '—',
    singleSkuProduct: false,
    qty,
    pan,
    warehouseId: wh,
    zone: '—',
    zoneCode: '—',
    shippingNo: '—',
    inboundNo: '—',
    importedAt: now,
    allocatedAt: '',
    shippedAt: '',
    operator: outboundOperatorName(),
    status: 'pending_allocation',
    holdReason: '',
    manualReason: reasonLabel,
    manualRemarks: note
  });
  outboundBatches.unshift({
    outboundNo,
    importedAt: now,
    sourceFile: 'manual-outbound',
    warehouseId: wh,
    warehouseCode: formatCanonicalWarehouseCode(wh)
  });
  document.getElementById('sx-qty').value = '1';
  document.getElementById('sx-remarks').value = '';
  closeModal('ob-special-modal');
  showToast(`Manual outbound ${outboundNo} created · Pending Allocation.`, 'success');
  outboundListTab = 'pending_allocation';
  renderOutboundOrderList();
}

function submitSpecialOutbound() {
  submitManualOutbound();
}

seedOutbound();

document.addEventListener('DOMContentLoaded', () => {
  const orig = navigateTo;
  navigateTo = function (pageId) {
    orig(pageId);
    if (pageId === 'outbound-orders') renderOutboundOrderList();
    if (pageId === 'outbound-detail') renderOutboundDetail();
  };
});
