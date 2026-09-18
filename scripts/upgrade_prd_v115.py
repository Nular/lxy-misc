#!/usr/bin/env python3
"""Upgrade KickBazar ToC Web PRD v1.14 -> v1.15."""

import re
from pathlib import Path

PATH = Path(__file__).resolve().parents[1] / "docs" / "kickbazar-toc-web-prd-v1.0.md"
text = PATH.read_text(encoding="utf-8")

# --- version ---
text = text.replace("| **文档版本** | v1.14 |", "| **文档版本** | v1.15 |")
text = text.replace("| **最后更新** | 2026-09-18 |", "| **最后更新** | 2026-09-18 |")
v115 = (
    "| v1.15 | 2026-09-18 | 产品经理 | "
    "**结构优化**：Recommended 推荐组件独立为 §4.4 全章书写；"
    "购物车 Order Summary 仅保留 Subtotal/Promotion/Grand Total（不含运费与 COD） |\n"
)
text = text.replace(
    "| 版本 | 日期 | 作者 | 变更说明 |\n|------|------|------|---------|\n",
    "| 版本 | 日期 | 作者 | 变更说明 |\n|------|------|------|---------|\n" + v115,
)

# --- extract old 4.7.3 for reference, then remove ---
old_473_start = text.index("#### 4.7.3 商品推荐组件（#18）")
old_473_end = text.index("\n---\n\n### 4.8 模块 E：店铺", old_473_start)
text = text[:old_473_start] + text[old_473_end:]

# --- renumber sections (high -> low) ---
renames = [
    ("### 4.11 全局状态与反馈", "### 4.14 全局状态与反馈"),
    ("### 4.12 模块 G3：全局 — 右侧 Sticky 快捷导航（#40）", "### 4.13 模块 G3：全局 — 右侧 Sticky 快捷导航（#40）"),
    ("### 4.10 模块 I：专题（#35–#38）", "### 4.11 模块 I：专题（#35–#38）"),
    ("### 4.9 模块 F：交易（#22–#30）", "### 4.10 模块 F：交易（#22–#30）"),
    ("#### 4.9.2 结算与地址（#26–#30）", "#### 4.10.2 结算与地址（#26–#30）"),
    ("#### 4.9.1 购物车（#23–#25）", "#### 4.10.1 购物车（#23–#25）"),
    ("#### 4.9.0 交易进度条", "#### 4.10.0 交易进度条"),
    ("### 4.8 模块 E：店铺（#19–#21）", "### 4.9 模块 E：店铺（#19–#21）"),
    ("### 4.7 模块 D：商品（#16–#18）", "### 4.8 模块 D：商品（#16–#17）"),
    ("#### 4.7.2 规格选择器（#17）", "#### 4.8.2 规格选择器（#17）"),
    ("#### 4.7.1 商品详情页（#16）", "#### 4.8.1 商品详情页（#16）"),
    ("### 4.6 模块 C：分类（#13–#15）", "### 4.7 模块 C：分类（#13–#15）"),
    ("### 4.5 模块 B：搜索（#8–#12）", "### 4.6 模块 B：搜索（#8–#12）"),
    ("#### 4.4.2 首页 — 服务介绍（#7）", "#### 4.5.2 首页 — 服务介绍（#7）"),
    ("#### 4.4.1 首页 — 核心展示区（#6）", "#### 4.5.1 首页 — 核心展示区（#6）"),
    ("### 4.4 模块 A：首页（#6–#7）", "### 4.5 模块 A：首页（#6–#7）"),
]
for old, new in renames:
    text = text.replace(old, new)

