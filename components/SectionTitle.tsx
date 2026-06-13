type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-[#d8b36d]">{eyebrow}</p>
        <h2 className="text-3xl font-semibold text-white">{title}</h2>
      </div>
      {description ? <p className="max-w-xl text-sm leading-7 text-zinc-400">{description}</p> : null}
    </div>
  );
}
