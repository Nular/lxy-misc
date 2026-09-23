# KickBazar ToC Web — 产品需求文档（PRD）

| 时间 | 版本号 | 变更人 | 主要变更内容 |
|------|--------|--------|-------------|
| 2026/09/09 | v1.0 | 廖炫尧 | 首版 |
| 2026/09/20 | v1.1 | — | Sort By 四档；Checkout 数量；运费三档；地址空态不弹窗+两列；优惠券下期；COD 划线 Free；结果页订单详情；Sticky 导航；Tag 跳专题；搜索/分类去 Filter&Featured |
| 2026/09/20 | v1.1.1 | — | 购物车 SKU 上限 50；超限拦截加购 + 删除引导（英文文案见 changes §12） |
| 2026/09/21 | v1.1.2 | — | 购物车页（/cart）仅登录可进（已被 v1.1.3 扩展） |
| 2026/09/21 | v1.1.3 | — | **加购 + 购物车页均须登录**；取消游客购物车 localStorage/合并 |
| 2026/09/21 | v1.2 | — | 订单详情跳最新单；地址三行截断；Categories 抽屉跳转规则；分类页 Filter（L2 跳转 / L3 筛选） |
| 2026/09/21 | v1.2.1 | — | 未选全 SKU 加购 Toast；Sticky 在 /cart 隐藏 Cart 入口 |
| 2026/09/21 | v1.2.2 | — | 无独立 #17 规格 Modal；规格区内嵌 PDP 购买区 |
| 2026/09/23 | v1.2.3 | — | §4.4 改为首页（Banner+一级分类+特色馆+Recommended）；§4.7.9–4.7.12 推荐组件保持不变 |

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
| 首页 | 核心展示区（Banner + 一级分类 + 特色馆 + Recommended）、服务介绍（#7） | P0 |
| 搜索 | 搜索弹窗、结果列表、排序 | P0；**不含 Featured Tab、类目 Filter** |
| 分类 | 一级/二级分类、分类商品列表、**页内 Categories Filter** | P0；L1 页 Filter 含 L2（跳转）；L2 页 Filter 含 L3（本页筛选） |
| 商品 | 商品详情（**含内嵌规格选择区**，无独立 #17 Modal）、推荐组件 | P0 |
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
   - **本期做**：搜索/分类/店铺 Items Tab 排序（**与 App 一致**：From Z-A / A-Z / Newest / Oldest，见 §4.5）；**分类页 Categories Filter**（L1 页筛 L2 并跳转；L2 页筛 L3 本页 `?l3=` 筛选，见 §4.6）。
   - **本期不做**：搜索结果页 Featured Tab、**搜索结果页**类目 Filter（L1–L3）；Recommend / New Arrival / Price / Sales 四档排序（§6.2 P1）；价格/颜色/尺码/品牌等多维 Filter；**优惠券见 §6.1**。
6. 购物车：**须登录**方可 Add to Cart 与进入 `/cart`（BR852）；**不做游客购物车**（无 localStorage 暂存、无登录合并）；数据仅存账号购物车。
7. 专题：品牌馆、国家馆、精选、潮流四馆均为本期 P0。

---

## 三、产品概述

（v1.0 §3.1 保持不变）

### 3.2 产品目标（v1.1.3 修订）

支持孟加拉本地地址与 COD；**Web 加购/购物车须登录**，数据仅存账号购物车（**不做游客 localStorage / 登录合并**）。

### 3.4 跨模块衔接规范（v1.1 修订摘录）

