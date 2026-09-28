# Seller 后台 2C 店铺 — 选品中心（Product Sourcing）PRD

> **评审定稿**：v1.0（2026/09/07）  
> **线上 PRD 版本**：**v1.0.1**（v1.0 定稿后修订；能力边界与本文一致）。  
> **后续迭代**：下单链路升级见 **`seller-2c-product-sourcing-prd-v2.0.0.md`**（相对 v1.0.1）。  
> **说明**：本文档为飞书终稿归档；历史草稿见 `seller-2c-product-sourcing-prd-v1.md`。

## 一、文档信息

| 时间 | 版本号 | 变更人 | 主要变更内容 |
|------|--------|--------|--------------|
| 2026/08/31 | v1.0 | — | 首版 |
| 2026/09/07 | v1.0 | — | 固定 2B 达卡仓库地址；无需选择发货方式；增加 Payment Method；支付联络方式（不直接提供 2B 收款账户）；取消订单流程优化 |

## 二、项目概述

### 2.1 项目背景

KickBazar 采用 **2B 货源 + 2C 零售**：2C 商家选品、银行转账、铺货上架。移动端 App 已覆盖核心能力；需在 **Seller Web（2C）** 新增 **Product Sourcing**，补齐 PC 选品与采购闭环。2B Web 确认收款、发货后，2C 可 **Publish to Store**。

### 2.2 核心目标

1. Web 选品：单一 2B 货源、列表搜索、橱窗详情、立即购买。  
2. 单笔闭环：Buy Now → Checkout → Order & Pay → Order Success（**无购物车**）。  
3. 采购订单独立：**Purchase Orders List** 与 **Orders List** 分离。  
4. 铺货 **SPU**、采购 **SKU**；支付与联络对齐 App（**人工客服 + 邮箱**，非平台代收）。

### 2.3 项目范围（要点）

- **本期不做**：购物车、多 2B 混合、阶梯价、待转账超时自动取消、转账凭证上传（5.7）、Success 页展示 2B 银行账户。  
- **Checkout**：固定达卡仓库地址；**无 Shipping Method**；Bank Transfer / Digital Transfer；Grand Total ≈ Subtotal。  
- **Success**：Contact Information（Phone + Email）；联系销售确认支付方式。  
- **取消**：仅 **Pending Payment**；Modal + payment@kickbazar.com。

## 三、信息架构（English）

| 中文 | English |
|------|---------|
| 选品中心 | Product Sourcing |
| 选品浏览 | Product Discovery |
| 采购订单 | Purchase Orders List |
| 消费者订单 | Orders List |

## 四、核心流程（摘要）

```
Product Discovery → Product Detail（新页签）→ Buy Now → Checkout → Order & Pay
→ Order Success（Contact Information）→ 线下联系客服付款
→ Purchase Orders List / Detail → 2B 确认收款 → Publish to Store
```

## 五、功能要点（与 v1.0 终稿对齐）

### 5.1 Product Discovery

- SPU 卡片；Tab：**All / Published / Unpublished**（SPU 铺货状态）。  
- 搜索：商品名称（模糊）/ SKU ID（精确）下拉。  
- 每页 20 条；默认不可在列表下单。

### 5.2 Buy Now → Checkout

- Checkout **数量只读**；**无 Shipping Method**。  
- **Shipping Address**（固定，不可改）：  
  - XiaoLong · 01794 133553  
  - B01 Happy Street, Baitul Mukarram Stadium, Dhaka - South, Dhaka  
- **Remark** Modal（200 characters）。  
- **Payment Method**：Bank Transfer（默认）/ Digital Transfer。  
- **Order Summary**：仅展示 **Grand Total**（Subtotal 不展示；运费/COD 本期为 0）。  
- **Security Reminder**：4 模块 × 3 短句（见下表）。

| 主题 | Title | 三条英文 |
|------|-------|----------|
| 尽快发货 | Fast Fulfillment | processed after submission / shipment after payment confirmed / ship promptly |
| 支付安全 | Secure Your Payment | bank transfer **and digital transfer** / details via KickBazar support / never unofficial accounts |
| 隐私 | Security & Privacy | never sells shop data / confidential / industry-standard safeguards |
| 客服 | Customer Support | questions about order or payment / **payment assistance** by email / payment@kickbazar.com |

### 5.3 Order Success

- 标题：**Order placed successfully!**  
- 副文案：联系销售确认支付方式并付款；尽快付款。  
- **Contact Information**：Phone 01794 133553、Email payment@kickbazar.com（可复制）。  
- 按钮：**View Order Detail**、**Continue Sourcing**。  
- **无** Payment Details（2B 账户）、**无** Upload Proof、**无** 推荐区（本期）。

### 5.4 Purchase Orders

- List Tab：**SKU** 铺货状态 All / Published / Unpublished。  
- **Pending Payment**：Warning + Tooltip（联系销售付款，邮箱 payment@kickbazar.com）。  
- Detail：固定达卡地址；Payment Method 展示；Pending Payment 下 Warning。  
- **Cancel Order**：仅 Pending Payment；Modal 文案 + **Confirm Cancel**；Toast：Order cancelled successfully.

### 5.5 Publish to Store

- 依赖 2B 确认收款；**Partially** 拼写统一为 **Partially Published**（商品侧历史笔误修正）。  
- 成功后 Discovery / Detail SPU 状态更新。

### 5.6 引流（5.8）

- Seller 商品列表 **Source Products** → **新页签** 打开 Product Sourcing。

## 六、非功能与扩展

- 性能、安全、英文界面、可用性见终稿第七、八章。  
- 下期：推荐、购物车、邮件通知、划线价等。

## 七、原型与仓库对照

- HTML 原型：`docs/prototype/product-sourcing/`（随 v1.0 终稿迭代）  
- Axure：https://gfrjoq.axshare.com/?g=4  

---

*归档日期：2026/09/28*
