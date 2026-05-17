import SectionHeading from "@/components/ui/SectionHeading";
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
              className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70"
            >
              {achievement}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
