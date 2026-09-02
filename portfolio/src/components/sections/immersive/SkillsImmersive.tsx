"use client";

import type { PortfolioData } from "@/lib/portfolio";
import type { UiText } from "@/lib/i18n";

interface SkillsImmersiveProps {
  data: PortfolioData;
  ui: UiText;
}

export function SkillsImmersive({ data, ui }: SkillsImmersiveProps) {
  return (
    <section id="skills" className="section-shell py-24 md:py-36">
      <div className="section-inner flex flex-col gap-16">
        {/* Section Header */}
        <div className="flex flex-col gap-3 max-w-3xl">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-teal-400">
            Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-[#f4f6f8]">
            {ui.sections.skills.title}
          </h2>
          <p className="text-sm sm:text-base font-light text-slate-400 leading-relaxed">
            {ui.sections.skills.description}
          </p>
        </div>

        {/* Computational Capability Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 items-start">
          {data.skills.categories.map((category, index) => {
            const num = String(index + 1).padStart(2, "0");
            return (
              <div
                key={category.title}
                className="flex flex-col gap-6 border-t border-white/15 pt-6"
              >
                {/* Category Header */}
                <div className="flex flex-col gap-1">
                  <span
                    aria-hidden="true"
                    className="text-[10px] font-mono text-teal-400/80 font-medium"
                  >
                    {num}
                  </span>
                  <h3 className="text-base font-medium text-white tracking-wide">
                    {category.title}
                  </h3>
                </div>

                {/* Technology Tokens */}
                <ul className="flex flex-col gap-3">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="group/item flex items-center gap-3 text-xs font-light text-slate-300 hover:text-white transition-colors"
                    >
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 bg-teal-400/50 group-hover/item:bg-teal-400 transition-colors shrink-0"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
