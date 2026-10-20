# KickBazar WMS — 入库模块产品需求说明（Inbound Receipt）

> **文档性质**：入库模块 **独立 PRD**，与《KickBazar WMS 产品需求说明（仓库与库存）》(`KickBazar-WMS-PRD.md`) 配套使用。  
> **范围**：入库单（Receipt）列表、创建、编辑、查看、删除、Excel 导入、上架写账及与采购单/库存流水联动。  
> **不包含**：采购单全生命周期（见主 PRD §9 或后续《采购单 PRD》）；仓库/库区主数据（主 PRD §3–§4）。  
> **版本**：2026-10（合并仓库基础拍板 + 原交互稿修订）

---

## 1 模块目标

### 1.1 业务目标

1. 支持仓内 **上架入库**：将实物数量记入指定 **仓库 × 库区** 库存行，并生成 **库存流水**（Record → Inbound）。
2. 支持 **采购入库**（关联采购单）与 **手工入库** 两类凭证。
3. 支持 **Excel 批量导入** 入库明细（匹配已有仓内 SKU，非建品）。
4. 入库过程可草稿、可异步导入进度；**完成后不可删**，仅可查看。

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
| Link Purchase Order | PO 行 SKU ID | 当前仓 **已有** `(sku_id, warehouse_code, zone_code)` 库存行 | 该行不可写入 Receipt；写账时整行失败 |
| Add Products | 用户选 SKU | 选择器 **仅展示** 当前仓已初始化库存行（含 Total=0） | 未下发 SKU **不出现在列表** |
| Import Excel | 模板 **SKU ID**（+ 可选 Zone Code，默认 STO） | 同上库存行存在 | **失败明细**，不自动建 SKU/库存行 |

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
| 1 | 查看入库单列表 |
| 2 | 创建入库单 |
| 3 | 编辑入库单 |
| 4 | 查看入库单 |
| 5 | 删除入库单（受状态限制） |
| 6 | 搜索：Receipt No. / Related Purchase Order No.（单选类别） |
| 7 | 筛选：Status、Receipt Type（多选） |
| 8 | 新建数据排在列表前面（`created_at` 降序） |
| 9 | 三种录入：Link PO / Add Products / Import（互斥） |
| 10 | 分页：默认 20；可选 20 / 50 / 100 / 500 |

---

## 4 单号与类型

### 4.1 Receipt No.（`receipt_no`）

- 格式：**`IN-{YYYYMMDD}{seq3}`**，全局唯一，系统生成，不可改。  
- 示例：`IN-20260821001`  
- `seq3`：按自然日递增，001–999，事务分配。  
- 与库存流水 **Inbound No. / Related Order No.** 一致。

### 4.2 Receipt Type（入库类型）

| Receipt Type | 说明 | 流水 Type | Record → Inbound 子筛 |
|--------------|------|-----------|------------------------|
| **Purchase Receipt** | 关联采购单 | Purchase Inbound | Purchase |
| **Manual Receipt** | 手工入库 | Manual Inbound | Manual |

- **禁止**使用 **Manual Adjustment** 作为入库类型（与库存调整单 ADJ 区分）。

### 4.3 关联采购单

- 字段：**Related Purchase Order No.**（`purchase_order_no` / `po_no`）。  
- **Purchase Receipt** 建议必填 PO；**Manual Receipt** 为空。  
- 关系：**多入库单可关联同一 PO**（一对多）；PO 不写库存，**Stocked In 后** 反写 PO 行/头状态（见 §12）。

---

## 5 列表页

### 5.1 列表列（建议）

Receipt No.、Receipt Type、Related PO、Status、Warehouse Code、行数/SKU 数、创建时间、操作（Edit / Delete / View / View 进度）。

### 5.2 搜索（Search）

#### 5.2.1 搜索类别（单选）

| 选项 | 含义 |
|------|------|
| **Receipt No.**（默认） | 凭证号 |
| **Related Purchase Order No.** | 关联采购订单号 |

#### 5.2.2 搜索推荐框

- **BR1**：高度 1–5 行；超过 5 行右侧滚动。  
- **焦点 / 输入时**展示推荐：  
  - 有搜索词：当前仓内，类别字段 **包含** 搜索词的候选列表。  
  - 无搜索词：当前仓内，该类别 **全部** 候选（Receipt No. 或 PO No.）。  
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
| **Receipt Type** | Purchase Receipt、Manual Receipt |

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

