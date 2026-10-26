# KickBazar WMS 产品需求说明（仓库与库存）

> **文档说明**  
> 本文档为 WMS **仓库与库存基础** PRD（**第 1–8 章** + **§9 关联索引**），与飞书主 PRD 同源。  
> **作业单据**（入库 / 出库）不在本文展开，见：[`KickBazar-WMS-Inbound-PRD.md`](KickBazar-WMS-Inbound-PRD.md)、[`KickBazar-WMS-Outbound-PRD.md`](KickBazar-WMS-Outbound-PRD.md)。**本期不含**独立采购单（PO）模块；采购到货通过入库 **Purchase Inbound**（上传 **`采购.xlsx`**，按 **Product Name** 匹配，绑定 **Purchase Order / Shipping No.**，规则见入库 PRD §5.1.1）完成。  
> **2026-10 修订**：Dashboard 仓库上下文；库区去掉 Zone Name；Record Tab 与全局筛选见第 6、7 章；SKU 导入与零库存初始化见 §5.0。  
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
- **仓库编码**：`warehouse_code` 系统生成规则见 **§3.2.1**（例 `SH001`）；库区编码见 **§4.0 / §4.1**（例 `SH001STO`）。

**库区分区（Zone）**：收货区 RCV、存储区 STO、待发货区 SHP 为建仓默认三区；另可建档 DMG/PKG/RTN/HLD/SPC 等（细则见 §4）。**对用户展示仅「库区类型 Zone + Zone Code」**，不设独立「库区名称 / Zone Name」字段（见 §4）。

**SKU 条码**：WMS 只读同步 Seller/Admin 商品库；主条码展示规则 EAN → UPC → PAN-13（见飞书 1.2 条码表）。

### 1.3 系统模块与侧栏导航

**侧栏顺序（本期）：**

| 顺序 | 一级目录 | 说明 |
|------|----------|------|
| — | **Warehouse**（侧栏顶部） | Admin：**下拉**切换 All/指定仓（仅 Home 页生效）；仓管：只读所属仓 |
| 1 | Home | Dashboard（§7） |
| 2 | Inventory | SPU/SKU inventory、Record |
| 3 | **Inbound** | 入库单（见 [`KickBazar-WMS-Inbound-PRD.md`](KickBazar-WMS-Inbound-PRD.md)） |
| 5 | Outbound | 出库单 |
| 6 | **Warehouses** | **仅 Admin**：Warehouse Management、Zone Management |

Dashboard **Quick Actions** 与侧栏 **Inbound** / **Outbound** 跳转对应列表页。

---

## 2 角色与权限

| 角色 | 主路径 | 仓库上下文 | 导航与写操作 |
|------|--------|------------|--------------|
| **管理员（Admin）** | 建仓、管库区；库存与流水核对；仓库停用→启用 | 在 **Home（Dashboard）** 选择 **All** 或指定 **Warehouse**；切换后全系统列表/指标按新范围刷新 | 可见 **Warehouses**；库存调整见 §5.3 |
| **仓库管理员（Warehouse Manager）** | 库存查看、流水、入出库作业 | **仅所属 Warehouse**，不可 All；侧栏只读展示所属仓 | **不展示 Warehouses**；不可建仓/删仓/管库区主数据；库存调整**仅限所属仓**（§5.3） |

### 2.1 仓库上下文（全局数据范围）

1. **切换入口**：Admin 在 **侧栏 Warehouse 下拉**选择 All / 指定仓；**仅当用户位于 Home（Dashboard）时**允许切换（非 Home 页操作则 Toast 并回退选择）。
2. **侧栏展示**：仓管无下拉，只读展示所属仓名称；Admin 旁可展示 **Admin** 角色标识。
3. **性能**：切换仓库触发多聚合查询，故**不在** Inventory、Record、Zone 等业务页提供切换器。
4. **筛选 UI 联动**：当上下文为**指定仓库**时，Inventory、Record、Zone、Inbound、Outbound 等页 **隐藏 Warehouse 筛选**；当 **Admin + All warehouses** 时，上述列表/搜索 **展示 Warehouse 筛选**（及表单内行级 Warehouse）。接口仍强制注入 `warehouse_code`（及用户 id），忽略前端越权参数。
5. **切换限制（建议）**：存在未关闭弹窗时禁止切换；可选频控（如每分钟 3 次）；失败保持原上下文并 Toast。

