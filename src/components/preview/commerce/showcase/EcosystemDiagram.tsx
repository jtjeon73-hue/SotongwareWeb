/**
 * Code-only ecosystem diagram for V3 hero.
 * Story: Industry tech → products → world customers → membership & revenue
 */
export function EcosystemDiagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 360"
      className={className}
      role="img"
      aria-label="산업기술에서 콘텐츠 제작, 세계 고객, 회원·결제·수익으로 이어지는 SotongWare 생태계"
    >
      <defs>
        <linearGradient id="ecoFlow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f472b6" stopOpacity="0.7" />
        </linearGradient>
        <radialGradient id="ecoGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
        <pattern id="ecoGrid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="#94a3b8" strokeOpacity="0.12" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="640" height="360" fill="url(#ecoGrid)" />
      <circle cx="320" cy="180" r="120" fill="url(#ecoGlow)" />

      {/* Flow path */}
      <path
        d="M70 180 C160 80, 240 80, 320 180 C400 280, 480 280, 570 180"
        fill="none"
        stroke="url(#ecoFlow)"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="motion-safe:opacity-100"
      />
      {/* Particles along path */}
      {[
        [120, 130],
        [200, 110],
        [280, 150],
        [360, 210],
        [440, 250],
        [520, 210],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.5 + (i % 2)} fill="#67e8f9" opacity={0.55 + i * 0.05} />
      ))}

      {/* Nodes */}
      <g>
        <rect x="28" y="145" width="88" height="70" rx="14" fill="#0b1f3a" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="72" y="175" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="system-ui,sans-serif">
          산업기술
        </text>
        <text x="72" y="193" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="system-ui,sans-serif">
          Automation
        </text>
      </g>
      <g>
        <rect x="210" y="55" width="120" height="70" rx="14" fill="#0b1f3a" stroke="#22d3ee" strokeWidth="1.5" />
        <text x="270" y="85" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="system-ui,sans-serif">
          제작·상품화
        </text>
        <text x="270" y="103" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="system-ui,sans-serif">
          App · Ebook · Site
        </text>
      </g>
      <g>
        <rect x="250" y="235" width="140" height="70" rx="14" fill="#0b1f3a" stroke="#f472b6" strokeWidth="1.5" />
        <text x="320" y="265" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="system-ui,sans-serif">
          K-Content
        </text>
        <text x="320" y="283" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="system-ui,sans-serif">
          Music · Shorts · Comic
        </text>
      </g>
      <g>
        <rect x="430" y="55" width="120" height="70" rx="14" fill="#0b1f3a" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="490" y="85" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="system-ui,sans-serif">
          세계 고객
        </text>
        <text x="490" y="103" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="system-ui,sans-serif">
          Global Reach
        </text>
      </g>
      <g>
        <rect x="524" y="145" width="96" height="70" rx="14" fill="#0b1f3a" stroke="#34d399" strokeWidth="1.5" />
        <text x="572" y="175" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="system-ui,sans-serif">
          회원·수익
        </text>
        <text x="572" y="193" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="system-ui,sans-serif">
          Basic · Pay
        </text>
      </g>

      {/* Soft connector lines */}
      <path d="M116 170 L210 100" stroke="#38bdf8" strokeOpacity="0.35" strokeWidth="1" />
      <path d="M270 125 L270 235" stroke="#f472b6" strokeOpacity="0.3" strokeWidth="1" />
      <path d="M330 125 L430 100" stroke="#fbbf24" strokeOpacity="0.35" strokeWidth="1" />
      <path d="M550 125 L560 145" stroke="#34d399" strokeOpacity="0.4" strokeWidth="1" />
    </svg>
  );
}
