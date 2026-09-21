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
| 12 | 购物车最多 50 SKU，超限建议删除 | §3.4、§4.7、§4.9.1、§7.1、BR406、BR848–851 | 增补 |
| 13 | 购物车页 + Add to Cart 均须登录 | §2.4、§3.4、§4.1、§4.7、§4.9.0–§4.9.1、§4.12、BR406、BR619、BR852 | 修订（v1.1.3） |
| 14 | 技术评审四项（订单详情/地址/抽屉/分类 Filter） | §3.4、§4.6、§4.9.6–§4.9.8、BR301/308/620/628/632/836/853 | 修订（v1.2） |
| 15 | 未选全 SKU 加购 Toast；Sticky /cart 隐藏 Cart | §3.4、§4.7、§4.12、BR406/854/855 | 增补（v1.2.1） |

---

## 文档基础信息 — 新增变更记录行（粘贴至「一、文档基础信息」表格）

| 时间 | 版本号 | 变更人 | 主要变更内容 |
|------|--------|--------|-------------|
| 2026/09/09 | v1.0 | 廖炫尧 | 首版 |
| 2026/09/20 | v1.1 | — | ① Sort By 四档规则对齐 App；② 购物车 Checkout 按钮展示已选商品件数；③ 运费档位 Standard / Air Express / Air Priority，计算与 App 一致；④ 结算页地址不自动弹窗，空态 + Add New Address；⑤ 地址确认/Change 两列布局；⑥ 优惠券移下一期；⑦ COD Fee 划线展示 Free；⑧ 结果页增加 View Order Details；⑨ 全局右侧 Sticky 导航 + 回顶部；⑩ 商品卡 Feature Tag 跳转专题页；⑪ 搜索/分类页移除 Filter 与 Featured Tab |
| 2026/09/20 | v1.1.1 | — | ⑫ 购物车 SKU 上限 50：超限拦截加购、页内提示与删除引导（英文文案见 §12） |
| 2026/09/21 | v1.1.2 | — | ⑬ 购物车页仅登录可进（已被 v1.1.3 扩展） |
| 2026/09/21 | v1.1.3 | — | ⑬ Add to Cart + /cart 均须登录；取消游客购物车与登录合并 |
| 2026/09/21 | v1.2 | — | ⑭ View Order Details 跳本单最新订单；地址三行截断；Categories 抽屉 L1 不跳转；分类页 Filter（L2 跳转/L3 筛选） |

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

## 12. 购物车 50 SKU 上限（粘贴至 §4.9.1、§4.7、§3.4、§7.1）

### 规则摘要

| 维度 | 定义 |
|------|------|
| 上限 | **50 个 SKU**（= 50 条有效购物车行，每条对应唯一 `skuId`） |
| 不计入 | 同一 SKU **改数量**不新增 SKU 名额；Header 角标仍为**总件数**（与 SKU 数口径不同） |
| 拦截 | `cartSkuCount >= 50` 且本次为**新 skuId** 时，**禁止加购**（Buy Now 不受影响） |
| 允许 | 已有 SKU 加数量（受库存/moq 约束）；删除/批量删除释放名额 |
| 登录合并 | 合并后若 > 50 SKU，与 App 一致：保留最近加购的 50 条，其余丢弃并 Toast |

### §4.9.1 功能描述 — 增补段落

```
购物车 SKU 上限（与 App 一致）：
  - 单个购物车最多容纳 50 个不同 SKU（50 条有效行，每条唯一 skuId）；
  - 页头可选展示 SKU 计数「{cartSkuCount}/50 items」（与 Header 件数角标并存，角标仍为 quantity 合计）；
  - 达到 50 时：禁止将新 SKU 加入购物车；须删除已有商品后方可继续加购；
  - 对已在购物车中的 SKU，仅允许调整数量，不占用新名额；
  - 失效商品区行仍占用 SKU 名额，建议用户 Remove 释放名额（见页内提示）。
```

### §4.9.1 业务规则 — 新增

