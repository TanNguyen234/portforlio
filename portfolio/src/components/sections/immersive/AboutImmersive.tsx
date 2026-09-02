"use client";

import { GraduationCap, BookOpen, Calendar } from "lucide-react";
import type { PortfolioData } from "@/lib/portfolio";
import type { UiText } from "@/lib/i18n";

interface AboutImmersiveProps {
  data: PortfolioData;
  ui: UiText;
}

export function AboutImmersive({ data, ui }: AboutImmersiveProps) {
  return (
    <section id="about" className="section-shell py-24 md:py-36">
      <div className="section-inner grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left Column: Editorial Statement & Narrative (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-teal-400">
              {ui.sections.about.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-[#f4f6f8] leading-tight">
              {data.about.title}
            </h2>
          </div>

          <p className="text-xl sm:text-2xl font-extralight text-slate-200 leading-relaxed">
            {data.about.body[0]}
          </p>

          <p className="text-sm sm:text-base font-light text-slate-400 leading-relaxed max-w-2xl">
            {data.about.body[1]}
          </p>
        </div>

        {/* Right Column: Technical Education Dossier (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-8 lg:border-l lg:border-white/10 lg:pl-10">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <GraduationCap className="h-5 w-5 text-teal-400" />
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-white/80 font-medium">
              {ui.sections.about.educationLabel}
            </span>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[10px] font-mono tracking-widest text-teal-400/70 uppercase">Institution</p>
              <h3 className="text-lg font-normal text-white mt-1">
                {data.about.education.school}
              </h3>
            </div>

            <div className="flex items-start gap-3">
              <BookOpen className="h-4 w-4 text-white/40 mt-1 shrink-0" />
              <div>
                <p className="text-[10px] font-mono tracking-widest text-white/40 uppercase">Degree & Field</p>
                <p className="text-sm font-light text-white/80 mt-0.5">
                  {data.about.education.major}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-white/40 mt-1 shrink-0" />
              <div>
                <p className="text-[10px] font-mono tracking-widest text-white/40 uppercase">Timeline</p>
                <p className="text-sm font-light text-white/80 mt-0.5">
                  {data.about.education.period}
                </p>
              </div>
            </div>

            {data.about.education.desc && (
              <p className="text-xs font-light text-slate-400 leading-relaxed border-t border-white/10 pt-4 mt-2">
                {data.about.education.desc}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
