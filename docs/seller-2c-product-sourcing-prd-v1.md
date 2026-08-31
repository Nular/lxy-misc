# Seller 后台 2C 店铺 — 选品中心（Product Sourcing）PRD

---

## 一、文档信息

| 项 | 内容 |
|----|------|
| **文档名称** | Seller 2C 选品中心 Product Sourcing PRD |
| **产品** | KickBazar Seller 后台（2C 商家端） |
| **文档版本** | v1.0 |
| **文档状态** | 评审稿 |
| **撰写语言** | 中文（界面文案为英语） |
| **目标市场** | 孟加拉国（Bangladesh） |
| **关联文档** | `docs/seller-2c-product-sourcing-brainstorming.md` v0.2 |
| **创建日期** | 2026-08-31 |
| **负责人** | 2C 店铺产品经理 |

### 修订记录

| 版本 | 日期 | 修订人 | 修订说明 |
|------|------|--------|---------|
| v1.0 | 2026-08-31 | — | 首版：含 Checkout、Order Success 字段与流程定稿 |

---

## 二、项目概述

### 2.1 背景

KickBazar 平台连接 **2B 货源端** 与 **2C 零售商家**。2C 商家可通过 App 完成选品、下单、银行转账、上传凭证、一键上架等操作。当前 2C 商家在 PC 办公场景缺乏对等能力，需在 **Seller Web 后台** 补齐选品与采购闭环。

### 2.2 目标

| 目标 | 说明 |
|------|------|
| **G1** | 在 Seller 2C 后台新增 **选品中心（Product Sourcing）** 菜单 |
| **G2** | Web 端完成：浏览 2B 商品 → 立即购买 → Checkout → 下单成功 → 转账指引 |
| **G3** | 支持 **采购订单（Purchase Orders）** 查询与详情操作，与消费者订单（Orders List）分离 |
| **G4** | 与 App、2B Web 在订单状态、转账、一键上架规则上 **保持一致** |

### 2.3 范围说明

#### In Scope（本期）

- 选品中心商品列表（Tab：全部 / 已发布 / 未发布，按 SKU）
- 搜索、橱窗型商品详情、立即购买
- **Checkout 结算页**（地址、商品、配送方式、支付方式、费用明细、安全提示、Order & Pay）
- **下单成功页**（成功话术、总价、Payment Details、View Order List、Recommend）
- 转账凭证上传、采购订单列表/详情、一键上架（2B 确认收款后）
- 界面语言：**仅英语**

#### Out of Scope（本期不做）

- 购物车（Cart）
- 多 2B 店铺混合选品
- 阶梯价 / 会员价
- 待转账超时自动取消
- 孟语界面
- 消费者侧 Orders List 功能改造（仅明确菜单区分）

### 2.4 成功指标

| 指标 | 目标 |
|------|------|
| 主路径可用性 | 2C 商家可在 Web 完成选品→Checkout→提交订单 |
| 跨端一致性 | 采购订单状态与 App 一致率 100% |
| 转账指引完整 | 成功页 Payment Details 字段完整可复制 |

---

## 三、用户角色与权限模型

### 3.1 角色定义

| 角色 | 说明 | 使用端 |
|------|------|--------|
| **2C 店铺主账号** | 零售商家主账号，拥有店铺全部操作权限 | Seller Web 2C |
| **2C 子账号** | 店铺员工账号，权限由主账号分配 | Seller Web 2C |
| **2B 货源方** | 确认收款、发货（非本期 2C PRD 实现范围） | 2B Web |
| **平台运营** | 配置 BDT 格式、银行名称等 | 运营后台 |

### 3.2 权限矩阵（2C Seller Web）