```
13. SKU 上限：cartSkuLimit = 50（可配置常量，默认 50）。cartSkuCount = status=valid 的购物车行数（每行唯一 skuId）。
14. 加购拦截：Add to Cart 提交前校验；若 cartSkuCount >= 50 且目标 skuId 不在当前购物车 → 拒绝请求，不更新角标，触发 BR848。
15. 接近上限：cartSkuCount >= 45 且 < 50 时，购物车页展示信息条 BR850（Almost full）。
16. 达到上限：cartSkuCount = 50 时，购物车页展示警告条 BR849（Cart full）；编辑模式顶部可复用同文案。
17. ~~登录合并~~（v1.1.3 已取消游客车，本条仅适用于历史 App 对齐说明；Web 不做游客合并）。
18. Buy Now 不写入购物车，不受 SKU 上限约束。
```

### §3.4 跨模块 — 增补行

| 场景 | 规则 |
|------|------|
| PDP Add to Cart | 选全 SKU 后提交；若购物车已满 50 SKU 且为新品 → BR848 拦截；已有 SKU 仅改量 |
| ~~登录合并购物车~~ | v1.1.3 取消游客车，不再合并 |

### §4.7 PDP 业务规则 — 增补（原规则 3 后插入）

```
3a. 购物车 SKU 上限：加购前校验 cartSkuCount；满 50 且为新 skuId 时不发起加购 API，走 BR848；同 SKU 加量不受限（仍受库存约束）。
```

### 功能清单 — 新增 FL

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|----------------|----------------|---------|
| FL086 | 购物车 SKU 上限 | Cart SKU Limit | 最多 50 SKU；超限拦截加购并引导删除 |
| FL087 | 购物车容量提示 | Cart Capacity Notice | 45+ 预警条、50 满额条、SKU 计数展示 |

### 字段定义 — 增补（§4.9.3）

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| cartSkuCount | 购物车 SKU 数 | Cart SKU Count | number | 是 | 有效行数，≤ cartSkuLimit |
| cartSkuLimit | SKU 上限 | Cart SKU Limit | number | 是 | 固定 50 |
| cartNearLimitThreshold | 接近上限阈值 | Near Limit Threshold | number | 是 | 默认 45，用于 BR850 |

### 交互说明 — 新增 BR（§4.9.4）

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR848 | 加购超限拦截 | Add to Cart；cartSkuCount≥50 且新 skuId | Toast（见英文文案表）；不调用加购成功逻辑；不触发 BR832 | 错误● | 同 SKU 加量仍成功 |
| BR849 | 购物车满额提示 | 进入 /cart；cartSkuCount=50 | 列表顶部警告条 + 可选 SKU 计数「50/50 items」；引导 Remove / Edit | — | 英文文案一致 |
| BR850 | 购物车接近上限 | 进入 /cart；45≤count<50 | 列表顶部信息条「{n}/50 items」 | — | n 实时准确 |
| BR851 | 合并截断提示 | 登录合并后 sku>50 | 列表刷新为 50 条；Toast 说明已移除超出部分 | — | 与 App 策略一致 |

### BR406 验收标准 — 增补

```
加购成功 → BR832；满 50 SKU 且新 skuId → BR848，不加购、无 Added successfully 气泡。
```

---

## 12.1 英文页面提示词（English Copy — 可直接给设计/ i18n）

> 默认展示语言为 **English**；孟加拉语（bn）下一期与全站 i18n 一并翻译。下列 key 供 CMS / 语言包引用。

| Key | 场景 | English Copy |
|-----|------|--------------|
| `cart.limit.toast_blocked` | PDP/全局：加购新 SKU 被拦截（BR848） | **Cart limit reached (50 items). Remove an item to add more.** |
| `cart.limit.banner_full` | 购物车页：已满 50（BR849） | **You've reached the cart limit (50 items). Remove items to add new products.** |
| `cart.limit.banner_almost` | 购物车页：45–49（BR850） | **Your cart is almost full ({count}/50 items).** |
| `cart.limit.counter` | 购物车页标题区/列表顶 | **{count}/50 items** |
| `cart.limit.modal_title` | 可选：连续加购失败时弹窗标题 | **Cart Full** |
| `cart.limit.modal_body` | 可选弹窗正文 | **Your cart holds up to 50 different items. Remove one or more items to add new products.** |
| `cart.limit.modal_primary` | 弹窗主按钮 → /cart?mode=edit | **Manage Cart** |
| `cart.limit.modal_secondary` | 弹窗次按钮 | **Continue Shopping** |
| `cart.limit.edit_hint` | 编辑模式顶部辅助文案 | **Remove items you no longer need to free up space.** |
| `cart.limit.merge_toast` | 登录合并截断（BR851） | **Some items were removed. Your cart holds up to 50 items.** |
| `cart.limit.invalid_hint` | 失效区有占用名额的行 | **Remove unavailable items to free up space in your cart.** |

