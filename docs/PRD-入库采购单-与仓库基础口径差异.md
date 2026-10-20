# 入库 / 采购单 PRD（同事稿）与 WMS 仓库基础 PRD 口径差异对照

> **基准文档**：`docs/KickBazar-WMS-PRD.md`（仓库、库区、库存查看、库存调整单、流水 Record、Dashboard、§8 写账契约）  
> **对照来源**：你提供的入库/采购单 PRD 全文 + 2026-10-12 交接纪要 + Axure 包 `入库/`（采购单 + 入库两模块）  
> **用途**：评审「不一致项」并给出**建议统一方向**（未决项标 ⚠️ 需产品拍板）

---

## 0. 一句话结论

同事稿把 **采购单 + 入库单（Receipt）** 做成带 **Excel 导入、行内建品/改条码、盘点式字段** 的独立作业系统；仓库基础 PRD 把 WMS 定位为 **仓内主数据 + 按仓库×库区写 total/locked + 流水只读**，**商品与条码只读 Seller 库**，**盘盈盘亏只走 §5.3 库存调整单（ADJ）**，与「入库单类型 = Manual Adjustment」**不是同一概念**。若不先统一，会出现 **同一英文 Manual Adjustment 三条链路**、**库存重复写账**、**PAN/条码两套主数据** 三类事故。

---

## 1. 模块边界与导航

| # | 维度 | 仓库基础 PRD | 入库/采购单 PRD（同事） | 差异级别 | 建议统一 |
|---|------|--------------|-------------------------|----------|----------|
| 1.1 | 采购单入口 | Dashboard **Quick Actions → Purchase Orders**；**侧栏无 PO 一级** | 完整 **采购单模块**（列表/CRUD/导入） | 中 | 侧栏是否恢复 **Purchase Order**（你曾 Axure 有）与基础 PRD §1.3 二选一，**全文只保留一种** |
| 1.2 | 入库入口 | 侧栏 **Inbound**（占位/待扩展） | 完整 **入库单 Receipt** 模块 | 低 | 一致：Inbound = Receipt 列表+编辑；需在基础 PRD **新增第 9 章** 或独立子 PRD 引用 |
| 1.3 | 与 C/B 端订单 | §2：商品只读 Seller；§8.2 PO 状态变更**不写库存** | 纪要：**三系统独立**，PO 不与 C/B 下单直连 | 低 | **已对齐**；入库/PO 仅 WMS 内闭环 |
| 1.4 | 仓库上下文 | §2.1：Admin **Home 切换** `warehouse_code`；业务页隐藏 Warehouse 筛 | 入库/PO PRD **未写**必须带当前仓 | 高 | 入库单/采购单列表、创建页 **强制当前 `warehouse_context`**；明细行 Zone 须属该仓 |
| 1.5 | 角色 | 仓管：无 Warehouses 菜单；可入出库/库存/流水 | 入库/PO CRUD **未区分 Admin/仓管** | 中 | 继承 §2：建仓 Admin only；**Receipt/PO 创建**建议 Admin + 仓管（所属仓） |

---

## 2. 概念与单据命名（最易混淆）

| # | 同事稿用语 | 仓库基础 PRD 用语 | 冲突说明 | 建议统一 |
|---|------------|-------------------|----------|----------|
| 2.1 | **Receipt No.**（凭证号） | **Inbound No.** / 入库单号（Record、流水） | 同一单据两种英文名 | 对外 **Receipt No.** 或 **Inbound No.** 择一；Record 关联单号字段同步 |
| 2.2 | **Receipt Type**：Purchase Receipt / **Manual Adjustment** | 入库流水：**Purchase Inbound** / **Manual Inbound**；调整：**Manual Adjustment（ADJ）** | **Manual Adjustment 被复用** | ⚠️ **Receipt Type 禁用 Manual Adjustment** 命名，改为 **Manual Receipt** 或 **Manual Inbound**；**盘盈盘亏仅 ADJ 单**（§5.3 / §6.4） |
| 2.3 | **Stocked In**（入库单状态） | 入库**上架写账**后产生 **Purchase/Manual Inbound** 流水 | 状态名 vs 流水类型 | Stocked In = 已完成上架且 **total↑**；与 Record §6.1 类型一一对应 |
| 2.4 | **Processing**（导入中） | Record **无**「导入中」流水；只有完成后写账 | 导入过程是否改库存 | ⚠️ **Processing 阶段 total 不变**；仅 **Stocked In** 时按 §8.2 写账+流水 |
| 2.5 | 采购单 **Creation Method**：Import Created / **Manual Adjustment** | 无「Creation Method」；PO 仅为采购域单据 |  again **Manual Adjustment** | 改为 **Manual Created** / **Import Created**；勿用 Adjustment |
| 2.6 | **Related Purchase Order No.** | 流水详情 **Purchase Order No.**（次要） | 命名一致 | 统一字段名 `purchase_order_no` |
| 2.7 | **Linked Receipt No.**（PO 搜索） | 未定义 PO↔Receipt 链 | — | PO 侧与 Receipt 侧 **同一关联字段** |

---

## 3. 库存写账与流水（核心冲突）

