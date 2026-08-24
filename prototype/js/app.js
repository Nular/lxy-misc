// KickBazar WMS Prototype - App Logic

// ========== Mock Data ==========
let warehouses = [
  {
    id: 'SH-001', name: 'Shanghai Main Warehouse', attribute: 'normal', status: 'enable',
    zoneCount: 5, total: 12580, locked: 2340, available: 10240,
    address: 'China, Shanghai, Pudong, No.888 Zhangyang Road',
    owner: 'Zhang Wei', contact: 'Li Ming', phone: '+86 138 0013 8000',
    country: 'CN', state: 'SH', city: 'PD', detail: 'No.888 Zhangyang Road',
    longitude: '121.5447', latitude: '31.2244', area: 5000, height: 12,
    weighing: 'compliant', fire: 'compliant', hasStock: true, hasPendingOrders: false
  },
  {
    id: 'BJ-001', name: 'Beijing Distribution Center', attribute: 'cold chain', status: 'enable',
    zoneCount: 3, total: 8920, locked: 1560, available: 7360,
    address: 'China, Beijing, Chaoyang, No.15 Jianguo Road',
    owner: 'Wang Fang', contact: 'Chen Hua', phone: '+86 139 0013 9000',
    country: 'CN', state: 'BJ', city: 'CY', detail: 'No.15 Jianguo Road',
    longitude: '116.4551', latitude: '39.9189', area: 3200, height: 10,
    weighing: 'pending', fire: 'compliant', hasStock: true, hasPendingOrders: false
  },
  {
    id: 'GZ-001', name: 'Guangzhou South Hub', attribute: 'fireproof', status: 'disable',
    zoneCount: 3, total: 0, locked: 0, available: 0,
    address: 'China, Guangdong, Guangzhou, No.100 Tianhe Road',
    owner: 'Liu Yang', contact: 'Liu Yang', phone: '+86 137 0013 7000',
    country: 'CN', state: 'GD', city: 'GZ', detail: 'No.100 Tianhe Road',
    longitude: '', latitude: '', area: 2800, height: 8,
    weighing: 'pending', fire: 'pending', hasStock: false, hasPendingOrders: false
  },
  {
    id: 'SG-001', name: 'Singapore Regional Warehouse', attribute: 'thermostatic', status: 'enable',
    zoneCount: 4, total: 4560, locked: 890, available: 3670,
    address: 'Singapore, Central, 10 Anson Road',
    owner: 'Tan Wei Ming', contact: 'Tan Wei Ming', phone: '+65 9123 4567',
    country: 'SG', state: 'Central', city: 'SG', detail: '10 Anson Road',
    longitude: '103.8198', latitude: '1.2754', area: 1500, height: 6,
    weighing: 'compliant', fire: 'compliant', hasStock: true, hasPendingOrders: true
  },
  {
    id: 'SH-002', name: 'Shanghai Backup Warehouse', attribute: 'normal', status: 'disable',
    zoneCount: 3, total: 0, locked: 0, available: 0,
    address: 'China, Shanghai, Minhang, No.200 Humin Road',
    owner: 'Zhao Lei', contact: 'Zhao Lei', phone: '+86 136 0013 6000',
    country: 'CN', state: 'SH', city: 'MH', detail: 'No.200 Humin Road',
    longitude: '', latitude: '', area: 1800, height: 8,
    weighing: 'pending', fire: 'pending', hasStock: false, hasPendingOrders: false
  }
];