**交互选用说明（建议默认方案）：**

| 优先级 | 场景 | 组件 | 文案 Key |
|--------|------|------|----------|
| P0 | 加购失败 | Toast 3s，不遮挡 PDP 主按钮 | `cart.limit.toast_blocked` |
| P0 | 购物车已满 | 列表顶 **warning banner**（可关闭，关闭后会话内不再显示） | `cart.limit.banner_full` |
| P1 | 45–49 件 | 列表顶 **info banner** | `cart.limit.banner_almost` |
| P1 | 满额后用户 2 次加购失败 | 居中 Modal（BR201）+ Manage Cart | `modal_*` 系列 |
| P0 | 编辑模式 | 同 banner 或 `edit_hint` | `cart.limit.edit_hint` |

---

## 13. 购物车 + 加购均须登录（v1.1.3 — 粘贴替换 §2.4、§3.4、§4.7、§4.9.1）

> **相对 v1.1.2 的变更：** v1.1.2 仅限制 `/cart` 页面；**v1.1.3 同时限制 Add to Cart**，并**取消游客购物车**（无 localStorage、无登录合并）。

### 规则摘要

| 维度 | v1.0 / v1.1.1 | v1.1.3 |
|------|---------------|--------|
| Add to Cart | 游客可加购 | **须登录（BR619 / BR852）**；未登录 → login?redirect=**当前页 URL** |
| 购物车页 `/cart` | 游客可进 | **仅登录可进**；未登录 → login?redirect=/cart |
| Header / Sticky 购物车 Icon | 直跳 `/cart` | 未登录 → login?redirect=/cart |
| 游客购物车 localStorage | 有 | **取消** |
| 登录合并游客车（原规则 9） | 有 | **取消** |
| Header 角标（未登录） | 可显示游客件数 | **0 或隐藏** |
| 登录回跳 Add to Cart | — | **保留已选 SKU**（同 Buy Now）；用户可再次点击加购或前端自动补提交 |

### §2.4 约束与原则 — 第 3、6 点（替换）

```
3. 登录后置：浏览、搜索无需登录；Add to Cart、购物车页（/cart）、结算与订单为硬门禁（BR619 / BR852）。
6. 购物车：须登录方可 Add to Cart 与进入 /cart；不做游客购物车（无 localStorage、无登录合并）；购物车数据仅存于登录账号。
```

### §3.4 跨模块衔接 — 替换/增补行

| 场景 | 规则 |
|------|------|
| **未登录 Add to Cart** | 跳转 `/login?redirect={encodeURIComponent(当前页完整 URL)}`（BR619）；登录回跳后**保留已选 SKU** |
| **未登录访问 /cart** | 跳转 `/login?redirect={encodeURIComponent(/cart 含 query)}`（BR852） |
| **Header / Sticky 点击购物车** | 已登录 → `/cart`；未登录 → login?redirect=/cart |
| 购物车「去结算」 | 用户在 /cart 时已登录；Checkout → `/checkout`；401 走 BR804 |
| PDP Add to Cart | **须登录**；未登录不调用加购 API、不更新角标、不触发 BR832 |
| 退出登录 | 清除会话；角标归零；跳转首页 `/` |

**删除：** 原「游客购物车合并（规则 9）」相关全部表述。

### §4.7 PDP 业务规则 — 替换原规则 3

```
3. 加购（Add to Cart）：须在 PDP 选全 SKU；**须登录**，未登录走 BR619（redirect=当前 PDP URL），回跳后保留 SKU 选择态；已登录时直接在 PDP 提交加购，不唤起 #17 Modal；成功 Header 角标 +1 并 BR832。未选全规格 Toast 指明缺失项。
```

### §4.7 BR406 — 粘贴替换

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR406 | 加购 | 点击 Add to Cart | 已登录：选全 SKU → 加购 → BR832；**未登录：BR619**，redirect=当前页，回跳保留 SKU | 未登录△ | 无游客加购 |