| 功能 | 主账号 | 子账号 | 备注 |
|------|--------|--------|------|
| 进入选品中心 | ✅ | ⚙️ 可配置 | 默认主账号可用 |
| 浏览商品列表 / 搜索 / 详情 | ✅ | ⚙️ | — |
| 立即购买、Checkout、Order & Pay | ✅ | ⚙️ | 建议与采购权限绑定 |
| 上传转账凭证 | ✅ | ⚙️ | 对齐 App |
| 查看采购订单列表 / 详情 | ✅ | ⚙️ | — |
| 一键上架 | ✅ | ⚙️ | 须 2B 已确认收款 |
| 地址管理（添加/编辑/设默认） | ✅ | ⚙️ | 复用已有地址流程 |

> **⚙️ 可配置**：子账号 RBAC 细则待与研发对齐（Brainstorming R2）。

### 3.3 数据隔离

- 每个 2C 店铺仅可见 **绑定单一 2B 货源** 的商品与采购订单。
- 采购订单与消费者订单数据 **分表/分接口**，菜单与路由分离。

---

## 四、功能需求总览

### 4.1 模块地图

```
选品中心 Product Sourcing
├── M1  商品列表（Tab + 搜索）
├── M2  商品详情（橱窗型）
├── M3  立即购买（规格/数量弹层）
├── M4  Checkout 结算页          ← 本期重点补充
├── M5  下单成功页               ← 本期重点补充
├── M6  采购订单列表
├── M7  采购订单详情
└── M8  一键上架 / 转账凭证
```

### 4.2 功能清单

| 模块 | 功能点 | 优先级 |
|------|--------|--------|
| M1 | 商品列表、Tab（全部/已发布/未发布）、分页 | P0 |
| M1 | 关键词搜索 | P0 |
| M2 | 橱窗型详情、SKU 选择、立即购买入口 | P0 |
| M3 | 数量选择（允许超卖）、进入 Checkout | P0 |
| M4 | 地址、商品信息、Shipping Method、Payment Method、费用明细、安全提示、Order & Pay | P0 |
| M5 | 成功话术、总价、Payment Details、View Order List、Recommend | P0 |
| M5 | 上传转账凭证 | P0 |
| M6 | 采购订单列表（状态 Tab） | P0 |
| M7 | 订单详情、物流、Payment Details、上传凭证 | P0 |
| M8 | 一键上架（2B 确认收款后） | P0 |

### 4.3 核心流程图

```
商品详情 → 立即购买（选 SKU/数量）
    → Checkout（地址 + 配送 + 支付 + 费用确认）
    → 点击 [Order & Pay]
    → 下单成功页（话术 + Payment Details + 凭证上传）
    → 线下转账 → 上传凭证
    → 2B 确认收款 → 待发货 → 待收货 → 已完成
    → 一键上架（Publish to Store）
```

---

## 五、功能需求详述

---

### M1 选品中心 — 商品列表

#### 5.1.1 功能描述

展示绑定 **单一 2B 货源** 的可售商品，支持 Tab 筛选与搜索。

#### 5.1.2 业务规则

| 规则 ID | 规则 |
|---------|------|
| BR-01 | 数据源为绑定单一 2B 店铺商品 |
| BR-03~05 | 已发布/未发布按 **SKU** 判定 |
| BR-07 | 展示单一 **采购价**，无阶梯价/会员价 |

#### 5.1.3 页面元素

| 元素 | 说明 |
|------|------|
| 搜索框 | 支持商品名称、货号/SKU 编码 |
| Tab | All / Published / Unpublished |
| 商品卡片 | 主图、标题、采购价（BDT）、Published 标签（若该 SKU 已铺货） |
| 分页 | 每页条数与 Seller 后台统一 |

#### 5.1.4 交互

- 点击卡片 → 商品详情（M2）
- Tab 切换保留搜索词 `q`
- URL：`/seller/2c/sourcing?tab=all|published|unpublished&q=`

---

### M2 商品详情（橱窗型）

#### 5.2.1 功能描述

以采购决策为导向的商品详情页，支持 SKU 选择与立即购买。

#### 5.2.2 字段

