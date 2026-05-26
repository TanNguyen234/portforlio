"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SectionHeading from "@/components/ui/SectionHeading";
import SkillField from "@/components/skills/SkillField";
import CyberCard from "@/components/ui/CyberCard";
import type { PortfolioData } from "@/lib/portfolio";
import type { UiText } from "@/lib/i18n";

export default function SkillsConstellation({
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

      gsap.fromTo(
        ".skills-constellation-box",
        { opacity: 0, scale: 0.96, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".skills-constellation-box",
            start: "top 90%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".skills-category-card",
        { opacity: 0, x: 30, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".skills-categories-list",
            start: "top 90%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="skills"
      data-accent="#39ff14"
      className="section-shell"
    >
      <div className="section-inner grid gap-12">
        <SectionHeading
          eyebrow={ui.sections.skills.eyebrow}
          title={ui.sections.skills.title}
          description={ui.sections.skills.description}
        />
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="skills-constellation-box aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-white/5 opacity-0">
            <SkillField labels={data.skills.constellation} />
          </div>
          <div className="skills-categories-list flex flex-col gap-6">
            {data.skills.categories.map((category) => (
              <div key={category.title} className="skills-category-card opacity-0">
                <CyberCard
                  accentColor="#39ff14"
                  className="w-full"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {category.title}
                  </h3>
                  <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-white/60">
                    {category.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-[#39ff14]/75" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CyberCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