### §4.1 业务规则 — 替换购物车角标与 Icon 相关

```
2. 购物车角标：仅登录态展示账号购物车总件数；未登录为 0 或隐藏；加购成功（已登录）+1 并 BR832。
16. Header 购物车 Icon：已登录 → /cart；未登录 → login?redirect=/cart（BR852）。
```

### §4.9.1 功能描述 — 替换

```
购物车模块（#23–#25）与 Add to Cart 均须登录（v1.1.3）。
  - 未登录点击 Add to Cart → 登录页，redirect 为当前浏览页；
  - 未登录访问 /cart 或点击 Header/Sticky 购物车 → login?redirect=/cart；
  - 登录后购物车数据仅来自账号，不支持游客 localStorage 暂存。
```

### §4.9.1 业务规则 — 删除原规则 9，新增规则 19–20

```
（删除原规则 9「游客购物车合并」整段。）

19. 购物车门禁：/cart、/cart?mode=edit 须 isLoggedIn=true，否则 BR852。
20. 加购门禁：Add to Cart 须 isLoggedIn=true，否则 BR619（redirect=当前 URL）；不得写入游客本地购物车。
```

### §4.12 Sticky Cart（BR844）— 验收增补

```
未登录点击 Cart Icon → login?redirect=/cart；已登录 → /cart。
```

### BR619 适用范围 — 增补

```
BR619 硬门禁含：Add to Cart（全站）、/cart、/checkout、/checkout/result、账户/订单/地址等。
购物车门禁交互编号：BR852（/cart 路由与购物车 Icon；Add to Cart 未登录时 redirect=当前页，可与 BR619 合并描述）。
```

### 交互 BR852（v1.1.3 替换）

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR852 | 购物车门禁 | ① 未登录 Add to Cart；② 未登录访问 /cart；③ 未登录点击 Header/Sticky 购物车 | ① login?redirect=**当前页 URL**；②③ login?redirect=**/cart**；登录回跳后 Add to Cart 保留 SKU | 未登录● | 无游客加购；无游客 cart 页 |

### BR618（粘贴替换）

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR618 | 去结算 | 已登录用户在 /cart 点击 Checkout | `Checkout ({selectedQuantity})` → /checkout | — | 401 走 BR804 |

### §6.3 / OQ1 — 标注

```
游客购物车与登录合并（原 OQ1 / §4.9.1 规则 9）：v1.1.3 起 Web 不做游客购物车，该规则关闭。
```

### §7.1 验收 — 替换

```
[] 未登录点击 Add to Cart → login?redirect=当前页，不加购、不 BR832
[] 未登录访问 /cart 或点击 Header/Sticky 购物车 → login?redirect=/cart
[] 已登录 Add to Cart / 进入 /cart 正常；无 localStorage 游客车
[] 登录回跳 PDP 后已选 SKU 仍保留
```

### 文档变更记录行

| 2026/09/21 | v1.1.3 | — | Add to Cart 与 /cart 均须登录；取消游客购物车与登录合并 |

---

## 14. 技术评审四项修订（v1.2 — 粘贴替换对应章节）

### 变更总览

| # | 评审项 | 原 PRD（v1.1） | v1.2 |
|---|--------|---------------|------|
| 1 | View Order Details | `/account/orders/{orderId}` 未强调来源 | **跳转本单提交返回的 orderId**（刚完成的最新一笔订单） |
| 2 | 地址确认展示 | 两列：左姓名电话 / 右省市区+详细地址 | **三行**：上姓名电话 → 中详细地址（过长截断）→ 下省市区 |
| 3 | Categories 抽屉 | L1 点击跳转 L1 页（BR308） | **L1 不跳转**；L2 View All→L1 页；L2 项→L2 页 |
| 4 | 分类页 Filter | v1.1 删除分类页 Filter | **恢复**：L1 页 Filter 含 L2（选中跳转 L2 页）；L2 页 Filter 含 L3（选中本页 ?l3= 筛选） |

> **搜索页**仍不做 Filter / Featured（v1.1 §11 不变）。

---

### 1. View Order Details → 最新订单（§4.9.6 结果页 + §4.9.7 + BR628/BR853）

#### §4.9.6 提交与结果 — 结果页 CTA（替换）