| 字段 | 说明 | 必填展示 |
|------|------|---------|
| Product Images | 主图画廊 | ✅ |
| Product Title | 商品标题 | ✅ |
| SKU Code | 货号 | ✅ |
| Publish Status | Published / Unpublished（按当前 SKU） | ✅ |
| Purchase Price | 采购价（BDT） | ✅ |
| Stock | 库存（仅供参考，允许超卖） | ✅ |
| SKU Attributes | 颜色、尺码等 | 有则展示 |
| Description | 图文详情 | ✅ |

#### 5.2.3 交互

- 底栏 Sticky **[Buy Now]** → M3 立即购买弹层
- 切换 SKU 时更新价格、库存、Publish Status

---

### M3 立即购买

#### 5.3.1 功能描述

在下单前确认 SKU 与数量，进入 Checkout。

#### 5.3.2 字段与规则

| 字段 | 规则 |
|------|------|
| Selected SKU | 当前选中规格 |
| Unit Price | 采购单价（BDT） |
| Quantity | 受 MOQ 约束；**允许超卖**（库存不足仍可下单） |
| Subtotal Preview | 单价 × 数量 |

#### 5.3.3 交互

- **[Confirm]** → 跳转 Checkout（M4），携带 SKU、数量等结算参数
- **[Cancel]** → 关闭弹层

---

### M4 Checkout 结算页（核心）

#### 5.4.1 功能描述

商家确认收货信息、配送方式、支付方式及费用明细后，通过 **[Order & Pay]** 提交采购订单。本期支付方式仅 **Bank Transfer**。

#### 5.4.2 页面结构

```
┌─────────────────────────────────────────────────────────┐
│ Breadcrumb: Product Sourcing > Checkout                  │
├─────────────────────────────────────────────────────────┤
│ [1] Shipping Address                                     │
│ [2] Product Information                                  │
│ [3] Shipping Method                                      │
│ [4] Payment Method                                       │
│ [5] Order Summary（Subtotal / Shipping Fee / COD Fee / Grand Total）│
│ [6] Security Reminder                                    │
│ [7] [ Order & Pay ]                                      │
└─────────────────────────────────────────────────────────┘
```

#### 5.4.3 区块详述

##### （1）Shipping Address 收货地址

| 字段 | 英文界面文案 | 说明 |
|------|-------------|------|
| Recipient Name | Recipient Name | 收货人 |
| Phone | Phone Number | +880 格式 |
| Division / District / Upazila | — | 孟加拉行政区 |
| Detailed Address | Address | 街道门牌等 |
| Default Tag | Default | 默认地址标识 |

**默认逻辑（BR-ADDR）**：

1. 优先使用 **近期收货地址**（最近一次采购/收货使用地址）
2. 若无近期地址 → 使用 **2C 店铺地址**
3. 支持：**Change**（选择其他地址）、**Add New**、**Edit**、**Set as Default**（复用 Seller 已有地址流程）

##### （2）Product Information 商品信息

| 字段 | 说明 |
|------|------|
| Product Image | 缩略图 |
| Product Title | 商品标题 |
| SKU Attributes | 规格（如 Color: Red, Size: M） |
| SKU Code | 货号 |
| Unit Price | 采购单价（BDT） |
| Quantity | 数量（只读，来自 M3；本期无购物车不可在本页改量，需返回详情修改） |
| Line Subtotal | 行小计 = Unit Price × Quantity |

> 本期单笔立即购买，清单为 **单行或多 SKU 仅当从同一详情多次购买合并** 时扩展；默认 **单 SKU 单行**。

##### （3）Shipping Method 配送方式

| 选项值 | 英文展示 | 说明 |
|--------|---------|------|
| `standard` | Standard | 标准配送 |
| `air_express` | Air Express | 航空快递 |
| `air_priority` | Air Priority | 航空优先 |

