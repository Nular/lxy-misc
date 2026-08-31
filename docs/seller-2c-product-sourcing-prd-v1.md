# Seller 后台 2C 店铺 — 选品中心（Product Sourcing）PRD

---

## 一、文档信息

| 版本号 | 修订日期 | 修订人 | 修订内容 | 审批状态 |
|--------|---------|--------|---------|---------|
| V1.0.0 | 2026-08-31 | — | 初始版本，完成项目概述、Checkout / Order Success 流程及核心功能需求定义 | 待审批 |
| V1.0.2 | 2026-08-31 | — | 铺货改为 SPU 维度、采购保持 SKU 维度；采购订单仅 List 提供铺货 Tab，Detail 无 Tab | 待审批 |
| V1.0.1 | - | - | - | - |
| V1.1.0 | - | - | - | - |

**关联文档**：`docs/seller-2c-product-sourcing-brainstorming.md` v0.3  
**界面语言**：English（仅英语）  
**PRD 语言**：中文  
**目标市场**：孟加拉国（Bangladesh）  
**本文档涉及时间**：均为孟加拉达卡时间（UTC+6）

---

## 二、项目概述

### 2.1 项目背景

KickBazar 平台采用 **2B 货源 + 2C 零售** 模式：2B 商铺提供货源，2C 商家通过选品完成下单、银行转账、铺货上架，面向消费者销售。当前 2C 商家的选品、采购、转账、查单等核心操作主要在 **移动端 App** 完成；在 PC 办公场景下，商家无法高效浏览货源、核对结算明细、上传转账凭证及管理采购订单。

与此同时，**2B 账户端（Web）** 已支持根据订单与转账信息确认收款，确认后 2C 商家可一键上架，2B 按订单发货。为保持跨端体验一致，需在 **Seller Web 后台（2C 店铺）** 新增 **选品中心（Product Sourcing）** 模块，补齐 Web 端选品与采购闭环。

### 2.2 核心目标

1. **补齐 Web 选品能力**：2C 商家可在 Seller 后台浏览绑定 **单一 2B 货源** 的商品，完成列表搜索、橱窗型详情查看与立即购买。
2. **打通单笔采购闭环**：支持立即购买 → Checkout（地址、配送、支付、费用明细）→ Order & Pay → 下单成功页（Payment Details、上传凭证、推荐商品），**本期不做购物车**。
3. **采购订单独立管理**：提供 **Purchase Orders List** 与详情，与面向消费者的 **Orders List** 菜单分离，状态与 App、2B 端对齐。
4. **铺货与支付对齐 App**：支持转账凭证上传、2B 确认收款后 **一键上架（Publish to Store）**；**铺货按 SPU 维度**，**采购可按 SKU 分单**。

### 2.3 项目范围

**业务边界**：本模块为 Seller Web 后台 **2C 店铺** 下的核心功能模块，主要面向 2C 零售商家（主账号及可授权子账号）。

**核心能力**：

1. **选品浏览**：商品列表、搜索、橱窗型商品详情、立即购买。
2. **Checkout 结算**：Shipping Address、Product Information、Shipping Method（Standard / Air Express / Air Priority）、Payment Method（Bank Transfer）、Order Summary（Subtotal、Shipping Fee、COD Handling Fee、Grand Total）、Security Reminder、Order & Pay。
3. **下单成功页**：成功话术、Grand Total、Payment Details、Upload Payment Proof、View Order List、Recommend。
4. **采购订单页**：Purchase Orders List / Detail；**仅 List** 提供 Tab（全部 / 已发布 / 未发布）；Detail 含物流、凭证、一键上架。

**铺货与采购粒度**：

- **采购（下单）**：按 **SKU** 维度选规格、数量并提交订单；同一 SPU 下不同 SKU 可分别采购。
- **铺货（一键上架）**：按 **SPU** 维度；一键上架后该 **SPU** 在 2C 店铺发布，下属已采购 SKU 随 SPU 一并上架。

**非本次迭代范围**：

- 购物车（Cart）及多 SKU 合并下单（本期仅立即购买单笔路径）。
- 多 2B 店铺混合选品、阶梯价/会员价。
- 待转账超时自动取消订单。
- 孟语界面；消费者 Orders List 功能改造（仅明确菜单命名与路由分离）。
- 2B 端确认收款、发货的实现（状态需对齐，不在本 PRD 实现范围）。

---

## 三、用户角色与权限模型

### 3.1 角色定义

| 角色 | 描述 | 权限范围 |
|------|------|---------|
| **2C 店铺主账号（Shop Admin）** | 零售店铺主账号，负责店铺整体运营 | 可进入选品中心；浏览、搜索、立即购买、Checkout、Order & Pay；上传转账凭证；查看采购订单；2B 确认收款后可一键上架；管理收货地址（添加/编辑/设默认） |
| **2C 子账号（Sub-account）** | 店铺员工账号，权限由主账号分配 | 权限可配置（⚙️）：默认与主账号一致项需 RBAC 细化；无权限时不可见选品中心或不可下单 |
| **2B 货源方** | 绑定货源的 2B 账户 | 不在 Seller 2C 端操作；在 2B Web 确认收款、发货，驱动采购订单状态跃迁 |
| **平台运营** | 平台配置人员 | 配置 BDT 展示格式、银行名称列表、安全提示文案等 |

