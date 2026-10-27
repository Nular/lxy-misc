# KickBazar WMS — 出库模块产品需求说明（Outbound）

> **文档性质**：出库模块 **独立 PRD**，与《KickBazar WMS 产品需求说明（仓库与库存）》(`KickBazar-WMS-PRD.md`)、[`KickBazar-WMS-Inbound-PRD.md`](KickBazar-WMS-Inbound-PRD.md) 配套使用。  
> **范围**：订单行列表（OMS 作业台）、订单导入、**Manual outbound**、分配占用、打包发运、出库批次/详情、与 **Inventory Record → Outbound** 流水联动。  
> **不包含**：仓库/库区主数据（主 PRD §3–§4）、SKU 零库存初始化（§5.0.1）、入库（入库 PRD）、独立采购单（PO）模块。  
> **版本**：2026-10-27（订单导入：**SKU ID + PAN** 模板；PAN 优先解析；校验表列序见 §7.2）  
> **相对 2026-10 初版出库 PRD 的重要变更**：**特殊出库**不再「确认即扣减」；统一为 **Manual outbound** 走 **Pending Allocation → Occupy → Deduct**；列表增加 **Outbound Type**、**PAN**、**QTY** 等（见 §13、附录 A）。

---

## 1 模块目标

### 1.1 业务目标

1. 承接商家 **订单列表**（一期 **xlsx/csv Import**），在 **`warehouse_context` 单仓** 下生成出库作业行，替代「出入库 Excel + 库存 Excel」双表维护。
2. **普通出库（Imported Order）**：Import → **Pending Allocation**（不占库存）→ **Confirm Allocation** → **Pending Picking** + **Outbound Occupy** → **Pack & Ship**（录入 **Shipping No.**）→ **Shipped** + **Outbound Deduct**。
3. **手工出库（Manual outbound）**：样品、报损、内部领用等；**同样进入 Pending Allocation**，须填 **Reason**；经分配、打包后发运写账；流水类型为 **Manual outbound**（扣减阶段），详情含 Reason / Remarks。
4. 缺货行保持 **Pending Allocation**，**不占用**；补货（Inbound）后可再次 **Confirm Allocation**（与入库 PRD 补货衔接）。
5. 所有占用/扣减与 **库存流水** 同一事务；口径与主 PRD **§8.2** 一致。

### 1.2 不在本模块范围

| 事项 | 归属 |
|------|------|
| 创建 SKU、维护 PAN/条码 | 商品库 / Seller（WMS 只读） |
| 生成仓内零库存行 | 库存初始化（主 PRD §5.0.1） |
| 盘盈盘亏 | 库存调整单 ADJ（主 PRD §5.3） |
| 商家后台订单 API | 二期；一期 Import 文件 |

### 1.3 入口与权限

- **侧栏**：Outbound（与主 PRD §1.3 一致）。
- **Dashboard**：Quick Actions → Outbound。
- **数据范围**：受 **`warehouse_context`** 约束（主 PRD §2.1）；**Import / 写账须明确单仓**（上下文为 All 时，Import / Manual outbound 弹窗选仓）。
- **角色**：Admin、所属仓仓库管理员；建仓/管库区 **Admin only**。

### 1.4 业务流程对照（线下 → 系统）

| 线下分支 | 系统入口 | 关键步骤 |
|----------|----------|----------|
| 导出订单 → 人工筛单 → 看 Excel 库存 | **Import Orders** | 上传 **订单列表.xlsx** → 行级校验 → Import → Pending Allocation |
| 有货 → 打包 → 填快递单 → Excel 减库存 | **Confirm Allocation** → **Pack & Ship** | Occupy → 录入 Shipping No. → Deduct |
| 缺货等待补货 | 行保持 Pending Allocation | Inbound 上架后再次 Confirm Allocation |
| 特殊出库（样品/报损等） | **Manual outbound** | 填 Reason → Pending Allocation → 同普通行 **分配 → 打包发运** |

---

## 2 依赖：库存行与库区（拍板，必读）

与主 PRD **§5.0.2、§8.1、§8.2** 及入库 PRD **§2** 一致，出库模块 **强制遵守**。

### 2.1 匹配与库区

| 规则 | 说明 |
|------|------|
| 库存行 | Import / Manual 仅允许 `(sku_id, warehouse_code, zone_code)` **已存在** 的 **Storage Zone（STO）** 行 |
| 订单解析 | **优先 PAN** 反查 SKU；兼容 **ItemDesc** / **SKU ID** 列；须在目标仓 STO 有行 |
| Manual outbound | **Product Name** 模糊匹配 + **SKU（规格）** 下拉；仅 STO 有货 SKU |
| 禁止 | Import / Manual 流程中 **INSERT** 商品主数据或库存行 |

