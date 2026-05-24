"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal as TermIcon, X, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { playClickSound, playKeyboardSound } from "@/lib/audio";

const COMMANDS = {
  help: [
    "AVAILABLE SYSTEM COMMANDS:",
    "  help     - DISPLAY THIS DIRECTIVE DIRECTORY",
    "  skills   - QUERY ACTIVE COGNITIVE SKILL VECTOR",
    "  hack     - LOAD MATRIX DECRYPTION BRUTEFORCE PROTOCOL",
    "  clear    - PURGE SHELL HISTORY BUFFER"
  ],
  skills: [
    "QUERYING ACTIVE SKILLS MATRIX...",
    "  > LARGE LANGUAGE MODELS & RAG SEED: [ACTIVE]",
    "  > LANGGRAPH MULTI-AGENT STATE-GRAPHS: [NOMINAL]",
    "  > XGBOOST BINARY FRAUD CLASSIFIERS: [RESOLVED]",
    "  > DOCKERized CI/CD MLOps PIPELINES: [DEPLOYED]",
    "  > FASTAPI ASYNC BACKENDS WITH SSE: [ONLINE]"
  ]
};

const MATRIX_GLYPHS = "01$#@%&*+=?///{}[];:<>~_⚡";

export default function HackingTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "SYS_SHELL v1.10.0 ACTIVE",
    "ESTABLISHING CONTEXT ENVELOPE...",
    "TYPE 'help' OR USE UTILITY BUTTONS BELOW."
  ]);
  const [matrixActive, setMatrixActive] = useState(false);
  const [matrixText, setMatrixText] = useState<string>("");
  const logEndRef = useRef<HTMLDivElement>(null);
  const matrixIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, matrixActive]);

  const addLogs = (newLines: string[]) => {
    setLogs((prev) => [...prev, ...newLines]);
    playKeyboardSound();
  };

  const handleCommand = (cmd: "help" | "skills" | "clear" | "hack") => {
    playClickSound();
    
    if (cmd === "clear") {
      setLogs([]);
      setMatrixActive(false);
      return;
    }

    if (cmd === "hack") {
      setMatrixActive(true);
      addLogs(["INITIATING DECRYPTION BRUTEFORCE...", "STREAMING DECRYPT DIRECTIVES..."]);
      startMatrixRain();
      return;
    }

    setMatrixActive(false);
    addLogs([`> executing: ${cmd}`, ...COMMANDS[cmd]]);
  };

  const startMatrixRain = () => {
    if (matrixIntervalRef.current) clearInterval(matrixIntervalRef.current);
    
    let ticks = 0;
    matrixIntervalRef.current = setInterval(() => {
      ticks++;
      const line = Array.from({ length: 4 }, () => {
        const stream = Array.from({ length: 18 }, () => 
          MATRIX_GLYPHS[Math.floor(Math.random() * MATRIX_GLYPHS.length)]
        ).join(" ");
        return stream;
      }).join("\n");

      setMatrixText(line);
      playKeyboardSound();

      if (ticks > 25) {
        if (matrixIntervalRef.current) clearInterval(matrixIntervalRef.current);
        setMatrixActive(false);
        setLogs((prev) => [
          ...prev, 
          "DECRYPTION MATRIX DECOY COMPLETED.", 
          "ACCESS DENIED: SECURE REDIRECT INITIATED."
        ]);
      }
    }, 120);
  };

  useEffect(() => {
    return () => {
      if (matrixIntervalRef.current) clearInterval(matrixIntervalRef.current);
    };
  }, []);

  return (
    <>
      {/* Pinned Side Tab Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          playClickSound();
        }}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-black/85 border border-l-0 border-[color:var(--accent-current)]/30 rounded-r-2xl px-2.5 py-5 flex flex-col items-center gap-1.5 hover:bg-[color:var(--accent-current)]/10 hover:border-[color:var(--accent-current)]/85 text-white/70 hover:text-white transition-all cursor-pointer shadow-[2px_0_15px_rgba(0,0,0,0.5)]"
        title="Open System Shell"
        type="button"
      >
        <TermIcon className="h-4 w-4 text-[color:var(--accent-current)] animate-pulse" />
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] [writing-mode:vertical-lr] mt-1 select-none">
          SYS_SHELL
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed left-0 top-[15vh] bottom-[15vh] z-50 w-[88vw] sm:w-[380px] bg-black/95 border border-l-0 border-white/10 shadow-[12px_0_40px_rgba(0,0,0,0.9)] flex flex-col rounded-r-2xl overflow-hidden scanlines"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Title Bar */}
            <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center justify-between text-xs select-none font-mono">
              <span className="text-white/60 tracking-[0.1em] flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#39ff14] cyber-status-led" />
                SHELL@DUY_TAN_AI
              </span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  playClickSound();
                }}
                className="text-white/40 hover:text-white transition-colors cursor-pointer"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable logs */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-[10px] leading-4 text-[#39ff14] select-text scrollbar-thin">
              {logs.map((line, idx) => (
                <div key={idx} className="flex gap-2 items-start whitespace-pre-wrap">
                  <span className="text-white/30">{`>`}</span>
                  <span>{line}</span>
                </div>
              ))}

              {matrixActive && (
                <div className="mt-4 text-[#39ff14]/75 font-mono text-[9px] leading-3 whitespace-pre border-t border-b border-[#39ff14]/20 py-2 select-none animate-pulse">
                  {matrixText}
                </div>
              )}
              <div ref={logEndRef} />
            </div>

            {/* Utility control keys */}
            <div className="bg-white/5 border-t border-white/10 p-3 flex flex-wrap gap-2 justify-center select-none font-mono text-[9px]">
              <button
                onClick={() => handleCommand("help")}
                className="px-2.5 py-1.5 border border-[#39ff14]/30 text-[#39ff14] bg-transparent hover:bg-[#39ff14]/15 rounded transition-all cursor-pointer"
                type="button"
              >
                HELP
              </button>
              <button
                onClick={() => handleCommand("skills")}
                className="px-2.5 py-1.5 border border-[#39ff14]/30 text-[#39ff14] bg-transparent hover:bg-[#39ff14]/15 rounded transition-all cursor-pointer"
                type="button"
              >
                SKILLS
              </button>
              <button
                onClick={() => handleCommand("hack")}
                className="px-2.5 py-1.5 border border-[#ff0055]/30 text-[#ff0055] bg-transparent hover:bg-[#ff0055]/15 rounded transition-all flex items-center gap-1 cursor-pointer animate-pulse"
                type="button"
              >
                <ShieldAlert className="h-3 w-3" />
                HACK
              </button>
              <button
                onClick={() => handleCommand("clear")}
                className="px-2.5 py-1.5 border border-white/20 text-white/60 bg-transparent hover:bg-white/10 rounded transition-all cursor-pointer"
                type="button"
              >
                CLEAR
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
