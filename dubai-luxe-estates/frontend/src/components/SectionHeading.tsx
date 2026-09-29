export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={`mb-14 ${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-ink md:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-ink/60">{description}</p>}
    </div>
  );
}
