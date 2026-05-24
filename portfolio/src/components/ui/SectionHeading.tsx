import Reveal from "@/components/ui/Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--accent-current)]">
          {eyebrow}
        </p>
      </Reveal>
      <Reveal>
        <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl leading-tight text-white scroll-glitch-text">
          {title}
        </h2>
      </Reveal>
      {description ? (
        <Reveal>
          <p className="max-w-2xl text-base md:text-lg text-white/70">
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