| # | 仓库基础 §8.2 | 同事入库/PO 行为 | 冲突 | 建议统一 |
|---|---------------|------------------|------|----------|
| 3.1 | **采购/手动入库确认上架** → total↑、available↑ → **Inbound 流水** | **Stocked In** = 导入库存已完成 | 需明确「确认上架」按钮/节点 | 以 **Stocked In** 为唯一写账触发点；与 **Import 完成** 若分两步，则仅第二步写账 |
| 3.2 | **库存调整 ADJ** → **Manual Adjustment Tab**；**不进 Inbound** | Receipt Type 含 **Manual Adjustment** | **重复写账风险** | 入库单 **不得**承担 ADJ 职能；ADJ 仅 SKU 页 §5.3 |
| 3.3 | 流水 **Qty** 有 +/- 与变更后 T/L/A | 入库行 **Qty / Physical Inventory / Inventory Variance** | 盘点字段 vs 写账数量 | ⚠️ **Physical/Variance** 若为对账展示，**写账数量**应单一字段（如 **Received Qty**）；Variance 不写 total |
| 3.4 | 行 **Total** 在库存表 = 实物库存 | 入库编辑页 **Total** 必填、「库存」 | 行 Total 是 **目标库存** 还是 **本次入库量** | 统一：**本次入库数量** 用 **Inbound Qty**；**禁止**与 SKU 主档 Total 混名 |
| 3.5 | PO 创建/状态变更 | **不变库存**（§8.2） | PO SKU 状态到 Stocked In 联动 | PO **Stocked In** = 其 SKU 已通过 **Receipt 写账** 汇总；**不在 PO 页直接改 total** |
| 3.6 | 入库上架目标库区 | **存储区 STO**（§8.1） | 行上 **Zone** 必选 | 默认 **STO**；仅 **Enable** 的 Storage Zone 可选；RCV 本期规则「上架进 STO」 |
| 3.7 | 最多 **5000** 条库存列表（§5） | SKU **10000** 条/单 + 导入 | 上限不一致 | ⚠️ 全局约定：**单证 10000** vs **列表 5000** 各管各；或统一为 10000 |

---

## 4. 商品主数据与条码（严重不一致）

| # | 仓库基础 PRD | 同事入库/PO 字段规则 | 冲突 | 建议统一 |
|---|--------------|----------------------|------|----------|
| 4.1 | WMS **不建品**；SKU/条码 **只读 Seller** | **Add Products** + 导入填 **SKU ID、Product Name、Specification、PAN、Primary Barcode** | WMS 变商品主数据系统 | **Receipt/PO 行**：SKU 从 **Seller 商品库只读带出**；缺 SKU 则 **禁止入库**，回 Seller 补数据 |
| 4.2 | 主条码：**EAN → UPC → PAN** 展示；**不提供条码增删改页** | Primary Barcode **13 位**、可编辑；入库 N、PO Y | 规则与权限冲突 | 展示 **Primary Barcode（只读）**；校验在 Seller；WMS 导入模板 **以 SKU ID 为主键** |
| 4.3 | PAN 为平台码一种 | PAN **必填**、13 位、**627… 结构**（厂商码+商品码+校验位） | WMS 维护 PAN 算法 | PAN **只读**；结构说明放 **Seller/Admin PRD** |
| 4.4 | 库存行主键 **SKU + warehouse_code + zone_code** | 行上无 **Warehouse**（隐含当前仓？） | 缺仓维度 | 创建 Receipt **绑定 warehouse_code**（上下文）；Zone 为 zone_code |
| 4.5 | 纪要：商品库 **只读初始化**，后续 **不联动** | 导入 Excel **自动填充** 商品字段 | 与只读冲突 | 导入 = **匹配已有 SKU**；未匹配行 → **失败明细**，不自动建 SKU |

---

## 5. 采购单 vs 入库单职责

| # | 同事稿 | 仓库基础 | 差异 | 建议 |
|---|--------|----------|------|------|
| 5.1 | PO：**10 种状态** + SKU 子状态（Pending Shipment…Stocked In） | §8.2 仅 **PO 不写库存** | PO 状态机很重 | PO 状态 **采购域**；**Stocked In** 仅由 **Receipt 写账** 反写 |
| 5.2 | **1 PO : N Receipt** | 流水可附 PO No. | 一致 | Receipt 必填/选填 PO 引用；PO 搜索 **Linked Receipt No.** |
| 5.3 | 引用 PO 时：**Physical Inventory / Variance**；Add/Import **置灰** | 无此交互 | 对账 UI | 若保留，定义为 **收货对账**，与 **§5.3 ADJ** 分离 |
| 5.4 | PO 行：**Tracking、Link、Total Price、Cargo/Shipment Type** | WMS 基础无 | 采购域字段 | 保留在 **PO PRD**；**不入库存行** |
| 5.5 | PO 删除：Draft/Created 且无关联可删 | 删仓：有 **pending PO** 不可删 | 一致 | Receipt/PO 删除规则写入 §8.3 |

---

## 6. 列表、搜索、筛选、分页（交互口径）

