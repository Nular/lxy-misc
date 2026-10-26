# KickBazar WMS — 入库模块产品需求说明（Inbound Receipt）

> **文档性质**：入库模块 **独立 PRD**，与《KickBazar WMS 产品需求说明（仓库与库存）》(`KickBazar-WMS-PRD.md`) 配套使用。  
> **范围**：入库任务（Inbound No.）列表、新建、采购 xlsx 导入、手动加行、确认上架写账、详情查看、与库存流水联动。  
> **不包含**：独立 **采购单（PO）模块**（本期不做）；仓库/库区主数据（主 PRD §3–§4）。  
> **版本**：2026-10-21（对齐原型：`采购.xlsx`、PO / Shipping No.、Record & Inbound 详情）  
> **原型参考**：`prototype/index.html`、`export/KickBazar-WMS.html`

---

## 1 模块目标

### 1.1 业务目标

1. 支持仓内 **上架入库**：将实物数量记入指定 **仓库 × 库区** 库存行，并生成 **库存流水**（Record → Inbound）。
2. 将线下两类入库收敛为系统内两种 **入库任务**（每次 **Confirm Stock-In** 生成一个 **Inbound No.**）：
   - **采购入库**（界面 **Purchase Inbound** / `Purchase Receipt`）：上传运营表 **`采购.xlsx`**，按 **Product Name** 匹配仓内 SKU；绑定 **采购单号（Purchase Order）** 与 **物流单号（Shipping No.）**；行级填写 Warehouse、Receipt Qty 等后上架。
   - **手动入库**（界面 **Manual Inbound** / `Manual Receipt`）：按 **Product Name** 模糊搜索加行，填写数量后上架（无 PO / Shipping / 源文件）。
3. 匹配失败行 **不入账**：提示无法匹配的商品（核对拼写或在 Seller 端上架），与线下「商品未上架先上架」一致。
4. **无 Draft**：未 Confirm Stock-In 的数据仅存在于当前新建弹层，不入列表；xlsx 解析可进入 **Processing**（异步进度）。**Stocked In** 后仅 **查看详情**，不可删改。

### 1.4 业务流程对照（线下 → 系统）

| 线下分支 | 系统入口 | 关键步骤 |
|----------|----------|----------|
| 采购单入库：按运单到货 → 上架 | **Purchase Inbound** | 上传 **单运单** `采购.xlsx` → 匹配 SKU → Confirm Stock-In |
| 无采购单入库 | **Manual Inbound** | 搜商品加行 → Confirm Stock-In |
| 实物与采购数量不一致 | 采购入库 + **行 Remark** | Order Qty ≠ Receipt Qty 时该行 Remark **必填** |

### 1.2 不在本模块范围

| 事项 | 归属 |
|------|------|
| 创建 SKU、维护 PAN/条码 | **商品库 / Seller**（WMS 只读） |
| 生成仓内零库存行 | **库存初始化**（主 PRD §5.0.1，入库前完成） |
| 盘盈盘亏、报损 | **库存调整单 ADJ**（主 PRD §5.3 → Record Manual Adjustment） |
### 1.3 入口与权限

- **侧栏**：Inbound（与主 PRD §1.3 一致）。
- **Dashboard**：Quick Actions → Inbound。
- **数据范围**：受 **`warehouse_context`** 约束（主 PRD §2.1）；列表与创建默认 **当前上下文 `warehouse_code`**；上下文为 All 时，列表需选仓或按产品规则禁止创建（**建议：创建/写账必须明确单仓**）。
- **角色**：Admin、仓库管理员（所属仓）；建仓/管库区仍 **Admin only**。

---

## 2 依赖：库存行初始化与匹配（拍板，必读）

以下规则与主 PRD **§5.0.1–§5.0.2** 一致，入库模块 **强制遵守**。

### 2.1 数据准备（入库前）