| 规则 | 说明 |
|------|------|
| SM-01 | 三选一，默认 **Standard** |
| SM-02 | 切换配送方式时 **实时重算** Shipping Fee、COD Handling Fee（如有）、Grand Total |
| SM-03 | 运费规则由 **2B/平台配置**，前端按接口返回展示 |

##### （4）Payment Method 支付方式

| 选项值 | 英文展示 | 说明 |
|--------|---------|------|
| `bank_transfer` | Bank Transfer | 本期 **唯一** 支付方式，默认选中且不可切换 |

##### （5）Order Summary 结算信息

| 字段 | 英文展示 | 计算规则 |
|------|---------|---------|
| Subtotal | Subtotal | 商品行小计之和 |
| Shipping Fee | Shipping Fee | 根据 Shipping Method 计算 |
| COD Handling Fee | COD Handling Fee | 根据配送方式/平台规则计算（即使支付为转账，仍按业务配置展示该项） |
| Grand Total | Grand Total | Subtotal + Shipping Fee + COD Handling Fee |

**金额展示**：

- 货币：**BDT（৳）**
- 格式：由运营后台配置（千分位等，PAY-08）

##### （6）Security Reminder 安全信息提醒

固定或配置化安全提示文案，建议包含：

| 要点 | 示例文案（English） |
|------|-------------------|
| 转账安全 | Only transfer to the **official bank account** shown after order submission. |
| 金额一致 | Please ensure the transfer amount matches the **Grand Total**. |
| 订单备注 | Include your **Order Number** in the transfer reference/note. |
| 防诈骗 | KickBazar will never ask you to transfer to a personal account via chat. |

展示形式：信息提示条（Info Banner）或折叠面板，位于 Order Summary 下方、按钮上方。

##### （7）主操作按钮 Order & Pay

| 属性 | 说明 |
|------|------|
| 文案 | **Order & Pay** |
| 前置校验 | 地址完整、配送方式已选、支付方式已选、Grand Total > 0 |
| 点击后 | 创建采购订单 → 跳转下单成功页（M5） |
| 加载态 | 提交中禁用按钮，防重复提交 |

#### 5.4.4 Checkout 提交数据（接口草案）

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

#### 5.4.5 异常与边界

| 场景 | 处理 |
|------|------|
| 地址为空 | 阻断提交，引导 Add New Address |
| 运费接口失败 | 提示重试，保留已填信息 |
| 提交失败 | Toast 错误信息，保留 Checkout 状态 |
| 价格变动 | 提交前后端校验；若变价提示刷新 Checkout |

---

### M5 下单成功页（Order Success）

#### 5.5.1 功能描述

订单创建成功后展示确认信息与转账指引，引导商家完成线下转账、上传凭证，并提供订单入口与推荐商品。

#### 5.5.2 页面结构

```
┌─────────────────────────────────────────────────────────┐
│ Success Icon + Success Message                           │
│ Grand Total（总价）                                      │
│ Payment Details（收款账户 + 订单信息）                   │
│ Upload Payment Proof（上传转账凭证）                     │
│ [ View Order List ]                                      │
│ Recommend（推荐商品）                                    │
└─────────────────────────────────────────────────────────┘
```

#### 5.5.3 区块详述

##### （1）Success Message 成功话术

| 元素 | 说明 |
|------|------|
| 图标 | 成功状态图标（绿色勾） |
| 主标题 | 示例：`Order Submitted Successfully!` |
| 副文案 | 示例：`Your purchase order has been created. Please complete the bank transfer and upload your payment proof.` |
| 订单号 | `Order No.: PO202608310001`（可复制） |
| 订单状态 | `Pending Payment` |

##### （2）Grand Total 总价

| 字段 | 说明 |
|------|------|
| Grand Total | 与 Checkout 提交时 **Grand Total** 一致（BDT） |
| 明细折叠（可选） | Subtotal / Shipping Fee / COD Handling Fee |

##### （3）Payment Details 支付详情

