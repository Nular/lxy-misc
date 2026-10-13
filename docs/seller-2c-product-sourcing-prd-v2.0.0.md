# Seller 后台 2C — Product Sourcing（选品中心）PRD

> **文档版本**：**v2.0.0**  
> **上一版（线上）**：**v1.0.1**（能力归档见 `seller-2c-product-sourcing-prd-v1.0-final.md`）  
> **范围**：用户 **下单全流程** 相对 v1.0.1 的新增与变更；PO List/Detail 搜索、导出、Buy Again 等 **不在本文**。

---

## 一、文档基础信息

| 时间 | 版本号 | 变更人 | 主要变更内容 |
|------|--------|--------|--------------|
| 2026/09/07 | v1.0 | — | 选品中心 MVP 定稿（归档 `seller-2c-product-sourcing-prd-v1.0-final.md`） |
| — | v1.0.1 | — | 定稿后线上修订；能力边界同 v1.0（无购物车、Buy Now 单笔闭环） |
| 2026/09/28 | **v2.0.0** | — | 购物车与合并下单；Cart/Checkout 可改量；划线价与 **-X%** Tag；Detail/Success 推荐；交易步骤条与面包屑分层 |
| 2026/10/13 | **v2.0.0** | — | Order Summary 增加 Subtotal / Promotion / Shipping Fee（无运费，展示 **Free**）；去掉邮件通知；Buy Now 直达 Checkout，不做数量弹层 |

### 1.1 术语说明

| 术语 | 说明 |
|------|------|
| **BR** | Behavior Requirement，交互与体验行为需求编号；**本文档从 BR101 起连续编号** |
| **同 BRxxx** | 交互效果与 BRxxx 完全一致，本文档不再重复描述；若存在差异，仅在「差异说明」列补充 |
| **FL** | Feature List，功能点编号（What）——模块提供什么能力 |
| **PDP** | Product Detail Page，商品详情页（本文 **Product Detail**） |
| **PO** | Purchase Order，采购订单（**Purchase Orders List / Detail**） |
| **v1.0.1 基线** | 线上已发布能力；未在本文重写的条目 **沿用** v1.0.1 / v1.0-final |
| **他人负责模块** | PO 搜索/导出/CSV、Buy Again、Orders List、登录注册内部 UX——本文仅定义 **衔接规则** |

### 1.2 本文档范围

| 模块 | 页面/组件 | 本期范围说明 |
|------|-----------|--------------|
| 全局 | 顶栏 **Cart** 入口 + 角标 | **P0**（v2.0.0 新增） |
| 选品 | Product Discovery | **P0**；v1.0.1 + **划线价/-X% Tag**；**无** 列表推荐 |
| 商品 | Product Detail（内嵌 SKU）、Buy Now 直达 Checkout | **P0**；+ **Add to Cart**、推荐区；**不做** Buy Now 数量弹层 |
| 交易 | **购物车**、**交易步骤条**、Checkout、Order Success | **P0**；Cart / Checkout 的 Order Summary 含 Subtotal、Promotion、Shipping Fee |
| 横切 | 采购价/折扣展示、推荐组件 | **P0**；**不做** 邮件通知 |
| 采购订单 | Purchase Orders List / Detail | **不在本文**（维持 v1.0.1；一单多 SKU **数据兼容**） |

---

## 二、产品背景介绍

### 2.1 业务背景

KickBazar **2B 货源 + 2C 零售**：2C 商家在 **Seller Web** 通过 **Product Sourcing（选品中心）** 向固定 2B 货源采购 SKU，银行/数字转账付款后铺货。v1.0.1 已支持 **Buy Now → Checkout → 采购单** 单笔闭环；v2.0.0 在 **同一后台模块** 内补齐 **购物车、合并结算与营销展示**，与 App 选品能力方向对齐，但 **交互形态为 B 端后台**（非 ToC 商城站）。**本期不做邮件通知。**

### 2.2 市场与用户

| 维度 | 要点 |
|------|------|
| 目标用户 | 孟加拉本地 **2C 店主 / 采购员**（Seller Web 已登录商家） |
| 语言 | 界面 **English**（与 v1.0.1 一致） |
| 货币 | **BDT（৳）** |
| 支付 | 线下联络客服；Checkout 选 Bank Transfer / Digital Transfer；**不展示 2B 收款账户** |
| 地址 | Checkout **固定达卡 2B 仓库地址**（不可编辑）；**无 Shipping Method** |

