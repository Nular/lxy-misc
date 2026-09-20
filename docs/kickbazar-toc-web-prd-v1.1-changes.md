# KickBazar ToC Web PRD — v1.1 修订梳理（2026/09/20）

> 本文档汇总 v1.1 相对 v1.0 的 **11 项变更**，每节均为 **可直接复制粘贴到飞书 PRD 对应位置** 的替换/增补文本。  
> 完整同步版见同目录 [`kickbazar-toc-web-prd.md`](./kickbazar-toc-web-prd.md)。

---

## 变更总览

| # | 变更主题 | 影响模块 | 动作 |
|---|---------|---------|------|
| 1 | Sort By 四档排序规则 | §2.4、§4.5、§4.6、§4.8、sort 枚举、BR211 | 修订 |
| 2 | 购物车 Checkout 按钮展示商品数量 | §4.9.1 购物车、BR618 | 增补 |
| 3 | 运费档位与 App 一致（非 Local 固定价） | §4.9.5–§4.9.8、BR622 | 修订 |
| 4 | 结算页地址：不自动弹窗 + Add New Address | §3.4、§4.9.5–§4.9.8、BR620a–c | 重写 |
| 5 | 地址确认/Change 两列布局（ToB 废版样式） | §4.9.5、BR620b、BR632 | 修订 |
| 6 | 优惠券功能移至下一期 | §4.9.5–§4.9.8、§6.1、BR625–626 | 删除/标注下期 |
| 7 | Order Summary COD Fee 划线展示 Free | §4.9.5–§4.9.7、BR623 | 增补 UI 规则 |
| 8 | 订单完成页增加「查看订单详情」 | §4.9.5–§4.9.8、BR628 | 增补 |
| 9 | 全局右侧 Sticky 快捷导航 + 回顶部 | §4.12（新增模块 G3） | 已新增 |
| 10 | 商品卡 Feature Tag 跳转专题页 | §4.4、§4.7.11、§4.10、BR120/BR847 | 增补 |
| 11 | 搜索结果页、分类页去掉 Filter 与 Featured | §1.2、§2.4、§4.5、§4.6、§7.1、NFR007 | 删除 |

---

## 文档基础信息 — 新增变更记录行（粘贴至「一、文档基础信息」表格）

| 时间 | 版本号 | 变更人 | 主要变更内容 |
|------|--------|--------|-------------|
| 2026/09/09 | v1.0 | 廖炫尧 | 首版 |
| 2026/09/20 | v1.1 | — | ① Sort By 四档规则对齐 App；② 购物车 Checkout 按钮展示已选商品件数；③ 运费档位 Standard / Air Express / Air Priority，计算与 App 一致；④ 结算页地址不自动弹窗，空态 + Add New Address；⑤ 地址确认/Change 两列布局；⑥ 优惠券移下一期；⑦ COD Fee 划线展示 Free；⑧ 结果页增加 View Order Details；⑨ 全局右侧 Sticky 导航 + 回顶部；⑩ 商品卡 Feature Tag 跳转专题页；⑪ 搜索/分类页移除 Filter 与 Featured Tab |

---

## 1. Sort By 排序（粘贴替换 §2.4 约束第 5 点、§4.5 相关段落）

### §2.4 约束与原则 — 第 5 点（替换）

```
5. 分期与筛选：
  本期做：搜索结果排序、分类页/店铺 Items Tab 排序（Sort By 四档，见 §4.5 sort 枚举）。
  本期不做：搜索结果页 Featured Tab、搜索结果页/分类页类目 Filter（L1–L3）、价格区间、颜色、尺码、品牌等多维属性 Filter；优惠券见 §6.1。
```

### §4.5.1 功能描述 — 搜索结果段（替换第 2–3 点）

```
2. 搜索结果页（#9）：展示命中商品列表，支持排序（#12）。URL 带 q 参数，可分享、可后退。本期不含类目 Filter（#11）与 Featured Tab（#10）。
3. 结果排序：默认 Recommend（sort=recommend）；搜索/分类/店铺 Items Tab 全站复用 Sort By 控件（BR211–BR213）；选项为 Recommend / New Arrival / Price / 销量（Sales）四档，Price 与 Sales 各含升序/降序子项，不含 A-Z / Z-A。
```