| 场景 | 规则 |
|------|------|
| 未登录访问结算/订单/地址/**购物车页** | 跳转 `/login?redirect={encodeURIComponent(当前URL)}`（BR619；购物车页见 **BR852**） |
| **未登录 Add to Cart** | BR619 → `/login?redirect={encodeURIComponent(当前页URL)}`；回跳后**保留已选 SKU**（同 Buy Now） |
| **未登录访问 /cart 或点击 Header/Sticky 购物车** | BR852 → `/login?redirect=/cart`；登录成功后进入 /cart |
| 购物车「去结算」 | 用户在 /cart 时已登录；Checkout → /checkout；3 步条 Cart → Checkout → Order Complete |
| PDP Buy Now | 在内嵌规格区选全 SKU；未选全→BR854；须登录（BR619），回跳保留 SKU；**不唤起 #17 Modal** |
| Header 账户入口 | 跳转个人中心/登录模块/订单 |
| 会话过期 | 接口 401 时 Toast 提示并跳转登录（回跳当前页） |
| 商品卡 | 固定尺寸；**点击 topicTag 跳转专题页（BR847）** |
| Categories 抽屉 | **L1 列点击不跳转**（仅联动 L2）；L2 **View All** → `/category/{l1Id}`；L2 **类目项** → `/category/{l2Id}`（BR301/BR308） |
| 次导航 L1 快捷入口 | 仍跳转 `/category/{l1Id}`（与抽屉 L1 行为区分） |
| 分类落地页 | L1 页：Banner + **Categories Filter（L2）** + 列表；L2 页：Banner + **Categories Filter（L3）** + 列表 |
| PDP 加购 | 未选全 SKU → Toast「Please select product spec」，点击无效（BR854）；选全后须登录加购（BR619/BR406） |
| PDP 立即购买 | 内嵌规格区选全后 Buy Now 直达 /checkout；未选全→BR854 |
| Buy Now 步骤条 | 仅 Checkout → Order Complete 两步 |
| **登录后 redirect 回 checkout** | 若仍无 addressId，Shipping Address 展示**空态 + Add New Address**，**不自动弹 Modal** |
| Save 地址成功 | 写入地址库；绑定 addressId；Order Summary 可继续操作 |
| 退出登录 | 清除会话；Header 切未登录态；跳转首页 `/` |

---

## 四、功能需求明细

（章节说明、BR 复用索引同 v1.0，略）

### 4.4 模块 A：首页核心展示区（#6）

#### 基本信息

| 属性 | 内容 |
|------|------|
| 页面编号 | #6 |
| 路由 | `/` |
| 类型 | 页面 |
| 优先级 | P0 |
| 关联模块 | #18 全局推荐组件（§4.7.9–4.7.12）、#35–#38 专题页（§4.10）、#13 分类抽屉 |

#### 4.4.1 功能描述

首页核心展示区是 Web 商城默认落地页，承担运营曝光、品类分流与商品发现职责。主内容区自上而下固定为四段结构（与 App/UI 一致）：

```
【Banner】→ 【一级分类】→ 【特色馆】→ 【Recommended】
```

| 区块 | 说明 |
|------|------|
| **Banner** | 运营轮播头图；可配置跳转专题页、分类页或外链（外链 `target="_blank"`） |
| **一级分类** | App L1 分类快捷入口（宫格或横滑）；点击跳转 `/category/{l1Id}` |
| **特色馆** | 四大专题固定入口：Brand Zone / Country Pavilion / Featured / Trending；跳转 §4.10 对应专题路由 |
| **Recommended** | 首页推荐商品流；嵌入全局组件 #18（`scene=home`）；含 View More（BR825） |

> **服务介绍（#7）** 为首页底部独立营销区块（Product Replace / Secure Payment 等），与 Header 保障条职责分离，不在上述四段结构内重复描述。

**功能清单**

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|----------------|-----------------|---------|
| FL015 | 首页 Banner | Home Banner | 轮播运营位，可链专题/分类 |
| FL016 | 一级分类入口 | L1 Category Entry | L1 宫格/横滑，跳转一级分类页 |
| FL017 | 特色馆入口 | Topic Pavilion Entry | 四馆固定入口横滑/宫格 |
| FL018 | 首页 Recommended | Home Recommended | 嵌入 #18，`scene=home`，View More |
| FL019 | Banner 跳转 | Banner Navigation | 点击 Banner 按配置跳转 |
| FL020 | 特色馆跳转 | Pavilion Navigation | 四馆入口跳转专题页 |
| FL138 | View More 加载 | View More Pagination | 首页 Recommended 每次加载 10 行（BR825） |

**业务规则**

1. 四段结构顺序固定：Banner → 一级分类 → 特色馆 → Recommended；缺数据区块可隐藏，但不改变其余区块相对顺序。
2. Banner：无配置时不展示占位；支持多图轮播；切换不阻断页面滚动。
3. 一级分类：数据与 App 分类树 L1 一致；排序与 App 一致；点击跳转 `/category/{l1Id}`（与 Header 次导航 L1 目标一致）。
4. 特色馆：四入口固定展示（品牌馆 / 国家馆 / 精选 / 潮流）；`topicType` 映射同 §4.10；下线专题入口可隐藏或置灰（运营配置）。
5. Recommended：标题默认「Recommended」（可 i18n 配置）；召回与展示规则见 **§4.7.9–4.7.12**（`displayMode=recommended` 随机序；与 Sort By 的 recommend 枚举严格区分）。
6. 首页商品卡：样式与交互同 **BR120**；含 `topicTag` 时点击 Tag 跳转专题（**BR847**）。
7. View More：首屏若干行 + 每次 10 行；刷新页面重置（**BR825**）。
8. 浏览首页无需登录；加购/购物车门禁同 §3.4。

#### 4.4.2 字段定义（摘录）

**Banner**

| 字段名 | 中文名称 | 类型 | 必填 | 说明 |
|--------|---------|------|------|------|
| bannerId | Banner ID | string | 是 | 唯一标识 |
| imageUrl | 图片地址 | string | 是 | 轮播图 |
| linkType | 链接类型 | enum | 是 | topic / category / external |
| linkTarget | 跳转目标 | string | 否 | 专题 ID、categoryId 或外链 URL |
| sortOrder | 排序 | number | 是 | 升序 |

**一级分类入口**

| 字段名 | 中文名称 | 类型 | 必填 | 说明 |
|--------|---------|------|------|------|
| categoryId | 分类 ID | string | 是 | L1 ID，路由 `/category/{id}` |
| categoryName | 分类名称 | string | 是 | 支持 i18n |
| iconUrl | 图标 | string | 否 | 宫格图标 |

**特色馆入口**

| 字段名 | 中文名称 | 类型 | 必填 | 说明 |
|--------|---------|------|------|------|
| topicType | 专题类型 | enum | 是 | brand / country / featured / trending |
| topicTitle | 展示标题 | string | 是 | 如 Brand Zone，支持 i18n |
| coverUrl | 入口图 | string | 是 | 特色馆入口图 |
| topicUrl | 专题路由 | string | 是 | 跳转路径，同 §4.10 |

**首页 Recommended**：复用 §4.7.9–4.7.12 组件配置 + §4.7.11 通用商品卡字段。

#### 4.4.3 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR115 | 首页加载 | 进入 `/` | 渲染四段结构 | 加载● 错误● | 顺序正确 |
| BR116 | Banner 轮播 | 有多图 | 自动/手动切换；点击按 linkType 跳转 | — | 外链新标签 |
| BR117 | 一级分类点击 | 点击 L1 入口 | 跳转 `/category/{l1Id}` | — | 与 App L1 一致 |
| BR118 | 特色馆点击 | 点击四馆入口 | 跳转对应专题页（§4.10） | — | 四馆均可达 |
| BR119 | 首页 View More | scene=home 点击 View More | 同 BR208；每次 10 行；刷新重置 | 加载● | 空态 CTA |
| BR120 | 商品卡 | 点击 Recommended 卡片 | 主体→PDP；topicTag→专题（BR847） | — | 热区独立 |

---

### 4.5 模块 B：搜索（#8–#12）

#### 4.5.1 功能描述

1. **搜索下拉（#8）**：Header 搜索框点击展开，Recent + Discovery；点击词条跳转 `/search?q=`。
2. **搜索结果页（#9）**：命中商品列表 + 排序（#12）。URL 带 `q`。本期**不含**类目 Filter（#11）与 Featured Tab（#10）。
3. **结果排序（本期与 App 一致）**：默认 **From Z-A**；选项 From Z-A、From A-Z、Newest first、Oldest first（BR211）。Recommend / New Arrival / Price / Sales 四档见 **§6.2 P1（下期）**。

#### 4.5.2 sort 排序枚举（本期有效，全站复用）

| 枚举值 | 中文名称 | 英文名称 | 字段说明 |
|--------|---------|---------|---------|
| name_desc | From Z-A | From Z-A | **默认**。商品名称 Z→A |
| name_asc | From A-Z | From A-Z | 商品名称 A→Z |
| new_arrival_desc | Newest first | Newest first | 按商品更改时间（update）倒序 |
| new_arrival_asc | Oldest first | Oldest first | 按商品更改时间正序 |

**Sort By 下拉展示（本期四档）：** From Z-A · From A-Z · Newest first · Oldest first

> **下期（§6.2 P1）：** recommend / new_arrival / price_asc / price_desc / sales_asc / sales_desc 六档 Web 四档 UI（Recommend · New Arrival · Price · Sales）。

#### 4.5 业务规则（摘录）

- 默认 `sort=name_desc`（From Z-A）。
- 分页：首屏 10 行 + View More（BR825）。
- **本期不做**搜索结果页类目 Filter 与 Featured Tab。
- 无结果：空态 + Recommended 组件。

#### 4.5.3 交互（摘录）

| 编号 | 需求名称 | 交互行为 | 验收标准 |
|------|---------|---------|---------|
| BR211 | 排序 | 四档 From Z-A / A-Z / Newest / Oldest；默认 From Z-A；URL 写 `sort=`（BR212） | 与 App 一致 |
| BR207–BR210 | 结果列表/空态 | 同 v1.0 | — |
| BR212–BR213 | URL 同步/反馈 | 同 v1.0 | — |
| BR825 | View More | 同 v1.0 | — |

**删除（v1.1）：** BR828（结果类目 Filter）、BR837（Featured Tab）

---

### 4.6 模块 C：分类（#13–#15）— v1.2 技术评审修订

#### 分类抽屉（#13）

三列布局：**L1｜L2 + View All｜Recommend**（BR301）。

| 操作 | 行为 |
|------|------|
| Hover/点击 **L1**（第一列） | **不跳转**；仅联动展示第二列 L2 列表 + 第三列 Recommend |
| 点击 **L2 View All** | 跳转 **一级类目页** `/category/{l1Id}`；面包屑 Home › {L1} |
| 点击 **L2 类目项** | 跳转 **二级类目页** `/category/{l2Id}`；面包屑 Home › {L1} › {L2} |
| 第三列 Recommend | 商品卡同 BR120；**一级类目不跳转**（Recommend 区商品进 PDP） |

> 次导航栏 L1 快捷入口仍跳转 `/category/{l1Id}`，与抽屉 L1「仅联动不跳转」区分。

#### 分类落地页 + Categories Filter（v1.2 恢复，仅分类页）

| 页面 | Filter 内容 | 选择行为 |
|------|------------|---------|
| **一级页** `/category/{l1Id}` | Categories：**二级类目（L2）** 列表 | 选中某 L2 → **跳转** `/category/{l2Id}` |
| **二级页** `/category/{l2Id}` | Categories：**三级类目（L3）** 列表 | 选中某 L3 → **本页筛选**，URL `?l3={l3Id}`，刷新商品列表；Clear 清除 `l3` |

- 默认（无 `l3`）：二级页展示该 L2 下全部商品。
- Filter 仅 **Categories** 一列/组；不含价格/属性多维 Filter。
- 与搜索页 Filter（BR828，本期不做）场景独立。

| 编号 | 需求名称 | 交互行为 | 验收标准 |
|------|---------|---------|---------|
| BR301 | 分类抽屉 | L1 不跳转；L2 View All→L1 页；L2 项→L2 页 | 三列联动 |
| BR308 | 抽屉跳转 | 见上表；**删除**「抽屉 L1 点击进 L1 页」 | 与次导航 L1 区分 |
| BR836 | 分类页 Categories Filter | L1 页筛 L2→跳转；L2 页筛 L3→?l3= 本页过滤 | 与搜索 Filter 独立 |

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

### 4.7 模块 D：商品详情（#16）— v1.2.2 内嵌规格区

**无独立规格选择器页面/Modal（#17 本期不做）。** SKU 规格与数量选择内嵌于 PDP **右侧购买区**（与 App 一致），Add to Cart / Buy Now 均在此完成。

| 规则 | 说明 |
|------|------|
| 布局 | 左图右购；右侧含 SKU 属性、数量步进、Add to Cart、Buy Now |
| 规格交互 | 同 **BR403**（属性高亮、缺货置灰、切换 SKU 数量归 1、价格联动 BR415） |
| Add to Cart | 未选全 SKU → **BR854** Toast「Please select product spec」，点击无效；选全→登录门禁→加购 **BR406** |
| Buy Now | 未选全 SKU → **BR854**；选全→**BR407**（登录→/checkout），**不经过 #17、不经过 /cart** |
| 禁止 | 不实现居中 Modal / Bottom Sheet 规格弹层（原 #17）；列表快捷加购不唤起规格弹层 |

| 编号 | 名称 | 交互 | 验收 |
|------|------|------|------|
| BR403 | 内嵌规格区 | PDP 右侧选 SKU + 数量 | 无 #17 Modal |
| BR406 | 加购 | 未选全→BR854；选全→BR619/加购/BR832 | 不唤起 #17 |
| BR407 | Buy Now | 未选全→BR854；选全→BR619→/checkout | 不唤起 #17 |
| BR854 | 规格未选全 | Add to Cart / Buy Now 且 SKU 未选全 | Toast「Please select product spec」 |

> 原 **BR412–BR417**（#17 Modal）本期不验收；交互合并至 BR403/406/407/854。

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
| BR406 | PDP 加购 | 点击 Add to Cart | 未选全→BR854；选全未登录→BR619；选全已登录→BR832 | SKU→登录→加购；无 #17 |
| BR854 | 规格未选全 | Add/Buy Now 且 SKU 未选全 | Toast「Please select product spec」；无效点击 | 不调 API |
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
| 已填态 | **三行只读卡片**（上：姓名+电话；中：详细地址，过长**截断**；下：Division·District·Area）；Change / Edit |
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

1. **View Order Details** → `/account/orders/{orderId}`，**orderId 为本单提交返回的最新订单 ID**（即刚完成的订单，BR853）
2. **View Order List** → ordersListUrl

**本期不做：** 优惠券 Coupon & Code（§6.1）

#### 4.9.8 交互（地址/运费/结果 — v1.1）

| 编号 | 需求名称 | 交互行为 | 验收标准 |
|------|---------|---------|---------|
| BR620a | 地址空态 | 空态 + Add New Address；不自动弹窗 | 可浏览结算页 |
| BR620b | 地址展示 | 三行卡片：姓名电话 / 详细地址（truncate）/ 省市区 | 长地址 ellipsis |
| BR620c | 下单门禁 | 无 addressId → Toast，不提交 | 可手动 Add |
| BR632 | Change Address | 列表 Modal，卡片布局同 BR620b | 三行一致 |
| BR853 | 查看订单详情 | 结果页 View Order Details | 跳转**本单 orderId**（最新一笔） |
| BR622 | 发货档位 | Standard / Air Express / Air Priority；动态运费 | 非固定 60 |
| BR623 | COD | COD 行：划线价 + **Free** | fee=0 仍展示 |
| BR628 | 结果成功 | View Order Details（BR853 最新单）+ View Order List | orderId 来自提交响应 |
| BR625–626 | 优惠券 | **下一期 P1，本期不验收** | — |

---

### 4.12 模块 G3：全局 — 右侧 Sticky 快捷导航（#40）

#### 4.12.1 功能描述

**块 A — 快捷导航（FL140）：** 视口右侧 fixed，纵向 **Home / 客服 / Cart**（**`/cart` 页隐藏 Cart 入口**，仅展示 Home + 客服，BR855）；其余页面 Cart 角标同 Header BR106。

**块 B — 回顶部（FL141）：** 独立小块；scrollY > 80px（同 BR103）后淡入；点击 smooth scroll 至顶。

**互斥：** 全屏 Modal 打开时 A/B 均隐藏。

**客服：** 跳转 supportEntryUrl（同 BR806）。

#### 4.12.3 交互

| 编号 | 需求名称 | 交互行为 |
|------|---------|---------|
| BR840 | 快捷导航常驻 | 默认 Home / 客服 / Cart 固定右侧；**/cart 路由下块 A 仅 Home+客服**（BR855） |
| BR841 | 回顶显隐 | 超阈值展示块 B |
| BR842–BR843 | Home / 客服 | /、supportEntryUrl |
| BR844 | Sticky Cart | 非 /cart 页→/cart；未登录→login?redirect=/cart |
| BR855 | Sticky 隐藏 Cart | 路由为 /cart（含 ?mode=edit） | 块 A 不展示 Cart Icon | — | Home/客服仍展示 |
| BR845 | 回顶点击 | smooth scroll |
| BR846 | Modal 互斥 | Modal 开时隐藏 |