let zones = [
  { whId: 'SH-001', code: 'SH-001-RCV', type: 'Receiving Zone', name: 'Receiving Zone', status: 'disable', total: 120, locked: 0, available: 120 },
  { whId: 'SH-001', code: 'SH-001-STO', type: 'Storage Zone', name: 'Main Storage', status: 'enable', total: 12200, locked: 2300, available: 9900 },
  { whId: 'SH-001', code: 'SH-001-SHP', type: 'Shipping Zone', name: 'Shipping Zone', status: 'disable', total: 180, locked: 40, available: 140 },
  { whId: 'SH-001', code: 'SH-001-DMG', type: 'Damaged Goods Zone', name: 'Damaged Goods', status: 'disable', total: 80, locked: 0, available: 80 },
  { whId: 'SH-001', code: 'SH-001-PKG', type: 'Packing Zone', name: 'Packing Zone', status: 'disable', total: 0, locked: 0, available: 0 },
  { whId: 'BJ-001', code: 'BJ-001-RCV', type: 'Receiving Zone', name: 'Receiving Zone', status: 'disable', total: 0, locked: 0, available: 0 },
  { whId: 'BJ-001', code: 'BJ-001-STO', type: 'Storage Zone', name: 'Cold Storage', status: 'enable', total: 8920, locked: 1560, available: 7360 },
  { whId: 'BJ-001', code: 'BJ-001-SHP', type: 'Shipping Zone', name: 'Shipping Zone', status: 'disable', total: 0, locked: 0, available: 0 },
  { whId: 'GZ-001', code: 'GZ-001-RCV', type: 'Receiving Zone', name: 'Receiving Zone', status: 'disable', total: 0, locked: 0, available: 0 },
  { whId: 'GZ-001', code: 'GZ-001-STO', type: 'Storage Zone', name: 'Storage Zone', status: 'enable', total: 0, locked: 0, available: 0 },
  { whId: 'GZ-001', code: 'GZ-001-SHP', type: 'Shipping Zone', name: 'Shipping Zone', status: 'disable', total: 0, locked: 0, available: 0 },
  { whId: 'SG-001', code: 'SG-001-RCV', type: 'Receiving Zone', name: 'Receiving Zone', status: 'disable', total: 50, locked: 0, available: 50 },
  { whId: 'SG-001', code: 'SG-001-STO', type: 'Storage Zone', name: 'Storage Zone', status: 'enable', total: 4200, locked: 800, available: 3400 },
  { whId: 'SG-001', code: 'SG-001-SHP', type: 'Shipping Zone', name: 'Shipping Zone', status: 'disable', total: 200, locked: 60, available: 140 },
  { whId: 'SG-001', code: 'SG-001-RTN', type: 'Returns Zone', name: 'Returns Zone', status: 'disable', total: 110, locked: 30, available: 80 },
  { whId: 'SH-002', code: 'SH-002-RCV', type: 'Receiving Zone', name: 'Receiving Zone', status: 'disable', total: 0, locked: 0, available: 0 },
  { whId: 'SH-002', code: 'SH-002-STO', type: 'Storage Zone', name: 'Storage Zone', status: 'enable', total: 0, locked: 0, available: 0 },
  { whId: 'SH-002', code: 'SH-002-SHP', type: 'Shipping Zone', name: 'Shipping Zone', status: 'disable', total: 0, locked: 0, available: 0 }
];

const spuData = [
  {
    productId: 'PRD-10001', productName: 'Wireless Bluetooth Earbuds Pro',
    skuCount: 3, total: 2580, locked: 420, available: 2160,
    warehouse: '-', zoneName: '-',
    skus: [
      { skuId: 'SKU-10001-BK', spec: 'Black', total: 1200, locked: 200, available: 1000, warehouse: 'Shanghai Main Warehouse', zone: 'Main Storage' },
      { skuId: 'SKU-10001-WH', spec: 'White', total: 980, locked: 150, available: 830, warehouse: 'Shanghai Main Warehouse', zone: 'Main Storage' },
      { skuId: 'SKU-10001-BL', spec: 'Blue', total: 400, locked: 70, available: 330, warehouse: 'Beijing Distribution Center', zone: 'Cold Storage' }
    ]
  },
  {
    productId: 'PRD-10002', productName: 'Smart Watch Series X',
    skuCount: 2, total: 1560, locked: 280, available: 1280,
    warehouse: 'Shanghai Main Warehouse', zoneName: 'Main Storage',
    skus: [
      { skuId: 'SKU-10002-42', spec: '42mm Silver', total: 900, locked: 160, available: 740, warehouse: 'Shanghai Main Warehouse', zone: 'Main Storage' },
      { skuId: 'SKU-10002-46', spec: '46mm Black', total: 660, locked: 120, available: 540, warehouse: 'Shanghai Main Warehouse', zone: 'Main Storage' }
    ]
  },
  {
    productId: 'PRD-10003', productName: 'Portable Power Bank 20000mAh',
    skuCount: 1, total: 3200, locked: 560, available: 2640,
    warehouse: 'Beijing Distribution Center', zoneName: 'Cold Storage',
    skus: [
      { skuId: 'SKU-10003-01', spec: 'Standard', total: 3200, locked: 560, available: 2640, warehouse: 'Beijing Distribution Center', zone: 'Cold Storage' }
    ]
  }
];

