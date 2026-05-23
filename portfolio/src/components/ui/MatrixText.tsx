"use client";

import { useEffect, useState, useRef } from "react";

const CYBER_GLYPHS = "01$#@%&*+=?///{}[];:<>~_⚡";

export default function MatrixText({
  text,
  className = "",
  delay = 0,
  triggerOnHover = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  triggerOnHover?: boolean;
}) {
  const [displayText, setDisplayText] = useState(text);
  const isScramblingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startScramble = () => {
    if (isScramblingRef.current) return;
    isScramblingRef.current = true;

    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(() =>
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return CYBER_GLYPHS[Math.floor(Math.random() * CYBER_GLYPHS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        isScramblingRef.current = false;
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      iteration += 1 / 3;
    }, 30);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      startScramble();
    }, delay * 1000);

    return () => {
      clearTimeout(timer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, delay]);

  const handleMouseEnter = () => {
    if (triggerOnHover) {
      startScramble();
    }
  };

  return (
    <span
      className={`font-mono ${className}`}
      onMouseEnter={handleMouseEnter}
    >
      {displayText}
    </span>
  );
}
