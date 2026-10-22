# KickBazar WMS 原型

## 打开方式（重要）

解压后**同一文件夹**内必须保留两个文件，再双击 HTML：

| 文件 | 作用 |
|------|------|
| **KickBazar-WMS.html** | 页面结构 + 内联 CSS |
| **KickBazar-WMS.bundle.js** | 演示数据与全部交互逻辑 |

只复制 HTML、或只解压了其中一个文件 → **有样式但表格/KPI 为空**。

若必须单文件：使用 zip 内的 **`KickBazar-WMS-all-in-one.html`**（体积更大，部分环境加载较慢）。

## 仍然没有数据？

1. 右上角点击 **Reload demo data**（清除本地 Role/仓库范围后重载种子数据）。
2. 侧栏 Warehouse 选 **All warehouses**，Role 选 **Admin**。
3. F12 → Console 查看是否有 `KickBazar-WMS.bundle.js` 404 或脚本错误。

## 打包

仓库根目录：`python3 scripts/build-wms-html.py`（会更新本目录 HTML、`.bundle.js` 与 zip）。
