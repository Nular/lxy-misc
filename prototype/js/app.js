// KickBazar WMS Prototype - App Logic

// ========== Mock Data ==========
let warehouses = [
  {
    id: 'SH001', name: 'Shanghai Main Warehouse', attribute: 'normal', status: 'enable',
    zoneCount: 5, total: 12580, locked: 2340, available: 10240,
    address: 'China, Shanghai, Pudong, No.888 Zhangyang Road',
    owner: 'Zhang Wei', contact: 'Li Ming', phone: '+86 138 0013 8000',
    country: 'CN', state: 'SH', city: 'PD', detail: 'No.888 Zhangyang Road',
    longitude: '121.5447', latitude: '31.2244', area: 5000, height: 12,
    weighing: 'compliant', fire: 'compliant', hasStock: true, hasPendingOrders: false
  },
  {
    id: 'BJ001', name: 'Beijing Distribution Center', attribute: 'cold chain', status: 'enable',
    zoneCount: 3, total: 8920, locked: 1560, available: 7360,
    address: 'China, Beijing, Chaoyang, No.15 Jianguo Road',
    owner: 'Wang Fang', contact: 'Chen Hua', phone: '+86 139 0013 9000',
    country: 'CN', state: 'BJ', city: 'CY', detail: 'No.15 Jianguo Road',
    longitude: '116.4551', latitude: '39.9189', area: 3200, height: 10,
    weighing: 'pending', fire: 'compliant', hasStock: true, hasPendingOrders: false
  },
  {
    id: 'GZ001', name: 'Guangzhou South Hub', attribute: 'fireproof', status: 'disable',
    zoneCount: 3, total: 0, locked: 0, available: 0,
    address: 'China, Guangdong, Guangzhou, No.100 Tianhe Road',
    owner: 'Liu Yang', contact: 'Liu Yang', phone: '+86 137 0013 7000',
    country: 'CN', state: 'GD', city: 'GZ', detail: 'No.100 Tianhe Road',
    longitude: '', latitude: '', area: 2800, height: 8,
    weighing: 'pending', fire: 'pending', hasStock: false, hasPendingOrders: false
  },
  {
    id: 'SG001', name: 'Singapore Regional Warehouse', attribute: 'thermostatic', status: 'enable',
    zoneCount: 4, total: 4560, locked: 890, available: 3670,
    address: 'Singapore, Central, 10 Anson Road',
    owner: 'Tan Wei Ming', contact: 'Tan Wei Ming', phone: '+65 9123 4567',
    country: 'SG', state: 'Central', city: 'SG', detail: '10 Anson Road',
    longitude: '103.8198', latitude: '1.2754', area: 1500, height: 6,
    weighing: 'compliant', fire: 'compliant', hasStock: true, hasPendingOrders: true
  },
  {
    id: 'SH002', name: 'Shanghai Backup Warehouse', attribute: 'normal', status: 'disable',
    zoneCount: 3, total: 0, locked: 0, available: 0,
    address: 'China, Shanghai, Minhang, No.200 Humin Road',
    owner: 'Zhao Lei', contact: 'Zhao Lei', phone: '+86 136 0013 6000',
    country: 'CN', state: 'SH', city: 'MH', detail: 'No.200 Humin Road',
    longitude: '', latitude: '', area: 1800, height: 8,
    weighing: 'pending', fire: 'pending', hasStock: false, hasPendingOrders: false
  }
];

let zones = [
  { whId: 'SH001', code: 'SH001RCV', type: 'Receiving Zone', name: 'Receiving Zone', status: 'disable', total: 120, locked: 0, available: 120 },
  { whId: 'SH001', code: 'SH001STO', type: 'Storage Zone', name: 'Main Storage', status: 'enable', total: 12200, locked: 2300, available: 9900 },
  { whId: 'SH001', code: 'SH001SHP', type: 'Shipping Zone', name: 'Shipping Zone', status: 'disable', total: 180, locked: 40, available: 140 },
  { whId: 'SH001', code: 'SH001DMG', type: 'Damaged Goods Zone', name: 'Damaged Goods', status: 'disable', total: 80, locked: 0, available: 80 },
  { whId: 'SH001', code: 'SH001PKG', type: 'Packing Zone', name: 'Packing Zone', status: 'disable', total: 0, locked: 0, available: 0 },
  { whId: 'BJ001', code: 'BJ001RCV', type: 'Receiving Zone', name: 'Receiving Zone', status: 'disable', total: 0, locked: 0, available: 0 },
  { whId: 'BJ001', code: 'BJ001STO', type: 'Storage Zone', name: 'Cold Storage', status: 'enable', total: 8920, locked: 1560, available: 7360 },
  { whId: 'BJ001', code: 'BJ001SHP', type: 'Shipping Zone', name: 'Shipping Zone', status: 'disable', total: 0, locked: 0, available: 0 },
  { whId: 'GZ001', code: 'GZ001RCV', type: 'Receiving Zone', name: 'Receiving Zone', status: 'disable', total: 0, locked: 0, available: 0 },
  { whId: 'GZ001', code: 'GZ001STO', type: 'Storage Zone', name: 'Storage Zone', status: 'enable', total: 0, locked: 0, available: 0 },
  { whId: 'GZ001', code: 'GZ001SHP', type: 'Shipping Zone', name: 'Shipping Zone', status: 'disable', total: 0, locked: 0, available: 0 },
  { whId: 'SG001', code: 'SG001RCV', type: 'Receiving Zone', name: 'Receiving Zone', status: 'disable', total: 50, locked: 0, available: 50 },
  { whId: 'SG001', code: 'SG001STO', type: 'Storage Zone', name: 'Storage Zone', status: 'enable', total: 4200, locked: 800, available: 3400 },
  { whId: 'SG001', code: 'SG001SHP', type: 'Shipping Zone', name: 'Shipping Zone', status: 'disable', total: 200, locked: 60, available: 140 },
  { whId: 'SG001', code: 'SG001RTN', type: 'Returns Zone', name: 'Returns Zone', status: 'disable', total: 110, locked: 30, available: 80 },
  { whId: 'SH002', code: 'SH002RCV', type: 'Receiving Zone', name: 'Receiving Zone', status: 'disable', total: 0, locked: 0, available: 0 },
  { whId: 'SH002', code: 'SH002STO', type: 'Storage Zone', name: 'Storage Zone', status: 'enable', total: 0, locked: 0, available: 0 },
  { whId: 'SH002', code: 'SH002SHP', type: 'Shipping Zone', name: 'Shipping Zone', status: 'disable', total: 0, locked: 0, available: 0 }
];

const spuData = [
  {
    productId: 'PRD-10001', productName: 'Wireless Bluetooth Earbuds Pro',
    skuCount: 3, total: 2580, locked: 420, available: 2160,
    warehouse: '-', zone: '-',
    skus: [
      { skuId: 'SKU-10001-BK', spec: 'Black', total: 1200, locked: 200, available: 1000, warehouse: 'Shanghai Main Warehouse', zone: 'Main Storage' },
      { skuId: 'SKU-10001-WH', spec: 'White', total: 980, locked: 150, available: 830, warehouse: 'Shanghai Main Warehouse', zone: 'Main Storage' },
      { skuId: 'SKU-10001-BL', spec: 'Blue', total: 400, locked: 70, available: 330, warehouse: 'Beijing Distribution Center', zone: 'Cold Storage' }
    ]
  },
  {
    productId: 'PRD-10002', productName: 'Smart Watch Series X',
    skuCount: 2, total: 1560, locked: 280, available: 1280,
    warehouse: 'Shanghai Main Warehouse', zone: 'Storage Zone',
    skus: [
      { skuId: 'SKU-10002-42', spec: '42mm Silver', total: 900, locked: 160, available: 740, warehouse: 'Shanghai Main Warehouse', zone: 'Main Storage' },
      { skuId: 'SKU-10002-46', spec: '46mm Black', total: 660, locked: 120, available: 540, warehouse: 'Shanghai Main Warehouse', zone: 'Main Storage' }
    ]
  },
  {
    productId: 'PRD-10003', productName: 'Portable Power Bank 20000mAh',
    skuCount: 1, total: 3200, locked: 560, available: 2640,
    warehouse: 'Beijing Distribution Center', zone: 'Storage Zone',
    skus: [
      { skuId: 'SKU-10003-01', spec: 'Standard', total: 3200, locked: 560, available: 2640, warehouse: 'Beijing Distribution Center', zone: 'Cold Storage' }
    ]
  }
];

let manualRecords = [];

