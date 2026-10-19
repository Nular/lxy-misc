# KickBazar WMS 产品需求说明（仓库与库存）

> **文档说明**  
> 本文档为 WMS **仓库与库存**模块 PRD 正文（第 1–8 章），与飞书主 PRD 同源。  
> **2026-10 修订**：仓库上下文仅在 **Dashboard** 切换、侧栏只读展示；**Purchase Order** 侧栏一级导航；库区 **去掉 Zone Name**；Record Tab 与全局筛选联动见第 6、7 章。  
> 原型（库存）：https://itkaop.axshare.com/?id=5yfdzj&p=spu_sku_inventory&sc=3&g=1  
> 原型（流水）：https://itkaop.axshare.com/?id=jo37v4&p=inventory_record&sc=3&g=1  
> Home：https://itkaop.axshare.com/?g=1&id=foz25t&p=dashboard  
> 离线单页：`export/KickBazar-WMS.html`

---

## 1 模块目标

### 1.1 产品目标

建立仓内库存基础模型，实现：

1. 能创建、维护仓库；每个仓具备收货区、存储区、待发货区。
2. SKU 库存查询：支持运营、仓管查看 SKU 的实物 / 已锁定 / 未锁定、所在仓库、所属位置（本期粒度为库区）、当前库存状态。
3. 能按入库、出库占用、出库扣减查看流水，追溯到单号与库区。

### 1.2 核心库存规则

**系统统一库存口径：实物库存 = 已锁定库存 + 未锁定库存**

| 中文 | 英文 | 字段 | 是否落库 | 说明 |
|------|------|------|----------|------|
| 实物库存 | Total | total | 是 | 仓库已有库存 |
| 已锁定库存 | Locked | locked | 是 | 已下单未发货预占 |
| 未锁定库存 | Available | available | **否** | 实时计算 `total - locked` |

- Available 不落库；并发更新时对 SQL UPDATE 校验 `(total - locked) >= 需求量`（出库占用、扣减等见 §8.2）。
- **空间模型（本期）**：库存粒度 = **仓库 × 库区（Zone）**；库位 Bin Location 五段模型预留，货架/层/列本期仅建档或不做。

**库区分区（Zone）**：收货区 RCV、存储区 STO、待发货区 SHP 为建仓默认三区；另可建档 DMG/PKG/RTN/HLD/SPC 等（细则见 §4）。**对用户展示仅「库区类型 Zone + Zone Code」**，不设独立「库区名称 / Zone Name」字段（见 §4）。

**SKU 条码**：WMS 只读同步 Seller/Admin 商品库；主条码展示规则 EAN → UPC → PAN-13（见飞书 1.2 条码表）。

### 1.3 系统模块与侧栏导航

**侧栏顺序（本期）：**

| 顺序 | 一级目录 | 说明 |
|------|----------|------|
| — | **Current warehouse**（侧栏顶部） | **只读展示**当前仓库上下文名称；Admin 提示「Switch on Dashboard」 |
| 1 | Home | Dashboard |
| 2 | Inventory | SPU/SKU inventory、Record |
| 3 | **Purchase Order** | 采购单列表入口（位于 Inbound **之上**） |
| 4 | Inbound | 入库单 |
| 5 | Outbound | 出库单 |
| 6 | **Warehouses** | **仅 Admin**：Warehouse Management、Zone Management |

Purchase Order 与 Dashboard Quick Link「采购单」跳转目标一致，不在 WMS 重复维护 PO 主数据。

---

## 2 角色与权限

| 角色 | 主路径 | 仓库上下文 | 导航与写操作 |
|------|--------|------------|--------------|
| **管理员（Admin）** | 建仓、管库区；库存与流水核对；仓库停用→启用 | 在 **Home（Dashboard）** 选择 **All** 或指定 **Warehouse**；切换后全系统列表/指标按新范围刷新 | 可见 **Warehouses**；库存调整见 §5.3 |
| **仓库管理员（Warehouse Manager）** | 库存查看、流水、入出库作业 | **仅所属 Warehouse**，不可 All；侧栏只读展示所属仓 | **不展示 Warehouses**；不可建仓/删仓/管库区主数据；库存调整**仅限所属仓**（§5.3） |

### 2.1 仓库上下文（全局数据范围）

