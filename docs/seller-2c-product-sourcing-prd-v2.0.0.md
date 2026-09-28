# Seller 后台 2C — Product Sourcing PRD v2.0.0

> **版本**：**v2.0.0**（本期迭代需求定稿文档）  
> **上一版（线上）**：**v1.0.1** — 基于 [选品中心 MVP 终稿](seller-2c-product-sourcing-prd-v1.0-final.md)（v1.0，2026/09/07）的定稿后修订；归档正文见 `seller-2c-product-sourcing-prd-v1.0-final.md`，**v1.0.1 为线上 PRD 版本号**。  
> **范围**：仅 **用户下单全流程**（不含 PO List 搜索/导出/Buy Again 等他方迭代）。  
> **规划备忘**（非需求正文）：`seller-2c-product-sourcing-prd-v2-planning.md`

---

## 一、文档信息

| 时间 | 版本 | 主要变更 |
|------|------|----------|
| 2026/09/07 | v1.0 | MVP 定稿（见 v1.0-final 归档） |
| — | **v1.0.1** | 初版定稿后线上修订（与 v1.0 同能力边界：无购物车、Buy Now 单笔闭环） |
| 2026/09/28 | **v2.0.0** | 购物车与合并下单；Cart/Checkout 可改量；划线价与 **-X%** Tag；Detail/Success 推荐；邮件触发；交易步骤条规则 |
| 2026/09/28 | **v2.0.0**（修订） | §六 按飞书 PRD 框架重写：功能描述 / 字段定义与业务规则 / 交互说明；**FL-2C-PS-2xx**、**BR-2C-PS-2xx** / **BR-2C-PS-I2xx** |

---

## 二、与 v1.0.1 的关系及本期方案总览

### 2.1 版本关系说明

| 项 | v1.0.1（线上） | v2.0.0（本期） |
|----|----------------|----------------|
| 产品模块 | Seller Web 2C — **Product Sourcing（选品中心）** | 同一模块，**下单链路升级** |
| 下单入口 | 仅 **Buy Now** → Checkout | **Add to Cart + Cart** 与 **Buy Now** 并存 |
| Checkout 商品 | **单 SKU 行** | **多 SKU 行**（合并一单） |
| Checkout 数量 | v1.0.1 与终稿对齐为业务现行规则 | **Cart 与 Checkout 均可改量** |
| Discovery / Success | 无推荐区；Discovery 无折扣 Tag | 折扣 Tag；推荐仅在 **Detail + Success** |
| 邮件 | 无 PRD 定义的下单邮件 | 创建单、确认收款等触发（见 FL-2C-PS-208） |
| PO List / Detail | MVP 能力 | **本期不改页面**（一单多行数据兼容） |
| 不变项 | 固定达卡地址、无 Shipping Method、Bank/Digital Payment、Security Reminder 四模块、Success Contact、不展示 2B 账户、线下联络付款 | **全部沿用 v1.0.1** |

**继承关系**：v2.0.0 **不替代** v1.0-final 全文；未在本 PRD 逐条重写的能力（搜索 Tab、取消订单规则、Publish to Store、PO 列表字段等）**仍以 v1.0.1 / v1.0-final 为准**。本 PRD 仅描述 **相对 v1.0.1 的新增与变更**。

### 2.2 对 v1.0.1 四条主链路的影响面

| 编号 | v1.0.1 能力 | 本期改动 |
|------|-------------|----------|
| **1** | **Product Discovery** | 卡片 **划线原价 + 折扣 Tag（-X%）**；**无** Discovery 推荐 |
| **2** | **Product Detail + Buy Now** | **Add to Cart**；Buy Now 改为 **快捷单行** 入口；详情价与 **-X%**；**You May Also Like** |
| **3** | **Checkout** | **多 SKU 行**；**Cart/Checkout 改量**；一单多行提交 |
| **4** | **Order Success** | **推荐**；**邮件已发送** 提示；Grand Total 与合并单一致 |

v1.0.1 中「本期不做」且 **v2.0.0 纳入** 的项：**购物车**、**Success 推荐（限定页面）**、**一单多 SKU**。

### 2.3 本期方案（A / B / C / D）