const skuData = [
  { skuId: 'SKU-10001-BK', spec: 'Black', productName: 'Wireless Bluetooth Earbuds Pro', total: 1200, locked: 200, available: 1000, warehouse: 'Shanghai Main Warehouse', zone: 'Main Storage', zoneCode: 'SH-001-STO', barcode: 'EAN: 6901234567890', barcodes: ['EAN: 6901234567890', 'UPC: 012345678901', 'PAN: KB-10001-BK'] },
  { skuId: 'SKU-10001-WH', spec: 'White', productName: 'Wireless Bluetooth Earbuds Pro', total: 980, locked: 150, available: 830, warehouse: 'Shanghai Main Warehouse', zone: 'Main Storage', zoneCode: 'SH-001-STO', barcode: 'EAN: 6901234567891', barcodes: ['EAN: 6901234567891'] },
  { skuId: 'SKU-10001-BL', spec: 'Blue', productName: 'Wireless Bluetooth Earbuds Pro', total: 400, locked: 70, available: 330, warehouse: 'Beijing Distribution Center', zone: 'Cold Storage', zoneCode: 'BJ-001-STO', barcode: 'UPC: 012345678902', barcodes: ['UPC: 012345678902', 'PAN: KB-10001-BL'] },
  { skuId: 'SKU-10002-42', spec: '42mm Silver', productName: 'Smart Watch Series X', total: 900, locked: 160, available: 740, warehouse: 'Shanghai Main Warehouse', zone: 'Main Storage', zoneCode: 'SH-001-STO', barcode: 'EAN: 6901234567900', barcodes: ['EAN: 6901234567900'] },
  { skuId: 'SKU-10002-46', spec: '46mm Black', productName: 'Smart Watch Series X', total: 660, locked: 120, available: 540, warehouse: 'Shanghai Main Warehouse', zone: 'Main Storage', zoneCode: 'SH-001-STO', barcode: 'EAN: 6901234567901', barcodes: ['EAN: 6901234567901', 'PAN: KB-10002-46'] },
  { skuId: 'SKU-10003-01', spec: 'Standard', productName: 'Portable Power Bank 20000mAh', total: 3200, locked: 560, available: 2640, warehouse: 'Beijing Distribution Center', zone: 'Cold Storage', zoneCode: 'BJ-001-STO', barcode: 'EAN: 6901234567910', barcodes: ['EAN: 6901234567910'] },
  { skuId: 'SKU-10004-01', spec: '128GB', productName: 'USB-C Flash Drive', total: 450, locked: 80, available: 370, warehouse: 'Singapore Regional Warehouse', zone: 'Storage Zone', zoneCode: 'SG-001-STO', barcode: 'PAN: KB-10004-01', barcodes: ['PAN: KB-10004-01'] }
];

