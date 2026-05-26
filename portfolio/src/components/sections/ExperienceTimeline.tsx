"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import CyberCard from "@/components/ui/CyberCard";
import type { PortfolioData } from "@/lib/portfolio";
import type { UiText } from "@/lib/i18n";

export default function ExperienceTimeline({
  data,
  ui,
}: {
  data: PortfolioData;
  ui: UiText;
}) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const line = lineRef.current;
      const section = sectionRef.current;
      if (!line || !section) return;

      gsap.fromTo(
        line,
        { scaleY: 0.1 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom center",
            scrub: 0.5,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="experience"
      data-accent="#bc13fe"
      className="section-shell"
      ref={sectionRef}
    >
      <div className="section-inner grid gap-12">
        <SectionHeading
          eyebrow={ui.sections.experience.eyebrow}
          title={ui.sections.experience.title}
          description={ui.sections.experience.description}
        />
        <div className="relative grid gap-8 lg:grid-cols-[80px_1fr]">
          <div className="relative hidden lg:block">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10" />
            <div
              ref={lineRef}
              className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-[color:var(--accent-current)] via-white/40 to-transparent origin-top will-change-transform"
            />
          </div>
          <div className="flex flex-col gap-6">
            {data.experience.map((item, idx) => (
              <Reveal key={item.role} delay={idx * 0.1}>
                <CyberCard accentColor="#bc13fe" className="w-full">
                  <div className="flex flex-col gap-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                      {item.period}
                    </p>
                    <h3 className="text-xl font-semibold text-white">
                      {item.role}
                    </h3>
                    <p className="text-sm text-white/70">{item.summary}</p>
                    <ul className="grid gap-2 text-sm text-white/60">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-current)]" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CyberCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
