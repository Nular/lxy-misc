# Product Sourcing — High-Fidelity HTML Prototype

English UI prototype for Seller 2C Product Sourcing module.

## Quick start

```bash
cd docs/prototype/product-sourcing
python3 -m http.server 8080
```

Open: http://localhost:8080/index.html

## Standalone HTML export (download)

Self-contained HTML files (CSS/JS inlined) for local preview without a server:

- **ZIP**: `product-sourcing-html-export.zip` (in this folder)
- **Folder**: `export/` (7 `.html` files)

Download from GitHub:

https://github.com/Nular/lxy-misc/raw/cursor/seller-2c-product-sourcing-brainstorming-d41a/docs/prototype/product-sourcing/product-sourcing-html-export.zip

Or open any file in `export/` directly in your browser after cloning the repo.

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

- **PRD v2.0 (order flow)**: `docs/seller-2c-product-sourcing-prd-v2.0.md`
- **PRD v1.0 final**: `docs/seller-2c-product-sourcing-prd-v1.0-final.md`
- `docs/seller-2c-product-sourcing-ui-design.md`
- Legacy draft: `docs/seller-2c-product-sourcing-prd-v1.md`
