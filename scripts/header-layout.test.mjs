/**
 * Header layout smoke checks (run after `npm run build`)
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "out");

let failed = 0;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failed++;
}

function pass(msg) {
  console.log(`PASS: ${msg}`);
}

function resolveBuiltPath(route) {
  const direct = join(outDir, route);
  if (existsSync(direct)) return direct;
  const nested = join(outDir, route.replace(/\.html$/, ""), "index.html");
  if (existsSync(nested)) return nested;
  return null;
}

function headerChunk(html) {
  const match = html.match(/<header[\s\S]*?<\/header>/i);
  return match?.[0] ?? "";
}

const checks = [
  {
    route: "ko.html",
    label: "KO home",
    mustInclude: ["header-shell", "whitespace-nowrap", "data-testid=\"site-header\"", "상담 문의", "안내", "포트폴리오", "기술역량", "디지털 사업"],
    mustExclude: ["상담·제작 문의</"],
  },
  {
    route: "en.html",
    label: "EN home",
    mustInclude: ["header-shell", "whitespace-nowrap", "Resources", "Portfolio", "Technology", "Digital Ventures", "data-testid=\"header-desktop-nav\""],
    mustExclude: ["Consultation & inquiry", "Usage guide</a>"],
  },
];

for (const { route, label, mustInclude, mustExclude } of checks) {
  const filePath = resolveBuiltPath(route);
  if (!filePath) {
    fail(`${label}: missing built file ${route}`);
    continue;
  }

  const html = readFileSync(filePath, "utf8");
  const header = headerChunk(html);
  if (!header) {
    fail(`${label}: no <header> in HTML`);
    continue;
  }

  const desktopNav = header.match(/data-testid="header-desktop-nav"[\s\S]*?<\/nav>/i)?.[0] ?? "";
  const desktopNavTriggers = desktopNav.replace(/role="menu"[\s\S]*$/i, "");

  for (const token of mustInclude) {
    if (!header.includes(token)) {
      fail(`${label}: header missing "${token}"`);
    } else {
      pass(`${label}: contains "${token}"`);
    }
  }

  for (const token of mustExclude) {
    const scope = token.includes("</a>") ? desktopNavTriggers || desktopNav : header.replace(/aria-label="[^"]*"/g, "");
    if (scope.includes(token)) {
      fail(`${label}: header should not include "${token}"`);
    } else {
      pass(`${label}: excludes "${token}"`);
    }
  }

  const nowrapCount = (header.match(/whitespace-nowrap/g) ?? []).length;
  if (nowrapCount < 4) {
    fail(`${label}: expected multiple whitespace-nowrap classes, got ${nowrapCount}`);
  } else {
    pass(`${label}: ${nowrapCount} whitespace-nowrap classes`);
  }
}

console.log(failed === 0 ? "\nheader layout smoke: PASS" : `\nheader layout smoke: FAIL (${failed})`);
process.exit(failed === 0 ? 0 : 1);
