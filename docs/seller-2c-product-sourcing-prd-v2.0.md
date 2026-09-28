# Seller 后台 2C — Product Sourcing PRD v2.0

> **范围**：仅 **用户下单全流程**（不含 PO List 搜索/导出/Buy Again）。  
> **基线**：`seller-2c-product-sourcing-prd-v1.0-final.md`（MVP v1.0）。  
> **本期范围摘要（评审用）**：`seller-2c-product-sourcing-prd-v2-iteration-scope.md`  
> **版本**：v2.0 · 2026/09/28

---

## 一、文档信息

| 时间 | 版本 | 主要变更 |
|------|------|----------|
| 2026/09/28 | v2.0 | 购物车；合并下单（一单多 SKU）；Checkout 可改数量；划线价与 **-X%** 折扣 Tag；Detail/Success 推荐；邮件触发 |

---

## 二、V2 目标与范围

### 2.1 目标

在 MVP 单笔立即购买基础上，完成：

1. **购物车** + **合并结算**（一个采购单、多 SKU 行）。  
2. **Cart 与 Checkout 均可修改数量**。  
3. **划线价 + 折扣 Tag**（展示 **-20%** 等形式，见 §5.7）。  
4. **商品推荐**（**Product Detail**、**Order Success**）。  
5. **邮件通知**（订单创建、2B 确认收款；模板与触发定义，PO 页不改）。

### 2.2 不在本期

- PO List/Detail 功能（搜索、CSV、Buy Again、Cancel UI 大改等）。  
- Discovery 推荐位（本期不做）。  
- 多 2B、凭证上传、Shipping Method、展示 2B 银行账户。

---

## 三、已确认产品决策

| # | 决策 |
|---|------|
| D1 | **数量**：Cart **与** Checkout **均可**修改（步进器）；变更后实时重算行小计与 Grand Total。 |
| D2 | **合并下单**：一次 Order & Pay 生成 **一个采购订单**，**多 SKU 行**（明细按 SKU）。 |
| D3 | **折扣展示**：Tag 文案为 **百分比**，如 **-20%**（由原价与现价计算，向下取整或业务约定精度）。 |
| D4 | **推荐位**：**Product Detail**、**Order Success**（不做 Discovery 推荐区块）。 |

---

## 四、信息架构与路由（草案）

| 页面 | 路由草案 |
|------|----------|
| Product Discovery | `/seller/2c/sourcing` |
| Product Detail | `/seller/2c/sourcing/product/{spuId}` |
| Cart | `/seller/2c/sourcing/cart` |
| Checkout | `/seller/2c/sourcing/checkout` |
| Order Success | `/seller/2c/sourcing/checkout/result?orderId=` |

**全局**：顶栏/侧栏 **Cart** 入口 + 角标（SKU 种类数或件数，与研发统一）。

---

## 五、功能需求

### 5.1 选品浏览（Product Discovery）

沿用 V1.0：列表 Tab、搜索、SPU 卡片、分页。

**V2 增量**：

- 卡片展示 **现价**；若有 `originalPrice` > `salePrice`，展示 **划线原价** + **折扣 Tag（-X%）**。  
- 无原价则不展示 Tag。  
- **无** 推荐区块。

### 5.2 商品详情（Product Detail）

沿用 V1.0：橱窗、SKU 选择、Buy Now、MOQ、超卖规则。

**V2 增量**：

| 能力 | 说明 |
|------|------|
| **Add to Cart** | 当前选中 SKU + 数量加入购物车；Toast「Added to cart」；角标更新。 |
| **Buy Now** | 可将当前 SKU 带入 Checkout（**不经过 Cart** 或 **清空/叠加** 规则：建议 Buy Now = 仅当前 SKU 单行直达 Checkout，与 Cart 结算路径分离，见交互说明）。 |
| **划线价 + Tag** | 选中 SKU 后展示 Purchase Price；有原价则划线 + **-X%** Pill。 |
| **You May Also Like** | 规则推荐横滑/网格（热销、同类目、本店最近采购）；点击进详情（新页签）。 |

**Buy Now vs Cart（建议）**：

- **Add to Cart**：累加至 Cart，不跳转。  
- **Buy Now**：进入 Checkout，**仅含当前 SKU 一行**（不自动合并 Cart 内其他商品，避免误下单）；用户可从 Cart 进入 Checkout 合并多单。

### 5.3 购物车（Cart）

**功能描述**：本店铺、单 2B 货源下的待结算 SKU 列表。