### 3.2 数据权限规则

**数据可见范围**：每个 2C 店铺仅可查看 **绑定单一 2B 货源** 的商品数据及本店铺发起的 **采购订单** 数据。

**与消费者订单隔离**：采购订单（Purchase Orders）与消费者订单（Orders List）**分菜单、分接口、分路由**，2C 商家在 Seller 后台通过不同入口访问，命名上不混淆。

**跨店铺隔离**：不同 2C 店铺之间的选品货源绑定关系、采购订单数据严格隔离，不可跨店查看。

**权限校验**：数据权限与下单、上传凭证、一键上架等写操作必须在 **服务端** 执行；禁止仅依赖前端隐藏按钮。子账号 RBAC 细则待研发对齐（R2）。

**地址权限**：Checkout 收货地址复用 Seller 已有地址管理能力；近期收货地址、2C 店铺地址的读取与修改遵循现有地址模块权限。

---

## 四、功能需求总览

### Feature List

| 模块 | 功能点 | 优先级 | 简述 |
|------|--------|--------|------|
| 选品浏览 | 商品列表 | P0 | 展示绑定 2B 货源可售商品（SPU 卡片） |
| 选品浏览 | 商品搜索 | P0 | 支持商品名称、货号/SKU 编码模糊搜索 |
| 选品浏览 | 橱窗型商品详情 | P0 | 采购价、SKU 规格、库存、立即购买入口 |
| 立即购买 | 规格/数量确认弹层 | P0 | 按 **SKU** 选规格、数量后进入 Checkout；允许超卖 |
| Checkout | 结算页完整流程 | P0 | 地址、商品、配送、支付、费用明细、安全提示、Order & Pay |
| 下单成功 | Order Success 页 | P0 | 成功话术、总价、Payment Details、凭证、推荐 |
| 支付 | 上传转账凭证 | P0 | 成功页与订单详情均可上传，对齐 App |
| 采购订单 | Purchase Orders List | P0 | **仅 List** Tab：全部/已发布/未发布（**SPU** 铺货状态） |
| 采购订单 | Purchase Order Detail | P0 | 无铺货 Tab；物流、凭证、一键上架（**SPU** 铺货） |
| 铺货 | 一键上架（Publish to Store） | P0 | 严格依赖 2B 确认收款；**SPU** 维度铺货 |
| 选品浏览 | 列表排序、类目筛选 | P1 | 与 App 对齐后排期 |
| 采购订单 | 订单号搜索、再次购买 | P1 | 提升跟单与复购效率 |

### 4.1 核心功能详细说明

#### 4.1.1 选品至下单主流程

**功能描述**：2C 商家从选品中心浏览 2B 商品，经商品详情立即购买，在 Checkout 页确认地址、配送方式、支付方式及费用后，点击 **Order & Pay** 创建采购订单，进入下单成功页完成转账指引与凭证上传。

**业务规则**：

- 商品数据源为 **单一绑定 2B 店铺**。
- 采购价为 **单一价**，无阶梯价、会员价。
- 允许 **超卖**：库存不足仍可提交订单（受 MOQ 约束）。
- 支付方式本期仅 **Bank Transfer**；收款账户为 **2B 店铺固定账户**。
- **无**待转账超时自动取消。
- 费用公式：`Grand Total = Subtotal + Shipping Fee + COD Handling Fee`。

**交互说明**：

```
商品详情 → Buy Now（选 SKU/数量）→ Checkout → Order & Pay
    → Order Success → 线下转账 + Upload Payment Proof
    → 2B 确认收款 → 待发货 → 待收货 → 已完成 → Publish to Store
```

#### 4.1.2 Checkout 结算页

**功能描述**：商家在提交订单前确认收货地址、商品信息、Shipping Method、Payment Method 及 Order Summary，阅读 Security Reminder 后点击 Order & Pay。

**业务规则**：

- Shipping Method 三选一：**Standard**（默认）、**Air Express**、**Air Priority**；切换时 **实时重算** Shipping Fee、COD Handling Fee、Grand Total。
- 收货地址默认：优先 **近期收货地址**；若无则使用 **2C 店铺地址**；支持 Change / Add New / Edit / Set as Default（复用已有流程）。
- BDT 金额格式、银行名称由 **运营后台配置**。

**交互说明**：Checkout 页字段加载失败时保留用户已填信息；Order & Pay 提交中按钮 Loading 并防重复点击；提交成功后跳转 Order Success 页，Grand Total 与 Checkout 展示一致。

#### 4.1.3 下单成功页（Order Success）