1. **切换入口唯一**：仅 **Dashboard 页头**提供「Warehouse context」选择器（Admin：All + 仓库列表；仓管无切换器）。
2. **侧栏**：全角色展示 **Current warehouse**（All 时文案如「All warehouses」）；**不提供下拉切换**。Admin 附加提示：**Switch on Dashboard**。
3. **性能**：切换仓库触发多聚合查询（库存、流水、Dashboard 指标），故**禁止**在 Inventory、Record、Zone 等业务列表页提供切换器。
4. **筛选 UI 联动**：当上下文为**指定仓库**时，Inventory、Record、Zone Management 等页 **隐藏 Warehouse 筛选**；接口仍强制注入 `warehouse_code`（及用户 id），忽略前端越权参数。
5. **切换限制（建议）**：存在未关闭弹窗时禁止切换；可选频控（如每分钟 3 次）；失败保持原上下文并 Toast。

**商品与条码**：商品只读 C 端 Seller 库；SKU 条码仅缓存与展示，不在 WMS 建品、不在 WMS 维护条码主数据。

---

## 3 仓库管理

入口：`Warehouses → Warehouse Management`。**仅 Admin** 可访问（仓管无侧栏入口；URL 直链不可操作，提示 Admin only）。

### 3.1 仓库列表

筛选/搜索：Warehouse Code、Warehouse、属性、状态；**点击「搜索」后刷新**（非实时）。列表列含 Warehouse Code、Warehouse、Attribute、Status、Zone count（双击进库区管理）、Total、Locked、Available、Address、Owner、Contact/Phone、Operation（Edit/Delete/View/Stock）。

- **Stock**：新标签打开 SPU/SKU Inventory，URL 带 `warehouse_code`；若用户已在 Dashboard 选定单仓，则与全局上下文一致（Warehouse 筛选隐藏时由上下文注入）。
- 删除、空态、分页等规则同飞书原稿 §3.1。

### 3.2 创建仓库

创建成功后 status=Disable，自动生成 RCV/STO/SHP 三区；仅存储区可启用，其他区启用 Toast：`Not available in this version.`  
创建表单**不展示、不可填 Warehouse Code**；提交成功后由系统按 **§3.2.1** 生成。其余字段与校验同飞书原稿 §3.2。

#### 3.2.1 Warehouse Code 生成规则（`warehouse_code`）

> **历史说明**：飞书 §3.2 原稿仅写「区域/城市代码 + 流水号、例 SH001」；本节为可落地的**唯一规范**，与 §4 库区编码、库存主键、URL 参数一致。

| 项 | 规则 |
|----|------|
| 字段 | `warehouse_code`（列表列名 Warehouse Code） |
| 生成时机 | 创建仓库**事务内**、入库前生成；失败则整单回滚 |
| 唯一性 | **全系统唯一**；生成后**永久不可修改** |
| 字符集 | 大写字母 A–Z + 数字 0–9，**无连字符、无空格** |
| 格式（MVP） | **`{REGION}{SEQ}`，固定 5 位** |
| `REGION` | 2 位区域简码，由创建时地址「国家 + 省/州」映射（配置表维护，见下） |
| `SEQ` | 3 位数字 `001`–`999`，在**同一 `REGION` 下**单调递增分配 |

**REGION 映射示例**（配置表可扩展，创建时地址不完整则禁止提交或 Toast：`Please enter a valid address.`）：

| 国家/地区 | 省/州（示例） | REGION |
|-----------|---------------|--------|
| CN | 上海 (SH) | `SH` |
| CN | 北京 (BJ) | `BJ` |
| CN | 广东 (GD) | `GZ` |
| SG | — | `SG` |
| 其他 | 按配置 | 2 位码；未配置可用 `ZZ` 并由运营补全配置 |

**编号示例**：

- 上海市第 1 个仓库 → `SH001`；同 REGION 第 2 个 → `SH002`。
- 新加坡第 1 个仓库 → `SG001`。

**与库区编码**：默认三区 Zone Code = `warehouse_code` + `zone_type_code`（3 位类型码），见 §4.0。例：仓 `SH001` 的存储区 → `SH001STO`。

**接口与前端**：

- 查询、库存主键、Dashboard 上下文、`Stock` 跳转参数名均为 **`warehouse_code`**，值为 canonical 形式（如 `SH001`）。
- UI 若展示为 `SH-001` 仅作**可读性格式化**，不得作为第二套主键；写入接口前须归一为 5 位无连字符形式。