# --- insert new §4.4 before homepage ---
NEW_44 = """### 4.4 模块 H：Recommended 推荐组件（#18）

#### 基本信息

| 属性 | 内容 |
|------|------|
| 页面编号 | #18 |
| 类型 | 全局复用组件 |
| 优先级 | P0 |

#### 功能描述

**Recommended** 为全站复用的商品推荐组件，可嵌入首页、PDP 底栏、购物车凑单、搜索无结果、店铺 Home Tab 等宿主页面。召回逻辑与 App 一致（见 OQ7）。展示顺序为 **随机排序**（`displayMode=recommended`），与列表 Sort By 的 `recommend`（平台序→商家序→更改时间）**严格区分**。无推荐数据时可隐藏整个区块。

**嵌入场景**

| scene | 宿主 | 典型标题 | View More |
|-------|------|---------|-----------|
| `home` | 首页核心展示区 #6 | 可运营配置 | 是（BR825，每次 10 行） |
| `pdp` | 商品详情 #16 底栏 | You May Like 等 | 否 |
| `cart` | 购物车 #23 | 凑单推荐 | 否 |
| `search_empty` | 搜索无结果 #9 | 可配置 | 否 |
| `store` | 店铺 Home Tab #19 | 可配置 | 是（BR825） |
| `topic` | 专题等 | 可配置 | 按宿主页 |

商品卡样式与交互同 **BR120**；全站商品列表统一复用本章「通用商品卡字段」。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
|------|----------------|----------------|---------|
| FL058 | 推荐组件嵌入 | Recommendation Widget Embed | 嵌入首页/PDP/购物车/搜索无结果/店铺等 |
| FL059 | 推荐布局适配 | Recommendation Layout | PC 网格；Mobile 横滑 |
| FL060 | 推荐商品跳转 | Recommendation Navigation | 点击卡片跳转 PDP |
| FL138 | View More 加载 | View More Pagination | 支持 View More 的场景每次加载 10 行（BR825） |

#### 业务规则

1. 模块命名统一为 **Recommended**（非 Sort By 的 Recommend）。  
2. 标题可运营配置（如 You May Like），支持 i18n。  
3. **展示排序**：固定 `displayMode=recommended`，前端对召回列表 **随机排序** 展示，与 App Recommended 模块一致。  
4. 无推荐数据时可隐藏整个区块；空态文案按宿主场景配置（如首页「去分类逛逛」）。  
5. 商品卡样式与交互同 BR120；属于专题的商品展示 `topicTag`（见 §4.11）。  
6. **View More**：`home` / `store` 等支持分页的场景，首屏若干行，每次 **10 行**，刷新重置（BR825）；与 Sort By 无关。  
7. **布局**：PC 默认网格；Mobile 可横滑（BR419）。

#### 字段定义

**组件配置**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| widgetTitle | 组件标题 | Widget Title | string | 是 | 推荐区标题，如「You May Like」，支持 i18n |
| layoutType | 布局类型 | Layout Type | enum | 是 | `grid` 网格 / `carousel` 横滑 |
| displayMode | 展示模式 | Display Mode | enum | 是 | 固定 `recommended`：随机展示 |
| scene | 推荐场景 | Scene | enum | 是 | `home` / `pdp` / `cart` / `search_empty` / `store` / `topic` |
| feedPageSize | 每次加载行数 | Feed Page Size | number | 否 | View More 场景固定 **10** |
| feedLoadedRows | 已加载行数 | Loaded Rows | number | 否 | 当前已展示行数；刷新重置 |
| viewMoreVisible | View More 可见 | View More Visible | boolean | 否 | 是否还有更多可加载 |
| productIds[] | Recommended 商品 | Recommended Products | array | 是 | 召回 ID 列表；前端按 `recommended` 随机顺序展示 |

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

#### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR418 | 组件嵌入（基准） | 宿主加载 | 统一卡片样式；`recommended` 随机顺序 | 加载● 空○ 错误○ | 标题可配置 |
| BR419 | 布局适配 | 按屏宽 | PC 网格/Mobile 横滑 | — | 风格一致 |
| BR420 | 推荐跳转 | 点击卡片 | 跳转 PDP | — | 不改变历史栈 |
| BR119 | 首页推荐 View More | scene=home 点击 View More | 同 BR208 列表；每次 10 行；刷新重置 | 加载● | 空态 CTA |

---

"""
text = text.replace("### 4.5 模块 A：首页（#6–#7）", NEW_44 + "### 4.5 模块 A：首页（#6–#7）")

# --- cross-ref updates ---
xref = [
    ("§4.7.3", "§4.4"),
    ("§4.4.2", "§4.5.2"),
    ("详见 §4.5）", "详见 §4.6）"),
    ("§4.6 **分类抽屉**", "§4.7 **分类抽屉**"),
    ("§4.9.1", "§4.10.1"),
    ("§4.9.2", "§4.10.2"),
    ("§4.9.0", "§4.10.0"),
    ("见 §4.10）", "见 §4.11）"),
    ("见 §4.10。", "见 §4.11。"),
    ("同 §4.10）", "同 §4.11）"),
    ("结构见 §4.7.2", "结构见 §4.8.2"),
    ("§4.1–§4.9 对齐", "§4.1–§4.10 对齐"),
]
for old, new in xref:
    text = text.replace(old, new)

