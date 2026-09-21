# KickBazar ToC Web — PRD 对齐终稿（可直接粘贴飞书）

> 版本：**v1.2.2** | 对齐日期：2026/09/21 | 说明：合并 v1.0→v1.2.2 全部确认需求，消除重复块与矛盾表述。  
> **用法：** 按下方「必删清单」清理飞书现稿后，逐节粘贴替换；完整同步版见 [`kickbazar-toc-web-prd.md`](./kickbazar-toc-web-prd.md)；分项修订见 [`kickbazar-toc-web-prd-v1.1-changes.md`](./kickbazar-toc-web-prd-v1.1-changes.md)。

---

## 一、文档基础信息

| 时间 | 版本号 | 变更人 | 主要变更内容 |
|------|--------|--------|-------------|
| 2026/09/09 | v1.0 | 廖炫尧 | 首版 |
| 2026/09/20 | v1.1 | 廖炫尧 | Sort By（下期四档）；运费三档；地址空态；Sticky；Tag 跳专题；搜索去 Filter |
| 2026/09/20 | v1.1.1 | 廖炫尧 | 购物车 50 SKU 上限 + 英文 Copy |
| 2026/09/21 | v1.1.3 | 廖炫尧 | Add to Cart + /cart 须登录；取消游客购物车 |
| 2026/09/21 | v1.2 | 廖炫尧 | 订单详情跳本单 orderId；地址三行截断；抽屉 L1 不跳转；分类页 Filter |
| 2026/09/21 | v1.2.1 | 廖炫尧 | 未选全 SKU Toast；Sticky 在 /cart 隐藏 Cart |
| 2026/09/21 | v1.2.2 | 廖炫尧 | 取消 #17 规格 Modal；规格内嵌 PDP 购买区 |

### 1.1 术语说明

| 术语 | 说明 |
|------|------|
| BR | Behavior Requirement，交互编号，从 BR101 起 |
| 同 BRxxx | 与基准 BR 一致；差异在「差异说明」列补充 |
| PDP | Product Detail Page，商品详情页 |
| 门禁 | 未登录不可进入或不可完成的关键操作 |
| 他人负责模块 | 登录/注册/个人中心/Cookie 横幅——本文档仅定义衔接规则 |

### 1.2 本文档范围（唯一表，勿重复粘贴）

| 模块 | 页面/组件 | 本期范围说明 |
|------|----------|-------------|
| 全局 | 顶栏、信任背书、Footer、**右侧 Sticky（#40）** | P0 |
| 首页 | 核心展示区、服务介绍 | P0 |
| 搜索 | 搜索弹窗、结果列表、排序 | P0；**不含** Featured Tab、类目 Filter |
| 分类 | 一/二级页、**Categories Filter**、分类列表 | P0；L1 页 Filter=L2→跳转 L2 页；L2 页 Filter=L3→`?l3=` 本页筛选 |
| 商品 | 商品详情（**含内嵌规格区**）、推荐组件 | P0；**无独立 #17 Modal** |
| 店铺 | 店铺页、Items Tab、店铺介绍弹框 | P0 |
| 交易 | 购物车、结算、结果页、地址弹框 | P0；须登录加购/进 cart |
| 专题 | 品牌馆、国家馆、精选、潮流 | P0 |

---

## 二、产品背景介绍

### 2.1–2.3

（与 v1.0 一致，略）

### 2.4 约束与原则

1. 功能不扩张：不新增 App 未覆盖模块；仅 Web UI/UX 适配。
2. 业务真源：价格、库存、优惠、支付、地址与 App 一致。
3. **登录后置**：浏览、搜索无需登录；**Add to Cart、/cart、结算、订单**为硬门禁（BR619 / BR852）。
4. 合规：本期不加载非必要第三方追踪；Cookie 由他人负责。
5. **分期与筛选**
   - **本期做**：搜索排序（**与 App 一致**：From Z-A / A-Z / Newest / Oldest）；**分类页 Categories Filter**（L1→L2 跳转；L2→L3 本页筛选）；店铺 Items Tab 排序。
   - **本期不做**：搜索页 Featured Tab、**搜索页**类目 Filter、Recommend/New Arrival/Price/Sales 四档排序（§6.2）；价格/颜色/尺码/品牌等多维 Filter；优惠券（§6.1）。
6. **购物车**：须登录方可 Add to Cart 与进入 `/cart`；**不做游客购物车**（无 localStorage、无登录合并）；SKU 上限 50（§4.9.1）。
7. 专题四馆均为 P0。

---

## 三、产品概述

### 3.2 业务目标（修订）