**并发**：同一 `REGION` 的序号分配须在 DB 层通过事务 + 唯一索引（`warehouse_code`）或 REGION 计数器行锁，避免重复编号。

### 3.3 编辑仓库

不可改 Warehouse Code；Disable→Enable 仅 Admin；Zone Count 旁「Manage Zones」跳转库区管理（带仓筛选）。同飞书 §3.3。

### 3.4 删除仓库

有库存或未完成 PO/入出库单时拒绝删除。同飞书 §3.4。

### 3.5 查看仓库库存

同 §3.1 Stock 跳转规则。

---

## 4 仓库库区管理

入口：`Warehouses → Zone Management`。**仅 Admin**。从仓库列表 Zone count 双击或「Manage Zones」进入时，锁定该仓 Warehouse Code 筛选（可清除后看全部，若全局上下文为单仓则与 §2.1 联动）。

### 4.0 字段说明（列表）

| 中文 | 英文 | 字段 | 说明 |
|------|------|------|------|
| 仓库 Code | Warehouse Code | warehouse_code | 唯一 |
| 库区编码 | Zone Code | zone_code | 仓内唯一；**`zone_code` = `warehouse_code` + `zone_type_code`**（均无连字符），如 `SH001` + `STO` → `SH001STO` |
| 库区 | Zone | zone | **八类类型之一**（展示层**无 Zone Name**） |
| 状态 | Status | status | Enable / Disable |
| 实物/锁定/未锁定 | Total / Locked / Available | 聚合 | 同仓库列表口径 |
| 操作 | Operation | Edit / Delete / View | |

**不展示、不维护**：库区名称 / Zone Name。

### 4.1 创建库区

字段：Warehouse Code（下拉）、**Zone 类型**（该仓未占用类型）、Zone Code（系统生成，表单只读）、Status。

**Zone Code 生成**：`zone_code = warehouse_code + zone_type_code`。`zone_type_code` 为 3 位大写字母，与库区类型固定对应：

| 库区类型 | zone_type_code |
|----------|----------------|
| Receiving Zone | RCV |
| Storage Zone | STO |
| Shipping Zone | SHP |
| Damaged Goods Zone | DMG |
| Packing Zone | PKG |
| Returns Zone | RTN |
| Quarantine Zone | HLD |
| Special Zone | SPC |

建仓自动生成的三区编码示例（仓 `SH001`）：`SH001RCV`、`SH001STO`、`SH001SHP`。后五类库区规则同飞书 §4.1（不得重复类型、每仓最多 8 类）。

### 4.2 编辑库区

可改：Status。不可改：Warehouse Code、Zone Code、**Zone 类型**。

### 4.3 删除库区

有库存或未完成单据时拒绝。同飞书 §4.3。

---

## 5 库存查看

本模块支持 SKU/SPU 两种视图。

入口：「Inventory」→「SPU/SKU inventory」。Tab：`SPU` | `SKU`。默认按入库时间倒序；前端最多展示 5000 条。

**全局筛选**：当仓库上下文 **≠ All** 时，**隐藏 Warehouse 筛选**（§2.1）；查询范围由 `warehouse_code` 注入。

### 5.0 库存行与 SKU 主数据

- 主键：**SKU ID + Warehouse Code + Zone Code**。
- 初始化：Total=0、Locked=0；Available 实时计算。
- 写账：入库、出库占用/扣减、库存调整单（§5.3）更新 total、locked。

### 5.1 SPU 视图

筛选：Warehouse（上下文为 All 时显示）、Zone、Product ID、Product Name、In Stock Only。

表格列：Product ID、Product Name、SKU Count、Total、Locked、Available、Warehouse、**Zone（类型）**（多位置时可为「-」）。  
展开子表：SKU ID、Specification、Total、Locked、Available、Warehouse、Zone。

### 5.2 SKU 视图

筛选：同 5.1 + SKU ID。

表格列：SKU ID、Specification、Product Name、Total、Locked、Available、Warehouse、**Zone**、Zone Code、Primary Barcode、PAN、Operation（库存调整 §5.3）。

从仓库 **Stock** 跳转：URL 带 `warehouse_code`；参数丢失则展示全部并提示手动选择（若已实现全局单仓上下文，则以上下文为准）。