### sort 排序枚举表（粘贴替换 §4.5.2 sort 枚举整表）

| 枚举值 | 中文名称 | 英文名称 | 字段说明 |
|--------|---------|---------|---------|
| recommend | 推荐排序 | Recommend | **默认**。一级 **平台序** → 二级 **商家序** → 三级 **商品更改时间（update）倒序**；与 App 一致 |
| new_arrival | 上新 | New Arrival | 按商品更改时间（update）倒序 |
| price_asc | 价格从低到高 | Price Low to High | 按售价升序（Price 档） |
| price_desc | 价格从高到低 | Price High to Low | 按售价降序（Price 档） |
| sales_desc | 销量从高到低 | Sales High to Low | 按销量降序（销量档） |
| sales_asc | 销量从低到高 | Sales Low to High | 按销量升序（销量档） |

**Sort By 下拉展示（用户可见四档）：** Recommend · New Arrival · Price（Low to High / High to Low）· Sales / 销量（High to Low / Low to High）

**本期不做：** name_asc / name_desc（A-Z / Z-A）。

### BR211（粘贴替换）

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR211 | 排序（基准） | 点击 Sort By | 四档：Recommend / New Arrival / Price↑↓ / 销量↑↓；默认 Recommend；Recommend 排序：平台序→商家序→更改时间 | 加载● | 无 A-Z；与 App 一致 |

### FL034（粘贴替换功能清单行）

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|----------------|----------------|---------|
| FL034 | 结果排序 | Result Sort | Recommend / New Arrival / Price / 销量（Sales）四档，Price 与 Sales 含升降序 |

---

## 2. 购物车 Checkout 按钮商品数量（粘贴至 §4.9.1）

### 功能描述 — 增补段落

```
购物车页 Order Summary 区「Checkout / 去结算」主按钮须在按钮文案后展示已勾选有效商品的 **总件数**，格式：`Checkout ({selectedQuantity})` 或 `去结算（{selectedQuantity}）`。selectedQuantity = 当前已勾选且 status=valid 的各行 quantity 之和；未勾选任何有效商品时按钮 disabled，不展示数量或展示 (0) 且不可点。
```

### 业务规则 — 新增第 12 点

```
12. Checkout 按钮数量：实时随勾选/改量更新；仅统计 valid 且 selected=true 的行；与 Header 角标（SKU 总件数）口径不同——Checkout 仅统计本次结算勾选件数。
```

### BR618（粘贴替换）

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR618 | 去结算 | 点击 Checkout | 按钮展示 `Checkout ({selectedQuantity})`；以 Grand Total 进入结算；运费/COD 在 §4.10.2 计算 | 未登录● | 数量与勾选联动；门禁 BR619 |

### 字段定义 — Order Summary 区增补

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| selectedQuantity | 已选商品件数 | Selected Quantity | number | 是 | 已勾选有效行 quantity 合计；用于 Checkout 按钮展示 |

---

## 3. 运费档位与 App 一致（粘贴替换 §4.9.5–§4.9.7 发货/运费相关）

### §4.9.6 发货方式 / 运费档位（替换原「Local 固定 60」段落）

```
发货方式 / 运费档位（与 App 一致）
运费计算逻辑与 App 完全一致，按订单内商品适用档位汇总，**不限于单一 Local 固定价**。

支持档位（overseas / 跨境商品等按 App 规则匹配）：
  - Standard（标准）
  - Air Express（空运快线）
  - Air Priority（空运优先）

结算页左侧「Delivery Method / Shipping」区：
  - 展示当前订单可用的发货档位选项（单选或多档合并展示规则与 App 一致）；
  - 用户切换档位或切换地址后，Shipping Fee 实时重算；
  - 仅结算页 Order Summary 展示按档位计算的 Shipping Fee；购物车页不含运费。

本地/跨境混合订单的分档、叠加、取高/取和等细则以后端与 App 对齐接口为准。
```

### §4.9.7 字段定义 — 发货与支付（替换表）

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| deliveryMethod | 发货方式 | Delivery Method | enum | 是 | standard / air_express / air_priority；与 App 枚举一致 |
| deliveryMethodLabel | 档位展示名 | Delivery Method Label | string | 是 | Standard / Air Express / Air Priority；支持 i18n |
| shippingFee | 运费 | Shipping Fee | number | 是 | 按 App 规则动态计算，单位 BDT |
| paymentMethod | 支付方式 | Payment Method | string | 是 | 固定 Cash on Delivery |
| codHandlingFee | COD 手续费 | COD Handling Fee | number | 是 | 本期业务值为 0；前台展示规则见 §4.9.6 Order Summary |