| # | 同事入库/PO | 仓库基础（仓/库存/流水） | 差异 | 建议 |
|---|-------------|---------------------------|------|------|
| 6.1 | 搜索：**焦点出推荐**、1–5 行、精确优先 BR201 | 仓库/库存：**点 Search 才查** | 交互不统一 | ⚠️ WMS 统一：**关键列表二选一**（推荐搜索 vs 按钮搜索）；入库/PO 若保留推荐，**仓/库存是否跟进** |
| 6.2 | Status + Receipt Type **多选**；Filter/Reset 置灰规则 | Record：**Tab + 子筛**；仓库 **Attribute/Status** | — | 入库列表 Filter **非实时** 是否与仓模块一致写死 |
| 6.3 | 分页 **20/50/100/500**；弹层关闭 **恢复页码/滚动/筛选** | 库存页 **20/page**；部分写 5000 条上限 | 不一致 | 全 WMS **统一分页档位** + **状态保持**规范（可引用同事 §2.5） |
| 6.4 | 新建排前 | 库存默认 **入库时间倒序** | — | 单据列表 **created_at desc** 写进基础 PRD |
| 6.5 | 采购单 PRD 笔误：「Creation Method **筛选入库单**」 | — | 文档错误 | 改为 **筛选采购单** |

---

## 7. 导入与状态机（同事稿特有）

| 规则 | 与仓库基础关系 | 建议 |
|------|----------------|------|
| Excel 导入、表头校验、Import/Cancel 状态 | Processing **不写库存**（见 §3.4） | 失败 Toast 与 **无效行报告** 保留 |
| **最多 2 个**导入进程并行 | 基础 PRD 未定义 | 写入 **入库/PO 子 PRD**；与库存事务隔离 |
| Draft / Processing / Stocked In；Processing **不可删** | 对应删仓 **pending inbound** | 与 §3.4 删仓校验一致 |
| View = 进度面板；查看 = 编辑页+进度 | — | 统一英文 **View** / **Edit** 避免中英混用 |
| Print 保存后出现 | — | 非库存逻辑，可保留 |

---

## 8. 与 Axure 原型（入库.zip）的映射

| Axure | 应对齐的 PRD |
|-------|----------------|
| `page_1` / `page_2` | 需产品标注哪页是 **PO 列表/编辑**、哪页是 **Receipt** |
| 字段列若含 PAN/Barcode 可编辑 | 按 **§4** 改为只读或「从商品库选 SKU」 |
| 无 Warehouse 上下文控件 | 补 **侧栏 Warehouse** + 单仓数据范围 |

（未解压逐像素对照；若需 **字段级 diff**，可指定 page 再跑一遍 Axure `data.js` 抽字段。）

---

## 9. 建议的「统一词典」（可直接贴进飞书）

| 中文 | 英文（推荐） | 归属模块 | 是否写 total |
|------|--------------|----------|--------------|
| 采购单 | Purchase Order (PO) | PO | 否 |
| 入库单 | Inbound Receipt / Receipt | Inbound | 否（Stocked In 前） |
| 采购入库 | Purchase Inbound | Record §6.1 | 是（上架时） |
| 手动入库 | Manual Inbound | Record §6.1 | 是 |
| 库存调整单 | Inventory Adjustment (ADJ-*) | §5.3 | 是 |
| 调整流水 | Manual Adjustment | Record §6.4 | 是 |
| ~~入库类型「人工调整」~~ | ~~Manual Adjustment~~ | **禁用** | 改用 **Manual Receipt** |

---

## 10. 待产品拍板清单（⚠️）

1. **Manual Adjustment** 是否从 **Receipt Type / PO Creation Method** 中 **彻底改名**？  
2. **Physical Inventory / Inventory Variance** 是否仅 **PO 引用收货** 场景保留？写账字段用哪一个？  
3. 入库行 **Total** 字段是否改名为 **Inbound Qty / Received Qty**？  
4. **Add Products / 导入** 是否 **禁止创建新 SKU**，仅允许 **Seller 已有 SKU**？  
5. 侧栏是否 **恢复 Purchase Order 一级菜单**（与 Dashboard Quick Action 并存）？  
6. 列表搜索：**全局改为推荐搜索** 还是 **入库/PO 改为点 Search**？  
7. **Processing 完成** 与 **Stocked In 写账** 是否同一步？  

---

## 11. 建议的文档/原型后续动作

| 动作 | 负责建议 |
|------|----------|
| 在 `KickBazar-WMS-PRD.md` 增加 **§9 入库**、**§10 采购单**（或链接本子文档） | 产品 |
| 子 PRD 全文替换 **Manual Adjustment**（入库/PO 域） | 产品 |
| Axure：Receipt Type、Creation Method 改名；SKU 行改 **只读条码 + SKU 选择器** | 交互 |
| §8.2 增一行：**Receipt Stocked In → Purchase/Manual Inbound 流水** | 产品 |
| 开发：**Receipt 写账接口** 与 **§5.3 ADJ** 分 API | 后端 |

---

*生成说明：未找到名为「洁癖」的 skill 文件；本对照按「字段级 + 写账链路 + 命名」逐项对齐，便于评审洁癖式收口。*
