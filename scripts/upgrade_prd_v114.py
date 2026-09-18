#!/usr/bin/env python3
"""Upgrade KickBazar ToC Web PRD v1.13 -> v1.14 per leadership review."""

from pathlib import Path

PATH = Path(__file__).resolve().parents[1] / "docs" / "kickbazar-toc-web-prd-v1.0.md"
text = PATH.read_text(encoding="utf-8")

# --- version header ---
text = text.replace("| **文档版本** | v1.13 |", "| **文档版本** | v1.14 |")
text = text.replace("| **最后更新** | 2026-09-16 |", "| **最后更新** | 2026-09-18 |")
v114 = (
    "| v1.14 | 2026-09-18 | 产品经理 | "
    "**领导评审修订**：Sort By 去 A-Z、对齐 App 六档排序；Recommend 模块统一称 **Recommended**（随机展示）；"
    "运费按 Standard/Air Express/Air Priority 与 App 一致；结算地址改手动添加+双列 Change；优惠券本期不做；"
    "COD 展示划线原价；结果页增加查看订单详情；新增全站右侧 Sticky 快捷导航与回顶部 |\n"
)
text = text.replace(
    "| 版本 | 日期 | 作者 | 变更说明 |\n|------|------|------|---------|\n",
    "| 版本 | 日期 | 作者 | 变更说明 |\n|------|------|------|---------|\n" + v114,
)

# --- §1.3 scope ---
text = text.replace(
    "| 交易 | 加购成功气泡（BR832）、购物车页/编辑/Order Summary（同结算）、结算、结果页、地址弹框；**#22 购物车预览本期不做** |",
    "| 交易 | 加购成功气泡、购物车/结算/结果页；运费档位 Standard/Air Express/Air Priority；地址手动添加；**优惠券本期不做**；**#22 购物车预览本期不做** |",
)
text = text.replace(
    "| 全局 | 保障提示条（全站）+ Header **主栏**（Logo/搜索/语言·客服·购物车·账户 Icon）+ **次栏**（Categories + 一级分类）；Footer |",
    "| 全局 | 保障提示条 + Header 主/次栏 + Footer + **右侧 Sticky 快捷导航**（Home/客服/Cart）+ **回顶部** |",
)

# --- §3.4 ---
text = text.replace(
    "| 登录后 redirect 回 checkout | 若仍无地址，触发 BR620a |\n",
    "| 登录后 redirect 回 checkout | 无地址时展示空态 + Add New Address；不自动弹窗 |\n",
)

# --- Sort: FL034, rules, enum, BR211 ---
text = text.replace(
    "| FL034 | 结果排序 | Result Sort | Recommend/New Arrival/A-Z/价格 |",
    "| FL034 | 结果排序 | Result Sort | Recommend / New Arrival / Price / Sales（无 A-Z） |",
)
text = text.replace(
    "3. **结果排序**：默认 **Recommend**（`sort=recommend`）；逻辑见 sort 枚举表。",
    "3. **结果排序**：默认 **Recommend**（`sort=recommend`）；搜索/分类/店铺 Items Tab 全站复用（BR211–BR213）；**不含** A-Z / Z-A。",
)

old_enum = """**sort 排序枚举**

| 枚举值 | 中文名称 | 英文名称 | 字段说明 |
|--------|---------|---------|---------|
| recommend | 推荐排序 | Recommend | **默认**；销量从高到低；销量相同则 Product Name A→Z |
| new_arrival | 上新 | New Arrival | 按商品 update 时间倒序 |
| name_asc | 名称 A-Z | From A-Z | 按 Product Name 字母升序 |
| price_asc | 价格升序 | Price Low to High | 价格从低到高 |
| price_desc | 价格降序 | Price High to Low | 价格从高到低 |"""

