# KickBazar WMS 基础 PRD — 飞书修订粘贴包

> **用途**：在飞书《KickBazar WMS 产品需求说明（仓库与库存）》中 **按「定位锚点」搜索**，用下方 **「替换为」** 整段覆盖（或插入缺失段落）。  
> **源文件**：仓库 `docs/KickBazar-WMS-PRD.md`（2026-10 入库流程整理：无独立 PO 模块、无入库 Draft、Record 关联单号口径）。  
> **独立 PRD**：入库 [`KickBazar-WMS-Inbound-PRD.md`](KickBazar-WMS-Inbound-PRD.md)、出库 [`KickBazar-WMS-Outbound-PRD.md`](KickBazar-WMS-Outbound-PRD.md)。

---

## 修订总览（建议操作顺序）

| 序号 | 飞书中定位锚点（搜索） | 操作 |
|------|------------------------|------|
| 1 | `> **文档说明**` 或 `作业单据` | 替换文档说明引用块 |
| 2 | `### 1.3 系统模块与侧栏导航` | 替换整节 §1.3（含表 + Dashboard 一句） |
| 3 | `#### 5.0.1 库存行初始化` 段首 `WMS **不在` | 改一句 + 新增/替换 §5.0.2、§5.0.3 |
| 4 | `## 6 库存流水` 至 `### 6.1 入库流水` | 替换 §6 共用列 + 关联单号表 + §6.1 全文 |
| 5 | `### 7.2 Quick Actions` | 替换 Quick Actions 表（3 张→2 张） |
| 6 | `Order No.` 且上下文为 Today's Operations | 替换 Order No. 行说明 |
| 7 | `### 8.2 写账与流水` | 替换写账表一行（采购入库表述） |
| 8 | `## 9 关联模块 PRD` | 替换 §9 全文（去掉采购单行） |
| 9 | `## 附录：与原型差异` 入库/单据号行 | 替换附录相关行 |

**删除（若飞书正文仍存在）**：

- 侧栏 / 导航表中的 **Purchase Order / 采购单** 整行  
- §9 表格中 **采购单 Purchase Order** 整行  
- §8.2 中 **「采购单状态流转」** 行（若曾添加）  
- 全文 **Link PO / Add Products / 入库 Draft** 等与旧入库交互的表述（已迁至入库独立 PRD）

---

## 1. 文档说明（文首引用块）

**定位锚点**：`本文档为 WMS **仓库与库存基础** PRD`

**替换为**：

```markdown
> **文档说明**  
> 本文档为 WMS **仓库与库存基础** PRD（**第 1–8 章** + **§9 关联索引**），与飞书主 PRD 同源。  
> **作业单据**（入库 / 出库）不在本文展开，见：《KickBazar-WMS-Inbound-PRD》（入库）、《KickBazar-WMS-Outbound-PRD》（出库）。**本期不含**独立采购单（PO）模块；采购到货通过入库 **采购单导入**（上传 `采购单文档订单列表.xlsx`，按 **ItemDesc** 匹配 SKU）完成。  
> **2026-10 修订**：Dashboard 仓库上下文；库区去掉 Zone Name；Record Tab 与全局筛选见第 6、7 章；SKU 导入与零库存初始化见 §5.0；入库类流水 **Related Order No. = Inbound No.**（§6.1）。
```

---

## 2. §1.3 系统模块与侧栏导航

**定位锚点**：`### 1.3 系统模块与侧栏导航`

**替换为（含表后一句）**：

```markdown
### 1.3 系统模块与侧栏导航

**侧栏顺序（本期）：**

| 顺序 | 一级目录 | 说明 |
|------|----------|------|
| — | **Warehouse**（侧栏顶部） | Admin：**下拉**切换 All/指定仓（仅 Home 页生效）；仓管：只读所属仓 |
| 1 | Home | Dashboard（§7） |
| 2 | Inventory | SPU/SKU inventory、Record |
| 3 | **Inbound** | 入库（见入库独立 PRD） |
| 4 | Outbound | 出库单 |
| 5 | **Warehouses** | **仅 Admin**：Warehouse Management、Zone Management |

Dashboard **Quick Actions** 与侧栏 **Inbound** / **Outbound** 跳转对应列表页。
```