**功能描述**：展示订单提交成功话术、Grand Total、Payment Details（2B 固定收款账户）、Upload Payment Proof、View Order List、Recommend 推荐商品。

**业务规则**：Payment Details 展示 2B 固定账户信息；Amount to Pay = Grand Total；订单初始状态为 **Pending Payment**。

**交互说明**：账号、订单号、金额支持 Copy；View Order List 跳转 Purchase Orders List；推荐区点击商品进入详情。

#### 4.1.4 采购订单与一键上架

**功能描述**：独立菜单 **Purchase Orders List** 管理采购单全生命周期；订单详情支持查看物流、补充凭证；2B 确认收款且订单完成后可 **Publish to Store**。

**业务规则**：一键上架 **严格依赖** 2B 已确认收款；**铺货按 SPU**；成功后该 **SPU** 在采购订单 List **Published** Tab 可见，商品详情铺货状态变为 Published。采购订单行仍按 **SKU** 记录采购明细。

### 4.2 功能总览

**页面 / 路由草案**：

| 页面 | URL 草案 |
|------|---------|
| 选品列表 | `/seller/2c/sourcing` |
| 商品详情 | `/seller/2c/sourcing/product/{id}` |
| Checkout | `/seller/2c/sourcing/checkout` |
| Order Success | `/seller/2c/sourcing/checkout/result?orderId={id}` |
| Purchase Orders List | `/seller/2c/sourcing/orders?tab=all|published|unpublished` |
| Purchase Order Detail | `/seller/2c/sourcing/orders/{id}` |

**菜单命名（English）**：

| 中文（PRD） | 界面 English |
|------------|-------------|
| 选品中心 | Product Sourcing |
| 采购订单 | Purchase Orders |
| 消费者订单 | Orders List |

---

## 五、功能需求详述

### 5.1 选品浏览模块

#### 5.1.1 商品列表

**功能描述**：以 **SPU 商品卡片** 形式展示绑定 2B 货源的可售商品，支持分页；点击卡片进入橱窗型商品详情。列表 **不提供** 铺货 Tab（铺货 Tab 仅 Purchase Orders List，见 5.5.1）。

**业务规则**：

1. 数据源：当前 2C 店铺 **绑定单一 2B 店铺** 的可售商品；过滤 2B 侧已下架/不可售商品。
2. 列表以 **SPU** 为卡片粒度展示；卡片展示 SPU 主图、标题、代表采购价等。
3. 列表不按铺货状态 Tab 筛选；**铺货状态（Published / Unpublished）在商品详情按 SPU 展示**。
4. **采购**在详情页按 **SKU** 选择规格后下单，同一 SPU 下不同 SKU 可分别采购。

**字段定义**：

| 字段 | 英文界面 | 说明 |
|------|---------|------|
| Product Image | — | 主图缩略图 |
| Product Title | — | 商品标题 |
| Purchase Price | Purchase Price | 采购价 BDT |
| SKU Code | — | 列表可选展示货号 |

**交互说明**：

1. 点击商品卡片 → 商品详情页。
2. URL 参数：`?q={keyword}`（搜索场景）。
3. 分页规则与 Seller 后台统一；列表首屏 Loading，无数据展示空状态。

#### 5.1.2 商品搜索

**功能描述**：在选品列表页提供搜索框，支持按商品名称、货号/SKU 编码查找目标货源。

**业务规则**：

1. 支持模糊匹配；无结果展示空状态（如 **NO DATA**）。
2. 搜索与列表同路由，通过 `q` 参数传递。

**交互说明**：

1. 输入关键词后触发搜索（Enter 或搜索按钮，与 Seller 后台搜索交互保持一致）。
2. 支持一键清除搜索词并刷新列表。

#### 5.1.3 橱窗型商品详情

**功能描述**：以采购决策为导向的橱窗型详情页，展示 SPU 级信息与下属 SKU 规格；底栏 **Buy Now** 进入立即购买（**按 SKU 采购**）。

**业务规则**：

1. 展示当前 **SPU** 的 **Published / Unpublished** 铺货状态（**SPU 维度**）。
2. 用户选择 **SKU**（颜色、尺码等）后查看该 SKU 采购价、库存；库存仅供参考，**允许超卖**。
3. 切换 SKU 时更新该 SKU 的采购价、库存；**铺货状态随 SPU 不变**（SPU 已发布则全部 SKU 行展示 Published）。
4. 每次立即购买提交 **一个 SKU** 的采购数量；同一 SPU 下可对不同 SKU 分别多次购买。

**字段定义**：

| 字段 | 英文界面 | 必填展示 |
|------|---------|---------|
| Product Images | — | ✅ |
| Product Title | — | ✅ |
| SKU Code | SKU Code | ✅ |
| Publish Status | Published / Unpublished | ✅ | **SPU 维度** |
| Purchase Price | Purchase Price | ✅ | 当前选中 **SKU** 采购价 |
| Stock | Stock | ✅ | 当前选中 **SKU** 库存 |
| SKU Attributes | Color / Size 等 | 有则展示 |
| Description | Description | ✅ 图文详情 Tab |

