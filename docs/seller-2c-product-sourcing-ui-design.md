# Seller 2C 选品中心 — UI/UX 设计规范

> **关联 PRD**：用户修订版 v1.0（2026/08/31）  
> **设计范围**：Product Sourcing 全链路 6 个核心页面 + 2 个弹层  
> **界面语言**：English only  
> **终端**：Seller Web 后台，PC 优先（≥1280px）

---

## 一、设计目标与原则

### 1.1 设计目标

| 目标 | 说明 |
|------|------|
| **短路径采购** | 列表 → 详情 → Buy Now → Checkout → Order & Pay ≤ 4 步 |
| **转账可信** | Payment Details、Security Reminder 视觉权重高，Copy 操作显眼 |
| **铺货状态可读** | SPU 三态 Tag（Published / Partially Published / Unpublished）一眼可辨 |
| **与 Seller 后台一致** | 复用现有顶栏、侧栏、表格、表单、地址组件样式 |

### 1.2 设计原则

1. **信息密度适中**：B2B 采购场景，列表与 Checkout 偏「清单型」而非 ToC 营销风。
2. **状态双轨展示**：订单 **Order Status**（履约）与 **Publish Status**（铺货）分开展示，不混用颜色语义。
3. **主操作单一**：每页仅 1 个 Primary Button（Buy Now / Order & Pay / Publish to Store）。
4. **英文文案严格对齐 PRD**，拼写统一：`Partially`（非 Partilly）。

---

## 二、信息架构与导航

```
Seller 2C Sidebar
├── Product Sourcing          ← 一级菜单（新增）
│   ├── Product Discovery     ← 默认子页 / 列表
│   ├── Product Detail        ← 详情
│   ├── Checkout
│   ├── Order Success
│   └── Purchase Orders       ← 子菜单或列表右上角入口
│       └── Purchase Order Detail
└── Orders List               ← 消费者订单（已有，分离）
```

**面包屑规范**：

| 页面 | Breadcrumb |
|------|------------|
| Product Discovery | Product Sourcing |
| Product Detail | Product Sourcing > Product Detail |
| Checkout | Product Sourcing > Checkout |
| Order Success | Product Sourcing > Order Success |
| Purchase Orders List | Product Sourcing > Purchase Orders |
| Purchase Order Detail | Product Sourcing > Purchase Orders > {Order No.} |

---

## 三、设计系统（Design Tokens）

### 3.1 布局

| Token | 值 | 用途 |
|-------|-----|------|
| `page-max-width` | 1200px | 内容区最大宽度，居中 |
| `page-padding` | 24px | 页面左右内边距 |
| `section-gap` | 24px | 区块垂直间距 |
| `card-padding` | 16px / 20px | 卡片内边距 |
| `grid-cols-product` | 4（≥1280）/ 3（1024–1279） | 商品卡片网格 |

### 3.2 颜色语义（映射 Seller 主题）

| 语义 | 用途 | Pill / Tag |
|------|------|------------|
| **Success** | Published、成功态 | 绿系 |
| **Warning** | Partially Published | 橙系 |
| **Neutral** | Unpublished | 灰系 |
| **Info** | Pending Payment、Processing | 蓝系 |
| **Accent** | Primary CTA | 品牌主色 |

### 3.3 铺货状态 Tag（SPU）

| 状态 | 英文文案 | 色板 | 出现位置 |
|------|---------|------|---------|
| 全部上架 | **Published** | Success | 列表卡片、详情、搜索结果的 SPU |
| 部分上架 | **Partially Published** | Warning | 同上 |
| 未上架 | **Unpublished** | Neutral | 同上 |

### 3.4 订单状态 Tag（Order Status）

| 状态 | 英文 | 说明 |
|------|------|------|
| 待付款 | Pending Payment | 下单后初始 |
| 买家已付 | Buyer Paid | 已转账待确认 |
| 待处理 | Pending | — |
| 处理中 | Processing | — |
| 已发货 | Shipped | — |
| 已完成 | Completed | 可 Publish to Store |

### 3.5 按钮层级

| 层级 | 样式 | 示例 |
|------|------|------|
| Primary | 实心主色 | Order & Pay、Buy Now、Publish to Store |
| Secondary | 描边 | View Order List、Change Address |
| Tertiary / Link | 文字链 | Copy、Add a New Address |
| Destructive | 红色描边/文字 | Delete（地址） |

