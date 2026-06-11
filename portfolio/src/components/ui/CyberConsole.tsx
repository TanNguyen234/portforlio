"use client";

import React, { useState, useEffect, useRef } from "react";
import { Cpu, Activity, Layers, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { playClickSound } from "@/lib/audio";
import type { PortfolioData } from "@/lib/portfolio";
import type { UiText } from "@/lib/i18n";

interface CyberConsoleProps {
  data: PortfolioData;
  ui: UiText;
}

export default function CyberConsole({ data, ui }: CyberConsoleProps) {
  const [activeTab, setActiveTab] = useState<"mlops" | "langgraph">("mlops");
  
  // MLOps state
  const [cpuLoad, setCpuLoad] = useState(38);
  const [gpuLoad, setGpuLoad] = useState(54);
  const [rate, setRate] = useState(82.4);
  const [epoch, setEpoch] = useState(1);
  const [lossVal, setLossVal] = useState(0.85);

  // LangGraph nodes state
  const [activeNode, setActiveNode] = useState<string | null>(null);
  
  const mlopsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const langgraphIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // MLOps Real-time Simulation
  useEffect(() => {
    mlopsIntervalRef.current = setInterval(() => {
      setCpuLoad(prev => {
        const next = prev + (Math.random() > 0.5 ? 2 : -2);
        return Math.max(10, Math.min(95, next));
      });
      setGpuLoad(prev => {
        const next = prev + (Math.random() > 0.5 ? 4 : -4);
        return Math.max(15, Math.min(99, next));
      });
      setRate(prev => {
        const next = prev + (Math.random() > 0.5 ? 1.5 : -1.5);
        return Number(Math.max(60, Math.min(120, next)).toFixed(1));
      });
      setLossVal(prev => {
        const next = prev - 0.005;
        if (next < 0.05) {
          setEpoch(e => e + 1);
          return 0.95;
        }
        return Number(next.toFixed(3));
      });
    }, 1000);

    return () => {
      if (mlopsIntervalRef.current) clearInterval(mlopsIntervalRef.current);
    };
  }, []);

  // LangGraph Simulating Active Evaluation Path
  useEffect(() => {
    const sequence = ["start", "cv_parser", "market_RAG", "meta_evaluator", "optimizer", "end"];
    let idx = 0;
    
    langgraphIntervalRef.current = setInterval(() => {
      setActiveNode(sequence[idx]);
      idx = (idx + 1) % sequence.length;
    }, 2500);

    return () => {
      if (langgraphIntervalRef.current) clearInterval(langgraphIntervalRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-lg bg-[#07040f]/90 border border-[#00f0ff]/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.08)] font-mono text-xs select-none scanlines">
      {/* Header Bar */}
      <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#39ff14] cyber-status-led" />
          <span className="text-[#00f0ff] uppercase tracking-[0.15em] text-[10px]">
            SYSTEM_COCKPIT_HUD
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-white/30 text-[9px]">
          <span>FREQ: 5.4 GHz</span>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-white/10 bg-black/40">
        <button
          onClick={() => { setActiveTab("mlops"); playClickSound(); }}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition-all border-r border-white/5 ${
            activeTab === "mlops"
              ? "bg-[#ff007f]/10 text-[#ff007f] border-b-2 border-b-[#ff007f]"
              : "text-white/40 hover:text-white/80 hover:bg-white/5"
          }`}
          type="button"
        >
          <Activity className="h-3.5 w-3.5" />
          <span>MLOPS_MONITOR</span>
        </button>
        <button
          onClick={() => { setActiveTab("langgraph"); playClickSound(); }}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "langgraph"
              ? "bg-[#39ff14]/10 text-[#39ff14] border-b-2 border-b-[#39ff14]"
              : "text-white/40 hover:text-white/80 hover:bg-white/5"
          }`}
          type="button"
        >
          <Layers className="h-3.5 w-3.5" />
          <span>LANGGRAPH_MAP</span>
        </button>
      </div>

      {/* Console Tab Content */}
      <div className="h-[230px] p-4 overflow-y-auto bg-black/85 relative flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {activeTab === "mlops" && (
            <motion.div
              key="mlops"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex-1 flex flex-col gap-4"
            >
              {/* System load indicators */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-white/10 rounded p-2.5 bg-white/5">
                  <div className="flex justify-between text-[#00f0ff] mb-1">
                    <span>CPU_CORES</span>
                    <span>{cpuLoad}%</span>
                  </div>
                  <div className="w-full h-2 bg-black border border-white/10 rounded-sm overflow-hidden">
                    <div className="h-full bg-[#00f0ff] transition-all duration-300" style={{ width: `${cpuLoad}%` }} />
                  </div>
                </div>
                
                <div className="border border-white/10 rounded p-2.5 bg-white/5">
                  <div className="flex justify-between text-[#ff007f] mb-1">
                    <span>VRAM_GPU</span>
                    <span>{gpuLoad}%</span>
                  </div>
                  <div className="w-full h-2 bg-black border border-white/10 rounded-sm overflow-hidden">
                    <div className="h-full bg-[#ff007f] transition-all duration-300" style={{ width: `${gpuLoad}%` }} />
                  </div>
                </div>
              </div>

              {/* Loss Curve (XGBoost) and transaction flow rate */}
              <div className="grid grid-cols-5 gap-3 items-center flex-1">
                <div className="col-span-3 border border-white/10 rounded p-2.5 bg-white/5 h-full flex flex-col justify-between">
                  <div className="flex justify-between text-[10px] text-white/55">
                    <span>LOSS_CURVE (XGBOOST)</span>
                    <span className="text-[#39ff14]">EPOCH: {epoch}</span>
                  </div>
                  {/* Visual SVG chart */}
                  <svg className="w-full h-20 mt-1" viewBox="0 0 100 40">
                    <path
                      d={`M 0 35 Q 25 ${30 - lossVal * 10} 50 ${20 - lossVal * 12} 75 ${15 - lossVal * 15} 100 ${10 - lossVal * 8}`}
                      fill="none"
                      stroke="#39ff14"
                      strokeWidth="1.5"
                    />
                    {/* Grid line indicators */}
                    <line x1="0" y1="35" x2="100" y2="35" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 2" />
                    <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 2" />
                    {/* Pulsing point */}
                    <circle cx="100" cy={10 - lossVal * 8} r="2" fill="#ffffff" />
                  </svg>
                  <div className="flex justify-between text-[9px] text-[#39ff14]/80 mt-1 border-t border-white/5 pt-1">
                    <span>LOSS: {lossVal}</span>
                    <span>NOMINAL ACC: 99.83%</span>
                  </div>
                </div>

                <div className="col-span-2 flex flex-col gap-2 h-full justify-between">
                  <div className="border border-white/10 rounded p-2.5 bg-white/5 flex-1 flex flex-col justify-center">
                    <span className="text-[10px] text-white/55 uppercase">FLOW_RATE</span>
                    <span className="text-sm font-bold text-[#39ff14] my-0.5">{rate} t/s</span>
                    <span className="text-[8px] text-white/30">FRAUD: 0.17%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "langgraph" && (
            <motion.div
              key="langgraph"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex-1 flex flex-col justify-between"
            >
              <span className="text-[10px] text-white/55 mb-2">LANGGRAPH COORDINATION GRAPH</span>
              
              {/* Node graph flow map */}
              <div className="flex-1 flex items-center justify-around relative px-2 py-4">
                {/* Horizontal flow line */}
                <div className="absolute inset-x-8 h-px bg-white/10 z-0" />
                
                {/* Visual node bubbles */}
                <div className="flex flex-col items-center gap-1.5 z-10">
                  <div className={`h-8 w-8 rounded-full border flex items-center justify-center transition-all ${
                    activeNode === "cv_parser"
                      ? "border-[#00f0ff] bg-[#00f0ff]/20 shadow-[0_0_15px_#00f0ff]"
                      : "border-white/20 bg-black"
                  }`}>
                    <Cpu className={`h-4 w-4 ${activeNode === "cv_parser" ? "text-[#00f0ff]" : "text-white/40"}`} />
                  </div>
                  <span className="text-[8px] tracking-[0.05em] uppercase text-white/60">CV_PARSER</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 z-10">
                  <div className={`h-8 w-8 rounded-full border flex items-center justify-center transition-all ${
                    activeNode === "market_RAG"
                      ? "border-[#ff007f] bg-[#ff007f]/20 shadow-[0_0_15px_#ff007f]"
                      : "border-white/20 bg-black"
                  }`}>
                    <RefreshCw className={`h-3.5 w-3.5 ${activeNode === "market_RAG" ? "text-[#ff007f]" : "text-white/40"}`} />
                  </div>
                  <span className="text-[8px] tracking-[0.05em] uppercase text-white/60">RAG_TAVILY</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 z-10">
                  <div className={`h-8 w-8 rounded-full border flex items-center justify-center transition-all ${
                    activeNode === "meta_evaluator"
                      ? "border-[#39ff14] bg-[#39ff14]/20 shadow-[0_0_15px_#39ff14]"
                      : "border-white/20 bg-black"
                  }`}>
                    <Layers className={`h-4 w-4 ${activeNode === "meta_evaluator" ? "text-[#39ff14]" : "text-white/40"}`} />
                  </div>
                  <span className="text-[8px] tracking-[0.05em] uppercase text-white/60">META_EVAL</span>
                </div>
              </div>

              {/* Node description */}
              <div className="border border-white/10 rounded p-2.5 bg-white/5 mt-3 text-[10px] text-white/70">
                {activeNode === "cv_parser" && (
                  <p>
                    <span className="text-[#00f0ff] font-bold">Node 1: CV_PARSER</span> - Extracts and structures skills, experience history, and developer credentials into standardized JSON schemas.
                  </p>
                )}
                {activeNode === "market_RAG" && (
                  <p>
                    <span className="text-[#ff007f] font-bold">Node 2: RAG_TAVILY</span> - Fetches active developer market requirements dynamically via Tavily search vectors for context enrichment.
                  </p>
                )}
                {activeNode === "meta_evaluator" && (
                  <p>
                    <span className="text-[#39ff14] font-bold">Node 3: META_EVAL</span> - Employs dual-stage LLM validators (Gemini/Qwen) to enforce consistency and eliminate hallucinated credentials.
                  </p>
                )}
                {(!activeNode || activeNode === "start" || activeNode === "optimizer" || activeNode === "end") && (
                  <p className="text-white/45">
                    LangGraph multi-agent orchestration actively evaluating and matching CV against requirements.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