**商品与条码**：商品只读 C 端 Seller 库；SKU 条码仅缓存与展示，不在 WMS 建品、不在 WMS 维护条码主数据。

---

## 3 仓库管理

入口：`Warehouses → Warehouse Management`。**仅 Admin** 可访问（仓管无侧栏入口；URL 直链不可操作，提示 Admin only）。

### 3.1 仓库列表

筛选/搜索：Warehouse Code、Warehouse、属性、状态；**点击「搜索」后刷新**（非实时）。列表列含 Warehouse Code、Warehouse、Attribute、Status、Zone count（双击进库区管理）、Total、Locked、Available、Address、**Warehouse Manager**（多人以 `;` 分隔）、Contact/Phone、Operation（Edit/Delete/View/Stock）。创建/编辑仓：**Warehouse Manager** 自 **Admin 用户目录**多选下拉。

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
- 展示字段（SKU ID、Specification、Product Name、条码缓存等）来自 **原有商品库 / Seller 库**（WMS **只读**，见 §1.2、§2）。
- 写账：入库上架、出库占用/扣减、库存调整单（§5.3）更新 `total`、`locked`；**Available 不落库**（`total - locked`）。

#### 5.0.1 库存行初始化（自原有库导入，拍板）

WMS **不在入库页面创建 SKU 主数据**；仓内可作业前提如下：

1. **商品主数据**：自企业 **原有数据库（商品库）** 一次性或增量 **导入/同步** 至 WMS 可读层（与 Seller 库只读策略一致）。
2. **库存行生成**：对每个 **`warehouse_code` × 已启用 `zone_code`**，对 Admin **已下发到该仓** 的 SKU，生成库存行：
   - **Total = 0**、**Locked = 0**、**Available = 0**（实时计算）。
   - 未下发到该仓的 SKU **不存在** 对应库存行。
3. **导入时机**：建仓并启用库区后、**首次入库/出库/调整前** 必须完成该仓 SKU 库存行初始化（批量任务或接口）；失败可重试，**禁止**在未初始化仓上执行写账。

> 说明：「原有数据库导入」指 **商品 + 仓内库存行占位（零库存）** 的数据准备阶段，**不是**指 Excel 入库单导入。

#### 5.0.2 入库/出库/调整前置条件（拍板）

任意 **写库存** 操作（含 **入库上架**（Inbound PRD）、§5.3 调整、**出库占用/扣减**（Outbound PRD））前，系统 **必须** 校验：

| 校验项 | 规则 | 失败处理 |
|--------|------|----------|
| 库存行存在 | 存在记录 `(sku_id, warehouse_code, zone_code)` | 拒绝写账；提示 **SKU not registered in this warehouse/zone**（文案产品定稿） |
| 仓/区可用 | 仓库 Enable、目标库区 Enable；上架默认 **Storage Zone**（§8.1） | 拒绝 |
| 商品主数据 | SKU 在商品库存在且可读 | 拒绝 |

**入库匹配规则**：采购 **`采购.xlsx`（Product Name 列）** 与手动 **Product Name** 搜索均只能匹配 **当前 `warehouse_code` 下已存在库存行** 的 SKU；**不得**因入库而 **自动新建** 库存行或商品主数据。若需新 SKU 进仓，须先走 **§5.0.1 下发/初始化** 再入库。

#### 5.0.3 与入库模块衔接

- 入库单行上的 SKU，仅允许引用 **§5.0.1 已初始化** 的行；入库写账见 [`KickBazar-WMS-Inbound-PRD.md`](KickBazar-WMS-Inbound-PRD.md) §9。
- Record / Inventory 查询结果与上述库存行 **同一数据源**。

### 5.1 SPU 视图

筛选：Warehouse（上下文为 All 时显示）、Zone、Product ID、Product Name、In Stock Only。

表格列：Product ID、Product Name、SKU Count、Total、Locked、Available、Warehouse、**Zone（类型）**（多位置时可为「-」）。  
展开子表：SKU ID、Specification、Total、Locked、Available、Warehouse、Zone。

### 5.2 SKU 视图

筛选：同 5.1 + SKU ID。

表格列：SKU ID、Specification、Product Name、Total、Locked、Available、Warehouse、**Zone**、Zone Code、Primary Barcode、PAN、**Store**（店铺名称，多个以 `;` 分隔，只读同步自 Admin/Seller）、Operation（库存调整 §5.3）。

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

