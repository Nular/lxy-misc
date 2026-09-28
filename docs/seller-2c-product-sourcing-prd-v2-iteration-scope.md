# Seller 2C — Product Sourcing 本期迭代范围说明

> **基准（线上已发布）**：[B2B 选品中心 MVP](seller-2c-product-sourcing-prd-v1.0-final.md)（`seller-2c-product-sourcing-prd-v1.0-final.md`，下称 **MVP v1.0**）  
> **详细需求正文**：[PRD v2.0 — 下单全流程](seller-2c-product-sourcing-prd-v2.0.md)（功能细则、AC、接口以 v2.0 为准）  
> **本文定位**：单独说明 **本期要改什么**、与 **MVP 四条主链路** 的关系、以及 **交易步骤** 划分；**不含** 原型/UI 稿变更（原型待 PRD 定稿后再改）。

---

## 一、本期迭代主题

在 **Seller Web 2C 后台** 的 **Product Sourcing（选品中心）** 模块内，升级 **用户下单全流程**：在保留 MVP 固定地址、支付方式、Security Reminder、线下联络付款等前提下，增加 **购物车、合并下单、折扣展示、推荐与邮件**，并统一 **交易步骤** 与 **浏览导航** 的划分规则。

**本期仍不负责**：Purchase Orders List / Detail 的搜索、导出、Buy Again、Cancel 等大改（维持 MVP 或他方迭代）。PO 侧仅因 **一单多 SKU 行** 在数据模型上被动兼容，**不要求** 本期改 PO 页面。

---

## 二、与 MVP 线上能力的关系（影响面）

MVP v1.0 核心链路可归纳为以下 **4 点**（与终稿 §四、§五 对应）。本期迭代 **均会波及**，但 **改动深度不同**：

| 编号 | MVP 线上能力（v1.0） | 本期是否改动 | 影响摘要 |
|------|----------------------|--------------|----------|
| **1** | **Product Discovery**（选品浏览：Tab、搜索、SPU 卡片、分页） | **是（展示层）** | 卡片价支持 **划线原价 + 折扣 Tag（-X%）**；**无** Discovery 推荐区块。 |
| **2** | **Product Detail + Buy Now**（详情、SKU 选择、立即购买弹窗） | **是（能力扩展）** | 新增 **Add to Cart**；保留 **Buy Now**；详情价与 **-X%**；**You May Also Like**；Buy Now 与 Cart 进入 Checkout 的 **路径分离**（见 §四）。 |
| **3** | **Checkout**（固定达卡地址、Remark、Payment、Security、Order & Pay） | **是（结构扩展）** | 商品区由 **单行** 变为 **多 SKU 行**；**Cart 与 Checkout 均可改数量**；Grand Total 按行汇总；创建 **一个** 采购单、**多行明细**。 |
| **4** | **Order Success**（成功话术、Order No.、Grand Total、Contact、跳转） | **是（内容与触达）** | 增加 **邮件已发送** 类提示（与 §方案 D 一致）；**You May Also Like**；Grand Total 与合并单一致；仍 **无** 2B 账户、**无** 上传凭证。 |

**MVP 中明确「本期不做」项在本期的态度**：

| MVP v1.0「不做」 | 本期 |
|------------------|------|
| 购物车 | **本期做**（Cart 页 + 顶栏入口/角标） |
| Success 推荐区 | **本期做**（仅 Detail + Success，不做 Discovery） |
| 多 SKU 一单 | **本期做**（合并下单） |

**不在本期四条内、维持 MVP 的模块**（仅列关系，不展开需求）：

- **Purchase Orders List / Detail**、**Publish to Store**、**Orders List**、**Source Products 引流** — 行为与 MVP 一致；PO 详情将来展示多 SKU 行属数据展示，**非本期页面范围**。

---

## 三、本期功能范围（方案 A / B / C / D）

以下四项为本期 **已确认** 的产品方案（与 `seller-2c-product-sourcing-prd-v2.0.md` §三 决策 D1–D4 一致），按模块归纳便于评审：

### 方案 A — 购物车与合并结算

| 项 | 说明 |
|----|------|
| **Cart 页** | 单店、单 2B 货源；列表展示 SKU 行（图/标题/规格/价/数量/行小计）；删行；空车不可 Checkout。 |
| **合并下单** | Cart 一次 **Checkout → Order & Pay** 生成 **一个** 采购订单（Pending Payment），**items 多 SKU 行**。 |
| **数量** | **Cart、Checkout 均可** 用步进器改数量，实时重算行小计与 Grand Total；Checkout 改量需与 Cart 状态同步（以 v2.0 为准）。 |
| **入口** | 顶栏 **Cart** + 角标（件数或 SKU 数，与研发统一一种）。 |

**影响 MVP 点**：**2**（Add to Cart）、**3**（多行 Checkout）、**4**（Success 总额为合并结果）；间接影响 PO 数据结构（**不在本期改 PO UI**）。

### 方案 B — Buy Now 与 Cart 双路径

| 路径 | 交易步骤（见 §四） | 行为 |
|------|-------------------|------|
| **Cart 路径** | Cart → Checkout → Order Success | Checkout 携带 Cart **全部有效行**（多 SKU）。 |
| **Buy Now 路径** | Checkout → Order Success | 弹窗确认数量后 **直达 Checkout**，**仅当前 SKU 一行**；**不自动合并** Cart 内其他商品（避免误下单）。 |

