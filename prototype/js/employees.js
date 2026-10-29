// System Setting → Employees (permission / account prototype)

let employees = [
  {
    employeeNo: '2026001',
    name: 'Zhang Wei',
    email: 'zhang.wei@kickbazar.com',
    phone: '+86 138 0013 8000',
    warehouseCode: '',
    role: 'admin',
    status: 'active',
    imageDataUrl: '',
    remark: 'Platform administrator',
    createdAt: '2026-01-08 09:00:00',
    lastLoginAt: '2026-10-27 08:12:33'
  },
  {
    employeeNo: '2026002',
    name: 'Li Ming',
    email: 'li.ming@kickbazar.com',
    phone: '+86 139 0013 9001',
    warehouseCode: 'SH001',
    role: 'warehouse',
    status: 'active',
    imageDataUrl: '',
    remark: 'Shanghai main warehouse manager',
    createdAt: '2026-02-14 11:20:00',
    lastLoginAt: '2026-10-26 17:45:02'
  },
  {
    employeeNo: '2026003',
    name: 'Wang Fang',
    email: 'wang.fang@kickbazar.com',
    phone: '+86 137 0013 7002',
    warehouseCode: 'BJ001',
    role: 'warehouse',
    status: 'locked',
    imageDataUrl: '',
    remark: 'Temporarily locked pending audit',
    createdAt: '2026-03-01 10:00:00',
    lastLoginAt: '2026-10-25 09:30:00'
  },
  {
    employeeNo: '2025004',
    name: 'Chen Hua',
    email: 'chen.hua@kickbazar.com',
    phone: '',
    warehouseCode: 'SH001',
    role: 'warehouse',
    status: 'disable',
    imageDataUrl: '',
    remark: 'Offboarded — account disabled',
    createdAt: '2025-11-20 14:00:00',
    lastLoginAt: '2026-08-01 12:00:00'
  }
];

let currentEmployeeEdit = null;
let employeeFormMode = 'create';

