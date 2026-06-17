"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playKeyboardSound, playBootEndSound } from "@/lib/audio";

export default function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    let currentProgress = 0;

    const interval = setInterval(() => {
      if (isCancelled) {
        clearInterval(interval);
        return;
      }
      
      // Increment progress smoothly
      const increment = Math.floor(Math.random() * 8) + 4;
      currentProgress = Math.min(100, currentProgress + increment);
      setProgress(currentProgress);
      playKeyboardSound();

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (isCancelled) return;
          playBootEndSound();
          setIsFinished(true);
          setTimeout(onComplete, 800);
        }, 500);
      }
    }, 120);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020203] select-none p-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent pointer-events-none" />

          {/* Centered Minimal Counter */}
          <div className="text-center relative z-10 flex flex-col items-center">
            {/* Extremely thin elegant counter */}
            <motion.h1 
              className="font-sans font-extralight tracking-tighter text-[16vw] md:text-[10vw] text-white leading-none selection:bg-transparent"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {progress.toString().padStart(2, "0")}
            </motion.h1>

            {/* Micro progress line */}
            <div className="w-16 h-[1px] bg-white/10 mt-8 relative overflow-hidden">
              <motion.div 
                className="absolute top-0 bottom-0 left-0 bg-white/50"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "easeOut" }}
              />
            </div>

            {/* Elegant tiny subtitle */}
            <motion.p 
              className="text-[9px] font-mono tracking-[0.4em] text-white/30 uppercase mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Initializing Experience
            </motion.p>
          </div>

          {/* Bottom Branding */}
          <div className="absolute bottom-10 left-0 right-0 flex justify-center text-white/20 text-[9px] tracking-[0.3em] font-mono uppercase">
            Nguyen Thanh Duy Tan &copy; 2026
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
