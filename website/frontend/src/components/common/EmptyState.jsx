import { Inbox } from "lucide-react";

export default function EmptyState({ icon: Icon = Inbox, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-200 bg-white/60 px-6 py-14 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-500">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <p className="font-medium text-brand-900">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm text-brand-600">{description}</p>}
    </div>
  );
}