function nextEmployeeNo() {
  const year = new Date().getFullYear();
  let max = 0;
  employees.forEach(e => {
    const m = String(e.employeeNo).match(new RegExp('^' + year + '(\\d{3})$'));
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  return `${year}${String(max + 1).padStart(3, '0')}`;
}

function warehouseLabel(code) {
  if (!code) return 'All Warehouses (Admin)';
  const wh = warehouses.find(w => w.id === code);
  return wh ? `${wh.name} (${code})` : code;
}

function employeeStatusTagClass(status) {
  if (status === 'active') return 'tag-enable';
  if (status === 'locked') return 'tag-warning';
  return 'tag-disable';
}

function employeeAvatarHtml(emp) {
  if (emp.imageDataUrl) {
    return `<img class="emp-avatar" src="${emp.imageDataUrl}" alt="">`;
  }
  const initial = (emp.name || emp.email || '?').trim().charAt(0).toUpperCase();
  return `<span class="emp-avatar emp-avatar-fallback">${initial}</span>`;
}

function renderEmployeesList() {
  const tbody = document.getElementById('employees-table-body');
  if (!tbody) return;

  const field = document.getElementById('emp-search-field').value;
  const kw = (document.getElementById('emp-search-keyword').value || '').trim().toLowerCase();
  const status = document.getElementById('emp-filter-status').value;

  let rows = [...employees];
  if (kw) {
    rows = rows.filter(e => {
      const val = (() => {
        if (field === 'name') return e.name || '';
        if (field === 'email') return e.email || '';
        if (field === 'phone') return e.phone || '';
        if (field === 'employeeNo') return e.employeeNo || '';
        if (field === 'status') return e.status || '';
        return '';
      })();
      return val.toLowerCase().includes(kw);
    });
  }
  if (status) rows = rows.filter(e => e.status === status);
  rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const totalEl = document.getElementById('emp-list-total');
  if (totalEl) totalEl.textContent = rows.length;

  tbody.innerHTML = rows.map(e => `
    <tr>
      <td><strong>${e.employeeNo}</strong></td>
      <td class="emp-name-cell">${employeeAvatarHtml(e)}<span>${e.name || '—'}</span></td>
      <td>${e.email}</td>
      <td>${e.phone || '—'}</td>
      <td>${warehouseLabel(e.warehouseCode)}</td>
      <td><span class="tag ${employeeStatusTagClass(e.status)}">${e.status}</span></td>
      <td>${e.createdAt}</td>
      <td>${e.lastLoginAt || '—'}</td>
      <td>
        <div class="action-links">
          <a onclick="openEmployeeModal('view','${e.employeeNo}')">View</a>
          <a onclick="openEmployeeModal('edit','${e.employeeNo}')">Edit</a>
          <a class="danger" onclick="deleteEmployee('${e.employeeNo}')">Delete</a>
        </div>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="9" style="text-align:center;color:#999">No employees</td></tr>';
}

function searchEmployees() {
  renderEmployeesList();
  showToast('Employee search applied', 'success');
}

function resetEmployeeFilters() {
  document.getElementById('emp-search-keyword').value = '';
  document.getElementById('emp-filter-status').value = '';
  renderEmployeesList();
}

function populateEmployeeWarehouseSelect(selectId, selected) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = warehouses.map(w =>
    `<option value="${w.id}">${w.name} (${w.id})</option>`
  ).join('');
  if (selected) sel.value = selected;
}

function openEmployeeModal(mode, employeeNo) {
  if (!isAdminUser()) {
    showToast('Admin only.', 'error');
    return;
  }
  employeeFormMode = mode;
  currentEmployeeEdit = employeeNo ? employees.find(e => e.employeeNo === employeeNo) : null;

  const title = document.getElementById('employee-modal-title');
  const noWrap = document.getElementById('emp-no-wrap');
  const pwdWrap = document.getElementById('emp-password-wrap');
  const submitBtn = document.getElementById('employee-submit-btn');

  if (mode === 'create') {
    title.textContent = 'Add Employee';
    noWrap.hidden = true;
    pwdWrap.hidden = false;
    document.getElementById('emp-email').value = '';
    document.getElementById('emp-phone').value = '';
    document.getElementById('emp-password').value = '';
    document.getElementById('emp-password2').value = '';
    document.getElementById('emp-remark').value = '';
    document.getElementById('emp-name-wrap').hidden = true;
    populateEmployeeWarehouseSelect('emp-warehouse', warehouses[0]?.id);
    document.getElementById('emp-image-preview').innerHTML = '';
    document.getElementById('emp-image-file').value = '';
    submitBtn.textContent = 'Create';
    submitBtn.hidden = false;
  } else if (currentEmployeeEdit) {
    title.textContent = mode === 'view' ? 'View Employee' : 'Edit Employee';
    noWrap.hidden = false;
    document.getElementById('emp-no-display').value = currentEmployeeEdit.employeeNo;
    document.getElementById('emp-email').value = currentEmployeeEdit.email;
    document.getElementById('emp-phone').value = currentEmployeeEdit.phone || '';
    document.getElementById('emp-name-wrap').hidden = false;
    document.getElementById('emp-name').value = currentEmployeeEdit.name || '';
    document.getElementById('emp-remark').value = currentEmployeeEdit.remark || '';
    populateEmployeeWarehouseSelect('emp-warehouse', currentEmployeeEdit.warehouseCode || warehouses[0]?.id);
    document.getElementById('emp-status').value = currentEmployeeEdit.status;
    pwdWrap.hidden = mode === 'view';
    document.getElementById('emp-password').value = '';
    document.getElementById('emp-password2').value = '';
    document.getElementById('emp-image-preview').innerHTML = currentEmployeeEdit.imageDataUrl
      ? employeeAvatarHtml(currentEmployeeEdit)
      : employeeAvatarHtml(currentEmployeeEdit);
    submitBtn.textContent = 'Save';
    submitBtn.hidden = mode === 'view';
  }

  const ro = mode === 'view';
  ['emp-email', 'emp-phone', 'emp-name', 'emp-warehouse', 'emp-remark', 'emp-status', 'emp-password', 'emp-password2', 'emp-image-file'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = ro;
  });
  const statusWrap = document.getElementById('emp-status-wrap');
  statusWrap.hidden = mode === 'create';

  openModal('employee-modal');
}

function onEmployeeImagePicked(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const preview = document.getElementById('emp-image-preview');
    preview.innerHTML = `<img class="emp-avatar-lg" src="${reader.result}" alt="">`;
    preview.dataset.dataUrl = reader.result;
  };
  reader.readAsDataURL(file);
}

function submitEmployee() {
  const email = document.getElementById('emp-email').value.trim();
  const phone = document.getElementById('emp-phone').value.trim();
  const name = document.getElementById('emp-name').value.trim();
  const warehouseCode = document.getElementById('emp-warehouse').value;
  const remark = document.getElementById('emp-remark').value.trim();
  const preview = document.getElementById('emp-image-preview');
  const imageDataUrl = preview.dataset.dataUrl || (currentEmployeeEdit && currentEmployeeEdit.imageDataUrl) || '';

  if (!email) {
    showToast('Email is required.', 'error');
    return;
  }
  if (!warehouseCode) {
    showToast('Warehouse is required.', 'error');
    return;
  }

  if (employeeFormMode === 'create') {
    const pwd = document.getElementById('emp-password').value;
    const pwd2 = document.getElementById('emp-password2').value;
    if (!pwd) {
      showToast('Password is required.', 'error');
      return;
    }
    if (pwd !== pwd2) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    if (employees.some(e => e.email.toLowerCase() === email.toLowerCase())) {
      showToast('Email already exists.', 'error');
      return;
    }
    const displayName = name || email.split('@')[0];
    employees.unshift({
      employeeNo: nextEmployeeNo(),
      name: displayName,
      email,
      phone,
      warehouseCode,
      role: 'warehouse',
      status: 'disable',
      imageDataUrl,
      remark,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      lastLoginAt: '—'
    });
    showToast('Employee created.', 'success');
  } else if (currentEmployeeEdit && employeeFormMode === 'edit') {
    const pwd = document.getElementById('emp-password').value;
    const pwd2 = document.getElementById('emp-password2').value;
    if (pwd && pwd !== pwd2) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    Object.assign(currentEmployeeEdit, {
      name: name || currentEmployeeEdit.name,
      email,
      phone,
      warehouseCode,
      remark,
      status: document.getElementById('emp-status').value,
      imageDataUrl: imageDataUrl || currentEmployeeEdit.imageDataUrl
    });
    showToast('Employee updated.', 'success');
  }

  closeModal('employee-modal');
  renderEmployeesList();
}

function deleteEmployee(employeeNo) {
  if (!isAdminUser()) return;
  const emp = employees.find(e => e.employeeNo === employeeNo);
  if (!emp) return;
  if (!confirm(`Delete employee ${emp.name} (${employeeNo})?`)) return;
  employees = employees.filter(e => e.employeeNo !== employeeNo);
  renderEmployeesList();
  showToast('Employee deleted.', 'success');
}

function listEmployeesForWarehouseManagerSelect() {
  return employees.filter(e => e.status === 'active');
}
