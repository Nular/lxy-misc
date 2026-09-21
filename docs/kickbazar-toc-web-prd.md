# KickBazar ToC Web — 产品需求文档（PRD）

| 时间 | 版本号 | 变更人 | 主要变更内容 |
|------|--------|--------|-------------|
| 2026/09/09 | v1.0 | 廖炫尧 | 首版 |
| 2026/09/20 | v1.1 | — | Sort By 四档；Checkout 数量；运费三档；地址空态不弹窗+两列；优惠券下期；COD 划线 Free；结果页订单详情；Sticky 导航；Tag 跳专题；搜索/分类去 Filter&Featured |
| 2026/09/20 | v1.1.1 | — | 购物车 SKU 上限 50；超限拦截加购 + 删除引导（英文文案见 changes §12） |
| 2026/09/21 | v1.1.2 | — | 购物车页（/cart）仅登录可进（已被 v1.1.3 扩展） |
| 2026/09/21 | v1.1.3 | — | **加购 + 购物车页均须登录**；取消游客购物车 localStorage/合并 |

> **v1.1 变更对照与可复制段落**：见 [`kickbazar-toc-web-prd-v1.1-changes.md`](./kickbazar-toc-web-prd-v1.1-changes.md)

---

## 1.1 术语说明

| 术语 | 说明 |
|------|------|
| BR | Behavior Requirement，交互与体验行为需求编号，本文档从 BR101 起连续编号 |
| 同 BRxxx | 交互效果与 BRxxx 完全一致，本文档不再重复描述；若存在差异，仅在「差异说明」列补充 |
| PDP | Product Detail Page，商品详情页 |
| 门禁 | 未登录用户不可进入或不可完成的关键操作拦截 |
| 他人负责模块 | 登录页、注册页、个人中心入口页、Cookie 横幅——本文档仅定义衔接规则，不展开其内部 UX |

## 1.2 本文档范围

| 模块 | 页面/组件 | 本期范围说明 |
|------|----------|-------------|
| 全局 | 顶部导航（已登录、未登录）、信任背书区、底部信息区、**右侧 Sticky 快捷导航（#40）** | P0 |
| 首页 | 核心展示区、服务介绍 | P0 |
| 搜索 | 搜索弹窗、结果列表、排序 | P0；**不含 Featured Tab、类目 Filter** |
| 分类 | 一级/二级分类、分类商品列表 | P0；**不含页内 L3 Filter** |
| 商品 | 商品详情、规格选择器、推荐组件 | P0 |
| 店铺 | 店铺页、商品列表 Tab、店铺介绍弹框 | P0 |
| 交易 | 购物车/页面/编辑/折扣、结算、结果页、地址弹框 | P0 |
| 专题 | 品牌馆、国家馆、精选、潮流 | P0（四馆均为本期） |

---

## 二、产品背景介绍

（v1.0 内容保持不变，见首版 PRD §2.1–§2.3）

### 2.4 约束与原则

1. 功能不扩张：不新增 App 未覆盖的模块；仅做 Web 端应有 UI/UX 适配。
2. 业务真源：价格、库存、优惠、支付、地址规则与 App 保持一致。
3. 登录后置：浏览、搜索无需登录；**Add to Cart、购物车页（/cart）、结算与订单**为硬门禁（BR619 / BR852）。
4. 合规：本期不加载任何非必要第三方追踪脚本；Cookie 横幅由他人负责。
5. **分期与筛选：**
   - **本期做**：搜索结果排序、分类页/店铺 Items Tab 排序（Sort By 四档，见 §4.5 sort 枚举）。
   - **本期不做**：搜索结果页 Featured Tab、搜索结果页/分类页类目 Filter（L1–L3）、价格区间、颜色、尺码、品牌等多维属性 Filter；**优惠券见 §6.1**。
6. 购物车：**须登录**方可 Add to Cart 与进入 `/cart`（BR852）；**不做游客购物车**（无 localStorage 暂存、无登录合并）；数据仅存账号购物车。
7. 专题：品牌馆、国家馆、精选、潮流四馆均为本期 P0。

---

## 三、产品概述

（v1.0 §3.1–§3.3 保持不变）

### 3.4 跨模块衔接规范（v1.1 修订摘录）

