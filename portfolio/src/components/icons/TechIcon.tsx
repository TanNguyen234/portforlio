"use client";

import React from "react";
import {
  SiPython,
  SiFastapi,
  SiDocker,
  SiMongodb,
  SiQdrant,
  SiSupabase,
  SiSqlite,
  SiVercel,
  SiLangchain,
  SiHuggingface,
  SiPytorch,
  SiScikitlearn,
  SiGithubactions,
  SiLinux,
  SiJupyter,
  SiGooglecloud,
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiPandas,
  SiNumpy,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiNvidia,
} from "react-icons/si";
import { Cpu, Code, Brain, Sparkle, Broadcast } from "@phosphor-icons/react";

/**
 * Custom SVG vectors for specialized AI/ML tools missing in standard icon sets
 */
function PineconeIcon({ className = "h-3.5 w-3.5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M12 2L9.5 6.5H14.5L12 2Z" opacity="0.9" />
      <path d="M8 7.5L5.5 12H18.5L16 7.5H8Z" opacity="0.8" />
      <path d="M5 13L2.5 17.5H21.5L19 13H5Z" opacity="0.7" />
      <path d="M10.5 18.5H13.5V22H10.5V18.5Z" opacity="0.85" />
    </svg>
  );
}

function LangGraphIcon({ className = "h-3.5 w-3.5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="5" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
      <circle cx="19" cy="6" r="3" fill="currentColor" fillOpacity="0.2" />
      <circle cx="19" cy="18" r="3" fill="currentColor" fillOpacity="0.2" />
      <path d="M8 12h3m2-2l3-3m-3 7l3 3" />
    </svg>
  );
}

function XGBoostIcon({ className = "h-3.5 w-3.5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M4 4h4l4 7-4 9H4l4-9-4-7zm12 0h4l-4 7 4 9h-4l-4-9 4-7z" />
    </svg>
  );
}

function VertexAiIcon({ className = "h-3.5 w-3.5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M12 2L3 19.5h4.5l4.5-9 4.5 9H21L12 2zm0 6l2.8 5.5H9.2L12 8z" />
    </svg>
  );
}

interface TechIconProps {
  name?: string;
  label?: string;
  className?: string;
  size?: number;
}

/**
 * Universal TechIcon resolver: maps any technology name string to its official, high-fidelity SVG icon.
 */
export function TechIcon({ name, label, className = "h-3.5 w-3.5", size }: TechIconProps) {
  const norm = (name || label || "").trim().toLowerCase();

  // Python & Backends
  if (norm.includes("python")) return <SiPython className={className} size={size} />;
  if (norm.includes("fastapi")) return <SiFastapi className={className} size={size} />;
  if (norm.includes("docker")) return <SiDocker className={className} size={size} />;
  if (norm.includes("linux")) return <SiLinux className={className} size={size} />;
  if (norm.includes("vercel")) return <SiVercel className={className} size={size} />;

  // Vector DBs & Databases
  if (norm.includes("qdrant")) return <SiQdrant className={className} size={size} />;
  if (norm.includes("pinecone")) return <PineconeIcon className={className} />;
  if (norm.includes("supabase")) return <SiSupabase className={className} size={size} />;
  if (norm.includes("sqlite") || norm.includes("fts")) return <SiSqlite className={className} size={size} />;
  if (norm.includes("mongo")) return <SiMongodb className={className} size={size} />;
  if (norm.includes("postgres")) return <SiPostgresql className={className} size={size} />;

  // AI, LLMs & Orchestration
  if (norm.includes("langgraph")) return <LangGraphIcon className={className} />;
  if (norm.includes("langchain")) return <SiLangchain className={className} size={size} />;
  if (norm.includes("hugging")) return <SiHuggingface className={className} size={size} />;
  if (norm.includes("vertex") || norm.includes("gemini")) return <VertexAiIcon className={className} />;
  if (norm.includes("cloud") || norm.includes("gcp")) return <SiGooglecloud className={className} size={size} />;
  if (norm.includes("nvidia")) return <SiNvidia className={className} size={size} />;
  if (norm.includes("ragas") || norm.includes("eval")) return <Sparkle className={className} size={size} weight="duotone" />;
  if (norm.includes("llm") || norm.includes("nlp") || norm.includes("agent") || norm.includes("rag")) {
    return <Brain className={className} size={size} weight="duotone" />;
  }

  // Machine Learning & Data Science
  if (norm.includes("pytorch")) return <SiPytorch className={className} size={size} />;
  if (norm.includes("xgboost")) return <XGBoostIcon className={className} />;
  if (norm.includes("scikit") || norm.includes("sklearn")) return <SiScikitlearn className={className} size={size} />;
  if (norm.includes("pandas")) return <SiPandas className={className} size={size} />;
  if (norm.includes("numpy")) return <SiNumpy className={className} size={size} />;
  if (norm.includes("jupyter")) return <SiJupyter className={className} size={size} />;

  // Frontend & Tooling
  if (norm.includes("next")) return <SiNextdotjs className={className} size={size} />;
  if (norm.includes("react") && !norm.includes("icons")) return <SiReact className={className} size={size} />;
  if (norm.includes("typescript") || norm === "ts") return <SiTypescript className={className} size={size} />;
  if (norm.includes("tailwind")) return <SiTailwindcss className={className} size={size} />;
  if (norm.includes("github") || norm.includes("action") || norm.includes("ci/cd")) return <SiGithubactions className={className} size={size} />;
  if (norm.includes("git")) return <SiGit className={className} size={size} />;
  if (norm.includes("sse") || norm.includes("stream")) return <Broadcast className={className} size={size} weight="duotone" />;

  // General Fallback
  return <Cpu className={className} size={size} weight="duotone" />;
}

interface TechBadgeProps {
  name: string;
  className?: string;
  showIcon?: boolean;
}

/**
 * Premium TechBadge: A cyber-styled micro-capsule pairing authentic tech icon with monospace label.
 */
export function TechBadge({ name, className = "", showIcon = true }: TechBadgeProps) {
  return (
    <span
      className={`group/badge inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase text-white/75 bg-white/5 border border-white/10 hover:border-teal-400/40 hover:bg-teal-500/10 hover:text-white transition-all duration-200 rounded-none select-none ${className}`}
    >
      {showIcon && (
        <span className="text-teal-400/80 group-hover/badge:text-teal-300 transition-colors shrink-0">
          <TechIcon name={name} className="h-3 w-3" />
        </span>
      )}
      <span>{name}</span>
    </span>
  );
}

export default TechIcon;

