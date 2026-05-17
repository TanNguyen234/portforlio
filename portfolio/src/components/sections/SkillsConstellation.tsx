import SectionHeading from "@/components/ui/SectionHeading";
import SkillField from "@/components/skills/SkillField";
import type { PortfolioData } from "@/lib/portfolio";
import type { UiText } from "@/lib/i18n";

export default function SkillsConstellation({
  data,
  ui,
}: {
  data: PortfolioData;
  ui: UiText;
}) {
  return (
    <section
      id="skills"
      data-accent="#7cf4ff"
      className="section-shell"
    >
      <div className="section-inner grid gap-12">
        <SectionHeading
          eyebrow={ui.sections.skills.eyebrow}
          title={ui.sections.skills.title}
          description={ui.sections.skills.description}
        />
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <SkillField labels={data.skills.constellation} />
          </div>
          <div className="flex flex-col gap-6">
            {data.skills.categories.map((category) => (
              <div
                key={category.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-lg font-semibold text-white">
                  {category.title}
                </h3>
                <ul className="mt-4 grid gap-2 text-sm text-white/60">
                  {category.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