```
结果页成功态：
  - 展示 orderId、实付金额；
  - View Order Details：跳转 `/account/orders/{orderId}`，其中 orderId **必须为本笔提交接口返回的订单 ID**（用户刚完成的最新一笔订单，非历史列表首条推断）；
  - View Order List：跳转 ordersListUrl。
```

#### §4.9.7 订单结果页字段 — orderDetailUrl 说明（增补）

```
orderDetailUrl = `/account/orders/{orderId}`，orderId 取自下单成功响应体，与结果页展示 orderId 一致。
```

#### BR853（新增）

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR853 | 查看订单详情 | 结果页点击 View Order Details | 跳转 `/account/orders/{orderId}`；orderId=**本单响应最新订单 ID** | — | 进入刚下单的详情页 |

#### BR628 — 验收标准增补

```
View Order Details 须满足 BR853；不得跳转至错误历史订单。
```

---

### 2. 地址确认布局三行 + 详细地址截断（§4.9.6 + BR620b + BR632）

#### 地址确认卡片布局（替换原两列 ToB 样式）

```
只读地址卡片（结算页 Shipping Address 已填态、Change Address 列表项、地址 Modal 预览态统一）：

  第 1 行（上）：Recipient Name + Phone Number（+880），同一行或两行紧凑排列；
  第 2 行（中）：Address 详细地址（addressLine）；
        - 单行展示，超出容器宽度时 **截断**（ellipsis / line-clamp，建议 1–2 行）；
        - Hover 或点击可展示完整地址（Tooltip / title，以实现为准）；
  第 3 行（下）：Division · District · Area（省/区/区域，点号或逗号分隔）。

Change Address 列表 Modal、Edit 保存后的展示均沿用上述三行结构（**不再使用左右两列**）。
```

#### BR620b（粘贴替换）

| 编号 | 需求名称 | 触发条件 | 交互行为 | 验收标准 |
|------|---------|---------|---------|---------|
| BR620b | 地址展示态 | Save / Change 选中地址 | 三行：姓名电话 / 详细地址（truncate）/ Division·District·Area | 长地址不撑破布局 |

#### BR632 — 验收增补

```
列表每项布局同 BR620b 三行；选中后绑定 addressId。
```

#### §4.9.6 已填态描述（替换）

```
已填态：只读地址确认卡片（三行布局，见 BR620b）；Change Address / Edit Address。
```

---

### 3. Categories 抽屉跳转规则（§4.6 + §3.4 + BR301/BR308/BR105）

#### §4.6.1 功能描述 — 抽屉段落（替换）

```
分类抽屉（Hover Categories 展开）三列：L1｜L2 + View All｜Recommend。

  - 第一列 L1：Hover/点击 **仅联动**第二列 L2 与第三列 Recommend，**不跳转路由**；
  - 第二列 L2：
      · 首项 **View All** → 跳转一级类目商品列表 `/category/{l1Id}`，面包屑 Home › {L1}；
      · 其余 **L2 类目项** → 跳转二级类目商品列表 `/category/{l2Id}`，面包屑 Home › {L1} › {L2}；
  - 第三列 Recommend：商品推荐，点击商品卡进 PDP（BR120）；**不在此列做一级类目跳转**。

次导航栏一级分类快捷入口（非抽屉）：仍点击跳转 `/category/{l1Id}`，与抽屉 L1 行为区分。
```

#### §3.4 — 替换原「分类一级收敛」相关行

| 场景 | 规则 |
|------|------|
| Categories 抽屉 L1 | **不跳转**，仅联动 L2/Recommend |
| 抽屉 L2 View All | → `/category/{l1Id}` |
| 抽屉 L2 类目项 | → `/category/{l2Id}` |
| 次导航 L1 快捷入口 | → `/category/{l1Id}`（不变） |

（**删除**「抽屉 L1 点击 / L2 View All / 次导航 L1 均收敛至 L1 页」的统一表述。）

#### BR301 / BR308（粘贴替换）