---

## 四、页面设计详述

---

### 4.1 Product Discovery（选品列表）

**路由**：Product Sourcing 默认页

#### 布局线框

```
┌──────────────────────────────────────────────────────────────────┐
│ Product Sourcing                                                  │
├──────────────────────────────────────────────────────────────────┤
│ [🔍 Search by product name, SKU code...          ] [Search] [×]  │
├──────────────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                 │
│ │ [img]   │ │ [img]   │ │ [img]   │ │ [img]   │   4-col grid    │
│ │ Title   │ │ Title   │ │ Title   │ │ Title   │                 │
│ │ ৳ price │ │ ৳ price │ │ ৳ price │ │ ৳ price │                 │
│ │[Partial]│ │[Publish]│ │[Unpub.] │ │[Publish]│  SPU publish tag│
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘                 │
│                        [ Pagination ]                             │
│                                          [ Purchase Orders → ]    │
└──────────────────────────────────────────────────────────────────┘
```

#### 组件规格

| 元素 | 规格 |
|------|------|
| 搜索框 | 宽度 100% max 480px；Placeholder: `Search by product name or SKU code`；Enter 或 Search 按钮触发 |
| 商品卡片 | 圆角 8px；Hover 阴影（沿用 Seller 卡片规范）；点击整卡进详情 |
| 主图 | 1:1 比例，lazy load |
| 标题 | 最多 2 行 ellipsis |
| 采购价 | `Purchase Price` 标签 + BDT 金额，千分位 |
| Publish Tag | 卡片左上角或标题下 Pill；三态见 3.3 |
| 空状态 | 插画 + `NO DATA` + CTA `Back to Product Sourcing` |
| 右上角 | 文字链 `Purchase Orders` 进采购订单列表 |

#### 搜索态

- 搜索结果显示 **带 Publish Tag 的 SPU 卡片**（与列表一致）
- 清除按钮 `×` 重置列表

---

### 4.2 Product Detail（橱窗型详情）

**路由**：Product Sourcing > Product Detail

#### 布局线框（PC 双栏）

```
┌──────────────────────────────────────────────────────────────────┐
│ Product Sourcing > Product Detail                                   │
├────────────────────────────┬─────────────────────────────────────┤
│  ┌──────────────────────┐  │  Product Title                       │
│  │                      │  │  [Partially Published]               │
│  │    Main Image        │  │  SKU Code: XXX-001                   │
│  │                      │  │                                      │
│  └──────────────────────┘  │  Color: [Red][Blue][Green]          │
│  [thumb][thumb][thumb]     │  Size:  [S][M][L][XL]               │
│                              │  Purchase Price: ৳ 1,250.00         │
│                              │  Stock: 120 (reference only)        │
│                              │                                      │
│                              │  [ Description | Specifications ]    │
│                              │  ┌─────────────────────────────┐    │
│                              │  │  Rich text / images         │    │
│                              │  └─────────────────────────────┘    │
├────────────────────────────┴─────────────────────────────────────┤
│                              [ Buy Now ]          ← sticky footer  │
└──────────────────────────────────────────────────────────────────┘
```

#### 交互

- SKU 属性：Chip 单选；缺货 SKU 可选（超卖），可加 `Low stock` 提示
- **Buy Now** → 打开 Buy Now Modal（4.3）
- Publish Tag 为 **SPU 级**，切换 SKU 不改变 Tag

---

### 4.3 Buy Now Modal（立即购买弹层）

```
┌─────────────────────────────────────┐
│ Buy Now                        [×]  │
├─────────────────────────────────────┤
│ [img]  Product Title                │
│        Color: Red  Size: M          │
│        SKU Code: XXX-001-R-M          │
│                                     │
│  Unit Price          ৳ 1,250.00     │
│  Quantity            [ − ] 2 [ + ]  │
│  MOQ: 1                             │
│  ─────────────────────────────────  │
│  Subtotal            ৳ 2,500.00     │
│                                     │
│        [ Cancel ]    [ Confirm ]    │
└─────────────────────────────────────┘
```

- Quantity 步进器；MOQ 默认 1
- **Confirm** → Checkout（携带 skuId, quantity）

---

### 4.4 Checkout（结算页）

**路由**：Product Sourcing > Checkout

#### 布局：左主内容 + 右 Order Summary 粘性侧栏（PC）

