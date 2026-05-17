"use client";

import { motion } from "framer-motion";
import TechIcon from "@/components/icons/TechIcon";

export default function TechIconCard({ label }: { label: string }) {
  return (
    <motion.div
      className="icon-orbit"
      whileHover={{ rotateX: -8, rotateY: 12, y: -6 }}
      transition={{ type: "spring", stiffness: 120, damping: 12 }}
    >
      <div className="icon-orbit-inner">
        <TechIcon label={label} />
        <span className="icon-orbit-label">{label}</span>
      </div>
    </motion.div>
  );
}
