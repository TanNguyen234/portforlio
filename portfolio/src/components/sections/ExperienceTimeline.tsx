"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
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
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="experience"
      className="section-shell"
      ref={sectionRef}
    >
      <div className="section-inner grid gap-16">
        <SectionHeading
          title={ui.sections.experience.title}
          description={ui.sections.experience.description}
        />
        <div className="relative grid gap-8 lg:grid-cols-[60px_1fr]">
          {/* Timeline center line */}
          <div className="relative hidden lg:block">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/5" />
            <div
              ref={lineRef}
              className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-white/30 via-white/50 to-transparent origin-top will-change-transform"
            />
          </div>

          <div className="flex flex-col gap-8">
            {data.experience.map((item, idx) => (
              <Reveal key={item.role} delay={idx * 0.08}>
                <div className="w-full bg-[#0a0a0c]/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 sm:p-8 hover:border-white/10 hover:bg-[#0a0a0c]/60 hover:scale-[1.005] transition-all duration-300 shadow-xl relative group">
                  
                  {/* Subtle hover timeline indicator for item */}
                  <div className="absolute left-[-39px] top-8 hidden lg:block h-2 w-2 rounded-full bg-white/10 group-hover:bg-white/40 border border-white/20 transition-colors z-10 translate-x-[-1px]" />

                  <div className="flex flex-col gap-4">
                    <p className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                      {item.period}
                    </p>
                    <h3 className="text-lg font-medium text-white/90">
                      {item.role}
                    </h3>
                    <p className="text-sm font-light text-white/60 leading-relaxed max-w-3xl">
                      {item.summary}
                    </p>
                    
                    <ul className="grid gap-2 text-xs font-light text-white/45 max-w-3xl pt-2 border-t border-white/5">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2.5 leading-relaxed">
                          <span className="h-1.5 w-1.5 rounded-full bg-white/20 mt-1.5 shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

