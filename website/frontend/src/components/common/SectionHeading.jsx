import { cn } from "../../utils/cn";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  light = false,
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-sm font-semibold uppercase tracking-[0.18em]",
            light ? "text-brand-200" : "text-brand-500"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-3xl leading-tight sm:text-4xl",
          light ? "text-white" : "text-brand-950"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            light ? "text-brand-100" : "text-brand-700/80"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
