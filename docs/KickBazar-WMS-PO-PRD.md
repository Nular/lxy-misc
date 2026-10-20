# KickBazar WMS — 采购单产品需求说明（Purchase Order）

> **文档性质**：采购单 **独立 PRD**，与《KickBazar WMS 产品需求说明（仓库与库存）》(`KickBazar-WMS-PRD.md`) 及《入库模块 PRD》(`KickBazar-WMS-Inbound-PRD.md`) 配套。  
> **范围**：采购单列表、创建、编辑、查看、删除、导入；**不写库存**。上架写账由 **入库单 Stocked In** 完成（见 Inbound PRD）。  
> **不包含**：仓库/库区主数据、库存行初始化（基础 PRD §5.0.1）、入库单正文（Inbound PRD）。

---

## 1 模块定位与基础模块关系

- **数据范围**：受基础 PRD **§2.1 `warehouse_context`** 约束；列表默认仅展示当前上下文仓库的 PO（`warehouse_code`）。
- **不写库存**：PO 创建/编辑/导入**不**改 `total/locked`；**入库完成（Stocked In）** 后由 **入库单** 写账并生成 **基础 PRD §6.1 入库流水**。
- **商品主数据**：SKU ID、名称、规格、条码自 **Seller/商品库只读**；PO 行可带 **Qty、单价、链接** 等采购属性，不在 WMS 建品。
- **SKU 可选范围（拍板）**：Add Products / Import **仅能选择或匹配** 当前 `warehouse_code` 下 **基础 PRD §5.0.1 已生成库存行** 的 SKU（初始 Total=0 即可）；未下发 SKU **不可加入 PO 行**。
- **与旧稿差异**：原「Creation Method = Manual Adjustment」改为 **Manual Entry**（避免与库存调整单 ADJ 混淆）。
- **引用方向**：**入库单引用 PO**（PO 不引用入库单）；Linked Receipt No. 在 PO 列表用于搜索已关联的 `IN-*` 入库单。

---

## 2 功能列表

查看 / 创建 / 编辑 / 删除采购单；搜索；Status、Creation Method 筛选；分页（默认 20，可选 20/50/100/500）；新建排序在前。

---

## 3 单号与编码规则

| 字段 | 规则 |
|------|------|
| **Order No.** (`po_no`) | `PO-{YYYYMMDD}{seq3}`；全局唯一，系统生成，不可改。例：`PO-20260821088` |
| **warehouse_code** | 创建时取当前上下文仓，canonical 5 位（基础 PRD §3.2.1），例 `SH001` |
| **Linked Receipt No.** | 关联入库单号 `IN-{YYYYMMDD}{seq3}`（Inbound PRD §4.1），一对多 |

`seq3`：按自然日全局递增，3 位数字（001–999），事务分配。展示与落库均为 **前缀 + 连字符 + 日期流水连写**（`PO-20260821088`），**不要**写成 `PO-20260821-0088`。

---

## 4 搜索与筛选

- **搜索类别（单选）**：Order No.（默认） / Linked Receipt No.
- **搜索推荐框**：焦点或输入时展示；高度 1–5 行，超出滚动；空关键词展示当前仓全部候选，有关键词做包含过滤。点击推荐项立即搜索。
- **Search**：无关键词 = 刷新全量；有关键词 = 模糊匹配，**精确匹配排第一**（BR201/BR202）。
- **Status（多选，OR）**：**全部 10 态均在 WMS**（见 §5）。
- **Creation Method**：Manual Entry / Import Created（多选 OR）。
- **Filter / Reset**：无选中时置灰；Reset 清空条件。

---

## 5 状态与删除（WMS 全量）

| Status | 说明 | 删除 |
|--------|------|------|
| Draft | 草稿，可编辑全单 | 无关联单据可删 |
| Processing | 导入进行中；列表 View 进度；**全系统最多 2 个并发导入任务**（PO+入库合计或分模块各 2，产品实现按模块计） | 不可删 |
| Created | 信息编辑完成 | 无关联 Receipt 可删 |
| Pending Shipment | 待发货 | 不可删 |
| Partially Shipped | 部分发货 | 不可删 |
| Shipped | 全部发货 | 不可删 |
| Partially Received | 部分收货 | 不可删 |
| Received | 全部收货 | 不可删 |
| Partially Stocked In | 部分入库 | 不可删 |
| Stocked In | 全部入库 | 不可删，仅查看 |

**Draft** 可编辑全单；**Stocked In / Processing** 仅查看；其余态可改**商品行状态**（不改主数据）。

---

## 6 SKU 行状态（与 PO 头联动）

行状态：Pending Shipment → Shipped → Received → **Stocked In**。  
- 所有行同态 → 头状态与行一致。  
- 行态不同 → 头状态优先级：**Partially Stocked In > Partially Received > Partially Shipped**。  
行优先级：Stocked In > Received > Shipped > Pending Shipment。

---

## 7 编辑页（Create Purchase Order）

三种互斥录入方式：

1. **Add Products** — 从 **当前仓已初始化库存行** 的 SKU 列表勾选（可联查商品库展示名称/规格/条码，只读）；**不展示**未下发 SKU。  
2. **Import** — 表头校验；按 **SKU ID** 匹配 **当前仓 + 默认/指定 `zone_code` 库存行**（基础 PRD §5.0.2）；未匹配行进入 **失败明细**，不自动建 SKU/库存行；最多 **2** 个并发导入任务；Processing 时 Delete 置灰  
3. （无「引用入库单」；引用方向为 **入库单引用 PO**）

- 草稿保留：localStorage / 服务端草稿（产品实现）；SKU 行上限 **10,000** 行。  
- 保存成功后可 **Print**；有行时出现 **Delete All** 二次确认。  
- 行字段（B2B 建议）：SKU ID、Product Name、Specification、**Qty（整数 1–9,999,999）**、**Unit Price（decimal(16,4)）**、Link、Cargo Type、Shipment Type、Remarks 等。

---

## 8 主 PRD 索引

| 主题 | 位置 |
|------|------|
| 库存行初始化、SKU 匹配拍板 | `KickBazar-WMS-PRD.md` §5.0.1–§5.0.2 |
| 仓库上下文 | §2.1 |
| 入库上架写账 | `KickBazar-WMS-Inbound-PRD.md` §9 |
| 写账总表 | `KickBazar-WMS-PRD.md` §8.2 |