| 方案 | 内容 | 对应章节 |
|------|------|----------|
| **A** | 购物车与 **合并结算**（一单多 SKU；Cart/Checkout 改量；顶栏 Cart + 角标） | FL-2C-PS-205、FL-2C-PS-206 |
| **B** | **双路径**：Cart → Checkout → Success；Buy Now → Checkout → Success（**不合并** Cart 内其他 SKU） | §2.4、FL-2C-PS-204、FL-2C-PS-206 |
| **C** | **划线价 + 折扣 Tag（-X%）** | FL-2C-PS-202 |
| **D** | **推荐**（Detail/Success）+ **邮件**（创建单等） | FL-2C-PS-204、FL-2C-PS-207、FL-2C-PS-208 |

### 2.4 交易步骤与导航（相对 v1.0.1 新增约定）

v1.0.1 无独立 Cart、无交易步骤条。v2.0.0 约定：

**交易步骤条（Checkout Steps）**

| 用户路径 | 步骤条 |
|----------|--------|
| 经 **Cart** | **Cart** → **Checkout** → **Order Success** |
| **Buy Now** | **Checkout** → **Order Success**（无 Cart 步；弹窗确认数量） |

- **Discovery / Detail** 为选品浏览，**不纳入** 步骤条。  
- Checkout 页内「1. Address / 2. Product / 3. Payment」为 **页内模块**，与全局步骤条并存。  
- **PO List / Detail** 使用订单 **状态时间线**（v1.0.1 已有），不用结账步骤条。

**面包屑原则**

| 区域 | 策略 |
|------|------|
| 浏览区（Discovery、Detail） | 与菜单一致 |
| 交易区（Cart、Checkout、Success） | 建议缩短为模块级（如 Place Purchase Order），**不以** Discovery › Detail › Checkout › Success 串联 |
| PO 管理 | 维持 v1.0.1 |

UI 文案与步骤条可点击回退规则在 UI 规范定稿时落地；**原型待本 PRD 评审通过后**再改。

---

## 三、目标与范围边界

### 3.1 目标

在 v1.0.1 单笔 Buy Now 闭环基础上：

1. **购物车** + **合并结算**（一个采购单、多 SKU 行）。  
2. **Cart 与 Checkout 均可修改数量**。  
3. **划线价 + 折扣 Tag**（如 **-20%**，见 FL-2C-PS-202）。  
4. **商品推荐**（**Product Detail**、**Order Success**）。  
5. **邮件通知**（订单创建、2B 确认收款；PO 页不改）。

### 3.2 不在本期

- PO List/Detail（搜索、CSV、Buy Again、Cancel UI 大改等）。  
- Discovery 推荐位。  
- 多 2B、凭证上传、Shipping Method、展示 2B 银行账户。

---

## 四、已确认产品决策

| # | 决策 |
|---|------|
| D1 | **数量**：Cart **与** Checkout **均可**修改（步进器）；实时重算行小计与 Grand Total；Checkout 改量与 Cart 同步。 |
| D2 | **合并下单**：一次 Order & Pay → **一个** 采购订单、**多 SKU 行**。 |
| D3 | **折扣 Tag**：**`-{percent}%`**（如 **-20%**），由原价与现价计算。 |
| D4 | **推荐位**：**Product Detail**、**Order Success**（不做 Discovery 推荐）。 |

---

## 五、信息架构与路由（草案）

| 页面 | 路由草案 |
|------|----------|
| Product Discovery | `/seller/2c/sourcing` |
| Product Detail | `/seller/2c/sourcing/product/{spuId}` |
| Cart | `/seller/2c/sourcing/cart` |
| Checkout | `/seller/2c/sourcing/checkout` |
| Order Success | `/seller/2c/sourcing/checkout/result?orderId=` |

**全局**：顶栏 **Cart** + 角标（件数或 SKU 数，与研发统一一种）。

---

## 六、功能需求

> **章节框架**：对齐 `docs/kickbazar-toc-web-prd-feishu-clean.md`（功能描述 → 字段定义与业务规则 → 交互说明）。  
> **编号**：**FL-2C-PS-2xx** = 本 PRD v2.0.0 功能点；**BR-2C-PS-2xx** = 业务规则；**BR-2C-PS-I2xx** = 交互规则。  
> **基线**：各功能中未写明的能力 **沿用 v1.0.1**（归档见 `seller-2c-product-sourcing-prd-v1.0-final.md`）。

---

### FL-2C-PS-201 全局购物车入口

#### 功能描述

在 Product Sourcing 模块内提供全局 **Cart** 入口及数量角标，便于商家在浏览选品时查看待结算 SKU 件数并进入购物车页。

#### 字段定义与业务规则

