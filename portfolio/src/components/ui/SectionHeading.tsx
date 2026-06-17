import Reveal from "@/components/ui/Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      {eyebrow ? (
        <Reveal>
          <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/40">
            {eyebrow}
          </p>
        </Reveal>
      ) : null}
      <Reveal>
        <h2 className="font-sans font-light text-3xl md:text-5xl leading-tight text-white select-none">
          {title}
        </h2>
      </Reveal>
      {description ? (
        <Reveal>
          <p className="max-w-2xl text-sm md:text-base font-light text-white/50 leading-relaxed">
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
