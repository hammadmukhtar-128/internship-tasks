import { Link } from "react-router-dom";
import { ArrowRight, User } from "lucide-react";

const gradients = ["from-brand-400 to-brand-700", "from-brand-500 to-brand-800", "from-brand-300 to-brand-600"];

export default function PractitionerCard({ practitioner, index = 0 }) {
  const initials = practitioner.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl2 border border-brand-100 bg-white shadow-card transition-transform duration-300 hover:-translate-y-1">
      <div className={`flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br ${gradients[index % gradients.length]}`}>
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-white/15 font-display text-3xl text-white ring-4 ring-white/20">
          {initials || <User className="h-8 w-8" />}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl text-brand-950">{practitioner.name}</h3>
        <p className="mt-1 text-sm font-medium text-brand-600">{practitioner.specialization}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-600">{practitioner.shortBio}</p>
        <Link
          to={`/team/${practitioner.slug}`}
          className="focus-ring mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900"
        >
          View Profile <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
