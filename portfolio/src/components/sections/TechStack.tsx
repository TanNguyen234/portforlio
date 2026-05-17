import SectionHeading from "@/components/ui/SectionHeading";
import TechIconCard from "@/components/ui/TechIconCard";
import type { PortfolioData } from "@/lib/portfolio";
import type { UiText } from "@/lib/i18n";

export default function TechStack({
  data,
  ui,
}: {
  data: PortfolioData;
  ui: UiText;
}) {
  return (
    <section id="tech" data-accent="#7cffc2" className="section-shell">
      <div className="section-inner grid gap-12">
        <SectionHeading
          eyebrow={ui.sections.tech.eyebrow}
          title={ui.sections.tech.title}
          description={ui.sections.tech.description}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {data.techStack.map((item) => (
            <TechIconCard key={item} label={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