| Persona | 特征 | 核心诉求 |
|---------|------|----------|
| P1 小店主 | 偶发补货、SKU 不多 | 快速 Buy Now |
| P2 多 SKU 采购 | 一次选多款 | **购物车合并一单** |
| P3 价格敏感 | 关注折扣 | **划线价 + -X%** 感知优惠 |
| P4 复购选品 | 常回选品中心 | Detail/Success **推荐** 导流 |

### 2.3 问题与目标

| 问题 | 目标 |
|------|------|
| v1.0.1 仅 Buy Now，无法凑单 | **Cart + 一单多 SKU** |
| 无折扣视觉 | **originalPrice + salePrice + -X% Tag** |
| 转化路径单一 | **Add to Cart** 与 **Buy Now** 双路径（Buy Now **不弹层**） |
| 金额构成不完整 | Cart 与 Checkout 的 Order Summary 展示 **Subtotal、Promotion、Shipping Fee（Free）** |
| 交易进度不清晰 | **交易步骤条**（Cart 路径 3 步 / Buy Now 2 步） |

### 2.4 约束与原则

1. **不扩张 v1.0.1 已排除项**：多 2B 混合、凭证上传、Success 展示 2B 账户、Shipping Method、PO 页大改。  
2. **业务真源**：价格、MOQ、超卖规则与 v1.0.1 / 商品中台一致；Checkout 提交 **价格快照** 校验。  
3. **登录门禁**：沿用 Seller Web 已登录会话；未登录按现有 Seller 鉴权（本文不展开登录页 UX）。  
4. **Buy Now 与 Cart 隔离**：Buy Now **不自动合并** Cart 内其他 SKU（防误下单）。  
5. **推荐范围**：仅 **Product Detail、Order Success**；**Discovery 不做推荐区块**。  
6. **导航分层**：浏览区用 **面包屑**；交易区用 **步骤条** + 短面包屑（§3.4）。

---

## 三、产品概述

### 3.1 产品定位

Seller Web **Product Sourcing** 是 2C 商家的 **B2B 选品与采购下单** 模块：在 v1.0.1「选品浏览 + 立即购买」上，增加 **购物车、合并采购单、折扣展示与推荐**，形态仍为 **后台 IA**（侧栏 Discovery / PO List），非独立 ToC 商城。

### 3.2 产品目标

| 目标类型 | 说明 |
|----------|------|
| 功能目标 | v2.0.0 四条主链路（Discovery / Detail / Checkout / Success）增量 **100% 可开发、可验收** |
| 体验目标 | Cart 与 Checkout **均可改量**；步骤条清晰区分 Cart 与 Buy Now 路径 |
| 业务目标 | 一次 **Order & Pay** → **一个 PO、多 SKU 行**；Pending Payment 后线下付款流程 **不变** |

### 3.3 核心用户旅程

**旅程 1：购物车合并下单**  
Discovery → Detail → **Add to Cart**（可多款）→ **Cart** → Checkout → Order & Pay → Order Success → PO Detail / Continue Sourcing  

**旅程 2：立即购买（单行）**  
Discovery → Detail → **Buy Now**（不弹层，数量默认 1）→ **Checkout**（仅当前 SKU，可改量）→ Order & Pay → Order Success  

**旅程 3：v1.0.1 延续（采购后）**  
Order Success / PO List → 联系客服付款 → 2B 确认收款 → Publish to Store（**规则同 v1.0.1**）

### 3.4 跨模块衔接规范

| 场景 | 规则 |
|------|------|
| Add to Cart 成功 | Toast「Added to cart」；顶栏角标更新（**BR106**） |
| Buy Now | 点击即写入结算快照 `checkoutEntrySource=buy_now`、**quantity 默认 1**；跳转 Checkout；**不打开数量弹层**；**不经过 Cart**（**BR132 / BR142**） |
| Cart → Checkout | `checkoutEntrySource=cart`；携带已勾选且有效的行 |
| Checkout 改量（cart 来源） | 重算 Subtotal / Promotion / Grand Total；Shipping Fee 保持 **Free**；**回写同步 Cart**（**BR136**） |
| Order & Pay 成功 | 创建 **一个** PO、多 `items[]`；跳转 Success；**不发邮件**（**BR138**） |
| View Order Detail | 跳转 PO Detail（**v1.0.1 路由**，本文不改 PO UI） |
| 未在本文描述的能力 | **同 v1.0.1**（Remark、Security Reminder、Cancel 仅 Pending Payment 等） |

