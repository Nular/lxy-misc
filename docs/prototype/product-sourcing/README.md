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

## Standalone HTML（一个文件）

全部页面、样式和脚本都在 **`product-sourcing.html`**。用浏览器打开这一个文件即可，页面之间用地址栏 hash 切换（例如 `#cart.html?demo=1`），不再依赖旁边的其他 HTML。

- **单文件**: `product-sourcing.html`
- **ZIP**: `product-sourcing-html-export.zip`（里面只有这一个 HTML）
- **目录页**: `export-start.html`（链进同一个文件的各个 hash）

从 GitHub 下载单文件：

https://github.com/Nular/lxy-misc/raw/cursor/seller-2c-product-sourcing-brainstorming-d41a/docs/prototype/product-sourcing/product-sourcing.html

ZIP（解压后打开 `product-sourcing.html`）：

https://github.com/Nular/lxy-misc/raw/cursor/seller-2c-product-sourcing-brainstorming-d41a/docs/prototype/product-sourcing/product-sourcing-html-export.zip

在线预览（htmlpreview）：

https://htmlpreview.github.io/?https://github.com/Nular/lxy-misc/blob/cursor/seller-2c-product-sourcing-brainstorming-d41a/docs/prototype/product-sourcing/product-sourcing.html

直接打开某个页面时，在预览地址后加 hash，例如购物车示例：`#cart.html?demo=1`。

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
- Buy Now goes straight to single-line checkout (no quantity modal); Cart merges selected SKUs
- Checkout Order Summary: Subtotal, Promotion, Shipping Fee (Free), Grand Total; qty edits sync back to cart
- Discount display: strikethrough + `-X%` tag on Discovery / Detail / Cart / Checkout
- Copy buttons on Order Success (toast)
- Purchase Orders tab filter (All / Published / Unpublished)

## Design reference

- **PRD v2.0.0 (order flow)**: `docs/seller-2c-product-sourcing-prd-v2.0.0.md`（上一版线上 **v1.0.1**）
- **PRD v1.0 final**: `docs/seller-2c-product-sourcing-prd-v1.0-final.md`
- `docs/seller-2c-product-sourcing-ui-design.md`
- Legacy draft: `docs/seller-2c-product-sourcing-prd-v1.md`
