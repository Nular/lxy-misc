# KickBazar ToC 网页端产品需求文档（PRD）

---

## 一、文档基础信息

| 字段 | 内容 |
|------|------|
| **文档名称** | KickBazar ToC 网页端产品需求文档 |
| **文档编号** | PRD-KB-WEB-TOC-001 |
| **产品名称** | KickBazar 消费者端网页商城 |
| **域名** | kickbazar.com |
| **文档版本** | v1.10 |
| **文档状态** | 评审中 |
| **产品负责人** | — |
| **撰写人** | 产品经理 |
| **目标读者** | UI/UX、前端、后端、测试、运营 |
| **关联文档** | 《KickBazar ToC 网页端 Brainstorming 梳理文档 v0.2》；App 功能对照包；竞品参考（SHEIN Web） |
| **创建日期** | 2026-09-09 |
| **最后更新** | 2026-09-11 |

### 1.1 版本记录

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|---------|
| v1.0 | 2026-09-09 | 产品经理 | 首版：覆盖本文档范围内 37 项页面/模块；UX 以 BR101 起编号 |
| v1.1 | 2026-09-09 | 产品经理 | 合并重复 UX，新增 BR 复用索引；同类交互标注「同 BRxxx」 |
| v1.2 | 2026-09-10 | 产品经理 | 第四章各模块新增 Feature List（FL 编号） |
| v1.3 | 2026-09-10 | 产品经理 | 第四章重构：功能描述、业务规则、字段定义、交互说明分层书写 |
| v1.4 | 2026-09-10 | 产品经理 | 新增官方客服模块：Header 固定入口 + 首页 Sticky 浮标 + 客服面板 |
| v1.5 | 2026-09-10 | 产品经理 | 第四章全模块补充字段定义（中英名称 + 字段说明） |
| v1.6 | 2026-09-10 | 产品经理 | 客服范围收窄：仅保留 Header / Footer / 首页 Sticky 入口；客服能力由他人 PRD 承接 |
| v1.7 | 2026-09-10 | 产品经理 | 移除订单模块（#31–#34）；Header 新增账户聚合入口（Hover 下拉：登录/订单/优惠券等） |
| v1.8 | 2026-09-10 | 产品经理 | Header 补充未登录/已登录/加载中三态视觉与交互设计 |
| v1.9 | 2026-09-11 | 产品经理 | 对齐 App/UI 设计：语言切换、信任背书 Modal、列表 View More、结算 COD/优惠券、PDP/店铺/专题等模块细化 |
| v1.10 | 2026-09-11 | 产品经理 | 明确发票（#34）本期不做，移至下一期（P1） |

### 1.2 术语说明

| 术语 | 说明 |
|------|------|
| **FL** | Feature List，功能清单编号，本文档从 FL001 起连续编号 |
| **BR** | Behavior Requirement，交互与体验行为需求编号，本文档从 BR101 起连续编号 |
| **同 BRxxx** | 交互效果与 BRxxx 完全一致，本文档不再重复描述；若存在差异，仅在「差异说明」列补充 |
| **PDP** | Product Detail Page，商品详情页 |
| **CMP** | Consent Management Platform，Cookie 同意管理平台 |
| **门禁** | 未登录用户不可进入或不可完成的关键操作拦截 |
| **他人负责模块** | 登录页、注册页、个人中心、订单系（列表/详情/物流）、优惠券页、Cookie 横幅——本文档仅在 Header 定义入口与跳转，不展开其内部 UX |
| **下一期模块** | 发票（#34）——本期不做，计划 P1 实现 |

### 1.3 本文档范围

**包含（#3–#30、#35–#38，共 32 项可交付 + 2 项本期不做）**

| 模块 | 页面/组件 |
|------|----------|
| 全局 | 顶部导航（含**客服入口**、**账户聚合入口**）、信任背书区、底部信息区（含**客服入口**） |
| 首页 | 核心展示区、服务介绍、**Sticky 客服入口** |
| 搜索 | 搜索弹窗、结果列表、排序、筛选（#10 Featured 本期不做） |
| 分类 | 一级/二级分类、分类商品列表 |
| 商品 | 商品详情、规格选择器、推荐组件 |
| 店铺 | 店铺页、商品列表 Tab、店铺介绍弹框 |
| 交易 | 购物车预览/页面/编辑/折扣、结算、结果页、地址弹框 |
| 专题 | 品牌馆、国家馆、精选、潮流 |

**不包含（由其他 PRD 承接，本文仅写衔接）**

- Cookie 同意横幅
- 登录页 / 注册页
- 个人中心及其子页面（个人信息、设置、语言等）
- **订单系（#31–#33）**：订单列表、订单详情、物流——本文档仅在 Header 账户菜单定义「我的订单」入口
- **发票（#34）**：**本期不做**，移至**下一期（P1）**实现；不在本期 Web 交付范围内
- **我的优惠券**：本文档仅在 Header 账户菜单定义入口
- **官方客服能力页/面板（#39）**：本文档仅在 Header、Footer、首页 Sticky 定义入口与跳转；客服内容、渠道、交互由他人 PRD 承接

---

## 二、产品背景介绍

### 2.1 业务背景

KickBazar 是面向孟加拉国（Bangladesh）市场的跨境/本对本电商平台，目前仅提供移动端 App。随着 Web 流量获客与 SEO 需求增长，需要将 App 端 2C 商城能力平移至网页端，使用户在浏览器中完成「浏览 → 加购 → 结算 → 履约查询」完整闭环。

### 2.2 市场与用户

| 维度 | 要点 |
|------|------|
| **目标市场** | 孟加拉国 |
| **语言** | 孟加拉语（বাংলা）+ 英语双语 |
| **货币** | BDT（৳），全站统一展示 |
| **支付** | App 支持多种本地钱包；**Web 结算本期仅 COD**（见 §4.9.2） |
| **地址** | Division → District → Upazila/Thana → 详细地址；手机号 +880 |
| **网络环境** | 部分用户网络较慢，需优化首屏与图片加载 |

**核心用户画像**

| Persona | 特征 | 核心诉求 |
|---------|------|---------|
| P1 都市年轻用户 | 18–30 岁，追潮流 | 快速发现爆款、短路径下单 |
| P2 价格敏感用户 | 关注折扣 | 搜索比价、凑单优惠 |
| P3 复购用户 | 有历史订单 | 地址记忆、快速复购 |
| P4 双语用户 | 孟语/英语切换 | 文案可读、操作一致 |

### 2.3 问题与目标

| 问题 | 目标 |
|------|------|
| 缺少 Web 触达渠道 | 上线功能与 App 对齐的 ToC 网页商城 |
| 原型分散、细节缺失 | 输出可开发、可验收的结构化 PRD |
| Web 与 App 交互差异未定义 | 参考 SHEIN Web 做适配，业务规则以 App 为准 |

### 2.4 约束与原则

1. **功能不扩张**：不新增 App 未覆盖的模块；仅做 Web 端应有 UI/UX 适配。
2. **业务真源**：价格、库存、优惠、支付、地址规则与 App 保持一致。
3. **登录后置**：浏览、搜索、加购（游客）无需登录；结算硬门禁；订单/优惠券等页面由他人 PRD 定义，Header 入口须正确衔接。
4. **合规**：本期 **不加载任何非必要第三方追踪脚本**；Cookie 横幅由他人负责。
5. **分期**：Featured 筛选（#10）本期不做；搜索结果 Filter 本期做（分类字段待确认）；排序本期做。

---

## 三、产品概述

### 3.1 产品定位

KickBazar Web 是 App 商城的浏览器版镜像，提供高密度商品货架、短路径转化与完整交易闭环，交互体验参考 SHEIN 网页端，业务逻辑遵循 KickBazar App。

### 3.2 产品目标

| 目标类型 | 指标方向 |
|---------|---------|
| **功能目标** | P0 页面 100% 覆盖购物主路径 |
| **体验目标** | 首屏可交互 ≤ 2s（4G 网络下）；核心路径 ≤ 3 步完成加购到结算入口 |
| **业务目标** | 支持孟加拉本地支付与地址；Web 与 App 账号/购物车策略一致（待技术确认） |

### 3.3 核心用户旅程

**旅程 1：新客首购**

```
外站引流 → 首页 → 专题/分类 → 商品详情 → 规格选择 → 加购
→ 购物车 → 结算（登录） → 新增地址 → 支付 → 结果页
```

**旅程 2：搜索购买**

```
点击搜索 → 搜索弹窗 → 输入关键词 → 结果列表 → 排序 → 商品详情 → 立即购买 → 结算
```

**旅程 3：老客复购**

```
Header 账户菜单 → 我的订单（他人模块） → 再次购买 → 购物车 → 结算（已有地址） → 支付 → 结果页
```

### 3.4 信息架构（本文档范围）

