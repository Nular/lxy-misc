#!/usr/bin/env python3
"""Bundle KickBazar prototype into a standalone interactive HTML file."""

from __future__ import annotations

import base64
import shutil
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
EXPORT_DIR = ROOT / "export"
ARTIFACTS_DIR = Path("/opt/cursor/artifacts")
OUTPUT_NAME = "kickbazar-toc-prototype-v1.11.html"
ZIP_NAME = "kickbazar-toc-prototype-v1.11.zip"


def build_standalone_html() -> str:
    css = (ROOT / "styles.css").read_text(encoding="utf-8")
    js = (ROOT / "app.js").read_text(encoding="utf-8")
    html = (ROOT / "index.html").read_text(encoding="utf-8")

    logo_path = ROOT / "assets" / "logo.png"
    if logo_path.exists():
        logo_b64 = base64.b64encode(logo_path.read_bytes()).decode("ascii")
        logo_src = f"data:image/png;base64,{logo_b64}"
        html = html.replace('src="assets/logo.png"', f'src="{logo_src}"')

    html = html.replace(
        '<link rel="stylesheet" href="styles.css" />',
        f"<style>\n{css}\n</style>",
    )
    html = html.replace(
        '<script src="app.js"></script>',
        f"<script>\n{js}\n</script>",
    )
    html = html.replace("PRD v1.10", "PRD v1.11")
    return html


def build_folder_export() -> Path:
    folder = EXPORT_DIR / "kickbazar-toc-prototype-v1.11"
    if folder.exists():
        shutil.rmtree(folder)
    folder.mkdir(parents=True)
    shutil.copy2(ROOT / "index.html", folder / "index.html")
    shutil.copy2(ROOT / "styles.css", folder / "styles.css")
    shutil.copy2(ROOT / "app.js", folder / "app.js")
    assets = folder / "assets"
    assets.mkdir()
    shutil.copy2(ROOT / "assets" / "logo.png", assets / "logo.png")

    index = (folder / "index.html").read_text(encoding="utf-8")
    index = index.replace("PRD v1.10", "PRD v1.11")
    (folder / "index.html").write_text(index, encoding="utf-8")
    return folder


def main() -> None:
    EXPORT_DIR.mkdir(exist_ok=True)
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    standalone = build_standalone_html()
    standalone_path = EXPORT_DIR / OUTPUT_NAME
    standalone_path.write_text(standalone, encoding="utf-8")

    folder = build_folder_export()
    zip_path = EXPORT_DIR / ZIP_NAME
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for file in folder.rglob("*"):
            if file.is_file():
                zf.write(file, file.relative_to(folder.parent))

    shutil.copy2(standalone_path, ARTIFACTS_DIR / OUTPUT_NAME)
    shutil.copy2(zip_path, ARTIFACTS_DIR / ZIP_NAME)

    size_kb = standalone_path.stat().st_size / 1024
    print(f"Standalone HTML: {standalone_path} ({size_kb:.1f} KB)")
    print(f"Folder + zip:    {folder}")
    print(f"Zip archive:     {zip_path}")
    print(f"Artifacts:       {ARTIFACTS_DIR / OUTPUT_NAME}")


if __name__ == "__main__":
    main()
