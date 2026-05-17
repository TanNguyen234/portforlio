"use client";

export default function SpectrumSweep() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      <div className="spectrum-sweep" aria-hidden="true">
        <div className="sweep-core" />
        <div className="sweep-halo" />
      </div>
    </div>
  );
}
