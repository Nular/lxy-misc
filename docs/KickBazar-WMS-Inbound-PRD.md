# KickBazar WMS — 入库模块产品需求说明（Inbound Receipt）

> **文档性质**：入库模块 **独立 PRD**，与《KickBazar WMS 产品需求说明（仓库与库存）》(`KickBazar-WMS-PRD.md`) 配套使用。  
> **范围**：入库单（Receipt）列表、创建、编辑、查看、删除、Excel 导入、上架写账及与采购单/库存流水联动。  
> **不包含**：采购单全生命周期（见 [`KickBazar-WMS-PO-PRD.md`](KickBazar-WMS-PO-PRD.md)）；仓库/库区主数据（主 PRD §3–§4）。  
> **版本**：2026-10（合并仓库基础拍板 + 原交互稿修订）

---

## 1 模块目标

### 1.1 业务目标

1. 支持仓内 **上架入库**：将实物数量记入指定 **仓库 × 库区** 库存行，并生成 **库存流水**（Record → Inbound）。
2. 将线下两类入库收敛为系统内两种 **入库任务**（每次操作生成一个 **Inbound No.**）：
   - **采购单导入**（Purchase Order Import / `Purchase Receipt`）：批量上传 **`采购单文档订单列表.xlsx`**，按 **ItemDesc** 匹配仓内商品后由仓管填写各行 warehouse、zone、数量；头 **Remarks** 记录与采购/实物不一致等异常。
   - **手动导入**（Manual Import / `Manual Receipt`）：按 **SKU ID** 或 **Product Name** 搜索匹配商品，填写 warehouse、zone、数量后提交。
3. 匹配失败行 **不入账**：提示无法匹配的商品（核对拼写或在 Seller 端上架），与线下「商品未上架先上架」一致。
4. 入库过程可草稿、可异步导入解析进度；**Stocked In 后不可删**，仅可查看详情。

### 1.4 业务流程对照（线下 → 系统）

| 线下分支 | 系统入口 | 关键步骤 |
|----------|----------|----------|
| 采购单入库：填单 → 保留待入库 → 收货核对 → 上架 | **采购单导入** | 上传订单列表 xlsx → ItemDesc 匹配 SKU → 填库区/数量 → 异常写 Remarks → Confirm Stock-In |
| 无采购单入库：收货 →（未上架则 Seller 上架）→ 入库 | **手动导入** | 搜 SKU → 填库区/数量 → Confirm Stock-In |
| 实物与采购单不一致 | 采购单导入 + **Remarks** | 允许按实收数量入库，须在备注说明原因（Variance 只读对账） |

### 1.2 不在本模块范围

| 事项 | 归属 |
|------|------|
| 创建 SKU、维护 PAN/条码 | **商品库 / Seller**（WMS 只读） |
| 生成仓内零库存行 | **库存初始化**（主 PRD §5.0.1，入库前完成） |
| 盘盈盘亏、报损 | **库存调整单 ADJ**（主 PRD §5.3 → Record Manual Adjustment） |
| 采购单创建/发货状态 | 采购单模块；入库仅 **引用 PO** 并 **反写 Stocked In** |

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
3. 未完成该仓库存行初始化的，**禁止 Stocked In 写账**（可进列表、可存 Draft）。

### 2.2 入库匹配规则

| 录入方式 | 匹配键 | 成功条件 | 失败 |
|----------|--------|----------|------|
| Purchase Order Import | **ItemDesc** → SKU | 匹配成功且目标 `(sku_id, warehouse_code, zone_code)` 存在 | Unmatched 提醒；无库存行则拒绝写账 |
| Manual Import | SKU ID / Product Name 搜索 | 选择器 **仅展示** 已初始化库存行（含 Total=0） | 未下发 SKU **不可选** |

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
| 1 | 入库单列表（按 **Inbound No.** 展示） |
| 2 | **新建入库任务**：选择 **采购单导入** 或 **手动导入**（二选一，创建后不可切换） |
| 3 | 采购单导入：上传 `采购单文档订单列表.xlsx`、ItemDesc 匹配、未匹配提醒 |
| 4 | 手动导入：SKU ID / Product Name 搜索加行 |
| 5 | 行级填写 **Warehouse、Zone、Receipt Qty**（写账目标） |
| 6 | 头 **Remarks**（采购入库异常说明） |
| 7 | 编辑 / 查看 / 删除（受状态限制） |
| 8 | **搜索**：Inbound No. / Related Purchase Order No. |
| 9 | **筛选**：Status、Inbound Type |
| 10 | 入库单 **详情 Modal**（行级：ItemDesc、SKU、数量、After Qty、Type、备注、操作人） |
| 11 | 分页：默认 20；可选 20 / 50 / 100 / 500 |

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
| **Purchase Order Import**（采购单导入） | Purchase Receipt | Purchase Inbound | Purchase |
| **Manual Import**（手动导入） | Manual Receipt | Manual Inbound | Manual |