**交互说明**：

1. 底栏 Sticky **Buy Now** → 打开立即购买弹层（5.2）。
2. 面包屑：Product Sourcing > Product Detail。

---

### 5.2 立即购买模块

#### 5.2.1 功能描述

在下单前按 **SKU** 确认规格与购买数量，预览行小计后进入 Checkout。

#### 5.2.2 业务规则

1. 数量受 **MOQ（最小起订量）** 约束。
2. **允许超卖**：库存小于购买数量时仍可 Confirm 进入 Checkout。
3. Subtotal Preview = Unit Price × Quantity。

#### 5.2.3 字段定义

| 字段 | 英文界面 | 说明 |
|------|---------|------|
| Selected SKU | — | 已选规格属性 |
| Unit Price | Unit Price | 采购单价 BDT |
| Quantity | Quantity | 数量输入/步进器 |
| Subtotal Preview | Subtotal | 行小计预览 |

#### 5.2.4 交互说明

1. **Confirm** → 跳转 Checkout，携带 `skuId`、`quantity` 等参数。
2. **Cancel** → 关闭弹层，停留商品详情。
3. 本期无购物车，Checkout 内商品数量 **只读**；修改数量需返回详情页。

---

### 5.3 Checkout 结算模块

#### 5.3.1 功能描述

商家确认收货地址、商品信息、配送方式、支付方式及费用明细，阅读安全提示后点击 **Order & Pay** 提交采购订单。

#### 5.3.2 页面结构

```
Breadcrumb: Product Sourcing > Checkout
[1] Shipping Address
[2] Product Information
[3] Shipping Method
[4] Payment Method
[5] Order Summary
[6] Security Reminder
[7] [ Order & Pay ]
```

#### 5.3.3 字段定义与业务规则

##### （1）Shipping Address

| 字段 | 英文界面 | 必填 | 说明 |
|------|---------|------|------|
| recipientName | Recipient Name | ✅ | 收货人 |
| phone | Phone Number | ✅ | +880 格式 |
| division | Division | ✅ | 一级行政区 |
| district | District | ✅ | 二级行政区 |
| upazila | Upazila / Thana | ✅ | 三级行政区 |
| addressLine | Address | ✅ | 详细地址 |
| isDefault | Default | — | 默认地址标签 |

**默认地址规则（BR-ADDR）**：

1. 优先展示 **近期收货地址**（最近一次采购/收货使用地址）。
2. 若无近期地址 → 使用 **2C 店铺地址**。
3. 支持 **Change**（选择其他地址）、**Add New**、**Edit**、**Set as Default**，复用 Seller 已有地址流程。

##### （2）Product Information

| 字段 | 英文界面 | 说明 |
|------|---------|------|
| productImage | — | 商品缩略图 |
| productTitle | — | 商品标题 |
| skuAttributes | — | 规格属性 |
| skuCode | SKU Code | 货号 |
| unitPrice | Unit Price | 采购单价 |
| quantity | Quantity | 数量（只读） |
| lineSubtotal | — | Unit Price × Quantity |

本期默认 **单 SKU 单行**（立即购买路径，无购物车）。

##### （3）Shipping Method

| 枚举值 | 英文界面 | 说明 |
|--------|---------|------|
| standard | Standard | 标准配送，**默认选中** |
| air_express | Air Express | 航空快递 |
| air_priority | Air Priority | 航空优先 |

**业务规则**：

1. 三选一，单选。
2. 切换选项时调用运费试算接口，**实时更新** Shipping Fee、COD Handling Fee、Grand Total。
3. 运费与 COD Handling Fee 计算规则由 2B/平台配置（R4 待业务确认各配送方式费率）。

##### （4）Payment Method

| 枚举值 | 英文界面 | 说明 |
|--------|---------|------|
| bank_transfer | Bank Transfer | 本期 **唯一** 支付方式，默认选中，不可切换 |

##### （5）Order Summary

| 字段 | 英文界面 | 计算规则 |
|------|---------|---------|
| subtotal | Subtotal | 商品行小计之和 |
| shippingFee | Shipping Fee | 依 Shipping Method 计算 |
| codHandlingFee | COD Handling Fee | 依配送方式/平台规则计算 |
| grandTotal | Grand Total | Subtotal + Shipping Fee + COD Handling Fee |

金额货币 **BDT（৳）**；千分位等格式由运营后台配置（PAY-08）。

##### （6）Security Reminder

**功能描述**：在 Order & Pay 按钮上方展示安全信息提醒，降低转账诈骗与操作错误风险。

**建议文案要点（English）**：

| 要点 | 示例 |
|------|------|
| 官方账户 | Only transfer to the official bank account shown after order submission. |
| 金额一致 | Ensure the transfer amount matches the Grand Total. |
| 备注订单号 | Include your Order Number in the transfer reference/note. |
| 防诈骗 | KickBazar will never ask you to transfer to a personal account via chat. |

