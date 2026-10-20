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
| 3 | **Purchase Order** | 采购单（§9） |
| 4 | **Inbound** | 入库单 / Receipt（§10） |
| 5 | Outbound | 出库单 |
| 6 | **Warehouses** | **仅 Admin**：Warehouse Management、Zone Management |

Dashboard **Quick Actions** 与侧栏 Purchase Order / Inbound 跳转同一列表页。

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
- 展示字段（SKU ID、Specification、Product Name、条码缓存等）来自 **原有商品库 / Seller 库**（WMS **只读**，见 §1.2、§2）。
- 写账：入库上架、出库占用/扣减、库存调整单（§5.3）更新 `total`、`locked`；**Available 不落库**（`total - locked`）。

#### 5.0.1 库存行初始化（自原有库导入，拍板）

WMS **不在入库/采购单页面创建 SKU 主数据**；仓内可作业前提如下：

1. **商品主数据**：自企业 **原有数据库（商品库）** 一次性或增量 **导入/同步** 至 WMS 可读层（与 Seller 库只读策略一致）。
2. **库存行生成**：对每个 **`warehouse_code` × 已启用 `zone_code`**，对 Admin **已下发到该仓** 的 SKU，生成库存行：
   - **Total = 0**、**Locked = 0**、**Available = 0**（实时计算）。
   - 未下发到该仓的 SKU **不存在** 对应库存行。
3. **导入时机**：建仓并启用库区后、**首次入库/出库/调整前** 必须完成该仓 SKU 库存行初始化（批量任务或接口）；失败可重试，**禁止**在未初始化仓上执行写账。

> 说明：「原有数据库导入」指 **商品 + 仓内库存行占位（零库存）** 的数据准备阶段，**不是**指 Excel 入库单导入。

#### 5.0.2 入库/出库/调整前置条件（拍板）

任意 **写库存** 操作（含 §10 入库上架、§5.3 调整、§11 出库占用/扣减）前，系统 **必须** 校验：

| 校验项 | 规则 | 失败处理 |
|--------|------|----------|
| 库存行存在 | 存在记录 `(sku_id, warehouse_code, zone_code)` | 拒绝写账；提示 **SKU not registered in this warehouse/zone**（文案产品定稿） |
| 仓/区可用 | 仓库 Enable、目标库区 Enable；上架默认 **Storage Zone**（§8.1） | 拒绝 |
| 商品主数据 | SKU 在商品库存在且可读 | 拒绝 |

**入库/采购单匹配规则**：Add Products、Link PO、Excel **Import** 均只能选中或匹配 **当前 `warehouse_code` 下已存在库存行** 的 SKU；**不得**因入库/PO 导入而 **自动新建** 库存行或商品主数据。若需新 SKU 进仓，须先走 **§5.0.1 下发/初始化** 再入库。

#### 5.0.3 与入库模块衔接

- §9 采购单、§10 入库单行上的 SKU，仅允许引用 **§5.0.1 已初始化** 的行；写账逻辑见 §10.6。
- Record / Inventory 查询结果与上述库存行 **同一数据源**。

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
**页面结构（自上而下，与原型一致）**：

1. 页头：标题 Dashboard + 副标题 *Warehouse inventory overview and recent activity*
2. **关键指标卡片**（一行 6 张）
3. **Quick Actions**（一行 3 张任务卡）
4. **Warehouse Setup (Admin Only)**（一行 2 张，仅 Admin）
5. **Today's Operations**（全宽表格 = 当前上下文下的**库存流水摘要**）

### 7.0 仓库上下文选择器（全局联动）

| 角色 | 位置 | 可选值 | 切换后 |
|------|------|--------|--------|
| Admin | **侧栏 Warehouse 下拉**（在 Home 页可操作） | All、各仓库 | 刷新 Dashboard 六项 KPI、今日作业表；更新**全局上下文**（各模块默认范围） |
| 仓管 | 侧栏只读文案 | 固定所属仓 | — |

