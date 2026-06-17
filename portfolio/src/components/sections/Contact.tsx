"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import MagneticButton from "@/components/ui/MagneticButton";
import SectionHeading from "@/components/ui/SectionHeading";
import { Mail, Phone, MapPin, Download, ArrowUpRight } from "lucide-react";
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
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
      );

      tl.fromTo(
        ".contact-item",
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out", stagger: 0.08 },
        "-=0.4"
      );

      tl.fromTo(
        ".contact-btn",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.1 },
        "-=0.3"
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} id="contact" className="section-shell">
      <div className="section-inner flex flex-col gap-16">
        
        <div className="text-center flex flex-col items-center">
          <SectionHeading
            eyebrow={ui.sections.contact.eyebrow}
            title={ui.sections.contact.title}
            description={ui.sections.contact.description}
          />
        </div>

        {/* Double-Bezel Glass Console (Centered) */}
        <div className="contact-card opacity-0 max-w-3xl w-full mx-auto">
          <div className="double-bezel-outer">
            <div className="double-bezel-inner relative overflow-hidden flex flex-col md:flex-row gap-8 justify-between p-8 sm:p-10 bg-[#0a0a0c]/80 backdrop-blur-2xl">
              
              {/* Decorative Glow */}
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-500/[0.03] rounded-full blur-3xl pointer-events-none" />

              {/* Left Side: Contact Information */}
              <div className="flex-1 flex flex-col gap-5 text-xs font-light text-white/50 relative z-10 justify-center">
                
                <div className="contact-item flex items-center gap-3.5 opacity-0">
                  <div className="p-2 rounded-full bg-white/5 border border-white/10 text-white/40">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span>{data.contact.location}</span>
                </div>

                <div className="contact-item flex items-center gap-3.5 opacity-0">
                  <div className="p-2 rounded-full bg-white/5 border border-white/10 text-white/40">
                    <Mail className="h-4 w-4" />
                  </div>
                  <a href={`mailto:${data.contact.email}`} className="hover:text-white transition-colors">{data.contact.email}</a>
                </div>

                <div className="contact-item flex items-center gap-3.5 opacity-0">
                  <div className="p-2 rounded-full bg-white/5 border border-white/10 text-white/40">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span>{data.contact.phone}</span>
                </div>

                <div className="contact-item flex items-center gap-3.5 opacity-0 border-t border-white/5 pt-4 mt-2">
                  <a
                    href={data.contact.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-all hover:translate-x-0.5"
                  >
                    <Github className="h-4 w-4" />
                    <span className="font-mono tracking-wider">Github</span>
                    <ArrowUpRight className="h-3 w-3 opacity-50" />
                  </a>
                  {data.contact.linkedin && (
                    <a
                      href={data.contact.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-all hover:translate-x-0.5 ml-6"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="font-mono tracking-wider">LinkedIn</span>
                      <ArrowUpRight className="h-3 w-3 opacity-50" />
                    </a>
                  )}
                </div>

              </div>

              {/* Right Side: Interactive Buttons */}
              <div className="flex flex-col gap-4 justify-center relative z-10 md:border-l md:border-white/5 md:pl-10">
                
                <div className="contact-btn opacity-0">
                  <MagneticButton
                    className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-white/10 bg-white/5 hover:bg-white/10 rounded-full transition-all text-[11px] font-mono tracking-widest uppercase text-white shadow-md"
                    href={`mailto:${data.contact.email}`}
                  >
                    <Mail className="h-4 w-4 text-white/70" />
                    <span>Send Message</span>
                  </MagneticButton>
                </div>

                {data.contact.cv && (
                  <div className="contact-btn opacity-0">
                    <MagneticButton
                      className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-white/5 bg-transparent hover:bg-white/5 rounded-full transition-all text-[11px] font-mono tracking-widest uppercase text-white/70 hover:text-white"
                      href={data.contact.cv}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Download className="h-4 w-4 text-white/40" />
                      <span>{ui.contact.cv}</span>
                    </MagneticButton>
                  </div>
                )}

              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
