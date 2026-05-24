"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Minimize2, Cpu, Settings, Activity, LayoutGrid } from "lucide-react";
import { playClickSound, playHoverSound } from "@/lib/audio";

type Widget = {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isOpen: boolean;
  isMinimized: boolean;
  type: "cpu" | "theme" | "logs";
};

export default function CyberWidgets() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [activeWidgetId, setActiveWidgetId] = useState<string | null>(null);
  const dragInfo = useRef<{ id: string; startX: number; startY: number; widgetStartX: number; widgetStartY: number } | null>(null);
  const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});

  useEffect(() => {
    // Positioning widgets in corners or side lanes
    setWidgets([
      {
        id: "widget-cpu",
        title: "SYS_CORE_MONITOR",
        x: 48,
        y: 110,
        width: 220,
        height: 140,
        isOpen: true,
        isMinimized: false,
        type: "cpu",
      },
      {
        id: "widget-theme",
        title: "ACCENT_CONTROLLER",
        x: 48,
        y: 280,
        width: 220,
        height: 130,
        isOpen: true,
        isMinimized: false,
        type: "theme",
      },
      {
        id: "widget-logs",
        title: "DIAGNOSTIC_FEED",
        x: 48,
        y: 440,
        width: 220,
        height: 160,
        isOpen: true,
        isMinimized: false,
        type: "logs",
      },
    ]);
  }, []);

  // CPU chart animation tick
  useEffect(() => {
    let rafId = 0;
    const tick = () => {
      widgets.forEach((w) => {
        if (w.type === "cpu" && w.isOpen && !w.isMinimized) {
          const canvas = canvasRefs.current[w.id];
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
              const width = canvas.width;
              const height = canvas.height;
              ctx.clearRect(0, 0, width, height);

              const accent = getComputedStyle(document.documentElement)
                .getPropertyValue("--accent-current")
                .trim() || "#00f0ff";

              // Draw Grid lines
              ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
              ctx.lineWidth = 0.5;
              for (let i = 0; i < width; i += 20) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, height);
                ctx.stroke();
              }
              for (let j = 0; j < height; j += 15) {
                ctx.beginPath();
                ctx.moveTo(0, j);
                ctx.lineTo(width, j);
                ctx.stroke();
              }

              // Draw sine wave graphs representing system cores loads
              ctx.lineWidth = 1.2;
              ctx.strokeStyle = accent;
              ctx.beginPath();
              const time = performance.now() * 0.003;
              for (let x = 0; x < width; x++) {
                const y = height / 2 + Math.sin(x * 0.04 + time) * 15 + Math.cos(x * 0.015 - time * 0.8) * 8;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.stroke();

              // Draw secondary memory graph line
              ctx.strokeStyle = "#ffe600";
              ctx.beginPath();
              for (let x = 0; x < width; x++) {
                const y = height / 2.2 + Math.cos(x * 0.03 - time * 0.7) * 12 + Math.sin(x * 0.01 + time * 1.2) * 5;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.stroke();
            }
          }
        }
      });
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [widgets]);

  const handleDragStart = (e: React.MouseEvent, id: string) => {
    const w = widgets.find((x) => x.id === id);
    if (!w) return;
    setActiveWidgetId(id);
    dragInfo.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      widgetStartX: w.x,
      widgetStartY: w.y,
    };
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragInfo.current) return;
      const { id, startX, startY, widgetStartX, widgetStartY } = dragInfo.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let nextX = widgetStartX + dx;
      let nextY = widgetStartY + dy;

      // Restrict widget to screen boundary
      const w = widgets.find((x) => x.id === id);
      if (w) {
        nextX = Math.max(8, Math.min(window.innerWidth - w.width - 8, nextX));
        nextY = Math.max(8, Math.min(window.innerHeight - w.height - 8, nextY));

        // Snapping boundary calculations
        if (nextX < 24) nextX = 8;
        if (window.innerWidth - nextX - w.width < 24) nextX = window.innerWidth - w.width - 8;
        if (nextY < 24) nextY = 8;

        setWidgets((prev) =>
          prev.map((item) => (item.id === id ? { ...item, x: nextX, y: nextY } : item))
        );
      }
    };

    const handleMouseUp = () => {
      dragInfo.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [widgets]);

  // Update Global Accent Color theme
  const updateGlobalAccent = (color: string) => {
    playClickSound();
    const root = document.documentElement;
    root.style.setProperty("--accent-current", color);
    
    // Extrapolate RGB coordinates for background glow layers
    const hex = color.replace("#", "").trim();
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      root.style.setProperty("--accent-glow", `rgba(${r}, ${g}, ${b}, 0.22)`);
    }
  };

  const closeWidget = (id: string) => {
    playClickSound();
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w)));
  };

  const toggleMinimize = (id: string) => {
    playClickSound();
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: !w.isMinimized } : w)));
  };

  const reopenWidget = (id: string) => {
    playClickSound();
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, isOpen: true, isMinimized: false } : w)));
  };

  return (
    <>
      {/* Recovery bar toggles */}
      <div className="fixed top-24 left-6 z-40 hidden flex-col gap-2 pointer-events-auto xl:flex">
        {widgets.map((w) => {
          if (w.isOpen) return null;
          return (
            <button
              key={w.id}
              onClick={() => reopenWidget(w.id)}
              onMouseEnter={playHoverSound}
              className="flex items-center gap-2 rounded border border-[color:var(--accent-current)]/30 bg-black/80 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-wider text-[color:var(--accent-current)] backdrop-blur transition hover:border-[color:var(--accent-current)]/90 hover:bg-[color:var(--accent-current)]/10 cursor-pointer"
            >
              <LayoutGrid className="h-3 w-3" />
              <span>ACTIVATE: {w.title}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active widgets */}
      {widgets.map((w) => {
        if (!w.isOpen) return null;

        const isCpu = w.type === "cpu";
        const isTheme = w.type === "theme";
        const isLogs = w.type === "logs";

        return (
          <div
            key={w.id}
            className={`fixed z-30 flex flex-col border border-white/10 bg-black/75 backdrop-blur-md shadow-2xl transition-all duration-75 select-none pointer-events-auto ${
              activeWidgetId === w.id ? "border-[color:var(--accent-current)]/40 z-35" : ""
            }`}
            style={{
              left: w.x,
              top: w.y,
              width: w.width,
              height: w.isMinimized ? "auto" : w.height,
              clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
            }}
            onClick={() => setActiveWidgetId(w.id)}
          >
            {/* Header drag bar */}
            <div
              className="flex items-center justify-between border-b border-white/5 bg-white/5 px-3 py-1.5 cursor-move"
              onMouseDown={(e) => handleDragStart(e, w.id)}
            >
              <div className="flex items-center gap-1.5 font-mono text-[8px] font-semibold tracking-widest text-white/70">
                {isCpu && <Activity className="h-3 w-3 text-[color:var(--accent-current)]" />}
                {isTheme && <Settings className="h-3 w-3 text-[#ffe600]" />}
                {isLogs && <Cpu className="h-3 w-3 text-[#39ff14]" />}
                <span>{w.title}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleMinimize(w.id)}
                  className="text-white/40 hover:text-white transition-colors cursor-pointer"
                  title="Minimize"
                >
                  <Minimize2 className="h-3 w-3" />
                </button>
                <button
                  onClick={() => closeWidget(w.id)}
                  className="text-white/40 hover:text-red-500 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Widget View Body */}
            {!w.isMinimized && (
              <div className="flex-1 p-2.5 font-mono text-[9px] leading-relaxed text-white/60">
                {/* 1. CPU Wave Monitor */}
                {isCpu && (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-[7px] text-white/40">
                      <span>CORE_0: STABLE</span>
                      <span>MEM_ALLOC: 44.2%</span>
                    </div>
                    <canvas
                      ref={(el) => {
                        canvasRefs.current[w.id] = el;
                      }}
                      className="border border-white/5 bg-black/60 rounded"
                      height={90}
                      width={w.width - 22}
                    />
                  </div>
                )}

                {/* 2. Cyberpunk Accent Theme Controller */}
                {isTheme && (
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[7.5px] text-white/40 uppercase tracking-wider">Select active node node color:</span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[
                        { hex: "#00f0ff", label: "CYAN" },
                        { hex: "#ff007f", label: "PINK" },
                        { hex: "#bc13fe", label: "PURP" },
                        { hex: "#39ff14", label: "LIME" },
                        { hex: "#ffe600", label: "YLW" },
                      ].map((color) => (
                        <button
                          key={color.hex}
                          onClick={() => updateGlobalAccent(color.hex)}
                          onMouseEnter={playHoverSound}
                          className="flex flex-col items-center gap-1 p-1 rounded border border-white/5 bg-white/5 hover:border-white/20 transition cursor-pointer"
                        >
                          <div
                            className="h-4 w-full rounded"
                            style={{ backgroundColor: color.hex, boxShadow: `0 0 6px ${color.hex}` }}
                          />
                          <span className="text-[6.5px] font-semibold text-white/50">{color.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Rolling diagnostic feed */}
                {isLogs && (
                  <div className="flex flex-col gap-1 overflow-hidden h-[120px] select-text">
                    <div className="text-[7.5px] text-white/30 border-b border-white/5 pb-1 flex justify-between">
                      <span>STREAMING_LOGS</span>
                      <span className="text-[#39ff14] cyber-status-led">● ONLINE</span>
                    </div>
                    <div className="flex flex-col gap-1 text-[8px] font-mono text-white/50 leading-relaxed py-1 scrollbar-none overflow-y-auto h-full">
                      <div className="text-[#39ff14]">[INF] SEC_MODULE: LOCKED</div>
                      <div className="text-white/40">[SYS] STACK_INTEGRITY: 1.00</div>
                      <div className="text-[#ffe600]">[WRN] PORT_443: PENDING</div>
                      <div className="text-white/40">[SYS] LLM_ROUTER: STANDBY</div>
                      <div className="text-[#ff007f]">[ERR] DB_TIMEOUT: RETRYING</div>
                      <div className="text-[#39ff14]">[INF] HEURISTIC_OK: TRUE</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
