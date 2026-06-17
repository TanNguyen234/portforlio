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
      className="section-shell"
    >
      <div className="section-inner grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-start">
        
        {/* Left Editorial Section */}
        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow={ui.sections.about.eyebrow}
            title={data.about.title}
          />
          <Reveal>
            <p className="text-xl sm:text-2xl font-extralight text-white/90 leading-relaxed max-w-2xl selection:bg-teal-500/20">
              {data.about.body[0]}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-sm md:text-base font-light text-white/50 leading-relaxed max-w-2xl selection:bg-teal-500/20">
              {data.about.body[1]}
            </p>
          </Reveal>
        </div>

        {/* Right Double-Bezel Education Card */}
        <Reveal delay={0.2}>
          <div className="double-bezel-outer">
            <div className="double-bezel-inner flex flex-col gap-6 relative overflow-hidden">
              
              {/* Subtle design element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="p-2 rounded-full bg-white/5 border border-white/10 text-white/70">
                  <GraduationCap className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-[0.25em] text-white/40 uppercase">
                    {ui.sections.about.educationLabel}
                  </p>
                  <h3 className="text-sm font-medium text-white/90 mt-0.5">
                    {data.about.education.school}
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="h-4 w-4 text-white/40 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-mono tracking-wider text-white/30 uppercase">Major</p>
                    <p className="text-xs text-white/70 font-light mt-0.5">{data.about.education.major}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-white/40 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-mono tracking-wider text-white/30 uppercase">Period</p>
                    <p className="text-xs text-white/70 font-light mt-0.5">{data.about.education.period}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-white/5">
                  <Award className="h-4 w-4 text-white/40 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-mono tracking-wider text-white/30 uppercase">Achievement</p>
                    <p className="text-xs text-white/60 font-light mt-0.5 leading-relaxed">{data.about.education.desc}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}