**共用列**：时间、仓库、库区（编码+类型）、SKU ID、数量、变更后 Total/Locked/Available（含↑↓规则）、类型、**关联单号（Related Order No.）**、操作人。  
支持 **行点击 / View** 打开**流水详情**（入库/出库/调整扩展字段分块）；关联单号一期文本展示，不强制跳转。

**关联单号列语义（按 Type）**：

| 流水 Type | Related Order No. 取值 |
|-----------|-------------------------|
| Purchase Inbound / Manual Inbound | **Inbound No.**（`IN-{YYYYMMDD}{seq3}`，与入库单 `receipt_no` 一致） |
| Outbound Occupy / Outbound Deduct | Outbound No.（详情中另展示电商平台订单号等） |
| Manual Adjustment (±) | Adjustment No.（`ADJ-*`） |

### 6.1 入库流水（Tab：Inbound）

**类型**：手动入库（Manual Inbound）、采购入库（Purchase Inbound）。期初场景统一走入库单上架，**不单独 Opening 类型/子筛**（若业务后续启用再开子筛）。

**子筛**：All / **Manual** / **Purchase**

- **不含**库存调整单流水（调整单仅 §6.4）。
- 列表 **Related Order No.**：**仅展示 Inbound No.**，不展示外部订单号或 PO 号。
- **流水详情（Record Detail，单页）**：Time、Warehouse、Zone、SKU ID、Product Name、**SKU**（规格）、Qty、**After Change**、Type、**Inbound No.**、Operator、**Inbound Remarks**（行备注聚合，无头 Remarks）、**Related Purchase Order**（含源文件 **Preview**）、**Shipping No.**（采购类）；匹配键为 **Product Name**（非 ItemDesc 模板）。详见入库 PRD §7.5。

### 6.2 出库流水（Tab：Outbound）

**子筛**：All / **Outbound Occupy** / **Outbound Deduct** / **Manual**（手工出库扣减流水）

| 类型 | 说明 |
|------|------|
| Outbound Occupy | available↓、locked↑、total 不变 |
| Outbound Deduct | locked↓、total↓（平台订单发运） |
| Manual outbound | locked↓、total↓（Manual outbound 发运；详情含 **Reason / Remarks**） |

**Outbound** 列表在 **Record → Outbound** Tab 增加 **Store** 列（导入订单取自 `Shop`；Manual outbound 为 **—**）。出库详情含 Time、Warehouse、Zone、SKU ID、Product Name、SKU、Qty、After Change、Type、**Outbound No.**、Operator、**Related Order No.**、**Store**、**Shipping No.** 等；细则见 [`KickBazar-WMS-Outbound-PRD.md`](KickBazar-WMS-Outbound-PRD.md) §9。

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
**页面结构（自上而下，与原型一致）**：

1. 页头：标题 Dashboard + 副标题 *Warehouse inventory overview and recent activity*
2. **关键指标卡片**（一行 **5** 张）
3. **Quick Actions**（一行任务卡，本期 **2** 张：Inbound、Outbound）
4. **Warehouse Setup (Admin Only)**（一行 2 张，仅 Admin）
5. **Today's Operations**（全宽表格 = 当前上下文下的**库存流水摘要**）

### 7.0 仓库上下文选择器（全局联动）

| 角色 | 位置 | 可选值 | 切换后 |
|------|------|--------|--------|
| Admin | **侧栏 Warehouse 下拉**（在 Home 页可操作） | All、各仓库 | 刷新 Dashboard **五项** KPI、今日作业表；更新**全局上下文**（各模块默认范围） |
| 仓管 | 侧栏只读文案 | 固定所属仓 | — |

- 非 Home 页禁止切换上下文（§2.1）。
- 选 **All** 时指标为全系统汇总；选**指定仓**时仅统计该 `warehouse_code`（展示用 canonical 码，如 `SH001`）。

### 7.1 关键指标卡片

**布局**：单行 **5** 张只读卡片，顺序固定；统计范围均为当前 **`warehouse_context`**（All = 全系统汇总；指定仓 = 该 `warehouse_code`）。

