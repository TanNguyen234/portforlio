"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
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
        ".bento-item",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  // Layout classes for asymmetric bento grid (alternating spans)
  const getBentoColSpan = (index: number) => {
    if (index === 0) return "md:col-span-7";
    if (index === 1) return "md:col-span-5";
    if (index === 2) return "md:col-span-5";
    return "md:col-span-7";
  };

  return (
    <section
      ref={containerRef}
      id="skills"
      className="section-shell"
    >
      <div className="section-inner grid gap-16">
        <SectionHeading
          title={ui.sections.skills.title}
          description={ui.sections.skills.description}
        />
        
        {/* Asymmetric Gapless Bento Grid */}
        <div className="grid gap-6 md:grid-cols-12 auto-rows-fr">
          {data.skills.categories.map((category, index) => (
            <div
              key={category.title}
              className={`bento-item opacity-0 ${getBentoColSpan(index)}`}
            >
              <div className="double-bezel-outer h-full">
                <div className="double-bezel-inner h-full flex flex-col justify-between gap-6 relative overflow-hidden group">
                  
                  {/* Subtle ambient light inside card */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-500/[0.02] group-hover:bg-teal-500/[0.04] rounded-full blur-3xl pointer-events-none transition-colors duration-500" />
                  
                  <div className="space-y-2">
                    <p className="text-[9px] font-mono tracking-widest text-white/30 uppercase">
                      Category 0{index + 1}
                    </p>
                    <h3 className="text-base font-medium text-white/90">
                      {category.title}
                    </h3>
                  </div>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5 text-xs font-light text-white/50">
                    {category.items.map((item) => (
                      <li key={item} className="flex items-center gap-3 group/item">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/10 group-hover/item:bg-white/40 transition-colors shrink-0" />
                        <span className="group-hover/item:text-white/80 transition-colors">{item}</span>
                      </li>
                    ))}
                  </ul>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
