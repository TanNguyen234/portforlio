"use client";

import { motion } from "framer-motion";

export default function AnimatedText({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");

  return (
    <span className={`inline-flex flex-wrap gap-2 ${className}`}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: delay + index * 0.06,
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