const MANAGER_ASSIGNED_WH = 'SH001';
const WH_SWITCH_MAX = 3;
const WH_SWITCH_WINDOW_MS = 60000;
let whSwitchTimestamps = [];

function getUserRole() {
  return localStorage.getItem('wms_role') || 'admin';
}

function isAdminUser() {
  return getUserRole() === 'admin';
}

function normalizeWarehouseId(id) {
  if (!id || id === 'all') return id;
  return String(id).replace(/-/g, '').toUpperCase();
}

function generateWarehouseCode(region) {
  const r = String(region || 'SH').replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || 'SH';
  const n = warehouses.filter(w => String(w.id).startsWith(r)).length + 1;
  return r + String(n).padStart(3, '0');
}

function getWarehouseById(id) {
  const nid = normalizeWarehouseId(id);
  return warehouses.find(w => w.id === nid || w.id === id);
}

function skuWarehouseId(sku) {
  if (sku.warehouseCode) return normalizeWarehouseId(sku.warehouseCode);
  const wh = warehouses.find(w => w.name === sku.warehouse);
  return wh ? wh.id : normalizeWarehouseId(sku.warehouse);
}

function recordWarehouseId(r) {
  return normalizeWarehouseId(r.warehouse);
}

function getWarehouseScope() {
  if (!isAdminUser()) return MANAGER_ASSIGNED_WH;
  const scope = localStorage.getItem('wms_wh_scope') || 'all';
  return scope === 'all' ? 'all' : normalizeWarehouseId(scope);
}

function setWarehouseScope(scope) {
  localStorage.setItem('wms_wh_scope', scope === 'all' ? 'all' : normalizeWarehouseId(scope));
}

function rowInWarehouseScope(whId) {
  const scope = getWarehouseScope();
  if (scope === 'all') return true;
  return normalizeWarehouseId(whId) === scope;
}

function warehousesInScope(list) {
  const scope = getWarehouseScope();
  if (scope === 'all') return list;
  return list.filter(w => w.id === scope);
}

function isAnyModalOpen() {
  return !!document.querySelector('.modal-overlay.show');
}

function getWarehouseScopeLabel() {
  const scope = getWarehouseScope();
  if (scope === 'all') return 'All warehouses';
  const wh = getWarehouseById(scope);
  return wh ? wh.name : scope;
}

function isDashboardPageActive() {
  return document.getElementById('page-home')?.classList.contains('active');
}

function formatCanonicalWarehouseCode(id) {
  if (!id) return id;
  return String(normalizeWarehouseId(id)).replace(/-/g, '');
}

function formatDashboardZone(zone) {
  if (!zone) return zone;
  const codePart = zone.split(' ')[0];
  return codePart.replace(/-/g, '');
}

function syncDashboardWarehouseSelect() {
  const select = document.getElementById('sidebar-wh-select');
  if (!select || !isAdminUser()) return;
  const scope = getWarehouseScope();
  select.innerHTML = '<option value="all">All warehouses</option>' +
    warehouses.map(w => `<option value="${w.id}">${w.name}</option>`).join('');
  select.value = scope === 'all' ? 'all' : scope;
}

function updateSidebarWarehouseDisplay() {
  const select = document.getElementById('sidebar-wh-select');
  const display = document.getElementById('sidebar-wh-display');
  if (isAdminUser()) {
    if (select) select.hidden = false;
    if (display) display.hidden = true;
    syncDashboardWarehouseSelect();
  } else {
    if (select) select.hidden = true;
    if (display) {
      display.hidden = false;
      display.textContent = getWarehouseScopeLabel();
    }
  }
}

function revertDashboardWarehouseSelect() {
  const select = document.getElementById('sidebar-wh-select');
  const prev = getWarehouseScope();
  if (select) select.value = prev === 'all' ? 'all' : prev;
}

function onDashboardWarehouseChange(value) {
  const prev = getWarehouseScope();

  if (value === prev || (value === 'all' && prev === 'all')) return;

  if (!isDashboardPageActive()) {
    showToast('Return to Dashboard (Home) before switching warehouse context.', 'warning');
    revertDashboardWarehouseSelect();
    return;
  }

  if (isAnyModalOpen()) {
    showToast('Close open dialogs before switching warehouse.', 'warning');
    revertDashboardWarehouseSelect();
    return;
  }

  const now = Date.now();
  whSwitchTimestamps = whSwitchTimestamps.filter(t => now - t < WH_SWITCH_WINDOW_MS);
  if (whSwitchTimestamps.length >= WH_SWITCH_MAX) {
    showToast('Warehouse switch limit: up to 3 times per minute.', 'warning');
    revertDashboardWarehouseSelect();
    return;
  }
  whSwitchTimestamps.push(now);
  setWarehouseScope(value);
  applyWarehouseScopeToFilters();
  applyRoleAndScopeUI();
  refreshAllScopedViews();
  const label = value === 'all' ? 'All warehouses' : (getWarehouseById(value)?.name || value);
  showToast(`Loading data for: ${label}`, 'success');
}

function applyWarehouseScopeToFilters() {
  const scope = getWarehouseScope();
  const whVal = scope === 'all' ? '' : scope;
  ['zone-filter-warehouse', 'spu-filter-warehouse', 'sku-filter-warehouse', 'record-filter-warehouse'].forEach(id => {
    const el = document.getElementById(id);
    if (el && scope !== 'all') el.value = whVal;
  });
  if (scope !== 'all') lockedZoneWarehouse = scope;
}

function refreshAllScopedViews() {
  renderHome();
  renderWarehouses();
  renderZones();
  renderSpuTable();
  renderSkuTable();
  renderRecords();
}

function applyRoleAndScopeUI() {
  const admin = isAdminUser();
  document.querySelectorAll('.nav-warehouses-group').forEach(el => {
    el.style.display = admin ? '' : 'none';
  });
  document.querySelectorAll('.admin-only-action').forEach(el => {
    el.style.display = admin ? '' : 'none';
  });

  updateSidebarWarehouseDisplay();
  syncDashboardWarehouseSelect();

  if (!admin) {
    const active = document.querySelector('.page.active');
    if (active) {
      const pageId = active.id.replace('page-', '');
      if (pageId === 'warehouse-management' || pageId === 'zone-management') {
        navigateTo('home');
      }
    }
  }

  const hideFilters = getWarehouseScope() !== 'all';
  document.querySelectorAll('.filter-wh-scope').forEach(el => {
    el.style.display = hideFilters ? 'none' : '';
  });
}

function setUserRole(role) {
  localStorage.setItem('wms_role', role);
  const sel = document.getElementById('role-select');
  if (sel) sel.value = role;
  applyRoleAndScopeUI();
  applyWarehouseScopeToFilters();
  refreshAllScopedViews();
  const extra = role === 'admin'
    ? 'Full warehouse access.'
    : 'Scoped to assigned warehouse; Warehouses menu hidden.';
  showToast(role === 'admin' ? `Role: Admin. ${extra}` : `Role: Warehouse Manager. ${extra}`, 'info');
}

function initUserRole() {
  const role = getUserRole();
  const sel = document.getElementById('role-select');
  if (sel) sel.value = role;
}