---

## 六、扩展计划

### 6.1 本期不做

| 项目 | 说明 |
|------|------|
| **规格选择器独立 Modal（#17）** | 规格区内嵌 PDP；不实现单独弹层/页面 |
| 价格/属性多维 Filter | 颜色、尺码、品牌、价格区间等 |
| **搜索结果页 Filter & Featured** | 搜索页 L1–L3 Filter、Featured Tab（**分类页 Categories Filter 本期做**，见 §4.6） |
| **优惠券 Coupon & Code** | 券码输入、Drawer 选券、Summary Coupon 行 — **下一期 P1** |
| **Recommend/New Arrival/Price/Sales 四档排序** | 本期 Sort By 与 App 一致（A-Z 四档）；Web 四档 UI — **下一期 P1** |
| Header 购物车预览（#22） | 本期不做 |
| 在线钱包支付 | 与 App 同期不做 |
| 发票（#34） | 下一期 P1 |

### 6.2 P1 扩展（摘录）

| 功能 | 说明 |
|------|------|
| Sort By 四档 UI | Recommend / New Arrival / Price / Sales（含 recommend 平台序→商家序→更改时间） |
| 优惠券 Coupon & Code | 结算页券码、Drawer 选券、Order Summary Coupon 行 |
| 搜索页类目 Filter | L1–L3 Filter（BR828） |
| Featured Tab | 搜索结果四大馆 Tab（BR837） |