# --- §1.3: add Recommended row ---
text = text.replace(
    "| 商品 | 商品详情（PDP 内选 SKU 直接加购）、规格选择器（**仅 Buy Now**）、推荐组件 |",
    "| 商品 | 商品详情（PDP 内选 SKU 直接加购）、规格选择器（**仅 Buy Now**） |\n"
    "| Recommended | 全站推荐组件（#18），随机展示；见 §4.4 |",
)
text = text.replace(
    "| 交易 | 加购成功气泡、购物车/结算/结果页；运费档位 Standard/Air Express/Air Priority；地址手动添加；**优惠券本期不做**；**#22 购物车预览本期不做** |",
    "| 交易 | 加购成功气泡、购物车/结算/结果页；购物车 Summary 仅 Subtotal/Promotion/Grand Total；结算页运费档位 Standard/Air Express/Air Priority；地址手动添加；**优惠券本期不做**；**#22 购物车预览本期不做** |",
)

# --- homepage: simplify Recommended ---
text = text.replace(
    "4. **商品推荐流**：商品网格 + **View More** 按钮；首屏展示若干行，每次点击 View More **再加载 10 行**；**刷新页面后重新从首屏展示**；商品顺序与 App 一致，按商品 **update 时间倒序**。",
    "4. **Recommended 推荐流**：嵌入 §4.4 Recommended 组件（`scene=home`）；首屏若干行 + View More 每次 **10 行**；刷新重置；**随机排序**（`recommended`）。",
)
text = text.replace(
    "| FL019 | 商品推荐流 | Product Feed | 推荐网格 + View More 分页加载 |\n",
    "",
)
text = text.replace(
    "3. **Recommended 推荐流**：首屏默认展示若干行；View More 每次 **10 行**；刷新重置；展示顺序为 **随机排序**（`recommended`），与 App **Recommended** 模块一致（**非** Sort By 的 `recommend`）。  \n",
    "3. **Recommended 推荐流**：嵌入 §4.4 组件（`scene=home`）；规则与交互见 §4.4、BR119、BR825。  \n",
)
text = text.replace(
    "6. **空态**：推荐流为空时展示「去分类逛逛」CTA。  \n",
    "6. **空态**：Recommended 无数据时按 §4.4 规则隐藏或展示「去分类逛逛」CTA。  \n",
)

# remove homepage 商品推荐流 fields block
text = re.sub(
    r"\*\*商品推荐流\*\*\n\n\| 字段名.*?\| viewMoreVisible.*?\n\n",
    "",
    text,
    count=1,
    flags=re.DOTALL,
)
text = text.replace(
    "> 商品推荐流字段复用 **§4.4 通用商品卡字段**；`supportEntryUrl` 见 **§4.1**。",
    "> 首页 Recommended 字段与交互见 **§4.4**；`supportEntryUrl` 见 **§4.1**。",
)
text = text.replace(
    "| BR119 | 推荐流 View More | 点击 View More | 列表**同 BR208**；每次加载 10 行；刷新重置 | 加载● | 空态 CTA |\n",
    "",
)

# --- PDP / store references ---
text = text.replace(
    "| **底侧** | Recommended 推荐区；顺序与逻辑**同 App 端** |",
    "| **底侧** | Recommended 推荐区（§4.4，`scene=pdp`） |",
)
text = text.replace(
    "| FL049 | 底部 Recommended | Recommended Widget | 底侧 Recommend，逻辑同 App |",
    "| FL049 | 底部 Recommended | Recommended Widget | 底侧嵌入 §4.4，`scene=pdp` |",
)
text = text.replace(
    "| BR408 | 底侧 Recommended | 页面底部 | Recommended 组件；`recommended` 随机展示 | — | 非 Sort By |",
    "| BR408 | 底侧 Recommended | 页面底部 | 嵌入 §4.4；`scene=pdp` | — | 同 BR418 |",
)
text = text.replace(
    "- **Recommended + View More**：推荐商品区，支持 View More 加载（同 BR825）。",
    "- **Recommended + View More**：嵌入 §4.4（`scene=store`），支持 View More（BR825）。",
)

