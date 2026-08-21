# KickBazar WMS Prototype

Warehouse Management System (WMS) interactive HTML prototype based on PRD specifications.

## Overview

1440×900 web prototype covering:

- **Warehouses → Warehouse Management** — List, create, edit, view, delete warehouses
- **Warehouses → Zone Management** — List, create, edit, view, delete zones
- **Inventory → SPU/SKU Inventory** — SPU expandable view and SKU detail view
- **Inventory → Record** — Inbound, Outbound Occupy, Outbound Deduct, Unfreeze, All tabs

## Quick Start

### 单文件版（推荐，无需服务器）

直接双击打开：

```
prototype/kickbazar-wms-prototype.html
```

### 多文件版

```bash
cd prototype
python3 -m http.server 8080
```

Open http://localhost:8080 in your browser (recommended viewport: 1440×900).

## Navigation Structure

```
Inventory
  ├── SPU/SKU inventory
  └── Record
Inbound (placeholder)
Outbound (placeholder)
Warehouses
  ├── Warehouse Management
  └── Zone Management
```

## Key Interactions

| Action | How |
|--------|-----|
| Create warehouse | Click "Add Warehouse" → fill form → Create |
| Edit warehouse | Click row or "Edit" link |
| View warehouse | Click "View" link (read-only) |
| Manage zones | Double-click Zone Count cell |
| Create zone | Zone Management → "Add Zone" |
| SPU expand | Click ▶ icon to expand SKU sub-table |
| Record tabs | Switch between Inbound / Occupy / Deduct / Unfreeze / All |

## Files

```
prototype/
├── index.html      # Main SPA with all views
├── css/styles.css  # Layout and component styles
└── js/app.js       # Mock data and interactivity
```
