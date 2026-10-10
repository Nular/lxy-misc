# KickBazar WMS 原型导出（离线单文件）

分辨率 **1440×900**。无需服务器，浏览器直接打开对应 HTML。

| 文件 | 说明 |
|------|------|
| `KickBazar-WMS-Prototype.html` | **全站 SPA**：Home、仓库/库区、SPU/SKU 库存（含库存调整）、流水等 |
| `KickBazar-WMS-Dashboard.html` | 运营 Dashboard（可跳转库存/流水） |
| `KickBazar-WMS-Warehouse-Setup.html` | 仓库与库区管理（Admin） |
| `KickBazar-WMS-Inventory.html` | SPU/SKU 库存 + 库存调整弹窗 |
| `KickBazar-WMS-Inventory-Record.html` | 库存流水（Inbound Manual 等） |

**库存调整演示**：先打开 Inventory 做调整，再打开 Record → Inbound → Manual（同浏览器 `localStorage` 联动）。

打包下载：同目录 `KickBazar-WMS-Export.zip`（由构建脚本生成）。
