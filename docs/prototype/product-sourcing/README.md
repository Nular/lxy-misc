# Product Sourcing — High-Fidelity HTML Prototype

English UI prototype for Seller 2C Product Sourcing module.

## Quick start

```bash
cd docs/prototype/product-sourcing
python3 -m http.server 8080
```

Open: http://localhost:8080/index.html

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
