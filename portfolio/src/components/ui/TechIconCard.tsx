"use client";

import TechIcon from "@/components/icons/TechIcon";
import ThreeDCard from "@/components/ui/ThreeDCard";

export default function TechIconCard({ label }: { label: string }) {
  return (
    <ThreeDCard className="icon-orbit">
      <div className="icon-orbit-inner">
        <TechIcon label={label} />
        <span className="icon-orbit-label">{label}</span>
      </div>
    </ThreeDCard>
  );
}