文案可由运营后台配置；展示形式为 Info Banner 或折叠说明区。

##### （7）Order & Pay

| 属性 | 说明 |
|------|------|
| 按钮文案 | Order & Pay |
| 前置校验 | 地址完整；Shipping Method 已选；Payment Method 已选；Grand Total > 0 |
| 提交行为 | 创建采购订单，状态 = Pending Payment |
| 成功跳转 | Order Success 页 |
| 防重复 | 提交中 Loading + 禁用按钮 |

#### 5.3.4 交互说明

1. 进入 Checkout 时并行加载：默认地址、商品快照、默认 Shipping Method 运费试算结果。
2. 运费试算失败：Toast 提示，保留已选配送方式，支持 Retry。
3. 地址为空：阻断 Order & Pay，引导 Add New Address。
4. 提交失败：Toast 错误信息，停留 Checkout 页保留表单状态。
5. 提交前后端校验价格：若采购价/运费变动，提示用户刷新 Checkout。

#### 5.3.5 提交接口入参（草案）

```json
{
  "skuId": "string",
  "quantity": 2,
  "shippingAddressId": "string",
  "shippingMethod": "standard | air_express | air_priority",
  "paymentMethod": "bank_transfer",
  "subtotal": 1000.00,
  "shippingFee": 50.00,
  "codHandlingFee": 10.00,
  "grandTotal": 1060.00
}
```

---

### 5.4 下单成功模块（Order Success）

#### 5.4.1 功能描述

订单创建成功后展示确认信息、应付总额、2B 固定收款账户（Payment Details），引导上传转账凭证，并提供采购订单入口与推荐商品。

#### 5.4.2 页面结构

```
[Success Message]
[Grand Total]
[Payment Details]
[Upload Payment Proof]
[View Order List]
[Recommend]
```

#### 5.4.3 字段定义

##### Success Message

| 元素 | 英文界面 / 内容 | 说明 |
|------|----------------|------|
| successIcon | — | 成功图标 |
| successTitle | Order Submitted Successfully! | 主标题 |
| successMessage | Your purchase order has been created. Please complete the bank transfer and upload your payment proof. | 副文案，可配置 |
| orderNo | Order No. | 采购订单号，可复制 |
| orderStatus | Pending Payment | 初始状态 |

##### Grand Total

| 字段 | 英文界面 | 说明 |
|------|---------|------|
| grandTotal | Grand Total | 与 Checkout 提交金额一致 |
| feeBreakdown | Subtotal / Shipping Fee / COD Handling Fee | 可选折叠展示 |

##### Payment Details

| 字段 | 英文界面 | 说明 |
|------|---------|------|
| paymentMethod | Bank Transfer | 固定 |
| bankName | Bank Name | 后台配置 |
| accountName | Account Name | 2B 店铺固定账户户名 |
| accountNumber | Account Number | 可复制 |
| branchCode | Branch / SWIFT Code | 有则展示 |
| amountToPay | Amount to Pay | = Grand Total，可复制 |
| transferNote | Transfer Note | 提示备注 Order Number |

**业务规则**：收款账户为 **2B 店铺固定账户**（非每单动态生成）。

##### Upload Payment Proof

| 属性 | 说明 |
|------|------|
| 文案 | Upload Payment Proof |
| 时机 | 成功页即可上传；订单详情可补充 |
| 格式限制 | 对齐 App（R3：如 JPG/PNG，≤5MB） |
| 上传后 | 进入待 2B 确认收款流程 |

##### View Order List

| 属性 | 说明 |
|------|------|
| 文案 | View Order List |
| 跳转 | Purchase Orders List |

##### Recommend

| 属性 | 说明 |
|------|------|
| 标题 | You May Also Like / Recommended Products |
| 内容 | 2B 货源推荐商品（算法或热销兜底，R5） |
| 交互 | 点击卡片 → 商品详情 |

#### 5.4.4 交互说明

1. URL：`/seller/2c/sourcing/checkout/result?orderId={id}`。
2. Payment Details 各关键字段提供 **Copy** 按钮。
3. 上传凭证成功 Toast 提示；失败可 Retry。
4. 页面加载失败展示错误态，提供返回 Purchase Orders 或 Product Sourcing 入口。

---

### 5.5 采购订单模块

#### 5.5.1 Purchase Orders List

**功能描述**：独立菜单 **Purchase Orders**，列表化展示本店铺采购订单。**仅本页** 提供铺货状态 Tab（全部 / 已发布 / 未发布），与消费者 **Orders List** 分离。

**业务规则**：

1. **无**待转账超时自动取消。
2. 列表默认按 **创建时间倒序**。
3. 分页与 Seller 后台统一。
4. **仅 Purchase Orders List** 提供铺货 Tab；**Purchase Order Detail 不提供 Tab**。
5. Tab 按订单关联 **SPU 铺货状态** 筛选（**SPU 维度**）：
   - **All**：全部采购订单。
   - **Published**：订单关联 **SPU** 已在当前 2C 店铺铺货上架。
   - **Unpublished**：订单关联 **SPU** 尚未在 2C 店铺铺货上架。