1. **商品主数据**自企业 **原有数据库（商品库）** 导入/同步至 WMS 可读层。
2. 对每个 **`warehouse_code` × 已启用 `zone_code`**，对 **已下发到该仓** 的 SKU 生成库存行：  
   **Total = 0，Locked = 0，Available = 0**（Available 不落库，实时 `total - locked`）。
3. 未完成该仓库存行初始化的，**禁止 Stocked In 写账**。

### 2.2 入库匹配规则

| 录入方式 | 匹配键 | 成功条件 | 失败 |
|----------|--------|----------|------|
| Purchase Inbound | **Product Name**（`采购.xlsx`）→ SKU | 匹配成功且 `(sku_id, warehouse_code, zone_code)` 存在；多 SKU **行内下拉必选** | Unmatched 提醒；无库存行拒绝写账 |
| Manual Inbound | Product Name 搜索 | 选择器 **仅展示** 已初始化库存行（含 Total=0） | 未下发 SKU **不可选** |

**禁止**：在入库单、Import 流程中 **INSERT** 商品主数据或库存行。

### 2.3 上架库区

- 默认：**Storage Zone**（`zone_type_code = STO`，如 `SH001STO`）。
- 须 **Enable**；停用仓/区不可作为新入库目标（主 PRD §8.1）。
- 本期规则：**入库上架进存储区**（收货区 RCV 预留，本期不强制经 RCV 过账）。

### 2.4 库存口径（写账时）

- **Receipt Qty**：本次实际上架数量（唯一增加 `total` 的字段）。
- **Locked** 不变；**Available** 随 `total` 增加而增加。
- 与全系统一致：**实物 = 锁定 + 未锁定**。

---

## 3 功能清单

| # | 功能 |
|---|------|
| 1 | 入库单列表（Time、Inbound No.、**Purchase Order**、**Shipping No.**、Inbound Type、SKU Qty、Operator、View） |
| 2 | **+ New Inbound**：下拉 **Purchase Inbound** / **Manual Inbound**（加行后不可切换） |
| 3 | 采购：上传 **`采购.xlsx`**（**每次仅允许一个物流单号**）、Product Name 匹配、PO/Shipping 绑定 |
| 4 | 手动：Product Name 搜索加行 |
| 5 | 行级 **Warehouse、Receipt Qty**；采购 **Zone=Storage 只读**、**Order Qty 可编辑** |
| 6 | 行 **Remark**（Order ≠ Receipt 时必填）；行 Delete / Delete All |
| 7 | 列表 **View**（眼睛）；**Inbound Detail** 头信息 + 行表；源文件 **Preview / Download** |
| 8 | **筛选**：Time、Inbound No.、Inbound Type、Operator（+ Admin 可选 Warehouse） |
| 9 | 写账生成 **Inbound No.**；同步 **Inventory Record → Inbound** 流水与详情 |
| 10 | 分页：20 / 50 / 100 / 500 |

---

## 4 单号与类型

### 4.1 Inbound No.（`receipt_no`）

- 界面文案：**Inbound No.**；字段名 `receipt_no`。  
- 格式：**`IN-{YYYYMMDD}{seq3}`**，全局唯一，系统生成，不可改。  
- 示例：`IN-20260821001`  
- `seq3`：按自然日递增，001–999，事务分配。  
- 与库存流水列表 **Related Order No.**（入库类）及详情 **Inbound No.** 一致（主 PRD §6.1）。

### 4.2 Inbound Type（入库类型）

| 界面文案 | 存储值 `receipt_type` | 流水 Type | Record → Inbound 子筛 |
|----------|----------------------|-----------|------------------------|
| **Purchase Inbound** | Purchase Receipt | Purchase Inbound | Purchase |
| **Manual Inbound** | Manual Receipt | Manual Inbound | Manual |

- **禁止**使用 **Manual Adjustment** 作为入库类型（与库存调整单 ADJ 区分）。

---


## 5 列表页

### 5.1 列表列（建议）

