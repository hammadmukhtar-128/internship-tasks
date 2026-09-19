import { Link } from "react-router-dom";
import { ArrowRight, Activity, Bone, Trophy, AlignVerticalJustifyCenter, Dumbbell, HeartPulse, Target, Briefcase } from "lucide-react";

const iconMap = {
  physiotherapy: Activity,
  "chiropractic-care": Bone,
  "sports-injury-rehabilitation": Trophy,
  "back-neck-pain": AlignVerticalJustifyCenter,
  "exercise-rehabilitation": Dumbbell,
  "post-surgery-rehabilitation": HeartPulse,
  "dry-needling": Target,
  "workplace-injury-rehabilitation": Briefcase,
};

export default function ServiceCard({ service, compact = false }) {
  const Icon = iconMap[service.slug] || Activity;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl2 border border-brand-100 bg-white shadow-card transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <img
          src={service.image}
          alt={`${service.name} treatment session`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-brand-700 shadow-sm">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl text-brand-950">{service.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-600">{service.shortDescription}</p>
        {!compact && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-brand-500">{service.duration}</span>
            <span className="font-medium text-brand-800">{service.price}</span>
          </div>
        )}
        <Link
          to={`/services/${service.slug}`}
          className="focus-ring mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900"
        >
          Learn More <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
