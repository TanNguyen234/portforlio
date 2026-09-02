"use client";

import type { PortfolioData } from "@/lib/portfolio";
import type { UiText } from "@/lib/i18n";

interface ExperienceImmersiveProps {
  data: PortfolioData;
  ui: UiText;
}

export function ExperienceImmersive({ data, ui }: ExperienceImmersiveProps) {
  return (
    <section id="experience" className="section-shell py-24 md:py-36">
      <div className="section-inner flex flex-col gap-16">
        {/* Section Header */}
        <div className="flex flex-col gap-3 max-w-3xl">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-teal-400">
            Chronology
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-[#f4f6f8]">
            {ui.sections.experience.title}
          </h2>
          <p className="text-sm sm:text-base font-light text-slate-400 leading-relaxed">
            {ui.sections.experience.description}
          </p>
        </div>

        {/* System Timeline List */}
        <div className="relative border-l border-white/10 ml-2 md:ml-4 flex flex-col gap-12 pl-6 md:pl-12">
          {data.experience.map((item, index) => {
            const num = String(index + 1).padStart(2, "0");
            return (
              <div
                key={item.role}
                className="group relative flex flex-col gap-4 transition-colors"
              >
                {/* Timeline axis tick indicator */}
                <span
                  aria-hidden="true"
                  className="absolute -left-[31px] md:-left-[55px] top-1.5 h-2.5 w-2.5 bg-[#020204] border border-white/20 group-hover:border-teal-400 group-hover:bg-teal-400 transition-all rounded-none"
                />

                {/* Role Header Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
                  {/* Period & Index (4 cols) */}
                  <div className="md:col-span-4 flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="text-[10px] font-mono text-teal-400/80 font-medium"
                    >
                      {num}
                    </span>
                    <span className="text-xs font-mono tracking-[0.18em] uppercase text-white/60">
                      {item.period}
                    </span>
                  </div>

                  {/* Role Title (8 cols) */}
                  <div className="md:col-span-8">
                    <h3 className="text-xl sm:text-2xl font-normal text-white group-hover:text-teal-300 transition-colors">
                      {item.role}
                    </h3>
                  </div>
                </div>

                {/* Summary & Bullet Points */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="hidden md:block md:col-span-4" />
                  <div className="md:col-span-8 flex flex-col gap-4">
                    <p className="text-sm font-light text-slate-300 leading-relaxed">
                      {item.summary}
                    </p>

                    <ul className="flex flex-col gap-2 pt-2 border-t border-white/5">
                      {item.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="text-xs font-light text-slate-400 leading-relaxed flex items-start gap-2.5"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-1.5 h-1 w-1 bg-teal-400/60 shrink-0"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
