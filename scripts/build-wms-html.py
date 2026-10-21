#!/usr/bin/env python3
"""Bundle prototype into export/KickBazar-WMS.html (single-file SPA)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
proto = ROOT / "prototype"
html = (proto / "index.html").read_text(encoding="utf-8")
css = (proto / "css" / "styles.css").read_text(encoding="utf-8")
js_xlsx = (proto / "vendor" / "xlsx.full.min.js").read_text(encoding="utf-8")
js_app = (proto / "js" / "app.js").read_text(encoding="utf-8")
js_inbound = (proto / "js" / "inbound.js").read_text(encoding="utf-8")
js_outbound = (proto / "js" / "outbound.js").read_text(encoding="utf-8")
js_bundle = js_xlsx + "\n\n" + js_app + "\n\n" + js_inbound + "\n\n" + js_outbound
out = html.replace(
    '  <link rel="stylesheet" href="css/styles.css">\n',
    f"  <style>\n{css}\n  </style>\n",
).replace(
    '  <script src="vendor/xlsx.full.min.js"></script>\n  <script src="js/app.js"></script>\n  <script src="js/inbound.js"></script>\n  <script src="js/outbound.js"></script>\n',
    f"  <script>\n{js_bundle}\n  </script>\n",
)
out = out.replace("<title>KickBazar WMS - Prototype</title>", "<title>KickBazar WMS</title>")
export = ROOT / "export"
export.mkdir(exist_ok=True)
(export / "KickBazar-WMS.html").write_text(out, encoding="utf-8")
(proto / "kickbazar-wms-prototype.html").write_text(out, encoding="utf-8")
(export / "KickBazar-WMS-Prototype.html").write_text(out, encoding="utf-8")
print(f"Wrote {export / 'KickBazar-WMS.html'} ({len(out)} bytes)")