展示 **2B 店铺固定收款账户**（PAY-02）及转账必要信息：

| 字段 | 英文展示 | 说明 |
|------|---------|------|
| Payment Method | Bank Transfer | 固定 |
| Bank Name | Bank Name | 后台配置 |
| Account Name | Account Name | 收款户名 |
| Account Number | Account Number | 可复制 |
| Branch / SWIFT | Branch / SWIFT Code | 如有则展示 |
| Amount to Pay | Amount to Pay | = Grand Total，可复制 |
| Transfer Note | Transfer Note | 提示备注 Order Number |

每项支持 **Copy** 按钮（账号、金额、订单号）。

##### （4）Upload Payment Proof 上传转账凭证

| 属性 | 说明 |
|------|------|
| 时机 | 成功页即可上传；订单详情可补充 |
| 格式/大小 | 对齐 App（待 R3 确认：如 JPG/PNG，≤5MB） |
| 上传后 | 订单可进入「待确认收款」流程（与 2B 确认并行） |

##### （5）View Order List

| 属性 | 说明 |
|------|------|
| 文案 | **View Order List** |
| 跳转 | 采购订单列表 `/seller/2c/sourcing/orders` |
| 类型 | 主按钮或次级按钮 |

##### （6）Recommend 推荐商品

| 属性 | 说明 |
|------|------|
| 标题 | 示例：`You May Also Like` / `Recommended Products` |
| 内容 | 2B 货源商品推荐（算法或热销兜底，对齐 App 若有） |
| 布局 | 横向滑动或网格，复用商品卡片组件 |
| 交互 | 点击 → 商品详情（M2） |

#### 5.5.4 URL

`/seller/2c/sourcing/checkout/result?orderId={id}`

---

### M6 采购订单列表（Purchase Orders List）

#### 5.6.1 功能描述

独立菜单 **Purchase Orders**，与消费者 **Orders List** 分开。

#### 5.6.2 状态 Tab

| Tab | 英文 | 说明 |
|-----|------|------|
| 全部 | All | — |
| 待转账 | Pending Payment | 已下单未转账/未上传凭证 |
| 待确认收款 | Pending Confirmation | 已转账待 2B 确认 |
| 待发货 | Pending Shipment | 2B 已确认收款 |
| 待收货 | Pending Receipt | 已发货 |
| 已完成 | Completed | 已签收 |

> **无**待转账超时自动取消（PAY-07）。

#### 5.6.3 列表卡片字段

Order No.、Status、Product Image、Item Count、Grand Total、Created Time、**View Detail**

---

### M7 采购订单详情

#### 5.7.1 功能描述

展示采购单全貌，支持查看 Payment Details、上传凭证、查看物流、一键上架。

#### 5.7.2 信息区块

| 区块 | 字段 |
|------|------|
| 状态区 | 当前状态、状态时间轴 |
| 商品信息 | 同 Checkout Product Information |
| 地址 | Shipping Address 快照 |
| 配送 | Shipping Method |
| 费用 | Subtotal、Shipping Fee、COD Handling Fee、Grand Total |
| Payment Details | 同成功页（固定 2B 账户） |
| 凭证 | 已上传凭证预览 / Upload Payment Proof |
| 物流 | 运单号、物流时间轴（2B 回传后） |

#### 5.7.3 状态与操作

| 状态 | 主操作 |
|------|--------|
| Pending Payment | Copy Payment Details、Upload Payment Proof |
| Pending Confirmation | View / Supplement Payment Proof |
| Pending Shipment | — |
| Pending Receipt | View Logistics |
| Completed | **Publish to Store**（一键上架，须 2B 已确认收款） |

---

### M8 一键上架 & 转账凭证（跨页面能力）

#### 5.8.1 一键上架（Publish to Store）

| 规则 | 说明 |
|------|------|
| PUB-01 | **严格依赖** 2B 已确认收款 |
| PUB-02 | 按 **SKU** 铺货至当前 2C 店铺 |
| PUB-03 | 成功后该 SKU 在选品列表 Tab **Published** 可见 |