| 列 | 说明 |
|----|------|
| **Time** | 入库完成时间（`updated_at`） |
| **Warehouse** | **Admin + All warehouses** 时展示（仓库编码 + 名称）；单仓上下文隐藏 |
| **Inbound No.** | `IN-{YYYYMMDD}{seq3}` |
| **Purchase Order** | 采购入库显示 `采购单号`；手动入库 `—` |
| **Shipping No.** | 采购入库显示 `物流单号`；手动入库 `—` |
| **Inbound Type** | Purchase Inbound / Manual Inbound |
| **SKU Qty** | 明细行数 |
| **Operator** | 操作人 |
| **View** | 眼睛图标打开 **Inbound Detail**；**整行不可点** |

筛选栏顺序：**Time（起止，date 控件）**、Inbound No.、Inbound Type、Operator；（Admin + All 时可选 Warehouse）。

### 5.1.1 Purchase Order 与 Shipping No.（绑定规则）

| 规则 | 说明 |
|------|------|
| **Inbound No. ↔ Purchase Order** | **一个 Inbound No. 仅对应一个 Purchase Order**（一次 Confirm Stock-In） |
| **Purchase Order ↔ Shipping No.** | **一个 PO 可对应多个 Shipping No.**（分布在多个 Inbound 上，按运单分批入库） |
| **上传文件 ↔ Shipping No.** | **一次上传（一次 Parse）仅允许一个非空 `物流单号`**；文件含多个运单号 → **拒绝解析**并提示按运单拆表后分别建 Inbound |
| **Shipping No. 必填** | 采购入库 Confirm Stock-In 前须有 Shipping No.（来自 xlsx 或头字段汇总） |

### 5.2 搜索（Search）

#### 5.2.1 搜索类别（单选）

| 选项 | 含义 |
|------|------|
| **Inbound No.**（默认） | 入库单号 |
| **Source file name** | 采购导入文件名（模糊） |

#### 5.2.2 搜索推荐框

- **BR1**：高度 1–5 行；超过 5 行右侧滚动。  
- **焦点 / 输入时**展示推荐：  
  - 有搜索词：当前仓内，类别字段 **包含** 搜索词的候选列表。  
  - 无搜索词：当前仓内，该类别 **全部** 候选（Inbound No. 或源文件名）。  
- 点击推荐项：**立即执行搜索**。  
- 点击 **Search**：无内容 = 刷新全量（当前仓 + 保留筛选）；有内容 = 按词搜索。  
- **BR201**：精确匹配排第一；**BR202**：模糊匹配靠后。  
- 点击空白：关闭推荐框。

> 列表查询 **非实时**：以 Search / Filter 为准；须强制 `warehouse_code`（上下文或筛选注入）。

### 5.3 筛选（Status / Receipt Type）

1. 默认不选；**多选**；同一字段内选项为 **OR**。  
2. **Status** 与 **Receipt Type** 两组之间为 **AND**。  
3. 点击下拉外区域或 **Filter** 关闭下拉。  
4. **Filter / Reset**：无任何选中时 **置灰**；Reset 清空选中；Filter 应用列表。

| 筛选项 | 可选值 |
|--------|--------|
| **Status** | Processing、Stocked In |
| **Inbound Type** | Purchase Inbound、Manual Inbound |

### 5.4 状态说明与操作

| Status | 含义 | 列表操作 |
|--------|------|----------|
| **Processing** | xlsx 解析进行中（服务端/异步） | **Progress**；**不改** `total/locked` |
| **Stocked In** | 已 Confirm Stock-In | **Detail**；可下载原 xlsx（若留存） |

- 新建任务在 **Confirm Stock-In** 成功后才生成列表行（状态直接 **Stocked In**），或异步解析任务单独为 **Processing**。  
- **无 Draft**；**Stocked In 不可删除**（与删仓校验「未完成入库单」一致）。

### 5.5 排序与分页