new_enum = """**sort 排序枚举（Sort By，全站复用）**

| 枚举值 | 中文名称 | 英文名称 | 字段说明 |
|--------|---------|---------|---------|
| recommend | 推荐排序 | Recommend | **默认**。一级平台序 → 二级商家序 → 三级商品更改时间（`update`）倒序；与 App 一致 |
| new_arrival | 上新 | New Arrival | 按商品更改时间倒序 |
| price_asc | 价格从低到高 | Price Low to High | 按售价升序 |
| price_desc | 价格从高到低 | Price High to Low | 按售价降序 |
| sales_desc | 销量从高到低 | Sales High to Low | 按销量降序 |
| sales_asc | 销量从低到高 | Sales Low to Low | 按销量升序 |

> **本期不做**：`name_asc` / `name_desc`（A-Z / Z-A）。"""

text = text.replace(old_enum, new_enum)

text = text.replace(
    "| BR211 | 排序（基准） | 点击排序 | 下拉刷新列表；默认 Recommend | 加载● | 五档排序 |",
    "| BR211 | 排序（基准） | 点击 Sort By | 6 档：Recommend/New Arrival/Price↑↓/销量↑↓；默认 Recommend | 加载● | 无 A-Z |",
)

# --- Recommended module (was recommend random) ---
text = text.replace(
    "3. **推荐流**：首屏默认展示若干行；点击 **View More** 每次追加 **10 行**；**页面刷新后重置**为首屏状态；排序按商品 `updatedAt` **倒序**，与 App 一致。",
    "3. **Recommended 推荐流**：首屏默认展示若干行；View More 每次 **10 行**；刷新重置；展示顺序为 **随机排序**（`recommended`），与 App **Recommended** 模块一致（**非** Sort By 的 `recommend`）。",
)
text = text.replace(
    "| updatedAt | 商品更新时间 | Updated At | datetime | 是 | 推荐排序字段，倒序 |",
    "| displayMode | 展示模式 | Display Mode | enum | 是 | 固定 `recommended`：随机展示，与 App Recommended 模块一致 |",
)
text = text.replace(
    "可嵌入多页面的复用组件，由运营配置标题与召回逻辑（算法同 App，见 OQ7）。无数据时可隐藏区块。",
    "可嵌入多页面的 **Recommended** 复用组件（首页流、PDP 底栏、购物车凑单、搜索无结果等），召回逻辑同 App（见 OQ7）。展示顺序为 **随机排序**（`recommended`），与 App **Recommended** 模块一致；**区别于**列表 Sort By 的 `recommend`。无数据时可隐藏。",
)
text = text.replace(
    "1. 标题可运营配置（如 You May Like），支持 i18n。  \n2. 无推荐数据时可隐藏整个区块。  \n3. 商品卡样式与交互同 BR120。",
    "1. 模块命名统一为 **Recommended**（非 Sort By 的 Recommend）。  \n2. 标题可运营配置（如 You May Like），支持 i18n。  \n3. 无推荐数据时可隐藏整个区块。  \n4. 商品卡样式与交互同 BR120。  \n5. **展示排序**：`recommended` 随机顺序，与 App 一致。",
)
text = text.replace(
    "| productIds[] | 推荐商品 | Recommended Products | array | 是 | 推荐商品 ID 列表，按展示顺序 |",
    "| productIds[] | Recommended 商品 | Recommended Products | array | 是 | 召回 ID 列表；前端按 `recommended` 随机顺序展示 |",
)
text = text.replace("| **底侧** | Recommend 推荐区", "| **底侧** | Recommended 推荐区")
text = text.replace("| FL049 | 底部推荐 | Recommendations |", "| FL049 | 底部 Recommended | Recommended Widget |")
text = text.replace(
    "| BR408 | 底侧推荐 | 页面底部 | Recommend；顺序逻辑同 App | — | — |",
    "| BR408 | 底侧 Recommended | 页面底部 | Recommended 组件；`recommended` 随机展示 | — | 非 Sort By |",
)
text = text.replace("Recommend + View More", "Recommended + View More")
text = text.replace("| FL066 | 店铺 Recommend | Store Recommend |", "| FL066 | 店铺 Recommended | Store Recommended |")