| 场景 | 规则 |
|------|------|
| 未登录访问结算/订单/地址/**购物车页** | 跳转 `/login?redirect={encodeURIComponent(当前URL)}`（BR619；购物车页见 **BR852**） |
| **未登录 Add to Cart** | BR619 → `/login?redirect={encodeURIComponent(当前页URL)}`；回跳后**保留已选 SKU**（同 Buy Now） |
| **未登录访问 /cart 或点击 Header/Sticky 购物车** | BR852 → `/login?redirect=/cart`；登录成功后进入 /cart |
| 购物车「去结算」 | 用户在 /cart 时已登录；Checkout → /checkout；3 步条 Cart → Checkout → Order Complete |
| 规格选择器「立即购买」 | 未登录跳转登录，回跳后保留已选 SKU |
| Header 账户入口 | 跳转个人中心/登录模块/订单 |
| 会话过期 | 接口 401 时 Toast 提示并跳转登录（回跳当前页） |
| 商品卡 | 固定尺寸；**点击 topicTag 跳转专题页（BR847）** |
| 分类一级收敛入口 | 次导航 L1、抽屉 L1、L2 View All 均跳转 /category/{l1Id}；页面结构 **Banner + 商品列表**（无 Filter） |
| PDP 加购 | 须选全 SKU；**须登录**（未登录 → BR619）；成功 → BR832；满 50 SKU 且新 skuId → BR848 |
| PDP 立即购买 | Buy Now 直达 /checkout；Cart 页不展示该 SKU |
| Buy Now 步骤条 | 仅 Checkout → Order Complete 两步 |
| **登录后 redirect 回 checkout** | 若仍无 addressId，Shipping Address 展示**空态 + Add New Address**，**不自动弹 Modal** |
| Save 地址成功 | 写入地址库；绑定 addressId；Order Summary 可继续操作 |
| 退出登录 | 清除会话；Header 切未登录态；跳转首页 `/` |

---

## 四、功能需求明细

（章节说明、BR 复用索引同 v1.0，略）

### 4.5 模块 B：搜索（#8–#12）

#### 4.5.1 功能描述

1. **搜索下拉（#8）**：Header 搜索框点击展开，Recent + Discovery；点击词条跳转 `/search?q=`。
2. **搜索结果页（#9）**：命中商品列表 + 排序（#12）。URL 带 `q`。本期**不含**类目 Filter（#11）与 Featured Tab（#10）。
3. **结果排序**：默认 `sort=recommend`；搜索/分类/店铺 Items Tab 复用 Sort By（BR211–BR213）；四档：**Recommend / New Arrival / Price / 销量（Sales）**；不含 A-Z / Z-A。

#### 4.5.2 sort 排序枚举（全站复用）

| 枚举值 | 中文名称 | 英文名称 | 字段说明 |
|--------|---------|---------|---------|
| recommend | 推荐排序 | Recommend | **默认**。一级**平台序** → 二级**商家序** → 三级**商品更改时间（update）倒序**；与 App 一致 |
| new_arrival | 上新 | New Arrival | 按商品更改时间倒序 |
| price_asc | 价格从低到高 | Price Low to High | 售价升序 |
| price_desc | 价格从高到低 | Price High to Low | 售价降序 |
| sales_desc | 销量从高到低 | Sales High to Low | 销量降序 |
| sales_asc | 销量从低到高 | Sales Low to High | 销量升序 |

**下拉展示四档：** Recommend · New Arrival · Price（↑↓）· Sales / 销量（↑↓）

#### 4.5 业务规则（摘录）

- 默认 `sort=recommend`。
- 分页：首屏 10 行 + View More（BR825）。
- **本期不做**搜索结果页类目 Filter 与 Featured Tab。
- 无结果：空态 + Recommended 组件。

#### 4.5.3 交互（摘录）

| 编号 | 需求名称 | 交互行为 | 验收标准 |
|------|---------|---------|---------|
| BR211 | 排序 | 四档 Recommend/New Arrival/Price↑↓/销量↑↓；默认 Recommend | 无 A-Z；与 App 一致 |
| BR207–BR210 | 结果列表/空态 | 同 v1.0 | — |
| BR212–BR213 | URL 同步/反馈 | 同 v1.0 | — |
| BR825 | View More | 同 v1.0 | — |

**删除（v1.1）：** BR828（结果类目 Filter）、BR837（Featured Tab）

---

### 4.6 模块 C：分类（#13–#15）

#### 修订要点（v1.1）

- 抽屉仍为 L1 / L2 / Recommend 三列（BR301）。
- **分类落地页**：Banner + 商品列表 + Sort By；**无 L3 Filter 筛选条**。
- 删除 BR836、分类页 L3 Filter 相关 FL141/FL142c。

---

### 4.7 模块 D：商品 — 通用商品卡（§4.7.11 摘录）

| 字段名 | 说明 |
|--------|------|
| topicTag | 活动专区 Tag；**可点击跳转 topicUrl（BR847）** |
| topicUrl | Feature Tag 跳转专题页路径 |

#### BR847（新增）

| 编号 | 需求名称 | 触发条件 | 交互行为 | 验收标准 |
|------|---------|---------|---------|---------|
| BR847 | Feature Tag 跳转 | 点击商品卡/PDP topicTag | 跳转 topicUrl 对应专题页 | 与 topicType 映射一致 |

**BR120 增补：** 点击卡片主体 → PDP；点击 topicTag → 专题页（BR847）。

---

### 4.9 模块 F：交易

#### 4.9.1 购物车（#23–#25）— v1.1 增补

**登录门禁（v1.1.3）：**

- **Add to Cart**（PDP 等）：须登录；未登录 → BR619，`redirect` 为当前页 URL；回跳后保留已选 SKU。
- **`/cart`、`/cart?mode=edit`**：仅登录可进（BR852）；未登录直链或 Header/Sticky 购物车 → `login?redirect=/cart`。
- **取消游客购物车**：无 localStorage 暂存；Header 角标未登录时为 0 或隐藏；登录后展示账号购物车件数。

**Checkout 按钮数量：**

- 文案格式：`Checkout ({selectedQuantity})` / `去结算（{selectedQuantity}）`。
- `selectedQuantity` = 已勾选且 valid 的行 quantity 之和。
- 实时随勾选/改量更新；无有效勾选时 disabled。

**SKU 上限（v1.1.1，与 App 一致）：**

- 上限 **50 个 SKU**（50 条有效行，每行唯一 `skuId`）。
- Header 角标仍为**总件数**（quantity 合计），与 SKU 数不同。
- 页内可展示 `{cartSkuCount}/50 items`。
- `cartSkuCount >= 50` 且加购**新 skuId** → 拒绝，Toast（BR848）。
- 已在车中的 SKU **改数量**不受限（受库存/moq 约束）。
- `45 ≤ cartSkuCount < 50` → 信息条（BR850）；`= 50` → 警告条（BR849）。
- 账号购物车超 50 SKU 加购新 SKU → BR848。Buy Now 不受 SKU 上限约束。

| 编号 | 需求名称 | 交互行为 | 验收标准 |
|------|---------|---------|---------|
| BR618 | 去结算 | 已登录 /cart 上 Checkout ({selectedQuantity}) → /checkout | 数量联动；401→BR804 |
| BR852 | 购物车门禁 | 未登录 Add to Cart；或访问 /cart；或点购物车 Icon | Add to Cart → login?redirect=当前页；/cart 或 Icon → login?redirect=/cart | 无游客加购/无游客 cart 页 |
| BR406 | PDP 加购 | 未登录点击 Add to Cart | 同 BR619，redirect=当前 PDP URL；回跳保留 SKU | 已登录才调用加购 API |
| BR848 | 加购超限 | Toast: Cart limit reached (50 items)... | 新 SKU 失败；同 SKU 加量 OK |
| BR849 | 满额提示 | Warning banner + 50/50 items | 英文文案见 changes §12.1 |
| BR850 | 接近上限 | Info banner: almost full (n/50) | n 准确 |

#### 4.9.6 结算与地址 — v1.1 核心修订

**流程：** 地址 → 商品与备注 → 发货档位 → 确认金额 → 提交 → 结果页。（**无优惠券步骤**）

**Shipping Address：**

| 态 | 行为 |
|----|------|
| 空态 | 文案 + **Add New Address**；**不自动弹 Modal** |
| Add New Address | 打开 BR635 Modal；关闭后**留 checkout**，不 back |
| 已填态 | **两列只读卡片**（左：姓名/电话；右：Division·District·Area + 详细地址）；Change / Edit |
| Place Order 无地址 | Toast；不提交；不自动开 Modal |

**发货档位（与 App 一致，非 Local 固定价）：**

- Standard / Air Express / Air Priority
- 运费按 App 规则动态计算；切换档位或地址后重算
- 购物车不含运费

**Order Summary：**

- Subtotal + Promotion + **Shipping Fee（动态）** + **COD Handling Fee**
- **COD Handling Fee UI：** 展示一行；fee=0 时 **划线原价 + Free**
- **本期无 Coupon 行**

**结果页成功态 CTA：**

1. **View Order Details** → `/account/orders/{orderId}`
2. **View Order List** → ordersListUrl

**本期不做：** 优惠券 Coupon & Code（§6.1）

#### 4.9.8 交互（地址/运费/结果 — v1.1）

| 编号 | 需求名称 | 交互行为 | 验收标准 |
|------|---------|---------|---------|
| BR620a | 地址空态 | 空态 + Add New Address；不自动弹窗 | 可浏览结算页 |
| BR620b | 地址展示 | 两列确认卡片（ToB 样式） | 字段完整 |
| BR620c | 下单门禁 | 无 addressId → Toast，不提交 | 可手动 Add |
| BR632 | Change Address | 列表 Modal，**两列可选卡片** | 同 BR620b 布局 |
| BR622 | 发货档位 | Standard / Air Express / Air Priority；动态运费 | 非固定 60 |
| BR623 | COD | COD 行：划线价 + **Free** | fee=0 仍展示 |
| BR628 | 结果成功 | View Order Details + View Order List | 两按钮可达 |
| BR625–626 | 优惠券 | **下一期 P1，本期不验收** | — |

---

### 4.12 模块 G3：全局 — 右侧 Sticky 快捷导航（#40）

#### 4.12.1 功能描述

**块 A — 快捷导航（FL140）：** 视口右侧 fixed，纵向 **Home / 客服 / Cart**；Cart 角标同 Header BR106；路由切换保持。

**块 B — 回顶部（FL141）：** 独立小块；scrollY > 80px（同 BR103）后淡入；点击 smooth scroll 至顶。

**互斥：** 全屏 Modal 打开时 A/B 均隐藏。

**客服：** 跳转 supportEntryUrl（同 BR806）。

#### 4.12.3 交互

| 编号 | 需求名称 | 交互行为 |
|------|---------|---------|
| BR840 | 快捷导航常驻 | Home / 客服 / Cart 固定右侧 |
| BR841 | 回顶显隐 | 超阈值展示块 B |
| BR842–BR844 | 各入口跳转 | /、supportEntryUrl、/cart |
| BR845 | 回顶点击 | smooth scroll |
| BR846 | Modal 互斥 | Modal 开时隐藏 |

---

## 六、扩展计划

### 6.1 本期不做

| 项目 | 说明 |
|------|------|
| 价格/属性多维 Filter | 颜色、尺码、品牌、价格区间等 |
| **搜索结果/分类页 Filter & Featured** | L1–L3 Filter、Featured Tab |
| **优惠券 Coupon & Code** | 券码输入、Drawer 选券、Summary Coupon 行 — **下一期 P1** |
| Header 购物车预览（#22） | 本期不做 |
| 在线钱包支付 | 与 App 同期不做 |
| 发票（#34） | 下一期 P1 |

---

## 七、验收总则（v1.1 修订摘录）

- [ ] Sort By 四档与 App 一致（Recommend = 平台序→商家序→更改时间）
- [ ] Checkout 按钮展示 `Checkout ({selectedQuantity})`
- [ ] 运费三档 Standard / Air Express / Air Priority，非 Local 固定 60
- [ ] 结算无地址：空态 + Add New Address，不自动弹窗；关 Modal 留 checkout
- [ ] 地址确认/Change 两列布局
- [ ] 结算页无优惠券 UI
- [ ] COD Handling Fee 划线 + Free
- [ ] 结果页 View Order Details + View Order List
- [ ] 右侧 Sticky Home/客服/Cart + 回顶部
- [ ] 商品卡 topicTag 跳转专题页
- [ ] **搜索/分类页无 Filter、无 Featured Tab**
- [ ] **购物车 ≤50 SKU；新 SKU 加购拦截 + 删除引导；英文 Toast/Banner 文案一致**
- [ ] **未登录 Add to Cart → login?redirect=当前页；未登录不可进 /cart；Header/Sticky 购物车 → login?redirect=/cart**
- [ ] **无游客购物车 localStorage；登录后角标与 /cart 仅展示账号数据**

---

*完整 v1.0 未修订章节（Header、Footer、PDP 细节、店铺、专题页结构、NFR、附录 FL/BR 索引等）仍以首版 PRD 为准；凡与本文 v1.1 冲突处，以本文及 [`kickbazar-toc-web-prd-v1.1-changes.md`](./kickbazar-toc-web-prd-v1.1-changes.md) 为准。*
