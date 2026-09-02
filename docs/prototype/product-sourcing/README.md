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
- **Folder**: `export/` (6 `.html` files)

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
| `product-detail.html` | Product Detail + Buy Now modal |
| `checkout.html` | Checkout (editable qty, shipping, summary) |
| `order-success.html` | Order Success + Payment Details + Upload |
| `purchase-orders.html` | Purchase Orders List (tabs) |
| `order-detail.html` | Purchase Order Detail + Publish to Store |

## Flow

```
index → product-detail → [Buy Now] → checkout → order-success → purchase-orders → order-detail
```

## Interactive features

- Buy Now modal with quantity stepper
- Checkout: qty / shipping method recalculates Grand Total
- Copy buttons on Order Success (toast)
- Purchase Orders tab filter (All / Published / Unpublished)

## Design reference

- `docs/seller-2c-product-sourcing-ui-design.md`
- PRD: `docs/seller-2c-product-sourcing-prd-v1.md`