# --- Cart / checkout: remove coupon, shipping tiers ---
text = text.replace(
    "**Order Summary** 字段与结算页完全一致：Subtotal、Promotion、Coupon、Shipping Fee、COD Handling Fee、Payable（见 §4.9.2 规则 12–13）。",
    "**Order Summary** 字段与结算页一致：Subtotal、Promotion、Shipping Fee（按运费档位）、COD、Payable（见 §4.9.2）；**本期不含 Coupon**。",
)
text = text.replace(
    "7. **Order Summary**：Subtotal / Promotion / Coupon / Shipping / COD Fee / Payable 计算规则**同结算页** §4.9.2。",
    "7. **Order Summary**：Subtotal / Promotion / Shipping（按档位）/ Payable 计算规则**同结算页** §4.9.2；**不含 Coupon**。",
)

# Cart shipping - add rule about delivery tiers
cart_ship_rule = (
    "12. **运费档位**：购物车 Order Summary 运费计算与 App 一致，按商品/订单适用的 "
    "**Standard / Air Express / Air Priority** 档位汇总展示（非仅 Local 固定价）。\n"
)
text = text.replace(
    "11. **去结算**：须通过 Order Summary Checkout 按钮进入 Step 2，不可点击步骤条 Step 2/3。",
    cart_ship_rule + "11. **去结算**：须通过 Order Summary Checkout 按钮进入 Step 2，不可点击步骤条 Step 2/3。",
)

# Checkout function description
text = text.replace(
    "**右侧 Sticky**：Coupon & Code、Order Summary、安全提示。\n\n流程：填写/选择地址 → 确认商品与备注 → 选择优惠券 → 确认金额 → 提交订单 → 跳转结果页。",
    "**右侧 Sticky**：Order Summary、安全提示（**本期无 Coupon 入口**）。\n\n流程：选择/添加地址 → 选择运费档位 → 确认商品与备注 → 确认金额 → 提交订单 → 跳转结果页。",
)

# Address rules - full replace block
old_addr = """**地址规则**

1. 首次进入结算页且 `addressId` 为空：自动弹出地址 Modal（**BR620a**）；不可遮罩关闭；Save 或取消返回上一页。  
2. 已有地址：只读地址卡片 + Change / Edit Address（BR621）；不再自动弹首次 Modal。  
3. 结算页**不提供内联可编辑表单**；新增/编辑/切换统一走 Modal（BR620a/b/c、BR621、BR632、BR635、BR638）。  
4. Save 成功后写入地址库，绑定 `addressId`，Order Summary 可继续操作。"""

new_addr = """**地址规则**

1. **不自动弹窗**：首次进入结算页且无 `addressId` 时，Shipping Address 区展示**空态 + Add New Address 按钮**；**不**自动弹出地址 Modal。  
2. **Add New Address**：点击按钮打开新增地址 Modal（BR635）；用户可关闭 Modal（遮罩/关闭按钮/ESC）**留在当前 checkout 页**，不返回上一页。  
3. **已有地址**：展示**只读地址确认卡片**（两列信息布局：左列姓名/电话，右列 Division·District·Area + 详细地址；同历史 ToB 地址确认样式）。提供 **Change Address**（BR632，地址列表 Modal **双列**卡片可选）与 **Edit Address**（BR638）。  
4. **下单门禁**：无 `addressId` 时点击 Place Order → Toast 提示 + 不提交（BR620c）；可再次点击 Add New Address。  
5. Save 成功后写入地址库，绑定 `addressId`，Order Summary 可继续操作。"""

text = text.replace(old_addr, new_addr)

# Shipping - replace fixed local
old_ship = """**发货方式**

3. 本期仅支持**本地发货**；发货方式固定为 **Local Delivery**，运费固定 **৳60**。  

**支付方式**

4. 本期仅支持 **Cash on Delivery（COD）** 一种支付方式。"""

