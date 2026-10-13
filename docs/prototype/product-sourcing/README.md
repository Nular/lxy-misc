# Product Sourcing — High-Fidelity HTML Prototype

English UI prototype for Seller 2C Product Sourcing module.

## Quick start

**一键启动（推荐）：**

```bash
bash docs/prototype/product-sourcing/start-preview.sh
```

Cloud Agent：在 Cursor **Ports** 面板打开 **8080**（详见 `预览说明.md`）。

手动方式：

```bash
cd docs/prototype/product-sourcing
python3 -m http.server 8080
```

Open: http://127.0.0.1:8080/index.html

## Standalone HTML export (download)

Self-contained HTML files (CSS/JS inlined) for local preview without a server:

- **入口页**: `export/start.html`（目录，链到各页）
- **ZIP**: `product-sourcing-html-export.zip`（含 `start.html` + 7 个页面，CSS/JS 已内联）
- **Folder**: `export/`

从 GitHub 下载 ZIP（解压后打开 `start.html`）：

https://github.com/Nular/lxy-misc/raw/cursor/seller-2c-product-sourcing-brainstorming-d41a/docs/prototype/product-sourcing/product-sourcing-html-export.zip

在线预览入口（htmlpreview）：

https://htmlpreview.github.io/?https://github.com/Nular/lxy-misc/blob/cursor/seller-2c-product-sourcing-brainstorming-d41a/docs/prototype/product-sourcing/export/start.html

## Navigation

```
Product Sourcing (main menu)
├── Product Discovery      ← product list (index.html)
└── Purchase Orders List   ← purchase orders (purchase-orders.html)
```

## Pages

| File | Page |
|------|------|
| `index.html` | Product Discovery (SPU list + publish tags) |
| `product-detail.html` | Product Detail + Add to Cart / Buy Now + recommendations |
| `cart.html` | Cart (editable qty, multi-SKU) |
| `checkout.html` | Checkout (multi-SKU lines, editable qty, shipping, summary) |
| `order-success.html` | Order Success + Payment Details + Upload |
| `purchase-orders.html` | Purchase Orders List (tabs) |
| `order-detail.html` | Purchase Order Detail + Publish to Store |

## Flow

```
index → product-detail → [Add to Cart] → cart → checkout → order-success
index → product-detail → [Buy Now] → checkout → order-success → purchase-orders → order-detail
```

## Interactive features

- Cart: localStorage, qty steppers, demo 2-SKU loader on empty state
- Buy Now modal → single-line checkout; Cart → merged multi-SKU checkout
- Checkout: per-line qty recalculates Grand Total (syncs back to cart)
- Discount display: strikethrough + `-X%` tag on Discovery / Detail / Cart / Checkout
- Copy buttons on Order Success (toast)
- Purchase Orders tab filter (All / Published / Unpublished)

## Design reference

- **PRD v2.0.0 (order flow)**: `docs/seller-2c-product-sourcing-prd-v2.0.0.md`（上一版线上 **v1.0.1**）
- **PRD v1.0 final**: `docs/seller-2c-product-sourcing-prd-v1.0-final.md`
- `docs/seller-2c-product-sourcing-ui-design.md`
- Legacy draft: `docs/seller-2c-product-sourcing-prd-v1.md`