支持孟加拉本地地址与 COD；**Web 加购/购物车须登录**，数据仅存账号购物车（**不做游客 localStorage/合并**）。

### 3.3 核心用户旅程（修订要点）

- 旅程 1：… → PDP **（内嵌选规格）** → **登录** → 加购 → cart → checkout …
- 旅程 2：… → PDP → Buy Now → checkout（2 步条）

### 3.4 跨模块衔接规范（唯一表）

| 场景 | 规则 |
|------|------|
| 未登录 Add to Cart | `/login?redirect={当前页 URL}`（BR619）；回跳**保留已选 SKU** |
| 未登录访问 /cart 或点 Header/Sticky 购物车 | `/login?redirect=/cart`（BR852） |
| 未登录访问 checkout/订单/地址 | `/login?redirect={当前 URL}`（BR619） |
| **PDP 规格未选全** 点 Add to Cart / Buy Now | Toast「**Please select product spec**」（BR854）；点击无效 |
| PDP Add to Cart（选全后） | 须登录→加购→BR832；满 50 新 SKU→BR848；**无 #17 Modal** |
| PDP Buy Now（选全后） | 须登录→`/checkout`；不经 cart、**无 #17** |
| Buy Now 步骤条 | 仅 Checkout → Order Complete |
| 购物车 Checkout | 用户在 /cart 已登录；`Checkout ({selectedQuantity})`→checkout |
| Categories 抽屉 L1 | **不跳转**；仅联动 L2 + Recommend |
| 抽屉 L2 View All | → `/category/{l1Id}` |
| 抽屉 L2 类目项 | → `/category/{l2Id}` |
| 次导航 L1 | → `/category/{l1Id}` |
| L1 分类页 Filter 选 L2 | → `/category/{l2Id}` |
| L2 分类页 Filter 选 L3 | 本页 `?l3={l3Id}` 筛选 |
| 登录回 checkout 无地址 | 空态 + Add New Address；**不自动弹 Modal** |
| Header/Sticky 购物车 | 已登录→/cart；未登录→login?redirect=/cart |
| **Sticky 在 /cart** | **隐藏 Cart 入口**（BR855）；Home/客服保留 |
| 退出登录 | 清会话；角标归零；跳转 **`/`**（BR821） |
| Save 地址成功 | 写地址库；绑定 addressId |

---

## 四、功能需求明细

### BR 复用索引（修正 BR120 行）

| 基准 BR | 交互名称 | 适用范围 |
|---------|---------|---------|
| BR120 | 商品卡 | 所有列表；主体→PDP；**topicTag→专题（BR847）** |
| BR137 | 列表空态 | 各业务列表 |
| BR201–202 | Modal 开/关 | 搜索、**地址**、店铺介绍、保障介绍（**不含 #17 规格**） |
| BR619 | 登录门禁 | Add to Cart、/cart、checkout、订单、地址等 |
| BR854 | 规格未选全 | PDP Add to Cart / Buy Now |
| BR855 | Sticky 隐藏 Cart | 路由 `/cart` |

---

### 4.1 全局 Header（#3）— 关键修订

**删除句：** 「与 §4.6 抽屉内 L1 点击、L2 View All 目标页一致。」

**登录态：** 退出登录→跳转 **`/`**；**删除**「规则 9 游客合并」表述。

**业务规则 6（替换）：** 退出登录→清除会话→跳转首页 `/`（非 loginUrl）。

**BR105 验收（替换）：** L1 **不跳转**；L2 View All→`/category/{l1Id}`；L2 项→`/category/{l2Id}`；次导航 L1→`/category/{l1Id}`。

**BR106：** 仅**已登录**加购成功更新角标；未登录走 BR852/BR619。

**规则 16：** Header 购物车 Icon：已登录→/cart；未登录→login?redirect=/cart。

---

### 4.5 搜索（#8–#12）— 本期排序定稿

**4.5.1 第 3 点：**
- **本期（与 App 一致）**：From Z-A（**默认**）、From A-Z、Newest first、Oldest first。
- **下期（§6.2）**：Recommend / New Arrival / Price / Sales 四档。

**sort 枚举（本期有效）：**

| 枚举值 | 英文展示 | 说明 |
|--------|---------|------|
| name_desc | From Z-A | 默认 |
| name_asc | From A-Z | |
| new_arrival_desc | Newest first | 更新时间倒序 |
| new_arrival_asc | Oldest first | |

**删除**本期 sort 表中的 recommend/price/sales 行（移入 §6.2）。

**BR211（本期唯一行）：** 点击 Sort By→上述四档；默认 From Z-A；URL 写 `sort=`（BR212）。