**影响 MVP 点**：**2**（Buy Now 仍保留，语义从「唯一入口」变为「快捷单行入口」）、**3**（Checkout 需区分 `from=cart` / `from=buynow` 类来源）。

### 方案 C — 划线价与折扣 Tag（-X%）

| 项 | 说明 |
|----|------|
| 字段 | `salePrice`（现价）、`originalPrice`（可选原价）。 |
| 展示 | 当 `originalPrice` > `salePrice` 时：**划线原价** + 现价 + Tag **`-{percent}%`**（如 **-20%**）；无原价则不展示 Tag。 |
| 位置 | Discovery 卡片、Detail 价格区、Cart 行、Checkout 行（Checkout 可不重复 Tag，仅价格，见 v2.0 §5.7）。 |

**影响 MVP 点**：**1**、**2**、**3**（及 Cart）均为 **展示与算价展示**；不改变 MVP 运费/COD=0、仅 Grand Total 的 Summary 策略。

### 方案 D — 推荐与邮件（下单链路）

| 项 | 说明 |
|----|------|
| **推荐** | **Product Detail**、**Order Success** 展示 **You May Also Like**（规则推荐：热销/同类目/本店最近采购等）；**Discovery 不做** 推荐区块。 |
| **邮件** | **采购单创建** → 2C 店主邮箱；**2B 确认收款** → 2C + 2B（状态跃迁，他方触发）；Success 页可增加「确认邮件已发送」提示，发送失败可降级提示、不阻断成功页。 |

**影响 MVP 点**：**2**、**4**；不改变 MVP Contact Information（Phone / payment@kickbazar.com）。

---

## 四、交易步骤与导航划分（本期 PRD 约定，原型待做）

后台仍为 **Product Sourcing** 模块（侧栏 Discovery、Purchase Orders List 不变）。下单子流程采用 **交易步骤条** 表达进度；**浏览** 与 **交易** 分层，避免用长面包屑冒充结账进度。

### 4.1 交易步骤条（Checkout Steps）

| 用户路径 | 步骤条节点（从左到右） |
|----------|------------------------|
| **经 Cart 下单** | **Cart** → **Checkout** → **Order Success** |
| **Buy Now 直达** | **Checkout** → **Order Success**（**不出现 Cart 步骤**；Buy Now 弹窗承担数量确认，不单独占一步） |

说明：

- **Product Discovery / Product Detail** 属于 **选品浏览**，**不纳入** 上述步骤条（无「第 0 步 Discovery」）。
- **Checkout 页内** 的「1. Shipping Address / 2. Product Information / 3. Payment Method」为 **页内模块编号**，与全局步骤条 **Cart | Checkout | Order placed** 并存、不互相替代。
- **Purchase Orders List / Detail** 使用 **订单状态时间线**（MVP 已有），**不复用** 结账步骤条。

### 4.2 面包屑（Breadcrumb）原则（本期约定）

| 区域 | 面包屑策略 |
|------|------------|
| **浏览区**（Discovery、Detail） | `Product Sourcing › …` 与菜单一致；Detail 可带 Discovery 上级。 |
| **交易区**（Cart、Checkout、Success） | 建议 **缩短** 为模块级，例如 `Product Sourcing › Place Purchase Order`（英文文案以 UI 规范为准），**不以** `Discovery › Detail › Checkout › Success` 串联真实浏览路径。 |
| **订单管理**（PO List、PO Detail） | 维持 MVP：`Product Sourcing › Purchase Orders List › {PO No.}` |

具体文案与是否可点击回退，在 UI 规范定稿时与步骤条一并落地；**本期 PRD 只锁定步骤节点划分**（§4.1）。

---

## 五、本期交付物与文档关系

| 交付物 | 说明 |
|--------|------|
| **本文** | 迭代范围、MVP 影响面、A–D 方案、交易步骤划分。 |
| **PRD v2.0** | 各页面字段、交互、AC、接口草案的 **完整正文**。 |
| **PRD v2 planning** | 历史规划与边界；开放问题已定稿部分见 planning §八。 |
| **HTML 原型** | **待** 本期 PRD + 导航规则评审通过后，再按 v2.0 与 §四 调整（当前原型可能含旧面包屑，**不以原型为准**）。 |

---

## 六、验收范围（索引）

完整 AC 见 [PRD v2.0 §七](seller-2c-product-sourcing-prd-v2.0.md#七验收标准ac)。本期评审最小集：

| ID | 场景 |
|----|------|
| AC-V2-01 ~ 04 | Cart、双路径 Buy Now、Checkout 多行与改量 |
| AC-V2-05 | 一单多 SKU |
| AC-V2-06 ~ 08 | 折扣 Tag、Detail/Success 推荐、创建订单邮件 |

**导航/步骤条**：建议在 UI 定稿后补充 AC（如：Cart 路径三步条可见、Buy Now 路径仅两步），纳入原型迭代任务，**不阻塞** A–D 后端与主流程开发时可并行。

---

## 七、版本记录

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026/09/28 | iteration-scope-1.0 | 初稿：MVP 四点影响面、方案 A–D、Cart/Buy Now 交易步骤划分 |

---

*本期迭代范围说明 · Order flow iteration scope · 2026/09/28*
