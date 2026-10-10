# KickBazar WMS Prototype

Warehouse Management System (WMS) interactive HTML prototype based on PRD specifications.

## Overview

1440×900 web prototype covering:

- **Warehouses → Warehouse Management** — List, create, edit, view, delete warehouses
- **Warehouses → Zone Management** — List, create, edit, view, delete zones
- **Inventory → SPU/SKU Inventory** — SPU expandable view and SKU detail view
- **Inventory → Record** — Inbound (All/Manual/Purchase/Opening), Outbound Occupy, Outbound Deduct, All tabs
- **Inventory → SPU/SKU Inventory** — SKU tab **Inventory Adjustment** modal; writes manual flow to Record

## Quick Start

### 单文件版（推荐，无需服务器）

**整包导出**（Dashboard / 仓库设置 / 库存 / 流水 / 全站 SPA）：

```
export/KickBazar-WMS-Export.zip
```

或直接打开：

| 路径 | 内容 |
|------|------|
| `export/KickBazar-WMS-Prototype.html` | 全站 SPA（与 `prototype/kickbazar-wms-prototype.html` 同步） |
| `export/KickBazar-WMS-Inventory.html` | SPU/SKU 库存 + 库存调整 |
| `export/KickBazar-WMS-Inventory-Record.html` | 库存流水 |
| `export/KickBazar-WMS-Dashboard.html` | Dashboard |
| `export/KickBazar-WMS-Warehouse-Setup.html` | 仓库/库区（Admin） |

开发用单文件：

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
| Record tabs | Inbound / Occupy / Deduct / All; Inbound sub-tabs include Manual |
| Inventory adjustment | SKU view → Inventory Adjustment → confirm → see Record → Inbound → Manual |

## Files

```
prototype/
├── index.html      # Main SPA with all views
├── css/styles.css  # Layout and component styles
└── js/app.js       # Mock data and interactivity
```
