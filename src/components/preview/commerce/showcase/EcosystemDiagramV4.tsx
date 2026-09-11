/**
 * V4 ecosystem diagram — pure SVG (no overlay positioning).
 * Flow: Industry → Create → K-Content → World → Membership
 */
export function EcosystemDiagramV4({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 680 400"
      className={className}
      role="img"
      aria-label="산업기술에서 제작과 K-콘텐츠를 거쳐 세계 고객, 회원·수익으로 이어지는 SotongWare 생태계"
    >
      <defs>
        <linearGradient id="v4Flow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
          <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.95" />
          <stop offset="75%" stopColor="#f472b6" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id="v4Glow" cx="50%" cy="42%" r="52%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
        <filter id="v4Soft" x="-15%" y="-15%" width="130%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#020617" floodOpacity="0.4" />
        </filter>
        <pattern id="v4Grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0V28" fill="none" stroke="#94a3b8" strokeOpacity="0.1" strokeWidth="1" />
        </pattern>
        <marker id="v4Arrow" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
          <path d="M0 0l7 3.5L0 7z" fill="#67e8f9" />
        </marker>
        <linearGradient id="nCyan" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
        <linearGradient id="nBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="nPink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0abfc" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
        <linearGradient id="nAmber" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="nGreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>

      <rect width="680" height="400" fill="url(#v4Grid)" />
      <circle cx="340" cy="170" r="125" fill="url(#v4Glow)" />

      <path
        d="M110 195 C185 100, 255 100, 340 175 C415 250, 495 265, 575 195"
        fill="none"
        stroke="url(#v4Flow)"
        strokeWidth="3"
        strokeLinecap="round"
        markerEnd="url(#v4Arrow)"
      />
      <path
        d="M265 125 C295 165, 310 215, 335 255"
        fill="none"
        stroke="#f472b6"
        strokeOpacity="0.4"
        strokeWidth="1.5"
        strokeDasharray="4 5"
      />

      {[
        [155, 140],
        [240, 120],
        [315, 155],
        [400, 220],
        [485, 250],
        [545, 210],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.2 + (i % 2)} fill="#a5f3fc" opacity={0.5 + i * 0.06} />
      ))}

      {/* Depth cards */}
      <g filter="url(#v4Soft)">
        <path d="M30 155h112v70a16 16 0 0 1-16 16H46a16 16 0 0 1-16-16v-70z" fill="#071628" />
        <rect x="30" y="148" width="112" height="78" rx="16" fill="#0c223d" stroke="#22d3ee" strokeWidth="1.6" />

        <path d="M205 55h128v70a16 16 0 0 1-16 16H221a16 16 0 0 1-16-16V55z" fill="#071628" />
        <rect x="205" y="48" width="128" height="78" rx="16" fill="#0c223d" stroke="#38bdf8" strokeWidth="1.6" />

        <path d="M255 268h150v70a16 16 0 0 1-16 16H271a16 16 0 0 1-16-16v-70z" fill="#071628" />
        <rect x="255" y="260" width="150" height="78" rx="16" fill="#0c223d" stroke="#f472b6" strokeWidth="1.6" />

        <path d="M430 55h128v70a16 16 0 0 1-16 16H446a16 16 0 0 1-16-16V55z" fill="#071628" />
        <rect x="430" y="48" width="128" height="78" rx="16" fill="#0c223d" stroke="#fbbf24" strokeWidth="1.6" />

        <path d="M538 155h112v70a16 16 0 0 1-16 16H554a16 16 0 0 1-16-16v-70z" fill="#071628" />
        <rect x="538" y="148" width="112" height="78" rx="16" fill="#0c223d" stroke="#34d399" strokeWidth="1.6" />
      </g>

      {/* Mini pictograms */}
      <g transform="translate(68 158)">
        <path d="M0 10l10-5 10 5v10l-10 5-10-5V10z" fill="url(#nCyan)" />
        <circle cx="22" cy="4" r="5" fill="none" stroke="#a5f3fc" strokeWidth="1.2" />
      </g>
      <g transform="translate(250 58)">
        <rect x="0" y="0" width="14" height="24" rx="2.5" fill="url(#nBlue)" />
        <rect x="2" y="3" width="10" height="14" rx="1" fill="#0f172a" opacity="0.45" />
      </g>
      <g transform="translate(312 272)">
        <rect x="0" y="0" width="20" height="14" rx="2" fill="url(#nPink)" />
        <path d="M7 4l7 3.5L7 11V4z" fill="#fff" opacity="0.9" />
        <circle cx="28" cy="12" r="4" fill="#db2777" />
      </g>
      <g transform="translate(478 58)">
        <circle cx="10" cy="10" r="9" fill="none" stroke="url(#nAmber)" strokeWidth="2" />
        <circle cx="10" cy="10" r="2" fill="#fde68a" />
        <path d="M10 4v3M10 13v3M4 10h3M13 10h3" stroke="#fcd34d" strokeWidth="1.1" />
      </g>
      <g transform="translate(576 160)">
        <path d="M8 0l3 6h7l-5.5 4 2 7L8 13l-6.5 4 2-7L-2 6h7L8 0z" fill="url(#nGreen)" transform="translate(8 2)" />
      </g>

      <text x="86" y="208" textAnchor="middle" fill="#f8fafc" fontSize="12" fontFamily="system-ui,sans-serif" fontWeight="600">
        산업기술
      </text>
      <text x="86" y="224" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="system-ui,sans-serif">
        Automation
      </text>

      <text x="269" y="105" textAnchor="middle" fill="#f8fafc" fontSize="12" fontFamily="system-ui,sans-serif" fontWeight="600">
        제작·상품화
      </text>
      <text x="269" y="121" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="system-ui,sans-serif">
        App · Ebook · Site
      </text>

      <text x="330" y="318" textAnchor="middle" fill="#f8fafc" fontSize="12" fontFamily="system-ui,sans-serif" fontWeight="600">
        K-Content
      </text>
      <text x="330" y="334" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="system-ui,sans-serif">
        Music · Shorts · Comic
      </text>

      <text x="494" y="105" textAnchor="middle" fill="#f8fafc" fontSize="12" fontFamily="system-ui,sans-serif" fontWeight="600">
        세계 고객
      </text>
      <text x="494" y="121" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="system-ui,sans-serif">
        Global Reach
      </text>

      <text x="594" y="208" textAnchor="middle" fill="#f8fafc" fontSize="12" fontFamily="system-ui,sans-serif" fontWeight="600">
        회원·수익
      </text>
      <text x="594" y="224" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="system-ui,sans-serif">
        Basic · Pay
      </text>
    </svg>
  );
}