- **禁止**使用 **Manual Adjustment** 作为入库类型（与库存调整单 ADJ 区分）。

### 4.3 关联采购单（可选）

- 字段：**Related Purchase Order No.**（`purchase_order_no`），来自 PO 模块关联或仓管手选；**采购单导入**也可仅依赖 xlsx 而不绑 PO。  
- **Manual Import** 为空。  
- 若关联 PO：**多入库单可对应同一 PO**；PO 不写库存，**Stocked In 后** 可反写 PO 行/头状态（见 §10）。

---

## 5 列表页

### 5.1 列表列（建议）

Inbound No.、Inbound Type、Status、Warehouse Code（头默认仓或首行仓）、Related PO（若有）、SKU 行数、Updated At、操作（**View 详情** / Edit / Delete / Import 进度）。

### 5.2 搜索（Search）

#### 5.2.1 搜索类别（单选）

| 选项 | 含义 |
|------|------|
| **Inbound No.**（默认） | 入库单号 |
| **Related Purchase Order No.** | 关联采购订单号 |

#### 5.2.2 搜索推荐框

- **BR1**：高度 1–5 行；超过 5 行右侧滚动。  
- **焦点 / 输入时**展示推荐：  
  - 有搜索词：当前仓内，类别字段 **包含** 搜索词的候选列表。  
  - 无搜索词：当前仓内，该类别 **全部** 候选（Inbound No. 或 PO No.）。  
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
| **Status** | Draft、Processing、Stocked In |
| **Inbound Type** | Purchase Order Import、Manual Import |

### 5.4 状态说明与操作

| Status | 含义 | Edit | Delete | View |
|--------|------|------|--------|------|
| **Draft** | 草稿 | ✓ | ✓ | ✓ |
| **Processing** | Excel 导入进行中，有进度 | 进入编辑页并开进度面板 | **置灰** | 列表 **View** 打开进度面板 |
| **Stocked In** | 已上架写账完成 | ✗ 仅查看 | ✗ | ✓；可 **下载原导入文件**（若存在） |

- **Processing** 期间 **不改** `total/locked`。  
- **Stocked In** 后 **不可删除**（与删仓校验「未完成入库单」一致）。

### 5.5 排序与分页

- 默认：**创建时间降序**（新建在前）。  
- 分页：默认 **20** 条/页；可选 **20 / 50 / 100 / 500**。  
- **列表记忆**（从编辑/弹层返回）：保留 **页码、每页条数、筛选条件、滚动位置**（见 §13）。

---

## 6 创建 / 编辑 / 查看 / 删除

### 6.1 新建入库任务

1. 列表 **+ New Inbound** → 选择 **Purchase Order Import** 或 **Manual Import**（不可再切换）。  
2. 系统生成 **Inbound No.**（Draft）并进入编辑页/弹层。  
3. 标题：**New Inbound** / **Edit Inbound** / **View Inbound**。  
4. 头字段：**Inbound Type**（只读）、Related PO（采购导入可选）、Supplier（可选）、**Remarks**（采购导入 **建议必填** 当存在未匹配或数量差异）、默认 Warehouse（= 上下文，行可改仓）。  
5. **Stocked In** 成功后仅 **View**；可 **Print**；行区 **Delete All** 二次确认。

### 6.2 行数上限

- 单证最多 **10,000** 行 SKU。  
- 已达 10,000 再继续导入：Toast *You have already uploaded 10,000 records. Adding new data will clear all existing data.*（产品可改为禁止追加）。

### 6.3 删除入库单