---

## 3. §5.0.1 首句 + §5.0.2 / §5.0.3

**定位锚点**：`#### 5.0.1 库存行初始化`

**将段首一句替换为**：

```markdown
WMS **不在入库页面创建 SKU 主数据**；仓内可作业前提如下：
```

**定位锚点**：`#### 5.0.2 入库/出库/调整前置条件`（若无 §5.0.3，在 §5.0.2 表格后追加）

**§5.0.2 表格后追加段落**：

```markdown
**入库匹配规则**：采购 xlsx（**ItemDesc**）与手动搜 SKU 均只能匹配 **当前 `warehouse_code` 下已存在库存行** 的 SKU；**不得**因入库而 **自动新建** 库存行或商品主数据。若需新 SKU 进仓，须先走 **§5.0.1 下发/初始化** 再入库。
```

**§5.0.3（新增或替换「与采购/入库模块衔接」）**：

```markdown
#### 5.0.3 与入库模块衔接

- 入库单行上的 SKU，仅允许引用 **§5.0.1 已初始化** 的行；入库写账见入库独立 PRD §9（Confirm Stock-In）。
- Record / Inventory 查询结果与上述库存行 **同一数据源**。
```

---

## 4. §6 库存流水 — 共用列 + 关联单号语义 + §6.1

**定位锚点**：`**共用列**：时间、仓库`

**在「共用列」段落后、`### 6.1` 之前插入（若已有则整段替换）**：

```markdown
**共用列**：时间、仓库、库区（编码+类型）、SKU ID、数量、变更后 Total/Locked/Available（含↑↓规则）、类型、**关联单号（Related Order No.）**、操作人。  
支持 **行点击 / View** 打开**流水详情**（入库/出库/调整扩展字段分块）；关联单号一期文本展示，不强制跳转。

**关联单号列语义（按 Type）**：

| 流水 Type | Related Order No. 取值 |
|-----------|-------------------------|
| Purchase Inbound / Manual Inbound | **Inbound No.**（`IN-{YYYYMMDD}{seq3}`，与入库单 `receipt_no` 一致） |
| Outbound Occupy / Outbound Deduct | Outbound No.（详情中另展示电商平台订单号等） |
| Manual Adjustment (±) | Adjustment No.（`ADJ-*`） |
```

**定位锚点**：`### 6.1 入库流水`

**替换 §6.1 全文为**：

```markdown
### 6.1 入库流水（Tab：Inbound）

**类型**：手动入库（Manual Inbound）、采购入库（Purchase Inbound）。期初场景统一走入库单上架，**不单独 Opening 类型/子筛**（若业务后续启用再开子筛）。

**子筛**：All / **Manual** / **Purchase**

- **不含**库存调整单流水（调整单仅 §6.4）。
- 列表 **Related Order No.**：**仅展示 Inbound No.**，不展示外部电商订单号、MerchantOrderId 或任何 PO 模块单号。
- **流水详情 — Inbound 扩展区**（View 弹层/详情页）：
  - **Related Order No.**（与列表一致，= Inbound No.）
  - Inbound Type（Manual / Purchase，对应手动导入 / 采购文件导入）
  - **Inbound Remarks**（入库单头备注，含采购文件导入异常、数量差异说明等）
  - 行级：**ItemDesc**（采购 xlsx 源文本，手动导入为 —）、Product Name、Specification、行备注（若有）
```

---

## 5. §7.2 Quick Actions

**定位锚点**：`### 7.2 Quick Actions`

**替换表格为**：

```markdown
### 7.2 Quick Actions（主任务入口）

**区块标题**：Quick Actions。一行 **2** 张大卡片（图标 + 文案 + 右箭头）：

| 中文 | 英文 | 跳转 |
|------|------|------|
| 入库 | Inbound | 入库单列表 |
| 出库 | Outbound | 出库单列表 |
```

