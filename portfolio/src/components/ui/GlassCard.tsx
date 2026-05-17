export default function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass-card rounded-3xl p-6 md:p-8 ${className}`}>
      {children}
    </div>
  );
}
