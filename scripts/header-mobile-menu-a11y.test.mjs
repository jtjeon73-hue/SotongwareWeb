/**
 * Mobile menu focus / aria-hidden / inert contracts (Header.tsx source checks).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const header = readFileSync(join(repoRoot, "src/components/layout/Header.tsx"), "utf8");

let failed = 0;
function check(name, ok, detail = "") {
  if (ok) console.log(`PASS ${name}${detail ? ` — ${detail}` : ""}`);
  else {
    failed += 1;
    console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

check("closeMobileMenu defined", header.includes("const closeMobileMenu"));
check(
  "blur focused element inside panel before hide",
  header.includes("panel.contains(active)") && header.includes("active.blur()"),
);
check("queueMicrotask restores menu button focus", header.includes("queueMicrotask") && header.includes("menuButtonRef"));
check("toggleMobileMenu uses close when open", header.includes("const toggleMobileMenu") && header.includes("closeMobileMenu()"));
check("Escape closes via closeMobileMenu", header.includes('e.key === "Escape"') && header.includes("closeMobileMenu()"));
check("aria-hidden retained", header.includes("aria-hidden={!mobileOpen}"));
check("inert when closed", header.includes("inert: true"));
check("menu button ref", header.includes("menuButtonRef"));
check("menu panel ref", header.includes("menuPanelRef"));
check("data-testid mobile-menu-button", header.includes('data-testid="mobile-menu-button"'));
check("data-testid mobile-menu-panel", header.includes('data-testid="mobile-menu-panel"'));
check(
  "nav links use closeMobileMenu on navigate",
  header.includes("onClick={closeMobileMenu}") &&
    !header.includes("onClick={() => setMobileOpen(false)}"),
);
check("toggle button onClick toggleMobileMenu", header.includes("onClick={toggleMobileMenu}"));
check("aria-controls and aria-expanded kept", header.includes('aria-controls="mobile-menu"') && header.includes("aria-expanded={mobileOpen}"));

console.log(failed === 0 ? "\nHEADER MOBILE MENU A11Y ALL PASS" : `\nFAILED=${failed}`);
process.exit(failed === 0 ? 0 : 1);
