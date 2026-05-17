type IconName =
  | "code"
  | "api"
  | "graph"
  | "nodes"
  | "database"
  | "container"
  | "workflow"
  | "bolt"
  | "shield"
  | "grid";

const icons: Record<IconName, React.ReactNode> = {
  code: (
    <path d="M8 6L3 12l5 6M16 6l5 6-5 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  api: (
    <path d="M7 10h10M7 14h6M6 6h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  graph: (
    <path d="M5 17l4-6 4 3 6-8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  nodes: (
    <path d="M6 12a2 2 0 1 0 0.01 0Zm6-6a2 2 0 1 0 0.01 0Zm6 6a2 2 0 1 0 0.01 0ZM8 11l3-3m2 0 3 3m-6 4 3 3m2 0 3-3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  database: (
    <path d="M6 7c0-2.2 4-4 6-4s6 1.8 6 4-4 4-6 4-6-1.8-6-4Zm0 5c0 2.2 4 4 6 4s6-1.8 6-4m-12 5c0 2.2 4 4 6 4s6-1.8 6-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  container: (
    <path d="M3 7l9-4 9 4-9 4-9-4Zm0 4l9 4 9-4m-9 4v6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  workflow: (
    <path d="M6 5h4v4H6V5Zm8 10h4v4h-4v-4ZM10 7h4v4h-4V7Zm-2 6h4v4H8v-4Zm2-2 4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  bolt: (
    <path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
  ),
  shield: (
    <path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
  ),
  grid: (
    <path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
  ),
};

const mapLabelToIcon = (label: string): IconName => {
  const key = label.toLowerCase();
  if (key.includes("python")) return "code";
  if (key.includes("fastapi")) return "api";
  if (key.includes("langgraph")) return "graph";
  if (key.includes("langchain")) return "nodes";
  if (key.includes("llm")) return "grid";
  if (key.includes("xgboost")) return "bolt";
  if (key.includes("mongodb")) return "database";
  if (key.includes("docker")) return "container";
  if (key.includes("github")) return "workflow";
  if (key.includes("pytest")) return "shield";
  return "grid";
};

export default function TechIcon({ label }: { label: string }) {
  const icon = mapLabelToIcon(label);

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="icon-orbit-svg"
    >
      {icons[icon]}
    </svg>
  );
}