- **Draft**：可删。  
- **Processing / Stocked In**：不可删。  
- 删除前二次确认（文案产品定稿）。

---

## 7 两种录入方式（创建时选定，互斥）

| 录入方式 | Inbound Type | 典型场景 |
|----------|--------------|----------|
| **采购单导入** | Purchase Order Import | 上传采购/订单列表，按 ItemDesc 批量匹配 |
| **手动导入** | Manual Import | 零星到货、无采购文件 |

### 7.1 采购单导入（Purchase Order Import）

**文件**：`采购单文档订单列表.xlsx`（与运营导出模板一致）。

**必需表头**（至少）：`ItemDesc`、`ItemQuantity`（解析规则见 §7.3）。可选：`MerchantOrderId` 等，仅追溯不入账。

**流程**：

1. 上传 xlsx → 校验表头 → **Parse**（可进入 **Processing**，进度条；全系统最多 **2** 个并行解析任务）。  
2. 对每一行 **ItemDesc**，在商品库 + 当前仓已初始化 SKU 中 **模糊匹配** Product Name / 规格关键词（§7.3）。  
3. **匹配成功**：生成明细行，带出 SKU ID、Product Name、Specification、**Order Qty**（自 `ItemQuantity` 解析）、Primary Barcode；仓管填写 **Warehouse、Zone、Receipt Qty**（默认可=Order Qty）。  
4. **匹配失败**：列入 **Unmatched** 面板（ItemDesc、行号）；**不入明细**；提示核对拼写或在 Seller **上架商品**。  
5. 头 **Remarks**：记录实物与单据不一致、缺货、多货等（对应线下「判断情况入库写明原因」）。  
6. 可选关联 **Related Purchase Order No.**（PO 模块），用于 Stocked In 后反写 PO 状态。

**表头非法**：Toast *The imported file contains invalid fields. Please re-upload.*；Import 置灰。

### 7.2 手动导入（Manual Import）

1. **Search SKU**：输入 **SKU ID** 或 **Product Name**（包含匹配），数据源 = 当前上下文仓 **已初始化库存行**（Total=0 可选）。  
2. 选中后加行，只读带出商品信息；填写 **Warehouse、Zone、Receipt Qty**。  
3. 可追加多行；保存 Draft 或 **Confirm Stock-In**。

### 7.3 ItemDesc 解析与匹配（采购文件）

**ItemDesc 示例**（来自真实模板）：`1 * R31 headphones - Lightning`、`2 * KT88 Smart Watch Specification - Black / With light`。

| 步骤 | 规则 |
|------|------|
| 数量 | 行首 `N *` → **Order Qty** = N；无则默认 1 |
| 匹配键 | `*` 后文本去首尾空格，与商品库 **Product Name + Specification** 归一化后做包含/分词匹配 |
| 多命中 | 弹窗让仓管 **择一 SKU**；单命中自动绑定 |
| 零命中 | Unmatched 列表，不入账 |
| 库存行 | 绑定 SKU 后仍须存在 `(sku_id, warehouse_code, zone_code)` 行（§2.2），否则该行标红且 Stocked In 整单失败 |

### 7.4 入库单详情（Modal / View）

列表点击 **Inbound No.** 或 **View** 打开，展示头信息 + 行表：

| 列 | 说明 |
|----|------|
| ItemDesc | 采购导入源文本；手动导入显示 `—` |
| SKU ID | 匹配结果 |
| Product Name | 只读 |
| SKU / Specification | 规格 |
| Qty Added | 本次 Receipt Qty（`+N` 展示） |
| After Qty | Stocked In 后该行 **total**（草稿显示 `—`） |
| Type | Purchase Order Import / Manual Import |
| Remarks | 行备注（可选）；头 Remarks 单独展示 |
| Operator | 最后编辑人或 Stocked In 操作人 |

### 7.5 与 Inventory Record 联动

- Stocked In 每行写一条 **Inbound 流水**；列表 **Related Order No.** = **Inbound No.**（主 PRD §6.1）。  
- 流水 **View** 详情展示 **Inbound Remarks**（头）及行级 ItemDesc / Product Name（来自入库明细快照）。

---

## 8 行字段与校验

### 8.1 行字段定义