| # | 中文 | 英文 | 统计口径 |
|---|------|------|----------|
| 1 | 总库存 | Total Inventory | 当前范围内所有 SKU 库存行的 **Σ `total`（实物件数）** |
| 2 | 待入库 | Pending Inbound | 状态 **非 Stocked In** 的 **Inbound No.** 个数（如 **Processing**） |
| 3 | 待分配 | Pending Allocation | 存在 **≥1** 行 `line_status = pending_allocation` 的 **Outbound No.** 去重个数 |
| 4 | 待拣货 | Pending Picking | 存在 **≥1** 行 `line_status = pending_picking` 的 **Outbound No.** 去重个数 |
| 5 | 今日已发货 | Shipped Today | 当日（自然日）存在 **≥1** 行 `line_status = shipped` 的 **Outbound No.** 去重个数 |

- **不含**「待打包 Pending Packing」独立 KPI（打包与拣货同属 **Pending Picking** 作业阶段，见出库 PRD）。
- Dashboard **不改单据状态**；指标由入出库模块数据聚合。
- **点击跳转**（带入当前仓库上下文）：

| 卡片 | 跳转 |
|------|------|
| Total Inventory | Inventory → SPU/SKU Inventory（**默认 SKU Tab**） |
| Pending Inbound | Inbound 列表 |
| Pending Allocation | Outbound 列表 → **Pending Allocation** Tab |
| Pending Picking | Outbound 列表 → **Pending Picking** Tab |
| Shipped Today | Outbound 列表 → **Shipped** Tab（当日发运口径与列表一致） |

- 进入 Home、**切换仓库**、从其他页返回 Home 时刷新；无数据展示 `0`。失败 Toast：`Failed to load dashboard metrics.`

### 7.2 Quick Actions（主任务入口）

**区块标题**：Quick Actions。一行 **2** 张大卡片（图标 + 文案 + 右箭头）：

| 中文 | 英文 | 跳转 |
|------|------|------|
| 入库 | Inbound | 入库单列表 |
| 出库 | Outbound | 出库单列表 |

### 7.3 Warehouse Setup (Admin Only)

**仅 Admin 可见**；区块标题旁红色标签 **Admin Only**。一行 **2** 张紫色强调卡片：

| 中文 | 英文 | 跳转 |
|------|------|------|
| 仓库管理 | Warehouse Management | 仓库列表 |
| 库区管理 | Zone Management | 库区列表（若上下文为指定仓，**锁定** `warehouse_code` 筛选） |

仓管不展示本区块；URL 直链仓库管理页不可操作（Admin only）。

### 7.4 Today's Operations（今日作业 / 流水表）

**区块标题**：Today's Operations。内容为 **库存流水**在当前仓库上下文下的摘要（与 Record **同口径、同字段语义**，非独立数据源）。

**表格列**（与 Record 列表对齐，本期首页不展示「变更后库存」列以节省空间）：

| 列 | 说明 |
|----|------|
| Time | 当日流水，精确到秒（首页可仅展示时分秒） |
| Type | 类型着色：入库绿、出库扣减红、占用橙等 |
| Warehouse | `warehouse_code`（如 SH001） |
| Zone | `zone_code`（如 SH001STO） |
| SKU | SKU ID |
| Qty | 正数绿色 `+200`，负数红色 `-25` |
| Order No. | 关联单号（文本）；入库类 = **Inbound No.**（同 Record §6.1） |
| Operator | 用户名或 System |

- **默认**：当日 00:00:00 – 当前时间，最多 **20** 条，按时间倒序。
- **View All →**：Record → **All** Tab，时间=今日，仓库=当前上下文。
- **类型**：Purchase Inbound、Manual Inbound、Outbound Occupy、Outbound Deduct、Manual Adjustment（±）等；**不含**打包/发运类无流水事件。
- **空态**：`No operations today.` / 单仓无数据：`No operations for this warehouse today.`

### 7.5 仓库库存概况（可选扩展）

本期 **主 Dashboard 不含**库区分布表；若产品后续在 Home 增加「Warehouse Inventory Breakdown」模块，规则如下：仅当选定单仓时展示 Zone 维度 Total/Locked/Available 及占比条；选 All 时文案 `Select a warehouse to view breakdown.` 点击行跳转 Inventory 并带入仓+库区筛选。

### 7.6 数据一致性与权限

- 所有查询接口强制注入**登录用户 id**，忽略前端伪造用户 id。
- Total Inventory 与 Inventory 同范围 total 之和一致；Today's Operations 与 Record 同条件子集；Breakdown 与按库区聚合一致。

---

## 8 跨模块契约

### 8.1 库区写入（入出库遵守）

入库上架进**存储区**；出库推荐启用存储区且 available>0；停用仓/区不可作新作业目标。细则同飞书 §8.1。

