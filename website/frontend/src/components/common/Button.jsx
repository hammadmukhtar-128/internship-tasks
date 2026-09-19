import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-ring disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const variants = {
  primary: "bg-brand-700 text-white hover:bg-brand-800 shadow-soft",
  secondary: "bg-white text-brand-800 border border-brand-200 hover:bg-brand-50",
  outline: "bg-transparent text-white border border-white/70 hover:bg-white/10",
  ghost: "bg-transparent text-brand-700 hover:bg-brand-50",
};

const sizes = {
  sm: "text-sm px-4 py-2",
  md: "text-sm sm:text-base px-5 py-2.5",
  lg: "text-base px-7 py-3.5",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  to,
  href,
  ...props
}) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