```
┌──────────────────────────────────────────────────────────────────┐
│ Product Sourcing > Checkout                                       │
├────────────────────────────────────┬─────────────────────────────┤
│ 1. Shipping Address                │   Order Summary (sticky)    │
│ ┌──────────────────────────────┐   │   Subtotal      ৳ 2,500   │
│ │ Recipient · Phone            │   │   Shipping Fee   ৳ 50    │
│ │ Division, District, Area       │   │   COD Handling   ৳ 10    │
│ │ Address line...              │   │   ─────────────────────    │
│ │ [Default]                    │   │   Grand Total   ৳ 2,560   │
│ │ Change · Edit · Add New...   │   │                           │
│ └──────────────────────────────┘   │   ℹ Security Reminder     │
│                                    │   • All information is...  │
│ 2. Product Information           │   • All data is safeguarded  │
│ [img] Title · SKU attrs          │   • KickBazar never sells... │
│ Qty: [editable stepper]          │                           │
│ Unit · Line subtotal             │   [ Order & Pay ]          │
│                                    │   Terms & Privacy note     │
│ 3. Shipping Method               │                           │
│ ○ Standard  ○ Air Express         │                           │
│ ○ Air Priority                    │                           │
│                                    │                           │
│ 4. Payment Method                │                           │
│ ● Bank Transfer                   │                           │
│   All data is encrypted.          │                           │
└────────────────────────────────────┴─────────────────────────────┘
```

#### 关键差异（相对旧版）

| 项 | 设计 |
|----|------|
| Quantity | Checkout 内 **可编辑**（步进器），实时重算 Subtotal / Grand Total |
| 地址操作 | Change、Add a New Address、Delete、Copy、Edit、Set as Default |
| Payment 下 | 辅助文案 `All data is encrypted.` |
| Grand Total 下 | 法务小字：Terms & Conditions + Privacy Policy 同意说明 |
| Security Reminder | 3 条英文要点，Info Banner 样式 |

#### Mobile（<1024）

- Order Summary 沉底 Sticky Bar，展开可看明细 + Order & Pay

---

### 4.5 Order Success（下单成功）

```
┌──────────────────────────────────────────────────────────────────┐
│                        ✓  (success icon)                          │
│              Order placed successfully!                           │
│   Stock is limited. Please pay promptly and include your        │
│   Order ID in the note (e.g., Order:111111111000000000)         │
│                                                                 │
│   Order No.  PO202608310001                        [Copy]       │
│   Status     Pending Payment                                    │
│                                                                 │
│   Grand Total                              ৳ 2,560.00           │
│   [ v Fee breakdown ]                                           │
│                                                                 │
│ ┌─ Payment Details ─────────────────────────────────────────┐  │
│ │ Bank Transfer                                              │  │
│ │ Bank Name / Account Name / Account Number [Copy]           │  │
│ │ Branch/SWIFT · Amount to Pay [Copy] · Transfer Note        │  │
│ └────────────────────────────────────────────────────────────┘  │
│                                                                 │
│ Upload Payment Proof    [ Choose file ]  JPG/PNG ≤5MB           │
│                                                                 │
│ [ View Order List ]              Continue Shopping →            │
│                                                                 │
│ ── You May Also Like ────────────────────────────────────────  │
│ [card][card][card][card]  horizontal scroll                     │
└──────────────────────────────────────────────────────────────────┘
```

- Payment Details 区块使用浅底卡片 + Copy 图标按钮
- Recommend：横向滚动商品卡，逻辑与 App 一致

---

### 4.6 Purchase Orders List

**入口**：Product Sourcing > Purchase Orders（对齐已有 b2bList 模块风格）

#### 布局

```
┌──────────────────────────────────────────────────────────────────┐
│ Product Sourcing > Purchase Orders                                │
├──────────────────────────────────────────────────────────────────┤
│ [ All ] [ Published ] [ Unpublished ]     ← 仅 List 有 Tab       │
├──────────────────────────────────────────────────────────────────┤
│ Order No. │ Status │ Created At ↕ │ Items │ Published │ Pub. │ Op│
│ PO001...  │ Pending│ 2026/08/31   │   1   │  0/1      │ Unpub│View│
│ PO002...  │ Shipped│ 2026/08/30   │   1   │  1/1      │ Pub  │View│
├──────────────────────────────────────────────────────────────────┤
│ Empty: No records available                                     │
└──────────────────────────────────────────────────────────────────┘
```