const skuData = [
  { skuId: 'SKU-10001-BK', spec: 'Black; M', productName: 'Wireless Bluetooth Earbuds Pro', total: 1200, locked: 200, available: 1000, warehouse: 'Shanghai Main Warehouse', zone: 'Storage Zone', zoneCode: 'SH001STO', warehouseCode: 'SH001', barcode: 'EAN: 6901234567890', pan: 'KB-10001-BK', barcodes: ['EAN: 6901234567890', 'UPC: 012345678901', 'PAN: KB-10001-BK'] },
  { skuId: 'SKU-10001-WH', spec: 'White; L', productName: 'Wireless Bluetooth Earbuds Pro', total: 980, locked: 150, available: 830, warehouse: 'Shanghai Main Warehouse', zone: 'Storage Zone', zoneCode: 'SH001STO', warehouseCode: 'SH001', barcode: 'EAN: 6901234567891', pan: '-', barcodes: ['EAN: 6901234567891'] },
  { skuId: 'SKU-10001-BL', spec: 'Blue; XS', productName: 'Wireless Bluetooth Earbuds Pro', total: 400, locked: 70, available: 330, warehouse: 'Beijing Distribution Center', zone: 'Storage Zone', zoneCode: 'BJ001STO', warehouseCode: 'BJ001', barcode: 'UPC: 012345678902', pan: 'KB-10001-BL', barcodes: ['UPC: 012345678902', 'PAN: KB-10001-BL'] },
  { skuId: 'SKU-10002-42', spec: '42mm Silver', productName: 'Smart Watch Series X', total: 900, locked: 160, available: 740, warehouse: 'Shanghai Main Warehouse', zone: 'Storage Zone', zoneCode: 'SH001STO', warehouseCode: 'SH001', barcode: 'EAN: 6901234567900', pan: '-', barcodes: ['EAN: 6901234567900'] },
  { skuId: 'SKU-10002-46', spec: '46mm Black', productName: 'Smart Watch Series X', total: 660, locked: 120, available: 540, warehouse: 'Shanghai Main Warehouse', zone: 'Storage Zone', zoneCode: 'SH001STO', warehouseCode: 'SH001', barcode: 'EAN: 6901234567901', pan: 'KB-10002-46', barcodes: ['EAN: 6901234567901', 'PAN: KB-10002-46'] },
  { skuId: 'SKU-10003-01', spec: 'Standard', productName: 'Portable Power Bank 20000mAh', total: 3200, locked: 560, available: 2640, warehouse: 'Beijing Distribution Center', zone: 'Storage Zone', zoneCode: 'BJ001STO', warehouseCode: 'BJ001', barcode: 'EAN: 6901234567910', pan: '-', barcodes: ['EAN: 6901234567910'] },
  { skuId: 'SKU-10004-01', spec: '128GB', productName: 'USB-C Flash Drive', total: 0, locked: 0, available: 0, warehouse: 'Shanghai Main Warehouse', zone: 'Receiving Zone', zoneCode: 'SH001RCV', warehouseCode: 'SH001', barcode: '-', pan: 'KB-10004-01', barcodes: ['PAN: KB-10004-01'] }
];

let currentAdjSkuId = null;

const recordData = {
  inbound: [
    { time: '2026-08-21 09:32:15', warehouse: 'SH001', zone: 'SH001STO (Storage Zone)', sku: 'SKU-10001-BK', qty: '+200', after: { total: 1200, locked: 200, available: 1000 }, type: 'Purchase Inbound', order: 'IN-20260821001', operator: 'Zhang Wei', sub: 'purchase', inboundNo: 'IN-20260821001', inboundType: 'Purchase', purchaseOrderNo: 'PO-20260821088' },
    { time: '2026-08-20 14:18:42', warehouse: 'SH001', zone: 'SH001STO (Storage Zone)', sku: 'SKU-10002-42', qty: '+150', after: { total: 900, locked: 160, available: 740 }, type: 'Purchase Inbound', order: 'IN-20260820003', operator: 'Li Ming', sub: 'purchase' },
    { time: '2026-08-18 16:22:08', warehouse: 'SG001', zone: 'SG001STO (Storage Zone)', sku: 'SKU-10004-01', qty: '+100', after: { total: 450, locked: 80, available: 370 }, type: 'Purchase Inbound', order: 'IN-20260818002', operator: 'Tan Wei Ming', sub: 'purchase' },
    { time: '2026-08-18 08:00:00', warehouse: 'SH001', zone: 'SH001STO (Storage Zone)', sku: 'SKU-10002-42', qty: '+100', after: { total: 900, locked: 160, available: 740 }, type: 'Purchase Inbound', order: 'IN-20260818001', operator: 'Admin', sub: 'purchase' },
    { time: '2026-08-19 11:00:00', warehouse: 'BJ001', zone: 'BJ001STO (Storage Zone)', sku: 'SKU-10003-01', qty: '+80', after: { total: 3280, locked: 560, available: 2720 }, type: 'Manual Inbound', order: 'IN-20260819005', operator: 'Admin', sub: 'manual', inboundNo: 'IN-20260819005', inboundType: 'Manual', purchaseOrderNo: null }
  ],
  manual: [
    { time: '2026-08-19 10:05:30', warehouse: 'BJ001', zone: 'BJ001STO (Storage Zone)', sku: 'SKU-10003-01', qty: '+500', after: { total: 3200, locked: 560, available: 2640 }, type: 'Manual Adjustment', order: 'ADJ-20260819001', operator: 'Admin', sub: 'manual', direction: 'Increase', adjQty: '500', adjType: 'Inventory Gain (盘盈)', reason: 'Cycle count surplus confirmed by supervisor.', attachment: 'count-sheet-0819.pdf' },
    { time: '2026-08-17 15:20:11', warehouse: 'SH001', zone: 'SH001STO (Storage Zone)', sku: 'SKU-10001-WH', qty: '-10', after: { total: 970, locked: 150, available: 820 }, type: 'Manual Adjustment (Decrease)', order: 'ADJ-20260817002', operator: 'Admin', sub: 'manual', direction: 'Decrease', adjQty: '10', adjType: 'Damage (报损)', reason: 'Carton crushed in storage aisle.', attachment: '—' }
  ],
  occupy: [
    { time: '2026-08-21 11:45:22', warehouse: 'SH001', zone: 'SH001STO (Storage Zone)', sku: 'SKU-10001-BK', qty: '50', after: { total: 1200, locked: 200, available: 1000 }, type: 'Outbound Occupy', order: 'OUT-20260821005', operator: 'System', outboundNo: 'OUT-20260821005', relatedOrderNo: 'SO-20260821001', shipmentNo: '—', status: 'Allocated' },
    { time: '2026-08-21 10:30:18', warehouse: 'SH001', zone: 'SH001STO (Storage Zone)', sku: 'SKU-10002-42', qty: '30', after: { total: 900, locked: 160, available: 740 }, type: 'Outbound Occupy', order: 'OUT-20260821003', operator: 'System' },
    { time: '2026-08-20 15:12:55', warehouse: 'BJ001', zone: 'BJ001STO (Storage Zone)', sku: 'SKU-10003-01', qty: '100', after: { total: 3200, locked: 560, available: 2640 }, type: 'Outbound Occupy', order: 'OUT-20260820008', operator: 'System' }
  ],
  deduct: [
    { time: '2026-08-21 14:20:33', warehouse: 'SH001', zone: 'SH001STO (Storage Zone)', sku: 'SKU-10001-WH', qty: '-25', after: { total: 980, locked: 150, available: 830 }, type: 'Outbound Deduct', order: 'OUT-20260820012', operator: 'Li Ming', outboundNo: 'OUT-20260820012', relatedOrderNo: 'SO-20260820012', shipmentNo: 'SHP-SF1029384756', status: 'Shipped' },
    { time: '2026-08-20 17:05:41', warehouse: 'SH001', zone: 'SH001STO (Storage Zone)', sku: 'SKU-10001-BK', qty: '-40', after: { total: 1000, locked: 150, available: 850 }, type: 'Outbound Deduct', order: 'OUT-20260819015', operator: 'Zhang Wei' }
  ],
  unfreeze: [
    { time: '2026-08-20 09:15:28', warehouse: 'SH001', zone: 'SH001STO (Storage Zone)', sku: 'SKU-10002-46', qty: '20', after: { total: 660, locked: 100, available: 560 }, type: 'Unfreeze', order: 'OUT-20260819010', operator: 'System' },
    { time: '2026-08-19 11:42:17', warehouse: 'BJ001', zone: 'BJ001STO (Storage Zone)', sku: 'SKU-10003-01', qty: '50', after: { total: 3200, locked: 510, available: 2690 }, type: 'Unfreeze', order: 'OUT-20260818005', operator: 'System' }
  ]
};

let currentWarehouseEdit = null;
let currentZoneEdit = null;
let deleteTarget = null;
let lockedZoneWarehouse = null;
let currentRecordTab = 'inbound';
let recordListCache = [];

// ========== Init ==========
document.addEventListener('DOMContentLoaded', () => {
  initUserRole();
  initNavigation();
  initInventoryTabs();
  initRecordTabs();
  renderHome();
  renderWarehouses();
  renderZones();
  renderSpuTable();
  renderSkuTable();
  renderRecords();
  populateWarehouseSelects();
  applyRoleAndScopeUI();
  applyWarehouseScopeToFilters();
});

// ========== Navigation ==========
function initNavigation() {
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      navigateTo(page);
    });
  });

  document.querySelectorAll('.nav-item.parent').forEach(item => {
    item.addEventListener('click', (e) => {
      const group = item.dataset.group;
      if (group === 'outbound') navigateTo('outbound-orders');
    });
  });
}

