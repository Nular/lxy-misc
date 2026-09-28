#!/usr/bin/env python3
"""Inline CSS/JS into standalone HTML files under export/."""
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parent.parent
CSS = (ROOT / "css" / "styles.css").read_text(encoding="utf-8")
JS = (ROOT / "js" / "app.js").read_text(encoding="utf-8")

PAGES = [
    "index.html",
    "product-detail.html",
    "cart.html",
    "checkout.html",
    "order-success.html",
    "purchase-orders.html",
    "order-detail.html",
]

FONT_LINK = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />'
STYLE_BLOCK = f"<style>\n{CSS}\n</style>"
SCRIPT_BLOCK = f"<script>\n{JS}\n</script>"


def inline_page(name: str) -> str:
    html = (ROOT / name).read_text(encoding="utf-8")
    html = html.replace('<link rel="stylesheet" href="css/styles.css" />', STYLE_BLOCK)
    html = html.replace(FONT_LINK + "\n  " + '<link rel="stylesheet" href="css/styles.css" />', FONT_LINK + "\n  " + STYLE_BLOCK)
    html = html.replace('  <script src="js/app.js"></script>', f"  {SCRIPT_BLOCK}")
    return html


def main():
    export_dir = ROOT / "export"
    export_dir.mkdir(exist_ok=True)
    for name in PAGES:
        out = export_dir / name
        out.write_text(inline_page(name), encoding="utf-8")
        print("wrote", out.relative_to(ROOT))

    zip_path = ROOT / "product-sourcing-html-export.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for name in PAGES:
            zf.write(export_dir / name, arcname=name)
    print("wrote", zip_path.relative_to(ROOT))


if __name__ == "__main__":
    main()