| 编号 | 需求名称 | 触发条件 | 交互行为 | 验收标准 |
|------|---------|---------|---------|---------|
| BR301 | 分类抽屉 | Hover Categories | 三列；L1 联动不跳转；L2 列表随 L1 切换 | 可滚动 |
| BR308 | 抽屉内跳转 | 点击 L2 View All | → `/category/{l1Id}`；抽屉收起 | 面包屑正确 |
| BR308a | 抽屉 L2 跳转 | 点击 L2 类目项（非 View All） | → `/category/{l2Id}`；抽屉收起 | 面包屑 Home›L1›L2 |

#### BR105 — 差异说明（Header 次导航）

```
BR105 次导航 L1 快捷入口仍进 /category/{l1Id}；与抽屉 L1「不跳转」并存，验收分别覆盖。
```

---

### 4. 分类页 Categories Filter（§1.2、§2.4、§4.6 — 恢复并细化）

#### §1.2 分类行（替换 v1.1「不含 L3 Filter」）

| 模块 | 页面/组件 | 本期范围说明 |
|------|----------|-------------|
| 分类 | 一级/二级分类、分类商品列表、**Categories Filter** | P0；L1 页 Filter=L2（跳转）；L2 页 Filter=L3（本页筛选） |

#### §2.4 第 5 点 — 增补（替换 v1.1 整段删除分类 Filter 的表述）

```
5. 分期与筛选：
  本期做：搜索排序；**分类页 Categories Filter**（L1 页→L2 跳转；L2 页→L3 本页筛选）；店铺 Items Tab 排序。
  本期不做：搜索结果页 Featured Tab、**搜索结果页**类目 Filter、价格/颜色/尺码/品牌等多维 Filter；优惠券见 §6.1。
```

#### §4.6 分类落地页结构（替换 v1.1「Banner + 列表无 Filter」）

```
一级类目页 /category/{l1Id}：
  Banner + Categories Filter（展示该 L1 下全部 **L2**）+ Sort By + 商品列表（默认 L1 下商品或 L1 聚合规则与 App 一致）；
  选中某一 L2 Filter 项 → **路由跳转** `/category/{l2Id}`（非本页 filter 参数）。

二级类目页 /category/{l2Id}：
  Banner + Categories Filter（展示该 L2 下全部 **L3**）+ Sort By + 商品列表；
  选中某一 L3 Filter 项 → **本页筛选**，URL 写入 `?l3={l3Id}` 并刷新列表（展示该 L3 下所有商品）；
  Clear / 取消选中 → 移除 `l3`，展示 L2 下全部商品。

L3 不作为独立路由页（无 /category/{l3Id} 落地页）。
```

#### 业务规则 — 增补

```
① 分类页 Filter 仅 Categories 一组，不含价格/属性；
② L1 页 Filter 选项 = L2 子节点，点击=跳转；
③ L2 页 Filter 选项 = L3 子节点，点击=本页 ?l3= 筛选；
④ Filter 选中态与 URL 同步（L2 页 l3 参数）；
⑤ 与搜索页 Filter（BR828，本期不做）数据场景独立。
```

#### FL141 / FL142c（恢复）

| 编号 | 功能名称 | 描述 |
|------|---------|------|
| FL141 | 二级页 L3 Filter | L2 页 Categories 展示 L3，?l3= 本页筛选 |
| FL142c | 一级页 L2 Filter | L1 页 Categories 展示 L2，选中跳转 L2 页 |

#### BR836（粘贴替换 — 恢复 v1.1 删除项）

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR836 | 分类页 Categories Filter | L1 或 L2 落地页 | L1 页：选 L2 → `/category/{l2Id}`；L2 页：选 L3 → `?l3=` 刷新列表 | 加载● | 与 BR828 搜索 Filter 独立 |

#### §7.1 验收 — 替换 v1.1 分类 Filter 删除项

```
删除：[] 分类落地页均不展示 Filter
新增：
  [] L1 页 Categories Filter 含 L2，选 L2 跳转 L2 页
  [] L2 页 Categories Filter 含 L3，选 L3 本页 ?l3= 筛选
  [] 搜索页仍无 Filter / Featured
```

#### §6.1 本期不做 — 修正

```
删除或改写「分类页 Filter」条目；保留「搜索结果页 Filter & Featured」为不做。
```

---

## 附录索引增补