function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');

  const navItem = document.querySelector(`.nav-item[data-page="${pageId}"]`);
  if (navItem) navItem.classList.add('active');

  if (pageId === 'home') renderHome();
  if (pageId === 'purchase-order' && typeof renderPurchaseOrderList === 'function') renderPurchaseOrderList();
  if (pageId === 'inbound' && typeof renderInboundReceiptList === 'function') renderInboundReceiptList();
}

// ========== Home / Dashboard ==========
const DASHBOARD_PENDING_DEMO = {
  inbound: 3,
  allocation: 12,
  picking: 8,
  packing: 5,
  shipped: 156
};

function getDashboardPendingMetrics(scopedWh) {
  const factor = getWarehouseScope() === 'all' ? 1 : (scopedWh.length === 1 ? 0.35 : 1);
  const f = (n) => Math.max(0, Math.round(n * factor));
  return {
    inbound: f(DASHBOARD_PENDING_DEMO.inbound),
    allocation: f(DASHBOARD_PENDING_DEMO.allocation),
    picking: f(DASHBOARD_PENDING_DEMO.picking),
    packing: f(DASHBOARD_PENDING_DEMO.packing),
    shipped: f(DASHBOARD_PENDING_DEMO.shipped)
  };
}

function navigateToRecordToday() {
  currentRecordTab = 'all';
  document.querySelectorAll('#record-tabs .tab').forEach(t => {
    t.classList.toggle('active', t.dataset.recordTab === 'all');
  });
  updateRecordSubTabs();
  navigateTo('record');
  renderRecords();
}

function renderHome() {
  updateSidebarWarehouseDisplay();
  const scopedWh = warehousesInScope(warehouses);
  const totalStock = scopedWh.reduce((s, w) => s + w.total, 0);
  const pending = getDashboardPendingMetrics(scopedWh);

  document.getElementById('dashboard-kpi').innerHTML = `
    <div class="kpi-card kpi-total" onclick="navigateTo('spu-sku-inventory')" title="Go to Inventory">
      <span class="kpi-label">Total Inventory</span>
      <span class="kpi-value">${totalStock.toLocaleString()}</span>
    </div>
    <div class="kpi-card kpi-pending-inbound" onclick="navigateTo('inbound')">
      <span class="kpi-label">Pending Inbound</span>
      <span class="kpi-value">${pending.inbound}</span>
      <span class="kpi-sub">vehicles</span>
    </div>
    <div class="kpi-card kpi-allocation" onclick="navigateTo('outbound-orders')">
      <span class="kpi-label">Pending Allocation</span>
      <span class="kpi-value">${pending.allocation}</span>
      <span class="kpi-sub">orders</span>
    </div>
    <div class="kpi-card kpi-picking" onclick="navigateTo('outbound-orders')">
      <span class="kpi-label">Pending Picking</span>
      <span class="kpi-value">${pending.picking}</span>
      <span class="kpi-sub">orders</span>
    </div>
    <div class="kpi-card kpi-packing" onclick="navigateTo('outbound-orders')">
      <span class="kpi-label">Pending Packing</span>
      <span class="kpi-value">${pending.packing}</span>
      <span class="kpi-sub">orders</span>
    </div>
    <div class="kpi-card kpi-shipped" onclick="navigateTo('outbound-orders')">
      <span class="kpi-label">Shipped Today</span>
      <span class="kpi-value">${pending.shipped}</span>
      <span class="kpi-sub">orders</span>
    </div>
  `;

  document.getElementById('dashboard-main-tasks').innerHTML = [
    { page: 'purchase-order', title: 'Purchase Orders', icon: 'task-icon-po' },
    { page: 'inbound', title: 'Inbound', icon: 'task-icon-in' },
    { page: 'outbound-orders', title: 'Outbound', icon: 'task-icon-out' }
  ].map(t => `
    <button type="button" class="dashboard-task-card" onclick="navigateTo('${t.page}')">
      <span class="dashboard-task-icon ${t.icon}" aria-hidden="true"></span>
      <span class="dashboard-task-title">${t.title}</span>
      <span class="dashboard-task-arrow" aria-hidden="true">→</span>
    </button>
  `).join('');

  document.getElementById('dashboard-admin-tasks').innerHTML = [
    { page: 'warehouse-management', title: 'Warehouse Management', icon: 'task-icon-wh' },
    { page: 'zone-management', title: 'Zone Management', icon: 'task-icon-zone' }
  ].map(t => `
    <button type="button" class="dashboard-admin-card" onclick="navigateTo('${t.page}')">
      <span class="dashboard-task-icon ${t.icon}" aria-hidden="true"></span>
      <span class="dashboard-task-title">${t.title}</span>
      <span class="dashboard-task-arrow" aria-hidden="true">→</span>
    </button>
  `).join('');

  const allRecords = [
    ...recordData.inbound,
    ...recordData.manual,
    ...recordData.occupy,
    ...recordData.deduct
  ].filter(r => rowInWarehouseScope(recordWarehouseId(r)))
    .sort((a, b) => b.time.localeCompare(a.time))
    .slice(0, 20);

  const typeClass = {
    'Purchase Inbound': 'type-inbound',
    'Manual Inbound': 'type-inbound',
    'Manual Adjustment': 'type-manual',
    'Manual Adjustment (Decrease)': 'type-manual',
    'Outbound Occupy': 'type-occupy',
    'Outbound Deduct': 'type-deduct'
  };

  const tbody = document.getElementById('dashboard-activity-table');
  if (!allRecords.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="dashboard-empty">No operations today.</td></tr>';
  } else {
    tbody.innerHTML = allRecords.map(r => {
      const qtyClass = r.qty.startsWith('+') ? 'qty-up' : r.qty.startsWith('-') ? 'qty-down' : '';
      const timeParts = r.time.split(' ');
      return `
      <tr class="dashboard-ops-row" onclick="navigateTo('record')" title="View in Record">
        <td>${timeParts[1] || r.time}</td>
        <td class="${typeClass[r.type] || ''}">${r.type}</td>
        <td>${formatCanonicalWarehouseCode(r.warehouse)}</td>
        <td>${formatDashboardZone(r.zone)}</td>
        <td>${r.sku}</td>
        <td class="${qtyClass}">${r.qty}</td>
        <td>${r.order}</td>
        <td>${r.operator}</td>
      </tr>
    `;
    }).join('');
  }
}

function navigateToZones(warehouseId) {
  lockedZoneWarehouse = warehouseId || null;
  const select = document.getElementById('zone-filter-warehouse');
  if (warehouseId) {
    select.value = warehouseId;
    select.disabled = false;
  }
  navigateTo('zone-management');
  renderZones();
}

function navigateToZonesFromWarehouse() {
  const whId = document.getElementById('wh-id').value;
  closeModal('warehouse-modal');
  navigateToZones(whId);
}

function refreshDashboard() {
  if (document.getElementById('page-home').classList.contains('active')) {
    renderHome();
  }
}
function getAttributeTag(attr) {
  const map = { normal: 'tag-normal', fireproof: 'tag-fireproof', thermostatic: 'tag-thermostatic', 'cold chain': 'tag-cold' };
  const labels = { normal: 'Normal', fireproof: 'Fireproof', thermostatic: 'Thermostatic', 'cold chain': 'Cold Chain' };
  return `<span class="tag ${map[attr] || 'tag-normal'}">${labels[attr] || attr}</span>`;
}

function getStatusTag(status) {
  return status === 'enable'
    ? '<span class="tag tag-enable">Enable</span>'
    : '<span class="tag tag-disable">Disable</span>';
}

function renderWarehouses() {
  const tbody = document.getElementById('warehouse-table-body');
  const scoped = warehousesInScope(warehouses);
  document.getElementById('wh-total').textContent = scoped.length;

  if (scoped.length === 0) {
    tbody.innerHTML = `<tr><td colspan="12"><div class="empty-state"><div class="icon">📦</div><p>No data</p><button class="btn btn-primary" onclick="openCreateWarehouse()">Add Warehouse</button></div></td></tr>`;
    return;
  }

  tbody.innerHTML = scoped.map(wh => `
    <tr onclick="openEditWarehouse('${wh.id}')">
      <td>${wh.id}</td>
      <td>${wh.name}</td>
      <td>${getAttributeTag(wh.attribute)}</td>
      <td>${getStatusTag(wh.status)}</td>
      <td class="zone-count-cell" ondblclick="event.stopPropagation(); navigateToZones('${wh.id}')" title="Double-click to manage zones">${wh.zoneCount}</td>
      <td>${wh.total.toLocaleString()}</td>
      <td>${wh.locked.toLocaleString()}</td>
      <td>${wh.available.toLocaleString()}</td>
      <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${wh.address}">${wh.address}</td>
      <td>${wh.owner}</td>
      <td>${wh.contact}<br><span style="color:#999;font-size:12px">${wh.phone}</span></td>
      <td onclick="event.stopPropagation()">
        <div class="action-links">
          <a onclick="openEditWarehouse('${wh.id}')">Edit</a>
          <a class="danger ${wh.hasStock || wh.hasPendingOrders ? 'disabled' : ''}" 
             onclick="openDeleteWarehouse('${wh.id}')"
             title="${wh.hasStock ? 'Cannot delete: Warehouse has active stock.' : wh.hasPendingOrders ? 'Cannot delete: Pending PO, inbound, or outbound orders exist.' : ''}">Delete</a>
          <a onclick="openViewWarehouse('${wh.id}')">View</a>
        </div>
      </td>
    </tr>
  `).join('');
}