**业务规则：** 删除重复的第 5、7 点；保留「本期不做搜索 Filter/Featured」一条。

---

### 4.6 分类（#13–#15）

**路由约定（替换）：**
```
一级页 /category/{l1Id}
二级页 /category/{l2Id}
抽屉 L1：不跳转
抽屉 L2 View All → /category/{l1Id}
抽屉 L2 类目项 → /category/{l2Id}
次导航 L1 → /category/{l1Id}
L3 无独立路由；L2 页 ?l3= 筛选
```

**业务规则（替换 ①–⑤）：**
```
① 抽屉三列 L1｜L2+View All｜Recommend，不含 L3 列
② L1 页 Filter 展示 L2，选中→跳转 L2 页
③ L2 页 Filter 展示 L3，选中→?l3= 本页筛选，Clear 清除
④ ?l3= 与 URL 同步
⑤ Recommend 固定 10
```

**删除**【下期】BR833；保留 BR836、BR308、BR308a。

**FL142c 描述（修正）：** 一级页 L2 Filter（跳转，非 L2/L3 级联）。

---

### 4.7 商品（#16–#18）

#### 4.7.2 PDP 功能描述（对齐）

- 左图右购；**右侧内嵌**：SKU 属性 + 数量 + Add to Cart + Buy Now。
- **本期不实现 #17 Modal / Bottom Sheet**。
- Mobile：规格可在主内容区或底栏 Sticky 购买条，**仍为 PDP 同页内嵌**。

**页面模块：** 须登录加购/Buy Now；**无游客加购**。

**业务规则 3–4（替换）：**
```
3. Add to Cart：
   - 内嵌区选全 SKU；未选全→BR854 Toast「Please select product spec」，点击无效
   - 选全→登录(BR619)→50 SKU 校验(BR848)→加购→BR832
   - 不唤起 #17

4. Buy Now：
   - 未选全→BR854；选全→登录→/checkout
   - 不经 cart、不经过 #17
```

**FL048（修正）：** Buy Now — 内嵌区校验 SKU 后进结算（**不走 #17 Modal**）。

#### 4.7.4 交互（对齐）

| BR | 名称 | 行为 | 验收 |
|----|------|------|------|
| BR403 | 内嵌规格区 | SKU+数量；切换 SKU 数量归 1 | 无 #17 |
| BR406 | 加购 | 未选全→BR854；选全未登录→BR619；选全已登录→BR832 | 无游客加购 |
| BR407 | Buy Now | 未选全→BR854；选全→BR619→/checkout | 无 #17 |
| BR854 | 规格未选全 | Add/Buy Now + SKU 未选全 | Toast 固定英文文案 |

**删除 BR851**（无游客合并）。

#### 4.7.5–4.7.8 规格选择器（#17）

**【本期不做 — v1.2.2】** FL053–057、BR412–417 不验收。规格交互以 BR403/406/407/854 为准。

#### 4.7.11 字段定义

**删除误贴的 BR 交互表**；仅保留组件配置 + 通用商品卡字段（含 topicUrl）。

---

### 4.9 交易

#### 4.9.0 BR641（修正）

Cart 步前进：用户在 /cart **已登录**；仅 Checkout 按钮进结算；401→BR804（**删除**「未登录走 BR619」——/cart 本身已门禁）。

#### 4.9.1 购物车

**删除规则 16**（登录合并截断 / BR851）。

**规则 18–19 保留：** 购物车门禁 + 加购门禁。

**BR618（修正）：** 去结算 — 用户在 /cart 点击 Checkout；展示 `Checkout ({selectedQuantity})`；**删除「未登录●」**。

#### 4.9.6 结算 — 地址（三行布局 v1.2）

**已填态（替换两列描述）：**
```
第1行：Name + Phone（+880）
第2行：Address 详细地址（ellipsis 截断；Hover 可看全文）
第3行：Division · District · Area
Change 列表 Modal 每项同三行；支持选中/Edit/Delete
```

**BR620b（替换）：** 三行布局；长地址 truncate。

**Order Summary（替换）：**
```
Subtotal + Promotion + Shipping Fee（三档动态）+ COD Fee（划线原价 + Free）= Payable Amount
本期无 Coupon 行
```

**删除**「本期不做优惠券」下方的完整 Coupon Drawer 规格（移至 §6.1 一句概括）。

**结果页：**
- View Order Details → `/account/orders/{orderId}`（**本单响应 orderId**，BR853）
- View Order List → ordersListUrl

---

### 4.12 Sticky（#40）

