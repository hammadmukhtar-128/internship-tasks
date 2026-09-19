import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export default function LoadingSpinner({ className, label = "Loading" }) {
  return (
    <div className={cn("flex items-center justify-center gap-2 py-10 text-brand-500", className)}>
      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