- **FL140–FL141**：§4.12 右侧 Sticky / 回顶部  
- **FL141/FL142c**：分类页 Categories Filter（v1.2 恢复）  
- **FL086–FL087**：购物车 SKU 上限 / 容量提示  
- **BR840–BR846**：Sticky 交互  
- **BR847**：Feature Tag 跳转专题  
- **BR848–851**：购物车 SKU 上限  
- **BR852**：购物车门禁（Add to Cart + /cart + Icon，v1.1.3）  
- **BR853**：View Order Details → 本单最新 orderId（v1.2）  
- **BR308a**：抽屉 L2 类目跳转（v1.2）  
- **BR836**：分类页 Categories Filter（v1.2 恢复）  
- **BR854–BR855**：规格未选全加购 Toast；Sticky /cart 隐藏 Cart（v1.2.1）
- **删除/下期**：BR828、BR837（**搜索** Filter/Featured）；BR625–626（优惠券 P1）

---

## 15. 未选全 SKU 加购 + Sticky 购物车页隐藏 Cart（v1.2.1）

### 1）未选全 SKU 点击 Add to Cart（§4.7 + BR406/BR854）

**§4.7 业务规则 — 加购段（替换/增补）：**

```
3. 加购（Add to Cart）：
  a. 须先在 PDP 购买区选全必填 SKU 规格；
  b. 若 SKU 未选全即点击 Add to Cart → 点击视为无效：不调用加购 API、不跳转登录、不触发 BR832、不更新角标；
  c. 同时 Toast（BR801）：「Please select product spec」（固定英文文案，支持 i18n key：`pdp.toast.select_spec`）；
  d. SKU 选全后：须登录（未登录→BR619）；已登录→直接加购→BR832；不唤起 #17 Modal。
```

**校验顺序：** SKU 完整性 → 登录态 → 50 SKU 上限（BR848）→ 加购 API

**BR854（新增）：**

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR854 | 规格未选全加购 | 点击 Add to Cart 且必填 SKU 未选全 | Toast「Please select product spec」；无 API、无 BR832 | 错误● | 可重复点击；选全后可正常加购 |

**BR406（v1.2.1 替换）：**

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR406 | 加购 | 点击 Add to Cart | 未选全→BR854；已选全未登录→BR619；已选全已登录→加购→BR832 | 未登录△ 错误● | 不唤起 #17 |

**§3.4 增补行：**

| 场景 | 规则 |
|------|------|
| PDP Add to Cart SKU 未选全 | Toast「Please select product spec」；点击无效（BR854） |

---

### 2）Sticky 快捷导航 — 购物车页隐藏 Cart（§4.12 + BR855）

**§4.12.1 功能描述 — 块 A 增补：**

```
块 A 入口按路由动态展示：
  - 默认：Home / 客服 / Cart 三 Icon；
  - 当前路由为 /cart 或 /cart?mode=edit 时：隐藏 Cart Icon，仅展示 Home + 客服（BR855）；
  - Header 购物车 Icon 不受影响（购物车页仍可通过 Header 进入，或用户已在 cart 页无需重复入口）。
回顶部块 B 规则不变。
```

**§4.12 业务规则 — 新增：**

```
11. Cart 入口显隐：navItemKey=cart 在 pathname 匹配 ^/cart 时不渲染；离开 /cart 后恢复展示。
12. 隐藏 Cart 时块 A 纵向间距按 UI 稿重排，仅 2 个 Icon，不保留 Cart 占位空白。
```

**字段 quickNavItems[] — navItemVisible 补充：**

```
navItemKey=cart：navItemVisible = pathname 不以 /cart 开头（含 query）。
```

**BR855（新增）：**

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR855 | Sticky 隐藏 Cart | 进入 /cart（含 edit 模式） | 块 A 不展示 Cart；Home/客服/回顶仍可用 | — | 离开 /cart 恢复 Cart |

**BR844 验收增补：**

```
Sticky Cart 仅在非 /cart 路由展示；/cart 页走 BR855 隐藏。
```

**§7.1 验收 — 新增：**

```
[] 未选全 SKU 点 Add to Cart → Toast「Please select product spec」，无加购
[] /cart 页 Sticky 无 Cart Icon；其他页 Sticky 仍有 Cart
```

### 文档变更记录行

| 2026/09/21 | v1.2.1 | — | 未选全 SKU 加购 Toast；Sticky 在购物车页隐藏 Cart 入口 |