### 5.3 库存调整（库存调整单）

**入口**：SKU 视图 → Operation → Inventory Adjustment。

| 中文 | 英文 | 必填 | 说明 |
|------|------|------|------|
| SKU / 仓库库区 / 调前数量 | — | 默认 | 只读 |
| 调整方向 | Direction | 是 | Increase / Decrease |
| 调整数量 | Adjustment Qty | 是 | 减少时 `Available ≥  qty` |
| 调整类型 | Adjustment Type | 是 | 盘盈、盘亏、报溢、报损、录入纠错 |
| 原因说明 | Reason | 是 | ≤200 字 |
| 附件 | Attachment | 否 | 选填 |

**写账**：

| 方向 | Total | Locked | Available |
|------|-------|--------|-----------|
| 增加 | ↑ | 不变 | ↑ |
| 减少 | ↓ | 不变 | ↓ |

- 单号：**ADJ-YYYYMMDDnnn**；与流水同一事务。
- 成功 Toast：`Inventory adjusted successfully.`（提示 Record → **Manual Adjustment**）。
- **权限**：**Admin**；**仓库管理员仅限所属仓库**（非所属仓接口拒绝）。停用仓/库区不可作为调整目标。

---

## 6 库存流水

**只读**；禁止在流水页改库存。盘盈盘亏等须经 **§5.3 调整单** 写账。移库、打包/发运不写流水。

入口：**Record**。

**Tab 顺序**：**All** | **Inbound** | **Outbound** | **Manual Adjustment**。（本期不做 Unfreeze Tab）

**共用筛选**：时间（默认近 7 天）、Warehouse、Zone、SKU ID、关联单号、操作人。  
当仓库上下文 **≠ All** 时：**隐藏 Warehouse 筛选**。

**共用列**：时间、仓库、库区（编码+类型）、SKU ID、数量、变更后 Total/Locked/Available（含↑↓规则）、类型、关联单号、操作人。  
支持 **行点击 / View** 打开**流水详情**（入库/出库/调整扩展字段分块）；关联单号一期文本展示，不强制跳转。

### 6.1 入库流水（Tab：Inbound）

**类型**：手动入库（Manual Inbound）、采购入库（Purchase Inbound）。期初场景统一走入库单上架，**不单独 Opening 类型/子筛**（若业务后续启用再开子筛）。

**子筛**：All / **Manual** / **Purchase**

- **不含**库存调整单流水（调整单仅 §6.4）。
- 采购入库详情可含 Purchase Order No.（次要信息）。

### 6.2 出库流水（Tab：Outbound）

**子筛**：All / **Outbound Deduct** / **Outbound Occupy**

| 类型 | 说明 |
|------|------|
| Outbound Occupy | available↓、locked↑、total 不变 |
| Outbound Deduct | locked↓、total↓ |

出库详情含 Outbound No.、Related Order No.、**Shipment No.**、Status 等。

### 6.4 手动调整流水（Tab：Manual Adjustment）

仅 **§5.3 调整单** 产生流水：

| 类型 | Qty |
|------|-----|
| Manual Adjustment | 正数 + |
| Manual Adjustment (Decrease) | 负数 - |

关联单号：ADJ-*；locked 不变。

---

## 7 Home（Dashboard）

侧栏：Home。**管理员、仓库管理员**均可访问。

**页面定位**：只读总览；不在此页写账。口径：**实物 = 锁定 + 未锁定**。

### 7.0 仓库上下文选择器（全局联动）

| 角色 | 位置 | 可选值 | 切换后 |
|------|------|--------|--------|
| Admin | **Dashboard 页头** Warehouse context | All、各仓库 | 刷新本页指标；更新**全局上下文**（侧栏名称、各模块默认范围） |
| 仓管 | 无 | 固定所属仓 | 侧栏只读展示所属仓 |

- 侧栏 **Current warehouse** 仅展示，不可切换。
- 切换触发多聚合查询，故**仅允许在 Dashboard 切换**（§2.1）。
- 卡片与列表数据均受当前上下文约束；选 All 为全系统汇总，选单仓为该仓汇总。

### 7.1 关键指标卡片

六项只读：**Total Inventory**、**Pending Inbound**、**Pending Allocation**、**Pending Picking**、**Pending Packing**、**Shipped Today**。