6. Tab 切换保留于 URL：`?tab=all|published|unpublished`。
7. 订单商品明细按 **SKU** 记录；同一 SPU 多次采购不同 SKU 生成独立订单或独立行（与交易中台一致）。

**铺货状态 Tab（仅 List）**：

| Tab | 英文界面 | 说明 |
|-----|---------|------|
| 全部 | All | 全部采购订单 |
| 已发布 | Published | 关联 **SPU** 已铺货至 2C 店铺 |
| 未发布 | Unpublished | 关联 **SPU** 尚未铺货 |

**列表卡片字段**：

| 字段 | 英文界面 | 说明 |
|------|---------|------|
| orderNo | Order No. | 采购订单号 |
| status | Status | 订单状态（Pending Payment 等，卡片展示） |
| publishStatus | Published / Unpublished | 关联 **SPU** 铺货状态 |
| productImage | — | SPU 主图 |
| spuTitle | — | SPU 商品标题 |
| skuInfo | SKU Code / Attributes | 本单采购的 **SKU** 信息 |
| itemCount | Items | 采购件数 |
| grandTotal | Grand Total | 订单总额 BDT |
| createdAt | Created Time | 创建时间 |
| action | View Detail | 查看详情 |

**交互说明**：

1. 点击 View Detail → 采购订单详情（5.5.2）。
2. Tab 切换刷新列表并重置分页至第 1 页。
3. 空状态引导返回 Product Sourcing。

#### 5.5.2 Purchase Order Detail

**功能描述**：展示采购单完整信息，**不提供铺货 Tab**；含订单状态时间轴、Payment Details、**物流**、**转账凭证**、**一键上架（SPU 铺货）** 操作。

**业务规则**：

1. 详情页 **无** All / Published / Unpublished Tab；展示本单全部信息。
2. 商品明细按 **SKU** 展示（图、SKU Attributes、SKU Code、单价、数量、小计）。
3. **Publish to Store** 按 **SPU** 操作：一键上架将该订单关联 **SPU** 铺货至 2C 店铺（非单 SKU 独立铺货）。
4. 若关联 SPU 已 Published，按钮置灰或隐藏。
5. 须 2B 已确认收款且订单达到可上架状态（通常 Completed）方可一键上架。

**信息区块**：

| 区块 | 内容 |
|------|------|
| 状态区 | 当前状态 + 状态时间轴 |
| Product Information | 同 Checkout 商品信息快照 |
| Shipping Address | 下单时地址快照 |
| Shipping Method | Standard / Air Express / Air Priority |
| Order Summary | Subtotal、Shipping Fee、COD Handling Fee、Grand Total |
| Payment Details | 同 Order Success |
| Payment Proof | 已上传凭证预览 / Upload Payment Proof |
| Logistics | 运单号、物流时间轴（2B 回传后） |

**状态与主操作**：

| 状态 | 英文 | 主操作 |
|------|------|--------|
| 待转账 | Pending Payment | Copy Payment Details、Upload Payment Proof |
| 待确认收款 | Pending Confirmation | View / Supplement Payment Proof |
| 待发货 | Pending Shipment | — |
| 待收货 | Pending Receipt | View Logistics |
| 已完成 | Completed | **Publish to Store**（须 2B 已确认收款） |
| 已取消 | Cancelled | 仅主动取消，无超时取消 |

---

### 5.6 一键上架模块（Publish to Store）

#### 5.6.1 功能描述

2B 确认收款且采购订单完成后，2C 商家可对订单关联 **SPU** 执行 **Publish to Store**，将该 SPU 铺货至当前 2C 店铺。

#### 5.6.2 业务规则

1. **PUB-01**：操作前置条件 = 2B 已 **确认收款**（严格依赖，前端 + 后端双重校验）。
2. **PUB-02**：**铺货粒度 = SPU**；一次上架发布整个 SPU（下属 SKU 随 SPU 在 2C 店铺可售）。
3. **PUB-03**：**采购粒度 = SKU**；下单、订单明细、Checkout 均按 SKU 记录，与铺货粒度分离。
4. **PUB-04**：成功后该 **SPU** 在 Purchase Orders List **Published** Tab 可见，商品详情 SPU 铺货状态变为 Published。
5. 若 SPU 已 Published，按钮置灰或隐藏。

#### 5.6.3 交互说明

1. 入口：采购订单详情（Completed 状态）主按钮 **Publish to Store**。
2. 点击后 Loading；成功 Toast：`Published successfully.`；失败 Toast 并保留原状态。
3. 后端返回最新铺货状态，前端以接口数据刷新 UI。

---

### 5.7 转账凭证模块

#### 5.7.1 功能描述

支持商家在 Order Success 页与采购订单详情上传银行转账凭证，与 App 能力对齐。