| 字段名称 | 中文 | 必填 | 默认值 | 说明 |
|----------|------|------|--------|------|
| SKU ID | SKU 编号 | Y | — | 4–50 字符；**§2.2 库存行须存在** |
| Product Name | 商品名称 | — | — | 匹配后 **只读** |
| Specification | 规格 | — | — | 只读 |
| ItemDesc | 导入描述 | N | — | 采购 xlsx 源字段；详情展示 |
| Order Qty | 订单/账面数量 | N | — | 采购导入自 ItemQuantity，**只读** |
| Warehouse | 仓库 | Y | 上下文仓 | 行级可改（仓管仅所属仓） |
| **Receipt Qty** | 实际上架数量 | Y | — | 整数 **1–9,999,999**；**唯一写账数量** |
| Variance | 差异 | — | — | 计算：`Receipt Qty − Order Qty`，只读 |
| Zone | 库区 | Y | 默认 STO | 须 Enable；`zone_code` |
| Primary Barcode | 条码值 | N | — | **只读展示**（EAN 优先，主 PRD §1.2） |
| PAN | 平台码 | N | — | **只读**；13 位结构在 **商品库** 维护，不在入库页编辑 |
| Supplier | 供应商 | N | — | 可放头或行；1–200 字符 |
| Remarks | 备注 | N | — | 0–500 字符 |

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
- 仅 **Draft** 或 Import 完成后的单据可进入写账（Processing 完成后转 Draft 或直接 Stocked In，产品二选一，**建议：Import 成功 → 可 Stocked In**）。

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
   - `inboundNo` = Receipt No.；采购类附 `purchaseOrderNo`  
   - 变更后展示 Total/Locked/Available（↑ 规则见主 PRD §6）  
4. **UPDATE** 关联 PO 行状态 → **Stocked In**（若适用）；PO 头 → **Partially Stocked In / Stocked In**。  
5. 入库单头 → **Stocked In**。

失败：**整单回滚**，禁止半截流水或脏库存。

### 9.3 成功后

- Toast 成功（文案产品定稿）。  
- 列表仅 **View**；可查看流水 **Record → Inbound**。  
- **Print** 可用（若已实现）。

---

## 10 与采购单、流水的关系

```
[商品库] ──只读──> WMS
[§5.0.1 零库存行] ──必须存在──> [入库单明细]
[PO] ──引用──> [Purchase Receipt] ──Stocked In──> total↑ + Inbound 流水 + PO 状态反写
[Manual Receipt] ──Stocked In──> total↑ + Manual Inbound 流水
[ADJ 调整单] ──≠──> 入库单（不可走 Receipt Type）
```

- PO **创建/导入/发货** 不改 `total`（主 PRD §8.2）。  
- 一个 PO 可对应 **多个** Receipt；PO 搜索 **Linked Receipt No.** 在采购模块。

---

## 11 接口建议（开发参考）

| 接口 | 说明 |
|------|------|
| `GET /inbound/receipts` | 列表；强制 `warehouse_code`、分页、搜索筛选 |
| `POST /inbound/receipts` | 创建 Draft |
| `PUT /inbound/receipts/{receipt_no}` | 编辑 Draft |
| `DELETE /inbound/receipts/{receipt_no}` | 仅 Draft |
| `POST /inbound/receipts/{id}/import` | 上传/启动 Processing |
| `POST /inbound/receipts/{id}/stock-in` | Stocked In 写账（§9.2） |
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
| 并发导入 | 全系统最多 **2** 个 Processing 任务（可与 PO 共享计数） |
| 权限 | 写账、Delete Draft：Admin + 所属仓仓管；跨仓拒绝 |
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

---

## 14 主 PRD 索引

| 主题 | 位置 |
|------|------|
| 库存行初始化、匹配拍板 | `KickBazar-WMS-PRD.md` §5.0.1–§5.0.2 |
| 仓库/库区编码 | §3.2.1、§4.1 |
| 仓库上下文 | §2.1 |
| 入库流水 | §6.1 |
| 写账总表 | §8.2 |
| 采购单（引用方） | `KickBazar-WMS-PO-PRD.md` |

---

*本文档为入库模块唯一正文；主 PRD 仅保留 §9 关联索引，不再重复入库正文。*
