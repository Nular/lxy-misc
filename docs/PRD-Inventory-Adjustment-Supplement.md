# PRD 补充：库存初始化与手动库存调整

> 本文档为 WMS 库存模块增量需求，需合并入主 PRD 第 5、6、7 章。

## 5 库存查看（补充）

### 5.0 SKU 主数据初始化

- 系统为**每个仓库 × 每个库区**预置 Admin 端同步的 SKU 主数据行。
- 初始化字段来自 Admin/Seller 商品库（只读）：`SKU ID`、`Specification`、`Product Name`、条码缓存（EAN/UPC/PAN）。
- 库存字段初始值：`Total = 0`、`Locked = 0`、`Available = 0`（实时计算，不落库）。
- 同一 SKU 在不同仓库/库区为独立库存行（主键：`SKU ID + Warehouse Code + Zone Code`）。

### 5.2 SKU 视图（补充）

#### 5.2.1 列表列（与原型一致）

| 列 | 说明 |
|---|---|
| SKU ID | |
| Specification | |
| Product Name | 含商品图占位 |
| Total / Locked / Available | 可排序 |
| Warehouse | |
| Zone | Zone Type 展示 |
| Zone Code | |
| Primary Barcode | 悬停展示 EAN/UPC/PAN 全量 |
| PAN | 平台码独立列 |
| Operation | **库存调整** |

#### 5.2.2 库存调整（SKU 行操作）

**入口**：SKU 视图 → Operation →「库存调整」/ Inventory Adjustment

**弹窗标题**：Inventory Adjustment（库存调整单）

| 字段 | 英文 | 必填 | 说明 |
|------|------|------|------|
| SKU | SKU | 默认带出 | 只读 |
| 仓库/库区 | Warehouse / Zone | 默认带出 | 只读，展示 Warehouse Code + Zone Code |
| 调前数量 | Qty Before | 默认带出 | 只读，当前 Total |
| 调整方向 | Direction | 是 | 单选：增加 Increase / 减少 Decrease |
| 调整数量 | Adjustment Qty | 是 | 正整数；减少时校验 `Available >= 调整数量`（占用场景校验 Locked） |
| 调整类型 | Adjustment Type | 是 | 盘盈、盘亏、报溢、报损、录入纠错（红字纠错） |
| 原因说明 | Reason | 是 | 最多 200 字 |
| 附件 | Attachment | 否 | 选填上传 |

**写账规则（手动调整）**：

| 调整方向 | Total | Locked | Available | 流水类型 |
|----------|-------|--------|-----------|----------|
| 增加 | ↑ | — | ↑ | Manual Adjustment Inbound |
| 减少 | ↓ | — | ↓ | Manual Adjustment Outbound |

- 库存变更与流水写入同一事务；失败整单回滚。
- 成功后 Toast：`Inventory adjusted successfully.`
- 自动跳转提示可查看 Record → Inbound → Manual。

**权限**：管理员、仓库管理员（仅限所属仓库）。

---

## 6 库存流水（补充）

### 6.0 Tab 结构（修订）

| Tab | 说明 |
|-----|------|
| Inbound | 含采购入库、期初入库、**手动调整入库** |
| Outbound Occupy | 出库占用 |
| Outbound Deduct | 出库扣减 |
| All | 全部 |

> 本期不做 Unfreeze Tab（与主 PRD 出库模块一致）。

### 6.1 入库流水（补充）

**子筛**：All / Manual / Purchase / Opening（期初）

**手动调整流水类型**：

| 类型英文 | 类型中文 | 来源 |
|----------|----------|------|
| Manual Adjustment | 人工调整入库 | 库存调整单-增加 |
| Manual Adjustment (Decrease) | 人工调整出库 | 库存调整单-减少（展示在 Inbound Tab 的 Manual 子筛，数量为负） |

**关联单号**：库存调整单号 `ADJ-YYYYMMDDnnn`

**变更后列**：展示 Total / Locked / Available；入库类 Total、Available 上升用绿色↑标识。

---

## 7 Home Dashboard（补充）

Today's Operations 类型枚举增加：

- Manual Adjustment（人工调整入库）
- Manual Adjustment Outbound（人工调整出库，数量为负）

与 Record 模块口径一致。

---

## 8 跨模块契约（补充）

| 事件 | 实物 | 锁定 | 未锁定 | 流水 Tab |
|------|------|------|--------|----------|
| 手动调整-增加 | ↑ | — | ↑ | Inbound / Manual |
| 手动调整-减少 | ↓ | — | ↓ | Inbound / Manual |