- 默认：**创建时间降序**（新建在前）。  
- 分页：默认 **20** 条/页；可选 **20 / 50 / 100 / 500**。  
- **列表记忆**（从编辑/弹层返回）：保留 **页码、每页条数、筛选条件、滚动位置**（见 §13）。

---

## 6 创建 / 编辑 / 查看 / 删除

### 6.1 新建入库任务

1. 列表 **+ New Inbound** → **下拉**选择 **Purchase Inbound** 或 **Manual Inbound**（加行后不可再切换）。  
2. 弹层展示 **Inbound No.** 预览（提交时生成 **`IN-{YYYYMMDD}{seq3}`**）并写账。  
3. 标题：**New Inbound** / **View Inbound**。  
4. 头字段（采购）：**Inbound No.** 预览、**Purchase Order**、**Shipping No.**（只读，自解析结果）；**无头 Remarks**。  
5. 行表列（采购 / 手动 **统一顺序**）：**Product Name、SKU ID、SKU**（规格/下拉）、Warehouse、Zone（Storage **只读**）、**Purchase Price**、**Order Qty**（采购可编辑；手动为 —）、Receipt Qty、**Supplier**、**PAN**、Remark、Action。Purchase Price / Supplier / PAN 默认自 SKU 主数据带出，可改。  
6. **Order Qty ≠ Receipt Qty** → 行 **Remark 必填**；未匹配 Product Name **Warn** 可忽略并提交已匹配行；源文件 **保留**（Preview + Download）。  
7. 仅 **Cancel** 与 **Confirm Stock-In**；行 **Delete All**。

### 6.2 行数上限

- 单证最多 **10,000** 行 SKU。  
- 已达 10,000 再继续导入：Toast *You have already uploaded 10,000 records. Adding new data will clear all existing data.*（产品可改为禁止追加）。

---

## 7 两种录入方式（创建时选定，互斥）

| 录入方式 | Inbound Type | 典型场景 |
|----------|--------------|----------|
| **采购单导入** | Purchase Inbound | 上传 **采购.xlsx**，按 **Product Name** 匹配 SKU |
| **手动导入** | Manual Import | 零星到货、无采购文件 |

### 7.1 采购单导入（Purchase Inbound）

**文件**：`采购.xlsx`（运营采购跟踪表）。

**列映射**：

| 表头 | 系统字段 | 说明 |
|------|----------|------|
| 采购单号 | **Purchase Order** | 头字段 + 列表列；**一单一流水一个 PO** |
| 物流单号 | **Shipping No.** | 头字段 + 列表列；与 Inbound No. 绑定 |
| Product Name | **Product Name** | 匹配键（源文件原文展示） |
| 需求数量 | **Order Qty** | 解析后可 **编辑**；Receipt Qty 默认等于 Order Qty |

**流程**：

1. 上传 xlsx → 校验表头 → **Parse**。  
2. 按 **Product Name** 匹配当前仓已初始化 SKU；**单 SKU** 自动绑定并反显 **SKU ID**；**多 SKU** 行内 **下拉必选**（规格），选中后反显 SKU ID。  
3. 填写 **Warehouse**、**Receipt Qty**；**Zone** 默认 Storage Zone 不可改；**Order Qty ≠ Receipt Qty** 时行 **Remark** 必填。  
4. **匹配失败**：**Unmatched**（行号 + Product Name）；可忽略 Warn 提交已匹配行。  
5. **源文件** 系统保留；**Inbound Detail** 支持 **Preview**（表格）与 **Download**（原文件或预览矩阵导出）。  
6. **多物流单号**：解析前校验整表 `物流单号` 唯一，否则 Toast（中文）：*一次上传仅允许一个物流单号…请拆分 Excel 后分别创建 Inbound*。  
**表头非法**：Toast 提示重新上传。

### 7.2 手动导入（Manual Import）