### 2.2 写账口径（摘要）

| 事件 | total | locked | available | Record Type |
|------|-------|--------|-----------|-------------|
| Confirm Allocation（导入单 / Manual） | — | ↑ | ↓ | **Outbound Occupy** |
| Pack & Ship 确认 | ↓ | ↓ | — | **Outbound Deduct** 或 **Manual outbound** |
| Import / 录入 Shipping No. 前 | — | — | — | **不写流水** |

**Manual outbound** 在发运扣减时：`locked` 先含占用量，扣减与 **Outbound Deduct** 相同（`locked↓`、`total↓`）；流水 **Type** 展示为 **Manual outbound** 以便与平台订单区分。

---

## 3 出库类型与列表「Outbound Type」

### 3.1 业务类型

| 类型 | 创建方式 | 订单号 | 库存路径 |
|------|----------|--------|----------|
| **Imported Order**（普通出库） | Import **订单列表.xlsx** | MerchantOrderID | Occupy → Deduct |
| **Manual outbound**（手工出库） | 工具栏 **Manual outbound** | 固定展示 `(Manual)` | Occupy → Deduct（流水 Type=Manual outbound） |

> **说明**：2026-10 初版 PRD 中的 **Special Outbound（SX 单、确认即扣减）** 已由原型收敛为 **Manual outbound + 标准作业流**；单号前缀使用 **`MO`**（见 §4.2）。

### 3.2 列表列「Outbound Type」（展示语义）

用于 OMS 行列表，**非**库存流水 Type 字段；按行状态与来源推导：

| 展示值 | 条件 |
|--------|------|
| **Manual outbound** | 行 `outbound_type = manual`（任意未发运状态均展示） |
| **Outbound occupy** | 普通行且状态 **Pending Picking**（已分配占用） |
| **Outbound deduct** | 普通行且状态 **Shipped**（已扣减） |
| **—**（空） | 普通行且 **Pending Allocation**（已导入、未占用） |

---

## 4 编码与单号

| 单据 | 规则 | 示例 |
|------|------|------|
| **Outbound No.**（Import 批次） | `OB` + `warehouse_code` + `yyyyMMdd` + 4 位流水；**一次 Import 一个号** | `OBSH001202610210001` |
| **Outbound No.**（Manual 批次） | `MO` + `warehouse_code` + `yyyyMMdd` + 4 位流水；**一次 Manual 确认一个号** | `MOSH001202610230001` |
| **Shipment No.** | `SHP` + `warehouse_code` + `yyyyMMdd` + 4 位流水；**每个 Shipping No. 一个**（多行同包裹可共用） | `SHPSH001202610210001` |
| **Shipping No.** | 承运商面单号；**Pack & Ship** 或运单回导录入 | `SF1029384756` |
| **Order No.** | 导入列 **MerchantOrderID**；Manual 为 `(Manual)` | `MO-DEMO-2026` |

`warehouse_code` 为 canonical 5 位（主 PRD §3.2.1）。

---

## 5 功能清单

| # | 功能 |
|---|------|
| 1 | **Outbound Orders** 行列表：状态 Tab、筛选、勾选、批量 **Confirm Allocation** |
| 2 | **Import / Export**：上传 **订单列表.xlsx**；**Use sample file** / **Download sample .xlsx**；导入前 **行级校验面板**（对齐入库 Import 体验） |
| 3 | **Manual outbound** 弹窗：SKU ID（只读）→ Product Name（模糊）→ SKU（规格）→ QTY、Reason、Remarks |
| 4 | 行内 / 批量 **Pack & Ship**：表格确认行 + **Shipping No.**（导入单必填，Manual 选填） |
| 5 | 列表列：Time（日期+时间两行）、**Warehouse**（Admin + All 时）、Outbound No.、SKU ID、Product Name、SKU、**QTY**、**PAN**、Order No.、**Store**（导入字段 `Shop`；Manual outbound 为 —）、**Outbound Type**、Operator、Status、Operation |
| 6 | 筛选：Order No.、SKU ID、**PAN（8 位）**、Time（`datetime-local`，展示时间 ≥ 筛选时间） |
| 7 | **Outbound Detail**（按批次）：行表、Export Shipping Order、Import Tracking（可选） |
| 8 | **On Hold**（缺货/待补货行）列表与 **Re-allocate** |
| 9 | 同步 **Record → Outbound** 子筛：All / Occupy / Deduct / **Manual**；流水详情字段 §9 |
| 10 | Tab **Pending Picking / Shipped** 隐藏 **Manual outbound**、**Import**（仅待分配阶段可创建） |

