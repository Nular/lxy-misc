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
| 2026/09/28 | **v2.0.0** | — | 购物车与合并下单；Cart/Checkout 可改量；划线价与 **-X%** Tag；Detail/Success 推荐；邮件触发；交易步骤条与面包屑分层 |

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
| 商品 | Product Detail（内嵌 SKU/数量）、Buy Now 弹层 | **P0**；+ **Add to Cart**、推荐区 |
| 交易 | **购物车**、**交易步骤条**、Checkout、Order Success | **P0** |
| 横切 | 采购价/折扣展示、推荐组件、邮件触发 | **P0** |
| 采购订单 | Purchase Orders List / Detail | **不在本文**（维持 v1.0.1；一单多 SKU **数据兼容**） |

---

## 二、产品背景介绍

### 2.1 业务背景

KickBazar **2B 货源 + 2C 零售**：2C 商家在 **Seller Web** 通过 **Product Sourcing（选品中心）** 向固定 2B 货源采购 SKU，银行/数字转账付款后铺货。v1.0.1 已支持 **Buy Now → Checkout → 采购单** 单笔闭环；v2.0.0 在 **同一后台模块** 内补齐 **购物车、合并结算、营销展示与触达**，与 App 选品能力方向对齐，但 **交互形态为 B 端后台**（非 ToC 商城站）。

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
| 转化路径单一 | **Add to Cart** 与 **Buy Now** 双路径 |
| 下单后触达弱 | **创建单邮件** + Success 提示 |
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
Discovery → Detail → **Buy Now**（弹层确认数量）→ **Checkout**（仅当前 SKU）→ Order & Pay → Order Success  

**旅程 3：v1.0.1 延续（采购后）**  
Order Success / PO List → 联系客服付款 → 2B 确认收款 → Publish to Store（**规则同 v1.0.1**）

### 3.4 跨模块衔接规范

| 场景 | 规则 |
|------|------|
| Add to Cart 成功 | Toast「Added to cart」；顶栏角标更新（**BR106**） |
| Buy Now Confirm | 写入结算快照 `checkoutEntrySource=buy_now`；跳转 Checkout；**不经过 Cart**（**BR142**） |
| Cart → Checkout | `checkoutEntrySource=cart`；携带 **全部有效行**（**BR141**） |
| Checkout 改量（cart 来源） | 实时重算 Grand Total；**回写同步 Cart**（**BR136**） |
| Order & Pay 成功 | 创建 **一个** PO、多 `items[]`；跳转 Success；触发创建单邮件（**BR138**） |
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

在 Product Sourcing 各页顶栏提供 **Cart** 文字按钮与 **数量角标**，作为进入购物车（§4.6）的唯一全局入口。角标与购物车数据联动，Add to Cart 成功后即时更新。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|------------------|------------------|----------|
| FL201 | 顶栏购物车入口 | Cart Entry | 顶栏展示 Cart 链接 |
| FL202 | 购物车角标 | Cart Badge | 展示待结算件数或 SKU 数（与研发统一一种） |
| FL203 | 加购反馈联动 | Cart Badge Sync | Add to Cart 成功后角标更新 |

#### 业务规则

1. 角标统计口径：**推荐为购物车有效行 quantity 之和**；与研发锁定后全站一致。  
2. 角标为 0：展示 `0` 或隐藏，由 UI 规范二选一。  
3. 数据范围：当前 2C 店铺、**单一 2B 货源**（同 v1.0.1）。  
4. 购物车数据与登录店主账号绑定。

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