- 非 Home 页禁止切换上下文（§2.1）。
- 选 **All** 时指标为全系统汇总；选**指定仓**时仅统计该 `warehouse_code`（展示用 canonical 码，如 `SH001`）。

### 7.1 关键指标卡片

**布局**：单行 **6** 张只读卡片，顺序固定：

| # | 中文 | 英文 | 单位/说明 |
|---|------|------|-----------|
| 1 | 总库存 | Total Inventory | 件数；当前视图 Σ `total` |
| 2 | 待入库 | Pending Inbound | **vehicles**（待收货/待上架任务数） |
| 3 | 待分配 | Pending Allocation | orders |
| 4 | 待拣货 | Pending Picking | orders |
| 5 | 待打包 | Pending Packing | orders |
| 6 | 今日已发货 | Shipped Today | orders（当日已完成发运） |

- Pending / Shipped 来自入出库模块聚合；Dashboard **不改单据状态**。
- **点击跳转**（带入当前仓库上下文）：

| 卡片 | 跳转 |
|------|------|
| Total Inventory | Inventory → SPU/SKU Inventory（**默认 SKU Tab**） |
| Pending Inbound | Inbound（状态=待处理） |
| Pending Allocation / Picking / Packing / Shipped Today | Outbound（对应状态筛选） |

- 进入 Home、**切换仓库**、从其他页返回 Home 时刷新；无数据展示 `0`。失败 Toast：`Failed to load dashboard metrics.`

### 7.2 Quick Actions（主任务入口）

**区块标题**：Quick Actions。一行 **3** 张大卡片（图标 + 文案 + 右箭头）：

| 中文 | 英文 | 跳转 |
|------|------|------|
| 采购单 | Purchase Orders | 采购单列表 |
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
| Order No. | 关联单号（文本） |
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

## 9 采购单（Purchase Order）

### 9.0 模块定位与基础模块关系

- **数据范围**：受 §2.1 `warehouse_context` 约束；列表默认仅展示当前上下文仓库的 PO（`warehouse_code`）。
- **不写库存**：PO 创建/编辑/导入**不**改 `total/locked`；**入库完成（Stocked In）** 后由 **§10 入库单** 写账并生成 **§6 入库流水**。
- **商品主数据**：SKU ID、名称、规格、条码自 **Seller/商品库只读**；PO 行可带 **Qty、单价、链接** 等采购属性，不在 WMS 建品。
- **SKU 可选范围（拍板）**：Add Products / Import **仅能选择或匹配** 当前 `warehouse_code` 下 **§5.0.1 已生成库存行** 的 SKU（初始 Total=0 即可）；未下发 SKU **不可加入 PO 行**。
- **与旧稿差异**：原「Creation Method = Manual Adjustment」改为 **Manual Entry**（避免与 §5.3 库存调整单混淆）。

### 9.1 功能列表

查看 / 创建 / 编辑 / 删除采购单；搜索；Status、Creation Method 筛选；分页（默认 20，可选 20/50/100/500）；新建排序在前。

### 9.2 单号与编码规则

| 字段 | 规则 |
|------|------|
| **Order No.** (`po_no`) | `PO-{YYYYMMDD}{seq3}`，与流水前缀规则一致；全局唯一，系统生成，不可改。例：`PO-20260821088` |
| **warehouse_code** | 创建时取当前上下文仓，canonical 5 位（§3.2.1），例 `SH001` |
| **Linked Receipt No.** | 关联入库单号 `IN-{YYYYMMDD}{seq3}`（§10.2），一对多 |

`seq3`：按自然日全局递增，3 位数字（001–999），事务分配。展示与落库均为 **前缀 + 连字符 + 日期流水连写**（`PO-20260821088`），**不要**写成 `PO-20260821-0088`。

### 9.3 搜索与筛选

- **搜索类别（单选）**：Order No.（默认） / Linked Receipt No.
- **搜索推荐框**：焦点或输入时展示；高度 1–5 行，超出滚动；空关键词展示当前仓全部候选，有关键词做包含过滤。点击推荐项立即搜索。
- **Search**：无关键词 = 刷新全量；有关键词 = 模糊匹配，**精确匹配排第一**（BR201/BR202）。
- **Status（多选，OR）**：**全部 10 态均在 WMS**（见 §9.4）。
- **Creation Method**：Manual Entry / Import Created（多选 OR）。
- **Filter / Reset**：无选中时置灰；Reset 清空条件。