### Order Summary 金额构成（替换 Shipping Fee 行）

```
金额构成：Subtotal（hover 小问号「VAT Inclusive：total is inclusive of VAT」）+ Promotion + Shipping Fee（按档位动态计算）+ COD Handling Fee（见第 7 节）= Payable Amount。

本期不含 Coupon 行（优惠券下一期，§6.1）。
```

### BR622（粘贴替换）

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR622 | 发货档位 | 结算页 | 展示 Standard / Air Express / Air Priority；运费按 App 规则计算；切换档位或地址后重算 | 加载● | 非固定 Local 60；与 App 一致 |

---

## 4 & 5. 结算页地址交互 + 两列布局（粘贴替换 §4.9.5–§4.9.8 地址相关）

### §4.9.6 Shipping Address 区（替换原「两种态 + BR620a 自动弹窗」描述）

```
Shipping Address 区两种态：

**空态（无 addressId）：**
  - 展示空态文案（如「请添加收货地址」）+ **Add New Address** 主按钮；
  - **不自动弹出**地址 Modal（取消 v1.0 BR620a 自动弹窗逻辑）；
  - 用户点击 Add New Address → 打开新增地址 Modal（BR635）；
  - 用户在 Modal 内点击关闭/遮罩/ESC → **关闭 Modal，停留当前 /checkout 页，不返回上一页**。

**已填态（有 addressId）：**
  - 展示只读地址确认卡片，**两列布局（同历史 ToB 地址确认废版样式）**：
    - **左列**：Recipient Name、Phone Number（+880）
    - **右列**：Division · District · Area（一行）+ Address 详细地址（次行）
  - 提供 **Change Address**（BR632，地址列表 Modal，列表项同样两列卡片可选）与 **Edit Address**（BR638）。

**下单门禁：**
  - 无 addressId 时点击 Place Order → Toast 提示「请先添加收货地址」（或等价 i18n），**不提交订单、不跳转**；
  - 用户可再次点击 Add New Address 打开 Modal。
```

### 地址规则（替换 §4.9.6「地址规则（修订）」整段）

```
地址规则（v1.1）
1. 不自动弹窗：首次进入 /checkout 且无 addressId 时，Shipping Address 区展示空态 + Add New Address；不自动打开地址 Modal。
2. Add New Address：点击按钮打开新增地址 Modal（BR635）；关闭 Modal（遮罩/关闭按钮/ESC）后留在 checkout 页，不 router.back。
3. 已有地址：只读确认卡片两列布局（左：姓名/电话；右：Division·District·Area + 详细地址）；Change / Edit 同字段。
4. Change Address：打开地址列表 Modal（BR632），列表每项为**两列可选卡片**（布局同确认卡片）；选中后绑定 addressId 并关闭 Modal。
5. 下单门禁：无 addressId 点击 Place Order → Toast + 不提交（BR620c）；不自动再次打开 Modal。
6. Save 成功：写入地址库，绑定 addressId，Shipping Address 切已填态；Order Summary 可继续操作。
```

### §3.4 跨模块衔接 — 替换相关行

| 场景 | 规则 |
|------|------|
| 登录后 redirect 回 checkout | 若仍无 addressId，Shipping Address 展示**空态 + Add New Address**，不自动弹 Modal |
| Save 地址成功 | 写入地址库；当前结算页 addressId 绑定；Order Summary 可继续操作 |

（删除原「继续触发 BR620a」自动弹窗表述。）

### BR620a / BR620b / BR620c（粘贴替换）

| 编号 | 需求名称 | 触发条件 | 交互行为 | 验收标准 |
|------|---------|---------|---------|---------|
| BR620a | 地址空态 | 进入 /checkout 且 addressId 为空 | 展示空态 + Add New Address；**不自动弹 Modal** | 用户可继续浏览结算页其他区域 |
| BR620b | 地址展示态 | Save 成功 / Change 选择已有地址 | 两列只读卡片：左列姓名+电话；右列 Division·District·Area + 详细地址 | 同 ToB 确认样式 |
| BR620c | 下单门禁 | Place Order 且 addressId 为空 | Toast 提示；不提交；不跳转上一页 | 可手动点 Add New Address |

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR632 | 地址列表 Modal | Change Address | Modal 展示地址列表；每项**两列卡片**可选；选中绑定 addressId | — | 布局同 BR620b |

