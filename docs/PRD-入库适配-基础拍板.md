# 入库 / 采购单 PRD 适配说明（对齐仓库基础 §5.0 拍板）

> **拍板结论（基础，已写入 `KickBazar-WMS-PRD.md` §5.0.1–§5.0.2）**  
> 1. WMS 内 SKU **先**自 **原有商品数据库** 导入/同步；再按 **仓库 × 库区** 生成库存行，**初始 Total/Locked/Available = 0**。  
> 2. **入库、PO 加行、Excel 导入** 只能匹配 **该仓已存在库存行** 的 SKU；**不能**在入库/PO 里新建 SKU 或新建库存行。  
> 3. **Stocked In** 只对已有行做 `total += receipt_qty`，禁止 INSERT 库存行。

本文供 **替换同事原「入库 + 采购单」PRD** 中冲突段落；基础模块其余章节 **不再改动**。

---

## 一、原 PRD 需删除或改写的点

| 原稿位置 | 原规则 | 适配后 |
|----------|--------|--------|
| 创建入库单 · 导入类型「人工调整」 | Receipt Type = Manual Adjustment | 改为 **Manual Receipt**；盘盈盘亏走 **库存调整单 ADJ**（基础 §5.3） |
| 行字段 **Total**（库存） | 必填，当作行库存 | **删除**；写账仅用 **Receipt Qty（实际上架量）** |
| **Physical Inventory / Inventory Variance** | 必填写行 | **删除**或改为 **Variance = Receipt Qty − Order Qty** 只读对账（不写 total） |
| **Primary Barcode / PAN** 入库 N、PO Y，13 位校验、可编辑 | WMS 维护条码 | **只读展示**；校验在 **商品库/Seller**；导入模板以 **SKU ID** 为主键 |
| Add Products / Import **自动填充并保存** 商品信息 | 隐含建品 | 仅 **匹配已有 SKU + 已有仓内库存行**；填充名称/规格为只读 |
| Import 表头匹配成功即入库 | 未校验仓内是否有行 | 增加 **§5.0.2 库存行存在** 校验；失败行进报告 |
| PO Creation Method **Manual Adjustment** | 命名冲突 | 改为 **Manual Entry** |
| 采购单 Import「根据 SKU ID 填充列表」 | 可含未下发 SKU | 仅允许 **当前 warehouse_code 已初始化库存行** 的 SKU |

---

## 二、入库 PRD 建议正文（可粘贴替换「2.4 入库信息编辑页面」核心规则）

### 2.4.0 前置条件

- 当前登录上下文 **warehouse_code** 下，目标 SKU 必须已完成 **§5.0.1 库存行初始化**（Total=0 即可）。
- 未完成初始化的仓，**禁止**创建 Stocked In 入库单（列表可进，写账接口拒绝）。

### 2.4.1 三种录入方式（互斥）

| 方式 | 行为 | SKU 来源 |
|------|------|----------|
| 引用采购单 | 拉 PO 待入库行，录 **Receipt Qty** | PO 行 SKU 须在 **当前仓已有库存行** |
| Add Products | SKU 选择器 | **仅**当前仓已初始化库存行列表 |
| Import Excel | 表头校验 + 行匹配 | **SKU ID** 匹配当前仓（+ zone，默认 STO）库存行 |

- 匹配失败：**不入行 / 不写账**，失败明细原因：`SKU not registered in this warehouse`（或中文产品定稿）。
- **不得**因 Import 自动创建 SKU、PAN、Barcode 或库存行。

### 2.4.2 状态与写账

- **Draft / Processing**：不改 `total`。
- **Stocked In**：事务内对已有行 `total += receipt_qty`；写 **Purchase Inbound / Manual Inbound** 流水；失败 **整单回滚**。

### 2.4.3 行字段（精简）

| 字段 | 必填 | 说明 |
|------|------|------|
| SKU ID | Y | 须通过 §5.0.2 |
| Product Name / Specification | — | 只读 |
| Order Qty | N | 引用 PO 时只读 |
| Receipt Qty | Y | 整数 1–9,999,999；**唯一写账数量** |
| Zone | Y | 默认启用 **Storage Zone** |
| Supplier / Remarks | N | 可选 |

---

## 三、采购单 PRD 建议补丁（§9 对齐）

- **9.6 Add Products**：选择范围 = **当前仓已初始化库存行** ∩ 商品库（不是全站 SKU）。
- **9.6 Import**：与入库相同匹配规则；PO **不写库存**；Stocked In 状态 **仅**在关联 Receipt 写账后反写。
- **10 联动**：入库 Stocked In 后更新 PO SKU 行状态；**不在 PO 页改 total**。

---

## 四、接口/后端建议（给开发）

```
POST /inbound/receipts/{id}/stock-in
  FOR each line:
    ASSERT inventory_row(sku_id, warehouse_code, zone_code) EXISTS
    UPDATE total += receipt_qty
    INSERT inventory_record (...)
```

- 批量初始化：`POST /warehouses/{code}/inventory/init-from-catalog`（商品库 + 下发 SKU 列表 → 生成 0 库存行）。

---

## 五、与同事 Axure 原型差异（交互）

- 若原型 Import 可填 PAN/Barcode 并保存：改为 **只读** 或 **隐藏**，SKU 未在仓内则 **红行 + 失败计数**。
- Add Products 弹窗：数据源改为 **Warehouse SKU list（含 0 库存）**，而非全量商品库。

---

*与 `KickBazar-WMS-PRD.md` §5.0、§9 及独立 PRD（`KickBazar-WMS-Inbound-PRD.md` 等）同步；基础正文不含作业单据章节。*