### 6.1 Create Receipt 页面

- 标题：**Create Receipt** / **Edit Receipt** / **View Receipt**。  
- **草稿保留**：保留 **最近一次编辑内容**（localStorage 或服务端 Draft，产品实现）。  
- 头字段（建议）：Receipt Type、Related PO（条件显示）、Supplier、Remarks、Warehouse（只读，= 上下文仓）、默认 Zone。  
- 保存成功且非 Processing 时显示 **Print**。  
- 存在商品行时显示 **Delete All** → 二次确认：*Are you sure you want to delete all SKU data?*

### 6.2 行数上限

- 单证最多 **10,000** 行 SKU。  
- 已达 10,000 再继续导入：Toast *You have already uploaded 10,000 records. Adding new data will clear all existing data.*（产品可改为禁止追加）。

### 6.3 删除入库单

- **Draft**：可删。  
- **Processing / Stocked In**：不可删。  
- 删除前二次确认（文案产品定稿）。

---

## 7 三种录入方式（互斥）

同一入库单 **仅一种** 录入方式生效：

| 方式 | Receipt Type 典型 | 互斥 |
|------|-------------------|------|
| **Link Purchase Order** | Purchase Receipt | 激活后 **Add Products、Import 置灰** |
| **Add Products** | Manual Receipt | 激活后 **Link PO、Import 置灰** |
| **Import** | 二者均可（由头字段 Receipt Type 决定） | 激活后 **Link PO、Add Products 置灰** |

### 7.1 Link Purchase Order（引用采购单）

1. 右侧/弹层 **选择采购单**（当前仓、状态允许入库的 PO，规则与采购模块一致）。  
2. 拉取 PO **待入库行**（SKU、Order Qty 等）。  
3. 列表增加只读 **Order Qty**；用户录入 **Receipt Qty**。  
4. **Variance** = Receipt Qty − Order Qty，**只读**，对账用，**不写库存**。  
5. 匹配到的 SKU 须满足 **§2.2**；商品名称/规格/条码 **只读带出**。  
6. **Stocked In 前**再次校验库存行；PO 创建后若 SKU 已从仓内移除下发 → **拒绝该行写账**。

### 7.2 Add Products（手工加行）

1. 打开 SKU 选择器：数据源 = **当前 `warehouse_code` 下已初始化库存行**（**Total=0 也可选**）。  
2. 勾选后填充 SKU ID、Product Name、Specification、Primary Barcode/PAN（**只读**）。  
3. 用户填写 **Receipt Qty**、**Zone**（默认 STO）。  
4. 保存后 **Import 置灰**；若再选 Import，则 **Add Products 置灰**（与旧稿一致）。

### 7.3 Import（Excel 导入）

1. **上传文件** → 校验表头 → 通过后可点 **Import**。  
2. 表头字段与列表列映射成功则填充；**SKU ID 必填**；匹配 **§2.2** 库存行。  
3. **Processing**：行数据 **实时出现在列表**；进度条；**最多 2 个**导入任务 **同时进行**（可与 PO 模块共享配额或分模块计数，产品定稿）。  
4. **Import 按钮（上传）**  
   - 置灰：未上传或上传失败  
   - 激活：上传成功且表头合法  
5. **表头不合法**：Toast *The imported file contains invalid fields. Please re-upload.*；文件异常样式；Import 置灰。  
6. **Cancel**  
   - 激活：导入 **未开始**  
   - 置灰：导入 **进行中**  
7. 导入进行中按钮文案：**Importing**（Loading）；结束后恢复或关闭。  
8. **未匹配 SKU**：不入行或入失败表；报告含行号、SKU ID、原因（如 *SKU not registered in this warehouse*）。  
9. **不得**通过 Import 创建 PAN/Barcode/SKU/库存行。

---

## 8 行字段与校验

### 8.1 行字段定义

| 字段名称 | 中文 | 必填 | 默认值 | 说明 |
|----------|------|------|--------|------|
| SKU ID | SKU 编号 | Y | — | 4–50 字符；**§2.2 库存行须存在** |
| Product Name | 商品名称 | — | — | 匹配后 **只读** |
| Specification | 规格 | — | — | 只读 |
| Order Qty | 订单/账面数量 | N | — | Link PO 时 **只读** |
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
| 采购单（引用方） | §9 |

---

*本文档为入库模块唯一正文；后续变更请优先修改本文，并同步主 PRD §10 摘要（可选）。*
