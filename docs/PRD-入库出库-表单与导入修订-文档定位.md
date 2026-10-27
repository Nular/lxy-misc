# 入库 / 出库表单与导入修订 — 文档修改定位（2026-10-27）

> **用途**：飞书 / Confluence 与 Git 仓库 PRD 对账；按「锚点 → 改什么」粘贴或替换。  
> **代码已实现**：`prototype/js/inbound.js`、`prototype/js/outbound.js`（分支 `cursor/wms-record-detail-1759`）。

---

## 1 仓库正文（Git 源-of-truth）

| 文档路径 | 本次已改章节（飞书入库 PRD 请同步同名节） | 改动要点 |
|----------|------------------------------------------|----------|
| [`KickBazar-WMS-Inbound-PRD.md`](KickBazar-WMS-Inbound-PRD.md) | **文首版本** | 版本号 **2026-10-27** |
| 同上 | **§3 功能清单** 第 5–6 条 | 表单 + SKU ID 行表；Remarks 规则；Delete 二次确认 |
| 同上 | **§5.1.1** 绑定规则表 | 新增行 **Inbound No. ↔ PO ↔ PAN** |
| 同上 | **§6.1** 全文第 4–7 点 | **表单字段**、**行表列序**、Remarks、与手动隐藏 PO/Shipping |
| 同上 | **§7.1** 列映射「需求数量」+ 流程 2–3 | Order Qty **只读**；SKU ID 列下拉 |
| 同上 | **§7.2** 手动流程 | SKU ID 主键、手动 Remarks 必填 |
| 同上 | **§7.3** 匹配表「多命中/单命中」 | SKU ID 下拉 + Name/SKU 只读联动 |
| 同上 | **§8.1** 行字段表 | Order Qty 只读/手输；Zone 不可选；Purchase Price/Supplier/PAN/Remarks |
| 同上 | **§13** 修订记录 | 新增 SKU ID 主键、手动 Remarks、Delete 确认等行 |
| 同上 | **附录 A** | 2026-10-27 七条摘要（替换旧附录） |
| [`KickBazar-WMS-Outbound-PRD.md`](KickBazar-WMS-Outbound-PRD.md) | **文首版本** | **2026-10-27** |
| 同上 | **§2.1** 订单解析 | **PAN 优先** |
| 同上 | **§7.1** 文件格式表 | **SKU ID、PAN** 为前两列；ItemDesc 标为兼容 |
| 同上 | **§7.2** 校验面板 | 列序 **Order No. → PAN → SKU ID → …** |
| 同上 | **§7.5**（原导出发运） | 拆为 **Admin 订单导出** + Export Shipping Order 列说明 |
| 同上 | **§13** 修订记录 | PAN 导入、Admin 导出两列 |
| 同上 | **附录 A** | PAN 解析与样例表头 |
| [`KickBazar-WMS-PRD.md`](KickBazar-WMS-PRD.md) | **§5.0.2、§6.1** | 已与 `采购.xlsx` / Product Name 对齐（**本次未改**；飞书基础 PRD 若仍写 ItemDesc 请以 Git 为准） |

---

## 2 飞书「入库模块 PRD」粘贴锚点（按你方文档标题）

在飞书中用标题搜索，**整段替换**或**在表中增行**：

| 飞书锚点标题 | 对应 Git | 操作 |
|--------------|----------|------|
| `1 模块目标` / `1.1 业务目标` | Inbound §1.1 | 一般无需改（逻辑未变） |
| `3 功能清单` | Inbound §3 | **替换**第 5–6 行功能描述 |
| `5.1.1 Purchase Order 与 Shipping No.` | Inbound §5.1.1 | **表格增行** PO ↔ PAN |
| `6.1 新建入库任务` | Inbound §6.1 | **替换**第 4–7 点（表单+行表+Remarks） |
| `7.1 采购单导入` | Inbound §7.1 | **改** Order Qty 说明 + 流程 2–3 |
| `7.2 手动导入` | Inbound §7.2 | **替换**第 2–3 点 |
| `7.3 Product Name 匹配` | Inbound §7.3 | **改**多命中/单命中两行 |
| `8.1 行字段定义` | Inbound §8.1 | **整表替换**为 Git §8.1（去重 Line Remark） |
| `13 修订记录` | Inbound §13 | **追加** Git 中新增行 |
| `附录 A` | Inbound 附录 A | **整段替换** |

---

## 3 飞书「出库模块 PRD」粘贴锚点

| 飞书锚点标题 | 对应 Git | 操作 |
|--------------|----------|------|
| `2.1 匹配与库区` | Outbound §2.1 | 订单解析改为 **PAN 优先** |
| `7.1 文件格式` | Outbound §7.1 | **整表替换**（SKU ID、PAN 列） |
| `7.2 导入前校验` | Outbound §7.2 | **改**校验表列序与失败原因 |
| `7.5` 或「导出发运表」 | Outbound §7.5 | **替换**为 Admin 导出 + 发运导出表 |
| `13 修订记录` | Outbound §13 | **追加** PAN 相关两行 |
| `附录 A` | Outbound 附录 A | **改** Import / Sample 描述 |

---

## 4 飞书「基础模块 PRD」（仍写 ItemDesc 时）

[`PRD-基础模块-飞书粘贴修订.md`](PRD-基础模块-飞书粘贴修订.md) 中 **§1 文档说明、§5.0.2、§6.1** 仍为旧 **ItemDesc** 表述。

| 建议 | 定位 |
|------|------|
| 采购到货入口 | 文档说明段 → 改为 **Purchase Inbound + `采购.xlsx` + Product Name**（与 `KickBazar-WMS-PRD.md` 文首一致） |
| 入库匹配 | §5.0.2 段 → **Product Name**（非 ItemDesc） |
| 流水详情 | §6.1 → **单页 Record Detail**（无 ItemDesc 子区块），见 Inbound §7.5 |

完整替换块仍以 Git `KickBazar-WMS-PRD.md` §5.0.2、§6.1 为准复制到飞书。

---

## 5 样例与原型（非 PRD 正文，联调用）

| 路径 | 说明 |
|------|------|
| `docs/fixtures/订单列表-import-sample.csv` | 出库 Import 样例列（应与 §7.1 一致） |
| `prototype/index.html` | 入库行表 `<thead>`、Import 弹层 hint |
| `export/KickBazar-WMS.html` | 单页 bundle（`scripts/build-wms-html.py` 生成） |

---

## 6 业务规则速查（粘贴到飞书「关系对应」小节）

**入库**

- 1 **Inbound No.** = 1 **Purchase Order**
- 1 **PO** → 多个 **Shipping No.**（多个 Inbound / 多运单）
- 1 **PO** → 多个 **PAN**（多 SKU 行或多次入库）
- 行表以 **SKU ID** 为唯一标识；**Product Name / SKU** 只读联动

**出库**

- 商家 **Admin 订单导出**：第 1 列 **SKU ID**、第 2 列 **PAN**
- WMS **Import 校验表**：**PAN** 在 **SKU ID** 前；按 PAN 解析 Name / SKU / SKU ID

---

*维护：入库/出库逻辑变更时，先改 Git 两份独立 PRD，再按本表更新飞书同名章节。*