#### 表格列（PRD 对齐）

| 列 | 字段 | 宽度 | 排序 |
|----|------|------|------|
| Order No. | orderNo | 160px | — |
| Order Status | orderStatus | 140px | — |
| Created At | createAt | 180px | 默认倒序，可排序 |
| Item Count | itemCount | 100px | 可排序 |
| Published Items | publishedItems | 120px | 显示 `0/1` 或 `1/1` |
| Publish Status | publishStatus | 130px | Published / Unpublished |
| Operate | View | 80px | 链接按钮 |

**Publish Status 规则**：

- `publishedItems = 0/1` → **Unpublished**
- `publishedItems = 1/1` → **Published**

Tab 筛选：**SKU 铺货状态**（本期每单 1 SKU）

---

### 4.7 Purchase Order Detail

**说明**：基于已有订单详情模块扩展；**无铺货 Tab**。

#### 区块顺序（自上而下）

1. **Status Header**：当前 Order Status + 时间轴
2. **Customer**（若有）
3. **Product Information**：SKU 行（图、属性、单价、数量、小计）
4. **Order Summary**：Subtotal / Shipping / COD / Grand Total
5. **Billing Address**
6. **Shipping Address**（快照）
7. **Shipping Method**
8. **Payment Details**（同 Success 页结构）
9. **Payment Proof**：预览 + Upload
10. **Logistics**：运单号 + 时间轴
11. **Footer Action**：`Publish to Store`（Primary，条件满足时显示）

**Publish to Store 显示条件**：

- Order Status = 可上架态（PRD：Pending 且 2B 已确认收款——与研发确认精确状态枚举）
- 关联 SKU 未 Published → 显示按钮
- SPU 已全 Published → **隐藏**按钮

---

## 五、组件清单（研发复用）

| 组件 | 新建/复用 | 说明 |
|------|----------|------|
| `PublishStatusPill` | 新建 | 三态 SPU Tag |
| `OrderStatusPill` | 复用/扩展 | 订单履约状态 |
| `ProductCard` | 新建 | SPU 卡片 |
| `CopyableField` | 复用 | Payment Details |
| `AddressPanel` | 复用 | Checkout / Detail |
| `ShippingMethodRadio` | 新建 | 三选一 + 运费试算 |
| `OrderSummaryPanel` | 新建 | Checkout 右侧 sticky |
| `SecurityReminder` | 新建 | Info Banner |
| `UploadPaymentProof` | 复用 | 对齐 2B 店铺规则 |
| `PurchaseOrderTable` | 扩展已有 b2bList | 加 Tab + 新列 |

---

## 六、响应式与状态

### 6.1 断点

| 断点 | 布局调整 |
|------|---------|
| ≥1280 | 商品 4 列；Checkout 双栏 |
| 1024–1279 | 商品 3 列 |
| <1024 | 商品 2 列；Checkout 单栏 + 底栏 sticky |

### 6.2 全局状态

| 状态 | 处理 |
|------|------|
| Loading | 骨架屏（列表卡片 / Checkout 区块） |
| Empty | `NO DATA` / `No records available` |
| Error | Toast + Retry |
| Submitting | 按钮 Loading + disabled |

---

## 七、关键用户流程（设计走查）

```
Discovery → Detail → Buy Now Modal → Checkout → Order Success
    → Upload Proof → Purchase Orders List (Tab: Unpublished)
    → Detail → Publish to Store → List Tab: Published
```

---

## 八、设计交付物

| 交付物 | 路径 |
|--------|------|
| UI 设计规范（本文档） | `docs/seller-2c-product-sourcing-ui-design.md` |
| 页面线框 Canvas | `/cursor/stores/user/canvases/aa068846-18bf-467b-9b8b-a4ed878f404d/source.canvas.tsx` |
| PRD | 用户修订版 v1.0 |

---

## 九、待设计评审确认

| # | 项 | 说明 |
|---|-----|------|
| D1 | Publish to Store 精确触发状态 | PRD 写「Panding」需与研发确认枚举 |
| D2 | Buyer Paid vs Pending Confirmation | 与 App 状态名统一 |
| D3 | Checkout 数量修改是否触发运费重算 | 建议：是 |
| D4 | Partially Published 在 PO List 的 Tab 归属 | 建议：Published Tab 不含，Unpublished 含 |