---

## 6 订单行列表（Outbound Orders）

### 6.1 状态 Tab

| Tab | 行状态 `line_status` | 说明 |
|-----|----------------------|------|
| Pending Allocation | `pending_allocation` | Import / Manual 创建后默认；**不占库存** |
| Pending Picking | `pending_picking` | 已 **Confirm Allocation**；已 Occupy |
| Shipped | `shipped` | 已 **Pack & Ship**；已 Deduct |
| All | 全部 | 汇总 |

### 6.2 工具栏（与 Tab 联动）

| 控件 | Pending Allocation | Pending Picking / Shipped |
|------|-------------------|---------------------------|
| Confirm Allocation | 显示 | 隐藏 |
| Manual outbound | 显示 | 隐藏 |
| Import / Export | 显示 | 隐藏 |
| Pack & Ship（行内） | 隐藏 | Pending Picking 显示 |

### 6.3 分配（Confirm Allocation）

- 勾选行批量确认；粒度：**订单行 × SKU**（Import 一行一条作业行）。
- 成功：`line_status → pending_picking`，写入 **zone_code**（目标 STO），写 **Outbound Occupy**。
- 失败：保持 **pending_allocation**，提示缺货或 SKU 无 STO 行；**不部分占用**（行级原子）。若本仓不足，后端按**同一 SKU ID** 检索其他仓库 **STO** 可用量并汇总；结果弹层在缺货文案旁展示 **`Other warehouses: {仓库名} {可用量}, …`**（一期仅提示，不自动调拨）。
- **Pending Allocation** 行支持 **Delete** 删除作业行（未占用、未发运）。
- 并发：`available ≥ qty`（主 PRD §5）。

### 6.4 打包发运（Pack & Ship）

1. 打开弹窗展示待打包行（SKU ID、Product Name、SKU、QTY）。
2. 录入 **Shipping No.**：
   - **Imported Order**：**必填**；
   - **Manual outbound**：**选填**。
3. 确认：写 **Shipment No.**（按 Shipping No. 聚合）、`line_status → shipped`，写 **Outbound Deduct** 或 **Manual outbound** 流水。

### 6.5 缺货与拆单（拍板）

| 场景 | 行为 |
|------|------|
| 同一 MerchantOrderID 多 SKU | 各行状态独立；有货行可先分配发运 |
| 单行 qty 不足 | 保持 Pending Allocation，不占用 |
| 补货后 | 对待分配行再次 Confirm Allocation |

---

## 7 订单导入（Import Orders）

### 7.1 文件格式（`订单列表.xlsx`）

| 表格列 | 系统字段 | 规则 |
|--------|----------|------|
| **SKU ID**（导出模板 **第 1 列**） | SKU ID | 可选；与 PAN 同时存在时须与 PAN 解析结果一致 |
| **PAN**（导出模板 **第 2 列**） | PAN | **推荐匹配键**；在目标仓 STO 反查 SKU ID、Product Name、SKU（规格） |
| **MerchantOrderID** | **Order No.** | 同一 ID 可多行（多 SKU） |
| **ItemQuantity** | **Qty** | 正整数 |
| **ItemDesc**（兼容旧模板） | Product Name + SKU ID | 无 PAN 列时仍支持 `qty*Product Name-SKU` 解析 |
| **Shop**（可选） | 作业行 **Store** | 店铺名；Manual outbound 为 **—** |

- 支持 **.xlsx / .xls / .csv**；xlsx 解析依赖内置 XLSX（与入库一致）。
- **仓库**：Import 弹窗选仓仅 **Admin + 上下文 All**；仓管固定所属仓。

### 7.2 导入前校验（与入库对齐）

1. 解析文件 → **Import validation** 面板列序：**Order No. → PAN → SKU ID → Product Name → SKU → Qty → Check**（Product Name / SKU / SKU ID 由 **PAN** 联动填充）。
2. 全部通过方可点击 **Import**；否则 **Import** 置灰。
3. 校验失败常见原因：**PAN 在仓内无 STO 行**、PAN 与 SKU ID 不一致、Qty 非法、缺少 Order No.。