function searchWarehouses() {
  showToast('Search executed with current filters', 'success');
  renderWarehouses();
}

function resetWarehouseFilters() {
  document.getElementById('wh-search-value').value = '';
  document.getElementById('wh-filter-attribute').value = '';
  document.getElementById('wh-filter-status').value = '';
}

function openCreateWarehouse() {
  if (!isAdminUser()) {
    showToast('Admin only.', 'error');
    return;
  }
  currentWarehouseEdit = null;
  document.getElementById('warehouse-modal-title').textContent = 'Create Warehouse';
  document.getElementById('warehouse-submit-btn').textContent = 'Create';
  document.getElementById('wh-id-group').style.display = 'none';
  document.getElementById('wh-manage-zones').style.display = 'none';
  document.getElementById('wh-status-tag').style.display = 'inline-block';
  document.getElementById('wh-status').style.display = 'none';
  document.getElementById('warehouse-form-container').classList.remove('view-mode');
  document.getElementById('warehouse-modal-footer').style.display = 'flex';
  document.getElementById('wh-zone-count').value = '3 (Auto-generate: Receiving Zone, Storage Zone, Shipping Zone)';

  document.getElementById('warehouse-form').reset();
  document.getElementById('wh-attribute').value = 'normal';
  openModal('warehouse-modal');
}

function openEditWarehouse(id) {
  const wh = warehouses.find(w => w.id === id);
  if (!wh) return;
  currentWarehouseEdit = wh;
  fillWarehouseForm(wh, false);
  document.getElementById('warehouse-modal-title').textContent = 'Edit Warehouse';
  document.getElementById('warehouse-submit-btn').textContent = 'Save';
  document.getElementById('wh-id-group').style.display = 'flex';
  document.getElementById('wh-manage-zones').style.display = 'inline';
  document.getElementById('wh-status-tag').style.display = 'none';
  document.getElementById('wh-status').style.display = 'block';
  document.getElementById('warehouse-form-container').classList.remove('view-mode');
  document.getElementById('warehouse-modal-footer').style.display = 'flex';
  document.getElementById('wh-zone-count').value = wh.zoneCount + ' zones';
  openModal('warehouse-modal');
}

function openViewWarehouse(id) {
  const wh = warehouses.find(w => w.id === id);
  if (!wh) return;
  fillWarehouseForm(wh, true);
  document.getElementById('warehouse-modal-title').textContent = 'View Warehouse';
  document.getElementById('wh-id-group').style.display = 'flex';
  document.getElementById('wh-manage-zones').style.display = 'inline';
  document.getElementById('wh-status-tag').style.display = 'none';
  document.getElementById('wh-status').style.display = 'block';
  document.getElementById('warehouse-form-container').classList.add('view-mode');
  document.getElementById('warehouse-modal-footer').style.display = 'none';
  document.getElementById('wh-zone-count').value = wh.zoneCount + ' zones';
  openModal('warehouse-modal');
}

function fillWarehouseForm(wh, readonly) {
  document.getElementById('wh-id').value = wh.id;
  document.getElementById('wh-name').value = wh.name;
  document.getElementById('wh-attribute').value = wh.attribute;
  document.getElementById('wh-status').value = wh.status;
  document.getElementById('wh-country').value = wh.country;
  document.getElementById('wh-state').value = wh.state;
  document.getElementById('wh-city').value = wh.city;
  document.getElementById('wh-address').value = wh.detail;
  document.getElementById('wh-longitude').value = wh.longitude;
  document.getElementById('wh-latitude').value = wh.latitude;
  document.getElementById('wh-area').value = wh.area || '';
  document.getElementById('wh-height').value = wh.height || '';
  document.getElementById('wh-weighing').value = wh.weighing;
  document.getElementById('wh-fire').value = wh.fire;
  document.getElementById('wh-owner').value = wh.owner;
  document.getElementById('wh-contact').value = wh.contact;
  document.getElementById('wh-phone').value = wh.phone;
}

function submitWarehouse() {
  const name = document.getElementById('wh-name').value.trim();
  if (!name || name.length < 2) {
    showToast('2-50 characters. Chinese, letters, and numbers only.', 'error');
    return;
  }

  if (currentWarehouseEdit) {
    currentWarehouseEdit.name = name;
    currentWarehouseEdit.attribute = document.getElementById('wh-attribute').value;
    const newStatus = document.getElementById('wh-status').value;
    const wasDisabled = currentWarehouseEdit.status === 'disable';
    currentWarehouseEdit.status = newStatus;
    currentWarehouseEdit.country = document.getElementById('wh-country').value;
    currentWarehouseEdit.state = document.getElementById('wh-state').value;
    currentWarehouseEdit.city = document.getElementById('wh-city').value;
    currentWarehouseEdit.detail = document.getElementById('wh-address').value;
    currentWarehouseEdit.longitude = document.getElementById('wh-longitude').value;
    currentWarehouseEdit.latitude = document.getElementById('wh-latitude').value;
    currentWarehouseEdit.area = document.getElementById('wh-area').value;
    currentWarehouseEdit.height = document.getElementById('wh-height').value;
    currentWarehouseEdit.weighing = document.getElementById('wh-weighing').value;
    currentWarehouseEdit.fire = document.getElementById('wh-fire').value;
    currentWarehouseEdit.owner = document.getElementById('wh-owner').value;
    currentWarehouseEdit.contact = document.getElementById('wh-contact').value;
    currentWarehouseEdit.phone = document.getElementById('wh-phone').value;
    currentWarehouseEdit.address = `${currentWarehouseEdit.country}, ${currentWarehouseEdit.state}, ${currentWarehouseEdit.city}, ${currentWarehouseEdit.detail}`;

    closeModal('warehouse-modal');
    renderWarehouses();
    refreshDashboard();
    if (wasDisabled && newStatus === 'enable') {
      showToast('Warehouse updated. Warehouse active. Ready for inbound/outbound operations.', 'success');
    } else {
      showToast('Warehouse updated.', 'success');
    }
  } else {
    const newId = generateWarehouseCode(document.getElementById('wh-state').value || 'SH');
    const newWh = {
      id: newId, name, attribute: document.getElementById('wh-attribute').value, status: 'disable',
      zoneCount: 3, total: 0, locked: 0, available: 0,
      address: 'China, Shanghai, Pudong, New Address',
      owner: 'Current User', contact: 'Current User', phone: '+86 138 0000 0000',
      country: document.getElementById('wh-country').value || 'CN',
      state: document.getElementById('wh-state').value || 'SH',
      city: document.getElementById('wh-city').value || 'PD',
      detail: document.getElementById('wh-address').value || 'New Address',
      longitude: '', latitude: '', area: 0, height: 0,
      weighing: 'pending', fire: 'pending', hasStock: false, hasPendingOrders: false
    };
    warehouses.unshift(newWh);

    zones.push(
      { whId: newId, code: `${newId}RCV`, type: 'Receiving Zone', name: 'Receiving Zone', status: 'disable', total: 0, locked: 0, available: 0 },
      { whId: newId, code: `${newId}STO`, type: 'Storage Zone', name: 'Storage Zone', status: 'enable', total: 0, locked: 0, available: 0 },
      { whId: newId, code: `${newId}SHP`, type: 'Shipping Zone', name: 'Shipping Zone', status: 'disable', total: 0, locked: 0, available: 0 }
    );

    closeModal('warehouse-modal');
    renderWarehouses();
    populateWarehouseSelects();
    refreshDashboard();
    showToast('Warehouse created (Inactive). 3 default zones auto-generated. Enable to start operations.', 'success');
    setTimeout(() => navigateToZones(newId), 1500);
  }
}