#### 5.7.2 业务规则

1. 成功页、订单详情均可上传；已上传可在详情预览。
2. 文件格式、大小、张数限制对齐 App（R3）。
3. 上传不替代 2B 确认收款；状态跃迁仍以 2B 确认为准。

#### 5.7.3 交互说明

1. 点击 Upload Payment Proof → 选择文件 → 上传 Loading → 成功/失败反馈。
2. 支持重新上传或补充（以 App 规则为准）。

---

### 5.8 订单状态与流程

```
Order & Pay 提交
    → Pending Payment（待转账）
    → [线下转账 + Upload Payment Proof]
    → Pending Confirmation（待确认收款）
    → [2B 确认收款]
    → Pending Shipment（待发货）
    → [2B 发货]
    → Pending Receipt（待收货）
    → [签收]
    → Completed（已完成）
    → [Publish to Store] → SPU Published
```

**关键对齐**：2C Web 状态名、颜色、按钮与 **App 采购订单** 一致；2B 确认收款为状态跃迁权威来源。

---

## 六、数据模型

### 6.1 核心数据实体

| 实体名称 | 说明 | 关键字段 |
|---------|------|---------|
| **2C Shop（2C 店铺）** | 零售商家店铺 | shop_id, shop_name, bound_2b_supplier_id（绑定单一 2B 货源）, shop_address_id |
| **2B Product / SKU** | 2B 货源商品 | sku_id, spu_id, supplier_id, sku_code, purchase_price, stock, attributes, sellable_status |
| **2C Publish Record** | 2C 铺货记录（**SPU 维度**） | publish_id, shop_id, **spu_id**, publish_status（published/unpublished） |
| **Shipping Address** | 收货地址 | address_id, shop_id, recipient_name, phone, division, district, upazila, address_line, is_default, last_used_at |
| **Purchase Order（采购订单）** | 2C 向 2B 采购单 | order_id, order_no, shop_id, status, shipping_address_snapshot, shipping_method, payment_method, subtotal, shipping_fee, cod_handling_fee, grand_total, created_at |
| **Purchase Order Line** | 采购订单行 | line_id, order_id, sku_id, unit_price, quantity, line_subtotal |
| **Payment Account（2B 固定账户）** | 2B 收款账户配置 | supplier_id, bank_name, account_name, account_number, branch_code, swift_code |
| **Payment Proof** | 转账凭证 | proof_id, order_id, file_url, uploaded_at, uploaded_by |
| **Logistics Record** | 物流信息 | order_id, carrier, tracking_no, timeline_events[] |

### 6.2 枚举定义

| 枚举 | 值 | 英文展示 |
|------|-----|---------|
| shipping_method | standard | Standard |
| shipping_method | air_express | Air Express |
| shipping_method | air_priority | Air Priority |
| payment_method | bank_transfer | Bank Transfer |
| order_status | pending_payment | Pending Payment |
| order_status | pending_confirmation | Pending Confirmation |
| order_status | pending_shipment | Pending Shipment |
| order_status | pending_receipt | Pending Receipt |
| order_status | completed | Completed |
| order_status | cancelled | Cancelled |
| purchase_order_list_tab | all / published / unpublished | All / Published / Unpublished（**仅 Purchase Orders List**） |

### 6.3 数据更新与一致性

| 数据类型 | 更新频率 / 规则 |
|---------|----------------|
| 2B 商品列表、采购价、库存 | 实时或近实时（与 App 一致）；Checkout 提交时后端再次校验 |
| 运费、COD Handling Fee | 切换 Shipping Method 时实时试算 |
| 订单状态 | 2B 确认收款、发货、签收由 2B 端驱动；2C Web 轮询或消息推送刷新 |
| 铺货状态 | 一键上架成功后 **SPU** 状态即时更新；Purchase Orders List Published Tab 下次查询生效 |
| BDT 格式、银行名称 | 运营后台配置，配置变更后新订单展示新配置 |

---

## 七、非功能性需求

### 7.1 性能要求

| 指标 | 要求 |
|------|------|
| 选品列表首屏加载 | ≤ 2 秒（常规数据量） |
| Checkout 运费试算 | ≤ 1 秒 |
| Order & Pay 提交响应 | ≤ 3 秒（P95） |
| 凭证上传 | 单文件 ≤ 5MB 时 ≤ 10 秒 |
| 并发 | 同店铺多子账号同时选品/下单不互相阻塞 |

### 7.2 安全要求

1. 数据权限、下单、上传凭证、一键上架必须在 **服务端** 校验 shop_id 与角色权限。
2. Payment Details 收款账户信息防篡改，仅登录后可见；展示数据来源于服务端配置。
3. 凭证文件存储需鉴权访问，禁止公开 URL 泄露。
4. Order & Pay、查看 Payment Details、Publish to Store 记录操作审计日志。

### 7.3 兼容性要求

1. 浏览器：Chrome 90+、Safari 14+、Edge 90+。
2. Seller 后台布局适配；PC 优先，最小宽度建议 1280px。
3. 界面语言 **仅 English**。