### 9.4 状态与删除（WMS 全量）

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

### 9.5 SKU 行状态（与 PO 头联动）

行状态：Pending Shipment → Shipped → Received → **Stocked In**。  
- 所有行同态 → 头状态与行一致。  
- 行态不同 → 头状态优先级：**Partially Stocked In > Partially Received > Partially Shipped**。  
行优先级：Stocked In > Received > Shipped > Pending Shipment。

### 9.6 编辑页（Create Purchase Order）

三种互斥录入方式（与旧稿一致，命名调整）：

1. **Add Products** — 从 **当前仓已初始化库存行** 的 SKU 列表勾选（可联查商品库展示名称/规格/条码，只读）；**不展示**未下发 SKU。  
2. **Import** — 表头校验；按 **SKU ID** 匹配 **当前仓 + 默认/指定 `zone_code` 库存行**（§5.0.2）；未匹配行进入 **失败明细**，不自动建 SKU/库存行；最多 **2** 个并发导入任务；Processing 时 Delete 置灰  
3. （无「引用入库单」；引用方向为 **入库单引用 PO**）

- 草稿保留：localStorage / 服务端草稿（产品实现）；SKU 行上限 **10,000** 行。  
- 保存成功后可 **Print**；有行时出现 **Delete All** 二次确认。  
- 行字段（B2B 建议见 §9.8）：SKU ID、Product Name、Specification、**Qty（整数 1–9,999,999）**、**Unit Price（decimal(16,4)）**、Link、Cargo Type、Shipment Type、Remarks 等。

---

## 10 入库（Inbound Receipt）

> **独立正文**：入库模块完整 PRD 见 [`KickBazar-WMS-Inbound-PRD.md`](KickBazar-WMS-Inbound-PRD.md)。本节为与主文档的 **摘要/契约索引**。

### 10.0 模块定位

- **Receipt** = 入库单（上架凭证）；**Stocked In** = 确认上架，写 **total↑、available↑**（locked 不变），并写 **§6.1 入库流水**。
- **前置依赖（拍板）**：本模块 **依赖 §5.0.1–§5.0.2**；入库匹配 **只更新已存在库存行**，不在 Receipt 流程中创建 SKU 或零库存行。
- **Receipt Type**（与流水类型映射）：

| Receipt Type | 流水 Type | Record 子筛 |
|--------------|-----------|-------------|
| **Purchase Receipt** | Purchase Inbound | Purchase |
| **Manual Receipt** | Manual Inbound | Manual |

禁止使用 **Manual Adjustment** 作为入库类型（调整走 §5.3 ADJ 单）。

- **上架库区**：默认当前仓 **已启用的 Storage Zone**（`zone_code` 如 `SH001STO`）；停用仓/区不可作为目标（§8.1）。

### 10.1 功能列表

同旧稿：列表 / 创建 / 编辑 / 查看 / 删除；Receipt No.、Related PO 搜索；Status、Receipt Type 筛选；新建在前；分页 20/50/100/500。

### 10.2 单号规则

| 字段 | 规则 |
|------|------|
| **Receipt No.** (`receipt_no`) | `IN-{YYYYMMDD}{seq3}`，与库存流水 `order` / `inboundNo` **同一格式**。例：`IN-20260821001` |
| **Related PO** | 可选；`Purchase Receipt` 时建议必填 |
| **warehouse_code / zone_code** | §3.2.1 / §4.1 |

### 10.3 状态

| Status | 说明 |
|--------|------|
| Draft | 可编辑、可删 |
| Processing | 导入中，进度条；可 View；不可删 |
| Stocked In | 已完成上架；仅查看；不可删 |

### 10.4 编辑页（Create Receipt）

三种互斥方式（旧稿保留）：