# --- cart Order Summary ---
text = text.replace(
    "购物车页展示有效商品与失效商品分区。失效商品不可勾选、置底灰色展示。每行展示**活动专区 Tag**（若有 `topicTag`）。支持单行 **Remove** 删除；编辑模式支持批量删除（二次确认）。**Order Summary** 字段与结算页一致：Subtotal、Promotion、Shipping Fee（按运费档位）、COD、Payable（见 §4.10.2）；**本期不含 Coupon**。",
    "购物车页展示有效商品与失效商品分区。失效商品不可勾选、置底灰色展示。每行展示**活动专区 Tag**（若有 `topicTag`）。支持单行 **Remove** 删除；编辑模式支持批量删除（二次确认）。**Order Summary**（#25）仅展示 **Subtotal**、**Promotion**、**Grand Total** 三项；**不含** Shipping Fee、COD、Coupon（运费与 COD 在结算页 §4.10.2 计算）。",
)
text = text.replace(
    "7. **Order Summary**：Subtotal / Promotion / Shipping（按档位）/ Payable 计算规则**同结算页** §4.10.2；**不含 Coupon**。  \n",
    "7. **Order Summary**：**Subtotal**（已勾选商品原价小计）+ **Promotion**（促销抵扣）= **Grand Total**（去结算展示金额）；勾选/改量实时重算；**不含** Shipping Fee、COD、Coupon。  \n",
)
text = text.replace(
    "11. **去结算**：须通过 Order Summary Checkout 按钮进入 Step 2，不可点击步骤条 Step 2/3。\n12. **运费档位**：购物车 Order Summary 运费计算与 App 一致，按商品/订单适用的 **Standard / Air Express / Air Priority** 档位汇总展示（非仅 Local 固定价）；改量后实时重算。\n",
    "11. **去结算**：须通过 Order Summary Checkout 按钮进入 Step 2，不可点击步骤条 Step 2/3；展示金额为 **Grand Total**。\n",
)

text = text.replace(
    """**购物车汇总**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| totalQuantity | 商品总件数 | Total Quantity | number | 是 | 已勾选商品总件数，用于角标 |
| merchandiseTotal | 商品总额 | Merchandise Total | number | 是 | 已勾选商品金额合计 |
| discountTotal | 优惠总额 | Discount Total | number | 是 | 已优惠金额合计 |
| payableTotal | 应付总额 | Payable Total | number | 是 | 去结算展示金额 |""",
    """**购物车 Order Summary（#25）**

| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |
|--------|---------|---------|------|------|---------|
| totalQuantity | 商品总件数 | Total Quantity | number | 是 | 已勾选商品总件数，用于角标 |
| subtotal | 商品原价小计 | Subtotal | number | 是 | 已勾选商品原价合计；hover 提示 VAT 已含 |
| promotion | 促销优惠 | Promotion | number | 是 | 促销抵扣（现价小计 − 原价小计） |
| grandTotal | 合计总额 | Grand Total | number | 是 | Subtotal + Promotion；Checkout 按钮展示金额 |""",
)

text = text.replace(
    "| #25 Order Summary | BR617–BR618 | 金额同结算 §4.10.2 |",
    """| #25 Order Summary | BR617–BR618 | Subtotal/Promotion/Grand Total |

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
|------|---------|---------|---------|------|---------|
| BR617 | 购物车金额汇总 | 勾选/改量 | 实时计算 Subtotal + Promotion = Grand Total | — | 不含运费/COD |
| BR618 | 去结算 | 点击 Checkout | 以 Grand Total 进入结算；运费/COD 在 §4.10.2 计算 | 未登录● | 门禁 BR619 |""",
)

# --- checkout: cart shipping only on checkout ---
text = text.replace(
    "4. 购物车与结算页 Order Summary 均展示按档位计算的 **Shipping Fee**；切换地址或商品可能影响运费，实时重算。",
    "4. **仅结算页** Order Summary 展示按档位计算的 **Shipping Fee**；购物车不含运费；切换地址或商品可能影响运费，实时重算。",
)

# --- §7.1 acceptance ---
text = text.replace(
    "- [ ] 购物车/结算运费按 Standard / Air Express / Air Priority 计算，非 Local 固定价\n",
    "- [ ] 购物车 Order Summary 仅 Subtotal/Promotion/Grand Total；结算页运费按 Standard/Air Express/Air Priority 计算\n",
)

# --- appendix ---
text = text.replace(
    "| 推荐组件 | #18 | FL058–FL060 |\n",
    "| Recommended 推荐组件 | #18 | FL058–FL060、FL138 |\n",
)
text = text.replace(
    "| 商品 | BR401–BR420、BR830–**BR831**、BR121 | BR120、BR409、BR418–BR420、BR619 |\n",
    "| 商品 | BR401–BR417、BR830–**BR831**、BR121 | BR120、BR409、BR619 |\n"
    "| Recommended | BR418–BR420、BR119、BR825 | BR120、BR208 |\n",
)
text = text.replace(
    "| 16–18 | 商品 | FL042–FL052、FL058–FL060 | BR401–BR420、BR830、BR121 |",
    "| 16–17 | 商品 | FL042–FL052 | BR401–BR417、BR830、BR121 |\n"
    "| 18 | Recommended | FL058–FL060、FL138 | BR418–BR420、BR119、BR825 |",
)

text = text.replace(
    "*文档结束 — KickBazar ToC Web PRD v1.14*",
    "*文档结束 — KickBazar ToC Web PRD v1.15*",
)

PATH.write_text(text, encoding="utf-8")
print("v1.15 upgrade done")
