import { Sparkles, BookOpenCheck, Award, Building, UserCheck, CalendarClock } from "lucide-react";
import SectionHeading from "../common/SectionHeading";

const items = [
  { icon: Sparkles, title: "Personalised Treatment", description: "No two treatment plans look the same — yours is built around your goals." },
  { icon: BookOpenCheck, title: "Evidence-Based Approach", description: "Techniques grounded in current clinical research and best practice." },
  { icon: Award, title: "Experienced Practitioners", description: "A qualified team with experience across a wide range of conditions." },
  { icon: Building, title: "Modern Facilities", description: "A calm, comfortable space equipped for hands-on and exercise-based care." },
  { icon: UserCheck, title: "Patient-Centred Care", description: "We listen first, then build a plan — not the other way around." },
  { icon: CalendarClock, title: "Convenient Appointments", description: "Flexible scheduling that fits around work, family and life." },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-clinic">
        <SectionHeading eyebrow="Why Choose Us" title="Care that's considered, not generic" />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="rounded-xl2 border border-brand-100 bg-sand-50 p-7 transition-colors hover:bg-brand-50">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-700 shadow-sm">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg text-brand-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
