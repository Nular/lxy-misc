#!/usr/bin/env python3
"""Build standalone HTML exports.

The primary artifact is one self-contained file, product-sourcing.html.
Hash routes (#cart.html?demo=1, …) switch pages inside that file.
Per-page files under export/ stay available for the older multi-file preview.
"""
from pathlib import Path
import re
import zipfile

ROOT = Path(__file__).resolve().parent.parent
CSS = (ROOT / "css" / "styles.css").read_text(encoding="utf-8")
JS = (ROOT / "js" / "app.js").read_text(encoding="utf-8").replace("</script>", "<\\/script>")

PAGES = [
    "index.html",
    "product-detail.html",
    "cart.html",
    "checkout.html",
    "order-success.html",
    "purchase-orders.html",
    "order-detail.html",
]

FONT_LINK = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />'
STYLE_BLOCK = f"<style>\n{CSS}\n</style>"
SCRIPT_BLOCK = f"<script>\n{JS}\n</script>"

BODY_RE = re.compile(r"<body([^>]*)>(.*)</body>", re.I | re.S)
TITLE_RE = re.compile(r"<title>(.*?)</title>", re.I | re.S)
ATTR_RE = re.compile(r"""([\w:-]+)\s*=\s*"([^"]*)\"""")
SCRIPT_RE = re.compile(r"\s*<script src=\"js/app\.js\"></script>\s*", re.I)


def inline_page(name: str) -> str:
    html = (ROOT / name).read_text(encoding="utf-8")
    html = html.replace('<link rel="stylesheet" href="css/styles.css" />', STYLE_BLOCK)
    html = html.replace('  <script src="js/app.js"></script>', f"  {SCRIPT_BLOCK}")
    return html


def attr_escape(value: str) -> str:
    return (
        value.replace("&", "&amp;")
        .replace('"', "&quot;")
        .replace("<", "&lt;")
    )


def page_parts(name: str):
    html = (ROOT / name).read_text(encoding="utf-8")
    title = TITLE_RE.search(html).group(1).strip()
    body = BODY_RE.search(html)
    attrs = ATTR_RE.findall(body.group(1) or "")
    inner = SCRIPT_RE.sub("\n", body.group(2)).strip()
    return title, attrs, inner


def build_single_file() -> str:
    templates = []
    for name in PAGES:
        title, attrs, inner = page_parts(name)
        tpl_id = "tpl-" + name[: -len(".html")]
        attr_html = "".join(
            f' {key}="{attr_escape(value)}"' for key, value in attrs
        )
        templates.append(
            f'<template id="{tpl_id}" data-title="{attr_escape(title)}"{attr_html}>\n{inner}\n</template>'
        )
    joined = "\n".join(templates)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Product Sourcing — KickBazar</title>
  {FONT_LINK}
  {STYLE_BLOCK}
</head>
<body>
  <div id="app-root"></div>
  {joined}
  {SCRIPT_BLOCK}
</body>
</html>
"""


def main():
    export_dir = ROOT / "export"
    export_dir.mkdir(exist_ok=True)
    for name in PAGES:
        out = export_dir / name
        out.write_text(inline_page(name), encoding="utf-8")
        print("wrote", out.relative_to(ROOT))

    hub = (ROOT / "export-start.html").read_text(encoding="utf-8")
    (export_dir / "start.html").write_text(
        hub.replace('href="product-sourcing.html#', 'href="../product-sourcing.html#'),
        encoding="utf-8",
    )
    print("wrote", "export/start.html")

    single = build_single_file()
    single_path = ROOT / "product-sourcing.html"
    single_path.write_text(single, encoding="utf-8")
    print("wrote", single_path.relative_to(ROOT), "bytes", single_path.stat().st_size)

    zip_path = ROOT / "product-sourcing-html-export.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.write(single_path, arcname="product-sourcing.html")
    print("wrote", zip_path.relative_to(ROOT))


if __name__ == "__main__":
    main()
