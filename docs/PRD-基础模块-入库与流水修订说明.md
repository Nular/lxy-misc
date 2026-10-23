# 基础 PRD 修订说明 — 入库流程与 Inventory Record

> 配套《KickBazar-WMS-Inbound-PRD.md》2026-10 入库流程整理。本文供评审/飞书粘贴；**已合入** `KickBazar-WMS-PRD.md` 的段落以主文档为准。

## 1. 业务背景（线下 → 系统）

| 场景 | 线下（无 WMS） | 系统映射 |
|------|----------------|----------|
| 采购入库 | 填采购单 → 收货核对 → 找位上架 → 未上架商品先 Seller 上架 | **采购单导入**：上传 `采购单文档订单列表.xlsx`，按 **ItemDesc** 匹配仓内 SKU → 填 warehouse / zone / 数量 → 头备注记录异常 |
| 直接入库 | 收货质检 → 已上架则入库，否则先 Seller 上架 | **手动导入**：搜 SKU ID / Product Name → 填 warehouse / zone / 数量 |

每次提交/导入完成生成一条 **Inbound No.**（`IN-{YYYYMMDD}{seq3}`），对应一个入库任务。

## 2. 建议修改 `KickBazar-WMS-PRD.md`（已落地项）

| 章节 | 修改要点 |
|------|----------|
| **§6 共用列** | 明确列表列 **Related Order No.** 的语义因 Tab/类型而异（见 §6.1） |
| **§6.1 入库流水** | **Inbound 类流水**：Related Order No. = **Inbound No.**；详情展示入库单 **Remarks**（采购异常说明等）；Purchase Order No. 为扩展字段 |
| **§7.4 Today's Operations** | **Order No.** 列与 Record 一致：入库类 = Inbound No. |
| **§9 索引** | 入库正文以独立 PRD 为准；强调两种入库类型：**Purchase Order Import** / **Manual Import**（与 Receipt Type 枚举对应） |

## 3. Record 详情字段（入库）

| 区块 | 字段 |
|------|------|
| 通用 | Time, Warehouse, Zone, SKU ID, Qty, After Change, Type, Operator |
| Inbound 扩展 | **Related Order No.** (= Inbound No.), Inbound Type, Purchase Order No.（可选）, **Inbound Remarks**（头备注）, 行级 ItemDesc / Product Name / Spec（来自入库明细） |

## 4. 与出库模块对称性

| 维度 | Outbound | Inbound（本期） |
|------|----------|-----------------|
| 任务号 | Outbound No. | Inbound No. |
| 批量入口 | Import Order（一次导入一个号） | PO 文件导入（一次导入一个号） |
| 手工入口 | — | Manual Import（搜 SKU 加行） |

## 5. 原型跟踪

| 项 | 位置 |
|----|------|
| 入库列表 / 新建 / PO ItemDesc 匹配 | `prototype/js/inbound-po.js`、`prototype/index.html` |
| Record 详情备注 | `prototype/js/app.js` `openRecordDetail` |