| 字段 / 规则 | 说明 |
|-------------|------|
| cartEntry | 顶栏按钮/链接，文案 **Cart** |
| cartBadgeCount | 角标数字；统计口径与研发统一：**推荐为购物车 SKU 总件数（sum qty）** |
| cartScope | 当前 2C 店铺、**单一 2B 货源**（与 v1.0.1 BR-01 一致） |

| 编号 | 业务规则 |
|------|----------|
| **BR-2C-PS-201** | 角标为 0 时展示 **0** 或隐藏角标，由 UI 规范二选一，全站一致。 |
| **BR-2C-PS-202** | Cart 数据与登录店主绑定；未登录按现有 Seller 鉴权跳转。 |

#### 交互说明

| 编号 | 交互规则 |
|------|----------|
| **BR-2C-PS-I201** | 点击 **Cart** → 跳转 **FL-2C-PS-205** 购物车页。 |
| **BR-2C-PS-I202** | **Add to Cart** 成功后角标实时更新，无需刷新页面。 |

---

### FL-2C-PS-202 采购价与折扣展示（横切）

#### 功能描述

在选品与下单链路中展示 **现价（采购价）**；当存在有效原价时展示 **划线原价** 与折扣 Tag **`-X%`**（如 **-20%**）。

#### 字段定义与业务规则

| 字段 | 英文界面 | 说明 |
|------|---------|------|
| salePrice | Purchase Price / Unit Price | 现价，BDT |
| originalPrice | — | 原价，可选；无则整组折扣 UI 不展示 |
| discountTag | — | 文案 **`-{percent}%`** |

| 编号 | 业务规则 |
|------|----------|
| **BR-2C-PS-203** | 仅当 `originalPrice` > `salePrice` 时展示划线价与 Tag。 |
| **BR-2C-PS-204** | `percent = round((1 - salePrice / originalPrice) × 100)`，展示区间建议 **1%～99%**；`originalPrice ≤ salePrice` 不展示 Tag。 |
| **BR-2C-PS-205** | 货币 **BDT（৳）**；格式与 v1.0.1 一致。 |

**适用页面**：FL-2C-PS-203（Discovery 卡片）、FL-2C-PS-204（Detail）、FL-2C-PS-205（Cart 行）、FL-2C-PS-206（Checkout 行，**可不重复 Tag，仅展示现价与小计**）。

#### 交互说明

| 编号 | 交互规则 |
|------|----------|
| **BR-2C-PS-I203** | 列表/详情加载失败时，价格区展示占位或错误态，不展示错误折扣 Tag。 |
| **BR-2C-PS-I204** | 进入 Checkout 时以 **价格快照** 为准；若与实时价不一致，提交前按 v1.0.1 Checkout 规则提示刷新（沿用既有校验策略）。 |

---

### FL-2C-PS-203 选品浏览（Product Discovery）— v2.0.0 增量

#### 功能描述

在 v1.0.1 商品列表基础上，卡片采购价区支持 **划线价 + 折扣 Tag**；**不增加** 推荐区块。

**沿用 v1.0.1**：Tab（All / Published / Unpublished）、搜索、分页、SPU 卡片进详情等，见 v1.0-final §5.1。

#### 字段定义与业务规则

| 字段 | 说明 |
|------|------|
| 卡片价格区 | 展示 `salePrice`；满足 **BR-2C-PS-203** 时增加划线 `originalPrice` 与 **discountTag** |
| 铺货 Tag | 仍按 SPU 维度 Published / Unpublished（v1.0.1） |

| 编号 | 业务规则 |
|------|----------|
| **BR-2C-PS-206** | Discovery **不提供** 「You May Also Like」或同类推荐横条（**BR-2C-PS-210** 范围限定）。 |

#### 交互说明

| 编号 | 交互规则 |
|------|----------|
| **BR-2C-PS-I205** | 点击卡片 → 新页签或当前策略打开 **FL-2C-PS-204** 商品详情（与 v1.0.1 一致）。 |

---

### FL-2C-PS-204 商品详情（Product Detail）— v2.0.0 增量

#### 功能描述

在 v1.0.1 橱窗详情与 **Buy Now** 基础上，增加 **Add to Cart**、详情页 **You May Also Like** 推荐，以及采购价折扣展示；底栏 **Add to Cart** + **Buy Now** 并存。

**沿用 v1.0.1**：SKU 规格选择、MOQ、超卖允许、橱窗结构等，见 v1.0-final §5.1.3、立即购买弹层逻辑。