1. **Search SKU**：输入 **SKU ID** 或 **Product Name**（包含匹配），数据源 = 当前上下文仓 **已初始化库存行**（Total=0 可选）。  
2. 选中后加行，只读带出商品信息；填写 **Warehouse、Zone、Receipt Qty**。  
3. 可追加多行；**Confirm Stock-In** 一次性提交。

### 7.3 Product Name 匹配（采购文件）

| 步骤 | 规则 |
|------|------|
| 匹配键 | **Product Name** 列（与商品库名/别名归一化后包含或分词匹配） |
| 多命中 | 行内 **SKU 下拉必选**；选中后带出 **SKU ID、Spec** |
| 单命中 | 自动绑定 SKU ID |
| 零命中 | Unmatched 列表，不入明细 |
| 库存行 | 绑定后须存在 `(sku_id, warehouse_code, zone_code)` 行（§2.2） |

### 7.4 Inbound Detail（列表 View）

**标题**：Inbound Detail。

**头信息（顺序固定）**：

| 字段 | 说明 |
|------|------|
| Time | 入库时间 |
| Inbound No. | 入库单号 |
| Purchase Order | 采购入库 PO；手动 `—` |
| Shipping No. | 采购入库运单号；手动 `—` |
| Inbound Type | Purchase Inbound / Manual Inbound |
| SKU Qty | 行数 |
| Operator | 操作人 |
| Source File | 文件名；**Preview** + **Download**（系统保留） |

**行表列**：Product Name、SKU ID、**SKU**（规格）、Qty Added（`+N`）、**After Change**（Total / Locked / Available + 变动箭头）、Remark。

### 7.5 与 Inventory Record 联动

- Stocked In 每明细行写一条 **Inbound 流水**；列表 **Related Order No.** = **Inbound No.**（主 PRD §6.1）。  
- 流水 **View → Record Detail**（**单页**，无旧版「Inbound」子区块）：Time、Warehouse、Zone、SKU ID、Product Name、**SKU**、Qty、**After Change**、Type、**Inbound No.**、Operator、**Inbound Remarks**（行备注聚合）、**Related Purchase Order**（含 **Preview** 跳转源文件）、**Shipping No.**  
- 不再展示 ItemDesc / Specification 分节字段；采购匹配键为 **Product Name**（非 ItemDesc 模板）。

---

## 8 行字段与校验

### 8.1 行字段定义

| 字段名称 | 中文 | 必填 | 默认值 | 说明 |
|----------|------|------|--------|------|
| SKU ID | SKU 编号 | Y | — | 4–50 字符；**§2.2 库存行须存在** |
| Product Name | 商品名称 | — | — | 匹配后 **只读** |
| SKU | 规格 | — | — | 展示列名 **SKU**（非 Spec）；多匹配时下拉 |
| Shipping No. | 物流单号 | Y（采购） | — | 来自 `物流单号`；头上汇总 |
| Purchase Order | 采购单号 | Y（采购） | — | 来自 `采购单号` |
| Order Qty | 需求数量 | N | — | 来自 `需求数量`，采购 **可编辑** |
| Line Remark | 行备注 | 条件必填 | — | Order Qty ≠ Receipt Qty 时 **必填** |
| Warehouse | 仓库 | Y | 上下文仓 | 行级可改（仓管仅所属仓） |
| **Receipt Qty** | 实际上架数量 | Y | — | 整数 **1–9,999,999**；**唯一写账数量** |
| Variance | 差异 | — | — | 计算：`Receipt Qty − Order Qty`，只读 |
| Zone | 库区 | Y | 默认 STO | 须 Enable；`zone_code` |
| Primary Barcode | 条码值 | N | — | **只读展示**（EAN 优先，主 PRD §1.2） |
| PAN | 平台码 | N | — | **只读**；13 位结构在 **商品库** 维护，不在入库页编辑 |
| Supplier | 供应商 | N | — | 可放头或行；1–200 字符 |
| Remarks（头） | — | — | — | **已取消**；异常仅用行 Remark |