#### 5.8.2 转账凭证

| 规则 | 说明 |
|------|------|
| PROOF-01 | 成功页、订单详情均可上传 |
| PROOF-02 | 与 App 能力对齐 |

---

## 六、业务规则汇总

| 规则 ID | 规则摘要 |
|---------|---------|
| BR-01 | 单一 2B 货源 |
| BR-03~05 | 发布状态按 SKU |
| BR-07 | 无阶梯/会员价 |
| BR-ADDR | 近期地址优先，否则店铺地址 |
| PAY-01~08 | 银行转账、固定账户、凭证上传、无超时取消、BDT 配置 |
| SM-01~03 | 三种配送方式、切换重算费用 |
| PUB-01~03 | 一键上架依赖 2B 确认收款 |

---

## 七、订单状态与流程

```
提交订单（Order & Pay）
    → Pending Payment（待转账）
    → [转账 + 上传凭证]
    → Pending Confirmation（待确认收款）
    → [2B 确认收款]
    → Pending Shipment（待发货）
    → [2B 发货]
    → Pending Receipt（待收货）
    → [签收]
    → Completed（已完成）
    → [Publish to Store] → SKU Published
```

| 英文状态 | 中文 |
|---------|------|
| Pending Payment | 待转账 |
| Pending Confirmation | 待确认收款 |
| Pending Shipment | 待发货 |
| Pending Receipt | 待收货 |
| Completed | 已完成 |
| Cancelled | 已取消（仅主动取消，无超时） |

---

## 八、数据字段定义（Checkout & Success 核心）

### 8.1 Checkout 页字段表

| 区块 | 字段名 | 类型 | 必填 | 英文文案 |
|------|--------|------|------|---------|
| Address | recipientName | string | ✅ | Recipient Name |
| Address | phone | string | ✅ | Phone Number |
| Address | division/district/upazila | string | ✅ | — |
| Address | addressLine | string | ✅ | Address |
| Product | skuId | string | ✅ | — |
| Product | productTitle | string | ✅ | — |
| Product | skuAttributes | object | — | — |
| Product | unitPrice | decimal | ✅ | Unit Price |
| Product | quantity | int | ✅ | Quantity |
| Product | lineSubtotal | decimal | ✅ | — |
| Shipping | shippingMethod | enum | ✅ | Shipping Method |
| Payment | paymentMethod | enum | ✅ | Payment Method |
| Summary | subtotal | decimal | ✅ | Subtotal |
| Summary | shippingFee | decimal | ✅ | Shipping Fee |
| Summary | codHandlingFee | decimal | ✅ | COD Handling Fee |
| Summary | grandTotal | decimal | ✅ | Grand Total |

### 8.2 Success 页字段表

| 字段名 | 说明 | 英文文案 |
|--------|------|---------|
| orderNo | 采购订单号 | Order No. |
| orderStatus | 订单状态 | Status |
| successTitle | 成功主标题 | Order Submitted Successfully! |
| successMessage | 成功副文案 | （见 5.5.3） |
| grandTotal | 应付总额 | Grand Total |
| bankName | 银行名称 | Bank Name |
| accountName | 户名 | Account Name |
| accountNumber | 账号 | Account Number |
| branchCode | 支行/SWIFT | Branch / SWIFT Code |
| amountToPay | 应付金额 | Amount to Pay |
| paymentProof | 凭证文件 | Upload Payment Proof |

---

## 九、非功能需求

| 维度 | 要求 |
|------|------|
| 语言 | 界面仅 **英语** |
| 货币 | BDT，格式后台配置 |
| 安全 | 收款账户防篡改；敏感信息登录后可见 |
| 性能 | 列表首屏 < 2s；Checkout 运费重算 < 1s |
| 兼容 | Seller 后台布局；最小宽度 1280px 优先 |
| 审计 | Order & Pay、查看 Payment Details 记日志 |

