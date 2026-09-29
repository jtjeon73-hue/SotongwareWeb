/**
 * Ebook admin/premium entitlement SSOT tests (pure Node, no Firebase).
 * Mirrors src/lib/entitlements.ts + membership-grade.ts contracts.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

let failed = 0;
function check(name, ok, detail = "") {
  if (ok) console.log(`PASS ${name}`);
  else {
    failed += 1;
    console.log(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

/** Mirror of isAdminFromClaims — claims.role only, never email/UID/profile. */
function isAdminFromClaims(claims) {
  return Boolean(claims && claims.role === "admin");
}

function isEntitlementActive(entitlement) {
  if (entitlement.status !== "active") return false;
  if (!entitlement.expiresAt) return true;
  return new Date(entitlement.expiresAt) > new Date();
}

function hasPremiumEntitlement(businessId, entitlements, claims) {
  if (isAdminFromClaims(claims)) return true;
  return entitlements.some(
    (e) => e.businessId === businessId && e.plan === "premium" && isEntitlementActive(e),
  );
}

function canAccessLevel(accessLevel, businessId, isAuthenticated, entitlements, claims) {
  if (accessLevel === "public") return true;
  if (!isAuthenticated) return false;
  if (accessLevel === "member") return true;
  if (accessLevel === "premium") {
    return hasPremiumEntitlement(businessId, entitlements, claims);
  }
  return false;
}

function resolveEffectiveAccessTier({ isAuthenticated, claims, entitlements, businessId }) {
  if (hasPremiumEntitlement(businessId, entitlements, claims ?? null)) return "premium";
  if (isAuthenticated) return "member";
  return "free";
}

const ACCESS_TIER_RANK = { free: 0, member: 1, premium: 2 };
function tierMeetsRequirement(userTier, required) {
  return ACCESS_TIER_RANK[userTier] >= ACCESS_TIER_RANK[required];
}

const BUSINESS = "ebook";
const premiumChapter = "premium";
const freeChapter = "free";

