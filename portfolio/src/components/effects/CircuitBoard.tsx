"use client";

import { useEffect, useRef, useState } from "react";
import { usePerformanceMode } from "@/lib/performance";

type Node = {
  id: number;
  xPct: number;
  yPct: number;
  label: string;
};

type Trace = {
  fromNodeId: number;
  toNodeId: number;
  cornersPct: [number, number][]; // 45-degree corner steps
};

type Packet = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  traceIndex: number;
  segmentIndex: number;
  progress: number;
  speed: number;
  color: string;
};

export default function CircuitBoard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isLowEnd, reduceMotion } = usePerformanceMode();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [traces, setTraces] = useState<Trace[]>([]);
  const packetsRef = useRef<Packet[]>([]);

  useEffect(() => {
    // Generate board node graph layout relative to screen percentage
    const boardNodes: Node[] = [
      { id: 1, xPct: 8, yPct: 15, label: "SYS_BUS" },
      { id: 2, xPct: 22, yPct: 15, label: "MEM_CLK" },
      { id: 3, xPct: 15, yPct: 35, label: "CPU_CORE_0" },
      { id: 4, xPct: 35, yPct: 40, label: "GPU_SYS" },
      { id: 5, xPct: 45, yPct: 25, label: "IO_INT" },
      { id: 6, xPct: 90, yPct: 20, label: "NET_NODE_A" },
      { id: 7, xPct: 78, yPct: 45, label: "ML_DEC" },
      { id: 8, xPct: 92, yPct: 65, label: "ML_LOG" },
      { id: 9, xPct: 10, yPct: 75, label: "SEC_KEY" },
      { id: 10, xPct: 25, yPct: 85, label: "DB_SYNC" },
    ];

    const boardTraces: Trace[] = [
      { fromNodeId: 1, toNodeId: 2, cornersPct: [] },
      { fromNodeId: 1, toNodeId: 3, cornersPct: [[8, 25], [15, 30]] },
      { fromNodeId: 2, toNodeId: 3, cornersPct: [[22, 28], [15, 33]] },
      { fromNodeId: 3, toNodeId: 4, cornersPct: [[25, 35], [30, 40]] },
      { fromNodeId: 4, toNodeId: 5, cornersPct: [[40, 40], [45, 35]] },
      { fromNodeId: 6, toNodeId: 7, cornersPct: [[90, 35], [82, 41]] },
      { fromNodeId: 7, toNodeId: 8, cornersPct: [[85, 45], [92, 52]] },
      { fromNodeId: 9, toNodeId: 10, cornersPct: [[18, 75], [22, 85]] },
      { fromNodeId: 3, toNodeId: 9, cornersPct: [[15, 55], [10, 65]] },
      { fromNodeId: 5, toNodeId: 7, cornersPct: [[60, 25], [70, 40]] },
    ];

    setNodes(boardNodes);
    setTraces(boardTraces);
  }, []);

  useEffect(() => {
    if (isLowEnd || reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let rafId = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const getPixelCoords = (pctX: number, pctY: number) => {
      return {
        x: (pctX / 100) * width,
        y: (pctY / 100) * height,
      };
    };

    const triggerPulse = (nodeId: number) => {
      const fromNode = nodes.find((n) => n.id === nodeId);
      if (!fromNode) return;

      // Find all traces connected to this node
      traces.forEach((trace, idx) => {
        if (trace.fromNodeId === nodeId) {
          const fromPt = getPixelCoords(fromNode.xPct, fromNode.yPct);
          const firstTarget =
            trace.cornersPct.length > 0
              ? getPixelCoords(trace.cornersPct[0][0], trace.cornersPct[0][1])
              : getPixelCoords(
                  nodes.find((n) => n.id === trace.toNodeId)!.xPct,
                  nodes.find((n) => n.id === trace.toNodeId)!.yPct
                );

          packetsRef.current.push({
            x: fromPt.x,
            y: fromPt.y,
            targetX: firstTarget.x,
            targetY: firstTarget.y,
            traceIndex: idx,
            segmentIndex: 0,
            progress: 0,
            speed: 1.8 + Math.random() * 1.5,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue("--accent-current")
              .trim() || "#00f0ff",
          });
        }
      });
    };

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Detect click on node
      nodes.forEach((node) => {
        const pt = getPixelCoords(node.xPct, node.yPct);
        const dist = Math.hypot(pt.x - mouseX, pt.y - mouseY);
        if (dist < 28) {
          triggerPulse(node.id);
        }
      });
    };

    // Periodically trigger background automated data flow pulses
    const autoInterval = setInterval(() => {
      if (nodes.length > 0 && Math.random() < 0.6) {
        const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
        triggerPulse(randomNode.id);
      }
    }, 2800);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const accentColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--accent-current")
          .trim() || "#00f0ff";

      // 1. Draw circuit traces
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1.2;
      traces.forEach((trace) => {
        const fromNode = nodes.find((n) => n.id === trace.fromNodeId);
        const toNode = nodes.find((n) => n.id === trace.toNodeId);
        if (!fromNode || !toNode) return;

        ctx.beginPath();
        const start = getPixelCoords(fromNode.xPct, fromNode.yPct);
        ctx.moveTo(start.x, start.y);

        trace.cornersPct.forEach((c) => {
          const pt = getPixelCoords(c[0], c[1]);
          ctx.lineTo(pt.x, pt.y);
        });

        const end = getPixelCoords(toNode.xPct, toNode.yPct);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      });

      // 2. Draw nodes
      nodes.forEach((node) => {
        const pt = getPixelCoords(node.xPct, node.yPct);

        // Ambient pulse glow
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = 0.05;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 16 + Math.sin(performance.now() * 0.003) * 4, 0, Math.PI * 2);
        ctx.fill();

        // Inner circle
        ctx.globalAlpha = 0.22;
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
        ctx.stroke();

        // Small dot core
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Node ID or Code metadata
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = "#ffffff";
        ctx.font = "monospace 6px";
        ctx.fillText(node.label, pt.x + 8, pt.y + 2);
      });

      // 3. Move and draw pulses (packets)
      const packets = packetsRef.current;
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist < p.speed) {
          // Reached target point segment
          const trace = traces[p.traceIndex];
          const nextSegmentIdx = p.segmentIndex + 1;
          const totalSegments = trace.cornersPct.length + 1;

          if (nextSegmentIdx < totalSegments) {
            p.segmentIndex = nextSegmentIdx;
            const fromNode = nodes.find((n) => n.id === trace.fromNodeId)!;
            const toNode = nodes.find((n) => n.id === trace.toNodeId)!;
            
            let nextTarget;
            if (nextSegmentIdx < trace.cornersPct.length) {
              const cornerPct = trace.cornersPct[nextSegmentIdx];
              nextTarget = getPixelCoords(cornerPct[0], cornerPct[1]);
            } else {
              nextTarget = getPixelCoords(toNode.xPct, toNode.yPct);
            }

            p.x = p.targetX;
            p.y = p.targetY;
            p.targetX = nextTarget.x;
            p.targetY = nextTarget.y;
          } else {
            // Reached final node destination, destroy
            packets.splice(i, 1);
            continue;
          }
        } else {
          // Move towards current target
          p.x += (dx / dist) * p.speed;
          p.y += (dy / dist) * p.speed;
        }

        // Draw pulse particle with glow
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 12;
        ctx.shadowColor = accentColor;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Clear shadow settings for next iterations
        ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = 1.0;
      rafId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("click", handleCanvasClick);
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(autoInterval);
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", handleCanvasClick);
    };
  }, [nodes, traces, isLowEnd, reduceMotion]);

  if (isLowEnd || reduceMotion) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[-10] w-full h-full opacity-65"
      style={{ mixBlendMode: "screen" }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
