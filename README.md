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

1. 在仓库根目录执行打包（会更新 HTML **与** zip）：

```bash
python3 scripts/build-wms-html.py
```

2. 用浏览器打开 **`export/KickBazar-WMS.html`**（约 1.2MB，内联 CSS/JS，与 `prototype/kickbazar-wms-prototype.html` 相同）。

3. 需要 zip 分发时使用 **`export/KickBazar-WMS-Export.zip`**（须为上述 build 生成；旧 zip 内 HTML 仅 ~200KB，**无完整样式与 Outbound 等数据**）。

`export/KickBazar-WMS-Dashboard.html` 等拆分文件为历史稿，**请勿用于验收**。

### 多文件版

必须从 **`prototype` 目录**起本地服务（否则 `css/styles.css` 加载失败会无样式）：

```bash
cd prototype
python3 -m http.server 8080
```

浏览器打开 http://localhost:8080/（建议视口 1440×900）。若样式未加载，页面顶部会提示上述两种方式。

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
