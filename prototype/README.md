# KickBazar ToC Web Prototype

Interactive HTML prototype based on [PRD v1.10](../docs/kickbazar-toc-web-prd-v1.0.md).

## Run locally

```bash
cd prototype
python3 -m http.server 8765
```

Open http://localhost:8765/

## Covered pages (PRD scope)

| Page | Route | PRD |
|------|-------|-----|
| Homepage | `#/` | #6–#7 |
| Search | `#/search?q=` | #8–#12 |
| Category | `#/category/{id}` | #13–#15 |
| PDP | `#/product/{id}` | #16–#18 |
| Cart | `#/cart` | #22–#25 |
| Checkout | `#/checkout` | #26–#30 |
| Store | `#/store/{id}` | #19–#21 |
| Topic | `#/topic/{id}` | #35–#38 |

## Demo shortcuts

- **Double-click** account icon: toggle guest / logged-in (Header FL135)
- **Hover** Categories: category drawer (BR301)
- **Hover** Cart: cart preview dropdown (#22)

## Canvas wireframes

See [KickBazar ToC Web 原型线框](/cursor/stores/user/canvases/617d758f-0094-4fc3-bc61-fce1fa644a8d/source.canvas.tsx) for static IA and page wireframes.