### 7.4 可用性要求

1. 核心模块可用率 ≥ 99.9%。
2. 接口异常展示友好英文错误提示（如 `Update failed. Please try again later.`）。
3. 关键操作（Order & Pay、上传凭证、一键上架）均有 Loading 与失败 Retry 路径。

---

## 八、接口依赖清单

| 接口 | 用途 | 优先级 |
|------|------|--------|
| GET 2B 商品列表 | 选品列表 | P0 |
| GET 采购订单列表（含 **SPU** 铺货状态 Tab 筛选，仅 List） | Purchase Orders List | P0 |
| GET 2B 商品详情 | 商品详情 | P0 |
| POST 运费 / COD Fee 试算 | Checkout 切换 Shipping Method | P0 |
| POST 创建采购订单 | Order & Pay | P0 |
| GET 2B 固定收款账户 | Order Success、订单详情 Payment Details | P0 |
| POST 上传转账凭证 | Order Success、订单详情 | P0 |
| GET/POST 地址 CRUD | Checkout 地址（复用已有） | P0 |
| GET 采购订单列表 / 详情 | Purchase Orders | P0 |
| POST 一键上架 | Publish to Store | P0 |
| GET 推荐商品 | Order Success Recommend | P0 |
| GET BDT / 银行 / 安全文案配置 | 金额与 Payment Details 展示 | P0 |

---

## 九、验收标准

| 用例 ID | 场景 | 期望结果 |
|---------|------|---------|
| AC-01 | Checkout 默认加载 | 地址按 BR-ADDR 规则带出；Shipping Method 默认 Standard |
| AC-02 | 切换 Air Express | Shipping Fee、COD Handling Fee、Grand Total 实时更新 |
| AC-03 | Order Summary | Subtotal + Shipping Fee + COD Handling Fee = Grand Total |
| AC-04 | Security Reminder | 展示于 Order & Pay 按钮上方 |
| AC-05 | Order & Pay 成功 | 跳转 Order Success，Grand Total 与 Checkout 一致 |
| AC-06 | Payment Details | 展示 2B 固定账户，Copy 可用 |
| AC-07 | Upload Payment Proof | 成功页上传后详情可预览 |
| AC-08 | View Order List | 跳转 Purchase Orders List |
| AC-09 | Recommend | 展示推荐商品并可进入详情 |
| AC-10 | 超卖下单 | 库存不足仍可 Order & Pay 成功 |
| AC-11 | 2B 确认收款后 | 订单变 Pending Shipment；Publish to Store 可点击 |
| AC-12 | 一键上架 | 关联 **SPU** 在 Purchase Orders List Published Tab 可见 |
| AC-14 | 采购订单 List Tab | Unpublished 仅未铺货 SPU 订单；Published 仅已铺货 SPU 订单 |
| AC-15 | 采购订单 Detail | 无铺货 Tab；SKU 明细完整展示 |
| AC-16 | SPU 铺货 / SKU 采购 | 按 SKU 下单成功；一键上架后 SPU 变为 Published |
| AC-13 | 菜单区分 | Purchase Orders 与 Orders List 入口分离、命名正确 |

---

## 十、待确认项

| ID | 问题 | 确认方 |
|----|------|--------|
| R1 | 同一 SPU 多 SKU 分次采购时，List Tab 与一键上架 SPU 级联规则 | 研发 + 业务 |
| R2 | 子账号 RBAC：采购、上传凭证、一键上架权限细项 | 研发 + 业务 |
| R3 | 转账凭证格式、大小、张数（对齐 App） | App 产品 |
| R4 | COD Handling Fee 在 Standard / Air Express / Air Priority 下的计算规则 | 业务 + 2B |
| R5 | Recommend 推荐算法是否与 App 同一套 | 产品 + 研发 |

---

## 附录 A：界面英文文案速查

| 场景 | English |
|------|---------|
| 选品中心 | Product Sourcing |
| Checkout | Checkout |
| Standard | Standard |
| Air Express | Air Express |
| Air Priority | Air Priority |
| Bank Transfer | Bank Transfer |
| Subtotal | Subtotal |
| Shipping Fee | Shipping Fee |
| COD Handling Fee | COD Handling Fee |
| Grand Total | Grand Total |
| Order & Pay | Order & Pay |
| Order Submitted Successfully! | Order Submitted Successfully! |
| Upload Payment Proof | Upload Payment Proof |
| View Order List | View Order List |
| You May Also Like | You May Also Like |
| Purchase Orders | Purchase Orders |
| Orders List | Orders List |
| Publish to Store | Publish to Store |
| Pending Payment | Pending Payment |
| Pending Confirmation | Pending Confirmation |
| Pending Shipment | Pending Shipment |
| Pending Receipt | Pending Receipt |
| Completed | Completed |

---

*PRD V1.0.0 — 文档中文，界面 English。关联 Brainstorming v0.3。*