---

## 6. 优惠券下一期（粘贴替换 §4.9.6 优惠券段 + §6.1）

### §4.9.6 流程描述（替换）

```
流程：填写/选择地址 → 确认商品与备注 → 选择发货档位 → 确认金额 → 提交订单 → 跳转结果页。

本期不做：优惠券（Coupon & Code）——整体移至下一期 P1，结算页不展示 Coupon 输入区、Drawer 入口及 Order Summary Coupon 行。详见 §6.1。
```

### §6.1 本期不做 — 增补/确认行

| 项目 | 说明 |
|------|------|
| 优惠券 Coupon & Code | 结算页券码输入、Drawer 选券、Order Summary Coupon 行——**下一期 P1**；本期结算页无优惠券 UI 与计算 |

### 删除或标注下期（本期验收不包含）

- FL 优惠券相关（若单独编号则标 P1）
- **BR625、BR626** — 标注「下一期 P1，本期不验收」
- §4.9.7 优惠券字段表 — 整表移入 §6.2 P1 扩展或标注「下期」

---

## 7. Order Summary COD Fee 划线 Free（粘贴至 §4.9.6 Order Summary）

```
COD Handling Fee 展示规则（本期免费但须显式露出）：
  - Order Summary 须单独一行展示「COD Handling Fee」；
  - 当 codHandlingFee = 0 时：展示原价占位（如 ৳60.00 或接口返回的原价 codHandlingFeeOriginal）并 **划线**，右侧展示 **Free**（绿色或强调色，与 App 一致）；
  - 当未来收费时：展示实际金额，不划线；
  - 计入 Payable Amount 时仍按实际 codHandlingFee（本期为 0）。
```

### BR623 增补验收列

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR623 | COD 支付 | 结算页 | 固定 Cash on Delivery；Order Summary 展示 COD Handling Fee 行：划线价 + **Free** | — | 本期 fee=0 仍展示该行 |

### 字段增补

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| codHandlingFeeOriginal | COD 原价 | COD Fee Original | number | 否 | 用于划线展示；无则前端用运营默认占位价 |
| codHandlingFeeDisplay | COD 展示文案 | COD Fee Display | string | 是 | 本期固定 "Free" |

---

## 8. 订单完成页 View Order Details（粘贴至 §4.9.5–§4.9.8 结果页）

### §4.9.6 提交与结果 — 替换结果页描述

```
结果页：
  - 成功态展示订单号、实付金额；
  - 主按钮区提供两个 CTA（并列或上下，以 UI 稿为准）：
    1. **View Order Details**（查看订单详情）→ `/account/orders/{orderId}`（他人 PRD 订单详情页）
    2. **View Order List**（查看订单列表）→ ordersListUrl
  - 失败态：Toast + 建议重新提交；可回 Checkout（BR644）。
```

### §4.9.7 订单结果页字段 — 增补

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| orderDetailUrl | 订单详情地址 | Order Detail URL | string | 是 | View Order Details 跳转，如 `/account/orders/{orderId}` |

### BR628（粘贴替换）

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR628 | 结果页成功 | 下单成功 | 成功态 + **View Order Details** → orderDetailUrl + View Order List → ordersListUrl | — | 两按钮均可达 |

---

## 9. 全局右侧 Sticky 快捷导航（完整模块 — 粘贴为 §4.12）

> v1.1 新增模块 G3 #40。若 PRD 尚无本节，整节粘贴；若已有则与下述保持一致。

（内容与 [`kickbazar-toc-web-prd.md`](./kickbazar-toc-web-prd.md) §4.12 一致，含 FL140–FL141、BR840–BR846。）

**要点摘要：**
- **块 A**：右侧 fixed，纵向 Home / 客服 / Cart 三 Icon；Cart 角标同 Header。
- **块 B**：独立小块，scrollY > 80px 后显示「回顶部」，点击 smooth scroll 至顶。
- 全屏 Modal 打开时 A/B 均隐藏。
- 客服跳转 supportEntryUrl，与 Header/Footer 一致。

