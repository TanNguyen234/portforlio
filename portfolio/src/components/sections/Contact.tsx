import GlassCard from "@/components/ui/GlassCard";
import MagneticButton from "@/components/ui/MagneticButton";
import SectionHeading from "@/components/ui/SectionHeading";
import { Mail, Phone, MapPin, Download } from "lucide-react";
import { Github, Linkedin } from "@/components/icons/BrandIcons";
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
        <GlassCard className="flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="grid gap-4 text-sm text-white/70 relative z-10">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[#7cf4ff]" />
              <span>{data.contact.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#7cf4ff]" />
              <a href={`mailto:${data.contact.email}`} className="hover:text-white transition-colors">{data.contact.email}</a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-[#7cf4ff]" />
              <span>{data.contact.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Github className="h-4 w-4 text-[#7cf4ff]" />
              <a
                href={data.contact.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors underline decoration-white/20"
              >
                {data.contact.github}
              </a>
            </div>
            {data.contact.linkedin ? (
              <div className="flex items-center gap-3">
                <Linkedin className="h-4 w-4 text-[#7cf4ff]" />
                <a
                  href={data.contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors underline decoration-white/20"
                >
                  {ui.contact.linkedin}
                </a>
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-4 relative z-10">
            <MagneticButton
              className="border-white/20 bg-transparent flex items-center gap-2"
              href={`mailto:${data.contact.email}`}
            >
              <Mail className="h-4 w-4" />
              {ui.contact.email}
            </MagneticButton>
            {data.contact.cv ? (
              <MagneticButton
                className="border-white/20 bg-transparent flex items-center gap-2"
                href={data.contact.cv}
                target="_blank"
                rel="noreferrer"
              >
                <Download className="h-4 w-4" />
                {ui.contact.cv}
              </MagneticButton>
            ) : null}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

