# KickBazar WMS — 出库模块产品需求说明（Outbound）

> **文档性质**：出库模块 **独立 PRD**，与《KickBazar WMS 产品需求说明（仓库与库存）》(`KickBazar-WMS-PRD.md`) 配套。  
> **范围**：出库单导入、分配占用、发货单/运单号、拣货打包发运流程、库存占用与扣减、出库流水联动。  
> **不包含**：仓库/库区主数据（基础 PRD §3–§4）、库存行初始化（§5.0.1）、入库/采购（PO、Inbound 独立 PRD）。

---

## 1 模块目标与依赖

### 1.1 业务目标

1. 将外部订单导入 WMS，按 **当前仓 Storage Zone** 分配库存并占用（**Outbound Occupy**）。
2. 支持拣货、打包、发运作业状态推进；**拣货/打包不改库存**。
3. 快递员取件确认后扣减实物（**Outbound Deduct**），并写 **Record → Outbound** 流水。
4. 缺货行进入 **On Hold**，支持跨批次再分配。

### 1.2 依赖（基础 PRD，强制）

| 依赖 | 说明 |
|------|------|
| **§5.0.2** | 写库存前须存在 `(sku_id, warehouse_code, zone_code)` 库存行 |
| **§8.1** | 推荐/占用/扣减目标为 **Enable** 的 **Storage Zone**；`available ≥ 占用数量` |
| **§8.2** | 占用：`locked↑`、`available↓`；扣减：`locked↓`、`total↓`；打包/发运不写流水 |
| **§2.1** | `warehouse_context`；列表与写账默认当前仓 |

---

## 2 作业闭环

与 Axure《出库》包、交接会议（2026-10-12）对齐。

**流程：** Admin 导出待处理订单 → WMS **Import Order**（校验表头）→ 按当前仓 **Storage Zone** 整行分配 → 有货 **Allocated**（占用库存）/ 缺货 **On Hold** → Allocated **Export Shipping Order**，线下填 Tracking No. 再导入 → 系统按包裹生成 **Shipment No.**，行进入 **Ready to Pick** → 打印拣货单（PDF，可保存或打印）→ Complete Picking → Ready to Pack → Complete Packing → Ready to Ship → 快递员上门取件后 **Confirm Shipment** → Shipped，并扣减实物。

**库存规则摘要：**

- 分配成功 → **Outbound Occupy**（Record Outbound Occupy 子筛）。
- **Confirm Shipment** → **Outbound Deduct**（Record Outbound Deduct 子筛）。
- 拣货、打包、发运状态变更 **不改** total/locked（与基础 PRD §8.2 一致）。

---

## 3 编码规则

| 单据 | 规则 | 示例 |
|------|------|------|
| **Outbound No.** | `OB` + `warehouse_code` + `yyyyMMdd` + 4 位流水；**一次导入一个号** | `OBSH001202608210001` |
| **Shipment No.** | `SHP` + `warehouse_code` + `yyyyMMdd` + 4 位流水；**每个 Tracking No. 一个** | `SHPSH001202608210001` |
| **Tracking No.** | 承运商回传，WMS 不生成 | `SF1029384756` |

`warehouse_code` 为 canonical 5 位（基础 PRD §3.2.1）。

---

## 4 行状态与批次状态

导入后行只有 **Allocated** 或 **On Hold**（没有行级 Pending）。

### 4.1 行状态

| 行状态 | 进入条件 | 库存 |
|--------|----------|------|
| **Allocated** | 存储区 `available` 足够，分配成功 | `locked +N`，`available −N` |
| **Ready to Pick** | Tracking 导入成功 | 不变 |
| **Ready to Pack** | Complete Picking | 不变 |
| **Ready to Ship** | Complete Packing | 不变 |
| **Shipped** | Confirm Shipment（快递员已取件） | `total −N`，`locked −N` |
| **On Hold** | `available` 不足 | 不变 |

### 4.2 批次状态

| 批次状态 | 规则 |
|----------|------|
| **Pending Outbound** | 无 On Hold、无 Shipped |
| **Partially Outbound** | 有 On Hold，或已有部分 Shipped（部分挂起则批次为部分出库） |
| **Fully Outbound** | 全部 Shipped |

---

## 5 拣货单

- 输出：**拣货单 PDF**（可保存或打印）。
- 商品码展示优先级：**EAN → UPC → —**（拣货单不展示 PAN）。
- SKU 主数据规则见基础 PRD **§1.2**。

---

## 6 页面与功能

### 6.1 Outbound Orders（列表）

- **Imported period** + Confirm / Reset。
- **Import Order**（表头校验）。
- 列表列（建议）：Outbound No.、Imported At、Source File、Warehouse、Orders、SKU Count、Total Units、Status、View。

### 6.2 Outbound Detail（详情）

Tab：**All** / **Allocated** / **Ready to Pick** / **Ready to Pack** / **Ready to Ship** / **Shipped** / **On Hold**。

### 6.3 On Hold Orders

- 跨批次 **Re-allocate**；仍使用原仓 **Storage Zone** 推荐规则。

### 6.4 入口与权限

- **侧栏**：Outbound；**Dashboard** Quick Actions → Outbound。
- **角色**：Admin、所属仓仓管；数据范围 **§2.1**。

---

## 7 写账与流水（与基础 PRD §8.2）

| 事件 | 实物 | 锁定 | 未锁定 | Record |
|------|------|------|--------|--------|
| 出库确认导入（分配） | 不变 | ↑ | ↓ | Outbound Occupy |
| Confirm Shipment（扣减） | ↓ | ↓ | 不变 | Outbound Deduct |
| 拣货 / 打包 / 发运状态 | 不变 | 不变 | 不变 | 不写 |

- 占用与流水、扣减与流水须 **同一事务**；失败整单回滚（与基础模块一致）。
- 出库详情扩展字段含 **Shipment No.**、Related Order No.、Status 等（与 Record 详情一致）。

---

## 8 主 PRD 索引

| 主题 | 位置 |
|------|------|
| 库存行存在性、匹配 | `KickBazar-WMS-PRD.md` §5.0.2 |
| 出库占用/扣减流水 | §6.2 |
| 库区推荐与写账总表 | §8.1、§8.2 |
| 仓库上下文 | §2.1 |

---

*本文档为出库模块唯一正文；基础 PRD §9 仅保留关联索引。*
