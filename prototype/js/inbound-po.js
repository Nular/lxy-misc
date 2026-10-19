// Purchase Order & Inbound Receipt module (aligned with KickBazar WMS foundation)

let purchaseOrders = [
  {
    orderNo: 'PO-20260820-0001',
    name: 'Earbuds restock Aug',
    warehouseCode: 'SH001',
    status: 'Partially Stocked In',
    creationMethod: 'Import Created',
    supplier: 'Shenzhen Acme Electronics',
    trackingNo: 'SF1234567890',
    linkedReceipts: ['IN-20260821-0001'],
    createdAt: '2026-08-20 10:00:00',
    lines: [
      { skuId: 'SKU-10001-BK', productName: 'Wireless Bluetooth Earbuds Pro', spec: 'Black; M', qty: 200, unitPrice: '12.50', lineStatus: 'Stocked In' },
      { skuId: 'SKU-10001-WH', productName: 'Wireless Bluetooth Earbuds Pro', spec: 'White; L', qty: 150, unitPrice: '12.50', lineStatus: 'Pending Receipt' }
    ]
  },
  {
    orderNo: 'PO-20260818-0002',
    name: 'Power bank batch',
    warehouseCode: 'BJ001',
    status: 'Created',
    creationMethod: 'Manual Entry',
    supplier: 'Beijing Power Co.',
    trackingNo: '',
    linkedReceipts: [],
    createdAt: '2026-08-18 14:30:00',
    lines: [
      { skuId: 'SKU-10003-01', productName: 'Portable Power Bank 20000mAh', spec: 'Standard', qty: 500, unitPrice: '8.00', lineStatus: 'Pending Shipment' }
    ]
  }
];

let inboundReceipts = [
  {
    receiptNo: 'IN-20260821-0001',
    receiptType: 'Purchase Receipt',
    status: 'Stocked In',
    warehouseCode: 'SH001',
    zoneCode: 'SH001STO',
    purchaseOrderNo: 'PO-20260820-0001',
    progress: 100,
    updatedAt: '2026-08-21 09:32:15',
    lines: [
      { skuId: 'SKU-10001-BK', productName: 'Wireless Bluetooth Earbuds Pro', spec: 'Black; M', receiptQty: 200, zoneCode: 'SH001STO' }
    ]
  },
  {
    receiptNo: 'IN-20260822-0003',
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
    receiptNo: 'IN-20260823-0004',
    receiptType: 'Purchase Receipt',
    status: 'Processing',
    warehouseCode: 'SH001',
    zoneCode: 'SH001STO',
    purchaseOrderNo: 'PO-20260820-0001',
    progress: 45,
    updatedAt: '2026-08-23 08:05:00',
    lines: [
      { skuId: 'SKU-10001-WH', productName: 'Wireless Bluetooth Earbuds Pro', spec: 'White; L', receiptQty: 80, zoneCode: 'SH001STO' }
    ]
  }
];

let currentPoEdit = null;
let currentReceiptEdit = null;
let receiptEditorSource = 'po';
let poEditorLines = [];
let receiptEditorLines = [];

const PO_STATUS_TAG = {
  Draft: 'tag-disable',
  Created: 'tag-normal',
  Processing: 'tag-warning',
  'Partially Stocked In': 'tag-cold',
  'Stocked In': 'tag-enable'
};

function nextDocNo(prefix, datePart) {
  const d = datePart || new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const list = prefix === 'PO' ? purchaseOrders : inboundReceipts;
  const key = prefix === 'PO' ? 'orderNo' : 'receiptNo';
  const sameDay = list.filter(x => x[key].includes(d)).length + 1;
  return `${prefix}-${d}-${String(sameDay).padStart(4, '0')}`;
}

function getInboundWarehouseScope() {
  const scope = getWarehouseScope();
  if (scope === 'all') return warehouses[0] ? formatCanonicalWarehouseCode(warehouses[0].id) : 'SH001';
  return formatCanonicalWarehouseCode(scope);
}

function getDefaultStorageZoneCode(whCode) {
  const whId = normalizeWarehouseId(whCode.replace(/([A-Z]{2})(\d{3})/, '$1-$2'));
  const z = zones.find(zn => zn.whId === whId && zn.type === 'Storage Zone');
  if (z) return formatCanonicalWarehouseCode(z.whId) + 'STO';
  return whCode + 'STO';
}

function poMatchesScope(po) {
  const scope = getWarehouseScope();
  if (scope === 'all') return true;
  return formatCanonicalWarehouseCode(po.warehouseCode) === formatCanonicalWarehouseCode(scope);
}

function receiptMatchesScope(r) {
  const scope = getWarehouseScope();
  if (scope === 'all') return true;
  return formatCanonicalWarehouseCode(r.warehouseCode) === formatCanonicalWarehouseCode(scope);
}