### 7.3 样例文件（Demo）

| 能力 | 说明 |
|------|------|
| **Use sample file** | 按**当前 Import 所选仓库**从该仓 STO 库存自动生成 1～2 行（订单号 `MO-DEMO-2026`）；Admin+All 时默认选 **SH001** |
| **Download sample .xlsx** | 下载与上一致结构的 `订单列表-demo.xlsx`，可再上传验证 |
| 前置条件 | 须已加载 `KickBazar-WMS.bundle.js`；样例 SKU 须在对应仓有 STO 演示数据（如 SH001、BJ001） |

### 7.4 Import 进度与结果

- Import 执行：进度条；完成后生成 **Outbound No.（OB…）**、批次 `source_file`、行状态 **pending_allocation**。
- **不占用、不写流水**，直至 Confirm Allocation。

### 7.5 Admin 订单导出与导出发运表

| 场景 | 列顺序（建议） | 说明 |
|------|----------------|------|
| **Admin 订单导出模块**（商家后台 → WMS 导入模板） | **第 1 列 SKU ID**、**第 2 列 PAN**、MerchantOrderID、ItemQuantity、Shop（可选） | 与 Import 模板一致，便于运营「导出 → 填单 → 回传 WMS」 |
| **Export Shipping Order**（WMS 内待打包导出） | Outbound No.、Order No.、**PAN**、SKU ID、Product Name、SKU、Qty、Tracking 占位等 | 与列表 PAN 列对齐 |

- **Import Tracking No.**：按 Order No. + SKU ID 匹配 **Pending Picking** 行，写入 Shipping No. 并 **Shipped + Deduct**（与 Pack & Ship 等效写账）。

---

## 8 Manual outbound（手工出库）

### 8.1 入口

- **Outbound Orders** 工具栏 → **Manual outbound**（仅 **Pending Allocation** Tab 展示）。

### 8.2 表单字段

| 顺序 | 字段 | 必填 | 说明 |
|------|------|------|------|
| 1 | Warehouse | Admin+All 时必选 | 默认 `warehouse_context` |
| 2 | **SKU ID** | — | **只读**；由下方 SKU 选择联动回显 |
| 3 | **Product Name** | Y | 关键词模糊；datalist 匹配仓内 STO 商品名 |
| 4 | **SKU**（规格） | Y | 下拉；选定后回显 SKU ID |
| 5 | **QTY** | Y | 正整数 |
| 6 | **Reason** | Y | 枚举：Sample、Damage / write-off、Internal use、Other |
| 7 | **Remarks** | Other 时必填 | 文本 |

### 8.3 提交结果

- 生成 **Outbound No.（MO…）**、`order_no = (Manual)`、`outbound_type = manual`、`line_status = pending_allocation`。
- **不立即扣减**；后续与导入行相同：**Confirm Allocation → Pack & Ship**。

---

## 9 Inventory Record → Outbound

与主 PRD **§6.2** 一致，原型扩展如下。

### 9.1 子筛

| 子筛 | 流水 Type |
|------|-----------|
| All | Occupy + Deduct + Manual outbound |
| Occupy | Outbound Occupy |
| Deduct | Outbound Deduct |
| **Manual** | **Manual outbound** |

### 9.2 列表共用列

与主 PRD §6：**Time、Warehouse、Zone、SKU ID、Qty、After Change、Type、Related Order No.、Operator** 等。

- **Related Order No.**：出库类为 **Outbound No.**（OB… / MO…）；详情中另展示平台 **Order No.**。

### 9.3 流水详情（Record Detail，单页）

| 字段 | 说明 |
|------|------|
| Time, Warehouse, Zone, SKU ID, Product Name, SKU, Qty, After Change, Type, Outbound No., Operator | 通用块 |
| Related Order No. | 电商平台订单号（Manual 为 `(Manual)`） |
| Shipping No. | 发运后填写 |
| **Reason, Remarks** | 仅 **Manual outbound** |

**After Change 箭头规则**（与入库/Manual Adjustment 对称）：Occupy 为 Available↓、Locked↑；Deduct / Manual outbound 为 Total↓、Locked↓。

---

## 10 Outbound Detail / On Hold

### 10.1 批次详情

- 从列表 **Outbound No.** 进入；展示同批次行、批次状态（Pending Outbound / Partially Outbound / Fully Outbound）。
- 操作：Export Shipping Order、Import Tracking、按状态筛选行。

### 10.2 On Hold