**入库匹配前置（与 §5.0.2 一致）**：确认上架前须已存在 **`warehouse_code` + `zone_code` + SKU ID`** 库存行（可为 0 库存）；否则拒绝匹配与写账。SKU 须已完成 **§5.0.1** 自商品库导入并在该仓生成占位行。

### 8.2 写账与流水 Tab

| 事件 | 实物 | 锁定 | 未锁定 | 流水 Tab |
|------|------|------|--------|----------|
| 采购/手动入库确认上架 | ↑ | — | ↑ | Inbound |
| 采购单状态流转（未上架） | 不变 | 不变 | 不变 | 仅 PO |
| 出库确认分配（普通） | — | ↑ | ↓ | Outbound Occupy |
| 出库确认发货（录入运单） | ↓ | ↓ | — | Outbound Deduct |
| 特殊出库确认 | ↓ | — | ↓ | Outbound Deduct |
| 库存调整-增加 | ↑ | — | ↑ | Manual Adjustment |
| 库存调整-减少 | ↓ | — | ↓ | Manual Adjustment |
| 打包/发运 | 不变 | 不变 | 不变 | 不写 |

库存变更与流水同一事务，禁止账实不符。

### 8.3 本侧提供与 `warehouse_context`

- 仓库/库区主数据；出库推荐（仓 + SKU + 存储区 + enable + available>0）。
- 删仓前：无库存且无未完成入出库单。

**`warehouse_context`（Admin 可为 `all` 或 `warehouse_code`；仓管固定所属仓）：**

- 列表/聚合 API 在单仓上下文下**强制** `warehouse_code`；与前端隐藏 Warehouse 筛选一致。
- 上下文切换仅在 **Dashboard** 触发（专用接口或 Dashboard 聚合刷新）；Inventory/Record 列表接口**不得**附带切换副作用。
- **`Warehouses/*`**：Admin only；仓管可调库存/流水/所属仓调整单与入出库（按角色配置）。

---

## 9 关联模块 PRD（采购 / 入库 / 出库）

本文档仅描述 **仓库、库区、库存、流水、Dashboard** 等基础能力。以下作业模块有 **独立 PRD**，正文不在此重复：

| 模块 | 文档 | 与基础 PRD 的边界 |
|------|------|-------------------|
| **采购单** Purchase Order | [`KickBazar-WMS-PO-PRD.md`](KickBazar-WMS-PO-PRD.md) | 不写库存；SKU 行须满足 **§5.0.1–§5.0.2** |
| **入库** Inbound Receipt | [`KickBazar-WMS-Inbound-PRD.md`](KickBazar-WMS-Inbound-PRD.md) | Stocked In 写 **§6.1** 流水并 UPDATE 已有库存行；**禁止**入库流程建 SKU/库存行 |
| **出库** Outbound | [`KickBazar-WMS-Outbound-PRD.md`](KickBazar-WMS-Outbound-PRD.md) | **普通出库**：Occupy → 取件后 Deduct；**特殊出库**：直接 Deduct；打包录单号不改库存（**§8.2**） |

侧栏与 Dashboard Quick Actions 仍可进入上述模块；实现与验收以 **独立 PRD** 为准。

---

## 附录：与原型差异（实现跟踪）

| 项 | PRD（本文） | 当前 HTML 原型（演示） |
|----|-------------|------------------------|
| 库存调整权限 | Admin + 仓管所属仓 | 演示开关为 Admin only |
| Dashboard 布局 | §7：6 KPI + Quick Actions + Admin Setup + Today's Operations 流水表 | 与 Axure/截图一致；Pending 指标原型为演示聚合数 |
| Warehouse / Zone Code | `SH001`、`SH001STO` | 原型 mock 已统一无连字符 |
| 单据号 | `IN-20260821001`、`OB…`、`ADJ-YYYYMMDDNNN` | 入库流水 Related Order No. = Inbound No. |
| Record Tab 顺序 | All 首位 | 一致 |
| Opening 子筛 | 不单独 Opening | 一致 |
| 入库 | 独立 PRD | 原型 `inbound.js`：采购 xlsx 导入 + 手动导入，Confirm Stock-In 写流水 |
| 出库 | [`KickBazar-WMS-Outbound-PRD.md`](KickBazar-WMS-Outbound-PRD.md) | `outbound.js`：导入分配、发货单 CSV 回导、拣货单 PDF、发货扣减 |