**块 A 动态入口：**
- 默认：Home / 客服 / Cart
- **`/cart` 或 `/cart?mode=edit`：隐藏 Cart**（BR855），仅 Home + 客服
- Header 购物车 Icon 行为不变

**业务规则 11–12：**
```
11. navItemKey=cart 在 pathname 匹配 ^/cart 时不渲染
12. 隐藏 Cart 时块 A 重排为 2 Icon，不留空白占位
```

**BR840 验收（修正）：** 默认 Home/客服/Cart 三入口；**/cart 路由下块 A 仅 Home+客服**（与 BR855 一致）。

**BR844 验收增补：** Sticky Cart 仅在非 /cart 路由展示。

**BR855：** 进入 /cart→隐藏 Cart；离开恢复。

---

## 六、扩展计划

### 6.1 本期不做

| 项目 | 说明 |
|------|------|
| **#17 规格 Modal** | 规格内嵌 PDP |
| 搜索页 Filter & Featured | |
| 优惠券 Coupon & Code | §6.2 P1 |
| Recommend/New Arrival/Price/Sales 四档排序 | §6.2 P1 |
| 价格/属性多维 Filter | |
| Header 购物车预览 #22 | |
| 在线钱包 / 发票 #34 | P1 |

### 6.3 P2

游客购物车合并 — **【已关闭 v1.1.3】** Web 不做游客车。

---

## 七、验收总则（§7.1 替换 — 无矛盾版）

**搜索 / 分类**
- [ ] 搜索页：Sort By 仅 From Z-A / A-Z / Newest / Oldest；**无 Filter/Featured**
- [ ] L1 页 Filter 含 L2，选 L2→跳转 L2 页
- [ ] L2 页 Filter 含 L3，选 L3→`?l3=` 本页筛选
- [ ] 抽屉 L1 不跳转；L2 View All→L1 页；L2 项→L2 页

**PDP / 购物车**
- [ ] 无 #17 Modal；规格内嵌购买区
- [ ] 未选全 SKU→Toast「Please select product spec」（Add to Cart / Buy Now）
- [ ] 未登录 Add to Cart→login?redirect=当前页；未登录不可进 /cart
- [ ] 已登录加购/进 cart；**无 localStorage 游客车**
- [ ] 购物车 ≤50 SKU；Checkout ({n})；满额 Banner
- [ ] **/cart 页 Sticky 无 Cart**；其他页有 Cart

**结算 / 结果**
- [ ] 地址三行 + 详细地址截断
- [ ] 运费三档动态；COD 划线 Free；无 Coupon UI
- [ ] View Order Details→**本单 orderId**（BR853）

**全局**
- [ ] 退出登录→`/`
- [ ] topicTag→专题页；Sticky + 回顶

**删除以下过期验收项：**
- ~~分类落地页均不展示 Filter~~
- ~~登录后游客购物车自动合并~~
- ~~合并截断 Toast（BR851）~~

---

## 附录修订

| 附录 | 修订 |
|------|------|
| A FL | #17 规格 FL053–057 标「下期/不做」 |
| B BR | 增补 BR853/854/855/308a；BR851 删除 |
| C 页面对照 | #17 标本期不做 |

---

## 飞书现稿「粘贴后必删清单」

按 Ctrl+F 搜索并处理：

| 搜索词 | 动作 |
|--------|------|
| `Categories Filte` / `筛选）r` | 改错别字 |
| 第二个 §1.2 模块表 | **整表删除**（已合并入上表） |
| `不含 页内 L3 Filter`（分类第一行） | **删除该行**，用 Filter 版替换 |
| `游客可加购` / `游客可用` / `规则 9` | 删除或改 |
| `两列只读卡片` / `ToB`（地址） | 改为**三行** |
| `L1 点击` 进 L1 页（抽屉） | 改为 L1 **不跳转** |
| `BR851` / `登录合并` | 删除 |
| `BR417 Modal` / `可走 #17` | 改为不唤起 #17 |
| `未登录●`（BR618） | 删除 |
| `分类页均不展示 Filter`（§7.1） | 删除 |
| `Coupon + Shipping Fee（本期固定 60）` | 改为动态运费、无 Coupon |
| 4.7.11 内嵌的 BR401–421 表 | **整段删除**，仅留字段表 |
| `暂时无法在飞书文档外展示` | 补表格或删占位 |
| 优惠券 Drawer 长段（在「本期不做」下） | 移入 §6.1，正文只留一句 |

---

*详细分项修订历史见 `kickbazar-toc-web-prd-v1.1-changes.md`；矛盾对照见 `kickbazar-toc-web-prd-review-v1.2.md`。*
