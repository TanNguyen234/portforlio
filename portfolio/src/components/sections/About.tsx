import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import type { PortfolioData } from "@/lib/portfolio";
import type { UiText } from "@/lib/i18n";

export default function About({
  data,
  ui,
}: {
  data: PortfolioData;
  ui: UiText;
}) {
  return (
    <section
      id="about"
      data-accent="#7cffc2"
      className="section-shell"
    >
      <div className="section-inner grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col gap-10">
          <SectionHeading
            eyebrow={ui.sections.about.eyebrow}
            title={data.about.title}
            description={data.about.body[0]}
          />
          <Reveal>
            <p className="text-base md:text-lg text-[color:var(--muted)]">
              {data.about.body[1]}
            </p>
          </Reveal>
        </div>
        <GlassCard className="flex flex-col gap-6">
          <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--accent-current)]">
            {ui.sections.about.educationLabel}
          </p>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              {data.about.education.school}
            </h3>
            <p className="text-sm text-white/70">
              {data.about.education.major}
            </p>
            <p className="text-sm text-white/50">
              {data.about.education.period}
            </p>
            <p className="text-sm text-white/50">
              GPA {data.about.education.gpa}
            </p>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
