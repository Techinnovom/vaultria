"""Rebuild vaelic-dictionary-data.js from vaelic-dictionary.json."""
import pathlib

here = pathlib.Path(__file__).resolve().parent
src = here / "vaelic-dictionary.json"
dst = here / "vaelic-dictionary-data.js"
raw = src.read_text(encoding="utf-8")
dst.write_text(
    "// Mirrors vaelic-dictionary.json — run: python _emit_vaelic_dictionary_js.py\n"
    "window.__VAELIC_DICTIONARY__ = "
    + raw.strip()
    + ";\n",
    encoding="utf-8",
)
print("Wrote", dst)