### 8.2 相对旧稿删除/合并的字段

| 旧稿字段 | 处理 |
|----------|------|
| Total（行级「库存」） | **删除**；仓内 Total 仅在库存表，入库只加 Receipt Qty |
| Qty（与 Total 并存） | 合并为 **Receipt Qty**（手工/导入）或 **Order Qty + Receipt Qty**（PO） |
| Physical Inventory | **删除**；实盘对账不在入库强制 |
| Inventory Variance | 改为 **Variance**（仅 PO 场景，只读） |

### 8.3 输入框报错原则（附录，与旧稿一致）

1. **获焦**：无内容 / 有内容（正常或达上限临时异常：禁输入、红框、3 秒恢复；粘贴截断）。  
2. **失焦**：清除临时异常；**提交校验**失败保持永久异常直至改正。  
3. **提交**：Receipt Qty、Zone、SKU 存在性等；**Stocked In** 时服务端再次校验 §2.2。

---

## 9 Stocked In（确认上架 / 写账）

### 9.1 触发

- 用户确认 **Stocked In**（或旧稿「导入库存已完成」等价操作）。  
- 仅在新建弹层内完成行编辑后 **Confirm Stock-In**（xlsx 解析完成后仍在同一弹层确认）。

### 9.2 事务步骤（与主 PRD §8.2 一致）

在同一事务内：

1. **前置校验**（任一行失败 → **整单失败**）：  
   - 库存行 `(sku_id, warehouse_code, zone_code)` **存在**  
   - 仓库、库区 **Enable**  
   - Receipt Qty > 0  
   - 商品库 SKU 可读  
2. **UPDATE** 库存行：`total += receipt_qty`；`available = total - locked`（**禁止 INSERT 新库存行**）。  
3. **INSERT** 库存流水（Record）：  
   - Purchase Receipt → **Purchase Inbound**  
   - Manual Receipt → **Manual Inbound**  
   - `inboundNo` = Receipt No.；采购类附 `purchaseOrderNo`、`shippingNo`、Product Name / SKU 快照  
   - 变更后展示 Total/Locked/Available（↑ 规则见主 PRD §6）  
4. 入库单头 → **Stocked In**。

失败：**整单回滚**，禁止半截流水或脏库存。

### 9.3 成功后

- Toast 成功（文案产品定稿）。  
- 列表仅 **View**；可查看流水 **Record → Inbound**。  
- **Print** 可用（若已实现）。

---

## 10 与库存流水的关系

```
[商品库] ──只读──> WMS
[§5.0.1 零库存行] ──必须存在──> [入库明细]
[采购 xlsx / 手动加行] ──Confirm Stock-In──> total↑ + Inbound 流水（Related Order No. = Inbound No.）
[ADJ 调整单] ──≠──> 入库单（不可走 Receipt Type）
```

---

## 11 接口建议（开发参考）

| 接口 | 说明 |
|------|------|
| `GET /inbound/receipts` | 列表；强制 `warehouse_code`、分页、搜索筛选 |
| `POST /inbound/tasks/parse` | 上传 xlsx，返回匹配行 + Unmatched（可异步 Processing） |
| `POST /inbound/tasks/stock-in` | Confirm Stock-In 写账（§9.2），生成 Inbound No. |
| `GET /inbound/receipts` | 列表（仅 Stocked In / Processing） |
| `GET /warehouses/{code}/inventory/sku-options` | Add Products 选择器（已初始化行） |

**Stocked In 核心逻辑**：

```text
FOR each line:
  ASSERT inventory_row(sku_id, warehouse_code, zone_code) EXISTS
  UPDATE inventory SET total = total + receipt_qty WHERE ...
  INSERT inventory_record (type = Purchase Inbound | Manual Inbound, ...)
COMMIT or ROLLBACK all
```

---

## 12 非功能与其他