1. **Link Purchase Order** — 选 PO 后拉取待入库行：展示 **Order Qty**（PO 行数量，只读），录入 **Receipt Qty**；**Variance = Receipt Qty − Order Qty** 只读对账，**不落库、不写库存**。差异处理走 **§5.3 调整单**或对账任务，不在入库行强制 Physical Inventory。  
2. **Add Products** — 手工入库（`Manual Receipt`）：SKU 选择器 **仅列出当前仓 §5.0.1 已初始化库存行**（Total=0 可入库）；填 **Receipt Qty**。  
3. **Import** — 表头校验；行 **SKU ID** 必须在当前 `warehouse_code`（及模板指定 `zone_code`，默认 STO）**已有库存行**；匹配成功填充只读商品信息 + 录入 Receipt Qty；**未匹配行不入库**，写入导入结果报告（行号、SKU、原因：`SKU not in warehouse inventory`）；**最多 2 个**并发导入；Processing 时 View 进度、不可删；Cancel 在导入开始后置灰。  

互斥规则：选 PO 后 Add Products / Import 置灰；反之亦然。

**Link PO 匹配补充**：自 PO 带入的 SKU 在 **Stocked In 写账前** 再次校验 §5.0.2；若 PO 创建后该 SKU 已从仓内移除下发，**拒绝该行写账** 并提示先完成库存行初始化。

### 10.5 行字段（与基础库存对齐）

| 字段 | 必填 | 说明 |
|------|------|------|
| SKU ID | Y | 4–50 字符；**须存在于当前仓库存行**（§5.0.2），且商品库可读 |
| Product Name / Specification | Y | 匹配成功后 **只读带出**（商品库） |
| **Order Qty** | N | 来自 PO，只读；手工/导入可空 |
| **Receipt Qty** | Y | 实际上架数量；整数 **1–9,999,999**；**仅此字段写账** |
| **Variance** | — | 计算列 `receipt_qty − order_qty`，对账用 |
| **Zone** | Y | 默认 Storage `zone_code` |
| Primary Barcode / PAN | N | **展示只读**（§1.2）；不在入库单编辑页强制录入 13 位 PAN（旧稿 R1–R3 迁至 Seller 域） |
| Supplier / Remarks | N | 头字段或行备注 |

**删除字段建议（相对旧稿）**：行级 Total/Qty/Physical Inventory/Inventory Variance 四列并存易混淆 → 统一为 **Receipt Qty**；账面/实盘/差异在对账或调整单处理。

### 10.6 写账契约（与 §8.2）

Stocked In 事务内：

0. **前置**：逐行校验 §5.0.2（库存行存在、仓/区 Enable）；任一失败 **整单失败**  
1. 按行 `warehouse_code + zone_code + sku_id` **UPDATE** 已有库存行：`total += receipt_qty`，`available = total - locked`  
2. 插入 `record` 入库流水（`inboundNo` = Receipt No.，采购类附 `purchaseOrderNo`）  
3. 更新 PO 行状态 → Stocked In / PO 头 → Partially Stocked In 或 Stocked In  

失败整单回滚，禁止半截流水。**禁止** `INSERT` 新库存行作为入库副作用。

### 10.7 分页与列表记忆

与旧稿 2.5：从编辑弹层返回后保留页码、page size、筛选、滚动位置（产品实现）。

### 10.8 B2B 数字与校验建议（相对旧稿修订）

| 旧稿问题 | 建议 |
|----------|------|
| Qty/Total/Physical/Variance 均为 7 位整数且语义重叠 | 入库行仅 **Receipt Qty**；PO 行用 **Order Qty**；金额用 **decimal(16,4)** |
| PAN/Barcode 在 WMS 入库必填 13 位 | WMS **只读展示**；校验在 Seller 主数据 |
| 「Manual Adjustment」作入库类型 | 改为 **Manual Receipt**；调整单专用 ADJ 前缀 |
| 搜索推荐 5 行 UI | 保留；后端可用前缀索引 / 限 20 条 |
| Status 十态 | **全部在 WMS**（§9.4） |