### 3.5 信息架构（本文档范围）

| 中文 | English | 路由草案 |
|------|---------|----------|
| 选品中心 | Product Sourcing | 模块根 |
| 选品浏览 | Product Discovery | `/seller/2c/sourcing` |
| 商品详情 | Product Detail | `/seller/2c/sourcing/product/{spuId}` |
| 购物车 | Cart | `/seller/2c/sourcing/cart` |
| 结算 | Checkout | `/seller/2c/sourcing/checkout` |
| 下单成功 | Order Success | `/seller/2c/sourcing/checkout/result?orderId=` |
| 采购订单列表 | Purchase Orders List | v1.0.1（本文不改） |

侧栏：**Product Discovery**、**Purchase Orders List** 维持 v1.0.1；**Cart 不进侧栏**，仅顶栏入口。

---

## 四、功能需求明细

### 章节说明

本章按模块组织需求，结构对齐 KickBazar Web PRD 写法：

| 名称 | 说明 |
|------|------|
| **基本信息** | 页面编号、路由、类型、优先级 |
| **功能描述** | 模块定位、用户场景、页面结构（叙述） |
| **功能清单** | **FL** 编号、中英文名称、功能描述 |
| **业务规则** | 计算逻辑、权限、边界、与 v1.0.1 对齐 |
| **字段定义** | 关键数据字段 |
| **交互说明** | **BR** 编号、触发、行为、状态、验收标准 |

**编号体系**

- **FL**：功能点（What）  
- **BR**：交互点（How）；**本文 BR101 起连续编号**  
- **同 BRxxx**：与基准 BR 一致处引用 v1.0.1 或本文他处，不重复展开  

**v1.0.1 基准交互（本文引用、不重复全文）**

| 基准 | 适用范围 |
|------|----------|
| v1.0.1 Checkout | 固定地址、Remark Modal、Payment 切换、Security 四模块、Order & Pay |
| v1.0.1 Success | 话术、Contact、Copy、View Order Detail、Continue Sourcing |
| v1.0.1 Discovery | Tab、搜索、分页、SPU 卡片 |

---

### 4.1 模块 G0：全局 — 购物车入口

#### 基本信息

| 属性 | 内容 |
|------|------|
| 页面编号 | G0 |
| 路由 | 全站 Product Sourcing 顶栏 |
| 类型 | 全局组件 |
| 优先级 | P0 |

#### 4.1.1 功能描述

顶栏右侧为两个 **Icon**（无文字按钮）：

1. **Home**：小房子，点击回 **Product Discovery**（`/seller/2c/sourcing`）。  
2. **Cart**：购物车图标 + 数字角标，点击进购物车页。不做下拉预览。

Add to Cart 成功：角标按 **quantity 合计** 增加，并 Toast / 气泡 **Added to cart successfully**。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|------------------|------------------|----------|
| FL201 | 顶栏购物车图标 | Cart Icon | Icon 跳转 Cart |
| FL202 | 购物车角标 | Cart Badge | **quantity 总件数**（含失效行件数） |
| FL203 | 加购反馈 | Added Bubble | Added to cart successfully |
| FL204 | 回首页图标 | Home Icon | 回 Product Discovery |

#### 业务规则

1. 角标 = 购物车各行 `quantity` 之和（与 Checkout 按钮的勾选件数口径不同，见 §4.6）。  
2. 角标为 0 可展示 0 或隐藏，全站一致。  
3. Home 始终回 Discovery，不回浏览器历史。  
4. 数据范围：当前 2C 店铺、单一 2B 货源。

#### 字段定义

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|----------|----------|------|------|----------|
| cartBadgeCount | 角标数量 | Cart Badge Count | number | 是 | 与购物车有效行统计一致 |
| cartUrl | 购物车地址 | Cart URL | string | 是 | 默认 `/seller/2c/sourcing/cart` |

#### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|----------|----------|----------|------|----------|
| BR101 | 进入购物车 | 点击 Cart | 跳转 Cart 页 | — | 路由正确 |
| BR106 | 角标更新 | Add to Cart 成功 | 角标 +对应数量 | 加载● | 无需刷新页 |