---

## 6. §7.4 Today's Operations — Order No.

**定位锚点**：Today's Operations 表格中的 `Order No.`

**将该行「说明」列替换为**：

```markdown
| Order No. | 关联单号（文本）；**入库类流水 = Inbound No.**（与 Record §6.1、列表 Related Order No. 一致） |
```

---

## 7. §8.2 写账表

**定位锚点**：`| 事件 | 实物 | 锁定 |`

**将「采购/手动入库」或「采购单」相关行统一为**：

```markdown
| 采购文件/手动入库确认上架 | ↑ | — | ↑ | Inbound |
```

**删除行（若存在）**：`| 采购单状态流转（未上架） | 不变 | 不变 | 不变 | 仅 PO |`

---

## 8. §8.3 删仓校验（可选一句）

**定位锚点**：`删仓前：`

**替换为**：

```markdown
- 删仓前：无库存且无未完成入出库单。
```

---

## 9. §9 关联模块 PRD

**定位锚点**：`## 9 关联模块 PRD`

**整节替换为**：

```markdown
## 9 关联模块 PRD（入库 / 出库）

本文档仅描述 **仓库、库区、库存、流水、Dashboard** 等基础能力。以下作业模块有 **独立 PRD**，正文不在此重复：

| 模块 | 文档 | 与基础 PRD 的边界 |
|------|------|-------------------|
| **入库** Inbound | KickBazar-WMS-Inbound-PRD | Stocked In 写 **§6.1** 流水并 UPDATE 已有库存行；**禁止**入库流程建 SKU/库存行；**无 Draft**；采购到货 = 采购文件导入 + ItemDesc |
| **出库** Outbound | KickBazar-WMS-Outbound-PRD | 分配写 **§6.2** Occupy；发货扣减写 Deduct；拣货/打包不改库存（**§8.2**） |

侧栏与 Dashboard Quick Actions 进入 **Inbound / Outbound**；实现与验收以 **独立 PRD** 为准。
```

---

## 10. 附录（实现跟踪）— 建议改两行

**定位锚点**：附录表 `单据号` / `入库` 行

**替换为**：

```markdown
| 单据号 | `IN-20260821001`、`OB…`、`ADJ-YYYYMMDDNNN` | 入库流水 Related Order No. = Inbound No. |
| 入库 | 独立 PRD | 采购 xlsx（ItemDesc）+ 手动导入；Confirm Stock-In 写流水 |
```

---

## 附：与入库独立 PRD 的边界（可贴在 §9 后作说明，非必须）

```markdown
**入库（不在基础 PRD 展开）**：每次操作一个 **Inbound No.**；类型为 **采购单导入**（xlsx）或 **手动导入**；列表仅 **Processing / Stocked In**；无独立 PO 模块、无 Draft。详情字段与 Record 联动见入库 PRD §7.4–§7.5。
```

---

---

## 11. 入库 / 出库 Excel 与表单（2026-10-27 / 2026-10-28）

**完整修改定位表**：见 [`PRD-入库出库-表单与导入修订-文档定位.md`](PRD-入库出库-表单与导入修订-文档定位.md)（**2026-10-28：SKU ID 为上传 Excel 匹配主键**）。

**飞书必改（2026-10-28）**：入库 §2.2、§7.1、§7.3；出库 §7.1、§7.2；基础 PRD §5.0.2、§6.1。

**飞书必改（表单 2026-10-27）**：入库 §6.1、§5.1.1、附录 A；出库 §7.5。

**本粘贴包 §1 / §5.0.2 / §6.1 若仍写 ItemDesc / Product Name 匹配**：改为 **SKU ID**（与 Git `KickBazar-WMS-PRD.md` 一致）。

---

*本粘贴包与仓库 `docs/KickBazar-WMS-PRD.md` 同步；入库/出库细则以两份独立 PRD 为准。*
