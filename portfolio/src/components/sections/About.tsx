import CyberCard from "@/components/ui/CyberCard";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { GraduationCap, BookOpen, Calendar, Award } from "lucide-react";
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
      data-accent="#ffe600"
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
        <Reveal delay={0.15}>
          <CyberCard accentColor="#ffe600" className="flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-[color:var(--accent-current)] relative z-10">
              <GraduationCap className="h-4.5 w-4.5" />
              {ui.sections.about.educationLabel}
            </p>
            <div className="space-y-4 relative z-10">
              <h3 className="text-lg font-semibold text-white">
                {data.about.education.school}
              </h3>
              <p className="text-sm text-white/70 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-teal-400/80" />
                {data.about.education.major}
              </p>
              <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                <p className="text-sm text-white/50 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-white/30" />
                  {data.about.education.period}
                </p>
                <p className="text-sm text-white/50 flex items-center gap-2">
                  <Award className="h-4 w-4 text-white/30" />
                  GPA {data.about.education.gpa}
                </p>
              </div>
            </div>
          </CyberCard>
        </Reveal>
      </div>
    </section>
  );
}