#### 字段定义与业务规则

| 字段 | 英文界面 | 说明 |
|------|---------|------|
| selectedSkuId | — | 当前选中 SKU |
| quantity | Quantity | Buy Now 弹层内数量；Add to Cart 默认 **1** 或可配置为与弹层一致（本期建议 **加车 qty=1**，改量在 Cart） |
| recommendList | You May Also Like | 规则推荐列表，见 **BR-2C-PS-209** |

| 编号 | 业务规则 |
|------|----------|
| **BR-2C-PS-207** | **Add to Cart**：同一 `skuId` 多次加车 **累加 qty**，不新建重复行。 |
| **BR-2C-PS-208** | **Buy Now**：进入 Checkout 的结算快照 **仅含当前选中 SKU 一行**，**不包含** Cart 内其他 SKU（**BR-2C-PS-211**）。 |
| **BR-2C-PS-209** | 推荐规则（本期）：同店热销 / 同类目 / 本店最近采购（有数据时）；条数由 UI 规范（如 3～8）。 |
| **BR-2C-PS-210** | 推荐仅出现在 **Detail、Success**，不出现在 Discovery。 |

#### 交互说明

| 编号 | 交互规则 |
|------|----------|
| **BR-2C-PS-I206** | 点击 **Add to Cart** → Toast **Added to cart**（或等价文案）→ 角标更新 → **停留详情页**。 |
| **BR-2C-PS-I207** | 点击 **Buy Now** → 打开数量弹层（沿用 v1.0.1）→ **Confirm** → 跳转 **FL-2C-PS-206** Checkout（`source=buynow`），步骤条见 **FL-2C-PS-209**。 |
| **BR-2C-PS-I208** | 推荐卡片点击 → **新页签** 打开对应商品详情。 |
| **BR-2C-PS-I209** | 未选完整 SKU 规格时，Add to Cart / Buy Now **禁用** 或 Toast 提示（与 v1.0.1 一致）。 |

---

### FL-2C-PS-205 购物车（Cart）

#### 功能描述

展示本店铺待结算 SKU 列表，支持改量、删行，并从购物车进入 Checkout 进行 **合并结算**（一单多 SKU）。

#### 字段定义与业务规则

| 字段 | 英文界面 | 说明 |
|------|---------|------|
| lineId / skuId | SKU ID | 行唯一键 |
| productTitle | — | 商品标题 |
| skuAttributes | — | 规格文案 |
| unitPrice | Price | 现价，可含 FL-2C-PS-202 展示 |
| quantity | Qty | **可编辑**，≥ MOQ |
| lineSubtotal | Subtotal | unitPrice × quantity |
| cartGrandTotal | Grand Total | 所有有效行 lineSubtotal 之和 |

| 编号 | 业务规则 |
|------|----------|
| **BR-2C-PS-211** | Cart 路径 Checkout 携带 **全部有效行**；Buy Now 路径不读取 Cart 其他行（**BR-2C-PS-208**）。 |
| **BR-2C-PS-212** | 数量修改实时重算 lineSubtotal、cartGrandTotal。 |
| **BR-2C-PS-213** | 超卖规则与 v1.0.1 一致：库存不足仍允许下单。 |
| **BR-2C-PS-214** | Cart 为空时 **Checkout** 按钮禁用；展示空状态 CTA 回 Discovery。 |
| **BR-2C-PS-215** | 删行后若 Cart 空，角标归零并展示空状态。 |

#### 交互说明

| 编号 | 交互规则 |
|------|----------|
| **BR-2C-PS-I210** | 点击 **Checkout** → 跳转 **FL-2C-PS-206**（`source=cart`），步骤条展示 **Cart → Checkout → Success**（**FL-2C-PS-209**）。 |
| **BR-2C-PS-I211** | 点击 **Remove** → 删除该行并刷新合计与角标。 |
| **BR-2C-PS-I212** | **Continue Sourcing** → 回 Discovery。 |

---

### FL-2C-PS-206 Checkout 结算 — v2.0.0 增量

#### 功能描述

在 v1.0.1 Checkout 上扩展 **多 SKU 商品行**、**行级可改数量** 与 **合并下单**；地址、Remark、Payment、Security Reminder、Order & Pay 等行为不变。

**沿用 v1.0.1**：固定达卡 2B 仓库地址（不可编辑）、无 Shipping Method、Bank Transfer / Digital Transfer、Security Reminder 四模块、仅展示 Grand Total 等，见 v1.0-final §5.2。

