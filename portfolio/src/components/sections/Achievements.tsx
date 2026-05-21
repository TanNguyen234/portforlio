import SectionHeading from "@/components/ui/SectionHeading";
import { Award } from "lucide-react";
import type { PortfolioData } from "@/lib/portfolio";
import type { UiText } from "@/lib/i18n";

export default function Achievements({
  data,
  ui,
}: {
  data: PortfolioData;
  ui: UiText;
}) {
  return (
    <section
      id="achievements"
      data-accent="#ffb869"
      className="section-shell"
    >
      <div className="section-inner grid gap-12">
        <SectionHeading
          eyebrow={ui.sections.achievements.eyebrow}
          title={ui.sections.achievements.title}
          description={ui.sections.achievements.description}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {data.achievements.map((achievement) => (
            <div
              key={achievement}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70 flex items-start gap-4 relative overflow-hidden group hover:border-white/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-3 text-orange-400 shrink-0 relative z-10">
                <Award className="h-5 w-5" />
              </div>
              <span className="relative z-10 leading-relaxed">{achievement}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