function openDeleteWarehouse(id) {
  const wh = warehouses.find(w => w.id === id);
  if (!wh) return;
  if (wh.hasStock) {
    showToast('Cannot delete: Warehouse has active stock.', 'error');
    return;
  }
  if (wh.hasPendingOrders) {
    showToast('Cannot delete: Pending PO, inbound, or outbound orders exist.', 'error');
    return;
  }
  deleteTarget = { type: 'warehouse', id };
  document.getElementById('delete-warehouse-msg').textContent =
    `Delete warehouse "${wh.name}" (${wh.id})? All associated zones will be deleted and cannot be recovered.`;
  openModal('delete-warehouse-modal');
}

function confirmDeleteWarehouse() {
  if (!deleteTarget || deleteTarget.type !== 'warehouse') return;
  warehouses = warehouses.filter(w => w.id !== deleteTarget.id);
  zones = zones.filter(z => z.whId !== deleteTarget.id);
  deleteTarget = null;
  closeModal('delete-warehouse-modal');
  renderWarehouses();
  renderZones();
  populateWarehouseSelects();
  refreshDashboard();
  showToast('Deleted successfully.', 'success');
}

// ========== Zone Management ==========
function getZoneTypeTag(type) {
  const map = {
    'Receiving Zone': 'tag-rcv', 'Storage Zone': 'tag-sto', 'Shipping Zone': 'tag-shp',
    'Damaged Goods Zone': 'tag-dmg'
  };
  return `<span class="tag ${map[type] || 'tag-normal'}">${type}</span>`;
}

function renderZones() {
  const tbody = document.getElementById('zone-table-body');
  const whFilter = document.getElementById('zone-filter-warehouse').value;
  const scope = getWarehouseScope();
  let effectiveWh = whFilter;
  if (!effectiveWh && scope !== 'all') effectiveWh = scope;
  let filtered = zones;
  if (effectiveWh) filtered = zones.filter(z => z.whId === effectiveWh);

  document.getElementById('zone-total').textContent = filtered.length;

  tbody.innerHTML = filtered.map(z => `
    <tr>
      <td>${z.whId}</td>
      <td>${z.code}</td>
      <td>${getZoneTypeTag(z.type)}</td>
      <td>${getStatusTag(z.status)}</td>
      <td>${z.total.toLocaleString()}</td>
      <td>${z.locked.toLocaleString()}</td>
      <td>${z.available.toLocaleString()}</td>
      <td>
        <div class="action-links">
          <a onclick="openEditZone('${z.code}')">Edit</a>
          <a class="danger ${z.total > 0 || z.locked > 0 ? 'disabled' : ''}" onclick="openDeleteZone('${z.code}')">Delete</a>
          <a onclick="openViewZone('${z.code}')">View</a>
        </div>
      </td>
    </tr>
  `).join('');
}

function searchZones() {
  showToast('Search executed with current filters', 'success');
  renderZones();
}

function resetZoneFilters() {
  document.getElementById('zone-filter-code').value = '';
  document.getElementById('zone-filter-type').value = '';
  document.getElementById('zone-filter-status').value = '';
  if (!lockedZoneWarehouse) {
    document.getElementById('zone-filter-warehouse').value = '';
  }
  renderZones();
}

function openCreateZone() {
  if (!isAdminUser()) {
    showToast('Admin only.', 'error');
    return;
  }
  currentZoneEdit = null;
  document.getElementById('zone-modal-title').textContent = 'Create Zone';
  document.getElementById('zone-submit-btn').textContent = 'Create';
  document.getElementById('zone-form').reset();
  document.getElementById('zone-status').value = 'enable';

  const select = document.getElementById('zone-wh-id');
  select.innerHTML = warehouses.map(w => `<option value="${w.id}">${w.id} - ${w.name}</option>`).join('');
  if (lockedZoneWarehouse) select.value = lockedZoneWarehouse;

  document.getElementById('zone-type').disabled = false;
  document.getElementById('zone-code').readOnly = false;
  document.getElementById('zone-form').closest('.modal-body').classList.remove('view-mode');
  document.getElementById('zone-modal-footer').style.display = 'flex';
  openModal('zone-modal');
}

function openEditZone(code) {
  const z = zones.find(zn => zn.code === code);
  if (!z) return;
  currentZoneEdit = z;
  document.getElementById('zone-modal-title').textContent = 'Edit Zone';
  document.getElementById('zone-submit-btn').textContent = 'Save';

  const select = document.getElementById('zone-wh-id');
  select.innerHTML = `<option value="${z.whId}">${z.whId}</option>`;
  select.disabled = true;

  document.getElementById('zone-type').innerHTML = `<option value="${z.type}">${z.type}</option>`;
  document.getElementById('zone-type').disabled = true;
  document.getElementById('zone-code').value = z.code;
  document.getElementById('zone-code').readOnly = true;
  document.getElementById('zone-status').value = z.status;

  document.getElementById('zone-form').closest('.modal-body').classList.remove('view-mode');
  document.getElementById('zone-modal-footer').style.display = 'flex';
  openModal('zone-modal');
}

function openViewZone(code) {
  openEditZone(code);
  document.getElementById('zone-modal-title').textContent = 'View Zone';
  document.getElementById('zone-form').closest('.modal-body').classList.add('view-mode');
  document.getElementById('zone-modal-footer').style.display = 'none';
}

function submitZone() {
  const whId = document.getElementById('zone-wh-id').value;
  const zoneType = document.getElementById('zone-type').value;
  const zoneCode = document.getElementById('zone-code').value;
  const status = document.getElementById('zone-status').value;

  if (currentZoneEdit) {
    if (status === 'enable' && currentZoneEdit.type !== 'Storage Zone' && currentZoneEdit.status === 'disable') {
      showToast('Not available in this version.', 'warning');
      document.getElementById('zone-status').value = 'disable';
      return;
    }
    currentZoneEdit.name = zoneType;
    currentZoneEdit.status = status;
    closeModal('zone-modal');
    renderZones();
    showToast('Zone updated.', 'success');
  } else {
    if (!zoneType || !zoneCode) {
      showToast('Please fill in required fields.', 'error');
      return;
    }
    zones.push({ whId, code: zoneCode, type: zoneType, name: zoneType, status, total: 0, locked: 0, available: 0 });
    const wh = warehouses.find(w => w.id === whId);
    if (wh) wh.zoneCount++;
    closeModal('zone-modal');
    renderZones();
    renderWarehouses();
    refreshDashboard();
    showToast('Zone created.', 'success');
  }
  document.getElementById('zone-wh-id').disabled = false;
}

function openDeleteZone(code) {
  const z = zones.find(zn => zn.code === code);
  if (!z) return;
  if (z.total > 0 || z.locked > 0) {
    showToast('Cannot delete: Zone has active stock.', 'error');
    return;
  }
  const wh = warehouses.find(w => w.id === z.whId);
  deleteTarget = { type: 'zone', code };
  document.getElementById('delete-zone-msg').textContent =
    `Delete Warehouse ${wh ? wh.name : z.whId} Zone "${z.code}"? All associated zones will be deleted and cannot be recovered.`;
  openModal('delete-zone-modal');
}

function confirmDeleteZone() {
  if (!deleteTarget || deleteTarget.type !== 'zone') return;
  const z = zones.find(zn => zn.code === deleteTarget.code);
  if (z) {
    zones = zones.filter(zn => zn.code !== deleteTarget.code);
    const wh = warehouses.find(w => w.id === z.whId);
    if (wh) wh.zoneCount--;
  }
  deleteTarget = null;
  closeModal('delete-zone-modal');
  renderZones();
  renderWarehouses();
  refreshDashboard();
  showToast('Deleted successfully.', 'success');
}

// ========== Inventory ==========
function initInventoryTabs() {
  document.querySelectorAll('#inventory-tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#inventory-tabs .tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const view = tab.dataset.invTab;
      document.getElementById('inv-view-spu').style.display = view === 'spu' ? 'block' : 'none';
      document.getElementById('inv-view-sku').style.display = view === 'sku' ? 'block' : 'none';
    });
  });
}

function spuSkusInScope(spu) {
  const scope = getWarehouseScope();
  if (scope === 'all') return spu.skus;
  return spu.skus.filter(s => {
    const wh = warehouses.find(w => w.name === s.warehouse);
    const whId = wh ? wh.id : normalizeWarehouseId(s.warehouse);
    return whId === scope;
  });
}