| 字段 | 说明 |
|------|------|
| 商品图/标题/SKU ID/规格 | 只读 |
| Price | 现价；可含划线原价、-X% Tag |
| Qty | **可编辑**（步进器）；≥ MOQ |
| Line subtotal | Price × Qty |
| 操作 | 删除行、清空购物车（可选） |

**交互**：

- **Checkout**：携带 Cart 全部有效行进入 Checkout。  
- Cart 为空时禁用 Checkout，空状态 CTA 回 Discovery。  
- 海外仓超卖规则与 V1 一致（可超卖仍允许）。

### 5.4 Checkout

沿用 V1.0：固定达卡地址、Remark、Bank/Digital Payment、Security Reminder 四模块、Order & Pay。

**V2 增量**：

| 项 | 规则 |
|----|------|
| **商品区** | **多行** Product Information（每 SKU 一行）；每行 **Qty 可编辑**；行小计实时更新。 |
| **来源** | 来自 Cart（多行）或 Buy Now（单行）。 |
| **Grand Total** | ∑(单价×数量)；运费/COD 本期仍为 0（与 V1 一致）。 |
| **提交** | 创建 **一个** 采购订单，`items[]` 多 SKU；状态 Pending Payment。 |

**导航**：交易步骤条见 `seller-2c-product-sourcing-prd-v2-iteration-scope.md` §四（Cart 路径：Cart → Checkout → Success；Buy Now：Checkout → Success）。面包屑与步骤条分层，具体文案 UI 定稿后落地。

### 5.5 Order Success

沿用 V1.0：成功话术、Order No.、Grand Total、Contact Information、View Order Detail、Continue Sourcing。

**V2 增量**：

| 项 | 说明 |
|----|------|
| 邮件 | 文案提示已向店主邮箱发送确认（若发送失败可 Toast 降级，不阻断成功页）。 |
| **You May Also Like** | 同 Detail 推荐规则；引导继续选品。 |
| **无** Payment Details / 上传凭证。 |

### 5.6 邮件通知（触发定义）

| 触发 | 收件人 | 说明 |
|------|--------|------|
| 采购单创建 | 2C 店主邮箱 | Order & Pay 成功后 |
| 2B 确认收款 | 2C 店主 + 2B 联系人 | 状态跃迁，由交易中台/2B 触发 |
| （可选 P1）订单发货 | 2C 店主 | 非下单页改造 |

模板 English；正文含 Order No.、Grand Total、Contact（payment@kickbazar.com）。

### 5.7 价格与折扣 Tag

| 字段 | 说明 |
|------|------|
| `salePrice` | 现价（采购价） |
| `originalPrice` | 原价；可选 |
| **折扣 Tag** | 仅当 `originalPrice` > `salePrice` 时展示：**`-{percent}%`**，如 **-20%** |

**计算公式（建议）**：

`percent = round((1 - salePrice / originalPrice) * 100)`，最小展示 1%，最大 99%（100% 由业务禁止）。

展示位置：Discovery 卡片、Detail 价格区、Cart 行、Checkout 行（Checkout 可不重复 Tag，仅价格即可）。

---

## 六、接口草案（摘要）

| 接口 | 说明 |
|------|------|
| GET/POST/PUT/DELETE Cart | 行：skuId, qty |
| POST Checkout preview | 校验 MOQ、价格快照 |
| POST Create purchase order | body: items[{skuId, qty}], paymentMethod, remark → 单 orderId 多行 |
| GET Recommendations | scene=detail|success, spuId?, limit |
| GET Product price | salePrice, originalPrice |

---

## 七、验收标准（AC）

| ID | 场景 | 预期 |
|----|------|------|
| AC-V2-01 | Add to Cart | 角标更新，Cart 可见多 SKU |
| AC-V2-02 | Cart 改 Qty | 行小计、Cart 合计更新 |
| AC-V2-03 | Cart → Checkout | 多行带入，Checkout 可继续改 Qty |
| AC-V2-04 | Buy Now | Checkout 仅当前 SKU 一行 |
| AC-V2-05 | Order & Pay | 生成 **一个** PO，详情多 SKU 行 |
| AC-V2-06 | 折扣 | 有原价时展示划线与 **-X%** |
| AC-V2-07 | Detail/Success | 展示推荐商品并可跳转详情 |
| AC-V2-08 | 创建订单邮件 | 2C 收到（或记录发送任务成功） |

---

## 八、附录

### A. 与 V1.0 差异速查

见 `seller-2c-product-sourcing-prd-v2-planning.md` §五。

### B. 开放项（后续）

- Buy Now 是否允许「合并 Cart」开关（本期建议不合并）。  
- 推荐算法是否接数据中台（本期规则即可）。

---

*PRD v2.0 — Order flow only*
