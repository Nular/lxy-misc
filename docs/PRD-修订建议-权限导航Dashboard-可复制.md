# KickBazar WMS — 本轮原型/PRD 对齐说明（可复制进飞书）

> 用途：将「会话中已落地的原型改动」写回 PRD。下文 **【替换块】** 可直接覆盖飞书对应章节；**【增补】** 为新增段落。

---

## 一、改动总结（相对你提供的 PRD 基线）

### 1. 角色与仓库上下文（全局数据范围）

| 项 | PRD 原表述（节选） | 本轮定稿/原型 |
| --- | --- | --- |
| 管理员切换仓库 | 「右上角 Warehouse 选择 All 或指定仓」 | **仅在 Home（Dashboard）切换**；侧栏**只展示**当前仓库名称，不可切换 |
| 切换原因 | 未单独说明 | **性能/库表读取**：切换仓库视为重新拉取全模块范围数据，**禁止**在业务列表页频繁切换 |
| 仓库管理员 | 仅所属仓、不可选 All | 一致；侧栏固定展示所属仓名称 |
| Warehouses 菜单 | Admin 建仓/管库区 | **仅 Admin** 可见 `Warehouses → Warehouse Management / Zone Management`；仓管**不展示**该一级目录 |
| 列表筛选项 | 各模块可选 Warehouse | 当上下文 **≠ All** 时，**隐藏** Inventory / Record / Zone 等页的 **Warehouse 筛选**（范围由 Dashboard 注入，避免重复筛选与误操作） |
| 切换频控（原型演示） | — | 弹窗打开时不可切换；**每分钟最多 3 次**；失败 Toast 并回退选择 |

### 2. 导航结构

| 项 | PRD 原表述 | 本轮定稿/原型 |
| --- | --- | --- |
| 采购单入口 | Quick Links「采购单 → 采购单列表」 | 侧栏增加 **一级目录 Purchase Order**，位置在 **Inbound 之上**（占位/跨模块入口，与 Quick Links 可并存） |
| Home Quick Links | 含 Warehouse Setup (Admin Only) | 原型 Dashboard Quick Access 含 Purchase Order、Inventory、Record；仓管隐藏仓库/库区快捷入口 |

### 3. 库区字段（Zone）

| 项 | PRD 原表述 | 本轮定稿/原型 |
| --- | --- | --- |
| 库区展示列 | 「库区 Zone」= 八类类型 | **取消独立「Zone Name / 库区名称」字段与列**；列表、表单、SPU 视图仅保留 **Zone（类型）** + **Zone Code** |
| 数据模型 | `zone` 为类型 | 内部可保留 `name` 与类型同步或废弃展示层 name；**对用户只暴露类型码语义** |

### 4. 库存流水 Record（原型已实现，与 PRD 部分差异需产品确认）

| 项 | PRD 原表述 | 当前原型 |
| --- | --- | --- |
| Tab 结构 | 五个 Tab：Inbound、Outbound Occupy、Outbound Deduct、Manual Adjustment、All | **All / Inbound / Outbound / Manual Adjustment**；Outbound 下子 Tab：**Outbound Deduct / Outbound Occupy** |
| Inbound 子筛 | 全部 / Manual / Purchase / **Opening** | **全部 / Manual / Purchase**（期初 Opening 原型未做） |
| 盘盈盘亏展示 | 部分写在 Inbound → Manual | **Manual Adjustment 独立 Tab**；Inbound 子筛 Manual 仅入库类人工单（若保留需二选一） |
| 行交互 | — | 行点击 + View 图标 → **流水详情 Modal**（入库/出库/调整字段分块） |
| Unfreeze | 本期不做 Tab | 原型数据层仍有 unfreeze 样例，**未上 Tab**（与 PRD 一致） |

### 5. 库存调整（5.3）

| 项 | PRD | 原型 |
| --- | --- | --- |
| 权限 | 管理员；**仓管仅限所属仓库** | 原型演示为 **仅 Admin**（Role 切换）；**建议 PRD 保留仓管所属仓**，实现时对齐 |

### 6. 与 PRD 一致、无需改口径的部分

- **实物 = Locked + Available（Available 不落库，total − locked）**
- 库存粒度：**仓库 × 库区**；库位五段模型本期预留
- 仓库创建默认三区、仅存储区可启用等业务规则（原型有对应 Toast/逻辑）

---

## 二、【替换块】§2 角色与权限（建议全文替换）

### 2 角色与权限