v1.0.1 橱窗、SKU 选择、Buy Now 弹层、MOQ、超卖；v2.0.0 增加底栏 **Add to Cart**、价格折扣展示、底侧 **You May Also Like**。规格与数量在 **PDP 内嵌**（无独立规格全屏 Modal）。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|------------------|------------------|----------|
| FL220 | 详情折扣价 | PDP Pricing | 现价/原价/-X% Tag |
| FL221 | 加入购物车 | Add to Cart | 当前 SKU 入车 |
| FL222 | 立即购买 | Buy Now | 弹层确认数量后进 Checkout |
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
| quantity | 数量 | number | 是 | Buy Now 弹层内；Add to Cart 默认 1 |
| recommendProducts[] | 推荐列表 | array | 否 | 见 §4.4 |

#### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|----------|----------|----------|------|----------|
| BR130 | Add to Cart | 点击且 SKU 选全 | Toast；角标 BR106；停留 PDP | — | 不跳转 |
| BR131 | Buy Now 弹层 | 点击 Buy Now | 打开数量弹层 | — | 同 v1.0.1 |
| BR132 | Buy Now 确认 | Confirm | `buy_now` 快照 → Checkout | — | 单行 |
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

横滑或网格展示 **You May Also Like**；无数据时可隐藏整块。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|------------------|------------------|----------|
| FL230 | 推荐嵌入 | Recommendation Embed | scene=detail \| success |
| FL231 | 推荐跳转 | Recommendation Nav | 点击进 PDP |

#### 业务规则

1. **禁止** 在 Discovery 使用（**BR121**）。  
2. 卡片字段：图、标题、采购价（可有 FL210 折扣样式）。  
3. 标题文案默认 **You May Also Like**（可 i18n 配置）。

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

**路径 A（`checkoutEntrySource=cart`）**  
步骤：**Cart → Checkout → Order Success**

**路径 B（`checkoutEntrySource=buy_now`）**  
步骤：**Checkout → Order Success**（无 Cart 步）

1. Cart **空态不展示** 步骤条。  
2. Success 成功态：步骤条只读（建议不可回退改单）。  
3. PO List/Detail 使用 **订单时间线**，不用本步骤条。  
4. 交易区面包屑建议：`Product Sourcing › Place Purchase Order`；**禁止** 用 Discovery › Detail › Checkout › Success 长链。

#### 字段定义

| 字段名 | 中文名称 | 类型 | 说明 |
|--------|----------|------|------|
| checkoutEntrySource | 结算来源 | enum | `cart` \| `buy_now` |
| checkoutStep | 当前步骤 | enum | cart / checkout / order_success |

#### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 验收标准 |
|------|----------|----------|----------|----------|
| BR150 | 三步条 | cart 路径 | Cart→Checkout→Success | 步数正确 |
| BR151 | 两步条 | buy_now 路径 | Checkout→Success；无 Cart | 不可点 Cart 步 |
| BR152 | 空车隐藏 | Cart 空 | 不展示步骤条 | — |
| BR153 | Checkout 回退 | Checkout（cart 来源） | 可回 Cart（UI 定稿） | 保留行数据 |

---

### 4.6 模块 E：购物车（Cart）

#### 基本信息

| 属性 | 内容 |
|------|------|
| 页面编号 | E |
| 路由 | `/seller/2c/sourcing/cart` |
| 优先级 | P0 |

#### 4.6.1 功能描述

待结算 SKU 表格：图/标题/规格/价/数量/行小计/删除；底部 **Grand Total** 与 **Checkout**、**Continue Sourcing**。非空时展示 **步骤条 Step1=Cart**。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|------------------|------------------|----------|
| FL250 | 购物车列表 | Cart Line List | 多 SKU 行展示 |
| FL251 | 改量 | Cart Qty Edit | 步进器改 quantity |
| FL252 | 删行 | Remove Line | 单行删除 |
| FL253 | 去结算 | Cart Checkout | 携带全部有效行进 Checkout |
| FL254 | 空购物车 | Cart Empty | 空态 + 回 Discovery |

#### 业务规则

1. quantity ≥ MOQ；改量实时算 lineSubtotal、Grand Total（**BR160**）。  
2. Cart 为空：**Checkout 禁用**（**BR161**）。  
3. 删至空：角标归零、空态（**BR162**）。  
4. 价格展示可含 FL210 折扣样式。  
5. 超卖规则同 v1.0.1。