const recordData = {
  inbound: [
    { time: '2026-08-21 09:32:15', warehouse: 'SH-001', zone: 'SH-001-STO (Storage)', sku: 'SKU-10001-BK', qty: '+200', after: { total: 1200, locked: 200, available: 1000 }, type: 'Purchase Inbound', order: 'IN-20260821001', operator: 'Zhang Wei', sub: 'purchase' },
    { time: '2026-08-20 14:18:42', warehouse: 'SH-001', zone: 'SH-001-STO (Storage)', sku: 'SKU-10002-42', qty: '+150', after: { total: 900, locked: 160, available: 740 }, type: 'Purchase Inbound', order: 'IN-20260820003', operator: 'Li Ming', sub: 'purchase' },
    { time: '2026-08-19 10:05:30', warehouse: 'BJ-001', zone: 'BJ-001-STO (Storage)', sku: 'SKU-10003-01', qty: '+500', after: { total: 3200, locked: 560, available: 2640 }, type: 'Manual Adjustment', order: 'IN-20260819001', operator: 'Wang Fang', sub: 'initial' },
    { time: '2026-08-18 16:22:08', warehouse: 'SG-001', zone: 'SG-001-STO (Storage)', sku: 'SKU-10004-01', qty: '+100', after: { total: 450, locked: 80, available: 370 }, type: 'Purchase Inbound', order: 'IN-20260818002', operator: 'Tan Wei Ming', sub: 'purchase' }
  ],
  occupy: [
    { time: '2026-08-21 11:45:22', warehouse: 'SH-001', zone: 'SH-001-STO (Storage)', sku: 'SKU-10001-BK', qty: '50', after: { total: 1200, locked: 200, available: 1000 }, type: 'Outbound Occupy', order: 'OUT-20260821005', operator: 'System' },
    { time: '2026-08-21 10:30:18', warehouse: 'SH-001', zone: 'SH-001-STO (Storage)', sku: 'SKU-10002-42', qty: '30', after: { total: 900, locked: 160, available: 740 }, type: 'Outbound Occupy', order: 'OUT-20260821003', operator: 'System' },
    { time: '2026-08-20 15:12:55', warehouse: 'BJ-001', zone: 'BJ-001-STO (Storage)', sku: 'SKU-10003-01', qty: '100', after: { total: 3200, locked: 560, available: 2640 }, type: 'Outbound Occupy', order: 'OUT-20260820008', operator: 'System' }
  ],
  deduct: [
    { time: '2026-08-21 14:20:33', warehouse: 'SH-001', zone: 'SH-001-STO (Storage)', sku: 'SKU-10001-WH', qty: '-25', after: { total: 980, locked: 150, available: 830 }, type: 'Outbound Deduct', order: 'OUT-20260820012', operator: 'Li Ming' },
    { time: '2026-08-20 17:05:41', warehouse: 'SH-001', zone: 'SH-001-STO (Storage)', sku: 'SKU-10001-BK', qty: '-40', after: { total: 1000, locked: 150, available: 850 }, type: 'Outbound Deduct', order: 'OUT-20260819015', operator: 'Zhang Wei' }
  ],
  unfreeze: [
    { time: '2026-08-20 09:15:28', warehouse: 'SH-001', zone: 'SH-001-STO (Storage)', sku: 'SKU-10002-46', qty: '20', after: { total: 660, locked: 100, available: 560 }, type: 'Unfreeze', order: 'OUT-20260819010', operator: 'System' },
    { time: '2026-08-19 11:42:17', warehouse: 'BJ-001', zone: 'BJ-001-STO (Storage)', sku: 'SKU-10003-01', qty: '50', after: { total: 3200, locked: 510, available: 2690 }, type: 'Unfreeze', order: 'OUT-20260818005', operator: 'System' }
  ]
};

let currentWarehouseEdit = null;
let currentZoneEdit = null;
let deleteTarget = null;
let lockedZoneWarehouse = null;
let currentRecordTab = 'inbound';