| 角色 | 主路径 | 仓库上下文 | 导航与写操作 |
| --- | --- | --- | --- |
| **管理员（Admin）** | 设置中建仓、管库区；库存查看与流水核对；仓库编辑页可将状态从停用改为启用 | 在 **Home（Dashboard）** 选择 **All** 或某一 **Warehouse**；切换后全系统列表/指标按新范围刷新 | 可见 **Warehouses** 目录（Warehouse Management、Zone Management）；可进行库存调整（全仓或当前上下文仓，以实现为准） |
| **仓库管理员（Warehouse Manager）** | 以库存查看、流水、入出库作业为主 | **仅所属 Warehouse**，不可选 All；侧栏**只读展示**所属仓名称 | **不展示 Warehouses 目录**；不可建仓/删仓/管库区主数据；库存调整**仅限所属仓**（见 5.3） |

**仓库上下文（全局范围）规则：**

1. **切换入口唯一**：仅 **Dashboard** 提供仓库上下文切换控件（Admin：All + 仓库列表；仓管：无切换器）。
2. **侧栏展示**：全角色在侧栏顶部展示 **Current warehouse**（当前上下文名称）；Admin 附加提示文案：**「Switch on Dashboard」**。
3. **非 All 时的筛选 UI**：当上下文为指定仓库时，各业务列表页 **隐藏 Warehouse 筛选条件**（后端/接口仍强制注入 `warehouse_code`，忽略前端伪造）。
4. **切换行为**：切换仓库视为重新加载当前用户权限下的聚合数据（库存、流水、Dashboard 指标等）；**不在** Inventory、Record、Zone 等页提供切换器，避免重复查询与性能问题。
5. **切换限制（建议）**：切换前若有未关闭弹窗则禁止切换；可选频控（如每分钟 N 次）；切换失败保持原上下文并 Toast。

**商品与条码：** 商品只读 C 端 Seller 库；SKU 条码仅缓存与展示，不在 WMS 建品、不在 WMS 维护条码主数据。

---

## 三、【替换块】§1.3 模块划分 / 侧栏导航（建议增补）

在「系统总体模块划分」或侧栏说明中增加：

**侧栏顺序（本期原型）：**

1. Home  
2. Inventory → SPU/SKU inventory、Record  
3. **Purchase Order**（一级目录，Inbound 之上）  
4. Inbound  
5. Outbound  
6. Warehouses（**仅 Admin**）→ Warehouse Management、Zone Management  

**Purchase Order：** 跨模块入口，跳转采购单列表（本期可与 Inbound/采购入库联动，不在 WMS 重复维护 PO 主数据）。

---

## 四、【替换块】§4 仓库库区管理 — 字段表（删除 Zone Name）

**列表列：** Warehouse Code、Zone Code、**Zone（类型）**、Status、Total、Locked、Available、Operation。  
**不展示：** Zone Name / 库区名称。

**创建/编辑库区表单字段：**

| 中文 | 英文 | 说明 |
| --- | --- | --- |
| 仓库 Code | Warehouse Code | 下拉；从某仓跳入可锁定 |
| 库区 | Zone | 八类之一；**创建后不可改** |
| 库区编码 | Zone Code | 系统生成 `{warehouse_code}{type_code}`，只读 |
| 状态 | Status | Enable / Disable |

（删除原「库区名称」独立输入项。）

---

## 五、【替换块】§5.1 / 5.2 库存查看 — SPU 列

SPU 表列：**Product ID、Product Name、SKU Count、Total、Locked、Available、Warehouse、Zone（类型）**。  
（删除「Zone Name」列；多 SKU 多位置时 Zone 可为「—」。）

**从仓库列表 Stock 跳转：** 新标签打开 SPU/SKU Inventory，URL 带 `warehouse_code`；若当前全局上下文已为指定仓，则筛选栏 Warehouse **隐藏**且由上下文注入（与 Dashboard 切换规则一致）。

---

## 六、【替换块】§6 库存流水 — Tab 与调整单归属（建议）

**入口 Record，Tab：**

1. **All** — 全部类型（默认时间等业务规则不变）  
2. **Inbound** — 采购入库、期初入库（若本期做 Opening）、**不含**库存调整单  
   - 子筛：All / **Manual**（人工入库类）/ **Purchase** / Opening（若本期启用）  
3. **Outbound** — 出库占用 + 出库扣减  
   - 子筛：All / **Outbound Deduct** / **Outbound Occupy**  
4. **Manual Adjustment** — 库存调整单产生的流水（增加与减少均在此 Tab；减少展示负 Qty）  

**说明：**