function renderSpuTable() {
  const tbody = document.getElementById('spu-table-body');
  const rows = [];
  spuData.forEach((spu, idx) => {
    const skus = spuSkusInScope(spu);
    if (getWarehouseScope() !== 'all' && skus.length === 0) return;
    const total = skus.reduce((s, x) => s + x.total, 0);
    const locked = skus.reduce((s, x) => s + x.locked, 0);
    const available = skus.reduce((s, x) => s + x.available, 0);
    const whLabel = getWarehouseScope() === 'all' ? spu.warehouse : (getWarehouseById(getWarehouseScope())?.name || '—');
    const zoneLabel = skus.length === 1 ? skus[0].zone : (skus.length > 1 ? '—' : spu.zone);
    rows.push(`
    <tr>
      <td><span class="expand-icon" onclick="toggleSpuExpand(${idx}, this)">▶</span></td>
      <td>${spu.productId}</td>
      <td>${spu.productName}</td>
      <td>${skus.length}</td>
      <td>${total.toLocaleString()}</td>
      <td>${locked.toLocaleString()}</td>
      <td>${available.toLocaleString()}</td>
      <td>${whLabel}</td>
      <td>${zoneLabel}</td>
    </tr>
    <tr class="sku-subtable" id="spu-expand-${idx}" style="display:none">
      <td colspan="9">
        <table style="width:100%">
          <thead>
            <tr style="background:#f0f0f0">
              <th>SKU ID</th><th>Specification</th><th>Total</th><th>Locked</th><th>Available</th><th>Warehouse</th><th>Zone</th>
            </tr>
          </thead>
          <tbody>
            ${skus.map(s => `
              <tr>
                <td>${s.skuId}</td><td>${s.spec}</td>
                <td>${s.total}</td><td>${s.locked}</td><td>${s.available}</td>
                <td>${s.warehouse}</td><td>${s.zone}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </td>
    </tr>
  `);
  });
  tbody.innerHTML = rows.join('') || '<tr><td colspan="9" style="text-align:center;color:#999">No inventory in current warehouse context</td></tr>';
}

function toggleSpuExpand(idx, el) {
  const row = document.getElementById('spu-expand-' + idx);
  const isHidden = row.style.display === 'none';
  row.style.display = isHidden ? 'table-row' : 'none';
  el.classList.toggle('expanded', isHidden);
}

function renderSkuTable() {
  const tbody = document.getElementById('sku-table-body');
  const scopedSku = skuData.filter(s => rowInWarehouseScope(skuWarehouseId(s)));
  tbody.innerHTML = scopedSku.map(s => `
    <tr>
      <td>${s.skuId}</td>
      <td>${s.spec}</td>
      <td>${s.productName}</td>
      <td>${s.total.toLocaleString()}</td>
      <td>${s.locked.toLocaleString()}</td>
      <td>${s.available.toLocaleString()}</td>
      <td>${s.warehouse}</td>
      <td>${s.zone}</td>
      <td>${s.zoneCode}</td>
      <td><span class="barcode-cell" title="${s.barcodes.join('\n')}">${s.barcode}</span></td>
      <td>${s.pan || '-'}</td>
      <td>${isAdminUser()
        ? `<a class="btn-link" onclick="openAdjustment('${s.skuId}','${s.zoneCode}')">Inventory Adjustment</a>`
        : `<span class="text-muted" title="Admin only" style="color:#999;cursor:not-allowed">Admin only</span>`}
      </td>
    </tr>
  `).join('') || '<tr><td colspan="12" style="text-align:center;color:#999">No SKU rows in current warehouse context</td></tr>';
}

function openAdjustment(skuId, zoneCode) {
  if (!isAdminUser()) {
    showToast('Admin only. Inventory adjustment is not available for warehouse managers.', 'error');
    return;
  }
  const s = skuData.find(x => x.skuId === skuId && x.zoneCode === zoneCode);
  if (!s) return;
  currentAdjSkuId = skuId + '|' + zoneCode;
  document.getElementById('adj-sku').value = s.skuId;
  document.getElementById('adj-loc').value = `${s.warehouseCode} / ${s.zoneCode} (${s.zone})`;
  document.getElementById('adj-before').value = s.total;
  document.getElementById('adj-qty').value = '';
  document.getElementById('adj-type').value = '';
  document.getElementById('adj-reason').value = '';
  openModal('adj-modal');
}

function submitAdjustment() {
  if (!isAdminUser()) {
    showToast('Admin only.', 'error');
    return;
  }
  const s = skuData.find(x => x.skuId + '|' + x.zoneCode === currentAdjSkuId);
  if (!s) return;
  const dir = document.getElementById('adj-dir').value;
  const qty = parseInt(document.getElementById('adj-qty').value, 10);
  const type = document.getElementById('adj-type').value;
  const reason = document.getElementById('adj-reason').value.trim();
  if (!qty || qty <= 0 || !type || !reason) {
    showToast('Please complete required fields.', 'error');
    return;
  }
  if (dir === 'decrease' && s.available < qty) {
    showToast('Insufficient available inventory.', 'error');
    return;
  }
  if (dir === 'increase') {
    s.total += qty;
  } else {
    s.total -= qty;
  }
  s.available = s.total - s.locked;
  const orderNo = 'ADJ-' + Date.now();
  const fileInput = document.getElementById('adj-file');
  const attachmentName = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0].name : '—';
  manualRecords.unshift({
    time: new Date().toISOString().slice(0, 19).replace('T', ' '),
    warehouse: s.warehouseCode,
    zone: `${s.zoneCode} (${s.zone})`,
    sku: s.skuId,
    qty: (dir === 'increase' ? '+' : '-') + qty,
    after: { total: s.total, locked: s.locked, available: s.available },
    type: dir === 'increase' ? 'Manual Adjustment' : 'Manual Adjustment (Decrease)',
    order: orderNo,
    operator: 'Admin',
    sub: 'manual',
    direction: dir === 'increase' ? 'Increase' : 'Decrease',
    adjQty: String(qty),
    adjType: type,
    reason,
    attachment: attachmentName
  });
  recordData.manual.unshift(manualRecords[0]);
  try {
    const ls = JSON.parse(localStorage.getItem('manual_records') || '[]');
    ls.unshift({ ...manualRecords[0] });
    localStorage.setItem('manual_records', JSON.stringify(ls.slice(0, 100)));
  } catch (e) { /* prototype */ }
  closeModal('adj-modal');
  renderSkuTable();
  renderSpuTable();
  if (currentRecordTab === 'manual' || currentRecordTab === 'all') renderRecords();
  showToast(`Inventory adjusted successfully. ${orderNo} — see Record → Manual Adjustment`, 'success');
}

// ========== Records ==========
function updateRecordSubTabs() {
  const inboundSub = document.getElementById('inbound-sub-tabs');
  const outboundSub = document.getElementById('outbound-sub-tabs');
  if (inboundSub) inboundSub.style.display = currentRecordTab === 'inbound' ? 'flex' : 'none';
  if (outboundSub) outboundSub.style.display = currentRecordTab === 'outbound' ? 'flex' : 'none';
}

function initRecordTabs() {
  document.querySelectorAll('#record-tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#record-tabs .tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentRecordTab = tab.dataset.recordTab;
      updateRecordSubTabs();
      renderRecords();
    });
  });

  document.querySelectorAll('#inbound-sub-tabs .sub-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#inbound-sub-tabs .sub-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderRecords();
    });
  });

  document.querySelectorAll('#outbound-sub-tabs .sub-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#outbound-sub-tabs .sub-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderRecords();
    });
  });
}

function renderRecords() {
  const tbody = document.getElementById('record-table-body');
  let data = [];

  const manualFromStorage = [];
  try {
    JSON.parse(localStorage.getItem('manual_records') || '[]').forEach(r => {
      manualFromStorage.push({ ...r, sub: 'manual' });
    });
  } catch (e) { /* ignore */ }

  const allManual = [...recordData.manual, ...manualFromStorage.filter(m =>
    !recordData.manual.some(x => x.order === m.order && x.time === m.time)
  )];

  if (currentRecordTab === 'all') {
    data = [...recordData.inbound, ...allManual, ...recordData.occupy, ...recordData.deduct];
    data.sort((a, b) => b.time.localeCompare(a.time));
  } else if (currentRecordTab === 'inbound') {
    data = recordData.inbound;
    const activeSub = document.querySelector('#inbound-sub-tabs .sub-tab.active');
    if (activeSub) {
      const subText = activeSub.textContent.trim().toLowerCase();
      if (subText === 'manual') data = data.filter(d => d.sub === 'manual');
      if (subText === 'purchase') data = data.filter(d => d.sub === 'purchase');
    }
  } else if (currentRecordTab === 'outbound') {
    data = [...recordData.occupy, ...recordData.deduct];
    const activeSub = document.querySelector('#outbound-sub-tabs .sub-tab.active');
    if (activeSub) {
      const subText = activeSub.textContent.trim().toLowerCase();
      if (subText.includes('deduct')) data = data.filter(d => d.type === 'Outbound Deduct');
      if (subText.includes('occupy')) data = data.filter(d => d.type === 'Outbound Occupy');
    }
    data.sort((a, b) => b.time.localeCompare(a.time));
  } else if (currentRecordTab === 'manual') {
    data = allManual.sort((a, b) => b.time.localeCompare(a.time));
  }

  data = data.filter(r => rowInWarehouseScope(recordWarehouseId(r)));

  recordListCache = data.map(enrichRecordDetail);

  const typeClass = {
    'Purchase Inbound': 'type-inbound',
    'Manual Inbound': 'type-inbound',
    'Manual Adjustment': 'type-manual',
    'Manual Adjustment (Decrease)': 'type-manual',
    'Outbound Occupy': 'type-occupy', 'Outbound Deduct': 'type-deduct'
  };

  tbody.innerHTML = recordListCache.map((r, idx) => {
    const qtyClass = r.qty.startsWith('+') ? 'up' : r.qty.startsWith('-') ? 'down' : '';
    return `
      <tr class="record-row-clickable" onclick="openRecordDetail(${idx})" title="View detail">
        <td>${r.time}</td>
        <td>${r.warehouse}</td>
        <td>${r.zone}</td>
        <td>${r.sku}</td>
        <td class="${qtyClass}" style="font-weight:500">${r.qty}</td>
        <td class="stock-change">${formatAfterChangeHtml(r)}</td>
        <td class="${typeClass[r.type] || ''}">${r.type}</td>
        <td>${r.order}</td>
        <td>${r.operator}</td>
        <td style="text-align:center">${recordViewButtonHtml(idx)}</td>
      </tr>
    `;
  }).join('');
}

function getAfterChangeArrows(r) {
  const type = r.type || '';
  const plus = String(r.qty).startsWith('+');
  const minus = String(r.qty).startsWith('-');
  if (type.includes('Inbound') || (type.includes('Manual Adjustment') && plus)) {
    return { t: 'up', l: 'same', a: 'up' };
  }
  if (type.includes('Manual Adjustment') && minus) {
    return { t: 'down', l: 'same', a: 'down' };
  }
  if (type === 'Outbound Occupy') {
    return { t: 'same', l: 'up', a: 'down' };
  }
  if (type === 'Outbound Deduct') {
    return { t: 'down', l: 'down', a: 'same' };
  }
  return { t: 'same', l: 'same', a: 'same' };
}

function afterArrowSpan(dir) {
  if (dir === 'up') return '<span class="up">↑</span>';
  if (dir === 'down') return '<span class="down">↓</span>';
  return '';
}

function formatAfterChangeHtml(r) {
  const { total, locked, available } = r.after;
  const arrows = getAfterChangeArrows(r);
  return `T: ${total} ${afterArrowSpan(arrows.t)} / L: ${locked} ${afterArrowSpan(arrows.l)} / A: ${available} ${afterArrowSpan(arrows.a)}`;
}

const RECORD_VIEW_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5c-5 0-9.3 3.1-10.7 7.5C2.7 16.9 7 20 12 20s9.3-3.1 10.7-7.5C21.3 8.1 17 5 12 5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/></svg>`;

function recordViewButtonHtml(idx) {
  return `<button type="button" class="record-view-btn" title="View detail" aria-label="View detail" onclick="event.stopPropagation();openRecordDetail(${idx})">${RECORD_VIEW_ICON}</button>`;
}

function formatAfterChangeDetailHtml(r) {
  const { total, locked, available } = r.after;
  const arrows = getAfterChangeArrows(r);
  return `<span class="stock-change">Total ${total} ${afterArrowSpan(arrows.t)} · Locked ${locked} ${afterArrowSpan(arrows.l)} · Available ${available} ${afterArrowSpan(arrows.a)}</span>`;
}

function enrichRecordDetail(r) {
  const row = { ...r };
  if (row.type === 'Purchase Inbound' || row.type === 'Manual Inbound') {
    row.inboundNo = row.inboundNo || row.order;
    row.inboundType = row.inboundType || (row.sub === 'purchase' ? 'Purchase' : 'Manual');
    if (row.inboundType === 'Purchase' && !row.purchaseOrderNo) {
      row.purchaseOrderNo = 'PO-20260820001';
    }
  }
  if (row.type && row.type.includes('Manual Adjustment')) {
    row.direction = row.direction || (row.qty.startsWith('+') ? 'Increase' : 'Decrease');
    row.adjQty = row.adjQty || row.qty.replace(/^[+-]/, '');
    row.adjType = row.adjType || '—';
    row.reason = row.reason || '—';
    row.attachment = row.attachment || '—';
  }
  if (row.type === 'Outbound Occupy' || row.type === 'Outbound Deduct') {
    row.outboundNo = row.outboundNo || row.order;
    row.relatedOrderNo = row.relatedOrderNo || '—';
    row.shipmentNo = row.shipmentNo || row.trackingNo || '—';
    row.status = row.status || (row.type === 'Outbound Occupy' ? 'Allocated' : 'Shipped');
  }
  return row;
}

function detailRow(label, valueHtml) {
  return `<div class="label">${label}</div><div class="value">${valueHtml}</div>`;
}

function openRecordDetail(index) {
  const r = recordListCache[index];
  if (!r) return;
  let html = `<div class="record-detail-grid">
    ${detailRow('Time', r.time)}
    ${detailRow('Warehouse', r.warehouse)}
    ${detailRow('Zone', r.zone)}
    ${detailRow('SKU ID', r.sku)}
    ${detailRow('Qty', r.qty)}
    ${detailRow('After Change', formatAfterChangeDetailHtml(r))}
    ${detailRow('Type', r.type)}
    ${detailRow('Operator', r.operator)}
  </div>`;

  if (r.type === 'Purchase Inbound' || r.type === 'Manual Inbound') {
    const po = r.purchaseOrderNo
      ? `<a class="btn-link" href="#" onclick="event.preventDefault();showToast('Open purchase order: ${r.purchaseOrderNo}')">${r.purchaseOrderNo}</a>`
      : '—';
    html += `<div class="record-detail-section"><h4>Inbound</h4><div class="record-detail-grid">
      ${detailRow('Inbound No.', r.inboundNo)}
      ${detailRow('Inbound Type', r.inboundType)}
      ${detailRow('Purchase Order No.', po)}
    </div></div>`;
  }

  if (r.type && r.type.includes('Manual Adjustment')) {
    html += `<div class="record-detail-section"><h4>Inventory Adjustment</h4><div class="record-detail-grid">
      ${detailRow('Adjustment No.', r.order)}
      ${detailRow('Direction', r.direction)}
      ${detailRow('Adjustment Qty', r.adjQty)}
      ${detailRow('Adjustment Type', r.adjType)}
      ${detailRow('Reason', r.reason)}
      ${detailRow('Attachment', r.attachment)}
    </div></div>`;
  }

  if (r.type === 'Outbound Occupy' || r.type === 'Outbound Deduct') {
    html += `<div class="record-detail-section"><h4>Outbound</h4><div class="record-detail-grid">
      ${detailRow('Outbound No.', r.outboundNo)}
      ${detailRow('Related Order No.', r.relatedOrderNo)}
      ${detailRow('Shipment No.', r.shipmentNo)}
      ${detailRow('Status', r.status)}
    </div></div>`;
  }

  document.getElementById('record-detail-body').innerHTML = html;
  openModal('record-detail-modal');
}

// ========== Utilities ==========
function populateWarehouseSelects() {
  const options = '<option value="">All</option>' +
    warehouses.map(w => `<option value="${w.id}">${w.id} - ${w.name}</option>`).join('');

  ['zone-filter-warehouse', 'spu-filter-warehouse', 'sku-filter-warehouse', 'record-filter-warehouse'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = options;
  });

  if (lockedZoneWarehouse) {
    document.getElementById('zone-filter-warehouse').value = lockedZoneWarehouse;
  }
  applyWarehouseScopeToFilters();
  const hideFilters = getWarehouseScope() !== 'all';
  document.querySelectorAll('.filter-wh-scope').forEach(el => {
    el.style.display = hideFilters ? 'none' : '';
  });
}

function openModal(id) {
  document.getElementById(id).classList.add('show');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}
