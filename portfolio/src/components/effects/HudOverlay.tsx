"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX, ShieldCheck, Cpu } from "lucide-react";
import { getMutedState, setMutedState, playClickSound } from "@/lib/audio";

export default function HudOverlay() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [scrollPercent, setScrollPercent] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(getMutedState());

    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scroll = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      setScrollPercent(Math.round(scroll));
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMute = () => {
    const nextMute = !muted;
    setMuted(nextMute);
    setMutedState(nextMute);
    if (!nextMute) {
      playClickSound();
    }
  };

  return (
    <>
      {/* HUD corner brackets */}
      <div className="pointer-events-none fixed inset-0 z-40">
        <div className="hud-border-bracket hud-border-tl" />
        <div className="hud-border-bracket hud-border-tr" />
        <div className="hud-border-bracket hud-border-bl" />
        <div className="hud-border-bracket hud-border-br" />
      </div>

      {/* Floating HUD status indicators */}
      <div className="fixed bottom-6 left-6 z-40 hidden flex-col gap-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-[color:var(--accent)]/55 select-none md:flex">
        <div className="flex items-center gap-1.5">
          <Cpu className="h-3 w-3 text-[color:var(--accent)]" />
          <span>GRID_COORD: X_{coords.x} Y_{coords.y}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3 w-3 text-[#39ff14]" />
          <span>SYS_STATUS: <span className="text-[#39ff14]">NOMINAL</span></span>
        </div>
      </div>

      {/* Right panel: Scroll progress & Audio controls */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-4 select-none font-mono text-[9px] uppercase tracking-[0.25em] text-[color:var(--accent)]/55">
        <div className="hidden items-center gap-1.5 md:flex">
          <span>INDEX_SECT: {scrollPercent}%</span>
        </div>
        <button
          onClick={toggleMute}
          className="flex items-center justify-center rounded-full border border-white/10 bg-black/40 p-2 text-white/60 backdrop-blur hover:border-[color:var(--accent)]/50 hover:text-white transition-colors cursor-pointer"
          title={muted ? "Unmute HUD Audio" : "Mute HUD Audio"}
          type="button"
        >
          {muted ? (
            <VolumeX className="h-3.5 w-3.5" />
          ) : (
            <Volume2 className="h-3.5 w-3.5 text-[color:var(--accent)]" />
          )}
        </button>
      </div>
    </>
  );
}