new_ship = """**发货方式 / 运费档位（与 App 一致）**

3. 运费计算与 App 一致，按商品/订单适用档位汇总，不限于单一 Local 固定价。支持档位：  
   - **Standard**（标准）  
   - **Air Express**（空运快线）  
   - **Air Priority**（空运优先）  
4. 购物车与结算页 Order Summary 均展示按档位计算的 **Shipping Fee**；切换地址或商品可能影响运费，实时重算。

**支付方式**

5. 本期仅支持 **Cash on Delivery（COD）**。"""

text = text.replace(old_ship, new_ship)

# Remove coupon section, update order summary
old_coupon_block = """**订单备注**

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
17. **结果页**：成功态提供 **View Order List** 按钮，跳转订单列表（`ordersUrl`，他人 PRD）。"""

new_coupon_block = """**订单备注**

6. 订单内可按**不同商户（Seller）**分别填写 **Remark** 备注。  

**优惠券**

> **本期不做**：结算页/购物车 **不提供 Coupon & Code 入口**；Order Summary **不展示 Coupon 行**；提交不传 `couponId`（优惠券能力见 P1 / 他人 PRD）。

**Order Summary**

7. 金额构成：**Subtotal**（hover「VAT 包含在内」）+ **Promotion** + **Shipping Fee**（按 Standard/Air Express/Air Priority 档位计算）+ **COD** 实付区。  
8. **Subtotal** = 商品原价小计；**Promotion** = 现价小计 − 原价小计。  
9. **COD 价格展示**：支付方式区与 Order Summary 须同时展示 **现价（实付）** 与 **原价（划线）**（有折扣时）；与 App 一致。

**提交与结果**

10. **门禁**：未登录跳转 `/login?redirect={checkoutUrl}`。  
11. **提交**：Loading 防重复；校验库存/价格/地址/运费；全站蒙版。  
12. **成功**：跳转 Order Complete 结果页。  
13. **结果页（Order Complete）**：成功态展示订单号、实付金额；提供 **View Order Details** 按钮跳转订单详情（`orderDetailUrl`，他人 PRD #32）；另提供 **Continue Shopping** 回首页。"""

text = text.replace(old_coupon_block, new_coupon_block)

# Fields: delivery, remove coupon fields, order summary, submit, result
text = text.replace(
    "**发货与支付（本期固定）**\n\n| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |\n|--------|---------|---------|------|------|---------|\n| deliveryMethod | 发货方式 | Delivery Method | string | 是 | 固定 `Local Delivery` |\n| shippingFee | 运费 | Shipping Fee | number | 是 | 固定 **60** BDT |\n| paymentMethod | 支付方式 | Payment Method | string | 是 | 固定 `Cash on Delivery` |\n| codHandlingFee | COD 手续费 | COD Handling Fee | number | 是 | 本期固定 **0**（免费） |",
    "**发货与支付**\n\n| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |\n|--------|---------|---------|------|------|---------|\n| shippingTier | 运费档位 | Shipping Tier | enum | 是 | `standard` / `air_express` / `air_priority`；计算规则同 App |\n| shippingFee | 运费 | Shipping Fee | number | 是 | 按档位与商品规则计算，BDT |\n| paymentMethod | 支付方式 | Payment Method | string | 是 | 固定 `Cash on Delivery` |\n| codPayableAmount | COD 实付 | COD Payable Amount | number | 是 | 货到付款实付金额 |\n| codOriginalAmount | COD 原价 | COD Original Amount | number | 否 | 有折扣时展示并划线 |",
)

