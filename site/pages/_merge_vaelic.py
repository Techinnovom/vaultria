# Merge _vaelic_head.html + _vaelic_generated.html + footer -> vaelic.html
from pathlib import Path

here = Path(__file__).resolve().parent
a = (here / "_vaelic_head.html").read_text(encoding="utf-8").rstrip()
b = (here / "_vaelic_generated.html").read_text(encoding="utf-8").rstrip()
footer = """          </div>
        </main>
        <footer>
          <p>The Sovereign State of VAULTRIA &mdash; a living document.</p>
          <p class="latin">Vaelic language reference &middot; <code>site/pages/vaelic.html</code></p>
        </footer>
      </div>
    </div>
  </div>
  <div class="site-sidebar-backdrop" id="site-sidebar-backdrop" aria-hidden="true"></div>
  <script src="../assets/js/site-nav.js" defer></script>
  <script src="../assets/js/site-search.js" defer></script>
  <script src="../assets/js/vaelic-reference.js" defer></script>
</body>
</html>
"""
(here / "vaelic.html").write_text(a + "\n" + b + "\n" + footer, encoding="utf-8")
print("Wrote vaelic.html")