---

### 4.2 模块 A：选品浏览（Product Discovery）

#### 基本信息

| 属性 | 内容 |
|------|------|
| 页面编号 | A |
| 路由 | `/seller/2c/sourcing` |
| 类型 | 页面 |
| 优先级 | P0 |

#### 4.2.1 功能描述

v1.0.1 商品发现列表；v2.0.0 在 SPU 卡片价格区增加 **划线原价 + 折扣 Tag（-X%）**。列表 **不提供** 推荐横条。

**沿用 v1.0.1**：All / Published / Unpublished Tab、搜索、每页 20 条、点击进详情等。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|------------------|------------------|----------|
| FL210 | 列表折扣展示 | List Discount Display | 卡片展示 salePrice、划线 originalPrice、-X% Tag |
| FL211 | 列表进详情 | Open PDP | 点击卡片打开 Product Detail |

#### 业务规则

1. 仅当 `originalPrice` > `salePrice` 时展示划线价与 Tag（**BR120**）。  
2. `percent = round((1 - salePrice / originalPrice) × 100)`，建议 1%～99%。  
3. **禁止** 在 Discovery 嵌入 You May Also Like（**BR121**）。

#### 字段定义

| 字段名 | 中文名称 | 类型 | 必填 | 字段说明 |
|--------|----------|------|------|----------|
| salePrice | 现价 | number | 是 | 采购价 BDT |
| originalPrice | 原价 | number | 否 | 无则无折扣 UI |
| discountTag | 折扣 Tag | string | 否 | 如 `-20%` |

> 列表其余字段同 v1.0.1 SPU 卡片。

#### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|----------|----------|----------|------|----------|
| BR120 | 折扣展示 | 卡片渲染 | 满足规则则划线 + Tag | — | 无原价无 Tag |
| BR121 | 无列表推荐 | Discovery 加载 | 不渲染推荐区块 | — | 与 Detail 区分 |
| BR122 | 进详情 | 点击卡片 | 打开 PDP（策略同 v1.0.1） | — | — |

---

### 4.3 模块 B：商品详情（Product Detail / PDP）

#### 基本信息

| 属性 | 内容 |
|------|------|
| 页面编号 | B |
| 路由 | `/seller/2c/sourcing/product/{spuId}` |
| 优先级 | P0 |

#### 4.3.1 功能描述

v1.0.1 橱窗、SKU 选择、MOQ、超卖；v2.0.0 增加底栏 **Add to Cart** 与 **Buy Now**、价格折扣展示、底侧推荐。**Buy Now 不打开数量弹层**，点击后直接进入 Checkout，数量默认 1，改量在 Checkout。规格在 **PDP 内嵌**。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|------------------|------------------|----------|
| FL220 | 详情折扣价 | PDP Pricing | 现价/原价/-X% Tag |
| FL221 | 加入购物车 | Add to Cart | 当前 SKU 入车 |
| FL222 | 立即购买 | Buy Now | 点击直达 Checkout；不弹层；数量默认 1 |
| FL223 | 底侧推荐 | PDP Recommendations | You May Also Like |

#### 业务规则

1. **Add to Cart**：同一 `skuId` **累加 quantity**；默认本次 +1（改量主要在 Cart/Checkout）。  
2. **Buy Now**：结算快照 **仅当前 SKU 一行**；**不读取** Cart 其他行（**BR142**）。  
3. SKU 未选全：Add to Cart / Buy Now **不可提交**（Toast 或禁用，同 v1.0.1 策略）。  
4. 超卖：库存不足仍可下单（v1.0.1）。  
5. 推荐规则：同店热销 / 同类目 / 本店最近采购（有数据时）；条数 3～8（UI 定）。

#### 字段定义

| 字段名 | 中文名称 | 类型 | 必填 | 字段说明 |
|--------|----------|------|------|----------|
| selectedSkuId | 已选 SKU | string | 否 | 未选全时为空 |
| quantity | 数量 | number | 是 | Add to Cart 与 Buy Now 均默认 1；改量在 Cart / Checkout |
| recommendProducts[] | 推荐列表 | array | 否 | 见 §4.4 |

#### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|----------|----------|----------|------|----------|
| BR130 | Add to Cart | 点击且 SKU 选全 | Toast；角标 BR106；停留 PDP | — | 不跳转 |
| BR131 | Buy Now | 点击且 SKU 选全 | 不打开弹层，离开 PDP | — | 直接进入 Checkout |
| BR132 | Buy Now 快照 | 点击 Buy Now | `buy_now` 单行、qty=1 → Checkout | — | 不读 Cart；Checkout 可改量 |
| BR133 | 规格未选全 | 未选全点加购/购买 | Toast；不调 API | — | 同 v1.0.1 |
| BR134 | 推荐跳转 | 点击推荐卡 | 新页签打开 PDP | — | — |

---

### 4.4 模块 C：商品推荐组件（嵌入）

#### 基本信息

| 属性 | 内容 |
|------|------|
| 页面编号 | C |
| 类型 | 可复用组件 |
| 宿主 | **Product Detail**、**Order Success** |
| 优先级 | P0 |

#### 4.4.1 功能描述

横滑或网格展示推荐；**标题与字段统一为 Recommended**。无数据可隐藏整块。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|------------------|------------------|----------|
| FL230 | 推荐嵌入 | Recommendation Embed | scene=detail \| success |
| FL231 | 推荐跳转 | Recommendation Nav | 点击进 PDP |

#### 业务规则

1. **禁止** 在 Discovery 使用（**BR121**）。  
2. 卡片字段：图、标题、采购价（可有 FL210 折扣样式）。  
3. 标题固定 **Recommended**。排序：**乱序**（每次请求/刷新随机打散，非平台序）。

#### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|----------|----------|----------|------|----------|
| BR140 | 推荐展示 | 宿主页加载 | 有数据则展示 | 空○ | 无数据可隐藏 |
| BR141 | 推荐点击 | 点击卡片 | 新页签 PDP | — | — |

---

### 4.5 模块 D：交易 — 进度条（Checkout Steps）

#### 基本信息

| 属性 | 内容 |
|------|------|
| 页面编号 | D0 |
| 展示页 | Cart（非空）、Checkout、Order Success |
| 优先级 | P0 |

#### 4.5.1 功能描述

交易区展示统一样式 **步骤条**；**Cart 路径 3 步**，**Buy Now 路径 2 步**（不展示 Cart 步）。Discovery/Detail **不展示** 本步骤条。Checkout 页内「1. Address / 2. Product / 3. Payment」为 **页内模块编号**，与全局步骤条并存。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|------------------|------------------|----------|
| FL240 | 交易步骤条 | Checkout Progress Stepper | 按来源展示 2 步或 3 步 |
| FL241 | 步骤状态 | Step State | completed / active / upcoming |
| FL242 | 面包屑分层 | Breadcrumb Policy | 交易区短面包屑，见业务规则 |

#### 业务规则

文案：**Cart / Checkout / Order Complete**（Buy Now 无 Cart 步）。

**路径 A（`checkoutEntrySource=cart`）** — 3 步  

- Cart 页：Step 1 active；Step 2/3 **不可点**；仅 **Checkout (n)** 进入结算。  
- Checkout 页：Step 1 completed **可点回 Cart**（保留勾选）；Step 2 active。  
- 成功结果：Step 1/2 **不可点**；Step 3 completed。

**路径 B（`checkoutEntrySource=buy_now`）** — 2 步：Checkout → Order Complete。不展示 Cart，不可经步骤条进购物车。

1. Cart **空态不展示** 步骤条。  
2. 步骤条在 Header 下方、页标题上方。  
3. Checkout **页面布局仍为 v1.0.1**（固定达卡地址、Bank/Digital、Security）。Order Summary 展示 **Subtotal、Promotion、Shipping Fee、Grand Total**。Shipping Fee **无运费计价，展示 Free**。**不引入** ToC 地址弹层、运费档位、COD、优惠券。  
4. PO 时间线不复用本步骤条。

#### 字段定义

| 字段名 | 中文名称 | 类型 | 说明 |
|--------|----------|------|------|
| checkoutEntrySource | 结算来源 | enum | `cart` \| `buy_now` |
| checkoutStep | 当前步骤 | enum | cart / checkout / order_success |

#### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 验收标准 |
|------|----------|----------|----------|----------|
| BR150 | 三步条 | cart 路径 | Cart→Checkout→Order Complete | Cart 页后两步不可点 |
| BR151 | 两步条 | buy_now | Checkout→Order Complete | 无 Cart 步 |
| BR152 | 空车隐藏 | Cart 空 | 不展示步骤条 | — |
| BR153 | 回 Cart | Checkout 点已完成 Cart 步 | 回购物车，勾选保留 | — |
| BR154 | 成功锁定 | Result 成功 | 已完成步不可点 | — |

---

### 4.6 模块 E：购物车（Cart）

#### 基本信息

| 属性 | 内容 |
|------|------|
| 页面编号 | E |
| 路由 | `/seller/2c/sourcing/cart` |
| 优先级 | P0 |

#### 4.6.1 功能描述

对齐 ToC 购物车信息架构，**适配 Seller 选品**（无优惠券、无 COD、无运费档位）：

- **有效商品**列表：勾选、图、标题、规格、专题 Tag、价、数量、行小计、Remove。  
- **失效商品**分区：置底灰色，**不可勾选**，可 Remove；原因如下架/缺货。  
- **编辑模式**：批量勾选删除，二次确认；删空回空态。  
- **Order Summary**：**Subtotal**（勾选行原价小计）+ **Promotion**（现价小计 − 原价小计，为负或 0）+ **Shipping Fee**。购物车 **没有运费**，Shipping Fee **固定展示 Free**（金额 0）。**Grand Total** = Subtotal + Promotion + Shipping Fee。不含 COD / Coupon。  
- 主按钮：**Checkout ({selectedQuantity})**。`selectedQuantity` = 已勾选且 `status=valid` 的 quantity 之和。未勾选任何有效行则禁用。  
- SKU 上限 **99** 条不同 SKU（含失效行占名额）。Header 角标仍为 quantity 合计。接近 **90–98** 信息条；满 **99** 警告条并拦截新 SKU。  
- **Buy Now 不写入购物车**。  
- 非空展示步骤条 Step 1。空态不展示步骤条。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|------------------|------------------|----------|
| FL250 | 有效商品列表 | Valid Lines | 可勾选、改量 |
| FL251 | 失效商品 | Invalid Lines | 置灰、不可结算 |
| FL252 | 编辑模式 | Edit Mode | 批量删除 + 确认 |
| FL253 | 金额汇总 | Order Summary | Subtotal / Promotion / Shipping Fee（Free）/ Grand Total |
| FL254 | 去结算 | Checkout (n) | 仅勾选有效行 |
| FL255 | SKU 上限 | Cart SKU Limit | 99 SKU |

#### 业务规则

1. 至少勾选 1 件有效商品才可 Checkout。全选只作用于有效行。  
2. 改量实时重算行小计与 Order Summary。Shipping Fee 始终为 Free，不随勾选变化。  
3. 新 SKU 且已有 99 行：拒绝加购，Toast `Cart limit reached (99 items). Remove an item to add more.`  
4. 已在车中的 SKU 只加数量，不占新名额。  
5. **本期无优惠券。** Checkout 页样式不因购物车改版而改为 ToC 结算（见 §4.7）。

#### 字段定义

| 字段名 | 说明 |
|--------|------|
| selected | 是否参与结算；失效行恒为 false |
| status | valid / invalid |
| invalidReason | 下架 / 缺货等 |
| topicTag | 可选专题 Tag |
| unitPrice / originalPrice | 现价 / 原价 |
| subtotal | 勾选行原价合计 |
| promotion | 现价合计 − 原价合计 |
| shippingFee | 固定 0；界面文案 **Free**（购物车无运费） |
| grandTotal | subtotal + promotion + shippingFee |

#### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 验收标准 |
|------|----------|----------|----------|----------|
| BR160 | 勾选汇总 | 勾选/改量 | Subtotal、Promotion、Grand Total 与 Checkout(n) 更新 | Shipping Fee 恒为 Free |
| BR161 | 失效行 | status=invalid | 灰色、不可勾选、可删 | 置底 |
| BR162 | 编辑删除 | Edit → 批量删 | 二次确认 | 删空即空态 |
| BR163 | 去结算 | Checkout (n) | 仅 selected+valid 进入 Checkout | 步骤 2/3 不可点 |

---

### 4.7 模块 F：结算（Checkout）

#### 基本信息

| 属性 | 内容 |
|------|------|
| 页面编号 | F |
| 路由 | `/seller/2c/sourcing/checkout` |
| 优先级 | P0 |