text = text.replace(
    "**优惠券**\n\n| 字段名 | 中文名称 | 英文名称 | 类型 | 必填 | 字段说明 |\n|--------|---------|---------|------|------|---------|\n| couponCode | 优惠券码 | Coupon Code | string | 否 | 用户输入的 Coupon Code |\n| couponId | 已选优惠券 ID | Selected Coupon ID | string | 否 | Confirm 后回传；单选 |\n| couponAmount | 优惠券抵扣 | Coupon Amount | number | 否 | 抵扣金额，BDT |\n| couponStatus | 券可用状态 | Coupon Status | enum | 是 | `available` / `unavailable` |\n| unavailableReason | 不可用原因 | Unavailable Reason | enum | 否 | `min_spend` 未达门槛 / `not_applicable` 不适用商品 |\n\n**Order Summary**",
    "**Order Summary**",
)

text = text.replace(
    "| coupon | 优惠券抵扣 | Coupon Discount | number | 是 | 优惠券抵扣金额 |\n| shippingFee | 运费 | Shipping Fee | number | 是 | 固定 60 |\n| codHandlingFee | COD 手续费 | COD Handling Fee | number | 是 | 本期 0 |",
    "| shippingFee | 运费 | Shipping Fee | number | 是 | 按档位计算 |\n| codPayableAmount | COD 实付 | COD Payable | number | 是 | 实付金额 |\n| codOriginalAmount | COD 原价 | COD Original | number | 否 | 划线原价 |",
)

text = text.replace(
    "| couponId | 优惠券 ID | Coupon ID | string | 否 | 单选优惠券；可为空 |\n| orderRemarks[] |",
    "| orderRemarks[] |",
)

text = text.replace(
    "| ordersListUrl | 订单列表地址 | Orders List URL | string | 是 | View Order List 跳转地址 |",
    "| orderDetailUrl | 订单详情地址 | Order Detail URL | string | 是 | View Order Details 跳转地址（他人 PRD） |\n| ordersListUrl | 订单列表地址 | Orders List URL | string | 否 | 可选次要入口 |",
)

# BR table checkout
text = text.replace(
    "| BR622 | 本地配送 | 结算页 | 固定 Local Delivery；运费 60 | — | 不可切换 |\n",
    "| BR622 | 运费档位 | 结算页 | Standard / Air Express / Air Priority；计算同 App | 加载● | 实时重算 |\n",
)
text = text.replace(
    "| BR623 | COD 支付 | 结算页 | 固定 Cash on Delivery | — | 不可切换 |\n",
    "| BR623 | COD 支付 | 结算页 | COD；展示实付价 + 划线原价（有折扣时） | — | 同 App |\n",
)
text = text.replace("| BR625 | 优惠券抽屉 | 打开 Coupon 区 | Available/Not Available；默认选最大抵扣券 | 加载● 错误● | 单选 |\n", "")
text = text.replace("| BR626 | 优惠券 Confirm | 点击 Confirm | 回传 couponId；重算总价；二次校验 | 错误● | 失败 Toast+刷新 |\n", "")
text = text.replace(
    "| BR628 | 结果页成功 | 下单成功 | 展示成功态 + **View Order List** → `ordersListUrl` | — | 跳转订单列表 |",
    "| BR628 | 结果页成功 | 下单成功 | Order Complete；**View Order Details** → `orderDetailUrl`；Continue Shopping | — | 主 CTA 为订单详情 |",
)
text = text.replace(
    "| BR632 | 地址列表 Modal | Change Address | Modal 展示地址列表（BR201） | — | 可选已有地址 |",
    "| BR632 | 地址列表 Modal | Change Address | 双列地址卡片列表；选中后回填（BR201） | — | 同 ToB 双列样式 |",
)
text = text.replace(
    "| BR620a | 首次地址 Modal | 首次进入 checkout 且无 addressId | 自动弹 Modal；不可 dismiss；字段 Division/District/Area/Address | — | 与 App 一致 |\n| BR620b | 地址展示态 | Save / 选择已有地址 | 结算页只读地址卡片 | — | 字段与 Modal 一致 |\n| BR620c | 下单门禁 | Place Order 且地址为空 | Toast + 再次打开地址 Modal | 错误● | 不可提交 |",
    "| BR620a | 地址空态 | 无 addressId | 展示空态 + **Add New Address** 按钮；不自动弹窗 | — | 停留 checkout |\n| BR620b | 地址确认展示 | 已选地址 | 两列只读卡片：姓名/电话 | 地区+详细地址 | 同 ToB 确认样式 |\n| BR620c | 下单门禁 | Place Order 且无地址 | Toast；不提交；引导 Add New Address | 错误● | 不跳上一页 |\n| BR620d | 关闭地址 Modal | 新增/编辑 Modal 点关闭 | 关闭 Modal；**停留 checkout**；不返回 PDP/购物车 | — | 仅关闭浮层 |",
)

