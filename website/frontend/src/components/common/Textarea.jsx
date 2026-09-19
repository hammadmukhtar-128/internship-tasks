import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Textarea = forwardRef(({ label, error, id, className, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-brand-900">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-brand-950 placeholder:text-brand-400 focus-ring transition-colors",
          error ? "border-red-400" : "border-brand-200 focus:border-brand-500",
          className
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});
Textarea.displayName = "Textarea";
export default Textarea;