// ========== Init ==========
document.addEventListener('DOMContentLoaded', () => {
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
      if (group === 'inbound') navigateTo('inbound');
      if (group === 'outbound') navigateTo('outbound');
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
}

// ========== Home / Dashboard ==========
function renderHome() {
  const totalStock = warehouses.reduce((s, w) => s + w.total, 0);
  const totalLocked = warehouses.reduce((s, w) => s + w.locked, 0);
  const totalAvailable = warehouses.reduce((s, w) => s + w.available, 0);
  const activeWarehouses = warehouses.filter(w => w.status === 'enable').length;

  document.getElementById('dashboard-kpi').innerHTML = `
    <div class="kpi-card total">
      <span class="kpi-label">Total Inventory</span>
      <span class="kpi-value">${totalStock.toLocaleString()}</span>
      <span class="kpi-sub">Across ${warehouses.length} warehouses</span>
    </div>
    <div class="kpi-card locked">
      <span class="kpi-label">Locked Inventory</span>
      <span class="kpi-value">${totalLocked.toLocaleString()}</span>
      <span class="kpi-sub">Reserved for outbound orders</span>
    </div>
    <div class="kpi-card available">
      <span class="kpi-label">Available Inventory</span>
      <span class="kpi-value">${totalAvailable.toLocaleString()}</span>
      <span class="kpi-sub">Total − Locked (real-time)</span>
    </div>
    <div class="kpi-card warehouses">
      <span class="kpi-label">Active Warehouses</span>
      <span class="kpi-value">${activeWarehouses}</span>
      <span class="kpi-sub">${warehouses.length} total registered</span>
    </div>
  `;

  document.getElementById('dashboard-warehouse-table').innerHTML = warehouses
    .filter(w => w.total > 0)
    .map(w => `
      <tr onclick="navigateTo('warehouse-management')" style="cursor:pointer">
        <td><strong>${w.id}</strong><br><span style="color:#999;font-size:11px">${w.name}</span></td>
        <td>${getStatusTag(w.status)}</td>
        <td>${w.total.toLocaleString()}</td>
        <td>${w.locked.toLocaleString()}</td>
        <td>${w.available.toLocaleString()}</td>
      </tr>
    `).join('') || '<tr><td colspan="5" style="text-align:center;color:#999">No inventory data</td></tr>';

  const allRecords = [
    ...recordData.inbound,
    ...recordData.occupy,
    ...recordData.deduct,
    ...recordData.unfreeze
  ].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 6);

  const typeClass = {
    'Purchase Inbound': 'type-inbound', 'Manual Adjustment': 'type-inbound',
    'Outbound Occupy': 'type-occupy', 'Outbound Deduct': 'type-deduct', 'Unfreeze': 'type-unfreeze'
  };

  document.getElementById('dashboard-activity-table').innerHTML = allRecords.map(r => `
    <tr onclick="navigateTo('record')" style="cursor:pointer">
      <td>${r.time.split(' ')[0]}<br><span style="color:#999;font-size:11px">${r.time.split(' ')[1]}</span></td>
      <td class="${typeClass[r.type] || ''}">${r.type}</td>
      <td>${r.sku}</td>
      <td style="font-weight:500">${r.qty}</td>
      <td>${r.order}</td>
    </tr>
  `).join('');

  const quickLinks = [
    { page: 'warehouse-management', icon: '🏭', title: 'Warehouses', desc: 'Manage warehouse master data' },
    { page: 'zone-management', icon: '📦', title: 'Zones', desc: 'Configure storage zones' },
    { page: 'spu-sku-inventory', icon: '📊', title: 'Inventory', desc: 'View SPU/SKU stock levels' },
    { page: 'record', icon: '📋', title: 'Records', desc: 'Track inventory transactions' }
  ];

  document.getElementById('dashboard-quick-access').innerHTML = quickLinks.map(q => `
    <div class="quick-card" onclick="navigateTo('${q.page}')">
      <span class="quick-icon">${q.icon}</span>
      <span class="quick-title">${q.title}</span>
      <span class="quick-desc">${q.desc}</span>
    </div>
  `).join('');
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
  document.getElementById('wh-total').textContent = warehouses.length;

  if (warehouses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="12"><div class="empty-state"><div class="icon">📦</div><p>No data</p><button class="btn btn-primary" onclick="openCreateWarehouse()">Add Warehouse</button></div></td></tr>`;
    return;
  }

  tbody.innerHTML = warehouses.map(wh => `
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
    const newId = 'SH-' + String(warehouses.length + 1).padStart(3, '0');
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
      { whId: newId, code: `${newId}-RCV`, type: 'Receiving Zone', name: 'Receiving Zone', status: 'disable', total: 0, locked: 0, available: 0 },
      { whId: newId, code: `${newId}-STO`, type: 'Storage Zone', name: 'Storage Zone', status: 'enable', total: 0, locked: 0, available: 0 },
      { whId: newId, code: `${newId}-SHP`, type: 'Shipping Zone', name: 'Shipping Zone', status: 'disable', total: 0, locked: 0, available: 0 }
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
  let filtered = zones;
  if (whFilter) filtered = zones.filter(z => z.whId === whFilter);

  document.getElementById('zone-total').textContent = filtered.length;

  tbody.innerHTML = filtered.map(z => `
    <tr>
      <td>${z.whId}</td>
      <td>${z.code}</td>
      <td>${getZoneTypeTag(z.type)}</td>
      <td>${z.name}</td>
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
  document.getElementById('zone-name').value = z.name;
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
  const zoneName = document.getElementById('zone-name').value || zoneType;
  const zoneCode = document.getElementById('zone-code').value;
  const status = document.getElementById('zone-status').value;

  if (currentZoneEdit) {
    if (status === 'enable' && currentZoneEdit.type !== 'Storage Zone' && currentZoneEdit.status === 'disable') {
      showToast('Not available in this version.', 'warning');
      document.getElementById('zone-status').value = 'disable';
      return;
    }
    currentZoneEdit.name = zoneName;
    currentZoneEdit.status = status;
    closeModal('zone-modal');
    renderZones();
    showToast('Zone updated.', 'success');
  } else {
    if (!zoneType || !zoneCode) {
      showToast('Please fill in required fields.', 'error');
      return;
    }
    zones.push({ whId, code: zoneCode, type: zoneType, name: zoneName, status, total: 0, locked: 0, available: 0 });
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

function renderSpuTable() {
  const tbody = document.getElementById('spu-table-body');
  tbody.innerHTML = spuData.map((spu, idx) => `
    <tr>
      <td><span class="expand-icon" onclick="toggleSpuExpand(${idx}, this)">▶</span></td>
      <td>${spu.productId}</td>
      <td>${spu.productName}</td>
      <td>${spu.skuCount}</td>
      <td>${spu.total.toLocaleString()}</td>
      <td>${spu.locked.toLocaleString()}</td>
      <td>${spu.available.toLocaleString()}</td>
      <td>${spu.warehouse}</td>
      <td>${spu.zoneName}</td>
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
            ${spu.skus.map(s => `
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
  `).join('');
}

function toggleSpuExpand(idx, el) {
  const row = document.getElementById('spu-expand-' + idx);
  const isHidden = row.style.display === 'none';
  row.style.display = isHidden ? 'table-row' : 'none';
  el.classList.toggle('expanded', isHidden);
}

function renderSkuTable() {
  const tbody = document.getElementById('sku-table-body');
  tbody.innerHTML = skuData.map(s => `
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
    </tr>
  `).join('');
}

// ========== Records ==========
function initRecordTabs() {
  document.querySelectorAll('#record-tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#record-tabs .tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentRecordTab = tab.dataset.recordTab;
      document.getElementById('inbound-sub-tabs').style.display =
        currentRecordTab === 'inbound' ? 'flex' : 'none';
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
}

function renderRecords() {
  const tbody = document.getElementById('record-table-body');
  let data = [];

  if (currentRecordTab === 'all') {
    data = [...recordData.inbound, ...recordData.occupy, ...recordData.deduct, ...recordData.unfreeze];
    data.sort((a, b) => b.time.localeCompare(a.time));
  } else if (currentRecordTab === 'inbound') {
    data = recordData.inbound;
    const activeSub = document.querySelector('#inbound-sub-tabs .sub-tab.active');
    if (activeSub) {
      const subText = activeSub.textContent.trim().toLowerCase();
      if (subText === 'initial stock') data = data.filter(d => d.sub === 'initial');
      if (subText === 'purchase') data = data.filter(d => d.sub === 'purchase');
    }
  } else {
    data = recordData[currentRecordTab] || [];
  }

  const typeClass = { 'Purchase Inbound': 'type-inbound', 'Manual Adjustment': 'type-inbound', 'Outbound Occupy': 'type-occupy', 'Outbound Deduct': 'type-deduct', 'Unfreeze': 'type-unfreeze' };

  tbody.innerHTML = data.map(r => {
    const qtyClass = r.qty.startsWith('+') ? 'up' : r.qty.startsWith('-') ? 'down' : '';
    return `
      <tr>
        <td>${r.time}</td>
        <td>${r.warehouse}</td>
        <td>${r.zone}</td>
        <td>${r.sku}</td>
        <td class="${qtyClass}" style="font-weight:500">${r.qty}</td>
        <td class="stock-change">
          T: ${r.after.total} / L: ${r.after.locked} / A: ${r.after.available}
        </td>
        <td class="${typeClass[r.type] || ''}">${r.type}</td>
        <td>${r.order}</td>
        <td>${r.operator}</td>
      </tr>
    `;
  }).join('');
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