#### 4.7.1 功能描述

v1.0.1 三模块：**Shipping Address（固定）**、**Product Information + Remark**、**Payment Method**；右侧 **Order Summary** + **Security Reminder** + **Order & Pay**。

v2.0.0：**Product Information 多 SKU 行**，每行 **Qty 可编辑**。Order Summary 与购物车同结构：**Subtotal、Promotion、Shipping Fee、Grand Total**。Shipping Fee **展示 Free**（本期无运费）。Grand Total = Subtotal + Promotion + 0。提交创建 **一个 PO、多 items**。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|------------------|------------------|----------|
| FL260 | 多行商品 | Multi-line Items | 每 SKU 一行 |
| FL261 | Checkout 改量 | Checkout Qty Edit | 行级步进器 |
| FL262 | 合并下单 | Merge PO Submit | 一单多 SKU |
| FL263 | 结算来源 | Checkout Source | cart / buy_now 快照 |
| FL264 | 结算汇总 | Checkout Order Summary | Subtotal / Promotion / Shipping Fee（Free）/ Grand Total |

#### 业务规则

1. `cart`：items = **已勾选且 valid** 的行；`buy_now`：**单行、进入时 quantity = 1**（**BR142**）。页面模块与 v1.0.1 一致，**不改**为 ToC 地址/运费档位/COD/券。  
2. Checkout 改量同步 Cart（仅 cart 来源）（**BR136**）。Buy Now 来源只改结算行，不写回购物车。  
3. **无 Shipping Method**。Shipping Fee 金额 = 0，文案 **Free**。Subtotal = 各行原价 × 数量；Promotion = 现价小计 − 原价小计；Grand Total = Subtotal + Promotion + Shipping Fee。  
4. 固定地址、Payment、Security、Remark：**同 v1.0.1**（不重复 BR）。  
5. 提交：Pending Payment；`items[{skuId, qty}]`；**不触发邮件**（**BR138**）。

#### 字段定义

| 字段名 | 类型 | 说明 |
|--------|------|------|
| items[] | array | 多行商品 |
| checkoutEntrySource | enum | cart \| buy_now |
| subtotal | number | 原价合计 |
| promotion | number | 现价合计 − 原价合计 |
| shippingFee | number | 固定 0；展示 **Free** |
| grandTotal | number | subtotal + promotion + shippingFee |
| paymentMethod | enum | bank \| digital（v1.0.1） |
| remark | string | ≤200 字符 |

#### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|----------|----------|----------|------|----------|
| BR136 | 改量同步 | Checkout 改量（cart） | 回写 Cart；重算四行汇总 | — | 与 Cart 一致；Shipping Fee 均为 Free |
| BR137 | 加载快照 | 进入 Checkout | 按 source 拉取行 | 加载● | 失败可 Retry |
| BR138 | 提交订单 | Order & Pay | 一单多行；跳 Success | 加载● | 防重复点击 |
| BR142 | Buy Now 单行 | source=buy_now | 仅当前 SKU，初始 qty=1 | — | 无弹层；无 Cart 其他行 |

---

### 4.8 模块 G：下单成功（Order Success）

#### 基本信息

| 属性 | 内容 |
|------|------|
| 页面编号 | G |
| 路由 | `/seller/2c/sourcing/checkout/result` |
| 优先级 | P0 |

#### 4.8.1 功能描述

v1.0.1 成功话术、Order No.、Grand Total、Contact、按钮；v2.0.0 增加底侧 **Recommended**（乱序）。**无** 邮件已发送提示、**无** 2B 账户、**无** 上传凭证。Contact 中的 Email 仍是客服联络方式，不是订单通知。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|------------------|------------------|----------|
| FL271 | 成功页推荐 | Success Recommendations | Recommended |
| FL272 | 金额一致 | Total Consistency | Grand Total 与 Checkout 一致 |

#### 业务规则

1. Contact：Phone **01794 133553**、Email **payment@kickbazar.com**（v1.0.1，客服联络，不是发信通知）。  
2. 成功页 **不展示**「邮件已发送」类文案，也 **不触发** 创建单邮件。  
3. 推荐同 §4.4。

#### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|----------|----------|----------|------|----------|
| BR170 | Copy | 点击 Copy | 复制 Order No./联系方式 | — | 同 v1.0.1 |
| BR172 | 继续选品 | Continue Sourcing | 回 Discovery | — | — |
| BR173 | 查看 PO | View Order Detail | PO Detail（v1.0.1） | — | — |

---

## 五、接口草案（摘要）

| 接口 | 说明 |
|------|------|
| Cart CRUD | skuId, qty |
| Checkout preview | MOQ、价格快照 |
| Create purchase order | items[], paymentMethod, remark → 单 orderId |
| GET Recommendations | scene=detail\|success |
| GET Product price | salePrice, originalPrice |

---

## 六、扩展计划（本期不做）

| 项目 | 说明 |
|------|------|
| Discovery 推荐 | 仅 Detail/Success |
| PO 搜索/导出/Buy Again | 他方模块 |
| Buy Now 合并 Cart | 本期 **不合并** |
| Buy Now 数量弹层 | 本期 **不做**；点击直达 Checkout，数量默认 1 |
| 邮件通知 | 创建单邮件、确认收款邮件、Success「邮件已发送」均 **本期不做** |
| 多 2B、凭证上传、Shipping Method | v1.0.1 已排除；Summary 只展示 Shipping Fee = **Free** |

---

## 七、验收总则

### 7.1 功能验收（v2.0.0 增量）

- [ ] Discovery 卡片：划线 + `-X%`；无推荐区  
- [ ] PDP：Add to Cart、Buy Now 双按钮；Buy Now **无弹层**、直达 Checkout 且初始数量为 1；Detail 推荐  
- [ ] Cart：改量、删行、空车禁用 Checkout、三步条 Step1；Order Summary 含 Subtotal、Promotion、Shipping Fee（Free）、Grand Total  
- [ ] Checkout：同样四行汇总；多行、改量同步 Cart；Buy Now 单行；一单多 SKU 提交  
- [ ] Success：推荐、Grand Total 一致；**无** 邮件已发送提示  
- [ ] 步骤条：Cart 路径 3 步；Buy Now 2 步  
- [ ] 下单成功 **不发送** 创建单邮件或确认收款邮件  

### 7.2 与 v1.0.1 关系验收

- [ ] 固定达卡地址、无 Shipping Method、Security 四模块、Contact、无 2B 账户 **未破坏**  
- [ ] PO List/Detail **无本期强制 UI 改造**（多 SKU 数据由后端兼容）

---

## 附录 A：FL 索引（v2.0.0）

| 模块 | FL 范围 |
|------|---------|
| G0 顶栏 Cart | FL201–FL203 |
| Discovery | FL210–FL211 |
| PDP | FL220–FL223 |
| 推荐组件 | FL230–FL231 |
| 步骤条 | FL240–FL242 |
| Cart | FL250–FL254 |
| Checkout | FL260–FL264 |
| Success | FL271–FL272 |

## 附录 B：BR 索引（v2.0.0，BR101 起）

| 模块 | BR 范围 |
|------|---------|
| 全局 Cart | BR101、BR106 |
| Discovery | BR120–BR122 |
| PDP | BR130–BR134 |
| 推荐 | BR140–BR141 |
| 步骤条 | BR150–BR153 |
| Cart | BR160–BR163 |
| Checkout | BR136–BR138、BR142 |
| Success | BR170、BR172–BR173 |

## 附录 C：v1.0.1 → v2.0.0 差异速查

| 环节 | v1.0.1 | v2.0.0 |
|------|--------|--------|
| 入口 | Buy Now | + Cart、Add to Cart |
| Discovery/Detail | 采购价 | + 划线、-X%；Detail 推荐 |
| Buy Now | 数量弹层后结算 | 直达 Checkout，默认数量 1，无弹层 |
| Checkout | 单 SKU；Summary 仅 Grand Total | 多 SKU；Cart/Checkout 可改量；Summary 为 Subtotal / Promotion / Shipping Fee（Free）/ Grand Total |
| Success | Contact | + 推荐；**无** 邮件提示 |
| 导航 | 面包屑 | + 交易步骤条 + 短面包屑 |
| PO 模块 | v1.0.1 | 本文不改 UI |

---

*PRD v2.0.0 · Product Sourcing · 章节框架对齐 KickBazar Web PRD（功能描述 / 字段定义与业务规则 / 交互说明 · FL + BR101+）· 2026/10/13 修订*