#### 字段定义与业务规则

##### （1）Product Information（v2.0.0 多行）

| 字段 | 说明 |
|------|------|
| items[] | 多行；每行含图、标题、skuAttributes、skuId、unitPrice、quantity、lineSubtotal |
| checkoutSource | `cart` \| `buynow` |
| grandTotal | ∑(unitPrice × quantity)；运费/COD **= 0**（v1.0.1） |

| 编号 | 业务规则 |
|------|----------|
| **BR-2C-PS-216** | `checkoutSource=cart`：items = Cart 有效行快照；`buynow`：**单行** 当前 SKU。 |
| **BR-2C-PS-217** | Checkout 修改 quantity 时实时重算 lineSubtotal、grandTotal，并 **回写同步 Cart**（仅 cart 来源行）。 |
| **BR-2C-PS-218** | **Order & Pay** 创建 **一个** 采购订单，`items[]` 多 SKU；状态 **Pending Payment**。 |

##### （2）其余模块

Shipping Address、Remark、Payment Method、Security Reminder、Order & Pay 按钮规则 **同 v1.0.1**，不重复编号。

#### 交互说明

| 编号 | 交互规则 |
|------|----------|
| **BR-2C-PS-I213** | 进入页时按 source 加载商品行；加载失败 Toast，可 Retry。 |
| **BR-2C-PS-I214** | **Order & Pay** 成功 → 跳转 **FL-2C-PS-207**；grandTotal 与成功页一致。 |
| **BR-2C-PS-I215** | 提交中按钮 Loading + 防重复点击（v1.0.1）。 |
| **BR-2C-PS-I216** | Remark Modal：打开/保存/关闭（v1.0.1）。 |

---

### FL-2C-PS-207 下单成功（Order Success）— v2.0.0 增量

#### 功能描述

订单创建成功后展示确认信息、Order No.、Grand Total、Contact Information 与操作按钮；增加 **邮件已发送** 提示与 **You May Also Like**。

**沿用 v1.0.1**：成功话术、Phone / Email、View Order Detail、Continue Sourcing；**无** Payment Details（2B 账户）、**无** Upload Proof。

#### 字段定义与业务规则

| 字段 | 说明 |
|------|------|
| orderNo | Order No. | 采购单号 |
| grandTotal | Grand Total | 与 Checkout 提交时一致 |
| emailSentHint | — | 文案提示已向店主邮箱发送确认邮件 |
| recommendList | You May Also Like | 规则同 **BR-2C-PS-209** |

| 编号 | 业务规则 |
|------|----------|
| **BR-2C-PS-219** | 邮件发送失败时：Success 页仍可完成；提示可降级为「邮件将稍后发送」或 Toast，**不阻断** 成功态。 |
| **BR-2C-PS-220** | 仍展示 Contact：Phone **01794 133553**、Email **payment@kickbazar.com**（v1.0.1）。 |

#### 交互说明

| 编号 | 交互规则 |
|------|----------|
| **BR-2C-PS-I217** | Copy Order No. / Phone / Email（v1.0.1）。 |
| **BR-2C-PS-I218** | **View Order Detail** → PO Detail（v1.0.1 路由）。 |
| **BR-2C-PS-I219** | **Continue Sourcing** → Discovery。 |
| **BR-2C-PS-I220** | 推荐商品点击 → 新页签详情。 |

---

### FL-2C-PS-208 邮件通知（下单链路）

#### 功能描述

在采购单创建及后续状态跃迁时触发邮件；本期在 PRD 层定义触发与收件人，**不要求** 改造 PO 列表/详情页。

#### 字段定义与业务规则

| 触发事件 | 收件人 | 说明 |
|----------|--------|------|
| 采购单创建 | 2C 店主邮箱 | **Order & Pay** 成功后 |
| 2B 确认收款 | 2C 店主 + 2B 联系人 | 由交易中台/2B 状态机触发 |
| （可选 P1）订单发货 | 2C 店主 | 非下单页改造 |

| 编号 | 业务规则 |
|------|----------|
| **BR-2C-PS-221** | 模板语言 **English**；正文含 Order No.、Grand Total、Contact（payment@kickbazar.com）。 |
| **BR-2C-PS-222** | 创建单邮件与 **FL-2C-PS-207** 展示联动，见 **BR-2C-PS-219**。 |

#### 交互说明

