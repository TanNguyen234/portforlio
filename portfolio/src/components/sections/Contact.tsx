import GlassCard from "@/components/ui/GlassCard";
import MagneticButton from "@/components/ui/MagneticButton";
import SectionHeading from "@/components/ui/SectionHeading";
import type { PortfolioData } from "@/lib/portfolio";
import type { UiText } from "@/lib/i18n";

export default function Contact({
  data,
  ui,
}: {
  data: PortfolioData;
  ui: UiText;
}) {
  return (
    <section id="contact" data-accent="#7cf4ff" className="section-shell">
      <div className="section-inner grid gap-12">
        <SectionHeading
          eyebrow={ui.sections.contact.eyebrow}
          title={ui.sections.contact.title}
          description={ui.sections.contact.description}
        />
        <GlassCard className="flex flex-col gap-6">
          <div className="grid gap-3 text-sm text-white/70">
            <p>{data.contact.location}</p>
            <p>{data.contact.email}</p>
            <p>{data.contact.phone}</p>
            <a
              href={data.contact.github}
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--accent-current)]"
            >
              {data.contact.github}
            </a>
            {data.contact.linkedin ? (
              <a
                href={data.contact.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--accent-current)]"
              >
                {ui.contact.linkedin}
              </a>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-4">
            <MagneticButton
              className="border-white/20 bg-transparent"
              href={`mailto:${data.contact.email}`}
            >
              {ui.contact.email}
            </MagneticButton>
            <MagneticButton
              className="border-white/20 bg-transparent"
              href={data.contact.github}
              target="_blank"
              rel="noreferrer"
            >
              {ui.contact.github}
            </MagneticButton>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
