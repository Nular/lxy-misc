# v2.0.0 修订粘贴稿（2026/10/13）

贴回原 PRD 时按块替换。客服联络邮箱 `payment@kickbazar.com` 和电话 **保留**，删的是订单邮件通知，不是 Contact。

**整节删除**

- 「4.9 模块 H：邮件通知」整节（含 FL280、FL281、BR180）
- Success 功能清单里的 FL270「邮件提示」
- Success 交互里的 BR171「邮件降级」

---

## 1. 变更记录 — 在版本表末尾追加一行

| 2026/10/13 | **v2.0.0** | — | Order Summary 增加 Subtotal / Promotion / Shipping Fee（无运费，展示 **Free**）；去掉邮件通知；Buy Now 直达 Checkout，不做数量弹层 |

## 2. 文档范围 — 替换这三行

| 商品 | Product Detail（内嵌 SKU）、Buy Now 直达 Checkout | **P0**；+ **Add to Cart**、推荐区；**不做** Buy Now 数量弹层 |
| 交易 | **购物车**、**交易步骤条**、Checkout、Order Success | **P0**；Cart / Checkout 的 Order Summary 含 Subtotal、Promotion、Shipping Fee |
| 横切 | 采购价/折扣展示、推荐组件 | **P0**；**不做** 邮件通知 |

## 3. 问题与目标 — 替换原「转化路径 / 下单后触达 / 交易进度」三行

| 转化路径单一 | **Add to Cart** 与 **Buy Now** 双路径（Buy Now **不弹层**） |
| 金额构成不完整 | Cart 与 Checkout 的 Order Summary 展示 **Subtotal、Promotion、Shipping Fee（Free）** |
| 交易进度不清晰 | **交易步骤条**（Cart 路径 3 步 / Buy Now 2 步） |

删掉原行：「下单后触达弱 → 创建单邮件 + Success 提示」。

## 4. 旅程 2 — 整段替换

**旅程 2：立即购买（单行）**  
Discovery → Detail → **Buy Now**（不弹层，数量默认 1）→ **Checkout**（仅当前 SKU，可改量）→ Order & Pay → Order Success

## 5. 跨模块衔接 — 替换这三行

| Buy Now | 点击即写入结算快照 `checkoutEntrySource=buy_now`、**quantity 默认 1**；跳转 Checkout；**不打开数量弹层**；**不经过 Cart**（**BR132 / BR142**） |
| Checkout 改量（cart 来源） | 重算 Subtotal / Promotion / Grand Total；Shipping Fee 保持 **Free**；**回写同步 Cart**（**BR136**） |
| Order & Pay 成功 | 创建 **一个** PO、多 `items[]`；跳转 Success；**不发邮件**（**BR138**） |

## 6. 商品详情 — 替换功能描述、FL222、quantity、BR131、BR132

**功能描述**

v1.0.1 橱窗、SKU 选择、MOQ、超卖；v2.0.0 增加底栏 **Add to Cart** 与 **Buy Now**、价格折扣展示、底侧推荐。**Buy Now 不打开数量弹层**，点击后直接进入 Checkout，数量默认 1，改量在 Checkout。规格在 **PDP 内嵌**。

| FL222 | 立即购买 | Buy Now | 点击直达 Checkout；不弹层；数量默认 1 |

| quantity | 数量 | number | 是 | Add to Cart 与 Buy Now 均默认 1；改量在 Cart / Checkout |

| BR131 | Buy Now | 点击且 SKU 选全 | 不打开弹层，离开 PDP | — | 直接进入 Checkout |
| BR132 | Buy Now 快照 | 点击 Buy Now | `buy_now` 单行、qty=1 → Checkout | — | 不读 Cart；Checkout 可改量 |

## 7. 步骤条业务规则第 3 条 — 整条替换

3. Checkout **页面布局仍为 v1.0.1**（固定达卡地址、Bank/Digital、Security）。Order Summary 展示 **Subtotal、Promotion、Shipping Fee、Grand Total**。Shipping Fee **无运费计价，展示 Free**。**不引入** ToC 地址弹层、运费档位、COD、优惠券。

## 8. 购物车 Order Summary — 替换原「仅三项」那段，以及 FL253、字段、BR160

**Order Summary**：**Subtotal**（勾选行原价小计）+ **Promotion**（现价小计 − 原价小计，为负或 0）+ **Shipping Fee**。购物车 **没有运费**，Shipping Fee **固定展示 Free**（金额 0）。**Grand Total** = Subtotal + Promotion + Shipping Fee。不含 COD / Coupon。

| FL253 | 金额汇总 | Order Summary | Subtotal / Promotion / Shipping Fee（Free）/ Grand Total |

| subtotal | 勾选行原价合计 |
| promotion | 现价合计 − 原价合计 |
| shippingFee | 固定 0；界面文案 **Free**（购物车无运费） |
| grandTotal | subtotal + promotion + shippingFee |

| BR160 | 勾选汇总 | 勾选/改量 | Subtotal、Promotion、Grand Total 与 Checkout(n) 更新 | Shipping Fee 恒为 Free |

业务规则补一句：改量实时重算行小计与 Order Summary。Shipping Fee 始终为 Free，不随勾选变化。