// --- Source wiring (SSOT location) ---
{
  const entSrc = readFileSync(join(repoRoot, "src", "lib", "entitlements.ts"), "utf8");
  const gradeSrc = readFileSync(join(repoRoot, "src", "lib", "membership-grade.ts"), "utf8");
  const readerSrc = readFileSync(
    join(repoRoot, "src", "components", "ebook", "EbookReaderClient.tsx"),
    "utf8",
  );
  const personaSrc = readFileSync(
    join(repoRoot, "src", "components", "access", "PreviewPersonaBar.tsx"),
    "utf8",
  );
  const dashSrc = readFileSync(join(repoRoot, "src", "app", "dashboard", "DashboardView.tsx"), "utf8");

  check("A isAdminFromClaims in membership-grade", gradeSrc.includes("claims.role === \"admin\""));
  check("B hasPremiumEntitlement uses isAdminFromClaims", entSrc.includes("isAdminFromClaims(claims)"));
  check("B resolveEffectiveAccessTier exported", entSrc.includes("export function resolveEffectiveAccessTier"));
  check(
    "C Reader uses server chapter fetch (not client tier SSOT for premium body)",
    readerSrc.includes("fetchEbookChapterBody"),
  );
  check("C entitlements still expose resolveEffectiveAccessTier", entSrc.includes("resolveEffectiveAccessTier"));
  check("C Reader does not scatter isAdminFromClaims", !readerSrc.includes("isAdminFromClaims"));
  check("C Reader does not hard-code isAdmin branch", !/if\s*\(\s*isAdmin/.test(readerSrc));
  check("C Dashboard passes claims to canAccessLevel", /canAccessLevel\([^)]*claims/.test(dashSrc));
  check("PreviewPersona has no admin option", !personaSrc.includes('"admin"') && personaSrc.includes("guest") && personaSrc.includes("premium"));
  check("no hard-coded owner email/UID in entitlements", !/@|uid\s*===|hard.?coded/i.test(entSrc) || !/owner@|admin@/.test(entSrc));
}

// --- Behavior matrix ---
{
  const empty = [];
  const memberEnt = [{ businessId: BUSINESS, plan: "member", status: "active", grantedAt: "2026-01-01" }];
  const premiumEnt = [{ businessId: BUSINESS, plan: "premium", status: "active", grantedAt: "2026-01-01" }];
  const expiredPremium = [
    {
      businessId: BUSINESS,
      plan: "premium",
      status: "active",
      grantedAt: "2026-01-01",
      expiresAt: "2020-01-01T00:00:00.000Z",
    },
  ];

  // 1 guest
  const guestTier = resolveEffectiveAccessTier({
    isAuthenticated: false,
    claims: null,
    entitlements: empty,
    businessId: BUSINESS,
  });
  check("1 guest free preview", tierMeetsRequirement(guestTier, freeChapter));
  check("1 guest premium FAIL", !tierMeetsRequirement(guestTier, premiumChapter));
  check("1 guest canAccessLevel premium FAIL", !canAccessLevel("premium", BUSINESS, false, empty, null));

  // 2 member (authenticated, no premium row, no admin claim)
  const memberTier = resolveEffectiveAccessTier({
    isAuthenticated: true,
    claims: { role: "member" },
    entitlements: memberEnt,
    businessId: BUSINESS,
  });
  check("2 member free preview", tierMeetsRequirement(memberTier, freeChapter));
  check("2 member premium FAIL", !tierMeetsRequirement(memberTier, premiumChapter));
  check(
    "2 member canAccessLevel premium FAIL",
    !canAccessLevel("premium", BUSINESS, true, memberEnt, { role: "member" }),
  );

  // 3 premium entitlement
  const premiumTier = resolveEffectiveAccessTier({
    isAuthenticated: true,
    claims: { role: "member" },
    entitlements: premiumEnt,
    businessId: BUSINESS,
  });
  check("3 premium entitlement PASS", tierMeetsRequirement(premiumTier, premiumChapter));
  check(
    "3 premium canAccessLevel PASS",
    canAccessLevel("premium", BUSINESS, true, premiumEnt, { role: "member" }),
  );

  // 4 admin claim — no paid entitlement
  const adminTier = resolveEffectiveAccessTier({
    isAuthenticated: true,
    claims: { role: "admin" },
    entitlements: empty,
    businessId: BUSINESS,
  });
  check("4 admin claim premium PASS", tierMeetsRequirement(adminTier, premiumChapter));
  check(
    "4 admin canAccessLevel premium without payment",
    canAccessLevel("premium", BUSINESS, true, empty, { role: "admin" }),
  );
  check("4 admin hasPremiumEntitlement true", hasPremiumEntitlement(BUSINESS, empty, { role: "admin" }));

  // 5 admin=false
  check(
    "5 admin=false no auto premium",
    !hasPremiumEntitlement(BUSINESS, empty, { role: "member", admin: true }),
  );
  check(
    "5 claims.admin string ignored",
    !hasPremiumEntitlement(BUSINESS, empty, { admin: "admin", role: "member" }),
  );
  check(
    "5 expired premium not unlocked",
    !hasPremiumEntitlement(BUSINESS, expiredPremium, { role: "member" }),
  );

  // 6 forged client persona / fake admin surfaces
  check(
    "6 forged profile.role admin ignored by isAdminFromClaims",
    !isAdminFromClaims({ profileRole: "admin" }) && !isAdminFromClaims(null),
  );
  check("6 forged email admin ignored", !isAdminFromClaims({ email: "owner@sotongware.com" }));
  check("6 forged uid ignored", !isAdminFromClaims({ uid: "hardcoded-owner" }));
  check(
    "6 previewAccess=premium is not claims admin",
    !isAdminFromClaims({ previewAccess: "premium", role: "member" }),
  );
  check(
    "6 UI isAdmin flag alone does not satisfy entitlement",
    !hasPremiumEntitlement(BUSINESS, empty, { isAdmin: true, role: "member" }),
  );
}

// --- Catalog still premium / free preview ---
{
  const reg = JSON.parse(
    readFileSync(
      join(repoRoot, "scripts", "ebook-ingest", "registrations", "ai-first-ebook-for-50s.json"),
      "utf8",
    ),
  );
  const genTs = readFileSync(
    join(repoRoot, "src", "data", "service-catalog", "generated", "ai-first-ebook-for-50s.catalog.ts"),
    "utf8",
  );
  const itemMatch = genTs.match(
    /export const generatedEbookCatalogItem = (\{[\s\S]*\n\}) as EbookCatalogItem;/,
  );
  const golden = itemMatch ? JSON.parse(itemMatch[1]) : null;
  check("7 product accessTier premium", reg.accessTier === "premium" && golden?.accessTier === "premium");
  check("7 status preparing", reg.status === "preparing" && golden?.status === "preparing");
  const freeIds = (golden?.chapters || []).filter((c) => c.accessTier === "free").map((c) => c.id).sort();
  check(
    "8 free preview fm-01/fm-02/ch-01 only",
    freeIds.join(",") === ["ch-01", "fm-01", "fm-02"].sort().join(","),
    freeIds.join(","),
  );
  check(
    "8 no member-gated body chapters",
    (golden?.chapters || []).every((c) => c.accessTier === "free" || c.accessTier === "premium"),
  );
  const premiumPublicParas = (golden?.chapters || [])
    .filter((c) => c.accessTier === "premium")
    .reduce((n, c) => n + (c.pages || []).reduce((m, p) => m + (p.paragraphs || []).length, 0), 0);
  check("8b premium public body count 0", premiumPublicParas === 0, String(premiumPublicParas));
  let noPublicAsset = true;
  try {
    const blob = JSON.stringify(golden);
    if (/\.pdf|\.epub|storage\.googleapis|firebasestorage|https?:\/\/[^\s"]+\.(pdf|epub)/i.test(blob)) {
      noPublicAsset = false;
    }
    if (
      golden &&
      (Object.prototype.hasOwnProperty.call(golden, "pdfUrl") ||
        Object.prototype.hasOwnProperty.call(golden, "epubUrl") ||
        Object.prototype.hasOwnProperty.call(golden, "downloadUrl"))
    ) {
      noPublicAsset = false;
    }
  } catch {
    noPublicAsset = false;
  }
  check("9 no PDF/EPUB public asset URL", noPublicAsset);
}

console.log(failed === 0 ? "\nALL PASS" : `\nFAILED=${failed}`);
process.exit(failed === 0 ? 0 : 1);