- 缺货或无法分配行可进入 On Hold 视图（`hold_reason` 展示）。
- **Re-allocate**：补货后再次走分配（等价列表 **Confirm Allocation**）。

---

## 11 写账与事务

| 事件 | total | locked | available | Record |
|------|-------|--------|-----------|--------|
| Import / Manual 创建 | — | — | — | 无 |
| Confirm Allocation | — | ↑ | ↓ | Outbound Occupy |
| Pack & Ship | ↓ | ↓ | — | Outbound Deduct / Manual outbound |
| Export / 仅录入 Tracking 草稿 | — | — | — | 无 |
| 补货 Inbound | ↑ | — | ↑ | Inbound（入库 PRD） |

占用、扣减与流水 **同一事务**；失败整行回滚。

---

## 12 Dashboard KPI（衔接主 PRD §7.1）

Home 首行 **5** 张 KPI 中，下列 **3** 项来自出库（**Outbound No. 去重**，当前 `warehouse_context`）：

| KPI | 口径 |
|-----|------|
| Pending Allocation | 至少一行 `pending_allocation` 的 **Outbound No.** 数量 |
| Pending Picking | 至少一行 `pending_picking` 的 **Outbound No.** 数量 |
| Shipped Today | 当日至少一行 `shipped` 的 **Outbound No.** 数量 |

点击卡片跳转 **Outbound Orders** 对应状态 Tab。

---

## 13 修订记录（相对 2026-10 初版出库 PRD）

| 初版 | 本文（原型拍板） |
|------|----------------|
| 独立 **Special Outbound** 页，确认即 **Deduct** | **Manual outbound** 弹窗，走 **Pending Allocation → Occupy → Deduct** |
| 单号 **SX…** | Manual 批次 **MO…**；Import 仍为 **OB…** |
| 列表无 Outbound Type | 增加 **Outbound Type** 列（§3.2） |
| 关联 Inbound No. 列（出库列表） | 已移除；入库关联不在出库列表展示 |
| Import 无校验面板 | **Import validation** 表（对齐入库） |
| — | 列表 **PAN、QTY**；Time 两行展示；PAN 筛选 |
| Pack 与 Tracking 分离描述 | **Pack & Ship** 弹窗表格 + Shipping No.（导入必填 / Manual 选填） |
| Record 仅 Occupy/Deduct | 子筛增加 **Manual**；Type **Manual outbound** + Reason/Remarks |
| Import 仅 ItemDesc | **SKU ID + PAN 列**；**PAN 优先**解析；校验表含 PAN 列（§7.1–7.2） |
| Admin 导出无 PAN | 导出模板 **第 1–2 列 SKU ID、PAN**（§7.5） |

---

## 14 主 PRD 索引

| 主题 | 位置 |
|------|------|
| 库存行、匹配 | `KickBazar-WMS-PRD.md` §5.0.2 |
| 出库流水 Tab | §6.2（须含 Manual 子筛，与本文 §9.1 一致） |
| 写账总表 | §8.2 |
| 仓库上下文 | §2.1 |
| 入库补货 | `KickBazar-WMS-Inbound-PRD.md` |

---

## 附录 A 原型实现摘要（2026-10-27）

供评审 / 测试验收对照（**静态演示数据即可**，非生产接口）：

1. **主列表**：`page-outbound-orders`；状态 Tab 由 `OB_LIST_TABS` 渲染。  
2. **Import**：`parseOrderListMatrix`（PAN 列）→ `resolveOutboundSkuByPan` → `applyOutboundImportPreview` → `runImportOrders`；校验表列 **Order No. / PAN / SKU ID / …**。  
3. **Sample**：`outboundSampleMatrixForWarehouse` 表头 **`SKU ID,PAN,MerchantOrderID,ItemQuantity,Shop`**。  
4. **Manual**：`openManualOutboundModal` / `submitManualOutbound`；模态框 id `ob-special-modal`。  
5. **分配 / 打包**：`confirmAllocationBatch`、`openPackTrackingModal`、`submitPackAndShip`。  
6. **流水**：`recordData.occupy` / `deduct` + Manual 扣减写入 `type: Manual outbound`；`renderOutboundRecordDetailHtml`。  
7. **打包产物**：`python3 scripts/build-wms-html.py` → `export/KickBazar-WMS.html` + `KickBazar-WMS.bundle.js` 同目录打开。

---

*本文档为出库模块唯一正文；与入库 PRD、主 PRD §6.2、§8.2 冲突时，以主 PRD 库存口径为准，以本文作业流与字段为准。*