function renderPurchaseOrderList() {
  const tbody = document.getElementById('po-table-body');
  if (!tbody) return;
  const field = document.getElementById('po-search-field').value;
  const kw = (document.getElementById('po-search-keyword').value || '').trim().toLowerCase();
  const method = document.getElementById('po-filter-method').value;
  const statusSel = document.getElementById('po-filter-status');
  const statuses = statusSel ? Array.from(statusSel.selectedOptions).map(o => o.value) : [];

  let rows = purchaseOrders.filter(poMatchesScope);
  if (kw) {
    rows = rows.filter(po => {
      if (field === 'orderNo') return po.orderNo.toLowerCase().includes(kw);
      return po.linkedReceipts.some(r => r.toLowerCase().includes(kw));
    });
    rows.sort((a, b) => {
      const exactA = (field === 'orderNo' ? a.orderNo : a.linkedReceipts.join(',')).toLowerCase() === kw;
      const exactB = (field === 'orderNo' ? b.orderNo : b.linkedReceipts.join(',')).toLowerCase() === kw;
      if (exactA && !exactB) return -1;
      if (!exactA && exactB) return 1;
      return b.createdAt.localeCompare(a.createdAt);
    });
  } else {
    rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  if (method) rows = rows.filter(po => po.creationMethod === method);
  if (statuses.length) rows = rows.filter(po => statuses.includes(po.status));

  document.getElementById('po-list-total').textContent = rows.length;
  tbody.innerHTML = rows.map(po => `
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
          <a onclick="openPurchaseOrderEditor('${po.orderNo}')">Edit</a>
          <a onclick="viewPurchaseOrder('${po.orderNo}')">View</a>
          <a class="danger ${po.status === 'Processing' || po.status === 'Stocked In' ? 'disabled' : ''}" onclick="deletePurchaseOrder('${po.orderNo}')">Delete</a>
        </div>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="9" style="text-align:center;color:#999">No data</td></tr>';
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
    rows.sort((a, b) => {
      const va = field === 'receiptNo' ? a.receiptNo : (a.purchaseOrderNo || '');
      const vb = field === 'receiptNo' ? b.receiptNo : (b.purchaseOrderNo || '');
      if (va.toLowerCase() === kw && vb.toLowerCase() !== kw) return -1;
      if (va.toLowerCase() !== kw && vb.toLowerCase() === kw) return 1;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
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
          <a onclick="openReceiptEditor('${r.receiptNo}')">${r.status === 'Stocked In' ? 'View' : 'Edit'}</a>
          ${r.status === 'Processing' ? '<a onclick="showReceiptProgress(\'' + r.receiptNo + '\')">View Progress</a>' : ''}
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
  if (document.getElementById('po-filter-status')) document.getElementById('po-filter-status').selectedIndex = -1;
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
  showToast('Stocked In / Processing PO is view-only in product', 'info');
}

function poAddSampleLine() {
  if (poEditorLines.length >= 10000) {
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
  if (!po || po.status === 'Processing' || po.status === 'Stocked In') return;
  purchaseOrders = purchaseOrders.filter(p => p.orderNo !== orderNo);
  renderPurchaseOrderList();
  showToast('Deleted successfully.', 'success');
}

function populateReceiptPoSelect() {
  const sel = document.getElementById('receipt-po-select');
  const wh = getInboundWarehouseScope();
  const eligible = purchaseOrders.filter(p => poMatchesScope(p) && ['Created', 'Partially Stocked In'].includes(p.status));
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
    receiptEditorLines = currentReceiptEdit.lines.map(l => ({ ...l }));
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
  if (source === 'products') document.getElementById('receipt-type').value = 'Manual Receipt';
}

function renderReceiptEditorLines() {
  document.getElementById('receipt-editor-lines').innerHTML = receiptEditorLines.map((l, i) => `
    <tr>
      <td>${l.skuId}</td><td>${l.productName}</td><td>${l.spec}</td>
      <td><input type="number" min="1" max="9999999" value="${l.receiptQty}" onchange="receiptEditorLines[${i}].receiptQty=parseInt(this.value,10)||0"></td>
      <td>${l.zoneCode}</td>
    </tr>
  `).join('') || '<tr><td colspan="5" style="text-align:center;color:#999">No lines — link PO, add products, or import</td></tr>';
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
      receiptEditorLines.push({
        skuId: 'SKU-10001-WH',
        productName: 'Wireless Bluetooth Earbuds Pro',
        spec: 'White; L',
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
  renderHome();
  showToast(writeInventory ? 'Stocked in. Inventory & inbound records updated.' : 'Receipt saved.', 'success');
}

function writeInboundInventoryAndRecord(receiptNo, receipt, line) {
  const whId = normalizeWarehouseId(receipt.warehouseCode.replace(/([A-Z]{2})(\d{3})/, '$1-$2'));
  const wh = warehouses.find(w => w.id === whId);
  const whName = wh ? wh.name : receipt.warehouseCode;
  let sku = skuData.find(s => s.skuId === line.skuId && s.zoneCode.replace(/-/g, '').includes(line.zoneCode.slice(-3)));
  if (!sku) {
    sku = skuData.find(s => s.skuId === line.skuId);
  }
  if (sku) {
    sku.total += line.receiptQty;
    sku.available = sku.total - sku.locked;
  }
  const recordType = receipt.receiptType === 'Purchase Receipt' ? 'Purchase Inbound' : 'Manual Inbound';
  const row = {
    time: new Date().toISOString().slice(0, 19).replace('T', ' '),
    warehouse: receipt.warehouseCode,
    zone: `${line.zoneCode} (Storage)`,
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
  };
  recordData.inbound.unshift(row);
}

function updatePoAfterStockIn(poNo, lines) {
  const po = purchaseOrders.find(p => p.orderNo === poNo);
  if (!po) return;
  lines.forEach(line => {
    const pl = po.lines.find(l => l.skuId === line.skuId);
    if (pl) pl.lineStatus = 'Stocked In';
  });
  const allIn = po.lines.every(l => l.lineStatus === 'Stocked In');
  po.status = allIn ? 'Stocked In' : 'Partially Stocked In';
  if (!po.linkedReceipts.includes(lines.receiptNo)) {
    /* linked on persist */
  }
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
  if (document.getElementById('po-table-body')) renderPurchaseOrderList();
});