### 6.3 P2（摘录）

游客购物车合并策略 — **【已关闭 v1.1.3】** Web 不做游客车。

---

## 七、验收总则（v1.2.2 无矛盾版）

**搜索 / 分类**

- [ ] 搜索页：Sort By 仅 From Z-A / A-Z / Newest / Oldest；**无 Filter / Featured**
- [ ] L1 页 Filter 含 L2，选 L2 → 跳转 L2 页
- [ ] L2 页 Filter 含 L3，选 L3 → `?l3=` 本页筛选
- [ ] 抽屉 L1 不跳转；L2 View All → L1 页；L2 项 → L2 页

**PDP / 购物车**

- [ ] 无 #17 Modal；规格内嵌购买区（BR403）
- [ ] 未选全 SKU → Toast「Please select product spec」（Add to Cart / Buy Now，BR854）
- [ ] 未登录 Add to Cart → login?redirect=当前页；未登录不可进 /cart（BR852）
- [ ] 已登录加购/进 cart；**无 localStorage 游客车**
- [ ] 购物车 ≤50 SKU；Checkout ({selectedQuantity})；满额/接近上限 Banner
- [ ] **/cart 页 Sticky 无 Cart**（BR855）；其他页有 Cart

**结算 / 结果**

- [ ] Checkout 按钮展示 `Checkout ({selectedQuantity})`
- [ ] 地址三行 + 详细地址截断（BR620b）；空态不自动弹 Modal
- [ ] 运费三档动态；COD 划线 Free；**无 Coupon UI**
- [ ] View Order Details → **本单 orderId**（BR853）

**首页**

- [ ] 首页结构：Banner → 一级分类 → 特色馆 → Recommended（§4.4）
- [ ] 特色馆四入口可达对应专题页；L1 分类跳转 `/category/{l1Id}`
- [ ] 首页 Recommended View More 每次 10 行（BR825）

**全局**

- [ ] 退出登录 → `/`（BR821）
- [ ] topicTag → 专题页（BR847）；Sticky + 回顶部

**已删除的过期验收项（勿保留于飞书正文）：**

- ~~分类落地页均不展示 Filter~~（v1.2 已恢复分类页 Filter）
- ~~登录后游客购物车自动合并~~（v1.1.3 取消游客车）
- ~~合并截断 Toast（BR851）~~

---

*完整 v1.0 未修订章节（Header、Footer、店铺、专题页结构、NFR、附录 FL/BR 索引等）仍以首版 PRD 为准。凡与本文冲突处，以本文、`kickbazar-toc-web-prd-feishu-clean.md`（飞书粘贴终稿）及 [`kickbazar-toc-web-prd-v1.1-changes.md`](./kickbazar-toc-web-prd-v1.1-changes.md) 为准。*