#### 字段定义

| 字段名 | 中文名称 | 类型 | 必填 | 字段说明 |
|--------|----------|------|------|----------|
| lineId | 行 ID | string | 是 | 唯一 |
| skuId | SKU ID | string | 是 | — |
| productTitle | 标题 | string | 是 | — |
| skuLabel | 规格文案 | string | 是 | 如 Blue / M |
| unitPrice | 单价 | number | 是 | BDT |
| quantity | 数量 | number | 是 | ≥1 |
| lineSubtotal | 行小计 | number | 是 | unitPrice×quantity |
| cartGrandTotal | 合计 | number | 是 | 有效行之和 |

#### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|----------|----------|----------|------|----------|
| BR160 | 改量计价 | 步进器 | 行小计与合计更新 | — | 实时 |
| BR161 | 空车结算 | Cart 空 | Checkout 禁用 | — | — |
| BR162 | 删行 | Remove | 刷新列表与角标 | — | — |
| BR163 | 去结算 | Checkout | `cart` 来源进 Checkout | — | 多行带入 |

---

### 4.7 模块 F：结算（Checkout）

#### 基本信息

| 属性 | 内容 |
|------|------|
| 页面编号 | F |
| 路由 | `/seller/2c/sourcing/checkout` |
| 优先级 | P0 |

#### 4.7.1 功能描述

v1.0.1 三模块：**Shipping Address（固定）**、**Product Information + Remark**、**Payment Method**；右侧 **Order Summary（仅 Grand Total）** + **Security Reminder** + **Order & Pay**。

v2.0.0：**Product Information 多 SKU 行**，每行 **Qty 可编辑**；Grand Total = ∑(单价×数量)；提交创建 **一个 PO、多 items**。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|------------------|------------------|----------|
| FL260 | 多行商品 | Multi-line Items | 每 SKU 一行 |
| FL261 | Checkout 改量 | Checkout Qty Edit | 行级步进器 |
| FL262 | 合并下单 | Merge PO Submit | 一单多 SKU |
| FL263 | 结算来源 | Checkout Source | cart / buy_now 快照 |

#### 业务规则

1. `cart`：items = Cart 有效行；`buy_now`：**单行**（**BR142**）。  
2. Checkout 改量同步 Cart（仅 cart 来源）（**BR136**）。  
3. 运费/COD = 0；Summary **仅 Grand Total**（v1.0.1）。  
4. 固定地址、Payment、Security、Remark：**同 v1.0.1**（不重复 BR）。  
5. 提交：Pending Payment；`items[{skuId, qty}]`（**BR138**）。

#### 字段定义

| 字段名 | 类型 | 说明 |
|--------|------|------|
| items[] | array | 多行商品 |
| checkoutEntrySource | enum | cart \| buy_now |
| grandTotal | number | 应付合计 |
| paymentMethod | enum | bank \| digital（v1.0.1） |
| remark | string | ≤200 字符 |

#### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|----------|----------|----------|------|----------|
| BR136 | 改量同步 | Checkout 改量（cart） | 回写 Cart；重算 Total | — | 双端一致 |
| BR137 | 加载快照 | 进入 Checkout | 按 source 拉取行 | 加载● | 失败可 Retry |
| BR138 | 提交订单 | Order & Pay | 一单多行；跳 Success | 加载● | 防重复点击 |
| BR142 | Buy Now 单行 | source=buy_now | 仅当前 SKU | — | 无 Cart 行 |

---

### 4.8 模块 G：下单成功（Order Success）

#### 基本信息

| 属性 | 内容 |
|------|------|
| 页面编号 | G |
| 路由 | `/seller/2c/sourcing/checkout/result` |
| 优先级 | P0 |

#### 4.8.1 功能描述

