import { Star } from "lucide-react";
import { cn } from "../../utils/cn";

export default function StarRating({ rating, className, size = 16 }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={i < rating ? "fill-amber-400 text-amber-400" : "fill-brand-100 text-brand-100"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
