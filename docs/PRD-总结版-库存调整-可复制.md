# WMS 库存模块增量需求（可复制至 PRD 总结版）

## 一、SPU/SKU 库存查看与初始化（对应原型图1、图2）

1. **数据范围**：库存查看支持 **SPU** 与 **SKU** 两个 Tab；SPU 行可展开查看下属 SKU 子表（SKU ID、Specification、Total、Locked、Available、Warehouse、Zone）。
2. **主数据来源**：每个仓库 × 每个库区，系统预置 Admin 端同步的 SKU 主数据（只读）：**SKU ID**、**Specification**、**Product Name**、条码缓存（EAN/UPC/PAN，展示规则不变：欧洲码优先）。
3. **库存初始值**：上述每一库存行初始 **Total = 0**、**Locked = 0**、**Available = 0**（Available 不落库，实时计算 `total - locked`）。
4. **行粒度**：主键为 **SKU ID + Warehouse Code + Zone Code**；同一 SKU 在不同仓/区为独立行。
5. **筛选与列**：与现有 PRD 5.1/5.2 一致；SKU 视图增加 **Operation** 列（见第二节）。

---

## 二、SKU 库存调整（对应原型图1 Operation）

**入口**：Inventory → SPU/SKU Inventory → **SKU Tab** → 行操作 **库存调整**（英文界面：**Inventory Adjustment**）。

**弹窗名称**：库存调整单（**Inventory Adjustment**）

| 字段 | 英文 | 必填 | 说明 |
|------|------|------|------|
| SKU | SKU | 默认 | 只读，当前行 SKU ID |
| 仓库/库区 | Warehouse / Zone | 默认 | 只读，Warehouse Code + Zone Code（及库区类型名） |
| 调前数量 | Qty Before | 默认 | 只读，当前实物库存 Total |
| 调整方向 | Direction | **是** | 单选：**增加** Increase / **减少** Decrease |
| 调整数量 | Adjustment Qty | **是** | 正整数；**减少**时须校验 `Available ≥ 调整数量` |
| 调整类型 | Adjustment Type | **是** | 单选：**盘盈**、**盘亏**、**报溢**、**报损**、**录入纠错（红字纠错）** |
| 原因说明 | Reason | **是** | 文本，最多 **200** 字 |
| 附件 | Attachment | 否 | 选填上传 |

**写账规则**：

| 调整方向 | Total | Locked | Available | 说明 |
|----------|-------|--------|-----------|------|
| 增加 | ↑ | 不变 | ↑ | 与入库类一致 |
| 减少 | ↓ | 不变 | ↓ | 校验可用库存 |

- 库存变更与流水写入 **同一事务**；任一步失败则整单回滚，禁止半截流水或脏库存。
- 成功提示：**Inventory adjusted successfully.**（可提示至 Record → Inbound → Manual 查看）。
- **权限**：管理员、仓库管理员（仓管仅限所属仓库）。

**关联单号**：系统自动生成库存调整单号，格式建议 **ADJ-YYYYMMDDnnn**。

---

## 三、手动调整库存流水（对应原型图3 Record）

1. **模块定位修订**：库存流水为只读展示；**允许通过「库存调整单」产生的手动调整流水**（原 PRD「禁止手工调账」指禁止在流水页直接改账，不禁止经调整单的合规调账）。
2. **Tab 结构**：Inbound、Outbound Occupy、Outbound Deduct、All（**本期不做 Unfreeze Tab**）。
3. **入库流水 · 子筛**：**All / Manual / Purchase / Opening（期初）**；手动调整入库、手动调整减少类记录均在 **Inbound → Manual** 子筛可见（减少类数量展示为负数或带负号）。
4. **手动调整流水类型**：

| 类型（英文） | 类型（中文） | 触发 |
|--------------|--------------|------|
| Manual Adjustment | 人工调整入库 | 调整方向 = 增加 |
| Manual Adjustment (Decrease) | 人工调整出库 | 调整方向 = 减少 |

5. **流水列**：与现有 PRD 一致——时间、仓库、库区、SKU ID、数量、变更后 Total/Locked/Available、类型、关联单号（调整单号）、操作人；入库类 Total、Available 上升用绿色↑标识。
6. **首页 Today's Operations**：类型枚举增加上述两种手动调整类型，口径与 Record 一致。

---

## 四、跨模块契约补充（8.2 写账与流水）

| 事件 | 实物 Total | 锁定 Locked | 未锁定 Available | 流水 Tab |
|------|------------|-------------|------------------|----------|
| 手动调整-增加 | ↑ | — | ↑ | Inbound / Manual |
| 手动调整-减少 | ↓ | — | ↓ | Inbound / Manual |

---

## 五、原型交付说明

- **SKU/SPU 库存页**：`KickBazar-WMS-Inventory.html`（SKU 默认 Tab，含库存调整弹窗）。
- **库存流水页**：`KickBazar-WMS-Inventory-Record.html`（Inbound 含 Manual 子筛，合并展示调整流水）。
- **Dashboard**：快捷入口可跳转上述页面；今日作业可展示当日手动调整记录。