---

## 10. 商品卡 Feature Tag 跳转专题页（粘贴增补）

### §4.4 / §4.7.11 / §4.10 业务规则 — 增补

```
专题 Tag 点击：商品卡（及 PDP 右侧）上的 topicTag / Feature Tag 为可点击链接；点击跳转对应专题页：
  - brand → Brand Zone 专题路由
  - country/global → Country Pavilion
  - featured → Featured
  - trending → Trending
路由与 topicType 映射同 §4.10；无有效专题时 Tag 仅展示不可点或隐藏。
```

### 通用商品卡字段 — 增补

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| topicUrl | 专题页链接 | Topic URL | string | 否 | Feature Tag 跳转目标；由 topicType + topicId 组成 |

### BR847（新增，粘贴至 §4.4.3 或 §4.10.3）

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR847 | Feature Tag 跳转 | 点击商品卡 topicTag | 跳转 topicUrl 对应专题页 | — | PDP/列表/推荐区一致；无 URL 时不跳转 |

### BR120 验收标准增补

```
点击商品卡主体 → PDP；点击 topicTag → 专题页（BR847）；两者热区独立，不冲突。
```

---

## 11. 搜索/分类页去掉 Filter 与 Featured（粘贴替换多处）

### §1.2 本文档范围 — 搜索/分类行（替换）

| 模块 | 页面/组件 | 本期范围说明 |
|------|----------|-------------|
| 搜索 | 搜索弹窗、结果列表、排序 | P0；**不含** Featured Tab、类目 Filter |
| 分类 | 一级/二级分类、分类商品列表 | P0；**不含** 页内 L3 Filter |

### §1.2 — 删除或标注不做

- 删除「搜索筛选 #11 FL139」作为本期 P0 独立条目（或改为「下一期」）

### §4.5 功能清单 — 删除行

删除：**FL139** 结果类目筛选、**FL035** 若仅服务 Filter URL 则删除。

保留：FL030–FL034（结果列表、排序等）。

### §4.5 业务规则 — 删除第 6、7 点，替换为

```
6. 本期不做搜索结果页类目 Filter（L1–L3）与 Featured Tab（四大馆 Tab/Pill）；结果页仅关键词 + Sort By + 商品列表。
7. 无结果：展示空态 + 推荐组件（BR418–BR420），不展示 Filter/Featured 占位。
```

### §4.5.3 交互说明 — 删除 BR828、BR837

并从 BR211 验收中删除「与 Filter 叠加」相关描述。

### §4.6 分类 — 删除 L3 Filter

**功能清单：** 删除 FL141、FL142c 中与「页内 L3 Filter」相关项。

**业务规则：** 删除 ①–④ 中 Filter 相关；分类页结构为 **Banner + 商品列表 + Sort By**，无 Categories 筛选条。

**交互：** 删除 **BR836**、**BR833**（L3 Filter）；保留抽屉三列（L1/L2/推荐）与 BR305 列表排序。

**§3.4 分类一级收敛：** 页面结构改为 `Banner + 商品列表`（删除「+ Filter」）。

### §7.1 功能验收 — 替换相关勾选项

```
删除：[] 搜索 Featured Tab 与类目 Filter（L1–L3）本期可用
新增：[] 搜索结果页、分类落地页均不展示 Filter 与 Featured Tab；仅 Sort By + 列表
```

### NFR007 — 替换

```
布局策略：PC 顶栏导航；搜索结果页/分类页本期仅 Sort By，不含类目 Filter 与 Featured Tab；价格/属性 Filter 本期不做。
```

---

## §1.2 全局范围 — 增补 Sticky 模块行

| 模块 | 页面/组件 | 本期范围说明 |
|------|----------|-------------|
| 全局 | 右侧 Sticky 快捷导航（#40） | P0：Home / 客服 / Cart + 回顶部 |

---

## 附录索引增补

- **FL140–FL141**：§4.12 右侧 Sticky / 回顶部  
- **BR840–BR846**：Sticky 交互  
- **BR847**：Feature Tag 跳转专题  
- **删除/下期**：BR828、BR836、BR837（Filter/Featured）；BR625–626（优惠券 P1）