| 项 | 说明 |
|----|------|
| 并发导入 | 全系统最多 **2** 个 Processing 解析任务 |
| 权限 | Confirm Stock-In：Admin + 所属仓仓管；跨仓拒绝 |
| 审计 | 操作人写入流水 Operator |
| 原型 | Axure 包「入库」；字段以本文为准，冲突以 **§2、§8.2** 为准 |

---

## 13 修订记录（相对同事原稿）

| 原稿 | 本文 |
|------|------|
| Receipt Type含 Manual Adjustment | **Manual Receipt** |
| 行 Total / Physical / Variance 写账 | 仅 **Receipt Qty** 写账；Variance 只读对账 |
| Import/Add 可隐含建 SKU | **§2.2 仅匹配已有库存行** |
| PAN/Barcode 入库必填编辑 | **只读**；主数据在商品库 |
| 两种导入类型「采购导入和人工调整」 | **Purchase Receipt / Manual Receipt**；「调整」= ADJ 单 |
| 未写仓库初始化 | **§2.1 原有库导入 + 零库存行** |
| ItemDesc xlsx / 头 Remarks | **`采购.xlsx` + Product Name**；行 Remark |
| 列表无 PO/Shipping | 列表含 **Purchase Order、Shipping No.** |
| Record 详情双子区块 | **单页** 含 PO Preview、Shipping No. |

---

## 14 Dashboard 入库指标建议（衔接主 PRD §7.1）

主 PRD 顶部 **5 张 KPI** 中，与入库直接相关为 **「待入库 Pending Inbound」**（与出库三项 KPI 同排展示）：

| 建议 | 说明 |
|------|------|
| **统计口径** | 当前 `warehouse_context` 下，**Inbound No.** 个数：`status ≠ Stocked In`（含 **Processing** 等未完成上架状态）。 |
| **点击跳转** | → **Inbound 列表**；Admin 保留仓库上下文。 |
| **次级指标（二期）** | 不在首行 6 卡扩容时，可在 Inbound 列表顶栏或 Dashboard 第二行增加：**今日已入库 SKU 行数**、**今日采购入库运单数**、**Unmatched 待处理行数**（解析 Warn 未重试）。 |
| **与 PO 关系** | Dashboard **不按 PO 聚合**；PO 多运单体现在多个 Pending Inbound；卡片只显示 **待办条数**，详情进列表看 PO/Shipping。 |
| **告警（可选）** | 当某仓 *Processing* 解析失败或 *Unmatched* 超阈值，Pending Inbound 卡片角标或 Tooltip 提示「需拆单/上架」。 |

---

## 15 主 PRD 索引

| 主题 | 位置 |
|------|------|
| 库存行初始化、匹配拍板 | `KickBazar-WMS-PRD.md` §5.0.1–§5.0.2 |
| 仓库/库区编码 | §3.2.1、§4.1 |
| 仓库上下文 | §2.1 |
| 入库流水 | §6.1 |
| 写账总表 | §8.2 |

---

*本文档为入库模块唯一正文；主 PRD §6.1、§7.1 须与本文 §7.4、§7.5、§14 保持一致。*

---

## 附录 A 原型变更摘要（2026-10-21）

供评审/飞书粘贴用，与实现对齐：

1. **列表**：Time、Inbound No.、Purchase Order、Shipping No.、Inbound Type、SKU Qty、Operator、View。  
2. **新建**：下拉 Purchase / Manual Inbound；采购上传 **`采购.xlsx`**；**单文件单运单号**。  
3. **绑定**：1 Inbound No. = 1 PO；1 PO → N Shipping No.（跨多个 Inbound）。  
4. **行编辑**：SKU ID + SKU 列；Zone 只读；Order Qty 可编辑；无头 Remarks。  
5. **Inbound Detail**：头 8 字段 + 行表 After Change（T/L/A 箭头）。  
6. **Record Detail（Inbound）**：单页含 PO Preview、Shipping No.、Product Name、SKU。  
7. **源文件**：Preview + Download 留存。
