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
| 邮件 | 无 PRD 定义的下单邮件 | 创建单、确认收款等触发（见 §6.6） |
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
| **A** | 购物车与 **合并结算**（一单多 SKU；Cart/Checkout 改量；顶栏 Cart + 角标） | §6.3、§6.4 |
| **B** | **双路径**：Cart → Checkout → Success；Buy Now → Checkout → Success（**不合并** Cart 内其他 SKU） | §2.4、§6.2 |
| **C** | **划线价 + 折扣 Tag（-X%）** | §6.7 |
| **D** | **推荐**（Detail/Success）+ **邮件**（创建单等） | §6.2、§6.5、§6.6 |

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
3. **划线价 + 折扣 Tag**（如 **-20%**，见 §6.7）。  
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

### 6.1 选品浏览（Product Discovery）

**沿用 v1.0.1**：列表 Tab、搜索、SPU 卡片、分页。

**v2.0.0 增量**：

- 卡片 **现价**；`originalPrice` > `salePrice` 时：**划线原价** + **-X%** Tag。  
- 无原价则不展示 Tag。  
- **无** 推荐区块。

### 6.2 商品详情（Product Detail）

**沿用 v1.0.1**：橱窗、SKU 选择、Buy Now 弹窗、MOQ、超卖规则。

**v2.0.0 增量**：

| 能力 | 说明 |
|------|------|
| **Add to Cart** | 当前 SKU + 数量入车；Toast；角标更新。 |
| **Buy Now** | 弹窗确认数量后 **直达 Checkout**，**仅当前 SKU 一行**；**不自动合并** Cart 内其他商品。 |
| **划线价 + Tag** | 有原价则划线 + **-X%**。 |
| **You May Also Like** | 规则推荐；进详情（新页签）。 |

- **Add to Cart**：累加 Cart，不跳转。  
- **Cart → Checkout**：携带 Cart **全部有效行**（多 SKU）。

### 6.3 购物车（Cart）— v2.0.0 新增页

本店铺、单 2B 货源待结算列表。

| 字段 | 说明 |
|------|------|
| 图/标题/SKU/规格 | 只读 |
| Price | 现价；可含划线、-X% |
| Qty | **可编辑**；≥ MOQ |
| Line subtotal | Price × Qty |
| 操作 | 删行；清空（可选） |

- **Checkout**：全部有效行进入 Checkout；空车禁用 Checkout。  
- 超卖规则与 v1.0.1 一致。

### 6.4 Checkout

**沿用 v1.0.1**：固定达卡地址、Remark、Bank/Digital、Security Reminder 四模块、Order & Pay。

**v2.0.0 增量**：

| 项 | 规则 |
|----|------|
| 商品区 | **多行**，每行 **Qty 可编辑** |
| 来源 | Cart（多行）或 Buy Now（单行） |
| Grand Total | ∑(单价×数量)；运费/COD=0 |
| 提交 | **一个** PO，`items[]` 多 SKU；Pending Payment |

**导航**：见 §2.4。

### 6.5 Order Success

**沿用 v1.0.1**：话术、Order No.、Grand Total、Contact、View Order Detail、Continue Sourcing。

**v2.0.0 增量**：

| 项 | 说明 |
|----|------|
| 邮件 | 提示已向店主邮箱发送确认（失败可降级，不阻断成功页） |
| **You May Also Like** | 同 Detail 规则 |
| **无** Payment Details / 上传凭证 |

### 6.6 邮件通知（触发定义）

| 触发 | 收件人 | 说明 |
|------|--------|------|
| 采购单创建 | 2C 店主邮箱 | Order & Pay 成功后 |
| 2B 确认收款 | 2C + 2B | 状态跃迁，他方触发 |
| （可选 P1）发货 | 2C | 非下单页改造 |

模板 English；含 Order No.、Grand Total、Contact（payment@kickbazar.com）。

### 6.7 价格与折扣 Tag

| 字段 | 说明 |
|------|------|
| `salePrice` | 现价 |
| `originalPrice` | 可选 |
| **Tag** | `originalPrice` > `salePrice` 时 **`-{percent}%`** |

`percent = round((1 - salePrice / originalPrice) * 100)`，建议 1%～99%。

展示：Discovery、Detail、Cart、Checkout 行（Checkout 可不重复 Tag）。

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