---

## 11 出库（Outbound）

与库存基础模块、Axure《出库》包、交接会议（2026-10-12）对齐。

**作业闭环：** Admin 导出待处理订单 → WMS **Import Order**（校验表头）→ 按当前仓 **Storage Zone** 整行分配 → 有货 **Allocated**（占用库存）/ 缺货 **On Hold** → Allocated **Export Shipping Order**，线下填 Tracking No. 再导入 → 系统按包裹生成 **Shipment No.**，行进入 **Ready to Pick** → 打印拣货单（PDF，可保存或打印）→ Complete Picking → Ready to Pack → Complete Packing → Ready to Ship → 快递员上门取件后 **Confirm Shipment** → Shipped，并扣减实物。

拣货、打包**不改库存**；分配成功写 **Outbound Occupy**；确认发货写 **Outbound Deduct**。推荐库区仅 Enable 的 Storage Zone，且 `available ≥ 行数量`。

### 11.1 编码

| 单据 | 规则 | 示例 |
|------|------|------|
| Outbound No. | `OB` + `warehouse_code` + `yyyyMMdd` + 4 位流水；**一次导入一个号** | `OBSH001202608210001` |
| Shipment No. | `SHP` + `warehouse_code` + `yyyyMMdd` + 4 位流水；**每个 Tracking No. 一个** | `SHPSH001202608210001` |
| Tracking No. | 承运商回传，WMS 不生成 | `SF1029384756` |

### 11.2 行状态与批次状态

导入后行只有 **Allocated** 或 **On Hold**（没有行级 Pending）。

| 行状态 | 进入 | 库存 |
|--------|------|------|
| Allocated | 存储区 available 足够 | locked +N |
| Ready to Pick | Tracking 导入成功 | 不变 |
| Ready to Pack | Complete Picking | 不变 |
| Ready to Ship | Complete Packing | 不变 |
| Shipped | Confirm Shipment（快递员已取件） | total −N，locked −N |
| On Hold | available 不足 | 不变 |

| 批次状态 | 规则 |
|----------|------|
| Pending Outbound | 无 On Hold、无 Shipped |
| Partially Outbound | 有 On Hold，或已有部分 Shipped（会议：部分挂起则批次为部分出库） |
| Fully Outbound | 全部 Shipped |

### 11.3 拣货单商品码

拣货单 PDF。展示优先级：**EAN → UPC → —**（会议口径；拣货单不展示 PAN）。SKU 主数据仍见 §1.2。

### 11.4 页面

- **Outbound Orders**：Imported period + Confirm/Reset；Import Order；列表含 Outbound No.、Imported At、Source File、Warehouse、Orders、SKU Count、Total Units、Status、View。
- **Outbound Detail**：All / Allocated / Ready to Pick / Ready to Pack / Ready to Ship / Shipped / On Hold。
- **On Hold Orders**：跨批次 Re-allocate，仍用原仓存储区。

---

## 附录：与原型差异（实现跟踪）

| 项 | PRD（本文） | 当前 HTML 原型（演示） |
|----|-------------|------------------------|
| 库存调整权限 | Admin + 仓管所属仓 | 演示开关为 Admin only |
| Dashboard 布局 | §7：6 KPI + Quick Actions + Admin Setup + Today's Operations 流水表 | 与 Axure/截图一致；Pending 指标原型为演示聚合数 |
| Warehouse / Zone Code | `SH001`、`SH001STO` | 原型 mock 已统一无连字符 |
| 单据号 | `IN-20260821001`、`PO-20260821088`、`ADJ-YYYYMMDDNNN` | 与流水列 Related Order No. 一致 |
| Record Tab 顺序 | All 首位 | 一致 |
| Opening 子筛 | 不单独 Opening | 一致 |
| 采购单 / 入库 | §9–§10 | 原型 `inbound-po.js`：列表、筛选、创建、Stock-In 写流水演示 |
| 出库 | §11 | `outbound.js`：导入分配、发货单 CSV 回导、拣货单 PDF、发货扣减 |
