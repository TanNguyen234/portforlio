"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playKeyboardSound, playBootEndSound } from "@/lib/audio";

const LOGS = [
  "SYSTEM COGNITION BOOT INITIATED...",
  "ESTABLISHING SECURE PORTFOLIO CONNECTIVITY...",
  "LOADING AI AGENT COGNITIVE CORE... [OK]",
  "RETRIEVING FRAUD CLASSIFIER MODULES (XGBOOST)... [OK]",
  "OPTIMIZING PIPELINES FOR 0.17% TARGET CLASS... [OK]",
  "MOUNTING LANGGRAPH CONCURRENT DECISION NETWORKS... [OK]",
  "CONFIGURING ASYNC MONGODB ENGINE & SSE STREAMERS... [OK]",
  "DECRYPTING RESUME CREDENTIALS..."
];

export default function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let lineIdx = 0;
    let isCancelled = false;

    const printLine = () => {
      if (isCancelled) return;
      if (lineIdx < LOGS.length) {
        setVisibleLogs((prev) => [...prev, LOGS[lineIdx]]);
        playKeyboardSound();
        lineIdx++;
        setTimeout(printLine, 280);
      } else {
        startProgress();
      }
    };

    const startProgress = () => {
      let currentProgress = 0;
      const interval = setInterval(() => {
        if (isCancelled) {
          clearInterval(interval);
          return;
        }
        currentProgress += 5;
        setProgress(currentProgress);
        playKeyboardSound();

        if (currentProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (isCancelled) return;
            playBootEndSound();
            setIsFinished(true);
            setTimeout(onComplete, 600);
          }, 400);
        }
      }, 75);
    };

    playKeyboardSound();
    printLine();

    return () => {
      isCancelled = true;
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col justify-between bg-[#04020a] p-8 md:p-16 select-none font-mono text-xs md:text-sm scanlines"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between text-white/40 uppercase tracking-[0.2em] border-b border-white/10 pb-4">
            <span>COGNITIVE CORE BOOT LOAD v1.10.0</span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#39ff14] cyber-status-led" />
              SECURE CONNECTED
            </span>
          </div>

          {/* Terminal stream */}
          <div className="flex-1 flex flex-col justify-start gap-2 py-8 overflow-y-auto cyber-terminal-text scrollbar-none">
            {visibleLogs.map((log, index) => (
              <div key={index} className="flex gap-2 items-start">
                <span className="text-white/40">{`>`}</span>
                <span>{log}</span>
              </div>
            ))}

            {progress > 0 && (
              <div className="mt-6 flex flex-col gap-2">
                <div className="flex justify-between text-[#39ff14]/80">
                  <span>DECRYPTING DATA MATRIX:</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-4 border border-[#39ff14]/30 bg-black/40 p-0.5">
                  <div
                    className="h-full cyber-terminal-bar transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-white/30 uppercase tracking-[0.1em] flex justify-between border-t border-white/5 pt-4 text-[10px]">
            <span>LOC_IP: 127.0.0.1</span>
            <span>SYS_INIT: CORE_ACTIVE</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