- Total Inventory = 当前视图 Σ total。
- Pending / Shipped 指标来自入出库模块聚合；首页不改状态。
- 点击卡片跳转对应模块并带入**当前仓库**筛选（与 §2.1 一致）。
- Total Inventory → Inventory → SPU/SKU，**默认 SKU Tab**。
- 非实时推送；进入页、**切换仓库**、返回 Home 时刷新。失败 Toast：`Failed to load dashboard metrics.`

### 7.2 快捷入口（Quick Links）

**通用（全角色）**：Purchase Orders、Inbound、Outbound（与侧栏 **Purchase Order** 目标一致）。

**Warehouse Setup (Admin Only)**（仅 Admin）：Warehouse Management、Zone Management。若 Dashboard 已选指定仓，进入 Zone Management 时**锁定 warehouse_code**。

仓管不展示 Warehouse Setup 区块。

### 7.3 今日作业（Today's Operations）

来源于库存流水；默认当日、最近 20 条。View All → Record → **All**，时间=今日，仓库=当前上下文。

类型与 Record 同口径（含 Purchase Inbound、Manual Adjustment ±、Outbound Occupy/Deduct）。打包/发运不出现。

### 7.4 仓库库存概况（Warehouse Inventory Breakdown）

- 选 **指定仓库**时展示库区分布表（Zone、Total、Locked、Available）及 Locked/Available 比例条。
- 选 **All** 时提示：`Select a warehouse to view breakdown.`
- 点击汇总或库区行 → Inventory，带入当前仓（及库区）。

### 7.5 数据一致性与权限

- 所有查询接口强制注入**登录用户 id**，忽略前端伪造用户 id。
- Total Inventory 与 Inventory 同范围 total 之和一致；Today's Operations 与 Record 同条件子集；Breakdown 与按库区聚合一致。

---

## 8 跨模块契约

### 8.1 库区写入（入出库遵守）

入库上架进**存储区**；出库推荐启用存储区且 available>0；停用仓/区不可作新作业目标。细则同飞书 §8.1。

### 8.2 写账与流水 Tab

| 事件 | 实物 | 锁定 | 未锁定 | 流水 Tab |
|------|------|------|--------|----------|
| 采购/手动入库确认上架 | ↑ | — | ↑ | Inbound |
| 采购单状态流转（未上架） | 不变 | 不变 | 不变 | 仅 PO |
| 出库确认导入 | — | ↑ | ↓ | Outbound Occupy |
| 出库扣减 | ↓ | ↓ | — | Outbound Deduct |
| 库存调整-增加 | ↑ | — | ↑ | Manual Adjustment |
| 库存调整-减少 | ↓ | — | ↓ | Manual Adjustment |
| 打包/发运 | 不变 | 不变 | 不变 | 不写 |

库存变更与流水同一事务，禁止账实不符。

### 8.3 本侧提供与 `warehouse_context`

- 仓库/库区主数据；出库推荐（仓 + SKU + 存储区 + enable + available>0）。
- 删仓前：无库存且无未完成 PO/入出库单。

**`warehouse_context`（Admin 可为 `all` 或 `warehouse_code`；仓管固定所属仓）：**

- 列表/聚合 API 在单仓上下文下**强制** `warehouse_code`；与前端隐藏 Warehouse 筛选一致。
- 上下文切换仅在 **Dashboard** 触发（专用接口或 Dashboard 聚合刷新）；Inventory/Record 列表接口**不得**附带切换副作用。
- **`Warehouses/*`**：Admin only；仓管可调库存/流水/所属仓调整单与入出库（按角色配置）。

---

## 附录：与原型差异（实现跟踪）

| 项 | PRD（本文） | 当前 HTML 原型（演示） |
|----|-------------|------------------------|
| 库存调整权限 | Admin + 仓管所属仓 | 演示开关为 Admin only |
| Dashboard 六项 Pending KPI | 全文要求 | 部分 KPI 简化，待迭代 |
| Warehouse / Zone Code | PRD：`SH001`、`SH001STO`（无连字符） | HTML 原型演示数据仍用 `SH-001`、`SH-001-STO`，实现须按 §3.2.1 / §4.1 归一 |
| Record Tab 顺序 | All 首位 | 一致 |
| Opening 子筛 | 不单独 Opening | 一致 |
