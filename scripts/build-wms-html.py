#!/usr/bin/env python3
"""Bundle prototype into export/KickBazar-WMS.html (single-file SPA) + Export.zip."""
import re
import sys
import zipfile
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

css_link_pat = re.compile(
    r'  <link rel="stylesheet" href="css/styles\.css"[^>]*>\s*\n',
    re.MULTILINE,
)
script_block_pat = re.compile(
    r'  <script src="vendor/xlsx\.full\.min\.js[^"]*"></script>\s*\n'
    r'  <script src="js/app\.js[^"]*"></script>\s*\n'
    r'  <script src="js/inbound\.js[^"]*"></script>\s*\n'
    r'  <script src="js/outbound\.js[^"]*"></script>\s*\n',
    re.MULTILINE,
)
def _inline_css(_match: re.Match[str]) -> str:
    return f"  <style>\n{css}\n  </style>\n"


BUNDLE_NAME = "KickBazar-WMS.bundle.js"


def _external_js(_match: re.Match[str]) -> str:
    return (
        f'  <script src="{BUNDLE_NAME}" defer'
        f' onerror="var b=document.getElementById(\'wms-boot-alert\');if(b)b.hidden=false;"></script>\n'
    )


def _inline_js(_match: re.Match[str]) -> str:
    safe = js_bundle.replace("</script>", "<\\/script>")
    return f"  <script>\n{safe}\n  </script>\n"


out, n_css = css_link_pat.subn(_inline_css, html, count=1)
if n_css != 1:
    sys.exit(f"build failed: expected 1 css link replacement, got {n_css}")
out_external, n_js = script_block_pat.subn(_external_js, out, count=1)
if n_js != 1:
    sys.exit(f"build failed: expected 1 script bundle replacement, got {n_js}")
out_external = out_external.replace(
    "<title>KickBazar WMS - Prototype</title>",
    "<title>KickBazar WMS</title>",
)
build_marker = f"<!-- WMS_BUILD bundle={BUNDLE_NAME} css=inline -->\n"
if build_marker not in out_external:
    out_external = out_external.replace("<head>", f"<head>\n{build_marker}", 1)

out_inline, n_js2 = script_block_pat.subn(_inline_js, out, count=1)
if n_js2 != 1:
    sys.exit(f"build failed: expected 1 inline script replacement, got {n_js2}")
out_inline = out_inline.replace("<title>KickBazar WMS - Prototype</title>", "<title>KickBazar WMS (all-in-one)</title>")

export = ROOT / "export"
export.mkdir(exist_ok=True)
bundle_path = export / BUNDLE_NAME
bundle_path.write_text(js_bundle, encoding="utf-8")
(ROOT / BUNDLE_NAME).write_text(js_bundle, encoding="utf-8")

(export / "KickBazar-WMS.html").write_text(out_external, encoding="utf-8")
(export / "KickBazar-WMS-all-in-one.html").write_text(out_inline, encoding="utf-8")
(proto / "kickbazar-wms-prototype.html").write_text(out_external, encoding="utf-8")
(export / "KickBazar-WMS-Prototype.html").write_text(out_external, encoding="utf-8")
(ROOT / "KickBazar-WMS.html").write_text(out_external, encoding="utf-8")
if "href=\"css/styles.css\"" in out_external:
    sys.exit("build failed: bundled HTML still references external css/styles.css")
if f'src="{BUNDLE_NAME}"' not in out_external:
    sys.exit("build failed: HTML missing bundle script reference")
zip_path = export / "KickBazar-WMS-Export.zip"
readme = export / "README.md"
with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
    zf.write(export / "KickBazar-WMS.html", arcname="KickBazar-WMS.html")
    zf.write(bundle_path, arcname=BUNDLE_NAME)
    zf.write(export / "KickBazar-WMS-all-in-one.html", arcname="KickBazar-WMS-all-in-one.html")
    if readme.is_file():
        zf.write(readme, arcname="README.md")
legacy_banner = (
    '<div id="wms-legacy-banner" style="background:#ff4d4f;color:#fff;padding:12px 16px;text-align:center;font:14px sans-serif">'
    "此文件为旧版拆分稿，数据与样式不完整。请打开同目录 <a href=\"KickBazar-WMS.html\" style=\"color:#fff;text-decoration:underline\">KickBazar-WMS.html</a>。"
    "</div>"
)
for legacy_name in (
    "KickBazar-WMS-Dashboard.html",
    "KickBazar-WMS-Inventory.html",
    "KickBazar-WMS-Inventory-Record.html",
    "KickBazar-WMS-Warehouse-Setup.html",
):
    legacy_path = export / legacy_name
    if not legacy_path.is_file():
        continue
    legacy_html = legacy_path.read_text(encoding="utf-8")
    if "wms-legacy-banner" in legacy_html:
        continue
    legacy_path.write_text(
        legacy_html.replace("<body>", f"<body>\n{legacy_banner}\n", 1),
        encoding="utf-8",
    )

print(f"Wrote {export / 'KickBazar-WMS.html'} ({len(out_external)} bytes)")
print(f"Wrote {bundle_path} ({bundle_path.stat().st_size} bytes)")
print(f"Wrote {zip_path} ({zip_path.stat().st_size} bytes)")