# --- Global sticky rail: insert before 4.11 ---
sticky_section = """
### 4.12 模块 G3：全局 — 右侧 Sticky 快捷导航（#40）

#### 基本信息

| 属性 | 内容 |
|------|------|
| 页面编号 | #40 |
| 类型 | 全站全局组件 |
| 优先级 | P0 |

#### 功能描述

全站（除全屏 Modal 遮挡时）右侧固定 **Sticky 快捷导航条**，与用户翻页后出现的 **回顶部** 按钮为**两个独立小块**：

1. **快捷导航条**（常驻右侧中部偏下）：纵向排列 **Home**、**客服**、**Cart** 三个 Icon 入口；滚动后保持可见（可随 Header 策略微调位置，但不消失）。  
2. **回顶部**（Back to Top）：用户向下滚动超过阈值（建议与 Header BR103 同为 80px）后，在快捷导航条**上方或旁侧**单独展示一小块；点击平滑回顶；回顶后隐藏。

> 与首页 Sticky 客服 FAB（FL133）关系：全站右侧条中的「客服」与 Header/Footer 同源 `supportEntryUrl`（BR806）；首页可同时保留 FL133 或仅保留全站条（以 UI 稿为准，入口目标一致）。

#### 功能清单

| 编号 | 功能名称（中文） | 功能名称（英文） | 功能描述 |
| FL140 | 右侧 Sticky 快捷导航 | Right Sticky Quick Nav | Home / 客服 / Cart 三入口 |
| FL141 | 回顶部 | Back to Top | 滚动后显示独立小块 |

#### 业务规则

1. **Home**：跳转 `/`。  
2. **客服**：跳转 `supportEntryUrl`（同 BR806）。  
3. **Cart**：跳转 `/cart`；角标与 Header BR106 同步。  
4. **回顶部**：滚动超阈值显示；点击回顶；不遮挡主 CTA。  
5. z-index：低于全屏 Modal，高于页面内容。

#### 交互说明

| 编号 | 需求名称 | 触发条件 | 交互行为 | 状态 | 验收标准 |
| BR840 | Sticky 快捷导航 | 全站页面 | 展示 Home/客服/Cart；点击跳转 | — | 三入口可用 |
| BR841 | 回顶部 | 下滚超阈值 | 独立小块显示；点击回顶 | — | 回顶后隐藏 |

---

"""

text = text.replace("### 4.11 全局状态与反馈", sticky_section + "### 4.11 全局状态与反馈")

# --- §6.1 add coupon ---
text = text.replace(
    "| 价格/属性多维 Filter | 颜色、尺码、品牌、价格区间等 | P1 |\n",
    "| 价格/属性多维 Filter | 颜色、尺码、品牌、价格区间等 | P1 |\n| 优惠券 Coupon & Code | 结算页券码/抽屉选券 | P1 |\n",
)

# --- footer version ---
text = text.replace(
    "*文档结束 — KickBazar ToC Web PRD v1.13*",
    "*文档结束 — KickBazar ToC Web PRD v1.14*",
)

# appendix FL for sticky
text = text.replace(
    "| 全局状态 | 跨页面 | FL125–FL131 |",
    "| 右侧 Sticky 导航 | #40 | FL140–FL141 |\n| 全局状态 | 跨页面 | FL125–FL131 |",
)

PATH.write_text(text, encoding="utf-8")
print("v1.14 upgrade done")