---

## 十、接口依赖

| 接口 | 用途 |
|------|------|
| GET 2B 商品列表/详情 | M1、M2 |
| POST 运费试算 | Checkout 切换 Shipping Method |
| POST 创建采购订单 | Order & Pay |
| GET 2B 固定收款账户 | Success、订单详情 |
| POST 上传转账凭证 | Success、订单详情 |
| GET/POST 地址 CRUD | Checkout 地址（复用已有） |
| GET 采购订单列表/详情 | M6、M7 |
| POST 一键上架 | M8 |
| GET 推荐商品 | Success Recommend |
| GET BDT/银行配置 | Payment Details 展示 |

---

## 十一、验收标准

| 用例 ID | 场景 | 期望结果 |
|---------|------|---------|
| AC-01 | Checkout 默认加载 | 地址按 BR-ADDR 带出；Shipping Method 默认 Standard |
| AC-02 | 切换 Air Express | Shipping Fee、Grand Total 实时更新 |
| AC-03 | Order Summary | Subtotal + Shipping Fee + COD Handling Fee = Grand Total |
| AC-04 | 安全提示 | Security Reminder 展示在按钮上方 |
| AC-05 | Order & Pay 成功 | 跳转成功页，Grand Total 与 Checkout 一致 |
| AC-06 | Payment Details | 展示 2B 固定账户，支持 Copy |
| AC-07 | View Order List | 跳转 Purchase Orders List |
| AC-08 | Recommend | 展示推荐商品，可点击进入详情 |
| AC-09 | 上传凭证 | 成功页上传后订单详情可查看 |
| AC-10 | 超卖下单 | 库存不足仍可 Order & Pay 成功 |

---

## 十二、待确认项

| ID | 问题 | 确认方 |
|----|------|--------|
| R1 | SPU 卡片部分 SKU 已发布时的 Tab 筛选展示 | 研发+设计 |
| R2 | 子账号 RBAC 细项 | 研发+业务 |
| R3 | 凭证格式、大小、张数（对齐 App） | App 产品 |
| R4 | COD Handling Fee 在各 Shipping Method 下的计算规则 | 业务+2B |
| R5 | Recommend 推荐算法是否与 App 同一套 | 产品+研发 |

---

## 附录 A：Checkout → Success 流程泳道图

```
2C商家          Seller Web           交易中台           2B
  │                │                    │                │
  │─ Buy Now ─────►│                    │                │
  │─ Checkout ────►│                    │                │
  │─ Order&Pay ───►│─ 创建采购单 ──────►│                │
  │                │◄─ orderId ────────│                │
  │◄─ Success页 ──│                    │                │
  │─ 线下转账 ──────────────────────────────────────────►│
  │─ 上传凭证 ────►│─ 保存凭证 ────────►│                │
  │                │                    │─ 待确认收款 ──►│
  │                │                    │◄─ 确认收款 ────│
  │◄─ 状态更新 ────│◄───────────────────│                │
  │─ 一键上架 ────►│─ 铺货 SKU ────────►│                │
```

---

## 附录 B：界面文案速查（English）

| 场景 | 文案 |
|------|------|
| Checkout 标题 | Checkout |
| 配送 Standard | Standard |
| 配送 Air Express | Air Express |
| 配送 Air Priority | Air Priority |
| 支付 | Bank Transfer |
| 小计 | Subtotal |
| 运费 | Shipping Fee |
| COD 手续费 | COD Handling Fee |
| 总计 | Grand Total |
| 提交按钮 | Order & Pay |
| 成功标题 | Order Submitted Successfully! |
| 查看订单 | View Order List |
| 推荐标题 | You May Also Like |
| 上传凭证 | Upload Payment Proof |
| 一键上架 | Publish to Store |

---

*PRD v1.0 — 界面英语，文档中文。关联 Brainstorming v0.2。*
