# 入库 / 出库 Excel 与表单修订 — 文档修改定位

> **统一规则（2026-10-28）**：出入库上传 Excel 均以 **SKU ID 为主键**匹配商品/库存行；**Product Name、SKU、PAN** 等由 SKU ID（或主数据）**联动展示**，不再以 Product Name / PAN 作为上传匹配键。  
> **Git 正文**：`KickBazar-WMS-Inbound-PRD.md`、`KickBazar-WMS-Outbound-PRD.md`、`KickBazar-WMS-PRD.md`  
> **原型**：`prototype/js/inbound.js`（`parsePurchaseXlsxMatrix`、`resolveInboundSkuBySkuId`）、`prototype/js/outbound.js`（`validateAndResolveOutboundRows`）

---

## 1 入库 PRD（`KickBazar-WMS-Inbound-PRD.md`）

| 飞书 / 章节锚点 | 修改内容 |
|-----------------|----------|
| **文首版本** | **2026-10-28**；SKU ID 主键 |
| **§1.1** 采购入库 bullet | 匹配改为 **SKU ID**；Name 联动 |
| **§2.2** 匹配规则表 | Purchase：**SKU ID** 必填列；Manual：**SKU ID** 搜索 |
| **§3** 第 3 条 | 采购 xlsx：**SKU ID** + 需求数量 |
| **§6.1** 第 6 点 | Unmatched 改为 **SKU ID** |
| **§7.1** 列映射表 | **SKU ID 必填**；Product Name **可选** |
| **§7.1** 流程 1–4 | 表头校验、按 SKU ID 匹配、Unmatched 文案 |
| **§7.3** 标题与表 | 原「Product Name 匹配」→ **「SKU ID 匹配」** |
| **§7.5** 末句 | 匹配键 **SKU ID** |
| **§13** | 追加 Product Name 匹配 → SKU ID 主键 |
| **附录 A** 第 5 点 | 采购 xlsx **SKU ID 必填** |

**Excel 模板（`采购.xlsx`）必填列**：`采购单号`、`物流单号`（单运单规则不变）、**`SKU ID`**、`需求数量`；`Product Name` 可选。

---

## 2 出库 PRD（`KickBazar-WMS-Outbound-PRD.md`）

| 飞书 / 章节锚点 | 修改内容 |
|-----------------|----------|
| **文首版本** | **2026-10-28** |
| **§2.1** 订单解析 | **SKU ID 必填**；PAN 可选校验 |
| **§7.1** 文件格式表 | SKU ID **主键**；PAN **可选**；Name/SKU **联动展示** |
| **§7.2** 校验面板 | 列序 **Order No. → SKU ID → Name → SKU → PAN → Qty** |
| **§7.5** Admin 导出 | 第 1 列 SKU ID（主键）、第 2 列 PAN（可选） |
| **§13** | PAN 主键 → **SKU ID 主键** |
| **附录 A** Import | `resolveOutboundSku` + SKU ID 必填 |

**Excel 模板（`订单列表.xlsx`）必填列**：**`SKU ID`**、`MerchantOrderID`、`ItemQuantity`；`PAN` 可选（与 SKU ID 一致）。

---

## 3 基础 PRD（`KickBazar-WMS-PRD.md`）

| 章节 | 修改内容 |
|------|----------|
| **文档说明**（文首） | 入库 **SKU ID**；出库 **SKU ID** 见出库 §7.1 |
| **§5.0.2** 入库匹配规则 | **`采购.xlsx`（SKU ID 列）** |
| **§6.1** 流水详情末句 | 采购上传匹配键 **SKU ID** |

---

## 4 飞书粘贴包（`PRD-基础模块-飞书粘贴修订.md`）

| 位置 | 操作 |
|------|------|
| **§11**（2026-10-27 段） | 补充：**2026-10-28 起 Excel 以 SKU ID 为主键**；见本定位文档 §1–§2 |
| **§1 / §5.0.2 / §6.1** 旧块 | 仍写 ItemDesc / Product Name 处 → 改为 **SKU ID**（与 Git 基础 PRD 一致） |

---

## 5 样例与 UI 文案（非 PRD 正文）

| 路径 | 说明 |
|------|------|
| `prototype/index.html` | 采购/出库 Import hint：**SKU ID 匹配主键** |
| `docs/fixtures/订单列表-import-sample.csv` | 首列 **SKU ID** |
| `prototype/samples/采购*.xlsx` | 须含 **SKU ID** 列（运营模板同步） |

---

## 6 与上一版（Product Name / PAN 匹配）差异

| 模块 | 旧规则 | 新规则 |
|------|--------|--------|
| 入库 Parse | Product Name → 模糊匹配 SKU | **SKU ID** → 仓内库存行 |
| 出库 Import | PAN 优先 | **SKU ID 必填**；PAN 仅校验 |
| 行表/校验表 | Name 在前匹配 | **SKU ID 在前**；Name/SKU 只读 |

---

*维护顺序：改 Git 三份 PRD → 按上表更新飞书同名节 → 更新运营 Excel 模板。*
