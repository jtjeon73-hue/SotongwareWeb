import { Button } from "@/components/ui/Button";
import { heroContent } from "@/data/home";
import { siteConfig } from "@/data/navigation";

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-surface-900 text-white"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-brand-900)_0%,_transparent_50%)] opacity-60" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_transparent_60%,_var(--color-surface-900)_100%)]" />

      <div className="container-main relative section-padding px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium tracking-wide text-brand-300">
            {siteConfig.name} · {siteConfig.nameKo}
          </p>
          <h1
            id="hero-heading"
            className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
          >
            {heroContent.headline}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-surface-300 sm:text-lg">
            {heroContent.subheadline}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href={heroContent.primaryCta.href} variant="primary" size="lg">
              {heroContent.primaryCta.label}
            </Button>
            <Button
              href={heroContent.secondaryCta.href}
              variant="secondary"
              size="lg"
              className="!bg-white/10 !text-white !border-white/20 hover:!bg-white/20"
            >
              {heroContent.secondaryCta.label}
            </Button>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { label: "결과물 직접 체험", desc: "앱·웹·콘텐츠" },
            { label: "목적별 서비스 안내", desc: "기술 이름 없이 찾기" },
            { label: "24시간 자동 운영", desc: "디지털 사업 플랫폼" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
            >
              <p className="text-sm font-semibold text-white">{item.label}</p>
              <p className="mt-1 text-xs text-surface-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
