import { cn } from "../../utils/cn";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-brand-50 text-brand-700 border-brand-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  new: "bg-sky-50 text-sky-700 border-sky-200",
  read: "bg-slate-50 text-slate-600 border-slate-200",
  replied: "bg-emerald-50 text-emerald-700 border-emerald-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive: "bg-slate-50 text-slate-500 border-slate-200",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
        statusStyles[status] || "bg-slate-50 text-slate-600 border-slate-200"
      )}
    >
      {status}
    </span>
  );
}