v1.0.1 成功话术、Order No.、Grand Total、Contact、按钮；v2.0.0 增加 **邮件已发送提示**、底侧 **You May Also Like**。**无** 2B 账户、**无** 上传凭证。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|------------------|------------------|----------|
| FL270 | 邮件提示 | Email Sent Hint | 已向店主邮箱发送确认 |
| FL271 | 成功页推荐 | Success Recommendations | You May Also Like |
| FL272 | 金额一致 | Total Consistency | Grand Total 与 Checkout 一致 |

#### 业务规则

1. Contact：Phone **01794 133553**、Email **payment@kickbazar.com**（v1.0.1）。  
2. 邮件发送失败：可降级文案，**不阻断** 成功页（**BR171**）。  
3. 推荐同 §4.4。

#### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|----------|----------|----------|------|----------|
| BR170 | Copy | 点击 Copy | 复制 Order No./联系方式 | — | 同 v1.0.1 |
| BR171 | 邮件降级 | 发信失败 | 弱提示 + 仍成功态 | 错误○ | 不阻断 |
| BR172 | 继续选品 | Continue Sourcing | 回 Discovery | — | — |
| BR173 | 查看 PO | View Order Detail | PO Detail（v1.0.1） | — | — |

---

### 4.9 模块 H：邮件通知（触发）

#### 基本信息

| 属性 | 内容 |
|------|------|
| 类型 | 后端触发 + Success 文案联动 |
| 优先级 | P0 |

#### 4.9.1 功能描述

定义下单链路邮件触发；**不要求** 改造 PO 页面。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|------------------|------------------|----------|
| FL280 | 创建单邮件 | Order Created Email | Order & Pay 后发 2C 店主 |
| FL281 | 确认收款邮件 | Payment Confirmed Email | 2B 确认后 2C+2B |

#### 业务规则

1. 模板 **English**；含 Order No.、Grand Total、payment@kickbazar.com。  
2. 确认收款由交易中台/2B 触发（本文只定义收件人）。

#### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 验收标准 |
|------|----------|----------|----------|----------|
| BR180 | 无重发按钮 | Success 页 | 本期不提供用户重发 | — |

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
| 多 2B、凭证上传、Shipping Method | v1.0.1 已排除 |

---

## 七、验收总则

### 7.1 功能验收（v2.0.0 增量）

- [ ] Discovery 卡片：划线 + `-X%`；无推荐区  
- [ ] PDP：Add to Cart、Buy Now 双按钮；Detail 推荐  
- [ ] Cart：改量、删行、空车禁用 Checkout、三步条 Step1  
- [ ] Checkout：多行、改量同步 Cart；Buy Now 单行；一单多 SKU 提交  
- [ ] Success：邮件提示、推荐、Grand Total 一致  
- [ ] 步骤条：Cart 路径 3 步；Buy Now 2 步  
- [ ] 创建单邮件任务成功或 2C 收到  

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
| Checkout | FL260–FL263 |
| Success | FL270–FL272 |
| 邮件 | FL280–FL281 |

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
| Success | BR170–BR173 |
| 邮件 | BR180 |

## 附录 C：v1.0.1 → v2.0.0 差异速查

| 环节 | v1.0.1 | v2.0.0 |
|------|--------|--------|
| 入口 | Buy Now | + Cart、Add to Cart |
| Discovery/Detail | 采购价 | + 划线、-X%；Detail 推荐 |
| Checkout | 单 SKU、数量规则见 v1.0.1 | 多 SKU；Cart/Checkout 可改量 |
| Success | Contact | + 推荐、邮件提示 |
| 导航 | 面包屑 | + 交易步骤条 + 短面包屑 |
| PO 模块 | v1.0.1 | 本文不改 UI |

---

*PRD v2.0.0 · Product Sourcing · 章节框架对齐 KickBazar Web PRD（功能描述 / 字段定义与业务规则 / 交互说明 · FL + BR101+）· 2026/09/28*