## 9. 结算 — 替换功能描述、业务规则、字段，并新增 FL264

**功能描述**

v1.0.1 三模块：**Shipping Address（固定）**、**Product Information + Remark**、**Payment Method**；右侧 **Order Summary** + **Security Reminder** + **Order & Pay**。

v2.0.0：**Product Information 多 SKU 行**，每行 **Qty 可编辑**。Order Summary 与购物车同结构：**Subtotal、Promotion、Shipping Fee、Grand Total**。Shipping Fee **展示 Free**（本期无运费）。Grand Total = Subtotal + Promotion + 0。提交创建 **一个 PO、多 items**。

| FL264 | 结算汇总 | Checkout Order Summary | Subtotal / Promotion / Shipping Fee（Free）/ Grand Total |

**业务规则**

1. `cart`：items = **已勾选且 valid** 的行；`buy_now`：**单行、进入时 quantity = 1**（**BR142**）。页面模块与 v1.0.1 一致，**不改**为 ToC 地址/运费档位/COD/券。
2. Checkout 改量同步 Cart（仅 cart 来源）（**BR136**）。Buy Now 来源只改结算行，不写回购物车。
3. **无 Shipping Method**。Shipping Fee 金额 = 0，文案 **Free**。Subtotal = 各行原价 × 数量；Promotion = 现价小计 − 原价小计；Grand Total = Subtotal + Promotion + Shipping Fee。
4. 固定地址、Payment、Security、Remark：**同 v1.0.1**（不重复 BR）。
5. 提交：Pending Payment；`items[{skuId, qty}]`；**不触发邮件**（**BR138**）。

| subtotal | number | 原价合计 |
| promotion | number | 现价合计 − 原价合计 |
| shippingFee | number | 固定 0；展示 **Free** |
| grandTotal | number | subtotal + promotion + shippingFee |

| BR136 | 改量同步 | Checkout 改量（cart） | 回写 Cart；重算四行汇总 | — | 与 Cart 一致；Shipping Fee 均为 Free |
| BR142 | Buy Now 单行 | source=buy_now | 仅当前 SKU，初始 qty=1 | — | 无弹层；无 Cart 其他行 |

## 10. 下单成功 — 替换功能描述、功能清单、业务规则；删掉 BR171

**功能描述**

v1.0.1 成功话术、Order No.、Grand Total、Contact、按钮；v2.0.0 增加底侧 **Recommended**（乱序）。**无** 邮件已发送提示、**无** 2B 账户、**无** 上传凭证。Contact 中的 Email 仍是客服联络方式，不是订单通知。

| FL271 | 成功页推荐 | Success Recommendations | Recommended |
| FL272 | 金额一致 | Total Consistency | Grand Total 与 Checkout 一致 |

**业务规则**

1. Contact：Phone **01794 133553**、Email **payment@kickbazar.com**（v1.0.1，客服联络，不是发信通知）。
2. 成功页 **不展示**「邮件已发送」类文案，也 **不触发** 创建单邮件。
3. 推荐同 §4.4。

交互表只留 BR170、BR172、BR173。删除 BR171。

## 11. 本期不做 — 追加三行

| Buy Now 数量弹层 | 本期 **不做**；点击直达 Checkout，数量默认 1 |
| 邮件通知 | 创建单邮件、确认收款邮件、Success「邮件已发送」均 **本期不做** |
| 多 2B、凭证上传、Shipping Method | v1.0.1 已排除；Summary 只展示 Shipping Fee = **Free** |

## 12. 验收 — 替换增量验收这几条

- [ ] PDP：Add to Cart、Buy Now 双按钮；Buy Now **无弹层**、直达 Checkout 且初始数量为 1；Detail 推荐
- [ ] Cart：改量、删行、空车禁用 Checkout、三步条 Step1；Order Summary 含 Subtotal、Promotion、Shipping Fee（Free）、Grand Total
- [ ] Checkout：同样四行汇总；多行、改量同步 Cart；Buy Now 单行；一单多 SKU 提交
- [ ] Success：推荐、Grand Total 一致；**无** 邮件已发送提示
- [ ] 步骤条：Cart 路径 3 步；Buy Now 2 步
- [ ] 下单成功 **不发送** 创建单邮件或确认收款邮件

删掉原验收条：「创建单邮件任务成功或 2C 收到」。

## 13. 附录 — 替换这几格

| Checkout | FL260–FL264 |
| Success | FL271–FL272 |

删除附录里的「邮件 FL280–FL281」「邮件 BR180」。

| Success | BR170、BR172–BR173 |

| Buy Now | 数量弹层后结算 | 直达 Checkout，默认数量 1，无弹层 |
| Checkout | 单 SKU；Summary 仅 Grand Total | 多 SKU；Cart/Checkout 可改量；Summary 为 Subtotal / Promotion / Shipping Fee（Free）/ Grand Total |
| Success | Contact | + 推荐；**无** 邮件提示 |

---

界面文案（English）：`Subtotal`、`Promotion`、`Shipping Fee`、`Free`、`Grand Total`。Cart 与 Checkout 都展示这四行。Shipping Fee 没有金额，写 **Free**。
