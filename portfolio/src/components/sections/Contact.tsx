"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import CyberCard from "@/components/ui/CyberCard";
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
  const containerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      tl.fromTo(
        ".contact-card",
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }
      );

      tl.fromTo(
        ".contact-item",
        { opacity: 0, x: -15 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out", stagger: 0.08 },
        "-=0.4"
      );

      tl.fromTo(
        ".contact-btn",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.1 },
        "-=0.3"
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} id="contact" data-accent="#00f0ff" className="section-shell">
      <div className="section-inner grid gap-12">
        <SectionHeading
          eyebrow={ui.sections.contact.eyebrow}
          title={ui.sections.contact.title}
          description={ui.sections.contact.description}
        />
        <div className="contact-card opacity-0">
          <CyberCard accentColor="#00f0ff" className="flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="grid gap-4 text-sm text-white/70 relative z-10">
              <div className="contact-item flex items-center gap-3 opacity-0">
                <MapPin className="h-4 w-4 text-[#7cf4ff]" />
                <span>{data.contact.location}</span>
              </div>
              <div className="contact-item flex items-center gap-3 opacity-0">
                <Mail className="h-4 w-4 text-[#7cf4ff]" />
                <a href={`mailto:${data.contact.email}`} className="hover:text-white transition-colors">{data.contact.email}</a>
              </div>
              <div className="contact-item flex items-center gap-3 opacity-0">
                <Phone className="h-4 w-4 text-[#7cf4ff]" />
                <span>{data.contact.phone}</span>
              </div>
              <div className="contact-item flex items-center gap-3 opacity-0">
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
                <div className="contact-item flex items-center gap-3 opacity-0">
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
              <div className="contact-btn opacity-0">
                <MagneticButton
                  className="border-white/20 bg-transparent flex items-center gap-2"
                  href={`mailto:${data.contact.email}`}
                >
                  <Mail className="h-4 w-4" />
                  {ui.contact.email}
                </MagneticButton>
              </div>
              {data.contact.cv ? (
                <div className="contact-btn opacity-0">
                  <MagneticButton
                    className="border-white/20 bg-transparent flex items-center gap-2"
                    href={data.contact.cv}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Download className="h-4 w-4" />
                    {ui.contact.cv}
                  </MagneticButton>
                </div>
              ) : null}
            </div>
          </CyberCard>
        </div>
      </div>
    </section>
  );
}