| 编号 | 交互规则 |
|------|----------|
| **BR-2C-PS-I221** | 无用户侧「重发邮件」按钮（本期）；失败由后台重试或客服处理。 |

---

### FL-2C-PS-209 交易步骤条与面包屑

#### 功能描述

相对 v1.0.1，在 **交易区** 增加 **Checkout Steps** 表达下单进度；**浏览区** 与 **PO 管理区** 维持原面包屑策略。

#### 字段定义与业务规则

| 路径 | 步骤条节点 |
|------|------------|
| Cart 下单 | **Cart** → **Checkout** → **Order Success** |
| Buy Now | **Checkout** → **Order Success** |

| 编号 | 业务规则 |
|------|----------|
| **BR-2C-PS-223** | Discovery / Detail **不纳入** 全局步骤条。 |
| **BR-2C-PS-224** | Checkout 页内「1. Address / 2. Product / 3. Payment」为 **页内模块序号**，与全局步骤条并存。 |
| **BR-2C-PS-225** | PO List / Detail 使用 **订单状态时间线**，不使用结账步骤条。 |
| **BR-2C-PS-226** | 交易区面包屑建议缩短为模块级（如 **Place Purchase Order**），不以 Discovery › Detail › Checkout › Success 串联。 |

#### 交互说明

| 编号 | 交互规则 |
|------|----------|
| **BR-2C-PS-I222** | 步骤条在 Success 页当前步为 **Order Success**；是否可点击回退 Cart/Checkout 由 UI 定稿（建议：Success 只读）。 |
| **BR-2C-PS-I223** | Buy Now 进入 Checkout 时步骤条 **不展示 Cart 节点**。 |

**UI 定稿前**：原型可仍用旧面包屑；以本 PRD 为准。

---

### 功能索引（FL）

| 编号 | 名称 |
|------|------|
| FL-2C-PS-201 | 全局购物车入口 |
| FL-2C-PS-202 | 采购价与折扣展示 |
| FL-2C-PS-203 | 选品浏览增量 |
| FL-2C-PS-204 | 商品详情增量 |
| FL-2C-PS-205 | 购物车 |
| FL-2C-PS-206 | Checkout 增量 |
| FL-2C-PS-207 | 下单成功增量 |
| FL-2C-PS-208 | 邮件通知 |
| FL-2C-PS-209 | 交易步骤条与面包屑 |

---

## 七、接口草案（摘要）

| 接口 | 说明 |
|------|------|
| GET/POST/PUT/DELETE Cart | skuId, qty |
| POST Checkout preview | MOQ、价格快照 |
| POST Create purchase order | items[{skuId, qty}], paymentMethod, remark → 单 orderId 多行 |
| GET Recommendations | scene=detail\|success, spuId?, limit |
| GET Product price | salePrice, originalPrice |

---

## 八、验收标准（AC）

| ID | 场景 | 预期 |
|----|------|------|
| AC-200-01 | Add to Cart | 角标更新，Cart 多 SKU |
| AC-200-02 | Cart 改 Qty | 行小计、合计更新 |
| AC-200-03 | Cart → Checkout | 多行带入，Checkout 可改 Qty |
| AC-200-04 | Buy Now | Checkout 仅当前 SKU 一行 |
| AC-200-05 | Order & Pay | **一个** PO，多 SKU 行 |
| AC-200-06 | 折扣 | 划线与 **-X%** |
| AC-200-07 | Detail/Success 推荐 | 可跳转详情 |
| AC-200-08 | 创建订单邮件 | 2C 收到或任务成功 |
| AC-200-09（UI 定稿后） | 交易步骤条 | Cart 路径三步；Buy Now 路径两步 |

---

## 九、附录

### A. v1.0.1 → v2.0.0 差异速查

| 环节 | v1.0.1 | v2.0.0 |
|------|--------|--------|
| 入口 | Buy Now | + Cart + Add to Cart |
| Discovery/Detail | 采购价 | + 划线、-X%、Detail 推荐 |
| Checkout | 单 SKU | 多 SKU、双端改量 |
| Success | Contact | + 推荐、邮件提示 |
| 导航 | 面包屑 | + 交易步骤条（§2.4） |
| PO 模块 | v1.0.1 | 本期不改 UI |

### B. 开放项（后续）

- Buy Now 是否允许合并 Cart（本期：**不合并**）。  
- 推荐是否接数据中台（本期：规则即可）。

---

*PRD v2.0.0 — Product Sourcing order flow · 2026/09/28*
