# KickBazar WMS 原型（单文件）

**一个 HTML 包含全部交互**：Dashboard、Inbound、Outbound、仓库/库区、SPU/SKU 库存、Inventory Record 等。

- 分辨率：1440×900  
- **推荐**：直接双击本目录下的 **`KickBazar-WMS.html`**（无需服务器，样式与脚本已内联）

## 下载 zip

`KickBazar-WMS-Export.zip` 与 **`KickBazar-WMS.html` 同源**，由 `python3 scripts/build-wms-html.py` 在每次打包时**同步生成**。若 zip 体积只有约 40KB、解压后 HTML 约 200KB，说明是旧包，请拉取最新代码后重新执行 build，或直接使用仓库里的 `KickBazar-WMS.html`（约 1.2MB）。

zip 内含：

- `KickBazar-WMS.html` — 完整可交互原型  
- `README.md` — 本说明  

## 多文件开发版

```bash
cd prototype
python3 -m http.server 8080
```

浏览器打开 http://localhost:8080/（不要只复制 HTML 到别的目录，否则 `css/`、`js/` 相对路径会失效）。

## 勿用旧拆分页

`export/KickBazar-WMS-Dashboard.html`、`KickBazar-WMS-Inventory.html` 等为**历史单页稿**，数据与样式均不完整。请只用 **`KickBazar-WMS.html`**。

## 演示提示

1. 右上角 **Role** 切 Admin；侧栏 **Warehouse** 选 All 可看全仓数据。  
2. **Outbound → Import Orders → Use sample file**（MO-DEMO-2026）可走分配与发运。  
3. **localStorage** 在同文件内会保留角色/仓库范围等设置。