```
kickbazar.com
├── 全局：信任背书区（Header 上方）/ Header（语言/搜索/Categories 抽屉/客服/账户）/ Footer
├── /  首页（核心展示 + 服务介绍 + Sticky 客服入口）
├── /search  搜索弹窗 + /search?q= 结果页
├── /categories → /category/{id}  分类与商品列表
├── /product/{id}  商品详情 + 规格选择器
├── /store/{id}  店铺 + 介绍弹框
├── /cart  购物车（含预览 Dropdown、编辑、折扣详情）
├── /checkout → /checkout/result  结算与结果
└── /topic/*  品牌馆/国家馆/精选/潮流

（他人 PRD：`/login`、`/account/*`、`/account/orders/*`、优惠券页等，由 Header 账户菜单入口衔接）
```

### 3.5 跨模块衔接规范

| 场景 | 规则 |
|------|------|
| 未登录访问结算/地址 | 跳转 `/login?redirect={encodeURIComponent(当前URL)}` |
| 购物车「去结算」 | 先校验登录；未登录按上条跳转 |
| 规格选择器「立即购买」 | 未登录跳转登录，回跳后保留已选 SKU |
| Header 账户菜单 → 登录 | 跳转 `/login`（可带 redirect） |
| Header 账户菜单 → 我的订单/优惠券 | 未登录走 BR619；已登录跳转他人 PRD 目标页 |
| Header / Footer / 首页 Sticky → 客服 | 跳转至官方客服承接地址（`supportEntryUrl`，由他人 PRD 定义目标页/能力）；本文档不设计客服内容 |
| 会话过期 | 接口 401 时 Toast 提示并跳转登录（回跳当前页） |

---
## 四、功能需求明细

### 4.0 章节说明

本章按**模块**组织需求。每个模块采用统一结构书写，便于研发、设计、测试对齐：

| 节 | 名称 | 说明 |
|----|------|------|
| **基本信息** | — | 页面编号、路由、类型、优先级 |
| **功能描述** | — | 模块定位、用户场景、页面结构（叙述性说明） |
| **功能清单** | Feature List | 编号（FL）、中英文名称、功能描述 |
| **业务规则** | Business Rules | 计算逻辑、权限、边界条件、与 App 对齐规则 |
| **字段定义** | Field Spec | 字段名、中文名称、英文名称、类型、必填、字段说明（各模块按需出现） |
| **交互说明** | BR Table | 编号（BR）、交互行为、状态、验收标准 |

**编号体系**

- **FL**：功能点（What）——模块提供什么能力  
- **BR**：交互点（How）——用户如何操作、系统如何反馈  
- **同 BRxxx**：交互效果与基准 BR 一致，不重复描述（见 §4.0.1）

#### 4.0.1 BR 复用索引（基准交互）

| 基准 BR | 交互名称 | 适用范围 |
|---------|---------|---------|
| BR120 | 商品卡展示与跳转 PDP | 所有商品网格/列表 |
| BR137 | 列表空态 | 各业务列表（文案按场景配置） |
| BR138 | Tab 切换列表 | 店铺商品 Tab |
| BR201–BR202 | Modal 开/关 | 搜索、规格、店铺介绍、地址列表 |
| BR208 | 商品列表网格 | 搜索、分类、店铺、专题、首页 |
| BR209 | 分页/无限滚动 | 搜索、首页 |
| BR211–BR213 | 排序控件 | 搜索、分类、店铺 |
| BR409 | 资源不存在/下架 | 商品、店铺、专题 |
| BR418–BR420 | 推荐组件 | 首页、PDP、购物车、搜索无结果 |
| BR619 | 登录硬门禁 | 结算、结果页、地址、账户菜单需登录项 |
| BR801–BR803 | Toast / 网络错误 / 骨架屏 | 全站 |

---

### 4.1 模块 G0：全局 — 顶部导航区（#3）

#### 基本信息

| 属性 | 内容 |
|------|------|
| 页面编号 | #3 |
| 路由 | 全站全局组件，无独立路由 |
| 类型 | 全局布局 |
| 优先级 | P0 |
| 关联模块 | #8 搜索弹窗、#22 购物车预览、他人负责的官方客服（#39）、登录/个人中心/订单/优惠券 |

#### 功能描述

顶部导航区是全站一级入口容器，承担品牌识别、信息检索、品类浏览与交易入口职责。页面结构自上而下分为两层：

1. **保障提示条**：展示 Easy Return、24/7 Support、Get the Kickbazar APP，用于建立信任与引流 App。  
2. **主导航栏**：Logo、**语言选择**、全局搜索框、分类导航（Categories）、**客服入口**、购物车（含角标）、**账户聚合入口**。

**语言选择**：地球 Icon 固定展示于主导航栏；默认语言为**英语（English）**。Hover 地球 Icon 展开下拉，可选 **English** 或 **বাংলা（孟加拉语）**；当前已选语言**加粗**展示。选择目标语言后，全站进入 **Loading 蒙版**（全局不可操作），直至语言切换接口成功并文案刷新完成；失败则 Toast 提示并保持原语言。

**搜索框**：常驻于主导航栏，点击唤起 #8 搜索弹窗（同 BR104）；字段定义见下文。

客服入口为固定图标（建议耳机/对话气泡），全站可见；点击跳转至官方客服承接地址（`supportEntryUrl`，由他人 PRD 定义）。本文档仅定义入口位置与跳转，不设计客服面板/页面内容。

**账户聚合入口**采用**单一用户图标**（人像/账户图标），与登录、个人中心、我的订单、我的优惠券等共用同一入口，不在 Header 平铺多个图标。Hover 用户图标展开下拉菜单（Dropdown），鼠标移出菜单区域后收起。下拉菜单项按登录态动态展示（见业务规则）；各菜单项跳转目标由他人 PRD 配置，本文档仅定义入口与衔接规则。

#### 登录态设计

Header 账户区须区分**未登录态**、**已登录态**、**登录态加载中**三种状态，图标与下拉内容随状态切换，全站一致。

**状态一览**

| 状态 | 触发条件 | 账户图标区展示 | 下拉菜单 |
|------|---------|--------------|---------|
| **加载中** | 页面首屏，登录态接口未返回 | 默认轮廓用户图标 + 轻量骨架/占位（不展示用户名） | 不可展开；或展开仅显示 Loading |
| **未登录** | `isLoggedIn = false` | 默认轮廓用户图标；无头像、无用户名 | 见下表「未登录菜单」 |
| **已登录** | `isLoggedIn = true` | 优先展示 `userAvatarUrl` 圆形头像；无头像时默认图标 + 已登录描边/角标 | 见下表「已登录菜单」 |

**未登录菜单（Guest）**

| 顺序 | 菜单项 | 说明 |
|------|--------|------|
| 1 | 登录 / 注册（Sign In） | 主 CTA 样式；跳转 `loginUrl` |
| 2 | 我的订单 | 点击走 BR619，redirect=`ordersUrl` |
| 3 | 我的优惠券 | 点击走 BR619，redirect=`couponsUrl` |

**已登录菜单（Logged In）**

| 顺序 | 区块/菜单项 | 说明 |
|------|------------|------|
| 0 | **用户信息区**（可选） | 仅展示 `userDisplayName`；**不展示脱敏手机号** |
| 1 | 个人中心（My Account） | 跳转 `accountUrl` |
| 2 | 我的订单 | 跳转 `ordersUrl` |
| 3 | 我的优惠券 | 跳转 `couponsUrl` |
| 4 | 退出登录（Sign Out） | 清除会话，Header 切回未登录态；跳转逻辑由他人登录模块定义 |

**状态切换规则**

1. **登录成功**：Header 账户区由未登录态切换为已登录态；菜单自动收起；无需整页刷新（SPA 内状态更新即可）。  
2. **退出登录**：点击「退出登录」后清除会话，Header 切回未登录态，并**跳转登录页**（`loginUrl`）；购物车等行为按他人登录模块策略处理。  
3. **会话过期（401）**：同 **BR804**——Toast 提示后跳转登录，回跳当前页；Header 降级为未登录态。  
4. **加载失败**：登录态接口失败时，按未登录态降级展示，不阻断 Header 其他入口。

> 可在图标旁展示简短问候（如 “Hi, {name}”），避免顶栏拥挤。

导航区采用**滚动感知**策略：用户向下滚动时收起保障条或压缩顶栏高度以让出内容区；向上滚动时恢复。除全屏 Modal 外，导航区在所有页面保持可见，确保用户随时可搜索、查看购物车或返回首页。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|----------------|----------------|---------|
| FL001 | 顶栏常驻展示 | Persistent Header | 全站固定展示导航区，Logo 可一键回首页 |
| FL002 | 保障提示条 | Service Assurance Bar | 展示三项保障/引流文案 |
| FL003 | 滚动感知顶栏 | Scroll-aware Header | 滚动时收起/展开，核心入口不丢失 |
| FL004 | 全局搜索入口 | Global Search Entry | 点击搜索框打开 #8 搜索弹窗 |
| FL005 | 分类导航 | Category Navigation | 展示一级分类，进入分类页 |
| FL006 | 购物车角标 | Cart Badge | 实时展示购物车件数 |
| FL007 | 账户聚合入口 | Account Hub Entry | 单一用户图标，Hover/点击展开账户菜单 |
| FL008 | 导航高亮 | Active Nav State | 当前模块在导航中高亮 |
| FL132 | Header 客服入口 | Header Support Entry | 顶栏固定客服图标，跳转官方客服承接地址 |
| FL134 | 账户下拉菜单 | Account Dropdown Menu | 按登录态展示不同菜单项 |
| FL135 | 账户登录态展示 | Account Auth State UI | 未登录/已登录/加载中三态图标与信息区 |
| FL136 | 语言切换 | Language Switcher | 地球 Icon Hover 切换英语/孟加拉语 |

#### 业务规则

1. **可见性**：除搜索 Modal、规格选择器等全屏/模态层外，Header 始终渲染。  
2. **购物车角标**：显示已加购 SKU 总件数；为 0 时隐藏气泡或显示空态；接口失败时降级为 0 或上次缓存，不阻断浏览。  
3. **语言切换**：默认 `en`（English）；切换过程全站 Loading 直至成功；已选语言在下拉中加粗。  
4. **账户聚合入口**：单一用户图标；Hover 展开 FL134 下拉菜单。  
5. **登录/注册**：点击菜单项「登录/注册」跳转 `loginUrl`（登录注册页，他人 PRD）。  
6. **退出登录**：点击「退出登录」清除会话并跳转 `loginUrl`。  
7. **登录态**：Header 账户区须实现 FL135 三态（加载中 / 未登录 / 已登录），视觉与菜单内容见上文「登录态设计」。  
8. **账户菜单项（默认）**：

| 菜单项 | 中文 | 英文 | 未登录 | 已登录 | 跳转目标 |
|--------|------|------|--------|--------|---------|
| 登录/注册 | 登录 / 注册 | Sign In | 显示 | 隐藏 | `loginUrl` |
| 我的订单 | 我的订单 | My Orders | 显示 | 显示 | `ordersUrl`（未登录走 BR619） |
| 我的优惠券 | 我的优惠券 | My Coupons | 显示 | 显示 | `couponsUrl`（未登录走 BR619） |
| 个人中心 | 个人中心 | My Account | 隐藏 | 显示 | `accountUrl`（他人 PRD） |
| 退出登录 | 退出登录 | Sign Out | 隐藏 | 显示 | 清除会话并跳转 `loginUrl` |

9. 菜单项支持 CMS/配置扩展，但本期至少包含上表五项；订单列表/详情/物流页面内容由他人 PRD 承接；**发票（#34）本期不做，下一期实现**。  
10. **分类入口（Categories）**：Hover 唤起分类抽屉（详见 §4.6）；数据与 App 分类树一致。  
11. **滚动阈值**：建议 80px，具体以实现为准，需保证向上滚动可恢复。  
12. **客服入口**：Header 含客服图标（FL132），与购物车、账户并列；点击跳转 `supportEntryUrl`，行为同 **BR806**。  
13. **下拉层级**：账户/语言下拉 `z-index` 低于全屏 Modal/搜索弹窗；打开搜索 Modal 时自动收起。

#### 字段定义

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| logoUrl | Logo 图片 | Logo Image URL | string | 是 | 品牌 Logo 图片地址，点击跳转首页 |
| assuranceTexts[] | 保障文案列表 | Assurance Text List | array | 是 | 保障条三项文案（Easy Return 等），支持 i18n |
| appDownloadUrl | App 下载链接 | App Download URL | string | 是 | Get the Kickbazar APP 跳转地址 |
| categoryId | 分类 ID | Category ID | string | 是 | 一级分类唯一标识，用于导航跳转 |
| categoryName | 分类名称 | Category Name | string | 是 | 分类展示名称，支持 i18n |
| categoryIconUrl | 分类图标 | Category Icon URL | string | 否 | 分类入口图标地址 |
| cartItemCount | 购物车件数 | Cart Item Count | number | 是 | 购物车 SKU 总件数，用于角标展示；0 时可隐藏 |
| activeNavKey | 当前导航标识 | Active Nav Key | string | 否 | 标识当前高亮模块，如 `home` / `cart` |
| supportEntryVisible | 客服入口可见 | Support Entry Visible | boolean | 是 | 是否展示 Header 客服图标，默认 `true` |
| supportEntryUrl | 客服承接地址 | Support Entry URL | string | 是 | 官方客服跳转目标，由他人 PRD/运营配置；Header/Footer/Sticky 三入口共用 |

**搜索框**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| searchPlaceholder | 搜索占位文案 | Search Placeholder | string | 是 | 搜索框占位提示，如「Search products」，支持 i18n |
| searchInputValue | 搜索输入值 | Search Input Value | string | 否 | 当前输入框内容；打开弹窗时可带入 |
| searchModalOpen | 搜索弹窗状态 | Search Modal Open | boolean | 是 | 是否已打开 #8 搜索弹窗 |
| lastSearchKeyword | 最近搜索词 | Last Search Keyword | string | 否 | 用于结果页标题区展示，与 URL `q` 同步 |

**语言切换**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| currentLocale | 当前语言 | Current Locale | enum | 是 | `en` 英语 / `bn` 孟加拉语；默认 `en` |
| localeLabel | 语言展示名 | Locale Label | string | 是 | 下拉展示文案，如 English、বাংলা |
| languageSwitching | 语言切换中 | Language Switching | boolean | 是 | 切换进行中为 `true`，全站 Loading |

**账户菜单项**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| menuKey | 菜单标识 | Menu Key | string | 是 | 菜单项唯一 key：`login` / `orders` / `coupons` / `account` / `logout` |
| menuLabel | 菜单文案 | Menu Label | string | 是 | 展示文案，支持 i18n |
| targetUrl | 跳转地址 | Target URL | string | 是 | 菜单项跳转路径，由他人 PRD/运营配置 |
| requireLogin | 需登录 | Require Login | boolean | 是 | 是否须登录；为 `true` 且未登录时走 BR619 |
| visibleWhen | 可见条件 | Visible When | enum | 是 | `always` 始终 / `guest` 仅游客 / `logged_in` 仅已登录 |
| sortOrder | 排序 | Sort Order | number | 是 | 菜单项展示顺序，升序 |

| authState | 登录态 | Auth State | enum | 是 | `resolving` 加载中 / `guest` 未登录 / `logged_in` 已登录 |
| isLoggedIn | 是否已登录 | Is Logged In | boolean | 是 | 当前会话是否已登录；与 `authState` 同步 |
| userAvatarUrl | 用户头像 | User Avatar URL | string | 否 | 已登录用户头像；无则展示默认图标 |
| userDisplayName | 用户昵称 | User Display Name | string | 否 | 已登录展示名，用于下拉用户信息区 / 问候语 |
| ordersUrl | 我的订单地址 | Orders URL | string | 是 | 我的订单页路径，如 `/account/orders` |
| couponsUrl | 我的优惠券地址 | Coupons URL | string | 是 | 我的优惠券页路径 |
| accountUrl | 个人中心地址 | Account URL | string | 是 | 个人中心路径，如 `/account` |
| loginUrl | 登录页地址 | Login URL | string | 是 | 登录页路径，默认 `/login` |

#### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR101 | 顶栏常驻 | 页面加载完成 | Logo 回 `/`；各入口可点 | 加载● | 首屏不跳动 |
| BR102 | 保障提示条 | 页面顶部 | 文案可横滑；APP 链至下载 | — | 三项均可见 |
| BR103 | 滚动感知 | 滚动超阈值 | 收起/压缩；向上恢复 | — | 角标不移位 |
| BR104 | 搜索入口 | 点击搜索框 | **同 BR201** | — | — |
| BR105 | 分类导航 | Hover Categories | 展开分类抽屉（BR301） | 加载● | 骨架同 BR803 |
| BR106 | 购物车角标 | 加购/删购 | 数字气泡更新 | 加载● 错误○ | 失败降级 |
| BR107 | 账户图标 Hover 菜单 | PC Hover 用户图标 | 展开 FL134 下拉菜单；移出收起 | 未登录● 已登录● | 加载中不可展开 |
| BR108 | 导航高亮 | 路由匹配 | 高亮当前模块 | — | 切换同步 |
| BR806 | Header 客服入口 | 点击客服图标 | 跳转 `supportEntryUrl` | — | 全站可用；目标页由他人 PRD 定义 |
| BR815 | 账户菜单项跳转 | 点击菜单项 | 登录/注册直跳 `loginUrl`；订单/优惠券按 `requireLogin` 判断，未登录走 **BR619** | 未登录△ | redirect 为目标页 |
| BR816 | 账户菜单收起 | 点击空白/ESC/路由切换 | 收起下拉菜单 | — | 不残留浮层 |
| BR817 | 未登录态展示 | `authState=guest` | 默认轮廓图标；菜单含 Sign In + 订单/优惠券 | 未登录● | 无头像/用户名/手机号 |
| BR818 | 已登录态展示 | `authState=logged_in` | 展示头像或已登录图标；菜单含用户信息区（仅昵称）+ Account/订单/优惠券/退出 | 已登录● | 头像失败降级默认图标 |
| BR819 | 登录态加载 | `authState=resolving` | 图标区骨架/占位；不展开菜单或展开仅 Loading | 加载● | 不闪动切换 |
| BR820 | 登录态切换 | 登录成功/401 | 无刷新更新 Header 账户区；401 走 BR804；退出见 BR821 | 未登录● 已登录● | 状态与菜单同步 |
| BR821 | 退出登录 | 已登录点击 Sign Out | 清除会话；跳转 `loginUrl`；Header 切回未登录态 | 已登录● | 不留在当前页 |
| BR822 | 语言下拉 | Hover 地球 Icon | 展开 English / বাংলা；已选加粗 | — | 默认 English |
| BR823 | 语言切换 | 选择目标语言 | 全站 Loading 蒙版；成功刷新文案；失败 Toast 保持原语言 | 加载● 错误● | 切换中不可操作 |

---

### 4.2 模块 G1：全局 — 信任背书区（#4）

#### 基本信息

| 属性 | 内容 |
|------|------|
| 页面编号 | #4 |
| 类型 | 全局组件 |
| 优先级 | P0 |

#### 功能描述

信任背书区位于 **Header 上方**（全站全局），以图标 + 短文案形式强化 KickBazar 的服务承诺：Product Replace、24/7 Support、Easy Return 等。每一项均可点击，打开**独立介绍 Modal**（交互同 BR201–BR202），展示该卖点的**固定介绍内容**（运营配置，与 App 一致）；不跳转新页面，不承担交易逻辑。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|----------------|----------------|---------|
| FL009 | 信任卖点展示 | Trust Value Display | Header 上方横排展示核心卖点 |
| FL010 | 顶栏滚动联动 | Header Scroll Sync | 随顶栏收起，不挡首屏商品 |
| FL137 | 信任介绍弹窗 | Trust Intro Modal | 点击卖点项打开固定内容介绍 Modal |

#### 业务规则

1. 文案支持孟加拉语/英语，随全站语言切换（BR823）。  
2. 每一项对应一份固定介绍内容（标题 + 正文），由运营/CMS 配置；无配置时使用 App 默认文案。  
3. 与 BR103 联动：向下滚动时不挤压商品列表首行。  
4. Modal 可通过关闭按钮、底部按钮、ESC、遮罩关闭（同 BR202）。

#### 字段定义

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| trustItemId | 卖点项 ID | Trust Item ID | string | 是 | 信任卖点唯一标识 |
| trustTitle | 卖点标题 | Trust Title | string | 是 | 如 Product Replace、Easy Return，支持 i18n |
| trustIconUrl | 卖点图标 | Trust Icon URL | string | 是 | 卖点图标图片地址 |
| modalTitle | 介绍标题 | Modal Title | string | 是 | Modal 内介绍标题，支持 i18n |
| modalContent | 介绍内容 | Modal Content | string | 是 | Modal 内固定介绍正文（富文本或纯文本），支持 i18n |
| sortOrder | 排序 | Sort Order | number | 是 | 展示顺序，升序排列 |

#### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR109 | 信任背书展示 | 页面加载 | Header 上方图标+文案横排 | 加载○ | 双语正确 |
| BR110 | 滚动联动 | 同 BR103 | 随顶栏收起 | — | 不挡首屏 |
| BR824 | 信任介绍 Modal | 点击任一卖点项 | 打开 FL137 Modal，展示固定介绍内容 | — | 同 BR201–BR202 |

---

### 4.3 模块 G2：全局 — 底部信息区（#5）

#### 基本信息

| 属性 | 内容 |
|------|------|
| 页面编号 | #5 |
| 类型 | 全局 Footer |
| 优先级 | P0 |

#### 功能描述

底部信息区承载法律合规、客户服务、App 下载与社交媒体入口，是全站信任与合规的最后一道触点。链接以新标签打开，避免中断用户购物流程。政策页内容由运营/法务维护，本文档定义入口与跳转目标。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|----------------|----------------|---------|
| FL011 | 法律合规链接 | Legal Links | Privacy、Terms、Returns、Copyright |
| FL012 | 客户服务链接 | Customer Service Links | Contact Us（兼作**客服入口**）、About Us |
| FL013 | App 下载引导 | App Download CTA | 链至应用商店 |
| FL014 | 社交媒体 | Social Media Links | Instagram、Facebook |

#### 业务规则

1. 所有外链 `target="_blank"`，并带 `rel="noopener"`。  
2. 链接目标与 App 内政策页内容一致。  
3. 移动端点击 App 下载时，按系统跳转 Google Play / App Store。  
4. **Contact Us** 为 Footer 侧官方客服入口，跳转 `supportEntryUrl`（与 Header FL132、首页 Sticky FL133 目标一致）；客服页面内容由他人 PRD 承接。

#### 字段定义

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| privacyPolicyUrl | 隐私政策链接 | Privacy Policy URL | string | 是 | Privacy Policy 页面地址 |
| termsUrl | 服务条款链接 | Terms of Service URL | string | 是 | Terms of Service 页面地址 |
| returnsPolicyUrl | 退换货政策链接 | Returns Policy URL | string | 是 | Returns & Refunds Policy 页面地址 |
| copyrightText | 版权声明 | Copyright Text | string | 是 | 版权文案，如 © 2026 KickBazar |
| contactUsUrl | 客服/联系链接 | Contact Us URL | string | 是 | Footer 客服入口地址，与 `supportEntryUrl` 一致 |
| aboutUsUrl | 关于我们链接 | About Us URL | string | 是 | About Us 页面地址 |
| iosAppStoreUrl | iOS 商店链接 | iOS App Store URL | string | 是 | App Store 下载地址 |
| androidPlayStoreUrl | Android 商店链接 | Google Play URL | string | 是 | Google Play 下载地址 |
| instagramUrl | Instagram 链接 | Instagram URL | string | 否 | 官方 Instagram 主页 |
| facebookUrl | Facebook 链接 | Facebook URL | string | 否 | 官方 Facebook 主页 |

#### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR111 | 法律链接 | Footer 展示 | 新标签打开政策页 | — | 四项齐全 |
| BR112 | Footer 客服入口 | 点击 Contact Us | 跳转 `supportEntryUrl`；**同 BR806** 目标 | — | About Us 仍跳转 aboutUsUrl |
| BR113 | App 下载 | 点击 | 链至商店/落地页 | — | 移动端识别系统 |
| BR114 | 社交媒体 | 点击 | 外链官方账号 | — | 新标签打开 |

---

### 4.4 模块 A：首页（#6–#7）

#### 4.4.1 首页 — 核心展示区（#6）

##### 基本信息

| 属性 | 内容 |
|------|------|
| 页面编号 | #6 |
| 路由 | `/` |
| 类型 | 页面 |
| 优先级 | P0 |

##### 功能描述

首页是 KickBazar Web 的核心流量承接页，承担「发现商品 → 进入导购路径」职责。页面自上而下分为四个逻辑区块：

1. **Banner 轮播**：运营活动/品牌曝光，可 Deeplink 至专题页。  
2. **快捷功能区**：与 **App Category 一级分类**一致，展示一级分类入口（图标 + 名称），数据与 App 对齐。  
3. **活动专区**：**Brand Zone、Global、Featured、Trending** 四个专题入口。  
4. **商品推荐流**：商品网格 + **View More** 按钮；首屏展示若干行，每次点击 View More **再加载 10 行**；**刷新页面后重新从首屏展示**；商品顺序与 App 一致，按商品 **update 时间倒序**。

除上述区块外，首页叠加 **Sticky 客服入口**（FL133）：固定于视口右下角；点击跳转 `supportEntryUrl`，与 Header（FL132）、Footer Contact Us（FL012）目标一致。客服页面内容由他人 PRD 承接。

各区块**独立请求、独立渲染**：单块失败不阻断其他块，符合孟加拉弱网场景。**SEO Meta 注入本期仅做商品详情页（PDP）**，首页不做 SEO 配置。

##### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|----------------|----------------|---------|
| FL015 | 首页分区加载 | Section-based Loading | 区块独立加载与降级 |
| FL016 | Banner 轮播 | Banner Carousel | 运营轮播图 |
| FL017 | 快捷功能区 | Quick Access Grid | App 一级分类入口 |
| FL018 | 活动专区入口 | Campaign Zone Entry | Brand Zone / Global / Featured / Trending |
| FL019 | 商品推荐流 | Product Feed | 推荐网格 + View More 分页加载 |
| FL020 | 商品卡 | Product Card | 全站统一商品卡 |
| FL138 | View More 加载 | View More Pagination | 商品列表每次加载 10 行 |
| FL133 | 首页 Sticky 客服入口 | Homepage Sticky Support FAB | 首页右下角悬浮客服按钮，跳转 `supportEntryUrl` |

##### 业务规则

1. **快捷功能区**：数据与 App **一级分类（Category L1）**完全一致，不允许 Web 独有入口。  
2. **活动专区**：固定四个入口——Brand Zone、Global、Featured、Trending；对应专题页 #35–#38（Global 对应国家馆/全球购专题，以 App 映射为准）。  
3. **推荐流**：首屏默认展示若干行；点击 **View More** 每次追加 **10 行**；**页面刷新后重置**为首屏状态；排序按商品 `updatedAt` **倒序**，与 App 一致。  
4. **商品卡**：价格 BDT 千分位；折扣标与 App 一致；点击跳转 `/product/{id}`；若商品属于某专题，展示对应 **专题 Tag**（见 §4.10）。  
5. **Banner**：无数据时隐藏或展示默认图，不留空白占位。  
6. **空态**：推荐流为空时展示「去分类逛逛」CTA。  
7. **Sticky 客服入口**：仅在首页（`/`）展示；交互见 **BR807–BR808**；跳转目标与 Header（BR806）、Footer（BR112）一致。

##### 字段定义

**Banner 配置**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| bannerId | Banner ID | Banner ID | string | 是 | 轮播图唯一标识 |
| imageUrl | 轮播图片 | Banner Image URL | string | 是 | 轮播图图片地址 |
| linkType | 跳转类型 | Link Type | enum | 是 | 点击跳转类型：`topic` / `category` / `url` |
| linkTarget | 跳转目标 | Link Target | string | 是 | 专题 ID、分类 ID 或外链 URL |
| sortOrder | 排序 | Sort Order | number | 是 | Banner 展示顺序，升序 |

**快捷入口配置**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| entryId | 入口 ID | Entry ID | string | 是 | 快捷入口唯一标识 |
| entryName | 分类名称 | Category Name | string | 是 | App 一级分类名称，支持 i18n |
| entryIconUrl | 分类图标 | Category Icon URL | string | 是 | 一级分类图标地址 |
| categoryId | 分类 ID | Category ID | string | 是 | 一级分类 ID，跳转 `/category/{id}` |

**活动专区配置**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| zoneType | 专区类型 | Zone Type | enum | 是 | `brand` / `global` / `featured` / `trending` |
| zoneTitle | 专区标题 | Zone Title | string | 是 | 专区展示标题，支持 i18n |
| zoneImageUrl | 专区封面 | Zone Image URL | string | 是 | 专区入口卡片图片 |
| topicId | 专题 ID | Topic ID | string | 是 | 跳转专题页 ID |

**商品推荐流**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| feedPageSize | 每次加载行数 | Feed Page Size | number | 是 | View More 每次加载行数，固定 **10** |
| feedLoadedRows | 已加载行数 | Loaded Rows | number | 是 | 当前已展示行数；刷新页面重置 |
| updatedAt | 商品更新时间 | Updated At | datetime | 是 | 推荐排序字段，倒序 |
| viewMoreVisible | View More 可见 | View More Visible | boolean | 是 | 是否还有更多商品可加载 |

**Sticky 客服入口**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| stickyEnabled | 浮标开关 | Sticky FAB Enabled | boolean | 是 | 是否展示首页 Sticky 客服入口，默认 `true` |
| fabPosition | 浮标位置 | FAB Position | string | 否 | 浮标位置，默认 `bottom-right` |
| ariaLabel | 无障碍标签 | Aria Label | string | 否 | 浮标无障碍文案，如「联系客服」 |

> 商品推荐流字段复用 **§4.7.3 通用商品卡字段**；`supportEntryUrl` 见 **§4.1**。

##### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR115 | 分区加载 | 进入首页 | 各块骨架；失败不阻断 | 加载● 错误● | 2s 内有内容 |
| BR116 | Banner 轮播 | 有 Banner | 自动/手动切换；可点击 | 空○ | 无图可隐藏 |
| BR117 | 快捷功能区 | 点击分类 | 跳转对应一级分类页 | — | 同 App L1 Category |
| BR118 | 活动专区 | 点击卡片 | 链 Brand/Global/Featured/Trending 专题 | — | 四入口 |
| BR119 | 推荐流 View More | 点击 View More | 列表**同 BR208**；每次加载 10 行；刷新重置 | 加载● | 空态 CTA |
| BR120 | 商品卡（基准） | 点击卡片 | 跳转 PDP；统一样式；含专题 Tag | — | 全站一致 |
| BR825 | View More（基准） | 列表加载更多 | 每次 10 行；无更多则隐藏按钮；刷新重置 | 加载● | 首页/店铺等复用 |
| BR807 | 首页 Sticky 浮标 | 进入 `/` | 展示右下角客服 FAB | — | 离开首页隐藏 |
| BR808 | Sticky 跳转客服 | 点击 FAB | 跳转 `supportEntryUrl`；**同 BR806** | — | 三入口目标一致 |

#### 4.4.2 首页 — 服务介绍（#7）

##### 基本信息

| 属性 | 内容 |
|------|------|
| 页面编号 | #7 |
| 类型 | 子视图（首页内嵌） |
| 优先级 | P0 |

##### 功能描述

服务介绍是新客价值传达层，在首页以**服务承诺卡片**形式展示（如 Easy Return、24/7 Support 等）。**不通过新打开网页进入**；仅当用户**点击对应服务承诺卡片**时，弹出介绍 **Modal**（同 BR201–BR202）展示详细说明。首页主体可正常滚动浏览，Modal 不阻断底层页面结构。

##### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|----------------|----------------|---------|
| FL022 | 服务承诺卡片 | Service Promise Cards | 首页展示服务承诺入口卡片 |
| FL023 | 服务介绍弹窗 | Service Intro Modal | 点击卡片打开介绍 Modal |
| FL024 | 弹窗关闭 | Modal Close | 右上角关闭 + 底部关闭按钮 |

##### 业务规则

1. 文案与 App 服务介绍一致，支持双语（随 BR823 切换）。  
2. 仅点击卡片唤起 Modal；不自动弹窗、不跳转新页面。  
3. Modal 可通过右上角关闭（×）、底部关闭按钮、ESC、遮罩关闭（同 BR202）。

##### 字段定义

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| introTitle | 介绍标题 | Intro Title | string | 是 | Modal 主标题，支持 i18n |
| introGuarantee | 介绍保证 | Intro Guarantee | string | 是 | 服务保证名称，如 Easy Return，支持 i18n |
| introSubtitle | 副标题 | Intro Subtitle | string | 否 | Modal 副标题，支持 i18n |
| introContent | 介绍内容 | Intro Content | string | 是 | Modal 正文介绍，支持 i18n |
| closeButtonText | 底部关闭文案 | Close Button Text | string | 是 | 底部关闭按钮文案，支持 i18n |
| cardIconUrl | 卡片图标 | Card Icon URL | string | 是 | 首页服务承诺卡片图标 |

##### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR122 | 服务承诺卡片 | 首页展示 | 展示服务承诺卡片列表 | — | 文案同 App |
| BR826 | 服务介绍 Modal | 点击服务承诺卡片 | 打开 Modal；展示标题/保证/副标题/内容 | — | 同 BR201–BR202 |
| BR827 | 关闭服务介绍 | 点击 × / 底部关闭 / ESC / 遮罩 | 关闭 Modal | — | 同 BR202 |

---

### 4.5 模块 B：搜索（#8–#12）

#### 基本信息

| 属性 | 内容 |
|------|------|
| 页面编号 | #8–#12（#10 Featured 本期不做；#11 Filter 本期做） |
| 路由 | `/search`；`/search?q={keyword}` |
| 类型 | Modal + 页面 |
| 优先级 | P0 |

#### 功能描述

搜索模块分两段体验：

1. **搜索弹窗（#8）**：由 Header 唤起，强制性 Modal。用户须输入、选择热搜或关闭后方可操作底层页面。承载搜索历史与搜索发现。  
2. **搜索结果页（#9）**：展示命中商品列表，支持排序（#12）与筛选（#11 Filter）。URL 带 `q` 参数，可分享、可后退。

本期不做 Featured 筛选（#10）。**Filter 本期需要实现**，分类相关筛选字段**待与业务确认**（见 OQ8）。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|----------------|----------------|---------|
| FL025 | 搜索弹窗 | Search Modal | 强制性 Modal 搜索 |
| FL026 | 搜索历史 | Search History | 最近搜索词 |
| FL027 | 清空搜索历史 | Clear History | 一键清空 |
| FL028 | 搜索发现 | Search Discovery | 热搜/推荐词 |
| FL029 | 关键词搜索 | Keyword Search | 提交搜索 |
| FL030 | 结果标题区 | Result Header | 关键词+数量 |
| FL031 | 搜索结果列表 | Result List | 商品网格 |
| FL032 | 结果 View More | Result View More | 首屏 10 行 + View More 加载 |
| FL033 | 无结果推荐 | No-result Rec | 空结果推荐 |
| FL034 | 结果排序 | Result Sort | Recommend/New Arrival/A-Z/价格 |
| FL035 | 排序 URL 同步 | Sort in URL | sort 参数 |
| FL139 | 结果筛选 | Result Filter | 搜索结果 Filter（分类字段待确认） |

#### 业务规则

1. **历史存储**：游客仅 localStorage；登录用户与账号同步（云端优先）。  
2. **提交搜索**：trim 后空关键词不提交；写入历史上限建议 20 条。  
3. **结果排序**：默认 **Recommend**（`sort=recommend`）；逻辑见 sort 枚举表。  
4. **结果分页**：首屏展示 **10 行**商品；点击 **View More** 再加载 **10 行**，以此类推；**刷新页面后重新从首屏展示**（同 BR825）。  
5. **无结果**：展示空态+推荐组件，不展示 0 结果网格。  
6. **Filter**：本期需要实现；筛选 UI 与 App 对齐；**分类筛选字段待确认**（OQ8）。  
7. **本期不做**：Featured Tab（#10）。

#### 字段定义

**URL 参数**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| q | 搜索关键词 | Search Keyword | string | 是 | URL 查询参数，搜索词，示例：`dress` |
| sort | 排序方式 | Sort Type | enum | 否 | 排序枚举值，默认 `recommend` |
| filter | 筛选参数 | Filter Params | string | 否 | 筛选条件序列化参数；分类字段待确认（OQ8） |
| loadedRows | 已加载行数 | Loaded Rows | number | 否 | View More 已加载行数；刷新重置 |

**sort 排序枚举**

| 枚举值 | 中文名称 | 英文名称 | 字段说明 |
|--------|---------|---------|---------|
| recommend | 推荐排序 | Recommend | **默认**；销量从高到低；销量相同则 Product Name A→Z |
| new_arrival | 上新 | New Arrival | 按商品 update 时间倒序 |
| name_asc | 名称 A-Z | From A-Z | 按 Product Name 字母升序 |
| price_asc | 价格升序 | Price Low to High | 价格从低到高 |
| price_desc | 价格降序 | Price High to Low | 价格从高到低 |

**搜索历史项**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| keyword | 历史关键词 | History Keyword | string | 是 | 用户曾搜索的关键词 |
| searchedAt | 搜索时间 | Searched At | datetime | 是 | 最近一次搜索时间，用于排序 |
| source | 来源 | Source | enum | 是 | `local` 本地存储 / `cloud` 账号同步 |

**搜索发现/热搜项**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| suggestKeyword | 推荐词 | Suggest Keyword | string | 是 | 热搜或推荐搜索词展示文案 |
| rank | 排序权重 | Rank | number | 否 | 热搜展示顺序 |

> 搜索结果商品列表字段复用 **§4.7.3 通用商品卡字段**。

#### 交互说明

**搜索弹窗（#8）**

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR201 | 打开 Modal（基准） | 点击搜索框 | 遮罩；禁滚；聚焦 | — | 须关闭后才可操作底层 |
| BR202 | 关闭 Modal（基准） | ESC/遮罩/关闭 | 恢复滚动 | — | 可保留草稿 |
| BR203 | 搜索历史 | 打开弹窗 | 本地/云端历史 | 加载● 空● | 空态同 BR137 |
| BR204 | 清空历史 | 点击清除 | 二次确认 | 错误○ | 同 BR802 |
| BR205 | 搜索发现 | 打开弹窗 | 点击词→结果页 | 加载● 错误● | 失败可手输 |
| BR206 | 提交搜索 | 回车/按钮 | 跳转 `?q=`；写历史 | — | URL 可分享 |

**搜索结果（#9、#12）**

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR207 | 结果标题 | 进入结果页 | 关键词+件数 | 加载● | 与 URL 一致 |
| BR208 | 商品列表（基准） | 有数据 | 网格；卡同 BR120 | 加载● 空● 错误● | 骨架 BR803 |
| BR209 | 分页（基准） | — | 搜索结果页改用 **BR825** View More；其他场景可复用 BR825 | — | — |
| BR210 | 无结果推荐 | 结果空 | 同 BR418–BR420 | 空● | 空态 BR137 |
| BR211 | 排序（基准） | 点击排序 | 下拉刷新列表；默认 Recommend | 加载● | 五档排序 |
| BR828 | 结果 Filter | 打开/应用筛选 | 筛选后刷新列表；分类字段 OQ8 | 加载● | 与 App 对齐 |
| BR212 | URL 同步（基准） | 切换排序 | 写 `sort=` | — | 刷新保持 |
| BR213 | 排序反馈（基准） | 选排序 | 骨架 BR803 | 错误● | Toast BR801 |

---

### 4.6 模块 C：分类（#13–#15）

#### 基本信息

| 属性 | 内容 |
|------|------|
| 页面编号 | #13–#15 |
| 路由 | `/categories`；`/category/{id}` |
| 优先级 | P0 |

#### 功能描述

分类模块与 App 分类树完全一致。用户在 Header **Hover「Categories」** 时，从顶栏下方展开**分类抽屉（Drawer）**。抽屉内模块**横向分为四列**，各列可**独立滚轮滑动**：

1. **一级分类**：App 一级分类列表  
2. **二级分类**：选中一级后展示对应二级分类  
3. **三级分类 + 推荐**：选中二级后展示三级分类；右侧或同列展示该分类下推荐商品/子项  
4. 各列选中态联动：Hover/点击一级 → 刷新二级；选中二级 → 刷新三级与推荐

用户亦可从首页快捷功能区、分类落地页进入分类商品列表 → PDP。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|----------------|----------------|---------|
| FL036 | Header 分类抽屉 | Category Drawer | Hover Categories 展开四列抽屉 |
| FL037 | 三级分类联动 | L1/L2/L3 Cascade | 一二三级分类联动展示 |
| FL038 | 分类面包屑 | Category Breadcrumb | 分类落地页层级导航 |
| FL140 | 分类推荐列 | Category Rec Column | 三级列旁推荐展示 |
| FL039 | 分类商品列表 | Category Products | 分类下商品 |
| FL040 | 分类 Banner | Category Banner | 运营头图 |
| FL041 | 分类底推荐 | Category Rec | 底部推荐 |

#### 业务规则

1. 分类树与 App 完全一致（含三级），不允许 Web 独有分类节点。  
2. **Header 抽屉**：Hover Categories 展开；移出抽屉区域收起；四列各自支持滚轮纵向滚动。  
3. 商品列表排序规则同搜索（BR211–BR213）；分页同 **BR825**（10 行 + View More）。  
4. 面包屑可点击回溯：`首页 > 一级 > 二级 > 三级`。  
5. 分类 Banner 无配置时不占高度。  
6. 空分类：展示空态，CTA 回上级或首页。

#### 字段定义

**分类节点**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| categoryId | 分类 ID | Category ID | string | 是 | 分类唯一标识，用于路由 `/category/{id}` |
| parentId | 父分类 ID | Parent Category ID | string | 否 | 父级分类 ID；一级分类为空 |
| name | 分类名称 | Category Name | string | 是 | 分类展示名称，支持 i18n |
| iconUrl | 分类图标 | Category Icon URL | string | 否 | 分类入口图标图片地址 |
| bannerUrl | 分类 Banner | Category Banner URL | string | 否 | 分类页顶部运营头图，无则不展示 |
| level | 分类层级 | Category Level | number | 是 | 分类层级：1 一级 / 2 二级 / 3 三级 |
| sortOrder | 排序 | Sort Order | number | 是 | 同级分类展示顺序 |

**面包屑项**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| breadcrumbLabel | 面包屑文案 | Breadcrumb Label | string | 是 | 面包屑展示名称 |
| breadcrumbUrl | 面包屑链接 | Breadcrumb URL | string | 是 | 点击跳转路径 |

> 分类商品列表字段复用 **§4.7.3 通用商品卡字段**。

#### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR301 | 分类抽屉 | Hover Categories | 展开四列抽屉；各列独立滚动 | 加载● 错误● | 同 App 树 |
| BR302 | 分类空态 | 无数据 | 空态 BR137 | 空○ | 可重试 |
| BR303 | 分类联动 | 选中 L1/L2 | 联动刷新下级列与推荐 | 加载● 错误● | 三级+推荐正确 |
| BR829 | 抽屉收起 | 移出抽屉区域 | 收起分类抽屉 | — | 不遮挡搜索 |
| BR304 | 面包屑 | 展示 | 点击回溯 | — | 层级对 |
| BR305 | 分类商品 | 进入列表 | 列表 BR208；排序 BR211 | — | 空态回上级 |
| BR306 | 分类 Banner | 有配置 | 顶部展示 | 加载○ | 无则隐藏 |
| BR307 | 底推荐 | 滚到底 | 同 BR418–BR420 | — | — |

---

### 4.7 模块 D：商品（#16–#18）

#### 4.7.1 商品详情页（#16）

##### 基本信息

| 属性 | 内容 |
|------|------|
| 路由 | `/product/{id}` |
| 优先级 | P0 |

##### 功能描述

商品详情页（PDP）是转化核心页，采用**左图右购**布局（与 App/UI 设计一致）。**本期不做评价模块**。**SEO Meta 注入本期仅覆盖 PDP**（title/description 含商品名与品类词）。

**页面模块**

| 区域 | 模块 |
|------|------|
| **左侧** | 面包屑、店铺入口、轮播图、主图、Additional Information、Description、安全保证（24/7 Support、Product Replace） |
| **右侧** | Product Name、现价、原价（若有）、折扣 Tag（若有）、活动专区标识 Tag（若有）、**100% 正品保证**（若活动专区为品牌馆 Brand Zone）、SKU 选择、数量选择、加入购物车 / Buy Now 按钮 |
| **底侧** | Recommend 推荐区；顺序与逻辑**同 App 端** |

游客可加购；立即购买需登录（门禁 BR619）。商品下架或不存在时展示独立不可用页（BR409），不提供购买操作。

##### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|----------------|----------------|---------|
| FL042 | 商品图片画廊 | Image Gallery | 轮播图/主图 |
| FL043 | 商品价格 | Product Pricing | 现价/原价/折扣 Tag |
| FL044 | 活动专区标识 | Topic Tag | 专题 Tag；品牌馆展示正品保证 |
| FL045 | 详情信息 | Product Details | Additional Information + Description |
| FL046 | 安全保证 | Safety Assurance | 24/7 Support、Product Replace |
| FL047 | 加入购物车 | Add to Cart | 唤起规格选择器 |
| FL048 | 立即购买 | Buy Now | 唤起规格后结算 |
| FL049 | 底部推荐 | Recommendations | 底侧 Recommend，逻辑同 App |
| FL050 | 下架处理 | Unavailable | 404/下架页 |
| FL051 | 商品 SEO | PDP SEO Meta | 本期唯一 SEO 注入页面 |
| FL052 | 面包屑/店铺 | Breadcrumb & Store | 面包屑与店铺入口 |

##### 业务规则

1. **价格**：与 App 实时一致；切换 SKU 后价格联动（BR415）。  
2. **库存**：缺货 SKU 置灰；全部缺货展示空态，不可购买。  
3. **加购**：游客允许；成功后更新 Header 角标，Toast 提示。  
4. **立即购买**：须登录；未登录跳转 `/login?redirect=` 当前 PDP。  
5. **评价**：本期不做评价模块，PDP 不展示评价区。  
6. **SEO**：本期唯一注入 Meta 的页面；`title` 含商品名；`description` 含价格与品类词。  
7. **品牌馆正品保证**：当商品所属活动专区为 **Brand Zone** 时，右侧展示「100% 正品保证」标识。  
8. **专题 Tag**：若商品属于某专题，在右侧展示对应活动专区标识 Tag（全站商品卡亦展示，见 §4.10）。

##### 字段定义

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| productId | 商品 ID | Product ID | string | 是 | 商品唯一标识，路由 `/product/{id}` |
| title | 商品标题 | Product Title | string | 是 | 商品名称，支持 i18n，用于 SEO 与展示 |
| salePrice | 售价 | Sale Price | number | 是 | 当前售价，单位 BDT，千分位展示 |
| originalPrice | 原价 | Original Price | number | 否 | 划线原价，无折扣时可不返回 |
| discountRate | 折扣比例 | Discount Rate | number | 否 | 折扣百分比，如 20 表示 20% OFF |
| images[] | 商品图片 | Product Images | array | 是 | 主图 URL 列表，支持多图轮播 |
| videoUrl | 商品视频 | Product Video URL | string | 否 | 商品展示视频地址 |
| skus[] | SKU 列表 | SKU List | array | 是 | 可选规格列表，结构见 §4.7.2 |
| selectedSkuId | 已选 SKU | Selected SKU ID | string | 否 | 当前选中 SKU，未选时为空 |
| stock | 可售库存 | Stock | number | 是 | 当前选中 SKU 的可售库存数量 |
| deliveryInfo | 配送说明 | Delivery Info | string | 是 | 配送时效与运费说明文案，支持 i18n |
| additionalInfoHtml | 附加信息 | Additional Information | string | 否 | Additional Information 区块内容 |
| descriptionHtml | 详情描述 | Description HTML | string | 是 | Description 区块富文本内容 |
| topicTag | 活动专区标识 | Topic Tag | string | 否 | 所属专题 Tag 文案，如 Brand Zone |
| authenticGuarantee | 正品保证 | Authentic Guarantee | boolean | 否 | 品牌馆商品为 `true`，展示 100% 正品保证 |
| storeId | 店铺 ID | Store ID | string | 否 | 所属店铺 ID，用于跳转店铺页 |
| storeName | 店铺名称 | Store Name | string | 否 | 左侧店铺入口展示名 |
| seoTitle | SEO 标题 | SEO Title | string | 是 | PDP `<title>`，支持 i18n |
| seoDescription | SEO 描述 | SEO Description | string | 是 | PDP meta description |
| status | 商品状态 | Product Status | enum | 是 | `on_sale` 在售 / `off_sale` 下架 / `not_found` 不存在 |

##### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR401 | PDP 加载 | 进入页 | 左图右购布局 | 加载● 错误● | 轮播/主图切换 |
| BR402 | 价格展示 | 数据返回 | 现价/原价/折扣 Tag；BDT 千分位 | — | 同 App |
| BR403 | SKU/数量 | 右侧购买区 | SKU 选择 + 数量步进 | — | 同 BR413–BR414 |
| BR404 | 详情区块 | 左侧展示 | Additional Information + Description | 加载● | 无评价区 |
| BR405 | 安全保证 | 左侧底部 | 24/7 Support、Product Replace | — | 固定两项 |
| BR406 | 加购 | 点击 | 唤起 BR417 | 错误● | 游客可用 |
| BR407 | 立即购买 | 点击 | BR417→结算 | 未登录△ | 门禁 BR619 |
| BR408 | 底侧推荐 | 页面底部 | Recommend；顺序逻辑同 App | — | — |
| BR409 | 不可用（基准） | 404/下架 | 独立页+推荐 | 错误● | 无购买按钮 |
| BR830 | 品牌正品保证 | 品牌馆商品 | 右侧展示 100% 正品保证 | — | 仅 Brand Zone |
| BR121 | PDP SEO | 页面渲染 | 注入 seoTitle/seoDescription | — | 本期唯一 SEO 页 |

#### 4.7.2 规格选择器（#17）

##### 功能描述

规格选择器以 Modal 形式承载 SKU 选择与数量确认，是加购/购买的必经步骤（无默认 SKU 时）。PC 居中 Modal，Mobile 底部 Sheet。须校验规格完整性、库存上限后方可提交。

##### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|----------------|----------------|---------|
| FL053 | 规格弹层 | SKU Modal | 唤起/关闭 |
| FL054 | SKU 选择 | Attribute Select | 颜色/尺码等 |
| FL055 | 购买数量 | Quantity | 步进器 |
| FL056 | 价格联动 | Price Sync | SKU 变价 |
| FL057 | 确认加购/购买 | Confirm | 提交 |

##### 业务规则

1. 未选全规格时不可提交，Toast 指明缺失项。  
2. 数量最小 1，最大 = 当前 SKU 库存。  
3. 加购成功：关闭弹层 + Toast + 更新角标。  
4. 购买：关闭弹层 → 已登录进结算；未登录走 BR619。

##### 字段定义

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| skuId | SKU ID | SKU ID | string | 是 | SKU 唯一标识 |
| attributes | 规格属性 | Attributes | object | 是 | 规格键值对，如 `{color:"Red", size:"M"}` |
| attributeName | 属性名 | Attribute Name | string | 是 | 属性维度名称，如颜色、尺码，支持 i18n |
| attributeValue | 属性值 | Attribute Value | string | 是 | 属性具体值，如 Red、M，支持 i18n |
| salePrice | SKU 售价 | SKU Sale Price | number | 是 | 该 SKU 售价，单位 BDT |
| stock | SKU 库存 | SKU Stock | number | 是 | 该 SKU 可售库存 |
| available | 是否可选 | Available | boolean | 是 | 是否可购买；缺货时为 `false` 并置灰 |
| quantity | 购买数量 | Quantity | number | 是 | 用户选择数量，默认 1，范围 1~stock |

##### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR412 | 唤起弹层 | 加购/购买 | 开闭 BR201–202 | — | PC 居中/Mobile 底 Sheet |
| BR413 | SKU 选择 | 点击属性 | 高亮；缺货置灰 | 加载● 空● | 全缺货 BR137 |
| BR414 | 数量步进 | +/- | 1~库存 | — | 超库存 BR801 |
| BR415 | 价格联动 | 换 SKU | 实时更新 | 错误● | 同接口 |
| BR416 | 未选全 | 点确认 | Toast；不关层 | — | 指明缺项 |
| BR417 | 确认 | 点确认 | 加购/购买 | 加载● 错误● | 购买 BR619 |

#### 4.7.3 商品推荐组件（#18）

##### 功能描述

可嵌入多页面的复用组件，由运营配置标题与召回逻辑（算法同 App，见 OQ7）。无数据时可隐藏区块。

##### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|----------------|----------------|---------|
| FL058 | 推荐组件嵌入 | Recommendation Widget Embed | 嵌入首页/PDP/购物车等 |
| FL059 | 推荐布局适配 | Recommendation Layout | PC 网格；Mobile 横滑 |
| FL060 | 推荐商品跳转 | Recommendation Navigation | 点击跳转 PDP |

##### 业务规则

1. 标题可运营配置（如 You May Like），支持 i18n。  
2. 无推荐数据时可隐藏整个区块。  
3. 商品卡样式与交互同 BR120。

##### 字段定义

**组件配置**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| widgetTitle | 组件标题 | Widget Title | string | 是 | 推荐区标题，如「You May Like」，支持 i18n |
| layoutType | 布局类型 | Layout Type | enum | 是 | `grid` 网格 / `carousel` 横滑 |
| scene | 推荐场景 | Scene | enum | 是 | 召回场景：`home` / `pdp` / `cart` / `search_empty` / `topic` |
| productIds[] | 推荐商品 | Recommended Products | array | 是 | 推荐商品 ID 列表，按展示顺序 |

**通用商品卡字段（全站列表复用）**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| productId | 商品 ID | Product ID | string | 是 | 商品唯一标识 |
| title | 商品标题 | Product Title | string | 是 | 商品卡展示标题，支持 i18n |
| imageUrl | 商品主图 | Product Image URL | string | 是 | 商品卡主图地址 |
| salePrice | 售价 | Sale Price | number | 是 | 商品卡售价，BDT |
| originalPrice | 原价 | Original Price | number | 否 | 划线原价，用于折扣展示 |
| discountRate | 折扣比例 | Discount Rate | number | 否 | 折扣角标百分比 |
| topicTag | 活动专区标识 | Topic Tag | string | 否 | 商品所属专题 Tag；全站商品列表展示 |
| productUrl | 商品链接 | Product URL | string | 是 | 跳转 PDP 路径，如 `/product/{id}` |

##### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR418 | 组件嵌入 | 宿主加载 | 统一卡片样式 | 加载● 空○ 错误○ | 标题可配置 |
| BR419 | 布局适配 | 按屏宽 | PC 网格/Mobile 横滑 | — | 风格一致 |
| BR420 | 推荐跳转 | 点击卡片 | 跳转 PDP | — | 不改变历史栈 |

---

### 4.8 模块 E：店铺（#19–#21）

#### 功能描述

店铺模块展示商家信息与店内商品，分为 **Home** 和 **Items** 两个 Tab（同 BR138）。点击**店铺头像**可打开**店铺信息 Modal**（同 BR201–BR202）。店铺不存在时走 BR409。

**Home Tab**

- **Banner**：可选上传；无 Banner 时不展示占位。商家在 **Seller 端须有两个 Banner 上传渠道**（需在 Seller PRD 中定义，本文档标注依赖）。  
- **Featured Products**：精选商品展示。  
- **Recommend + View More**：推荐商品区，支持 View More 加载（同 BR825）。

**Items Tab**

- 商品列表支持**排序**（同搜索 BR211–BR213）。  
- 展示**活动专区对应 Tag**。  
- 商品列表 **10 行 + View More**（同 BR825）。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|----------------|----------------|---------|
| FL061 | 店铺 Home Tab | Store Home Tab | Banner + Featured + Recommend |
| FL062 | 店铺 Items Tab | Store Items Tab | 排序 + Tag + 商品列表 |
| FL063 | 店铺信息 Modal | Store Info Modal | 点击头像展示店铺信息 |
| FL064 | 店铺 Banner | Store Banner | 可选 Banner；Seller 双渠道上传 |
| FL065 | Featured Products | Featured Products | Home Tab 精选商品 |
| FL066 | 店铺 Recommend | Store Recommend | Home Tab 推荐 + View More |
| FL067 | 店铺商品列表 | Store Product List | Items Tab 10 行 + View More |

#### 业务规则

1. 店铺信息（名称、Logo、评分）与 App 一致。  
2. Tab 固定为 **Home / Items**；默认 Tab 为 Home。  
3. Items Tab 排序同搜索排序枚举（BR211–BR213）。  
4. 无商品：Tab 级空态，不隐藏 Tab。  
5. Banner 未上传时 Home Tab 不展示 Banner 区域，不留空白占位。

#### 字段定义

**店铺信息**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| storeId | 店铺 ID | Store ID | string | 是 | 店铺唯一标识，路由 `/store/{id}` |
| storeName | 店铺名称 | Store Name | string | 是 | 店铺展示名称，支持 i18n |
| storeLogoUrl | 店铺 Logo | Store Logo URL | string | 是 | 店铺 Logo 图片地址 |
| storeBannerUrl | 店铺头图 | Store Banner URL | string | 否 | 店铺页顶部 Banner 图 |
| rating | 店铺评分 | Store Rating | number | 否 | 店铺平均评分 |
| followerCount | 粉丝数 | Follower Count | number | 否 | 店铺粉丝数量 |
| description | 店铺简介 | Store Description | string | 否 | 店铺介绍长文，在介绍弹框中展示 |
| status | 店铺状态 | Store Status | enum | 是 | `active` 正常 / `not_found` 不存在 |

**店铺 Tab**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| tabKey | Tab 标识 | Tab Key | string | 是 | `home` / `items` |
| tabName | Tab 名称 | Tab Name | string | 是 | Home / Items，支持 i18n |
| isDefault | 是否默认 | Is Default | boolean | 是 | 默认 `home` |
| sellerBannerChannel | Seller Banner 渠道 | Seller Banner Channel | enum | 是 | Seller 端双 Banner 上传渠道标识（依赖 Seller PRD） |

> 店铺商品列表复用 **§4.7.3 通用商品卡字段**。

#### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR501 | 店铺页加载 | 进入 `/store/{id}` | Home/Items Tab；默认 Home | 加载● 错误● | 同 App |
| BR502 | 店铺头像 Modal | 点击店铺头像 | 打开店铺信息 Modal（BR201） | — | 展示店铺介绍 |
| BR503 | Home Tab | 切换 Home | Banner（可选）+ Featured + Recommend View More | — | 无 Banner 不占位 |
| BR504 | Items Tab（基准） | 切换 Items | 排序 BR211；列表 BR208；Tag 展示 | — | 10 行 + BR825 |
| BR505 | Tab 切换（基准） | 点击 Tab | Home ↔ Items | — | 同 BR138 |
| BR506 | 店铺不可用 | 店铺不存在 | 同 BR409 | 错误● | — |

---

### 4.9 模块 F：交易（#22–#30）

#### 4.9.1 购物车（#22–#25）

##### 功能描述

购物车模块包含：Header **下拉预览**（#22）、**购物车页**（#23）、**编辑模式**（#24）、**折扣明细**（#25）。游客可使用购物车；**去结算**须登录（BR619）。

购物车页展示有效商品与失效商品分区。失效商品不可勾选、置底灰色展示。价格实时计算，优惠明细须与结算页一致。

##### 业务规则

1. **勾选**：至少选 1 件方可结算；全选/单选联动底部合计。  
2. **改量**：实时算价；失败回滚原数量；超库存 Toast。  
3. **失效商品**：下架/缺货自动归入失效区，提供删除。  
4. **编辑模式**：批量删除需二次确认；删光回空态（BR612）。  
5. **游客购物车**：与登录合并策略见 OQ1。

##### 字段定义

**购物车行**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| lineId | 购物车行 ID | Cart Line ID | string | 是 | 购物车商品行唯一标识 |
| productId | 商品 ID | Product ID | string | 是 | 商品唯一标识 |
| skuId | SKU ID | SKU ID | string | 是 | 所选 SKU 标识 |
| productTitle | 商品标题 | Product Title | string | 是 | 购物车行展示的商品名称 |
| skuLabel | 规格文案 | SKU Label | string | 是 | 已选规格展示，如「Red / M」 |
| imageUrl | 商品图片 | Product Image URL | string | 是 | 购物车行商品缩略图 |
| quantity | 数量 | Quantity | number | 是 | 购买数量，≥1 |
| unitPrice | 单价 | Unit Price | number | 是 | 当前单价，单位 BDT |
| subtotal | 小计 | Subtotal | number | 是 | 行小计 = 单价 × 数量 |
| selected | 是否勾选 | Selected | boolean | 是 | 是否参与结算勾选 |
| status | 行状态 | Line Status | enum | 是 | `valid` 有效 / `invalid` 失效 |
| invalidReason | 失效原因 | Invalid Reason | string | 否 | 失效原因：下架/缺货/变价 |

**购物车汇总**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| totalQuantity | 商品总件数 | Total Quantity | number | 是 | 已勾选商品总件数，用于角标 |
| merchandiseTotal | 商品总额 | Merchandise Total | number | 是 | 已勾选商品金额合计 |
| discountTotal | 优惠总额 | Discount Total | number | 是 | 已优惠金额合计 |
| payableTotal | 应付总额 | Payable Total | number | 是 | 去结算展示金额 |

**折扣明细项**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| promotionName | 优惠名称 | Promotion Name | string | 是 | 满减/优惠券/活动名称 |
| promotionType | 优惠类型 | Promotion Type | enum | 是 | `coupon` / `full_reduction` / `activity` |
| discountAmount | 抵扣金额 | Discount Amount | number | 是 | 该项优惠抵扣金额，BDT |

##### 交互说明（摘要）

| 页面 | BR 范围 | 关键门禁 |
|------|---------|---------|
| #22 预览 | BR601–BR604 | 去结算 BR619 |
| #23 购物车 | BR605–BR613 | 去结算 BR619 |
| #24 编辑 | BR614–BR616 | — |
| #25 折扣 | BR617–BR618 | 金额同结算 |

#### 4.9.2 结算与地址（#26–#30）

##### 功能描述

结算页是交易闭环核心，**必须登录**进入。页面采用**左侧主内容 + 右侧 Sticky 汇总区**布局。

**左侧主内容**：收货地址、发货方式、订单商品（按商户分组，支持 **Remark 备注**）、支付方式。  
**右侧 Sticky**：Coupon & Code、Order Summary、安全提示。

流程：填写/选择地址 → 确认商品与备注 → 选择优惠券 → 确认金额 → 提交订单 → 跳转结果页。

##### 业务规则

**地址**

1. **地址为空时**：展示内联文本框——**Name、Phone Number、Region/City/District、Address**；用户填写后点击 **Save**，校验通过则**同步至账户地址库**；不符合要求则**不允许提交**，Toast 提示错误项。  
2. **Change / Edit Address**：通过 **Modal 弹框**操作（同 BR201–BR202），不跳转独立账户页。  

**发货方式**

3. 本期仅支持**本地发货**；发货方式固定为 **Local Delivery**，运费固定 **৳60**。  

**支付方式**

4. 本期仅支持 **Cash on Delivery（COD）** 一种支付方式。  

**订单备注**

5. 订单内可按**不同商户（Seller）**分别填写 **Remark** 备注。  

**优惠券（Coupon & Code）**

6. 支持 **Coupon Code 输入**，或从用户已有优惠券列表打开**抽屉（Drawer）**选择。  
7. 抽屉分 **Available** / **Not Available** 两个列表；有明确**关闭按钮**和**确认（Confirm）**按钮；支持点击遮罩或关闭按钮收起。  
8. 打开抽屉时**默认勾选**当前订单可抵扣金额**最大**的一张可用券；**严禁多券叠加**，仅可**单选**一张。  
9. 再次点击已选券可**取消勾选**；点击 **Confirm** 后收起抽屉，将选中 `couponId` 回传结算页并**重新计算**订单总价。  
10. **不可用券**：整卡置灰不可点击/勾选，展示原因：**未达到使用门槛**、**不适用当前商品**。  
11. **二次校验**：用户停留期间券可能被核销或过期；Confirm 后后端须二次校验；失败则 Toast 提示并**刷新抽屉列表**。计算规则**同 App 端**。  

**Order Summary**

12. 金额构成：**Subtotal**（hover 小问号提示「VAT 包含在内」）+ **Promotion** + **Coupon** + **Shipping Fee**（本期固定 60）+ **COD Handling Fee**（本期免费，展示为 0 或「Free」）。  
13. **Subtotal** = 商品**原价**小计；**Promotion** = 现价小计 − 原价小计；**Coupon** = 优惠券抵扣金额。  

**提交与结果**

14. **门禁**：未登录统一跳转 `/login?redirect={checkoutUrl}`。  
15. **提交**：按钮 Loading 防重复；后端校验库存/价格/优惠券；**加载中**全站蒙版不可操作。  
16. **成功**：跳转成功结果页；**失败**：Toast 提示失败，建议重新提交订单。  
17. **结果页**：成功态提供 **View Order List** 按钮，跳转订单列表（`ordersUrl`，他人 PRD）。

##### 字段定义

**收货地址（内联/Modal 共用）**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| addressId | 地址 ID | Address ID | string | 否 | 已有地址 ID；新建为空 |
| recipientName | 姓名 | Name | string | 是 | 收货人姓名 |
| phone | 手机号 | Phone Number | string | 是 | 孟加拉手机号校验 |
| regionCityDistrict | 地区 | Region/City/District | string | 是 | Region / City / District 组合字段 |
| addressLine | 详细地址 | Address | string | 是 | 街道门牌等详细地址 |
| isDefault | 是否默认 | Is Default | boolean | 否 | Save 后同步账户地址库 |

**发货与支付（本期固定）**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| deliveryMethod | 发货方式 | Delivery Method | string | 是 | 固定 `Local Delivery` |
| shippingFee | 运费 | Shipping Fee | number | 是 | 固定 **60** BDT |
| paymentMethod | 支付方式 | Payment Method | string | 是 | 固定 `Cash on Delivery` |
| codHandlingFee | COD 手续费 | COD Handling Fee | number | 是 | 本期固定 **0**（免费） |

**商户备注**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| sellerId | 商户 ID | Seller ID | string | 是 | 商户唯一标识 |
| orderRemark | 订单备注 | Order Remark | string | 否 | 该商户下商品的分单备注 |

**优惠券**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| couponCode | 优惠券码 | Coupon Code | string | 否 | 用户输入的 Coupon Code |
| couponId | 已选优惠券 ID | Selected Coupon ID | string | 否 | Confirm 后回传；单选 |
| couponAmount | 优惠券抵扣 | Coupon Amount | number | 否 | 抵扣金额，BDT |
| couponStatus | 券可用状态 | Coupon Status | enum | 是 | `available` / `unavailable` |
| unavailableReason | 不可用原因 | Unavailable Reason | enum | 否 | `min_spend` 未达门槛 / `not_applicable` 不适用商品 |

**Order Summary**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| subtotal | 商品原价小计 | Subtotal | number | 是 | 商品原价合计；hover 提示 VAT 已含 |
| promotion | 促销优惠 | Promotion | number | 是 | 现价小计 − 原价小计 |
| coupon | 优惠券抵扣 | Coupon Discount | number | 是 | 优惠券抵扣金额 |
| shippingFee | 运费 | Shipping Fee | number | 是 | 固定 60 |
| codHandlingFee | COD 手续费 | COD Handling Fee | number | 是 | 本期 0 |
| payableAmount | 应付总额 | Payable Amount | number | 是 | 最终应付金额 |

**结算提交**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| addressId | 收货地址 ID | Address ID | string | 是 | 所选/新建保存后的地址 ID |
| cartLineIds[] | 购物车行列表 | Cart Line IDs | array | 是 | 待结算购物车行 |
| couponId | 优惠券 ID | Coupon ID | string | 否 | 单选优惠券；可为空 |
| orderRemarks[] | 商户备注列表 | Order Remarks | array | 否 | 按 sellerId 的备注数组 |
| payableAmount | 实付金额 | Payable Amount | number | 是 | 提交时应付金额 |

**订单结果页**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| orderId | 订单号 | Order ID | string | 是 | 提交成功后订单号 |
| orderStatus | 订单状态 | Order Status | enum | 是 | `success` / `failed` |
| paidAmount | 实付金额 | Paid Amount | number | 是 | 实际应付金额，BDT |
| ordersListUrl | 订单列表地址 | Orders List URL | string | 是 | View Order List 跳转地址 |

##### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR619 | 结算门禁（基准） | 未登录进入结算 | 跳转 `/login?redirect=` | 未登录● | — |
| BR620 | 地址内联填写 | 地址为空 | Name/Phone/Region/Address + Save | 错误● | 校验失败 Toast |
| BR621 | 地址 Modal | Change/Edit | Modal 选择/编辑地址（BR201） | — | Save 同步地址库 |
| BR622 | 本地配送 | 结算页 | 固定 Local Delivery；运费 60 | — | 不可切换 |
| BR623 | COD 支付 | 结算页 | 固定 Cash on Delivery | — | 不可切换 |
| BR624 | 商户备注 | 按商户分组 | 每商户可填 Remark | — | 随单提交 |
| BR625 | 优惠券抽屉 | 打开 Coupon 区 | Available/Not Available；默认选最大抵扣券 | 加载● 错误● | 单选 |
| BR626 | 优惠券 Confirm | 点击 Confirm | 回传 couponId；重算总价；二次校验 | 错误● | 失败 Toast+刷新 |
| BR627 | 提交订单 | 点击 Place Order | 全局 Loading 蒙版；成功跳结果页；失败 Toast | 加载● 错误● | 防重复提交 |
| BR628 | 结果页成功 | 下单成功 | 展示成功态 + **View Order List** → `ordersListUrl` | — | 跳转订单列表 |
| BR629 | 结果页失败 | 下单失败 | Toast 提示；建议重新提交 | 错误● | — |
| BR632 | 地址列表 Modal | Change Address | Modal 展示地址列表（BR201） | — | 可选已有地址 |
| BR635 | 新增地址 Modal | Add Address | Modal 内新增（字段同上） | 错误● | Save 同步地址库 |
| BR638 | 编辑地址 Modal | Edit Address | Modal 内编辑 | 错误● | Save 同步地址库 |

---

### 4.10 模块 I：专题（#35–#38）

#### 功能描述

专题页承载运营导购，对应首页活动专区四入口：**Brand Zone（#35）、Global（#36）、Featured（#37）、Trending（#38）**。页面结构统一为 **Banner + Tab + 商品列表**（列表交互同 BR208 + BR825）。

属于某专题的商品，在**全站所有商品列表**（首页推荐、搜索、分类、店铺、专题等）均展示对应 **专题 Tag** 标识。

#### 业务规则

1. 商品列表同 BR208；分页同 **BR825**（10 行 + View More）；空态 CTA 回首页。  
2. Tab 配置与 App 专题页一致（具体 Tab 名称/数量以 App 为准）。  
3. 专题下线或 ID 无效：同 BR409。  
4. 分享：复制当前专题 URL。  
5. **专题 Tag**：`topicTag` 字段在全站商品卡（§4.7.3）与 PDP 右侧展示。

#### 字段定义

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| topicId | 专题 ID | Topic ID | string | 是 | 专题唯一标识，用于路由 |
| topicType | 专题类型 | Topic Type | enum | 是 | `brand` Brand Zone / `global` Global / `featured` Featured / `trending` Trending |
| title | 专题标题 | Topic Title | string | 是 | 专题页标题，支持 i18n |
| bannerUrl | 专题头图 | Topic Banner URL | string | 是 | 专题页顶部 Banner |
| topicTag | 专题标识 Tag | Topic Tag Label | string | 是 | 全站商品列表展示的 Tag 文案 |
| tabs[] | 专题 Tab | Topic Tabs | array | 是 | Tab 列表，含 tabKey/tabName |
| shareUrl | 分享链接 | Share URL | string | 是 | 专题页完整 URL |
| status | 专题状态 | Topic Status | enum | 是 | `active` 上线 / `offline` 下线 |

> 专题商品列表复用 **§4.7.3 通用商品卡字段**。

#### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR701 | 专题页加载 | 进入专题页 | Banner + Tab + 商品列表 | 加载● 错误● | 四专题类型 |
| BR702 | 专题 Tab | 切换 Tab | 刷新对应商品列表 | — | 同 App |
| BR703 | 专题商品列表 | 有数据 | 列表 BR208；BR825 分页 | — | 含 topicTag |
| BR704 | 专题 Tag 展示 | 商品属于专题 | 全站列表/PDP 展示 Tag | — | 标识一致 |
| BR705 | 专题下线 | ID 无效/下线 | 同 BR409 | 错误● | — |

---

### 4.11 全局状态与反馈

#### 功能描述

跨页面复用的反馈与状态模式，在各模块通过「同 BRxxx」引用，避免重复定义。

#### 功能清单

FL125–FL131（见附录 A）

#### 业务规则

1. **Toast**：3s 自动消失，不遮挡主 CTA。  
2. **网络错误**：支持孟语/英语；页面级或区块级重试。  
3. **骨架屏**：形状与真实布局一致。  
4. **401**：Toast + 跳转登录（BR619）+ redirect。  
5. **空态文案**：按 BR137 场景表配置。

#### 字段定义

**全局反馈状态**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| toastMessage | 提示文案 | Toast Message | string | 是 | Toast 展示文案，支持 i18n |
| toastType | 提示类型 | Toast Type | enum | 是 | `success` / `error` / `info` |
| errorMessage | 错误文案 | Error Message | string | 是 | 网络/接口错误展示文案 |
| retryVisible | 重试按钮 | Retry Visible | boolean | 是 | 是否展示重试按钮 |
| emptyTitle | 空态标题 | Empty Title | string | 是 | 列表空态主标题 |
| emptyDescription | 空态描述 | Empty Description | string | 否 | 空态补充说明 |
| emptyCtaText | 空态按钮 | Empty CTA Text | string | 否 | 空态 CTA 按钮文案 |
| emptyCtaUrl | 空态链接 | Empty CTA URL | string | 否 | 空态 CTA 跳转地址 |

#### BR137 空态场景文案

| 场景 | 文案方向 | CTA |
|------|---------|-----|
| 搜索无历史 | 暂无搜索记录 | — |
| 搜索无结果 | 未找到相关商品 | 回首页 |
| 分类/专题无商品 | 暂无商品 | 回上级/首页 |
| 购物车空 | 购物车是空的 | 去逛逛 |
| 地址空 | 请添加收货地址 | 新增地址 |
| 店铺无介绍 | 暂无店铺介绍 | — |

#### 交互说明

| 编号 | 名称 | 说明 |
|------|------|------|
| BR801 | Toast（基准） | 全局操作反馈 |
| BR802 | 网络错误（基准） | 重试 |
| BR803 | 骨架屏（基准） | 首屏加载 |
| BR804 | 401 会话过期 | BR801 + BR619 |
| BR805 | 图片懒加载 | 商品图 |
| BR137 | 空态（基准） | 见上表 |
| BR138 | Tab 列表（基准） | 店铺 Home/Items（BR505） |

---
## 五、非功能需求

### 5.1 性能

| 编号 | 需求 | 指标/说明 |
|------|------|----------|
| **NFR001** | 首屏可交互 | 首页 LCP ≤ 2.5s（4G 模拟）；关键路径资源优先 |
| **NFR002** | 图片优化 | WebP/AVIF 优先；Responsive srcset；懒加载（BR805） |
| **NFR003** | 接口超时 | 客户端 15s 超时；超时走 BR802 |
| **NFR004** | 列表加载粒度 | View More 列表每次加载 **10 行**；刷新页面重置 |

### 5.2 兼容性与响应式

| 编号 | 需求 | 说明 |
|------|------|------|
| **NFR005** | 浏览器 | Chrome/Safari/Firefox 最新两个大版本；Android Chrome；iOS Safari |
| **NFR006** | 断点 | Mobile `<768px`；Tablet `768–1024px`；Desktop `>1024px` |
| **NFR007** | 布局策略 | PC 顶栏导航；搜索结果 Filter 本期做（分类字段见 OQ8） |

### 5.3 国际化（i18n）

| 编号 | 需求 | 说明 |
|------|------|------|
| **NFR008** | 语言 | 孟加拉语 + 英语；Header 语言切换（BR822–BR823）；全站文案随切换刷新 |
| **NFR009** | 货币格式 | BDT `৳1,234.00` 千分位 |
| **NFR010** | 手机号 | 默认 +880 区号展示与校验 |

### 5.4 安全与合规

| 编号 | 需求 | 说明 |
|------|------|------|
| **NFR011** | HTTPS | 全站强制 HTTPS |
| **NFR012** | 追踪脚本 | 本期禁止非必要第三方追踪；统计方案需评审 |
| **NFR013** | 支付安全 | 支付跳转 HTTPS；回调验签由后端保障 |
| **NFR014** | XSS/CSRF | 表单与 UGC 内容转义；敏感操作 CSRF Token |

### 5.5 SEO

| 编号 | 需求 | 页面 |
|------|------|------|
| **NFR015** | Meta 注入 | **本期仅 PDP** 注入 title/description（BR121） |
| **NFR016** | PDP Meta 内容 | 含商品名与价格 |
| **NFR017** | 结构化数据 | PDP Product Schema（扩展计划） |
| **NFR018** | Canonical | 避免重复参数 URL；搜索页 `q` 可索引策略需运营确认 |

### 5.6 可访问性（基础）

| 编号 | 需求 | 说明 |
|------|------|------|
| **NFR019** | 键盘 | Modal 可 ESC 关闭；焦点陷阱 |
| **NFR020** | 对比度 | 正文对比度 ≥ 4.5:1 |
| **NFR021** | 图片 alt | 商品图必填 alt（商品标题） |

### 5.7 可观测性

| 编号 | 需求 | 说明 |
|------|------|------|
| **NFR022** | 埋点 | 核心事件：搜索、加购、结算、支付结果（埋点方案另文档） |
| **NFR023** | 错误监控 | 前端 JS 错误与 API 错误上报 |

---

## 六、扩展计划

### 6.1 本期不做（P0 范围外明确排除）

| 项目 | 说明 | 计划阶段 |
|------|------|---------|
| Featured 筛选（#10） | 搜索结果运营标签筛选 | P1 |
| 发票（#34） | 发票详情、电子发票 PDF 下载等 | **下一期（P1）** |
| Cookie CMP 集成 | Cookiebot/OneTrust 等 | 合规驱动时 |
| 第三方追踪 | 非必要脚本一律不加载 | 合规评审后 |

### 6.2 P1 扩展

| 功能 | 描述 | 关联 BR |
|------|------|--------|
| 搜索 Featured 筛选 | 结果页顶部 Pill/Tab | 预留 BR210 旁 |
| 搜索过滤器 | PC 左侧栏 + Mobile 抽屉 | 新建 BR 段 |
| 店铺内搜索 | 店铺页搜索框 | BR504 扩展 |
| 发票模块（#34） | 发票详情页、开票状态、PDF 下载；法规字段补全 | 新建 BR 段 |
| 账户安全相关 | 设备记录等 | 他人 PRD |
| SEO 结构化数据 | Product Schema 全量 | NFR017 落地 |

### 6.3 P2 增值

| 功能 | 描述 |
|------|------|
| 收藏夹独立页 | 商品收藏列表 |
| 图搜 | 以图搜索商品 |
| 站内信/通知中心 | 订单与营销消息 |
| Web Push | 浏览器推送（需合规） |
| 游客购物车合并 | 登录后自动合并策略优化 |

### 6.4 依赖项与 Open Questions

| # | 问题 | 影响模块 | 负责人 |
|---|------|---------|--------|
| OQ1 | 游客购物车与登录账号合并策略 | #22–#26 | 产品+后端 |
| OQ2 | 孟加拉行政区数据源 API | #29–#30 | 后端 |
| OQ3 | Web 支付跳转与回调流程 | #26–#27 | 后端+支付 |
| OQ4 | COD 手续费未来是否收费 | #26 | 业务 |
| OQ8 | 搜索结果 Filter 分类字段定义 | #11 | 产品+后端 |
| OQ5 | 首页服务介绍展示频次 | #7 | 产品+运营 |
| OQ6 | PC 与 Mobile Web 是否同期上线 | 全局 | 项目管理 |
| OQ7 | 推荐算法是否与 App 同一套 | #18 | 算法 |

---

## 七、验收总则

### 7.1 功能验收

- [ ] 本文档范围内 32 项页面/模块均可访问且与 App 业务规则一致  
- [ ] FL001–FL140 功能点全部实现（订单系 FL107–FL119 由他人 PRD 验收）  
- [ ] BR101–BR830 全部通过测试用例（订单 BR640–BR652、客服 BR809+ 由他人 PRD 验收）  
- [ ] Header / Footer / 首页 Sticky 三处客服入口均可跳转 `supportEntryUrl`  
- [ ] Header 账户区三态（加载中/未登录/已登录）视觉与菜单正确切换  
- [ ] Header 账户聚合入口：PC Hover / Mobile 点击可展开菜单，登录/订单/优惠券/退出跳转正确  
- [ ] 登录/注册/个人中心/订单/Cookie 衔接符合第三章 3.5，不出现断链  

### 7.2 状态验收

- [ ] 所有标记「加载●」的页面具备骨架屏或 Loading  
- [ ] 所有标记「空●」的场景具备文案 + CTA  
- [ ] 所有标记「错误●」的场景可重试或明确下一步  
- [ ] 所有标记「未登录●」的页面正确跳转登录并回跳  

### 7.3 非功能验收

- [ ] NFR001–NFR023 抽样通过  
- [ ] 孟语/英语切换后本文档范围文案无遗漏  

---

## 附录 A：FL 功能清单索引（按模块）

| 模块 | 页面 | FL 范围 |
|------|------|---------|
| 全局 Header | #3 | FL001–FL008、FL132、FL134–FL136 |
| 信任背书 | #4 | FL009–FL010、FL137 |
| Footer | #5 | FL011–FL014（Contact Us 兼客服入口） |
| 首页核心 | #6 | FL015–FL020、FL133、FL138 |
| 首页服务介绍 | #7 | FL022–FL024 |
| 搜索筛选 | #11 | FL139 |
| 搜索弹窗 | #8 | FL025–FL029 |
| 搜索结果 | #9 | FL030–FL033 |
| 搜索排序 | #12 | FL034–FL035 |
| 分类抽屉 | #13–#15 | FL036–FL038、FL140 |
| 分类商品列表 | #15 | FL039–FL041 |
| 商品详情 | #16 | FL042–FL052 |
| 规格选择器 | #17 | FL053–FL057 |
| 推荐组件 | #18 | FL058–FL060 |
| 店铺页 | #19 | FL061–FL063 |
| 店铺商品 Tab | #20 | FL064–FL065 |
| 店铺介绍 | #21 | FL066–FL067 |
| 购物车预览 | #22 | FL068–FL071 |
| 购物车页 | #23 | FL072–FL080 |
| 购物车编辑 | #24 | FL081–FL083 |
| 购物车折扣 | #25 | FL084–FL085 |
| 结算页 | #26 | FL086–FL094 |
| 订单结果页 | #27 | FL095–FL098 |
| 地址列表 | #28 | FL099–FL101 |
| 地址新增 | #29 | FL102–FL104 |
| 地址编辑 | #30 | FL105–FL106 |
| 专题页 | #35–#38 | FL120–FL124 |
| 全局状态 | 跨页面 | FL125–FL131 |

## 附录 B：BR 编号索引（按模块）

| 模块 | BR 范围 | 基准 BR（优先阅读） |
|------|---------|-------------------|
| 全局 Header | BR101–BR108、BR806、BR815–BR823 | BR201、BR301、BR619、BR803、BR804 |
| 信任背书 | BR109–BR110、BR824 | BR201 |
| Footer | BR111–BR114、BR112（客服入口） | BR806 |
| 搜索 | BR201–BR213、BR828 | BR201–BR202、BR208、BR825、BR211–BR213 |
| 分类 | BR301–BR307、BR829 | BR208、BR211–BR213、BR825、BR418 |
| 商品 | BR401–BR420、BR830、BR121 | BR120、BR409、BR418–BR420、BR619 |
| 店铺 | BR501–BR506 | BR201–BR202、BR208、BR409、BR504、BR825 |
| 购物车 | BR601–BR618 | BR137、BR418、BR619、BR801 |
| 结算/地址/结果 | BR619–BR629、BR632–BR638 | BR619、BR201–BR202、BR625–BR626 |
| 专题 | BR701–BR705 | BR208、BR825、BR409 |
| 首页 | BR115–BR124、BR807–BR808、BR825–BR826 | BR208、BR418、BR806 |
| 全局状态 | BR137–BR138、BR801–BR805 | BR137、BR138、BR801–BR803 |

## 附录 B-2：「同 BRxxx」引用关系速查

| 被引用基准 BR | 引用方（同此交互） |
|-------------|------------------|
| BR120 | BR208、BR305、BR503、BR505、BR702、BR418 |
| BR137 | BR203、BR210、BR302、BR413、BR507、BR604、BR612、BR633 |
| BR138 (=BR504) | BR505 |
| BR201–BR202 | BR104、BR412、BR506、BR632 |
| BR806 | BR808、BR112、FL132（Header）、FL133（Sticky） |
| BR208 | BR119、BR210、BR305、BR503、BR505、BR702 |
| BR209 | BR119 |
| BR211–BR213 | BR305、BR505、BR213（搜索内） |
| BR409 | BR501、BR638、BR701、BR705 |
| BR418–BR420 | BR210、BR307、BR408、BR613 |
| BR619 | BR407、BR603、BR611、BR617、BR628、BR632、BR815、BR804 |
| BR636 | BR639 |
| BR801 | BR406、BR410、BR414、BR416、BR611、BR636、BR701、BR804 |
| BR802 | BR106、BR204、BR205、BR208、BR209、BR301、BR406、BR415、BR615、BR636 |
| BR803 | BR105、BR208、BR213、BR301、BR504 |

## 附录 C：页面与 FL / BR 对照

| # | 页面 | Feature List | 交互说明 |
|---|------|-------------|---------|
| 3 | 顶部导航 | FL001–FL008、FL132、FL134–FL136 | BR101–BR108、BR806、BR815–BR823 |
| 4 | 信任背书 | FL009–FL010、FL137 | BR109–BR110、BR824 |
| 5 | 底部信息 | FL011–FL014 | BR111–BR114、BR112 |
| 6 | 首页核心 | FL015–FL020、FL133、FL138 | BR115–BR120、BR807–BR808、BR825 |
| 7 | 服务介绍 | FL022–FL024 | BR122、BR826–BR827 |
| 11 | 搜索筛选 | FL139 | BR828 |
| 8 | 搜索弹窗 | FL025–FL029 | BR201–BR206 |
| 9 | 搜索结果 | FL030–FL033 | BR207–BR210 |
| 12 | 排序 | FL034–FL035 | BR211–BR213 |
| 13–15 | 分类 | FL036–FL041 | BR301–BR307 |
| 16–18 | 商品 | FL042–FL052、FL058–FL060 | BR401–BR420、BR830、BR121 |
| 19–21 | 店铺 | FL061–FL067 | BR501–BR506 |
| 22–25 | 购物车 | FL068–FL085 | BR601–BR618 |
| 26–30 | 结算/地址 | FL086–FL106 | BR619–BR629、BR632–BR638 |
| 35–38 | 专题 | FL120–FL124 | BR701–BR705 |
| — | 全局状态 | FL125–FL131 | BR801–BR805、BR137–BR138 |

---

*文档结束 — KickBazar ToC Web PRD v1.10*