- 盘盈、盘亏、报溢、报损、录入纠错 **仅能通过 5.3 调整单** 写账，流水落在 **Manual Adjustment** Tab（若产品坚持「减少在 Inbound→Manual」，需单独开期冲突，**建议统一在 Manual Adjustment**）。  
- **本期不做 Unfreeze Tab**；解冻类流水若历史存在，归入 All 或不出现在筛选 Tab。  
- 列表支持 **查看详情**（关联单号、入库/出库/调整扩展字段）；一期关联单号可为文本，不强制跳转。

**共用筛选：** 时间、Warehouse、Zone、SKU ID、关联单号、操作人。  
**当全局仓库上下文 ≠ All 时：隐藏 Warehouse 筛选**，接口强制 `warehouse_code = 当前上下文`。

---

## 七、【替换块】§7 Home（Dashboard）— 全局联动（核心变更）

**页面定位：** 只读总览；不在此页执行写账。口径：**实物 = 锁定 + 未锁定**。

### 7.0 仓库上下文选择器（原「右上角 Warehouse」改为 Dashboard 内）

| 角色 | 控件位置 | 可选值 | 切换后行为 |
| --- | --- | --- | --- |
| Admin | **Dashboard 页头**「Warehouse context」 | All、各仓库 | 刷新本页 KPI、今日作业、仓库概况等；并更新**全局上下文**（侧栏展示名、各模块列表范围） |
| 仓管 | 无切换器 | 固定所属仓 | 侧栏展示所属仓名称 |

**侧栏：** 仅展示 **Current warehouse**（All 时展示「All warehouses」或等价文案），**不提供下拉切换**。

**性能说明（建议写入 PRD）：** 仓库上下文变更触发多聚合查询（库存汇总、流水、库区分布），故**限定在 Dashboard 切换**；业务页不提供切换，避免列表页重复全量刷新。

**筛选联动：** 上下文为指定仓库时，Inventory / Record / Zone Management 等页 **隐藏 Warehouse 筛选项**，查询参数由服务端按登录用户 + 当前上下文注入。

（以下 7.1–7.5 保持你原文，仅将文中「右上角 Warehouse 选择器」全部改为 **「Dashboard 仓库上下文选择器」**，并补充侧栏只读展示一句。）

### 7.2 Quick Links 增补

在通用入口中保留 **Purchase Orders**；侧栏已有一级 **Purchase Order** 时，Quick Link 与之跳转目标一致，避免两套主数据。

**Warehouse Setup (Admin Only)** 区块：仅 Admin；仓管不可见。含 Warehouse Management、Zone Management（若 Dashboard 已选指定仓，进入 Zone Management 时 **锁定 warehouse_code 筛选**）。

---

## 八、接口与后端建议（跨章契约，可复制到 §8）

**`warehouse_context`（会话或用户偏好，Admin 可 all）：**

- 所有列表/聚合 API：**忽略前端传的 warehouse 筛选越权**；在「上下文 = 指定仓」时 **强制 `warehouse_code`**。  
- 上下文切换 API（或 Dashboard 专用）：单次切换返回 Dashboard 所需聚合包，或触发前端按模块懒加载（产品可选）；**禁止**在 Inventory/Record 列表接口提供「切换仓库」副作用。

**权限：**

- `Warehouses/*` 接口：Admin only。  
- 仓管：库存、流水、入出库、所属仓调整单。

---

## 九、原型与 PRD 待产品拍板项（清单）

1. **Record Tab**：是否采用「Outbound 合并 + 子 Tab」而非 PRD 原五个平级 Tab。  
2. **Manual 调整流水**：独立 **Manual Adjustment Tab** vs 减少项仍在 **Inbound → Manual**。  
3. **Opening（期初入库）**：本期是否上线子筛与类型。  
4. **库存调整权限**：原型 Admin-only 演示 vs PRD 仓管所属仓 — **建议按 PRD 实现**。  
5. **Zone Code 展示格式**：PRD `SH001STO` vs 原型 `SH-001-STO` — 统一编码规范写入 §4。  
6. **Dashboard KPI**：PRD 6 张卡片（Pending Inbound 等）原型尚未全量实现 — 保留 PRD，标注「后续迭代」。

---

## 十、一句话版本（给评审会）

> Admin 只在 **Dashboard** 切换 **All/单仓** 以控制全局数据范围，侧栏只展示当前仓；仓管无 **Warehouses** 菜单且绑定单仓；**Purchase Order** 提升为 Inbound 上一级导航；库区 UI **去掉 Zone Name** 只保留类型；流水 **All + Inbound + Outbound(子Tab) + Manual Adjustment**，支持详情查看。
