"""One-off helper: rebuild vaultrian-national-map-data.js from the JSON."""
import pathlib

here = pathlib.Path(__file__).resolve().parent
src = here / "vaultrian-national-map.json"
dst = here / "vaultrian-national-map-data.js"
raw = src.read_text(encoding="utf-8")
dst.write_text(
    "// Mirrors vaultrian-national-map.json — run: python _emit_national_map_js.py\n"
    "window.__VAULTRIAN_NATIONAL_MAP__ = "
    + raw.strip()
    + ";\n",
    encoding="utf-8",
)
print("Wrote", dst)
