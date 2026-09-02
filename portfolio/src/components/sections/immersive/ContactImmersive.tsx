"use client";

import { Mail, Phone, MapPin, Download, ArrowUpRight } from "lucide-react";
import { Github, Linkedin } from "@/components/icons/BrandIcons";
import type { PortfolioData } from "@/lib/portfolio";
import type { UiText } from "@/lib/i18n";

interface ContactImmersiveProps {
  data: PortfolioData;
  ui: UiText;
}

export function ContactImmersive({ data, ui }: ContactImmersiveProps) {
  return (
    <section id="contact" className="section-shell py-28 md:py-40">
      <div className="section-inner flex flex-col gap-16">
        {/* Section Header */}
        <div className="flex flex-col gap-4 max-w-4xl">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-teal-400">
            {ui.sections.contact.eyebrow}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-[#f4f6f8] leading-tight">
            {ui.sections.contact.title}
          </h2>
          <p className="text-base sm:text-lg font-light text-slate-400 leading-relaxed max-w-2xl">
            {ui.sections.contact.description}
          </p>
        </div>

        {/* Structured Metadata & Actions Frame */}
        <div className="border-t border-white/10 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono tracking-widest uppercase text-teal-400/80 flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Location</span>
                </span>
                <span className="text-sm font-light text-white">
                  {data.contact.location}
                </span>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono tracking-widest uppercase text-teal-400/80 flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  <span>Email</span>
                </span>
                <a
                  href={`mailto:${data.contact.email}`}
                  className="text-sm font-light text-white hover:text-teal-300 transition-colors focus-ring-immersive rounded-sm"
                >
                  {data.contact.email}
                </a>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono tracking-widest uppercase text-teal-400/80 flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  <span>Phone</span>
                </span>
                <span className="text-sm font-light text-white">
                  {data.contact.phone}
                </span>
              </div>

              {/* Social Channels */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono tracking-widest uppercase text-teal-400/80">
                  Channels
                </span>
                <div className="flex items-center gap-6 pt-1">
                  <a
                    href={data.contact.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-white/80 hover:text-white transition-colors focus-ring-immersive rounded-sm"
                    aria-label="GitHub Profile"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>GitHub</span>
                    <ArrowUpRight className="h-3 w-3 opacity-60" />
                  </a>
                  {data.contact.linkedin && (
                    <a
                      href={data.contact.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-white/80 hover:text-white transition-colors focus-ring-immersive rounded-sm"
                      aria-label="LinkedIn Profile"
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                      <span>LinkedIn</span>
                      <ArrowUpRight className="h-3 w-3 opacity-60" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Direct Actions (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4 lg:border-l lg:border-white/10 lg:pl-10">
            <a
              href={`mailto:${data.contact.email}`}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-black font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all focus-ring-immersive rounded-sm shadow-[0_0_24px_rgba(20,184,166,0.3)]"
            >
              <Mail className="h-4 w-4" />
              <span>Send Message</span>
            </a>

            {data.contact.cv && (
              <a
                href={data.contact.cv}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-[0.2em] transition-all focus-ring-immersive rounded-sm"
              >
                <Download className="h-4 w-4 text-teal-400" />
                <span>{ui.contact.cv}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
